import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Course = { id: string; code: string; title: string; description: string | null; level: number; required_tier_level: number; order_index: number };
type Module = { id: string; course_id: string; title: string; description: string | null; order_index: number };
type Lesson = { id: string; module_id: string; title: string; description: string | null; content_markdown: string | null; order_index: number };

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", content_markdown: "" });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("order_index");
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: modulesByCourse } = useQuery({
    queryKey: ["adminModules", courses?.map((c) => c.id)],
    queryFn: async () => {
      if (!courses?.length) return {};
      const { data, error } = await supabase.from("modules").select("*").order("order_index");
      if (error) throw error;
      const byCourse: Record<string, Module[]> = {};
      (data as Module[]).forEach((m) => {
        if (!byCourse[m.course_id]) byCourse[m.course_id] = [];
        byCourse[m.course_id].push(m);
      });
      return byCourse;
    },
    enabled: !!courses?.length,
  });

  const { data: lessonsByModule } = useQuery({
    queryKey: ["adminLessons", modulesByCourse],
    queryFn: async () => {
      const moduleIds = Object.values(modulesByCourse ?? {}).flat().map((m) => m.id);
      if (!moduleIds.length) return {};
      const { data, error } = await supabase.from("lessons").select("*").in("module_id", moduleIds).order("order_index");
      if (error) throw error;
      const byModule: Record<string, Lesson[]> = {};
      (data as Lesson[]).forEach((l) => {
        if (!byModule[l.module_id]) byModule[l.module_id] = [];
        byModule[l.module_id].push(l);
      });
      return byModule;
    },
    enabled: !!modulesByCourse && Object.keys(modulesByCourse).length > 0,
  });

  const updateLesson = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Lesson> & { id: string }) => {
      const { error } = await supabase.from("lessons").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLessons"] });
      setEditingLesson(null);
      toast({ title: "Lesson updated" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const openLessonEditor = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description ?? "",
      content_markdown: lesson.content_markdown ?? "",
    });
  };

  const handleSaveLesson = () => {
    if (!editingLesson) return;
    updateLesson.mutate({
      id: editingLesson.id,
      title: lessonForm.title,
      description: lessonForm.description || null,
      content_markdown: lessonForm.content_markdown || null,
    });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading courses…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Courses & content</h1>
      <p className="text-muted-foreground text-sm">
        Expand a course to see modules and lessons. Click edit on a lesson to change its content.
      </p>

      <div className="space-y-2">
        {courses?.map((course) => {
          const modules = modulesByCourse?.[course.id] ?? [];
          const isCourseOpen = expandedCourses.has(course.id);
          return (
            <Collapsible
              key={course.id}
              open={isCourseOpen}
              onOpenChange={(open) =>
                setExpandedCourses((s) => {
                  const next = new Set(s);
                  if (open) next.add(course.id);
                  else next.delete(course.id);
                  return next;
                })
              }
            >
              <div className="rounded-lg border border-border bg-card">
                <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 text-left hover:bg-muted/50">
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isCourseOpen && "rotate-90")} />
                  <span className="font-medium">{course.code}</span>
                  <span className="text-muted-foreground">— {course.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{modules.length} modules</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-border px-4 pb-4 pt-2">
                    {modules.map((mod) => {
                      const lessons = lessonsByModule?.[mod.id] ?? [];
                      const isModOpen = expandedModules.has(mod.id);
                      return (
                        <Collapsible
                          key={mod.id}
                          open={isModOpen}
                          onOpenChange={(open) =>
                            setExpandedModules((s) => {
                              const next = new Set(s);
                              if (open) next.add(mod.id);
                              else next.delete(mod.id);
                              return next;
                            })
                          }
                        >
                          <div className="rounded border border-border bg-muted/20 mt-2">
                            <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/50">
                              <ChevronRight className={cn("h-3 w-3 transition-transform", isModOpen && "rotate-90")} />
                              {mod.title}
                              <span className="text-xs text-muted-foreground ml-auto">{lessons.length} lessons</span>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <ul className="list-none px-4 pb-2 pt-1">
                                {lessons.map((lesson) => (
                                  <li key={lesson.id} className="flex items-center gap-2 py-1.5 text-sm">
                                    <span className="flex-1 truncate">{lesson.title}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openLessonEditor(lesson)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title</Label>
              <Input
                value={lessonForm.title}
                onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={lessonForm.description}
                onChange={(e) => setLessonForm((f) => ({ ...f, description: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Content (Markdown)</Label>
              <Textarea
                value={lessonForm.content_markdown}
                onChange={(e) => setLessonForm((f) => ({ ...f, content_markdown: e.target.value }))}
                className="mt-1 min-h-[200px] font-mono text-sm"
                placeholder="# Heading&#10;&#10;Paragraph with **bold**..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLesson(null)}>Cancel</Button>
            <Button onClick={handleSaveLesson} disabled={updateLesson.isPending}>
              {updateLesson.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
