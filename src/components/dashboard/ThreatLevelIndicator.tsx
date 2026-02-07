import { Shield, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type ThreatLevel = "low" | "guarded" | "elevated" | "high" | "severe";

interface ThreatLevelIndicatorProps {
  level: ThreatLevel;
  lastLabDate?: Date | null;
}

const threatConfig: Record<
  ThreatLevel,
  { label: string; color: string; bgColor: string; icon: typeof Shield }
> = {
  low: {
    label: "LOW",
    color: "text-accent",
    bgColor: "bg-accent/10",
    icon: ShieldCheck,
  },
  guarded: {
    label: "GUARDED",
    color: "text-accent",
    bgColor: "bg-accent/10",
    icon: Shield,
  },
  elevated: {
    label: "ELEVATED",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    icon: AlertTriangle,
  },
  high: {
    label: "HIGH",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    icon: ShieldAlert,
  },
  severe: {
    label: "SEVERE",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    icon: ShieldAlert,
  },
};

export function ThreatLevelIndicator({
  level,
  lastLabDate,
}: ThreatLevelIndicatorProps) {
  const config = threatConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-4 flex items-center gap-4",
        config.bgColor
      )}
    >
      <div
        className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center border-2",
          config.color,
          `border-current`
        )}
      >
        <Icon className={cn("h-7 w-7", config.color)} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Security Posture
        </p>
        <p className={cn("text-2xl font-bold font-mono tracking-wide", config.color)}>
          {config.label}
        </p>
        {lastLabDate && (
          <p className="text-xs text-muted-foreground">
            Last lab: {lastLabDate.toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="hidden sm:flex flex-col items-end">
        <div className="flex gap-1">
          {["low", "guarded", "elevated", "high", "severe"].map((l, i) => (
            <div
              key={l}
              className={cn(
                "w-2 h-6 rounded-sm transition-all",
                i <=
                  ["low", "guarded", "elevated", "high", "severe"].indexOf(level)
                  ? l === "low" || l === "guarded"
                    ? "bg-accent"
                    : l === "elevated"
                    ? "bg-yellow-500"
                    : l === "high"
                    ? "bg-orange-500"
                    : "bg-destructive"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Threat Level</p>
      </div>
    </div>
  );
}
