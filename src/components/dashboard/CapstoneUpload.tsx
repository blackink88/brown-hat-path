import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

interface CapstoneUploadProps {
  lessonId: string;
  courseCode: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
> = {
  submitted: { label: "Submitted", variant: "default", icon: Clock },
  under_review: { label: "Under Review", variant: "secondary", icon: Clock },
  graded: { label: "Graded", variant: "default", icon: CheckCircle2 },
  resubmit: { label: "Resubmission Required", variant: "destructive", icon: RotateCcw },
};

export function CapstoneUpload({ lessonId, courseCode }: CapstoneUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch existing submission — gracefully handle missing table
  const {
    data: submission,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["capstoneSubmission", user?.id, lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("capstone_submissions")
        .select("*")
        .eq("user_id", user!.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!lessonId,
    retry: 1,
  });

  const handleUpload = async (file: File) => {
    if (!user?.id) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (20 MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20 MB. Please compress your PDF and try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate file name pattern (informational — don't block)
    const expectedPattern = new RegExp(
      `^BH-[A-Z0-9-]+-capstone-[A-Za-z]+-[A-Za-z]+\\.pdf$`
    );
    if (!expectedPattern.test(file.name)) {
      toast({
        title: "File naming reminder",
        description: `Recommended format: ${courseCode}-capstone-FirstName-LastName.pdf`,
      });
    }

    setUploading(true);
    try {
      const filePath = `${user.id}/${lessonId}/${file.name}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("capstone-submissions")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Upsert submission record
      const { error: dbError } = await supabase
        .from("capstone_submissions")
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            file_path: filePath,
            file_name: file.name,
            file_size_bytes: file.size,
            submitted_at: new Date().toISOString(),
            status: "submitted",
            grade: null,
            feedback: null,
            graded_by: null,
            graded_at: null,
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (dbError) throw dbError;

      queryClient.invalidateQueries({
        queryKey: ["capstoneSubmission", user.id, lessonId],
      });

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

  if (isError) {
    return (
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Upload Capstone</h3>
        </div>
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Submission tracking is being set up. You can still upload your PDF below.
          </span>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Capstone PDF
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PDF only, max 20 MB. Name: <code>{courseCode}-capstone-FirstName-LastName.pdf</code>
          </p>
        </div>
      </div>
    );
  }

  const statusCfg = submission ? STATUS_CONFIG[submission.status] || STATUS_CONFIG.submitted : null;

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
            File format: <strong>PDF only</strong>
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
                {submission.file_name}
              </span>
            </div>
            <Badge variant={statusCfg.variant}>
              <statusCfg.icon className="h-3 w-3 mr-1" />
              {statusCfg.label}
            </Badge>
          </div>

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

          {/* Grade display */}
          {submission.status === "graded" && submission.grade !== null && (
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

          {/* Resubmit feedback */}
          {submission.status === "resubmit" && submission.feedback && (
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
          accept=".pdf,application/pdf"
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
              Upload Capstone PDF
            </>
          )}
        </Button>
        {submission && (
          <p className="text-xs text-muted-foreground mt-2">
            Re-uploading will replace your previous submission.
          </p>
        )}
      </div>
    </div>
  );
}
