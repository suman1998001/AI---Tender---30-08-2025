import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { ArrowLeft, FileText, Brain, MessageSquare, GitBranch, Download, Bot, Shield, Settings, Share2, User, Target, Zap, CheckCircle, ChevronUp, ChevronDown } from "lucide-react";
import { ApplicantSummaryPanel } from "@/components/applicant/ApplicantSummaryPanel";
import { AIStatsPanel } from "@/components/applicant/AIStatsPanel";
import { EnhancedDocumentCenter } from "@/components/applicant/EnhancedDocumentCenter";
import { EnhancedAIReviewCenter } from "@/components/applicant/EnhancedAIReviewCenter";
import { CommunicationLog } from "@/components/applicant/CommunicationLog";
import { ApplicantWorkflowView } from "@/components/applicant/ApplicantWorkflowView";
import { DownloadableSummaries } from "@/components/applicant/DownloadableSummaries";
import { AITooltip } from "@/components/ui/ai-tooltip";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Applicant } from "@/pages/ApplicantTracking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AIChatInterface from "@/components/ai/AIChatInterface";
import DocumentAnalysisSummary from "@/components/ai/DocumentAnalysisSummary";
// import AIChatInterface from "@/components/ai/AIChatInterface";
// import DocumentAnalysisSummary from "@/components/ai/DocumentAnalysisSummary";

