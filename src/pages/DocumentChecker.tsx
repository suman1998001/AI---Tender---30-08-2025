import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileCheck, AlertTriangle, Download, CheckCircle, XCircle, Clock, Eye, Trash2, Activity, MoreHorizontal, FileText, History, GitCompare, BookOpen, ClipboardList, Settings, BarChart3, FileSpreadsheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DocumentChecker = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [previousVersion, setPreviousVersion] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upload');
  const [showActionPlan, setShowActionPlan] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const startValidation = () => {
    setIsValidating(true);
    setValidationStatus('processing');
    setValidationProgress(0);
    
    // Simulate validation progress
    const interval = setInterval(() => {
      setValidationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setValidationStatus('completed');
          setIsValidating(false);
          toast.success("Document validation completed");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const validationResults = [
    { 
      category: "Document Format Validation", 
      status: "passed", 
      issues: 0,
      description: "Parse and validate document formats (SOW, SCC, BEC, SOQ, SOR along with any technical checklists, proformas, annexures etc.)",
      details: [
        "✓ SOW format validation passed",
        "✓ SCC structure validation passed", 
        "✓ BEC component validation passed",
        "✓ SOQ quantity validation passed"
      ]
    },
    { 
      category: "Ambiguous/Conflicting Clauses Check", 
      status: "warning", 
      issues: 2,
      description: "Check for ambiguous/conflicting clauses in contract documents",
      details: [
        "⚠ Clause 3.2.1: Payment terms conflict between SCC and GCC",
        "⚠ Clause 5.1.3: Delivery timeline ambiguity in SOW",
        "✓ All other clauses validated successfully"
      ]
    },
    { 
      category: "Document Version Comparison", 
      status: "passed", 
      issues: 0,
      description: "Compare current documents (BEC, SCC, SOR, etc.) with previous versions (of previous last order/contract or similar tender) if available",
      details: [
        "✓ BEC version comparison completed",
        "✓ SCC version comparison completed",
        "✓ SOR version comparison completed",
        "✓ 15% changes detected from previous version"
      ]
    },
    { 
      category: "Procurement Manual Compliance", 
      status: "passed", 
      issues: 0,
      description: "Check compliance with Procurement Manual and other circulars applicable",
      details: [
        "✓ Procurement Manual 2024 compliance verified",
        "✓ Circular 15/2024 compliance verified",
        "✓ Standard Operating Procedures compliance verified"
      ]
    },
    { 
      category: "Precedence & Clause Consistency", 
      status: "warning", 
      issues: 1,
      description: "Validate precedence and clause consistency (e.g., SCC vs GCC)",
      details: [
        "⚠ Precedence conflict: SCC Clause 2.1 overrides GCC Clause 2.1",
        "✓ All other precedence rules validated",
        "✓ Clause numbering consistency verified"
      ]
    },
    { 
      category: "Required Attachments Check", 
      status: "failed", 
      issues: 3,
      description: "Check whether all necessary attachments to proposals are attached",
      details: [
        "✗ Missing: Technical specifications document",
        "✗ Missing: Quality assurance plan",
        "✗ Missing: Safety compliance certificate",
        "✓ All other required attachments present"
      ]
    },
  ];

  const kpiData = [
    {
      title: "Total Documents",
      value: "156",
      change: "+12 this week",
      icon: FileCheck,
      color: "text-foreground",
      bgColor: "bg-gradient-to-br from-muted to-muted/50",
      iconBg: "bg-foreground"
    },
    {
      title: "Validated Documents",
      value: "142",
      change: "91% success rate",
      icon: CheckCircle,
      color: "text-foreground",
      bgColor: "bg-gradient-to-br from-muted to-muted/50",
      iconBg: "bg-chart-red-primary"
    },
    {
      title: "Pending Validation",
      value: "14",
      change: "Awaiting review",
      icon: Clock,
      color: "text-foreground",
      bgColor: "bg-gradient-to-br from-muted to-muted/50",
      iconBg: "bg-chart-red-secondary"
    },
    {
      title: "Issues Found",
      value: "8",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-foreground",
      bgColor: "bg-gradient-to-br from-muted to-muted/50",
      iconBg: "bg-chart-red-dark"
    }
  ];

  const documentRepository = [
    { 
      id: 1, 
      name: "Statement of Work - Q1 2024.pdf", 
      type: "SOW", 
      uploadDate: "2024-02-15", 
      status: "Validated", 
      size: "2.4 MB",
      validator: "Rajesh Kumar",
      version: "v2.1"
    },
    { 
      id: 2, 
      name: "Special Conditions Contract.docx", 
      type: "SCC", 
      uploadDate: "2024-02-14", 
      status: "Pending", 
      size: "1.8 MB",
      validator: "-",
      version: "v1.5"
    },
    { 
      id: 3, 
      name: "Bill of Engineering Components.pdf", 
      type: "BEC", 
      uploadDate: "2024-02-13", 
      status: "Issues Found", 
      size: "3.2 MB",
      validator: "Priya Sharma",
      version: "v3.0"
    },
    { 
      id: 4, 
      name: "Schedule of Quantities.xlsx", 
      type: "SOQ", 
      uploadDate: "2024-02-12", 
      status: "Validated", 
      size: "1.1 MB",
      validator: "Amit Singh",
      version: "v1.2"
    },
    { 
      id: 5, 
      name: "Schedule of Rates.xlsx", 
      type: "SOR", 
      uploadDate: "2024-02-11", 
      status: "Validated", 
      size: "0.9 MB",
      validator: "Neha Gupta",
      version: "v2.0"
    },
  ];

  const becChecklist = [
    { id: 1, item: "Civil Engineering Components", checked: true, status: "complete" },
    { id: 2, item: "Electrical Engineering Components", checked: true, status: "complete" },
    { id: 3, item: "Mechanical Engineering Components", checked: false, status: "pending" },
    { id: 4, item: "Structural Engineering Components", checked: true, status: "complete" },
    { id: 5, item: "HVAC Components", checked: false, status: "pending" },
    { id: 6, item: "Plumbing Components", checked: true, status: "complete" },
    { id: 7, item: "Fire Safety Components", checked: true, status: "complete" },
    { id: 8, item: "IT & Communication Components", checked: false, status: "pending" },
  ];

  const clauseComparison = [
    {
      clause: "Payment Terms",
      current: "Net 30 days",
      previous: "Net 45 days",
      status: "modified",
      impact: "Reduced payment timeline"
    },
    {
      clause: "Delivery Timeline",
      current: "90 days",
      previous: "120 days",
      status: "modified",
      impact: "Accelerated delivery"
    },
    {
      clause: "Quality Standards",
      current: "ISO 9001:2015",
      previous: "ISO 9001:2015",
      status: "unchanged",
      impact: "No change"
    },
    {
      clause: "Warranty Period",
      current: "24 months",
      previous: "12 months",
      status: "modified",
      impact: "Extended warranty"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Validated":
        return <Badge className="bg-success text-white">Validated</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Issues Found":
        return <Badge className="bg-error text-white">Issues Found</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComparisonStatusBadge = (status: string) => {
    switch (status) {
      case "modified":
        return <Badge className="bg-warning text-white">Modified</Badge>;
      case "unchanged":
        return <Badge className="bg-success text-white">Unchanged</Badge>;
      case "new":
        return <Badge className="bg-blue-500 text-white">New</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Document Checker Management</h1>
            <p className="text-muted-foreground mt-2">
              Validate tender documents for format, consistency, and compliance with comprehensive analysis
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((metric, index) => (
            <Card key={index} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                    {metric.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground tracking-tight">
                    {metric.value}
                  </div>
                </div>
                <div className={`${metric.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <p className="text-xs text-muted-foreground font-medium">
                  {metric.change}
                </p>
              </CardContent>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${metric.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload & Validate
            </TabsTrigger>
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Document Repository
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              BEC Checklist
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              Version Comparison
            </TabsTrigger>
            <TabsTrigger value="clauses" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Clause Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Upload & Validation Tab */}
          <TabsContent value="upload" className="space-y-6">
            {/* Document Upload Section */}
            <Card className="mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Document Upload & Validation
                </CardTitle>
                <CardDescription>
                  Upload tender documents (SOW, SCC, BEC, SOQ, SOR) and configure validation settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upload Area - Full Width */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Upload Documents</h3>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supported formats: PDF, DOCX, XLSX
                        </p>
                      </label>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Uploaded Files:</h4>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                            <span className="font-medium">{file.name}</span>
                            <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Validation Settings - Two Dropdowns Side by Side */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Validation Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Standard Templates</Label>
                        <select 
                          className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                        >
                          <option value="">Select template...</option>
                          <option value="sow">SOW - Statement of Work Template v2.1</option>
                          <option value="scc">SCC - Special Conditions of Contract Template</option>
                          <option value="bec">BEC - Bill of Engineering Components Template</option>
                          <option value="soq">SOQ - Schedule of Quantities Template</option>
                          <option value="sor">SOR - Schedule of Rates Template</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Previous Version (for comparison)</Label>
                        <select 
                          className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                          value={previousVersion}
                          onChange={(e) => setPreviousVersion(e.target.value)}
                        >
                          <option value="">Select previous version...</option>
                          <option value="q4-2023">Q4 2023 - Previous Tender</option>
                          <option value="q3-2023">Q3 2023 - Previous Tender</option>
                          <option value="q2-2023">Q2 2023 - Previous Tender</option>
                        </select>
                      </div>
                    </div>

                    {/* Validation Options - Checkboxes Side by Side */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Validation Options</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-check" defaultChecked />
                          <Label htmlFor="format-check" className="text-sm">Format validation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="clause-check" defaultChecked />
                          <Label htmlFor="clause-check" className="text-sm">Clause consistency check</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="compliance-check" defaultChecked />
                          <Label htmlFor="compliance-check" className="text-sm">Procurement manual compliance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="version-check" defaultChecked />
                          <Label htmlFor="version-check" className="text-sm">Version comparison</Label>
                        </div>
                      </div>
                    </div>

                    {/* Start Validation Button */}
                    <div className="pt-4">
                      <Button 
                        onClick={startValidation} 
                        className={`w-full relative overflow-hidden h-12 text-lg ${isValidating ? 'animate-pulse' : ''}`}
                        disabled={uploadedFiles.length === 0 || isValidating}
                      >
                        {isValidating && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[loading_1.5s_ease-in-out_infinite]" />
                        )}
                        <FileCheck className={`w-5 h-5 mr-3 ${isValidating ? 'animate-spin' : ''}`} />
                        {isValidating ? 'Validating Documents...' : 'Start Validation'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Progress */}
            {validationStatus === 'processing' && (
              <Card className="mb-8 animate-fade-in border-chart-red-primary/20 bg-gradient-to-br from-background to-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 border-3 border-chart-red-primary/30 border-t-chart-red-primary rounded-full animate-spin"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-chart-red-primary/20 rounded-full animate-pulse"></div>
                    </div>
                    <span className="bg-gradient-to-r from-chart-red-primary to-chart-red-dark bg-clip-text text-transparent font-semibold">
                      AI Validation in Progress
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Our AI is analyzing your documents for compliance and consistency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Progress value={validationProgress} className="w-full h-3 mb-2" />
                    <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-chart-red-primary/20 to-transparent rounded-full animate-pulse" 
                         style={{ width: `${validationProgress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Processing documents... {validationProgress}%
                    </p>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-chart-red-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-chart-red-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-chart-red-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                         )}

             {/* Validation Results Report */}
            {validationStatus === 'completed' && (
              <div className="space-y-6 mt-8">
                {/* Executive Summary */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <BarChart3 className="w-6 h-6" />
                      Document Validation Report - Executive Summary
                    </CardTitle>
                    <CardDescription>
                      Comprehensive validation report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                        <div className="text-2xl font-bold text-success">3</div>
                        <div className="text-sm text-muted-foreground">Passed</div>
                      </div>
                      <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                        <div className="text-2xl font-bold text-warning">2</div>
                        <div className="text-sm text-muted-foreground">Warnings</div>
                      </div>
                      <div className="text-center p-4 bg-error/10 rounded-lg border border-error/20">
                        <div className="text-2xl font-bold text-error">1</div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-2xl font-bold text-blue-500">6</div>
                        <div className="text-sm text-muted-foreground">Total Issues</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Validation Parameters Used:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Format validation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Clause consistency check</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Procurement manual compliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Version comparison</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Validation Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Detailed Validation Results
                    </CardTitle>
                    <CardDescription>
                      Comprehensive analysis of each validation category with specific findings and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {validationResults.map((result, index) => (
                        <div key={index} className="border border-border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                result.status === 'passed' ? 'bg-success/10 text-success' :
                                result.status === 'warning' ? 'bg-warning/10 text-warning' :
                                'bg-error/10 text-error'
                              }`}>
                                {result.status === 'passed' && <CheckCircle className="w-5 h-5" />}
                                {result.status === 'warning' && <AlertTriangle className="w-5 h-5" />}
                                {result.status === 'failed' && <XCircle className="w-5 h-5" />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{result.category}</h3>
                                <p className="text-sm text-muted-foreground">{result.description}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={result.status === 'passed' ? 'default' : result.status === 'warning' ? 'secondary' : 'destructive'}
                              className="text-sm px-3 py-1"
                            >
                              {result.status === 'passed' ? 'PASSED' : result.status === 'warning' ? 'WARNING' : 'FAILED'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Issues Found:</span>
                              <Badge variant="outline" className="text-sm">
                                {result.issues} {result.issues === 1 ? 'issue' : 'issues'}
                              </Badge>
                            </div>
                            
                                                         <div className="bg-muted/50 rounded-lg p-4">
                               <h4 className="font-medium text-sm mb-3">Detailed Findings:</h4>
                               <div className="space-y-3">
                                 {result.details.map((detail, idx) => (
                                   <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                                     <div className={`p-1.5 rounded-full ${
                                       detail.startsWith('✓') ? 'bg-success/10 text-success' :
                                       detail.startsWith('⚠') ? 'bg-warning/10 text-warning' :
                                       'bg-error/10 text-error'
                                     }`}>
                                       {detail.startsWith('✓') && <CheckCircle className="w-4 h-4" />}
                                       {detail.startsWith('⚠') && <AlertTriangle className="w-4 h-4" />}
                                       {detail.startsWith('✗') && <XCircle className="w-4 h-4" />}
                                     </div>
                                     <div className="flex-1">
                                       <span className={`text-sm font-medium ${
                                         detail.startsWith('✓') ? 'text-success' : 
                                         detail.startsWith('⚠') ? 'text-warning' : 
                                         'text-error'
                                       }`}>
                                         {detail}
                                       </span>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                            
                                                         {result.status !== 'passed' && (
                               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                 <h4 className="font-medium text-sm text-blue-800 mb-3 flex items-center gap-2">
                                   <FileText className="w-4 h-4" />
                                   Recommendations:
                                 </h4>
                                 <div className="space-y-2">
                                   {result.status === 'warning' && (
                                     <>
                                       <div className="flex items-start gap-2 text-sm text-blue-700">
                                         <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                           <AlertTriangle className="w-3 h-3 text-blue-600" />
                                         </div>
                                         <span>Review and clarify ambiguous clauses</span>
                                       </div>
                                       <div className="flex items-start gap-2 text-sm text-blue-700">
                                         <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                           <AlertTriangle className="w-3 h-3 text-blue-600" />
                                         </div>
                                         <span>Resolve conflicts between SCC and GCC</span>
                                       </div>
                                       <div className="flex items-start gap-2 text-sm text-blue-700">
                                         <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                           <AlertTriangle className="w-3 h-3 text-blue-600" />
                                         </div>
                                         <span>Update document templates if necessary</span>
                                       </div>
                                     </>
                                   )}
                                   {result.status === 'failed' && (
                                     <>
                                       <div className="flex items-start gap-2 text-sm text-blue-700">
                                         <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                           <XCircle className="w-3 h-3 text-blue-600" />
                                         </div>
                                         <span>Add missing required attachments</span>
                                       </div>
                                       <div className="flex items-start gap-2 text-sm text-blue-700">
                                         <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                           <XCircle className="w-3 h-3 text-blue-600" />
                                         </div>
                                         <span>Ensure all technical specifications are included</span>
                                       </div>
                                       <div className="flex items-start gap-2 text-sm text-blue-700">
                                         <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                           <XCircle className="w-3 h-3 text-blue-600" />
                                         </div>
                                         <span>Verify quality assurance and safety compliance documents</span>
                                       </div>
                                     </>
                                   )}
                                 </div>
                               </div>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="w-5 h-5" />
                      Action Items & Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Immediate Actions Required:</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Add missing technical specifications document</li>
                            <li>• Include quality assurance plan</li>
                            <li>• Attach safety compliance certificate</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Review Required:</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Resolve payment terms conflict (Clause 3.2.1)</li>
                            <li>• Clarify delivery timeline ambiguity (Clause 5.1.3)</li>
                            <li>• Review precedence conflict (SCC vs GCC)</li>
                          </ul>
                        </div>
                      </div>
                      
                                             <div className="flex gap-3 pt-4">
                         <Button variant="outline" className="flex-1">
                           <Download className="w-4 h-4 mr-2" />
                           Download Full Report
                         </Button>
                         <Button 
                           className="flex-1"
                           onClick={() => setShowActionPlan(!showActionPlan)}
                         >
                           <FileText className="w-4 h-4 mr-2" />
                           {showActionPlan ? 'Hide Action Plan' : 'Generate Action Plan'}
                         </Button>
                       </div>
                                         </div>
                   </CardContent>
                 </Card>

                 {/* Action Plan Section */}
                 {showActionPlan && (
                   <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-3 text-blue-600">
                         <FileText className="w-6 h-6" />
                         Generated Action Plan
                       </CardTitle>
                       <CardDescription>
                         Detailed action plan with timelines and responsibilities for addressing validation issues
                       </CardDescription>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-6">
                         {/* Priority Matrix */}
                         <div className="grid gap-4 md:grid-cols-3">
                           <Card className="border-red-200 bg-red-50">
                             <CardHeader className="pb-3">
                               <CardTitle className="text-sm text-red-700">High Priority</CardTitle>
                             </CardHeader>
                             <CardContent>
                               <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                   <span>Add missing technical specifications</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                   <span>Include quality assurance plan</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                   <span>Attach safety compliance certificate</span>
                                 </div>
                               </div>
                             </CardContent>
                           </Card>
                           
                           <Card className="border-yellow-200 bg-yellow-50">
                             <CardHeader className="pb-3">
                               <CardTitle className="text-sm text-yellow-700">Medium Priority</CardTitle>
                             </CardHeader>
                             <CardContent>
                               <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                   <span>Resolve payment terms conflict</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                   <span>Clarify delivery timeline</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                   <span>Review precedence conflict</span>
                                 </div>
                               </div>
                             </CardContent>
                           </Card>
                           
                           <Card className="border-green-200 bg-green-50">
                             <CardHeader className="pb-3">
                               <CardTitle className="text-sm text-green-700">Low Priority</CardTitle>
                             </CardHeader>
                             <CardContent>
                               <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                   <span>Update document templates</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                   <span>Review clause numbering</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                   <span>Document version control</span>
                                 </div>
                               </div>
                             </CardContent>
                           </Card>
                         </div>

                         {/* Timeline */}
                         <div className="space-y-4">
                           <h4 className="font-semibold text-sm">Implementation Timeline</h4>
                           <div className="space-y-3">
                             <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                               <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                               <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                   <span className="font-medium text-sm">Week 1: Critical Issues</span>
                                   <Badge variant="destructive" className="text-xs">Immediate</Badge>
                                 </div>
                                 <p className="text-xs text-muted-foreground mt-1">
                                   Add missing technical specifications, quality assurance plan, and safety compliance certificate
                                 </p>
                               </div>
                             </div>
                             
                             <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                               <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                               <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                   <span className="font-medium text-sm">Week 2-3: Resolution</span>
                                   <Badge variant="secondary" className="text-xs">High</Badge>
                                 </div>
                                 <p className="text-xs text-muted-foreground mt-1">
                                   Resolve payment terms conflict, clarify delivery timeline, and review precedence conflicts
                                 </p>
                               </div>
                             </div>
                             
                             <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                               <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                   <span className="font-medium text-sm">Week 4: Optimization</span>
                                   <Badge variant="outline" className="text-xs">Medium</Badge>
                                 </div>
                                 <p className="text-xs text-muted-foreground mt-1">
                                   Update document templates, review clause numbering, and implement version control
                                 </p>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Responsibilities */}
                         <div className="space-y-4">
                           <h4 className="font-semibold text-sm">Team Responsibilities</h4>
                           <div className="grid gap-3 md:grid-cols-2">
                             <div className="p-3 border rounded-lg">
                               <h5 className="font-medium text-sm mb-2">Technical Team</h5>
                               <ul className="text-xs space-y-1 text-muted-foreground">
                                 <li>• Prepare technical specifications</li>
                                 <li>• Develop quality assurance plan</li>
                                 <li>• Ensure safety compliance</li>
                               </ul>
                             </div>
                             <div className="p-3 border rounded-lg">
                               <h5 className="font-medium text-sm mb-2">Legal Team</h5>
                               <ul className="text-xs space-y-1 text-muted-foreground">
                                 <li>• Resolve clause conflicts</li>
                                 <li>• Review precedence rules</li>
                                 <li>• Update contract terms</li>
                               </ul>
                             </div>
                             <div className="p-3 border rounded-lg">
                               <h5 className="font-medium text-sm mb-2">Procurement Team</h5>
                               <ul className="text-xs space-y-1 text-muted-foreground">
                                 <li>• Verify manual compliance</li>
                                 <li>• Update templates</li>
                                 <li>• Manage version control</li>
                               </ul>
                             </div>
                             <div className="p-3 border rounded-lg">
                               <h5 className="font-medium text-sm mb-2">Project Manager</h5>
                               <ul className="text-xs space-y-1 text-muted-foreground">
                                 <li>• Coordinate team efforts</li>
                                 <li>• Track progress</li>
                                 <li>• Ensure deadlines</li>
                               </ul>
                             </div>
                           </div>
                         </div>

                         <div className="flex gap-3 pt-4">
                           <Button variant="outline" className="flex-1">
                             <Download className="w-4 h-4 mr-2" />
                             Download as PDF
                           </Button>
                           <Button variant="outline" className="flex-1">
                             <FileSpreadsheet className="w-4 h-4 mr-2" />
                             Download as CSV
                           </Button>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 )}
               </div>
             )}
                     </TabsContent>

           {/* Document Repository Tab */}
           <TabsContent value="repository" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <FileCheck className="w-5 h-5" />
                   Document Repository
                 </CardTitle>
                 <CardDescription>
                   All uploaded documents and their validation status
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead className="w-16 whitespace-nowrap">SL No</TableHead>
                       <TableHead>Document Name</TableHead>
                       <TableHead>Type</TableHead>
                       <TableHead>Version</TableHead>
                       <TableHead>Upload Date</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Size</TableHead>
                       <TableHead>Validator</TableHead>
                       <TableHead className="text-right w-20">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {documentRepository.map((doc, index) => (
                       <TableRow key={doc.id} className="hover:bg-muted/50">
                         <TableCell className="font-medium text-center">{index + 1}</TableCell>
                         <TableCell className="font-medium">{doc.name}</TableCell>
                         <TableCell>
                           <Badge variant="outline">{doc.type}</Badge>
                         </TableCell>
                         <TableCell>
                           <Badge variant="secondary">{doc.version}</Badge>
                         </TableCell>
                         <TableCell>{doc.uploadDate}</TableCell>
                         <TableCell>{getStatusBadge(doc.status)}</TableCell>
                         <TableCell>{doc.size}</TableCell>
                         <TableCell>{doc.validator}</TableCell>
                         <TableCell className="text-right">
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                 <MoreHorizontal className="w-4 h-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem className="cursor-pointer">
                                 <Eye className="w-4 h-4 mr-2" />
                                 View
                               </DropdownMenuItem>
                               <DropdownMenuItem className="cursor-pointer">
                                 <Download className="w-4 h-4 mr-2" />
                                 Download
                               </DropdownMenuItem>
                               <DropdownMenuItem className="cursor-pointer">
                                 <History className="w-4 h-4 mr-2" />
                                 Version History
                               </DropdownMenuItem>
                               <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                 <Trash2 className="w-4 h-4 mr-2" />
                                 Delete
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
           </TabsContent>

           {/* BEC Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Bill of Engineering Components (BEC) Checklist
                </CardTitle>
                <CardDescription>
                  Comprehensive checklist for validating engineering components in tender documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {becChecklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox 
                        checked={item.checked} 
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{item.item}</Label>
                      </div>
                      <Badge 
                        variant={item.status === 'complete' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.status === 'complete' ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">BEC Validation Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Items:</span>
                      <span className="ml-2 font-medium">{becChecklist.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="ml-2 font-medium text-success">{becChecklist.filter(item => item.checked).length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="ml-2 font-medium text-warning">{becChecklist.filter(item => !item.checked).length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Version Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5" />
                  Document Version Comparison
                </CardTitle>
                <CardDescription>
                  Compare current documents with previous versions to track changes and improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Current Version</Label>
                      <Input placeholder="Q1 2024" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Previous Version</Label>
                      <Input placeholder="Q4 2023" className="mt-1" />
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Clause</TableHead>
                        <TableHead>Current Version</TableHead>
                        <TableHead>Previous Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clauseComparison.map((comparison, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{comparison.clause}</TableCell>
                          <TableCell>{comparison.current}</TableCell>
                          <TableCell>{comparison.previous}</TableCell>
                          <TableCell>{getComparisonStatusBadge(comparison.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{comparison.impact}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clause Analysis Tab */}
          <TabsContent value="clauses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Clause-Level Analysis
                </CardTitle>
                <CardDescription>
                  Detailed analysis of individual clauses for consistency and compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">SCC vs GCC Consistency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Clauses Analyzed:</span>
                            <span className="font-medium">45</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Consistent Clauses:</span>
                            <span className="font-medium text-success">42</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Conflicting Clauses:</span>
                            <span className="font-medium text-warning">3</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Procurement Manual Compliance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Compliance Score:</span>
                            <span className="font-medium text-success">95%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Compliant Clauses:</span>
                            <span className="font-medium text-success">43</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Non-Compliant Clauses:</span>
                            <span className="font-medium text-error">2</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                                     <div className="p-4 bg-muted rounded-lg">
                     <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                       <FileText className="w-4 h-4" />
                       Key Findings
                     </h4>
                     <div className="space-y-3">
                       <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                         <div className="p-1.5 bg-warning/10 rounded-full">
                           <AlertTriangle className="w-4 h-4 text-warning" />
                         </div>
                         <div className="flex-1">
                           <span className="text-sm font-medium">Clause 3.2.1: Payment terms conflict between SCC and GCC</span>
                         </div>
                       </div>
                       <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                         <div className="p-1.5 bg-warning/10 rounded-full">
                           <AlertTriangle className="w-4 h-4 text-warning" />
                         </div>
                         <div className="flex-1">
                           <span className="text-sm font-medium">Clause 5.1.3: Delivery timeline ambiguity in SOW</span>
                         </div>
                       </div>
                       <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                         <div className="p-1.5 bg-error/10 rounded-full">
                           <XCircle className="w-4 h-4 text-error" />
                         </div>
                         <div className="flex-1">
                           <span className="text-sm font-medium">Clause 7.2: Non-compliant with Procurement Manual Section 4.3</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Validation Reports & Analytics
                </CardTitle>
                <CardDescription>
                  Comprehensive reports and analytics for document validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        Document Verification Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Detailed report of all document validations with findings and recommendations
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <GitCompare className="w-4 h-4" />
                        Change Log Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Version history and change tracking across document iterations
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Clause Comparison Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Summary of clause-level analysis and consistency checks
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-3">Report Generation Options</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Report Format</Label>
                      <select className="w-full mt-1 p-2 border border-border rounded bg-background">
                        <option>PDF</option>
                        <option>DOCX</option>
                        <option>XLSX</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Include Sections</Label>
                      <div className="space-y-2 mt-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="executive-summary" defaultChecked />
                          <Label htmlFor="executive-summary" className="text-sm">Executive Summary</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="detailed-findings" defaultChecked />
                          <Label htmlFor="detailed-findings" className="text-sm">Detailed Findings</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="recommendations" defaultChecked />
                          <Label htmlFor="recommendations" className="text-sm">Recommendations</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Comprehensive Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DocumentChecker;