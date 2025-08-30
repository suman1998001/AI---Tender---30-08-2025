import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSignature, ShoppingCart, Mail, BarChart3, FileIcon, Eye, Download, Save, FileText, Search, Plus, X, ArrowLeft, Database, Zap, Send, Upload, Copy, Sparkles, Filter, Clock, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EnhancedKnowledgeBase } from "@/components/ui/enhanced-knowledge-base";

const GenerateDocumentDraft = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewContent, setPreviewContent] = useState<string>("");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateObjective, setTemplateObjective] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [currentObjective, setCurrentObjective] = useState("");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [currentField, setCurrentField] = useState<string>("");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [knowledgeBaseItems, setKnowledgeBaseItems] = useState([
    { id: 1, category: "Standard Clauses", title: "Payment Terms - Net 30", content: "Payment shall be due within thirty (30) days of invoice receipt. Late payments may incur a 1.5% monthly service charge." },
    { id: 2, category: "Standard Clauses", title: "Delivery Terms", content: "Delivery shall be made to the specified location during normal business hours. Risk of loss transfers upon delivery." },
    { id: 3, category: "Standard Clauses", title: "Confidentiality Clause", content: "All information disclosed under this agreement shall be treated as confidential and not disclosed to third parties." },
    { id: 4, category: "Legal Templates", title: "Termination Clause", content: "Either party may terminate this agreement with thirty (30) days written notice." },
    { id: 5, category: "Legal Templates", title: "Force Majeure", content: "Neither party shall be liable for delays caused by circumstances beyond their reasonable control." },
    { id: 6, category: "Company Policies", title: "Vendor Code of Conduct", content: "All vendors must comply with our ethical standards and business conduct requirements." },
    { id: 7, category: "Company Policies", title: "Quality Standards", content: "All deliverables must meet our quality specifications and industry standards." },
    { id: 8, category: "Regulatory", title: "Compliance Requirements", content: "All activities must comply with applicable local, state, and federal regulations." }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showInputForField, setShowInputForField] = useState<string>("");
  const [quickGeneratePrompt, setQuickGeneratePrompt] = useState("");
  const [contentFormat, setContentFormat] = useState<string>("Long");
  const [currentQuickGenerateLabel, setCurrentQuickGenerateLabel] = useState<string>("");

  const templates = {
    contracts: [
      { id: "service-agreement", name: "Service Agreement", description: "Standard service agreement template", fields: ["introduction", "serviceDescription", "contractValue", "startDate", "endDate", "paymentTerms"] },
      { id: "nda", name: "Non-Disclosure Agreement", description: "Confidentiality agreement template", fields: ["introduction", "purpose", "duration", "effectiveDate"] },
      { id: "maintenance-contract", name: "Maintenance Contract", description: "Equipment maintenance contract", fields: ["introduction", "equipmentType", "maintenanceScope", "contractValue", "duration"] }
    ],
    purchaseOrders: [
      { id: "standard-po", name: "Standard Purchase Order", description: "General purchase order template", fields: ["introduction", "poNumber", "vendorName", "itemDescription", "quantity", "unitPrice", "totalAmount", "deliveryDate"] },
      { id: "equipment-po", name: "Equipment Purchase Order", description: "Specialized equipment purchase order", fields: ["introduction", "poNumber", "vendorName", "equipmentSpecs", "model", "quantity", "unitPrice", "totalAmount", "warrantyPeriod"] }
    ],
    letters: [
      { id: "vendor-inquiry", name: "Vendor Inquiry Letter", description: "Letter for vendor capability inquiry", fields: ["introduction", "vendorName", "inquirySubject", "requirements", "responseDeadline"] },
      { id: "payment-reminder", name: "Payment Reminder", description: "Payment reminder notice", fields: ["introduction", "vendorName", "invoiceNumber", "amount", "dueDate", "overdueAmount"] },
      { id: "contract-termination", name: "Contract Termination Notice", description: "Notice of contract termination", fields: ["introduction", "vendorName", "contractNumber", "terminationDate", "reason"] }
    ],
    reports: [
      { id: "monthly-procurement", name: "Monthly Procurement Report", description: "Monthly procurement activity summary", fields: ["introduction", "reportPeriod", "totalSpending", "vendorCount", "contractsAwarded", "costSavings"] },
      { id: "vendor-performance", name: "Vendor Performance Report", description: "Vendor performance analysis", fields: ["introduction", "vendorName", "evaluationPeriod", "performanceScore", "deliveryRating", "qualityRating", "recommendations"] }
    ]
  };


  const getTemplateIcon = (category: string) => {
    switch (category) {
      case "contracts": return FileSignature;
      case "purchaseOrders": return ShoppingCart;
      case "letters": return Mail;
      case "reports": return BarChart3;
      default: return FileIcon;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData({});
  };

  const getCurrentTemplate = () => {
    for (const category of Object.values(templates)) {
      const template = category.find(t => t.id === selectedTemplate);
      if (template) return template;
    }
    return null;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    const template = getCurrentTemplate();
    if (!template) return;

    let content = `# ${template.name}\n\n`;
    
    // Generate content from all filled form fields and generated content
    template.fields.forEach(field => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
      const fieldData = formData[field];
      
      if (fieldData) {
        content += `## ${fieldName}\n\n`;
        
        if (Array.isArray(fieldData)) {
          // Handle generated content pieces
          fieldData.forEach((piece, index) => {
            content += `### ${piece.title}\n\n`;
            content += `${piece.content}\n\n`;
            if (index < fieldData.length - 1) content += `---\n\n`;
          });
        } else {
          // Handle regular text input
          content += `${fieldData}\n\n`;
        }
      } else {
        content += `## ${fieldName}\n\n`;
        content += `[${fieldName} content to be added]\n\n`;
      }
    });

    content += `\n\n---\n\n*This document was generated using the General Document Drafter system.*`;
    
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Document is being prepared for download...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleGenerate = () => {
    toast({
      title: "Document Generated",
      description: "Document has been generated and saved to repository.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Document draft has been saved successfully.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  // New comprehensive functions
  const getQuickGenerateOptions = (field: string) => {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    
    // Return at least 5 quick generate options for each field type
    const baseOptions = [
      { label: `Generate ${fieldName}`, prompt: `Generate comprehensive ${fieldName.toLowerCase()} content` },
      { label: "Professional Format", prompt: `Create professional ${fieldName.toLowerCase()} in business format` },
      { label: "Detailed Version", prompt: `Provide detailed ${fieldName.toLowerCase()} with specifications` },
      { label: "Standard Template", prompt: `Use standard template for ${fieldName.toLowerCase()}` },
      { label: "Custom Requirements", prompt: `Generate ${fieldName.toLowerCase()} based on specific requirements` }
    ];

    // Add field-specific options
    if (field === 'introduction') {
      return [
        { label: "Project Overview", prompt: "Generate comprehensive project overview and background" },
        { label: "Executive Summary", prompt: "Create executive summary with key highlights" },
        { label: "Purpose & Scope", prompt: "Define purpose and scope of the document" },
        { label: "Background Info", prompt: "Provide background information and context" },
        { label: "Document Structure", prompt: "Outline document structure and organization" },
        { label: "Key Objectives", prompt: "List key objectives and goals" },
        { label: "Stakeholder Overview", prompt: "Describe stakeholders and their roles" }
      ];
    } else if (field === 'vendorName') {
      return [
        ...baseOptions,
        { label: "Vendor Contact Info", prompt: "Generate vendor contact information and details" },
        { label: "Company Background", prompt: "Create vendor company background and credentials" }
      ];
    } else if (field === 'serviceDescription') {
      return [
        ...baseOptions,
        { label: "Technical Specifications", prompt: "Generate technical service specifications" },
        { label: "Scope of Work", prompt: "Create detailed scope of work description" }
      ];
    } else if (field === 'contractValue') {
      return [
        ...baseOptions,
        { label: "Cost Breakdown", prompt: "Generate detailed cost breakdown structure" },
        { label: "Payment Schedule", prompt: "Create payment schedule and milestones" }
      ];
    }
    
    return baseOptions;
  };

  const handleQuickGenerate = (field: string, prompt: string, label: string) => {
    setCurrentField(field);
    setQuickGeneratePrompt(prompt);
    setCurrentQuickGenerateLabel(label);
    setShowInputForField(field);
  };

  const handleGenerateContentInline = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fieldName = currentField.charAt(0).toUpperCase() + currentField.slice(1).replace(/([A-Z])/g, ' $1');
    
    // Generate content based on quick generate label and prompt
    let generatedContent = "";
    
    if (currentQuickGenerateLabel === 'Project Overview') {
      generatedContent = `The vision for this marketing project is to establish a robust and dynamic presence in the target market, leveraging innovative strategies to enhance brand recognition and customer engagement. By aligning our marketing efforts with the latest industry trends and consumer insights, we aim to create a compelling narrative that resonates with our audience and drives sustainable growth. This project will focus on integrating digital and traditional marketing channels to maximize reach and impact, ensuring that our brand message is consistently communicated across all platforms. Our ultimate goal is to build a loyal customer base and position our brand as a leader in the industry, setting the stage for long-term success and profitability.`;
    } else if (currentQuickGenerateLabel === 'Project Goals') {
      generatedContent = `The primary goal of this marketing project is to enhance brand visibility and drive customer engagement through strategic initiatives. By leveraging data-driven insights and innovative marketing techniques, we aim to increase market share and strengthen brand loyalty. Our approach will focus on creating compelling content, optimizing digital channels, and fostering meaningful customer interactions. Ultimately, the project seeks to achieve measurable growth in both customer acquisition and retention, ensuring a sustainable competitive advantage in the marketplace.`;
    } else {
      // Generate contextual content based on the prompt and label
      if (currentField === 'introduction') {
        if (quickGeneratePrompt.toLowerCase().includes('executive summary')) {
          generatedContent = `Executive Summary: This document presents a strategic initiative that delivers significant value through innovative solutions and efficient processes. Key benefits include enhanced operational efficiency, cost optimization, and improved stakeholder satisfaction. The proposed approach leverages industry best practices and proven methodologies to achieve measurable results.`;
        } else if (quickGeneratePrompt.toLowerCase().includes('purpose')) {
          generatedContent = `Purpose: The primary purpose of this document is to establish clear guidelines, requirements, and expectations for all parties involved. This document serves as a comprehensive reference that outlines roles, responsibilities, deliverables, and success criteria to ensure alignment and successful project execution.`;
        } else {
          generatedContent = `This document establishes the foundation for a comprehensive initiative that addresses critical business needs through structured planning and execution. The content herein provides detailed information regarding objectives, scope, requirements, and expected outcomes to guide all stakeholders throughout the project lifecycle.`;
        }
      } else {
        // For other fields, generate contextual content
        generatedContent = `This section provides comprehensive ${fieldName.toLowerCase()} information based on your specific requirements. The content includes detailed specifications, professional formatting, and industry-standard terminology to ensure compliance and clarity. All information has been structured to meet best practices and regulatory requirements.`;
      }
    }
    
    // Add user's specific requirements if provided
    if (quickGeneratePrompt.trim() && !currentQuickGenerateLabel.includes('Project')) {
      generatedContent += `\n\nSpecific Requirements: ${quickGeneratePrompt}`;
    }
    
    // Create content piece object
    const newContentPiece = {
      id: Date.now(),
      title: currentQuickGenerateLabel,
      content: generatedContent,
      timestamp: new Date().toISOString(),
      format: contentFormat
    };
    
    // Store as array of content pieces
    const existingPieces = formData[currentField] || [];
    const updatedPieces = Array.isArray(existingPieces) ? [...existingPieces, newContentPiece] : [newContentPiece];
    
    handleInputChange(currentField, updatedPieces);
    setIsGenerating(false);
    setShowInputForField("");
    setQuickGeneratePrompt("");
    setCurrentQuickGenerateLabel("");
    
    toast({
      title: "Content Generated",
      description: `${currentQuickGenerateLabel} content has been generated successfully.`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Process files for knowledge base
    files.forEach(file => {
      const newItem = {
        id: Date.now() + Math.random(),
        category: "Uploaded Documents",
        title: file.name,
        content: `Content extracted from ${file.name}. This document contains relevant information that can be used in document generation.`
      };
      setKnowledgeBaseItems(prev => [...prev, newItem]);
    });
    
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded and added to knowledge base.`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleWebSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate web search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = [
      {
        id: Date.now() + 1,
        title: `${searchQuery} - Best Practices Guide`,
        content: `Comprehensive guide about ${searchQuery} including industry standards, best practices, and recommended approaches.`,
        source: "Industry Publications",
        relevance: 95
      },
      {
        id: Date.now() + 2,
        title: `Legal Requirements for ${searchQuery}`,
        content: `Legal and regulatory requirements related to ${searchQuery}, including compliance standards and mandatory clauses.`,
        source: "Legal Database",
        relevance: 90
      },
      {
        id: Date.now() + 3,
        title: `Template Examples: ${searchQuery}`,
        content: `Template examples and sample documents for ${searchQuery} with proven track record in professional settings.`,
        source: "Template Library",
        relevance: 88
      }
    ];
    
    setSearchResults(mockResults);
    setIsSearching(false);
    
    toast({
      title: "Search Complete",
      description: `Found ${mockResults.length} results for "${searchQuery}".`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const addToKnowledgeBase = (item: any) => {
    const newItem = {
      id: Date.now(),
      category: "Search Results",
      title: item.title,
      content: item.content
    };
    
    setKnowledgeBaseItems(prev => [...prev, newItem]);
    toast({
      title: "Added to Knowledge Base",
      description: "Search result has been added to your knowledge base.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleInsertKnowledgeBase = (content: string) => {
    if (currentField) {
      const existing = formData[currentField] || "";
      const updatedContent = existing ? `${existing}\n\n${content}` : content;
      handleInputChange(currentField, updatedContent);
    }
    
    toast({
      title: "Content Inserted",
      description: "Knowledge base content has been inserted.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
    setIsKnowledgeBaseOpen(false);
  };

  const selectedTemplateData = getCurrentTemplate();

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto pr-80"> {/* Add right padding to account for fixed sidebar */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/document-drafter")}
                className="text-gray-600 hover:text-red-muted -ml-2 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Document Drafter
              </Button>
              
              <div>
                <div className="flex items-center gap-2 mb-2 transition-all duration-300">
                  <Zap className="h-5 w-5 text-red-accent animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">AI-Powered Document Builder</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  General Document Drafter
                </h1>
                <p className="text-muted-foreground">
                  {selectedTemplateData ? `Template: ${selectedTemplateData.name}` : "Use AI-powered prompts to generate comprehensive document content"}
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="space-y-6">
              {!selectedTemplate ? (
                // Skeleton loaders when no template is selected
                <>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Card key={index} className="bg-card border-border animate-fade-in">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-96" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map((badgeIndex) => (
                              <Skeleton key={badgeIndex} className="h-6 w-20" />
                            ))}
                          </div>
                        </div>
                        <div className="bg-muted/20 rounded-lg p-4 border-2 border-dashed border-muted">
                          <div className="text-center space-y-2">
                            <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                            <Skeleton className="h-4 w-32 mx-auto" />
                            <Skeleton className="h-3 w-48 mx-auto" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No Document Template Selected
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Create a new document by selecting a template to get started with AI-powered content generation.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Actual sections when template is selected
                selectedTemplateData?.fields.map((field, index) => {
                  const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
                  const sectionNumber = index + 1;
                  
                  return (
                    <Card key={field} className="bg-card border-border transition-all duration-500 animate-fade-in group" style={{
                      animationDelay: `${index * 100}ms`
                    }}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground mb-1 group-hover:text-red-accent transition-colors duration-300">
                              {sectionNumber}. {fieldName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              Configure the {fieldName.toLowerCase()} for your document
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-red-accent" />
                            <span className="text-sm font-medium text-foreground">Quick Generate:</span>
                          </div>
                          
                          {/* Quick Generate Buttons - Now Dynamic and Comprehensive */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {getQuickGenerateOptions(field).slice(0, 5).map((option, optionIndex) => (
                              <Badge 
                                key={optionIndex}
                                variant="outline" 
                                className="cursor-pointer hover:bg-red-muted hover:text-white border-red-muted text-red-muted transition-all duration-200 animate-fade-in"
                                style={{ animationDelay: `${optionIndex * 50}ms` }}
                                onClick={() => handleQuickGenerate(field, option.prompt, option.label)}
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                {option.label}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Content Input Area - Now shows inline generation */}
                        <div className="bg-muted/20 rounded-lg p-4 border-2 border-dashed border-muted min-h-[120px]">
                          {/* Generated Content Section */}
                          {formData[field] && Array.isArray(formData[field]) && formData[field].length > 0 ? (
                            <div className="space-y-4">
                              {/* Content Title */}
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                                  <div className="text-white text-xs">📄</div>
                                </div>
                                <span className="text-sm font-medium text-foreground">Generated Content:</span>
                              </div>
                              
                              {/* Individual Content Pieces */}
                              {formData[field].map((contentPiece: any, index: number) => (
                                <div key={contentPiece.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                  {/* Content Header */}
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">{contentPiece.title}</h4>
                                  </div>
                                  
                                  {/* Content Format Badge */}
                                  <div className="mb-2">
                                    <Badge variant="outline" className="text-xs bg-gray-100">
                                      {contentPiece.format?.toUpperCase() || 'LONG FORMAT'}
                                    </Badge>
                                  </div>
                                  
                                  {/* Content Text */}
                                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {contentPiece.content}
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 pt-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                      Make it short
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                      Make it long
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                      Make it professional
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      History
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Input Field for Additional Content */}
                              {showInputForField === field && (
                                <div className="space-y-3 animate-fade-in border-t pt-4">
                                  <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
                                      <Sparkles className="h-4 w-4 text-red-accent" />
                                      Generate content for: {currentQuickGenerateLabel}
                                    </h4>
                                    <p className="text-sm text-blue-600">
                                      Press Enter to generate
                                    </p>
                                  </div>
                                  <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                      <Textarea
                                        placeholder={quickGeneratePrompt || "goal"}
                                        value={quickGeneratePrompt}
                                        onChange={(e) => setQuickGeneratePrompt(e.target.value)}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleGenerateContentInline();
                                          }
                                        }}
                                        className="min-h-[80px] resize-none"
                                        disabled={isGenerating}
                                      />
                                    </div>
                                    <div className="self-start pt-2">
                                      <Select value={contentFormat} onValueChange={setContentFormat}>
                                        <SelectTrigger className="w-20 h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Short">Short</SelectItem>
                                          <SelectItem value="Long">Long</SelectItem>
                                          <SelectItem value="Medium">Medium</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Press Enter to generate, Shift+Enter for new line</span>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setShowInputForField("");
                                          setQuickGeneratePrompt("");
                                        }}
                                        disabled={isGenerating}
                                        className="h-7 text-xs"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={handleGenerateContentInline}
                                        disabled={isGenerating}
                                        className="bg-gray-900 hover:bg-gray-800 text-white h-7 text-xs flex items-center gap-1"
                                      >
                                        {isGenerating ? (
                                          <>
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                            Generating...
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="h-3 w-3" />
                                            Generate Content
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Add More Content Button */}
                              {showInputForField !== field && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowInputForField(field)}
                                  className="h-7 text-xs"
                                >
                                  Add More Content
                                </Button>
                              )}
                            </div>
                          ) : showInputForField === field ? (
                            // Inline Generation Interface for Empty Field
                            <div className="space-y-3 animate-fade-in">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-red-accent" />
                                  Generate content for: {fieldName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Describe what you want to include about {fieldName.toLowerCase()}...
                                </p>
                              </div>
                              <Textarea
                                placeholder="Press Enter to generate"
                                value={quickGeneratePrompt}
                                onChange={(e) => setQuickGeneratePrompt(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerateContentInline();
                                  }
                                }}
                                className="min-h-[80px] resize-none"
                                disabled={isGenerating}
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Press Enter to generate, Shift+Enter for new line</span>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setShowInputForField("");
                                      setQuickGeneratePrompt("");
                                    }}
                                    disabled={isGenerating}
                                    className="h-7 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={handleGenerateContentInline}
                                    disabled={!quickGeneratePrompt.trim() || isGenerating}
                                    className="bg-red-muted hover:bg-red-accent text-white h-7 text-xs"
                                  >
                                    {isGenerating ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Generate Content
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-2">
                              <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                              <p className="text-sm font-medium text-muted-foreground">No content generated yet</p>
                              <p className="text-xs text-muted-foreground">Click a quick generate option above or add custom content below</p>
                            </div>
                          )}
                        </div>

                        {/* Add Custom Content Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newContentPiece = {
                              id: Date.now(),
                              title: "Custom Content",
                              content: `Sample ${fieldName.toLowerCase()} content for demonstration`,
                              timestamp: new Date().toISOString(),
                              format: "Custom"
                            };
                            const existingPieces = formData[field] || [];
                            const updatedPieces = Array.isArray(existingPieces) ? [...existingPieces, newContentPiece] : [newContentPiece];
                            handleInputChange(field, updatedPieces);
                          }}
                          className="w-full border-dashed border-muted hover:border-red-muted hover:text-red-muted"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Content
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Fixed Right Sidebar */}
        <div className="fixed right-0 top-[120px] h-[calc(100vh-120px)] w-72 bg-card border-l border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Document Controls Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-accent rounded-full"></div>
              <h3 className="font-semibold text-foreground">Document Controls</h3>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setShowTemplateDialog(true)}
                className="w-full bg-red-muted hover:bg-red-accent text-white justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Document
              </Button>

              <Button
                variant="outline"
                onClick={handlePreview}
                className="w-full justify-start border-red-muted text-red-muted hover:bg-red-muted hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Draft
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="w-full justify-start bg-gray-600 border-gray-600 text-white hover:bg-gray-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsKnowledgeBaseOpen(true)}
                className="w-full justify-start border-red-muted text-red-muted hover:bg-red-muted hover:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                Show Knowledgebase
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-red-muted text-red-muted hover:bg-red-muted hover:text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send for Review
              </Button>
            </div>

            <Separator />

            {/* Progress Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <h4 className="font-medium text-foreground">Progress Summary</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sections Completed:</span>
                  <span className="font-medium text-foreground">
                    {selectedTemplateData ? Object.keys(formData).length : 0}/{selectedTemplateData?.fields.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="font-medium text-foreground">
                    {selectedTemplateData?.name || "None Selected"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Words:</span>
                  <span className="font-medium text-foreground">
                    {Object.values(formData).join(' ').split(' ').filter(word => word.length > 0).length}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Clear All Content Button */}
            <Button
              variant="outline"
              onClick={() => setFormData({})}
              className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Content
            </Button>
          </div>
        </div>

        {/* Template Selection Dialog */}
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Select Document Template
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-select" className="text-sm font-medium text-gray-700">
                  Template Type
                </Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(templates).map(([category, categoryTemplates]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                          {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                        </div>
                        {categoryTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{template.name}</span>
                              <span className="text-xs text-gray-500">{template.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="text-sm font-medium text-gray-700">
                  Document Objective
                </Label>
                <Textarea
                  id="objective"
                  placeholder="Describe the purpose and objective of this document..."
                  value={templateObjective}
                  onChange={(e) => setTemplateObjective(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedTemplate) {
                      const template = getCurrentTemplate();
                      setCurrentTemplate(template);
                      setCurrentObjective(templateObjective);
                      setShowTemplateDialog(false);
                      setFormData({});
                      toast({
                        title: "Template Selected",
                        description: `${template?.name} template has been loaded.`,
                        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
                      });
                    }
                  }}
                  disabled={!selectedTemplate}
                  className="bg-red-muted hover:bg-red-accent text-white"
                >
                  Select Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Knowledge Base Modal - Matches Design */}
        <EnhancedKnowledgeBase
          open={isKnowledgeBaseOpen}
          onOpenChange={setIsKnowledgeBaseOpen}
          onInsertContent={handleInsertKnowledgeBase}
        />


        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Document Preview
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="border-red-muted text-red-muted hover:bg-red-muted hover:text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsPreviewOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white min-h-[500px] max-h-[60vh] overflow-auto">
              <div className="prose max-w-none">
                {previewContent.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mb-4 text-gray-900">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1">{line.substring(3)}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium mb-2 text-gray-700">{line.substring(4)}</h3>;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={index} className="text-lg font-semibold mb-2 text-gray-900">{line.slice(2, -2)}</h3>;
                  } else if (line.startsWith('---')) {
                    return <hr key={index} className="my-4 border-gray-200" />;
                  } else if (line.startsWith('*') && line.endsWith('*')) {
                    return <p key={index} className="text-sm text-gray-500 italic">{line.slice(1, -1)}</p>;
                  } else if (line.trim()) {
                    return <p key={index} className="text-gray-700 mb-2 leading-relaxed">{line}</p>;
                  } else {
                    return <br key={index} />;
                  }
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GenerateDocumentDraft;