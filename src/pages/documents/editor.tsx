import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Download,
  Sparkles,
  FileText,
  Loader2,
  ChevronLeft,
  Eye,
  Code,
  Wand2,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DocumentSection {
  id: string;
  heading: string;
  content: string;
  wordCount: number;
}

export default function DocumentEditorPage() {
  const router = useRouter();
  const { tender } = router.query;

  const [title, setTitle] = useState("Untitled Document");
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: "1",
      heading: "Executive Summary",
      content: "",
      wordCount: 0,
    },
  ]);
  const [selectedSection, setSelectedSection] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("unsaved");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [generationType, setGenerationType] = useState<string>("method-statement");

  const documentTypes = [
    { value: "method-statement", label: "Method Statement" },
    { value: "mobilisation-plan", label: "Mobilisation Plan" },
    { value: "safeguarding", label: "Safeguarding Response" },
    { value: "quality-assurance", label: "Quality Assurance" },
    { value: "pricing", label: "Pricing Schedule" },
    { value: "cover-letter", label: "Cover Letter" },
  ];

  const currentSection = sections.find((s) => s.id === selectedSection);

  useEffect(() => {
    const wordCount = currentSection?.content.trim().split(/\s+/).filter(Boolean).length || 0;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSection ? { ...s, wordCount } : s
      )
    );
  }, [currentSection?.content, selectedSection]);

  const handleAddSection = () => {
    const newSection: DocumentSection = {
      id: Date.now().toString(),
      heading: "New Section",
      content: "",
      wordCount: 0,
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length === 1) return;
    setSections(sections.filter((s) => s.id !== id));
    if (selectedSection === id) {
      setSelectedSection(sections[0].id);
    }
  };

  const handleUpdateSection = (id: string, field: keyof DocumentSection, value: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    setSaveStatus("unsaved");
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-tender-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender,
          sectionType: currentSection?.heading || "General",
          documentType: generationType,
        }),
      });

      const { content } = await response.json();

      if (content) {
        handleUpdateSection(selectedSection, "content", content);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const tenderIdString = typeof tender === "string" ? tender : Array.isArray(tender) ? tender[0] : "";

      if (!tenderIdString) throw new Error("Tender ID is required");

      const documentData = {
        title,
        content: JSON.stringify(sections),
        tender_id: tenderIdString,
        created_by: user.id,
        type: generationType,
      };

      const { error } = await supabase.from("documents").insert(documentData);

      if (error) throw error;

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("unsaved"), 2000);
    } catch (error) {
      console.error("Error saving document:", error);
      setSaveStatus("unsaved");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const fullContent = sections
      .map((s) => `${s.heading}\n\n${s.content}`)
      .join("\n\n---\n\n");

    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);

  return (
    <Layout>
      <SEO title={`${title} - Document Editor`} description="Create and edit tender response documents" />

      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveStatus("unsaved");
                }}
                className="text-lg font-semibold border-0 focus-visible:ring-0 max-w-md"
                placeholder="Document title..."
              />
              <Badge variant={saveStatus === "saved" ? "default" : "secondary"}>
                {saveStatus === "saved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {saveStatus === "saved" ? "Saved" : saveStatus === "saving" ? "Saving..." : "Unsaved"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select value={generationType} onValueChange={setGenerationType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-6" />

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "edit" | "preview")}>
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="edit">
                    <Code className="w-4 h-4 mr-1" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Sections */}
          <div className="w-64 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Sections</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddSection}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {section.heading || "Untitled"}
                      </p>
                    </div>
                    <p className="text-xs opacity-70">
                      {section.wordCount} words
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Sections</span>
                  <span className="font-medium">{sections.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Words</span>
                  <span className="font-medium">{totalWords}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === "edit" ? (
              <div className="max-w-4xl mx-auto p-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Input
                          value={currentSection?.heading || ""}
                          onChange={(e) =>
                            handleUpdateSection(
                              selectedSection,
                              "heading",
                              e.target.value
                            )
                          }
                          className="text-2xl font-heading font-bold border-0 focus-visible:ring-0 px-0"
                          placeholder="Section heading..."
                        />
                        <CardDescription className="mt-2">
                          {currentSection?.wordCount || 0} words
                        </CardDescription>
                      </div>
                      <Button
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        className="ml-4"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={currentSection?.content || ""}
                      onChange={(e) =>
                        handleUpdateSection(
                          selectedSection,
                          "content",
                          e.target.value
                        )
                      }
                      placeholder="Start writing or use AI Generate to create content..."
                      className="min-h-[500px] text-base leading-relaxed resize-none font-serif"
                    />
                  </CardContent>
                </Card>

                {sections.length > 1 && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSection(selectedSection)}
                    >
                      Delete Section
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-8">
                <div className="prose prose-slate max-w-none">
                  <h1 className="text-4xl font-heading font-bold mb-8">{title}</h1>
                  {sections.map((section) => (
                    <div key={section.id} className="mb-8">
                      <h2 className="text-2xl font-heading font-bold mb-4">
                        {section.heading}
                      </h2>
                      <div className="text-base leading-relaxed whitespace-pre-wrap">
                        {section.content || (
                          <p className="text-muted-foreground italic">
                            No content yet. Switch to Edit mode to add content.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}