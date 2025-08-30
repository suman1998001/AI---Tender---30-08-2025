import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Filter, AlertTriangle, CheckCircle, Clock, User, FileText, Star, Activity } from "lucide-react";

const categoryScoreData = [{
  category: "IT Services",
  avgScore: 78,
  count: 45,
  threshold: 75,
  color: "#000000"
}, {
  category: "Construction",
  avgScore: 82,
  count: 38,
  threshold: 75,
  color: "hsl(var(--red-accent))"
}, {
  category: "Consulting",
  avgScore: 75,
  count: 52,
  threshold: 75,
  color: "#000000"
}, {
  category: "Equipment",
  avgScore: 80,
  count: 29,
  threshold: 75,
  color: "hsl(var(--red-accent))"
}, {
  category: "Maintenance",
  avgScore: 77,
  count: 33,
  threshold: 75,
  color: "#000000"
}];

const potentialIssuesData = [{
  type: "Missing Documents",
  count: 23,
  severity: "high",
  color: "hsl(var(--red-accent))"
}, {
  type: "Compliance Issues",
  count: 15,
  severity: "medium",
  color: "#000000"
}, {
  type: "Technical Gaps",
  count: 18,
  severity: "medium",
  color: "hsl(var(--red-accent))"
}, {
  type: "Financial Discrepancies",
  count: 8,
  severity: "low",
  color: "#000000"
}];

const humanInLoopFlags = [{
  id: "RFP-2024-001",
  applicant: "TechCorp Solutions",
  score: 74.5,
  threshold: 75,
  reason: "Borderline compliance score",
  flagged: "2024-01-15 14:23"
}, {
  id: "RFP-2024-003",
  applicant: "BuildRight Inc",
  score: 76.2,
  threshold: 75,
  reason: "Missing technical documentation",
  flagged: "2024-01-15 13:45"
}, {
  id: "RFP-2024-005",
  applicant: "ConsultPro LLC",
  score: 74.8,
  threshold: 75,
  reason: "Ambiguous financial data",
  flagged: "2024-01-15 12:30"
}];

const workflowSteps = [{
  step: "Download",
  timestamp: "2024-01-15 09:00:00",
  model: "Document Processor v2.1",
  status: "completed",
  duration: "0.5h",
  count: 156
}, {
  step: "Scan",
  timestamp: "2024-01-15 09:30:00",
  model: "OCR Engine v3.2",
  status: "completed",
  duration: "1.2h",
  count: 142
}, {
  step: "Pre-Extract",
  timestamp: "2024-01-15 10:45:00",
  model: "NLP Extractor v1.8",
  status: "in-progress",
  duration: "2.1h",
  count: 89
}, {
  step: "Score",
  timestamp: "2024-01-15 12:00:00",
  model: "AI Evaluator v2.5",
  status: "pending",
  duration: "1.5h",
  count: 67
}, {
  step: "Human Review",
  timestamp: "2024-01-15 13:30:00",
  model: "Human Reviewer",
  status: "in-progress",
  duration: "4.2h",
  count: 23
}];

const recentActivities = [{
  timestamp: "2024-01-15 14:23:15",
  user: "Sarah Johnson",
  action: "Score Adjusted",
  details: "Applicant #A789 score: 78 → 85",
  type: "score"
}, {
  timestamp: "2024-01-15 14:18:42",
  user: "AI System v2.1",
  action: "Document Downloaded",
  details: "Technical proposal for RFP-2024-002",
  type: "document"
}, {
  timestamp: "2024-01-15 14:15:33",
  user: "Mike Chen",
  action: "Review Completed",
  details: "Compliance review for RFP-2024-003",
  type: "review"
}, {
  timestamp: "2024-01-15 14:12:28",
  user: "AI System v2.1",
  action: "Alert Generated",
  details: "Missing financial docs for A456",
  type: "alert"
}];

const chartConfig = {
  avgScore: {
    label: "Average Score",
    color: "hsl(var(--chart-1))"
  },
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))"
  },
  threshold: {
    label: "Threshold",
    color: "hsl(var(--red-accent))"
  }
};

