import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  FileText,
  MessageSquare,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Send,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Tender {
  id: string;
  title: string;
  authority: string;
  deadline: string;
  value: string;
  location: string;
  service_type: string;
  status: string;
  ai_score: number;
  decision: string | null;
  created_at: string;
}

interface TenderScore {
  service_fit: number;
  geography_fit: number;
  compliance_fit: number;
  evidence_fit: number;
  total_score: number;
  reasoning: string;
  risks: string[];
  missing_evidence: string[];
}

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

export default function TenderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tender, setTender] = useState<Tender | null>(null);
  const [score, setScore] = useState<TenderScore | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (typeof id === "string") {
      fetchTenderData(id);
    }
  }, [id]);

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
    } catch (error) {
      console.error("Error fetching tender:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || typeof id !== "string") return;

    setSending(true);
    try {
      const userMessage = {
        tender_id: id,
        user_id: "temp-user-id", // Will be replaced by actual user ID later
        content: newMessage,
        is_ai: false,
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(userMessage)
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: id,
          message: newMessage,
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
    } finally {
      setSending(false);
    }
  }

  if (loading || !tender) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading tender...</p>
        </div>
      </Layout>
    );
  }

  const scoreBreakdown = score
    ? [
        { label: "Service Fit", value: score.service_fit, color: "text-purple-600" },
        { label: "Geography Fit", value: score.geography_fit, color: "text-blue-600" },
        { label: "Compliance Fit", value: score.compliance_fit, color: "text-green-600" },
        { label: "Evidence Fit", value: score.evidence_fit, color: "text-orange-600" },
      ]
    : [];

  return (
    <Layout>
      <SEO title={`${tender.title} - TenderFlow AI`} description={`Tender details for ${tender.title}`} />

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-heading font-bold mb-2">{tender.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {tender.authority}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {tender.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(tender.deadline).toLocaleDateString("en-GB")}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  {tender.value}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Edit Details</Button>
              <Button>Generate Bid</Button>
            </div>
          </div>

          {/* Score Banner */}
          {score && (
            <Card className="bg-gradient-hero text-white shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm font-medium opacity-90">AI Analysis Complete</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{score.total_score}% Match</h3>
                    <p className="opacity-90 text-sm">
                      {score.total_score >= 80
                        ? "Strong recommendation to bid"
                        : score.total_score >= 60
                        ? "Consider bidding with preparation"
                        : "Review carefully before committing"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="lg" variant="secondary">
                      Mark as Bid
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                      No Bid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-2 shadow-soft">
                <CardHeader>
                  <CardTitle>Tender Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Service Type</h4>
                    <p className="text-sm">{tender.service_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                    <Badge>{tender.status}</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Decision</h4>
                    {tender.decision ? (
                      <Badge variant={tender.decision === "bid" ? "default" : "destructive"}>
                        {tender.decision === "bid" ? "Bid" : "No Bid"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Under Review</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    View Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-2 gap-6">
              {/* Score Breakdown */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scoreBreakdown.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className={`text-sm font-bold ${item.color}`}>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color.replace("text", "bg")}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reasoning */}
              {score && (
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>AI Reasoning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{score.reasoning}</p>
                  </CardContent>
                </Card>
              )}

              {/* Risks */}
              {score && score.risks.length > 0 && (
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      Identified Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {score.risks.map((risk, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-destructive">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Missing Evidence */}
              {score && score.missing_evidence.length > 0 && (
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-600" />
                      Missing Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {score.missing_evidence.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-orange-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col shadow-medium">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">Start a conversation</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ask me anything about this tender
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.is_ai ? "" : "flex-row-reverse"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.is_ai ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {msg.is_ai ? <Sparkles className="w-4 h-4" /> : "U"}
                        </div>
                        <div
                          className={`flex-1 p-4 rounded-lg max-w-2xl ${
                            msg.is_ai ? "bg-muted" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p
                            className={`text-xs mt-2 ${
                              msg.is_ai ? "text-muted-foreground" : "text-primary-foreground/70"
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input
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
                    />
                    <Button onClick={handleSendMessage} disabled={sending}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: "Summarise this tender" • "What are the risks?" • "Draft a response"
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Documents</CardTitle>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No documents generated yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}