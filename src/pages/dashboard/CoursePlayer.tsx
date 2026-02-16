import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  ChevronLeft,
  Clock,
  ChevronDown,
  ChevronRight,
  Loader2,
  FileText,
  CheckCircle2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlignedToCerts } from "@/components/dashboard/AlignedToCerts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LessonQuiz } from "@/components/dashboard/LessonQuiz";
import { SkillsYouWillGain } from "@/components/dashboard/SkillsYouWillGain";
import { CapstoneUpload } from "@/components/dashboard/CapstoneUpload";
import { PracticalSubmission } from "@/components/dashboard/PracticalSubmission";

export default function CoursePlayer() {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const isMobile = useIsMobile();

  // Fetch user role to control rubric visibility
  const { data: userRole } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      if (error) return null;
      return data?.role as string | null;
    },
    enabled: !!user?.id,
  });

  const isInstructor = userRole === "admin" || userRole === "tutor";

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
      const list = data ?? [];
      return list.reduce(
        (acc, p) => ({ ...acc, [p.lesson_id]: !!p.completed }),
        {} as Record<string, boolean>
      );
    },
    enabled: !!user?.id,
  });

  // Toggle lesson completion using direct upsert
  const toggleCompletion = useMutation({
    mutationFn: async ({
      lessonId,
      completed,
    }: {
      lessonId: string;
      completed: boolean;
    }) => {
      if (!user?.id) throw new Error("You must be signed in to save progress.");
      const payload = {
        user_id: user.id,
        lesson_id: lessonId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from("user_progress").upsert(payload, {
        onConflict: "user_id,lesson_id",
      });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Record<string, boolean>>(
        ["userProgress", user?.id],
        (prev) => ({
          ...(prev ?? {}),
          [variables.lessonId]: variables.completed,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
    onError: (err) => {
      toast({
        title: "Could not save progress",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
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

  const isLessonComplete = selectedLesson ? !!userProgress?.[selectedLesson] : false;

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

  const curriculumContent = (
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
                      onClick={() => {
                        setSelectedLesson(lesson.id);
                        if (isMobile) setMobileCurriculumOpen(false);
                      }}
                    >
                      <Checkbox
                        checked={isComplete}
                        onCheckedChange={(checked) => {
                          toggleCompletion.mutate({
                            lessonId: lesson.id,
                            completed: checked === true,
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
  );

  const lessonContent = (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {currentLesson?.title || "Select a lesson"}
        </h2>
        {currentLesson?.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {currentLesson.description}
          </p>
        )}
        {currentLesson?.exam_alignment && (
          <div className="mt-3 flex flex-wrap items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Award className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Exam relevance</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(currentLesson.exam_alignment
                .split(/;\s*/)
                .map((s) => s.trim())
                .filter(Boolean) as string[]).map((objective) => (
                <span
                  key={objective}
                  className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {objective}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Lesson content</h3>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          {currentLesson?.content_markdown ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {(() => {
                const md = currentLesson.content_markdown;
                // Hide "## Marking Rubric" section from students
                if (!isInstructor) {
                  const rubricIdx = md.indexOf("## Marking Rubric");
                  if (rubricIdx !== -1) return md.slice(0, rubricIdx).trimEnd();
                }
                return md;
              })()}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              No content for this lesson yet.
            </p>
          )}
        </div>
      </div>

      {/* Skills You Will Gain - Course Level */}
      {Array.isArray(courseData.course.skills) && courseData.course.skills.length > 0 && (
        <SkillsYouWillGain skills={courseData.course.skills as string[]} />
      )}

      {/* Lesson quiz (when we have quiz data) */}
      {currentLesson && (
        <LessonQuiz
          lessonId={currentLesson.id}
          onPass={() =>
            toggleCompletion.mutate({
              lessonId: currentLesson.id,
              completed: true,
            })
          }
          alreadyCompleted={!!userProgress?.[currentLesson.id]}
        />
      )}

      {/* Practical submission - text answers for "Practical:" lessons */}
      {currentLesson?.title?.startsWith("Practical:") && (
        <PracticalSubmission lessonId={currentLesson.id} />
      )}

      {/* Capstone upload - PDF upload for "Capstone:" lessons */}
      {currentLesson?.title?.startsWith("Capstone:") && courseCode && (
        <CapstoneUpload
          lessonId={currentLesson.id}
          courseCode={courseCode.toUpperCase()}
        />
      )}

      {/* Mark as complete */}
      {currentLesson && (
        <div className="rounded-xl border border-border bg-card p-4">
          {isLessonComplete ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              This lesson is marked complete.
            </p>
          ) : (
            <Button
              onClick={() =>
                toggleCompletion.mutate({
                  lessonId: currentLesson.id,
                  completed: true,
                })
              }
              disabled={toggleCompletion.isPending}
              className="w-full sm:w-auto"
            >
              {toggleCompletion.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Mark as complete
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("flex flex-col", isMobile ? "min-h-0" : "h-[calc(100vh-8rem)]")}>
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-border">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/courses">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-foreground truncate text-sm sm:text-base">
            {courseData.course.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs sm:text-sm">
              {completedLessons}/{totalLessons} lessons
            </span>
            <Progress value={progressPercent} className="w-16 sm:w-24 h-2" />
            <span className="text-xs sm:text-sm">{progressPercent}%</span>
          </div>
          <AlignedToCerts certifications={courseData.course.aligned_certifications ?? []} className="mt-1" />
        </div>
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileCurriculumOpen(!mobileCurriculumOpen)}
          >
            {mobileCurriculumOpen ? "Lesson" : "Curriculum"}
          </Button>
        )}
      </div>

      {/* Main Content */}
      {isMobile ? (
        /* Mobile: stacked layout with toggle */
        <div className="flex-1 pt-4">
          {mobileCurriculumOpen ? (
            <div className="rounded-xl border border-border bg-card">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Curriculum</h3>
              </div>
              {curriculumContent}
            </div>
          ) : (
            lessonContent
          )}
        </div>
      ) : (
        /* Desktop: resizable split pane */
        <div className="flex-1 pt-4 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="h-full flex flex-col gap-4 pr-4 overflow-hidden">
                <ScrollArea className="flex-1 min-h-0 pr-4">
                  {lessonContent}
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full flex flex-col gap-4 pl-2">
                <div className="flex-1 min-h-0 rounded-xl border border-border bg-card flex flex-col">
                  <div className="p-4 border-b border-border shrink-0">
                    <h3 className="font-semibold text-foreground">Curriculum</h3>
                  </div>
                  <ScrollArea className="flex-1">
                    {curriculumContent}
                  </ScrollArea>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}
