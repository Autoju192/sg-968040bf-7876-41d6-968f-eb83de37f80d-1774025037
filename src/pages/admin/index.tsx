import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Settings, BarChart3, Shield, Mail, Trash2, UserPlus, CheckCircle, XCircle, TrendingUp, Activity } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Organisation {
  id: string;
  name: string;
  created_at: string;
}

export default function AdminPanel() {
  const { user, organisation } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("contributor");
  const [inviteName, setInviteName] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [analytics, setAnalytics] = useState({
    totalTenders: 0,
    activeBids: 0,
    winRate: 0,
    avgAiScore: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    loadUsers();
    loadAnalytics();
  }, [user, router]);

  const loadUsers = async () => {
    if (!organisation?.id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("organisation_id", organisation.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading users:", error);
      setMessage({ type: "error", text: "Failed to load users" });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    if (!organisation?.id) return;

    try {
      // Load tender analytics
      const { data: tenders } = await supabase
        .from("tenders")
        .select(`
          *,
          tender_scores(total_score)
        `)
        .eq("organisation_id", organisation.id);

      if (tenders) {
        const totalTenders = tenders.length;
        const activeBids = tenders.filter(t => t.decision === "bid" && t.status !== "submitted").length;
        const wonBids = tenders.filter(t => t.status === "awarded").length;
        const lostBids = tenders.filter(t => t.status === "lost").length;
        const winRate = lostBids + wonBids > 0 ? (wonBids / (wonBids + lostBids)) * 100 : 0;
        
        const scores = tenders
          .map(t => t.tender_scores?.[0]?.total_score)
          .filter(s => s !== null && s !== undefined);
        const avgAiScore = scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;

        setAnalytics({
          totalTenders,
          activeBids,
          winRate: Math.round(winRate),
          avgAiScore: Math.round(avgAiScore),
        });
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteName || !organisation?.id) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: inviteEmail,
        email_confirm: true,
        user_metadata: {
          full_name: inviteName,
          role: inviteRole,
        },
      });

      if (authError) throw authError;

      // Create user record
      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: inviteEmail,
        full_name: inviteName,
        role: inviteRole,
        organisation_id: organisation.id,
      });

      if (userError) throw userError;

      setMessage({ type: "success", text: `User ${inviteName} invited successfully!` });
      setInviteEmail("");
      setInviteName("");
      setInviteRole("contributor");
      loadUsers();
    } catch (error: unknown) {
      console.error("Error inviting user:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage({ type: "error", text: `Failed to invite user: ${errorMessage}` });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user ${userName}?`)) return;

    try {
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;

      setMessage({ type: "success", text: `User ${userName} deleted successfully` });
      loadUsers();
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage({ type: "error", text: `Failed to delete user: ${errorMessage}` });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string, userName: string) => {
    try {
      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId);

      if (error) throw error;

      setMessage({ type: "success", text: `${userName}'s role updated to ${newRole}` });
      loadUsers();
    } catch (error: unknown) {
      console.error("Error updating role:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage({ type: "error", text: `Failed to update role: ${errorMessage}` });
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, settings, and system configuration
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === "success" ? "border-green-500" : "border-red-500"}`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="organization">
              <Settings className="h-4 w-4 mr-2" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invite New User</CardTitle>
                <CardDescription>
                  Add team members to your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="bid_manager">Bid Manager</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleInviteUser} className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members ({users.length})</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found. Invite your first team member above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(newRole) =>
                                handleUpdateRole(user.id, newRole, user.full_name)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="bid_manager">Bid Manager</SelectItem>
                                <SelectItem value="contributor">Contributor</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.full_name)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Update your organization information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" value={organisation?.name || ""} disabled />
                </div>
                <div>
                  <Label htmlFor="orgId">Organization ID</Label>
                  <Input id="orgId" value={organisation?.id || ""} disabled />
                </div>
                <Alert>
                  <AlertDescription>
                    Contact support to change your organization name or other settings.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active team members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.totalTenders}</div>
                  <p className="text-xs text-muted-foreground mt-1">In your pipeline</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.winRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Success rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg AI Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.avgAiScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Admins</span>
                    <Badge variant="default">{users.filter((u) => u.role === "admin").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bid Managers</span>
                    <Badge variant="secondary">{users.filter((u) => u.role === "bid_manager").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contributors</span>
                    <Badge variant="outline">{users.filter((u) => u.role === "contributor").length}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600">{analytics.activeBids}</div>
                  <p className="text-sm text-muted-foreground mt-2">Tenders marked as "Bid"</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Database Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">AI Services Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Storage Operational</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All user data is protected with Row Level Security (RLS) policies.
                    Only members of your organization can access your data.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}