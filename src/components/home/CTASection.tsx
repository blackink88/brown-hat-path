import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-14 md:py-20 border-t border-border bg-muted/50">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-2">
                Ready to build in-demand skills?
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Join learners preparing for real-world security roles.
              </p>
            </div>
            <Button size="lg" className="gap-2 font-medium shrink-0 w-fit mx-auto md:mx-0" asChild>
              <Link to="/enroll" className="group">
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
