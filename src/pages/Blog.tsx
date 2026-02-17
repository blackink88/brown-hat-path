import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  PenLine,
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
  BookOpen,
} from "lucide-react";

/* ── Upcoming topics preview ──────────────────────── */

const upcomingTopics = [
  {
    icon: Shield,
    title: "Getting started in cybersecurity",
    desc: "A practical guide for beginners who want to break into the field without a degree.",
    tag: "Career",
  },
  {
    icon: Award,
    title: "Certification roadmap 2026",
    desc: "Which certifications to pursue first and how to plan your exam schedule.",
    tag: "Certifications",
  },
  {
    icon: TrendingUp,
    title: "Cybersecurity salary trends in South Africa",
    desc: "What employers are paying and which roles are in highest demand.",
    tag: "Industry",
  },
  {
    icon: BookOpen,
    title: "Study tips for working professionals",
    desc: "How to balance part-time cybersecurity study with a full-time job.",
    tag: "Learning",
  },
];

/* ── Component ────────────────────────────────────── */

export default function Blog() {
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
                <PenLine className="h-4 w-4" />
                Blog
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Insights & updates
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Articles on cybersecurity careers, certification tips, and updates from the Brown Hat team.
              </p>
            </div>
          </div>
        </section>

        {/* Coming soon */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card mb-16">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-10 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <PenLine className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Coming soon
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We are preparing practical content on careers, certifications, and learning. Check back soon or follow us for updates.
                </p>
              </div>
            </div>

            {/* Upcoming topics preview */}
            <h2 className="text-2xl font-bold text-foreground text-center mb-2">
              What we are working on
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Here is a preview of the topics we will be covering.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {upcomingTopics.map((topic, idx) => (
                <div
                  key={topic.title}
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow animate-fade-up"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <topic.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-muted text-muted-foreground rounded-full">
                      {topic.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Start learning today
              </h2>
              <p className="text-muted-foreground mb-6">
                Do not wait for the blog - start building cybersecurity skills now.
              </p>
              <Button size="lg" className="gap-2 font-medium" asChild>
                <Link to="/enroll" className="group">
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