// Mock data - in real app this would come from API
const mockApplicants: Applicant[] = [
  // Existing applicants
  {
    id: '1',
    serialNumber: 1,
    rfpName: 'Digital India - Cloud Infrastructure Services',
    rfpNumber: 'MeitY/RFP/2024/001',
    applicantName: 'Tech Solutions Private Limited',
    applicantId: 'TSL-2024-001',
    category: 'Information Technology',
    qualified: true,
    aiScore: 87,
    workflowStep: 'Human Review - Compliance',
    lastHumanReview: '2024-01-20T10:30:00Z',
    status: 'Under Review',
    submissionDate: '2024-01-15T14:22:00Z'
  },
  // New Facility Management Services Contract applicants
  {
    id: '6',
    serialNumber: 6,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'ALMIGHTY MANPOWER & SECURITY SERVICES',
    applicantId: '4821',
    category: 'Facility Management',
    qualified: false,
    aiScore: 45,
    workflowStep: 'Document Verification',
    lastHumanReview: '2024-01-22T11:00:00Z',
    status: 'Disqualified',
    submissionDate: '2024-01-22T08:30:00Z'
  },
  {
    id: '7',
    serialNumber: 7,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'ANGEL MANPOWER & SECURITY SERVICES',
    applicantId: '7359',
    category: 'Facility Management',
    qualified: false,
    aiScore: 38,
    workflowStep: 'Document Verification',
    lastHumanReview: '2024-01-22T11:15:00Z',
    status: 'Disqualified',
    submissionDate: '2024-01-22T09:00:00Z'
  },
  {
    id: '8',
    serialNumber: 8,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'M/S ARADHAY SHREERAM PRIVATE LIMITED',
    applicantId: '2964',
    category: 'Facility Management',
    qualified: true,
    aiScore: 89,
    workflowStep: 'Final Review',
    lastHumanReview: '2024-01-22T14:30:00Z',
    status: 'Qualified',
    submissionDate: '2024-01-22T10:15:00Z'
  },
  {
    id: '9',
    serialNumber: 9,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'SMVD GROUP',
    applicantId: '8147',
    category: 'Facility Management',
    qualified: false,
    aiScore: 42,
    workflowStep: 'Document Verification',
    lastHumanReview: '2024-01-22T12:00:00Z',
    status: 'Disqualified',
    submissionDate: '2024-01-22T11:30:00Z'
  },
  {
    id: '10',
    serialNumber: 10,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'SECURE SERVICES (M/S HARSH ENGINEERING WORKS)',
    applicantId: '5620',
    category: 'Facility Management',
    qualified: true,
    aiScore: 82,
    workflowStep: 'Technical Evaluation',
    lastHumanReview: '2024-01-22T15:00:00Z',
    status: 'Qualified',
    submissionDate: '2024-01-22T12:45:00Z'
  },
  {
    id: '15',
    serialNumber: 15,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'M/s BOOSTUP INDIA SOLUTION',
    applicantId: '3968',
    category: 'Facility Management',
    qualified: true,
    aiScore: 91,
    workflowStep: 'Final Review',
    lastHumanReview: '2024-01-22T17:00:00Z',
    status: 'Qualified',
    submissionDate: '2024-01-22T16:45:00Z'
  }
];
const ApplicantDetail = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        
        // Fetch the specific applicant
        const { data: applicantData, error: applicantError } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', applicantId)
          .single();

        if (applicantError) {
          console.error('Error fetching applicant:', applicantError);
          toast({
            title: "Error",
            description: "Failed to load applicant data",
            variant: "destructive"
          });
          return;
        }

        // Fetch the related RFP
        const { data: rfpData, error: rfpError } = await supabase
          .from('rfps')
          .select('*')
          .eq('id', applicantData.rfp_id)
          .single();

        if (rfpError) {
          console.error('Error fetching RFP:', rfpError);
          toast({
            title: "Error",
            description: "Failed to load RFP data",
            variant: "destructive"
          });
          return;
        }

        // Transform the data - in real app this would be a utility function
        const transformedApplicant: Applicant = {
          id: applicantData.id,
          serialNumber: 1,
          rfpName: rfpData.name,
          rfpNumber: rfpData.number,
          applicantName: applicantData.applicant_name,
          applicantId: applicantData.application_number,
          category: rfpData.category,
          qualified: applicantData.qualification_status || false,
          aiScore: applicantData.ai_score || 0,
          workflowStep: applicantData.workflow_step,
          lastHumanReview: applicantData.updated_at,
          status: applicantData.status,
          submissionDate: applicantData.created_at
        };
        setApplicant(transformedApplicant);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (applicantId) {
      fetchApplicant();
    }
  }, [applicantId]);

  // Add missing state variables
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [searchVendorQuery, setSearchVendorQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [aiConfigExpanded, setAiConfigExpanded] = useState(false);
  const [aiAssistantExpanded, setAiAssistantExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedPersona, setSelectedPersona] = useState('technical');
  const [selectedOptimization, setSelectedOptimization] = useState('accuracy');
  const fileInputRef = useRef(null);

  // Mock data
  const Vendors = [
    { id: 1, name: "Tech Solutions Ltd" },
    { id: 2, name: "Digital Services Inc" }
  ];

  // Handler functions
  const handleSelectVendor = () => setShowVendorModal(true);
  const handleSelectDocument = () => setShowDocumentModal(true);
  const handleVendorSelect = (vendor) => {
    setCurrentVendor(vendor);
    setShowVendorModal(false);
  };
  const handleDocumentSelect = (doc) => {
    setCurrentDocument(doc);
    setShowDocumentModal(false);
  };
  const handleShare = () => {};
  const handleUploadFile = () => {};
  const handleFileChange = () => {};

  const handleGoBack = () => {
    navigate('/applicant-tracking');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-black">Loading applicant details...</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!applicant) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-black">Applicant not found</h2>
            <Button onClick={handleGoBack} className="mt-4 bg-black text-white hover:bg-red-accent">
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return <DashboardLayout>
      <div className="space-y-[15px] p-6 px-0 py-0">
        {/* Back Button */}
        <div className="flex items-center">
          <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2 hover:bg-red-accent/10 border-gray-200 text-black">
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        {/* Full Width Applicant Summary */}
        <div className="w-full">
          <ApplicantSummaryPanel applicant={applicant} />
        </div>

        {/* Tabbed Interface for Evaluation */}
        <MinimalTabs defaultValue="documents" className="space-y-[15px]">
          <MinimalTabsList className="bg-white rounded-[15px] border border-gray-200 p-1">
            <MinimalTabsTrigger value="documents" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <FileText size={16} />
              Document Center
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="ai-review" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Brain size={16} />
              AI Review Center
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="communication" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <MessageSquare size={16} />
              Communication Log
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="workflow" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <GitBranch size={16} />
              Applicant Workflow
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="summaries" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Download size={16} />
              Downloadable Summaries
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="chat" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Bot size={16} />
              <AITooltip
                content="AI-powered document evaluator using Document Parsing Model v2.1. Extracts structured data, scores compliance, and generates summaries from bidder documents. Confidence varies by document quality and standardization."
                type="generation"
                confidence={96}
                source="Document Parser v2.1"
              >
                <span>Procurement Document Evaluator</span>
              </AITooltip>
            </MinimalTabsTrigger>
          </MinimalTabsList>

          <MinimalTabsContent value="documents">
            <EnhancedDocumentCenter applicant={applicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="ai-review">
            <EnhancedAIReviewCenter applicant={applicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="communication">
            <CommunicationLog applicant={applicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="workflow">
            <ApplicantWorkflowView applicant={applicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="summaries">
            <DownloadableSummaries applicant={applicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="chat">
          <div className="w-full space-y-6">
              {/* Pinned Header - Full Width */}
              <div className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
                <header className="bg-white border-b border-gray-200 shadow-sm py-4 w-full">
                  <div className="flex items-center justify-between w-full pl-6 pr-6">
                    {/* Document Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                          {currentDocument ? currentDocument.name : "Procurement Document Evaluator"}
                        </h1>
                        <p className="text-sm text-gray-600">
                          {currentDocument ? `${currentDocument.type} • ${currentDocument.size}` : "Select a tender document to begin evaluation"}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-4">
                      {/* Permission Badge */}
                      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg border">
                        <Shield className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">Evaluate</span>
                      </div>

                      {/* Vendor Selection Modal */}
                      <Dialog open={showVendorModal} onOpenChange={setShowVendorModal}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={handleSelectVendor}
                          >
                            {currentVendor?.name ? (
                              <>
                                <span className="truncate max-w-[160px] inline-block align-middle">{currentVendor.name}</span>
                              </>
                            ) : (
                              'Select Vendor'
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-gray-200 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900">Select Vendor</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
                            <input
                              type="text"
                              placeholder="Search vendors..."
                              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={searchVendorQuery}
                              onChange={e => setSearchVendorQuery(e.target.value)}
                            />
                            {Vendors
                              .filter(doc =>
                                doc.name &&
                                doc.name.toLowerCase().includes(searchVendorQuery.toLowerCase())
                              )
                              .map((doc) => (
                              <div 
                                key={doc.id}
                                onClick={() => handleVendorSelect(doc)}
                                className="bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 group"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-gray-300">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="max-w-xs">
                                      <div className="relative">
                                        <div className="group/tooltip">
                                          <h3
                                            className="font-medium text-gray-900 max-w-xs truncate cursor-pointer"
                                            title={doc.name}
                                          >
                                            {doc.name}
                                          </h3>
                                          <span className="absolute left-0 z-10 hidden group-hover/tooltip:block bg-gray-900 text-white text-xs rounded px-2 py-1 mt-1 whitespace-pre-line max-w-xs break-words shadow-lg">
                                            {doc.name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Document Selection Modal */}
                      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={handleSelectDocument}
                          >
                            Select Document
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-gray-200 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900">Select Procurement Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
                            <input
                              type="text"
                              placeholder="Search documents..."
                              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                            />
                            {loading ? (
                              <div className="text-gray-500 text-center py-8">Loading documents...</div>
                            ) : error ? (
                              <div className="text-gray-700 text-center py-8">{error}</div>
                            ) : (
                              documents
                                .filter(doc =>
                                  doc.name &&
                                  doc.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((doc, index) => (
                                <div 
                                  key={doc.id || index}
                                  onClick={() => handleDocumentSelect(doc)}
                                  className="bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 group"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-gray-300">
                                      <FileText className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="max-w-xs">
                                        <div className="relative">
                                          <div className="group/tooltip">
                                            <h3
                                              className="font-medium text-gray-900 max-w-xs truncate cursor-pointer"
                                              title={doc.name}
                                            >
                                              {doc.name}
                                            </h3>
                                            <span className="absolute left-0 z-10 hidden group-hover/tooltip:block bg-gray-900 text-white text-xs rounded px-2 py-1 mt-1 whitespace-pre-line max-w-xs break-words shadow-lg">
                                              {doc.name}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>

                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={handleUploadFile}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload File"}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </header>
              </div>

              {/* Main Content Area */}
              <div className="max-w-7xl mx-auto pt-6 space-y-6">
                {/* AI Configuration Section */}
                <div className="bg-white border border-gray-200 shadow-sm transition-all duration-300" style={{ borderRadius: '15px' }}>
                  {/* Header - Always Visible */}
                  <div 
                    className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setAiConfigExpanded(!aiConfigExpanded)}
                    title={aiConfigExpanded ? "Collapse configuration" : "Expand configuration"}
                  >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <Settings className="w-5 h-5 text-foreground" />
                       <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
                     </div>
                     <div className="p-1 hover:bg-gray-100 transition-colors rounded-[15px]">
                       {aiConfigExpanded ? (
                         <ChevronUp className="w-4 h-4 text-gray-600" />
                       ) : (
                         <ChevronDown className="w-4 h-4 text-gray-600" />
                       )}
                     </div>
                   </div>
                 </div>

                 {/* Expandable Content */}
                 <div className={`transition-all duration-300 overflow-hidden ${aiConfigExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                   <div className="p-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {/* AI Model Selection */}
                       <div className="space-y-2">
                         <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                           <Brain className="w-4 h-4" />
                           <span>AI Model</span>
                         </label>
                         <Select value={selectedModel} onValueChange={setSelectedModel}>
                           <SelectTrigger className="w-full bg-white border-gray-300">
                             <SelectValue placeholder="Select AI Model" />
                           </SelectTrigger>
                           <SelectContent className="bg-white border-gray-200">
                             <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                             <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                             <SelectItem value="claude-3">Claude 3 Sonnet</SelectItem>
                             <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>

                       {/* AI Persona Selection */}
                       <div className="space-y-2">
                         <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                           <User className="w-4 h-4" />
                           <span>AI Persona</span>
                         </label>
                         <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                           <SelectTrigger className="w-full bg-white border-gray-300">
                             <SelectValue placeholder="Select Persona" />
                           </SelectTrigger>
                           <SelectContent className="bg-white border-gray-200">
                             <SelectItem value="procurement-expert">Procurement Expert</SelectItem>
                             <SelectItem value="legal-analyst">Legal Analyst</SelectItem>
                             <SelectItem value="financial-auditor">Financial Auditor</SelectItem>
                             <SelectItem value="technical-reviewer">Technical Reviewer</SelectItem>
                             <SelectItem value="compliance-officer">Compliance Officer</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>

                       {/* Optimization Technique */}
                       <div className="space-y-2">
                         <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                           <Target className="w-4 h-4" />
                           <span>Optimization</span>
                         </label>
                         <Select value={selectedOptimization} onValueChange={setSelectedOptimization}>
                           <SelectTrigger className="w-full bg-white border-gray-300">
                             <SelectValue placeholder="Select Technique" />
                           </SelectTrigger>
                           <SelectContent className="bg-white border-gray-200">
                             <SelectItem value="multi-shot">Accuracy (Multi-shot)</SelectItem>
                             <SelectItem value="long-shot">Context (Long-shot)</SelectItem>
                             <SelectItem value="chain-of-thought">Logic (Chain of Thought)</SelectItem>
                             <SelectItem value="few-shot">Learning (Few-shot)</SelectItem>
                             <SelectItem value="zero-shot">Speed (Zero-shot)</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                     </div>

                     {/* Quick Action Buttons */}
                     <div className="mt-6 space-y-3">
                       <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                         <Zap className="w-4 h-4" />
                         <span>Quick Improvements</span>
                       </h4>
                       <div className="flex flex-wrap gap-2">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => console.log('Quick action triggered: improve-accuracy')}
                           className="text-xs hover:bg-muted hover:border-border hover:text-foreground"
                           style={{ borderRadius: '15px' }}
                         >
                           <CheckCircle className="w-3 h-3 mr-1" />
                           Improve Accuracy
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => console.log('Quick action triggered: format-better')}
                           className="text-xs hover:bg-muted hover:border-border hover:text-foreground"
                           style={{ borderRadius: '15px' }}
                         >
                           <FileText className="w-3 h-3 mr-1" />
                           Format Better
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => console.log('Quick action triggered: enhance-context')}
                           className="text-xs hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                           style={{ borderRadius: '15px' }}
                         >
                           <Brain className="w-3 h-3 mr-1" />
                           Enhance Context
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => console.log('Quick action triggered: speed-optimize')}
                           className="text-xs hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700"
                           style={{ borderRadius: '15px' }}
                         >
                           <Zap className="w-3 h-3 mr-1" />
                           Speed Optimize
                         </Button>
                       </div>
                     </div>

                     <div className="mt-6 p-4 bg-gray-50 border border-gray-200" style={{ borderRadius: '15px' }}>
                       <p className="text-xs text-gray-600">
                         <strong>Current Configuration:</strong> {selectedModel} • {selectedPersona.replace('-', ' ')} • {selectedOptimization.replace('-', ' ')}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* AI Assistant Section */}
               <div className="bg-white border border-gray-200 shadow-sm transition-all duration-300" style={{ borderRadius: '15px' }}>
                 {/* Header - Always Visible */}
                 <div 
                   className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                   onClick={() => setAiAssistantExpanded(!aiAssistantExpanded)}
                   title={aiAssistantExpanded ? "Collapse assistant" : "Expand assistant"}
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <MessageSquare className="w-5 h-5 text-gray-600" />
                       <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                       <span className="text-sm text-gray-500">Procurement evaluation expert</span>
                     </div>
                     <div className="p-1 hover:bg-gray-100 transition-colors rounded-[15px]">
                       {aiAssistantExpanded ? (
                         <ChevronUp className="w-4 h-4 text-gray-600" />
                       ) : (
                         <ChevronDown className="w-4 h-4 text-gray-600" />
                       )}
                     </div>
                   </div>
                 </div>

                 {/* Expandable Content */}
                 <div className={`transition-all duration-300 overflow-hidden ${aiAssistantExpanded ? 'max-h-[400px]' : 'max-h-0'}`}>
                   <div className="p-4">
                     <AIChatInterface 
                       document={currentDocument}
                       vendor={currentVendor}
                       showHeader={false}
                       isExpanded={aiAssistantExpanded}
                       onToggleExpanded={setAiAssistantExpanded}
                     />
                   </div>
                 </div>
               </div>

              {/* Document Analysis Summary - Show when document is selected */}
              {currentDocument && (
                <div className="mb-6">
                  <DocumentAnalysisSummary document={currentDocument} currentVendor={currentVendor} />
                </div>
              )}

              {/* Empty State - Show when no document is selected */}
              {!currentDocument && (
                <div className="bg-white border border-gray-200 p-12 text-center shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 border border-gray-200 flex items-center justify-center" style={{ borderRadius: '15px' }}>
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin" style={{ borderRadius: '15px' }}></div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for Procurement Evaluation</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Select a tender document from the header to begin AI-powered compliance, technical, and financial evaluation
                  </p>
                </div>
              )}
              </div>
              </div>
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>;
};
export default ApplicantDetail;