import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { listEnrollments, getCourses, frappeKeys } from "@/lib/frappe";
import { Share2, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PortfolioExport() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const token = session?.access_token ?? "";
  const fullName = user?.user_metadata?.full_name ?? user?.email ?? "Student";

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: frappeKeys.enrollments(),
    queryFn: () => listEnrollments(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: frappeKeys.courses(),
    queryFn: getCourses,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = enrollmentsLoading || coursesLoading;

  const courseMap = new Map(courses.map((c) => [c.name, c]));

  const summary = enrollments
    .map((e) => {
      const course = courseMap.get(e.course);
      return course
        ? `${course.title} — ${Math.round(e.progress ?? 0)}%`
        : null;
    })
    .filter(Boolean) as string[];

  const copyText = [
    `${fullName} — Brown Hat Academy Skills Portfolio`,
    "",
    "Enrolled Courses:",
    ...summary.map((s) => `  • ${s}`),
    "",
    "Verified at Brown Hat Academy | brownhatacademy.co.za",
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Share2 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Skills Portfolio</h3>
          <p className="text-sm text-muted-foreground">
            Copy your progress summary to share with employers
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your progress…
        </div>
      ) : summary.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Enroll in courses to build your portfolio.
        </p>
      ) : (
        <>
          <ul className="text-sm text-foreground space-y-1">
            {summary.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {s}
              </li>
            ))}
          </ul>

          <Button className="w-full" variant="outline" onClick={handleCopy}>
            {copied ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy portfolio summary"}
          </Button>
        </>
      )}

      <p className="text-xs text-muted-foreground">
        Your portfolio shows your name and course progress. Copy it to paste into LinkedIn, a CV, or email.
      </p>
    </div>
  );
}
