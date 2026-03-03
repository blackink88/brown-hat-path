import { useAuth } from "@/contexts/AuthContext";

/**
 * Returns enrollment / subscription status derived purely from the JWT.
 * tier_level in the JWT (issued by frappe-proxy) is the authoritative source.
 * No Supabase queries needed.
 */
export function useEnrollmentStatus() {
  const { user, tierLevel } = useAuth();

  const isEnrolled = !!user && tierLevel >= 0; // any signed-in user is "enrolled" in Explorer at minimum
  const subscriptionStatus = user ? (tierLevel >= 1 ? "active" : "free") : "inactive";

  return {
    isEnrolled,
    subscriptionStatus,
    isLoading: false,
    refetch: () => {},
  };
}
