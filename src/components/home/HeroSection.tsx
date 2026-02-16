import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Skull, ShieldCheck, ChevronDown, Lock, Bug, Wifi, Shield, Terminal, BookOpen, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import brownhatLogo from "@/assets/brownhat.png";

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
  description: string;
  traits: string[];
  icon: "skull" | "shield" | "logo";
  variant: "faded-left" | "prominent" | "faded-right";
};

const HATS: HatCard[] = [
  {
    label: "Black Hat",
    tagline: "Breaks systems",
    description: "Exploits vulnerabilities for personal gain. Unauthorized access, data theft, and disruption.",
    traits: ["Exploits", "Social Engineering", "Malware"],
    icon: "skull",
    variant: "faded-left",
  },
  {
    label: "Brown Hat",
    tagline: "Builds and defends",
    description: "Understands offense to build better defense. Practical, ethical, and industry-ready.",
    traits: ["Offense-Informed", "Ethical", "Certified"],
    icon: "logo",
    variant: "prominent",
  },
  {
    label: "White Hat",
    tagline: "Fixes vulnerabilities",
    description: "Authorized security testing and compliance. Penetration testing and auditing.",
    traits: ["Pentesting", "Compliance", "Auditing"],
    icon: "shield",
    variant: "faded-right",
  },
];

const STATS = [
  { icon: BookOpen, value: "6", label: "Learning levels" },
  { icon: Award, value: "3+", label: "Certifications aligned" },
  { icon: Terminal, value: "100%", label: "Hands-on labs" },
  { icon: Users, value: "0→Pro", label: "No degree needed" },
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
                  "rounded-2xl border backdrop-blur-sm p-6 transition-all text-center",
                  "animate-fade-up",
                  // Sizing
                  isProminent
                    ? "w-72 md:w-80"
                    : "w-64 md:w-72",
                  // Desktop tilt & float
                  isFadedLeft && "md:animate-float-tilt-left md:-rotate-6",
                  isFadedRight && "md:animate-float-tilt-right md:rotate-6",
                  isProminent && "animate-float-card",
                  // Colors & styling
                  isProminent
                    ? "border-primary/60 bg-white/10 animate-glow-pulse"
                    : isFadedLeft
                      ? "border-red-400/30 bg-red-950/20 hover:bg-red-950/30 hover:border-red-400/40"
                      : "border-emerald-400/30 bg-emerald-950/20 hover:bg-emerald-950/30 hover:border-emerald-400/40",
                )}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: "backwards" }}
              >
                {/* Icon - centred */}
                <div className={cn(
                  "flex items-center justify-center rounded-xl mb-4 mx-auto",
                  isProminent
                    ? "h-16 w-16 bg-primary/20"
                    : isFadedLeft
                      ? "h-14 w-14 bg-red-500/15"
                      : "h-14 w-14 bg-emerald-500/15"
                )}>
                  {hat.icon === "skull" && <Skull className="h-7 w-7 text-red-400/90" />}
                  {hat.icon === "shield" && <ShieldCheck className="h-7 w-7 text-emerald-400/90" />}
                  {hat.icon === "logo" && (
                    <img src={brownhatLogo} alt="Brown Hat" className="h-10 w-auto" />
                  )}
                </div>

                {/* Label & tagline */}
                <h3 className={cn(
                  "font-bold mb-1",
                  isProminent ? "text-xl text-white" : "text-lg text-white/90"
                )}>
                  {hat.label}
                </h3>
                <p className={cn(
                  "text-sm font-medium mb-2",
                  isProminent
                    ? "text-primary"
                    : isFadedLeft
                      ? "text-red-400/80"
                      : "text-emerald-400/80"
                )}>
                  {hat.tagline}
                </p>

                {/* Description */}
                <p className={cn(
                  "text-xs leading-relaxed mb-3",
                  isProminent ? "text-white/70" : "text-white/55"
                )}>
                  {hat.description}
                </p>

                {/* Trait badges */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {hat.traits.map((trait) => (
                    <span
                      key={trait}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        isProminent
                          ? "bg-primary/20 text-primary-foreground/90"
                          : isFadedLeft
                            ? "bg-red-500/15 text-red-300/80"
                            : "bg-emerald-500/15 text-emerald-300/80"
                      )}
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Terminal - only on Brown Hat card */}
                {isProminent && (
                  <div className="mt-4 rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs leading-relaxed text-left">
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
            Practical cybersecurity training from beginner to professional - no degree required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <Button size="lg" className="gap-2 font-medium shadow-sm w-full sm:w-auto" asChild>
              <Link to="/enroll" className="group">
                Start your journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 font-medium bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 w-full sm:w-auto"
              asChild
            >
              <Link to="/about">
                Who is a Brown Hat?
              </Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "700ms", animationFillMode: "backwards" }}>
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="h-4 w-4 text-primary mb-1" />
                <span className="text-lg font-bold text-white">{stat.value}</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Certification alignment - single mention */}
          <p className="text-xs text-white/40 tracking-wide mt-6">
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
