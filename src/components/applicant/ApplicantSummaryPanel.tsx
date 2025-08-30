
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Trophy, Clock } from "lucide-react";
import type { Applicant } from "@/pages/ApplicantTracking";

interface ApplicantSummaryPanelProps {
  applicant: Applicant;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-black text-white border-gray-200';
    case 'Under Review':
    case 'Needs Human Review':
      return 'bg-red-accent text-white border-gray-200';
    case 'Rejected':
      return 'bg-red-accent text-white border-gray-200';
    case 'Pending AI Review':
      return 'bg-white text-black border-gray-200';
    default:
      return 'bg-white text-black border-gray-200';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-black';
  if (score >= 60) return 'text-red-accent';
  return 'text-red-accent';
};

export const ApplicantSummaryPanel = ({ applicant }: ApplicantSummaryPanelProps) => {
  // Mock workflow progress - in real app this would be calculated
  const workflowProgress = 43; // 3 of 7 steps completed
  const currentStep = 3;
  const totalSteps = 7;

  return (
    <Card className="bg-white rounded-[15px] border border-gray-200 h-full w-full">
      <CardHeader>
        <div className="space-y-4">
          <CardTitle className="text-2xl font-bold text-black">
            {applicant.applicantName} ({applicant.applicantId})
          </CardTitle>
          <p className="text-lg text-black">
            for {applicant.rfpName} ({applicant.rfpNumber})
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-black">
              <User size={16} />
              Applicant Info
            </div>
            <div>
              <p className="font-medium text-black">{applicant.category}</p>
              <p className="text-sm text-black">Category</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-black">
              <Trophy size={16} />
              Overall AI Score
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(applicant.aiScore)}`}>
              {applicant.aiScore}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-black">
              <Clock size={16} />
              Current Status
            </div>
            <Badge variant="outline" className={getStatusColor(applicant.status)}>
              {applicant.status}
            </Badge>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-black">Current Workflow Step</p>
              <p className="text-sm text-black">Step {currentStep} of {totalSteps}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-black">{applicant.workflowStep}</p>
                <p className="text-sm font-medium text-black">{workflowProgress}%</p>
              </div>
              <Progress value={workflowProgress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
