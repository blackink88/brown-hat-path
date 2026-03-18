import { Link, useLocation } from "react-router-dom";
import {
  Map,
  BookOpen,
  BarChart3,
  User,
  LogOut,
  Settings,
  Settings2,
  Award,
  ExternalLink,
} from "lucide-react";

const FRAPPE_LMS_URL = import.meta.env.VITE_FRAPPE_URL as string || "https://portal.brownhat.academy";
import bhlogo from "@/assets/bhlogo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Learning Path", url: "/dashboard", icon: Map },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Certificates", url: "/dashboard/certificates", icon: Award },
];

const adminNavItems = [
  { title: "Skills Radar", url: "/dashboard/skills", icon: BarChart3 },
  { title: "Admin", url: "/dashboard/admin", icon: Settings2 },
];

const settingsItems = [
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = [...navItems, ...(isAdmin ? adminNavItems : [])];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="dashboard-sidebar border-r border-sidebar-border !bg-[hsl(var(--sidebar-background))]"
    >
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Link to="/dashboard" className="flex items-center justify-center w-full">
          <img src={bhlogo} alt="Brown Hat" className="h-9 w-auto shrink-0" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary: Open the LMS */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Open LMS — all your courses">
                  <a
                    href={`${FRAPPE_LMS_URL}/lms/my-courses`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open LMS</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Subscription</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", collapsed && "justify-center")}
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
