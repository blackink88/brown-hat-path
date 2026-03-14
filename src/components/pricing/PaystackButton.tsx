import { Button } from "@/components/ui/button";
import { usePaystackSubscription } from "@/hooks/usePaystack";
import { ArrowRight, Loader2, Check } from "lucide-react";

interface PaystackButtonProps {
  tierName:         string;
  tierLevel:        number;
  currentTierLevel: number;
  popular?:         boolean;
}

export function PaystackButton({ tierName, tierLevel, currentTierLevel, popular }: PaystackButtonProps) {
  const { pay, isVerifying } = usePaystackSubscription({ tierName });

  const isCurrentPlan = currentTierLevel === tierLevel;
  const isUpgrade     = currentTierLevel > 0 && tierLevel > currentTierLevel;
  const isDowngrade   = currentTierLevel > 0 && tierLevel < currentTierLevel;

  const label = isCurrentPlan
    ? "Current Plan"
    : isUpgrade
    ? `Upgrade to ${tierName}`
    : isDowngrade
    ? `Downgrade to ${tierName}`
    : `Subscribe to ${tierName}`;

  if (isCurrentPlan) {
    return (
      <Button
        variant={popular ? "accent" : "outline"}
        className="w-full gap-2 font-medium"
        size="lg"
        disabled
      >
        <Check className="h-4 w-4" />
        Current Plan
      </Button>
    );
  }

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
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
