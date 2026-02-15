/**
 * Maps course codes to the skill domain names they contribute to.
 * Used to derive Skills Radar levels from course completion (lesson progress).
 * Skill names must match public.skills.name.
 *
 * All 11 courses in the programme are mapped below.
 * Seed courses: BH-BRIDGE, BH-FOUND-1, BH-FOUND-2, BH-CYBER-2, BH-OPS-2, BH-SPEC-SOC, BH-ADV
 * Migration courses: BH-GRC-2, BH-SPEC-IAM, BH-SPEC-CLOUD, BH-SPEC-GRC
 */
export const COURSE_SKILL_MAP: Record<string, string[]> = {
  // Level 0 — Bridge
  "BH-BRIDGE": [
    "Network Security",
    "Security Operations",
  ],
  // Level 1 — Foundations
  "BH-FOUND-1": [
    "Network Security",
    "Security Operations",
  ],
  "BH-FOUND-2": [
    "Network Security",
    "Threat Analysis",
  ],
  // Level 2 — Core Cyber
  "BH-CYBER-2": [
    "Threat Analysis",
    "Security Operations",
    "Cryptography",
    "Penetration Testing",
  ],
  // Level 3 — Practitioner
  "BH-OPS-2": [
    "Incident Response",
    "Security Operations",
    "Threat Analysis",
  ],
  "BH-GRC-2": [
    "GRC & Compliance",
    "Security Operations",
  ],
  // Level 4 — Specialisations
  "BH-SPEC-SOC": [
    "Incident Response",
    "Security Operations",
    "Threat Analysis",
  ],
  "BH-SPEC-IAM": [
    "Security Operations",
    "GRC & Compliance",
  ],
  "BH-SPEC-CLOUD": [
    "Cloud Security",
    "Network Security",
    "Security Operations",
  ],
  "BH-SPEC-GRC": [
    "GRC & Compliance",
    "Cloud Security",
  ],
  // Level 5 — Advanced & Leadership
  "BH-ADV": [
    "GRC & Compliance",
    "Security Operations",
    "Cryptography",
    "Incident Response",
  ],
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
