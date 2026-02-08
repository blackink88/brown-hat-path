import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useEnrollmentStatus() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["enrollment-status", user?.id],
    queryFn: async () => {
      if (!user?.id) return { is_enrolled: false, subscription_status: "inactive" };

      const { data, error } = await supabase
        .from("profiles")
        .select("is_enrolled, subscription_status")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch enrollment status:", error);
        return { is_enrolled: false, subscription_status: "inactive" };
      }

      return data;
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
