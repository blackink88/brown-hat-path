import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-background border-b border-border">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Cybersecurity skills for the real world.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Internationally aligned. Locally affordable. No degree required.
          </p>
          <Button size="lg" className="gap-2 font-medium" asChild>
            <Link to="/enroll" className="group">
              Start learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
