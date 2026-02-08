import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Award, Download, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateCardProps {
  stageKey: string;
  stageName: string;
  isEligible: boolean;
  isEarned: boolean;
  certificateNumber?: string;
  issuedAt?: string;
  progress: number;
  avgScore: number;
}

export function CertificateCard({
  stageKey,
  stageName,
  isEligible,
  isEarned,
  certificateNumber,
  issuedAt,
  progress,
  avgScore,
}: CertificateCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  const claimCertificate = useMutation({
    mutationFn: async () => {
      const learnerName =
        (user?.user_metadata?.full_name as string) ||
        user?.email?.split("@")[0] ||
        "Learner";
      const certNumber = `BH-${stageKey.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase.from("certificates").insert({
        user_id: user?.id,
        certificate_type: stageKey,
        stage_name: stageName,
        learner_name: learnerName,
        certificate_number: certNumber,
      });

      if (error) throw error;
      return certNumber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCertificates"] });
      toast({
        title: "Certificate Claimed!",
        description: `Your ${stageName} certificate has been issued.`,
      });
    },
    onError: (e) => {
      toast({
        title: "Failed to claim certificate",
        description: String(e.message),
        variant: "destructive",
      });
    },
  });

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const learnerName =
        (user?.user_metadata?.full_name as string) ||
        user?.email?.split("@")[0] ||
        "Learner";

      // Generate a simple PDF-like content (in a real app, use a PDF library)
      const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; text-align: center; padding: 60px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; min-height: 100vh; margin: 0; }
    .certificate { background: #fff; color: #1a1a2e; padding: 60px; border-radius: 12px; max-width: 800px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .logo { font-size: 28px; font-weight: bold; color: #8b5cf6; margin-bottom: 20px; }
    .title { font-size: 42px; font-weight: bold; margin: 30px 0; color: #1a1a2e; }
    .subtitle { font-size: 18px; color: #64748b; margin-bottom: 40px; }
    .name { font-size: 36px; font-weight: bold; color: #8b5cf6; margin: 30px 0; border-bottom: 2px solid #8b5cf6; display: inline-block; padding-bottom: 8px; }
    .stage { font-size: 24px; margin: 20px 0; }
    .date { font-size: 14px; color: #64748b; margin-top: 40px; }
    .cert-number { font-size: 12px; color: #94a3b8; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="logo">🛡️ Brown Hat Academy</div>
    <div class="title">Certificate of Completion</div>
    <div class="subtitle">This is to certify that</div>
    <div class="name">${learnerName}</div>
    <div class="stage">has successfully completed the <strong>${stageName}</strong> stage</div>
    <div class="subtitle">demonstrating proficiency in cybersecurity fundamentals</div>
    <div class="date">Issued: ${new Date(issuedAt || Date.now()).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</div>
    <div class="cert-number">Certificate #: ${certificateNumber}</div>
  </div>
</body>
</html>`;

      // Open in new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(certificateHTML);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
            isEarned
              ? "bg-primary/20 text-primary"
              : isEligible
              ? "bg-amber-500/20 text-amber-500"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Award className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{stageName} Certificate</h4>
          {isEarned ? (
            <div className="flex items-center gap-1.5 text-sm text-primary mt-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Earned</span>
            </div>
          ) : isEligible ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              Ready to claim!
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              {progress}% complete • {avgScore > 0 ? `${avgScore}% avg score` : "No assessments yet"}
            </p>
          )}

          {certificateNumber && (
            <p className="text-xs text-muted-foreground mt-1">
              #{certificateNumber}
            </p>
          )}
        </div>

        {isEarned ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        ) : isEligible ? (
          <Button
            size="sm"
            onClick={() => claimCertificate.mutate()}
            disabled={claimCertificate.isPending}
          >
            {claimCertificate.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Claim"
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
