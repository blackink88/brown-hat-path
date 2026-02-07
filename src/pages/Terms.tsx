import { PageLayout } from "@/components/layout/PageLayout";

export default function Terms() {
  return (
    <PageLayout>
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-ZA")}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance</h2>
              <p>By using Brown Hat Cybersecurity Academy’s website and services, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. Services</h2>
              <p>We provide online learning content, mentoring (where applicable), and related support. Access and features depend on your chosen plan. We reserve the right to update content and offerings.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. Your account</h2>
              <p>You are responsible for keeping your account credentials secure and for all activity under your account. You must provide accurate information when signing up.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Payment and cancellation</h2>
              <p>Subscription fees are charged in accordance with your plan. You may cancel at any time; cancellation will apply from the next billing cycle. We do not offer refunds for partial months.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Acceptable use</h2>
              <p>You may not misuse our platform, share account access inappropriately, or use our materials in a way that violates law or third-party rights. We may suspend or terminate access for breach of these terms.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Disclaimer</h2>
              <p>Our content is for educational purposes. We do not guarantee employment or certification outcomes. Certification exams are administered by third-party bodies; we are not responsible for their policies or results.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact</h2>
              <p>For questions about these terms, contact us at hello@brownhat.academy.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
