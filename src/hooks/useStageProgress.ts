import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { listEnrollments, frappeKeys } from "@/lib/frappe";
import { getCourseByFrappeName } from "@/lib/courseCatalog";
import { useMemo } from "react";

export type StageKey = "bridge" | "foundations" | "core_cyber" | "specialist";

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

// Static stage definitions — career roles aligned to each stage level
const STAGE_DATA: { key: StageKey; name: string; level: number; roles: string[] }[] = [
  {
    key: "bridge",
    name: "Bridge",
    level: 0,
    roles: ["IT Support Specialist", "Help Desk Technician"],
  },
  {
    key: "foundations",
    name: "Foundations",
    level: 1,
    roles: ["Junior Security Analyst", "SOC Tier 1 Analyst", "Network Administrator"],
  },
  {
    key: "core_cyber",
    name: "Core Cyber",
    level: 2,
    roles: ["Security Analyst", "SOC Analyst", "Vulnerability Analyst"],
  },
  {
    key: "specialist",
    name: "Specialist",
    level: 3,
    roles: ["Penetration Tester", "Incident Responder", "Cloud Security Engineer"],
  },
];

export function useStageProgress() {
  const { session } = useAuth();
  const token = session?.access_token ?? "";

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: frappeKeys.enrollments(),
    queryFn: () => listEnrollments(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const stageStatuses = useMemo((): StageStatus[] => {
    // Group progress values by stage level (catalog level capped at 3)
    const progressByLevel: Record<number, number[]> = {};
    for (const e of enrollments) {
      const catalog = getCourseByFrappeName(e.course);
      const lvl = Math.min(catalog?.level ?? 0, 3);
      if (!progressByLevel[lvl]) progressByLevel[lvl] = [];
      progressByLevel[lvl].push(e.progress ?? 0);
    }

    let foundCurrent = false;
    return STAGE_DATA.map((stage) => {
      const progs = progressByLevel[stage.level] ?? [];
      const avgProg = progs.length
        ? Math.round(progs.reduce((a, b) => a + b, 0) / progs.length)
        : 0;

      let status: "completed" | "current" | "locked" = "locked";
      if (avgProg >= 100) {
        status = "completed";
      } else if (progs.length > 0 && !foundCurrent) {
        status = "current";
        foundCurrent = true;
      }

      return {
        stage_key: stage.key,
        stage_name: stage.name,
        stage_level: stage.level,
        status,
        progress: avgProg,
        averageScore: 0,
        careerRoles: stage.roles,
        requiredCourses: [],
        isUnlocked: status !== "locked",
      };
    });
  }, [enrollments]);

  const currentStage = stageStatuses.find((s) => s.status === "current") ?? null;
  const currentCareerRoles = currentStage?.careerRoles ?? [];

  // Access is controlled by tier level in MyCourses/CoursePlayer — always return true here
  const canAccessCourse = (_courseCode: string): boolean => true;

  const calculateStageCompletion = (_stageKey: StageKey) => ({
    isComplete: false,
    progress: 0,
    avgScore: 0,
  });

  return {
    stageStatuses,
    currentStage,
    currentCareerRoles,
    canAccessCourse,
    calculateStageCompletion,
    isLoading,
  };
}
