import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Mail, Calendar, Shield, Loader2, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CERTIFICATION_OPTIONS } from "@/lib/certifications";
import { PortfolioExport } from "@/components/dashboard/PortfolioExport";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      
      if (error) throw error;
      setFullName(data.full_name || "");
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch subscription data
  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          subscription_tiers (name, level, features)
        `)
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: certGoals, isLoading: certGoalsLoading } = useQuery({
    queryKey: ["userCertificationGoals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_certification_goals")
        .select("certification_slug")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.certification_slug);
    },
    enabled: !!user?.id,
  });

  const addCertGoal = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("user_certification_goals").insert({ user_id: user!.id, certification_slug: slug });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCertificationGoals", user?.id] }),
  });

  const removeCertGoal = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("user_certification_goals").delete().eq("user_id", user!.id).eq("certification_slug", slug);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCertificationGoals", user?.id] }),
  });

  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: { full_name?: string; avatar_url?: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user!.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    },
  });

  // Avatar upload mutation
  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      await updateProfile.mutateAsync({ avatar_url: `${publicUrl}?t=${Date.now()}` });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
      console.error("Avatar upload error:", error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 2MB.",
          variant: "destructive",
        });
        return;
      }
      uploadAvatar.mutate(file);
    }
  };

  const handleSave = () => {
    updateProfile.mutate({ full_name: fullName });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar & Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials(profile?.full_name || user?.email || "U")}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadAvatar.isPending}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {uploadAvatar.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="font-medium text-foreground">{profile?.full_name || "No name set"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {userRole && (
                <Badge variant="secondary" className="mt-2 capitalize">
                  {userRole.role}
                </Badge>
              )}
            </div>
          </div>

          {/* Name Edit Section */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
                <Button onClick={handleSave} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setFullName(profile?.full_name || "");
                }}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-foreground">{profile?.full_name || "Not set"}</p>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certification goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            My certification goals
          </CardTitle>
          <CardDescription>
            Select the exams you&apos;re working toward. Our curriculum aligns to these; we provide support and exam discounts for selected certifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certGoalsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-2">
              {CERTIFICATION_OPTIONS.map((cert) => {
                const checked = certGoals?.includes(cert.slug) ?? false;
                return (
                  <label
                    key={cert.slug}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => {
                        if (c) addCertGoal.mutate(cert.slug);
                        else removeCertGoal.mutate(cert.slug);
                      }}
                      disabled={addCertGoal.isPending || removeCertGoal.isPending}
                    />
                    <span className="text-sm font-medium text-foreground">{cert.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <PortfolioExport />

      {/* Support */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Need help with certifications or exam discounts?
          </p>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Account Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Your account information and subscription status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium text-foreground">
                {user?.created_at ? format(new Date(user.created_at), "MMMM d, yyyy") : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Subscription</p>
                <p className="font-medium text-foreground">
                  {subscription?.subscription_tiers?.name || "Free Tier"}
                </p>
              </div>
              {subscription?.subscription_tiers?.name && (
                <Badge variant="default">{subscription.subscription_tiers.name}</Badge>
              )}
            </div>
            {subscription?.subscription_tiers?.features != null && (() => {
              const raw = subscription.subscription_tiers.features;
              const list = Array.isArray(raw) ? raw : (typeof raw === "string" ? (() => { try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; } })() : []);
              return list.length > 0 ? (
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 pl-1">
                  {list.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              ) : null;
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
