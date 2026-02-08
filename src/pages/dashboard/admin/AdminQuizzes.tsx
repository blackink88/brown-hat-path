import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

type Course = { id: string; code: string; title: string };
type Module = { id: string; course_id: string; title: string; order_index: number };
type Lesson = { id: string; module_id: string; title: string; order_index: number };
type QuizQuestion = { id: string; lesson_id: string; question_text: string; question_type: string; order_index: number };
type QuizOption = { id: string; question_id: string; option_text: string; is_correct: boolean; order_index: number };

export default function AdminQuizzes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<{ question_text: string; question_type: "multiple_choice" | "true_false" }>({ question_text: "", question_type: "multiple_choice" });
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const { data: courses } = useQuery({
    queryKey: ["adminCoursesList"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, code, title").order("order_index");
      if (error) throw error;
      return (data as Course[]) ?? [];
    },
  });

  const { data: modules } = useQuery({
    queryKey: ["adminModulesList", courses],
    queryFn: async () => {
      const { data, error } = await supabase.from("modules").select("id, course_id, title, order_index").order("order_index");
      if (error) throw error;
      return (data as Module[]) ?? [];
    },
    enabled: !!courses?.length,
  });

  const { data: lessons } = useQuery({
    queryKey: ["adminLessonsList", modules],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("id, module_id, title, order_index").order("order_index");
      if (error) throw error;
      return (data as Lesson[]) ?? [];
    },
    enabled: !!modules?.length,
  });

  const { data: questions } = useQuery({
    queryKey: ["adminQuizQuestions", selectedLessonId],
    queryFn: async () => {
      if (!selectedLessonId) return [];
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*, quiz_question_options(*)")
        .eq("lesson_id", selectedLessonId)
        .order("order_index");
      if (error) throw error;
      return (data as (QuizQuestion & { quiz_question_options: QuizOption[] })[]) ?? [];
    },
    enabled: !!selectedLessonId,
  });

  const addQuestionMutation = useMutation({
    mutationFn: async () => {
      const opts = newOptions.filter(Boolean);
      if (!selectedLessonId || !newQuestion.question_text.trim() || opts.length < 2) throw new Error("Fill question and at least 2 options");
      const { data: q, error: qErr } = await supabase
        .from("quiz_questions")
        .insert({
          lesson_id: selectedLessonId,
          question_text: newQuestion.question_text.trim(),
          question_type: newQuestion.question_type,
          order_index: (questions?.length ?? 0),
        })
        .select("id")
        .single();
      if (qErr) throw qErr;
      for (let i = 0; i < opts.length; i++) {
        await supabase.from("quiz_question_options").insert({
          question_id: q.id,
          option_text: opts[i],
          is_correct: i === correctIndex,
          order_index: i,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuizQuestions", selectedLessonId] });
      setAddQuestionOpen(false);
      setNewQuestion({ question_text: "", question_type: "multiple_choice" });
      setNewOptions(["", ""]);
      setCorrectIndex(0);
      toast({ title: "Question added" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      await supabase.from("quiz_question_options").delete().eq("question_id", questionId);
      await supabase.from("quiz_questions").delete().eq("id", questionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuizQuestions", selectedLessonId] });
      toast({ title: "Question deleted" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Lesson quiz questions</h1>
      <p className="text-muted-foreground text-sm">
        These quizzes appear at the end of each lesson in the course player. Select a lesson to add or edit questions.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-64">
          <Label>Lesson</Label>
          <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select lesson" />
            </SelectTrigger>
            <SelectContent>
              {(courses ?? []).flatMap((c) => {
                const mods = (modules ?? []).filter((m) => m.course_id === c.id);
                return mods.flatMap((m) => {
                  const less = (lessons ?? []).filter((l) => l.module_id === m.id);
                  return less.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {c.code} → {m.title} → {l.title}
                    </SelectItem>
                  ));
                });
              })}
            </SelectContent>
          </Select>
        </div>
        {selectedLessonId && (
          <Button onClick={() => setAddQuestionOpen(true)} className="mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Add question
          </Button>
        )}
      </div>

      {selectedLessonId && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Questions for this lesson</h2>
          {!questions?.length ? (
            <p className="text-muted-foreground text-sm">No questions yet. Add one above.</p>
          ) : (
            <ul className="space-y-4">
              {questions?.map((q) => (
                <li key={q.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{q.question_text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {q.question_type} • {(q as { quiz_question_options?: QuizOption[] }).quiz_question_options?.length ?? 0} options
                      </p>
                      <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                        {(q as { quiz_question_options?: QuizOption[] }).quiz_question_options
                          ?.sort((a, b) => a.order_index - b.order_index)
                          .map((o) => (
                            <li key={o.id}>
                              {o.option_text} {o.is_correct && "(correct)"}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteQuestionMutation.mutate(q.id)}
                      disabled={deleteQuestionMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Dialog open={addQuestionOpen} onOpenChange={setAddQuestionOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add quiz question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Question text</Label>
              <Input
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion((q) => ({ ...q, question_text: e.target.value }))}
                placeholder="e.g. What is a computer?"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={newQuestion.question_type}
                onValueChange={(v: "multiple_choice" | "true_false") =>
                  setNewQuestion((q) => ({ ...q, question_type: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple choice</SelectItem>
                  <SelectItem value="true_false">True / False</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Options (one correct)</Label>
              {newOptions.map((opt, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...newOptions];
                      next[i] = e.target.value;
                      setNewOptions(next);
                    }}
                    placeholder={`Option ${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant={correctIndex === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCorrectIndex(i)}
                  >
                    Correct
                  </Button>
                </div>
              ))}
              {newQuestion.question_type === "multiple_choice" && newOptions.length < 6 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setNewOptions((o) => [...o, ""])}
                >
                  + Add option
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddQuestionOpen(false)}>Cancel</Button>
            <Button onClick={() => addQuestionMutation.mutate()} disabled={addQuestionMutation.isPending}>
              {addQuestionMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
