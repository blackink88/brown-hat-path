import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Skull, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bhlogo from "@/assets/bhlogo.png";

const TERMINAL_LINES = [
  "$ bh-scan --network 10.0.0.0/24",
  "[!] Threat detected: port 445",
  "[+] Firewall rule applied",
  "[+] Network secured \u2713",
];

function useTypingEffect() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const full = TERMINAL_LINES.join("\n");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(id);
  }, []);

  return { displayed, done };
}

type HatCard = {
  label: string;
  tagline: string;
  icon: "skull" | "shield" | "logo";
  variant: "faded-left" | "prominent" | "faded-right";
};

const HATS: HatCard[] = [
  { label: "Black Hat", tagline: "Breaks systems", icon: "skull", variant: "faded-left" },
  { label: "Brown Hat", tagline: "Builds and defends", icon: "logo", variant: "prominent" },
  { label: "White Hat", tagline: "Fixes vulnerabilities", icon: "shield", variant: "faded-right" },
];

export function HeroSection() {
  const { displayed, done } = useTypingEffect();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden gradient-hero text-white">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute inset-0 security-doodle pointer-events-none opacity-30" />

      <div className="container relative z-10 py-16 md:py-24">
        {/* Three Hats cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-12 md:mb-16">
          {HATS.map((hat, i) => {
            const isProminent = hat.variant === "prominent";
            const isFadedLeft = hat.variant === "faded-left";
            const isFadedRight = hat.variant === "faded-right";

            return (
              <div
                key={hat.label}
                className={cn(
                  "rounded-2xl border backdrop-blur-sm p-6 transition-all",
                  "animate-fade-up",
                  // Sizing
                  isProminent
                    ? "w-72 md:w-80"
                    : "w-60 md:w-64",
                  // Desktop tilt & float
                  isFadedLeft && "md:animate-float-tilt-left md:-rotate-6",
                  isFadedRight && "md:animate-float-tilt-right md:rotate-6",
                  isProminent && "animate-float-card",
                  // Opacity & colors
                  isProminent
                    ? "border-primary/60 bg-white/10 animate-glow-pulse"
                    : "border-white/10 bg-white/5 opacity-60",
                )}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: "backwards" }}
              >
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center rounded-xl mb-4",
                  isProminent ? "h-14 w-14 bg-primary/20" : "h-12 w-12 bg-white/10"
                )}>
                  {hat.icon === "skull" && <Skull className="h-6 w-6 text-white/70" />}
                  {hat.icon === "shield" && <ShieldCheck className="h-6 w-6 text-white/70" />}
                  {hat.icon === "logo" && (
                    <img src={bhlogo} alt="Brown Hat" className="h-8 w-auto" />
                  )}
                </div>

                {/* Label & tagline */}
                <h3 className={cn(
                  "font-bold mb-1",
                  isProminent ? "text-xl text-white" : "text-lg text-white/80"
                )}>
                  {hat.label}
                </h3>
                <p className={cn(
                  "text-sm",
                  isProminent ? "text-white/80" : "text-white/50"
                )}>
                  {hat.tagline}
                </p>

                {/* Terminal - only on Brown Hat card */}
                {isProminent && (
                  <div className="mt-4 rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="h-2 w-2 rounded-full bg-red-400/60" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                      <span className="h-2 w-2 rounded-full bg-green-400/60" />
                    </div>
                    <pre className="whitespace-pre-wrap text-green-300/90 min-h-[4.5rem]">
                      {displayed}
                      {!done && <span className="animate-blink-cursor text-primary">|</span>}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Copy section */}
        <div className="text-center max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Train to build. Learn to defend.
          </h1>
          <p className="text-base md:text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Practical cybersecurity training aligned to CompTIA, ISC2, and Microsoft - no degree required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <Button size="lg" className="gap-2 font-medium shadow-sm w-full sm:w-auto" asChild>
              <Link to="/enroll" className="group">
                Start your journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 font-medium border-white/20 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto" asChild>
              <Link to="/about">
                Who is a Brown Hat?
              </Link>
            </Button>
          </div>

          {/* Trust bar */}
          <p className="text-xs text-white/40 tracking-wide">
            Aligned to CompTIA Security+ &middot; ISC2 CC &middot; Microsoft SC-900
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-scroll">
        <ChevronDown className="h-6 w-6 text-white/40" />
      </div>
    </section>
  );
}
