import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Users,
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  Building2,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Skills-Verified Candidates",
    description: "Every candidate comes with a verified Skills Portfolio demonstrating hands-on competence.",
  },
  {
    icon: Award,
    title: "Certification Ready",
    description: "Our graduates are aligned with CompTIA, ISC², Microsoft, and other global certifications.",
  },
  {
    icon: TrendingUp,
    title: "Reduced Hiring Risk",
    description: "Our rigorous program means candidates are job-ready from day one.",
  },
  {
    icon: Users,
    title: "Diverse Talent Pipeline",
    description: "Access a broad pool of motivated candidates from across Africa.",
  },
];

const programs = [
  {
    icon: Briefcase,
    title: "Student Internship Program",
    description:
      "Place high-performing students in 3-6 month internships. We handle screening; you get pre-qualified talent.",
  },
  {
    icon: Building2,
    title: "Corporate Training",
    description:
      "Upskill your existing team with customized training programs aligned to your security framework.",
  },
  {
    icon: GraduationCap,
    title: "Hire a Graduate",
    description:
      "Access our pool of certified, skills-verified graduates ready for full-time roles.",
  },
];

const Employers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="container relative py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Build Your Cybersecurity Team
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Partner with Brown Hat to access Africa's most rigorously trained cybersecurity talent.
              </p>
              <Button variant="accent" size="xl" asChild>
                <a href="#contact">Partner With Us</a>
              </Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Partner With Brown Hat?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our skills-first approach means you get candidates who can hit the ground running.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Partnership Programs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the engagement model that fits your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {programs.map((program) => (
                <div
                  key={program.title}
                  className="p-8 rounded-2xl border border-border bg-card text-center"
                >
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <program.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{program.title}</h3>
                  <p className="text-muted-foreground">{program.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills We Train */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Skills Our Graduates Bring
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Network Security",
                  "Threat Analysis",
                  "SIEM (Splunk, etc.)",
                  "Incident Response",
                  "GRC & Compliance",
                  "Cloud Security (Azure, AWS)",
                  "Linux Administration",
                  "Penetration Testing Basics",
                  "Wireshark & Packet Analysis",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground">
                  Tell us about your hiring needs and we'll get back to you within 24 hours.
                </p>
              </div>

              <form className="space-y-6 p-8 rounded-2xl border border-border bg-card">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="john@acme.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your cybersecurity hiring or training needs..."
                    rows={4}
                  />
                </div>
                <Button type="submit" variant="accent" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Employers;
