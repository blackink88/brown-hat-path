import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Award,
  Shield,
  Globe,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Vendor-coloured badge ────────────────────────── */

const vendorStyles: Record<string, { bg: string; text: string; border: string }> = {
  comptia: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/20" },
  isc2: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20" },
  microsoft: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
  aws: { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/20" },
  isaca: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
};

function VendorBadge({ vendor }: { vendor: string }) {
  const style = vendorStyles[vendor] ?? vendorStyles.comptia;
  return (
    <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 border", style.bg, style.border)}>
      <Shield className={cn("h-6 w-6", style.text)} />
    </div>
  );
}

/* ── Cert data grouped by level ───────────────────── */

interface Cert {
  name: string;
  vendor: string;
  desc: string;
  discount: boolean;
  free: boolean;
}

const certLevels: {
  level: number;
  name: string;
  code: string;
  color: string;
  certs: Cert[];
}[] = [
  {
    level: 1,
    name: "Foundations",
    code: "BH-FOUND 1",
    color: "bg-level-foundation",
    certs: [
      { name: "CompTIA A+", vendor: "comptia", desc: "Core IT and hardware fundamentals.", discount: true, free: false },
      { name: "CompTIA Network+", vendor: "comptia", desc: "Networking concepts and protocols.", discount: true, free: false },
    ],
  },
  {
    level: 2,
    name: "Core Cyber",
    code: "BH-CYBER 2",
    color: "bg-level-core",
    certs: [
      { name: "CompTIA Security+", vendor: "comptia", desc: "Entry-level security concepts and controls.", discount: true, free: false },
      { name: "ISC2 Certified in Cybersecurity (CC)", vendor: "isc2", desc: "Foundational security knowledge.", discount: false, free: true },
    ],
  },
  {
    level: 3,
    name: "Practitioner",
    code: "BH-OPS 2 / BH-GRC 2",
    color: "bg-level-practitioner",
    certs: [
      { name: "CompTIA CySA+", vendor: "comptia", desc: "Security analytics and threat detection.", discount: true, free: false },
      { name: "ISC2 SSCP", vendor: "isc2", desc: "Security administration and operations.", discount: true, free: false },
    ],
  },
  {
    level: 4,
    name: "Specialisation",
    code: "BH-SOC / BH-IAM / BH-CLOUD / BH-GRC",
    color: "bg-level-specialisation",
    certs: [
      { name: "CompTIA PenTest+", vendor: "comptia", desc: "Penetration testing and vulnerability assessment.", discount: true, free: false },
      { name: "CompTIA CASP+", vendor: "comptia", desc: "Advanced enterprise security architecture.", discount: true, free: false },
      { name: "Microsoft SC-200", vendor: "microsoft", desc: "Security operations with Microsoft Defender and Sentinel.", discount: true, free: false },
      { name: "AWS Security Specialty", vendor: "aws", desc: "Cloud security on Amazon Web Services.", discount: true, free: false },
    ],
  },
  {
    level: 5,
    name: "Advanced & Leadership",
    code: "BH-ARCH / BH-LEAD",
    color: "bg-level-advanced",
    certs: [
      { name: "CISSP", vendor: "isc2", desc: "Security leadership and architecture. Requires 5 years professional experience.", discount: false, free: false },
      { name: "CISM", vendor: "isaca", desc: "Security management and governance. Requires 5 years professional experience.", discount: false, free: false },
    ],
  },
];

/* ── Why certs matter ─────────────────────────────── */

const valueProps = [
  { icon: Globe, title: "Globally Recognised", desc: "Your skills are validated by international standards that employers trust worldwide." },
  { icon: Briefcase, title: "Employer Demanded", desc: "Certifications are increasingly required for cybersecurity roles across industries." },
  { icon: TrendingUp, title: "Career Growth", desc: "Certified professionals earn more and advance faster in the cybersecurity field." },
];

/* ── Component ────────────────────────────────────── */

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-background border-b border-border overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              background:
                "linear-gradient(160deg, hsl(var(--muted)) 0%, transparent 50%, hsl(var(--background)) 100%)",
            }}
          />
          <div className="absolute inset-0 cyber-grid pointer-events-none" />
          <div className="absolute inset-0 security-doodle pointer-events-none" />
          <div className="container relative py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="h-1 w-12 rounded-full bg-primary mb-8" aria-hidden />
              <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Industry-recognised certifications
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Our curriculum aligns to globally recognised certifications so your skills are validated by employers worldwide. We prepare you to pass - you sit the exams with the vendors.
              </p>
            </div>
          </div>
        </section>

        {/* User's enrolled certs */}
        {user && certificationsInPath && certificationsInPath.length > 0 && (
          <section className="py-8 bg-muted/30 border-b border-border">
            <div className="container max-w-4xl">
              <div className="p-6 rounded-xl bg-card border border-border shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-2">Certifications in your path</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your enrolled courses. Discounted exam vouchers available for select certifications.
                </p>
                <div className="space-y-2">
                  {certificationsInPath
                    .filter((c) => c.certs.length > 0)
                    .map((c) => (
                      <div key={c.code} className="text-sm">
                        <span className="font-mono text-primary">{c.code}</span>
                        <span className="text-muted-foreground mx-2">&rarr;</span>
                        <span className="text-foreground">{c.certs.join(", ")}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Discount legend */}
        <section className="pt-16 md:pt-24 pb-4">
          <div className="container max-w-4xl">
            <p className="text-sm text-muted-foreground">
              Certifications marked with{" "}
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-600 rounded-full">
                Exam discount
              </span>{" "}
              are eligible for discounted exam vouchers through our vendor partnerships.
            </p>
          </div>
        </section>

        {/* Cert levels */}
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl">
            {certLevels.map((levelGroup, groupIdx) => (
              <div
                key={levelGroup.level}
                className="mb-12 last:mb-0 animate-fade-up"
                style={{ animationDelay: `${groupIdx * 100}ms`, animationFillMode: "backwards" }}
              >
                {/* Level header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg", levelGroup.color)}>
                    {levelGroup.level}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Level {levelGroup.level}: {levelGroup.name}</h2>
                    <p className="text-sm text-muted-foreground font-mono">{levelGroup.code}</p>
                  </div>
                </div>

                {/* Cert cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {levelGroup.certs.map((cert) => (
                    <div
                      key={cert.name}
                      className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4 items-start">
                        <VendorBadge vendor={cert.vendor} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-foreground">{cert.name}</h3>
                            {cert.discount && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-600 rounded-full">
                                Exam discount
                              </span>
                            )}
                            {cert.free && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-primary/10 text-primary rounded-full">
                                Free exam
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{cert.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why certifications matter */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Why certifications matter
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {valueProps.map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-8 md:p-10 text-center">
                <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Ready to get certified?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start your learning path and we will prepare you for the certifications that matter.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
                  <Button size="lg" className="gap-2 font-medium shrink-0" asChild>
                    <Link to="/enroll" className="group">
                      Get started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <Link
                    to="/learning-path"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View learning path
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
