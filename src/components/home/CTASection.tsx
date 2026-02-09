import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-muted/40 relative border-t border-border">
      {/* Thin brown accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Build skills that get you hired
          </h2>
          <p className="text-muted-foreground mb-8">
            Join learners building real-world cybersecurity skills. No degree required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" className="gap-2 font-semibold" asChild>
              <Link to="/enroll" className="group">
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Link
              to="/pricing"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
