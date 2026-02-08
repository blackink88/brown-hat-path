import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type StageKey = "bridge" | "foundations" | "core_cyber" | "specialist";

export interface StageRequirement {
  id: string;
  stage_key: StageKey;
  stage_name: string;
  stage_level: number;
  required_courses: string[];
  min_assessment_score: number;
  prerequisite_stage: string | null;
  career_roles: string[];
}

export interface StageStatus {
  stage_key: StageKey;
  stage_name: string;
  stage_level: number;
  status: "completed" | "current" | "locked";
  progress: number;
  averageScore: number;
  careerRoles: string[];
  requiredCourses: string[];
  isUnlocked: boolean;
}

export function useStageProgress() {
  const { user } = useAuth();

  // Fetch stage requirements
  const { data: stageRequirements } = useQuery({
    queryKey: ["stageRequirements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stage_requirements")
        .select("*")
        .order("stage_level");
      if (error) throw error;
      return (data ?? []).map((s) => ({
        ...s,
        career_roles: Array.isArray(s.career_roles) ? s.career_roles : [],
      })) as StageRequirement[];
    },
  });

  // Fetch user's completed stages
  const { data: completedStages } = useQuery({
    queryKey: ["userStageCompletions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_stage_completions")
        .select("stage_key, average_score")
        .eq("user_id", user?.id ?? "");
      if (error) throw error;
      return new Map(
        (data ?? []).map((s) => [s.stage_key, s.average_score])
      );
    },
    enabled: !!user?.id,
  });

  // Fetch courses with their codes
  const { data: courses } = useQuery({
    queryKey: ["coursesForStages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, code, level");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Fetch user progress on lessons
  const { data: userProgress } = useQuery({
    queryKey: ["userProgressForStages", user?.id],
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

  // Fetch quiz attempts
  const { data: quizAttempts } = useQuery({
    queryKey: ["userQuizAttemptsForStages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_quiz_attempts")
        .select("lesson_id, score, passed")
        .eq("user_id", user?.id ?? "");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  // Fetch lesson to course mapping
  const { data: lessonCourseMap } = useQuery({
    queryKey: ["lessonCourseMapForStages"],
    queryFn: async () => {
      const { data: modules, error: modErr } = await supabase
        .from("modules")
        .select("id, course_id");
      if (modErr) throw modErr;
      const { data: lessons, error: lessErr } = await supabase
        .from("lessons")
        .select("id, module_id");
      if (lessErr) throw lessErr;

      const moduleToCourse = new Map(
        (modules ?? []).map((m) => [m.id, m.course_id])
      );
      const lessonToCourse: Record<string, string> = {};
      (lessons ?? []).forEach((l) => {
        const courseId = moduleToCourse.get(l.module_id);
        if (courseId) lessonToCourse[l.id] = courseId;
      });
      
      // Also build course lesson counts
      const courseLessonCounts: Record<string, number> = {};
      Object.values(lessonToCourse).forEach((courseId) => {
        courseLessonCounts[courseId] = (courseLessonCounts[courseId] || 0) + 1;
      });

      return { lessonToCourse, courseLessonCounts };
    },
  });

  // Calculate stage statuses
  const stageStatuses: StageStatus[] = (stageRequirements ?? []).map((stage) => {
    const isCompleted = completedStages?.has(stage.stage_key) ?? false;
    const averageScore = completedStages?.get(stage.stage_key) ?? 0;

    // Check if prerequisite is completed
    const prerequisiteCompleted = stage.prerequisite_stage
      ? completedStages?.has(stage.prerequisite_stage as StageKey) ?? false
      : true;

    // Calculate progress for this stage
    let totalLessons = 0;
    let completedLessons = 0;

    if (courses && lessonCourseMap && userProgress) {
      const stageCourses = courses.filter((c) =>
        stage.required_courses.includes(c.code)
      );
      
      stageCourses.forEach((course) => {
        const lessonCount = lessonCourseMap.courseLessonCounts[course.id] || 0;
        totalLessons += lessonCount;

        Object.entries(lessonCourseMap.lessonToCourse).forEach(
          ([lessonId, courseId]) => {
            if (courseId === course.id && userProgress.has(lessonId)) {
              completedLessons++;
            }
          }
        );
      });
    }

    const progress =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Determine status
    let status: "completed" | "current" | "locked" = "locked";
    if (isCompleted) {
      status = "completed";
    } else if (prerequisiteCompleted) {
      status = "current";
    }

    return {
      stage_key: stage.stage_key,
      stage_name: stage.stage_name,
      stage_level: stage.stage_level,
      status,
      progress,
      averageScore,
      careerRoles: stage.career_roles as string[],
      requiredCourses: stage.required_courses,
      isUnlocked: status !== "locked",
    };
  });

  // Get current stage (first non-completed unlocked stage)
  const currentStage = stageStatuses.find((s) => s.status === "current") ?? null;

  // Get career roles for current stage
  const currentCareerRoles = currentStage?.careerRoles ?? [];

  // Check if user can access a course based on stage progression
  const canAccessCourse = (courseCode: string): boolean => {
    if (!stageRequirements?.length) return true;
    
    const stage = stageRequirements.find((s) =>
      s.required_courses.includes(courseCode)
    );
    if (!stage) return true;

    const stageStatus = stageStatuses.find(
      (s) => s.stage_key === stage.stage_key
    );
    return stageStatus?.isUnlocked ?? false;
  };

  // Calculate if stage is complete (100% lessons + 70% avg quiz score)
  const calculateStageCompletion = (stageKey: StageKey) => {
    const stage = stageRequirements?.find((s) => s.stage_key === stageKey);
    if (!stage || !courses || !lessonCourseMap || !userProgress) {
      return { isComplete: false, progress: 0, avgScore: 0 };
    }

    const stageCourses = courses.filter((c) =>
      stage.required_courses.includes(c.code)
    );

    let totalLessons = 0;
    let completedLessons = 0;
    const lessonIds: string[] = [];

    stageCourses.forEach((course) => {
      Object.entries(lessonCourseMap.lessonToCourse).forEach(
        ([lessonId, courseId]) => {
          if (courseId === course.id) {
            totalLessons++;
            lessonIds.push(lessonId);
            if (userProgress.has(lessonId)) {
              completedLessons++;
            }
          }
        }
      );
    });

    const progress =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Calculate average quiz score for stage lessons
    const stageQuizAttempts = (quizAttempts ?? []).filter((a) =>
      lessonIds.includes(a.lesson_id)
    );
    const totalScore = stageQuizAttempts.reduce((sum, a) => sum + a.score, 0);
    const avgScore =
      stageQuizAttempts.length > 0
        ? Math.round(totalScore / stageQuizAttempts.length)
        : 0;

    const isComplete = progress === 100 && avgScore >= stage.min_assessment_score;

    return { isComplete, progress, avgScore };
  };

  return {
    stageStatuses,
    currentStage,
    currentCareerRoles,
    canAccessCourse,
    calculateStageCompletion,
    isLoading: !stageRequirements,
  };
}
