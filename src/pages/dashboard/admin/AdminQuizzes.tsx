import { ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FRAPPE_DESK =
  (import.meta.env.VITE_FRAPPE_URL as string | undefined) ??
  "https://lms-dzr-tbs.c.frappe.cloud";

export default function AdminQuizzes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quizzes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quiz management is handled in Frappe LMS.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Manage Quizzes in Frappe</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create and edit quizzes, questions, and answer options directly in Frappe Desk.
            Quizzes are linked to lessons in the LMS Course editor.
          </p>
        </div>
        <Button asChild>
          <a href={`${FRAPPE_DESK}/app/lms-quiz`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open LMS Quizzes
          </a>
        </Button>
      </div>
    </div>
  );
}
