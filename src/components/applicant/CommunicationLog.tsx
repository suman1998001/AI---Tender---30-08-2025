
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Award, 
  Shield, 
  Plus, 
  Search, 
  Filter,
  Send,
  Eye,
  RefreshCw,
  FileText,
  Clock,
  User,
  Settings,
  Trophy,
  Star,
  Medal,
  Rocket,
  Timer,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { useState } from "react";
import type { Applicant } from "@/pages/ApplicantTracking";

interface CommunicationLogProps {
  applicant: Applicant;
}

export const CommunicationLog = ({ applicant }: CommunicationLogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [customMessageDialogOpen, setCustomMessageDialogOpen] = useState(false);
  const [manualEntryDialogOpen, setManualEntryDialogOpen] = useState(false);
  const [communicationDetailsOpen, setCommunicationDetailsOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<any>(null);

  // Mock data
  const missingDocuments = [
    { 
      name: "Bid Security Declaration", 
      description: "Declaration document confirming bid security deposit",
      urgency: "High",
      deadline: "2024-01-20"
    },
    { 
      name: "Experience Certificate for Project X", 
      description: "Certificate proving experience in similar projects",
      urgency: "Medium", 
      deadline: "2024-01-22"
    },
    { 
      name: "Tax Compliance Certificate", 
      description: "Valid tax compliance certificate (expired)",
      urgency: "High",
      deadline: "2024-01-18"
    },
    { 
      name: "Financial Statements", 
      description: "Audited financial statements for last 3 years",
      urgency: "Medium",
      deadline: "2024-01-25"
    }
  ];

  const riskAnalysis = {
    overallRisk: "Medium",
    riskScore: 67,
    keyFactors: [
      { factor: "Documentation Compliance", status: "Minor Issues", icon: XCircle, severity: "medium" },
      { factor: "Financial Standing", status: "Excellent", icon: CheckCircle, severity: "low" },
      { factor: "Technical Capability", status: "Good", icon: CheckCircle, severity: "low" },
      { factor: "Past Performance", status: "Needs Review", icon: AlertCircle, severity: "high" }
    ],
    recommendations: [
      "Request additional experience certificates",
      "Verify financial documents from last 2 years",
      "Schedule technical capability assessment"
    ]
  };

  const performanceHighlights = [
    { 
      bidder: "Rajesh Kumar Ltd", 
      highlight: "Highest Turnover (₹50 Cr) in current tender pool", 
      badge: "Revenue Leader",
      icon: DollarSign,
      metric: "₹50 Cr",
      trend: "+15%"
    },
    { 
      bidder: "Priya Sharma Enterprises", 
      highlight: "Most Compliance Badges (15 badges) - Quality Champion", 
      badge: "Compliance Star",
      icon: Star,
      metric: "15 Badges",
      trend: "Perfect"
    },
    { 
      bidder: "Amit Technologies", 
      highlight: "Top scorer in Technical Compliance (95%) for this tender", 
      badge: "Technical Expert",
      icon: Medal,
      metric: "95%",
      trend: "+8%"
    },
    { 
      bidder: "Mumbai Infrastructure Co", 
      highlight: "Most Innovative Solution provider - 3 innovation awards", 
      badge: "Innovation Leader",
      icon: Rocket,
      metric: "3 Awards",
      trend: "New"
    },
    { 
      bidder: "Delhi Contractors", 
      highlight: "Fastest Document Submission (2 hours) - Speed Champion", 
      badge: "Quick Response",
      icon: Timer,
      metric: "2 Hours",
      trend: "Record"
    }
  ];

  const communicationHistory = [
    {
      id: 1,
      date: "2024-01-15 10:30 AM",
      type: "Email",
      senderRecipient: "You to Bidder A",
      subject: "Missing Documents Notification",
      status: "Delivered",
      associatedDoc: "Missing_Docs_List.pdf"
    },
    {
      id: 2,
      date: "2024-01-14 03:45 PM",
      type: "WhatsApp",
      senderRecipient: "System to Bidder B",
      subject: "Tender Status Update",
      status: "Read",
      associatedDoc: null
    },
    {
      id: 3,
      date: "2024-01-13 11:20 AM",
      type: "Call",
      senderRecipient: "You to Bidder C",
      subject: "Clarification on Technical Specifications",
      status: "Completed",
      associatedDoc: "Call_Transcript.pdf"
    }
  ];

  const handleComposeEmail = () => {
    setEmailDialogOpen(true);
    toast({
      title: "Email Composer",
      description: "Opening email composer for missing documents",
    });
  };

  const handleSendEmail = () => {
    setEmailDialogOpen(false);
    toast({
      title: "Email Sent",
      description: "Missing documents notification sent to bidder",
    });
  };

  const handleAutomationToggle = (channel: string, enabled: boolean) => {
    toast({
      title: `${channel} Automation`,
      description: `${channel} notifications ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  const handleSendCustomMessage = () => {
    setCustomMessageDialogOpen(false);
    toast({
      title: "Message Sent",
      description: "Custom message sent successfully",
    });
  };

  const handleAddRule = () => {
    toast({
      title: "Rule Added",
      description: "New automation rule configured",
    });
  };

  const handleViewDetails = (id: number) => {
    const communication = communicationHistory.find(comm => comm.id === id);
    setSelectedCommunication(communication);
    setCommunicationDetailsOpen(true);
  };

  const handleResend = (id: number) => {
    toast({
      title: "Resending",
      description: `Resending communication ID: ${id}`,
    });
  };

  const handleAddManualEntry = () => {
    setManualEntryDialogOpen(false);
    toast({
      title: "Manual Entry Added",
      description: "Communication log entry added successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Communication & Actionable Insights Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-accent" />
            Communication & Actionable Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Missing Documents Summary - Full Width */}
          <Card className="w-full border border-red-200 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-accent" />
                  Missing Documents for Tender {applicant.rfpNumber}
                </CardTitle>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                  {missingDocuments.length} Documents Required
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                The following documents are missing from the bidder's submission and must be provided to proceed with evaluation.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missingDocuments.map((doc, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-white border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        doc.urgency === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-black text-sm leading-tight">{doc.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ml-2 ${
                            doc.urgency === 'High' 
                              ? 'bg-red-100 text-red-700 border-red-300' 
                              : 'bg-orange-100 text-orange-700 border-orange-300'
                          }`}
                        >
                          {doc.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">{doc.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Deadline: {doc.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-red-200">
                <Button 
                  onClick={handleComposeEmail}
                  className="bg-red-accent hover:bg-red-600 text-white flex-1 sm:flex-none"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Compose Email to Bidder
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-accent text-red-accent hover:bg-red-50 flex-1 sm:flex-none"
                  onClick={() => toast({ title: "Download", description: "Generating missing documents checklist..." })}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download Checklist
                </Button>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>

      {/* Automated Communication Center */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-accent" />
            Automated Communication Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Channel Enablement Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-black flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-accent" />
                Email Notifications
              </Label>
              <Switch onCheckedChange={(checked) => handleAutomationToggle("Email", checked)} />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-black flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-red-accent" />
                WhatsApp Notifications
              </Label>
              <Switch onCheckedChange={(checked) => handleAutomationToggle("WhatsApp", checked)} />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-black flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-accent" />
                Automated Calls
              </Label>
              <Switch onCheckedChange={(checked) => handleAutomationToggle("Call", checked)} />
            </div>
          </div>

          {/* Message & Trigger Builder */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-black">Message & Trigger Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-black">Trigger Event</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="missing-docs">Document Missing</SelectItem>
                      <SelectItem value="qualified">Evaluation Status: Qualified</SelectItem>
                      <SelectItem value="disqualified">Evaluation Status: Disqualified</SelectItem>
                      <SelectItem value="follow-up">Follow-up Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-black">Message Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="missing-docs">Missing Docs Follow-up</SelectItem>
                      <SelectItem value="qualified-notif">Bid Qualified Notification</SelectItem>
                      <SelectItem value="disqualified-notif">Bid Disqualified Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-black">Send via</Label>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email" />
                      <Label htmlFor="email" className="text-black">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="whatsapp" />
                      <Label htmlFor="whatsapp" className="text-black">WhatsApp</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-black">Recipient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bidder-primary">Bidder Primary Contact</SelectItem>
                      <SelectItem value="internal-team">Internal Team</SelectItem>
                      <SelectItem value="specific">Specific Email/Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddRule} className="bg-red-accent hover:bg-red-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </CardContent>
          </Card>

          {/* Ad-hoc Communication */}
          <div className="flex justify-end">
            <Dialog open={customMessageDialogOpen} onOpenChange={setCustomMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <Send className="mr-2 h-4 w-4" />
                  Send Custom Message Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-black">Send Custom Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-black">Select Channel(s)</Label>
                    <div className="flex space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="custom-email" />
                        <Label htmlFor="custom-email" className="text-black">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="custom-whatsapp" />
                        <Label htmlFor="custom-whatsapp" className="text-black">WhatsApp</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-black">Recipient(s)</Label>
                    <Input placeholder="Enter email or phone" className="border-gray-200" />
                  </div>
                  <div>
                    <Label className="text-black">Subject</Label>
                    <Input placeholder="Enter subject" className="border-gray-200" />
                  </div>
                  <div>
                    <Label className="text-black">Message Body</Label>
                    <Textarea placeholder="Enter your message" className="border-gray-200" />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSendCustomMessage} className="bg-red-accent hover:bg-red-600 text-white">
                      Send
                    </Button>
                    <Button variant="outline" onClick={() => setCustomMessageDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-accent" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communications</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="internal">Internal Note</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={manualEntryDialogOpen} onOpenChange={setManualEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Manual Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-black">Add Manual Communication Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-black">Communication Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="meeting">In-Person Meeting</SelectItem>
                        <SelectItem value="internal">Internal Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-black">Participant(s)</Label>
                    <Input placeholder="Enter participants" className="border-gray-200" />
                  </div>
                  <div>
                    <Label className="text-black">Subject/Summary</Label>
                    <Input placeholder="Enter subject" className="border-gray-200" />
                  </div>
                  <div>
                    <Label className="text-black">Details</Label>
                    <Textarea placeholder="Enter communication details" className="border-gray-200" />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddManualEntry} className="bg-red-accent hover:bg-red-600 text-white">
                      Add Entry
                    </Button>
                    <Button variant="outline" onClick={() => setManualEntryDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Communication Log Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Date & Time</TableHead>
                <TableHead className="text-black">Type</TableHead>
                <TableHead className="text-black">Sender/Recipient</TableHead>
                <TableHead className="text-black">Subject/Summary</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Associated Doc</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communicationHistory.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell className="text-black">{comm.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {comm.type === "Email" && <Mail className="h-4 w-4 text-red-accent" />}
                      {comm.type === "WhatsApp" && <MessageSquare className="h-4 w-4 text-red-accent" />}
                      {comm.type === "Call" && <Phone className="h-4 w-4 text-red-accent" />}
                      <span className="text-black">{comm.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">{comm.senderRecipient}</TableCell>
                  <TableCell className="text-black">{comm.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {comm.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black">{comm.associatedDoc || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(comm.id)}
                        className="border-red-accent text-red-accent hover:bg-red-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResend(comm.id)}
                        className="border-black text-black hover:bg-gray-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Email Composer Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-black">Compose Email for Missing Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-black">To</Label>
              <Input value={`bidder@${applicant.applicantName.toLowerCase().replace(' ', '')}.com`} readOnly className="border-gray-200" />
            </div>
            <div>
              <Label className="text-black">Subject</Label>
              <Input value={`Urgent: Missing Documents for Tender ${applicant.rfpNumber}`} className="border-gray-200" />
            </div>
            <div>
              <Label className="text-black">Message Body</Label>
              <Textarea
                className="min-h-[200px] border-gray-200"
                defaultValue={`Dear ${applicant.applicantName},

We have reviewed your submission for Tender ${applicant.rfpNumber} and identified the following missing documents:

${missingDocuments.map(doc => `• ${doc.name} - ${doc.description}`).join('\n')}

Please submit these documents by their respective deadlines to avoid any delays in the evaluation process.

Best regards,
Procurement Team`}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSendEmail} className="bg-red-accent hover:bg-red-600 text-white">
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication Details Dialog */}
      <Dialog open={communicationDetailsOpen} onOpenChange={setCommunicationDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-black flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-accent" />
              Communication Details
            </DialogTitle>
          </DialogHeader>
          {selectedCommunication && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-black font-semibold">Date & Time</Label>
                  <p className="text-sm text-gray-700">{selectedCommunication.date}</p>
                </div>
                <div>
                  <Label className="text-black font-semibold">Communication Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedCommunication.type === "Email" && <Mail className="h-4 w-4 text-red-accent" />}
                    {selectedCommunication.type === "WhatsApp" && <MessageSquare className="h-4 w-4 text-red-accent" />}
                    {selectedCommunication.type === "Call" && <Phone className="h-4 w-4 text-red-accent" />}
                    <span className="text-sm text-gray-700">{selectedCommunication.type}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-black font-semibold">Sender/Recipient</Label>
                  <p className="text-sm text-gray-700">{selectedCommunication.senderRecipient}</p>
                </div>
                <div>
                  <Label className="text-black font-semibold">Status</Label>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mt-1">
                    {selectedCommunication.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-black font-semibold">Subject/Summary</Label>
                <p className="text-sm text-gray-700 mt-1">{selectedCommunication.subject}</p>
              </div>

              {/* Mock detailed content based on communication type */}
              <div>
                <Label className="text-black font-semibold">Full Content</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                  {selectedCommunication.type === "Email" && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>From:</strong> procurement@company.com<br />
                        <strong>To:</strong> {selectedCommunication.senderRecipient.includes("Bidder") ? "bidder@company.com" : "internal@company.com"}<br />
                        <strong>Subject:</strong> {selectedCommunication.subject}
                      </p>
                      <div className="border-t pt-2">
                        <p className="text-sm text-gray-700">
                          Dear {selectedCommunication.senderRecipient.includes("Bidder A") ? "Bidder A" : "Team"},
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          This is regarding the tender process. We have identified some items that require your attention.
                          Please find the details in the attached document and respond at your earliest convenience.
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          Best regards,<br />
                          Procurement Team
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedCommunication.type === "WhatsApp" && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Message:</strong> {selectedCommunication.subject}
                      </p>
                      <p className="text-sm text-gray-700">
                        Additional details: Status update sent via WhatsApp messaging. 
                        Message delivered and read by recipient.
                      </p>
                    </div>
                  )}
                  
                  {selectedCommunication.type === "Call" && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Call Duration:</strong> 15 minutes<br />
                        <strong>Purpose:</strong> {selectedCommunication.subject}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Call Summary:</strong> Discussed technical specifications and clarifications. 
                        All queries were addressed satisfactorily. Follow-up email to be sent with written confirmation.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedCommunication.associatedDoc && (
                <div>
                  <Label className="text-black font-semibold">Associated Document</Label>
                  <div className="flex items-center gap-2 mt-1 p-2 bg-blue-50 rounded border border-blue-200">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">{selectedCommunication.associatedDoc}</span>
                    <Button size="sm" variant="outline" className="ml-auto text-xs">
                      Download
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCommunicationDetailsOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
                {selectedCommunication.type === "Email" && (
                  <Button 
                    onClick={() => {
                      setCommunicationDetailsOpen(false);
                      toast({ title: "Reply", description: "Opening reply composer..." });
                    }}
                    className="bg-red-accent hover:bg-red-600 text-white"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
