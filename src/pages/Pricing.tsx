import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Crown, Globe, Loader2, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PaystackButton } from "@/components/pricing/PaystackButton";

type TierRow = { id: string; name: string; price_zar: number; level: number; features: unknown; paystack_plan_code: string | null };

const tierMeta: Record<string, { icon: typeof Zap; description: string; cta: string; popular: boolean }> = {
  Explorer: {
    icon: BookOpen,
    description: "Try the Bridge course and see if cybersecurity is for you.",
    cta: "Start Exploring",
    popular: false,
  },
  Foundation: {
    icon: Zap,
    description: "Perfect for beginners starting their cybersecurity journey.",
    cta: "Start Foundation",
    popular: false,
  },
  Practitioner: {
    icon: Shield,
    description: "For those ready to dive into core cybersecurity skills.",
    cta: "Start Practitioner",
    popular: true,
  },
  Professional: {
    icon: Crown,
    description: "Complete access for serious career advancement.",
    cta: "Start Professional",
    popular: false,
  },
};

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
    q: "Is there a free option?",
    a: "Yes! Our Explorer tier gives you full access to the Bridge course (Level 0: Digital Readiness) at no cost. It's the perfect way to explore cybersecurity before committing to a paid plan.",
  },
  {
    q: "Do you offer corporate pricing?",
    a: "Yes, we have custom pricing for organizations training multiple employees. Contact us for a quote.",
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutTierId, setCheckoutTierId] = useState<string | null>(null);
  const { formatPrice, currency, isLoading: currencyLoading } = useCurrency();
  const handledCancelledRef = useRef(false);

  useEffect(() => {
    if (searchParams.get("subscription") !== "cancelled" || handledCancelledRef.current) return;
    handledCancelledRef.current = true;
    toast({ title: "Checkout cancelled", description: "You can choose a plan whenever you're ready." });
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("subscription");
      return next;
    }, { replace: true });
  }, [searchParams, setSearchParams, toast]);

  const { data: dbTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["subscription_tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_tiers")
        .select("id, name, price_zar, level, features, paystack_plan_code")
        .order("level");
      if (error) throw error;
      return (data ?? []) as TierRow[];
    },
  });

  const tiers = (dbTiers ?? []).map((t) => {
    const meta = tierMeta[t.name] ?? { icon: Zap, description: "", cta: `Start ${t.name}`, popular: false };
    const features: string[] = Array.isArray(t.features)
      ? t.features
      : typeof t.features === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(t.features);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];
    return {
      id: t.id,
      name: t.name,
      price: formatPrice(t.price_zar),
      planCode: t.paystack_plan_code || "",
      period: "/month",
      description: meta.description,
      icon: meta.icon,
      features,
      cta: meta.cta,
      popular: meta.popular,
    };
  });

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      window.location.href = "/enroll";
      return;
    }
    setCheckoutTierId(tierId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { tier_id: tierId },
      });
      if (error) throw error;
      const url = (data as { url?: string })?.url;
      if (url) window.location.href = url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      toast({
        title: "Checkout failed",
        description: e instanceof Error ? e.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setCheckoutTierId(null);
    }
  };

  const isLoading = currencyLoading || tiersLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero - consistent with homepage */}
        <section className="relative bg-background border-b border-border overflow-hidden">
          {/* Gradient wash */}
          <div
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              background:
                "linear-gradient(160deg, hsl(var(--muted)) 0%, transparent 50%, hsl(var(--background)) 100%)",
            }}
          />
          {/* Animated cyber grid */}
          <div className="absolute inset-0 cyber-grid pointer-events-none" />
          <div className="absolute inset-0 security-doodle pointer-events-none" />
          <div className="container relative py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="h-1 w-12 rounded-full bg-primary mb-8" aria-hidden />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Simple, transparent pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-6">
                Invest in your future with locally affordable, internationally recognized training.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {isLoading ? "Detecting your region..." : `Prices shown in ${currency}`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Explorer tier - always rendered from static data */}
              {(() => {
                const meta = tierMeta.Explorer;
                const explorerFeatures = [
                  "Level 0: Bridge - Digital Readiness",
                  "Computer fundamentals & digital literacy",
                  "Basic networking concepts",
                  "No credit card required",
                ];
                return (
                  <div className="relative p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <meta.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Explorer</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">Free</span>
                      <span className="text-muted-foreground">/forever</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{meta.description}</p>
                    <ul className="space-y-3 mb-8">
                      {explorerFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="lg" className="w-full gap-2 font-medium" asChild>
                      <Link to="/enroll" className="group">
                        {meta.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                );
              })()}

              {/* Paid tiers from DB */}
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    "relative p-8 rounded-2xl border bg-card transition-all",
                    tier.popular
                      ? "border-accent shadow-xl sm:scale-105 z-10"
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
                  {user ? (
                    <PaystackButton
                      planCode={tier.planCode}
                      tierName={tier.name}
                      popular={tier.popular}
                    />
                  ) : (
                    <Button variant={tier.popular ? "default" : "outline"} size="lg" className="w-full gap-2 font-medium" asChild>
                      <Link to="/enroll" className="group">
                        {tier.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  )}
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
              <Button variant="default" size="lg" className="gap-2 font-medium" asChild>
                <Link to="/employers" className="group">
                  Contact for corporate pricing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
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
