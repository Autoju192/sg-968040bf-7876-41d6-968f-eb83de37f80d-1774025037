import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { portalConnectionService, type PortalConnection, type CreateConnectionParams } from "@/services/portalConnectionService";
import {
  Rss,
  Mail,
  Globe,
  Link as LinkIcon,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  History,
  Clock,
} from "lucide-react";

export default function IntegrationsPage() {
  const { organisation } = useAuth();
  const [connections, setConnections] = useState<PortalConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<PortalConnection | null>(null);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    connectionType: "" as PortalConnection["connectionType"],
    sourceType: "",
    keywords: "",
    location: "",
    email: "",
    url: "",
    baseUrl: "",
    apiKey: "",
    environmentName: "",
  });

  useEffect(() => {
    if (organisation) {
      fetchConnections();
    }
  }, [organisation]);

  const fetchConnections = async () => {
    if (!organisation) return;
    try {
      setLoading(true);
      const data = await portalConnectionService.getAll(organisation.id);
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailConnect = () => {
    if (!organisation) return;
    // Redirect to Gmail OAuth flow
    window.location.href = `/api/auth/gmail-oauth?organisationId=${organisation.id}`;
  };

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisation) return;

    try {
      const config: Record<string, any> = {};

      if (formData.connectionType === "PUBLIC_API") {
        config.keywords = formData.keywords;
        config.location = formData.location;
      } else if (formData.connectionType === "EMAIL") {
        config.email = formData.email;
      } else if (formData.connectionType === "LINK_WATCHER") {
        config.url = formData.url;
      } else if (formData.connectionType === "PORTAL_SESSION") {
        config.baseUrl = formData.baseUrl;
        config.apiKey = formData.apiKey;
        config.environmentName = formData.environmentName;
      }

      const params: CreateConnectionParams = {
        organisationId: organisation.id,
        connectionName: formData.name,
        connectionType: formData.connectionType,
        sourceType: formData.sourceType || (formData.connectionType === "PORTAL_SESSION" ? "proactis" : ""),
        config,
      };

      await portalConnectionService.create(params);

      setIsDialogOpen(false);
      setFormData({
        name: "",
        connectionType: "" as PortalConnection["connectionType"],
        sourceType: "",
        keywords: "",
        location: "",
        email: "",
        url: "",
        baseUrl: "",
        apiKey: "",
        environmentName: "",
      });
      fetchConnections();
    } catch (error) {
      console.error("Error creating connection:", error);
      alert("Failed to create connection");
    }
  };

  const deleteConnection = async (id: string) => {
    if (!confirm("Delete this connection?")) return;

    try {
      await portalConnectionService.delete(id);
      setConnections((prev) => prev.filter((conn) => conn.id !== id));
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  const syncConnection = async (id: string) => {
    setSyncingId(id);
    try {
      // Trigger the sync process via our service (simulating backend worker dispatch)
      await portalConnectionService.triggerSync(id);
      
      // Re-fetch connection status shortly after
      setTimeout(() => {
        fetchConnections();
        setSyncingId(null);
      }, 2500);
    } catch (error) {
      console.error("Error syncing connection:", error);
      setSyncingId(null);
    }
  };

  const viewSyncHistory = async (connection: PortalConnection) => {
    setSelectedConnection(connection);
    setHistoryDialogOpen(true);
    setLogsLoading(true);

    try {
      const { data, error } = await supabase
        .from("connection_logs")
        .select("*")
        .eq("connection_id", connection.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setSyncLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setSyncLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case "PUBLIC_API":
        return <Rss className="h-5 w-5" />;
      case "EMAIL":
        return <Mail className="h-5 w-5" />;
      case "PORTAL_SESSION":
        return <Globe className="h-5 w-5" />;
      case "LINK_WATCHER":
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; icon: any; label: string }> = {
      connected: { variant: "default", icon: CheckCircle2, label: "Connected" },
      inactive: { variant: "secondary", icon: XCircle, label: "Inactive" },
      error: { variant: "destructive", icon: AlertCircle, label: "Error" },
      pending: { variant: "outline", icon: RefreshCw, label: "Pending" },
      syncing: { variant: "outline", icon: RefreshCw, label: "Syncing..." },
    };

    const { variant, icon: Icon, label } = config[status] || config.pending;

    return (
      <Badge variant={variant} className={`gap-1 ${status === 'syncing' ? 'animate-pulse' : ''}`}>
        <Icon className={`h-3 w-3 ${status === 'syncing' ? 'animate-spin' : ''}`} />
        {label}
      </Badge>
    );
  };

  const connectionTypes = [
    {
      value: "PUBLIC_API",
      label: "Public API Feed",
      description: "Auto-fetch from Find a Tender & Contracts Finder",
      icon: Rss,
      recommended: true,
    },
    {
      value: "EMAIL",
      label: "Gmail Integration",
      description: "Parse tender alerts directly from your Gmail inbox",
      icon: Mail,
      recommended: true,
    },
    {
      value: "LINK_WATCHER",
      label: "Link Watcher",
      description: "Monitor tender URLs for updates and deadline changes",
      icon: LinkIcon,
    },
    {
      value: "PORTAL_SESSION",
      label: "Portal Connector (Proactis)",
      description: "Connect to Proactis and other procurement portals",
      icon: Globe,
      comingSoon: false,
    },
  ];

  return (
    <Layout>
      <SEO
        title="Portal Connections - TenderFlow AI"
        description="Connect to procurement portals and tender sources"
      />

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Portal Connections</h1>
            <p className="text-muted-foreground">
              Connect to procurement portals and tender sources for automatic ingestion
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Portal Connection</DialogTitle>
                <DialogDescription>
                  Connect a tender source to automatically receive updates
                </DialogDescription>
              </DialogHeader>

              {!formData.connectionType ? (
                <div className="grid grid-cols-2 gap-4 py-4">
                  {connectionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.value}
                        className={`cursor-pointer hover:bg-muted/50 transition-colors relative ${
                          type.comingSoon ? "opacity-60" : ""
                        }`}
                        onClick={() => {
                          if (!type.comingSoon) {
                            setFormData({
                              ...formData,
                              connectionType: type.value as PortalConnection["connectionType"],
                            });
                          }
                        }}
                      >
                        <CardContent className="p-6 text-center">
                          {type.recommended && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="default" className="text-xs">
                                Recommended
                              </Badge>
                            </div>
                          )}
                          <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                          <h3 className="font-semibold mb-1">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <form onSubmit={handleCreateConnection} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Connection Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Find a Tender - Adult Care"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  {formData.connectionType === "PUBLIC_API" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="sourceType">Source *</Label>
                        <select
                          id="sourceType"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={formData.sourceType}
                          onChange={(e) =>
                            setFormData({ ...formData, sourceType: e.target.value })
                          }
                          required
                        >
                          <option value="">Select source...</option>
                          <option value="find_a_tender">Find a Tender (UK)</option>
                          <option value="contracts_finder">Contracts Finder (UK)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                          id="keywords"
                          placeholder="e.g., adult social care, domiciliary care"
                          value={formData.keywords}
                          onChange={(e) =>
                            setFormData({ ...formData, keywords: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Comma-separated keywords to filter tenders
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., London, North West, Manchester"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Geographic region or postcode
                        </p>
                      </div>
                    </>
                  )}

                  {formData.connectionType === "EMAIL" && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" /> Gmail OAuth Integration
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Securely connect your Gmail account to automatically parse incoming tender alerts. We use OAuth 2.0 - no passwords stored.
                        </p>
                        <Button
                          type="button"
                          onClick={handleGmailConnect}
                          className="w-full bg-white hover:bg-gray-50 text-gray-800 border"
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Connect with Google
                        </Button>
                      </div>
                    </div>
                  )}

                  {formData.connectionType === "PORTAL_SESSION" && (
                    <>
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 mb-4">
                        <p className="text-sm">
                          <strong>Proactis Portal Connector</strong><br/>
                          Connect to Proactis procurement portals using your portal credentials. We encrypt all credentials and never store passwords in plaintext.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="baseUrl">Portal URL *</Label>
                        <Input
                          id="baseUrl"
                          type="url"
                          placeholder="https://portal.proactis.com"
                          value={formData.baseUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, baseUrl: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key / Token</Label>
                        <Input
                          id="apiKey"
                          type="password"
                          placeholder="Your API key or authentication token"
                          value={formData.apiKey}
                          onChange={(e) =>
                            setFormData({ ...formData, apiKey: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Will be encrypted before storage
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="environmentName">Environment Name</Label>
                        <Input
                          id="environmentName"
                          placeholder="e.g., production, demo"
                          value={formData.environmentName}
                          onChange={(e) =>
                            setFormData({ ...formData, environmentName: e.target.value })
                          }
                        />
                      </div>
                      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 text-sm">
                        <p className="text-amber-800 dark:text-amber-200">
                          ⚠️ If you don't have API access, you can use Link Watcher as a fallback to monitor specific tender URLs.
                        </p>
                      </div>
                    </>
                  )}

                  {formData.connectionType === "LINK_WATCHER" && (
                    <div className="space-y-2">
                      <Label htmlFor="url">Tender URL to Monitor *</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://portal.example.com/tender/12345"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        We'll check this URL every few hours and notify you of changes, new documents, or deadline extensions.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          name: "",
                          connectionType: "" as PortalConnection["connectionType"],
                          sourceType: "",
                          keywords: "",
                          location: "",
                          email: "",
                          url: "",
                          baseUrl: "",
                          apiKey: "",
                          environmentName: "",
                        });
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit">
                      {formData.connectionType === "EMAIL" ? "Continue to Gmail" : "Create Connection"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Connections List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading connections...</p>
          </div>
        ) : connections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground font-medium mb-2">
                No portal connections yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Connect tender sources to automatically receive updates in your inbox
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Connection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <Card key={connection.id} className={connection.status === 'error' ? 'border-destructive/50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getConnectionIcon(connection.connectionType)}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => syncConnection(connection.id)}
                        disabled={syncingId === connection.id}
                        title="Sync now"
                      >
                        <RefreshCw className={`h-4 w-4 ${syncingId === connection.id ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => deleteConnection(connection.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{connection.connectionName}</CardTitle>
                  <CardDescription>
                    {connection.connectionType.replace("_", " ")}
                    {connection.sourceType && ` • ${connection.sourceType.replace(/_/g, ' ')}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(connection.status)}
                    </div>

                    {connection.lastSyncAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Sync</span>
                        <span className="text-sm">
                          {new Date(connection.lastSyncAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {connection.syncFrequency && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Frequency</span>
                        <span className="text-sm">Every {connection.syncFrequency}h</span>
                      </div>
                    )}

                    {connection.errorMessage && (
                      <div className="rounded-lg bg-destructive/10 p-3 mt-2 border border-destructive/20">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <p className="text-xs text-destructive">
                            {connection.errorMessage}
                          </p>
                        </div>
                        {connection.errorCount > 0 && (
                          <p className="text-xs text-destructive/70 mt-1 ml-6">
                            Failed {connection.errorCount} time(s)
                          </p>
                        )}
                      </div>
                    )}

                    {connection.config && Object.keys(connection.config).length > 0 && (
                      <div className="pt-3 border-t mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Configuration:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(connection.config).map(([key, value]) => {
                            if (key === "email" || key === "keywords" || key === "location" || key === "url") {
                              return (
                                <Badge key={key} variant="secondary" className="text-[10px] font-normal">
                                  {key}: {String(value)}
                                </Badge>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => viewSyncHistory(connection)}
                      >
                        <History className="mr-2 h-4 w-4" />
                        View Sync History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Sync History Dialog */}
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sync History</DialogTitle>
              <DialogDescription>
                {selectedConnection?.connectionName || "Connection"} sync logs
              </DialogDescription>
            </DialogHeader>

            {logsLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading sync history...</p>
              </div>
            ) : syncLogs.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No sync history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {syncLogs.map((log) => (
                  <Card key={log.id} className={log.run_status === "failed" ? "border-destructive/50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {log.run_status === "success" && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {log.run_status === "failed" && (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          {log.run_status === "partial_success" && (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          )}
                          <span className="font-medium capitalize">
                            {log.run_status.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Fetched:</span>{" "}
                          <span className="font-medium">{log.items_fetched || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>{" "}
                          <span className="font-medium">{log.items_created || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Updated:</span>{" "}
                          <span className="font-medium">{log.items_updated || 0}</span>
                        </div>
                      </div>

                      {log.duration_ms && (
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">Duration:</span>{" "}
                          <span className="font-medium">{(log.duration_ms / 1000).toFixed(2)}s</span>
                        </div>
                      )}

                      {log.error_message && (
                        <div className="mt-2 p-2 rounded bg-destructive/10 text-sm text-destructive">
                          {log.error_message}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}