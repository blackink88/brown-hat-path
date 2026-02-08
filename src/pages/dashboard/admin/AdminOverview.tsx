import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, GraduationCap, CreditCard } from "lucide-react";

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [coursesRes, profilesRes, enrollmentsRes, subscriptionsRes] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("course_enrollments").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      return {
        courses: coursesRes.count ?? 0,
        users: profilesRes.count ?? 0,
        enrollments: enrollmentsRes.count ?? 0,
        activeSubscriptions: subscriptionsRes.count ?? 0,
      };
    },
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading stats…</div>;
  }

  const cards = [
    { label: "Courses", value: stats?.courses ?? 0, icon: BookOpen },
    { label: "Users", value: stats?.users ?? 0, icon: Users },
    { label: "Enrollments", value: stats?.enrollments ?? 0, icon: GraduationCap },
    { label: "Active subscriptions", value: stats?.activeSubscriptions ?? 0, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-6 flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <card.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
