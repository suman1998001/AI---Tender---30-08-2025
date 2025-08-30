
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Download, 
  Search, 
  Brain, 
  User, 
  Mail, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { Applicant } from "@/pages/ApplicantTracking";

interface ApplicantWorkflowViewProps {
  applicant: Applicant;
}

const workflowSteps = [
  {
    id: '1',
    step: 'Application Submitted',
    timestamp: '2024-01-15T14:22:00Z',
    status: 'completed',
    actor: 'Applicant',
    details: 'Initial tender documents uploaded via Government e-Marketplace (GeM) portal'
  },
  {
    id: '2',
    step: 'Document Download',
    timestamp: '2024-01-15T14:25:00Z',
    status: 'completed',
    actor: 'System',
    details: '18 documents downloaded including financial statements, GST certificates, and PAN card details'
  },
  {
    id: '3',
    step: 'Document Scan',
    timestamp: '2024-01-15T14:26:00Z',
    status: 'completed',
    actor: 'AI Model - Advanced v2024.1.15',
    details: 'OCR processing completed for all Hindi and English documents with 99.2% accuracy'
  },
  {
    id: '4',
    step: 'Pre-Extraction',
    timestamp: '2024-01-15T14:28:00Z',
    status: 'completed',
    actor: 'AI Model - Advanced v2024.1.15',
    details: '8 sections identified: Technical Specifications, Financial Bid, GST Compliance, MSME Certificate, References, EMD Details, Past Performance, Appendices'
  },
  {
    id: '5',
    step: 'Preliminary AI Scoring',
    timestamp: '2024-01-15T14:32:00Z',
    status: 'completed',
    actor: 'AI Model - Advanced v2024.1.15',
    details: 'Initial score: 87% - Flagged for human review on GST compliance verification and MSME certificate validation'
  },
  {
    id: '6',
    step: 'Human Review Assigned',
    timestamp: '2024-01-18T09:15:00Z',
    status: 'completed',
    actor: 'Procurement Management System',
    details: 'Assigned to Priya Sharma (Senior Procurement Officer) - Government of Maharashtra'
  },
  {
    id: '7',
    step: 'Human Review - Compliance',
    timestamp: '2024-01-20T10:30:00Z',
    status: 'in-progress',
    actor: 'Priya Sharma',
    details: 'Reviewing GST compliance documentation and MSME certificate authenticity verification'
  },
  {
    id: '8',
    step: 'Final Decision',
    timestamp: null,
    status: 'pending',
    actor: 'TBD',
    details: 'Awaiting completion of compliance review and tender committee approval'
  }
];

export const ApplicantWorkflowView = ({ applicant }: ApplicantWorkflowViewProps) => {
  const getStepIcon = (step: string, status: string) => {
    if (status === 'completed') {
      return <CheckCircle size={20} className="text-black" />;
    } else if (status === 'in-progress') {
      return <Clock size={20} className="text-red-accent" />;
    } else {
      return <AlertCircle size={20} className="text-black" />;
    }
  };

  const getActorIcon = (actor: string) => {
    if (actor.includes('AI Model')) {
      return <Brain size={16} className="text-red-accent" />;
    } else if (actor === 'System' || actor === 'Applicant' || actor.includes('Procurement Management')) {
      return <GitBranch size={16} className="text-black" />;
    } else {
      return <User size={16} className="text-black" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-black text-white">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-red-accent text-white">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-white text-black border-gray-200">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-black border-gray-200">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-white rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black">
          <GitBranch size={20} />
          Government Procurement Workflow Timeline
        </CardTitle>
        <p className="text-sm text-black">
          Detailed step-by-step progression for {applicant.applicantName} in Government of India procurement system
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200" />
              )}
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.step, step.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-black">{step.step}</h4>
                    {getStatusBadge(step.status)}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      {getActorIcon(step.actor)}
                      <span className="text-sm text-black">{step.actor}</span>
                    </div>
                    {step.timestamp && (
                      <span className="text-sm text-black">
                        {format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm')} 
                        ({formatDistanceToNow(new Date(step.timestamp), { addSuffix: true })})
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-black">{step.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-black mb-3">Government Procurement Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-black">6</div>
              <div className="text-sm text-black">Steps Completed</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-red-accent">1</div>
              <div className="text-sm text-black">In Progress</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-black">5.8 days</div>
              <div className="text-sm text-black">Total Processing Time</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
