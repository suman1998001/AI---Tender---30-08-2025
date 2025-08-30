import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Download, Send, Trash2, Plus, Sparkles, FileText, Clock, Target, Edit, Check, X, Loader2, RotateCcw, Languages, FileText as ExtendIcon, Wand2, Zap, Undo2, Redo2, Search, BookOpen, Eye, Settings, Upload, Globe, Database, TrendingUp, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
interface ContentPiece {
  id: string;
  prompt: string;
  content: string;
  userInput: string;
  format?: string;
}
interface HistoryItem {
  content: string;
  timestamp: Date;
  action?: string;
}
interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: 'upload' | 'search' | 'manual';
  type: 'file' | 'web' | 'text';
  tags: string[];
  createdAt: Date;
  url?: string;
}
interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  snippet: string;
}
interface RFPSection {
  id: string;
  title: string;
  description: string;
  prompts: string[];
  contentPieces: ContentPiece[];
  isGenerating: boolean;
}
const RFPDrafting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};
  const [activeSection, setActiveSection] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({});
  const [activePromptInput, setActivePromptInput] = useState<Record<string, string>>({});
  const [showPromptInput, setShowPromptInput] = useState<Record<string, boolean>>({});
  const [editingContent, setEditingContent] = useState<Record<string, boolean>>({});
  const [editContent, setEditContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [contentHistory, setContentHistory] = useState<Record<string, HistoryItem[]>>({});
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<Record<string, number>>({});
  const [processingContent, setProcessingContent] = useState<Record<string, boolean>>({});
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showHistory, setShowHistory] = useState<Record<string, boolean>>({});
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateObjective, setTemplateObjective] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState("");
  const [currentObjective, setCurrentObjective] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<Record<string, string>>({});
  // Knowledgebase state
  const [activeTab, setActiveTab] = useState<'rfp' | 'knowledgebase' | 'dashboard'>('rfp');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([{
    id: "1",
    title: "IIFT Antivirus Software Tender - GA-12012/1/2024",
    content: "Tender for Subscription of Antivirus Software (CrowdStrike/Microsoft/SentinelOne/PaloAltoNetworks/TrendMicro/Sophos/Trellix/ESET) for Support & Solution at IIFT, New Delhi. Estimated cost: Rs. 8,25,000/- with contract period of one year, extendable by two years.",
    source: 'manual',
    type: 'text',
    tags: ['tender', 'antivirus', 'IIFT', 'software', 'cybersecurity'],
    createdAt: new Date('2025-01-13'),
    url: undefined
  }, {
    id: "2",
    title: "Government Procurement Guidelines for IT Security",
    content: "Guidelines for procurement of IT security solutions in government institutions including eligibility criteria, technical specifications, and evaluation parameters for antivirus and cybersecurity software.",
    source: 'search',
    type: 'web',
    tags: ['government', 'procurement', 'IT security', 'guidelines'],
    createdAt: new Date('2025-01-10'),
    url: "https://dit.gov.in/procurement-guidelines"
  }, {
    id: "3",
    title: "Market Research: Enterprise Antivirus Solutions 2024",
    content: "Comprehensive analysis of enterprise antivirus market including CrowdStrike, Microsoft Defender, SentinelOne, Palo Alto, Trend Micro, Sophos, Trellix, and ESET. Market share, pricing trends, and feature comparison.",
    source: 'search',
    type: 'web',
    tags: ['market research', 'antivirus', 'enterprise', 'cybersecurity', 'comparison'],
    createdAt: new Date('2025-01-08'),
    url: "https://gartner.com/antivirus-market-report-2024"
  }, {
    id: "4",
    title: "Similar RFP: IIT Delhi Cybersecurity Tender",
    content: "Request for Proposal for comprehensive cybersecurity solution including endpoint protection, network security, and incident response for 2000+ nodes. Budget: Rs. 15,00,000 for 3 years.",
    source: 'search',
    type: 'web',
    tags: ['similar RFP', 'IIT', 'cybersecurity', 'endpoint protection'],
    createdAt: new Date('2025-01-05'),
    url: "https://iitd.ac.in/tenders/cybersecurity-rfp"
  }, {
    id: "5",
    title: "NIST Cybersecurity Framework for Educational Institutions",
    content: "Framework for implementing cybersecurity measures in academic institutions, including risk assessment, security controls, and incident response procedures specifically for universities and research institutes.",
    source: 'search',
    type: 'web',
    tags: ['NIST', 'cybersecurity framework', 'educational institutions', 'compliance'],
    createdAt: new Date('2025-01-03'),
    url: "https://nist.gov/cybersecurity-framework-education"
  }]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeContentPieceId, setActiveContentPieceId] = useState<string>("");
  const [showKnowledgebase, setShowKnowledgebase] = useState(false);
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState("");
  const [activeKnowledgeFilter, setActiveKnowledgeFilter] = useState("All");
  const [selectedKnowledgeItems, setSelectedKnowledgeItems] = useState<Set<string>>(new Set());
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState<{
    title: string;
    content: string;
    fullContent: string;
  }>({
    title: "",
    content: "",
    fullContent: ""
  });

  // Knowledgebase generation state
  const [isGeneratingFromKnowledgebase, setIsGeneratingFromKnowledgebase] = useState(false);
  const [generationStep, setGenerationStep] = useState<"knowledgebase" | "generating">("knowledgebase");

  // Template editor state
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{
    name: string;
    sections: RFPSection[];
  } | null>(null);

  // Get template-specific sections based on the form data
  const getTemplateSections = (template: string): RFPSection[] => {
    const templates = {
      "standard-it": [{
        id: "introduction",
        title: "1. Introduction",
        description: "High-level overview of the project and its objectives",
        prompts: ["Project Vision", "Project Goals", "RFP Purpose", "Key Stakeholders"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Introduction'
      }, {
        id: "company-background",
        title: "2. Company Background",
        description: "Provide a detailed background of your company",
        prompts: ["Company History", "Mission and Vision", "Our Team", "Key Achievements"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Company Background'
      }, {
        id: "scope",
        title: "3. Project Scope",
        description: "IT service boundaries and system requirements",
        prompts: ["System Architecture", "Integration Requirements", "Data Migration Scope", "Legacy System Considerations"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Project Scope'
      }, {
        id: "technical",
        title: "4. Technical Requirements",
        description: "Technology specifications and IT standards",
        prompts: ["Cloud Infrastructure", "Security Protocols", "API Requirements", "Database Specifications"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Technical Requirements'
      }, {
        id: "deliverables",
        title: "5. Deliverables",
        description: "IT solutions and technical outcomes",
        prompts: ["Software Solutions", "System Documentation", "Technical Training", "Maintenance Plans"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Deliverables'
      }, {
        id: "evaluation",
        title: "6. Evaluation Criteria",
        description: "Technical assessment and vendor evaluation",
        prompts: ["Technical Competency", "IT Cost Analysis", "Implementation Timeline", "Technology Experience"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Evaluation Criteria'
      }, {
        id: "timeline",
        title: "7. Timeline",
        description: "IT project phases and deployment schedule",
        prompts: ["Development Phases", "Testing Milestones", "Go-Live Dates", "System Dependencies"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Timeline'
      }],
      "marketing": [{
        id: "introduction",
        title: "1. Introduction",
        description: "High-level overview of the project and its objectives",
        prompts: ["Project Vision", "Project Goals", "RFP Purpose", "Key Stakeholders"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Introduction'
      }, {
        id: "company-background",
        title: "2. Company Background",
        description: "Provide a detailed background of your company",
        prompts: ["Company History", "Mission and Vision", "Our Team", "Key Achievements"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Company Background'
      }, {
        id: "scope",
        title: "3. Project Scope",
        description: "Campaign boundaries and marketing channels",
        prompts: ["Campaign Channels", "Geographic Coverage", "Content Requirements", "Brand Guidelines"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Project Scope'
      }, {
        id: "technical",
        title: "4. Technical Requirements",
        description: "Marketing technology and platform needs",
        prompts: ["Marketing Automation", "Analytics Platforms", "Creative Tools", "Campaign Tracking"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Technical Requirements'
      }, {
        id: "deliverables",
        title: "5. Deliverables",
        description: "Marketing assets and campaign outcomes",
        prompts: ["Creative Assets", "Campaign Reports", "Brand Materials", "Performance Analytics"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Deliverables'
      }, {
        id: "evaluation",
        title: "6. Evaluation Criteria",
        description: "Creative assessment and agency evaluation",
        prompts: ["Creative Excellence", "Campaign Budget", "Timeline Execution", "Marketing Portfolio"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Evaluation Criteria'
      }, {
        id: "timeline",
        title: "7. Timeline",
        description: "Campaign phases and launch schedule",
        prompts: ["Creative Development", "Campaign Launch", "Performance Reviews", "Market Dependencies"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Timeline'
      }],
      "construction": [{
        id: "introduction",
        title: "1. Introduction",
        description: "High-level overview of the project and its objectives",
        prompts: ["Project Vision", "Project Goals", "RFP Purpose", "Key Stakeholders"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Introduction'
      }, {
        id: "company-background",
        title: "2. Company Background",
        description: "Provide a detailed background of your company",
        prompts: ["Company History", "Mission and Vision", "Our Team", "Key Achievements"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Company Background'
      }, {
        id: "scope",
        title: "3. Project Scope",
        description: "Construction boundaries and building specifications",
        prompts: ["Building Specifications", "Site Requirements", "Construction Phases", "Regulatory Compliance"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Project Scope'
      }, {
        id: "technical",
        title: "4. Technical Requirements",
        description: "Engineering specifications and building standards",
        prompts: ["Structural Engineering", "Safety Standards", "Material Specifications", "Quality Requirements"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Technical Requirements'
      }, {
        id: "deliverables",
        title: "5. Deliverables",
        description: "Construction outcomes and project completion",
        prompts: ["Completed Structure", "Engineering Documents", "Safety Certifications", "Warranty Services"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Deliverables'
      }, {
        id: "evaluation",
        title: "6. Evaluation Criteria",
        description: "Contractor assessment and project evaluation",
        prompts: ["Construction Expertise", "Project Cost", "Timeline Capability", "Construction Portfolio"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Evaluation Criteria'
      }, {
        id: "timeline",
        title: "7. Timeline",
        description: "Construction phases and completion schedule",
        prompts: ["Foundation Phase", "Construction Milestones", "Inspection Dates", "Weather Dependencies"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Timeline'
      }],
      "software-dev": [{
        id: "introduction",
        title: "1. Introduction",
        description: "High-level overview of the project and its objectives",
        prompts: ["Project Vision", "Project Goals", "RFP Purpose", "Key Stakeholders"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Introduction'
      }, {
        id: "company-background",
        title: "2. Company Background",
        description: "Provide a detailed background of your company",
        prompts: ["Company History", "Mission and Vision", "Our Team", "Key Achievements"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Company Background'
      }, {
        id: "scope",
        title: "3. Project Scope",
        description: "Software boundaries and feature requirements",
        prompts: ["Core Features", "Platform Requirements", "User Interface Design", "Performance Expectations"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Project Scope'
      }, {
        id: "technical",
        title: "4. Technical Requirements",
        description: "Development specifications and technology stack",
        prompts: ["Technology Stack", "Architecture Patterns", "Security Implementation", "Scalability Design"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Technical Requirements'
      }, {
        id: "deliverables",
        title: "5. Deliverables",
        description: "Software products and development outcomes",
        prompts: ["Application Software", "Source Code", "Technical Documentation", "Testing Results"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Deliverables'
      }, {
        id: "evaluation",
        title: "6. Evaluation Criteria",
        description: "Developer assessment and technical evaluation",
        prompts: ["Development Skills", "Project Investment", "Delivery Timeline", "Software Portfolio"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Evaluation Criteria'
      }, {
        id: "timeline",
        title: "7. Timeline",
        description: "Development phases and release schedule",
        prompts: ["Design Phase", "Development Sprints", "Testing Cycles", "Deployment Schedule"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Timeline'
      }],
      "custom": [{
        id: "introduction",
        title: "1. Introduction",
        description: "High-level overview of the project and its objectives",
        prompts: ["Project Vision", "Project Goals", "RFP Purpose", "Key Stakeholders"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Introduction'
      }, {
        id: "company-background",
        title: "2. Company Background",
        description: "Provide a detailed background of your company",
        prompts: ["Company History", "Mission and Vision", "Our Team", "Key Achievements"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Company Background'
      }, {
        id: "scope",
        title: "3. Project Scope",
        description: "Project boundaries and requirements",
        prompts: ["Core Requirements", "Scope Boundaries", "Success Criteria", "Constraints"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Project Scope'
      }, {
        id: "technical",
        title: "4. Technical Requirements",
        description: "Technical specifications and standards",
        prompts: ["Technical Standards", "System Requirements", "Quality Metrics", "Compliance Needs"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Technical Requirements'
      }, {
        id: "deliverables",
        title: "5. Deliverables",
        description: "Expected outcomes and deliverable items",
        prompts: ["Primary Deliverables", "Documentation", "Training", "Support"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Deliverables'
      }, {
        id: "evaluation",
        title: "6. Evaluation Criteria",
        description: "Vendor assessment criteria",
        prompts: ["Expertise Assessment", "Cost Evaluation", "Timeline Analysis", "Portfolio Review"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Evaluation Criteria'
      }, {
        id: "timeline",
        title: "7. Timeline",
        description: "Project phases and key dates",
        prompts: ["Project Phases", "Key Milestones", "Review Points", "Critical Dependencies"],
        contentPieces: [],
        isGenerating: false,
        _id: 'Timeline'
      }]
    };
    return templates[template as keyof typeof templates] || templates["custom"];
  };
  const [sections, setSections] = useState<RFPSection[]>(() => {
    // Initialize sections based on the template from form data
    const template = formData.template || "custom";
    return getTemplateSections(template);
  });
  const handlePromptClick = (sectionId: string, prompt: string) => {
    // Show input box for the clicked prompt
    setShowPromptInput(prev => ({
      ...prev,
      [`${sectionId}-${prompt}`]: true
    }));
    setActivePromptInput(prev => ({
      ...prev,
      [`${sectionId}-${prompt}`]: ''
    }));
  };
  // Function to call AI service for content generation
  const generateAIContent = async (prompt: string, userInput: string, format: string = "long", isRegeneration = false) => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-rfp-content', {
        body: {
          prompt,
          userInput,
          format,
          isRegeneration
        }
      });
      if (error) throw error;
      return data.generatedText;
    } catch (error) {
      console.error('Error generating AI content:', error);
      // Fallback to template-based content
      return generateRelevantContent(prompt, userInput);
    }
  };
  const handleCreateNewRFP = (selectedTemplate: string) => {
    // Clear existing content and load new template
    const newSections = getTemplateSections(selectedTemplate);
    setSections(newSections);
    setShowTemplateDialog(false);

    // Save the current template and objective
    setCurrentTemplate(selectedTemplate);
    setCurrentObjective(templateObjective);

    // Update the RFP topic with template and objective
    const templateNames = {
      "standard-it": "Standard IT Services",
      "marketing": "Marketing Campaign",
      "construction": "Construction Project",
      "software-dev": "Software Development",
      "custom": "Custom Template"
    };
    const templateName = templateNames[selectedTemplate as keyof typeof templateNames] || "Custom Template";
    toast({
      title: "New RFP Created",
      description: `${templateName} template has been loaded with your objective.`
    });
  };

  const handleGenerateFromKnowledgebase = async () => {
    if (!currentTemplate || !currentObjective) return;
    
    setIsGeneratingFromKnowledgebase(true);
    setGenerationStep("knowledgebase");
    
    // Simulate going through knowledgebase for 5 seconds
    setTimeout(() => {
      setGenerationStep("generating");
      
      // Generate RFP after another 5 seconds
      setTimeout(async () => {
        try {
          // First, create the RFP with current template
          const newSections = getTemplateSections(currentTemplate);
          const generatedSections = [...newSections];
          
          for (const section of generatedSections) {
            // Use knowledgebase content to enhance generation
            const knowledgeContext = knowledgeItems
              .map(item => `${item.title}: ${item.content}`)
              .join("\n\n");
            
            const enhancedPrompt = `${section.description}\n\nContext from knowledgebase:\n${knowledgeContext}\n\nObjective: ${currentObjective}`;
            
            try {
              const generatedContent = await generateAIContent(
                section.title,
                enhancedPrompt,
                "long"
              );
              
              section.contentPieces.push({
                id: `kb-generated-${Date.now()}-${Math.random()}`,
                prompt: section.title,
                content: generatedContent,
                userInput: enhancedPrompt,
                format: "long"
              });
            } catch (error) {
              console.error(`Error generating content for ${section.title}:`, error);
              // Add fallback content
              section.contentPieces.push({
                id: `kb-fallback-${Date.now()}-${Math.random()}`,
                prompt: section.title,
                content: generateRelevantContent(section.title, currentObjective),
                userInput: currentObjective,
                format: "long"
              });
            }
          }
          
          setSections(generatedSections);
          setIsGeneratingFromKnowledgebase(false);
          
          toast({
            title: "RFP Generated Successfully",
            description: `Complete RFP draft has been generated using your knowledgebase content.`
          });
          
          // Automatically show the document preview after generation
          setTimeout(() => {
            setShowDocumentPreview(true);
          }, 500);
          
        } catch (error) {
          console.error('Error generating from knowledgebase:', error);
          setIsGeneratingFromKnowledgebase(false);
          toast({
            title: "Generation Failed",
            description: "There was an error generating the RFP. Please try again.",
            variant: "destructive"
          });
        }
      }, 5000);
    }, 5000);
  };
  const generateRelevantContent = (prompt: string, userInput: string): string => {
    const contentTemplates: Record<string, string> = {
      "Company Background": `Our organization specializes in ${userInput} and has established itself as a leader in innovative technology solutions. With extensive experience in delivering complex projects, we focus on operational excellence and strategic growth initiatives that drive measurable business outcomes.`,
      "Project Goals": `The primary objective is to ${userInput}, ensuring seamless integration with existing systems and processes. This initiative aims to enhance operational efficiency, improve user experience, and establish scalable solutions that support long-term organizational growth and strategic objectives.`,
      "RFP Purpose": `This Request for Proposal seeks qualified vendors capable of delivering comprehensive solutions for ${userInput}. We require innovative approaches that address our specific technical requirements while maintaining the highest standards of quality, security, and performance.`,
      "Target Audience": `This RFP targets experienced vendors with proven expertise in ${userInput} implementations. We seek partners who understand industry challenges and can provide tailored solutions that align with our operational requirements and strategic vision.`,
      "Key Features": `The solution must incorporate ${userInput} as core functionality, providing intuitive user interfaces and robust performance. Essential capabilities include real-time processing, comprehensive reporting, seamless integrations, and scalable architecture to support future growth requirements.`,
      "Out of Scope Items": `This project excludes ${userInput} and related legacy system modifications. Third-party licensing, existing infrastructure maintenance, and specialized training programs are handled separately through established vendor relationships and internal resources.`,
      "User Stories": `As a primary user, I need efficient ${userInput} capabilities to streamline daily operations. As an administrator, I require comprehensive control over system configurations and user permissions. As a stakeholder, I need detailed analytics and reporting for informed decision-making.`,
      "Current Challenges": `Our organization faces limitations with ${userInput}, resulting in operational inefficiencies and user frustration. The existing system lacks scalability for growing demands and sufficient integration capabilities for our evolving business requirements.`,
      "System Integrations": `The solution must integrate seamlessly with our ${userInput} infrastructure, supporting standard APIs and protocols. Critical integration points include authentication systems, data repositories, and existing business applications with real-time synchronization capabilities.`,
      "Security Standards": `Security implementation must align with ${userInput} compliance requirements, including data encryption, access controls, and comprehensive audit logging. The solution must support multi-factor authentication, role-based permissions, and continuous monitoring for security events.`,
      "Performance Metrics": `The system must achieve optimal ${userInput} performance under normal load conditions, with scalability to handle peak usage scenarios. Key benchmarks include 99.9% uptime, sub-second response times, and efficient resource utilization across all components.`,
      "Scalability Needs": `The architecture must support horizontal scaling to accommodate ${userInput} growth projections over five years. Scalability requirements include handling increased data volumes, supporting expanded user bases, and maintaining performance during growth phases.`,
      "Final Products": `Deliverables include a fully functional ${userInput} system with comprehensive documentation and deployment guides. The final package encompasses all system components, testing results, performance benchmarks, and complete source code with version control.`,
      "Documentation": `Comprehensive documentation covering ${userInput} specifications, user manuals, administrator guides, and technical architecture. Documentation includes operational procedures, troubleshooting guides, API references, and maintenance protocols for ongoing support.`,
      "Training Materials": `Training deliverables include ${userInput} modules for end users and administrator certification programs. Training encompasses system functionalities, best practices, security procedures, and administrative tasks with hands-on practical exercises.`,
      "Support Services": `Post-implementation support includes ${userInput} monitoring, incident response, and ongoing maintenance protocols. Support services encompass technical assistance, system optimization, regular health checks, and proactive monitoring for optimal performance.`,
      "Technical Expertise": `Evaluation assesses vendor experience with ${userInput} implementations, team qualifications, and technical approach. Review includes methodologies, architectural decisions, security implementations, and capability to deliver complex solutions within specified timeframes.`,
      "Cost Structure": `Cost evaluation includes total investment for ${userInput} implementation, operational expenses, and long-term maintenance costs. Analysis considers value propositions, resource allocation efficiency, and cost-effectiveness compared to alternative solutions.`,
      "Timeline Feasibility": `Timeline assessment focuses on realistic schedules for ${userInput} delivery, milestone achievability, and resource allocation plans. Evaluation includes project phases, critical dependencies, risk mitigation strategies, and vendor track record for timely completion.`,
      "Past Experience": `Vendor evaluation includes detailed review of ${userInput} project portfolios, client references, and implementation case studies. Assessment covers industry experience, project outcomes, client satisfaction ratings, and capability to handle comparable complexity.`,
      "Key Milestones": `Project timeline includes ${userInput} phase completion within 30 days, followed by core development addressing system requirements. Major milestones encompass design approval, implementation phases, integration testing, and phased deployment across organizational units.`,
      "Delivery Dates": `Critical delivery dates include ${userInput} prototype completion by Q2 end, beta release for testing in Q3, and full production deployment by target date. Each phase includes comprehensive testing, user acceptance validation, and performance verification.`,
      "Review Phases": `Review schedule incorporates ${userInput} assessment points, stakeholder feedback sessions, and quality assurance checkpoints. Phases include technical evaluations, architecture reviews, security assessments, and user experience validation for requirement alignment.`,
      "Dependencies": `Project dependencies include ${userInput} infrastructure readiness, stakeholder availability, and third-party system compatibility. Critical dependencies encompass regulatory approvals, resource allocation, external vendor coordination, and compliance validation processes.`
    };
    return contentTemplates[prompt] || `Comprehensive implementation strategy for ${prompt.toLowerCase()} focusing on ${userInput}. This approach addresses organizational needs while ensuring scalability, security, and operational efficiency through industry best practices and innovative methodologies.`;
  };

  // Function to parse table content
  const parseTableContent = (content: string) => {
    const lines = content.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    // Check if it looks like a table (has | separators or is structured like a table)
    const hasTableStructure = lines.some(line => line.includes('|')) || lines.some(line => line.includes('\t')) || lines.length > 2 && lines.every(line => line.split(/[\s,]+/).length > 1);
    if (!hasTableStructure && content.toLowerCase().includes('table')) {
      // If content mentions table but doesn't have structure, create a simple table
      const words = content.split(/\s+/);
      const chunks = [];
      for (let i = 0; i < words.length; i += 3) {
        chunks.push(words.slice(i, i + 3));
      }
      return {
        headers: ['Item', 'Description', 'Details'],
        rows: chunks.filter(chunk => chunk.length > 0)
      };
    }
    if (!hasTableStructure) return null;

    // Parse pipe-separated tables
    if (lines[0].includes('|')) {
      const headers = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
      const rows = lines.slice(1).filter(line => !line.match(/^[\s\-\|]+$/)) // Skip separator lines
      .map(line => line.split('|').map(cell => cell.trim()).filter(cell => cell)).filter(row => row.length > 0);
      return {
        headers,
        rows
      };
    }

    // Parse tab-separated or space-separated tables
    const headers = lines[0].split(/[\t\s]+/).filter(cell => cell.trim());
    const rows = lines.slice(1).map(line => line.split(/[\t\s]+/).filter(cell => cell.trim())).filter(row => row.length > 1);
    return {
      headers,
      rows
    };
  };

  // Component to render table content
  const TableContent = ({
    content,
    format
  }: {
    content: string;
    format?: string;
  }) => {
    console.log('TableContent - format:', format, 'content:', content.substring(0, 100));
    const tableData = parseTableContent(content);
    if (!tableData) {
      // If format is table but parsing failed, try to create a simple table from the content
      if (format === 'table') {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          return <div className="overflow-x-auto">
              <table className="min-w-full border border-border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-border">
                      Content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => <tr key={index} className="hover:bg-muted/20">
                      <td className="px-4 py-2 text-sm text-foreground border-b border-border/50">
                        {line}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>;
        }
      }
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    return <div className="overflow-x-auto">
        <table className="min-w-full border border-border rounded-lg">
          <thead className="bg-muted/50">
            <tr>
              {tableData.headers.map((header, index) => <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-border">
                  {header}
                </th>)}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => <tr key={rowIndex} className="hover:bg-muted/20">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-2 text-sm text-foreground border-b border-border/50">
                    {cell}
                  </td>)}
              </tr>)}
          </tbody>
        </table>
      </div>;
  };
  const handleGenerateFromPrompt = async (section: any, prompt: string) => {
    let sectionId = section.id;
    const inputKey = `${sectionId}-${prompt}`;
    const userInput = activePromptInput[inputKey];
    if (!userInput?.trim()) return;
    setSections(prev => prev.map(section => section.id === sectionId ? {
      ...section,
      isGenerating: true
    } : section));
    try {
      // Use AI service for content generation
      const format = selectedFormat[`${sectionId}-${prompt}`] || "long";
      let payload = {
        "token": "ourbsgTgdjTig7832Hhcbalpe",
        "objective": currentObjective,
        "section": section?._id,
        "topic": prompt,
        "user_content": userInput,
        "format": format
      };
      console.log(payload, section, prompt, 'Format selected:', format);
      const response = await fetch("https://atbr34467tsyhajzu4ymzim6ha0rqksj.lambda-url.us-west-2.on.aws/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const responseData = await response.json();
      console.log("response-------", responseData, 'Expected format:', format);
      const generatedContent = responseData?.Content || '';
      //const generatedContent = await generateAIContent(prompt, userInput, false);
      const newContentPiece: ContentPiece = {
        id: `${sectionId}-${prompt}-${Date.now()}`,
        prompt,
        content: generatedContent,
        userInput,
        format: format
      };
      setSections(prev => prev.map(section => section.id === sectionId ? {
        ...section,
        contentPieces: [...section.contentPieces, newContentPiece],
        isGenerating: false
      } : section));

      // Clear the input and hide the box
      setActivePromptInput(prev => ({
        ...prev,
        [inputKey]: ''
      }));
      setShowPromptInput(prev => ({
        ...prev,
        [inputKey]: false
      }));
      toast({
        title: "Content Generated",
        description: `AI content added to ${sections.find(s => s.id === sectionId)?.title}`
      });
    } catch (error) {
      console.log("error-----", error);
      setSections(prev => prev.map(section => section.id === sectionId ? {
        ...section,
        isGenerating: false
      } : section));
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent, section: any, prompt: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateFromPrompt(section, prompt);
    }
  };
  const handleCustomKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomContent(sectionId);
    }
  };
  const handleCustomContent = async (sectionId: string) => {
    if (!customInput.trim()) return;

    // Set loading state
    setSections(prev => prev.map(section => section.id === sectionId ? {
      ...section,
      isGenerating: true
    } : section));
    try {
      const format = selectedFormat[sectionId] || "long";

      // Use AI service for custom content generation
      let payload = {
        "token": "ourbsgTgdjTig7832Hhcbalpe",
        "objective": currentObjective,
        "section": "Custom Content",
        "topic": "Custom Input",
        "user_content": customInput,
        "format": format
      };
      const response = await fetch("https://atbr34467tsyhajzu4ymzim6ha0rqksj.lambda-url.us-west-2.on.aws/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const responseData = await response.json();
      console.log("Custom content response:", responseData, 'Expected format:', format);
      const generatedContent = responseData?.Content || customInput;
      const newContentPiece: ContentPiece = {
        id: `${sectionId}-custom-${Date.now()}`,
        prompt: "Custom Content",
        content: generatedContent,
        userInput: customInput,
        format: format
      };
      setSections(prev => prev.map(section => section.id === sectionId ? {
        ...section,
        contentPieces: [...section.contentPieces, newContentPiece],
        isGenerating: false
      } : section));
      setCustomInput("");
      setShowCustomInput(prev => ({
        ...prev,
        [sectionId]: false
      }));
      toast({
        title: "Content Generated",
        description: `Custom content generated in ${format} format`
      });
    } catch (error) {
      console.error('Error generating custom content:', error);

      // Fallback to direct content addition
      const newContentPiece: ContentPiece = {
        id: `${sectionId}-custom-${Date.now()}`,
        prompt: "Custom Content",
        content: customInput,
        userInput: customInput,
        format: "long"
      };
      setSections(prev => prev.map(section => section.id === sectionId ? {
        ...section,
        contentPieces: [...section.contentPieces, newContentPiece],
        isGenerating: false
      } : section));
      setCustomInput("");
      setShowCustomInput(prev => ({
        ...prev,
        [sectionId]: false
      }));
      toast({
        title: "Content Added",
        description: "Custom content added to section"
      });
    }
  };
  const handleSaveDraft = () => {
    setShowDocumentPreview(true);
  };
  const handleActualSave = async () => {
    setIsLoading(true);

    try {
      // Generate a unique RFP number
      const rfpNumber = `RFP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Prepare RFP data for database - only use existing columns
      const rfpData = {
        name: formData.rfpName || currentObjective || "New RFP Project",
        number: rfpNumber,
        category: currentTemplate || "Custom",
        issue_date: new Date().toISOString().split('T')[0],
        closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        total_applicants: 0,
        workflow_step: "Draft",
        status: "Draft",
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('rfps')
        .insert([rfpData])
        .select()
        .single();

      if (error) {
        console.error('Error saving RFP:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save RFP to database. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "RFP Saved Successfully",
        description: `RFP "${rfpData.name}" has been saved to the database.`
      });

      setIsLoading(false);
      setShowDocumentPreview(false);
      setShowSaveDialog(true);
    } catch (error) {
      console.error('Error saving RFP:', error);
      toast({
        title: "Save Failed",
        description: "An unexpected error occurred while saving the RFP.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  const generateDocumentContent = () => {
    return sections.map(section => {
      const sectionContent = section.contentPieces.map(piece => `**${piece.prompt}**\n\n${piece.content}`).join('\n\n');
      return `## ${section.title}\n\n${section.description}\n\n${sectionContent}`;
    }).join('\n\n---\n\n');
  };
  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const maxLineWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize = 12, fontStyle: 'normal' | 'bold' = 'normal') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        const lines = pdf.splitTextToSize(text, maxLineWidth);

        // Check if we need a new page
        if (yPosition + lines.length * fontSize * 0.6 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * fontSize * 0.6 + 5;
      };

      // Add title
      addText(`Request for Proposal (RFP) Draft`, 18, 'bold');
      yPosition += 10;

      // Add generation date
      addText(`Generated on: ${new Date().toLocaleDateString()}`, 10);
      yPosition += 15;

      // Add template information if available
      if (currentTemplate && currentObjective) {
        const templateNames = {
          "standard-it": "Standard IT Services",
          "marketing": "Marketing Campaign",
          "construction": "Construction Project",
          "software-dev": "Software Development",
          "custom": "Custom Template"
        };
        const templateName = templateNames[currentTemplate as keyof typeof templateNames] || "Custom Template";
        addText(`Template: ${templateName}`, 12, 'bold');
        addText(`Objective: ${currentObjective}`, 11);
        yPosition += 15;
      }

      // Process each section
      sections.forEach((section, sectionIndex) => {
        if (section.contentPieces.length > 0) {
          // Add section title
          addText(section.title, 16, 'bold');

          // Add section description
          addText(section.description, 11);
          yPosition += 5;

          // Add content pieces in order
          section.contentPieces.forEach((piece, pieceIndex) => {
            // Add prompt as subtitle
            addText(piece.prompt, 13, 'bold');

            // Handle table content differently
            if (piece.format === 'table') {
              const tableData = parseTableContent(piece.content);
              if (tableData) {
                // Add table headers
                const headerText = tableData.headers.join(' | ');
                addText(headerText, 11, 'bold');

                // Add separator line
                const separatorText = tableData.headers.map(() => '---').join(' | ');
                addText(separatorText, 11);

                // Add table rows
                tableData.rows.forEach(row => {
                  const rowText = row.join(' | ');
                  addText(rowText, 11);
                });
              } else {
                // Fallback to regular text if parsing fails
                addText(piece.content, 11);
              }
            } else {
              // Add regular content
              addText(piece.content, 11);
            }
            yPosition += 10;
          });

          // Add extra space between sections
          yPosition += 10;
        }
      });

      // Save the PDF
      const fileName = `RFP_Draft_${currentTemplate || 'custom'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast({
        title: "PDF Generated",
        description: `RFP draft has been downloaded as ${fileName}`
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleDownloadDocument = () => {
    const content = generateDocumentContent();
    const element = document.createElement('a');
    const file = new Blob([content], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `RFP_Draft_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Document Downloaded",
      description: "RFP draft has been downloaded as markdown"
    });
  };
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Generating PDF document..."
    });
  };
  const handleSendReview = () => {
    toast({
      title: "Sent for Review",
      description: "RFP draft sent to internal team for review"
    });
  };
  const handleEditContent = (contentId: string) => {
    const contentPiece = sections.flatMap(s => s.contentPieces).find(p => p.id === contentId);
    if (!contentPiece) return;
    setEditContent(prev => ({
      ...prev,
      [contentId]: contentPiece.content
    }));
    setEditingContent(prev => ({
      ...prev,
      [contentId]: true
    }));
  };
  const handleSaveEdit = (contentId: string) => {
    const newContent = editContent[contentId];
    if (!newContent?.trim()) return;
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
        ...piece,
        content: newContent
      } : piece)
    })));
    setEditingContent(prev => ({
      ...prev,
      [contentId]: false
    }));
    toast({
      title: "Content Updated",
      description: "Section content has been updated successfully"
    });
  };
  const handleCancelEdit = (contentId: string) => {
    setEditingContent(prev => ({
      ...prev,
      [contentId]: false
    }));
    setEditContent(prev => ({
      ...prev,
      [contentId]: ''
    }));
  };
  const handleRemoveContent = (contentId: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: section.contentPieces.filter(piece => piece.id !== contentId)
    })));
    toast({
      title: "Content Removed",
      description: "Content piece has been removed"
    });
  };
  const handleRegenerateContent = async (contentId: string) => {
    const contentPiece = sections.flatMap(s => s.contentPieces).find(p => p.id === contentId);
    if (!contentPiece) return;
    const sectionId = contentPiece.id.split('-')[0];
    setSections(prev => prev.map(section => section.id === sectionId ? {
      ...section,
      isGenerating: true
    } : section));
    try {
      // Use AI service for content regeneration with higher temperature for variety
      const generatedContent = await generateAIContent(contentPiece.prompt, contentPiece.userInput, "long", true);
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: generatedContent
        } : piece),
        isGenerating: section.id === sectionId ? false : section.isGenerating
      })));
      toast({
        title: "Content Regenerated",
        description: `Fresh AI content generated for ${contentPiece.prompt}`
      });
    } catch (error) {
      setSections(prev => prev.map(section => ({
        ...section,
        isGenerating: section.id === sectionId ? false : section.isGenerating
      })));
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate content. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleClearAll = () => {
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: []
    })));
    toast({
      title: "Content Cleared",
      description: "All generated content has been cleared"
    });
  };

  // Save content to history before making changes
  const saveToHistory = (contentId: string, content: string, action?: string) => {
    setContentHistory(prev => {
      const currentHistory = prev[contentId] || [];
      const currentIndex = currentHistoryIndex[contentId] || 0;

      // Create new history item
      const newHistoryItem: HistoryItem = {
        content,
        timestamp: new Date(),
        action
      };

      // Remove any future history beyond current index
      const newHistory = [...currentHistory.slice(0, currentIndex + 1), newHistoryItem];
      return {
        ...prev,
        [contentId]: newHistory
      };
    });
    setCurrentHistoryIndex(prev => ({
      ...prev,
      [contentId]: (prev[contentId] || 0) + 1
    }));
  };

  // Undo functionality
  const handleUndo = (contentId: string) => {
    const currentIndex = currentHistoryIndex[contentId] || 0;
    const history = contentHistory[contentId] || [];
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const previousContent = history[newIndex].content;
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: previousContent
        } : piece)
      })));
      setCurrentHistoryIndex(prev => ({
        ...prev,
        [contentId]: newIndex
      }));
      toast({
        title: "Undone",
        description: "Reverted to previous version"
      });
    }
  };

  // Redo functionality
  const handleRedo = (contentId: string) => {
    const currentIndex = currentHistoryIndex[contentId] || 0;
    const history = contentHistory[contentId] || [];
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const nextContent = history[newIndex].content;
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: nextContent
        } : piece)
      })));
      setCurrentHistoryIndex(prev => ({
        ...prev,
        [contentId]: newIndex
      }));
      toast({
        title: "Redone",
        description: "Restored to next version"
      });
    }
  };

  // Quick prompt functionality
  const handleQuickPrompt = async (contentId: string, prompt: string) => {
    const contentPiece = sections.flatMap(s => s.contentPieces).find(p => p.id === contentId);
    if (!contentPiece) return;
    saveToHistory(contentId, contentPiece.content, `Quick prompt: ${prompt}`);
    setProcessingContent(prev => ({
      ...prev,
      [contentId]: true
    }));
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
        ...piece,
        content: `Processing "${prompt}" request...`
      } : piece)
    })));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      let modifiedContent = contentPiece.content;
      if (prompt === "make it short") {
        modifiedContent = contentPiece.content.split('. ').slice(0, 2).join('. ') + '.';
      } else if (prompt === "make it long") {
        modifiedContent = contentPiece.content + ' Additionally, this expanded version includes more comprehensive details, thorough explanations, and extended coverage of all relevant aspects to provide a complete understanding of the topic.';
      } else if (prompt === "make it professional") {
        modifiedContent = contentPiece.content.replace(/\b(great|good|nice|cool)\b/gi, 'excellent').replace(/\b(big)\b/gi, 'substantial').replace(/\b(lots of)\b/gi, 'numerous');
      }
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: modifiedContent
        } : piece)
      })));
      toast({
        title: "Content Updated",
        description: `Applied "${prompt}" successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process quick prompt",
        variant: "destructive"
      });
    } finally {
      setProcessingContent(prev => ({
        ...prev,
        [contentId]: false
      }));
    }
  };

  // Restore from history functionality
  const handleRestoreFromHistory = (contentId: string, historyIndex: number) => {
    const history = contentHistory[contentId] || [];
    if (historyIndex >= 0 && historyIndex < history.length) {
      const selectedContent = history[historyIndex].content;
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: selectedContent
        } : piece)
      })));
      setCurrentHistoryIndex(prev => ({
        ...prev,
        [contentId]: historyIndex
      }));
      toast({
        title: "Restored",
        description: "Content restored from history"
      });
    }
  };

  // Handle content enhancement features with loading and history
  const handleConvertLanguage = async (contentId: string) => {
    toast({
      title: "Coming Soon",
      description: "Language conversion feature will be available soon!"
    });
  };
  const handleEnhanceLength = async (contentId: string) => {
    const contentPiece = sections.flatMap(s => s.contentPieces).find(p => p.id === contentId);
    if (!contentPiece) return;
    saveToHistory(contentId, contentPiece.content);
    setProcessingContent(prev => ({
      ...prev,
      [contentId]: true
    }));
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
        ...piece,
        content: "Enhancing content with more details..."
      } : piece)
    })));
    try {
      const enhancedContent = await generateAIContent("Expand and enhance this content with more detailed information, examples, and comprehensive coverage", contentPiece.content, "long");
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: enhancedContent
        } : piece)
      })));
      toast({
        title: "Content Enhanced",
        description: "Content has been expanded with more details"
      });
    } catch (error) {
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: contentPiece.content
        } : piece)
      })));
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingContent(prev => ({
        ...prev,
        [contentId]: false
      }));
    }
  };
  const handleImproveClarity = async (contentId: string) => {
    const contentPiece = sections.flatMap(s => s.contentPieces).find(p => p.id === contentId);
    if (!contentPiece) return;
    saveToHistory(contentId, contentPiece.content);
    setProcessingContent(prev => ({
      ...prev,
      [contentId]: true
    }));
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
        ...piece,
        content: "Improving content clarity and readability..."
      } : piece)
    })));
    try {
      const enhancedContent = await generateAIContent("Improve the clarity, readability, and professional structure of this content while maintaining all key information", contentPiece.content, "long");
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: enhancedContent
        } : piece)
      })));
      toast({
        title: "Clarity Improved",
        description: "Content has been refined for better readability"
      });
    } catch (error) {
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: contentPiece.content
        } : piece)
      })));
      toast({
        title: "Improvement Failed",
        description: "Failed to improve clarity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingContent(prev => ({
        ...prev,
        [contentId]: false
      }));
    }
  };
  const handleAddTechnicalDetails = async (contentId: string) => {
    const contentPiece = sections.flatMap(s => s.contentPieces).find(p => p.id === contentId);
    if (!contentPiece) return;
    saveToHistory(contentId, contentPiece.content);
    setProcessingContent(prev => ({
      ...prev,
      [contentId]: true
    }));
    setSections(prev => prev.map(section => ({
      ...section,
      contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
        ...piece,
        content: "Adding technical specifications and details..."
      } : piece)
    })));
    try {
      const enhancedContent = await generateAIContent("Add technical specifications, implementation details, and industry-specific requirements to this content", contentPiece.content, "long");
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: enhancedContent
        } : piece)
      })));
      toast({
        title: "Technical Details Added",
        description: "Content has been enhanced with technical specifications"
      });
    } catch (error) {
      setSections(prev => prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === contentId ? {
          ...piece,
          content: contentPiece.content
        } : piece)
      })));
      toast({
        title: "Enhancement Failed",
        description: "Failed to add technical details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingContent(prev => ({
        ...prev,
        [contentId]: false
      }));
    }
  };
  const rfpTopic = formData.coreObjective || "New RFP Project";
  const handleGoBack = () => {
    setShowSaveDialog(false);
    navigate('/rfp-management');
  };
  const handleStayOnPage = () => {
    setShowSaveDialog(false);
    toast({
      title: "Draft Saved",
      description: "Your RFP draft has been saved successfully"
    });
  };
  const handleOpenKnowledgebase = (contentPieceId: string) => {
    console.log("Opening knowledgebase for content piece:", contentPieceId);
    setActiveContentPieceId(contentPieceId);
    setShowKnowledgebase(true);
  };
  const handleInsertKnowledgeContent = (knowledgeTitle: string, knowledgePreview: string) => {
    console.log("Insert function called with:", {
      knowledgeTitle,
      knowledgePreview,
      activeContentPieceId
    });
    if (!activeContentPieceId) {
      toast({
        title: "No Content Selected",
        description: "Please select a content piece first by clicking the knowledge base icon next to it"
      });
      return;
    }

    // Find the content piece and update it
    setSections(prev => {
      const updatedSections = prev.map(section => ({
        ...section,
        contentPieces: section.contentPieces.map(piece => piece.id === activeContentPieceId ? {
          ...piece,
          content: piece.content ? `${piece.content}\n\n${knowledgePreview}` : knowledgePreview,
          prompt: `${piece.prompt} (Enhanced with: ${knowledgeTitle})`
        } : piece)
      }));
      console.log("Updated sections:", updatedSections);
      return updatedSections;
    });

    // Close the knowledge base
    setShowKnowledgebase(false);
    setActiveContentPieceId("");
    toast({
      title: "Content Inserted",
      description: `Knowledge from "${knowledgeTitle}" has been added to your content`
    });
  };
  const handlePreviewKnowledgeContent = (title: string, preview: string) => {
    // Generate full content for preview (simulated)
    const fullContent = `# ${title}

## Overview
${preview}

## Detailed Content
This would contain the full content of the knowledge item including:

- Comprehensive documentation
- Best practices and guidelines
- Implementation examples
- Related references and links
- Technical specifications
- Legal considerations (if applicable)

## Key Benefits
- Proven industry standards
- Reduce implementation time
- Ensure compliance requirements
- Minimize project risks

## Usage Guidelines
This content can be directly integrated into your RFP sections or used as reference material for creating custom content that aligns with your specific requirements.

---
*This is a preview of the knowledge base item. Click 'Insert' to add this content to your selected RFP section.*`;
    setPreviewContent({
      title,
      content: preview,
      fullContent
    });
    setShowPreviewDialog(true);
  };

  // Knowledgebase functions
  const handleWebSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search query"
      });
      return;
    }
    setIsSearching(true);
    try {
      // Simulate web search with IIFT-relevant results
      let mockResults: SearchResult[] = [];
      const query = searchQuery.toLowerCase();
      if (query.includes('similar rfp') || query.includes('rfp')) {
        mockResults = [{
          id: "search-1",
          title: "IIT Bombay - Cybersecurity Infrastructure RFP 2024",
          content: "Request for Proposal for comprehensive cybersecurity solution including next-generation antivirus, endpoint protection, and network security for 3000+ users. Budget: Rs. 12,50,000.",
          url: "https://iitb.ac.in/tenders/cybersecurity-2024",
          snippet: "Comprehensive cybersecurity RFP for educational institution with antivirus requirements similar to IIFT tender."
        }, {
          id: "search-2",
          title: "NIT Trichy - Enterprise Antivirus Tender 2023",
          content: "Tender for enterprise-grade antivirus solution covering CrowdStrike, Microsoft Defender, and Sophos for academic institution with 1500 endpoints.",
          url: "https://nitt.edu/procurement/antivirus-tender",
          snippet: "Similar educational institution antivirus procurement with comparable scope and requirements."
        }, {
          id: "search-3",
          title: "AIIMS Delhi - IT Security Solution RFP",
          content: "Medical institution's RFP for comprehensive IT security including antivirus, endpoint protection, and compliance with healthcare data protection.",
          url: "https://aiims.edu/tenders/it-security-rfp",
          snippet: "Government institution security tender with similar compliance and procurement requirements."
        }];
      } else if (query.includes('market research') || query.includes('antivirus market')) {
        mockResults = [{
          id: "search-4",
          title: "Gartner Magic Quadrant: Endpoint Protection 2024",
          content: "Comprehensive market analysis of endpoint protection solutions including CrowdStrike, Microsoft, SentinelOne, and other vendors mentioned in IIFT tender.",
          url: "https://gartner.com/endpoint-protection-2024",
          snippet: "Market leader analysis for antivirus solutions mentioned in the IIFT tender requirements."
        }, {
          id: "search-5",
          title: "IDC Report: Enterprise Antivirus Market India 2024",
          content: "Market share, pricing trends, and adoption patterns of enterprise antivirus solutions in Indian educational and government sectors.",
          url: "https://idc.com/antivirus-market-india-2024",
          snippet: "India-specific market research for enterprise antivirus solutions in educational institutions."
        }, {
          id: "search-6",
          title: "Forrester Wave: Endpoint Security Suites 2024",
          content: "Evaluation of endpoint security vendors including detailed analysis of CrowdStrike, Microsoft Defender, SentinelOne, Palo Alto, Trend Micro, Sophos, Trellix, and ESET.",
          url: "https://forrester.com/endpoint-security-wave-2024",
          snippet: "Comprehensive vendor comparison for all antivirus solutions specified in IIFT tender."
        }];
      } else if (query.includes('government guideline') || query.includes('procurement guideline')) {
        mockResults = [{
          id: "search-7",
          title: "DGS&D Guidelines for IT Procurement in Government",
          content: "Official procurement guidelines for IT security solutions in government and semi-government institutions including eligibility criteria and evaluation parameters.",
          url: "https://dgsd.gov.in/it-procurement-guidelines",
          snippet: "Official government guidelines for IT security procurement applicable to IIFT tender process."
        }, {
          id: "search-8",
          title: "MeitY Cybersecurity Policy for Educational Institutions",
          content: "Ministry of Electronics and IT policy framework for cybersecurity implementation in educational institutions and research organizations.",
          url: "https://meity.gov.in/cybersecurity-education-policy",
          snippet: "Government cybersecurity policy framework relevant to IIFT's institutional requirements."
        }, {
          id: "search-9",
          title: "Make in India Policy for IT Procurement",
          content: "Government guidelines on preference for Make in India products in IT procurement, including scoring criteria and local content requirements.",
          url: "https://dpiit.gov.in/make-in-india-procurement",
          snippet: "Make in India policy guidelines applicable to IIFT's antivirus software procurement."
        }];
      } else {
        // Generic results for other searches
        mockResults = [{
          id: "search-10",
          title: `${searchQuery} - Implementation Guide`,
          content: `Comprehensive implementation guide for ${searchQuery} in educational institutions...`,
          url: `https://education-tech.gov.in/${searchQuery.replace(/\s+/g, '-')}`,
          snippet: `Educational sector specific guide for ${searchQuery} implementation and best practices.`
        }, {
          id: "search-11",
          title: `${searchQuery} - Compliance Requirements`,
          content: `Regulatory compliance and standards for ${searchQuery} in Indian government institutions...`,
          url: `https://compliance.gov.in/${searchQuery.replace(/\s+/g, '-')}`,
          snippet: `Government compliance requirements and standards for ${searchQuery} in institutional settings.`
        }, {
          id: "search-12",
          title: `${searchQuery} - Best Practices`,
          content: `Industry best practices and case studies for ${searchQuery} implementation...`,
          url: `https://best-practices.org/${searchQuery.replace(/\s+/g, '-')}`,
          snippet: `Proven best practices and real-world case studies for ${searchQuery} deployment.`
        }];
      }
      setSearchResults(mockResults);
      toast({
        title: "Search Complete",
        description: `Found ${mockResults.length} results for "${searchQuery}"`
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to perform search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  const handleAddToKnowledgeBase = (item: SearchResult | {
    title: string;
    content: string;
    url?: string;
  }) => {
    const newKnowledgeItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: item.title,
      content: 'snippet' in item ? item.snippet : item.content,
      source: 'url' in item && item.url ? 'search' : 'manual',
      type: 'url' in item && item.url ? 'web' : 'text',
      tags: [],
      createdAt: new Date(),
      url: 'url' in item ? item.url : undefined
    };
    setKnowledgeItems(prev => [...prev, newKnowledgeItem]);
    toast({
      title: "Added to Knowledge Base",
      description: `"${item.title}" has been added to your knowledge base`
    });
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        const newKnowledgeItem: KnowledgeItem = {
          id: Date.now().toString() + file.name,
          title: file.name,
          content: content.substring(0, 1000) + (content.length > 1000 ? '...' : ''),
          source: 'upload',
          type: 'file',
          tags: [file.type.split('/')[0]],
          createdAt: new Date()
        };
        setKnowledgeItems(prev => [...prev, newKnowledgeItem]);
      };
      reader.readAsText(file);
    });
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) added to knowledge base`
    });
  };
  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="">
          {/* Back Button */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/rfp-management')} 
              className="flex items-center gap-2 hover:bg-red-accent-light border-gray-200 text-black"
            >
              <ArrowLeft size={16} />
              Back to RFP Management
            </Button>
          </div>

          {/* Full Screen Loader */}
          {isLoading && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-red-accent" />
                <p className="text-lg font-medium text-foreground">Saving your draft...</p>
              </div>
            </div>}

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-border">
            <div className="flex items-center gap-8">
              <button className={`pb-3 px-1 border-b-2 transition-colors text-sm font-medium ${activeTab === 'rfp' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`} onClick={() => setActiveTab('rfp')}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  RFP Drafting
                </div>
              </button>
              <button className={`pb-3 px-1 border-b-2 transition-colors text-sm font-medium ${activeTab === 'knowledgebase' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`} onClick={() => setActiveTab('knowledgebase')}>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Knowledge Base
                </div>
              </button>
              <button className={`pb-3 px-1 border-b-2 transition-colors text-sm font-medium ${activeTab === 'dashboard' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`} onClick={() => setActiveTab('dashboard')}>
                
              </button>
            </div>
          </div>
      
      {/* Save Success Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="space-y-4 text-center pb-4">
            <DialogTitle className="flex items-center justify-center gap-3 text-xl">
              <Check className="h-6 w-6 text-foreground" />
              Draft Saved Successfully
            </DialogTitle>
            
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 pt-6">
            <Button variant="outline" onClick={handleGoBack} className="w-full h-11 px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to RFP Management
            </Button>
            <Button onClick={handleStayOnPage} className="w-full h-11 px-6 bg-red-accent hover:bg-red-muted text-white">
              Stay on This Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tab Content */}
      {activeTab === 'rfp' && <div className="flex h-full">
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto pr-80">{/* Add right padding to account for fixed sidebar */}
          <div className="space-y-6">
            {/* Header Section - Match Dashboard Style */}
            <div className="flex items-center justify-between mb-6">
              <div className="mb-6">
                
                
                <div>
                 <div className="flex items-center gap-2 mb-2 transition-all duration-300">
                    <Sparkles className="h-5 w-5 text-red-accent animate-pulse" />
                     <span className="text-sm font-medium text-muted-foreground">AI-Powered RFP Builder</span>
                   </div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {formData.rfpName || currentObjective || "Click the \"Create New RFP\" button to generate an RFP template."}
                    </h1>
                    <p className="text-muted-foreground">
                      {formData.coreObjective || (currentTemplate ? (() => {
                      const templateNames = {
                        "standard-it": "Standard IT Services",
                        "marketing": "Marketing Campaign",
                        "construction": "Construction Project",
                        "software-dev": "Software Development",
                        "custom": "Custom Template"
                      };
                      return `Template: ${templateNames[currentTemplate as keyof typeof templateNames] || "Custom Template"}`;
                    })() : "Use AI-powered prompts to generate comprehensive RFP content")}
                    </p>
                  </div>
               </div>
               <div className="flex-shrink-0">
               </div>
             </div>

            {/* RFP Sections */}
            <div className="space-y-6">
              {!currentTemplate ?
              // Skeleton loaders when no template is selected
              <>
                  {[1, 2, 3, 4, 5, 6].map(index => <Card key={index} className="bg-card border-border animate-fade-in">
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
                            {[1, 2, 3, 4].map(badgeIndex => <Skeleton key={badgeIndex} className="h-6 w-20" />)}
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
                    </Card>)}
                  
                </> :
              // Actual sections when template is selected
              sections.map((section, index) => <Card key={section.id} className="bg-card border-border transition-all duration-500 animate-fade-in group" style={{
                animationDelay: `${index * 100}ms`
              }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground mb-1 group-hover:text-red-accent transition-colors duration-300">
                          {section.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {section.description}
                        </p>
                      </div>
                      {section.isGenerating && <div className="flex items-center gap-3 text-red-accent animate-fade-in">
                          {/* Enhanced animated loader */}
                          <div className="relative flex items-center gap-1">
                            {/* Main spinning circle */}
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-accent/30 border-t-red-accent"></div>
                            {/* Bouncing dots */}
                            <div className="flex gap-1 ml-2">
                              <div className="w-1 h-1 bg-red-accent rounded-full animate-bounce" style={{
                            animationDelay: '0ms'
                          }}></div>
                              <div className="w-1 h-1 bg-red-accent rounded-full animate-bounce" style={{
                            animationDelay: '150ms'
                          }}></div>
                              <div className="w-1 h-1 bg-red-accent rounded-full animate-bounce" style={{
                            animationDelay: '300ms'
                          }}></div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium animate-pulse">Generating content...</span>
                            <span className="text-xs text-red-accent/70 animate-fade-in">AI is crafting your content</span>
                          </div>
                        </div>}
                    </div>
                  </CardHeader>
                
                  <CardContent className="space-y-4">
                    {/* Content Prompts */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-red-accent" />
                        Quick Generate:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {section.prompts.map((prompt, promptIndex) => <Badge key={prompt} variant="outline" className="cursor-pointer hover:bg-red-accent/10 hover:border-red-accent hover:text-red-accent hover:shadow-md hover:shadow-red-accent/20 transition-all duration-300 hover:scale-110 animate-fade-in border-border text-muted-foreground group" style={{
                        animationDelay: `${index * 100 + promptIndex * 50}ms`
                      }} onClick={() => handlePromptClick(section.id, prompt)}>
                            <Sparkles className="h-3 w-3 mr-1 transition-transform duration-300 group-hover:rotate-45" />
                            {prompt}
                          </Badge>)}
                    </div>
                    
                    {/* Prompt Input Boxes */}
                      <div className="space-y-3 mt-4">
                        {section.prompts.map(prompt => {
                        const inputKey = `${section.id}-${prompt}`;
                        return showPromptInput[inputKey] ? <div key={inputKey} className="space-y-3 p-4 bg-muted/50 rounded-lg border border-red-accent/20 animate-fade-in transition-all duration-300 shadow-sm">
                               <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                 <Sparkles className="h-4 w-4 text-red-accent animate-pulse" />
                                 Generate content for: {prompt}
                                 <span className="text-xs text-muted-foreground ml-auto">Press Enter to generate</span>
                               </div>
                               <div className="relative">
                                 <Textarea placeholder={`Describe what you want to include about ${prompt.toLowerCase()}...`} value={activePromptInput[inputKey] || ''} onChange={e => setActivePromptInput(prev => ({
                              ...prev,
                              [inputKey]: e.target.value
                            }))} onKeyDown={e => handleKeyDown(e, section, prompt)} className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-red-accent/20 border-border pr-32" />
                                 {/* Format Selection Dropdown for Prompts */}
                                 <div className="absolute top-2 right-2 z-10">
                                   <Select value={selectedFormat[`${section.id}-${prompt}`] || "long"} onValueChange={value => setSelectedFormat(prev => ({
                                ...prev,
                                [`${section.id}-${prompt}`]: value
                              }))}>
                                     <SelectTrigger className="w-20 h-8 text-xs bg-primary/10 border-primary/30 hover:bg-primary/20 transition-all duration-200 shadow-md">
                                       <SelectValue placeholder="Format" />
                                     </SelectTrigger>
                                     <SelectContent className="min-w-[100px]">
                                       <SelectItem value="long" className="text-xs">Long</SelectItem>
                                       <SelectItem value="short" className="text-xs">Short</SelectItem>
                                       <SelectItem value="table" className="text-xs">Table</SelectItem>
                                     </SelectContent>
                                   </Select>
                                 </div>
                               </div>
                               <div className="flex gap-2">
                                 <Button size="sm" onClick={() => handleGenerateFromPrompt(section, prompt)} disabled={!activePromptInput[inputKey]?.trim() || section.isGenerating} className="bg-red-accent hover:bg-red-muted text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                   <Sparkles className="h-3 w-3 mr-1" />
                                   Generate Content
                                 </Button>
                                 <Button size="sm" variant="outline" onClick={() => setShowPromptInput(prev => ({
                              ...prev,
                              [inputKey]: false
                            }))} className="transition-all duration-300 hover:scale-105 border-border">
                                   Cancel
                                 </Button>
                               </div>
                             </div> : null;
                      })}
                    </div>
                    </div>

                    <Separator className="border-border" />

                    {/* Generated Content */}
                    {section.contentPieces.length > 0 && <div className="bg-muted/30 rounded-lg p-4 animate-fade-in transition-all duration-300 border border-red-accent/20 hover:shadow-md hover:shadow-red-accent/10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-accent" />
                            Generated Content:
                          </h4>
                        </div>
                        
                        <div className="space-y-6">
                          {section.contentPieces.map(contentPiece => <div key={contentPiece.id} className="group relative border border-border/50 rounded-lg p-4 hover:border-red-accent/30 transition-all duration-300">
                              {/* Content piece header */}
                                 <div className="flex items-center justify-between mb-3">
                                <h5 className="text-base font-semibold text-foreground">{contentPiece.prompt}</h5>
                                 {/* Hover controls with tooltips */}
                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 flex-wrap">
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button size="sm" variant="outline" onClick={() => handleEditContent(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-muted hover:border-border hover:text-foreground" disabled={editingContent[contentPiece.id]}>
                                         <Edit className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Edit content</p>
                                     </TooltipContent>
                                   </Tooltip>
                                   
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button size="sm" variant="outline" onClick={() => handleRegenerateContent(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-red-accent/10 hover:border-red-accent hover:text-red-accent" disabled={section.isGenerating}>
                                         <RotateCcw className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Regenerate content</p>
                                     </TooltipContent>
                                   </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" variant="outline" onClick={() => handleConvertLanguage(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-muted hover:border-border hover:text-foreground" disabled={section.isGenerating}>
                                          <Languages className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Convert Language (Coming Soon)</p>
                                      </TooltipContent>
                                    </Tooltip>

                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button size="sm" variant="outline" onClick={() => handleEnhanceLength(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-muted hover:border-border hover:text-foreground" disabled={section.isGenerating}>
                                         <ExtendIcon className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Enhance Length</p>
                                     </TooltipContent>
                                   </Tooltip>

                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button size="sm" variant="outline" onClick={() => handleImproveClarity(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-muted hover:border-border hover:text-foreground" disabled={section.isGenerating}>
                                         <Wand2 className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Improve Clarity</p>
                                     </TooltipContent>
                                   </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" variant="outline" onClick={() => handleAddTechnicalDetails(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-muted hover:border-border hover:text-foreground" disabled={section.isGenerating}>
                                          <Zap className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Add Technical Details</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" variant="outline" onClick={() => handleOpenKnowledgebase(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-muted hover:border-border hover:text-foreground">
                                          <BookOpen className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Insert from Knowledgebase</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" variant="outline" onClick={() => handleUndo(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-600" disabled={!contentHistory[contentPiece.id] || currentHistoryIndex[contentPiece.id] <= 0}>
                                         <Undo2 className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Undo</p>
                                     </TooltipContent>
                                   </Tooltip>

                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button size="sm" variant="outline" onClick={() => handleRedo(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-600" disabled={!contentHistory[contentPiece.id] || currentHistoryIndex[contentPiece.id] >= contentHistory[contentPiece.id]?.length - 1}>
                                         <Redo2 className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Redo</p>
                                     </TooltipContent>
                                   </Tooltip>

                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button size="sm" variant="outline" onClick={() => handleRemoveContent(contentPiece.id)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:border-destructive hover:text-destructive">
                                         <Trash2 className="h-3 w-3" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Remove content</p>
                                     </TooltipContent>
                                   </Tooltip>
                                 </div>
                              </div>
                              
                               {/* Content piece body */}
                               {editingContent[contentPiece.id] ? <div className="space-y-3 animate-fade-in">
                                   <Textarea value={editContent[contentPiece.id] || contentPiece.content} onChange={e => setEditContent(prev => ({
                            ...prev,
                            [contentPiece.id]: e.target.value
                          }))} className="min-h-[120px] text-sm transition-all duration-200 focus:ring-2 focus:ring-red-accent/20 border-border" placeholder="Edit the content..." />
                                   <div className="flex gap-2">
                                     <Button size="sm" onClick={() => handleSaveEdit(contentPiece.id)} disabled={!editContent[contentPiece.id]?.trim()} className="bg-red-accent hover:bg-red-muted text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                       <Check className="h-3 w-3 mr-1" />
                                       Save Changes
                                     </Button>
                                     <Button size="sm" variant="outline" onClick={() => handleCancelEdit(contentPiece.id)} className="transition-all duration-300 hover:scale-105 border-border">
                                       <X className="h-3 w-3 mr-1" />
                                       Cancel
                                     </Button>
                                   </div>
                                  </div> : <div className="text-sm text-foreground leading-relaxed cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors duration-200" onClick={() => handleEditContent(contentPiece.id)}>
                                    {contentPiece.format === 'table' ? <TableContent content={contentPiece.content} format={contentPiece.format} /> : contentPiece.format === 'short' ? <div className="bg-muted p-3 rounded-lg border-l-4 border-border">
                                         <div className="text-xs text-muted-foreground mb-1 font-medium">SHORT FORMAT</div>
                                        <p className="whitespace-pre-wrap text-sm">{contentPiece.content}</p>
                                      </div> : <div className="bg-muted p-3 rounded-lg border-l-4 border-border">
                                         <div className="text-xs text-muted-foreground mb-1 font-medium">LONG FORMAT</div>
                                        <p className="whitespace-pre-wrap">{contentPiece.content}</p>
                                      </div>}
                                  </div>}

                               {/* Quick prompts section */}
                               <div className="mt-4 pt-4 border-t border-border/50">
                                 <div className="flex flex-wrap gap-2 mb-3">
                                   <Button size="sm" variant="outline" onClick={() => handleQuickPrompt(contentPiece.id, "make it short")} disabled={section.isGenerating} className="text-xs px-3 py-1 h-7 hover:bg-muted hover:border-border hover:text-foreground transition-all duration-200">
                                     Make it short
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => handleQuickPrompt(contentPiece.id, "make it long")} disabled={section.isGenerating} className="text-xs px-3 py-1 h-7 hover:bg-muted hover:border-border hover:text-foreground transition-all duration-200">
                                     Make it long
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => handleQuickPrompt(contentPiece.id, "make it professional")} disabled={section.isGenerating} className="text-xs px-3 py-1 h-7 hover:bg-muted hover:border-border hover:text-foreground transition-all duration-200">
                                     Make it professional
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => setShowHistory(prev => ({
                              ...prev,
                              [contentPiece.id]: !prev[contentPiece.id]
                            }))} className="text-xs px-3 py-1 h-7 hover:bg-muted hover:border-border hover:text-foreground transition-all duration-200">
                                     <Clock className="h-3 w-3 mr-1" />
                                     History
                                   </Button>
                                 </div>

                                 {/* History panel */}
                                 {showHistory[contentPiece.id] && contentHistory[contentPiece.id] && <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                     <h6 className="text-xs font-medium text-muted-foreground mb-2">Change History</h6>
                                     <div className="space-y-2 max-h-40 overflow-y-auto">
                                       {contentHistory[contentPiece.id].map((historyItem, index) => <div key={index} className={`p-2 rounded border text-xs cursor-pointer transition-colors ${index === currentHistoryIndex[contentPiece.id] ? 'border-red-accent bg-red-accent/10 text-red-accent' : 'border-border/30 hover:border-border hover:bg-muted/50'}`} onClick={() => handleRestoreFromHistory(contentPiece.id, index)}>
                                           <div className="flex justify-between items-start gap-2">
                                             <span className="text-muted-foreground">
                                               {historyItem.timestamp.toLocaleString()}
                                             </span>
                                             {historyItem.action && <span className="text-xs bg-muted px-1 rounded">
                                                 {historyItem.action}
                                               </span>}
                                           </div>
                                           <p className="mt-1 line-clamp-2 text-foreground">
                                             {historyItem.content.substring(0, 100)}...
                                           </p>
                                         </div>)}
                                     </div>
                                   </div>}
                               </div>
                             </div>)}
                        </div>
                      </div>}

                    {/* Custom Input */}
                    {showCustomInput[section.id] && <div className="space-y-3 animate-fade-in transition-all duration-300">
                        <div className="relative">
                          <Textarea placeholder="Enter your custom content or AI prompt..." value={customInput} onChange={e => setCustomInput(e.target.value)} onKeyDown={e => handleCustomKeyDown(e, section.id)} className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-red-accent/20 border-border pr-32" />
                          {/* Format Selection Dropdown */}
                          <div className="absolute top-2 right-2 z-10">
                            <Select value={selectedFormat[section.id] || "long"} onValueChange={value => setSelectedFormat(prev => ({
                          ...prev,
                          [section.id]: value
                        }))}>
                              <SelectTrigger className="w-20 h-8 text-xs bg-primary/10 border-primary/30 hover:bg-primary/20 transition-all duration-200 shadow-md">
                                <SelectValue placeholder="Format" />
                              </SelectTrigger>
                              <SelectContent className="min-w-[100px]">
                                <SelectItem value="long" className="text-xs">Long</SelectItem>
                                <SelectItem value="short" className="text-xs">Short</SelectItem>
                                <SelectItem value="table" className="text-xs">Table</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleCustomContent(section.id)} disabled={!customInput.trim()} className="transition-all duration-300 hover:scale-105 bg-red-accent hover:bg-red-muted text-white hover:shadow-lg">
                            Add Content
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowCustomInput(prev => ({
                        ...prev,
                        [section.id]: false
                      }))} className="transition-all duration-300 hover:scale-105 border-border">
                            Cancel
                          </Button>
                        </div>
                      </div>}

                    {/* Add Custom Content Button */}
                    {!showCustomInput[section.id] && <Button variant="outline" size="sm" onClick={() => setShowCustomInput(prev => ({
                    ...prev,
                    [section.id]: true
                  }))} className="text-muted-foreground hover:text-foreground hover:border-red-accent transition-all duration-300 hover:scale-105 hover:shadow-sm border-border group">
                        <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                        Add Custom Content
                      </Button>}
                  </CardContent>
                 </Card>)}
            </div>
          </div>
        </div>

        {/* Sidebar Controls - Fixed */}
        <div className="w-80 border-l border-border bg-card fixed right-0 top-0 h-screen overflow-hidden shadow-lg shadow-red-accent/5">
          <div className="p-6 h-full overflow-y-auto my-0">
          <div className="space-y-6 my-[100px]">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-red-accent" />
                RFP Controls
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setShowTemplateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                  Create New RFP
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                  onClick={() => navigate('/template-management')}
                >
                  <Settings className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  Template Management
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                  onClick={handleGenerateFromKnowledgebase}
                  disabled={!currentTemplate || !currentObjective || isGeneratingFromKnowledgebase}
                >
                  <Database className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  {isGeneratingFromKnowledgebase ? "Generating..." : "Generate Draft"}
                </Button>
                
                <Button className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg bg-red-accent hover:bg-red-muted text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" onClick={handleSaveDraft} disabled={!currentTemplate}>
                  <Save className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  Save Draft
                </Button>
                
                
                <Button variant="outline" className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-md border-border hover:border-red-accent hover:text-red-accent" onClick={() => setShowKnowledgebase(!showKnowledgebase)}>
                  <BookOpen className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  {showKnowledgebase ? "Hide" : "Show"} Knowledgebase
                </Button>
                
                <Button variant="outline" className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-md border-border hover:border-red-accent hover:text-red-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" onClick={handleSendReview} disabled={!currentTemplate}>
                  <Send className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  Send for Review
                </Button>
              </div>
            </div>

            <Separator className="transition-opacity duration-300 border-border" />

            <div className="animate-fade-in" style={{
                animationDelay: '200ms'
              }}>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-accent transition-transform duration-300 hover:rotate-12" />
                Progress Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between transition-all duration-300 hover:bg-muted/30 p-2 rounded-md">
                  <span className="text-muted-foreground">Sections Completed:</span>
                  <span className="text-foreground font-medium transition-colors duration-300">
                    {sections.filter(s => s.contentPieces.length > 0).length}/{sections.length}
                  </span>
                </div>
                <div className="flex justify-between transition-all duration-300 hover:bg-muted/30 p-2 rounded-md">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="text-foreground font-medium transition-colors duration-300">
                    {currentTemplate ? (() => {
                        const templateMap: Record<string, string> = {
                          "standard-it": "Standard IT Services",
                          "marketing": "Marketing Campaign",
                          "construction": "Construction Project",
                          "software-dev": "Software Development",
                          "custom": "Custom Template"
                        };
                        return templateMap[currentTemplate] || "Custom Template";
                      })() : "Not selected yet"}
                  </span>
                </div>
                <div className="flex justify-between transition-all duration-300 hover:bg-muted/30 p-2 rounded-md">
                  <span className="text-muted-foreground">Total Words:</span>
                  <span className="text-foreground font-medium transition-colors duration-300">
                    {sections.reduce((total, section) => total + section.contentPieces.reduce((sectionTotal, piece) => sectionTotal + piece.content.trim().split(/\s+/).filter(word => word.length > 0).length, 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="transition-opacity duration-300 border-border" />

            <div className="space-y-3 animate-fade-in" style={{
                animationDelay: '300ms'
              }}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" disabled={!sections.some(s => s.contentPieces.length > 0)}>
                    <Trash2 className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Clear All Content
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to clear all content?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All generated content across all sections will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          </div>
        </div>
      </div>}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledgebase' && <div className="flex h-screen">
          {/* Main Knowledge Base Content */}
          <div className="flex-1 overflow-auto pr-80 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-background" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Knowledge Base</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <List className="h-4 w-4" />
                Items ({knowledgeItems.length})
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Stats
              </Button>
            </div>

            {/* Add New Item Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-foreground mb-4">Add New Item</h2>
              <div className="space-y-4">
                <Input placeholder="Item title..." className="w-full" value={customInput} onChange={e => setCustomInput(e.target.value)} />
                <Textarea placeholder="Item content..." className="w-full min-h-[120px] resize-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90" onClick={() => {
                if (customInput.trim() && searchQuery.trim()) {
                  const newItem: KnowledgeItem = {
                    id: Date.now().toString(),
                    title: customInput.trim(),
                    content: searchQuery.trim(),
                    source: 'manual',
                    type: 'text',
                    tags: [],
                    createdAt: new Date()
                  };
                  setKnowledgeItems(prev => [...prev, newItem]);
                  setCustomInput('');
                  setSearchQuery('');
                  toast({
                    title: "Item Added",
                    description: "New item added to knowledge base"
                  });
                }
              }} disabled={!customInput.trim() || !searchQuery.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Knowledgebase
                </Button>
              </div>
            </div>

            {/* Knowledge Items Display */}
            {knowledgeItems.length === 0 ? <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No items in knowledgebase yet</h3>
                <p className="text-sm text-muted-foreground">Upload files or search to add content</p>
              </div> : <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Your Knowledge Items</h3>
                {knowledgeItems.map(item => <Card key={item.id} className="p-4 border border-border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {item.source}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Added: {item.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handlePreviewKnowledgeContent(item.title, item.content)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setKnowledgeItems(prev => prev.filter(k => k.id !== item.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>)}
              </div>}
          </div>

          {/* Sidebar Controls - Similar to RFP tab */}
          <div className="w-80 border-l border-border bg-card fixed right-0 top-0 h-screen overflow-hidden shadow-lg">
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6 my-[100px]">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Knowledge Controls
                  </h3>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={handleWebSearch} disabled={isSearching}>
                      {isSearching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                      Web Search
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Upload Files
                      </label>
                      <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" accept=".txt,.pdf,.doc,.docx,.jpg,.png,.svg" />
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Stats
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Knowledge Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Items:</span>
                      <span className="text-foreground font-medium">{knowledgeItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manual Entries:</span>
                      <span className="text-foreground font-medium">
                        {knowledgeItems.filter(item => item.source === 'manual').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded Files:</span>
                      <span className="text-foreground font-medium">
                        {knowledgeItems.filter(item => item.source === 'upload').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Search Results:</span>
                      <span className="text-foreground font-medium">
                        {knowledgeItems.filter(item => item.source === 'search').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Dashboard
              </h1>
              <p className="text-muted-foreground">View analytics and insights from your RFP responses</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total RFPs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Knowledge Items</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{knowledgeItems.length}</div>
                <p className="text-xs text-muted-foreground">Across all sources</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">RFP "IT Infrastructure Upgrade" completed</span>
                  <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">New knowledge item added from search</span>
                  <span className="text-xs text-muted-foreground ml-auto">4 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">RFP "Marketing Campaign" in progress</span>
                  <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>}

      {/* Knowledge Base Panel in Middle */}
      {showKnowledgebase && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-5xl h-[85%] bg-background border border-border shadow-xl rounded-lg overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Settings className="h-6 w-6 mr-3 text-primary" />
                    <h2 className="text-xl font-semibold">Knowledge Base Integration</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowKnowledgebase(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search knowledge base for relevant content..." value={knowledgeSearchQuery} onChange={e => setKnowledgeSearchQuery(e.target.value)} className="pl-12 h-12 text-base" />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 flex-wrap">
                  {["All", "Reports", "Best Practices", "Templates", "Web Search"].map(filter => <Button key={filter} variant={activeKnowledgeFilter === filter ? "default" : "outline"} size="sm" onClick={() => setActiveKnowledgeFilter(filter)} className="px-4 py-2 text-sm hover:scale-105 transition-transform">
                      {filter === "All" && <FileText className="h-4 w-4 mr-2" />}
                      {filter === "Reports" && <FileText className="h-4 w-4 mr-2" />}
                      {filter === "Best Practices" && <Target className="h-4 w-4 mr-2" />}
                      {filter === "Templates" && <FileText className="h-4 w-4 mr-2" />}
                      {filter === "Web Search" && <Search className="h-4 w-4 mr-2" />}
                      {filter}
                    </Button>)}
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Left Side - Knowledge Tags */}
                <div className="w-72 border-r border-border p-6 overflow-auto bg-muted/20">
                  <h4 className="text-base font-medium mb-4 text-foreground">Quick Knowledge Tags</h4>
                  <div className="space-y-2">
                    {["2024", "IP", "IT services", "assignment", "court decisions", "data protection", "finance", "intellectual property", "law updates", "legal", "legislation", "liability", "cloud migration", "project management", "risk assessment", "compliance"].map(tag => <Badge key={tag} variant="secondary" className="cursor-pointer text-sm hover:bg-primary hover:text-primary-foreground transition-colors block w-full text-left p-2" onClick={() => setKnowledgeSearchQuery(tag)}>
                        {tag}
                      </Badge>)}
                  </div>
                </div>

                {/* Right Side - Knowledge Items */}
                <div className="flex-1 p-6 overflow-auto">
                  {activeKnowledgeFilter === "Web Search" ? <div className="space-y-4">
                      {/* Internet Search Section */}
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-4">Search the Internet</h4>
                        <div className="flex gap-2 mb-4">
                          <Input placeholder="Search for similar RFPs, market research, government guidelines..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1" />
                          <Button onClick={handleWebSearch} disabled={isSearching}>
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          </Button>
                        </div>
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && <div className="space-y-3">
                            <h5 className="font-medium">Search Results:</h5>
                            {searchResults.map(result => <div key={result.id} className="border border-border rounded-lg p-3 hover:bg-muted/50">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h6 className="font-medium text-sm">{result.title}</h6>
                                    <p className="text-xs text-muted-foreground mt-1">{result.snippet}</p>
                                    <p className="text-xs text-primary mt-1">{result.url}</p>
                                  </div>
                                  <Button size="sm" variant="outline" onClick={() => handleAddToKnowledgeBase(result)} className="ml-2">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>)}
                          </div>}
                      </div>
                    </div> : <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Dynamic Knowledge Items */}
                      {knowledgeItems.filter(item => {
                    // Filter by search query
                    const searchMatch = knowledgeSearchQuery === "" || item.title.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) || item.content.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) || item.tags.some(tag => tag.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()));

                    // Filter by category
                    if (activeKnowledgeFilter === "All") return searchMatch;
                    if (activeKnowledgeFilter === "Reports" && item.type === "web") return searchMatch;
                    if (activeKnowledgeFilter === "Best Practices" && item.tags.includes("best practices")) return searchMatch;
                    if (activeKnowledgeFilter === "Templates" && item.tags.includes("template")) return searchMatch;
                    return searchMatch;
                   }).map(item => <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-all hover:shadow-md overflow-hidden">
                             <div className="flex items-start justify-between gap-3 mb-3">
                               <div className="flex items-start gap-3 flex-1 min-w-0">
                                 <div className="h-6 w-6 mt-0.5 text-primary flex-shrink-0">
                                   {item.type === 'web' ? <Globe className="h-6 w-6" /> : item.type === 'file' ? <FileText className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <h4 className="text-base font-medium leading-tight text-foreground mb-2 break-words">{item.title}</h4>
                                   <div className="flex items-center flex-wrap gap-2 mb-2">
                                     <span className="text-xs text-foreground font-medium bg-secondary/50 px-2 py-1 rounded whitespace-nowrap">
                                       {item.source === 'search' ? 'Web Source' : item.source === 'upload' ? 'Uploaded File' : 'Manual Entry'}
                                     </span>
                                     <span className="text-xs text-muted-foreground whitespace-nowrap">{item.createdAt.toLocaleDateString()}</span>
                                   </div>
                                   <p className="text-sm text-muted-foreground leading-relaxed break-words">
                                     {item.content.length > 120 ? `${item.content.substring(0, 120)}...` : item.content}
                                   </p>
                                 </div>
                               </div>
                               <div className="flex gap-1 flex-shrink-0">
                                 <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground" onClick={() => handlePreviewKnowledgeContent(item.title, item.content)}>
                                   <Eye className="h-4 w-4" />
                                 </Button>
                                 <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground" onClick={() => handleInsertKnowledgeContent(item.title, item.content)}>
                                   <Plus className="h-4 w-4" />
                                 </Button>
                               </div>
                             </div>
                             <div className="flex flex-wrap gap-1 overflow-hidden">
                               {item.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs px-2 py-1 flex-shrink-0">
                                   {tag}
                                 </Badge>)}
                             </div>
                           </div>)}
                      
                      {/* Show message if no items found */}
                      {knowledgeItems.filter(item => {
                    const searchMatch = knowledgeSearchQuery === "" || item.title.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) || item.content.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) || item.tags.some(tag => tag.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()));
                    if (activeKnowledgeFilter === "All") return searchMatch;
                    if (activeKnowledgeFilter === "Reports" && item.type === "web") return searchMatch;
                    if (activeKnowledgeFilter === "Best Practices" && item.tags.includes("best practices")) return searchMatch;
                    if (activeKnowledgeFilter === "Templates" && item.tags.includes("template")) return searchMatch;
                    return searchMatch;
                  }).length === 0 && <div className="col-span-2 text-center py-8">
                          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No knowledge items found. Try searching or adding new content.</p>
                        </div>}
                    </div>}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/30">
                <p className="text-sm text-muted-foreground text-center">
                  Click <Eye className="inline h-4 w-4 mx-1" /> to preview content or <Plus className="inline h-4 w-4 mx-1" /> to insert directly into your RFP section
                </p>
              </div>
            </div>
          </div>
        </div>}

      {/* Document Preview Modal */}
      <Dialog open={showDocumentPreview} onOpenChange={setShowDocumentPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-accent" />
              RFP Document Preview
            </DialogTitle>
            <DialogDescription>
              Review your complete RFP document before saving or downloading
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto max-h-[60vh] border rounded-lg p-6 bg-muted/20">
            <div className="space-y-8 text-sm">
              {/* Objective as H1 heading */}
              <div className="text-left border-b border-border pb-6 mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {currentObjective || formData.coreObjective || "RFP Project Objective"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Request for Proposal Document
                </p>
              </div>
              
              {/* Rest of the sections */}
              {sections.map(section => <div key={section.id} className="space-y-4">
                  <div className="border-b border-border pb-2">
                    <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                    <p className="text-muted-foreground mt-1">{section.description}</p>
                  </div>
                  
                  {section.contentPieces.length > 0 ? <div className="space-y-4 pl-4">
                      {section.contentPieces.map(piece => <div key={piece.id} className="space-y-2">
                          <h3 className="font-semibold text-foreground">{piece.prompt}</h3>
                          <div className="text-foreground leading-relaxed whitespace-pre-wrap bg-background/50 p-4 rounded-lg border">
                            {piece.content}
                          </div>
                        </div>)}
                    </div> : <div className="text-muted-foreground italic pl-4">
                      No content generated for this section yet.
                    </div>}
                </div>)}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              <Button variant="outline" onClick={handleDownloadPDF} className="flex-1 transition-all duration-300 hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                Download as PDF
              </Button>
              <Button variant="outline" onClick={handleDownloadDocument} className="flex-1 transition-all duration-300 hover:scale-105">
                <FileText className="h-4 w-4 mr-2" />
                Download as Document
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleActualSave} disabled={isLoading} className="bg-red-accent hover:bg-red-muted text-white transition-all duration-300 hover:scale-105">
                {isLoading ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </> : <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>}
              </Button>
              <Button variant="outline" onClick={() => setShowDocumentPreview(false)} className="transition-all duration-300 hover:scale-105">
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Knowledge Content Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {previewContent.title}
            </DialogTitle>
            <DialogDescription>
              Preview of knowledge base content
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto border rounded-lg p-6 bg-muted/20">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {previewContent.fullContent}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            {activeContentPieceId && <Button onClick={() => {
              handleInsertKnowledgeContent(previewContent.title, previewContent.content);
              setShowPreviewDialog(false);
            }} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Insert Content
              </Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Initiate New Request for Proposal (RFP)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Template Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select an RFP Template
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full bg-background border-border">
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="standard-it">Standard IT Services</SelectItem>
                  <SelectItem value="marketing">Marketing Campaign</SelectItem>
                  <SelectItem value="construction">Construction Project</SelectItem>
                  <SelectItem value="software-dev">Software Development</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Core Objective Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Define Your RFP Core Objective
              </label>
              <Textarea placeholder="E.g., 'We are soliciting proposals for the development of a cutting-edge cloud-based inventory management system to optimize our retail operational efficiency.'" className="min-h-[120px] bg-background border-border resize-none" value={templateObjective} onChange={e => setTemplateObjective(e.target.value)} />
            </div>

            {/* File Upload Support Info */}
            <div className="text-xs text-muted-foreground">
              Supported: PDF, DOCX, XLSX, JPG, PNG, SVG (Max 10MB each)
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setShowTemplateDialog(false);
              setSelectedTemplate("");
              setTemplateObjective("");
            }}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => {
              if (!selectedTemplate) {
                toast({
                  title: "Please select a template",
                  description: "Choose a template from the dropdown to continue.",
                  variant: "destructive"
                });
                return;
              }
              if (!templateObjective.trim()) {
                toast({
                  title: "Please define your core objective",
                  description: "Enter your RFP core objective to continue.",
                  variant: "destructive"
                });
                return;
              }

              // Load the selected template with the objective
              handleCreateNewRFP(selectedTemplate);
              setShowTemplateDialog(false);
              setSelectedTemplate("");
              setTemplateObjective("");
            }}>
              Generate RFP Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Screen Loader for Knowledgebase Generation */}
      {isGeneratingFromKnowledgebase && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-6 p-8 bg-card border border-border rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-primary/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold text-foreground">
                {generationStep === "knowledgebase" ? "Going through the knowledgebase" : "Generating your RFP"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {generationStep === "knowledgebase" 
                  ? "Analyzing your knowledge base content and extracting relevant information..."
                  : "Creating comprehensive RFP sections using your knowledge base insights..."
                }
              </p>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: generationStep === "knowledgebase" ? "50%" : "100%" 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      <Dialog open={showTemplateEditor} onOpenChange={(open) => {
        setShowTemplateEditor(open);
        if (open) {
          // Initialize editing template with current sections
          const templateNames = {
            "standard-it": "Standard IT Services",
            "marketing": "Marketing Campaign",
            "construction": "Construction Project", 
            "software-dev": "Software Development",
            "custom": "Custom Template"
          };
          setEditingTemplate({
            name: templateNames[currentTemplate as keyof typeof templateNames] || "Template",
            sections: [...sections]
          });
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Edit Template: {editingTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Modify the template structure and section content. Changes will be applied to the current RFP.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Template Name</label>
              <Input
                value={editingTemplate?.name || ""}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter template name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Template Sections ({editingTemplate?.sections.length || 0})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editingTemplate) {
                      const newSection: RFPSection = {
                        id: `section-${Date.now()}`,
                        title: "New Section",
                        description: "New section description",
                        prompts: ["Add content here", "Expand this section", "Improve the content"],
                        contentPieces: [],
                        isGenerating: false
                      };
                      setEditingTemplate({
                        ...editingTemplate,
                        sections: [...editingTemplate.sections, newSection]
                      });
                    }
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </Button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {editingTemplate?.sections.map((section, index) => (
                  <Card key={section.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={section.title}
                          onChange={(e) => {
                            if (editingTemplate) {
                              const updatedSections = [...editingTemplate.sections];
                              updatedSections[index] = { ...section, title: e.target.value };
                              setEditingTemplate({ ...editingTemplate, sections: updatedSections });
                            }
                          }}
                          className="font-medium"
                          placeholder="Section title"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editingTemplate) {
                              const updatedSections = editingTemplate.sections.filter((_, i) => i !== index);
                              setEditingTemplate({ ...editingTemplate, sections: updatedSections });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Textarea
                        value={section.description}
                        onChange={(e) => {
                          if (editingTemplate) {
                            const updatedSections = [...editingTemplate.sections];
                            updatedSections[index] = { ...section, description: e.target.value };
                            setEditingTemplate({ ...editingTemplate, sections: updatedSections });
                          }
                        }}
                        placeholder="Section description"
                        rows={3}
                      />
                      
                      <div className="text-sm text-muted-foreground">
                        Content pieces: {section.contentPieces.length}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (editingTemplate) {
                  setSections(editingTemplate.sections);
                  toast({
                    title: "Template Updated",
                    description: "Your template has been successfully updated.",
                  });
                  setShowTemplateEditor(false);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
};
export default RFPDrafting;