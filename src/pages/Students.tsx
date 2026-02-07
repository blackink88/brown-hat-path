import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, FileCheck, Users } from "lucide-react";

export default function Students() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">For Students</h1>
            <p className="text-lg text-primary-foreground/80">
              What to expect as a Brown Hat learner: structure, support, and how to get the most out of your journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What you get</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, title: "Structured path", desc: "Clear levels from Bridge to Advanced. No guessing what to do next." },
              { icon: MessageCircle, title: "Support", desc: "Forums, email support, and mentor check-ins on Standard and Pro plans." },
              { icon: FileCheck, title: "Job readiness", desc: "Resume tips, interview prep, and certification alignment for employer recognition." },
              { icon: Users, title: "Community", desc: "Learn alongside others and share progress in our community space." },
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

      <section className="py-12 md:py-16 bg-muted/50 border-y border-border">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Next steps</h2>
          <p className="text-muted-foreground mb-6">
            Check the learning path, pick a plan, and sign up when you're ready.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild><Link to="/learning-path">Learning path</Link></Button>
            <Button variant="outline" asChild><Link to="/pricing">Pricing</Link></Button>
            <Button variant="outline" asChild><Link to="/faq">FAQ</Link></Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
