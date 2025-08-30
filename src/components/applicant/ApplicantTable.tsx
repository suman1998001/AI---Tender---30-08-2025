import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, User, Trophy, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Applicant } from "@/pages/ApplicantTracking";

interface ApplicantTableProps {
  applicants: Applicant[];
  onViewApplicant: (applicant: Applicant) => void;
}

export const ApplicantTable = ({ applicants, onViewApplicant }: ApplicantTableProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-primary text-primary-foreground';
      case 'Under Review':
      case 'Needs Human Review':
        return 'bg-red-accent text-white';
      case 'Rejected':
        return 'bg-red-accent text-white';
      default:
        return 'bg-background text-foreground border-border';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-red-accent';
    return 'text-red-accent';
  };

  const getQualificationIcon = (qualified: boolean) => {
    return qualified ? (
      <CheckCircle size={16} className="text-primary" />
    ) : (
      <XCircle size={16} className="text-red-accent" />
    );
  };

  const handleViewDetails = (applicant: Applicant) => {
    navigate(`/applicant/${applicant.id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">S.No</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">RFP Details</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">Applicant Information</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">Qualification</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">AI Score</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">Workflow Status</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-black">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {applicants.map((applicant, index) => (
            <tr key={applicant.id} className="border-b border-gray-200 transition-colors">
              <td className="py-4 px-6">
                <span className="text-sm font-mono text-black">{applicant.serialNumber}</span>
              </td>
              
              <td className="py-4 px-6">
                <div className="space-y-1">
                  <p className="font-medium text-black text-sm">{applicant.rfpName}</p>
                  <p className="text-xs text-black">{applicant.rfpNumber}</p>
                  <Badge variant="outline" className="text-xs bg-white text-black border-gray-200">
                    {applicant.category}
                  </Badge>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-black" />
                    <p className="font-medium text-black text-sm">{applicant.applicantName}</p>
                  </div>
                  <p className="text-xs text-black">{applicant.applicantId}</p>
                  <div className="flex items-center gap-1 text-xs text-black">
                    <Calendar size={12} />
                    {format(new Date(applicant.submissionDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  {getQualificationIcon(applicant.qualified)}
                  <span className={`text-sm font-medium ${applicant.qualified ? 'text-primary' : 'text-red-accent'}`}>
                    {applicant.qualified ? 'Qualified' : 'Not Qualified'}
                  </span>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-primary" />
                  <span className={`text-lg font-bold ${getScoreColor(applicant.aiScore)}`}>
                    {applicant.aiScore}%
                  </span>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <div className="space-y-2">
                  <Badge variant="outline" className={getStatusColor(applicant.status)}>
                    {applicant.status}
                  </Badge>
                  <div className="text-xs text-black">
                    <p className="font-medium">{applicant.workflowStep}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      Last review: {formatDistanceToNow(new Date(applicant.lastHumanReview), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(applicant)}
                  className="text-foreground border-border hover:bg-red-accent/10 hover:border-red-accent"
                >
                  <Eye size={14} className="mr-2" />
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
