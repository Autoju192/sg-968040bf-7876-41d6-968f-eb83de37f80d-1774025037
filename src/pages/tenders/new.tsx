import { useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewTenderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Form states
  const [title, setTitle] = useState("");
  const [authority, setAuthority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [value, setValue] = useState("");
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: tender, error: tenderError } = await supabase
        .from("tenders")
        .insert({
          title,
          authority,
          deadline,
          value,
          location,
          service_type: serviceType,
          status: "new",
          ai_score: 0,
          organisation_id: "temp-org-id", // TODO: Get from auth context
        })
        .select()
        .single();

      if (tenderError) throw tenderError;

      if (files && files.length > 0) {
        const file = files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${tender.id}-${Date.now()}.${fileExt}`;
        const filePath = `tenders/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("tender-files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: fileRecordError } = await supabase
          .from("tender_files")
          .insert({
            tender_id: tender.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            extracted_text: "",
          });

        if (fileRecordError) throw fileRecordError;
      }

      router.push(`/tenders/${tender.id}`);
    } catch (error) {
      console.error("Error creating tender:", error);
      alert("Failed to create tender. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <SEO
        title="Add New Tender - TenderFlow AI"
        description="Add a new tender to your pipeline"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Add New Tender</h1>
          <p className="text-muted-foreground">
            Import tender documents or enter details manually
          </p>
        </div>

        <Card className="shadow-large">
          <CardHeader>
            <CardTitle>Tender Information</CardTitle>
            <CardDescription>
              Start by uploading documents or entering details manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Files
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-2">
                  <LinkIcon className="w-4 h-4" />
                  From URL
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports PDF, Word, Excel (Max 10MB)
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                    onChange={(e) => setFiles(e.target.files)}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="url">Tender URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/tender-document"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll fetch and parse the content automatically
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter tender details manually below
                </p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tender Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Residential Care Services Framework"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="authority">Contracting Authority *</Label>
                  <Input
                    id="authority"
                    placeholder="e.g., Manchester City Council"
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="value">Contract Value</Label>
                  <Input
                    id="value"
                    placeholder="e.g., £2.4M"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Manchester"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Input
                    id="serviceType"
                    placeholder="e.g., Residential Care"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? "Creating..." : "Create Tender"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}