import { Link } from "react-router-dom";
import { Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  module: string;
  courseCode: string;
  status: "pending" | "in_progress" | "locked";
}

interface ActiveMissionsProps {
  missions: Mission[];
}

export function ActiveMissions({ missions }: ActiveMissionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-secondary/80 px-4 py-2 flex items-center gap-2 border-b border-border">
        <Terminal className="h-4 w-4 text-accent" />
        <span className="font-mono text-sm text-accent">active_missions.sh</span>
      </div>
      <div className="bg-secondary/20 font-mono text-sm">
        {missions.length === 0 ? (
          <div className="px-4 py-6 text-muted-foreground text-center">
            <p>$ No active missions</p>
            <p className="text-xs mt-1">Complete onboarding to unlock missions</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {missions.map((mission, index) => (
              <Link
                key={mission.id}
                to={`/dashboard/course/${mission.courseCode}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group",
                  mission.status === "locked" && "opacity-50 pointer-events-none"
                )}
              >
                <span className="text-accent">$</span>
                <span className="text-muted-foreground">[{String(index + 1).padStart(2, "0")}]</span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate">{mission.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {mission.module}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded font-sans",
                    mission.status === "in_progress" &&
                      "bg-accent/20 text-accent",
                    mission.status === "pending" &&
                      "bg-muted text-muted-foreground",
                    mission.status === "locked" && "bg-muted text-muted-foreground"
                  )}
                >
                  {mission.status === "in_progress"
                    ? "ACTIVE"
                    : mission.status === "pending"
                    ? "PENDING"
                    : "LOCKED"}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
