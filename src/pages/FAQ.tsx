import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  GraduationCap,
  CreditCard,
  Award,
  LifeBuoy,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── FAQ data by category ─────────────────────────── */

const faqCategories = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: GraduationCap,
    faqs: [
      {
        q: "Do I need a degree or IT background?",
        a: "No. We have a Bridge (Level 0) for learners with no prior IT experience. You can start there and progress into our Foundations and beyond. Many of our learners are career switchers.",
      },
      {
        q: "How long does the learning path take?",
        a: "It depends on your starting level and pace. Bridge is about 1 week; Foundations 8 weeks; each subsequent level has an estimated duration. Full path from Bridge to Advanced can take roughly 12 months to 2 years part-time.",
      },
      {
        q: "Can I study part-time?",
        a: "Absolutely. All our content is self-paced with structured milestones. Most learners balance their studies with work or other commitments.",
      },
      {
        q: "What tools will I use?",
        a: "You will work with industry-standard tools including SIEM platforms, vulnerability scanners, Linux command line, networking utilities, and cloud security consoles. All tools are introduced progressively as you advance through levels.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Plans",
    icon: CreditCard,
    faqs: [
      {
        q: "How does pricing work?",
        a: "We offer monthly subscription tiers: Explorer (Free), Foundation (R499), Practitioner (R1,500), and Professional (R3,000). There's also a custom option for teams and enterprises. You can cancel anytime. See the Pricing page for full details.",
      },
      {
        q: "Can I get a refund?",
        a: "We don't offer refunds on monthly subscriptions, but you can cancel anytime so you're not charged for the next month. For custom or bulk programmes, terms are agreed separately.",
      },
    ],
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: Award,
    faqs: [
      {
        q: "What certifications does Brown Hat align to?",
        a: "Our path aligns to CompTIA (A+, Network+, Security+, CySA+, PenTest+, CASP+), ISC2 (CC, SSCP, CISSP), Microsoft SC-200, AWS Security Specialty, and more. We also offer discounted exam vouchers for select certifications. See the Certifications page for the full list.",
      },
      {
        q: "Are certification exam fees included?",
        a: "No, international certification exam fees are paid separately to the vendors. We prepare you to pass these exams on your first attempt and offer discounted vouchers for many certifications through our vendor partnerships.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    icon: LifeBuoy,
    faqs: [
      {
        q: "Is there support or mentoring?",
        a: "Yes. Practitioner and Professional tiers include mentor check-ins; Professional includes 1-on-1 mentorship. We also have community forums and email support for all learners.",
      },
      {
        q: "Is there a community?",
        a: "Yes! All learners get access to our community where you can connect with peers, ask questions, and collaborate. Higher tiers unlock live Q&A sessions and direct mentor access.",
      },
    ],
  },
];

/* ── Component ────────────────────────────────────── */

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredCategories =
    activeCategory === "all"
      ? faqCategories
      : faqCategories.filter((c) => c.id === activeCategory);

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
                <HelpCircle className="h-4 w-4" />
                FAQ
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Frequently asked questions
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Everything you need to know about Brown Hat Academy, our learning path, pricing, and support.
              </p>
            </div>
          </div>
        </section>

        {/* Category tabs + FAQs */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            {/* Filter pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all",
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                )}
              >
                All
              </button>
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ groups */}
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="mb-10 last:mb-0 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{cat.label}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {cat.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`${cat.id}-${i}`}
                      className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-md transition-shadow [&:not(:first-child)]:mt-0"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-5 font-semibold">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Still have questions? CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-8 md:p-10 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Still have questions?
                </h2>
                <p className="text-muted-foreground mb-6">
                  We are here to help. Reach out and we will get back to you.
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
