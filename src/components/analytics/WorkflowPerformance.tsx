import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, AlertTriangle, Users, FileText, CheckCircle } from "lucide-react";
const workflowStages = [{
  id: "ingestion",
  name: "RFP Ingestion",
  icon: FileText,
  current: 12,
  processed: 156,
  avgTime: "0.5h",
  bottleneck: false,
  color: "from-black to-gray-800"
}, {
  id: "ai-processing",
  name: "AI Pre-processing",
  icon: Users,
  current: 8,
  processed: 142,
  avgTime: "2.1h",
  bottleneck: false,
  color: "from-red-accent to-red-accent"
}, {
  id: "human-review",
  name: "Human Review",
  icon: Users,
  current: 23,
  processed: 89,
  avgTime: "1.2d",
  bottleneck: true,
  color: "from-black to-gray-800"
}, {
  id: "decision",
  name: "Final Decision",
  icon: CheckCircle,
  current: 3,
  processed: 134,
  avgTime: "0.8h",
  bottleneck: false,
  color: "from-red-accent to-red-accent"
}];
const throughputData = [{
  stage: "Ingestion",
  thisWeek: 45,
  lastWeek: 38
}, {
  stage: "AI Processing",
  thisWeek: 42,
  lastWeek: 35
}, {
  stage: "Human Review",
  thisWeek: 28,
  lastWeek: 31
}, {
  stage: "Decision",
  thisWeek: 35,
  lastWeek: 29
}];
export const WorkflowPerformance = () => {
  const handleStageClick = (stageId: string) => {
    console.log(`Drilling down into stage: ${stageId}`);
    // This would navigate to a detailed view of the stage
  };
  return <div className="space-y-6">
      {/* Workflow Filters */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Workflow Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select defaultValue="all-rfps">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="RFP Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-rfps">All RFPs</SelectItem>
                <SelectItem value="it-services">IT Services</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-status">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="last-30-days">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Global Workflow Viewer */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Global Workflow Viewer</CardTitle>
          <p className="text-sm text-black">Interactive process flow with real-time bottleneck detection</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {workflowStages.map((stage, index) => <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center space-y-4 min-w-[200px] group cursor-pointer" onClick={() => handleStageClick(stage.id)}>
                  {/* Stage Icon */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300`}>
                    <stage.icon className="w-7 h-7 text-white" />
                    {stage.bottleneck && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-accent rounded-full border-2 border-white animate-pulse" />}
                  </div>
                  
                  {/* Stage Info */}
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-black text-sm">{stage.name}</h3>
                    
                    {/* Current Count */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border space-y-2 group-hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-black">{stage.current}</span>
                        <Badge variant="outline" className="text-xs text-black">Current</Badge>
                      </div>
                      <div className="text-xs text-black">
                        {stage.processed} processed
                      </div>
                      <div className="flex items-center gap-1 text-xs text-black">
                        <Clock size={12} />
                        Avg: {stage.avgTime}
                      </div>
                    </div>
                    
                    {/* Bottleneck Badge */}
                    {stage.bottleneck && <Badge variant="destructive" className="text-xs animate-pulse">
                        <AlertTriangle size={12} className="mr-1" />
                        Bottleneck
                      </Badge>}
                  </div>
                </div>
                
                {/* Connecting Arrow */}
                {index < workflowStages.length - 1 && <div className="mx-8 flex items-center">
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full" />
                    <ArrowRight className="mx-2 text-gray-400 w-5 h-5" />
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full" />
                  </div>}
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Throughput Metrics */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Throughput Metrics</CardTitle>
          <p className="text-sm text-black">Weekly comparison of items processed per stage</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {throughputData.map((item, index) => <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-black">{item.stage}</div>
                  <div className="text-sm text-black">
                    This week: {item.thisWeek} | Last week: {item.lastWeek}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={item.thisWeek / 50 * 100} className="w-24" />
                  <Badge variant={item.thisWeek > item.lastWeek ? "default" : "outline"} className="text-black bg-orange-100">
                    {item.thisWeek > item.lastWeek ? "↗" : "↘"} 
                    {Math.abs(item.thisWeek - item.lastWeek)}
                  </Badge>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};