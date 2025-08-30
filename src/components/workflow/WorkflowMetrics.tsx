import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
const stageMetrics = [{
  stage: "Ingestion",
  current: 12,
  capacity: 50,
  efficiency: 95,
  avgTime: 0.5
}, {
  stage: "AI Processing",
  current: 8,
  capacity: 30,
  efficiency: 88,
  avgTime: 2.1
}, {
  stage: "Human Review",
  current: 23,
  capacity: 25,
  efficiency: 65,
  avgTime: 28.8
}, {
  stage: "Decision",
  current: 3,
  capacity: 40,
  efficiency: 92,
  avgTime: 0.8
}];
const processingTrends = [{
  time: "00:00",
  ingestion: 5,
  aiProcessing: 3,
  humanReview: 8,
  decision: 2
}, {
  time: "04:00",
  ingestion: 8,
  aiProcessing: 6,
  humanReview: 12,
  decision: 4
}, {
  time: "08:00",
  ingestion: 15,
  aiProcessing: 12,
  humanReview: 18,
  decision: 8
}, {
  time: "12:00",
  ingestion: 12,
  aiProcessing: 8,
  humanReview: 23,
  decision: 3
}, {
  time: "16:00",
  ingestion: 18,
  aiProcessing: 15,
  humanReview: 20,
  decision: 6
}, {
  time: "20:00",
  ingestion: 10,
  aiProcessing: 7,
  humanReview: 15,
  decision: 4
}];
const bottleneckData = [{
  name: "Reviewer Availability",
  value: 40,
  color: "hsl(var(--red-accent))"
}, {
  name: "Complex Documents",
  value: 25,
  color: "hsl(var(--primary))"
}, {
  name: "System Load",
  value: 20,
  color: "hsl(var(--red-accent-light))"
}, {
  name: "Integration Delays",
  value: 15,
  color: "hsl(var(--primary))"
}];
export const WorkflowMetrics = () => {
  return <div className="space-y-6">
      {/* Stage Capacity Analysis */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Stage Capacity & Performance</CardTitle>
          <p className="text-sm text-black">Current load vs capacity for each workflow stage</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stageMetrics.map((metric, index) => <div key={index} className="p-4 rounded-lg bg-red-accent/10 hover:bg-red-accent/15 transition-colors duration-300 border border-red-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{metric.stage}</h3>
                  <Badge variant={metric.current > metric.capacity * 0.8 ? "destructive" : "default"}>
                    {metric.current}/{metric.capacity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-foreground">
                    <span>Capacity Usage</span>
                    <span>{Math.round(metric.current / metric.capacity * 100)}%</span>
                  </div>
                  <Progress value={metric.current / metric.capacity * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Efficiency: {metric.efficiency}%</span>
                    <span>Avg Time: {metric.avgTime}h</span>
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Processing Trends */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">24-Hour Processing Trends</CardTitle>
          <p className="text-sm text-black">Real-time activity across all workflow stages</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Line type="monotone" dataKey="ingestion" stroke="hsl(var(--red-accent))" strokeWidth={2} />
                <Line type="monotone" dataKey="aiProcessing" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="humanReview" stroke="hsl(var(--red-accent-light))" strokeWidth={2} />
                <Line type="monotone" dataKey="decision" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-accent rounded-full"></div>
              <span className="text-sm text-black">Ingestion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-black">AI Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-accent-light rounded-full"></div>
              <span className="text-sm text-black">Human Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-black">Decision</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Throughput Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Stage Throughput</CardTitle>
            <p className="text-sm text-black">Items processed per stage today</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Bar dataKey="current" fill="hsl(var(--red-accent))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Bottleneck Analysis</CardTitle>
            <p className="text-sm text-black">Primary causes of workflow delays</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bottleneckData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {bottleneckData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {bottleneckData.map((item, index) => <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: item.color
              }}></div>
                  <span className="text-xs text-black">{item.name} ({item.value}%)</span>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};