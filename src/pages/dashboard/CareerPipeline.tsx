import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Briefcase,
  GraduationCap,
  FileText,
  Users,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { PortfolioExport } from "@/components/dashboard/PortfolioExport";

const pipelineSteps = [
  {
    id: "foundation",
    title: "Complete Foundations",
    description: "Finish Level 0 & Level 1 curriculum",
    status: "in_progress",
    progress: 45,
  },
  {
    id: "core",
    title: "Core Competency",
    description: "Complete Core Cyber track",
    status: "locked",
    progress: 0,
  },
  {
    id: "portfolio",
    title: "Skills Portfolio",
    description: "Build your verified portfolio",
    status: "locked",
    progress: 0,
  },
  {
    id: "eligible",
    title: "Amajoni Eligible",
    description: "Qualify for internship matching",
    status: "locked",
    progress: 0,
  },
];

const requirements = [
  { label: "Lessons Completed", current: 12, required: 50, icon: GraduationCap },
  { label: "Skill Domains", current: 3, required: 6, icon: Trophy },
  { label: "Portfolio Items", current: 1, required: 5, icon: FileText },
  { label: "Peer Reviews", current: 0, required: 3, icon: Users },
];

// Mock leaderboard data
const leaderboardEntries = [
  { rank: 1, userId: "u1", displayName: "CyberNinja42", score: 98, metric: "2:34" },
  { rank: 2, userId: "u2", displayName: "SecOpsQueen", score: 95, metric: "3:12" },
  { rank: 3, userId: "u3", displayName: "PacketHunter", score: 92, metric: "3:45" },
  { rank: 4, userId: "u4", displayName: "FirewallFox", score: 88, metric: "4:01" },
  { rank: 5, userId: "u5", displayName: "ThreatSeeker", score: 85, metric: "4:22" },
];

export default function CareerPipeline() {
  const overallProgress = 28; // Calculated from requirements

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Amajoni Pipeline</h1>
        <p className="text-muted-foreground">
          Track your progress toward internship eligibility.
        </p>
      </div>

      {/* Top Row: Job Readiness + Leaderboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Job Readiness Score */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                Job Readiness Score
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete more requirements to increase your score
              </p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-primary">{overallProgress}%</span>
              <p className="text-sm text-muted-foreground">of 100%</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-4" />
        </div>

        {/* Leaderboard */}
        <Leaderboard
          entries={leaderboardEntries}
          title="Top Performers"
          metricLabel="Time-to-Mitigation"
        />
      </div>

      {/* Portfolio Export */}
      <PortfolioExport
        userName="Student"
        completedLessons={12}
        skillsCount={4}
        labsCompleted={3}
      />

      {/* Pipeline Stages */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Your Journey to Amajoni
        </h2>
        <div className="space-y-4">
          {pipelineSteps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border",
                step.status === "in_progress"
                  ? "border-primary bg-primary/5"
                  : step.status === "completed"
                  ? "border-accent bg-accent/5"
                  : "border-border bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                  step.status === "completed"
                    ? "bg-accent text-accent-foreground"
                    : step.status === "in_progress"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold",
                    step.status === "locked"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {step.status === "in_progress" && (
                  <div className="mt-2">
                    <Progress value={step.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.progress}% complete
                    </p>
                  </div>
                )}
              </div>
              {step.status === "in_progress" && (
                <Badge variant="default">In Progress</Badge>
              )}
              {step.status === "completed" && (
                <Badge variant="secondary">Complete</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Grid */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Eligibility Requirements
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {requirements.map((req) => {
            const percent = Math.round((req.current / req.required) * 100);
            const isComplete = req.current >= req.required;
            return (
              <div
                key={req.label}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      isComplete ? "bg-accent/20" : "bg-primary/10"
                    )}
                  >
                    <req.icon
                      className={cn(
                        "h-5 w-5",
                        isComplete ? "text-accent" : "text-primary"
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{req.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.current} / {req.required}
                    </p>
                  </div>
                </div>
                <Progress value={percent} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Ready to accelerate your career?
        </h2>
        <p className="text-muted-foreground mb-4">
          Upgrade to Professional to unlock Amajoni eligibility and 1-on-1 mentorship.
        </p>
        <Button variant="accent" size="lg">
          Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
