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
import { Label } from "@/components/ui/label";
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
  Circle,
  MessageSquare,
  Trash2,
  User,
  Edit,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Tender, TenderScore } from "@/services/tenderService";
import { evaluationService, type TenderEvaluation } from "@/services/evaluationService";
import { taskService, type Task } from "@/services/taskService";
import { commentService, type Comment } from "@/services/commentService";
import { activityService, type Activity } from "@/services/activityService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  const { user, organisation } = useAuth();

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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
  });
  const [newComment, setNewComment] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof id === "string") {
      fetchTenderData(id);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (tender && organisation && user) {
      fetchTasks();
      fetchComments();
      fetchActivities();
    }
  }, [tender, organisation, user]);

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

  const fetchTasks = async () => {
    try {
      const tasksData = await taskService.getForTender(tender.id);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsData = await commentService.getForTender(tender.id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const activitiesData = await activityService.getForTender(tender.id);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !organisation || !user) return;

    try {
      await taskService.create(
        {
          tenderId: tender.id,
          title: newTask.title,
          description: newTask.description,
          assignedTo: newTask.assignedTo || undefined,
          priority: newTask.priority,
          dueDate: newTask.dueDate || undefined,
        },
        organisation.id,
        user.id
      );

      await activityService.create(
        {
          tenderId: tender.id,
          actionType: "task_created",
          entityType: "task",
          description: `Created task: ${newTask.title}`,
        },
        organisation.id,
        user.id
      );

      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });
      setIsTaskDialogOpen(false);
      fetchTasks();
      fetchActivities();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await taskService.updateStatus(task.id, newStatus);

      if (user && organisation) {
        await activityService.create(
          {
            tenderId: tender.id,
            actionType: "task_updated",
            entityType: "task",
            entityId: task.id,
            description: `Marked task as ${newStatus}: ${task.title}`,
          },
          organisation.id,
          user.id
        );
      }

      fetchTasks();
      fetchActivities();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      await taskService.delete(taskId);
      fetchTasks();
      fetchActivities();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !organisation || !user) return;

    try {
      await commentService.create(
        {
          tenderId: tender.id,
          content: newComment,
        },
        organisation.id,
        user.id
      );

      await activityService.create(
        {
          tenderId: tender.id,
          actionType: "comment_added",
          entityType: "comment",
          description: "Added a comment",
        },
        organisation.id,
        user.id
      );

      setNewComment("");
      fetchComments();
      fetchActivities();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await commentService.delete(commentId);
      fetchComments();
      fetchActivities();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

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
      <SEO
        title={`${tender?.title || "Tender Details"} - TenderFlow AI`}
        description={tender?.description || "View tender details and AI analysis"}
      />

      <div className="h-[calc(100vh-4rem)] flex">
        {/* LEFT SIDE - Tender Details */}
        <div className="flex-1 overflow-y-auto border-r">
          <div className="p-8">
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
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => window.open(file.file_url, "_blank")}
                      >
                        <Download className="h-4 w-4" />
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

            <Separator />

            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Tasks ({tasks.length})
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Existing score, description sections */}
                ... existing overview content ...
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <p className="text-sm text-muted-foreground">
                      Track work items for this tender
                    </p>
                  </div>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>
                          Add a task for this tender
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="task-title">Title *</Label>
                          <Input
                            id="task-title"
                            placeholder="e.g., Review safeguarding requirements"
                            value={newTask.title}
                            onChange={(e) =>
                              setNewTask({ ...newTask, title: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-description">Description</Label>
                          <Textarea
                            id="task-description"
                            placeholder="Add details..."
                            value={newTask.description}
                            onChange={(e) =>
                              setNewTask({ ...newTask, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="task-priority">Priority</Label>
                            <Select
                              value={newTask.priority}
                              onValueChange={(value) =>
                                setNewTask({
                                  ...newTask,
                                  priority: value as Task["priority"],
                                })
                              }
                            >
                              <SelectTrigger id="task-priority">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="task-due">Due Date</Label>
                            <Input
                              id="task-due"
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) =>
                                setNewTask({ ...newTask, dueDate: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsTaskDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateTask}>Create Task</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {tasks.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">
                        No tasks yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create tasks to track work for this tender
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleTaskStatus(task)}
                              className="mt-1"
                            >
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`font-medium ${
                                    task.status === "completed"
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                {task.priority && (
                                  <Badge
                                    variant={
                                      task.priority === "urgent" ||
                                      task.priority === "high"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                )}
                                {task.due_date && (
                                  <Badge variant="outline" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                  </Badge>
                                )}
                                <Badge variant="outline">{task.status}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="mt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Discussion</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaborate with your team on this tender
                  </p>
                </div>

                {comments.length === 0 ? (
                  <Card className="mb-6">
                    <CardContent className="text-center py-12">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">
                        No comments yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start a discussion about this tender
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 mb-6">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {comment.users?.full_name || "User"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(comment.created_at).toLocaleString()}
                                  </p>
                                </div>
                                {user?.id === comment.user_id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-sm mt-2 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
                  <p className="text-sm text-muted-foreground">
                    Track all changes and updates to this tender
                  </p>
                </div>

                {activities.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">
                        No activity yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {activity.action_type === "task_created" ||
                            activity.action_type === "task_updated" ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : activity.action_type === "comment_added" ? (
                              <MessageSquare className="h-4 w-4 text-primary" />
                            ) : activity.action_type === "file_uploaded" ? (
                              <FileText className="h-4 w-4 text-primary" />
                            ) : activity.action_type === "status_changed" ? (
                              <Edit className="h-4 w-4 text-primary" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          {index < activities.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">
                                {activity.users?.full_name || "System"}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.description}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                ... existing documents content ...
              </TabsContent>
            </Tabs>
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