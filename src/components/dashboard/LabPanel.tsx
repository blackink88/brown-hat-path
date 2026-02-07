import { useState } from "react";
import { ExternalLink, Flag, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LabPanelProps {
  lessonId: string;
  labUrl?: string;
  onFlagSubmit?: (flag: string) => Promise<boolean>;
  isCompleted?: boolean;
}

export function LabPanel({
  lessonId,
  labUrl,
  onFlagSubmit,
  isCompleted = false,
}: LabPanelProps) {
  const [flag, setFlag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);

  const handleSubmit = async () => {
    if (!flag.trim() || !onFlagSubmit) return;
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      const success = await onFlagSubmit(flag);
      setSubmitResult(success ? "success" : "error");
      if (success) setFlag("");
    } catch {
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="h-4 w-4 text-accent" />
        <h3 className="font-semibold text-foreground">Lab Environment</h3>
        {isCompleted && (
          <span className="ml-auto flex items-center gap-1 text-xs text-accent">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
      </div>

      {/* Launch Lab Button */}
      <Button
        variant="outline"
        className="w-full justify-between group"
        onClick={() => labUrl && window.open(labUrl, "_blank")}
        disabled={!labUrl}
      >
        <span className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <ExternalLink className="h-4 w-4 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-medium">Launch Lab</p>
            <p className="text-xs text-muted-foreground">
              {labUrl ? "Opens in new tab" : "No lab available"}
            </p>
          </div>
        </span>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </Button>

      {/* Flag Submission */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Submit Flag / Secret Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Enter flag (e.g., FLAG{...})"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={cn(
                "font-mono text-sm",
                submitResult === "success" && "border-accent",
                submitResult === "error" && "border-destructive"
              )}
              disabled={isSubmitting || isCompleted}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!flag.trim() || isSubmitting || isCompleted}
            className="shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
        {submitResult === "success" && (
          <p className="text-xs text-accent flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Flag accepted! Lab completed.
          </p>
        )}
        {submitResult === "error" && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Invalid flag. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
