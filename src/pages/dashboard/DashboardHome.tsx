import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
const learningPathStages = [
  {
    id: "bridge",
    title: "Bridge",
    subtitle: "Technical Readiness",
    level: 0,
    status: "current",
    progress: 35,
  },
  {
    id: "foundations",
    title: "Foundations",
    subtitle: "Core Concepts",
    level: 1,
    status: "locked",
    progress: 0,
  },
  {
    id: "core",
    title: "Core Cyber",
    subtitle: "Blue Team / GRC",
    level: 2,
    status: "locked",
    progress: 0,
  },
  {
    id: "specialist",
    title: "Specialist",
    subtitle: "Advanced Tracks",
    level: 3,
    status: "locked",
    progress: 0,
  },
];

export default function DashboardHome() {
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

        {/* Roadmap Visualization - stages in a single horizontal row */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-border rounded-full" />
          <div
            className="absolute top-8 left-0 h-1 bg-primary rounded-full transition-all"
            style={{
              width: `${learningPathStages.find((s) => s.status === "current")?.progress ?? 0}%`,
            }}
          />

          {/* Stages - always in a row, 4 columns */}
          <div className="relative grid grid-cols-4 gap-2 sm:gap-4">
            {learningPathStages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center text-center">
                {/* Node */}
                <div
                  className={cn(
                    "relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 transition-all",
                    stage.status === "completed" &&
                      "bg-primary border-primary text-primary-foreground",
                    stage.status === "current" &&
                      "bg-background border-primary text-primary animate-pulse",
                    stage.status === "locked" &&
                      "bg-muted border-border text-muted-foreground"
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

                {/* Label */}
                <div className="mt-3 w-full min-w-0">
                  <p
                    className={cn(
                      "font-semibold text-sm truncate",
                      stage.status === "locked"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    )}
                  >
                    {stage.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{stage.subtitle}</p>
                  {stage.status === "current" && (
                    <div className="mt-2 mx-auto w-20">
                      <Progress value={stage.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {stage.progress}% complete
                      </p>
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
        <div className="flex flex-row items-center gap-4 p-4 rounded-lg bg-muted/50">
          <div className="h-16 w-24 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-mono text-primary">BH-BRIDGE</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              Technical Readiness Bridge
            </h3>
            <p className="text-sm text-muted-foreground">
              Lesson 3: Introduction to Networking
            </p>
            <Progress value={35} className="h-1.5 mt-2" />
          </div>
          <Button asChild className="shrink-0">
            <Link to="/dashboard/course/bh-bridge">Continue</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Start a course from <Link to="/dashboard/courses" className="text-primary hover:underline">My Courses</Link> to see your progress here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {[
          { label: "Lessons Completed", value: "12" },
          { label: "Hours Learned", value: "8.5" },
          { label: "Current Streak", value: "3 days" },
          { label: "Skills Unlocked", value: "4" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
