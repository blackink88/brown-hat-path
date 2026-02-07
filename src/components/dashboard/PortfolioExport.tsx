import { useState } from "react";
import { FileText, Link as LinkIcon, Download, Loader2, CheckCircle2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortfolioExportProps {
  userName?: string;
  completedLessons?: number;
  skillsCount?: number;
  labsCompleted?: number;
}

export function PortfolioExport({
  userName = "Student",
  completedLessons = 0,
  skillsCount = 0,
  labsCompleted = 0,
}: PortfolioExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "link" | null>(null);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async (type: "pdf" | "link") => {
    setExportType(type);
    setIsGenerating(true);
    setExportComplete(false);

    // Simulate export generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsGenerating(false);
    setExportComplete(true);

    // In production, this would trigger actual PDF download or copy link
    if (type === "pdf") {
      // Trigger download
      console.log("Downloading PDF portfolio...");
    } else {
      // Copy link to clipboard
      navigator.clipboard.writeText(
        `https://brownhat.academy/portfolio/${userName.toLowerCase().replace(/\s/g, "-")}`
      );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Share2 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Export Portfolio</h3>
          <p className="text-sm text-muted-foreground">
            Share your skills with employers
          </p>
        </div>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-muted/30 border border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{completedLessons}</p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{skillsCount}</p>
          <p className="text-xs text-muted-foreground">Skills</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{labsCompleted}</p>
          <p className="text-xs text-muted-foreground">Labs</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className={cn(
            "h-auto py-4 flex-col gap-2",
            exportComplete && exportType === "pdf" && "border-accent"
          )}
          onClick={() => handleExport("pdf")}
          disabled={isGenerating}
        >
          {isGenerating && exportType === "pdf" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : exportComplete && exportType === "pdf" ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">
            {exportComplete && exportType === "pdf" ? "Downloaded!" : "Download PDF"}
          </span>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "h-auto py-4 flex-col gap-2",
            exportComplete && exportType === "link" && "border-accent"
          )}
          onClick={() => handleExport("link")}
          disabled={isGenerating}
        >
          {isGenerating && exportType === "link" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : exportComplete && exportType === "link" ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <LinkIcon className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">
            {exportComplete && exportType === "link" ? "Link Copied!" : "Copy Link"}
          </span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your portfolio includes your Skill Radar, lab credentials, and certifications
      </p>
    </div>
  );
}
