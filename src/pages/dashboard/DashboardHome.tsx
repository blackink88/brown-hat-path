import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getSkillLevelsFromCourseProgress } from "@/lib/courseSkillAlignment";
import { CareerAlignmentPanel } from "@/components/dashboard/CareerAlignmentPanel";
import { CertificatesPanel } from "@/components/dashboard/CertificatesPanel";

type StageStatus = "completed" | "current" | "locked";

const STAGE_DEFS: { id: string; title: string; subtitle: string; level: number }[] = [
  { id: "bridge", title: "Bridge", subtitle: "Technical Readiness", level: 0 },
  { id: "foundations", title: "Foundations", subtitle: "Core Concepts", level: 1 },
  { id: "core", title: "Core Cyber", subtitle: "Blue Team / GRC", level: 2 },
  { id: "specialist", title: "Specialist", subtitle: "Advanced Tracks", level: 3 },
];

type EnrolledCourse = { id: string; code: string; title: string; level: number; progress: number };

function useStreak(userId: string | undefined) {
  return useQuery({
    queryKey: ["streak", userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data, error } = await supabase
        .from("user_progress")
        .select("completed_at")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null);
      if (error) throw error;
      const dates = new Set(
        (data ?? []).map((p) => p.completed_at!.slice(0, 10))
      );
      const sorted = Array.from(dates).sort().reverse();
      if (sorted.length === 0) return 0;
      let streak = 0;
      const check = new Date();
      for (let i = 0; i < sorted.length; i++) {
        const expected = check.toISOString().slice(0, 10);
        if (sorted[i] !== expected) break;
        streak++;
        check.setDate(check.getDate() - 1);
      }
      return streak;
    },
    enabled: !!userId,
  });
}

