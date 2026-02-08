import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Award,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LevelProps {
  level: string;
  name: string;
  code: string;
  color: string;
  description: string;
  duration: string;
  outcome: string;
  modules: string[];
  certAlignment?: string[];
  jobRoles?: string[];
  isOptional?: boolean;
  children?: React.ReactNode;
}

function LevelCard({ 
  level, 
  name, 
  code,
  color, 
  description, 
  duration, 
  outcome, 
  modules,
  certAlignment,
  jobRoles,
  isOptional,
  children
}: LevelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      
      <div 
        className={cn(
          "bg-card border rounded-xl overflow-hidden transition-all duration-300",
          isExpanded ? "shadow-card border-primary/20" : "shadow-soft border-border hover:border-primary/10"
        )}
      >
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-start gap-4 text-left"
        >
          {/* Level Badge */}
          <div className={cn("h-16 w-16 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-white", color)}>
            <span className="text-xs font-medium uppercase opacity-80">Level</span>
            <span className="text-2xl font-bold">{level}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{code}</span>
              {isOptional && (
                <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-muted rounded-full text-muted-foreground">
                  Optional
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          {/* Expand Icon */}
          <div className="flex-shrink-0 mt-2">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-border">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="font-medium">Duration:</span>
                  <span className="text-muted-foreground">{duration}</span>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 text-sm">What you'll learn:</h4>
                  <ul className="space-y-1.5">
                    {modules.map((module) => (
                      <li key={module} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                    <Award className="h-4 w-4 text-accent" />
                    Outcome
                  </div>
                  <p className="text-sm text-muted-foreground">{outcome}</p>
                </div>

                {certAlignment && certAlignment.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Certification Alignment:</h4>
                    <div className="flex flex-wrap gap-2">
                      {certAlignment.map((cert) => (
                        <span key={cert} className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">We provide support and exam discounts for these certifications.</p>
                  </div>
                )}

                {jobRoles && jobRoles.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Target Roles:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jobRoles.map((role) => (
                        <span key={role} className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {children && (
              <div className="mt-6 pt-6 border-t border-border">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LearningPath() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 gradient-hero relative">
          <div className="container relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Your Learning Path
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-6">
                One clear road from beginner to cybersecurity professional. No confusion, no wasted time.
              </p>
            </div>
          </div>
        </section>

        {/* Start Here Section */}
        <section className="py-8 bg-muted/50 border-b border-border">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
                Where do you start?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="font-medium text-foreground mb-1">Have university education?</p>
                  <p className="text-sm text-muted-foreground">→ Start at <span className="font-semibold text-level-foundation">Level 1: Foundations</span></p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="font-medium text-foreground mb-1">No university education?</p>
                  <p className="text-sm text-muted-foreground">→ Start at <span className="font-semibold text-level-bridge">Level 0: Bridge</span></p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                No shame. No labels. Just the right starting point for you.
              </p>
            </div>
          </div>
        </section>

        {/* Learning Path Levels */}
        <section className="py-12 md:py-20">
          <div className="container max-w-4xl">
            <div className="space-y-6">
              {/* Level 0 - Bridge */}
              <LevelCard
                level="0"
                name="Bridge – Digital Readiness"
                code="BH-BRIDGE 0"
                color="bg-level-bridge"
                description="For learners with no prior IT experience. Build the digital foundations you need before diving into cybersecurity."
                duration="4-6 weeks"
                outcome="Eligible to enter cybersecurity foundations with confidence."
                modules={[
                  "Computer fundamentals & digital literacy",
                  "Basic networking concepts",
                  "Introduction to operating systems",
                  "Professional communication skills",
                ]}
                isOptional
              />

              {/* Level 1 - Foundations */}
              <LevelCard
                level="1"
                name="Foundations – IT & Cyber Foundations"
                code="BH-FOUND 1"
                color="bg-level-foundation"
                description="Build core IT skills and understand the cybersecurity landscape. This is where everyone's cyber journey begins."
                duration="8-12 weeks"
                outcome="Junior IT / Cyber Intern readiness"
                modules={[
                  "Networking fundamentals (TCP/IP, DNS, etc.)",
                  "Linux & Windows system administration",
                  "Cybersecurity concepts & principles",
                  "Security tools introduction",
                ]}
                certAlignment={["CompTIA A+", "CompTIA Network+"]}
                jobRoles={["IT Support", "Junior Technician"]}
              />

              {/* Level 2 - Core Cyber */}
              <LevelCard
                level="2"
                name="Core Cyber – Core Cyber Foundations"
                code="BH-CYBER 2"
                color="bg-level-core"
                description="Develop essential cybersecurity practitioner skills. Understand threats, controls, and how to protect systems."
                duration="10-14 weeks"
                outcome="Cybersecurity practitioner baseline"
                modules={[
                  "Threat landscape & attack vectors",
                  "Security controls & frameworks",
                  "Logging, monitoring & SIEM basics",
                  "Risk fundamentals",
                ]}
                certAlignment={["CompTIA Security+", "ISC² CC"]}
                jobRoles={["Security Analyst (Entry)", "IT Security Support"]}
              />

              {/* Level 3 - Practitioner */}
              <LevelCard
                level="3"
                name="Practitioner Core – Choose Your Path"
                code="BH-OPS 2 / BH-GRC 2"
                color="bg-level-practitioner"
                description="Specialize in either Cyber Operations (Blue Team) or Governance, Risk & Compliance. Pick your track."
                duration="12-16 weeks"
                outcome="Practitioner-level competence in your chosen track"
                modules={[
                  "SOC operations & incident response (Blue Team track)",
                  "SIEM administration & threat hunting",
                  "Risk management & policy development (GRC track)",
                  "Compliance frameworks (POPIA, ISO 27001)",
                ]}
                certAlignment={["CompTIA CySA+", "ISC² SSCP"]}
                jobRoles={["SOC Analyst L1", "GRC Analyst", "Security Operations"]}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-level-practitioner/30 bg-level-practitioner/5">
                    <h5 className="font-semibold text-foreground mb-2">🛡️ Track A: Cyber Operations</h5>
                    <p className="text-sm text-muted-foreground">SOC, SIEM, Incident Response. For those who want to defend networks in real-time.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-level-practitioner/30 bg-level-practitioner/5">
                    <h5 className="font-semibold text-foreground mb-2">📋 Track B: GRC</h5>
                    <p className="text-sm text-muted-foreground">Risk, Policies, Compliance. For those who prefer strategy and governance.</p>
                  </div>
                </div>
              </LevelCard>

              {/* Level 4 - Specialisation */}
              <LevelCard
                level="4"
                name="Specialisation Tracks"
                code="BH-SOC / BH-IAM / BH-CLOUD / BH-GRC"
                color="bg-level-specialisation"
                description="Deep-dive into your area of expertise. Become a specialist in one of our focused tracks."
                duration="16-20 weeks"
                outcome="Specialist-level expertise and job readiness"
                modules={[
                  "Advanced SOC & Incident Response",
                  "Identity & Access Management (IAM)",
                  "Cloud Security (AWS, Azure, GCP)",
                  "Offensive Security & Penetration Testing",
                  "Vulnerability Management",
                ]}
                certAlignment={["CompTIA CASP+", "Microsoft SC-200", "AWS Security"]}
                jobRoles={["SOC Analyst L2", "IAM Engineer", "Cloud Security Engineer", "Penetration Tester"]}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["SOC & IR", "IAM", "Cloud Security", "Offensive Security", "Vuln Management", "Advanced GRC"].map((track) => (
                    <div key={track} className="p-3 rounded-lg border border-border bg-muted/50 text-center">
                      <span className="text-sm font-medium text-foreground">{track}</span>
                    </div>
                  ))}
                </div>
              </LevelCard>

              {/* Level 5 - Advanced */}
              <LevelCard
                level="5"
                name="Advanced & Leadership"
                code="BH-ARCH / BH-LEAD"
                color="bg-level-advanced"
                description="For experienced practitioners ready to lead. Architecture, strategy, and executive-level skills."
                duration="20+ weeks"
                outcome="Senior practitioner or leadership readiness"
                modules={[
                  "Security architecture design",
                  "Enterprise security strategy",
                  "CISO / Security management skills",
                  "Capstone project",
                ]}
                certAlignment={["CISSP", "CISM", "TOGAF"]}
                jobRoles={["Security Architect", "Security Manager", "CISO"]}
              />
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <div className="p-8 rounded-2xl gradient-hero text-center">
                <h2 className="text-2xl font-bold text-primary-foreground mb-4">
                  Ready to start your journey?
                </h2>
                <p className="text-primary-foreground/80 mb-6">
                  Pick your entry point and begin building real cybersecurity skills today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="accent" size="lg" asChild>
                    <Link to="/enroll" className="group">
                      Enroll Now
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild>
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
