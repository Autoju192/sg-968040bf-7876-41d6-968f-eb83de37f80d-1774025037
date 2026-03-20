import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { supabase } from "@/lib/supabase";
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

interface PortalConnection {
  id: string;
  connection_type: "public_feed" | "email_alert" | "portal_login" | "link_watcher";
  name: string;
  status: "active" | "inactive" | "error" | "pending";
  config: Record<string, any>;
  last_sync: string | null;
  last_error: string | null;
  created_at: string;
}

export default function IntegrationsPage() {
  const { organisation, user } = useAuth();
  const [connections, setConnections] = useState<PortalConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    connectionType: "" as PortalConnection["connection_type"],
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
    try {
      const { data, error } = await supabase
        .from("portal_connections")
        .select("*")
        .eq("organisation_id", organisation?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConnections((data as PortalConnection[]) || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const config: Record<string, any> = {};

      if (formData.connectionType === "public_feed") {
        config.keywords = formData.keywords;
        config.location = formData.location;
      } else if (formData.connectionType === "email_alert") {
        config.email = formData.email;
      } else if (formData.connectionType === "link_watcher") {
        config.url = formData.url;
      }

      const { error } = await supabase.from("portal_connections").insert({
        organisation_id: organisation?.id,
        connection_type: formData.connectionType,
        name: formData.name,
        status: "pending",
        config,
        created_by: user?.id,
      });

      if (error) throw error;

      setIsDialogOpen(false);
      setFormData({
        name: "",
        connectionType: "" as PortalConnection["connection_type"],
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

    const { error } = await supabase
      .from("portal_connections")
      .delete()
      .eq("id", id);

    if (!error) {
      setConnections((prev) => prev.filter((conn) => conn.id !== id));
    }
  };

  const syncConnection = async (id: string) => {
    alert("Sync functionality will be implemented in the backend");
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case "public_feed":
        return <Rss className="h-5 w-5" />;
      case "email_alert":
        return <Mail className="h-5 w-5" />;
      case "portal_login":
        return <Globe className="h-5 w-5" />;
      case "link_watcher":
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; icon: any; label: string }> = {
      active: { variant: "default", icon: CheckCircle2, label: "Active" },
      inactive: { variant: "secondary", icon: XCircle, label: "Inactive" },
      error: { variant: "destructive", icon: AlertCircle, label: "Error" },
      pending: { variant: "outline", icon: RefreshCw, label: "Pending" },
    };

    const { variant, icon: Icon, label } = config[status] || config.pending;

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const connectionTypes = [
    {
      value: "public_feed",
      label: "Public Feed",
      description: "Connect to Find a Tender, Contracts Finder",
      icon: Rss,
    },
    {
      value: "email_alert",
      label: "Email Alerts",
      description: "Parse tender alerts from your email",
      icon: Mail,
    },
    {
      value: "portal_login",
      label: "Portal Login",
      description: "Securely connect to procurement portals",
      icon: Globe,
    },
    {
      value: "link_watcher",
      label: "Link Watcher",
      description: "Monitor tender URLs for changes",
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
                            connectionType: type.value as PortalConnection["connection_type"],
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

                  {formData.connectionType === "public_feed" && (
                    <>
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Manchester, North West"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {formData.connectionType === "email_alert" && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
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
                        Forward tender alerts to this email. We'll parse them automatically.
                      </p>
                    </div>
                  )}

                  {formData.connectionType === "portal_login" && (
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">
                        Portal login connections require additional setup. Our team will
                        contact you to configure this securely.
                      </p>
                    </div>
                  )}

                  {formData.connectionType === "link_watcher" && (
                    <div className="space-y-2">
                      <Label htmlFor="url">Tender URL</Label>
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
                        We'll monitor this URL for updates and notify you of changes.
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
                          connectionType: "" as PortalConnection["connection_type"],
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
              <Card key={connection.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getConnectionIcon(connection.connection_type)}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => syncConnection(connection.id)}
                        title="Sync now"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteConnection(connection.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{connection.name}</CardTitle>
                  <CardDescription>
                    {connection.connection_type.replace("_", " ").toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(connection.status)}
                    </div>

                    {connection.last_sync && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Sync</span>
                        <span className="text-sm">
                          {new Date(connection.last_sync).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {connection.last_error && (
                      <div className="rounded-lg bg-destructive/10 p-3">
                        <p className="text-xs text-destructive">
                          {connection.last_error}
                        </p>
                      </div>
                    )}

                    {connection.config && Object.keys(connection.config).length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Configuration:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(connection.config).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
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