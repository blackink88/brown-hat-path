/**
 * courseCatalog.ts — Static course metadata for Brown Hat Academy
 *
 * This is the single source of truth for course metadata in the React app.
 * All Supabase "courses" table queries have been replaced with this static map.
 *
 * Indexed by Frappe course slug (the `name` field returned by Frappe).
 * Also provides helpers to look up by course code (BH-BRIDGE, etc.).
 */

export interface CourseMeta {
  /** BH course code used in URLs  e.g. "BH-BRIDGE" */
  code: string;
  /** Frappe LMS course slug (doc name)  e.g. "technical-readiness-bridge" */
  frappe_name: string;
  /** Display level: 0=Bridge, 1=Foundations, 2=Core, 3=Practitioner, 4=Specialisation, 5=Advanced */
  level: number;
  /** Minimum subscription tier_level required (matches BH Subscription Tier.tier_level in Frappe) */
  required_tier_level: number;
  /** Certification exams this course prepares you for */
  aligned_certifications: string[];
  /** Key skills taught in this course */
  skills: string[];
  /** Track for multi-track levels (e.g. "blue_team" | "grc" | "cloud_security" | "iam") */
  track?: string;
  /** Display order */
  order_index: number;
}

/** Indexed by Frappe course slug */
export const COURSE_CATALOG: Record<string, CourseMeta> = {
  "technical-readiness-bridge": {
    code: "BH-BRIDGE",
    frappe_name: "technical-readiness-bridge",
    level: 0,
    required_tier_level: 0,
    aligned_certifications: [],
    skills: ["Computer fundamentals", "Digital literacy", "Basic networking", "Command line basics"],
    order_index: 1,
  },
  "cybersecurity-foundations-i": {
    code: "BH-FOUND-1",
    frappe_name: "cybersecurity-foundations-i",
    level: 1,
    required_tier_level: 1,
    aligned_certifications: ["CompTIA A+", "ISC² CC"],
    skills: ["Introduction to cybersecurity", "Threat landscape", "Security fundamentals", "Regulatory context"],
    order_index: 2,
  },
  "cybersecurity-foundations-ii": {
    code: "BH-FOUND-2",
    frappe_name: "cybersecurity-foundations-ii",
    level: 1,
    required_tier_level: 1,
    aligned_certifications: ["CompTIA Security+", "ISC² CC"],
    skills: ["Networking for security", "Applied cryptography", "System and application security", "Security monitoring"],
    order_index: 3,
  },
  "core-cyber-foundations": {
    code: "BH-CYBER-2",
    frappe_name: "core-cyber-foundations",
    level: 2,
    required_tier_level: 2,
    aligned_certifications: ["CompTIA Security+", "ISC² CC"],
    skills: ["Threat landscape analysis", "Security controls", "Cryptography", "OWASP Top 10", "Vulnerability scanning"],
    order_index: 4,
  },
  "practitioner-core-cyber-operations": {
    code: "BH-OPS-2",
    frappe_name: "practitioner-core-cyber-operations",
    level: 3,
    required_tier_level: 2,
    aligned_certifications: ["CompTIA CySA+", "ISC² SSCP"],
    skills: ["SOC operations", "Log analysis", "Incident response", "Endpoint detection", "Vulnerability management"],
    order_index: 5,
  },
  "specialisation-soc-incident-response": {
    code: "BH-SPEC-SOC",
    frappe_name: "specialisation-soc-incident-response",
    level: 4,
    required_tier_level: 3,
    aligned_certifications: ["CompTIA CySA+"],
    skills: ["Advanced threat detection", "SIEM", "Detection engineering", "Malware triage", "Cloud SOC"],
    track: "blue_team",
    order_index: 6,
  },
  "advanced-leadership": {
    code: "BH-ADV",
    frappe_name: "advanced-leadership",
    level: 5,
    required_tier_level: 3,
    aligned_certifications: ["CISSP", "CISM"],
    skills: ["Security architecture", "Cryptographic systems", "CISSP domains", "Security governance", "COBIT/ISO 27001"],
    order_index: 7,
  },
};

/** All courses in display order */
export const COURSES_ORDERED: CourseMeta[] = Object.values(COURSE_CATALOG).sort(
  (a, b) => a.order_index - b.order_index,
);

/** Look up by Frappe slug */
export function getCourseByFrappeName(frappeName: string): CourseMeta | null {
  return COURSE_CATALOG[frappeName] ?? null;
}

/** Look up by course code (case-insensitive) */
export function getCourseByCode(code: string): CourseMeta | null {
  const upper = code.toUpperCase();
  return COURSES_ORDERED.find((c) => c.code === upper) ?? null;
}

/** Level display labels */
export const LEVEL_LABELS: Record<number, string> = {
  0: "Bridge",
  1: "Foundations",
  2: "Core",
  3: "Practitioner",
  4: "Specialisation",
  5: "Advanced",
};
