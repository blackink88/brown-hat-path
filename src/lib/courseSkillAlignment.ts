/**
 * Maps course codes to the skill domain names they contribute to.
 * Used to derive Skills Radar levels from course completion (lesson progress).
 * Skill names must match public.skills.name.
 */
export const COURSE_SKILL_MAP: Record<string, string[]> = {
  "BH-BRIDGE": [
    "Network Security",
    "Security Operations",
  ],
  "BH-FOUND-1": [
    "Network Security",
    "Security Operations",
  ],
  "BH-FOUND-2": [
    "Network Security",
    "Threat Analysis",
  ],
  "BH-CYBER-2": [
    "Threat Analysis",
    "Security Operations",
    "GRC & Compliance",
  ],
  "BH-OPS-2": [
    "Incident Response",
    "Security Operations",
    "Threat Analysis",
  ],
  "BH-SPEC-SOC": [
    "Incident Response",
    "Security Operations",
    "Threat Analysis",
  ],
  "BH-ADV": [
    "GRC & Compliance",
    "Security Operations",
    "Cloud Security",
  ],
  // Legacy seed codes (migrations)
  "BH-CORE-1": ["Threat Analysis", "Security Operations"],
  "BH-CORE-2": ["Security Operations", "Incident Response"],
};

export interface CourseProgressItem {
  code: string;
  progress: number;
}

/**
 * Derives skill levels (0–100) from course completion percentages.
 * For each skill, the level is the average completion of all courses that contribute to that skill.
 */
export function getSkillLevelsFromCourseProgress(
  courseProgress: CourseProgressItem[],
  skillNames: string[]
): Record<string, number> {
  const levels: Record<string, number> = {};
  for (const name of skillNames) {
    levels[name] = 0;
  }
  if (courseProgress.length === 0) return levels;

  for (const skillName of skillNames) {
    const contributingCodes = Object.entries(COURSE_SKILL_MAP)
      .filter(([, skills]) => skills.includes(skillName))
      .map(([code]) => code);
    const contributing = courseProgress.filter((c) =>
      contributingCodes.includes(c.code)
    );
    if (contributing.length === 0) continue;
    const sum = contributing.reduce((a, c) => a + c.progress, 0);
    levels[skillName] = Math.round(sum / contributing.length);
  }
  return levels;
}
