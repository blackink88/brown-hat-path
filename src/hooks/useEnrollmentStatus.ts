import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useEnrollmentStatus() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["enrollment-status", user?.id],
    queryFn: async () => {
      if (!user?.id) return { is_enrolled: false, subscription_status: "inactive" };

      const tierRes = await supabase.rpc("get_user_tier_level", { _user_id: user.id });
      const tierLevel = typeof tierRes.data === "number" ? tierRes.data : 0;
      const hasActiveSubscription = tierLevel >= 1;

      const profileRes = await supabase
        .from("profiles")
        .select("is_enrolled, subscription_status")
        .eq("user_id", user.id)
        .single();

      const profileEnrolled = !profileRes.error && (profileRes.data?.is_enrolled ?? false);
      const profileStatus = profileRes.data?.subscription_status ?? "inactive";

      return {
        is_enrolled: profileEnrolled || hasActiveSubscription,
        subscription_status: hasActiveSubscription ? "active" : profileStatus,
      };
    },
    enabled: !!user?.id,
  });

  return {
    isEnrolled: data?.is_enrolled ?? false,
    subscriptionStatus: data?.subscription_status ?? "inactive",
    isLoading,
    refetch,
  };
}
