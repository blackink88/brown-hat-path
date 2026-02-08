import { Briefcase, TrendingUp } from "lucide-react";
import { useStageProgress } from "@/hooks/useStageProgress";

export function CareerAlignmentPanel() {
  const { currentStage, currentCareerRoles, stageStatuses } = useStageProgress();

  // Get roles from current and next stage
  const nextStage = stageStatuses.find(
    (s) => s.stage_level === (currentStage?.stage_level ?? -1) + 1
  );

  const displayRoles = currentCareerRoles.slice(0, 4);
  const upcomingRoles = nextStage?.careerRoles?.slice(0, 2) ?? [];

  if (!displayRoles.length && !upcomingRoles.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">Career Alignment</h3>
      </div>

      {displayRoles.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">
            Roles you're preparing for at {currentStage?.stage_name}:
          </p>
          <ul className="space-y-1.5">
            {displayRoles.map((role, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {role}
              </li>
            ))}
          </ul>
        </div>
      )}

      {upcomingRoles.length > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <TrendingUp className="h-3 w-3" />
            <span>Unlock at {nextStage?.stage_name}:</span>
          </div>
          <ul className="space-y-1">
            {upcomingRoles.map((role, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                {role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
