
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Search, User, FileText, Star, AlertCircle, Settings, Mail } from "lucide-react";

const auditData = [
  {
    timestamp: "2024-01-15 14:23:15",
    user: "Sarah Johnson",
    userType: "human",
    action: "Score Adjusted",
    actionType: "score",
    details: "Adjusted score for Applicant #A789 from 78 to 85 in RFP-2024-003",
    rfpId: "RFP-2024-003",
    applicantId: "A789"
  },
  {
    timestamp: "2024-01-15 14:18:42",
    user: "AI System v2.1",
    userType: "system",
    action: "Document Downloaded",
    actionType: "document",
    details: "Technical proposal downloaded by Mike Chen for review",
    rfpId: "RFP-2024-002",
    applicantId: "A456"
  },
  {
    timestamp: "2024-01-15 14:15:33",
    user: "Mike Chen",
    userType: "human",
    action: "Review Completed",
    actionType: "review",
    details: "Compliance review completed for RFP-2024-003, score: 82/100",
    rfpId: "RFP-2024-003",
    applicantId: "A123"
  },
  {
    timestamp: "2024-01-15 14:12:28",
    user: "AI System v2.1",
    userType: "system",
    action: "Alert Generated",
    actionType: "alert",
    details: "Missing financial documents flagged for Applicant #A456",
    rfpId: "RFP-2024-001",
    applicantId: "A456"
  },
  {
    timestamp: "2024-01-15 14:08:17",
    user: "David Wilson",
    userType: "human",
    action: "Status Changed",
    actionType: "status",
    details: "RFP-2024-002 status changed from 'Under Review' to 'Approved'",
    rfpId: "RFP-2024-002",
    applicantId: null
  },
  {
    timestamp: "2024-01-15 14:05:44",
            user: "Anjali Patel",
    userType: "human",
    action: "User Login",
    actionType: "auth",
    details: "User logged in from IP: 192.168.1.100",
    rfpId: null,
    applicantId: null
  },
  {
    timestamp: "2024-01-15 14:02:11",
    user: "AI System v2.1",
    userType: "system",
    action: "Email Sent",
    actionType: "communication",
    details: "Missing document notification sent to applicant@company.com",
    rfpId: "RFP-2024-001",
    applicantId: "A789"
  },
  {
    timestamp: "2024-01-15 13:58:33",
    user: "Admin System",
    userType: "system",
    action: "Settings Updated",
    actionType: "config",
    details: "AI scoring threshold updated from 75 to 78",
    rfpId: null,
    applicantId: null
  }
];

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case "score": return Star;
    case "document": return FileText;
    case "review": return User;
    case "alert": return AlertCircle;
    case "status": return FileText;
    case "auth": return User;
    case "communication": return Mail;
    case "config": return Settings;
    default: return FileText;
  }
};

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "score": return "bg-red-accent-light text-white border-red-accent";
      case "document": return "bg-background text-foreground border-border";
      case "review": return "bg-red-accent-light text-white border-red-accent";
      case "alert": return "bg-red-accent-light text-white border-red-accent";
      case "status": return "bg-background text-foreground border-border";
      case "auth": return "bg-background text-foreground border-border";
      case "communication": return "bg-red-accent-light text-white border-red-accent";
      case "config": return "bg-background text-foreground border-border";
      default: return "bg-background text-foreground border-border";
    }
  };

export const AuditTrail = () => {
  const handleExport = () => {
    console.log("Exporting audit trail...");
    // Export functionality would be implemented here
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-black">Activity Logs</CardTitle>
              <p className="text-sm text-black mt-1">Comprehensive audit trail of all platform activities</p>
            </div>
            <Button onClick={handleExport} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-red-accent">
              <Download size={16} />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search activities, users, or details..." 
                  className="pl-10 bg-gray-50 border-gray-200 text-black"
                />
              </div>
            </div>
            
            <Select defaultValue="all-users">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Filter by User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-users">All Users</SelectItem>
                <SelectItem value="human-only">Human Users Only</SelectItem>
                <SelectItem value="system-only">System/AI Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-actions">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="score">Score Changes</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="document">Document Access</SelectItem>
                <SelectItem value="communication">Communications</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="today">
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail Table */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 bg-gray-50/30">
                  <TableHead className="text-black font-semibold py-4 px-6 text-xs uppercase tracking-wide">Timestamp</TableHead>
                  <TableHead className="text-black font-semibold py-4 px-6 text-xs uppercase tracking-wide">User</TableHead>
                  <TableHead className="text-black font-semibold py-4 px-6 text-xs uppercase tracking-wide">Action</TableHead>
                  <TableHead className="text-black font-semibold py-4 px-6 text-xs uppercase tracking-wide">Details</TableHead>
                  <TableHead className="text-black font-semibold py-4 px-6 text-xs uppercase tracking-wide">RFP/Applicant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditData.map((activity, index) => {
                  const ActionIcon = getActionIcon(activity.actionType);
                  return (
                    <TableRow key={index} className="hover:bg-gray-50/50 transition-all duration-300 border-b border-gray-50 last:border-b-0 group">
                      <TableCell className="font-mono text-xs text-black py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {activity.timestamp.split(' ')[1]}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {activity.timestamp.split(' ')[0]}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                            activity.userType === 'system' 
                              ? 'bg-gradient-to-br from-red-muted to-red-accent text-white' 
                              : 'bg-gradient-to-br from-primary to-primary text-white'
                          }`}>
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="font-medium text-black text-sm">{activity.user}</span>
                            {activity.userType === 'system' && (
                              <div className="text-xs text-red-accent font-medium">Automated</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <ActionIcon size={16} className="text-foreground" />
                          <Badge className={`${getActionColor(activity.actionType)} shadow-sm`}>
                            {activity.action}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-black py-4 px-6 text-sm max-w-md">
                        {activity.details}
                      </TableCell>
                      
                      <TableCell className="py-4 px-6 text-sm">
                        <div className="space-y-1">
                          {activity.rfpId && (
                            <Badge variant="outline" className="text-xs text-black">
                              {activity.rfpId}
                            </Badge>
                          )}
                          {activity.applicantId && (
                            <Badge variant="outline" className="text-xs text-black">
                              {activity.applicantId}
                            </Badge>
                          )}
                          {!activity.rfpId && !activity.applicantId && (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
