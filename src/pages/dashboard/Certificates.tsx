import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Award, Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getCertificates, frappeKeys, type FrappeCertificate } from "@/lib/frappe";

export default function Certificates() {
  const { user, session } = useAuth();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const accessToken = session?.access_token ?? "";

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: frappeKeys.certificates(),
    queryFn: () => getCertificates(accessToken),
    enabled: !!accessToken,
  });

  const handleDownload = async (cert: FrappeCertificate) => {
    setDownloadingId(cert.name);
    try {
      const learnerName = user?.user_metadata?.full_name ?? user?.email ?? "Student";
      const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Brown Hat Academy - ${cert.course_title} Certificate</title>
  <style>
    @page { size: landscape; margin: 0; }
    body { font-family: Georgia, serif; text-align: center; padding: 60px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
    .certificate { background: #fff; color: #1a1a2e; padding: 60px 80px; border-radius: 12px; max-width: 900px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #8b5cf6; }
    .logo { font-size: 28px; font-weight: bold; color: #8b5cf6; margin-bottom: 20px; }
    .title { font-size: 42px; font-weight: bold; margin: 30px 0; color: #1a1a2e; }
    .subtitle { font-size: 18px; color: #64748b; margin-bottom: 40px; }
    .name { font-size: 36px; font-weight: bold; color: #8b5cf6; margin: 30px 0; border-bottom: 2px solid #8b5cf6; display: inline-block; padding-bottom: 8px; }
    .stage { font-size: 24px; margin: 20px 0; }
    .date { font-size: 14px; color: #64748b; margin-top: 40px; }
    .cert-number { font-size: 12px; color: #94a3b8; margin-top: 10px; }
    .verify { font-size: 10px; color: #94a3b8; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="logo">Brown Hat Academy</div>
    <div class="title">Certificate of Completion</div>
    <div class="subtitle">This is to certify that</div>
    <div class="name">${learnerName}</div>
    <div class="stage">has successfully completed <strong>${cert.course_title}</strong></div>
    <div class="subtitle">demonstrating proficiency in cybersecurity</div>
    <div class="date">Issued: ${new Date(cert.issue_date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</div>
    <div class="cert-number">Certificate ID: ${cert.name}</div>
    <div class="verify">Verify at: brownhat.academy/verify/${cert.name}</div>
  </div>
</body>
</html>`;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(certificateHTML);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Certificates</h1>
        <p className="text-muted-foreground">
          View and download your earned certificates.
        </p>
      </div>

      {!certificates.length ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No certificates yet</h3>
          <p className="text-sm text-muted-foreground">
            Complete a course to earn your certificate.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <div
              key={cert.name}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">
                    {cert.course_title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(cert.issue_date).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {cert.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(cert)}
                  disabled={downloadingId === cert.name}
                >
                  {downloadingId === cert.name ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/verify/${cert.name}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
