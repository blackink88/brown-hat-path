import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function Blog() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Blog</h1>
            <p className="text-lg text-primary-foreground/80">
              Articles on cybersecurity, career tips, and updates from Brown Hat.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-2xl mx-auto">
          <div className="p-8 rounded-xl bg-card border border-border text-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Coming soon</h2>
            <p className="text-muted-foreground mb-6">
              We're preparing useful content on careers, certifications, and learning. Check back later or follow us for updates.
            </p>
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
