import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  PenLine,
} from "lucide-react";
import {
  submitPractical,
  getSubmissions,
  frappeKeys,
  type BHSubmission,
} from "@/lib/frappe";

interface PracticalSubmissionProps {
  /** Frappe course slug, e.g. "practitioner-core-grc-2" */
  course: string;
  /** Frappe lesson doc name (optional) */
  lesson?: string;
}

const STATUS_CONFIG: Record<
  BHSubmission["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
> = {
  Submitted: { label: "Submitted", variant: "default", icon: Clock },
  "Under Review": { label: "Under Review", variant: "secondary", icon: Clock },
  Graded: { label: "Graded", variant: "default", icon: CheckCircle2 },
  "Resubmit Required": { label: "Resubmission Required", variant: "destructive", icon: RotateCcw },
};

export function PracticalSubmission({ course, lesson }: PracticalSubmissionProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = session?.access_token ?? "";

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: frappeKeys.submissions(course),
    queryFn: () => getSubmissions(accessToken, course),
    enabled: !!accessToken && !!course,
  });

  // Find the practical submission for this specific lesson
  const submission = submissions.find(
    (s) =>
      s.submission_type === "Practical" &&
      (lesson ? s.lesson === lesson : true)
  ) ?? null;

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) throw new Error("You must be signed in.");
      if (!answer.trim()) throw new Error("Please write your answers before submitting.");
      await submitPractical({ course, lesson, content: answer.trim() }, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frappeKeys.submissions(course) });
      setIsEditing(false);
      toast({
        title: "Practical submitted",
        description: "Your answers have been saved. Your instructor will review them.",
      });
    },
    onError: (err) => {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading submission…</span>
        </div>
      </div>
    );
  }

  const statusCfg = submission ? STATUS_CONFIG[submission.status] ?? STATUS_CONFIG.Submitted : null;
  const hasSubmission = !!submission?.content;
  const showTextarea = !hasSubmission || isEditing;

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <PenLine className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Submit Your Answers</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Complete the tasks above, then type your answers below. Reference the task numbers (e.g. "Task 1:", "Task 2:") so your instructor can mark each one.
      </p>

      {/* Existing submission status */}
      {hasSubmission && !isEditing && statusCfg && submission && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Your submission</span>
            <Badge variant={statusCfg.variant}>
              <statusCfg.icon className="h-3 w-3 mr-1" />
              {statusCfg.label}
            </Badge>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
            {submission.content}
          </div>

          {submission.submitted_at && (
            <p className="text-xs text-muted-foreground">
              Submitted{" "}
              {new Date(submission.submitted_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {submission.status === "Graded" && submission.grade !== null && (
            <div className="rounded-lg bg-primary/10 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  Grade: {submission.grade}/100
                </span>
              </div>
              {submission.feedback && (
                <p className="text-sm text-muted-foreground">{submission.feedback}</p>
              )}
            </div>
          )}

          {submission.status === "Resubmit Required" && submission.feedback && (
            <div className="rounded-lg bg-destructive/10 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Instructor feedback:</span>
              </div>
              <p className="text-sm text-foreground">{submission.feedback}</p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAnswer(submission.content ?? "");
              setIsEditing(true);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Edit & Resubmit
          </Button>
        </div>
      )}

      {/* Textarea for writing answers */}
      {showTextarea && (
        <div className="space-y-3">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={`Task 1:\n[Your answer here]\n\nTask 2:\n[Your answer here]\n\nTask 3:\n[Your answer here]`}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending || !answer.trim()}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {hasSubmission ? "Resubmit Answers" : "Submit Answers"}
                </>
              )}
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setAnswer(submission?.content ?? "");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
