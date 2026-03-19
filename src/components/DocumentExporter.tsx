import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentExporterProps {
  documentId?: string;
  title: string;
  content: {
    heading: string;
    content: string;
  }[];
}

export function DocumentExporter({
  documentId,
  title,
  content,
}: DocumentExporterProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExport(format: "docx" | "txt") {
    setExporting(true);
    try {
      const response = await fetch("/api/export-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          sections: content,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export document");
    } finally {
      setExporting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("docx")}>
          <FileText className="w-4 h-4 mr-2" />
          Export as Word (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("txt")}>
          <FileText className="w-4 h-4 mr-2" />
          Export as Text (.txt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}