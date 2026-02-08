import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useStageProgress, StageKey } from "@/hooks/useStageProgress";
import { CertificateCard } from "./CertificateCard";
import { Award } from "lucide-react";

interface Certificate {
  id: string;
  certificate_type: string;
  stage_name: string;
  certificate_number: string;
  issued_at: string;
  learner_name: string;
}

export function CertificatesPanel() {
  const { user } = useAuth();
  const { stageStatuses, calculateStageCompletion } = useStageProgress();

  const { data: earnedCertificates } = useQuery({
    queryKey: ["userCertificates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user?.id ?? "");
      if (error) throw error;
      return (data ?? []) as Certificate[];
    },
    enabled: !!user?.id,
  });

  const earnedSet = new Set(earnedCertificates?.map((c) => c.certificate_type) ?? []);

  const stageOrder: StageKey[] = ["bridge", "foundations", "core_cyber", "specialist"];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Certificates</h3>
      </div>

      <div className="space-y-3">
        {stageOrder.map((stageKey) => {
          const stage = stageStatuses.find((s) => s.stage_key === stageKey);
          if (!stage) return null;

          const earned = earnedCertificates?.find(
            (c) => c.certificate_type === stageKey
          );
          const isEarned = earnedSet.has(stageKey);
          const { isComplete, progress, avgScore } = calculateStageCompletion(stageKey);

          return (
            <CertificateCard
              key={stageKey}
              stageKey={stageKey}
              stageName={stage.stage_name}
              isEligible={isComplete && !isEarned}
              isEarned={isEarned}
              certificateNumber={earned?.certificate_number}
              issuedAt={earned?.issued_at}
              progress={progress}
              avgScore={avgScore}
            />
          );
        })}
      </div>
    </div>
  );
}
