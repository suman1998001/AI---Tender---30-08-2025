
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Users, FileX, Eye } from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    title: "Document Download",
    status: "completed",
    count: 145,
    total: 150,
    icon: CheckCircle,
    color: "text-black",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300"
  },
  {
    id: 2,
    title: "AI Processing",
    status: "in-progress",
    count: 89,
    total: 145,
    icon: Clock,
    color: "text-red-accent",
    bgColor: "bg-red-accent/10",
    borderColor: "border-red-accent/30"
  },
  {
    id: 3,
    title: "Human Review",
    status: "pending",
    count: 23,
    total: 89,
    icon: Users,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
  {
    id: 4,
    title: "Quality Check",
    status: "pending",
    count: 12,
    total: 23,
    icon: Eye,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  }
];

export const WorkflowSnapshot = () => {
  return (
    <Card className="rounded-[15px] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 mt-[10px] bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 tracking-tight">
              <div className="p-2 bg-gradient-to-br from-red-accent to-red-muted rounded-xl">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Workflow Progress Snapshot
            </CardTitle>
            <p className="text-sm text-gray-500">Real-time view of current workflow status</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
            <Eye size={16} />
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            const progress = (step.count / step.total) * 100;
            
            return (
              <div
                key={step.id}
                className={`p-5 rounded-xl border-2 ${step.borderColor} ${step.bgColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${step.bgColor}`}>
                    <Icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <Badge 
                    variant={step.status === 'completed' ? 'default' : step.status === 'in-progress' ? 'secondary' : 'outline'}
                    className={`text-xs font-medium ${
                      step.status === 'completed' ? 'bg-black text-white' :
                      step.status === 'in-progress' ? 'bg-red-accent text-white' :
                      'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {step.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {step.count}/{step.total}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                      style={{
                        background: '#f3f4f6'
                      }}
                    />
                    <div className="text-xs text-gray-500">
                      {Math.round(progress)}% complete
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
