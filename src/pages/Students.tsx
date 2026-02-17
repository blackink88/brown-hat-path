import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  MessageCircle,
  FileCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Laptop,
  Award,
  Rocket,
} from "lucide-react";

/* ── What you get ─────────────────────────────────── */

const benefits = [
  {
    icon: BookOpen,
    title: "Structured learning path",
    desc: "Clear levels from Bridge to Advanced. No guessing what comes next - just follow the path.",
  },
  {
    icon: Laptop,
    title: "Hands-on labs",
    desc: "Practice with real tools in guided lab environments. Learn by doing, not just reading.",
  },
  {
    icon: MessageCircle,
    title: "Support & mentoring",
    desc: "Community forums, email support, and mentor check-ins on Practitioner and Professional plans.",
  },
  {
    icon: Award,
    title: "Certification alignment",
    desc: "Our curriculum maps to globally recognised certifications. We also offer discounted exam vouchers.",
  },
  {
    icon: FileCheck,
    title: "Job readiness",
    desc: "Skills portfolio, resume tips, and interview prep so you are ready when employers come calling.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Learn alongside peers, share progress, and collaborate in our learner community.",
  },
];

/* ── How it works steps ───────────────────────────── */

const steps = [
  { step: 1, title: "Sign up", desc: "Create your free account and explore the Bridge course at no cost." },
  { step: 2, title: "Choose your plan", desc: "Pick the tier that matches your goals - Foundation, Practitioner, or Professional." },
  { step: 3, title: "Learn at your pace", desc: "Work through structured modules with hands-on labs and assessments." },
  { step: 4, title: "Get certified", desc: "Use our exam prep and discounted vouchers to earn industry certifications." },
];

/* ── Component ────────────────────────────────────── */

export default function Students() {
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
                <GraduationCap className="h-4 w-4" />
                For Students
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Everything you need to succeed
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                What to expect as a Brown Hat learner: structure, support, tools, and a clear path to a cybersecurity career.
              </p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              What you get
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((item, idx) => (
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

        {/* How it works */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              How it works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((item, idx) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-xl border border-border bg-card animate-fade-up"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "backwards" }}
                >
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What learners say - placeholder */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
              Built for you
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Whether you are starting from scratch or levelling up existing skills, our path adapts to where you are.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: "No IT background", desc: "Start at Level 0 (Bridge) and build digital foundations before diving into cybersecurity." },
                { label: "Some IT experience", desc: "Jump straight into Level 1 (Foundations) and accelerate through the path." },
                { label: "Career switcher", desc: "Our self-paced format lets you study alongside work. Most learners study part-time." },
                { label: "Team upskilling", desc: "Employers can enrol teams with custom corporate packages and dedicated support." },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-8 md:p-10 text-center">
                <Rocket className="h-8 w-8 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Ready to start?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Explore the learning path, pick your plan, and begin building real cybersecurity skills.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
                  <Button size="lg" className="gap-2 font-medium shrink-0" asChild>
                    <Link to="/enroll" className="group">
                      Get started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center gap-4">
                    <Link
                      to="/learning-path"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Learning path
                    </Link>
                    <Link
                      to="/pricing"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                    <Link
                      to="/faq"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      FAQ
                    </Link>
                  </div>
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
