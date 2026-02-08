import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StageStatus = "completed" | "current" | "locked";

const learningPathStages: { id: string; title: string; subtitle: string; level: number; status: StageStatus; progress: number }[] = [
  { id: "bridge", title: "Bridge", subtitle: "Technical Readiness", level: 0, status: "current", progress: 35 },
  { id: "foundations", title: "Foundations", subtitle: "Core Concepts", level: 1, status: "locked", progress: 0 },
  { id: "core", title: "Core Cyber", subtitle: "Blue Team / GRC", level: 2, status: "locked", progress: 0 },
  { id: "specialist", title: "Specialist", subtitle: "Advanced Tracks", level: 3, status: "locked", progress: 0 },
];

type EnrolledCourse = { id: string; code: string; title: string; progress: number };

export default function DashboardHome() {
  const { user } = useAuth();

  const { data: enrollmentsWithCourses, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["dashboardEnrollments", user?.id],
    queryFn: async () => {
      const { data: enrollments, error: eErr } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", user?.id ?? "");
      if (eErr) throw eErr;
      const courseIds = (enrollments ?? []).map((e) => e.course_id);
      if (courseIds.length === 0) return [];
      const { data: courses, error: cErr } = await supabase
        .from("courses")
        .select("id, code, title")
        .in("id", courseIds)
        .order("order_index");
      if (cErr) throw cErr;
      return courses ?? [];
    },
    enabled: !!user?.id,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user?.id ?? "")
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

  const continueLearningCourse: EnrolledCourse | null = (() => {
    if (!enrollmentsWithCourses?.length || !lessonCourseMap) return null;
    // Ensure progressSet is always a Set, even if userProgress is cached in wrong format
    const progressSet = userProgress instanceof Set ? userProgress : new Set<string>();
    const courseProgressList: EnrolledCourse[] = enrollmentsWithCourses.map((c) => {
      let total = 0;
      let completed = 0;
      Object.entries(lessonCourseMap).forEach(([lessonId, courseId]) => {
        if (courseId === c.id) {
          total += 1;
          if (progressSet.has(lessonId)) completed += 1;
        }
      });
      return { id: c.id, code: c.code, title: c.title, progress: total > 0 ? Math.round((completed / total) * 100) : 0 };
    });
    const first = courseProgressList[0];
    return first ?? null;
  })();

  const lessonsCompleted = userProgress?.size ?? 0;
  const coursesEnrolled = enrollmentsWithCourses?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Learning Path Roadmap */}
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
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-cyber-blue to-cyber-teal rounded-full transition-all"
            style={{
              width: `${learningPathStages.find((s) => s.status === "current")?.progress ?? 0}%`,
            }}
          />
          <div className="relative grid grid-cols-4 gap-2 sm:gap-4">
            {learningPathStages.map((stage, index) => {
              const stageColors = [
                "border-cyber-blue bg-cyber-blue",
                "border-cyber-teal bg-cyber-teal", 
                "border-cyber-purple bg-cyber-purple",
                "border-level-advanced bg-level-advanced"
              ];
              return (
              <div key={stage.id} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 transition-all",
                    stage.status === "completed" && `${stageColors[index]} text-white`,
                    stage.status === "current" && `bg-background border-cyber-blue text-cyber-blue animate-pulse`,
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
                  {stage.status === "current" && (
                    <div className="mt-2 mx-auto w-20">
                      <Progress value={stage.progress} className="h-1.5 [&>div]:bg-cyber-blue" />
                      <p className="text-xs text-muted-foreground mt-1">{stage.progress}% complete</p>
                    </div>
                  )}
                </div>
              </div>
            )})}
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
            <div className="flex flex-row items-center gap-4 p-4 rounded-lg bg-muted/50 border border-cyber-blue/20">
              <div className="h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-cyber-teal/20 flex items-center justify-center">
                <span className="text-xs font-mono text-cyber-blue">{continueLearningCourse.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{continueLearningCourse.title}</h3>
                <p className="text-sm text-muted-foreground">{continueLearningCourse.progress}% complete</p>
                <Progress value={continueLearningCourse.progress} className="h-1.5 mt-2 [&>div]:bg-cyber-teal" />
              </div>
              <Button asChild className="shrink-0 bg-cyber-blue hover:bg-cyber-blue/90">
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {[
          { label: "Lessons Completed", value: String(lessonsCompleted) },
          { label: "Courses Enrolled", value: String(coursesEnrolled) },
          { label: "Current Streak", value: "—" },
          { label: "Skills Unlocked", value: "—" },
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
