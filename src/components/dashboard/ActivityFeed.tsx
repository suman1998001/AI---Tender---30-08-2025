
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, User, FileText, Star, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const activityData = [
  {
    timestamp: "2024-01-15 09:23:15",
    user: "Priya Sharma",
    action: "Score Adjusted",
    details: "Updated score for Applicant #A789 from 78 → 85",
    type: "score",
    icon: Star
  },
  {
    timestamp: "2024-01-15 09:18:42",
    user: "AI System",
    action: "Document Downloaded",
    details: "Technical proposal downloaded by Rajesh Kumar",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 09:15:33",
    user: "Rajesh Kumar",
    action: "Review Completed",
    details: "Compliance review completed for RFP-2024-003",
    type: "review",
    icon: User
  },
  {
    timestamp: "2024-01-15 09:12:28",
    user: "AI System",
    action: "Flag Raised",
    details: "Missing financial documents flagged for Applicant #A456",
    type: "flag",
    icon: AlertCircle
  },
  {
    timestamp: "2024-01-15 09:08:17",
    user: "Arjun Patel",
    action: "Status Changed",
    details: "RFP-2024-002 status changed from 'Under Review' to 'Approved'",
    type: "status",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 09:05:42",
    user: "AI System",
    action: "Document Processed",
    details: "Financial proposal processed for Applicant #B123",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 09:02:15",
    user: "Sneha Gupta",
    action: "Review Started",
    details: "Technical review initiated for RFP-2024-004",
    type: "review",
    icon: User
  },
  {
    timestamp: "2024-01-15 08:58:33",
    user: "AI System",
    action: "Score Calculated",
    details: "AI score calculated for Applicant #C456: 82.5",
    type: "score",
    icon: Star
  },
  {
    timestamp: "2024-01-15 08:55:12",
    user: "Vikram Singh",
    action: "Document Uploaded",
    details: "Compliance certificate uploaded for RFP-2024-001",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:52:47",
    user: "AI System",
    action: "Flag Cleared",
    details: "Resolved missing document flag for Applicant #D789",
    type: "flag",
    icon: AlertCircle
  },
  {
    timestamp: "2024-01-15 08:49:23",
    user: "Anita Mehta",
    action: "Status Updated",
    details: "Application status changed to 'Qualified' for RFP-2024-005",
    type: "status",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:46:15",
    user: "AI System",
    action: "Document Scanned",
    details: "Technical specifications scanned and indexed",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:43:08",
    user: "Karthik Reddy",
    action: "Review Assigned",
    details: "Human review assigned to Priya Sharma for RFP-2024-006",
    type: "review",
    icon: User
  },
  {
    timestamp: "2024-01-15 08:40:55",
    user: "AI System",
    action: "Score Updated",
    details: "Compliance score recalculated for Applicant #E321",
    type: "score",
    icon: Star
  },
  {
    timestamp: "2024-01-15 08:37:42",
    user: "Deepika Joshi",
    action: "Document Verified",
    details: "Financial documents verified for RFP-2024-007",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:34:29",
    user: "AI System",
    action: "Flag Generated",
    details: "Quality concern flagged for Applicant #F654",
    type: "flag",
    icon: AlertCircle
  },
  {
    timestamp: "2024-01-15 08:31:16",
    user: "Amit Agarwal",
    action: "Review Completed",
    details: "Final review completed for RFP-2024-008",
    type: "review",
    icon: User
  },
  {
    timestamp: "2024-01-15 08:28:03",
    user: "AI System",
    action: "Data Extracted",
    details: "Key information extracted from proposal documents",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:24:50",
    user: "Kavya Nair",
    action: "Score Approved",
    details: "Final score approved for Applicant #G987",
    type: "score",
    icon: Star
  },
  {
    timestamp: "2024-01-15 08:21:37",
    user: "AI System",
    action: "Workflow Updated",
    details: "Application moved to next workflow stage",
    type: "status",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:18:24",
    user: "Ravi Iyer",
    action: "Document Reviewed",
    details: "Technical documentation reviewed and approved",
    type: "review",
    icon: User
  },
  {
    timestamp: "2024-01-15 08:15:11",
    user: "AI System",
    action: "Alert Resolved",
    details: "System alert resolved for missing compliance data",
    type: "flag",
    icon: AlertCircle
  },
  {
    timestamp: "2024-01-15 08:11:58",
    user: "Pooja Malhotra",
    action: "Quality Check",
    details: "Quality assurance check completed for RFP-2024-009",
    type: "review",
    icon: User
  },
  {
    timestamp: "2024-01-15 08:08:45",
    user: "AI System",
    action: "Process Completed",
    details: "Document processing pipeline completed successfully",
    type: "document",
    icon: FileText
  },
  {
    timestamp: "2024-01-15 08:05:32",
    user: "Suresh Chandra",
    action: "Final Approval",
    details: "Application approved for RFP-2024-010",
    type: "status",
    icon: FileText
  }
];

