import { Target, Globe, MapPin, Wrench } from "lucide-react";

const valueProps = [
  {
    icon: Target,
    title: "Skills-first, not theory-first",
    description: "Learn by doing. Every module includes hands-on labs and real-world scenarios that prepare you for actual job tasks.",
  },
  {
    icon: Globe,
    title: "Globally aligned certifications",
    description: "Our curriculum maps directly to CompTIA, ISC², and Microsoft certifications—internationally recognized credentials.",
  },
  {
    icon: MapPin,
    title: "Designed for African realities",
    description: "Affordable pricing, local context, and career pathways that make sense for the African cybersecurity market.",
  },
  {
    icon: Wrench,
    title: "Hands-on labs & assessments",
    description: "No multiple-choice exams. Prove your skills through practical challenges using real security tools.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What makes Brown Hat different
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No buzzwords. No shortcuts. Just practical skills that employers actually need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <prop.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {prop.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
