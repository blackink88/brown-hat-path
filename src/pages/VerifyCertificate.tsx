import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Award, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

const FRAPPE_URL =
  (import.meta.env.VITE_FRAPPE_URL as string) ?? "https://lms-dzr-tbs.c.frappe.cloud";

interface Certificate {
  name: string;
  course: string;
  course_title: string;
  member: string;
  issue_date: string;
}

async function fetchCertificate(certName: string): Promise<Certificate | null> {
  try {
    const res = await fetch(
      `${FRAPPE_URL}/api/resource/LMS Certificate/${encodeURIComponent(certName)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Certificate;
  } catch {
    return null;
  }
}

export default function VerifyCertificate() {
  const { certNumber } = useParams<{ certNumber: string }>();

  const { data: certificate, isLoading } = useQuery({
    queryKey: ["verifyCertificate", certNumber],
    queryFn: () => fetchCertificate(certNumber ?? ""),
    enabled: !!certNumber,
    retry: false,
  });

  return (
    <PageLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying certificate...</p>
            </div>
          ) : certificate ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Certificate Verified
              </h1>
              <p className="text-muted-foreground mb-6">
                This is a valid Brown Hat Academy certificate.
              </p>

              <div className="rounded-lg bg-muted/50 p-4 text-left space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Course</p>
                  <p className="font-semibold text-foreground">
                    {certificate.course_title ?? certificate.course}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(certificate.issue_date).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certificate ID</p>
                  <p className="font-mono text-sm text-foreground">
                    {certificate.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center mt-6">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Brown Hat Academy
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Certificate Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t find a certificate with this ID. Please check
                the certificate ID and try again.
              </p>
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
