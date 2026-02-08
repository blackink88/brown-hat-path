import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PASS_THRESHOLD = 70;

type QuizOption = {
  id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
};

type QuizQuestion = {
  id: string;
  question_text: string;
  question_type: string;
  order_index: number;
  quiz_question_options: QuizOption[];
};

export function LessonQuiz({
  lessonId,
  onPass,
  alreadyCompleted,
}: {
  lessonId: string;
  onPass: () => void;
  alreadyCompleted: boolean;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctOptionIds, setCorrectOptionIds] = useState<Set<string>>(new Set());

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz", lessonId],
    queryFn: async () => {
      const { data: qs, error: qError } = await supabase
        .from("quiz_questions")
        .select("*, quiz_question_options(*)")
        .eq("lesson_id", lessonId)
        .order("order_index");

      if (qError) throw qError;

      const sorted = (qs || []).map((q) => ({
        ...q,
        quiz_question_options: (q.quiz_question_options || []).sort(
          (a: QuizOption, b: QuizOption) => a.order_index - b.order_index
        ),
      })) as QuizQuestion[];

      return sorted;
    },
    enabled: !!lessonId,
  });

  const saveAttempt = useMutation({
    mutationFn: async ({
      scorePercent,
      passed,
    }: {
      scorePercent: number;
      passed: boolean;
    }) => {
      if (!user?.id) return;
      await supabase.from("user_quiz_attempts").insert({
        user_id: user.id,
        lesson_id: lessonId,
        score_percent: scorePercent,
        passed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userQuizAttempts", lessonId] });
    },
  });

  const handleSubmit = () => {
    if (!questions?.length) return;

    const correctIds = new Set<string>();
    questions.forEach((q) => {
      q.quiz_question_options
        .filter((o) => o.is_correct)
        .forEach((o) => correctIds.add(o.id));
    });
    setCorrectOptionIds(correctIds);

    let correct = 0;
    questions.forEach((q) => {
      const chosen = selected[q.id];
      if (chosen && correctIds.has(chosen)) correct++;
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    setScore(scorePercent);
    setSubmitted(true);

    if (scorePercent >= PASS_THRESHOLD) {
      onPass();
    }

    if (user?.id) {
      saveAttempt.mutate({
        scorePercent,
        passed: scorePercent >= PASS_THRESHOLD,
      });
    }
  };

  const handleRetry = () => {
    setSelected({});
    setSubmitted(false);
    setScore(null);
    setCorrectOptionIds(new Set());
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading quiz…</span>
      </div>
    );
  }

  if (!questions?.length) {
    return null;
  }

  const allAnswered = questions.every((q) => selected[q.id]);
  const passThreshold = PASS_THRESHOLD;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Lesson quiz</h3>
        {alreadyCompleted && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
            Lesson completed
          </span>
        )}
      </div>

      {!submitted ? (
        <>
          <p className="text-sm text-muted-foreground">
            Answer the questions below to check your understanding. You need {passThreshold}% to pass.
          </p>
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  {q.question_text}
                </Label>
                <RadioGroup
                  value={selected[q.id] ?? ""}
                  onValueChange={(value) =>
                    setSelected((prev) => ({ ...prev, [q.id]: value }))
                  }
                  className="flex flex-col gap-2"
                >
                  {q.quiz_question_options.map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border border-border px-3 py-2 hover:bg-muted/50",
                        selected[q.id] === opt.id && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <Label htmlFor={opt.id} className="flex-1 cursor-pointer text-sm">
                        {opt.option_text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full sm:w-auto"
          >
            Submit quiz
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2",
              score !== null && score >= passThreshold
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
            )}
          >
            {score !== null && score >= passThreshold ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="font-medium">
              {score !== null && score >= passThreshold
                ? `Passed — ${score}%`
                : `Score: ${score}%. You need ${passThreshold}% to pass.`}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Review</p>
            {questions.map((q) => {
              const chosenId = selected[q.id];
              const chosen = q.quiz_question_options.find((o) => o.id === chosenId);
              const correctOpt = q.quiz_question_options.find((o) => o.is_correct);
              const isCorrect = chosenId && correctOptionIds.has(chosenId);
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm",
                    isCorrect
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  )}
                >
                  <p className="font-medium text-foreground">{q.question_text}</p>
                  {!isCorrect && chosen && (
                    <p className="mt-1 text-muted-foreground">
                      Your answer: <span className="text-red-600 dark:text-red-400">{chosen.option_text}</span>
                    </p>
                  )}
                  {!isCorrect && correctOpt && (
                    <p className="mt-1 text-foreground">
                      Correct: <span className="text-green-600 dark:text-green-400">{correctOpt.option_text}</span>
                    </p>
                  )}
                  {isCorrect && (
                    <p className="mt-1 text-green-600 dark:text-green-400">
                      Correct: {correctOpt?.option_text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Button variant="outline" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
