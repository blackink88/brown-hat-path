import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

/**
 * Headless payment-initiation page.
 *
 * Frappe's manage-plan page links here as:
 *   brownhat.academy/pay?tier=Foundation
 *
 * This page reads the BH JWT from React's localStorage, calls init-payment
 * on the proxy, and immediately redirects to Paystack's hosted checkout.
 * The user sees only a brief loading spinner — no forms, no pricing page.
 */
export default function PayInitiate() {
  const [searchParams] = useSearchParams();
  const { session, loading } = useAuth();
  const { toast }      = useToast();
  const [error, setError] = useState("");

  const tierName = searchParams.get("tier") ?? "";

  useEffect(() => {
    // Wait for AuthContext to finish reading localStorage before acting
    if (loading) return;

    if (!tierName) {
      setError("No plan specified.");
      return;
    }

    const token = session?.access_token;
    if (!token) {
      // Not logged in — send to login, preserving the intended destination
      window.location.href = `/login?redirect=${encodeURIComponent(`/pay?tier=${tierName}`)}`;
      return;
    }

    const run = async () => {
      try {
        const callbackUrl = `${window.location.origin}/payment-callback`;
        const res  = await fetch(`${PROXY_URL}?action=init-payment`, {
          method:  "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body:    JSON.stringify({ tier_name: tierName, callback_url: callbackUrl }),
        });
        const data = await res.json() as Record<string, unknown>;
        if (!res.ok) throw new Error((data.error as string) || "Payment init failed");

        sessionStorage.setItem("bh_pending_tier", tierName);
        window.location.href = data.authorization_url as string;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Could not start payment";
        setError(msg);
        toast({ title: "Payment Error", description: msg, variant: "destructive" });
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tierName, session?.access_token]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="h-10 w-10 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
        <a href="https://portal.brownhat.academy/manage-plan" className="text-sm text-primary underline">
          Back to Manage Plan
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        Connecting to secure checkout for <strong>{tierName}</strong>…
      </p>
    </div>
  );
}
