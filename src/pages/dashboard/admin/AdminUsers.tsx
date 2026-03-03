import { ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const FRAPPE_DESK =
  (import.meta.env.VITE_FRAPPE_URL as string | undefined) ??
  "https://lms-dzr-tbs.c.frappe.cloud";

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          User management is handled in Frappe Desk.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Manage Users in Frappe</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Manage user accounts, roles, enrollments, and subscription tiers from Frappe Desk.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button asChild>
            <a href={`${FRAPPE_DESK}/app/user`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Frappe Users
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`${FRAPPE_DESK}/app/bh-subscription`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Subscriptions
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
