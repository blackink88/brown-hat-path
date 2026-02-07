import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function Careers() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Careers at Brown Hat</h1>
            <p className="text-lg text-primary-foreground/80">
              We're a small team building accessible cybersecurity education. If that mission excites you, we'd like to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-2xl mx-auto">
          <div className="p-8 rounded-xl bg-card border border-border text-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No open roles right now</h2>
            <p className="text-muted-foreground mb-6">
              We're not actively hiring, but we're always interested in meeting people who care about cybersecurity education. Send us your CV and a short note.
            </p>
            <Button asChild>
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
