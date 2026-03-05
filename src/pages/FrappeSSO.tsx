import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const FRAPPE_LMS_URL =
  (import.meta.env.VITE_FRAPPE_URL as string) || "https://lms-dzr-tbs.c.frappe.cloud";

/**
 * SSO bridge: calls Frappe's login API via fetch in `no-cors` mode so the
 * browser processes the Set-Cookie response (storing the Frappe session)
 * without needing CORS headers. We then navigate to the LMS — the browser
 * sends the stored `sid` cookie with that navigation and the user is in.
 *
 * Credentials are passed via React Router state (never in the URL).
 */
const FrappeSSO = () => {
  const location = useLocation();
  const { email, password } = (location.state as { email?: string; password?: string }) || {};

  useEffect(() => {
    const doSSO = async () => {
      if (!email || !password) {
        window.location.href = `${FRAPPE_LMS_URL}/login`;
        return;
      }

      try {
        // no-cors: browser sends the request without a CORS preflight.
        // The Set-Cookie in the response IS stored for Frappe's domain
        // regardless of CORS policy — establishing the Frappe session silently.
        // credentials: "include" ensures the cookie is sent/received cross-origin.
        await fetch(`${FRAPPE_LMS_URL}/api/method/login`, {
          method: "POST",
          mode: "no-cors",
          credentials: "include",
          body: new URLSearchParams({ usr: email, pwd: password }),
        });
      } catch {
        // Network error — navigate anyway; Frappe will show its own login
      }

      // Navigate to the LMS. The browser includes the stored sid cookie
      // in this request so the user arrives already logged in.
      window.location.href = `${FRAPPE_LMS_URL}/lms`;
    };

    doSSO();
  }, [email, password]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Signing you in to your courses…</p>
    </div>
  );
};

export default FrappeSSO;
