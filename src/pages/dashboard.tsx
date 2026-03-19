import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardCharts } from "@/components/DashboardCharts";
import {
  FileSearch,
  FileCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getTenders } from "@/services/tenderService";
import type { Tender } from "@/services/tenderService";

export default function Dashboard() {
  const { organisation, loading: authLoading } = useAuth();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    if (organisation && !authLoading) {
      loadTenders();
    }
  }, [organisation, authLoading]);

  async function loadTenders() {
    if (!organisation) return;
    
    try {
      const data = await getTenders(organisation.id);
      setTenders(data);
    } catch (error) {
      console.error("Error loading tenders:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalTenders = tenders.length;
  const activeBids = tenders.filter(t => t.decision === "bid" && t.status !== "submitted").length;
  const submitted = tenders.filter(t => t.status === "submitted").length;
  const approaching = tenders.filter(t => {
    const deadline = new Date(t.deadline);
    const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  }).length;

  const highFitTenders = tenders
    .filter(t => t.ai_score && t.ai_score >= 75)
    .slice(0, 5);

  const recentActivity = tenders
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      title: t.title,
      type: t.status === "submitted" ? "submitted" : t.status === "new" ? "match" : "document",
      action: t.status === "new" ? "New tender added" : `Status: ${t.status}`,
      time: new Date(t.created_at || "").toLocaleDateString(),
      score: t.ai_score
    }));

  const kpis = [
    {
      name: "Total Tenders",
      value: String(totalTenders),
      change: "",
      trend: "",
      icon: FileSearch,
    },
    {
      name: "Active Bids",
      value: String(activeBids),
      change: "",
      trend: "",
      icon: FileCheck,
    },
    {
      name: "Submitted Bids",
      value: String(submitted),
      change: "",
      trend: "",
      icon: CheckCircle2,
    },
    {
      name: "Deadlines This Week",
      value: String(approaching),
      change: "",
      trend: "",
      icon: Clock,
    },
  ];

  return (
    <Layout>
      <SEO
        title="Dashboard - TenderFlow AI"
        description="Manage your tenders and bids with AI-powered insights"
      />
      
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your tenders.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <Card key={kpi.name} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    kpi.trend === "warning" ? "bg-destructive/10" : "bg-primary/10"
                  }`}>
                    <kpi.icon className={`w-6 h-6 ${
                      kpi.trend === "warning" ? "text-destructive" : "text-primary"
                    }`} />
                  </div>
                  <span className={`text-xs font-medium ${
                    kpi.trend === "up" ? "text-green-600" :
                    kpi.trend === "warning" ? "text-destructive" :
                    "text-muted-foreground"
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-3xl font-heading font-bold mb-1">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <DashboardCharts 
            tenders={tenders} 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* High-Fit Tenders */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  High-Fit Tenders
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highFitTenders.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No high-fit tenders yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add tenders to see AI scoring
                    </p>
                  </div>
                ) : (
                  highFitTenders.map((tender) => (
                    <div
                      key={tender.id}
                      className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{tender.title}</h4>
                        <Badge
                          variant={tender.status === "bid" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {tender.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {tender.authority}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            Deadline: {new Date(tender.deadline).toLocaleDateString()}
                          </span>
                          <span className="font-medium">{tender.value}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${tender.ai_score}%` }}
                            />
                          </div>
                          <span className="font-medium text-primary">{tender.ai_score}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No activity yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start by adding your first tender
                    </p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "match" ? "bg-primary/10" :
                        activity.type === "submitted" ? "bg-green-500/10" :
                        activity.type === "deadline" ? "bg-destructive/10" :
                        "bg-muted"
                      }`}>
                        {activity.type === "match" && <TrendingUp className="w-4 h-4 text-primary" />}
                        {activity.type === "submitted" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {activity.type === "deadline" && <AlertCircle className="w-4 h-4 text-destructive" />}
                        {activity.type === "document" && <FileCheck className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.score && (
                        <Badge variant="secondary" className="self-start">
                          {activity.score}% fit
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}