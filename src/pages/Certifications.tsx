import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const certs = [
  { name: "CompTIA A+", level: "Foundations", desc: "Core IT and hardware fundamentals." },
  { name: "CompTIA Network+", level: "Foundations", desc: "Networking concepts and protocols." },
  { name: "CompTIA Security+", level: "Core Cyber", desc: "Entry-level security concepts and controls." },
  { name: "ISC² Certified in Cybersecurity (CC)", level: "Core Cyber", desc: "Foundational security knowledge." },
  { name: "CompTIA CySA+", level: "Practitioner", desc: "Security analytics and threat detection." },
  { name: "ISC² SSCP", level: "Practitioner", desc: "Security administration and operations." },
  { name: "CompTIA CASP+", level: "Specialisation", desc: "Advanced security practitioner." },
  { name: "Microsoft SC-200", level: "Specialisation", desc: "Security operations with Microsoft Defender and Sentinel." },
  { name: "AWS Security – Specialty", level: "Specialisation", desc: "Cloud security on Amazon Web Services." },
  { name: "CISSP", level: "Advanced", desc: "Security leadership and architecture." },
  { name: "CISM", level: "Advanced", desc: "Security management and governance." },
  { name: "TOGAF", level: "Advanced", desc: "Enterprise architecture and security governance." },
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

          <p className="text-muted-foreground mb-8">
            We don&apos;t issue these certs - you sit the exams with the vendors. Our curriculum prepares you for them.
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
