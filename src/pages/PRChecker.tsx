import React, { useState, useRef, useEffect } from "react";
import { AITooltip } from "@/components/ui/ai-tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileCheck, Upload, CheckCircle, XCircle, AlertTriangle, FileText, Search, Download, Zap, Loader2, Trash2, ChevronDown, ChevronRight, BookOpen, Package, Link, FileX, Calendar, Users, ClipboardList } from "lucide-react";
import { PRCheckerKPICards } from "@/components/rfp/PRCheckerKPICards";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
const PRChecker = () => {
  const {
    toast
  } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedHistoricalRecords, setSelectedHistoricalRecords] = useState<number[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [isComparingRecords, setIsComparingRecords] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [assembledDocuments, setAssembledDocuments] = useState<any[]>([]);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [currentAssemblyStep, setCurrentAssemblyStep] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [contractLinks, setContractLinks] = useState<any[]>([]);
  const [isLinking, setIsLinking] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([{
    id: 1,
    title: "SAC Code Validation",
    description: "All service PRs must include valid SAC codes in header text for GST compliance as per government regulations",
    dateAdded: "2024-01-15",
    addedBy: "Priya Sharma"
  }, {
    id: 2,
    title: "Price Variance Threshold",
    description: "Price increases greater than 20% from last order require additional justification and approval from senior management",
    dateAdded: "2024-01-10",
    addedBy: "Rajesh Kumar"
  }, {
    id: 3,
    title: "Vendor Documentation Requirements",
    description: "All vendors must provide GST certificate, PAN card, bank details, and compliance certificates before processing any purchase request",
    dateAdded: "2024-01-08",
    addedBy: "Anita Patel"
  }]);
  const [newKnowledge, setNewKnowledge] = useState({
    title: "",
    description: ""
  });
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);
  const [animatingChecks, setAnimatingChecks] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [enhancedSummary, setEnhancedSummary] = useState<string>("");
  const [isGeneratingEnhanced, setIsGeneratingEnhanced] = useState(false);
  const [showEnhancedSummary, setShowEnhancedSummary] = useState(false);
  const validationResultsRef = useRef<HTMLDivElement>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} is ready for validation`
      });
    }
  };
  const handleValidation = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PR document to validate",
        variant: "destructive"
      });
      return;
    }
    setIsValidating(true);
    setValidationResults(null);
    setIsLoadingSkeleton(false);
    setAnimatingChecks([]);
    setShowScore(false);

    // Simulate PR validation process for core responsibilities
    setTimeout(() => {
      const mockResults = {
        overallScore: 85,
        status: "Validation Complete - Action Required",
        checks: [{
          name: "Purchase Group Validation",
          status: "passed",
          message: "Valid purchase group 'MAT-SERVICES' identified and verified with organizational master data"
        }, {
          name: "Customer Data Validation",
          status: "passed",
          message: "Customer information complete: Vendor details, delivery address, contact information validated"
        }, {
          name: "Service Line Items Validation",
          status: "warning",
          message: "7 service line items validated. 2 items (Lines 3,7) require detailed technical specifications"
        }, {
          name: "Valuation Check",
          status: "passed",
          message: "Total valuation ₹84,000 within approved purchase group limits (Max: ₹1,00,000)"
        }, {
          name: "Header Text - SAC Code",
          status: "failed",
          message: "SAC code missing in header text - Required for GST compliance (SAC:XXXX format)"
        }, {
          name: "Header Text - GST Applicability",
          status: "passed",
          message: "GST applicability (18%) clearly documented in header with tax calculations"
        }, {
          name: "Header Text - Required Elements",
          status: "warning",
          message: "Purchase order type and delivery terms present. Payment terms require clarification"
        }, {
          name: "Historical Price Comparison",
          status: "warning",
          message: "15% price increase vs. last 3 orders (Avg: ₹2,316/unit vs Current: ₹2,800/unit)"
        }, {
          name: "Contract/Tender Reference Check",
          status: "passed",
          message: "Valid tender reference TEN-2024-123 found and verified against contract database"
        }, {
          name: "Material Code Validation",
          status: "passed",
          message: "Material code MAT-001 validated against inventory master data"
        }],
        summary: "Comprehensive PR validation completed against organizational standards. Core field validations successful with 8/10 checks passed. Critical issue: SAC code missing for GST compliance. Price variance within acceptable threshold. Document structure and mandatory elements verified.",
        textSummary: "Service PR for IT maintenance equipment totaling ₹84,000. Purchase group MAT-SERVICES validated. Customer data complete with vendor ABC Suppliers Ltd. Service line items: 7 validated, 2 requiring specifications. GST applicability (18%) documented but SAC code missing. 15% price increase vs. historical average within acceptable range. Tender reference TEN-2024-123 verified.",
        recommendations: ["CRITICAL: Add SAC code to header text for GST compliance (Format: SAC:9954)", "Complete technical specifications for service line items 3 and 7", "Clarify payment terms in header (current: Net 30, recommended: Net 45)", "Document justification for 15% price increase in remarks section", "Add validated PR summary to knowledge base for future reference", "Generate scrutiny report highlighting all discrepancies"],
        scrutinyReport: {
          highlights: ["Purchase group validation: PASSED - MAT-SERVICES verified", "Customer data validation: PASSED - All mandatory fields present", "Valuation check: PASSED - ₹84,000 within limits", "GST documentation: PARTIAL - Rate present, SAC code missing"],
          discrepancies: ["CRITICAL: SAC code missing from header text (GST compliance requirement)", "Service line items 3,7: Technical specifications incomplete", "Payment terms unclear: 'Net 30' vs recommended 'Net 45'", "Price increase 15%: Within threshold but requires documentation"],
          complianceStatus: "REQUIRES ACTION",
          riskLevel: "MEDIUM",
          approvalRequired: true
        }
      };
      setValidationResults(mockResults);
      setIsValidating(false);
      setIsLoadingSkeleton(true);

      // Auto-scroll to validation results
      setTimeout(() => {
        validationResultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

      // Start skeleton loading for 5 seconds
      setTimeout(() => {
        setIsLoadingSkeleton(false);
        // Animate checks one by one
        mockResults.checks.forEach((_, index) => {
          setTimeout(() => {
            setAnimatingChecks(prev => [...prev, index]);
          }, index * 200);
        });

        // Show score animation after all checks
        setTimeout(() => {
          setShowScore(true);
        }, mockResults.checks.length * 200 + 500);
      }, 5000);
      toast({
        title: "Validation Complete",
        description: "PR has been validated successfully"
      });
    }, 3000);
  };
  const handleHistoricalSearch = async () => {
    setIsSearching(true);
    setSelectedHistoricalRecords([]);

    // Simulate historical data search
    setTimeout(() => {
      const mockHistoricalData = {
        contractReference: "PO-2024-001",
        materialCode: "MAT-001",
        results: [{
          id: 1,
          date: "2024-01-15",
          vendor: "ABC Suppliers Ltd",
          amount: "₹2,45,000",
          quantity: "100 units",
          pricePerUnit: "₹2,450",
          status: "Completed"
        }, {
          id: 2,
          date: "2023-12-10",
          vendor: "XYZ Materials Inc",
          amount: "₹2,12,000",
          quantity: "100 units",
          pricePerUnit: "₹2,120",
          status: "Completed"
        }, {
          id: 3,
          date: "2023-11-05",
          vendor: "ABC Suppliers Ltd",
          amount: "₹2,38,000",
          quantity: "100 units",
          pricePerUnit: "₹2,380",
          status: "Completed"
        }],
        analysis: {
          priceIncrease: "15.5%",
          averagePrice: "₹2,316",
          preferredVendor: "ABC Suppliers Ltd"
        }
      };
      setHistoricalData(mockHistoricalData);
      setIsSearching(false);
      toast({
        title: "Historical Data Retrieved",
        description: "Found 3 matching historical records"
      });
    }, 2000);
  };
  const handleRecordSelection = (recordId: number) => {
    setSelectedHistoricalRecords(prev => prev.includes(recordId) ? prev.filter(id => id !== recordId) : [...prev, recordId]);
  };
  const handleCompareRecords = async () => {
    if (selectedHistoricalRecords.length < 2) {
      toast({
        title: "Selection Required",
        description: "Please select at least 2 records to compare",
        variant: "destructive"
      });
      return;
    }
    setIsComparingRecords(true);
    setShowComparisonModal(true);

    // Simulate comparison analysis
    setTimeout(() => {
      const selectedRecords = historicalData.results.filter((record: any) => selectedHistoricalRecords.includes(record.id));
      const mockComparisonResults = {
        selectedRecords,
        analysis: {
          priceVariance: {
            highest: selectedRecords.reduce((max: any, record: any) => parseFloat(record.pricePerUnit.replace('₹', '').replace(',', '')) > parseFloat(max.pricePerUnit.replace('₹', '').replace(',', '')) ? record : max),
            lowest: selectedRecords.reduce((min: any, record: any) => parseFloat(record.pricePerUnit.replace('₹', '').replace(',', '')) < parseFloat(min.pricePerUnit.replace('₹', '').replace(',', '')) ? record : min),
            averagePrice: (selectedRecords.reduce((sum: number, record: any) => sum + parseFloat(record.pricePerUnit.replace('₹', '').replace(',', '')), 0) / selectedRecords.length).toFixed(2)
          },
          vendorPerformance: {
            mostFrequent: "ABC Suppliers Ltd",
            reliability: "High",
            deliveryConsistency: "98%"
          },
          trends: ["Price trend shows 8% annual increase", "Vendor consistency maintained across periods", "Quantity specifications remain stable", "Payment terms improved over time"],
          recommendations: ["Consider negotiating better rates with ABC Suppliers Ltd", "Review contract terms for bulk discounts", "Monitor quarterly price fluctuations", "Maintain preferred vendor relationship"]
        }
      };
      setComparisonResults(mockComparisonResults);
      setIsComparingRecords(false);
      toast({
        title: "Comparison Complete",
        description: `Analysis completed for ${selectedHistoricalRecords.length} selected records`
      });
    }, 3000);
  };
  const handleAddKnowledge = () => {
    if (!newKnowledge.title.trim() || !newKnowledge.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description",
        variant: "destructive"
      });
      return;
    }
    const newEntry = {
      id: knowledgeBase.length + 1,
      title: newKnowledge.title,
      description: newKnowledge.description,
      dateAdded: new Date().toISOString().split('T')[0],
      addedBy: "Current User"
    };
    setKnowledgeBase([...knowledgeBase, newEntry]);
    setNewKnowledge({
      title: "",
      description: ""
    });
    toast({
      title: "Knowledge Added",
      description: "New entry has been added to the knowledge base"
    });
  };
  const handleDeleteKnowledge = (id: number) => {
    setKnowledgeBase(knowledgeBase.filter(item => item.id !== id));
    toast({
      title: "Knowledge Deleted",
      description: "Entry has been removed from the knowledge base"
    });
  };
  const handleGenerateEnhancedSummary = async () => {
    if (!validationResults) {
      toast({
        title: "No Validation Data",
        description: "Please validate a PR first",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingEnhanced(true);
    setShowEnhancedSummary(false);

    // Simulate AI-powered enhanced summary generation
    setTimeout(() => {
      const mockEnhancedSummary = `**AI-Enhanced PR Analysis Summary**

