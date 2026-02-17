import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckSquare,
  BookOpen,
  User,
  CreditCard,
  ShieldAlert,
  AlertTriangle,
  Mail,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

/* ── Section data ─────────────────────────────────── */

const sections = [
  {
    icon: CheckSquare,
    title: "Acceptance",
    content:
      "By using Brown Hat Cybersecurity Academy's website and services, you agree to these Terms of Service. If you do not agree, please do not use our services.",
  },
  {
    icon: BookOpen,
    title: "Services",
    content:
      "We provide online learning content, mentoring (where applicable), and related support. Access and features depend on your chosen plan. We reserve the right to update content and offerings.",
  },
  {
    icon: User,
    title: "Your account",
    content:
      "You are responsible for keeping your account credentials secure and for all activity under your account.",
    callout: "You must provide accurate information when signing up.",
  },
  {
    icon: CreditCard,
    title: "Payment and cancellation",
    content:
      "Subscription fees are charged in accordance with your plan. We do not offer refunds for partial months.",
    callout: "You may cancel at any time. Cancellation applies from the next billing cycle.",
  },
  {
    icon: ShieldAlert,
    title: "Acceptable use",
    content:
      "You may not misuse our platform, share account access inappropriately, or use our materials in a way that violates law or third-party rights. We may suspend or terminate access for breach of these terms.",
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer",
    content:
      "Our content is for educational purposes. We do not guarantee employment or certification outcomes.",
    callout: "Certification exams are administered by third-party bodies. We are not responsible for their policies or results.",
  },
  {
    icon: Mail,
    title: "Contact",
    content:
      "For questions about these terms, contact us at hello@brownhat.academy.",
  },
];

/* ── Component ────────────────────────────────────── */

export default function Terms() {
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
                <FileText className="h-4 w-4" />
                Legal
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-6">
                The terms that govern your use of Brown Hat Cybersecurity Academy.
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
                  Questions about these terms?
                </h2>
                <p className="text-muted-foreground mb-6">
                  If anything is unclear, we are happy to help.
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
