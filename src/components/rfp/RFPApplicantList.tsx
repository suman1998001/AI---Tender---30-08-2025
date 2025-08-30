import { Eye, Download, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { UniversalTable } from "@/components/shared/UniversalTable";
import type { Applicant } from "@/pages/ApplicantTracking";
import type { RFP } from "@/pages/RFPManagement";
interface RFPApplicantListProps {
  applicants: Applicant[];
  rfp: RFP;
}
export const RFPApplicantList = ({
  applicants,
  rfp
}: RFPApplicantListProps) => {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-black text-white border-black';
      case 'Rejected':
        return 'bg-red-accent-light text-red-muted border-red-muted';
      case 'Under Review':
        return 'bg-black text-white border-black';
      case 'Needs Human Review':
        return 'bg-red-accent-light text-red-muted border-red-muted';
      default:
        return 'bg-gray-50 text-black border-black';
    }
  };
  const columns = [{
    key: 'applicantName',
    label: 'Applicant Name',
    render: (value: string, row: Applicant) => <div className="space-y-1">
          <button onClick={e => {
        e.stopPropagation();
        navigate(`/applicant/${row.id}`);
      }} className="text-black hover:text-red-accent font-semibold hover:underline transition-colors text-left block">
            {value}
          </button>
          <div className="text-sm text-black font-mono">{row.applicantId}</div>
        </div>
  }, {
    key: 'qualified',
    label: 'Qualified',
    render: (value: boolean) => <div className="flex items-center gap-2">
          {value ? <CheckCircle size={18} className="text-black" /> : <XCircle size={18} className="text-red-accent" />}
          <span className={`font-semibold ${value ? 'text-black' : 'text-red-muted'}`}>
            {value ? 'Yes' : 'No'}
          </span>
        </div>
  }, {
    key: 'aiScore',
    label: 'AI Score',
    render: (value: number) => <div className="flex items-center gap-3">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${value >= 80 ? 'bg-black' : value >= 60 ? 'bg-red-accent' : 'bg-red-accent'}`} style={{
          width: `${value}%`
        }} />
          </div>
          <span className="font-semibold font-mono text-black min-w-[3rem]">{value}%</span>
        </div>
  }, {
    key: 'status',
    label: 'Status',
    render: (value: string) => <Badge variant="outline" className={`${getStatusColor(value)} font-medium`}>
          {value}
        </Badge>
  }, {
    key: 'submissionDate',
    label: 'Submission Date',
    render: (value: string) => {
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return <span className="text-black font-mono text-sm">Invalid date</span>;
        }
        return (
          <span className="text-black font-mono text-sm">
            {format(date, 'MMM dd, yyyy')}
          </span>
        );
      } catch (error) {
        return <span className="text-black font-mono text-sm">Invalid date</span>;
      }
    }
  }];
  const actions = [{
    label: 'View Details',
    icon: Eye,
    onClick: (row: Applicant) => navigate(`/applicant/${row.id}`)
  }, {
    label: 'Download Documents',
    icon: Download,
    onClick: (row: Applicant) => alert('Functionality coming soon')
  }, {
    label: 'Send Message',
    icon: MessageCircle,
    onClick: (row: Applicant) => alert('Functionality coming soon')
  }, {
    label: 'Approve',
    icon: CheckCircle,
    onClick: (row: Applicant) => alert('Functionality coming soon')
  }, {
    label: 'Reject',
    icon: XCircle,
    onClick: (row: Applicant) => alert('Functionality coming soon')
  }];
  return <div className="bg-white rounded-xl  p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-black">
            Applicants for {rfp.name}
          </h2>
          <p className="text-sm text-black mt-1 font-medium">
            {applicants.length} applicants submitted proposals
          </p>
        </div>
      </div>
      
      <UniversalTable data={applicants} columns={columns} actions={actions} pageSize={10} showSerialNumber={true} onRowClick={row => navigate(`/applicant/${row.id}`)} />
    </div>;
};