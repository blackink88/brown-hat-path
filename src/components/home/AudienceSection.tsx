import { GraduationCap, RefreshCw, Laptop, Building2, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const audienceRows = [
  {
    heading: "Starting Fresh",
    image:
      "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=800&q=80",
    imageAlt: "Young man studying at a laptop - Photo by Kojo Kwarteng on Unsplash",
    groups: [
      {
        icon: GraduationCap,
        title: "School Leavers",
        description:
          "Start your cyber career without needing a degree. We take you from zero to job-ready with a clear, structured path.",
      },
      {
        icon: Users,
        title: "Non-Varsity Learners",
        description:
          "University is not for everyone. We believe in competence over credentials - prove what you can do, not where you studied.",
      },
    ],
    bullets: [
      "No prior experience required",
      "Start at the Bridge level",
      "Affordable, self-paced learning",
    ],
  },
  {
    heading: "Levelling Up",
    image:
      "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800&q=80",
    imageAlt: "Engineer coding at a desk with multiple monitors - Photo by ThisisEngineering on Unsplash",
    groups: [
      {
        icon: RefreshCw,
        title: "Career Switchers",
        description:
          "Already working but want to move into cybersecurity? Skip the basics and jump into our structured career-change pathway.",
      },
      {
        icon: Laptop,
        title: "IT Professionals",
        description:
          "Level up your existing IT skills with security specialisations and globally recognised certifications.",
      },
    ],
    bullets: [
      "Fast-track options for experienced professionals",
      "Certification-aligned curriculum",
      "Hands-on labs with real tools",
    ],
  },
  {
    heading: "Building Teams",
    image:
      "https://images.unsplash.com/photo-1573165759995-5865a394a1aa?w=800&q=80",
    imageAlt: "Diverse team collaborating around a table with laptops - Photo by Christina on Unsplash",
    groups: [
      {
        icon: Building2,
        title: "Employers",
        description:
          "Need cyber talent? Partner with us for hire-ready graduates, upskilling programmes, and custom corporate training.",
      },
    ],
    bullets: [
      "Hire-ready graduates with practical portfolios",
      "Custom training for your organisation",
      "Ongoing upskilling partnerships",
    ],
  },
];

export function AudienceSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Who this is for
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you are starting fresh or advancing your career, there is a
            path for you.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {audienceRows.map((row, rowIdx) => (
            <div
              key={row.heading}
              className={cn(
                "grid md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-up",
              )}
              style={{
                animationDelay: `${rowIdx * 150}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Image */}
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3]",
                  rowIdx % 2 === 1 && "md:order-2",
                )}
              >
                <img
                  src={row.image}
                  alt={row.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Subtle overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Text content */}
              <div className={cn(rowIdx % 2 === 1 && "md:order-1")}>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
                  {row.heading}
                </span>

                <div className="space-y-5 mb-6">
                  {row.groups.map((group) => (
                    <div key={group.title} className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <group.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {group.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bullet points */}
                <ul className="space-y-2">
                  {row.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