const exportToExcel = () => {
  // Create CSV content
  const headers = ['SL NO', 'Timestamp', 'User', 'Action', 'Details'];
  const csvContent = [
    headers.join(','),
    ...activityData.map((activity, index) => [
      index + 1,
      `"${activity.timestamp}"`,
      `"${activity.user}"`,
      `"${activity.action}"`,
      `"${activity.details}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'activity_log.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast({
    title: "Export Completed",
    description: "Activity log has been exported to CSV file successfully.",
    className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
  });
};

export const ActivityFeed = () => {
  return (
    <Card className="rounded-[15px] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 mt-[10px] bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 tracking-tight">
              <div className="p-2 bg-gradient-to-br from-red-muted to-red-accent rounded-xl">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Audit Trail & Activity Log
            </CardTitle>
            <p className="text-sm text-gray-500">Track all system activities and user interactions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search activities..." 
                className="pl-10 w-64 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors duration-300"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToExcel}
              className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/30">
                <TableHead className="text-gray-700 font-semibold py-4 px-6 text-xs uppercase tracking-wide">SL NO</TableHead>
                <TableHead className="text-gray-700 font-semibold py-4 px-6 text-xs uppercase tracking-wide">Timestamp</TableHead>
                <TableHead className="text-gray-700 font-semibold py-4 px-6 text-xs uppercase tracking-wide">User</TableHead>
                <TableHead className="text-gray-700 font-semibold py-4 px-6 text-xs uppercase tracking-wide">Action</TableHead>
                <TableHead className="text-gray-700 font-semibold py-4 px-6 text-xs uppercase tracking-wide">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityData.map((activity, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50 transition-all duration-300 border-b border-gray-50 last:border-b-0 group">
                  <TableCell className="font-mono text-sm text-gray-600 py-4 px-6 bg-gray-50/20">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500 py-4 px-6 bg-gray-50/20">
                    <div className="font-medium">
                      {activity.timestamp.split(' ')[1]}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {activity.timestamp.split(' ')[0]}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                        activity.user === 'AI System' 
                          ? 'bg-gradient-to-br from-primary to-primary' 
                          : 'bg-gradient-to-br from-red-muted to-red-accent'
                      }`}>
                        <activity.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 text-sm">{activity.user}</span>
                        {activity.user === 'AI System' && (
                          <div className="text-xs text-gray-600 font-medium">Automated</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      activity.type === 'score' ? 'bg-red-accent text-white border-red-accent' :
                      activity.type === 'document' ? 'bg-primary text-white border-primary' :
                      activity.type === 'review' ? 'bg-muted text-foreground border-border' :
                      activity.type === 'flag' ? 'bg-red-accent text-white border-red-accent' :
                      'bg-muted text-foreground border-border'
                    } shadow-sm`}>
                      {activity.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700 py-4 px-6 text-sm">
                    {activity.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
