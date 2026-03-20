import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inboxService, type InboxItem } from "@/services/inboxService";
import { useRouter } from "next/router";
import {
  Inbox,
  Mail,
  MailOpen,
  AlertCircle,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { ContextHelp } from "@/components/ContextHelp";

export default function InboxPage() {
  const { organisation } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (organisation) {
      fetchInboxItems();
    }
  }, [organisation]);

  useEffect(() => {
    applyFilters();
  }, [items, searchQuery, activeTab]);

  const fetchInboxItems = async () => {
    if (!organisation) return;
    try {
      setLoading(true);
      const data = await inboxService.getAll(organisation.id);
      setItems(data);
    } catch (error) {
      console.error("Error fetching inbox:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Apply tab filter
    if (activeTab === "unread") {
      filtered = filtered.filter((item) => item.status === "unread");
    } else if (activeTab === "action_required") {
      filtered = filtered.filter((item) => item.actionRequired);
    } else if (activeTab === "overdue") {
      const now = new Date();
      filtered = filtered.filter(
        (item) => item.actionDeadline && new Date(item.actionDeadline) < now && item.status !== "actioned"
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tender?.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const markAsRead = async (itemId: string) => {
    try {
      await inboxService.markAsRead(itemId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: "read" } : item
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAsUnread = async (itemId: string) => {
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("tender_inbox").update({ status: "unread", read_at: null }).eq("id", itemId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: "unread", readAt: undefined } : item
        )
      );
    } catch (error) {
      console.error("Error marking as unread:", error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm("Delete this inbox item?")) return;

    try {
      await inboxService.delete(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleItemClick = (item: InboxItem) => {
    if (item.status === "unread") {
      markAsRead(item.id);
    }
    if (item.tenderId) {
      router.push(`/tenders/${item.tenderId}`);
    }
  };

  const getSourceBadge = (source: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      PORTAL_SESSION: { label: "Portal", variant: "default" },
      EMAIL: { label: "Email", variant: "secondary" },
      API: { label: "API", variant: "outline" },
      MANUAL: { label: "Manual", variant: "outline" },
      LINK_WATCHER: { label: "Link Watcher", variant: "secondary" },
    };

    const config = variants[source] || { label: source, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      new_tender: "New Tender",
      update: "Update",
      clarification: "Clarification",
      amendment: "Amendment",
      deadline_change: "Deadline Change",
      message: "Message",
      document_added: "New Document",
    };

    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;

    const config: Record<string, { variant: any; icon: any }> = {
      urgent: { variant: "destructive", icon: AlertCircle },
      high: { variant: "destructive", icon: AlertCircle },
      medium: { variant: "secondary", icon: null },
      low: { variant: "outline", icon: null },
    };

    const { variant, icon: Icon } = config[priority] || { variant: "outline", icon: null };

    return (
      <Badge variant={variant} className="gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const unreadCount = items.filter((item) => item.status === "unread").length;
  const actionRequiredCount = items.filter((item) => item.actionRequired).length;
  const overdueCount = items.filter(
    (item) => item.actionDeadline && new Date(item.actionDeadline) < new Date() && item.status !== "actioned"
  ).length;

  return (
    <Layout>
      <SEO
        title="Tender Inbox - TenderFlow AI"
        description="Manage all tender updates, messages, and alerts in one place"
      />

      <div className="p-8">
        {/* Header with Context Help */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tender Inbox</h1>
            <p className="text-muted-foreground">
              All your tender updates and alerts in one place
            </p>
          </div>
          <ContextHelp
            title="Tender Inbox"
            description="Your unified inbox aggregates all tender-related messages from portals, emails, and monitored URLs."
            steps={[
              "Check the 'Unread' tab to see new items",
              "Use 'Action Required' tab to prioritize tasks",
              "Click any item to view full details",
              "Mark items as read or archive when done"
            ]}
            tips={[
              "Items are automatically categorized by type and priority",
              "Use search to find specific tenders or authorities",
              "Overdue items appear in red - handle these first!"
            ]}
            tutorialLink="/help/tender-inbox"
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="all" className="gap-2">
              <Inbox className="h-4 w-4" />
              All ({items.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              <Mail className="h-4 w-4" />
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="action_required" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Action ({actionRequiredCount})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              <Clock className="h-4 w-4" />
              Overdue ({overdueCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading inbox...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">
                    {activeTab === "all"
                      ? "No inbox items yet"
                      : `No ${activeTab.replace("_", " ")} items`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect portals and email alerts to start receiving updates
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      item.status === "unread" ? "border-l-4 border-l-primary bg-primary/5" : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="mt-1">
                          {item.status !== "unread" ? (
                            <MailOpen className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Mail className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3
                                className={`font-medium mb-1 ${
                                  item.status === "unread" ? "font-semibold" : ""
                                }`}
                              >
                                {item.title}
                              </h3>
                              {item.tender && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {item.tender.title} - {item.tender.authority}
                                </p>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {item.summary && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {item.summary}
                            </p>
                          )}
                          
                          {item.actionText && item.actionRequired && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded-md mb-3 text-sm flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                              <span><strong>Action:</strong> {item.actionText}</span>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {getSourceBadge(item.source)}
                            {getTypeBadge(item.type)}
                            {getPriorityBadge(item.priority)}
                            {item.actionRequired && (
                              <Badge variant="default" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Action Required
                              </Badge>
                            )}
                            {item.actionDeadline && (
                              <Badge variant="outline" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Due: {new Date(item.actionDeadline).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="flex gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.status !== "unread" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsUnread(item.id)}
                              title="Mark as unread"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(item.id)}
                              title="Mark as read"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteItem(item.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}