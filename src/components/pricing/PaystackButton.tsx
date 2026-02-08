import { Button } from "@/components/ui/button";
import { usePaystackSubscription } from "@/hooks/usePaystack";
import { usePaystackConfig } from "@/hooks/usePaystackConfig";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaystackButtonProps {
  planCode: string;
  tierName: string;
  popular?: boolean;
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

  if (error || !publicKey) {
    return (
      <Button variant={popular ? "accent" : "outline"} className="w-full" disabled>
        Payment unavailable
      </Button>
    );
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
