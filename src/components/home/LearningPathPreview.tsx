import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const pathSteps = [
  {
    level: "0",
    name: "Bridge",
    label: "Optional Entry",
    color: "bg-level-bridge",
    description: "Digital Readiness",
  },
  {
    level: "1",
    name: "Foundations",
    label: "Start Here",
    color: "bg-level-foundation",
    description: "IT & Cyber Basics",
  },
  {
    level: "2",
    name: "Core Cyber",
    label: "Build Skills",
    color: "bg-level-core",
    description: "Threats & Controls",
  },
  {
    level: "3",
    name: "Practitioner",
    label: "Specialize",
    color: "bg-level-practitioner",
    description: "Blue Team or GRC",
  },
  {
    level: "4",
    name: "Specialisation",
    label: "Expert Track",
    color: "bg-level-specialisation",
    description: "SOC, IAM, Cloud, etc.",
  },
  {
    level: "5",
    name: "Advanced",
    label: "Leadership",
    color: "bg-level-advanced",
    description: "Architecture & CISO",
  },
];

export function LearningPathPreview() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your learning journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From complete beginner to cybersecurity professional - one clear path.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-12">
          {/* Connection line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-level-bridge via-level-core to-level-advanced rounded-full hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {pathSteps.map((step, index) => (
              <div
                key={step.level}
                className="relative flex flex-col items-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Level Circle */}
                <div
                  className={`h-16 w-16 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-card z-10 mb-3`}
                >
                  {step.level}
                </div>
                
                {/* Label Badge */}
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  {step.label}
                </span>
                
                {/* Name */}
                <h3 className="font-semibold text-foreground text-sm text-center">
                  {step.name}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Entry Point Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <div className="p-6 rounded-xl bg-card border border-border shadow-soft">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-level-bridge flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">0</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  No university education?
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Start at the Bridge level. No shame, no labels - just a clear entry point.
                </p>
                <div className="flex items-center gap-2 text-sm text-accent font-medium">
                  <CheckCircle className="h-4 w-4" />
                  No prior experience required
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border shadow-soft">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-level-foundation flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Have university or IT background?
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Skip the bridge and jump straight into Foundations.
                </p>
                <div className="flex items-center gap-2 text-sm text-accent font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Fast-track your cyber career
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/learning-path" className="group">
              See Full Learning Path
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
