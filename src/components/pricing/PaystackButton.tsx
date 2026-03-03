import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePaystackSubscription } from "@/hooks/usePaystack";
import { usePaystackConfig } from "@/hooks/usePaystackConfig";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaystackButtonProps {
  planCode: string;
  tierName: string;
  popular?: boolean;
}

// Fallback button: for logged-in users links to /pricing (they're already here),
// for unauthenticated flow Pricing.tsx already shows /enroll instead of PaystackButton.
function EnrollFallbackButton({ tierName, popular }: Omit<PaystackButtonProps, "planCode">) {
  return (
    <Button
      variant={popular ? "accent" : "outline"}
      className="w-full gap-2 font-medium"
      size="lg"
      disabled
    >
      Subscribe to {tierName}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}

// Inner component that only renders when we have a valid public key
function PaystackPaymentButton({
  planCode,
  tierName,
  popular,
  publicKey
}: PaystackButtonProps & { publicKey: string }) {
  const navigate = useNavigate();

  // Fix: pass tierName so activate-subscription receives it
  const { pay, isVerifying } = usePaystackSubscription({
    planCode,
    tierName,
    publicKey,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  return (
    <Button
      variant={popular ? "accent" : "outline"}
      className="w-full"
      onClick={pay}
      disabled={isVerifying}
    >
      {isVerifying ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Verifying...
        </>
      ) : (
        `Subscribe to ${tierName}`
      )}
    </Button>
  );
}

export function PaystackButton({ planCode, tierName, popular }: PaystackButtonProps) {
  const { publicKey, isLoading, error } = usePaystackConfig();

  if (isLoading) {
    return (
      <Button variant={popular ? "accent" : "outline"} className="w-full" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  // If Paystack isn't configured or plan code is missing, fall back to enroll page
  if (error || !publicKey || !planCode) {
    return <EnrollFallbackButton tierName={tierName} popular={popular} />;
  }

  return (
    <PaystackPaymentButton
      planCode={planCode}
      tierName={tierName}
      popular={popular}
      publicKey={publicKey}
    />
  );
}
