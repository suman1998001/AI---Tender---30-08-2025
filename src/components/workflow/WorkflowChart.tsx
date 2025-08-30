import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Bot, Users, CheckCircle, ArrowRight, Clock, AlertTriangle, TrendingUp, Eye } from "lucide-react";
import { useState } from "react";
interface WorkflowStage {
  id: string;
  name: string;
  icon: any;
  current: number;
  processed: number;
  avgTime: string;
  bottleneck: boolean;
  color: string;
  trend: 'up' | 'down' | 'stable';
  efficiency: number;
}
const workflowStages: WorkflowStage[] = [{
  id: "ingestion",
  name: "RFP Ingestion",
  icon: FileText,
  current: 12,
  processed: 156,
  avgTime: "0.5h",
  bottleneck: false,
  color: "from-red-accent to-red-accent",
  trend: 'up',
  efficiency: 95
}, {
  id: "ai-processing",
  name: "AI Extraction & Pre-scoring",
  icon: Bot,
  current: 8,
  processed: 142,
  avgTime: "2.1h",
  bottleneck: false,
  color: "from-black to-gray-800",
  trend: 'stable',
  efficiency: 88
}, {
  id: "human-review",
  name: "Human Review & Collaboration",
  icon: Users,
  current: 23,
  processed: 89,
  avgTime: "1.2d",
  bottleneck: true,
  color: "from-red-accent to-red-accent",
  trend: 'down',
  efficiency: 65
}, {
  id: "decision",
  name: "Decision & Communication",
  icon: CheckCircle,
  current: 3,
  processed: 134,
  avgTime: "0.8h",
  bottleneck: false,
  color: "from-black to-gray-700",
  trend: 'up',
  efficiency: 92
}];
export const WorkflowChart = () => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const handleStageClick = (stageId: string) => {
    setSelectedStage(stageId);
    console.log(`Drilling down into stage: ${stageId}`);
    // This would open a detailed view or navigate to stage-specific data
  };
  return <div className="space-y-6">
      {/* Interactive Workflow Chart */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">End-to-End Procurement Workflow</CardTitle>
          <p className="text-sm text-black">Click on any stage to drill down into detailed metrics</p>
        </CardHeader>
        <CardContent className="p-8 pt-12">
          <div className="flex items-center justify-between overflow-x-auto pb-8 pt-6">
            {workflowStages.map((stage, index) => <div key={stage.id} className="flex items-center animate-fade-in" style={{
                animationDelay: `${index * 150}ms`
              }}>
                <div className="flex flex-col items-center space-y-4 min-w-[220px] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2" onClick={() => handleStageClick(stage.id)}>
                  {/* Stage Icon with Status */}
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:rotate-3 group-hover:shadow-xl`}>
                    <stage.icon className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                    {stage.bottleneck && <div className="absolute -top-3 -right-3 w-7 h-7 bg-error rounded-full border-2 border-card animate-pulse flex items-center justify-center shadow-lg">
                        <AlertTriangle size={14} className="text-white animate-bounce" />
                      </div>}
                    {/* Trend Indicator */}
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-125 ${stage.trend === 'up' ? 'bg-success' : stage.trend === 'down' ? 'bg-error' : 'bg-warning'}`}>
                      <TrendingUp size={10} className={`text-white transition-transform duration-300 ${stage.trend === 'down' ? 'rotate-180' : ''} ${stage.trend === 'stable' ? 'rotate-90' : ''}`} />
                    </div>
                    {/* Pulse animation ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-red-accent opacity-0 group-hover:opacity-30 animate-ping"></div>
                  </div>
                  
                  {/* Stage Info */}
                  <div className="text-center space-y-3 transition-all duration-300 group-hover:transform group-hover:scale-105">
                    <h3 className="font-semibold text-foreground text-sm transition-colors duration-300 group-hover:text-red-accent">{stage.name}</h3>
                    
                    {/* Metrics Card */}
                    <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-3 group-hover:shadow-xl group-hover:border-red-accent/30 transition-all duration-500 group-hover:bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:text-red-accent group-hover:scale-110">{stage.current}</span>
                        <Badge variant="secondary" className="text-xs animate-pulse">Active</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                          {stage.processed} processed total
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                          <Clock size={12} className="transition-transform duration-300 group-hover:rotate-12" />
                          Avg: {stage.avgTime}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                            <span>Efficiency</span>
                            <span>{stage.efficiency}%</span>
                          </div>
                          <Progress value={stage.efficiency} className="h-2 transition-all duration-300 group-hover:h-3" />
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="w-full text-xs h-7 transition-all duration-300 hover:bg-red-accent hover:text-white group-hover:scale-105" onClick={e => {
                    e.stopPropagation();
                    handleStageClick(stage.id);
                  }}>
                        <Eye size={12} className="mr-1 transition-transform duration-300 group-hover:scale-110" />
                        View Details
                      </Button>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {stage.bottleneck && <Badge variant="destructive" className="text-xs animate-pulse transition-transform duration-300 hover:scale-110">
                          <AlertTriangle size={10} className="mr-1 animate-bounce" />
                          Bottleneck
                        </Badge>}
                      {stage.efficiency > 90 && <Badge variant="default" className="text-xs bg-success text-white transition-transform duration-300 hover:scale-110">
                          High Performance
                        </Badge>}
                    </div>
                  </div>
                </div>
                
                {/* Connecting Arrow */}
                {index < workflowStages.length - 1 && <div className="mx-8 flex items-center animate-fade-in" style={{
                    animationDelay: `${index * 150 + 75}ms`
                  }}>
                    <div className="flex-1 h-1 bg-gradient-to-r from-border to-red-accent/50 rounded-full transition-all duration-500 hover:h-2" />
                    <ArrowRight className="mx-2 text-red-accent w-6 h-6 transition-all duration-300 hover:scale-125 hover:text-red-accent animate-pulse" />
                    <div className="flex-1 h-1 bg-gradient-to-r from-red-accent/50 to-border rounded-full transition-all duration-500 hover:h-2" />
                  </div>}
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Status Summary */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Real-time Workflow Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-accent-light rounded-lg p-4 bg-zinc-950">
              <div className="text-2xl font-bold text-white">46</div>
              <div className="text-sm text-white">Total Active RFPs</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-black">1.4h</div>
              <div className="text-sm text-black">Avg Processing Time</div>
            </div>
            <div className="bg-red-accent-light rounded-lg p-4 bg-gray-950">
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-sm text-white">Active Bottlenecks</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-black">85%</div>
              <div className="text-sm text-black">Overall Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};