import { Button } from "@/components/ui/button";
import { usePaystackSubscription } from "@/hooks/usePaystack";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaystackButtonProps {
  amount: number;
  tierName: string;
  popular?: boolean;
}

export function PaystackButton({ amount, tierName, popular }: PaystackButtonProps) {
  const navigate = useNavigate();

  const { pay, isVerifying } = usePaystackSubscription({
    amount,
    onSuccess: () => {
      // Redirect to dashboard after successful payment
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
