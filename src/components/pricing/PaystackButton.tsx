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

// Fallback button that links to /enroll when Paystack isn't ready
function EnrollFallbackButton({ tierName, popular }: Omit<PaystackButtonProps, "planCode">) {
  return (
    <Button
      variant={popular ? "accent" : "outline"}
      className="w-full gap-2 font-medium"
      size="lg"
      asChild
    >
      <Link to="/enroll" className="group">
        Subscribe to {tierName}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
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

  const { pay, isVerifying } = usePaystackSubscription({
    planCode,
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
