import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText, TrendingUp, Award, Target, Calendar } from "lucide-react";

interface ReportData {
  totalTenders: number;
  bidTenders: number;
  noBidTenders: number;
  submittedBids: number;
  wonBids: number;
  lostBids: number;
  winRate: number;
  avgScore: number;
}

export default function ReportsPage() {
  const { user, organisation } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    loadReportData();
  }, [user, router, dateRange]);

  const loadReportData = async () => {
    if (!organisation?.id) return;

    setLoading(true);

    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      // Get tenders
      const { data: tenders, error: tendersError } = await supabase
        .from("tenders")
        .select("*")
        .eq("organisation_id", organisation.id)
        .gte("created_at", daysAgo.toISOString());

      if (tendersError) throw tendersError;

      // Get historical bids
      const { data: bids, error: bidsError } = await supabase
        .from("historical_bids")
        .select("*")
        .eq("organisation_id", organisation.id);

      if (bidsError) throw bidsError;

      // Get tender scores
      const { data: scores, error: scoresError } = await supabase
        .from("tender_scores")
        .select("*");

      if (scoresError) throw scoresError;

      // Calculate metrics
      const totalTenders = tenders?.length || 0;
      const bidTenders = tenders?.filter((t) => t.status === "bid").length || 0;
      const noBidTenders = tenders?.filter((t) => t.status === "no_bid").length || 0;
      const submittedBids = tenders?.filter((t) => t.status === "submitted").length || 0;
      const wonBids = bids?.filter((b) => b.outcome === "won").length || 0;
      const lostBids = bids?.filter((b) => b.outcome === "lost").length || 0;
      const winRate = wonBids + lostBids > 0 ? (wonBids / (wonBids + lostBids)) * 100 : 0;
      const avgScore = scores && scores.length > 0
        ? scores.reduce((sum, s) => sum + (s.total_score || 0), 0) / scores.length
        : 0;

      setReportData({
        totalTenders,
        bidTenders,
        noBidTenders,
        submittedBids,
        wonBids,
        lostBids,
        winRate,
        avgScore,
      });
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;

    const csvContent = `TenderFlow AI - Performance Report
Date Range: Last ${dateRange} days
Generated: ${new Date().toLocaleDateString()}

SUMMARY METRICS
Total Tenders,${reportData.totalTenders}
Bid Decisions,${reportData.bidTenders}
No Bid Decisions,${reportData.noBidTenders}
Submitted Bids,${reportData.submittedBids}
Won Bids,${reportData.wonBids}
Lost Bids,${reportData.lostBids}
Win Rate,${reportData.winRate.toFixed(1)}%
Average AI Score,${reportData.avgScore.toFixed(1)}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tenderflow-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const decisionData = reportData
    ? [
        { name: "Bid", value: reportData.bidTenders, color: "#22c55e" },
        { name: "No Bid", value: reportData.noBidTenders, color: "#ef4444" },
        { name: "Review", value: reportData.totalTenders - reportData.bidTenders - reportData.noBidTenders, color: "#f59e0b" },
      ]
    : [];

  const outcomeData = reportData
    ? [
        { name: "Won", value: reportData.wonBids },
        { name: "Lost", value: reportData.lostBids },
      ]
    : [];

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Performance Reports</h1>
            <p className="text-muted-foreground">
              Track bid success rates, tender pipeline, and team performance
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading report data...</div>
        ) : !reportData ? (
          <div className="text-center py-12 text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                <TrendingUp className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="pipeline">
                <Target className="h-4 w-4 mr-2" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Award className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Tenders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{reportData.totalTenders}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Win Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {reportData.winRate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg AI Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {reportData.avgScore.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Submitted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{reportData.submittedBids}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bid Decisions</CardTitle>
                    <CardDescription>Distribution of bid/no-bid decisions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={decisionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {decisionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bid Outcomes</CardTitle>
                    <CardDescription>Won vs lost bids</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={outcomeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Pipeline Status</CardTitle>
                  <CardDescription>Current status of all tenders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">New Tenders</span>
                      <span className="text-2xl font-bold">{reportData.totalTenders - reportData.bidTenders - reportData.noBidTenders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Marked as Bid</span>
                      <span className="text-2xl font-bold text-green-600">{reportData.bidTenders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Marked as No Bid</span>
                      <span className="text-2xl font-bold text-red-600">{reportData.noBidTenders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Submitted</span>
                      <span className="text-2xl font-bold text-blue-600">{reportData.submittedBids}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Success Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Win Rate</span>
                        <span className="font-bold">{reportData.winRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${reportData.winRate}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Average AI Score</span>
                        <span className="font-bold">{reportData.avgScore.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${reportData.avgScore}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historical Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-700">Won Bids</span>
                        <span className="text-2xl font-bold text-green-700">{reportData.wonBids}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="font-medium text-red-700">Lost Bids</span>
                        <span className="text-2xl font-bold text-red-700">{reportData.lostBids}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}