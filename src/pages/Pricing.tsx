import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Users, Building2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: 499,
    period: "month",
    description: "Perfect for individuals starting their cybersecurity journey.",
    features: [
      "Access to Level 0 (Bridge) & Level 1 (Foundations)",
      "Self-paced learning",
      "Community forum access",
      "Certificate of completion",
      "Email support",
    ],
    cta: "Get Started",
    href: "/enroll",
    variant: "outline" as const,
    icon: Zap,
  },
  {
    name: "Standard",
    price: 1500,
    period: "month",
    description: "Full learning path for serious career switchers.",
    popular: true,
    features: [
      "Everything in Starter",
      "Full path: Levels 0–5",
      "Mentor check-ins (monthly)",
      "Certification prep materials",
      "Job readiness resources",
      "Priority email support",
    ],
    cta: "Start Learning",
    href: "/enroll",
    variant: "accent" as const,
    icon: Users,
  },
  {
    name: "Pro",
    price: 3000,
    period: "month",
    description: "For teams and accelerated learners who want more support.",
    features: [
      "Everything in Standard",
      "Weekly 1:1 mentor sessions",
      "Custom learning plan",
      "Resume & interview prep",
      "LinkedIn profile review",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: "/contact",
    variant: "outline" as const,
    icon: Building2,
  },
  {
    name: "Custom",
    price: null,
    period: null,
    description: "Enterprise, bootcamps, or tailored programmes for your organisation.",
    features: [
      "Bulk licensing",
      "Custom curricula",
      "On-site or virtual cohorts",
      "Dedicated success manager",
      "Reporting & analytics",
      "SLA & support terms",
    ],
    cta: "Get a Quote",
    href: "/contact",
    variant: "default" as const,
    icon: MessageCircle,
    custom: true,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 gradient-hero relative">
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Choose the tier that fits your goals. All plans include access to our internationally aligned curriculum. Cancel anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card
                    key={tier.name}
                    className={cn(
                      "flex flex-col border-border shadow-soft hover:shadow-card transition-all duration-300",
                      tier.popular && "ring-2 ring-accent border-accent/30 relative"
                    )}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-accent text-accent-foreground">Most popular</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                      </div>
                      <CardDescription>{tier.description}</CardDescription>
                      {tier.price !== null ? (
                        <div className="pt-2">
                          <span className="text-3xl font-bold text-foreground">R{tier.price.toLocaleString()}</span>
                          <span className="text-muted-foreground">/{tier.period}</span>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <span className="text-2xl font-bold text-foreground">Custom</span>
                          <p className="text-sm text-muted-foreground">Tailored to your needs</p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                      <ul className="space-y-2">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant={tier.variant} size="lg" className="w-full" asChild>
                        <Link to={tier.href}>{tier.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Subtext */}
        <section className="py-8 bg-muted/50 border-t border-border">
          <div className="container text-center">
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              All prices in ZAR (South African Rand). Monthly subscription; cancel anytime. No hidden fees. POPIA compliant.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
