import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pathLabels: Record<string, string> = {
  "/dashboard": "Learning Path",
  "/dashboard/courses": "My Courses",
  "/dashboard/course": "Course",
  "/dashboard/skills": "Command Center",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

function getBreadcrumbs(pathname: string): { path: string; label: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { path: string; label: string }[] = [{ path: "/dashboard", label: "Dashboard" }];

  let acc = "";
  for (let i = 1; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const label =
      pathLabels[acc] ||
      segments[i].charAt(0).toUpperCase() + segments[i].slice(1).replace(/-/g, " ");
    crumbs.push({ path: acc, label });
  }
  return crumbs;
}

export function DashboardBreadcrumb() {
  const location = useLocation();
  const crumbs = getBreadcrumbs(location.pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <BreadcrumbItem key={crumb.path}>
            {i > 0 && <BreadcrumbSeparator />}
            {i === crumbs.length - 1 ? (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={crumb.path}>{crumb.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
