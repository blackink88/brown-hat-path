import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Play, Loader2, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TrackPickerDialog } from "@/components/dashboard/TrackPickerDialog";
import { AlignedToCerts } from "@/components/dashboard/AlignedToCerts";
import {
  getCourses,
  enrollInCourse,
  listEnrollments,
  frappeKeys,
  type FrappeCourse,
  type FrappeEnrollment,
} from "@/lib/frappe";
import { getCourseByFrappeName, COURSES_ORDERED } from "@/lib/courseCatalog";

const levelLabels: Record<number, string> = {
  0: "Bridge",
  1: "Foundations",
  2: "Core",
  3: "Practitioner",
  4: "Specialisation",
  5: "Advanced",
};

// Track selection stored in localStorage (no Supabase profiles needed)
function getTrack(level: 3 | 4): string | null {
  return localStorage.getItem(level === 3 ? "practitioner_track" : "specialisation_track");
}
function setTrack(level: 3 | 4, track: string) {
  localStorage.setItem(level === 3 ? "practitioner_track" : "specialisation_track", track);
}

export default function MyCourses() {
  const { session, tierLevel } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const accessToken = session?.access_token ?? "";

  // ── Course catalog from Frappe LMS ─────────────────────────────
  const { data: frappeCourses, isLoading: coursesLoading } = useQuery({
    queryKey: frappeKeys.courses(),
    queryFn: getCourses,
    staleTime: 5 * 60 * 1000,
  });

  // ── All enrollments from Frappe ─────────────────────────────────
  const { data: frappeEnrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: frappeKeys.enrollments(),
    queryFn: () => listEnrollments(accessToken),
    enabled: !!accessToken,
  });

  // Map: frappe course name → enrollment (for O(1) lookup)
  const enrollmentMap = useMemo(
    () => new Map<string, FrappeEnrollment>(frappeEnrollments.map((e) => [e.course, e])),
    [frappeEnrollments],
  );

  // ── Enroll in Frappe ────────────────────────────────────────────
  const enrollMutation = useMutation({
    mutationFn: async (frappeName: string) => {
      if (!accessToken) throw new Error("Sign in to enroll.");
      if (!canEnrollInMore) throw new Error("Finish your current course first.");
      await enrollInCourse(frappeName, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frappeKeys.enrollments() });
      toast({ title: "Enrolled", description: "You can start the course now." });
    },
    onError: (e) =>
      toast({ title: "Enrollment failed", description: String((e as Error).message), variant: "destructive" }),
  });

  const [trackPickerOpen, setTrackPickerOpen] = useState(false);
  const [trackPickerLevel, setTrackPickerLevel] = useState<3 | 4>(3);
  const [pendingEnrollName, setPendingEnrollName] = useState<string | null>(null);

  const enrollWithTrackMutation = useMutation({
    mutationFn: async ({ frappeName, level, track }: { frappeName: string; level: 3 | 4; track: string }) => {
      if (!accessToken) throw new Error("Sign in to enroll.");
      if (!canEnrollInMore) throw new Error("Finish your current course first.");
      setTrack(level, track);
      await enrollInCourse(frappeName, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frappeKeys.enrollments() });
      setTrackPickerOpen(false);
      setPendingEnrollName(null);
      toast({ title: "Enrolled", description: "You can start the course now." });
    },
    onError: (e) =>
      toast({ title: "Enrollment failed", description: String((e as Error).message), variant: "destructive" }),
  });

  // ── Helpers ────────────────────────────────────────────────────

  const isEnrolled = (frappeCourse: FrappeCourse) => enrollmentMap.has(frappeCourse.name);
  const getProgress = (frappeCourse: FrappeCourse) => enrollmentMap.get(frappeCourse.name)?.progress ?? 0;

  const enrolledCourses = (frappeCourses ?? []).filter(isEnrolled);
  const hasIncompleteEnrollment = enrolledCourses.some((c) => getProgress(c) < 100);
  const canEnrollInMore = !hasIncompleteEnrollment;

  let availableCourses = (frappeCourses ?? []).filter((c) => !isEnrolled(c));

  // Filter by track selection using catalog metadata
  availableCourses = availableCourses.filter((c) => {
    const catalog = getCourseByFrappeName(c.name);
    if (!catalog) return true;
    const savedTrack = catalog.level === 3 ? getTrack(3) : catalog.level === 4 ? getTrack(4) : null;
    if (savedTrack && catalog.track) return catalog.track === savedTrack;
    return true;
  });

  const handleEnrollClick = (frappeCourse: FrappeCourse) => {
    const catalog = getCourseByFrappeName(frappeCourse.name);
    if (catalog?.level === 3 && !getTrack(3)) {
      setTrackPickerLevel(3);
      setPendingEnrollName(frappeCourse.name);
      setTrackPickerOpen(true);
      return;
    }
    if (catalog?.level === 4 && !getTrack(4)) {
      setTrackPickerLevel(4);
      setPendingEnrollName(frappeCourse.name);
      setTrackPickerOpen(true);
      return;
    }
    enrollMutation.mutate(frappeCourse.name);
  };

  const handleTrackSelect = (track: string) => {
    if (!pendingEnrollName) return;
    enrollWithTrackMutation.mutate({ frappeName: pendingEnrollName, level: trackPickerLevel, track });
  };

  // Course URL: uses catalog code for routing
  const courseUrl = (frappeCourse: FrappeCourse) => {
    const catalog = getCourseByFrappeName(frappeCourse.name);
    return catalog ? `/dashboard/course/${catalog.code.toLowerCase()}` : "#";
  };

  const isLoading = coursesLoading || (!!accessToken && enrollmentsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────

  const renderCourseCard = (frappeCourse: FrappeCourse, enrolled: boolean) => {
    const catalog = getCourseByFrappeName(frappeCourse.name);
    const level = catalog?.level ?? 0;
    const requiredTier = catalog?.required_tier_level ?? 1;
    const isLocked = requiredTier > tierLevel;
    const progress = getProgress(frappeCourse);
    const certs = (catalog?.aligned_certifications ?? []) as string[];

    return (
      <div
        key={frappeCourse.name}
        className={cn(
          "rounded-xl border bg-card overflow-hidden",
          isLocked && !enrolled ? "border-border opacity-70" : "border-border hover:shadow-lg transition-shadow"
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "h-32 flex items-center justify-center relative",
            enrolled ? "bg-gradient-to-br from-primary/20 to-accent/20" : isLocked ? "bg-muted/50" : "bg-gradient-to-br from-muted to-muted/50"
          )}
          style={frappeCourse.image ? { backgroundImage: `url(${frappeCourse.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {!frappeCourse.image && (
            <span className="text-lg font-mono font-bold text-primary">
              {catalog?.code ?? frappeCourse.name.slice(0, 8).toUpperCase()}
            </span>
          )}
          {isLocked && !enrolled && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{frappeCourse.title}</h3>
            <Badge variant={enrolled ? "secondary" : "outline"} className="shrink-0">
              {levelLabels[level]}
            </Badge>
          </div>

          {frappeCourse.short_introduction && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {frappeCourse.short_introduction}
            </p>
          )}

          <AlignedToCerts certifications={certs} className="mb-2" />

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {frappeCourse.lessons > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {frappeCourse.lessons} lessons
              </span>
            )}
            {frappeCourse.enrollments > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {frappeCourse.enrollments} enrolled
              </span>
            )}
          </div>

          {enrolled && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {enrolled ? (
            <Button className="w-full" asChild>
              <Link to={courseUrl(frappeCourse)}>
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Link>
            </Button>
          ) : isLocked ? (
            <Button variant="outline" className="w-full" asChild>
              <Link to="/pricing">
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to access
              </Link>
            </Button>
          ) : !canEnrollInMore ? (
            <Button variant="secondary" className="w-full" disabled>
              Finish current course first
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              disabled={enrollMutation.isPending || enrollWithTrackMutation.isPending}
              onClick={() => handleEnrollClick(frappeCourse)}
            >
              {(enrollMutation.isPending || enrollWithTrackMutation.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {tierLevel === 0 && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-foreground">
            Subscribe to a plan to access courses. Your access is based on your subscription tier.
          </p>
          <Button asChild variant="default">
            <Link to="/pricing">View plans</Link>
          </Button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">
          Track your progress across all enrolled courses. Access is based on your subscription tier.
        </p>
      </div>

      {/* Enrolled */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground mb-2">You haven't enrolled in any courses yet.</p>
            <p className="text-sm text-muted-foreground">Courses you enroll in will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((c) => renderCourseCard(c, true))}
          </div>
        )}
      </div>

      {/* Available */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Courses</h2>
        {hasIncompleteEnrollment && (
          <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 mb-4 flex items-center gap-3">
            <p className="text-sm text-foreground flex-1">
              Finish your current course before enrolling in another.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to={courseUrl(enrolledCourses[0])}>Continue course</Link>
            </Button>
          </div>
        )}
        {availableCourses.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground">No additional courses available right now.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((c) => renderCourseCard(c, false))}
          </div>
        )}
      </div>

      <TrackPickerDialog
        open={trackPickerOpen}
        onOpenChange={setTrackPickerOpen}
        level={trackPickerLevel}
        onSelect={handleTrackSelect}
        isLoading={enrollWithTrackMutation.isPending}
      />
    </div>
  );
}
