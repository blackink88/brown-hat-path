import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, Award, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const trustItems = [
  { icon: Clock, label: "Self-paced" },
  { icon: Award, label: "Certification-aligned" },
  { icon: MapPin, label: "Built for Africa" },
  { icon: CreditCard, label: "No credit card to start" },
];

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-muted/40 border-t border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden border-border shadow-card bg-card hover:shadow-elevated transition-shadow duration-300">
            {/* Accent bar */}
            <div className="h-1 w-full bg-primary" aria-hidden />
            <CardHeader className="pb-4 pt-8 px-8 md:px-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                Ready to build in-demand skills?
              </h2>
              <p className="text-muted-foreground mt-2 text-base">
                Join learners on a structured path to real-world security roles. Start when you’re ready.
              </p>
            </CardHeader>
            <CardContent className="px-8 md:px-10 pt-0">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {trustItems.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" aria-hidden />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 md:px-10 pb-8 pt-2">
              <Button size="lg" className="gap-2 font-medium w-full sm:w-auto" asChild>
                <Link to="/enroll" className="group">
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center sm:text-left"
              >
                See pricing
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
