import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

interface Certificate {
  id: string;
  certificate_type: string;
  stage_name: string;
  certificate_number: string;
  issued_at: string;
  learner_name: string;
}

export default function VerifyCertificate() {
  const { certNumber } = useParams<{ certNumber: string }>();

  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ["verifyCertificate", certNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_number", certNumber ?? "")
        .single();
      if (error) throw error;
      return data as Certificate;
    },
    enabled: !!certNumber,
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
                  <p className="text-xs text-muted-foreground">Learner Name</p>
                  <p className="font-semibold text-foreground">
                    {certificate.learner_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stage Completed</p>
                  <p className="font-semibold text-foreground">
                    {certificate.stage_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(certificate.issued_at).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certificate Number</p>
                  <p className="font-mono text-sm text-foreground">
                    {certificate.certificate_number}
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
                We couldn't find a certificate with this number. Please check the
                certificate number and try again.
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
