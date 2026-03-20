import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Calendar,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";
import { DashboardCharts } from "@/components/DashboardCharts";

interface HistoricalBid {
  id: string;
  tender_title: string;
  authority: string | null;
  submission_date: string | null;
  outcome: "won" | "lost" | "pending" | "withdrawn" | null;
  value: number | null;
  score: number | null;
  feedback: string | null;
  lessons_learned: string | null;
  created_at: string;
}

interface Analytics {
  totalBids: number;
  wonBids: number;
  lostBids: number;
  pendingBids: number;
  winRate: number;
  totalValue: number;
  wonValue: number;
  averageScore: number;
}

export default function ReportsPage() {
  const { organisation } = useAuth();
  const [historicalBids, setHistoricalBids] = useState<HistoricalBid[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalBids: 0,
    wonBids: 0,
    lostBids: 0,
    pendingBids: 0,
    winRate: 0,
    totalValue: 0,
    wonValue: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (organisation) {
      fetchHistoricalBids();
    }
  }, [organisation]);

  const fetchHistoricalBids = async () => {
    try {
      const { data, error } = await supabase
        .from("historical_bids")
        .select("*")
        .eq("organisation_id", organisation?.id)
        .order("submission_date", { ascending: false, nullsFirst: false });

      if (error) throw error;

      const bids = (data as HistoricalBid[]) || [];
      setHistoricalBids(bids);
      calculateAnalytics(bids);
    } catch (error) {
      console.error("Error fetching historical bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (bids: HistoricalBid[]) => {
    const totalBids = bids.length;
    const wonBids = bids.filter((b) => b.outcome === "won").length;
    const lostBids = bids.filter((b) => b.outcome === "lost").length;
    const pendingBids = bids.filter((b) => b.outcome === "pending").length;
    const winRate = totalBids > 0 ? (wonBids / (wonBids + lostBids)) * 100 : 0;

    const totalValue = bids.reduce((sum, b) => sum + (b.value || 0), 0);
    const wonValue = bids
      .filter((b) => b.outcome === "won")
      .reduce((sum, b) => sum + (b.value || 0), 0);

    const scoresArray = bids.filter((b) => b.score !== null).map((b) => b.score as number);
    const averageScore =
      scoresArray.length > 0
        ? scoresArray.reduce((sum, s) => sum + s, 0) / scoresArray.length
        : 0;

    setAnalytics({
      totalBids,
      wonBids,
      lostBids,
      pendingBids,
      winRate,
      totalValue,
      wonValue,
      averageScore,
    });
  };

  const getOutcomeBadge = (outcome: string | null) => {
    if (!outcome) return <Badge variant="outline">Unknown</Badge>;

    const config: Record<string, { variant: any; label: string }> = {
      won: { variant: "default", label: "Won" },
      lost: { variant: "destructive", label: "Lost" },
      pending: { variant: "secondary", label: "Pending" },
      withdrawn: { variant: "outline", label: "Withdrawn" },
    };

    const { variant, label } = config[outcome] || { variant: "outline", label: outcome };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Layout>
      <SEO
        title="Reports & Analytics - TenderFlow AI"
        description="Analyze bid performance and track win rates"
      />

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Track performance, analyze trends, and improve win rates
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Win Rate
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.winRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.wonBids} won of {analytics.wonBids + analytics.lostBids} decided
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bids
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalBids}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.pendingBids} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Value Won
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                £{(analytics.wonValue / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                of £{(analytics.totalValue / 1000).toFixed(0)}k total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Score
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.averageScore.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Bid History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Win rate and bid volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardCharts />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Outcomes</CardTitle>
                  <CardDescription>Latest bid results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historicalBids.slice(0, 5).map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bid.tender_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {bid.authority}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          {bid.value && (
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              £{(bid.value / 1000).toFixed(0)}k
                            </span>
                          )}
                          {getOutcomeBadge(bid.outcome)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bid History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historical Bids</CardTitle>
                <CardDescription>
                  Complete record of all submitted bids
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading historical bids...</p>
                  </div>
                ) : historicalBids.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">
                      No historical bids yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload past bids to track performance
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historicalBids.map((bid) => (
                      <div
                        key={bid.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{bid.tender_title}</h3>
                            {bid.authority && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {bid.authority}
                              </p>
                            )}
                          </div>
                          {getOutcomeBadge(bid.outcome)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          {bid.submission_date && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Submitted
                              </p>
                              <p className="text-sm font-medium">
                                {new Date(bid.submission_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {bid.value && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Value
                              </p>
                              <p className="text-sm font-medium">
                                £{(bid.value / 1000).toFixed(0)}k
                              </p>
                            </div>
                          )}
                          {bid.score && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Score
                              </p>
                              <p className="text-sm font-medium">{bid.score}%</p>
                            </div>
                          )}
                        </div>

                        {(bid.feedback || bid.lessons_learned) && (
                          <div className="mt-3 pt-3 border-t">
                            {bid.feedback && (
                              <div className="mb-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Feedback
                                </p>
                                <p className="text-sm">{bid.feedback}</p>
                              </div>
                            )}
                            {bid.lessons_learned && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Lessons Learned
                                </p>
                                <p className="text-sm">{bid.lessons_learned}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Success Factors</CardTitle>
                  <CardDescription>
                    What contributes to winning bids
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">High AI Match Score</span>
                        <span className="text-sm text-muted-foreground">85%+</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: "85%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Strong Evidence Library</span>
                        <span className="text-sm text-muted-foreground">78%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: "78%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Geography Match</span>
                        <span className="text-sm text-muted-foreground">72%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: "72%" }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>
                    AI-powered suggestions to improve win rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Focus on tenders with 80%+ AI match score
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your win rate is 12% higher on high-scoring opportunities
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Start earlier on complex bids
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bids with 4+ weeks preparation time have 18% higher success rate
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Expand evidence library for safeguarding
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This category shows the largest gap in your submissions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}