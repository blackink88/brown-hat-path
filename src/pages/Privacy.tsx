import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Database,
  Settings,
  Lock,
  UserCheck,
  RefreshCw,
  ShieldCheck,
  Clock,
  ArrowRight,
  Mail,
} from "lucide-react";

/* ── Section data ─────────────────────────────────── */

const sections = [
  {
    icon: Shield,
    title: "Who we are",
    content:
      "Brown Hat Cybersecurity Academy (\"we\", \"us\") provides online cybersecurity education. This policy describes how we collect, use, and protect your personal information. We comply with the Protection of Personal Information Act (POPIA) in South Africa.",
  },
  {
    icon: Database,
    title: "Information we collect",
    content:
      "We may collect: name, email address, account and payment-related information, and any information you provide when you contact us or use our services. We may also collect usage data (e.g. how you use the platform) to improve our services.",
  },
  {
    icon: Settings,
    title: "How we use it",
    content:
      "We use your information to provide and improve our services, process payments, communicate with you, and comply with legal obligations.",
    callout: "We do not sell your personal information to third parties.",
  },
  {
    icon: Lock,
    title: "Security and retention",
    content:
      "We take reasonable steps to protect your data. We retain your information only as long as necessary for the purposes set out in this policy or as required by law.",
  },
  {
    icon: UserCheck,
    title: "Your rights",
    content:
      "You may request access to, correction of, or deletion of your personal information, subject to applicable law. Contact us at hello@brownhat.academy for any privacy-related requests.",
    callout: "Under POPIA, you have the right to know what personal information we hold about you.",
  },
  {
    icon: RefreshCw,
    title: "Changes to this policy",
    content:
      "We may update this policy from time to time. The \"Last updated\" date will reflect the latest version. Continued use of our services after changes constitutes acceptance of the updated policy.",
  },
];

/* ── Component ────────────────────────────────────── */

export default function Privacy() {
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
                <Shield className="h-4 w-4" />
                Your Privacy
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-6">
                How we collect, use, and protect your personal information. We comply with the Protection of Personal Information Act (POPIA).
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Last updated: 17 February 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div
                  key={section.title}
                  className="p-6 md:p-8 rounded-xl border border-border bg-card animate-fade-up"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        {idx + 1}. {section.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      {section.callout && (
                        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-sm font-medium text-foreground flex items-start gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {section.callout}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-8 md:p-10 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Privacy questions?
                </h2>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this policy or your personal information, get in touch.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
                  <Button size="lg" className="gap-2 font-medium shrink-0" asChild>
                    <Link to="/contact" className="group">
                      Contact us
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <a
                    href="mailto:hello@brownhat.academy"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    hello@brownhat.academy
                  </a>
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
