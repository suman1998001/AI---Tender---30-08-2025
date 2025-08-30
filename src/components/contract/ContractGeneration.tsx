import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, FileText, Plus, Sparkles, Target, Edit, Loader2, Wand2, Zap, Check, X, Save, Send, Clock, Download, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import KnowledgebaseIntegration from './KnowledgebaseIntegration';

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

interface ContentPiece {
  id: string;
  prompt: string;
  content: string;
  userInput: string;
}

interface ContractSection {
  id: string;
  title: string;
  description: string;
  prompts: string[];
  contentPieces: ContentPiece[];
  isGenerating: boolean;
}

interface ContractGenerationProps {
  onBack: () => void;
  onSave?: (contractData: Partial<Contract>) => Promise<void>;
}

const ContractGeneration = ({ onBack, onSave }: ContractGenerationProps) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [activePromptInput, setActivePromptInput] = useState<Record<string, string>>({});
  const [showPromptInput, setShowPromptInput] = useState<Record<string, boolean>>({});
  const [editingContent, setEditingContent] = useState<Record<string, boolean>>({});
  const [editContent, setEditContent] = useState<Record<string, string>>({});
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [contractName, setContractName] = useState("");
  const [hasSelectedTemplate, setHasSelectedTemplate] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [hoveredContent, setHoveredContent] = useState<string>("");
  const [showKnowledgebase, setShowKnowledgebase] = useState(false);
  const [activeContentPieceForKnowledge, setActiveContentPieceForKnowledge] = useState<string>("");

  // Template sections based on contract type
  const getTemplateSections = (template: string): ContractSection[] => {
    const templates = {
      "msa": [
        {
          id: "introduction",
          title: "1. Introduction & Parties",
          description: "Contract parties and background information",
          prompts: ["Contract Parties", "Business Background", "Relationship Purpose", "Key Contacts"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "scope",
          title: "2. Scope of Services",
          description: "Service boundaries and deliverables",
          prompts: ["Service Definitions", "Deliverable Requirements", "Performance Standards", "Service Levels"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "terms",
          title: "3. Terms & Conditions",
          description: "Legal terms and conditions",
          prompts: ["Payment Terms", "Liability Clauses", "Intellectual Property", "Confidentiality"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "pricing",
          title: "4. Pricing & Payment",
          description: "Financial terms, pricing models, and payment schedules",
          prompts: ["Pricing Structure", "Payment Schedule", "Late Payment Penalties", "Currency & Exchange", "Expense Reimbursement"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "performance",
          title: "5. Performance & Quality Standards",
          description: "Service level agreements and quality metrics",
          prompts: ["Key Performance Indicators", "Quality Assurance", "Response Times", "Availability Requirements", "Performance Reporting"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "governance",
          title: "6. Governance & Communication",
          description: "Project governance, communication protocols, and escalation procedures",
          prompts: ["Governance Structure", "Communication Protocols", "Meeting Schedules", "Escalation Procedures", "Change Management"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "termination",
          title: "7. Termination & Exit",
          description: "Contract termination conditions and exit procedures",
          prompts: ["Termination Conditions", "Notice Periods", "Data Transition", "Knowledge Transfer", "Post-Termination Obligations"],
          contentPieces: [],
          isGenerating: false
        }
      ],
      "nda": [
        {
          id: "introduction",
          title: "1. Introduction & Purpose",
          description: "Agreement purpose and confidential information definition",
          prompts: ["Agreement Purpose", "Information Definition", "Disclosure Context", "Business Rationale"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "obligations",
          title: "2. Confidentiality Obligations",
          description: "Confidentiality duties and restrictions",
          prompts: ["Non-Disclosure Duties", "Use Restrictions", "Protection Standards", "Third Party Disclosure"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "exclusions",
          title: "3. Information Exclusions",
          description: "Information that is not considered confidential",
          prompts: ["Public Information", "Previously Known Information", "Independently Developed", "Required Disclosure", "Authorized Disclosure"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "duration",
          title: "4. Duration & Term",
          description: "Agreement duration and confidentiality period",
          prompts: ["Agreement Term", "Confidentiality Period", "Survival Clauses", "Extension Provisions", "Termination Effects"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "remedies",
          title: "5. Remedies & Enforcement",
          description: "Breach consequences and enforcement mechanisms",
          prompts: ["Breach Consequences", "Injunctive Relief", "Damages & Compensation", "Legal Costs", "Dispute Resolution"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "general",
          title: "6. General Provisions",
          description: "Miscellaneous terms and legal provisions",
          prompts: ["Governing Law", "Jurisdiction", "Amendment Procedures", "Entire Agreement", "Severability"],
          contentPieces: [],
          isGenerating: false
        }
      ],
      "sow": [
        {
          id: "introduction",
          title: "1. Project Overview",
          description: "Project scope and objectives",
          prompts: ["Project Description", "Business Objectives", "Success Criteria", "Project Context"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "deliverables",
          title: "2. Deliverables & Timeline",
          description: "Project deliverables and schedule",
          prompts: ["Key Deliverables", "Delivery Schedule", "Milestones", "Dependencies"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "resources",
          title: "3. Resources & Responsibilities",
          description: "Team structure, roles, and resource allocation",
          prompts: ["Team Structure", "Role Definitions", "Resource Allocation", "Client Responsibilities", "Vendor Responsibilities"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "methodology",
          title: "4. Methodology & Approach",
          description: "Project methodology and execution approach",
          prompts: ["Project Methodology", "Work Approach", "Quality Assurance", "Risk Management", "Communication Plan"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "acceptance",
          title: "5. Acceptance Criteria",
          description: "Deliverable acceptance and testing procedures",
          prompts: ["Acceptance Criteria", "Testing Procedures", "Sign-off Process", "Defect Resolution", "User Acceptance Testing"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "assumptions",
          title: "6. Assumptions & Constraints",
          description: "Project assumptions, constraints, and dependencies",
          prompts: ["Key Assumptions", "Project Constraints", "External Dependencies", "Technical Requirements", "Environmental Factors"],
          contentPieces: [],
          isGenerating: false
        }
      ],
      "consulting": [
        {
          id: "introduction",
          title: "1. Introduction & Engagement",
          description: "Consulting engagement overview and parties",
          prompts: ["Engagement Overview", "Consultant Background", "Client Requirements", "Engagement Objectives"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "services",
          title: "2. Consulting Services",
          description: "Detailed description of consulting services",
          prompts: ["Service Description", "Methodology", "Expertise Areas", "Service Boundaries", "Exclusions"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "fees",
          title: "3. Fees & Expenses",
          description: "Fee structure and expense reimbursement",
          prompts: ["Fee Structure", "Hourly Rates", "Expense Policy", "Payment Terms", "Additional Costs"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "intellectual",
          title: "4. Intellectual Property",
          description: "Intellectual property ownership and licensing",
          prompts: ["Work Product Ownership", "Pre-existing IP", "License Grants", "Third Party IP", "IP Indemnification"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "confidentiality",
          title: "5. Confidentiality & Non-Compete",
          description: "Confidentiality obligations and non-compete restrictions",
          prompts: ["Confidential Information", "Non-Disclosure", "Non-Compete Clause", "Client Protection", "Information Security"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "liability",
          title: "6. Liability & Insurance",
          description: "Liability limitations and insurance requirements",
          prompts: ["Liability Limitations", "Insurance Requirements", "Indemnification", "Professional Liability", "Risk Allocation"],
          contentPieces: [],
          isGenerating: false
        }
      ],
      "maintenance": [
        {
          id: "introduction",
          title: "1. Introduction & Coverage",
          description: "Maintenance agreement overview and coverage scope",
          prompts: ["Maintenance Overview", "Equipment Coverage", "Service Scope", "Support Levels"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "services",
          title: "2. Maintenance Services",
          description: "Detailed maintenance service descriptions",
          prompts: ["Preventive Maintenance", "Corrective Maintenance", "Emergency Support", "Software Updates", "Spare Parts"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "sla",
          title: "3. Service Level Agreements",
          description: "Service level commitments and performance metrics",
          prompts: ["Response Times", "Resolution Times", "Availability Targets", "Performance Metrics", "Escalation Procedures"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "schedule",
          title: "4. Maintenance Schedule",
          description: "Maintenance scheduling and planning procedures",
          prompts: ["Maintenance Windows", "Scheduling Process", "Advance Notice", "Emergency Procedures", "Downtime Management"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "reporting",
          title: "5. Reporting & Documentation",
          description: "Maintenance reporting and documentation requirements",
          prompts: ["Service Reports", "Performance Reports", "Documentation Updates", "Change Logs", "Compliance Records"],
          contentPieces: [],
          isGenerating: false
        },
        {
          id: "renewal",
          title: "6. Renewal & Modifications",
          description: "Contract renewal and modification procedures",
          prompts: ["Renewal Terms", "Price Adjustments", "Scope Changes", "Equipment Updates", "Contract Modifications"],
          contentPieces: [],
          isGenerating: false
        }
      ]
    };
    return templates[template as keyof typeof templates] || [];
  };

  const [sections, setSections] = useState<ContractSection[]>([]);

  const handlePromptClick = (sectionId: string, prompt: string) => {
    setShowPromptInput(prev => ({
      ...prev,
      [`${sectionId}-${prompt}`]: true
    }));
    setActivePromptInput(prev => ({
      ...prev,
      [`${sectionId}-${prompt}`]: ''
    }));
  };

  const generateAIContent = async (prompt: string, userInput: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-rfp-content', {
        body: { prompt, userInput, isRegeneration: false }
      });
      if (error) throw error;
      return data.generatedText;
    } catch (error) {
      return `This section addresses ${prompt.toLowerCase()} requirements related to ${userInput}. The specific terms and conditions will be tailored to meet the unique needs of this contractual relationship while ensuring compliance with applicable laws and industry standards.`;
    }
  };

  const handleGenerateContent = async (sectionId: string, prompt: string) => {
    const inputKey = `${sectionId}-${prompt}`;
    const userInput = activePromptInput[inputKey];
    
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide input for content generation.",
        variant: "destructive"
      });
      return;
    }

    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, isGenerating: true } : section
    ));

    try {
      const generatedContent = await generateAIContent(prompt, userInput);
      
      const newContentPiece: ContentPiece = {
        id: Date.now().toString(),
        prompt,
        content: generatedContent,
        userInput
      };

      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              contentPieces: [...section.contentPieces, newContentPiece],
              isGenerating: false
            }
          : section
      ));

      setActivePromptInput(prev => ({ ...prev, [inputKey]: '' }));
      setShowPromptInput(prev => ({ ...prev, [inputKey]: false }));

      toast({
        title: "Content Generated",
        description: `Content for "${prompt}" has been generated successfully.`
      });

    } catch (error) {
      setSections(prev => prev.map(section => 
        section.id === sectionId ? { ...section, isGenerating: false } : section
      ));
      
      toast({
        title: "Generation Failed", 
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateContract = () => {
    if (!selectedTemplate || !contractName.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please select a template and enter a contract name.",
        variant: "destructive"
      });
      return;
    }

    const newSections = getTemplateSections(selectedTemplate);
    setSections(newSections);
    setActiveSection(newSections[0]?.id || "");
    setHasSelectedTemplate(true);
    setShowTemplateDialog(false);

    toast({
      title: "Contract Template Loaded",
      description: `Contract template has been loaded successfully.`
    });
  };

  const handleSaveDraft = async () => {
    if (sections.length === 0 || totalContentPieces === 0) {
      toast({
        title: "No Content to Save",
        description: "Please generate some content before saving.",
        variant: "destructive"
      });
      return;
    }

    if (!contractName.trim()) {
      toast({
        title: "Contract Name Required",
        description: "Please enter a contract name before saving.",
        variant: "destructive"
      });
      return;
    }

    // Prepare contract data for saving
    const contractData: Contract = {
      name: contractName,
      vendor: "Generated Vendor", // Static data for now
      status: "Active",
      contract_details: sections.map(section => 
        `${section.title}: ${section.contentPieces.map(cp => cp.content).join(' ')}`
      ).join('\n\n'),
      value: 100000, // Static data for now
      lifecycle_alerts: "Contract review scheduled", // Static data for now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      // Use the API service to save the contract
      // This part would typically involve an API call to your backend
      // For now, we'll just simulate a successful save
      console.log("Simulating save to local state:", contractData);
      toast({
        title: "Success",
        description: "Contract saved successfully to local state!"
      });
      
      // If onSave callback is provided, call it with the saved data
      if (onSave) {
        await onSave(contractData);
      }
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: "Error",
        description: "Failed to save contract. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportToPDF = () => {
    if (sections.length === 0 || totalContentPieces === 0) {
      toast({
        title: "No Content to Export",
        description: "Please generate some content before exporting.",
        variant: "destructive"
      });
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 6;
    let yPosition = margin;

    // Add title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(contractName || "Contract Document", margin, yPosition);
    yPosition += lineHeight * 2;

    // Add template type
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    const templateName = selectedTemplate === 'msa' ? 'Master Service Agreement' :
                        selectedTemplate === 'nda' ? 'Non-Disclosure Agreement' :
                        selectedTemplate === 'sow' ? 'Statement of Work' :
                        selectedTemplate === 'consulting' ? 'Consulting Agreement' :
                        selectedTemplate === 'maintenance' ? 'Annual Maintenance Contract' : 'Contract';
    pdf.text(`Template: ${templateName}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Add content sections
    sections.forEach((section) => {
      if (section.contentPieces.length > 0) {
        // Add section title
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(section.title, margin, yPosition);
        yPosition += lineHeight * 1.5;

        // Add content pieces
        section.contentPieces.forEach((content) => {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          
          // Split content into lines that fit the page width
          const splitText = pdf.splitTextToSize(content.content, pageWidth - (margin * 2));
          
          // Check if we need a new page
          if (yPosition + (splitText.length * lineHeight) > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * lineHeight + 10;
        });

        yPosition += lineHeight;
      }
    });

    // Save the PDF
    const fileName = `${contractName || 'contract'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    toast({
      title: "PDF Downloaded",
      description: `Contract has been exported as ${fileName}`
    });
  };

  const handleInsertKnowledgeContent = (content: string) => {
    // If no section is selected, insert into the first available section
    const targetSectionId = activeContentPieceForKnowledge || sections[0]?.id;
    
    if (!targetSectionId) {
      toast({
        title: "No Sections Available",
        description: "Please create a contract template first.",
        variant: "destructive"
      });
      return;
    }

    const newContentPiece: ContentPiece = {
      id: Date.now().toString(),
      prompt: "Knowledge Base Content",
      content,
      userInput: "Inserted from knowledgebase"
    };

    setSections(prev => prev.map(section => 
      section.id === targetSectionId 
        ? { 
            ...section, 
            contentPieces: [...section.contentPieces, newContentPiece]
          }
        : section
    ));

    const targetSection = sections.find(s => s.id === targetSectionId);
    toast({
      title: "Content Inserted",
      description: `Knowledge content added to "${targetSection?.title || 'section'}"`
    });

    // Don't clear selection or close knowledgebase for better UX
  };

  const getCurrentContext = () => {
    const activeSection = sections.find(s => s.id === activeContentPieceForKnowledge);
    return activeSection ? `${activeSection.title} - ${activeSection.description}` : "";
  };

  const totalContentPieces = sections.reduce((total, section) => total + section.contentPieces.length, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-white rounded-2xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 hover:bg-red-accent-light border-gray-200 text-black">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {!hasSelectedTemplate ? (
        <>
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-gray-400" />
              <h1 className="text-3xl font-bold text-foreground">AI-Powered Contract Builder</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Click the "Create New Contract" button to generate a contract template.
            </p>
            <p className="text-gray-600">
              Use AI-powered prompts to generate comprehensive contract content
            </p>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-8">
            {/* Empty State */}
            <div className="xl:col-span-3">
              <Card className="rounded-2xl border min-h-[400px] p-6">
                <div className="space-y-6">
                  {/* Header skeleton */}
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                  
                  {/* Content sections skeleton */}
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      </div>
                      <div className="space-y-2 ml-11">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
                      </div>
                      <div className="flex space-x-2 ml-11">
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Controls Panel */}
            <div className="xl:col-span-1 space-y-4">
              <Card className="rounded-2xl border border-gray-200 bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-black">
                    <div className="p-2 bg-black rounded-xl">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Contract Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <Button
                    onClick={() => setShowTemplateDialog(true)}
                    className="w-full bg-white border border-gray-200 text-black hover:bg-gray-50 rounded-xl py-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Contract
                  </Button>
                  
                  <Button
                    variant="secondary"
                    disabled
                    className="w-full rounded-xl py-3"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  
                  <Button
                    variant="outline"
                    disabled
                    className="w-full rounded-xl py-3"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    disabled
                    className="w-full rounded-xl py-3"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send for Review
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-gray-200 bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-black">
                    <div className="p-2 bg-black rounded-xl">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Sections Completed:</span>
                    <span className="font-medium">0/{sections.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Template:</span>
                    <span className="font-medium">Not selected yet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Content:</span>
                    <span className="font-medium">0 pieces</span>
                  </div>
                  
                  <Button
                    variant="secondary"
                    disabled
                    className="w-full rounded-xl py-3 mt-4"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header with Template Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-red-accent" />
              <h1 className="text-3xl font-bold text-foreground">{contractName}</h1>
            </div>
            <p className="text-muted-foreground">
              {selectedTemplate === 'msa' ? 'Master Service Agreement' :
               selectedTemplate === 'nda' ? 'Non-Disclosure Agreement' :
               selectedTemplate === 'sow' ? 'Statement of Work' :
               selectedTemplate === 'consulting' ? 'Consulting Agreement' :
               selectedTemplate === 'maintenance' ? 'Annual Maintenance Contract' : 'Contract'} - AI Content Generation
            </p>
          </div>

          {/* Main Interface - Updated Layout */}
          <div className={`grid gap-6 ${showKnowledgebase ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1 xl:grid-cols-4'}`}>
            {/* Main Content Area - Left Side */}
            <div className={`${showKnowledgebase ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-6`}>
              {sections.map((section) => (
                <Card 
                  key={section.id} 
                  className={`rounded-2xl border transition-all duration-200 ${
                    activeContentPieceForKnowledge === section.id 
                      ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-black">
                          {section.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                      {activeContentPieceForKnowledge === section.id && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">Selected for Knowledge</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Quick Generate Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Quick Generate:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.prompts.map((prompt) => (
                          <Button
                            key={prompt}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePromptClick(section.id, prompt)}
                            className="text-xs border-gray-200 hover:border-black hover:bg-gray-50 rounded-lg"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Content Generation Input */}
                    {section.prompts.map((prompt) => {
                      const inputKey = `${section.id}-${prompt}`;
                      if (!showPromptInput[inputKey]) return null;
                      
                      return (
                        <div key={prompt} className="space-y-3 p-4 bg-gray-50 rounded-xl border">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                            <Label className="text-sm font-medium">Generate content for: {prompt}</Label>
                            <span className="text-xs text-gray-500">Press Enter to generate</span>
                          </div>
                          <Textarea
                            value={activePromptInput[inputKey] || ''}
                            onChange={(e) => setActivePromptInput(prev => ({
                              ...prev,
                              [inputKey]: e.target.value
                            }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleGenerateContent(section.id, prompt);
                              }
                            }}
                            placeholder={prompt.toLowerCase()}
                            className="rounded-xl border-gray-200 focus:border-black min-h-[80px] resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleGenerateContent(section.id, prompt)}
                              disabled={section.isGenerating}
                              className="bg-black text-white hover:bg-gray-800 rounded-xl"
                              size="sm"
                            >
                              {section.isGenerating ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Generate Content
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowPromptInput(prev => ({
                                ...prev,
                                [inputKey]: false
                              }))}
                              className="rounded-xl"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Generated Content Display */}
                    {section.contentPieces.length > 0 && (
                      <div className="space-y-4">
                        {section.contentPieces.map((content) => (
                          <div key={content.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Generated Content:</span>
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                {content.prompt}
                              </Badge>
                            </div>
                            
                            {editingContent[content.id] ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={editContent[content.id] || content.content}
                                  onChange={(e) => setEditContent(prev => ({
                                    ...prev,
                                    [content.id]: e.target.value
                                  }))}
                                  className="rounded-xl border-gray-200 focus:border-black min-h-[120px] text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSections(prev => prev.map(sec => 
                                        sec.id === section.id
                                          ? {
                                              ...sec,
                                              contentPieces: sec.contentPieces.map(piece => 
                                                piece.id === content.id
                                                  ? { ...piece, content: editContent[content.id] || piece.content }
                                                  : piece
                                              )
                                            }
                                          : sec
                                      ));
                                      setEditingContent(prev => ({ ...prev, [content.id]: false }));
                                      toast({ title: "Content Updated", description: "Your changes have been saved." });
                                    }}
                                    className="bg-black text-white hover:bg-gray-800 rounded-xl"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingContent(prev => ({ ...prev, [content.id]: false }))}
                                    className="rounded-xl"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div 
                                  className="p-4 bg-white border border-gray-200 rounded-xl relative group"
                                  onMouseEnter={() => setHoveredContent(content.id)}
                                  onMouseLeave={() => setHoveredContent("")}
                                >
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {content.content}
                                  </p>
                                  
                                  {/* Hover Action Buttons */}
                                  {hoveredContent === content.id && (
                                    <div className="absolute top-2 right-2 flex gap-1 bg-white shadow-lg rounded-lg p-1 border">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const shortenedContent = content.content.split('.').slice(0, 2).join('.') + '.';
                                          setSections(prev => prev.map(sec => 
                                            sec.id === section.id
                                              ? {
                                                  ...sec,
                                                  contentPieces: sec.contentPieces.map(piece => 
                                                    piece.id === content.id
                                                      ? { ...piece, content: shortenedContent }
                                                      : piece
                                                  )
                                                }
                                              : sec
                                          ));
                                          toast({ title: "Content Shortened", description: "Content has been made shorter." });
                                        }}
                                        className="text-xs h-6 px-2"
                                      >
                                        Short
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const expandedContent = content.content + " Additionally, this section provides comprehensive details and expanded explanations to ensure thorough understanding and implementation of the requirements.";
                                          setSections(prev => prev.map(sec => 
                                            sec.id === section.id
                                              ? {
                                                  ...sec,
                                                  contentPieces: sec.contentPieces.map(piece => 
                                                    piece.id === content.id
                                                      ? { ...piece, content: expandedContent }
                                                      : piece
                                                  )
                                                }
                                              : sec
                                          ));
                                          toast({ title: "Content Expanded", description: "Content has been made longer." });
                                        }}
                                        className="text-xs h-6 px-2"
                                      >
                                        Long
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const professionalContent = content.content.replace(/\b(we|our|us)\b/gi, 'the organization').replace(/\b(you|your)\b/gi, 'the client');
                                          setSections(prev => prev.map(sec => 
                                            sec.id === section.id
                                              ? {
                                                  ...sec,
                                                  contentPieces: sec.contentPieces.map(piece => 
                                                    piece.id === content.id
                                                      ? { ...piece, content: professionalContent }
                                                      : piece
                                                  )
                                                }
                                              : sec
                                          ));
                                          toast({ title: "Content Enhanced", description: "Content has been made more professional." });
                                        }}
                                        className="text-xs h-6 px-2"
                                      >
                                        Pro
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingContent(prev => ({ ...prev, [content.id]: true }))}
                                        className="text-xs h-6 px-2"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setActiveContentPieceForKnowledge(section.id);
                                          setShowKnowledgebase(true);
                                        }}
                                        className="text-xs h-6 px-2"
                                      >
                                        <BookOpen className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Knowledgebase Integration Panel */}
            {showKnowledgebase && (
              <div className="xl:col-span-2">
                <KnowledgebaseIntegration 
                  onInsertContent={handleInsertKnowledgeContent}
                  currentContext={getCurrentContext()}
                />
              </div>
            )}

            {/* Right Sidebar - Contract Controls */}
            <div className="xl:col-span-1 space-y-4">
              <Card className="rounded-2xl border border-gray-200 bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-black">
                    <div className="p-2 bg-black rounded-xl">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Contract Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <Button
                    onClick={() => setShowTemplateDialog(true)}
                    className="w-full bg-white border border-gray-200 text-black hover:bg-gray-50 rounded-xl py-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Contract
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleSaveDraft}
                    className="w-full rounded-xl py-3"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleExportToPDF}
                    className="w-full rounded-xl py-3"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowKnowledgebase(!showKnowledgebase);
                    }}
                    className="w-full rounded-xl py-3"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {showKnowledgebase ? 'Hide' : 'Show'} Knowledgebase
                  </Button>
                  
                  {showKnowledgebase && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-700 mb-2 font-medium">💡 How to insert content:</p>
                      <p className="text-xs text-blue-600">
                        1. Click the <BookOpen className="h-3 w-3 inline mx-1" /> icon next to any section to select it<br/>
                        2. Search and find content in the knowledgebase<br/>
                        3. Click "Insert Content" to add it to your selected section
                      </p>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({ title: "Sent for Review", description: "Contract has been sent for review." });
                    }}
                    className="w-full rounded-xl py-3"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send for Review
                  </Button>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card className="rounded-2xl border border-gray-200 bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-black">
                    <div className="p-2 bg-black rounded-xl">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Sections Completed:</span>
                    <span className="font-medium">{sections.filter(s => s.contentPieces.length > 0).length}/{sections.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Template:</span>
                    <span className="font-medium text-green-600">
                      {selectedTemplate === 'msa' ? 'MSA' :
                       selectedTemplate === 'nda' ? 'NDA' :
                       selectedTemplate === 'sow' ? 'SOW' :
                       selectedTemplate === 'consulting' ? 'Consulting' :
                       selectedTemplate === 'maintenance' ? 'AMC' : 'Contract'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Words:</span>
                    <span className="font-medium">
                      {sections.reduce((total, section) => 
                        total + section.contentPieces.reduce((sectionTotal, piece) => 
                          sectionTotal + piece.content.split(' ').length, 0), 0
                      )}
                    </span>
                  </div>
                  
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSections(prev => prev.map(section => ({ ...section, contentPieces: [] })));
                      toast({ title: "Content Cleared", description: "All generated content has been cleared." });
                    }}
                    className="w-full rounded-xl py-3 mt-4"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Contract</DialogTitle>
            <DialogDescription>Choose a contract template and enter a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="contract-name">Contract Name</Label>
              <Input
                id="contract-name"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="e.g., Software Development Agreement"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="template-select">Contract Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a contract template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msa">Master Service Agreement (MSA)</SelectItem>
                  <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
                  <SelectItem value="sow">Statement of Work (SOW)</SelectItem>
                  <SelectItem value="consulting">Consulting Agreement</SelectItem>
                  <SelectItem value="maintenance">Annual Maintenance Contract (AMC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreateContract} disabled={!selectedTemplate || !contractName.trim()} className="bg-red-accent text-white hover:bg-red-accent/90 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={showDocumentPreview} onOpenChange={setShowDocumentPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{contractName || "Contract Document"}</DialogTitle>
            <DialogDescription>
              Preview of your generated contract content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-6 bg-white border rounded-xl">
            {/* Document Header */}
            <div className="text-center space-y-2 border-b pb-4">
              <h1 className="text-2xl font-bold">{contractName || "Contract Document"}</h1>
              <p className="text-gray-600">
                {selectedTemplate === 'msa' ? 'Master Service Agreement' :
                 selectedTemplate === 'nda' ? 'Non-Disclosure Agreement' :
                 selectedTemplate === 'sow' ? 'Statement of Work' :
                 selectedTemplate === 'consulting' ? 'Consulting Agreement' :
                 selectedTemplate === 'maintenance' ? 'Annual Maintenance Contract' : 'Contract'}
              </p>
              <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {/* Document Content */}
            {sections.map((section) => (
              section.contentPieces.length > 0 && (
                <div key={section.id} className="space-y-4">
                  <h2 className="text-lg font-semibold text-black border-b pb-2">
                    {section.title}
                  </h2>
                  {section.contentPieces.map((content, index) => (
                    <div key={content.id} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-600">
                        {content.prompt}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-gray-200">
                        {content.content}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDocumentPreview(false)}
              className="rounded-xl"
            >
              Close Preview
            </Button>
            <Button 
              onClick={handleExportToPDF}
              className="bg-black text-white hover:bg-gray-800 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractGeneration;