import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const certs = [
  { name: "CompTIA A+", level: "Foundations", desc: "Core IT and hardware fundamentals." },
  { name: "CompTIA Network+", level: "Foundations", desc: "Networking concepts and protocols." },
  { name: "CompTIA Security+", level: "Core Cyber", desc: "Entry-level security concepts and controls." },
  { name: "ISC² Certified in Cybersecurity (CC)", level: "Core Cyber", desc: "Foundational security knowledge." },
  { name: "CompTIA CySA+", level: "Practitioner", desc: "Security analytics and threat detection." },
  { name: "ISC² SSCP", level: "Practitioner", desc: "Security administration and operations." },
  { name: "CompTIA CASP+", level: "Specialisation", desc: "Advanced security practitioner." },
  { name: "CISSP", level: "Advanced", desc: "Security leadership and architecture." },
  { name: "CISM", level: "Advanced", desc: "Security management and governance." },
];

export default function Certifications() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Certifications</h1>
            <p className="text-lg text-primary-foreground/80">
              Our learning path aligns to internationally recognised certifications so your skills are recognised by employers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <p className="text-muted-foreground mb-8">
            We don't issue these certs—you sit the exams with the vendors. Our curriculum prepares you for them.
          </p>
          <div className="space-y-4">
            {certs.map((cert) => (
              <div
                key={cert.name}
                className="p-6 rounded-xl bg-card border border-border flex gap-4 items-start"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{cert.desc}</p>
                  <span className="text-xs text-primary font-medium">{cert.level}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/learning-path">View learning path</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
