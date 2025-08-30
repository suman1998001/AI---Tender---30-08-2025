import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText, Download, BookOpen, BarChart3, History, GitCompare } from "lucide-react";
const ValidationResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [selectedComparisonDocument, setSelectedComparisonDocument] = useState<string>("none");
  
  // Mock data - in real app this would come from props/state
  const hasComparison = selectedComparisonDocument !== "none"; // Show comparison only when document is selected
  const selectedTemplate = "Technical Specification Template";
  
  // Available documents for comparison with their validation results
  const availableDocuments = [
    { 
      id: "1", 
      name: "Procurement Manual v2.1", 
      type: "Template",
      validationResults: [{
        id: 1,
        category: "Format Validation",
        status: "passed",
        issues: 0,
        description: "Manual follows standard procurement format guidelines",
        details: ["Standard PDF format used", "Consistent document structure", "Proper encoding standards"],
        severity: "info"
      }, {
        id: 2,
        category: "Procurement Manual Compliance",
        status: "passed",
        issues: 0,
        description: "Full compliance with procurement manual requirements",
        details: ["All required sections included", "Standard clauses implemented", "Manual fully approved"],
        severity: "info"
      }, {
        id: 3,
        category: "Clause Consistency",
        status: "passed",
        issues: 0,
        description: "All clause references are consistent and standardized",
        details: ["Unified clause numbering system", "Consistent payment terms", "Standardized terminology"],
        severity: "info"
      }, {
        id: 4,
        category: "Required Attachments",
        status: "passed",
        issues: 0,
        description: "All mandatory attachments are properly referenced",
        details: ["Technical specifications template included", "Insurance requirements defined", "Vendor requirements clearly stated"],
        severity: "info"
      }, {
        id: 5,
        category: "Document Precedence",
        status: "passed",
        issues: 0,
        description: "Clear document hierarchy and precedence established",
        details: ["Standard contract hierarchy", "Amendment procedures defined", "Conflict resolution framework established"],
        severity: "info"
      }]
    },
    { 
      id: "2", 
      name: "Standard SCC Template", 
      type: "Template",
      validationResults: [{
        id: 1,
        category: "Format Validation",
        status: "passed",
        issues: 0,
        description: "SCC template follows standard procurement format guidelines",
        details: ["Standard PDF format used", "Consistent document structure", "Proper encoding standards"],
        severity: "info"
      }, {
        id: 2,
        category: "Procurement Manual Compliance",
        status: "warning",
        issues: 1,
        description: "Minor compliance issues found in SCC template",
        details: ["Most sections compliant", "One clause needs updating", "Overall structure approved"],
        severity: "warning"
      }, {
        id: 3,
        category: "Clause Consistency",
        status: "passed",
        issues: 0,
        description: "All clause references are consistent and standardized",
        details: ["Unified clause numbering system", "Consistent payment terms", "Standardized terminology"],
        severity: "info"
      }, {
        id: 4,
        category: "Required Attachments",
        status: "passed",
        issues: 0,
        description: "All mandatory attachments are properly referenced",
        details: ["Technical specifications template included", "Insurance requirements defined", "Vendor requirements clearly stated"],
        severity: "info"
      }, {
        id: 5,
        category: "Document Precedence",
        status: "passed",
        issues: 0,
        description: "Clear document hierarchy and precedence established",
        details: ["Standard contract hierarchy", "Amendment procedures defined", "Conflict resolution framework established"],
        severity: "info"
      }]
    },
    { 
      id: "3", 
      name: "BEC Checklist v3.0", 
      type: "Template",
      validationResults: [{
        id: 1,
        category: "Format Validation",
        status: "passed",
        issues: 0,
        description: "BEC checklist follows standard procurement format guidelines",
        details: ["Standard PDF format used", "Consistent document structure", "Proper encoding standards"],
        severity: "info"
      }, {
        id: 2,
        category: "Procurement Manual Compliance",
        status: "passed",
        issues: 0,
        description: "Full compliance with procurement manual requirements",
        details: ["All required sections included", "Standard clauses implemented", "Checklist fully approved"],
        severity: "info"
      }, {
        id: 3,
        category: "Clause Consistency",
        status: "passed",
        issues: 0,
        description: "All clause references are consistent and standardized",
        details: ["Unified clause numbering system", "Consistent payment terms", "Standardized terminology"],
        severity: "info"
      }, {
        id: 4,
        category: "Required Attachments",
        status: "passed",
        issues: 0,
        description: "All mandatory attachments are properly referenced",
        details: ["Technical specifications included", "Insurance requirements defined", "Vendor requirements clearly stated"],
        severity: "info"
      }, {
        id: 5,
        category: "Document Precedence",
        status: "passed",
        issues: 0,
        description: "Clear document hierarchy and precedence established",
        details: ["Standard contract hierarchy", "Amendment procedures defined", "Conflict resolution framework established"],
        severity: "info"
      }]
    },
    { 
      id: "4", 
      name: "Previous Contract 2023", 
      type: "Contract",
      validationResults: [{
        id: 1,
        category: "Format Validation",
        status: "passed",
        issues: 0,
        description: "Previous contract follows standard procurement format guidelines",
        details: ["Standard PDF format used", "Consistent document structure", "Proper encoding standards"],
        severity: "info"
      }, {
        id: 2,
        category: "Procurement Manual Compliance",
        status: "passed",
        issues: 0,
        description: "Full compliance with procurement manual requirements",
        details: ["All required sections included", "Standard clauses implemented", "Contract fully approved"],
        severity: "info"
      }, {
        id: 3,
        category: "Clause Consistency",
        status: "warning",
        issues: 1,
        description: "Minor inconsistencies found in clause references",
        details: ["Most clauses consistent", "One payment term inconsistent", "Overall structure good"],
        severity: "warning"
      }, {
        id: 4,
        category: "Required Attachments",
        status: "passed",
        issues: 0,
        description: "All mandatory attachments are properly referenced",
        details: ["Technical specifications included", "Insurance requirements defined", "Vendor requirements clearly stated"],
        severity: "info"
      }, {
        id: 5,
        category: "Document Precedence",
        status: "passed",
        issues: 0,
        description: "Clear document hierarchy and precedence established",
        details: ["Standard contract hierarchy", "Amendment procedures defined", "Conflict resolution framework established"],
        severity: "info"
      }]
    },
    { 
      id: "5", 
      name: "Tender-2024-001 Documents", 
      type: "Tender",
      validationResults: [{
        id: 1,
        category: "Format Validation",
        status: "failed",
        issues: 2,
        description: "Format issues found in tender documents",
        details: ["PDF format inconsistent", "Document structure needs improvement", "Encoding standards not met"],
        severity: "error"
      }, {
        id: 2,
        category: "Procurement Manual Compliance",
        status: "warning",
        issues: 1,
        description: "Minor compliance issues found in tender documents",
        details: ["Most sections compliant", "One clause needs updating", "Overall structure approved"],
        severity: "warning"
      }, {
        id: 3,
        category: "Clause Consistency",
        status: "passed",
        issues: 0,
        description: "All clause references are consistent and standardized",
        details: ["Unified clause numbering system", "Consistent payment terms", "Standardized terminology"],
        severity: "info"
      }, {
        id: 4,
        category: "Required Attachments",
        status: "passed",
        issues: 0,
        description: "All mandatory attachments are properly referenced",
        details: ["Technical specifications included", "Insurance requirements defined", "Vendor requirements clearly stated"],
        severity: "info"
      }, {
        id: 5,
        category: "Document Precedence",
        status: "passed",
        issues: 0,
        description: "Clear document hierarchy and precedence established",
        details: ["Standard contract hierarchy", "Amendment procedures defined", "Conflict resolution framework established"],
        severity: "info"
      }]
    },
    { 
      id: "6", 
      name: "Tender-2023-045 Documents", 
      type: "Tender",
      validationResults: [{
        id: 1,
        category: "Format Validation",
        status: "passed",
        issues: 0,
        description: "Tender documents follow standard procurement format guidelines",
        details: ["Standard PDF format used", "Consistent document structure", "Proper encoding standards"],
        severity: "info"
      }, {
        id: 2,
        category: "Procurement Manual Compliance",
        status: "passed",
        issues: 0,
        description: "Full compliance with procurement manual requirements",
        details: ["All required sections included", "Standard clauses implemented", "Documents fully approved"],
        severity: "info"
      }, {
        id: 3,
        category: "Clause Consistency",
        status: "passed",
        issues: 0,
        description: "All clause references are consistent and standardized",
        details: ["Unified clause numbering system", "Consistent payment terms", "Standardized terminology"],
        severity: "info"
      }, {
        id: 4,
        category: "Required Attachments",
        status: "passed",
        issues: 0,
        description: "All mandatory attachments are properly referenced",
        details: ["Technical specifications included", "Insurance requirements defined", "Vendor requirements clearly stated"],
        severity: "info"
      }, {
        id: 5,
        category: "Document Precedence",
        status: "warning",
        issues: 1,
        description: "Minor precedence issues found in tender documents",
        details: ["Most hierarchy correct", "One amendment precedence unclear", "Overall structure good"],
        severity: "warning"
      }]
    }
  ];

  // Get the selected document's validation results
  const getSelectedDocumentResults = () => {
    if (selectedComparisonDocument === "none") {
      return referenceTemplateResults;
    }
    const selectedDoc = availableDocuments.find(doc => doc.id === selectedComparisonDocument);
    return selectedDoc ? selectedDoc.validationResults : referenceTemplateResults;
  };

  // Get the selected document's name for display
  const getSelectedDocumentName = () => {
    if (selectedComparisonDocument === "none") {
      return "Reference Template";
    }
    const selectedDoc = availableDocuments.find(doc => doc.id === selectedComparisonDocument);
    return selectedDoc ? selectedDoc.name : "Reference Template";
  };
  
  useEffect(() => {
    // Animate sections one by one
    const timeouts = [0, 200, 400, 600, 800].map((delay, index) => 
      setTimeout(() => {
        setVisibleSections(prev => [...prev, index]);
      }, delay)
    );
    
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Mock validation results - in real app this would come from props/state
  const validationResults = [{
    id: 1,
    category: "Format Validation",
    status: "passed",
    issues: 0,
    description: "All documents are in the correct format (PDF/DOCX)",
    details: ["File formats verified", "Document structure validated", "Encoding check passed"],
    severity: "info"
  }, {
    id: 2,
    category: "Procurement Manual Compliance",
    status: "passed",
    issues: 0,
    description: "Documents comply with procurement manual standards",
    details: ["Section numbering correct", "Required clauses present", "Template adherence verified"],
    severity: "info"
  }, {
    id: 3,
    category: "Clause Consistency",
    status: "warning",
    issues: 2,
    description: "Minor inconsistencies found in clause references",
    details: ["Clause 4.2 references differ between SOW and SCC", "Payment terms formatting inconsistent"],
    severity: "warning"
  }, {
    id: 4,
    category: "Required Attachments",
    status: "failed",
    issues: 3,
    description: "Missing required attachments and documents",
    details: ["Technical specifications document missing", "Insurance certificate not attached", "Vendor registration document required"],
    severity: "error"
  }, {
    id: 5,
    category: "Document Precedence",
    status: "passed",
    issues: 0,
    description: "Document hierarchy and precedence order is correct",
    details: ["Contract hierarchy verified", "Amendment precedence correct", "Conflict resolution clear"],
    severity: "info"
  }];

  // Reference template validation results
  const referenceTemplateResults = [{
    id: 1,
    category: "Format Validation",
    status: "passed",
    issues: 0,
    description: "Template follows standard procurement format guidelines",
    details: ["Standard PDF format used", "Consistent document structure", "Proper encoding standards"],
    severity: "info"
  }, {
    id: 2,
    category: "Procurement Manual Compliance",
    status: "passed",
    issues: 0,
    description: "Full compliance with procurement manual requirements",
    details: ["All required sections included", "Standard clauses implemented", "Template fully approved"],
    severity: "info"
  }, {
    id: 3,
    category: "Clause Consistency",
    status: "passed",
    issues: 0,
    description: "All clause references are consistent and standardized",
    details: ["Unified clause numbering system", "Consistent payment terms", "Standardized terminology"],
    severity: "info"
  }, {
    id: 4,
    category: "Required Attachments",
    status: "passed",
    issues: 0,
    description: "All mandatory attachments are properly referenced",
    details: ["Technical specifications template included", "Insurance requirements defined", "Vendor requirements clearly stated"],
    severity: "info"
  }, {
    id: 5,
    category: "Document Precedence",
    status: "passed",
    issues: 0,
    description: "Clear document hierarchy and precedence established",
    details: ["Standard contract hierarchy", "Amendment procedures defined", "Conflict resolution framework established"],
    severity: "info"
  }];
  // Render validation results component
  const renderValidationResults = (results: typeof validationResults) => (
    <div className="space-y-3">
      {/* Summary Table Header */}
      <div className="grid grid-cols-12 gap-4 py-3 border-b border-border/30 text-xs font-medium text-muted-foreground">
        <div className="col-span-4">Category</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Issues</div>
        <div className="col-span-5">Description</div>
      </div>

      {/* Results */}
      {results.map((result, index) => (
        <div key={result.id}>
          <div className="grid grid-cols-12 gap-4 py-4 border-b border-border/20 hover:bg-muted/30 transition-colors">
            <div className="col-span-4 flex items-center gap-3">
              <div className="p-1.5 rounded bg-muted/50">
                {getStatusIcon(result.status)}
              </div>
              <span className="text-sm font-normal text-foreground">{result.category}</span>
            </div>
            <div className="col-span-2 flex items-center">
              {getStatusBadge(result.status)}
            </div>
            <div className="col-span-1 flex items-center">
              <span className="text-sm text-muted-foreground">{result.issues}</span>
            </div>
            <div className="col-span-5 flex items-center">
              <span className="text-sm text-muted-foreground">{result.description}</span>
            </div>
          </div>
          
          {/* Expandable Details */}
          <div className="ml-8 space-y-2 py-3 border-b border-border/10">
            {result.details.map((detail, detailIndex) => (
              <div key={detailIndex} className="flex items-start gap-2 py-1">
                <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${result.status === 'passed' ? 'bg-success' : result.status === 'warning' ? 'bg-warning' : 'bg-error'}`} />
                <span className="text-xs text-muted-foreground leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-success text-white text-xs">Passed</Badge>;
      case "warning":
        return <Badge className="bg-warning text-white text-xs">Warning</Badge>;
      case "failed":
        return <Badge className="bg-error text-white text-xs">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };
  return <DashboardLayout>
      <div className="space-y-8 bg-background min-h-screen p-6">
        {/* Back Button */}
        <div className={`flex items-center transition-all duration-300 ${visibleSections.includes(0) ? 'animate-fade-in' : 'opacity-0'}`}>
          <Button variant="ghost" onClick={() => navigate('/document-checker')} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className={`flex items-start justify-between pb-6 border-b border-border/30 transition-all duration-300 ${visibleSections.includes(1) ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl text-foreground font-semibold">Logistics_Services_Contract_2024.pdf</h1>
              <Badge variant="outline" className="text-xs font-normal px-2 py-1 text-primary border-primary/30">
                {selectedTemplate}
              </Badge>
              {hasComparison && (
                <Badge className="bg-secondary text-secondary-foreground text-xs font-normal px-2 py-1 gap-1">
                  <GitCompare className="w-3 h-3" />
                  Comparison Mode
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {hasComparison 
                ? "Side-by-side comparison of document validation and compliance checks"
                : "Detailed analysis of document validation and compliance checks"
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/document-checker')} variant="outline" size="sm" className="gap-2 text-xs h-8">
              <FileText className="w-3 h-3" />
              Validate More
            </Button>
            <Select value={selectedComparisonDocument} onValueChange={setSelectedComparisonDocument}>
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue placeholder="Select document for comparison" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="none" className="text-xs">No comparison</SelectItem>
                {availableDocuments.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id} className="text-xs">
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
              <Download className="w-3 h-3" />
              Download Report
            </Button>
            <Button size="sm" className="gap-2 text-xs h-8 bg-foreground text-background hover:bg-foreground/90">
              Export
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className={`border border-border/50 rounded-lg p-5 pt-5 transition-all duration-300 ${visibleSections.includes(2) ? 'animate-fade-in' : 'opacity-0'}`}>
          {hasComparison ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground mb-4">Comparison Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Current Document */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Document</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <div className="text-2xl font-light text-foreground">3</div>
                      <div className="text-xs text-muted-foreground">Passed</div>
                      <div className="text-xs text-success">All requirements met</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-light text-foreground">1</div>
                      <div className="text-xs text-muted-foreground">Warnings</div>
                      <div className="text-xs text-warning">Minor issues</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-light text-foreground">1</div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                      <div className="text-xs text-error">Critical issues</div>
                    </div>
                  </div>
                </div>
                
                {/* Reference Document */}
                <div className="space-y-4 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{getSelectedDocumentName()}</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <div className="text-2xl font-light text-foreground">
                        {getSelectedDocumentResults().filter(r => r.status === 'passed').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Passed</div>
                      <div className="text-xs text-success">All requirements met</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-light text-foreground">
                        {getSelectedDocumentResults().filter(r => r.status === 'warning').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Warnings</div>
                      <div className="text-xs text-warning">Minor issues</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-light text-foreground">
                        {getSelectedDocumentResults().filter(r => r.status === 'failed').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                      <div className="text-xs text-error">Critical issues</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-12 py-5">
              <div className="space-y-1">
                <div className="text-3xl font-light text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Passed Checks</div>
                <div className="text-xs text-success">All requirements met</div>
              </div>
              
              <div className="space-y-1 relative before:absolute before:left-[-24px] before:top-5 before:bottom-5 before:w-px before:bg-border">
                <div className="text-3xl font-light text-foreground">1</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
                <div className="text-xs text-warning">Minor issues found</div>
              </div>
              
              <div className="space-y-1 relative before:absolute before:left-[-24px] before:top-5 before:bottom-5 before:w-px before:bg-border">
                <div className="text-3xl font-light text-foreground">1</div>
                <div className="text-sm text-muted-foreground">Failed Checks</div>
                <div className="text-xs text-error">Critical attention required</div>
              </div>
            </div>
          )}
        </div>

        {/* Output Deliverables */}
        <div className={`border border-border/50 rounded-lg p-5 space-y-4 transition-all duration-300 ${visibleSections.includes(3) ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">Output Deliverables</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-card border border-border/50 rounded-md p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-muted/50">
                    <BookOpen className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="text-sm font-normal text-foreground">Final Documents</div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                  <Download className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-md p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-muted/50">
                    <CheckCircle className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="text-sm font-normal text-foreground">Verification Report</div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                  <Download className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-md p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-muted/50">
                    <BarChart3 className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="text-sm font-normal text-foreground">Comparison Summary</div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                  <Download className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-md p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-muted/50">
                    <History className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="text-sm font-normal text-foreground">Version History</div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                  <Download className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className={`border border-border/50 rounded-lg p-5 space-y-4 transition-all duration-300 ${visibleSections.includes(4) ? 'animate-fade-in' : 'opacity-0'}`}>
          {selectedComparisonDocument === "none" ? (
            // Single document view when no comparison document is selected
            <div className="space-y-4">
              <h2 className="text-base font-medium text-foreground">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4" />
                  Uploaded Document Results
                </div>
                {renderValidationResults(validationResults)}
              </div>
            </div>
          ) : (
            // Tabs view when comparison document is selected
            <Tabs defaultValue="uploaded" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-foreground">Details</h2>
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="uploaded" className="text-xs">Uploaded Document</TabsTrigger>
                  <TabsTrigger value="comparison" className="text-xs">{getSelectedDocumentName()}</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="uploaded">
                {renderValidationResults(validationResults)}
              </TabsContent>
              <TabsContent value="comparison">
                {renderValidationResults(getSelectedDocumentResults())}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </DashboardLayout>;
};
export default ValidationResults;