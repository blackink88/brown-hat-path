import { PageLayout } from "@/components/layout/PageLayout";

export default function Privacy() {
  return (
    <PageLayout>
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-ZA")}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Who we are</h2>
              <p>Brown Hat Cybersecurity Academy (“we”, “us”) provides online cybersecurity education. This policy describes how we collect, use, and protect your personal information. We comply with the Protection of Personal Information Act (POPIA) in South Africa.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. Information we collect</h2>
              <p>We may collect: name, email address, account and payment-related information, and any information you provide when you contact us or use our services. We may also collect usage data (e.g. how you use the platform) to improve our services.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. How we use it</h2>
              <p>We use your information to provide and improve our services, process payments, communicate with you, and comply with legal obligations. We do not sell your personal information to third parties.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Security and retention</h2>
              <p>We take reasonable steps to protect your data. We retain your information only as long as necessary for the purposes set out in this policy or as required by law.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Your rights</h2>
              <p>You may request access to, correction of, or deletion of your personal information, subject to applicable law. Contact us at hello@brownhat.academy for any privacy-related requests.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Changes</h2>
              <p>We may update this policy from time to time. The “Last updated” date at the top will reflect the latest version. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
