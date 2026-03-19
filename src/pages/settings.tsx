import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { 
  Mail, 
  Server, 
  Key, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  User,
  Building2,
  Bell
} from "lucide-react";

interface EmailSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
}

interface NotificationSettings {
  deadline_reminders: boolean;
  new_tender_alerts: boolean;
  status_updates: boolean;
  team_mentions: boolean;
  email_frequency: "instant" | "daily" | "weekly";
}

export default function SettingsPage() {
  const { user, profile, organisation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile settings
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Email settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: "",
    smtp_port: "587",
    smtp_username: "",
    smtp_password: "",
    from_email: "",
    from_name: organisation?.name || "TenderFlow AI",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    deadline_reminders: true,
    new_tender_alerts: true,
    status_updates: true,
    team_mentions: true,
    email_frequency: "instant",
  });

  const [testEmailLoading, setTestEmailLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!organisation?.id) return;

    try {
      // Load email settings
      const { data: emailData } = await supabase
        .from("email_settings")
        .select("*")
        .eq("organisation_id", organisation.id)
        .single();

      if (emailData) {
        setEmailSettings({
          smtp_host: emailData.smtp_host || "",
          smtp_port: emailData.smtp_port || "587",
          smtp_username: emailData.smtp_username || "",
          smtp_password: "", // Don't load password for security
          from_email: emailData.from_email || "",
          from_name: emailData.from_name || organisation.name,
        });
      }

      // Load notification settings
      const { data: notifData } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (notifData) {
        setNotificationSettings({
          deadline_reminders: notifData.deadline_reminders ?? true,
          new_tender_alerts: notifData.new_tender_alerts ?? true,
          status_updates: notifData.status_updates ?? true,
          team_mentions: notifData.team_mentions ?? true,
          email_frequency: (notifData.email_frequency as "instant" | "daily" | "weekly") || "instant",
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Check if settings exist
      const { data: existing } = await supabase
        .from("email_settings")
        .select("id")
        .eq("organisation_id", organisation?.id)
        .single();

      const settingsData = {
        organisation_id: organisation?.id,
        smtp_host: emailSettings.smtp_host,
        smtp_port: emailSettings.smtp_port,
        smtp_username: emailSettings.smtp_username,
        smtp_password: emailSettings.smtp_password || undefined, // Only update if provided
        from_email: emailSettings.from_email,
        from_name: emailSettings.from_name,
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from("email_settings")
          .update(settingsData)
          .eq("id", existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("email_settings")
          .insert([settingsData]);

        if (insertError) throw insertError;
      }

      setSuccess("Email settings saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save email settings");
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          settings: emailSettings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test email");
      }

      setSuccess("Test email sent successfully! Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send test email");
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data: existing } = await supabase
        .from("notification_settings")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      const settingsData = {
        user_id: user?.id,
        ...notificationSettings,
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from("notification_settings")
          .update(settingsData)
          .eq("id", existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("notification_settings")
          .insert([settingsData]);

        if (insertError) throw insertError;
      }

      setSuccess("Notification preferences saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notification settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, email configuration, and notification preferences
          </p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="organization">
              <Building2 className="h-4 w-4 mr-2" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={user?.role || ""}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>

                <Separator />

                <Button onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  View your organization information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input
                    value={organisation?.name || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Organization ID</Label>
                  <Input
                    value={organisation?.id || ""}
                    disabled
                    className="bg-muted font-mono text-sm"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Contact an administrator to update organization details
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails from your domain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp_host">
                      <Server className="inline h-4 w-4 mr-2" />
                      SMTP Host
                    </Label>
                    <Input
                      id="smtp_host"
                      placeholder="smtp.gmail.com"
                      value={emailSettings.smtp_host}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtp_host: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      placeholder="587"
                      value={emailSettings.smtp_port}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtp_port: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="smtp_username">
                      <User className="inline h-4 w-4 mr-2" />
                      SMTP Username
                    </Label>
                    <Input
                      id="smtp_username"
                      placeholder="your-email@domain.com"
                      value={emailSettings.smtp_username}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtp_username: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="smtp_password">
                      <Key className="inline h-4 w-4 mr-2" />
                      SMTP Password
                    </Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      placeholder="Enter password to update"
                      value={emailSettings.smtp_password}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtp_password: e.target.value })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-2">
                    <Label htmlFor="from_email">From Email Address</Label>
                    <Input
                      id="from_email"
                      type="email"
                      placeholder="noreply@yourdomain.com"
                      value={emailSettings.from_email}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, from_email: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="from_name">From Name</Label>
                    <Input
                      id="from_name"
                      placeholder="TenderFlow AI"
                      value={emailSettings.from_name}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, from_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveEmailSettings} disabled={loading}>
                    {loading ? "Saving..." : "Save Settings"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTestEmail}
                    disabled={testEmailLoading || !emailSettings.smtp_host}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {testEmailLoading ? "Sending..." : "Send Test Email"}
                  </Button>
                </div>

                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Popular SMTP Providers:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Gmail: smtp.gmail.com:587 (use App Password)</li>
                      <li>• Outlook: smtp.office365.com:587</li>
                      <li>• SendGrid: smtp.sendgrid.net:587</li>
                      <li>• Mailgun: smtp.mailgun.org:587</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Deadline Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when tender deadlines are approaching
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.deadline_reminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          deadline_reminders: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Tender Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when new tenders are added
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.new_tender_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          new_tender_alerts: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Status Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when tender status changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.status_updates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          status_updates: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Team Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone mentions you
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.team_mentions}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          team_mentions: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Email Frequency</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={notificationSettings.email_frequency}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          email_frequency: e.target.value as "instant" | "daily" | "weekly",
                        })
                      }
                    >
                      <option value="instant">Instant (as they happen)</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}