import { useEffect, useRef } from "react";
import { Outlet, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlobalSearch } from "./GlobalSearch";
export function DashboardLayout() {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const handledSuccessRef = useRef(false);

  // After Stripe checkout success, user is redirected to /dashboard?subscription=success
  useEffect(() => {
    if (searchParams.get("subscription") !== "success" || handledSuccessRef.current) return;
    handledSuccessRef.current = true;
    toast({
      title: "Subscription active",
      description: "Your plan is now active. You can access your courses."
    });
    queryClient.invalidateQueries({
      queryKey: ["userTierLevel"]
    });
    queryClient.invalidateQueries({
      queryKey: ["subscriptions"]
    });
    const next = new URLSearchParams(searchParams);
    next.delete("subscription");
    setSearchParams(next, {
      replace: true
    });
  }, [searchParams, setSearchParams, toast, queryClient]);
  const displayName = user?.user_metadata?.full_name as string || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* Top Header */}
          <header className="sticky top-0 z-40 flex h-14 items-center gap-2 sm:gap-4 border-b border-border bg-background/95 backdrop-blur px-3 sm:px-6">
            <SidebarTrigger />
            <DashboardBreadcrumb />
            <div className="flex-1 flex justify-center sm:justify-start">
              <GlobalSearch />
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="group flex items-center gap-2 pl-2 pr-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                    <span className="text-sm font-medium text-primary group-hover:text-accent-foreground">{initial}</span>
                  </div>
                  <span className="hidden sm:inline text-sm text-muted-foreground group-hover:text-accent-foreground max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{displayName}</span>
                    <span className="text-xs text-muted-foreground font-normal truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-muted-foreground hover:text-accent-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-6 text-primary">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>;
}