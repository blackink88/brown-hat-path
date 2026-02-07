import { GraduationCap, RefreshCw, Laptop, Building2, Users } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "School Leavers",
    description: "Start your cyber career without needing a degree. We'll take you from zero to job-ready.",
  },
  {
    icon: RefreshCw,
    title: "Career Switchers",
    description: "Already working but want to move into cybersecurity? We have a structured path for you.",
  },
  {
    icon: Laptop,
    title: "IT Professionals",
    description: "Level up your existing IT skills with security specializations and certifications.",
  },
  {
    icon: Users,
    title: "Non-Varsity Learners",
    description: "University isn't for everyone. We believe in competence over credentials.",
  },
  {
    icon: Building2,
    title: "Employers",
    description: "Need cyber talent? Partner with us for hire-ready graduates and custom training.",
  },
];

export function AudienceSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Who this is for
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're starting fresh or advancing your career, there's a path for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className="group p-5 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300 text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <audience.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {audience.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
