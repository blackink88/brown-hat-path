import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Slider } from "@/components/ui/slider";

export default function CommandCenter() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: userSkills, isLoading: userSkillsLoading } = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_skills")
        .select("skill_id, current_level")
        .eq("user_id", user?.id ?? "");
      if (error) throw error;
      return (data ?? []) as { skill_id: string; current_level: number }[];
    },
    enabled: !!user?.id,
  });

  const userSkillLevels: Record<string, number> = (() => {
    const map: Record<string, number> = {};
    skills?.forEach((s) => {
      const row = userSkills?.find((u) => u.skill_id === s.id);
      map[s.name] = row?.current_level ?? 0;
    });
    return map;
  })();

  const updateSkillLevel = useMutation({
    mutationFn: async ({ skillId, level }: { skillId: string; level: number }) => {
      const { error } = await supabase.from("user_skills").upsert(
        { user_id: user?.id, skill_id: skillId, current_level: Math.round(level), updated_at: new Date().toISOString() },
        { onConflict: "user_id,skill_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userSkills", user?.id] }),
  });

  const radarData =
    skills?.map((skill) => ({
      subject: skill.name.split(" ")[0],
      fullName: skill.name,
      value: userSkillLevels[skill.name] ?? 0,
      fullMark: 100,
    })) || [];

  const scoreValues = Object.values(userSkillLevels).filter((v) => v > 0);
  const overallScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 0;
  const domainsAbove50 = Object.values(userSkillLevels).filter((v) => v >= 50).length;

  if (skillsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasSkills = skills && skills.length > 0;

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
        <h2 className="text-lg font-semibold text-foreground mb-4">Skills Radar</h2>
        {!hasSkills ? (
          <div className="h-80 flex items-center justify-center rounded-lg bg-muted/30 text-center">
            <div>
              <p className="text-muted-foreground">No skill domains loaded yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Complete courses to build your skills profile.</p>
            </div>
          </div>
        ) : (
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
                stroke="hsl(var(--cyber-blue))"
                fill="hsl(var(--cyber-blue))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>

      {/* Skill Breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Domain Breakdown
        </h2>
        {!hasSkills ? (
          <p className="text-sm text-muted-foreground">Skill domains will appear here as you progress.</p>
        ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((skill) => {
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
                <Slider
                  value={[level]}
                  onValueChange={([v]) => updateSkillLevel.mutate({ skillId: skill.id, level: v })}
                  max={100}
                  step={5}
                  className="py-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {skill.category}
                </p>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
