import { ExternalLink, BookOpen, Users, GraduationCap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const FRAPPE_DESK =
  (import.meta.env.VITE_FRAPPE_URL as string | undefined) ??
  "https://lms-dzr-tbs.c.frappe.cloud";

const links = [
  { label: "Courses", icon: BookOpen, path: "/lms/courses" },
  { label: "Users", icon: Users, path: "/app/user" },
  { label: "Enrollments", icon: GraduationCap, path: "/app/lms-enrollment" },
  { label: "Subscriptions", icon: CreditCard, path: "/app/bh-subscription" },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
      <p className="text-muted-foreground">
        Course and user management is handled in Frappe Desk. Click a link below to open the relevant section.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {links.map((item) => (
          <a
            key={item.label}
            href={`${FRAPPE_DESK}${item.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                Open in Frappe <ExternalLink className="h-3 w-3" />
              </p>
            </div>
          </a>
        ))}
      </div>
      <div className="pt-4">
        <Button asChild>
          <a href={`${FRAPPE_DESK}/app`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Frappe Desk
          </a>
        </Button>
      </div>
    </div>
  );
}
