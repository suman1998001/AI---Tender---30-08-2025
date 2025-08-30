
import { Badge } from "@/components/ui/badge";
import { Edit, Download, Archive, User, Eye, Send } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { UniversalTable } from "@/components/shared/UniversalTable";
import type { RFP } from "@/pages/RFPManagement";

interface RFPTableProps {
  rfps: RFP[];
  onViewRFP: (rfp: RFP) => void;
  onExport: () => void;
  onApplyRFP?: (rfp: RFP) => void;
}

export const RFPTable = ({ rfps, onViewRFP, onExport, onApplyRFP }: RFPTableProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-accent text-white border-red-accent';
      case 'Closed':
        return 'bg-muted text-muted-foreground border-border';
      case 'Draft':
        return 'bg-muted text-muted-foreground border-border';
      case 'Under Review':
        return 'bg-red-accent text-white border-red-accent';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getWorkflowStepColor = (step: string) => {
    switch (step) {
      case 'Applicants Submitting':
        return 'bg-red-accent text-white border-red-accent';
      case 'AI Scoring':
        return 'bg-muted text-muted-foreground border-border';
      case 'Human Review':
        return 'bg-red-accent text-white border-red-accent';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'RFP Name/Number',
      render: (value: string, row: RFP) => (
        <div className="space-y-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/rfp/${row.id}`);
            }}
            className="text-slate-900 hover:text-red-muted font-semibold hover:underline transition-colors text-left block"
          >
            {row.name}
          </button>
          <div className="text-sm text-slate-500 font-mono">{row.number}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className="text-slate-700 font-medium">{value}</span>
      )
    },
    {
      key: 'issue_date',
      label: 'Issue Date',
      render: (value: string) => {
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return <span className="text-slate-500 text-sm">Invalid date</span>;
          }
          return (
            <span className="text-slate-700 font-mono text-sm">
              {format(date, 'MMM dd, yyyy')}
            </span>
          );
        } catch (error) {
          return <span className="text-slate-500 text-sm">Invalid date</span>;
        }
      }
    },
    {
      key: 'total_applicants',
      label: 'Applicants',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-400" />
          <span className="font-semibold font-mono text-slate-800">{value}</span>
        </div>
      )
    },
    {
      key: 'workflow_step',
      label: 'Workflow Step',
      render: (value: string) => (
        <Badge variant="outline" className={`${getWorkflowStepColor(value)} font-medium`}>
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant="outline" className={`${getStatusColor(value)} font-medium`}>
          {value}
        </Badge>
      )
    }
  ];

  const getActions = (rfp: RFP) => {
    const baseActions = [
      {
        label: 'View Details',
        icon: Eye,
        onClick: (row: RFP) => onViewRFP(row)
      }
    ];

    // Only show Apply action for Open RFPs if onApplyRFP is provided
    if (rfp.status === 'Open' && onApplyRFP) {
      baseActions.push({
        label: 'Apply for RFP',
        icon: Send,
        onClick: (row: RFP) => onApplyRFP(row)
      });
    }

    baseActions.push(
      {
        label: 'Edit RFP',
        icon: Edit,
        onClick: (row: RFP) => alert('Functionality coming soon')
      },
      {
        label: 'View Applicants',
        icon: User,
        onClick: (row: RFP) => alert('Functionality coming soon')
      },
      {
        label: 'Download',
        icon: Download,
        onClick: (row: RFP) => onExport
      },
      {
        label: 'Archive',
        icon: Archive,
        onClick: (row: RFP) => alert('Functionality coming soon')
      }
    );

    return baseActions;
  };

  return (
    <UniversalTable
      data={rfps}
      columns={columns}
      actions={getActions(rfps[0])}
      pageSize={10}
      showSerialNumber={true}
      onRowClick={(row) => navigate(`/rfp/${row.id}`)}
    />
  );
};
