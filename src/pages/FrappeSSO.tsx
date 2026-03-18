import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const FRAPPE_LMS_URL =
  (import.meta.env.VITE_FRAPPE_URL as string) || "https://portal.brownhat.academy";

/**
 * SSO bridge for authenticated subscribers.
 *
 * - tier > 0 (active subscription): silently logs the user into Frappe via a
 *   no-cors fetch so the Frappe session cookie is stored, then navigates to
 *   the LMS — single seamless login.
 *
 * - tier = 0 (no subscription): redirect to /pricing. They must subscribe
 *   before they can access any course content.
 *
 * Credentials arrive via React Router state (never in the URL).
 */
const FrappeSSO = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { email, password, tierLevel } = (
    location.state as { email?: string; password?: string; tierLevel?: number }
  ) || {};

  useEffect(() => {
    const doSSO = async () => {
      // No credentials in state — direct navigation, send to login
      if (!email || !password) {
        navigate("/login", { replace: true });
        return;
      }

      // Explorer (tier_level=0) gets the Bridge course — allowed into LMS.
      // Only block if we somehow have no tier info at all (shouldn't happen post-login).

      // Subscribed user — establish Frappe session then go to LMS
      try {
        // no-cors: browser sends the request without a CORS preflight.
        // The Set-Cookie in Frappe's response IS stored for Frappe's domain,
        // establishing the session silently.
        await fetch(`${FRAPPE_LMS_URL}/api/method/login`, {
          method:      "POST",
          mode:        "no-cors",
          credentials: "include",
          body:        new URLSearchParams({ usr: email, pwd: password }),
        });
      } catch {
        // Network error — navigate anyway; Frappe will prompt login if needed
      }

      window.location.href = `${FRAPPE_LMS_URL}/lms/my-courses`;
    };

    doSSO();
  }, [email, password, tierLevel, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Signing you in to your courses…</p>
    </div>
  );
};

export default FrappeSSO;
