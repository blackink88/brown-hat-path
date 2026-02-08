import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import bhlogo from "@/assets/bhlogo.png";

const navItems = [
  { title: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Courses", url: "/dashboard/admin/courses", icon: BookOpen },
  { title: "Quizzes", url: "/dashboard/admin/quizzes", icon: HelpCircle },
  { title: "Users", url: "/dashboard/admin/users", icon: Users },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex gap-6">
      <aside className="w-56 shrink-0 border-r border-border pr-4">
        <Link to="/dashboard" className="flex items-center gap-2 mb-6 px-2">
          <img src={bhlogo} alt="Brown Hat" className="h-9 w-auto" />
          <span className="text-sm font-bold text-foreground">Brown Hat</span>
        </Link>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Admin
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.url
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
