import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { redirectToLMS } from "@/lib/frappe";

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

/**
 * Handles the redirect back from Paystack's hosted checkout.
 * Reads ?reference= from the URL, calls activate-subscription on our proxy,
 * applies the new JWT, then SSOs the user into Frappe LMS.
 */
export default function PaymentCallback() {
  const navigate          = useNavigate();
  const { session, applyNewToken } = useAuth();
  const { toast }         = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    const tierName  = sessionStorage.getItem("bh_pending_tier");
    sessionStorage.removeItem("bh_pending_tier");

    if (!reference || !tierName) {
      navigate("/pricing", { replace: true });
      return;
    }

    const activate = async () => {
      const token = session?.access_token;
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await fetch(`${PROXY_URL}?action=activate-subscription`, {
          method:  "POST",
          headers: {
            Authorization:  `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tier_name:          tierName,
            paystack_reference: reference,
          }),
        });

        const data = await res.json() as Record<string, unknown>;
        if (!res.ok) throw new Error((data.error as string) || "Activation failed");

        if (data.token) applyNewToken(data.token as string);

        toast({
          title:       "Subscription Activated!",
          description: `Welcome to the ${tierName} plan. Taking you to your courses…`,
        });
        setStatus("success");

        // Brief pause so the user sees the success message, then SSO to LMS
        setTimeout(redirectToLMS, 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Activation failed";
        setErrorMsg(msg);
        setStatus("error");
        toast({ title: "Activation Failed", description: msg, variant: "destructive" });
      }
    };

    activate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">Activating your subscription…</h2>
            <p className="text-muted-foreground text-sm mt-1">This will only take a moment.</p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-12 w-12 text-green-500" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">You're in!</h2>
            <p className="text-muted-foreground text-sm mt-1">Redirecting you to your courses…</p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
            <p className="text-muted-foreground text-sm mt-1">{errorMsg}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/pricing")}>Back to Pricing</Button>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </>
      )}
    </div>
  );
}
