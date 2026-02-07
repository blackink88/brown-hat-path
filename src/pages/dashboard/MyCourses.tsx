import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Play, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const levelLabels: Record<number, string> = {
  0: "Bridge",
  1: "Foundations",
  2: "Core",
  3: "Practitioner",
  4: "Specialisation",
  5: "Advanced",
};

export default function MyCourses() {
  const { data: courses, isLoading } = useQuery({
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

  // Mock enrollment data - replace with real data
  const enrolledCourseIds = ["BH-BRIDGE", "BH-FOUND-1"];
  const courseProgress: Record<string, number> = {
    "BH-BRIDGE": 35,
    "BH-FOUND-1": 10,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const enrolledCourses = courses?.filter((c) => enrolledCourseIds.includes(c.code)) ?? [];
  const availableCourses = courses?.filter((c) => !enrolledCourseIds.includes(c.code)) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">
          Track your progress across all enrolled courses.
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {course.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {levelLabels[course.level]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {courseProgress[course.code] || 0}%
                      </span>
                    </div>
                    <Progress value={courseProgress[course.code] || 0} className="h-2" />
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
        {availableCourses.length === 0 && (!courses || courses.length === 0) ? (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground">No courses available right now.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later or contact support.</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCourses.map((course) => {
              const isLocked = course.required_tier_level > 1; // Simplified check
              return (
                <div
                  key={course.id}
                  className={cn(
                    "rounded-xl border bg-card overflow-hidden",
                    isLocked ? "border-border opacity-60" : "border-border hover:shadow-lg transition-shadow"
                  )}
                >
                  <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
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
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {course.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0">
                        {levelLabels[course.level]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span>{course.duration_hours} hours</span>
                    </div>
                    <Button
                      variant={isLocked ? "outline" : "secondary"}
                      className="w-full"
                      disabled={isLocked}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Upgrade to Unlock
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
        )}
      </div>
    </div>
  );
}
