import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle2, Circle, Lock, Loader2, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CareerAlignmentPanel } from "@/components/dashboard/CareerAlignmentPanel";
import { CertificatesPanel } from "@/components/dashboard/CertificatesPanel";
import { listEnrollments, getCourses, frappeKeys } from "@/lib/frappe";
import { getCourseByFrappeName } from "@/lib/courseCatalog";

const FRAPPE_LMS_URL = import.meta.env.VITE_FRAPPE_URL as string || "https://lms-dzr-tbs.c.frappe.cloud";

type StageStatus = "completed" | "current" | "locked";

const STAGE_DEFS = [
  { id: "bridge",     title: "Bridge",     subtitle: "Technical Readiness",  level: 0 },
  { id: "foundations",title: "Foundations",subtitle: "Core Concepts",        level: 1 },
  { id: "core",       title: "Core Cyber", subtitle: "Blue Team / GRC",      level: 2 },
  { id: "specialist", title: "Specialist", subtitle: "Advanced Tracks",      level: 3 },
] as const;

export default function DashboardHome() {
  const { user, session, tierLevel } = useAuth();
  const token = session?.access_token ?? "";

  // Frappe enrollments (course name → progress %)
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: frappeKeys.enrollments(),
    queryFn:  () => listEnrollments(token),
    enabled:  !!token,
  });

  // Frappe courses (for title)
  const { data: frappeCourses = [] } = useQuery({
    queryKey: frappeKeys.courses(),
    queryFn:  getCourses,
    staleTime: 5 * 60 * 1000,
  });

  // Build enrolled course list with progress — metadata from static catalog
  const enrolledCourses = useMemo(() => {
    return enrollments
      .map((e) => {
        const frappe  = frappeCourses.find((c) => c.name === e.course);
        const catalog = getCourseByFrappeName(e.course);
        if (!frappe && !catalog) return null;
        return {
          frappe_name: e.course,
          code:        catalog?.code ?? e.course.toUpperCase().slice(0, 8),
          title:       frappe?.title ?? e.course,
          level:       catalog?.level ?? 0,
          progress:    e.progress ?? 0,
        };
      })
      .filter(Boolean) as { frappe_name: string; code: string; title: string; level: number; progress: number }[];
  }, [enrollments, frappeCourses]);

  // Learning path stages
  const learningPathStages = useMemo(() => {
    const progressByLevel: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [] };
    enrolledCourses.forEach((c) => {
      const lvl = Math.min(c.level, 3);
      progressByLevel[lvl]?.push(c.progress);
    });
    let foundCurrent = false;
    return STAGE_DEFS.map((def) => {
      const progs   = progressByLevel[def.level] ?? [];
      const avgProg = progs.length ? Math.round(progs.reduce((a, b) => a + b, 0) / progs.length) : 0;
      const status: StageStatus =
        avgProg >= 100
          ? "completed"
          : progs.length > 0 && !foundCurrent
            ? ((foundCurrent = true), "current")
            : "locked";
      return { ...def, status, progress: avgProg };
    });
  }, [enrolledCourses]);

  const continueLearning = enrolledCourses.find((c) => c.progress < 100) ?? enrolledCourses[0] ?? null;
  const overallProgress  = learningPathStages.length
    ? Math.round(learningPathStages.reduce((a, s) => a + s.progress, 0) / learningPathStages.length)
    : 0;
  const currentStage = learningPathStages.find((s) => s.status === "current");

  return (
    <div className="space-y-6">
      {/* Primary CTA — go to the LMS where all course content lives */}
      <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Your courses are on the LMS</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Log in with the same email &amp; password you used here to access all your courses.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="shrink-0 w-full sm:w-auto">
          <a href={FRAPPE_LMS_URL} target="_blank" rel="noopener noreferrer">
            Open LMS <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {tierLevel === 0 && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-sm text-foreground">
            Subscribe to a plan to unlock courses on the LMS.
          </p>
          <Button asChild variant="default" className="shrink-0">
            <Link to="/pricing">View plans</Link>
          </Button>
        </div>
      )}

      {/* Learning Path */}
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
          <div className="absolute top-8 left-0 right-0 h-1 bg-border rounded-full hidden sm:block" />
          <div
            className="absolute top-8 left-0 h-1 bg-primary rounded-full transition-all hidden sm:block"
            style={{ width: `${currentStage ? currentStage.progress : overallProgress}%` }}
          />
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
            {learningPathStages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full border-4 transition-all",
                    stage.status === "completed" && "bg-primary border-primary text-primary-foreground",
                    stage.status === "current"   && "bg-background border-primary text-primary animate-pulse",
                    stage.status === "locked"    && "bg-muted border-border text-muted-foreground",
                  )}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : stage.status === "locked" ? (
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6" />
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

      {/* Continue Learning */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Continue Learning</h2>
        {enrollmentsLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : continueLearning ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="h-16 w-24 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-mono text-primary">{continueLearning.code}</span>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h3 className="font-medium text-foreground truncate">{continueLearning.title}</h3>
              <p className="text-sm text-muted-foreground">{Math.round(continueLearning.progress)}% complete</p>
              <Progress value={continueLearning.progress} className="h-1.5 mt-2" />
            </div>
            <Button asChild className="shrink-0 w-full sm:w-auto">
              <Link to={`/dashboard/course/${continueLearning.code.toLowerCase()}`}>Continue</Link>
            </Button>
          </div>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {[
          { label: "Courses Enrolled",   value: String(enrolledCourses.length) },
          { label: "Avg. Progress",       value: `${overallProgress}%` },
          { label: "Subscription Tier",  value: tierLevel === 0 ? "Explorer" : `Level ${tierLevel}` },
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