export default function DashboardHome() {
  const { user } = useAuth();

  const { data: enrollmentsWithCourses, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["dashboardEnrollments", user?.id],
    queryFn: async () => {
      const { data: enrollments, error: eErr } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", user!.id);
      if (eErr) throw eErr;
      const courseIds = (enrollments ?? []).map((e) => e.course_id);
      if (courseIds.length === 0) return [];
      const { data: courses, error: cErr } = await supabase
        .from("courses")
        .select("id, code, title, level")
        .in("id", courseIds)
        .order("order_index");
      if (cErr) throw cErr;
      return (courses ?? []) as { id: string; code: string; title: string; level: number }[];
    },
    enabled: !!user?.id,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user!.id)
        .eq("completed", true);
      if (error) throw error;
      return new Set((data ?? []).map((p) => p.lesson_id));
    },
    enabled: !!user?.id,
  });

  const { data: lessonCourseMap } = useQuery({
    queryKey: ["lessonCourseMap"],
    queryFn: async () => {
      const { data: modules, error: modErr } = await supabase.from("modules").select("id, course_id");
      if (modErr) throw modErr;
      const { data: lessons, error: lessErr } = await supabase.from("lessons").select("id, module_id");
      if (lessErr) throw lessErr;
      const moduleToCourse = new Map((modules ?? []).map((m) => [m.id, m.course_id]));
      const map: Record<string, string> = {};
      (lessons ?? []).forEach((l) => {
        const cid = moduleToCourse.get(l.module_id);
        if (cid) map[l.id] = cid;
      });
      return map;
    },
  });

  const { data: userTierLevel = 0 } = useQuery({
    queryKey: ["userTierLevel", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_tier_level", {
        _user_id: user!.id,
      });
      if (error) throw error;
      return typeof data === "number" ? data : 0;
    },
    enabled: !!user?.id,
  });

  const { data: streak = 0 } = useStreak(user?.id);

  const courseProgressList = useMemo((): EnrolledCourse[] => {
    if (!enrollmentsWithCourses?.length || !lessonCourseMap) return [];
    const progressSet = userProgress instanceof Set ? userProgress : new Set<string>();
    return enrollmentsWithCourses.map((c) => {
      let total = 0;
      let completed = 0;
      Object.entries(lessonCourseMap).forEach(([lessonId, courseId]) => {
        if (courseId === c.id) {
          total += 1;
          if (progressSet.has(lessonId)) completed += 1;
        }
      });
      return {
        id: c.id,
        code: c.code,
        title: c.title,
        level: c.level,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [enrollmentsWithCourses, lessonCourseMap, userProgress]);

  const learningPathStages = useMemo(() => {
    const progressByLevel: Record<number, { total: number; completed: number }> = {};
    STAGE_DEFS.forEach((s) => {
      progressByLevel[s.level] = { total: 0, completed: 0 };
    });
    courseProgressList.forEach((c) => {
      const level = c.level <= 3 ? c.level : 3;
      if (!progressByLevel[level]) return;
      const totalLessons = Object.values(lessonCourseMap ?? {}).filter((cid) => cid === c.id).length;
      const completedLessons = totalLessons > 0 ? Math.round((c.progress / 100) * totalLessons) : 0;
      progressByLevel[level].total += totalLessons;
      progressByLevel[level].completed += completedLessons;
    });
    let foundCurrent = false;
    return STAGE_DEFS.map((def): { id: string; title: string; subtitle: string; level: number; status: StageStatus; progress: number } => {
      const { total, completed } = progressByLevel[def.level] ?? { total: 0, completed: 0 };
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      const status: StageStatus =
        progress >= 100
          ? "completed"
          : !foundCurrent
            ? ((foundCurrent = true), "current")
            : "locked";
      return {
        ...def,
        status,
        progress,
      };
    });
  }, [courseProgressList, lessonCourseMap]);

  const continueLearningCourse: EnrolledCourse | null =
    courseProgressList.length && courseProgressList.some((c) => c.progress < 100)
      ? courseProgressList.find((c) => c.progress < 100) ?? courseProgressList[0] ?? null
      : courseProgressList[0] ?? null;

  const lessonsCompleted = userProgress?.size ?? 0;
  const coursesEnrolled = enrollmentsWithCourses?.length ?? 0;

  const { data: skillsUnlocked = 0 } = useQuery({
    queryKey: ["dashboardSkillsUnlocked", user?.id, userProgress?.size],
    queryFn: async () => {
      if (!courseProgressList.length) return 0;
      const { data: skillRows } = await supabase.from("skills").select("name").order("name");
      const skillNames = (skillRows ?? []).map((s) => s.name);
      const courseProgress = courseProgressList.map((c) => ({ code: c.code, progress: c.progress }));
      const levels = getSkillLevelsFromCourseProgress(courseProgress, skillNames);
      return Object.values(levels).filter((v) => v >= 50).length;
    },
    enabled: !!user?.id && courseProgressList.length > 0,
  });

  const overallPathProgress =
    learningPathStages.length > 0
      ? Math.round(
          learningPathStages.reduce((a, s) => a + s.progress, 0) / learningPathStages.length
        )
      : 0;
  const currentStage = learningPathStages.find((s) => s.status === "current");

  return (
    <div className="space-y-6">
      {userTierLevel === 0 && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-foreground">
            Subscribe to a plan to access courses and track your progress.
          </p>
          <Button asChild variant="default">
            <Link to="/pricing">View plans</Link>
          </Button>
        </div>
      )}
      {/* Learning Path Roadmap - real progress */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Your Learning Path</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/learning-path">
              View Full Path <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-1 bg-border rounded-full" />
          <div
            className="absolute top-8 left-0 h-1 bg-primary rounded-full transition-all"
            style={{
              width: `${currentStage ? currentStage.progress : overallPathProgress}%`,
            }}
          />
          <div className="relative grid grid-cols-4 gap-2 sm:gap-4">
            {learningPathStages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 transition-all",
                    stage.status === "completed" && "bg-primary border-primary text-primary-foreground",
                    stage.status === "current" && "bg-background border-primary text-primary animate-pulse",
                    stage.status === "locked" && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : stage.status === "locked" ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>
                <div className="mt-3 w-full min-w-0">
                  <p className={cn("font-semibold text-sm truncate", stage.status === "locked" ? "text-muted-foreground" : "text-foreground")}>
                    {stage.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{stage.subtitle}</p>
                  {(stage.status === "current" || stage.status === "completed") && (
                    <div className="mt-2 mx-auto w-20">
                      <Progress value={stage.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">{stage.progress}%</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Learning Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Continue Learning</h2>
        {enrollmentsLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : continueLearningCourse ? (
          <>
            <div className="flex flex-row items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-16 w-24 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-mono text-primary">{continueLearningCourse.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{continueLearningCourse.title}</h3>
                <p className="text-sm text-muted-foreground">{continueLearningCourse.progress}% complete</p>
                <Progress value={continueLearningCourse.progress} className="h-1.5 mt-2" />
              </div>
              <Button asChild className="shrink-0">
                <Link to={`/dashboard/course/${(continueLearningCourse.code ?? "").toLowerCase()}`}>Continue</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">You haven&apos;t enrolled in any courses yet.</p>
            <Button asChild className="mt-3">
              <Link to="/dashboard/courses">Go to My Courses</Link>
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          Start a course from <Link to="/dashboard/courses" className="text-primary hover:underline">My Courses</Link> to see your progress here.
        </p>
      </div>

      {/* Career Alignment & Certificates */}
      <div className="grid gap-4 md:grid-cols-2">
        <CareerAlignmentPanel />
        <CertificatesPanel />
      </div>

      {/* Quick Stats - streak and skills unlocked from real data */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {[
          { label: "Lessons Completed", value: String(lessonsCompleted) },
          { label: "Courses Enrolled", value: String(coursesEnrolled) },
          { label: "Current Streak", value: String(streak) },
          { label: "Skills Unlocked", value: String(skillsUnlocked) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
