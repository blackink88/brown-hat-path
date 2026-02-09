import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-background border-b border-border overflow-hidden">
      {/* Subtle warm tint band for depth - no image */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, hsl(var(--muted)) 0%, transparent 50%, hsl(var(--background)) 100%)",
        }}
      />
      <div className="container relative py-20 md:py-28">
        <div className="max-w-2xl">
          {/* Accent line - industry standard visual anchor */}
          <div className="h-1 w-12 rounded-full bg-primary mb-8" aria-hidden />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
            Cybersecurity skills for the real world.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Internationally aligned. Locally affordable. No degree required.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="gap-2 font-medium shadow-sm" asChild>
              <Link to="/enroll" className="group">
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Link
              to="/learning-path"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              View curriculum
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required to explore.
          </p>
        </div>
      </div>
    </section>
  );
}
