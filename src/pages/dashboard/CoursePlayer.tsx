import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseByCode } from "@/lib/courseCatalog";
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
  ChevronDown,
  ChevronRight,
  Loader2,
  FileText,
  CheckCircle2,
  Award,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlignedToCerts } from "@/components/dashboard/AlignedToCerts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LessonQuiz } from "@/components/dashboard/LessonQuiz";
import { SkillsYouWillGain } from "@/components/dashboard/SkillsYouWillGain";
import { CapstoneUpload } from "@/components/dashboard/CapstoneUpload";
import { PracticalSubmission } from "@/components/dashboard/PracticalSubmission";
import {
  getLesson,
  getCourseOutline,
  markLessonProgress,
  frappeKeys,
  type FrappeLesson,
  type FrappeChapter,
} from "@/lib/frappe";

// ─── Types ────────────────────────────────────────────────────────────────────

// course-code → Frappe slug fallback (catalog is authoritative, this is a safety net)
const FRAPPE_SLUG_FALLBACK: Record<string, string> = {
  "BH-BRIDGE":    "technical-readiness-bridge",
  "BH-FOUND-1":   "cybersecurity-foundations-i",
  "BH-FOUND-2":   "cybersecurity-foundations-ii",
  "BH-CYBER-2":   "core-cyber-foundations",
  "BH-OPS-2":     "practitioner-core-cyber-operations",
  "BH-SPEC-SOC":  "specialisation-soc-incident-response",
  "BH-ADV":       "advanced-leadership",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoursePlayer() {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // ch and ls are 1-based Frappe chapter/lesson indices — always in sync with Frappe
  const [selectedPos, setSelectedPos] = useState<{ ch: number; ls: number } | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);

  // Completion tracking keyed by Frappe lesson doc name (e.g. "0040 Capstone: ...")
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

  // ── Course metadata from static catalog ───────────────────────
  const catalogCourse = courseCode ? getCourseByCode(courseCode.toUpperCase()) : null;
  const courseLoading = false;

  // ── Frappe course slug ────────────────────────────────────────
  const frappeCourseSlug =
    catalogCourse?.frappe_name ??
    (courseCode ? FRAPPE_SLUG_FALLBACK[courseCode.toUpperCase()] ?? null : null);

  // ── Course outline from Frappe (replaces Supabase modules) ────
  const { data: frappeOutline, isLoading: outlineLoading } = useQuery<FrappeChapter[]>({
    queryKey: frappeKeys.courseOutline(frappeCourseSlug ?? ""),
    queryFn: () => getCourseOutline(frappeCourseSlug!),
    enabled: !!frappeCourseSlug,
    staleTime: 10 * 60 * 1000,
  });

  // ── Lesson content from Frappe ────────────────────────────────
  const { data: frappeLesson, isLoading: lessonLoading } = useQuery<FrappeLesson | null>({
    queryKey: frappeKeys.lesson(
      frappeCourseSlug ?? "",
      selectedPos?.ch ?? 0,
      selectedPos?.ls ?? 0
    ),
    queryFn: async () => {
      if (!frappeCourseSlug || !selectedPos) return null;
      return getLesson(frappeCourseSlug, selectedPos.ch, selectedPos.ls);
    },
    enabled: !!frappeCourseSlug && !!selectedPos,
    staleTime: 5 * 60 * 1000,
  });

  // ── Reset selection when course changes ───────────────────────
  useEffect(() => {
    setSelectedPos(null);
    setExpandedChapters([]);
    setCompletedSet(new Set());
  }, [frappeCourseSlug]);

  // ── Auto-select first lesson when outline loads ───────────────
  useEffect(() => {
    if (frappeOutline?.[0] && !selectedPos) {
      const first = frappeOutline[0];
      setSelectedPos({ ch: first.idx, ls: 1 });
      setExpandedChapters([first.idx]);
    }
  }, [frappeOutline]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Progress tracking ─────────────────────────────────────────
  const toggleCompletion = useMutation({
    mutationFn: async (vars: {
      lessonName: string;
      chapterNumber: number;
      lessonNumber: number;
    }) => {
      if (!user?.email) throw new Error("Sign in to save progress.");
      if (frappeCourseSlug && session?.access_token) {
        markLessonProgress(
          frappeCourseSlug,
          vars.chapterNumber,
          vars.lessonNumber,
          session.access_token
        ).catch(() => {});
      }
    },
    onSuccess: (_, vars) => {
      setCompletedSet((prev) => {
        const next = new Set(prev);
        next.add(vars.lessonName);
        return next;
      });
    },
    onError: (err) => {
      toast({
        title: "Could not save progress",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    },
  });

  // ── Derived values ────────────────────────────────────────────
  const totalLessons =
    frappeOutline?.reduce((acc, ch) => acc + ch.lessons.length, 0) ?? 0;
  const completedLessons = completedSet.size;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isLessonComplete = frappeLesson ? completedSet.has(frappeLesson.name) : false;
  const courseTitle =
    catalogCourse?.title ?? frappeCourseSlug?.replace(/-/g, " ") ?? "Course";

  // ── Loading / not-found states ───────────────────────────────
  if (courseLoading && !catalogCourse && !frappeCourseSlug) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!catalogCourse && !frappeCourseSlug) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/dashboard/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  // ── Curriculum sidebar (driven entirely by Frappe outline) ────
  const curriculumContent = outlineLoading ? (
    <div className="flex items-center gap-2 text-muted-foreground text-sm p-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading curriculum…
    </div>
  ) : (
    <div className="p-2">
      {(frappeOutline ?? []).map((chapter) => (
        <Collapsible
          key={chapter.idx}
          open={expandedChapters.includes(chapter.idx)}
          onOpenChange={(open) =>
            setExpandedChapters(
              open
                ? [...expandedChapters, chapter.idx]
                : expandedChapters.filter((i) => i !== chapter.idx)
            )
          }
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-muted/50 text-left">
            {expandedChapters.includes(chapter.idx) ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-medium text-foreground text-sm flex-1">
              {chapter.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {chapter.lessons.filter((l) => completedSet.has(l.name)).length}/
              {chapter.lessons.length}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-6 space-y-1">
              {chapter.lessons.map((lesson) => {
                const isComplete = completedSet.has(lesson.name);
                const isSelected =
                  selectedPos?.ch === chapter.idx && selectedPos?.ls === lesson.idx;
                return (
                  <div
                    key={lesson.name}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setSelectedPos({ ch: chapter.idx, ls: lesson.idx });
                      if (isMobile) setMobileCurriculumOpen(false);
                    }}
                  >
                    <Checkbox
                      checked={isComplete}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleCompletion.mutate({
                            lessonName: lesson.name,
                            chapterNumber: chapter.idx,
                            lessonNumber: lesson.idx,
                          });
                        }
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
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );

  // ── Lesson content panel ──────────────────────────────────────
  const lessonTitle = frappeLesson?.title ?? "Select a lesson";
  const examAlignment = frappeLesson?.custom_exam_alignment ?? null;
  const isCapstone = !!frappeLesson?.title?.toLowerCase().includes("capstone");

  const lessonContent = (
    <div className="space-y-4">
      {/* Title + exam alignment */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">{lessonTitle}</h2>
        {examAlignment && (
          <div className="mt-3 flex flex-wrap items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Award className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Exam relevance</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {examAlignment
                .split(/;\s*/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((obj) => (
                  <span
                    key={obj}
                    className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {obj}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Video embed */}
      {frappeLesson?.youtube && (
        <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
          <iframe
            src={
              frappeLesson.youtube.includes("youtube.com") ||
              frappeLesson.youtube.includes("youtu.be")
                ? `https://www.youtube.com/embed/${frappeLesson.youtube
                    .replace(/.*[?&v=]([^&]+).*/, "$1")
                    .replace(/.*youtu\.be\//, "")}`
                : frappeLesson.youtube
            }
            className="w-full h-full"
            allowFullScreen
            title={lessonTitle}
          />
        </div>
      )}

      {/* Capstone upload — shown at the top so students see it before the brief */}
      {isCapstone && frappeCourseSlug && courseCode && (
        <CapstoneUpload
          course={frappeCourseSlug}
          courseCode={courseCode.toUpperCase()}
          lesson={frappeLesson?.name}
        />
      )}

      {/* Lesson body */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">
            {isCapstone ? "Assignment brief" : "Lesson content"}
          </h3>
        </div>

        {lessonLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading content from Frappe LMS…
          </div>
        ) : frappeLesson?.body ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none
              prose-headings:font-semibold
              prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2
              prose-h3:text-base prose-h3:mt-4 prose-h3:mb-1
              prose-p:text-foreground prose-li:text-foreground
              prose-strong:text-foreground prose-code:text-primary
              prose-pre:bg-muted prose-pre:text-foreground
              prose-ol:list-decimal prose-ul:list-disc"
            dangerouslySetInnerHTML={{ __html: frappeLesson.body }}
          />
        ) : !frappeCourseSlug ? (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This course is not yet linked to Frappe LMS.
          </p>
        ) : selectedPos ? (
          <p className="text-muted-foreground italic text-sm">
            No content for this lesson yet.
          </p>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            Select a lesson from the curriculum.
          </p>
        )}
      </div>

      {/* Skills */}
      {catalogCourse?.skills && catalogCourse.skills.length > 0 && (
        <SkillsYouWillGain skills={catalogCourse.skills} />
      )}

      {/* Quiz */}
      {frappeLesson?.quiz_id && (
        <LessonQuiz
          frappeQuizId={frappeLesson.quiz_id}
          onPass={() =>
            selectedPos &&
            frappeLesson &&
            toggleCompletion.mutate({
              lessonName: frappeLesson.name,
              chapterNumber: selectedPos.ch,
              lessonNumber: selectedPos.ls,
            })
          }
          alreadyCompleted={isLessonComplete}
        />
      )}

      {/* Practical submission */}
      {frappeLesson?.title?.startsWith("Practical:") && frappeCourseSlug && (
        <PracticalSubmission
          course={frappeCourseSlug}
          lesson={frappeLesson.name}
        />
      )}

      {/* Mark as complete */}
      {frappeLesson && (
        <div className="rounded-xl border border-border bg-card p-4">
          {isLessonComplete ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              This lesson is marked complete.
            </p>
          ) : (
            <Button
              onClick={() =>
                selectedPos &&
                frappeLesson &&
                toggleCompletion.mutate({
                  lessonName: frappeLesson.name,
                  chapterNumber: selectedPos.ch,
                  lessonNumber: selectedPos.ls,
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
            {courseTitle}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs sm:text-sm">
              {completedLessons}/{totalLessons} lessons
            </span>
            <Progress value={progressPercent} className="w-16 sm:w-24 h-2" />
            <span className="text-xs sm:text-sm">{progressPercent}%</span>
          </div>
          <AlignedToCerts
            certifications={catalogCourse?.aligned_certifications ?? []}
            className="mt-1"
          />
        </div>
        {frappeCourseSlug && (
          <a
            href={`${import.meta.env.VITE_FRAPPE_URL}/courses/${frappeCourseSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Video className="h-3 w-3" />
            Frappe LMS
          </a>
        )}
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

      {/* Main content */}
      {isMobile ? (
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
        <div className="flex-1 pt-4 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="h-full flex flex-col gap-4 pr-4 overflow-hidden">
                <ScrollArea className="flex-1 min-h-0 pr-4">{lessonContent}</ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full flex flex-col gap-4 pl-2">
                <div className="flex-1 min-h-0 rounded-xl border border-border bg-card flex flex-col">
                  <div className="p-4 border-b border-border shrink-0">
                    <h3 className="font-semibold text-foreground">Curriculum</h3>
                  </div>
                  <ScrollArea className="flex-1">{curriculumContent}</ScrollArea>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}
