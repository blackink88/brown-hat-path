import { useState, useRef, useEffect } from "react";
import { GraduationCap, RefreshCw, Laptop, Building2, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const audienceRows = [
  {
    heading: "Starting Fresh",
    tagline: "No degree? No problem.",
    image:
      "https://images.pexels.com/photos/6281731/pexels-photo-6281731.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Student studying at a laptop - Photo by Monstera Production on Pexels",
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
    tagline: "Already in IT? Go further.",
    image:
      "https://images.pexels.com/photos/5380655/pexels-photo-5380655.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Professionals working on cybersecurity - Photo by Tima Miroshnichenko on Pexels",
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
    tagline: "Hire-ready cyber talent.",
    image:
      "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Team collaborating in a professional setting - Photo by fauxels on Pexels",
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

/* Intersection observer hook for reveal-on-scroll */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function AudienceSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useReveal<HTMLElement>();

  const toggle = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-muted/30 reveal snap-start"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Who this is for
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Whether you are starting fresh or advancing your career, there is a path for you.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {audienceRows.map((row, idx) => {
            const Icon = row.groups[0].icon;
            const isActive = activeIndex === idx;
            return (
              <button
                key={row.heading}
                onClick={() => toggle(idx)}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.03]"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:shadow-card",
                )}
              >
                <Icon className="h-4 w-4" />
                {row.heading}
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    isActive && "rotate-90",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Expandable content panels */}
        <div className="max-w-5xl mx-auto space-y-4">
          {audienceRows.map((row, rowIdx) => {
            const isActive = activeIndex === rowIdx;
            return (
              <div
                key={row.heading}
                className={cn(
                  "accordion-content",
                  isActive && "open",
                )}
              >
                <div>
                  <div
                    className={cn(
                      "grid md:grid-cols-2 gap-6 md:gap-10 items-center rounded-2xl bg-card border border-border p-6 md:p-8 shadow-card",
                    )}
                  >
                    {/* Image */}
                    <div
                      className={cn(
                        "relative rounded-xl overflow-hidden shadow-elevated aspect-[4/3]",
                        rowIdx % 2 === 1 && "md:order-2",
                      )}
                    >
                      <img
                        src={row.image}
                        alt={row.imageAlt}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Text content */}
                    <div className={cn(rowIdx % 2 === 1 && "md:order-1")}>
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-1 block">
                        {row.heading}
                      </span>
                      <p className="text-lg font-semibold text-foreground mb-5">
                        {row.tagline}
                      </p>

                      <div className="space-y-4 mb-5">
                        {row.groups.map((group) => (
                          <div key={group.title} className="flex gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <group.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm mb-0.5">
                                {group.title}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {group.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <ul className="space-y-1.5">
                        {row.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
