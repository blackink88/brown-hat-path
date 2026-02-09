import { cn } from "@/lib/utils";

interface AlignedToCertsProps {
  certifications: string[];
  className?: string;
}

/** Single place for "Aligned to ..." line so size and colour stay consistent across course cards and player. */
export function AlignedToCerts({ certifications, className }: AlignedToCertsProps) {
  if (!Array.isArray(certifications) || certifications.length === 0) return null;
  return (
    <p className={cn("text-xs text-primary", className)}>
      Aligned to: {certifications.join(", ")}. Support and exam discounts available.
    </p>
  );
}
