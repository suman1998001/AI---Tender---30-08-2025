import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Download, 
  Filter, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Bot,
  Activity,
  FileText,
  Eye,
  Archive
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AuditRecord {
  id: string;
  workflowInstanceId: string;
  workflowName: string;
  rfpId: string;
  rfpTitle: string;
  applicantName: string;
  step: string;
  action: string;
  actor: 'ai' | 'system' | 'user';
  actorName: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'cancelled';
  duration: string;
  inputData?: string;
  outputData?: string;
  errorMessage?: string;
  complianceFlags?: string[];
  changes?: string[];
}

const mockAuditRecords: AuditRecord[] = [
  {
    id: "AR001",
    workflowInstanceId: "WI001",
    workflowName: "Standard RFP Processing",
    rfpId: "RFP-2024-001",
    rfpTitle: "IT Infrastructure Modernization",
    applicantName: "TechCorp Solutions Ltd.",
    step: "Document Ingestion",
    action: "Documents uploaded and validated",
    actor: "system",
    actorName: "Document Processing System",
    timestamp: "2024-01-15T09:30:00",
    status: "completed",
    duration: "0.3h",
    inputData: "15 PDF documents (25.4MB total)",
    outputData: "All documents validated, metadata extracted",
    complianceFlags: ["PII_DETECTED", "FINANCIAL_DATA_PRESENT"],
    changes: ["Document status: pending → validated", "Extracted 47 data points"]
  },
  {
    id: "AR002",
    workflowInstanceId: "WI001", 
    workflowName: "Standard RFP Processing",
    rfpId: "RFP-2024-001",
    rfpTitle: "IT Infrastructure Modernization",
    applicantName: "TechCorp Solutions Ltd.",
    step: "AI Pre-Extraction",
    action: "Information extracted using MSTRL-turbo",
    actor: "ai",
    actorName: "MSTRL-turbo v2.1",
    timestamp: "2024-01-15T10:15:00",
    status: "completed",
    duration: "0.7h",
    inputData: "Validated documents with metadata",
    outputData: "Structured data extraction completed",
    complianceFlags: ["TECHNICAL_SPECS_EXTRACTED", "FINANCIAL_INFO_PROCESSED"],
    changes: [
      "Company info extracted: TechCorp Solutions Ltd.",
      "Technical capabilities identified: 12 categories",
      "Financial data processed: Revenue, certifications",
      "Confidence score: 94%"
    ]
  },
  {
    id: "AR003",
    workflowInstanceId: "WI001",
    workflowName: "Standard RFP Processing", 
    rfpId: "RFP-2024-001",
    rfpTitle: "IT Infrastructure Modernization",
    applicantName: "TechCorp Solutions Ltd.",
    step: "AI Preliminary Scoring",
    action: "Initial scoring using Claude 3",
    actor: "ai",
    actorName: "Claude 3 Sonnet",
    timestamp: "2024-01-15T11:30:00",
    status: "completed",
    duration: "1.2h",
    inputData: "Extracted structured data",
    outputData: "Preliminary scores generated",
    complianceFlags: ["SCORING_COMPLETED", "BIAS_CHECK_PASSED"],
    changes: [
      "Technical score: 85/100",
      "Financial score: 78/100", 
      "Compliance score: 92/100",
      "Overall preliminary score: 85/100",
      "Bias detection: No issues found"
    ]
  },
  {
    id: "AR004",
    workflowInstanceId: "WI002",
    workflowName: "High-Value Contract Review",
    rfpId: "RFP-2024-002",
    rfpTitle: "Hospital Equipment Procurement",
    applicantName: "MediTech Industries Pvt. Ltd.",
    step: "Document Ingestion",
    action: "High-value document processing initiated",
    actor: "system",
    actorName: "Enhanced Document Processor",
    timestamp: "2024-01-15T14:00:00",
    status: "completed",
    duration: "0.5h",
    inputData: "28 documents including certifications",
    outputData: "Enhanced validation completed",
    complianceFlags: ["HIGH_VALUE_PROCESSING", "REGULATORY_DOCS_VERIFIED"],
    changes: [
      "Document count verified: 28/28 required",
      "Regulatory compliance documents validated",
      "Enhanced security scan completed",
      "Medical device certifications verified"
    ]
  },
  {
    id: "AR005",
    workflowInstanceId: "WI003",
    workflowName: "Emergency Procurement",
    rfpId: "RFP-2024-003", 
    rfpTitle: "Emergency Medical Supplies",
    applicantName: "QuickMed Supplies Co.",
    step: "Approval Gate",
    action: "Emergency approval process",
    actor: "system",
    actorName: "Approval System",
    timestamp: "2024-01-15T14:00:00",
    status: "failed",
    duration: "2.5h",
    inputData: "Emergency request with supporting documents",
    outputData: "Approval denied due to missing certifications",
    errorMessage: "Missing regulatory certification: FDA approval documentation not found",
    complianceFlags: ["EMERGENCY_PROCESSING", "REGULATORY_FAILURE"],
    changes: [
      "Status: under review → failed",
      "Missing documents identified: 3 items",
      "Escalation triggered to procurement manager",
      "Vendor notification sent"
    ]
  }
];

