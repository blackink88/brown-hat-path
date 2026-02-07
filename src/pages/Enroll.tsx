import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Enroll() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Start learning</h1>
            <p className="text-lg text-primary-foreground/80">
              Create an account and choose your plan. You can change or cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-lg mx-auto">
          {submitted ? (
            <div className="text-center p-8 rounded-xl bg-accent/5 border border-accent/20">
              <p className="font-medium text-foreground mb-1">Thanks for signing up</p>
              <p className="text-sm text-muted-foreground mb-4">Check your email for next steps.</p>
              <Button asChild><Link to="/login">Log in</Link></Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl bg-card border border-border shadow-soft">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Create account</Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
              </p>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                After sign-up you'll choose a plan on the <Link to="/pricing" className="text-primary hover:underline">Pricing</Link> page.
              </p>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
