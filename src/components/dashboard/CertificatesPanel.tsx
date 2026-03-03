import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getCertificates, frappeKeys } from "@/lib/frappe";
import { Award, Loader2 } from "lucide-react";

export function CertificatesPanel() {
  const { session } = useAuth();
  const token = session?.access_token ?? "";

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: frappeKeys.certificates(),
    queryFn: () => getCertificates(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Certificates</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : certificates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Complete a course to earn your certificate.
        </p>
      ) : (
        <div className="space-y-2">
          {certificates.map((cert) => (
            <div key={cert.name} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
              <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {cert.course_title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Issued{" "}
                  {new Date(cert.issue_date).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
