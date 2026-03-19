import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileSearch,
  FileCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

const kpis = [
  {
    name: "Total Tenders",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: FileSearch,
  },
  {
    name: "Active Bids",
    value: "23",
    change: "+5",
    trend: "up",
    icon: FileCheck,
  },
  {
    name: "Submitted Bids",
    value: "18",
    change: "3 pending",
    trend: "neutral",
    icon: CheckCircle2,
  },
  {
    name: "Deadlines This Week",
    value: "7",
    change: "2 urgent",
    trend: "warning",
    icon: Clock,
  },
];

const recentActivity = [
  {
    id: 1,
    title: "New tender matched: Residential Care - Manchester",
    type: "match",
    time: "2 hours ago",
    score: 92,
  },
  {
    id: 2,
    title: "Bid submitted: Domiciliary Care - Birmingham",
    type: "submitted",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Deadline reminder: Supported Living - Leeds",
    type: "deadline",
    time: "1 day ago",
  },
  {
    id: 4,
    title: "Document generated: Method Statement - Quality Care",
    type: "document",
    time: "2 days ago",
  },
];

const highFitTenders = [
  {
    id: 1,
    title: "Residential Care Services - Greater Manchester",
    authority: "Manchester City Council",
    deadline: "2026-04-15",
    value: "£2.4M",
    score: 94,
    status: "Review",
  },
  {
    id: 2,
    title: "Domiciliary Care Framework - West Midlands",
    authority: "Birmingham Council",
    deadline: "2026-04-22",
    value: "£1.8M",
    score: 89,
    status: "Bid",
  },
  {
    id: 3,
    title: "Supported Living - Yorkshire Region",
    authority: "Leeds City Council",
    deadline: "2026-04-10",
    value: "£3.2M",
    score: 87,
    status: "Bid",
  },
];

export default function Dashboard() {
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
            Welcome back! Here's what's happening with your tenders.
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
                {highFitTenders.map((tender) => (
                  <div
                    key={tender.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{tender.title}</h4>
                      <Badge
                        variant={tender.status === "Bid" ? "default" : "secondary"}
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
                            style={{ width: `${tender.score}%` }}
                          />
                        </div>
                        <span className="font-medium text-primary">{tender.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {recentActivity.map((activity) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}