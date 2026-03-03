import { ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const FRAPPE_DESK =
  (import.meta.env.VITE_FRAPPE_URL as string | undefined) ??
  "https://lms-dzr-tbs.c.frappe.cloud";

export default function AdminCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Courses & Content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All course content is managed directly in Frappe LMS.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Manage in Frappe LMS</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create and edit courses, chapters, lessons, and quizzes directly in Frappe Desk.
            Changes appear in the student portal immediately.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button asChild>
            <a href={`${FRAPPE_DESK}/lms/courses`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              LMS Courses
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`${FRAPPE_DESK}/app/lms-course`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Frappe Desk
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
