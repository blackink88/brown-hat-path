import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Heart,
  Globe,
  Lightbulb,
  Shield,
  ArrowRight,
  Mail,
} from "lucide-react";

/* ── Why work here ────────────────────────────────── */

const values = [
  {
    icon: Heart,
    title: "Mission-driven",
    desc: "We are closing the cybersecurity skills gap in Africa. Every day, your work directly impacts learners' careers.",
  },
  {
    icon: Globe,
    title: "Remote-first",
    desc: "Work from anywhere in South Africa. We believe great work happens where you are most comfortable.",
  },
  {
    icon: Lightbulb,
    title: "Build from scratch",
    desc: "We are an early-stage team. You will shape the product, culture, and direction from the ground up.",
  },
  {
    icon: Shield,
    title: "Cybersecurity focus",
    desc: "Work at the intersection of education and security. Learn while you build.",
  },
];

/* ── Component ────────────────────────────────────── */

export default function Careers() {
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
                <Briefcase className="h-4 w-4" />
                Careers
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Join the team
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                We are a small team building accessible cybersecurity education for Africa. If that mission excites you, we would like to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Why work here */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Why Brown Hat
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map((item, idx) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow animate-fade-up"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
                >
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

        {/* Open roles */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Open roles
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-10 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No open roles right now
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We are not actively hiring, but we are always interested in meeting people who care about cybersecurity education. Send us your CV and a short note about what excites you.
                </p>
                <Button size="lg" className="gap-2 font-medium" asChild>
                  <Link to="/contact" className="group">
                    Get in touch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Reach out directly
            </h2>
            <p className="text-muted-foreground mb-4">
              Send your CV and a short note to
            </p>
            <a
              href="mailto:hello@brownhat.academy"
              className="text-lg font-medium text-primary hover:underline"
            >
              hello@brownhat.academy
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
