import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import { useState } from "react";
const historicalData = [{
  period: "Jan",
  throughput: 145,
  avgTime: 2.3,
  efficiency: 78,
  bottlenecks: 3
}, {
  period: "Feb",
  throughput: 162,
  avgTime: 2.1,
  efficiency: 82,
  bottlenecks: 2
}, {
  period: "Mar",
  throughput: 178,
  avgTime: 1.9,
  efficiency: 85,
  bottlenecks: 2
}, {
  period: "Apr",
  throughput: 203,
  avgTime: 1.7,
  efficiency: 88,
  bottlenecks: 1
}, {
  period: "May",
  throughput: 189,
  avgTime: 1.8,
  efficiency: 87,
  bottlenecks: 2
}, {
  period: "Jun",
  throughput: 234,
  avgTime: 1.5,
  efficiency: 91,
  bottlenecks: 1
}];
const weeklyTrends = [{
  week: "Week 1",
  mon: 32,
  tue: 28,
  wed: 35,
  thu: 31,
  fri: 29
}, {
  week: "Week 2",
  mon: 35,
  tue: 31,
  wed: 38,
  thu: 34,
  fri: 32
}, {
  week: "Week 3",
  mon: 29,
  tue: 33,
  wed: 31,
  thu: 37,
  fri: 35
}, {
  week: "Week 4",
  mon: 38,
  tue: 35,
  wed: 42,
  thu: 39,
  fri: 36
}];
const performanceMetrics = [{
  metric: "Overall Throughput",
  current: 234,
  previous: 189,
  trend: "up",
  change: "+23.8%",
  icon: Activity,
  color: "text-black",
  bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
  iconBg: "bg-red-accent"
}, {
  metric: "Average Processing Time",
  current: "1.5h",
  previous: "1.8h",
  trend: "up",
  change: "-16.7%",
  icon: Clock,
  color: "text-red-accent",
  bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
  iconBg: "bg-black"
}, {
  metric: "Workflow Efficiency",
  current: "91%",
  previous: "87%",
  trend: "up",
  change: "+4.6%",
  icon: TrendingUp,
  color: "text-black",
  bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
  iconBg: "bg-red-accent"
}, {
  metric: "Active Bottlenecks",
  current: 1,
  previous: 2,
  trend: "up",
  change: "-50%",
  icon: TrendingDown,
  color: "text-red-accent",
  bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
  iconBg: "bg-black"
}];
export const WorkflowHistory = () => {
  const [timeRange, setTimeRange] = useState("6-months");
  const [viewType, setViewType] = useState("trends");
  return <div className="space-y-6">
      {/* History Controls */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Historical Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-days">Last 30 Days</SelectItem>
                <SelectItem value="3-months">Last 3 Months</SelectItem>
                <SelectItem value="6-months">Last 6 Months</SelectItem>
                <SelectItem value="1-year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select view type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trends">Performance Trends</SelectItem>
                <SelectItem value="comparison">Period Comparison</SelectItem>
                <SelectItem value="forecasting">Forecasting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px]">
        {performanceMetrics.map((metric, index) => <Card key={index} className="group relative overflow-hidden rounded-[15px] border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-black tracking-tight leading-none">
                  {metric.metric}
                </CardTitle>
                <div className="text-2xl font-bold text-black tracking-tight">
                  {typeof metric.current === 'number' ? metric.current : metric.current}
                </div>
              </div>
              <div className={`${metric.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-black font-medium">
                {metric.change}
              </p>
            </CardContent>
            
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${metric.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>)}
      </div>

      {/* Historical Trends */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Historical Performance Trends</CardTitle>
          <p className="text-sm text-black">6-month workflow performance analysis</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="throughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--red-accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--red-accent))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="efficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Area type="monotone" dataKey="throughput" stroke="hsl(var(--red-accent))" fillOpacity={1} fill="url(#throughput)" />
                <Area type="monotone" dataKey="efficiency" stroke="#000000" fillOpacity={1} fill="url(#efficiency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-accent rounded-full"></div>
              <span className="text-sm text-black">Throughput</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <span className="text-sm text-black">Efficiency %</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Weekly Processing Patterns</CardTitle>
            <p className="text-sm text-black">Daily throughput across recent weeks</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Bar dataKey="mon" fill="hsl(var(--red-accent))" />
                  <Bar dataKey="tue" fill="hsl(var(--primary))" />
                  <Bar dataKey="wed" fill="hsl(var(--red-accent-light))" />
                  <Bar dataKey="thu" fill="hsl(var(--primary))" />
                  <Bar dataKey="fri" fill="hsl(var(--red-accent))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Processing Time Trends</CardTitle>
            <p className="text-sm text-black">Average time per stage over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Line type="monotone" dataKey="avgTime" stroke="#000000" strokeWidth={3} dot={{
                  fill: '#000000',
                  strokeWidth: 2,
                  r: 4
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">AI-Generated Insights</CardTitle>
          <p className="text-sm text-black">Based on historical workflow analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-accent-light rounded-lg border-l-4 border-red-accent bg-slate-50">
              <h4 className="font-medium text-black">Performance Improvement</h4>
              <p className="text-sm text-black mt-1">
                Workflow efficiency has improved by 16% over the last 6 months, primarily due to 
                optimized AI processing and reduced human review bottlenecks.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-black">
              <h4 className="font-medium text-black">Capacity Planning</h4>
              <p className="text-sm text-black mt-1">
                Consider adding 2 additional reviewers during peak hours (8 AM - 4 PM) to 
                eliminate the human review bottleneck completely.
              </p>
            </div>
            
            <div className="p-4 bg-red-accent-light rounded-lg border-l-4 border-red-accent bg-slate-50">
              <h4 className="font-medium text-black">Trend Forecast</h4>
              <p className="text-sm text-black mt-1">
                Based on current trends, expect to process 280+ RFPs next month. 
                System capacity should be increased by 15% to handle this load.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};