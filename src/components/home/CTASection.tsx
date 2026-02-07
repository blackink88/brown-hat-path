import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 gradient-hero relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to start your cybersecurity journey?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join hundreds of learners building real-world security skills. No degree required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="accent" size="xl" asChild>
              <Link to="/enroll" className="group">
                Start Learning Today
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/60 mt-6">
            Monthly subscription • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </section>
  );
}
