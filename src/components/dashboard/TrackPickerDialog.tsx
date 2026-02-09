import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Server, Cloud, Lock, FileText } from "lucide-react";

const PRACTITIONER_OPTIONS: { track: "ops" | "grc"; label: string; description: string; icon: typeof Shield }[] = [
  { track: "ops", label: "Cyber Operations (Blue Team)", description: "SOC, SIEM, Incident Response", icon: Shield },
  { track: "grc", label: "GRC", description: "Governance, Risk & Compliance", icon: FileCheck },
];

const SPECIALISATION_OPTIONS: { track: "soc" | "iam" | "cloud" | "grc"; label: string; description: string; icon: typeof Server }[] = [
  { track: "soc", label: "SOC & Incident Response", description: "Advanced SOC, SIEM, threat hunting", icon: Server },
  { track: "iam", label: "IAM", description: "Identity and Access Management", icon: Lock },
  { track: "cloud", label: "Cloud Security", description: "AWS, Azure, GCP security", icon: Cloud },
  { track: "grc", label: "Advanced GRC", description: "Governance, risk, compliance", icon: FileText },
];

type PractitionerTrack = "ops" | "grc";
type SpecialisationTrack = "soc" | "iam" | "cloud" | "grc";

interface TrackPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: 3 | 4;
  onSelect: (track: PractitionerTrack | SpecialisationTrack) => void;
  isLoading?: boolean;
}

export function TrackPickerDialog({ open, onOpenChange, level, onSelect, isLoading }: TrackPickerDialogProps) {
  const isPractitioner = level === 3;
  const options = isPractitioner ? PRACTITIONER_OPTIONS : SPECIALISATION_OPTIONS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPractitioner ? "Choose your Practitioner track" : "Choose your Specialisation track"}
          </DialogTitle>
          <DialogDescription>
            {isPractitioner
              ? "You can only be on one practitioner track. Pick the path that fits your goals."
              : "You can only specialise in one track. Choose the area you want to focus on."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <Button
                key={opt.track}
                variant="outline"
                className="h-auto flex items-start gap-3 p-4 text-left justify-start"
                onClick={() => onSelect(opt.track as PractitionerTrack | SpecialisationTrack)}
                disabled={isLoading}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
        <DialogFooter className="text-sm text-muted-foreground">
          You won&apos;t be able to switch to another track once chosen.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
