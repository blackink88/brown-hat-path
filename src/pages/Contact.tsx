import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact us</h1>
            <p className="text-lg text-primary-foreground/80">
              Questions about the learning path, pricing, or partnerships? We'll get back to you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-lg mx-auto">
          {submitted ? (
            <div className="text-center p-8 rounded-xl bg-accent/5 border border-accent/20">
              <p className="font-medium text-foreground mb-1">Message sent</p>
              <p className="text-sm text-muted-foreground">We'll reply as soon as we can. Check your inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g. Pricing enquiry" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
              </div>
              <Button type="submit" className="w-full">Send message</Button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-border text-center">
            <a href="mailto:hello@brownhat.academy" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" />
              hello@brownhat.academy
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
