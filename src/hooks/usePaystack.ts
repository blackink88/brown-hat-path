import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

interface UsePaystackOptions {
  tierName:  string;
  onError?:  (error: string) => void;
}

/**
 * Redirect-based Paystack subscription flow.
 *
 * Calls our proxy to initialise a Paystack transaction, stores the tier name
 * in sessionStorage so the callback page can read it, then redirects the
 * user to Paystack's hosted checkout page.  No ugly white popup.
 */
export function usePaystackSubscription({ tierName, onError }: UsePaystackOptions) {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const pay = async () => {
    if (!user?.email) {
      toast({
        title:       "Login Required",
        description: "Please log in to subscribe.",
        variant:     "destructive",
      });
      return;
    }

    const token = session?.access_token;
    if (!token) return;

    setIsVerifying(true);
    try {
      const callbackUrl = `${window.location.origin}/payment-callback`;

      const res = await fetch(`${PROXY_URL}?action=init-payment`, {
        method:  "POST",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier_name: tierName, callback_url: callbackUrl }),
      });

      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.error as string) || "Failed to initialise payment");

      // Persist tier so the callback page can activate the subscription
      sessionStorage.setItem("bh_pending_tier", tierName);

      // Navigate to Paystack's hosted checkout
      window.location.href = data.authorization_url as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start payment";
      toast({ title: "Payment Error", description: message, variant: "destructive" });
      onError?.(message);
      setIsVerifying(false);
    }
  };

  return { pay, isVerifying };
}