**Executive Overview:**
This IT maintenance equipment procurement request demonstrates strong foundational compliance with organizational standards, achieving an 85% validation score. The request involves MAT-SERVICES purchase group for ₹84,000 in service acquisitions.

**Critical Findings & Business Impact:**
• **IMMEDIATE ACTION REQUIRED:** SAC code absence creates GST compliance risk and potential audit exposure
• **Price Analysis:** 15% increase vs. historical average (₹2,316 vs ₹2,800/unit) remains within acceptable variance but requires documentation
• **Vendor Relationship:** ABC Suppliers Ltd maintains preferred status with 98% delivery consistency

**AI-Powered Risk Assessment:**
- **Compliance Risk:** MEDIUM - SAC code deficiency impacts tax documentation
- **Financial Risk:** LOW - Pricing within organizational thresholds  
- **Operational Risk:** LOW - Vendor reliability established
- **Timeline Risk:** MEDIUM - Pending technical specifications may delay delivery

**Strategic Recommendations:**
1. **Immediate:** Insert SAC code 9954 for IT maintenance services
2. **Short-term:** Complete technical specifications for service lines 3,7
3. **Medium-term:** Negotiate annual contract with ABC Suppliers for price stability
4. **Long-term:** Establish automated SAC code validation in PR workflow

**Knowledge Base Integration:**
This validation reveals systematic gaps in SAC code enforcement. Recommend updating validation templates and training materials.

