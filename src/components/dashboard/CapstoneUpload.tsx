import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  File,
} from "lucide-react";
import {
  uploadFileFrappe,
  submitCapstone,
  getSubmissions,
  frappeKeys,
  type BHSubmission,
} from "@/lib/frappe";

interface CapstoneUploadProps {
  /** Frappe course slug, e.g. "practitioner-core-grc-2" */
  course: string;
  /** Short course code for display, e.g. "BH-GRC-2" */
  courseCode: string;
  /** Frappe lesson doc name (optional — used to scope the submission) */
  lesson?: string;
}

const STATUS_CONFIG: Record<
  BHSubmission["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
> = {
  Submitted: { label: "Submitted", variant: "default", icon: Clock },
  "Under Review": { label: "Under Review", variant: "secondary", icon: Clock },
  Graded: { label: "Graded", variant: "default", icon: CheckCircle2 },
  "Resubmit Required": { label: "Resubmission Required", variant: "destructive", icon: RotateCcw },
};

export function CapstoneUpload({ course, courseCode, lesson }: CapstoneUploadProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const accessToken = session?.access_token ?? "";

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: frappeKeys.submissions(course),
    queryFn: () => getSubmissions(accessToken, course),
    enabled: !!accessToken && !!course,
  });

  // Find the capstone submission for this specific lesson (or latest capstone for course)
  const submission = submissions.find(
    (s) =>
      s.submission_type === "Capstone" &&
      (lesson ? s.lesson === lesson : true)
  ) ?? null;

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const ACCEPTED_EXT_LABEL = "PDF or DOCX";

  const handleUpload = async (file: File) => {
    if (!accessToken) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${ACCEPTED_EXT_LABEL} file.`,
        variant: "destructive",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20 MB. Please compress your file and try again.",
        variant: "destructive",
      });
      return;
    }

    const expectedPattern = /^BH-[A-Z0-9-]+-capstone-[A-Za-z]+-[A-Za-z]+\.(pdf|docx)$/i;
    if (!expectedPattern.test(file.name)) {
      toast({
        title: "File naming reminder",
        description: `Recommended format: ${courseCode}-capstone-FirstName-LastName.pdf`,
      });
    }

    setUploading(true);
    try {
      // Step 1: Upload file to Frappe storage
      const fileUrl = await uploadFileFrappe(file, accessToken);

      // Step 2: Create BH Submission doc in Frappe
      await submitCapstone({ course, lesson, file_url: fileUrl }, accessToken);

      queryClient.invalidateQueries({ queryKey: frappeKeys.submissions(course) });

      toast({
        title: "Capstone uploaded",
        description: "Your submission has been received. Your instructor will review it.",
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload failed",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading submission status…</span>
        </div>
      </div>
    );
  }

  const statusCfg = submission ? STATUS_CONFIG[submission.status] ?? STATUS_CONFIG.Submitted : null;
  // Extract filename from file_url for display
  const fileName = submission?.file_url?.split("/").pop() ?? "";

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Upload Capstone</h3>
      </div>

      {/* File naming instructions */}
      <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Submission requirements:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>
            File format: <strong>PDF or DOCX</strong>
          </li>
          <li>Maximum size: 20 MB</li>
          <li>
            Name your file:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
              {courseCode}-capstone-FirstName-LastName.pdf
            </code>
          </li>
        </ul>
      </div>

      {/* Current submission status */}
      {submission && statusCfg && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground truncate max-w-[250px]">
                {fileName}
              </span>
            </div>
            <Badge variant={statusCfg.variant}>
              <statusCfg.icon className="h-3 w-3 mr-1" />
              {statusCfg.label}
            </Badge>
          </div>

          {submission.submitted_at && (
            <p className="text-xs text-muted-foreground">
              Submitted{" "}
              {new Date(submission.submitted_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {submission.status === "Graded" && submission.grade !== null && (
            <div className="rounded-lg bg-primary/10 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  Grade: {submission.grade}/100
                </span>
              </div>
              {submission.feedback && (
                <p className="text-sm text-muted-foreground">{submission.feedback}</p>
              )}
            </div>
          )}

          {submission.status === "Resubmit Required" && submission.feedback && (
            <div className="rounded-lg bg-destructive/10 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Instructor feedback:</span>
              </div>
              <p className="text-sm text-foreground">{submission.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant={submission ? "outline" : "default"}
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading…
            </>
          ) : submission ? (
            <>
              <RotateCcw className="h-4 w-4 mr-2" />
              Re-upload Submission
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4 mr-2" />
              Upload Capstone (PDF or DOCX)
            </>
          )}
        </Button>
        {submission && (
          <p className="text-xs text-muted-foreground mt-2">
            Re-uploading will create a new submission for instructor review.
          </p>
        )}
      </div>
    </div>
  );
}
