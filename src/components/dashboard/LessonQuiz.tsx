import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getQuiz,
  getQuestionOptions,
  submitQuiz,
  frappeKeys,
  type FrappeQuiz,
  type FrappeQuizQuestion,
} from "@/lib/frappe";

const PASS_THRESHOLD = 70;

export function LessonQuiz({
  frappeQuizId,
  onPass,
  alreadyCompleted,
}: {
  /** Frappe LMS Quiz doc name — required */
  frappeQuizId: string | null | undefined;
  onPass: () => void;
  alreadyCompleted: boolean;
}) {
  const { session } = useAuth();
  // selected maps question.name → selected option index (1-4)
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  // Maps question name → correct option index
  const [correctMap, setCorrectMap] = useState<Record<string, number>>({});
  const accessToken = session?.access_token ?? "";

  const { data: quiz, isLoading } = useQuery<FrappeQuiz>({
    queryKey: frappeKeys.quiz(frappeQuizId ?? ""),
    queryFn: () => getQuiz(frappeQuizId!),
    enabled: !!frappeQuizId,
  });

  const saveAttempt = useMutation({
    mutationFn: async (results: Array<{ question: string; selected_option: number }>) => {
      if (!accessToken || !frappeQuizId) return;
      await submitQuiz(frappeQuizId, results, accessToken);
    },
  });

  const handleSubmit = () => {
    if (!quiz?.questions?.length) return;

    // Build correct answer map from Frappe question fields
    const newCorrectMap: Record<string, number> = {};
    quiz.questions.forEach((q: FrappeQuizQuestion) => {
      for (const n of [1, 2, 3, 4] as const) {
        if (q[`is_correct_${n}` as keyof FrappeQuizQuestion]) {
          newCorrectMap[q.name] = n;
          break;
        }
      }
    });
    setCorrectMap(newCorrectMap);

    let correct = 0;
    quiz.questions.forEach((q: FrappeQuizQuestion) => {
      if (selected[q.name] !== undefined && selected[q.name] === newCorrectMap[q.name]) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / quiz.questions.length) * 100);
    setScore(scorePercent);
    setSubmitted(true);

    if (scorePercent >= PASS_THRESHOLD) {
      onPass();
    }

    // Save attempt to Frappe
    const results = quiz.questions.map((q: FrappeQuizQuestion) => ({
      question: q.name,
      selected_option: selected[q.name] ?? 0,
    }));
    saveAttempt.mutate(results);
  };

  const handleRetry = () => {
    setSelected({});
    setSubmitted(false);
    setScore(null);
    setCorrectMap({});
  };

  if (!frappeQuizId) return null;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin shrink-0" />
        <span className="text-sm">Loading quiz…</span>
      </div>
    );
  }

  if (!quiz?.questions?.length) return null;

  const allAnswered = quiz.questions.every((q: FrappeQuizQuestion) => selected[q.name] !== undefined);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Check your understanding</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              A few questions to reinforce what matters in this lesson.
            </p>
          </div>
        </div>
        {alreadyCompleted && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
            Lesson completed
          </span>
        )}
      </div>

      {!submitted ? (
        <>
          <p className="text-sm text-muted-foreground">
            You need {PASS_THRESHOLD}% to pass. Take your time — you can retry if you need to.
          </p>
          <div className="space-y-6">
            {quiz.questions.map((q: FrappeQuizQuestion, idx: number) => {
              const options = getQuestionOptions(q);
              return (
                <div key={q.name} className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground font-normal mr-1">{idx + 1}.</span>
                    {q.question}
                  </Label>
                  <RadioGroup
                    value={selected[q.name] !== undefined ? String(selected[q.name]) : ""}
                    onValueChange={(value) =>
                      setSelected((prev) => ({ ...prev, [q.name]: Number(value) }))
                    }
                    className="flex flex-col gap-2"
                  >
                    {options.map((opt) => (
                      <div
                        key={opt.idx}
                        className={cn(
                          "flex items-center space-x-2 rounded-lg border border-border px-3 py-2 hover:bg-muted/50",
                          selected[q.name] === opt.idx && "border-primary bg-primary/5"
                        )}
                      >
                        <RadioGroupItem value={String(opt.idx)} id={`${q.name}-${opt.idx}`} />
                        <Label
                          htmlFor={`${q.name}-${opt.idx}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full sm:w-auto"
          >
            Submit answers
          </Button>
        </>
      ) : (
        <div className="space-y-5">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3",
              score !== null && score >= PASS_THRESHOLD
                ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
            )}
          >
            {score !== null && score >= PASS_THRESHOLD ? (
              <CheckCircle2 className="h-6 w-6 shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 shrink-0" />
            )}
            <div>
              <p className="font-semibold">
                {score !== null && score >= PASS_THRESHOLD
                  ? `You passed — ${score}% (${quiz.questions.filter((q: FrappeQuizQuestion) => selected[q.name] === correctMap[q.name]).length}/${quiz.questions.length} correct)`
                  : `${score}% — ${quiz.questions.filter((q: FrappeQuizQuestion) => selected[q.name] === correctMap[q.name]).length}/${quiz.questions.length} correct`}
              </p>
              <p className="text-sm mt-0.5 opacity-90">
                {score !== null && score >= PASS_THRESHOLD
                  ? "You've got the key ideas from this lesson."
                  : `You need ${PASS_THRESHOLD}% to pass. Review the correct answers below and try again when ready.`}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">What to remember</p>
            {quiz.questions.map((q: FrappeQuizQuestion, idx: number) => {
              const options = getQuestionOptions(q);
              const chosenIdx = selected[q.name];
              const correctIdx = correctMap[q.name];
              const isCorrect = chosenIdx !== undefined && chosenIdx === correctIdx;
              const chosenOpt = options.find((o) => o.idx === chosenIdx);
              const correctOpt = options.find((o) => o.idx === correctIdx);
              return (
                <div
                  key={q.name}
                  className={cn(
                    "rounded-xl border p-3.5 text-sm",
                    isCorrect
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  )}
                >
                  <p className="font-medium text-foreground">
                    <span className="text-muted-foreground mr-1">{idx + 1}.</span>
                    {q.question}
                  </p>
                  {!isCorrect && chosenOpt && (
                    <p className="mt-1.5 text-muted-foreground">
                      Your answer:{" "}
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        {chosenOpt.text}
                      </span>
                    </p>
                  )}
                  {!isCorrect && correctOpt && (
                    <p className="mt-1 text-foreground">
                      Correct:{" "}
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {correctOpt.text}
                      </span>
                    </p>
                  )}
                  {isCorrect && correctOpt && (
                    <p className="mt-1.5 text-green-600 dark:text-green-400">
                      ✓ {correctOpt.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleRetry} className="min-w-[120px]">
              Try again
            </Button>
            {score !== null && score >= PASS_THRESHOLD && (
              <span className="text-sm text-muted-foreground self-center">
                You can mark this lesson complete and continue.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
