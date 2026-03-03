import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "student";

/**
 * Returns user role from JWT payload (is_admin field set by frappe-proxy on login).
 * Admin functionality is available natively in Frappe Desk.
 */
export function useUserRole() {
  const { isAdmin } = useAuth();

  const role: AppRole = isAdmin ? "admin" : "student";

  return { role, isAdmin, isLoading: false };
}
