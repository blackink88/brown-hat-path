import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Crown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";

const faqs = [
  {
    q: "Are certification exam fees included?",
    a: "No, international certification exam fees (CompTIA, ISC², Microsoft, etc.) are paid separately. We prepare you to pass these exams on your first attempt.",
  },
  {
    q: "Can I switch tiers?",
    a: "Yes! You can upgrade or downgrade your subscription at any time. Changes take effect on your next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "We offer a 7-day money-back guarantee on all tiers. If you're not satisfied, we'll refund your first month.",
  },
  {
    q: "Do you offer corporate pricing?",
    a: "Yes, we have custom pricing for organizations training multiple employees. Contact us for a quote.",
  },
];

const Pricing = () => {
  const { getPrices, currency, isLoading } = useCurrency();
  const prices = getPrices();

  const tiers = [
    {
      name: "Foundation",
      price: prices.foundation,
      period: "/month",
      description: "Perfect for beginners starting their cybersecurity journey.",
      icon: Zap,
      features: [
        "Level 0: Technical Readiness Program",
        "Level 1: Foundations Curriculum",
        "Basic Skills Radar tracking",
        "Community forum access",
        "Email support",
      ],
      cta: "Start Foundation",
      popular: false,
    },
    {
      name: "Practitioner",
      price: prices.practitioner,
      period: "/month",
      description: "For those ready to dive into core cybersecurity skills.",
      icon: Shield,
      features: [
        "Everything in Foundation, plus:",
        "Level 2: Core Cyber curriculum",
        "Level 3: Practitioner Core (Blue Team or GRC)",
        "Certification path tracking",
        "Toolbox Mastery modules",
        "Live Q&A sessions",
        "Priority email support",
      ],
      cta: "Start Practitioner",
      popular: true,
    },
    {
      name: "Professional",
      price: prices.professional,
      period: "/month",
      description: "Complete access for serious career advancement.",
      icon: Crown,
      features: [
        "Everything in Practitioner, plus:",
        "Level 4: Specialisation Tracks",
        "Level 5: Advanced & Leadership",
        "Amajoni Intern eligibility",
        "Career coaching sessions",
        "Verified Skills Portfolio",
        "Employer introductions",
        "1-on-1 mentorship",
      ],
      cta: "Start Professional",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="container relative py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Invest in your future with locally affordable, internationally recognized training.
              </p>
              {/* Currency indicator */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground/90">
                  {isLoading ? "Detecting your region..." : `Prices shown in ${currency}`}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    "relative p-8 rounded-2xl border bg-card transition-all",
                    tier.popular
                      ? "border-accent shadow-xl scale-105 z-10"
                      : "border-border hover:shadow-lg"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <tier.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    {isLoading ? (
                      <Skeleton className="h-10 w-24" />
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                        <span className="text-muted-foreground">{tier.period}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={tier.popular ? "accent" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link to="/enroll">{tier.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Training for Teams
              </h2>
              <p className="text-muted-foreground mb-8">
                Need to upskill your security team or build an internal cybersecurity capability? We offer custom corporate packages with dedicated support.
              </p>
              <Button variant="default" size="lg" asChild>
                <Link to="/employers">Contact for Corporate Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
