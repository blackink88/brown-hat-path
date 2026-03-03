import { usePaystackPayment } from "react-paystack";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

interface UsePaystackOptions {
  planCode:  string;
  tierName:  string;
  publicKey: string;
  onSuccess?: () => void;
  onError?:   (error: string) => void;
}

export function usePaystackSubscription({
  planCode,
  tierName,
  publicKey,
  onSuccess,
  onError,
}: UsePaystackOptions) {
  const { user, session, applyNewToken } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const reference = `bh_${Date.now()}_${user?.id?.slice(0, 8) || "guest"}`;

  const config = {
    reference,
    email:     user?.email || "",
    plan:      planCode,
    publicKey,
    currency:  "ZAR",
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = async (response: { reference: string }) => {
    setIsVerifying(true);
    try {
      const token = session?.access_token;
      if (!token) throw new Error("Not signed in");

      const res = await fetch(`${PROXY_URL}?action=activate-subscription`, {
        method:  "POST",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tier_name:          tierName,
          paystack_reference: response.reference,
        }),
      });

      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.error as string) || "Activation failed");

      // Apply the new JWT which carries the updated tier_level
      if (data.token) applyNewToken(data.token as string);

      toast({
        title:       "Subscription Activated!",
        description: `Welcome to the ${tierName} plan. Your access has been updated.`,
      });
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment verification failed";
      toast({
        title:       "Verification Failed",
        description: message,
        variant:     "destructive",
      });
      onError?.(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    toast({
      title:       "Payment Cancelled",
      description: "You can complete your subscription anytime.",
    });
  };

  const pay = () => {
    if (!user?.email) {
      toast({
        title:       "Login Required",
        description: "Please log in to subscribe.",
        variant:     "destructive",
      });
      return;
    }
    initializePayment({ onSuccess: handleSuccess, onClose: handleClose });
  };

  return { pay, isVerifying, reference };
}
