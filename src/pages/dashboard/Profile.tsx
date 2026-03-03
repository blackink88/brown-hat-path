import { useQuery } from "@tanstack/react-query";
import { Mail, Shield, Loader2, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PortfolioExport } from "@/components/dashboard/PortfolioExport";
import {
  listEnrollments,
  getCourses,
  frappeKeys,
} from "@/lib/frappe";

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

const TIER_LABELS: Record<number, string> = {
  0: "Explorer (Free)",
  1: "Foundation",
  2: "Core",
  3: "Practitioner",
  4: "Professional",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Profile() {
  const { user, session, tierLevel } = useAuth();
  const token = session?.access_token ?? "";
  const fullName = user?.user_metadata?.full_name ?? user?.email ?? "";

  // Active subscription from proxy
  const { data: subscriptionData } = useQuery({
    queryKey: ["mySubscription", user?.id],
    queryFn: async () => {
      const res = await fetch(`${PROXY_URL}?action=my-subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json() as Promise<{
        subscription: { status: string; start_date: string; end_date: string } | null;
        tier: { tier_name: string; tier_level: number; features: string | string[] } | null;
      }>;
    },
    enabled: !!token,
  });

  const tierData = subscriptionData?.tier ?? null;

  // Enrollments from Frappe
  const { data: enrollments = [] } = useQuery({
    queryKey: frappeKeys.enrollments(),
    queryFn: () => listEnrollments(token),
    enabled: !!token,
  });

  // Course catalog (for aligned certifications)
  const { data: courses = [] } = useQuery({
    queryKey: frappeKeys.courses(),
    queryFn: getCourses,
    staleTime: 5 * 60 * 1000,
  });

  const enrolledCourseNames = new Set(enrollments.map((e) => e.course));
  const enrolledCourses = courses.filter((c) => enrolledCourseNames.has(c.name));

  const certificationsInPath = enrolledCourses
    .map((c) => ({
      name:  c.name,
      title: c.title,
      certs: (() => {
        const raw = c.custom_aligned_certifications;
        if (!raw) return [] as string[];
        try { return JSON.parse(raw) as string[]; } catch { return raw.split(",").map((s: string) => s.trim()); }
      })(),
    }))
    .filter((c) => c.certs.length > 0);

  const tierFeatures: string[] = (() => {
    if (!tierData?.features) return [];
    if (Array.isArray(tierData.features)) return tierData.features as string[];
    try { return JSON.parse(tierData.features as string) as string[]; } catch { return []; }
  })();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground text-lg">{fullName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2">
                {TIER_LABELS[tierLevel] ?? `Level ${tierLevel}`}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>Your current access level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current plan</span>
            <Badge variant={tierLevel > 0 ? "default" : "outline"}>
              {tierData?.tier_name ?? TIER_LABELS[tierLevel] ?? "Explorer"}
            </Badge>
          </div>
          {subscriptionData?.subscription?.end_date && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Renews</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(subscriptionData.subscription.end_date).toLocaleDateString(undefined, { dateStyle: "long" })}
              </span>
            </div>
          )}
          {tierFeatures.length > 0 && (
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 mt-2">
              {tierFeatures.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}
          {tierLevel === 0 && (
            <Button variant="default" size="sm" asChild className="mt-2">
              <Link to="/pricing">Upgrade your plan</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Certifications in path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications in your path
          </CardTitle>
          <CardDescription>
            Based on your enrolled courses. Each course aligns to specific certifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificationsInPath.length > 0 ? (
            <div className="space-y-3">
              {certificationsInPath.map((c) => (
                <div key={c.name} className="text-sm">
                  <span className="font-medium text-foreground">{c.title}</span>
                  <span className="text-muted-foreground mx-2">→</span>
                  <span className="text-foreground">{c.certs.join(", ")}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {enrollments.length === 0
                ? "Enroll in courses to see certifications aligned to your path."
                : "No certification alignment on your enrolled courses yet."}
            </p>
          )}
        </CardContent>
      </Card>

      <PortfolioExport />

      {/* Support */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Need help with certifications or exam discounts?
          </p>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
