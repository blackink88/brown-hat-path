import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 max-w-3xl mx-auto">
          <p className="text-foreground font-medium">
            Ready to start?
          </p>
          <Button asChild>
            <Link to="/enroll">Get started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
