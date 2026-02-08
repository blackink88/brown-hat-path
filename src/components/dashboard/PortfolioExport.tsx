import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getSkillLevelsFromCourseProgress } from "@/lib/courseSkillAlignment";
import { Share2, Loader2, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function PortfolioExport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [slug, setSlug] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("full_name").eq("user_id", user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: snapshot } = useQuery({
    queryKey: ["portfolioSnapshotByUser", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_snapshots")
        .select("slug, updated_at")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updatePortfolio = useMutation({
    mutationFn: async () => {
      const safeSlug = (slug || profile?.full_name || user?.id)
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "portfolio";
      const displayName = profile?.full_name || "Student";

      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", user!.id);
      const courseIds = (enrollments ?? []).map((e) => e.course_id);

      const coursesWithProgress: { code: string; title: string; progress: number }[] = [];
      const certification_goals: string[] = [];
      let coursesData: { id: string; code: string; title: string; aligned_certifications?: string[] }[] = [];
      if (courseIds.length > 0) {
        const { data: courses } = await supabase.from("courses").select("id, code, title, aligned_certifications").in("id", courseIds);
        coursesData = courses ?? [];
        const { data: modules } = await supabase.from("modules").select("id, course_id");
        const { data: lessons } = await supabase.from("lessons").select("id, module_id");
        const { data: progress } = await supabase
          .from("user_progress")
          .select("lesson_id")
          .eq("user_id", user!.id)
          .eq("completed", true);
        const completedSet = new Set((progress ?? []).map((p) => p.lesson_id));
        coursesData.forEach((c) => {
          const moduleIds = (modules ?? []).filter((m) => m.course_id === c.id).map((m) => m.id);
          const lessonIds = (lessons ?? []).filter((l) => moduleIds.includes(l.module_id)).map((l) => l.id);
          const total = lessonIds.length;
          const completed = lessonIds.filter((id) => completedSet.has(id)).length;
          coursesWithProgress.push({
            code: c.code,
            title: c.title,
            progress: total > 0 ? Math.round((completed / total) * 100) : 0,
          });
          // Extract certification goals from this course
          const certs = Array.isArray(c.aligned_certifications) ? c.aligned_certifications : [];
          certs.forEach((cert) => {
            if (cert && !certification_goals.includes(cert)) certification_goals.push(cert);
          });
        });
      }

      const { data: skillRows } = await supabase.from("skills").select("id, name").order("name");
      const skillNames = (skillRows ?? []).map((s) => s.name);
      const levelsBySkill = getSkillLevelsFromCourseProgress(
        coursesWithProgress.map((c) => ({ code: c.code, progress: c.progress })),
        skillNames
      );
      const skills = skillNames.map((name) => ({
        name,
        level: levelsBySkill[name] ?? 0,
      }));

      const existing = await supabase
        .from("portfolio_snapshots")
        .select("slug")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (existing.data?.slug && existing.data.slug !== safeSlug) {
        await supabase.from("portfolio_snapshots").delete().eq("slug", existing.data.slug);
      }
      const { error } = await supabase.from("portfolio_snapshots").upsert(
        {
          slug: safeSlug,
          user_id: user!.id,
          display_name: displayName,
          courses_completed: coursesWithProgress,
          skills,
          certification_goals,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );
      if (error) throw error;
      setSlug(safeSlug);
      return safeSlug;
    },
    onSuccess: (finalSlug) => {
      queryClient.invalidateQueries({ queryKey: ["portfolioSnapshotByUser", user?.id] });
      toast({ title: "Portfolio updated", description: "Your shareable link is ready." });
    },
    onError: (e) => toast({ title: "Update failed", description: String(e.message), variant: "destructive" }),
  });

  const portfolioUrl = typeof window !== "undefined" && (slug || snapshot?.slug)
    ? `${window.location.origin}/p/${slug || snapshot?.slug}`
    : "";

  const copyLink = () => {
    if (!portfolioUrl) return;
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast({ title: "Link copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Share2 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Verified Skills Portfolio</h3>
          <p className="text-sm text-muted-foreground">Share a public link with employers</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Portfolio URL slug</Label>
        <Input
          placeholder={profile?.full_name ? `${profile.full_name.toLowerCase().replace(/\s/g, "-")}` : "my-portfolio"}
          value={slug || snapshot?.slug || ""}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        onClick={() => updatePortfolio.mutate()}
        disabled={updatePortfolio.isPending}
      >
        {updatePortfolio.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <CheckCircle2 className="h-4 w-4 mr-2" />
        )}
        Update my portfolio
      </Button>

      {portfolioUrl && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground truncate flex-1">{portfolioUrl}</span>
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Your portfolio shows your name, courses, skills radar, and certification goals. Anyone with the link can view it.
      </p>
    </div>
  );
}
