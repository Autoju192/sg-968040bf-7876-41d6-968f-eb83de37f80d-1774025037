import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Send,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  FileUp,
  Loader2,
  ChevronRight,
  Download,
  Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Tender, TenderScore } from "@/services/tenderService";
import { evaluationService, type TenderEvaluation } from "@/services/evaluationService";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

interface TenderFile {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export default function TenderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [tender, setTender] = useState<Tender | null>(null);
  const [score, setScore] = useState<TenderScore | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<TenderFile[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [evaluation, setEvaluation] = useState<TenderEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof id === "string") {
      fetchTenderData(id);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchTenderData(tenderId: string) {
    try {
      const { data: tenderData, error: tenderError } = await supabase
        .from("tenders")
        .select("*")
        .eq("id", tenderId)
        .single();

      if (tenderError) throw tenderError;
      setTender(tenderData as Tender);

      const { data: scoreData } = await supabase
        .from("tender_scores")
        .select("*")
        .eq("tender_id", tenderId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (scoreData) setScore(scoreData as TenderScore);

      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("tender_id", tenderId)
        .order("created_at", { ascending: true });

      if (messagesData) setMessages(messagesData as Message[]);

      const { data: filesData } = await supabase
        .from("tender_files")
        .select("*")
        .eq("tender_id", tenderId)
        .order("created_at", { ascending: false });

      if (filesData) setFiles(filesData as TenderFile[]);
    } catch (error) {
      console.error("Error fetching tender:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || typeof id !== "string") return;

    setSending(true);
    const messageText = newMessage;
    setNewMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const userMessage = {
        tender_id: id,
        user_id: user?.id,
        content: messageText,
        is_ai: false,
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(userMessage)
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data as Message]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: id,
          message: messageText,
        }),
      });

      const { reply } = await response.json();

      const aiMessage = {
        tender_id: id,
        user_id: null,
        content: reply,
        is_ai: true,
      };

      const { data: aiData, error: aiError } = await supabase
        .from("messages")
        .insert(aiMessage)
        .select()
        .single();

      if (aiError) throw aiError;
      setMessages((prev) => [...prev, aiData as Message]);
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  }

  const handleRunEvaluation = async () => {
    if (!tender || !user) return;

    setIsEvaluating(true);

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData?.organisation_id) {
        throw new Error("Could not find your organization profile");
      }

      const companyProfile = await evaluationService.getCompanyProfile(
        userData.organisation_id
      );

      const result = await evaluationService.evaluateTender(
        tender.id,
        companyProfile
      );

      setEvaluation(result);

      await evaluationService.saveEvaluation(tender.id, result);

      const { data: updatedTender } = await supabase
        .from("tenders")
        .select(`
          *,
          tender_scores (*)
        `)
        .eq("id", id as string)
        .single();

      if (updatedTender) {
        setTender(updatedTender);
      }
    } catch (error) {
      console.error("Evaluation error:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const quickActions = [
    { label: "Summarize tender", prompt: "Please summarize this tender in 3 key points" },
    { label: "Key requirements", prompt: "What are the key requirements for this tender?" },
    { label: "Risk analysis", prompt: "What are the main risks with this tender?" },
    { label: "Missing evidence", prompt: "What evidence might we be missing for this bid?" },
  ];

  if (loading || !tender) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const scoreBreakdown = score
    ? [
        { label: "Service Fit", value: score.service_fit || 0, max: 25, color: "bg-purple-500" },
        { label: "Geography Fit", value: score.geography_fit || 0, max: 15, color: "bg-blue-500" },
        { label: "Compliance Fit", value: score.compliance_fit || 0, max: 20, color: "bg-green-500" },
        { label: "Evidence Fit", value: score.evidence_fit || 0, max: 20, color: "bg-orange-500" },
      ]
    : [];

  return (
    <Layout>
      <SEO title={`${tender.title} - TenderFlow AI`} description={`Tender details for ${tender.title}`} />

      <div className="h-[calc(100vh-4rem)] flex">
        {/* LEFT SIDE - Tender Details */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={tender.status === "new" ? "default" : "secondary"}>
                      {tender.status}
                    </Badge>
                    {tender.decision && (
                      <Badge variant={tender.decision === "bid" ? "default" : "destructive"}>
                        {tender.decision === "bid" ? "✓ Bid" : "✗ No Bid"}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-heading font-bold mb-3">{tender.title}</h1>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      {tender.authority}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {tender.location}
                    </div>
                    {tender.deadline && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(tender.deadline).toLocaleDateString("en-GB")}
                      </div>
                    )}
                    {tender.value && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(tender.value)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Banner */}
              {score && (
                <Card className="bg-gradient-hero text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-sm font-medium">AI Match Score</span>
                        </div>
                        <div className="text-3xl font-bold">{score.total_score}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90 mb-2">
                          {(score.total_score || 0) >= 80
                            ? "Strong Recommendation"
                            : (score.total_score || 0) >= 60
                            ? "Consider Bidding"
                            : "Review Carefully"}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => router.push(`/documents?tender=${tender.id}`)}>
                            Generate Bid
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Score Breakdown */}
            {scoreBreakdown.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  {scoreBreakdown.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.value}/{item.max}
                        </span>
                      </div>
                      <Progress 
                        value={(item.value / item.max) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={handleRunEvaluation}
                  disabled={isEvaluating}
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Re-run AI Evaluation
                    </>
                  )}
                </Button>
              </div>
            )}

            <Separator />

            {/* Description */}
            {tender.description && (
              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {tender.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents ({files.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploader(!showUploader)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              {showUploader && (
                <div className="mb-4">
                  <FileUploader
                    tenderId={tender.id}
                    onUploadComplete={() => {
                      if (typeof id === "string") {
                        fetchTenderData(id);
                      }
                      setShowUploader(false);
                    }}
                  />
                </div>
              )}

              {files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{file.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(file.created_at).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.file_url, "_blank")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No documents uploaded yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - AI Chat Assistant */}
        <div className="w-1/2 flex flex-col bg-muted/30">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-background">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">AI Chat Assistant</h2>
                <p className="text-xs text-muted-foreground">
                  Ask me anything about this tender
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try one of these quick actions:
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3 px-4"
                        onClick={() => {
                          setNewMessage(action.prompt);
                          handleSendMessage();
                        }}
                      >
                        <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-left text-xs">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.is_ai ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.is_ai
                          ? "bg-gradient-hero text-white"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {msg.is_ai ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">
                          {user?.email?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 max-w-[80%]">
                      <div
                        className={`p-4 rounded-2xl ${
                          msg.is_ai
                            ? "bg-background border border-border"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                      <p
                        className={`text-xs mt-1.5 px-2 ${
                          msg.is_ai ? "text-muted-foreground" : "text-right text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about this tender..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending}
                className="min-h-[60px] max-h-[120px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="self-end"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}