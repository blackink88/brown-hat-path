import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Award } from "lucide-react";

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <PageLayout>
        <div className="container py-16 text-center text-muted-foreground">
          No portfolio specified.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-16 max-w-xl text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Award className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Public Portfolios Coming Soon
        </h1>
        <p className="text-muted-foreground mb-6">
          Public skill portfolios are being set up. Check back soon to share your
          Brown Hat Academy achievements with employers.
        </p>
        <Link
          to="/"
          className="text-primary hover:underline text-sm font-medium"
        >
          Back to home
        </Link>
      </div>
    </PageLayout>
  );
}
