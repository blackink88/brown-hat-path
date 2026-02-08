import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "student";

export function useUserRole() {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .limit(1)
        .single();
      if (error) return "student" as AppRole;
      return (data?.role ?? "student") as AppRole;
    },
    enabled: !!user?.id,
  });

  return { role: role ?? "student", isAdmin: role === "admin", isLoading };
}
