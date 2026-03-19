import { useState, useRef } from "react";
import { Upload, File, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  tenderId: string;
  onUploadComplete?: (fileId: string) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
  fileId?: string;
}

export function FileUploader({
  tenderId,
  onUploadComplete,
  acceptedTypes = [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv"],
  maxSizeMB = 50,
}: FileUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const maxSize = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;

      if (!acceptedTypes.includes(fileExt)) {
        alert(`File type ${fileExt} not supported. Please upload: ${acceptedTypes.join(", ")}`);
        continue;
      }

      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is ${maxSizeMB}MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files: File[]) => {
    const newUploads: UploadingFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: "uploading",
    }));

    setUploadingFiles((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadIndex = uploadingFiles.length + i;

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadingFiles((prev) =>
            prev.map((u, idx) =>
              idx === uploadIndex ? { ...u, progress } : u
            )
          );
        }

        // Upload to storage
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tenderId", tenderId);

        const uploadResponse = await fetch("/api/upload-tender-file", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        const { fileId, fileUrl } = await uploadResponse.json();

        // Update status to processing
        setUploadingFiles((prev) =>
          prev.map((u, idx) =>
            idx === uploadIndex
              ? { ...u, status: "processing", fileId }
              : u
          )
        );

        // Parse document
        const parseResponse = await fetch("/api/parse-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileUrl,
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (parseResponse.ok) {
          const parsed = await parseResponse.json();

          // Save parsed content
          await fetch("/api/save-parsed-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tenderId,
              fileId,
              parsed,
            }),
          });
        }

        // Mark as complete
        setUploadingFiles((prev) =>
          prev.map((u, idx) =>
            idx === uploadIndex
              ? { ...u, status: "complete", progress: 100 }
              : u
          )
        );

        if (onUploadComplete) {
          onUploadComplete(fileId);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadingFiles((prev) =>
          prev.map((u, idx) =>
            idx === uploadIndex
              ? {
                  ...u,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : u
          )
        );
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-12 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: {acceptedTypes.join(", ")} (max {maxSizeMB}MB)
          </p>
          <Button type="button" variant="outline" size="sm">
            Select Files
          </Button>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          {uploadingFiles.map((upload, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {upload.status === "uploading" && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                  {upload.status === "processing" && (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                  {upload.status === "complete" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {upload.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {upload.file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {upload.status === "error" ? (
                    <p className="text-sm text-destructive">{upload.error}</p>
                  ) : (
                    <>
                      <Progress value={upload.progress} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {upload.status === "uploading" && "Uploading..."}
                        {upload.status === "processing" && "Processing document..."}
                        {upload.status === "complete" && "Upload complete"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}