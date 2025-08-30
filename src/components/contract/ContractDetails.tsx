import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Download, Send, RotateCcw, FileText, Clock, CheckCircle, AlertCircle, Users, Paperclip, Calendar, IndianRupee, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define Contract type locally since we removed the API
interface Contract {
  id?: string;
  name: string;
  vendor?: string;
  contract_details?: string;
  value?: number;
  status: string;
  lifecycle_alerts?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface ContractDetailsProps {
  contractId: string | null;
  onBack: () => void;
  onUpdate?: (id: string, updates: Partial<Contract>) => Promise<Contract | null>;
  onDelete?: (id: string) => Promise<boolean>;
}

const ContractDetails = ({ contractId, onBack }: ContractDetailsProps) => {
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [signatureForm, setSignatureForm] = useState({
    recipientEmail: "",
    recipientName: "",
    message: "",
    dueDate: ""
  });
  const [paymentLink, setPaymentLink] = useState("");
  // Mock contract data
  const contract = {
    id: contractId,
    name: "Software License Agreement",
    vendor: "UNIQUE DESIGN AND CONSTRUCTIONS",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    value: "₹37,50,000",
    type: "MSA",
    owner: "Rajesh Kumar",
    tags: ["Software", "Annual License", "FY2024"],
    signatureStatus: "Signed",
    stampingStatus: "Completed",
    stampingFee: "₹250"
  };

  const versions = [
    { id: 1, version: "v1.0", date: "2024-01-15", changes: "Initial draft", author: "Rajesh Kumar" },
    { id: 2, version: "v1.1", date: "2024-01-18", changes: "Payment terms updated", author: "Priya Sharma" },
    { id: 3, version: "v1.2", date: "2024-01-20", changes: "Liability clause revised", author: "Rajesh Kumar" }
  ];

  const obligations = [
    { id: 1, obligation: "Monthly license payment", dueDate: "2024-02-15", status: "Completed" },
    { id: 2, obligation: "Quarterly security review", dueDate: "2024-03-31", status: "Upcoming" },
    { id: 3, obligation: "Annual renewal decision", dueDate: "2025-01-01", status: "Upcoming" },
    { id: 4, obligation: "Data backup verification", dueDate: "2024-01-31", status: "Overdue" }
  ];

  const attachments = [
    { id: 1, name: "Statement of Work - Q1 2024.pdf", size: "2.3 MB", uploadDate: "2024-01-15" },
    { id: 2, name: "Purchase Order - PO123456.pdf", size: "1.1 MB", uploadDate: "2024-01-16" },
    { id: 3, name: "Technical Specifications.docx", size: "856 KB", uploadDate: "2024-01-18" }
  ];

  const signatories = [
    { name: "Rajesh Kumar", role: "CEO", status: "Signed", date: "2024-01-20" },
    { name: "Priya Sharma (TechCorp)", role: "VP Sales", status: "Signed", date: "2024-01-21" }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Active: "default",
      Draft: "secondary",
      Expired: "destructive",
      Negotiating: "outline"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getObligationStatus = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-primary text-white"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "Upcoming":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Upcoming</Badge>;
      case "Overdue":
        return <Badge variant="destructive" className="bg-red-accent text-white"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEdit = () => {
    toast({
      title: "Edit Contract",
      description: "Redirecting to edit mode...",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };

  const handleRenew = () => {
    toast({
      title: "Renewal Process",
      description: "Contract renewal process initiated.",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };

  const handleTerminate = () => {
    toast({
      title: "Termination Process",
      description: "Contract termination process initiated.",
      className: "fixed bottom-4 right-4 w-80 bg-red-accent-light border border-red-accent text-black shadow-lg"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Generating PDF document...",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };

  const handleSendSignature = () => {
    toast({
      title: "Signature Request Sent",
      description: `E-signature request sent to ${signatureForm.recipientEmail}`,
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
    setSignatureDialogOpen(false);
    setSignatureForm({ recipientEmail: "", recipientName: "", message: "", dueDate: "" });
  };

  const generatePaymentLink = () => {
    const link = `${window.location.origin}/payment/${contract.id}?amount=${encodeURIComponent(contract.value)}&contract=${encodeURIComponent(contract.name)}`;
    setPaymentLink(link);
    toast({
      title: "Payment Link Generated",
      description: "Payment link has been generated successfully",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: "Link Copied",
      description: "Payment link copied to clipboard",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };

  const openPaymentLink = () => {
    window.open(paymentLink, '_blank');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-white rounded-2xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-red-accent-light border-gray-200 text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{contract.name}</h1>
            <p className="text-muted-foreground">Contract with {contract.vendor}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit} className="transition-all duration-200 hover:scale-105 hover:bg-red-accent-light border-gray-200">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleExport} className="transition-all duration-200 hover:scale-105 hover:bg-red-accent-light border-gray-200">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Contract Header Info */}
      <Card className="rounded-[15px] border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contract Information</span>
            {getStatusBadge(contract.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{contract.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{contract.endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="font-medium">{contract.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{contract.owner}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Tags</p>
            <div className="flex gap-2">
              {contract.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <MinimalTabs defaultValue="overview" className="space-y-[15px]">
        <MinimalTabsList className="bg-white rounded-[15px] border border-gray-200 p-1">
          <MinimalTabsTrigger value="overview" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            Overview
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="history" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
            <Clock className="h-4 w-4" />
            Redline History
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="obligations" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
            <CheckCircle className="h-4 w-4" />
            Obligations
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="attachments" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
            <Paperclip className="h-4 w-4" />
            Attachments
          </MinimalTabsTrigger>
        </MinimalTabsList>

        <MinimalTabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-[15px] border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contract Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p>This Software License Agreement ("Agreement") is entered into on {contract.startDate} between Your Company and {contract.vendor}.</p>
                  <h4>1. License Grant</h4>
                  <p>Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use the Software.</p>
                  <h4>2. Payment Terms</h4>
                  <p>Licensee agrees to pay the license fee of {contract.value} annually, due within 30 days of invoice date.</p>
                  <h4>3. Term and Termination</h4>
                  <p>This Agreement shall commence on {contract.startDate} and continue until {contract.endDate}, unless terminated earlier in accordance with the provisions herein.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleEdit} className="mt-4 transition-all duration-200 hover:scale-105">
                  <Edit className="h-3 w-3 mr-2" />
                  Edit Contract
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[15px] border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle>e-Signature & e-Stamping Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Signature Status</h4>
                  <Badge variant="default" className="bg-primary text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {contract.signatureStatus}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Signatories</h4>
                  <div className="space-y-2">
                    {signatories.map((signatory, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{signatory.name}</p>
                          <p className="text-xs text-muted-foreground">{signatory.role}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="bg-primary text-white text-xs">
                            {signatory.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{signatory.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">e-Stamping Status</h4>
                  <Badge variant="default" className="bg-primary text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {contract.stampingStatus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Stamping Fee: {contract.stampingFee}</p>
                </div>

                <div className="space-y-2">
                  <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full transition-all duration-200 hover:scale-105">
                        <Send className="h-3 w-3 mr-2" />
                        Send for Signature
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Send for E-Signature</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="recipientName">Recipient Name</Label>
                          <Input
                            id="recipientName"
                            value={signatureForm.recipientName}
                            onChange={(e) => setSignatureForm({...signatureForm, recipientName: e.target.value})}
                            placeholder="Enter recipient's name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="recipientEmail">Recipient Email</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={signatureForm.recipientEmail}
                            onChange={(e) => setSignatureForm({...signatureForm, recipientEmail: e.target.value})}
                            placeholder="Enter recipient's email"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={signatureForm.dueDate}
                            onChange={(e) => setSignatureForm({...signatureForm, dueDate: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            value={signatureForm.message}
                            onChange={(e) => setSignatureForm({...signatureForm, message: e.target.value})}
                            placeholder="Add a message for the recipient"
                            rows={3}
                          />
                        </div>
                        <Button 
                          onClick={handleSendSignature}
                          disabled={!signatureForm.recipientEmail || !signatureForm.recipientName}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Signature Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full transition-all duration-200 hover:scale-105" onClick={generatePaymentLink}>
                        Generate Payment Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Payment Link Generated</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Payment Link</Label>
                          <div className="flex gap-2">
                            <Input
                              value={paymentLink}
                              readOnly
                              className="flex-1"
                            />
                            <Button variant="outline" size="sm" onClick={copyPaymentLink}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Payment Details:</h4>
                          <p className="text-sm text-gray-600">Contract: {contract.name}</p>
                          <p className="text-sm text-gray-600">Amount: {contract.value}</p>
                          <p className="text-sm text-gray-600">Vendor: {contract.vendor}</p>
                        </div>
                        <Button onClick={openPaymentLink} className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Payment Page
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </MinimalTabsContent>

        <MinimalTabsContent value="history">
          <Card className="rounded-[15px] border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <div key={version.id} className="flex items-center justify-between p-3 border rounded animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <div>
                      <div className="font-medium">{version.version}</div>
                      <div className="text-sm text-muted-foreground">{version.changes}</div>
                      <div className="text-xs text-muted-foreground">{version.date} by {version.author}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                        Compare
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MinimalTabsContent>

        <MinimalTabsContent value="obligations">
          <Card className="rounded-[15px] border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>Contract Obligations & Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Obligation</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obligations.map((obligation, index) => (
                    <TableRow key={obligation.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <TableCell className="font-medium">{obligation.obligation}</TableCell>
                      <TableCell>{obligation.dueDate}</TableCell>
                      <TableCell>{getObligationStatus(obligation.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </MinimalTabsContent>

        <MinimalTabsContent value="attachments">
          <Card className="rounded-[15px] border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Related Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attachments.map((attachment, index) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{attachment.name}</div>
                        <div className="text-sm text-muted-foreground">{attachment.size} • {attachment.uploadDate}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MinimalTabsContent>
      </MinimalTabs>

      {/* Action Buttons */}
      <Card className="rounded-[15px] border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRenew} className="transition-all duration-200 hover:scale-105">
              <RotateCcw className="h-4 w-4 mr-2" />
              Renew
            </Button>
            <Button variant="outline" onClick={handleTerminate} className="transition-all duration-200 hover:scale-105">
              Terminate
            </Button>
            <Button variant="outline" className="transition-all duration-200 hover:scale-105">
              Amend
            </Button>
            <Button variant="outline" onClick={handleExport} className="transition-all duration-200 hover:scale-105">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ContractDetails };