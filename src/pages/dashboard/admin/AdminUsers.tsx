import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader2, Shield, User, GraduationCap } from "lucide-react";

type Profile = { id: string; user_id: string; full_name: string | null };
type UserRole = { user_id: string; role: string };
type Subscription = { id: string; user_id: string; tier_id: string; status: string };
type Tier = { id: string; name: string; level: number };
type Course = { id: string; code: string; title: string };

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [grantSubUser, setGrantSubUser] = useState<{ user_id: string; email?: string } | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string>("");
  const [enrollUser, setEnrollUser] = useState<{ user_id: string; full_name: string | null } | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, user_id, full_name");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["adminUserRoles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return (data as UserRole[]) ?? [];
    },
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["adminSubscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscriptions").select("id, user_id, tier_id, status");
      if (error) throw error;
      return (data as Subscription[]) ?? [];
    },
  });

  const { data: tiers } = useQuery({
    queryKey: ["adminTiers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscription_tiers").select("id, name, level").order("level");
      if (error) throw error;
      return (data as Tier[]) ?? [];
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["adminCoursesList"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, code, title").order("order_index");
      if (error) throw error;
      return (data as Course[]) ?? [];
    },
  });

  const grantSubscription = useMutation({
    mutationFn: async ({ userId, tierId }: { userId: string; tierId: string }) => {
      const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        tier_id: tierId,
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] });
      setGrantSubUser(null);
      setSelectedTierId("");
      toast({ title: "Subscription granted" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "student" }) => {
      const { error } = await supabase.from("user_roles").update({ role }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUserRoles"] });
      toast({ title: "Role updated" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const enrollInCourse = useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
      const { error } = await supabase.from("course_enrollments").insert({
        user_id: userId,
        course_id: courseId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setEnrollUser(null);
      setSelectedCourseId("");
      toast({ title: "Enrolled in course" });
    },
    onError: (e) => {
      const msg = String(e.message);
      toast({
        title: msg.includes("unique") || msg.includes("duplicate") ? "Already enrolled" : "Enrollment failed",
        description: msg.includes("unique") || msg.includes("duplicate") ? undefined : msg,
        variant: "destructive",
      });
    },
  });

  const roleByUser = (userId: string) => roles?.find((r) => r.user_id === userId)?.role ?? "student";
  const activeSubForUser = (userId: string) =>
    subscriptions?.find((s) => s.user_id === userId && s.status === "active");
  const tierName = (tierId: string) => tiers?.find((t) => t.id === tierId)?.name ?? "—";

  if (isLoading) return <div className="text-muted-foreground">Loading users…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Users</h1>
      <p className="text-muted-foreground text-sm">
        Manage roles and grant subscriptions. User emails come from auth; names from profiles.
      </p>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">User</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Subscription</th>
              <th className="text-right p-3 font-medium">Actions</th>
              <th className="text-right p-3 font-medium w-[140px]">Enroll</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => {
              const role = roleByUser(profile.user_id);
              const sub = activeSubForUser(profile.user_id);
              return (
                <tr key={profile.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-medium">{profile.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{profile.user_id}</div>
                  </td>
                  <td className="p-3">
                    <span className={cn("inline-flex items-center gap-1", role === "admin" && "text-primary")}>
                      {role === "admin" ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      {role}
                    </span>
                  </td>
                  <td className="p-3">{sub ? tierName(sub.tier_id) : "—"}</td>
                  <td className="p-3 text-right space-x-2">
                    <Select value={role} onValueChange={(v) => updateRole.mutate({ userId: profile.user_id, role: v as "admin" | "student" })}>
                      <SelectTrigger className="w-[110px] h-8 inline-flex">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGrantSubUser({ user_id: profile.user_id })}
                    >
                      Grant subscription
                    </Button>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEnrollUser({ user_id: profile.user_id, full_name: profile.full_name })}
                    >
                      <GraduationCap className="h-4 w-4 mr-1" />
                      Enroll in course
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!grantSubUser} onOpenChange={(open) => !open && setGrantSubUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tier</Label>
              <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name} (level {t.level})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantSubUser(null)}>Cancel</Button>
            <Button
              onClick={() => grantSubUser && selectedTierId && grantSubscription.mutate({ userId: grantSubUser.user_id, tierId: selectedTierId })}
              disabled={!selectedTierId || grantSubscription.isPending}
            >
              {grantSubscription.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Grant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!enrollUser} onOpenChange={(open) => { if (!open) { setEnrollUser(null); setSelectedCourseId(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in course</DialogTitle>
            {enrollUser && (
              <p className="text-sm text-muted-foreground">
                Enroll {enrollUser.full_name || enrollUser.user_id} in a course.
              </p>
            )}
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEnrollUser(null); setSelectedCourseId(""); }}>Cancel</Button>
            <Button
              onClick={() => enrollUser && selectedCourseId && enrollInCourse.mutate({ userId: enrollUser.user_id, courseId: selectedCourseId })}
              disabled={!selectedCourseId || enrollInCourse.isPending}
            >
              {enrollInCourse.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
