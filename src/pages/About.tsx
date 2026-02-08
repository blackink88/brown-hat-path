import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, Target, Users, Globe, Award, Heart } from "lucide-react";

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
    bio: "Specializes in Identity and Access Management (IAM) with extensive consulting experience. Has developed Security Awareness and Training platforms for SMEs across South Africa.",
  },
  {
    role: "Chief of Operations",
    credentials: ["Master's in Information Systems", "CISSP", "Honours in Digital Forensics"],
    bio: "15+ years in cybersecurity and IT. Extensive research experience in Information Security across Africa. A proven leader dedicated to building secure systems.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="container relative py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm mb-6">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground/90">Our Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Building Africa's Cybersecurity Workforce
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-4">
                Brown Hat Academy was founded on a simple belief: talent is everywhere, but opportunity isn't. We're changing that.
              </p>
              <p className="text-sm font-semibold text-accent tracking-wide uppercase">
                Built in South Africa. Trusted globally.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Why Brown Hat */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-8">
                Why Brown Hat?
              </h2>
              <div className="space-y-6 text-lg text-secondary-foreground/90">
                <p className="font-semibold text-xl">
                  Black Hats break. White Hats fix. <span className="text-accent">Brown Hats build and defend.</span>
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
                <div
                  key={member.role}
                  className="p-8 rounded-xl border border-border bg-card text-center"
                >
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
                  
                  {/* Bio */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
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
      </main>
      <Footer />
    </div>
  );
};

export default About;
