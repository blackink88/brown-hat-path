import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const FRAPPE_LMS_URL =
  (import.meta.env.VITE_FRAPPE_URL as string) || "https://lms-dzr-tbs.c.frappe.cloud";

/**
 * SSO bridge: auto-submits the user's credentials directly to Frappe's
 * login endpoint via a hidden HTML form.
 *
 * A top-level form POST (unlike fetch) respects SameSite=Lax, so Frappe
 * sets its session cookie in the browser and then issues a 302 redirect
 * into the LMS — giving the user a single seamless login.
 *
 * Credentials are passed via React Router state (never in the URL).
 * If no state is present (direct navigation), fall back to Frappe's
 * own login page.
 */
const FrappeSSO = () => {
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const { email, password } = (location.state as { email?: string; password?: string }) || {};

  useEffect(() => {
    if (email && password && formRef.current) {
      // Small delay so the "Signing you in…" message renders before navigating away
      const t = setTimeout(() => formRef.current?.submit(), 120);
      return () => clearTimeout(t);
    } else {
      // No credentials in state — send straight to Frappe login page
      window.location.href = `${FRAPPE_LMS_URL}/login`;
    }
  }, [email, password]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Signing you in to your courses…</p>

      {/* Hidden form — submitted programmatically above */}
      <form
        ref={formRef}
        method="POST"
        action={`${FRAPPE_LMS_URL}/api/method/login`}
        style={{ display: "none" }}
      >
        <input type="hidden" name="usr" value={email ?? ""} />
        <input type="hidden" name="pwd" value={password ?? ""} />
      </form>
    </div>
  );
};

export default FrappeSSO;
