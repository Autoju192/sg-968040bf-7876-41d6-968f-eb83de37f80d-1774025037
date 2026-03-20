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
} from "lucide-react";

export default function IntegrationsPage() {
  const { organisation } = useAuth();
  const [connections, setConnections] = useState<PortalConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    connectionType: "" as PortalConnection["connectionType"],
    keywords: "",
    location: "",
    email: "",
    url: "",
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

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisation) return;

    try {
      const config: Record<string, any> = {};
      let sourceType = "";

      if (formData.connectionType === "PUBLIC_API") {
        config.keywords = formData.keywords;
        config.location = formData.location;
        sourceType = "find_a_tender"; // Defaulting to find a tender for now
      } else if (formData.connectionType === "EMAIL") {
        config.email = formData.email;
        sourceType = "gmail";
      } else if (formData.connectionType === "LINK_WATCHER") {
        config.url = formData.url;
        sourceType = "url";
      }

      const params: CreateConnectionParams = {
        organisationId: organisation.id,
        connectionName: formData.name,
        connectionType: formData.connectionType,
        sourceType,
        config,
      };

      await portalConnectionService.create(params);

      setIsDialogOpen(false);
      setFormData({
        name: "",
        connectionType: "" as PortalConnection["connectionType"],
        keywords: "",
        location: "",
        email: "",
        url: "",
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
      description: "Connect to Find a Tender, Contracts Finder",
      icon: Rss,
    },
    {
      value: "EMAIL",
      label: "Email Integration (Gmail)",
      description: "Parse tender alerts directly from your inbox",
      icon: Mail,
    },
    {
      value: "PORTAL_SESSION",
      label: "Portal Login",
      description: "Securely connect to procurement portals",
      icon: Globe,
    },
    {
      value: "LINK_WATCHER",
      label: "Link Watcher",
      description: "Monitor tender URLs for updates and changes",
      icon: LinkIcon,
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
              Connect to procurement portals and tender sources
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
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
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            connectionType: type.value as PortalConnection["connectionType"],
                          })
                        }
                      >
                        <CardContent className="p-6 text-center">
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
                        <Label htmlFor="keywords">Keywords (Comma separated)</Label>
                        <Input
                          id="keywords"
                          placeholder="e.g., adult social care, domiciliary care"
                          value={formData.keywords}
                          onChange={(e) =>
                            setFormData({ ...formData, keywords: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., London, North West"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {formData.connectionType === "EMAIL" && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 bg-muted/30">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Gmail Integration
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Securely connect your Gmail account to let TenderFlow AI automatically parse incoming tender alerts.
                        </p>
                        <Button type="button" variant="outline" className="w-full bg-white">
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
                          Sign in with Google
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground uppercase">OR USE FORWARDING</span>
                        <Separator className="flex-1" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Alert Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="alerts@yourcompany.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          Forward tender alerts to this address and we'll parse them.
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.connectionType === "PORTAL_SESSION" && (
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">
                        Portal login connections require additional setup. Our team will
                        contact you to configure this securely without storing plaintext credentials.
                      </p>
                    </div>
                  )}

                  {formData.connectionType === "LINK_WATCHER" && (
                    <div className="space-y-2">
                      <Label htmlFor="url">Tender URL to Monitor</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://portal.example.com/tender/12345"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        We'll periodically check this URL and notify you of any changes, new documents, or deadline extensions.
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
                          keywords: "",
                          location: "",
                          email: "",
                          url: "",
                        });
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit">Create Connection</Button>
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
                          {Object.entries(connection.config).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-[10px] font-normal">
                              {key}: {String(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}