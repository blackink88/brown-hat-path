import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Award } from "lucide-react";
import { CERTIFICATION_OPTIONS } from "@/lib/certifications";

const certs = [
  { name: "CompTIA A+", level: "Foundations", desc: "Core IT and hardware fundamentals." },
  { name: "CompTIA Network+", level: "Foundations", desc: "Networking concepts and protocols." },
  { name: "CompTIA Security+", level: "Core Cyber", desc: "Entry-level security concepts and controls." },
  { name: "ISC² Certified in Cybersecurity (CC)", level: "Core Cyber", desc: "Foundational security knowledge." },
  { name: "CompTIA CySA+", level: "Practitioner", desc: "Security analytics and threat detection." },
  { name: "ISC² SSCP", level: "Practitioner", desc: "Security administration and operations." },
  { name: "CompTIA CASP+", level: "Specialisation", desc: "Advanced security practitioner." },
  { name: "CISSP", level: "Advanced", desc: "Security leadership and architecture." },
  { name: "CISM", level: "Advanced", desc: "Security management and governance." },
];

export default function Certifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: certGoals } = useQuery({
    queryKey: ["userCertificationGoals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_certification_goals")
        .select("certification_slug")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.certification_slug);
    },
    enabled: !!user?.id,
  });

  const addCertGoal = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("user_certification_goals").insert({ user_id: user!.id, certification_slug: slug });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCertificationGoals", user?.id] }),
  });

  const removeCertGoal = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("user_certification_goals").delete().eq("user_id", user!.id).eq("certification_slug", slug);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCertificationGoals", user?.id] }),
  });

  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Certifications</h1>
            <p className="text-lg text-primary-foreground/80">
              Our learning path aligns to internationally recognised certifications so your skills are recognised by employers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {user && (
            <div className="p-6 rounded-xl bg-card border border-border mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-2">My certification goals</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select the exams you&apos;re working toward. We provide support and exam discounts for these certifications; our curriculum aligns to the material.
              </p>
              <div className="flex flex-wrap gap-3">
                {CERTIFICATION_OPTIONS.map((cert) => {
                  const checked = certGoals?.includes(cert.slug) ?? false;
                  return (
                    <label
                      key={cert.slug}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(c) => {
                          if (c) addCertGoal.mutate(cert.slug);
                          else removeCertGoal.mutate(cert.slug);
                        }}
                        disabled={addCertGoal.isPending || removeCertGoal.isPending}
                      />
                      <span className="text-sm font-medium text-foreground">{cert.name}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Manage goals in <Link to="/dashboard/profile" className="text-primary hover:underline">Profile</Link>.
              </p>
            </div>
          )}

          <p className="text-muted-foreground mb-8">
            We don&apos;t issue these certs—you sit the exams with the vendors. Our curriculum prepares you for them.
          </p>
          <div className="space-y-4">
            {certs.map((cert) => (
              <div
                key={cert.name}
                className="p-6 rounded-xl bg-card border border-border flex gap-4 items-start"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{cert.desc}</p>
                  <span className="text-xs text-primary font-medium">{cert.level}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/learning-path">View learning path</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
