import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Download, Eye, CheckCircle, Sparkles, Send, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
interface POIssuanceFlowProps {
  onBack: () => void;
}
const POIssuanceFlow = ({
  onBack
}: POIssuanceFlowProps) => {
  const [isPOGenerated, setIsPOGenerated] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingSpecs, setIsGeneratingSpecs] = useState(false);
  const [isGeneratingConditions, setIsGeneratingConditions] = useState(false);
  const {
    toast
  } = useToast();
  const [poData, setPOData] = useState({
    vendor: "",
    rfpReference: "",
    totalAmount: "",
    deliveryDate: "",
    specifications: "",
    paymentTerms: "",
    specialConditions: ""
  });
  const validateForm = () => {
    const requiredFields = ['vendor', 'rfpReference', 'totalAmount', 'deliveryDate', 'specifications', 'paymentTerms'];
    return requiredFields.every(field => poData[field as keyof typeof poData].trim() !== '');
  };
  const handleGeneratePO = () => {
    if (!validateForm()) {
      toast({
        title: "Please fill all required information",
        description: "All fields except special conditions are required to generate a PO.",
        variant: "destructive"
      });
      return;
    }
    setShowAnimation(true);
    setTimeout(() => {
      setIsPOGenerated(true);
      setShowAnimation(false);
      toast({
        title: "Purchase Order Generated Successfully!",
        description: "PO-2024-001 has been created and is ready for review."
      });
    }, 3000);
  };
  const handleGenerateSpecifications = async () => {
    if (!poData.specifications.trim()) {
      toast({
        title: "Please enter some specifications first",
        description: "Write a basic description that AI can enhance.",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingSpecs(true);
    setTimeout(() => {
      const enhancedSpecs = `${poData.specifications}

Additional technical requirements:
- Compliance with industry standards and regulations
- Quality assurance protocols and testing procedures
- Delivery packaging and handling specifications
- Installation and commissioning requirements (if applicable)
- Training and documentation to be provided
- Warranty and maintenance terms
- Performance metrics and acceptance criteria`;
      setPOData({
        ...poData,
        specifications: enhancedSpecs
      });
      setIsGeneratingSpecs(false);
      toast({
        title: "Specifications enhanced successfully",
        description: "AI has improved your specifications with additional details."
      });
    }, 2000);
  };
  const handleGenerateConditions = async () => {
    if (!poData.specialConditions.trim()) {
      toast({
        title: "Please enter some conditions first",
        description: "Write basic conditions that AI can enhance.",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingConditions(true);
    setTimeout(() => {
      const enhancedConditions = `${poData.specialConditions}

Additional legal and contractual terms:
- Force majeure clauses and risk mitigation
- Intellectual property rights and confidentiality
- Dispute resolution mechanisms
- Termination clauses and notice periods
- Liability limitations and indemnification
- Compliance with local laws and regulations
- Environmental and safety requirements`;
      setPOData({
        ...poData,
        specialConditions: enhancedConditions
      });
      setIsGeneratingConditions(false);
      toast({
        title: "Special conditions enhanced successfully",
        description: "AI has improved your conditions with additional clauses."
      });
    }, 2000);
  };
  const handleDownloadPO = () => {
    toast({
      title: "Download started",
      description: "Your Purchase Order is being downloaded as PDF."
    });
  };
  const handleViewPreview = () => {
    setShowPreview(true);
  };
  const getVendorDisplayName = (vendorValue: string) => {
    const vendorMap: {
      [key: string]: string;
    } = {
      'almighty': 'ALMIGHTY MANPOWER & SECURITY SERVICES',
      'angel': 'ANGEL MANPOWER & SECURITY SERVICES',
      'aradhay': 'M/S ARADHAY SHREERAM PRIVATE LIMITED',
      'smvd': 'SMVD GROUP'
    };
    return vendorMap[vendorValue] || vendorValue || "Not selected";
  };
  return <>
      {/* Fullscreen Animation */}
      {showAnimation && <div className="fixed inset-0 z-50 bg-white flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-6 animate-scale-in">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
            <h3 className="text-3xl font-bold text-gray-900">Generating Purchase Order...</h3>
            <p className="text-gray-600">Please wait while we create your PO</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-[loading_3s_ease-in-out]" style={{
            animation: 'loading 3s ease-in-out forwards',
            animationFillMode: 'forwards'
          }} />
            </div>
          </div>
        </div>}

      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="pt-20 px-6 pb-6 text-left bg-white py-[20px]">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 mb-4">
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Order Issuance</h1>
          <p className="text-lg text-gray-600 mt-2">Create and issue purchase orders to vendors</p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="px-6 pb-6 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side - Form Fields (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
                      <Select value={poData.vendor} onValueChange={value => setPOData({
                      ...poData,
                      vendor: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="almighty">ALMIGHTY MANPOWER & SECURITY SERVICES</SelectItem>
                          <SelectItem value="angel">ANGEL MANPOWER & SECURITY SERVICES</SelectItem>
                          <SelectItem value="aradhay">M/S ARADHAY SHREERAM PRIVATE LIMITED</SelectItem>
                          <SelectItem value="smvd">SMVD GROUP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RFP Reference *</label>
                      <Input value={poData.rfpReference} onChange={e => setPOData({
                      ...poData,
                      rfpReference: e.target.value
                    })} placeholder="Enter RFP reference number" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹) *</label>
                      <Input value={poData.totalAmount} onChange={e => setPOData({
                      ...poData,
                      totalAmount: e.target.value
                    })} placeholder="Enter total amount" type="number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms *</label>
                      <Select value={poData.paymentTerms} onValueChange={value => setPOData({
                      ...poData,
                      paymentTerms: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net30">Net 30 days</SelectItem>
                          <SelectItem value="net60">Net 60 days</SelectItem>
                          <SelectItem value="advance">50% Advance, 50% on delivery</SelectItem>
                          <SelectItem value="milestone">Milestone-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date *</label>
                    <Input value={poData.deliveryDate} onChange={e => setPOData({
                    ...poData,
                    deliveryDate: e.target.value
                  })} type="date" />
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications & Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specifications *</label>
                    <div className="relative">
                      <Textarea value={poData.specifications} onChange={e => setPOData({
                      ...poData,
                      specifications: e.target.value
                    })} placeholder="Enter detailed specifications and requirements" className="min-h-[120px] pr-32" />
                      <Button variant="outline" size="sm" onClick={handleGenerateSpecifications} disabled={isGeneratingSpecs || !poData.specifications.trim()} className="absolute top-2 right-2 h-8 px-3 text-xs">
                        {isGeneratingSpecs ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                        {isGeneratingSpecs ? "Generating..." : "AI Enhance"}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Conditions (Optional)</label>
                    <div className="relative">
                      <Textarea value={poData.specialConditions} onChange={e => setPOData({
                      ...poData,
                      specialConditions: e.target.value
                    })} placeholder="Enter any special conditions or clauses" className="min-h-[100px] pr-32" />
                      <Button variant="outline" size="sm" onClick={handleGenerateConditions} disabled={isGeneratingConditions || !poData.specialConditions.trim()} className="absolute top-2 right-2 h-8 px-3 text-xs">
                        {isGeneratingConditions ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                        {isGeneratingConditions ? "Generating..." : "AI Enhance"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Actions & Status */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isPOGenerated ? 'bg-green-100 text-green-800' : validateForm() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {isPOGenerated ? <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Generated
                        </> : validateForm() ? <>
                          <FileText className="h-4 w-4 mr-2" />
                          Ready to Generate
                        </> : <>
                          <FileText className="h-4 w-4 mr-2" />
                          In Progress
                        </>}
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Form Progress</span>
                      <span>{Math.round(Object.values(poData).filter(value => value.trim() !== '').length / Object.keys(poData).length * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{
                      width: `${Math.round(Object.values(poData).filter(value => value.trim() !== '').length / Object.keys(poData).length * 100)}%`
                    }} />
                    </div>
                  </div>

                  {isPOGenerated && <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-green-800">PO Generated</p>
                          <p className="text-sm text-green-600">PO-2024-001</p>
                        </div>
                      </div>
                    </div>}
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleGeneratePO} disabled={!validateForm() || isPOGenerated} className="w-full" size="lg">
                    <FileText className="h-4 w-4 mr-2" />
                    {isPOGenerated ? 'PO Generated' : 'Generate PO'}
                  </Button>
                  
                  <Button variant="outline" disabled={!validateForm()} onClick={handleViewPreview} className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview PO
                  </Button>
                  
                  <Button variant="outline" disabled={!isPOGenerated} onClick={handleDownloadPO} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  
                  <Button variant="outline" disabled={!isPOGenerated} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Vendor
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Selected Vendor</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {poData.vendor ? getVendorDisplayName(poData.vendor) : 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-gray-900">
                      {poData.totalAmount ? `₹${poData.totalAmount}` : 'Not entered'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Date</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {poData.deliveryDate || 'Not selected'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {/* Header with close and export buttons in top right */}
          <div className="flex justify-between items-center border-b p-6 bg-white sticky top-0 z-10">
            <DialogTitle className="text-2xl font-bold text-gray-900">Purchase Order Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPO} className="h-9 px-4">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="h-9 w-9 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Company Header */}
              <div className="text-left border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Quantumgho</h2>
                <p className="text-gray-600">123 Business Street, City, State 12345</p>
                <p className="text-gray-600">Phone: (555) 123-4567 | Email: info@quantumgho.com</p>
              </div>

              {/* PO Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">PO Number:</span>
                    <p className="text-gray-900">PO-2024-001</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Date:</span>
                    <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Vendor and Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Vendor Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Vendor Name:</span>
                      <p className="text-gray-900">{getVendorDisplayName(poData.vendor)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">RFP Reference:</span>
                      <p className="text-gray-900">{poData.rfpReference || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Financial Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                      <p className="text-2xl font-bold text-green-600">₹{poData.totalAmount || "0"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Terms:</span>
                      <p className="text-gray-900">{poData.paymentTerms || "Not selected"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Delivery Date:</span>
                      <p className="text-gray-900">{poData.deliveryDate || "Not selected"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Specifications & Requirements</h3>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-gray-900 whitespace-pre-wrap">{poData.specifications || "Not provided"}</p>
                </div>
              </div>

              {/* Special Conditions */}
              {poData.specialConditions && <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Conditions</h3>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-gray-900 whitespace-pre-wrap">{poData.specialConditions}</p>
                  </div>
                </div>}

              {/* Footer */}
              <div className="border-t pt-4 text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <p>This Purchase Order is electronically generated and does not require a signature.</p>
                <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
export default POIssuanceFlow;