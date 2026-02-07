import { PageLayout } from "@/components/layout/PageLayout";
import { Shield, Target, Heart, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">About Brown Hat</h1>
            <p className="text-lg text-primary-foreground/80">
              We're building a bridge into cybersecurity for everyone—no degree required. Internationally aligned. Locally affordable.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our mission</h2>
          <p className="text-muted-foreground mb-4">
            Brown Hat Cybersecurity Academy exists to make real-world security skills accessible. We align our curriculum to global certifications (CompTIA, ISC²) so you learn what employers need, while keeping pricing within reach for South African learners.
          </p>
          <p className="text-muted-foreground">
            Whether you're switching careers or levelling up, we give you a clear path from foundations to specialist roles—with mentorship and job-readiness support along the way.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/50 border-y border-border">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What we stand for</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Skills-first", desc: "Curriculum built around what employers actually need." },
              { icon: Shield, title: "Quality", desc: "Internationally aligned certifications and standards." },
              { icon: Heart, title: "Access", desc: "No degree required. Fair pricing. Real support." },
              { icon: Globe, title: "Local impact", desc: "South African focus, global relevance." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-border text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to start?</h2>
          <p className="text-muted-foreground mb-6">Explore our learning path or see pricing.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/learning-path">View Learning Path</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
