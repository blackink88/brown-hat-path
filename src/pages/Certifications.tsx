import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const certs = [
  { name: "CompTIA A+", level: "Level 1: Foundations (BH-FOUND 1)", desc: "Core IT and hardware fundamentals.", discount: true },
  { name: "CompTIA Network+", level: "Level 1: Foundations (BH-FOUND 1)", desc: "Networking concepts and protocols.", discount: true },
  { name: "CompTIA Security+", level: "Level 2: Core Cyber (BH-CYBER 2)", desc: "Entry-level security concepts and controls.", discount: true },
  { name: "ISC² Certified in Cybersecurity (CC)", level: "Level 2: Core Cyber (BH-CYBER 2)", desc: "Foundational security knowledge. Free to take.", discount: false },
  { name: "CompTIA CySA+", level: "Level 3: Practitioner (BH-OPS 2)", desc: "Security analytics and threat detection.", discount: true },
  { name: "ISC² SSCP", level: "Level 3: Practitioner (BH-OPS 2 / BH-GRC 2)", desc: "Security administration and operations.", discount: true },
  { name: "CompTIA PenTest+", level: "Level 4: Specialisation (BH-SOC)", desc: "Penetration testing and vulnerability assessment.", discount: true },
  { name: "CompTIA CASP+", level: "Level 4: Specialisation (BH-SOC / BH-IAM)", desc: "Advanced enterprise security architecture.", discount: true },
  { name: "Microsoft SC-200", level: "Level 4: Specialisation (BH-CLOUD)", desc: "Security operations with Microsoft Defender and Sentinel.", discount: true },
  { name: "AWS Security Specialty", level: "Level 4: Specialisation (BH-CLOUD)", desc: "Cloud security on Amazon Web Services.", discount: true },
  { name: "CISSP", level: "Level 5: Advanced (BH-ARCH / BH-LEAD)", desc: "Security leadership and architecture. Requires 5 years professional experience.", discount: false },
  { name: "CISM", level: "Level 5: Advanced (BH-ARCH / BH-LEAD)", desc: "Security management and governance. Requires 5 years professional experience.", discount: false },
];

export default function Certifications() {
  const { user } = useAuth();

  const { data: certificationsInPath } = useQuery({
    queryKey: ["certificationsInPath", user?.id],
    queryFn: async () => {
      const { data: enrollments, error: eErr } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", user!.id);
      if (eErr) throw eErr;
      const courseIds = (enrollments ?? []).map((r) => r.course_id);
      if (courseIds.length === 0) return [];
      const { data: courses, error: cErr } = await supabase
        .from("courses")
        .select("code, title, aligned_certifications")
        .in("id", courseIds);
      if (cErr) throw cErr;
      return (courses ?? []).map((c) => ({
        code: c.code,
        title: c.title,
        certs: Array.isArray(c.aligned_certifications) ? c.aligned_certifications : [],
      }));
    },
    enabled: !!user?.id,
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
          {user && certificationsInPath && certificationsInPath.length > 0 && (
            <div className="p-6 rounded-xl bg-card border border-border mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-2">Certifications in your path</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your enrolled courses. We provide support and exam discounts for these certifications.
              </p>
              <div className="space-y-2">
                {certificationsInPath
                  .filter((c) => c.certs.length > 0)
                  .map((c) => (
                    <div key={c.code} className="text-sm">
                      <span className="font-mono text-primary">{c.code}</span>
                      <span className="text-muted-foreground mx-2">→</span>
                      <span className="text-foreground">{c.certs.join(", ")}</span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                See <Link to="/dashboard/profile" className="text-primary hover:underline">Profile</Link> for full details.
              </p>
            </div>
          )}

          <p className="text-muted-foreground mb-4">
            We don&apos;t issue these certs - you sit the exams with the vendors. Our curriculum prepares you for them.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Certifications marked with <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-600 rounded-full">Exam discount</span> are eligible for discounted exam vouchers through our vendor partnerships.
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{cert.name}</h3>
                    {cert.discount && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-600 rounded-full">
                        Exam discount
                      </span>
                    )}
                  </div>
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
