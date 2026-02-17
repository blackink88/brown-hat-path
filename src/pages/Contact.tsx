import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

/* ── Contact info cards ───────────────────────────── */

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@brownhat.academy",
    href: "mailto:hello@brownhat.academy",
  },
  {
    icon: MapPin,
    title: "Location",
    detail: "South Africa (remote-first)",
  },
  {
    icon: Clock,
    title: "Response time",
    detail: "Within 1-2 business days",
  },
];

/* ── Component ────────────────────────────────────── */

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-background border-b border-border overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              background:
                "linear-gradient(160deg, hsl(var(--muted)) 0%, transparent 50%, hsl(var(--background)) 100%)",
            }}
          />
          <div className="absolute inset-0 cyber-grid pointer-events-none" />
          <div className="absolute inset-0 security-doodle pointer-events-none" />
          <div className="container relative py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="h-1 w-12 rounded-full bg-primary mb-8" aria-hidden />
              <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Get in touch
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Contact us
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Questions about the learning path, pricing, or partnerships? We would love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact info strip */}
        <section className="py-8 bg-muted/30 border-b border-border">
          <div className="container">
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.title}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {item.detail}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{item.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-2xl mx-auto">
            {submitted ? (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card animate-fade-up">
                <div className="h-1 w-full bg-primary" aria-hidden />
                <div className="p-10 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Message sent</h2>
                  <p className="text-muted-foreground mb-1">
                    Thanks for reaching out. We will reply as soon as we can.
                  </p>
                  <p className="text-sm text-muted-foreground">Check your inbox for a confirmation.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <div className="h-1 w-full bg-primary" aria-hidden />
                <div className="p-8 md:p-10">
                  <h2 className="text-xl font-semibold text-foreground mb-1">Send us a message</h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    Fill in the form below and we will get back to you within 1-2 business days.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" placeholder="e.g. Pricing enquiry, Partnership, Support" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2 font-medium">
                      <Send className="h-4 w-4" />
                      Send message
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
