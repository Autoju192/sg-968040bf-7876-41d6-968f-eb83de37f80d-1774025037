import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Award, XCircle } from "lucide-react";

interface Tender {
  id: string;
  ai_score: number;
  status: string;
  decision: string | null;
  created_at: string;
  value: number;
}

interface DashboardChartsProps {
  tenders: Tender[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function DashboardCharts({ tenders, dateRange, onDateRangeChange }: DashboardChartsProps) {
  // Score Distribution
  const scoreRanges = {
    high: tenders.filter(t => t.ai_score >= 80).length,
    medium: tenders.filter(t => t.ai_score >= 60 && t.ai_score < 80).length,
    low: tenders.filter(t => t.ai_score < 60).length,
  };

  const totalScored = scoreRanges.high + scoreRanges.medium + scoreRanges.low;

  // Pipeline Funnel
  const pipelineData = {
    new: tenders.filter(t => t.status === "new").length,
    review: tenders.filter(t => t.status === "review").length,
    bid: tenders.filter(t => t.decision === "bid").length,
    submitted: tenders.filter(t => t.status === "submitted").length,
  };

  // Monthly Trends (last 6 months)
  const now = new Date();
  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = month.getTime();
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).getTime();
    
    const monthTenders = tenders.filter(t => {
      const createdAt = new Date(t.created_at).getTime();
      return createdAt >= monthStart && createdAt <= monthEnd;
    });

    return {
      month: month.toLocaleDateString("en-GB", { month: "short" }),
      count: monthTenders.length,
      value: monthTenders.reduce((sum, t) => sum + (t.value || 0), 0),
    };
  }).reverse();

  // Win Rate
  const submittedTenders = tenders.filter(t => t.status === "submitted" || t.status === "awarded" || t.status === "lost");
  const wonTenders = tenders.filter(t => t.status === "awarded");
  const lostTenders = tenders.filter(t => t.status === "lost");
  const winRate = submittedTenders.length > 0 ? Math.round((wonTenders.length / submittedTenders.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analytics & Insights</h3>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-base">AI Score Distribution</CardTitle>
            <CardDescription>Tender quality breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* High Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">High (80%+)</span>
                  </div>
                  <span className="text-sm font-bold">{scoreRanges.high}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${totalScored > 0 ? (scoreRanges.high / totalScored) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Medium Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Medium (60-79%)</span>
                  </div>
                  <span className="text-sm font-bold">{scoreRanges.medium}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${totalScored > 0 ? (scoreRanges.medium / totalScored) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Low Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Low (&lt;60%)</span>
                  </div>
                  <span className="text-sm font-bold">{scoreRanges.low}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${totalScored > 0 ? (scoreRanges.low / totalScored) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Funnel */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-base">Bid Pipeline</CardTitle>
            <CardDescription>Tender progression funnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* New */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">New Tenders</span>
                  <Badge variant="secondary">{pipelineData.new}</Badge>
                </div>
                <div className="h-8 bg-primary/10 rounded-lg flex items-center px-3">
                  <div className="text-xs font-medium text-primary">100%</div>
                </div>
              </div>

              {/* Review */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Under Review</span>
                  <Badge variant="secondary">{pipelineData.review}</Badge>
                </div>
                <div
                  className="h-8 bg-primary/20 rounded-lg flex items-center px-3"
                  style={{ width: `${pipelineData.new > 0 ? (pipelineData.review / pipelineData.new) * 100 : 0}%` }}
                >
                  <div className="text-xs font-medium text-primary">
                    {pipelineData.new > 0 ? Math.round((pipelineData.review / pipelineData.new) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Bid Decision */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Bid Decision</span>
                  <Badge variant="secondary">{pipelineData.bid}</Badge>
                </div>
                <div
                  className="h-8 bg-primary/40 rounded-lg flex items-center px-3"
                  style={{ width: `${pipelineData.new > 0 ? (pipelineData.bid / pipelineData.new) * 100 : 0}%` }}
                >
                  <div className="text-xs font-medium text-primary">
                    {pipelineData.new > 0 ? Math.round((pipelineData.bid / pipelineData.new) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Submitted */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Submitted</span>
                  <Badge variant="secondary">{pipelineData.submitted}</Badge>
                </div>
                <div
                  className="h-8 bg-primary rounded-lg flex items-center px-3"
                  style={{ width: `${pipelineData.new > 0 ? (pipelineData.submitted / pipelineData.new) * 100 : 0}%` }}
                >
                  <div className="text-xs font-medium text-primary-foreground">
                    {pipelineData.new > 0 ? Math.round((pipelineData.submitted / pipelineData.new) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-base">Monthly Tender Trends</CardTitle>
            <CardDescription>Tender volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyTrends.map((month, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(month.value)}
                      </span>
                      <Badge variant="secondary">{month.count}</Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ 
                        width: `${Math.max(...monthlyTrends.map(m => m.count)) > 0 
                          ? (month.count / Math.max(...monthlyTrends.map(m => m.count))) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-base">Win Rate Analysis</CardTitle>
            <CardDescription>Success rate of submitted bids</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Win Rate */}
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{winRate}%</div>
                <p className="text-sm text-muted-foreground">Overall Win Rate</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {winRate >= 50 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${winRate >= 50 ? "text-green-600" : "text-red-600"}`}>
                    {winRate >= 50 ? "Above average" : "Needs improvement"}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Won</span>
                  </div>
                  <div className="text-2xl font-bold">{wonTenders.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {submittedTenders.length > 0 
                      ? Math.round((wonTenders.length / submittedTenders.length) * 100) 
                      : 0}% of submitted
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Lost</span>
                  </div>
                  <div className="text-2xl font-bold">{lostTenders.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {submittedTenders.length > 0 
                      ? Math.round((lostTenders.length / submittedTenders.length) * 100) 
                      : 0}% of submitted
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}