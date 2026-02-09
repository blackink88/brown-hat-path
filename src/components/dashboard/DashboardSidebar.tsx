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
} from "lucide-react";
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
  { title: "Skills Radar", url: "/dashboard/skills", icon: BarChart3 },
  { title: "Certificates", url: "/dashboard/certificates", icon: Award },
];

const adminNavItem = { title: "Admin", url: "/dashboard/admin", icon: Settings2 };

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
  const items = [...navItems, ...(isAdmin ? [adminNavItem] : [])];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border !bg-white [--sidebar-background:0_0%_100%] [--sidebar-foreground:0_0%_9%] [--sidebar-accent:20_20%_96%] [--sidebar-accent-foreground:0_0%_9%] [--sidebar-primary:20_57%_40%] [--sidebar-border:20_15%_90%] dark:!bg-white dark:[--sidebar-foreground:0_0%_9%] dark:[--sidebar-accent-foreground:0_0%_9%] [&_[data-sidebar]]:!text-foreground [&_[data-sidebar]_button]:!text-foreground [&_[data-sidebar]_a]:!text-foreground [&_[data-sidebar]_span]:!text-foreground"
    >
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Link to="/dashboard" className="flex items-center justify-center w-full">
          <img src={bhlogo} alt="Brown Hat" className="h-9 w-auto shrink-0" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="[&_[data-sidebar=group-label]]:!text-muted-foreground [&_[data-sidebar=menu-button]]:!text-foreground [&_button]:!text-foreground [&_span]:!text-foreground">
        <SidebarGroup>
          <SidebarGroupLabel>Learn</SidebarGroupLabel>
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
