import { Button } from "@/components/ui/button";
import { usePaystackSubscription } from "@/hooks/usePaystack";
import { ArrowRight, Loader2 } from "lucide-react";

interface PaystackButtonProps {
  tierName: string;
  popular?: boolean;
}

export function PaystackButton({ tierName, popular }: PaystackButtonProps) {
  const { pay, isVerifying } = usePaystackSubscription({ tierName });

  return (
    <Button
      variant={popular ? "accent" : "outline"}
      className="w-full gap-2 font-medium"
      size="lg"
      onClick={pay}
      disabled={isVerifying}
    >
      {isVerifying ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting to checkout…
        </>
      ) : (
        <>
          Subscribe to {tierName}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
