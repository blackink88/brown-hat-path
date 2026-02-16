import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Users,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import brownhatLogo from "@/assets/brownhat.png";

/* ── Rotating headline word ─────────────────────────── */

const WORDS = ["Defenders", "Analysts", "Engineers", "Architects"];

function useRotatingWord(interval = 2800) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible");

  useEffect(() => {
    const id = setInterval(() => {
      setPhase("exit");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
        setPhase("enter");
        setTimeout(() => setPhase("visible"), 50);
      }, 280);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return { word: WORDS[index], phase };
}

/* ── Terminal typing effect ─────────────────────────── */

const TERMINAL_LINES = [
  "$ bh-scan --target 10.0.0.0/24",
  "[*] Scanning 254 hosts...",
  "[!] Vuln found: CVE-2024-1234",
  "[+] Patch applied. Network secured \u2713",
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
    }, 26);
    return () => clearInterval(id);
  }, []);

  return { displayed, done };
}

/* ── Static data ────────────────────────────────────── */

const CERTS = ["CompTIA Security+", "ISC2 CC", "Microsoft SC-900"];

const LEVELS = [
  "Bridge",
  "Foundation",
  "Core",
  "Practitioner",
  "Specialisation",
  "Advanced",
];

const STATS = [
  { icon: BookOpen, value: "6", label: "Learning Levels" },
  { icon: Award, value: "3+", label: "Certifications" },
  { icon: FlaskConical, value: "100%", label: "Hands-on Labs" },
  { icon: Users, value: "0 → Pro", label: "Career Path" },
];

/* ── Component ──────────────────────────────────────── */

export function HeroSection() {
  const { word, phase } = useRotatingWord();
  const { displayed, done } = useTypingEffect();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center bg-white overflow-hidden">
      {/* Subtle dot-grid background */}
      <div className="absolute inset-0 hero-dot-grid pointer-events-none" />
      {/* Warm fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-100/60 pointer-events-none" />

      <div className="container relative z-10 py-20 md:py-28">
        {/* Academy badge */}
        <div
          className="flex justify-center mb-8 animate-fade-up"
          style={{ animationFillMode: "backwards" }}
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/[0.06] border border-primary/15 text-sm font-medium text-primary">
            <img src={brownhatLogo} alt="" className="h-5 w-auto" />
            Brown Hat Academy
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-5 animate-fade-up"
          style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
        >
          Where Future Cyber
          <br className="hidden sm:block" />{" "}
          <span
            className={cn(
              "inline-block text-primary transition-all duration-280 ease-out",
              phase === "exit" && "opacity-0 -translate-y-2 blur-[2px]",
              phase === "enter" && "opacity-0 translate-y-2 blur-[2px]",
              phase === "visible" && "opacity-100 translate-y-0 blur-0",
            )}
          >
            {word}
          </span>{" "}
          Are Made
        </h1>

        {/* Subtitle */}
        <p
          className="text-center text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed"
          style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
        >
          Industry-aligned cybersecurity training from first principles to
          professional certification. No degree required.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 md:mb-20 animate-fade-up"
          style={{ animationDelay: "240ms", animationFillMode: "backwards" }}
        >
          <Button
            size="lg"
            className="gap-2 font-semibold shadow-md h-12 px-8 text-[15px] w-full sm:w-auto"
            asChild
          >
            <Link to="/enroll" className="group">
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 font-semibold h-12 px-8 text-[15px] w-full sm:w-auto"
            asChild
          >
            <Link to="/certifications">
              <GraduationCap className="h-4 w-4" />
              View Learning Path
            </Link>
          </Button>
        </div>

        {/* ── Bento Grid ─────────────────────────────── */}
        <div
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 animate-fade-up"
          style={{ animationDelay: "380ms", animationFillMode: "backwards" }}
        >
          {/* Terminal card — 2 cols */}
          <div className="md:col-span-2 rounded-2xl bg-gray-950 border border-gray-800 p-5 shadow-elevated group hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-auto text-[11px] text-gray-500 font-mono tracking-wide">
                bh-terminal
              </span>
            </div>
            <pre className="font-mono text-sm text-green-400 leading-relaxed min-h-[6rem] whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="animate-blink-cursor text-green-300">
                  ▋
                </span>
              )}
            </pre>
          </div>

          {/* Certifications card */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-card hover:shadow-elevated transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-5">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                Certification Aligned
              </h3>
            </div>
            <div className="space-y-3.5">
              {CERTS.map((cert) => (
                <div key={cert} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-[13px] text-muted-foreground">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning path card — 2 cols */}
          <div className="md:col-span-2 rounded-2xl bg-white border border-gray-200 p-5 shadow-card hover:shadow-elevated transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                Structured Learning Path
              </h3>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
              {LEVELS.map((level, i) => (
                <div key={level} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-colors",
                      i <= 2 ? "bg-primary" : "bg-primary/30",
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {level}
                  </span>
                  {i < 5 && (
                    <div className="w-3 sm:w-5 h-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="rounded-2xl bg-primary/[0.04] border border-primary/10 p-5 hover:bg-primary/[0.07] transition-colors duration-300">
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-foreground leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust line */}
        <p
          className="text-center text-xs text-muted-foreground/60 tracking-wide animate-fade-up"
          style={{ animationDelay: "500ms", animationFillMode: "backwards" }}
        >
          Trusted training aligned to globally recognised certifications
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-scroll">
        <ChevronDown className="h-6 w-6 text-gray-400" />
      </div>
    </section>
  );
}
