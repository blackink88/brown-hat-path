import { usePaystackPayment } from "react-paystack";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

interface UsePaystackOptions {
  amount: number; // Amount in kobo/cents (e.g., 49900 for R499)
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePaystackSubscription({ amount, onSuccess, onError }: UsePaystackOptions) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const reference = `bh_${Date.now()}_${user?.id?.slice(0, 8) || "guest"}`;

  const config = {
    reference,
    email: user?.email || "",
    amount, // Amount in kobo/cents
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "ZAR",
  };

  const handleSuccess = async (response: { reference: string }) => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: {
          reference: response.reference,
          user_id: user?.id,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Payment Successful!",
          description: "Welcome to Brown Hat Academy. Your subscription is now active.",
        });
        onSuccess?.();
      } else {
        throw new Error(data?.error || "Verification failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment verification failed";
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
      onError?.(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You can complete your subscription anytime.",
    });
  };

  const initializePayment = usePaystackPayment(config);

  const pay = () => {
    if (!user?.email) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      toast({
        title: "Configuration Error",
        description: "Payment system is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    initializePayment({ onSuccess: handleSuccess, onClose: handleClose });
  };

  return { pay, isVerifying, reference };
}
