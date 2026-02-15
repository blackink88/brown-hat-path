import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SkillsYouWillGain } from "@/components/dashboard/SkillsYouWillGain";
import { TrackPickerDialog } from "@/components/dashboard/TrackPickerDialog";
import { AlignedToCerts } from "@/components/dashboard/AlignedToCerts";

const levelLabels: Record<number, string> = {
  0: "Bridge",
  1: "Foundations",
  2: "Core",
  3: "Practitioner",
  4: "Specialisation",
  5: "Advanced",
};

export default function MyCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, practitioner_track, specialisation_track")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: userTierLevel = 0 } = useQuery({
    queryKey: ["userTierLevel", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_tier_level", {
        _user_id: user!.id,
      });
      if (error) throw error;
      return typeof data === "number" ? data : 0;
    },
    enabled: !!user?.id,
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["courseEnrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", user?.id ?? "");
      if (error) throw error;
      return (data ?? []).map((e) => e.course_id);
    },
    enabled: !!user?.id,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user?.id ?? "")
        .eq("completed", true);
      if (error) throw error;
      return new Set((data ?? []).map((p) => p.lesson_id));
    },
    enabled: !!user?.id,
  });

  const { data: lessonCourseMap } = useQuery({
    queryKey: ["lessonCourseMap"],
    queryFn: async () => {
      const { data: modules, error: modErr } = await supabase
        .from("modules")
        .select("id, course_id");
      if (modErr) throw modErr;
      const { data: lessons, error: lessErr } = await supabase
        .from("lessons")
        .select("id, module_id");
      if (lessErr) throw lessErr;
      const moduleToCourse = new Map((modules ?? []).map((m) => [m.id, m.course_id]));
      const map: Record<string, string> = {};
      (lessons ?? []).forEach((l) => {
        const courseId = moduleToCourse.get(l.module_id);
        if (courseId) map[l.id] = courseId;
      });
      return map;
    },
  });

  const courseProgress: Record<string, number> = (() => {
    if (!courses || !lessonCourseMap) return {};
    // Ensure progressSet is always a Set, even if userProgress is cached in wrong format
    const progressSet = userProgress instanceof Set ? userProgress : new Set<string>();
    const byCourse: Record<string, { total: number; completed: number }> = {};
    courses.forEach((c) => {
      byCourse[c.id] = { total: 0, completed: 0 };
    });
    Object.entries(lessonCourseMap).forEach(([lessonId, courseId]) => {
      if (byCourse[courseId]) {
        byCourse[courseId].total += 1;
        if (progressSet.has(lessonId)) byCourse[courseId].completed += 1;
      }
    });
    const out: Record<string, number> = {};
    Object.entries(byCourse).forEach(([courseId, { total, completed }]) => {
      out[courseId] = total > 0 ? Math.round((completed / total) * 100) : 0;
    });
    return out;
  })();

  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) throw new Error("You must be signed in to enroll.");
      if (!canEnrollInMore) {
        throw new Error("Finish your current course before enrolling in another.");
      }
      const { error } = await supabase.from("course_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseEnrollments", user?.id] });
      toast({ title: "Enrolled", description: "You can start the course now." });
    },
    onError: (e) =>
      toast({ title: "Enrollment failed", description: String(e.message), variant: "destructive" }),
  });

  const enrolledCourseIds = new Set(enrollments ?? []);
  const enrolledCourses = courses?.filter((c) => enrolledCourseIds.has(c.id)) ?? [];
  let availableCourses = courses?.filter((c) => !enrolledCourseIds.has(c.id)) ?? [];

  // Filter by track: once practitioner_track or specialisation_track is set, only show the matching course(s)
  availableCourses = availableCourses.filter((c) => {
    if (c.level === 3 && profile?.practitioner_track) return (c as { track?: string | null }).track === profile.practitioner_track;
    if (c.level === 4 && profile?.specialisation_track) return (c as { track?: string | null }).track === profile.specialisation_track;
    return true;
  });

  const [trackPickerOpen, setTrackPickerOpen] = useState(false);
  const [trackPickerLevel, setTrackPickerLevel] = useState<3 | 4>(3);

  const updateProfileTrack = useMutation({
    mutationFn: async ({
      profileId,
      level,
      track,
    }: { profileId: string; level: 3 | 4; track: string }) => {
      const col = level === 3 ? "practitioner_track" : "specialisation_track";
      const { error } = await supabase.from("profiles").update({ [col]: track }).eq("id", profileId);
      if (error) throw error;
    },
    onSuccess: (_, { level }) => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      if (level === 3) queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (e) =>
      toast({ title: "Could not save track", description: String(e.message), variant: "destructive" }),
  });

  const enrollInCourseWithTrack = useMutation({
    mutationFn: async ({ courseId, profileId, level, track }: { courseId?: string; profileId: string; level: 3 | 4; track: string }) => {
      if (!user?.id) throw new Error("You must be signed in to enroll.");
      if (!canEnrollInMore) throw new Error("Finish your current course before enrolling in another.");
      const col = level === 3 ? "practitioner_track" : "specialisation_track";
      const { error: updateErr } = await supabase.from("profiles").update({ [col]: track }).eq("id", profileId);
      if (updateErr) throw updateErr;
      const courseToEnroll = courseId ?? courses?.find((c) => c.level === level && (c as { track?: string | null }).track === track)?.id;
      if (!courseToEnroll) throw new Error("Course not found for this track.");
      const { error } = await supabase.from("course_enrollments").insert({
        user_id: user.id,
        course_id: courseToEnroll,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseEnrollments", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setTrackPickerOpen(false);
      toast({ title: "Enrolled", description: "You can start the course now." });
    },
    onError: (e) =>
      toast({ title: "Enrollment failed", description: String(e.message), variant: "destructive" }),
  });

  const handleEnrollClick = (course: { id: string; level: number; track?: string | null }) => {
    if (course.level === 3 && !profile?.practitioner_track) {
      setTrackPickerLevel(3);
      setTrackPickerOpen(true);
      return;
    }
    if (course.level === 4 && !profile?.specialisation_track) {
      setTrackPickerLevel(4);
      setTrackPickerOpen(true);
      return;
    }
    enrollInCourse.mutate(course.id);
  };

  const handleTrackSelect = (track: string) => {
    if (!profile?.id) return;
    enrollInCourseWithTrack.mutate({ profileId: profile.id, level: trackPickerLevel, track });
  };

  // User may only have one active enrollment; must finish (100%) before enrolling in another
  const hasIncompleteEnrollment = enrolledCourses.some(
    (c) => (courseProgress[c.id] ?? 0) < 100
  );
  const canEnrollInMore = !hasIncompleteEnrollment;

  const isLoading = coursesLoading || (!!user && enrollmentsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {userTierLevel === 0 && (
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

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Enrolled Courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground mb-2">You haven't enrolled in any courses yet.</p>
            <p className="text-sm text-muted-foreground">Courses you enroll in will appear here with your progress.</p>
          </div>
        ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-lg font-mono font-bold text-primary">
                    {course.code}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {course.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {levelLabels[course.level]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {course.description}
                  </p>
                  {/* Skills You Will Gain */}
                  {Array.isArray(course.skills) && course.skills.length > 0 && (
                    <div className="mb-2">
                      <SkillsYouWillGain skills={course.skills as string[]} compact />
                    </div>
                  )}
                  <AlignedToCerts certifications={course.aligned_certifications ?? []} className="mb-2" />
                  {course.duration_hours != null && course.duration_hours > 0 && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Est. {course.duration_hours} hours
                    </p>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {courseProgress[course.id] ?? 0}%
                      </span>
                    </div>
                    <Progress value={courseProgress[course.id] ?? 0} className="h-2" />
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/dashboard/course/${(course.code ?? "").toLowerCase()}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
        </div>
        )}
      </div>

      {/* Available Courses */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Available Courses
        </h2>
        {hasIncompleteEnrollment && (
          <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 mb-4 flex items-center gap-3">
            <p className="text-sm text-foreground flex-1">
              Finish your current course before enrolling in another. Complete all lessons to 100% to unlock the next course.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/dashboard/course/${(enrolledCourses[0]?.code ?? "").toLowerCase()}`}>
                Continue course
              </Link>
            </Button>
          </div>
        )}
        {availableCourses.length === 0 && (!courses || courses.length === 0) ? (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground">No courses available right now.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later or contact support.</p>
          </div>
        ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableCourses.map((course) => {
              const isLocked = course.required_tier_level > userTierLevel;
              return (
                <div
                  key={course.id}
                  className={cn(
                    "rounded-xl border bg-card",
                    isLocked ? "border-border opacity-70" : "border-border hover:shadow-lg transition-shadow"
                  )}
                >
                  <div className={cn("h-32 flex items-center justify-center relative", isLocked ? "bg-muted/50" : "bg-gradient-to-br from-muted to-muted/50")}>
                    <span className="text-lg font-mono font-bold text-muted-foreground">
                      {course.code}
                    </span>
                    {isLocked && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0">
                        {levelLabels[course.level]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {course.description}
                    </p>
                    {/* Skills You Will Gain */}
                    {Array.isArray(course.skills) && course.skills.length > 0 && (
                      <div className="mb-2">
                        <SkillsYouWillGain skills={course.skills as string[]} compact />
                      </div>
                    )}
                    <AlignedToCerts certifications={course.aligned_certifications ?? []} className="mb-2" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground mb-3">
                      <span>
                        {course.duration_hours != null
                          ? `Est. ${course.duration_hours} hours`
                          : "-"}
                      </span>
                    </div>
                    {isLocked ? (
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
                        disabled={enrollInCourse.isPending || enrollInCourseWithTrack.isPending}
                        onClick={() => handleEnrollClick(course)}
                      >
                        {(enrollInCourse.isPending || enrollInCourseWithTrack.isPending) ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        )}
      </div>

      <TrackPickerDialog
        open={trackPickerOpen}
        onOpenChange={setTrackPickerOpen}
        level={trackPickerLevel}
        onSelect={handleTrackSelect}
        isLoading={enrollInCourseWithTrack.isPending}
      />
    </div>
  );
}
