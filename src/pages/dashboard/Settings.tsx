import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, LogOut, Loader2, AlertTriangle, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

export default function Settings() {
  const { user, session, signOut, applyNewToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const token = session?.access_token ?? "";

  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["mySubscription", user?.id],
    queryFn: async () => {
      const res = await fetch(`${PROXY_URL}?action=my-subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json() as Promise<{
        subscription: { status: string; start_date: string; end_date: string } | null;
        tier: { tier_name: string; tier_level: number } | null;
      }>;
    },
    enabled: !!token,
  });

  const subscription  = subscriptionData?.subscription ?? null;
  const tier          = subscriptionData?.tier ?? null;
  const nextBilling   = subscription?.end_date
    ? new Date(subscription.end_date)
    : null;

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`${PROXY_URL}?action=cancel-subscription`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({}),
      });
      const data = await res.json() as { success?: boolean; error?: string; token?: string };
      if (!res.ok) throw new Error(data.error ?? "Cancellation failed");
      if (data.token) applyNewToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["mySubscription", user?.id] });
      toast({
        title:       "Subscription cancelled",
        description: "You've been moved to the Explorer (free) tier. You can resubscribe anytime.",
      });
    } catch (e) {
      toast({
        title:       "Could not cancel",
        description: e instanceof Error ? e.message : "Please try again or contact support.",
        variant:     "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your new passwords match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch(`${PROXY_URL}?action=change-password`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ new_password: newPassword }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Password change failed");
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update password.", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>Billing is monthly. Manage your plan and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionLoading ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </p>
          ) : subscription && tier ? (
            <>
              <p className="text-sm text-foreground">
                Current plan: <span className="font-medium">{tier.tier_name}</span>
              </p>
              {nextBilling && (
                <p className="text-sm text-muted-foreground">
                  Next billing date:{" "}
                  <span className="font-medium text-foreground">
                    {nextBilling.toLocaleDateString(undefined, { dateStyle: "long" })}
                  </span>
                </p>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/50 hover:bg-destructive/10"
                    disabled={isCancelling}
                  >
                    {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Cancel subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be moved to the free Explorer tier immediately. You can resubscribe anytime from the Pricing page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleCancelSubscription}
                    >
                      Yes, cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have an active subscription.{" "}
              <Link to="/pricing" className="text-primary font-medium hover:underline">
                View plans
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !newPassword || !confirmPassword}
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Session Card */}
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Manage your current session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sign out of your account</p>
              <p className="text-sm text-muted-foreground">You'll need to sign in again to access your dashboard</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => toast({ title: "Contact Support", description: "Please contact support to delete your account." })}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
