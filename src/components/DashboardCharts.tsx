import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const scoreData = [
  { name: "High Fit (80%+)", value: 8, color: "#22c55e" },
  { name: "Medium Fit (60-79%)", value: 12, color: "#eab308" },
  { name: "Low Fit (<60%)", value: 5, color: "#ef4444" },
];

const pipelineData = [
  { name: "Jan", won: 2, lost: 1, submitted: 4 },
  { name: "Feb", won: 3, lost: 2, submitted: 5 },
  { name: "Mar", won: 4, lost: 1, submitted: 7 },
  { name: "Apr", won: 2, lost: 3, submitted: 6 },
  { name: "May", won: 5, lost: 2, submitted: 8 },
  { name: "Jun", won: 4, lost: 1, submitted: 5 },
];

const serviceData = [
  { name: "Domiciliary", value: 45 },
  { name: "Supported Living", value: 30 },
  { name: "Mental Health", value: 15 },
  { name: "Childrens", value: 10 },
];

export function DashboardCharts() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last 30 Days</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Area Chart: Bid Pipeline Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bid Pipeline Trends</CardTitle>
            <CardDescription>Win/Loss ratio over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pipelineData}>
                  <defs>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="won" stroke="#22c55e" fillOpacity={1} fill="url(#colorWon)" name="Won Bids" />
                  <Area type="monotone" dataKey="lost" stroke="#ef4444" fillOpacity={1} fill="url(#colorLost)" name="Lost Bids" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart: AI Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>AI Score Distribution</CardTitle>
            <CardDescription>Current active tenders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Services Breakdown */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Service Type Breakdown</CardTitle>
            <CardDescription>Tender opportunities by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Number of Tenders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}