export const SummaryDashboard = () => {
  const handleExport = () => {
    console.log("Exporting comprehensive analytics report...");
  };
  const handleViewDetails = (category: string) => {
    console.log(`Viewing details for category: ${category}`);
  };
  const handleReviewFlag = (flagId: string) => {
    console.log(`Reviewing flagged item: ${flagId}`);
  };
  return <div className="space-y-6">
      {/* Enhanced Filters */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-black">Analytics Dashboard</CardTitle>
            <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2 text-black hover:bg-background">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select defaultValue="all-time">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-categories">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="RFP Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="it-services">IT Services</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2 text-black hover:bg-background">
              <Filter size={16} />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Average Scores & Potential Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[10px] border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Star className="h-5 w-5 text-red-accent" />
              Average Scores by Category
            </CardTitle>
            <p className="text-sm text-black">Performance against scoring thresholds</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{
                    fontSize: 12,
                    fill: '#000000'
                  }} />
                    <YAxis tick={{
                    fontSize: 12,
                    fill: '#000000'
                  }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                      {categoryScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="threshold" fill="hsl(var(--red-muted))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[10px] border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <AlertTriangle className="h-5 w-5 text-red-accent" />
              Potential Issues
            </CardTitle>
            <p className="text-sm text-black">Issues requiring attention</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {potentialIssuesData.map((issue, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: issue.color
                }} />
                    <div>
                      <div className="font-medium text-black">{issue.type}</div>
                      <div className="text-sm text-black">{issue.count} affected applications</div>
                    </div>
                  </div>
                  <Badge variant={issue.severity === 'high' ? 'destructive' : 'outline'} className="text-black">
                    {issue.severity}
                  </Badge>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Human-in-Loop Flags */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <User className="h-5 w-5 text-red-accent" />
            Human-in-Loop Flags
          </CardTitle>
          <p className="text-sm text-black">Applications requiring human review due to borderline scores</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {humanInLoopFlags.map((flag, index) => <div key={index} className="flex items-center justify-between p-4 border border-amber-200 rounded-lg bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-black">{flag.id}</Badge>
                    <span className="font-medium text-black">{flag.applicant}</span>
                    <Badge variant={flag.score < flag.threshold ? 'destructive' : 'outline'} className="text-black">
                      Score: {flag.score}/{flag.threshold}
                    </Badge>
                  </div>
                  <div className="text-sm text-black mt-1">
                    {flag.reason} • Flagged: {flag.flagged}
                  </div>
                </div>
                <Button size="sm" onClick={() => handleReviewFlag(flag.id)} className="ml-4 bg-primary text-white hover:bg-red-accent">
                  Review
                </Button>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Viewer */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Activity className="h-5 w-5 text-red-accent" />
            Workflow Viewer
          </CardTitle>
          <p className="text-sm text-black">Timestamp-labeled flow chart showing model execution at each step</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {workflowSteps.map((step, index) => <div key={index} className="flex items-center">
                <div className="flex flex-col items-center space-y-3 min-w-[180px]">
                  {/* Step Status Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-primary' : step.status === 'in-progress' ? 'bg-red-accent' : 'bg-gray-400'}`}>
                    {step.status === 'completed' ? <CheckCircle className="w-6 h-6 text-white" /> : step.status === 'in-progress' ? <Clock className="w-6 h-6 text-white animate-spin" /> : <Clock className="w-6 h-6 text-white" />}
                  </div>
                  
                  {/* Step Info */}
                  <div className="text-center space-y-2">
                    <h4 className="font-bold text-black">{step.step}</h4>
                    <div className="bg-white rounded-lg p-3 shadow-sm border space-y-1">
                      <div className="text-sm font-medium text-black">{step.model}</div>
                      <div className="text-xs text-black">{step.timestamp}</div>
                      <div className="text-xs text-red-accent">Duration: {step.duration}</div>
                      <Badge variant="outline" className="text-xs text-black">
                        {step.count} processed
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Connecting Arrow */}
                {index < workflowSteps.length - 1 && <div className="mx-4 flex items-center">
                    <div className="w-8 h-0.5 bg-gray-300" />
                    <div className="w-0 h-0 border-l-4 border-l-gray-300 border-y-2 border-y-transparent" />
                  </div>}
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Logs */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <FileText className="h-5 w-5 text-red-accent" />
            Recent Activity Logs
          </CardTitle>
          <p className="text-sm text-black">Latest platform activities and audit trail</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'score' ? 'bg-red-accent text-white' : activity.type === 'document' ? 'bg-gray-100 text-black' : activity.type === 'review' ? 'bg-red-accent text-white' : 'bg-red-accent text-white'}`}>
                    {activity.type === 'score' ? <Star size={16} /> : activity.type === 'document' ? <FileText size={16} /> : activity.type === 'review' ? <User size={16} /> : <AlertTriangle size={16} />}
                  </div>
                  <div>
                    <div className="font-medium text-black">{activity.action}</div>
                    <div className="text-sm text-black">{activity.details}</div>
                  </div>
                </div>
                <div className="text-xs text-black font-mono">
                  {activity.timestamp.split(' ')[1]}
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
