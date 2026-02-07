import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Users, Award, Briefcase } from "lucide-react";

export default function Employers() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">For Employers</h1>
            <p className="text-lg text-primary-foreground/80">
              Hire job-ready cybersecurity talent. Our graduates are trained on internationally aligned curricula and real-world skills.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why hire Brown Hat graduates?</h2>
          <ul className="space-y-4">
            {[
              "Curriculum aligned to CompTIA, ISC² and industry frameworks.",
              "Hands-on practice and certification prep built into the path.",
              "Structured levels from foundations to specialist tracks (SOC, GRC, Cloud, IAM).",
              "Job-readiness support: resumes, interviews, and soft skills.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/50 border-y border-border">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Partnership options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Hire graduates", desc: "Access our talent pool for internships and full-time roles." },
              { icon: Award, title: "Upskill teams", desc: "Bulk licensing and custom programmes for your organisation." },
              { icon: Briefcase, title: "Custom training", desc: "Tailored curricula and cohorts for your security needs." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Get in touch</h2>
          <p className="text-muted-foreground mb-6">Tell us about your hiring or training needs.</p>
          <Button size="lg" asChild>
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
