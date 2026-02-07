import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export default function CommandCenter() {
  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Mock user skill levels - replace with real data from user_skills
  const userSkillLevels: Record<string, number> = {
    "Network Security": 45,
    "Threat Analysis": 30,
    "Incident Response": 20,
    "Cloud Security": 15,
    "GRC & Compliance": 35,
    "Security Operations": 25,
    "Penetration Testing": 10,
    "Cryptography": 40,
  };

  const radarData =
    skills?.map((skill) => ({
      subject: skill.name.split(" ")[0], // Shortened name for chart
      fullName: skill.name,
      value: userSkillLevels[skill.name] || 0,
      fullMark: 100,
    })) || [];

  const overallScore = Math.round(
    Object.values(userSkillLevels).reduce((a, b) => a + b, 0) /
      Object.values(userSkillLevels).length
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
        <p className="text-muted-foreground">
          Track your skills across all cybersecurity domains.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{overallScore}%</p>
          <p className="text-xs text-muted-foreground">Overall Readiness</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">+12%</p>
          <p className="text-xs text-muted-foreground">This Month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Domains Mastered</p>
        </div>
      </div>

      {/* Skill Radar Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Skills Radar</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
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
          {skills?.map((skill) => {
            const level = userSkillLevels[skill.name] || 0;
            return (
              <div
                key={skill.id}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm font-mono text-primary">{level}%</span>
                </div>
                <Progress value={level} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {skill.category}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
