import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Loader2, TrendingUp, Award, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getSkillLevelsFromCourseProgress } from "@/lib/courseSkillAlignment";
import { listEnrollments, frappeKeys } from "@/lib/frappe";
import { getCourseByFrappeName } from "@/lib/courseCatalog";
import { useMemo } from "react";

// Static skill domain definitions — matches COURSE_SKILL_MAP keys
const SKILL_DOMAINS = [
  { id: "network-security",    name: "Network Security",    category: "Network" },
  { id: "security-operations", name: "Security Operations", category: "Operations" },
  { id: "threat-analysis",     name: "Threat Analysis",     category: "Analysis" },
  { id: "cryptography",        name: "Cryptography",        category: "Technical" },
  { id: "penetration-testing", name: "Penetration Testing", category: "Technical" },
  { id: "incident-response",   name: "Incident Response",   category: "Operations" },
  { id: "grc-compliance",      name: "GRC & Compliance",    category: "Governance" },
  { id: "cloud-security",      name: "Cloud Security",      category: "Cloud" },
];

export default function CommandCenter() {
  const { session } = useAuth();
  const token = session?.access_token ?? "";

  // Frappe enrollments (course slug → progress %)
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: frappeKeys.enrollments(),
    queryFn: () => listEnrollments(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Build courseProgress: [{code, progress}] using catalog for frappe_name → code
  const courseProgress = useMemo(() => {
    return enrollments
      .map((e) => {
        const catalog = getCourseByFrappeName(e.course);
        if (!catalog) return null;
        return { code: catalog.code, progress: e.progress ?? 0 };
      })
      .filter(Boolean) as { code: string; progress: number }[];
  }, [enrollments]);

  const userSkillLevels: Record<string, number> =
    courseProgress.length > 0
      ? getSkillLevelsFromCourseProgress(courseProgress, SKILL_DOMAINS.map((s) => s.name))
      : {};

  const radarData = SKILL_DOMAINS.map((skill) => ({
    subject: skill.name,
    value: userSkillLevels[skill.name] ?? 0,
    fullMark: 100,
  }));

  const scoreValues = Object.values(userSkillLevels).filter((v) => v > 0);
  const overallScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 0;
  const domainsAbove50 = Object.values(userSkillLevels).filter((v) => v >= 50).length;

  if (!!token && enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skills Radar</h1>
        <p className="text-muted-foreground">
          Based on your course completion across 8 cybersecurity domains. Complete lessons to build your profile.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-cyber-blue/30 bg-card p-4 text-center">
          <div className="h-10 w-10 rounded-full bg-cyber-blue/10 flex items-center justify-center mx-auto mb-2">
            <Target className="h-5 w-5 text-cyber-blue" />
          </div>
          <p className="text-2xl font-bold text-foreground">{overallScore}%</p>
          <p className="text-xs text-muted-foreground">Overall Readiness</p>
        </div>
        <div className="rounded-xl border border-cyber-teal/30 bg-card p-4 text-center">
          <div className="h-10 w-10 rounded-full bg-cyber-teal/10 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-5 w-5 text-cyber-teal" />
          </div>
          <p className="text-2xl font-bold text-foreground">{scoreValues.length}</p>
          <p className="text-xs text-muted-foreground">Skills Tracked</p>
        </div>
        <div className="rounded-xl border border-cyber-purple/30 bg-card p-4 text-center">
          <div className="h-10 w-10 rounded-full bg-cyber-purple/10 flex items-center justify-center mx-auto mb-2">
            <Award className="h-5 w-5 text-cyber-purple" />
          </div>
          <p className="text-2xl font-bold text-foreground">{domainsAbove50}</p>
          <p className="text-xs text-muted-foreground">Domains 50%+</p>
        </div>
      </div>

      {/* Skill Radar Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your skills by domain</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="hsl(var(--cyber-blue))"
                fill="hsl(var(--cyber-blue))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Domain Breakdown
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {SKILL_DOMAINS.map((skill) => {
            const level = userSkillLevels[skill.name] ?? 0;
            return (
              <div
                key={skill.id}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm font-mono text-cyber-blue">{level}%</span>
                </div>
                <Progress value={level} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {skill.category} · from course completion
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
