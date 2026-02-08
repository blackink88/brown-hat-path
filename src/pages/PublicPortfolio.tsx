import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout/PageLayout";
import { Award } from "lucide-react";
import { Link } from "react-router-dom";

type Snapshot = {
  slug: string;
  display_name: string | null;
  courses_completed: { code?: string; title?: string; progress?: number }[];
  skills: { name: string; level: number }[];
  certification_goals: string[];
  updated_at: string;
};

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ["portfolioSnapshot", slug],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("portfolio_snapshots")
        .select("*")
        .eq("slug", slug ?? "")
        .maybeSingle();
      if (e) throw e;
      if (!data) return null;
      // Cast JSONB fields to expected types
      return {
        slug: data.slug,
        display_name: data.display_name,
        courses_completed: data.courses_completed as Snapshot["courses_completed"],
        skills: data.skills as Snapshot["skills"],
        certification_goals: data.certification_goals as Snapshot["certification_goals"],
        updated_at: data.updated_at,
      } satisfies Snapshot;
    },
    enabled: !!slug,
  });

  if (isLoading || !slug) {
    return (
      <PageLayout>
        <div className="container py-16 text-center text-muted-foreground">
          {isLoading ? "Loading…" : "No portfolio specified."}
        </div>
      </PageLayout>
    );
  }

  if (error || !portfolio) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Portfolio not found or not published.</p>
          <Link to="/" className="text-primary hover:underline mt-2 inline-block">Go home</Link>
        </div>
      </PageLayout>
    );
  }

  const courses = Array.isArray(portfolio.courses_completed) ? portfolio.courses_completed : [];
  const skills = Array.isArray(portfolio.skills) ? portfolio.skills : [];
  const certs = Array.isArray(portfolio.certification_goals) ? portfolio.certification_goals : [];

  return (
    <PageLayout>
      <div className="container py-12 max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">
            {portfolio.display_name || "Skills portfolio"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Brown Hat Academy — verified skills portfolio
          </p>

          {courses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Courses</h2>
              <ul className="space-y-1 text-sm text-foreground">
                {courses.map((c, i) => (
                  <li key={i}>
                    {c.code && <span className="font-mono text-primary mr-2">{c.code}</span>}
                    {c.title ?? "Course"}
                    {typeof c.progress === "number" && (
                      <span className="text-muted-foreground ml-2">({c.progress}%)</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Skills</h2>
              <ul className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <li
                    key={i}
                    className="px-3 py-1 rounded-full bg-muted text-foreground text-sm"
                  >
                    {s.name} {typeof s.level === "number" && `(${s.level}%)`}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {certs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certification goals
              </h2>
              <ul className="space-y-1 text-sm text-foreground">
                {certs.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </section>
          )}

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Last updated {portfolio.updated_at ? new Date(portfolio.updated_at).toLocaleDateString() : ""}
          </p>
        </div>
        <p className="text-center mt-6">
          <Link to="/" className="text-primary hover:underline">Brown Hat Academy</Link>
        </p>
      </div>
    </PageLayout>
  );
}