**Confidence Score:** 92% (Based on data completeness and historical pattern analysis)`;
      setEnhancedSummary(mockEnhancedSummary);
      setIsGeneratingEnhanced(false);
      setShowEnhancedSummary(true);
      toast({
        title: "Enhanced Summary Generated",
        description: "AI-powered analysis complete with actionable insights"
      });
    }, 4000);
  };
  const handleAddToKnowledgeBase = () => {
    if (!validationResults || !enhancedSummary) {
      toast({
        title: "Missing Data",
        description: "Please generate enhanced summary first",
        variant: "destructive"
      });
      return;
    }
    const newEntry = {
      id: knowledgeBase.length + 1,
      title: `PR Validation - ${selectedFile?.name || 'Unknown File'} (${new Date().toLocaleDateString()})`,
      description: `Validation Score: ${validationResults.overallScore}% | Status: ${validationResults.status} | Key Issues: SAC code missing, Technical specs incomplete | Enhanced Summary: ${enhancedSummary.substring(0, 200)}...`,
      dateAdded: new Date().toISOString().split('T')[0],
      addedBy: "AI System",
      type: "PR Validation",
      metadata: {
        validationScore: validationResults.overallScore,
        criticalIssues: validationResults.checks.filter((check: any) => check.status === 'failed').length,
        enhancedSummary: enhancedSummary
      }
    };
    setKnowledgeBase([newEntry, ...knowledgeBase]);
    toast({
      title: "Added to Knowledge Base",
      description: "PR validation results and enhanced summary have been saved"
    });
  };
  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Scrutiny report has been downloaded successfully"
    });
  };

  // Document Assembly Handler with Progress Animation
  const handleDocumentAssembly = async () => {
    setIsAssembling(true);
    setAssemblyProgress(0);
    setAssembledDocuments([]);
    const steps = ["Scanning scrutiny reports...", "Processing negotiations data...", "Compiling TC minutes...", "Integrating email communications...", "Assembling SOW documents...", "Including SCC specifications...", "Adding SOQ details...", "Finalizing BEC/BRC documents...", "Collecting vendor qualification documents...", "Integrating compliance certificates...", "Processing payment terms documentation...", "Assembling technical specifications...", "Generating unified proposal..."];

    // Simulate progressive assembly with animations
    for (let i = 0; i < steps.length; i++) {
      setCurrentAssemblyStep(steps[i]);
      setAssemblyProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Generate final document
    setTimeout(() => {
      const mockAssembledDocuments = [{
        id: 1,
        name: "Unified_Proposal_PR-2024-001.pdf",
        type: "Unified Proposal",
        size: "4.2 MB",
        generatedAt: new Date().toISOString(),
        components: ["Scrutiny Report", "Negotiations Documentation", "TC Minutes", "Email Communications", "SOW (Statement of Work)", "SCC (Special Conditions of Contract)", "SOQ (Schedule of Quantities)", "BEC (Bid Evaluation Criteria)", "BRC (Bid Review Committee Report)", "Vendor Qualification Documents", "Compliance Certificates", "Payment Terms Documentation", "Technical Specifications", "Contract Amendments", "Performance Guarantees"],
        status: "Generated",
        content: "This is a comprehensive unified proposal document containing all validated components including scrutiny reports, negotiation records, technical committee minutes, email communications, SOW, SCC, SOQ, BEC/BRC documents, vendor qualifications, compliance certificates, and contract documentation."
      }];
      setAssembledDocuments(mockAssembledDocuments);
      setIsAssembling(false);
      setAssemblyProgress(100);
      setCurrentAssemblyStep("Complete!");

      // Auto-scroll to generated documents
      setTimeout(() => {
        const element = document.getElementById("generated-documents");
        element?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 500);
      toast({
        title: "Document Assembly Complete",
        description: "Unified proposal document has been generated successfully"
      });
    }, 1000);
  };

  // Contract Linking Handler
  const handleContractLinking = async () => {
    setIsLinking(true);

    // Simulate contract linking process
    setTimeout(() => {
      const mockContractLinks = [{
        id: 1,
        prReference: "PR-2024-001",
        contractId: "CON-2024-045",
        tenderReference: "TEN-2024-123",
        status: "Linked",
        linkedAt: new Date().toISOString(),
        postBidFlow: {
          status: "Active",
          nextStep: "Automated Document Generation",
          currentPhase: "Post-Bid Contract Processing",
          automatedDocs: ["Contract Amendment Templates", "Performance Bond Documentation", "Delivery Schedule Templates", "Payment Milestone Templates", "Compliance Verification Forms", "Vendor Performance Scorecards", "Risk Assessment Reports", "Quality Assurance Checklists", "Insurance Requirement Forms", "Change Order Templates"],
          generationStatus: "In Progress",
          completedDocs: 6,
          totalDocs: 10,
          estimatedCompletion: "15 minutes"
        }
      }];
      setContractLinks(mockContractLinks);
      setIsLinking(false);
      toast({
        title: "Contract Linking Complete",
        description: "PR has been linked to post-bid contract flow"
      });
    }, 2000);
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-foreground text-2xl">Purchase Requisitions Checker Management</h1>
            <p className="text-muted-foreground mt-1">
              Core PR validation, comparison, documentation assembly, and contract linking workflow
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* KPI Cards */}
        <PRCheckerKPICards />

        <Tabs defaultValue="validation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="validation" className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              PR Validation
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Historical Comparison
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="assembly" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document Assembly
            </TabsTrigger>
            <TabsTrigger value="contract-link" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Contract Linking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload PR Document for Core Validation
                </CardTitle>
                <CardDescription>
                  Upload PR document for validation of purchase group, customer data, service line items, valuation, and header text elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" id="pr-upload" className="hidden" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={handleFileUpload} />
                  <label htmlFor="pr-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      PDF, DOC, DOCX, XLS, XLSX up to 10MB
                    </span>
                  </label>
                </div>
                
                {selectedFile && <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <Button onClick={handleValidation} disabled={isValidating} className="flex items-center space-x-2 transition-all duration-300">
                      {isValidating ? <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Validating...</span>
                        </> : <>
                          <Zap className="w-4 h-4" />
                          <span>Start Validation</span>
                        </>}
                    </Button>
                  </div>}
              </CardContent>
            </Card>

            {/* Validation Results */}
            {validationResults && <Card className="animate-fade-in" ref={validationResultsRef}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="animate-slide-in-right">Validation Results</CardTitle>
                    {showScore && <Badge variant="outline" className="text-lg px-3 py-1 animate-pulse scale-110 transition-all duration-1000 bg-green-100 text-green-800 border-green-300">
                        Score: {validationResults.overallScore}/100
                      </Badge>}
                  </div>
                  <CardDescription>
                    Status: {validationResults.status}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Validation Checks */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Validation Checks</h3>
                    <div className="space-y-2">
                      {isLoadingSkeleton ?
                  // Skeleton Loading
                  Array.from({
                    length: 7
                  }).map((_, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3 flex-1">
                              <Skeleton className="w-4 h-4 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-3 w-[300px]" />
                              </div>
                            </div>
                            <Skeleton className="h-6 w-[60px] rounded-full" />
                          </div>) :
                  // Actual Results with Animation
                  validationResults.checks.map((check: any, index: number) => {
                    const getTooltipContent = (checkName: string, status: string) => {
                      switch (checkName) {
                        case "SAC Code":
                          return status === "failed" ? "SAC code missing in header text. AI scanned sections 1-3 and header for required format 'SAC:XXXX'. Required for GST compliance per policy KB-001." : "SAC code validated successfully. Found 'SAC:9954' in header text matching required format.";
                        case "Historical Comparison":
                          return "AI compared current pricing (₹2,800/unit) with last 3 orders. Avg historical price: ₹2,433/unit. 15% increase detected - threshold is 20%.";
                        case "Valuation":
                          return "Total valuation (₹84,000) analyzed against purchase group limits. Within approved range (Max: ₹1,00,000). AI confidence: 99.2%.";
                        case "Purchase Group":
                          return "Purchase Group 'MAT-SERVICES' identified from line items. Validated against organizational master data. AI confidence: 98.5%.";
                        case "Service Line Items":
                          return "2 service line items flagged for additional validation: Items 3,7 missing detailed specifications. AI detected incomplete technical requirements.";
                        default:
                          return `${checkName} validation completed using AI analysis. Processing confidence varies by data quality and standardization.`;
                      }
                    };
                    return <AITooltip key={index} content={getTooltipContent(check.name, check.status)} type={check.status === "failed" ? "flag" : "validation"} confidence={check.status === "passed" ? 98 : check.status === "warning" ? 85 : 65} source={check.name === "SAC Code" ? "Header Text Analysis" : check.name === "Historical Comparison" ? "Historical Data Engine" : "Document Parser v2.1"}>
                              <div className={`flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-300 ${animatingChecks.includes(index) ? 'animate-fade-in opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'}`}>
                                <div className="flex items-center space-x-3">
                                  {getStatusIcon(check.status)}
                                  <div>
                                    <span className="font-medium">{check.name}</span>
                                    <p className="text-sm text-muted-foreground">{check.message}</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(check.status)}>
                                  {check.status}
                                </Badge>
                              </div>
                            </AITooltip>;
                  })}
                    </div>
                  </div>

                  {/* Enhanced Summary Section */}
                  {!isLoadingSkeleton && showEnhancedSummary && <div className="animate-fade-in">
                      <h3 className="text-lg font-semibold mb-3">Enhanced Summary</h3>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                        <div className="prose prose-sm max-w-none">
                          {enhancedSummary.split('\n').map((line, index) => <p key={index} className="mb-2 text-foreground">
                              {line.startsWith('**') && line.endsWith('**') ? <strong className="text-purple-800">{line.slice(2, -2)}</strong> : line.startsWith('•') ? <span className="ml-4 block">{line}</span> : line.startsWith('- ') ? <span className="ml-6 block text-gray-700">{line}</span> : line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') ? <span className="ml-4 block font-medium text-blue-700">{line}</span> : line}
                            </p>)}
                        </div>
                      </div>
                    </div>}

                  {/* PR Text Summary */}
                  {!isLoadingSkeleton && <div className="animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">PR Text Summary</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleGenerateEnhancedSummary} disabled={isGeneratingEnhanced} className="flex items-center space-x-2">
                            {isGeneratingEnhanced ? <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating...</span>
                              </> : <>
                                <Zap className="w-4 h-4" />
                                <span>Generate Enhanced Summary</span>
                              </>}
                          </Button>
                          {showEnhancedSummary && <Button variant="default" size="sm" onClick={handleAddToKnowledgeBase} className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4" />
                              <span>Add to Knowledge Base</span>
                            </Button>}
                        </div>
                      </div>

                      {/* Skeleton Loader for Enhanced Summary */}
                      {isGeneratingEnhanced && <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="space-y-2 mt-4">
                              <Skeleton className="h-3 w-1/2" />
                              <Skeleton className="h-3 w-2/3" />
                              <Skeleton className="h-3 w-3/4" />
                              <Skeleton className="h-3 w-1/3" />
                            </div>
                            <div className="space-y-2 mt-4">
                              <Skeleton className="h-3 w-2/3" />
                              <Skeleton className="h-3 w-1/2" />
                              <Skeleton className="h-3 w-3/4" />
                            </div>
                          </div>
                        </div>}
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2">Standard Summary</h4>
                          <p className="text-foreground text-sm">
                            {validationResults.textSummary}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-800 mb-2">AI-Generated Insights</h4>
                          <ul className="text-sm space-y-1">
                            <li>• <strong>Processing Priority:</strong> Standard (5-7 business days)</li>
                            <li>• <strong>Financial Impact:</strong> Within budget allocation for Q1 2024</li>
                            <li>• <strong>Vendor Reliability:</strong> ABC Suppliers Ltd rated 4.8/5.0</li>
                            <li>• <strong>Compliance Gap:</strong> SAC code addition required for final approval</li>
                            <li>• <strong>Risk Level:</strong> Medium - manageable with documentation update</li>
                          </ul>
                        </div>
                      </div>
                    </div>}

                  {/* Validation Summary */}
                  {!isLoadingSkeleton && <div className="animate-fade-in">
                      <h3 className="text-lg font-semibold mb-3">Summary</h3>
                      <p className="text-foreground bg-muted p-4 rounded-lg">
                        {validationResults.summary}
                      </p>
                    </div>}

                  {/* Recommendations */}
                  {!isLoadingSkeleton && <div className="animate-fade-in">
                      <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {validationResults.recommendations.map((rec: string, index: number) => <li key={index} className="flex items-start space-x-2 animate-fade-in" style={{
                    animationDelay: `${index * 150}ms`
                  }}>
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{rec}</span>
                          </li>)}
                      </ul>
                    </div>}

                  {/* Scrutiny Report */}
                  {!isLoadingSkeleton && validationResults.scrutinyReport && <div className="animate-fade-in">
                      <h3 className="text-lg font-semibold mb-3">Scrutiny Report</h3>
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Highlights</h4>
                            <ul className="space-y-1">
                              {validationResults.scrutinyReport.highlights.map((highlight: string, index: number) => <li key={index} className="text-sm flex items-start space-x-2">
                                  <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">Discrepancies</h4>
                            <ul className="space-y-1">
                              {validationResults.scrutinyReport.discrepancies.map((discrepancy: string, index: number) => <li key={index} className="text-sm flex items-start space-x-2">
                                  <XCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                  <span>{discrepancy}</span>
                                </li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="border-t pt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Compliance Status: </span>
                            <Badge className={validationResults.scrutinyReport.complianceStatus === "COMPLIANT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {validationResults.scrutinyReport.complianceStatus}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Risk Level: </span>
                            <Badge className={validationResults.scrutinyReport.riskLevel === "LOW" ? "bg-green-100 text-green-800" : validationResults.scrutinyReport.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                              {validationResults.scrutinyReport.riskLevel}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Approval Required: </span>
                            <Badge className={validationResults.scrutinyReport.approvalRequired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                              {validationResults.scrutinyReport.approvalRequired ? "YES" : "NO"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {/* Actions */}
                  {!isLoadingSkeleton && <div className="flex space-x-3 pt-4 border-t">
                      <Button variant="outline" className="flex items-center space-x-2" onClick={handleDownloadReport}>
                        <Download className="w-4 h-4" />
                        <span>Download Scrutiny Report</span>
                      </Button>
                      
                    </div>}
                </CardContent>
              </Card>}

            {/* Previously Uploaded Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Previously Uploaded Documents
                </CardTitle>
                <CardDescription>
                  Review previously uploaded PR documents and their validation results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[{
                  id: 1,
                  name: "PR-2024-001_ServiceRequest.pdf",
                  uploadDate: "2024-01-15",
                  status: "Validated",
                  score: 92,
                  summary: "Service PR for IT equipment maintenance. All validations passed. SAC code compliant. Minor pricing variance within threshold.",
                  checks: [{
                    name: "Purchase Group",
                    status: "passed",
                    message: "Valid purchase group identified"
                  }, {
                    name: "Customer Data",
                    status: "passed",
                    message: "Customer information complete"
                  }, {
                    name: "Service Line Items",
                    status: "passed",
                    message: "All line items validated successfully"
                  }, {
                    name: "Valuation",
                    status: "passed",
                    message: "Pricing within acceptable range"
                  }, {
                    name: "SAC Code",
                    status: "passed",
                    message: "SAC code present in header text"
                  }, {
                    name: "GST Applicability",
                    status: "passed",
                    message: "GST requirements documented"
                  }, {
                    name: "Historical Comparison",
                    status: "warning",
                    message: "8% price increase from last order"
                  }]
                }, {
                  id: 2,
                  name: "PR-2024-002_MaterialProcurement.xlsx",
                  uploadDate: "2024-01-12",
                  status: "Issues Found",
                  score: 76,
                  summary: "Material procurement PR with missing vendor documentation. GST compliance verified. Requires additional approval for price increase.",
                  checks: [{
                    name: "Purchase Group",
                    status: "passed",
                    message: "Valid purchase group identified"
                  }, {
                    name: "Customer Data",
                    status: "warning",
                    message: "Vendor documentation incomplete"
                  }, {
                    name: "Service Line Items",
                    status: "passed",
                    message: "All line items validated successfully"
                  }, {
                    name: "Valuation",
                    status: "warning",
                    message: "Pricing requires approval"
                  }, {
                    name: "SAC Code",
                    status: "passed",
                    message: "SAC code present in header text"
                  }, {
                    name: "GST Applicability",
                    status: "passed",
                    message: "GST requirements documented"
                  }, {
                    name: "Historical Comparison",
                    status: "failed",
                    message: "25% price increase exceeds threshold"
                  }]
                }, {
                  id: 3,
                  name: "PR-2024-003_ConsultingServices.docx",
                  uploadDate: "2024-01-10",
                  status: "Validated",
                  score: 88,
                  summary: "Professional services PR. Contract terms reviewed. Payment schedule aligned with organizational policies. Minor formatting issues noted.",
                  checks: [{
                    name: "Purchase Group",
                    status: "passed",
                    message: "Valid purchase group identified"
                  }, {
                    name: "Customer Data",
                    status: "passed",
                    message: "Customer information complete"
                  }, {
                    name: "Service Line Items",
                    status: "warning",
                    message: "Minor formatting issues in descriptions"
                  }, {
                    name: "Valuation",
                    status: "passed",
                    message: "Pricing within acceptable range"
                  }, {
                    name: "SAC Code",
                    status: "passed",
                    message: "SAC code present in header text"
                  }, {
                    name: "GST Applicability",
                    status: "passed",
                    message: "GST requirements documented"
                  }, {
                    name: "Historical Comparison",
                    status: "passed",
                    message: "Pricing consistent with historical data"
                  }]
                }].map(doc => <Collapsible key={doc.id}>
                      <div className="border rounded-lg hover:shadow-md transition-all duration-200">
                        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{doc.name}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-muted-foreground">Uploaded: {doc.uploadDate}</span>
                                <Badge className={doc.status === "Validated" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {doc.status}
                                </Badge>
                                <span className="text-sm font-medium text-foreground">Score: {doc.score}/100</span>
                              </div>
                            </div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="px-4 pb-4">
                          <div className="space-y-4 pt-4 border-t">
                            {/* Score Display */}
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold">Validation Results</h4>
                              <Badge variant="outline" className={`text-lg px-3 py-1 ${doc.score >= 90 ? "bg-green-100 text-green-800 border-green-300" : doc.score >= 75 ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-800 border-red-300"}`}>
                                Score: {doc.score}/100
                              </Badge>
                            </div>

                            {/* Validation Checks */}
                            <div>
                              <h5 className="font-medium mb-3">Validation Checks</h5>
                              <div className="space-y-2">
                                {doc.checks.map((check, index) => <AITooltip key={index} content={`${check.name} validation: ${check.message}. Historical analysis and compliance check completed.`} type={check.status === "failed" ? "flag" : "validation"} confidence={check.status === "passed" ? 98 : check.status === "warning" ? 85 : 65} source="Document Parser v2.1">
                                    <div className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-all duration-200">
                                      <div className="flex items-center space-x-3">
                                        {getStatusIcon(check.status)}
                                        <div>
                                          <span className="font-medium">{check.name}</span>
                                          <p className="text-sm text-muted-foreground">{check.message}</p>
                                        </div>
                                      </div>
                                      <Badge className={getStatusColor(check.status)}>
                                        {check.status}
                                      </Badge>
                                    </div>
                                  </AITooltip>)}
                              </div>
                            </div>

                            {/* Summary */}
                            <div>
                              <h5 className="font-medium mb-2">Summary</h5>
                              <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                                {doc.summary}
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historical PR Comparison</CardTitle>
                <CardDescription>
                  Compare current PR with historical PRs using PO/Contract/Tender reference and material code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="po-reference">PO/Contract Reference</Label>
                      <Input id="po-reference" placeholder="Enter reference number" defaultValue="PO-2024-001" />
                    </div>
                    <div>
                      <Label htmlFor="material-code">Material Code</Label>
                      <Input id="material-code" placeholder="Enter material code" defaultValue="MAT-001" />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleHistoricalSearch} disabled={isSearching}>
                    {isSearching ? <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </> : <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Historical Data
                      </>}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Historical Data Results */}
            {historicalData && <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Historical Data Results</CardTitle>
                  <CardDescription>
                    Found {historicalData.results.length} matching historical records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Analysis Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <AITooltip content="AI analyzed pricing variance by comparing current PR amount with last 3 historical orders. Calculated using weighted average considering quantity and date proximity. Alert threshold: 20%." type="validation" confidence={94} source="Historical Data Engine">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Price Increase</p>
                        <p className="text-xl font-bold text-red-600">{historicalData.analysis.priceIncrease}</p>
                      </div>
                    </AITooltip>
                    <AITooltip content="Calculated from 3 historical orders: ₹2,450 (Jan), ₹2,120 (Dec), ₹2,380 (Nov). Weighted by quantity and recency. Used for variance analysis and budget planning." type="extraction" confidence={99} source="Historical Data Engine">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Average Price</p>
                        <p className="text-xl font-bold text-foreground">{historicalData.analysis.averagePrice}</p>
                      </div>
                    </AITooltip>
                    <AITooltip content="AI identified based on order frequency (2/3 orders), delivery performance, and price competitiveness. Preferred vendor gets expedited approval process." type="generation" confidence={87} source="Vendor Analytics Engine">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Preferred Vendor</p>
                        <p className="text-xl font-bold text-green-600">{historicalData.analysis.preferredVendor}</p>
                      </div>
                    </AITooltip>
                  </div>

                  {/* Historical Records Table */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Historical Records</h3>
                      <Button onClick={handleCompareRecords} disabled={selectedHistoricalRecords.length < 2} className="flex items-center space-x-2" variant={selectedHistoricalRecords.length >= 2 ? "default" : "outline"}>
                        <Search className="w-4 h-4" />
                        <span>Compare Selected ({selectedHistoricalRecords.length})</span>
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price/Unit</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historicalData.results.map((record: any, index: number) => <TableRow key={record.id} className="animate-fade-in" style={{
                      animationDelay: `${index * 100}ms`
                    }}>
                            <TableCell>
                              <Checkbox checked={selectedHistoricalRecords.includes(record.id)} onCheckedChange={() => handleRecordSelection(record.id)} />
                            </TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.vendor}</TableCell>
                            <TableCell>{record.amount}</TableCell>
                            <TableCell>{record.quantity}</TableCell>
                            <TableCell>{record.pricePerUnit}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>}
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            {/* Add New Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Knowledge</CardTitle>
                <CardDescription>
                  Add validation rules and insights to the knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rule-title">Validation Rule Title</Label>
                  <Input id="rule-title" placeholder="Enter rule title" value={newKnowledge.title} onChange={e => setNewKnowledge({
                  ...newKnowledge,
                  title: e.target.value
                })} />
                </div>
                <div>
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea id="rule-description" placeholder="Describe the validation rule or insight" rows={4} value={newKnowledge.description} onChange={e => setNewKnowledge({
                  ...newKnowledge,
                  description: e.target.value
                })} />
                </div>
                <Button className="w-full" onClick={handleAddKnowledge}>
                  Add to Knowledge Base
                </Button>
              </CardContent>
            </Card>

            {/* Knowledge Base Table */}
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Entries</CardTitle>
                <CardDescription>
                  All validation rules and insights in the knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">SL NO</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Added By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {knowledgeBase.map((entry, index) => <TableRow key={entry.id} className="animate-fade-in" style={{
                    animationDelay: `${index * 100}ms`
                  }}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{entry.title}</TableCell>
                        <TableCell className="max-w-xs">
                          <AITooltip content={entry.description} type="validation" confidence={95} source="Knowledge Base">
                            <span className="truncate block cursor-help">
                              {entry.description}
                            </span>
                          </AITooltip>
                        </TableCell>
                        <TableCell>{entry.dateAdded}</TableCell>
                        <TableCell>{entry.addedBy}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteKnowledge(entry.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Assembly Tab */}
          <TabsContent value="assembly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Document Assembly - Unified Proposal
                </CardTitle>
                <CardDescription>
                  Assemble validated documents: Scrutiny reports, Negotiations, TC Minutes, Email Communications, SOW, SCC, SOQ, BEC/BRC into unified proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Components Grid */}
                <div className="space-y-6">
                  {/* Document Components - Horizontal Layout */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileX className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Document Components</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[{
                      name: "Scrutiny Report",
                      status: "ready",
                      size: "1.2 MB"
                    }, {
                      name: "Negotiations",
                      status: "ready",
                      size: "800 KB"
                    }, {
                      name: "TC Minutes",
                      status: "ready",
                      size: "650 KB"
                    }, {
                      name: "Email Communications",
                      status: "ready",
                      size: "2.1 MB"
                    }, {
                      name: "SOW",
                      status: "ready",
                      size: "1.8 MB"
                    }, {
                      name: "SCC",
                      status: "ready",
                      size: "900 KB"
                    }, {
                      name: "SOQ",
                      status: "ready",
                      size: "1.1 MB"
                    }, {
                      name: "BEC/BRC",
                      status: "ready",
                      size: "750 KB"
                    }].map((doc, index) => <div key={doc.name} className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 hover:shadow-md text-center ${isAssembling ? 'animate-pulse' : 'hover:border-primary/30'}`}>
                          <FileCheck className={`w-5 h-5 mb-2 ${doc.status === 'ready' ? 'text-red-600' : 'text-gray-400'} ${isAssembling ? 'animate-pulse' : ''}`} />
                          <div className="space-y-1">
                            <span className="font-medium text-sm">{doc.name}</span>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                          <CheckCircle className={`w-4 h-4 mt-2 ${doc.status === 'ready' ? 'text-red-600' : 'text-gray-400'}`} />
                        </div>)}
                    </div>
                  </div>

                  {/* Assembly Configuration - Bottom Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Assembly Configuration</h3>
                    </div>
                    
                    {/* Basic Options */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-3 text-sm text-muted-foreground">Basic Options</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="include-watermark" defaultChecked className="rounded" />
                          <label htmlFor="include-watermark" className="text-sm font-medium">Official Watermark</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="auto-index" defaultChecked className="rounded" />
                          <label htmlFor="auto-index" className="text-sm font-medium">Auto-Generate Index</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="digital-signature" defaultChecked className="rounded" />
                          <label htmlFor="digital-signature" className="text-sm font-medium">Digital Signature</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="version-control" defaultChecked className="rounded" />
                          <label htmlFor="version-control" className="text-sm font-medium">Version Control</label>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="border border-blue-200 p-4 rounded-lg bg-slate-50">
                      <h4 className="font-medium mb-3 text-sm text-blue-800">Advanced Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="confidential-marking" className="rounded" />
                            <label htmlFor="confidential-marking" className="text-sm font-medium">Confidential Marking</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="audit-trail" defaultChecked className="rounded" />
                            <label htmlFor="audit-trail" className="text-sm font-medium">Include Audit Trail</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="compliance-check" defaultChecked className="rounded" />
                            <label htmlFor="compliance-check" className="text-sm font-medium">Compliance Verification</label>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="password-protect" className="rounded" />
                            <label htmlFor="password-protect" className="text-sm font-medium">Password Protection</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="expiry-date" className="rounded" />
                            <label htmlFor="expiry-date" className="text-sm font-medium">Set Expiry Date</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notification-alerts" className="rounded" />
                            <label htmlFor="notification-alerts" className="text-sm font-medium">Email Notifications</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Format & Quality Options */}
                    <div className="border border-green-200 p-4 rounded-lg bg-slate-50">
                      <h4 className="font-medium mb-3 text-sm text-green-800">Format & Quality Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Output Format</label>
                          <select className="w-full p-2 text-sm border border-gray-300 rounded-md">
                            <option value="pdf">PDF Document</option>
                            <option value="docx">Word Document</option>
                            <option value="both">Both Formats</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Quality Level</label>
                          <select className="w-full p-2 text-sm border border-gray-300 rounded-md">
                            <option value="high">High Quality</option>
                            <option value="standard">Standard</option>
                            <option value="compressed">Compressed</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Page Layout</label>
                          <select className="w-full p-2 text-sm border border-gray-300 rounded-md">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                            <option value="auto">Auto-Detect</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {isAssembling && <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Assembly in Progress</span>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{
                          width: `${assemblyProgress}%`
                        }}></div>
                          </div>
                          <p className="text-xs text-blue-700">{currentAssemblyStep}</p>
                          <p className="text-xs text-blue-600">{Math.round(assemblyProgress)}% Complete</p>
                        </div>
                      </div>}

                    {/* Generate Button */}
                    <Button className="w-full h-12 text-base font-semibold" onClick={handleDocumentAssembly} disabled={isAssembling} size="lg">
                      {isAssembling ? <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Assembling Documents...
                        </> : <>
                          <Package className="w-5 h-5 mr-2" />
                          Generate Unified Proposal
                        </>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Documents Results */}
            {assembledDocuments.length > 0 && <Card id="generated-documents" className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Generated Documents
                  </CardTitle>
                  <CardDescription>
                    Successfully assembled documents ready for download and review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assembledDocuments.map((doc, index) => <div key={doc.id} style={{
                  animationDelay: `${index * 200}ms`
                }} className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-red-50 to-gray-50 border-red-200 animate-scale-in bg-[#70a0b5]/[0.31]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <FileText className="w-8 h-8 text-primary" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{doc.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.type} • {doc.size} • Generated: {new Date(doc.generatedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-red-100 text-red-800 border-red-300 px-3 py-1">
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-4 p-4 bg-white/70 rounded-lg border border-red-100">
                          <p className="text-sm font-medium mb-2 text-red-800">Included Components:</p>
                          <div className="flex flex-wrap gap-2">
                            {doc.components.map((component: string, index: number) => <Badge key={index} variant="outline" className="text-xs bg-white text-red-700 border-red-200 hover:bg-red-50 transition-colors">
                                {component}
                              </Badge>)}
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-2">
                          <Dialog open={isDocumentViewerOpen} onOpenChange={setIsDocumentViewerOpen}>
                            <DialogTrigger asChild>
                              <Button variant="default" size="sm" className="hover-scale" onClick={() => setSelectedDocument(doc)}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Document
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                          
                          <Button variant="outline" size="sm" className="hover-scale">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          
                          <Button variant="outline" size="sm" className="hover-scale">
                            <Users className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}

            {/* Previously Generated Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Previously Generated Documents
                </CardTitle>
                <CardDescription>
                  View and manage previously assembled unified proposal documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[{
                  id: 1,
                  name: "Unified_Proposal_PR-2024-002.pdf",
                  type: "Unified Proposal",
                  size: "3.1 MB",
                  generatedAt: "2024-01-20T10:30:00Z",
                  status: "Completed",
                  components: ["Scrutiny Report", "Negotiations", "TC Minutes", "Email Communications", "SOW", "SCC"],
                  downloads: 5
                }, {
                  id: 2,
                  name: "Unified_Proposal_PR-2024-003.pdf",
                  type: "Unified Proposal",
                  size: "2.8 MB",
                  generatedAt: "2024-01-18T14:15:00Z",
                  status: "Completed",
                  components: ["Scrutiny Report", "Negotiations", "SOW", "SCC", "SOQ", "BEC/BRC"],
                  downloads: 12
                }, {
                  id: 3,
                  name: "Unified_Proposal_PR-2024-004.pdf",
                  type: "Unified Proposal",
                  size: "2.2 MB",
                  generatedAt: "2024-01-15T09:45:00Z",
                  status: "Completed",
                  components: ["Scrutiny Report", "TC Minutes", "Email Communications", "SOW"],
                  downloads: 8
                }].map((doc, index) => <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <FileText className="w-6 h-6 text-gray-700" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">
                              {doc.type} • {doc.size} • Generated: {new Date(doc.generatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            {doc.status}
                          </Badge>
                          <span className="text-xs text-gray-600">{doc.downloads} downloads</span>
                        </div>
                      </div>

                      <div className="mb-3 p-3 bg-white rounded border">
                        <p className="text-xs font-medium mb-2 text-gray-700">Components ({doc.components.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {doc.components.map((component: string, index: number) => <Badge key={index} variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                              {component}
                            </Badge>)}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="hover-scale text-gray-700 border-gray-300" onClick={() => setSelectedDocument(doc)}>
                              <FileText className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="hover-scale text-gray-700 border-gray-300">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        
                        <Button variant="outline" size="sm" className="hover-scale text-red-600 border-red-300">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Document Viewer Dialog */}
            <Dialog open={isDocumentViewerOpen} onOpenChange={setIsDocumentViewerOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {selectedDocument?.name}
                      </DialogTitle>
                      <DialogDescription>
                        Document Type: {selectedDocument?.type} • Size: {selectedDocument?.size}
                      </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="hover-scale" onClick={() => {
                      toast({
                        title: "Download Started",
                        description: `Downloading ${selectedDocument?.name}`
                      });
                    }}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsDocumentViewerOpen(false)} className="hover-scale">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex-1 overflow-auto max-h-[60vh] border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-[500px] border border-gray-200">
                    <div className="bg-white p-6 rounded shadow-sm">
                      <h2 className="text-xl font-bold mb-4 text-center border-b pb-2">
                        UNIFIED PROPOSAL DOCUMENT
                      </h2>
                      <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong>Document ID:</strong> UP-2024-001
                          </div>
                          <div>
                            <strong>Generated:</strong> {selectedDocument && new Date(selectedDocument.generatedAt).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="font-semibold text-lg mb-3">Executive Summary</h3>
                          <p className="text-gray-700 leading-relaxed">
                            This unified proposal document contains comprehensive validation results, 
                            negotiation records, technical committee minutes, and all supporting documentation 
                            for Purchase Requisition PR-2024-001. The document has been automatically assembled 
                            from validated sources and includes digital signatures and version control.
                          </p>
                        </div>

                        <div className="mt-6">
                          <h3 className="font-semibold text-lg mb-3">Document Components</h3>
                          {selectedDocument?.components.map((component: string, index: number) => <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 mb-2 bg-blue-50">
                              <strong>{component}</strong>
                              <p className="text-sm text-gray-600">
                                Section {index + 1}: Detailed {component.toLowerCase()} documentation and analysis
                              </p>
                            </div>)}
                        </div>

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                          <h4 className="font-semibold text-green-800">Validation Status</h4>
                          <p className="text-green-700 text-sm">
                            ✓ All components validated and assembled successfully<br />
                            ✓ Digital signature applied<br />
                            ✓ Version control tags included<br />
                            ✓ Official watermark embedded
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Contract Linking Tab */}
          <TabsContent value="contract-link" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Contract Linking - Post-Bid Flow
                </CardTitle>
                <CardDescription>
                  Link contract to post-bid flow and show automated document generation base
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pr-ref">PR Reference</Label>
                    <Input id="pr-ref" placeholder="Enter PR reference" defaultValue="PR-2024-001" />
                  </div>
                  <div>
                    <Label htmlFor="contract-id">Target Contract ID</Label>
                    <Input id="contract-id" placeholder="Enter contract ID" defaultValue="CON-2024-045" />
                  </div>
                  <div>
                    <Label htmlFor="tender-ref">Tender Reference</Label>
                    <Input id="tender-ref" placeholder="Enter tender reference" defaultValue="TEN-2024-123" />
                  </div>
                  <div>
                    <Label htmlFor="workflow-type">Post-Bid Workflow</Label>
                    <select id="workflow-type" className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="standard">Standard Contract Flow</option>
                      <option value="expedited">Expedited Processing</option>
                      <option value="complex">Complex Multi-Party</option>
                    </select>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Automated Document Generation Queue
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["Contract Amendment", "Performance Bond", "Delivery Schedule", "Payment Terms", "SLA Documentation", "Risk Assessment"].map(doc => <div key={doc} className="flex items-center space-x-2 p-2 border rounded bg-white">
                        <ClipboardList className="w-3 h-3 text-blue-600" />
                        <span className="text-xs">{doc}</span>
                      </div>)}
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleContractLinking} disabled={isLinking} size="lg">
                  {isLinking ? <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Linking to Contract Flow...
                    </> : <>
                      <Link className="w-4 h-4 mr-2" />
                      Link to Post-Bid Contract Flow
                    </>}
                </Button>
              </CardContent>
            </Card>

            {/* Contract Links Results */}
            {contractLinks.length > 0 && <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Active Contract Links</CardTitle>
                  <CardDescription>
                    PRs linked to post-bid contract management flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractLinks.map(link => <div key={link.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Link className="w-6 h-6 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">
                                {link.prReference} → {link.contractId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Tender: {link.tenderReference} • Linked: {new Date(link.linkedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{link.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium mb-1">Post-Bid Flow Status</p>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm">{link.postBidFlow.status}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Next Step</p>
                            <span className="text-sm text-blue-600">{link.postBidFlow.nextStep}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Automated Document Generation Status:</p>
                            <Badge className={link.postBidFlow.generationStatus === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                              {link.postBidFlow.generationStatus}
                            </Badge>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress: {link.postBidFlow.completedDocs}/{link.postBidFlow.totalDocs} documents</span>
                              <span>ETA: {link.postBidFlow.estimatedCompletion}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{
                          width: `${link.postBidFlow.completedDocs / link.postBidFlow.totalDocs * 100}%`
                        }}></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {link.postBidFlow.automatedDocs.map((doc: string, index: number) => {
                        const isCompleted = index < link.postBidFlow.completedDocs;
                        const isInProgress = index === link.postBidFlow.completedDocs;
                        return <Badge key={index} variant="outline" className={`text-xs ${isCompleted ? "bg-green-50 text-green-700 border-green-200" : isInProgress ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                                  {isCompleted && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {isInProgress && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                  {!isCompleted && !isInProgress && <Calendar className="w-3 h-3 mr-1" />}
                                  {doc}
                                </Badge>;
                      })}
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Current Phase: {link.postBidFlow.currentPhase}</span>
                          </div>
                          <p className="text-xs text-blue-700">
                            Automated document generation is running in the background. 
                            You will be notified when all documents are ready for review.
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            View Contract
                          </Button>
                          <Button variant="outline" size="sm">
                            <Users className="w-4 h-4 mr-1" />
                            Manage Workflow
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Export Details
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>

        {/* Comparison Modal */}
        <Dialog open={showComparisonModal} onOpenChange={setShowComparisonModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Historical Records Comparison
              </DialogTitle>
              <DialogDescription>
                Detailed comparison analysis of selected historical records
              </DialogDescription>
            </DialogHeader>

            {isComparingRecords ? <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing and comparing selected records...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div> : comparisonResults ? <div className="space-y-6">
                {/* Selected Records Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Selected Records ({comparisonResults.selectedRecords.length})</h3>
                  <div className="grid gap-3">
                    {comparisonResults.selectedRecords.map((record: any, index: number) => <div key={record.id} className="p-3 border rounded-lg bg-muted/30">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="font-medium">{record.vendor} - {record.date}</p>
                            <p className="text-sm text-muted-foreground">{record.quantity} at {record.pricePerUnit}</p>
                          </div>
                          <Badge variant="outline">{record.amount}</Badge>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Price Analysis */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Price Variance Analysis</h3>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Highest Price</p>
                      <p className="text-lg font-bold text-red-600">{comparisonResults.analysis.priceVariance.highest.pricePerUnit}</p>
                      <p className="text-xs text-muted-foreground">{comparisonResults.analysis.priceVariance.highest.vendor}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Lowest Price</p>
                      <p className="text-lg font-bold text-green-600">{comparisonResults.analysis.priceVariance.lowest.pricePerUnit}</p>
                      <p className="text-xs text-muted-foreground">{comparisonResults.analysis.priceVariance.lowest.vendor}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Average Price</p>
                      <p className="text-lg font-bold text-foreground">₹{comparisonResults.analysis.priceVariance.averagePrice}</p>
                      <p className="text-xs text-muted-foreground">Across selected records</p>
                    </div>
                  </div>
                </div>

                {/* Vendor Performance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Vendor Performance Insights</h3>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Most Frequent</p>
                      <p className="font-medium">{comparisonResults.analysis.vendorPerformance.mostFrequent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reliability</p>
                      <p className="font-medium">{comparisonResults.analysis.vendorPerformance.reliability}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Consistency</p>
                      <p className="font-medium">{comparisonResults.analysis.vendorPerformance.deliveryConsistency}</p>
                    </div>
                  </div>
                </div>

                {/* Trends */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Market Trends</h3>
                  <ul className="space-y-2">
                    {comparisonResults.analysis.trends.map((trend: string, index: number) => <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trend}</span>
                      </li>)}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {comparisonResults.analysis.recommendations.map((rec: string, index: number) => <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>)}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                toast({
                  title: "Report Exported",
                  description: "Comparison report has been downloaded"
                });
              }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button onClick={() => setShowComparisonModal(false)}>
                    Close
                  </Button>
                </div>
              </div> : null}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>;
};
export default PRChecker;