import { CheckCircle2, Sparkles } from "lucide-react";

interface SkillsYouWillGainProps {
  skills: string[];
  title?: string;
  compact?: boolean;
}

export function SkillsYouWillGain({
  skills,
  title = "Skills You Will Gain",
  compact = false,
}: SkillsYouWillGainProps) {
  if (!skills?.length) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
          >
            <CheckCircle2 className="h-3 w-3" />
            {skill}
          </span>
        ))}
        {skills.length > 4 && (
          <span className="text-xs text-muted-foreground">
            +{skills.length - 4} more
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <ul className="space-y-2">
        {skills.map((skill, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
