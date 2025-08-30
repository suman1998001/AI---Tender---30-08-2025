import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, FileText } from "lucide-react";
import type { RFP } from "@/pages/RFPManagement";
import type { Applicant } from "@/pages/ApplicantTracking";
interface RFPWorkflowProgressProps {
  rfp: RFP;
  applicants: Applicant[];
}
export const RFPWorkflowProgress = ({
  rfp,
  applicants
}: RFPWorkflowProgressProps) => {
  const workflowSteps = [{
    name: "AI Processing",
    status: rfp.workflow_step === "AI Scoring" ? "active" : "completed",
    icon: FileText,
    count: applicants.filter(a => a.workflowStep.includes("AI")).length,
    progress: 85
  }, {
    name: "Human Review",
    status: rfp.workflow_step === "Human Review" ? "active" : rfp.workflow_step === "AI Scoring" ? "pending" : "completed",
    icon: Users,
    count: applicants.filter(a => a.workflowStep.includes("Human")).length,
    progress: 60
  }, {
    name: "Completed",
    status: rfp.workflow_step === "Completed" ? "active" : "pending",
    icon: CheckCircle,
    count: applicants.filter(a => a.status === "Approved").length,
    progress: 30
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-foreground text-background border-foreground";
      case "active":
        return "bg-red-accent-light text-red-muted border-red-accent";
      case "pending":
        return "bg-muted text-foreground border-border";
      default:
        return "bg-muted text-foreground border-border";
    }
  };
  const getIconColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-black";
      case "active":
        return "text-red-600";
      case "pending":
        return "text-black";
      default:
        return "text-black";
    }
  };
  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-foreground";
      case "active":
        return "bg-red-accent";
      case "pending":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };
  const getIconBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-background";
      case "active":
        return "text-red-muted";
      case "pending":
        return "text-foreground";
      default:
        return "text-foreground";
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.name} className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${getBackgroundColor(step.status)}`}>
                  <Icon className={`w-5 h-5 ${getIconBgColor(step.status)}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{step.name}</h3>
                    <Badge className={getStatusColor(step.status)}>
                      {step.count} applicants
                    </Badge>
                  </div>
                  <Progress value={step.progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};