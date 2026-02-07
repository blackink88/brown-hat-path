import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function CoursePlayer() {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Fetch course with modules and lessons
  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", courseCode],
    queryFn: async () => {
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .ilike("code", courseCode || "")
        .single();

      if (courseError) throw courseError;

      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", course.id)
        .order("order_index");

      if (modulesError) throw modulesError;

      // Sort lessons within each module
      const sortedModules = modules.map((m) => ({
        ...m,
        lessons: m.lessons.sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      }));

      return { course, modules: sortedModules };
    },
    enabled: !!courseCode,
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id, completed")
        .eq("user_id", user?.id || "");

      if (error) throw error;
      return data.reduce(
        (acc, p) => ({ ...acc, [p.lesson_id]: p.completed }),
        {} as Record<string, boolean>
      );
    },
    enabled: !!user,
  });

  // Toggle lesson completion
  const toggleCompletion = useMutation({
    mutationFn: async ({
      lessonId,
      completed,
    }: {
      lessonId: string;
      completed: boolean;
    }) => {
      if (completed) {
        await supabase.from("user_progress").upsert({
          user_id: user?.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      } else {
        await supabase
          .from("user_progress")
          .update({ completed: false, completed_at: null })
          .eq("user_id", user?.id)
          .eq("lesson_id", lessonId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
  });

  // Set first lesson as selected when course data loads or course changes
  useEffect(() => {
    if (courseData?.modules?.[0]?.lessons?.[0]) {
      setSelectedLesson(courseData.modules[0].lessons[0].id);
      setExpandedModules([courseData.modules[0].id]);
    }
  }, [courseCode, courseData?.course?.id]);

  const currentLesson = courseData?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === selectedLesson);

  // Calculate progress
  const totalLessons =
    courseData?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  const completedLessons =
    courseData?.modules
      .flatMap((m) => m.lessons)
      .filter((l) => userProgress?.[l.id]).length || 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/dashboard/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/courses">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-foreground truncate">
            {courseData.course.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {completedLessons}/{totalLessons} lessons
            </span>
            <Progress value={progressPercent} className="w-24 h-2" />
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 pt-4 overflow-hidden">
        {/* Left: Video + Notes */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-foreground/5 rounded-xl flex items-center justify-center mb-4 border border-border">
            {currentLesson?.video_url ? (
              <iframe
                src={currentLesson.video_url}
                className="w-full h-full rounded-xl"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <Play className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>Video coming soon</p>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {currentLesson?.title || "Select a lesson"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {currentLesson?.description}
            </p>
          </div>

          {/* Notes Area */}
          <div className="flex-1 rounded-xl border border-border bg-card p-4 overflow-auto">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Lesson Notes</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {currentLesson?.content_markdown ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.content_markdown,
                  }}
                />
              ) : (
                <p className="text-muted-foreground italic">
                  Notes will appear here when you start the lesson.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Curriculum */}
        <div className="w-80 shrink-0 rounded-xl border border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Curriculum</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {courseData.modules.map((module) => (
                <Collapsible
                  key={module.id}
                  open={expandedModules.includes(module.id)}
                  onOpenChange={(open) => {
                    setExpandedModules(
                      open
                        ? [...expandedModules, module.id]
                        : expandedModules.filter((id) => id !== module.id)
                    );
                  }}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-muted/50 text-left">
                    {expandedModules.includes(module.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="font-medium text-foreground text-sm flex-1">
                      {module.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.filter((l: { id: string }) => userProgress?.[l.id])
                        .length}
                      /{module.lessons.length}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-6 space-y-1">
                      {module.lessons.map(
                        (lesson: {
                          id: string;
                          title: string;
                          duration_minutes: number | null;
                        }) => {
                          const isComplete = userProgress?.[lesson.id];
                          const isSelected = selectedLesson === lesson.id;
                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                                isSelected
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted/50"
                              )}
                              onClick={() => setSelectedLesson(lesson.id)}
                            >
                              <Checkbox
                                checked={isComplete}
                                onCheckedChange={(checked) => {
                                  toggleCompletion.mutate({
                                    lessonId: lesson.id,
                                    completed: checked as boolean,
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0"
                              />
                              <span
                                className={cn(
                                  "text-sm flex-1 truncate",
                                  isComplete && "line-through text-muted-foreground"
                                )}
                              >
                                {lesson.title}
                              </span>
                              {lesson.duration_minutes && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration_minutes}m
                                </span>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
