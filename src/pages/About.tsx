import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Target, Users, Globe, Award, Heart, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Skills-First",
    description: "We prioritize practical, demonstrable skills over theoretical knowledge alone.",
  },
  {
    icon: Globe,
    title: "Globally Aligned",
    description: "Our curriculum maps to international certifications recognized worldwide.",
  },
  {
    icon: Heart,
    title: "Locally Rooted",
    description: "Designed for African realities—accessible, affordable, and relevant.",
  },
  {
    icon: Award,
    title: "Industry-Ready",
    description: "Our graduates are prepared for real-world cybersecurity challenges from day one.",
  },
];

const team = [
  {
    role: "Chief Executive Officer",
    credentials: ["Master's in Information Systems", "Honours in Information Systems", "CCNA"],
    shortBio: "A cybersecurity practitioner and systems thinker with a strong foundation in information systems, identity governance, and enterprise security architecture.",
    fullBio: `A cybersecurity practitioner and systems thinker with a strong foundation in information systems, identity governance, and enterprise security architecture. Holds a Master's degree and Honours in Information Systems, supported by hands-on technical expertise and industry certifications.

Specialises in Identity and Access Management (IAM), with experience designing and implementing access control models, identity governance frameworks, and secure system integrations across complex environments. Has worked as a consultant within large, global organisations, operating at the intersection of technology, risk, and business.

Driven by a strong belief that cybersecurity education must be practical, accessible, and outcomes-focused, particularly within the South African and broader African context. Has led the design and development of cybersecurity awareness and training platforms tailored for SMEs, with a focus on skills that translate directly into employability and operational competence.

As CEO, leads with a clear mandate: build scalable cybersecurity capability, close the skills gap, and produce professionals who can operate confidently in real-world security roles—not just pass exams.`,
  },
  {
    role: "Chief of Operations",
    credentials: ["Master's in Information Systems", "Honours in Digital Forensics", "CISSP", "PhD in Progress"],
    shortBio: "A seasoned cybersecurity professional with over 15 years of experience across information systems, security operations, and digital forensics.",
    fullBio: `A seasoned cybersecurity professional with over 15 years of experience across information systems, security operations, and digital forensics. Holds Master's degree in Information Systems and an Honours degree specialising in Digital Forensics from a leading global university, and is currently completing a PhD in Information Systems.

Brings deep technical and strategic expertise in information security, with a strong background in research and applied cybersecurity within the African context. Combines academic rigour with real-world operational leadership, ensuring that security strategy translates into practical, measurable outcomes. Focused on building secure, resilient systems and operational models that scale.`,
  },
];

// Team Card Component with Read More toggle
function TeamCard({ member }: { member: typeof team[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-8 rounded-xl border border-border bg-card text-center">
      {/* Avatar with cyber ring */}
      <div className="relative h-32 w-32 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-cyber-teal" />
        <div className="absolute inset-2 rounded-full bg-muted flex items-center justify-center">
          <Users className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>

      {/* Role */}
      <h3 className="text-xl font-bold text-cyber-teal mb-4">{member.role}</h3>

      {/* Credentials badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {member.credentials.map((cred) => (
          <span
            key={cred}
            className="px-3 py-1 text-xs font-medium rounded-md bg-cyber-teal/10 text-cyber-teal border border-cyber-teal/30"
          >
            {cred}
          </span>
        ))}
      </div>

      {/* Bio with Read More */}
      <div className="text-left">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {expanded ? member.fullBio : member.shortBio}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? (
            <>
              Read less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero - consistent with homepage */}
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
                <Shield className="h-4 w-4" />
                Our story
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
                Building Africa's cybersecurity workforce
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Brown Hat Academy was founded on a simple belief: talent is everywhere, but opportunity isn't. We're changing that.
              </p>
              <p className="mt-6 text-sm font-medium text-primary">
                Built in South Africa. Trusted globally.
              </p>
            </div>
          </div>
        </section>

        {/* Why Brown Hat - light section to match homepage */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Brown Hat?
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p className="font-semibold text-xl text-foreground">
                  Black Hats break. White Hats fix. <span className="text-primary">Brown Hats build and defend.</span>
                </p>
                <p>
                  We are the practitioners who understand the foundations of the network.
                </p>
                <p>
                  We are the guardians who keep the lights on while others play games.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To democratize cybersecurity education by providing world-class, skills-based training that's accessible to everyone, regardless of their background or location.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experienced professionals dedicated to transforming cybersecurity education.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <TeamCard key={member.role} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "5,000+", label: "Students Trained" },
                { value: "92%", label: "Completion Rate" },
                { value: "85%", label: "Employment Rate" },
                { value: "12", label: "African Countries" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/40 border-t border-border">
          <div className="container">
            <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-1 w-full bg-primary" aria-hidden />
              <div className="p-8 md:p-10 text-center">
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Ready to start your journey?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join learners building real-world cybersecurity skills.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
                  <Button size="lg" className="gap-2 font-medium shrink-0 w-full sm:w-auto" asChild>
                    <Link to="/enroll" className="group">
                      Get started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <Link
                    to="/pricing"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    See pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
