import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Search, Filter, FileText, CheckCircle, AlertTriangle, Eye, X, Building, IndianRupee, Calendar, Hash, Zap, Target, Edit3 } from "lucide-react";

interface POInvoiceMatchingProps {
  onBack: () => void;
}

const POInvoiceMatching = ({ onBack }: POInvoiceMatchingProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Mock data for pending invoices
  const pendingInvoices = [
    {
      id: "INV-001",
      vendor: "JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR",
      invoiceNumber: "TC-2024-001",
      amount: 25000,
      date: "2024-01-15",
      status: "Pending PO Match",
      statusType: "warning"
    },
    {
      id: "INV-002",
      vendor: "SHREE GOSAI ENTERPRISES",
      invoiceNumber: "OS-2024-145",
      amount: 1200,
      date: "2024-01-14",
      status: "Pending GRN",
      statusType: "warning"
    },
    {
      id: "INV-003",
      vendor: "PARAMOUNT SERVICES",
      invoiceNumber: "CP-2024-089",
      amount: 15000,
      date: "2024-01-13",
      status: "Mismatched",
      statusType: "error"
    }
  ];

  // Mock matching data for selected invoice
  const matchingData = {
    invoice: {
      items: [
        { name: "Software License", quantity: 10, rate: 2500, total: 25000 }
      ]
    },
    po: {
      items: [
        { name: "Software License", quantity: 10, rate: 2500, total: 25000 }
      ]
    },
    grn: {
      items: [
        { name: "Software License", quantity: 10, rate: 2500, total: 25000 }
      ]
    }
  };

  const getStatusBadge = (status: string, statusType: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      success: "default",
      warning: "secondary",
      error: "destructive"
    };
    return <Badge variant={variants[statusType] || "outline"}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // KPI data for matching engine status
  const kpis = [
    {
      title: "Auto-matched Invoices",
      value: "15",
      change: "Processing completed",
      icon: CheckCircle,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Pending Manual Review",
      value: "8",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-black", 
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-muted"
    },
    {
      title: "Exceptions Detected",
      value: "3",
      change: "Immediate action needed",
      icon: X,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      iconBg: "bg-red-accent"
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in px-0 py-0">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack} className="transition-all duration-200 hover:scale-105 bg-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">PO & Invoice Matching</h1>
          <p className="text-muted-foreground">3-way matching workflow for Purchase Orders, GRNs, and Invoices</p>
        </div>
      </div>

      {/* Automated Matching Engine Status - KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] mb-[10px]">
        {kpis.map((kpi, index) => (
          <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  {kpi.title}
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {kpi.value}
                </div>
              </div>
              <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                {kpi.change}
              </p>
            </CardContent>
            
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>
        ))}
      </div>

      {/* Pending Invoices Table with Integrated Filters */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-4 w-4" />
              Invoice Queue
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search invoices..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="pl-10 w-64 h-9 border-gray-300 focus:border-gray-500 focus:ring-gray-500" 
                />
              </div>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="w-40 h-9 border-gray-300">
                  <SelectValue placeholder="Vendor" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="jeelife">JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies Ltd.</SelectItem>
                  <SelectItem value="consulting">Consulting Partners</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 h-9 border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="pending-po">Pending PO Match</SelectItem>
                  <SelectItem value="pending-grn">Pending GRN</SelectItem>
                  <SelectItem value="mismatched">Mismatched</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-9 border-gray-300 hover:bg-gray-50">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInvoices.map((invoice, index) => (
                <TableRow key={invoice.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.vendor}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status, invoice.statusType)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedInvoice(invoice.id);
                        setIsMatchingModalOpen(true);
                      }}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Match
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3-Way Matching Modal */}
      <Dialog open={isMatchingModalOpen} onOpenChange={setIsMatchingModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                3-Way Matching Interface - Invoice {pendingInvoices.find(inv => inv.id === selectedInvoice)?.invoiceNumber}
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMatchingModalOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Invoice Details Section - Invoice Slip Style */}
            <Card className="border border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-0">
                {/* Header Section */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR</h2>
                      <p className="text-sm text-gray-600">Software License</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">₹25,00,000</div>
                      <p className="text-sm text-gray-600">Jan 15, 2024</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                      Processing in 2 days
                    </Badge>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Summary Invoices</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Schedule:</span>
                      <span className="text-sm font-medium text-gray-900">Monthly</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Due Date:</span>
                      <span className="text-sm font-medium text-gray-900">February 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Invoice Number:</span>
                      <span className="text-sm font-medium text-gray-900">TC-2024-001</span>
                    </div>
                  </div>
                </div>

                {/* Next Bill Section */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Next Bill</p>
                      <div className="text-xl font-bold text-gray-900">₹26,25,000</div>
                    </div>
                    <Button 
                      variant="default" 
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      See Bill
                    </Button>
                  </div>
                </div>

                {/* OCR Extracted Data Section */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-600">OCR Extracted Data</p>
                  </div>
                  <p className="text-sm text-gray-700">Software License x10 @ ₹2,50,000 each</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggested Matches Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-red-accent" />
                  AI-Suggested Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-white border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-muted rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-black">PO-2024-001</span>
                      </div>
                      <Badge variant="default" className="bg-red-accent hover:bg-red-accent text-white">95% Match</Badge>
                    </div>
                    <p className="text-xs text-black font-medium">Software License x10</p>
                    <p className="text-xs text-gray-600 mt-1">Purchase Order matches quantity and description</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-white border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-black rounded-lg">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-black">GRN-2024-001</span>
                      </div>
                      <Badge variant="default" className="bg-black hover:bg-black text-white">100% Match</Badge>
                    </div>
                    <p className="text-xs text-black font-medium">Received 10 licenses</p>
                    <p className="text-xs text-gray-600 mt-1">Goods receipt note confirms delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-red-accent" />
                  Comparison Grid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Item Description</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Unit Rate</TableHead>
                        <TableHead className="font-semibold">Total Amount</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-medium">Software License</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>₹2,50,000</TableCell>
                        <TableCell>₹25,00,000</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-red-accent" />
                            <span className="text-red-accent text-sm font-medium">Perfect Match</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Justification Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Edit3 className="h-5 w-5 text-red-accent" />
                  Justification & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Additional Comments (Optional):</label>
                  <Textarea 
                    placeholder="Enter any additional comments or justification for variance approval..." 
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                className="transition-all duration-200 hover:scale-105"
                onClick={() => setIsMatchingModalOpen(false)}
              >
                Request Vendor Clarification
              </Button>
              <Button 
                variant="outline" 
                className="transition-all duration-200 hover:scale-105 text-red-accent border-red-accent hover:bg-red-50"
              >
                Flag for Review
              </Button>
              <Button 
                className="transition-all duration-200 hover:scale-105 bg-red-accent hover:bg-red-accent/90 text-white"
                onClick={() => {
                  setShowSuccessPopup(true);
                  setIsMatchingModalOpen(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
              Payment Approved Successfully
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <p className="text-gray-600 mb-2">
                Invoice <span className="font-semibold text-black">TC-2024-001</span> has been approved for payment.
              </p>
              <p className="text-sm text-gray-500">
                The vendor will be notified and payment will be processed according to the agreed terms.
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setShowSuccessPopup(false);
                setSelectedInvoice(null);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { POInvoiceMatching };