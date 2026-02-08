import { PageLayout } from "@/components/layout/PageLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need a degree or IT background?",
    a: "No. We have a Bridge (Level 0) for learners with no prior IT experience. You can start there and progress into our Foundations and beyond. Many of our learners are career switchers.",
  },
  {
    q: "How does pricing work?",
    a: "We offer monthly subscription tiers: Foundation (R499), Practitioner (R1,500), and Professional (R3,000). There's also a Custom option for teams and enterprises. You can cancel anytime. See the Pricing page for full details.",
  },
  {
    q: "What certifications does Brown Hat align to?",
    a: "Our path aligns to CompTIA (A+, Network+, Security+, CySA+, CASP+), ISC² (CC, SSCP, CISSP), and other industry standards. See the Certifications page for the full list.",
  },
  {
    q: "How long does the learning path take?",
    a: "It depends on your starting level and pace. Bridge is about 4–6 weeks; Foundations 8–12 weeks; each level has an estimated duration. Full path from Bridge to Advanced can take from roughly 12 months to 2 years part-time.",
  },
  {
    q: "Is there support or mentoring?",
    a: "Yes. Practitioner and Professional tiers include mentor check-ins; Professional includes 1-on-1 mentorship. We also have community forums and email support.",
  },
  {
    q: "Can I get a refund?",
    a: "We don't offer refunds on monthly subscriptions, but you can cancel anytime so you're not charged for the next month. For custom or bulk programmes, terms are agreed separately.",
  },
];

export default function FAQ() {
  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">FAQ</h1>
            <p className="text-lg text-primary-foreground/80">
              Common questions about the learning path, pricing, and support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PageLayout>
  );
}