export const WorkflowAuditTrail = () => {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(mockAuditRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filteredRecords = auditRecords.filter(record => {
    const matchesSearch = 
      record.rfpId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.step.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesActor = actorFilter === "all" || record.actor === actorFilter;
    
    return matchesSearch && matchesStatus && matchesActor;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
      failed: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
      cancelled: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getActorBadge = (actor: string) => {
    const actorConfig = {
      ai: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Bot },
      system: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Activity },
      user: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: User }
    };

    const config = actorConfig[actor as keyof typeof actorConfig];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <Icon size={12} className="mr-1" />
        {actor.charAt(0).toUpperCase() + actor.slice(1)}
      </Badge>
    );
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Audit trail report is being generated for download."
    });
  };

  const handleViewDetails = (record: AuditRecord) => {
    setSelectedRecord(record);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
            <Archive size={20} />
            Workflow Audit Trail
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete immutable record of all workflow activities and decisions
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium text-black">Search</label>
              <div className="relative mt-1">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by RFP ID, applicant, workflow..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Actor</label>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actors</SelectItem>
                  <SelectItem value="ai">AI Systems</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">Human Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExport} variant="outline">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Records Table */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-black">Audit Records</CardTitle>
              <p className="text-sm text-gray-600">
                Found {filteredRecords.length} records matching your criteria
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-black font-semibold">Timestamp</TableHead>
                  <TableHead className="text-black font-semibold">RFP/Applicant</TableHead>
                  <TableHead className="text-black font-semibold">Workflow Step</TableHead>
                  <TableHead className="text-black font-semibold">Action</TableHead>
                  <TableHead className="text-black font-semibold">Actor</TableHead>
                  <TableHead className="text-black font-semibold">Status</TableHead>
                  <TableHead className="text-black font-semibold">Duration</TableHead>
                  <TableHead className="text-black font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-black">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-black">{record.rfpId}</p>
                        <p className="text-gray-600 max-w-48 truncate">{record.rfpTitle}</p>
                        <p className="text-gray-500 text-xs mt-1">{record.applicantName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-black">{record.step}</p>
                        <p className="text-gray-600 text-xs">{record.workflowName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-black max-w-64 truncate">{record.action}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getActorBadge(record.actor)}
                        <p className="text-xs text-gray-600">{record.actorName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-black">{record.duration}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Eye size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed View Modal/Panel */}
      {selectedRecord && (
        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-black">
                Audit Record Details - {selectedRecord.id}
              </CardTitle>
              <Button variant="ghost" onClick={() => setSelectedRecord(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Workflow Instance:</span>
                      <span className="font-medium">{selectedRecord.workflowInstanceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RFP ID:</span>
                      <span className="font-medium">{selectedRecord.rfpId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applicant:</span>
                      <span className="font-medium">{selectedRecord.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Step:</span>
                      <span className="font-medium">{selectedRecord.step}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedRecord.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Compliance Flags */}
                {selectedRecord.complianceFlags && (
                  <div>
                    <h4 className="font-medium text-black mb-2">Compliance Flags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.complianceFlags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {flag.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input/Output Data */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-2">Input Data</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedRecord.inputData}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2">Output Data</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedRecord.outputData}</p>
                  </div>
                </div>

                {selectedRecord.errorMessage && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Error Information</h4>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700">{selectedRecord.errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Changes Made */}
              {selectedRecord.changes && selectedRecord.changes.length > 0 && (
                <div className="lg:col-span-2">
                  <h4 className="font-medium text-black mb-2">Changes Made</h4>
                  <div className="space-y-2">
                    {selectedRecord.changes.map((change, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">Audit Trail Analytics</CardTitle>
          <p className="text-sm text-gray-600">
            Performance insights based on audit data
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-medium text-blue-800">Total Records</h4>
              <p className="text-2xl font-bold text-blue-900 mt-1">{auditRecords.length}</p>
              <p className="text-sm text-blue-600 mt-1">Last 30 days</p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-medium text-green-800">Success Rate</h4>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {Math.round((auditRecords.filter(r => r.status === 'completed').length / auditRecords.length) * 100)}%
              </p>
              <p className="text-sm text-green-600 mt-1">Successful completions</p>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <h4 className="font-medium text-purple-800">AI Automation</h4>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {Math.round((auditRecords.filter(r => r.actor === 'ai').length / auditRecords.length) * 100)}%
              </p>
              <p className="text-sm text-purple-600 mt-1">AI-driven actions</p>
            </div>
            
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <h4 className="font-medium text-orange-800">Avg Duration</h4>
              <p className="text-2xl font-bold text-orange-900 mt-1">2.1h</p>
              <p className="text-sm text-orange-600 mt-1">Per workflow step</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};