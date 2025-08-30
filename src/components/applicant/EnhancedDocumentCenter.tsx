import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw, 
  Zap, 
  Brain,
  Activity,
  IndianRupee,
  BarChart3,
  PieChart,
  Target,
  Settings,
  Mail,
  Cloud,
  Globe,
  Link2,
  Calendar,
  Shield,
  Key,
  FolderOpen,
  Copy,
  Plus,
  Trash,
  TestTube,
  Edit,
  FileCheck,
  Folder,
  ChevronDown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Applicant } from "@/pages/ApplicantTracking";

interface EnhancedDocumentCenterProps {
  applicant: Applicant;
}

interface DocumentSection {
  id: string;
  name: string;
  type: 'compliance' | 'technical' | 'financial';
  content: string;
  confidence: number;
  status: 'identified' | 'processing' | 'completed';
}

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  category: string;
}

// Document list will be loaded from API

// Mock generated upload links
const mockUploadLinks = [
  {
    id: '1',
    url: 'https://secure-upload.tender.com/abc123xyz',
    expiry: '2024-02-15T23:59:59Z',
    maxFileSize: 100,
    allowedTypes: 'PDF, DOCX, XLSX',
    createdDate: '2024-01-15T10:00:00Z',
    usageCount: 3,
    isActive: true
  },
  {
    id: '2', 
    url: 'https://secure-upload.tender.com/def456uvw',
    expiry: '2024-03-01T23:59:59Z',
    maxFileSize: 50,
    allowedTypes: 'PDF Only',
    createdDate: '2024-01-20T14:30:00Z',
    usageCount: 1,
    isActive: true
  }
];

// Mock automation configurations
const mockAutomationConfig = {
  email: {
    enabled: false,
    emailAddress: 'tenders@company.com',
    folder: 'Inbox/Tenders',
    authMethod: 'oauth',
    attachmentTypes: ['PDF', 'DOCX', 'XLSX'],
    schedule: 'hourly',
    lastSync: '2024-01-20T15:30:00Z',
    documentsImported: 12
  },
  drive: {
    enabled: true,
    driveType: 'Google Drive',
    folderPath: '/Documents/Tenders/Active',
    fileTypes: ['PDF', 'DOCX', 'XLSX'],
    schedule: 'daily',
    lastSync: '2024-01-21T09:00:00Z',
    documentsImported: 8
  },
  api: {
    enabled: false,
    endpoint: 'https://api.vendor.com/documents',
    authType: 'api-key',
    schedule: '15min',
    lastSync: null,
    documentsImported: 0
  }
};

// Vendor list for lookup (should ideally be imported from a shared location)
const vendors = [
  {"id": "4821",name:"ALMIGHTY MANPOWER & SECURITY SERVICES"},
    {"id": "7359",name:"ANGEL MANPOWER & SECURITY SERVICES"},
    {"id": "2964",name:"M/S ARADHAY SHREERAM PRIVATE LIMITED"},
    {"id": "8147",name:"SMVD GROUP"},
    {"id": "5620",name:"M/S HARSH ENGINEERING WORKS AND CONSTRUCTION"},
    {"id": "3095",name:"UNIQUE DESIGN AND CONSTRUCTIONS"},
    {"id": "4702",name:"JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR"},
    //{"id": "1286",name:"SHREE GOSAI ENTERPRISES"},
    {"id": "9531",name:"PARAMOUNT SERVICES"},
    {"id": "3968",name:"M/s BOOSTUP INDIA SOLUTION "}
];

export const EnhancedDocumentCenter = ({
  applicant
}: EnhancedDocumentCenterProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUploadedDocument, setHasUploadedDocument] = useState(false);
  const [extractedSections, setExtractedSections] = useState<DocumentSection[]>([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [currentStep, setCurrentStep] = useState<'upload' | 'extraction' | 'evaluation' | 'completed'>('upload');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [emailImportEnabled, setEmailImportEnabled] = useState(mockAutomationConfig.email.enabled);
  const [driveImportEnabled, setDriveImportEnabled] = useState(mockAutomationConfig.drive.enabled);
  const [apiImportEnabled, setApiImportEnabled] = useState(mockAutomationConfig.api.enabled);
  const [generatedUploadLink, setGeneratedUploadLink] = useState('');
  const [managedLinksDialogOpen, setManagedLinksDialogOpen] = useState(false);
  const [automationStats, setAutomationStats] = useState(mockAutomationConfig);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [uploadLinks, setUploadLinks] = useState(mockUploadLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('All Sources');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('All Documents');

  // Mock AI stats
  const aiStats = {
    modelName: "MSTRL",
    modelVersion: "2024.1.15",
    tokenUsage: 8945,
    energyConsumption: "0.018 kWh",
    tokenBalance: 91256,
    processingTime: "3.2s"
  };
  
  // Mock documents for demonstration
  const mockDocuments = [
    {
      id: "1",
      name: "Construction Services RFP 2024-Q1.pdf",
      type: "PDF",
      documentType: "RFPs",
      version: "2.1",
      uploadedBy: "Rajesh Kumar",
      uploadedOn: "2024-01-15",
      lastModified: "2024-01-20",
      tags: ["construction", "services", "2024"],
      size: "2.4 MB",
      source: "Manual Upload"
    },
    {
      id: "2", 
      name: "IT Equipment Supply RFP.docx",
      type: "DOCX",
      documentType: "RFPs",
      version: "1.0",
      uploadedBy: "Priya Sharma",
      uploadedOn: "2024-01-18",
      lastModified: "2024-01-18",
      tags: ["IT", "equipment", "supply"],
      size: "1.8 MB",
      source: "Email Import"
    },
    {
      id: "3",
      name: "Master Service Agreement 2024.pdf",
      type: "PDF", 
      documentType: "Contracts",
      version: "3.0",
      uploadedBy: "Vikram Agarwal",
      uploadedOn: "2024-01-10",
      lastModified: "2024-01-22",
      tags: ["contract", "master", "agreement"],
      size: "3.2 MB",
      source: "Google Drive"
    },
    {
      id: "4",
      name: "Non-Disclosure Agreement Template.docx",
      type: "DOCX",
      documentType: "Contracts", 
      version: "1.5",
      uploadedBy: "Neha Gupta",
      uploadedOn: "2024-01-05",
      lastModified: "2024-01-12",
      tags: ["NDA", "template", "confidential"],
      size: "892 KB",
      source: "Manual Upload"
    },
    {
      id: "5",
      name: "Q4 Procurement Performance Report.xlsx",
      type: "XLSX",
      documentType: "Reports",
      version: "1.0", 
      uploadedBy: "Amit Patel",
      uploadedOn: "2024-01-25",
      lastModified: "2024-01-25",
      tags: ["Q4", "performance", "procurement"],
      size: "4.1 MB",
      source: "API Import"
    },
    {
      id: "6",
      name: "Vendor Risk Assessment Report.pdf",
      type: "PDF",
      documentType: "Reports",
      version: "2.0",
      uploadedBy: "Sunita Reddy",
      uploadedOn: "2024-01-20",
      lastModified: "2024-01-23",
      tags: ["vendor", "risk", "assessment"],
      size: "2.7 MB", 
      source: "Manual Upload"
    },
    {
      id: "7",
      name: "Data Protection Policy 2024.pdf",
      type: "PDF",
      documentType: "Legal Policies",
      version: "1.2",
      uploadedBy: "Ankit Singh",
      uploadedOn: "2024-01-08",
      lastModified: "2024-01-16",
      tags: ["data protection", "policy", "GDPR"],
      size: "1.5 MB",
      source: "Email Import"
    },
    {
      id: "8", 
      name: "Supplier Code of Conduct.docx",
      type: "DOCX",
      documentType: "Legal Policies",
      version: "3.1",
      uploadedBy: "Kavita Joshi", 
      uploadedOn: "2024-01-12",
      lastModified: "2024-01-19",
      tags: ["supplier", "code", "conduct", "ethics"],
      size: "1.1 MB",
      source: "Google Drive"
    },
    {
      id: "9",
      name: "Budget Allocation 2024-Q1.xlsx", 
      type: "XLSX",
      documentType: "Financial Documents",
      version: "1.0",
      uploadedBy: "Ravi Verma",
      uploadedOn: "2024-01-14",
      lastModified: "2024-01-21",
      tags: ["budget", "allocation", "Q1", "2024"],
      size: "3.8 MB",
      source: "Manual Upload"
    },
    {
      id: "10",
      name: "Invoice Processing Guidelines.pdf",
      type: "PDF", 
      documentType: "Financial Documents",
      version: "2.0",
      uploadedBy: "Deepika Mishra",
      uploadedOn: "2024-01-11",
      lastModified: "2024-01-17",
      tags: ["invoice", "processing", "guidelines"],
      size: "2.1 MB",
      source: "API Import"
    },
    {
      id: "11",
      name: "Network Infrastructure Specifications.docx",
      type: "DOCX",
      documentType: "Technical Specifications", 
      version: "1.3",
      uploadedBy: "Arjun Nair",
      uploadedOn: "2024-01-13",
      lastModified: "2024-01-24",
      tags: ["network", "infrastructure", "specifications"],
      size: "5.2 MB",
      source: "Email Import"
    },
    {
      id: "12",
      name: "Security Protocol Requirements.pdf",
      type: "PDF",
      documentType: "Technical Specifications",
      version: "2.2", 
      uploadedBy: "Meera Iyer",
      uploadedOn: "2024-01-09",
      lastModified: "2024-01-15",
      tags: ["security", "protocol", "requirements"],
      size: "3.9 MB",
      source: "Google Drive"
    },
    {
      id: "13",
      name: "Meeting Minutes January 2024.docx",
      type: "DOCX", 
      documentType: "Other Documents",
      version: "1.0",
      uploadedBy: "Pooja Chopra",
      uploadedOn: "2024-01-26",
      lastModified: "2024-01-26",
      tags: ["meeting", "minutes", "january"],
      size: "743 KB",
      source: "Manual Upload"
    },
    {
      id: "14",
      name: "Training Materials Procurement.pptx",
      type: "PPTX",
      documentType: "Other Documents",
      version: "1.1",
      uploadedBy: "Sanjay Thakur",
      uploadedOn: "2024-01-07",
      lastModified: "2024-01-14", 
      tags: ["training", "materials", "procurement"],
      size: "6.3 MB",
      source: "API Import"
    }
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      setDocumentsLoading(true);
      setDocumentsError(null);
      try {
        // For demonstration purposes, use mock documents
        // In production, this would fetch from the actual API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setDocuments(mockDocuments);
      } catch (err: any) {
        setDocumentsError(err.message || "Unknown error");
      } finally {
        setDocumentsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [applicant?.applicantName]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
  };

  const getSectionIcon = (type: DocumentSection['type']) => {
    switch (type) {
      case 'compliance': return CheckCircle;
      case 'technical': return BarChart3;
      case 'financial': return IndianRupee;
      default: return FileText;
    }
  };

  const getSectionColor = (type: DocumentSection['type']) => {
    switch (type) {
      case 'compliance': return 'bg-red-50 border-red-200 text-red-800';
      case 'technical': return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'financial': return 'bg-black/5 border-black/20 text-black';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep('extraction');
    
    // Simulate AI processing - extraction phase
    setTimeout(() => {
      const mockSections: DocumentSection[] = [
        {
          id: '1',
          name: 'Compliance Requirements',
          type: 'compliance',
          content: 'ISO 27001 certification, GDPR compliance measures, regulatory frameworks...',
          confidence: 92,
          status: 'completed'
        },
        {
          id: '2',
          name: 'Technical Specifications',
          type: 'technical',
          content: 'Cloud infrastructure, API specifications, security protocols...',
          confidence: 88,
          status: 'completed'
        },
        {
          id: '3',
          name: 'Financial Proposal',
          type: 'financial',
          content: 'Budget breakdown, cost analysis, ROI projections...',
          confidence: 95,
          status: 'completed'
        }
      ];

      setExtractedSections(mockSections);
      setCurrentStep('evaluation');

      // Simulate evaluation phase
      setTimeout(() => {
        const mockCriteria: EvaluationCriteria[] = [
          { id: '1', name: 'Technical Feasibility', weight: 30, score: 85, maxScore: 100, category: 'Technical' },
          { id: '2', name: 'Compliance Adherence', weight: 25, score: 92, maxScore: 100, category: 'Compliance' },
          { id: '3', name: 'Cost Effectiveness', weight: 20, score: 78, maxScore: 100, category: 'Financial' },
          { id: '4', name: 'Implementation Timeline', weight: 15, score: 88, maxScore: 100, category: 'Technical' },
          { id: '5', name: 'Security Standards', weight: 10, score: 94, maxScore: 100, category: 'Compliance' }
        ];

        setEvaluationCriteria(mockCriteria);
        
        const weightedScore = mockCriteria.reduce((acc, criteria) => {
          return acc + (criteria.score * criteria.weight / 100);
        }, 0);
        
        setOverallScore(Math.round(weightedScore));
        setCurrentStep('completed');
        setIsProcessing(false);
        setHasUploadedDocument(true);

        toast({
          title: "AI Evaluation Complete!",
          description: `${selectedFile.name} analyzed with ${weightedScore.toFixed(1)}% overall score`,
          className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
        });

        setSelectedFile(null);
        setUploadNotes("");
      }, 2000);
    }, 1500);
  };

  const generateUploadLink = () => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const link = `https://procurement.gov.in/upload/tender/${applicant.applicantId}/${uniqueId}`;
    setGeneratedUploadLink(link);
    
    const newLink = {
      id: (uploadLinks.length + 1).toString(),
      url: link,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      maxFileSize: 100,
      allowedTypes: 'PDF, DOCX, XLSX',
      createdDate: new Date().toISOString(),
      usageCount: 0,
      isActive: true
    };
    setUploadLinks([...uploadLinks, newLink]);
    
    toast({
      title: "Upload Link Generated",
      description: "Secure upload link has been created successfully.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Upload link has been copied to your clipboard.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const testConnection = (type: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${type} connection...`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
    
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `${type} connection established successfully.`,
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    }, 2000);
  };

  const saveConfiguration = () => {
    const updatedStats = {
      ...automationStats,
      email: { ...automationStats.email, enabled: emailImportEnabled },
      drive: { ...automationStats.drive, enabled: driveImportEnabled },
      api: { ...automationStats.api, enabled: apiImportEnabled }
    };
    setAutomationStats(updatedStats);
    setSettingsDialogOpen(false);
    
    toast({
      title: "Configuration Saved",
      description: "Document source configuration has been updated.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const deleteUploadLink = (linkId: string) => {
    setUploadLinks(links => links.filter(link => link.id !== linkId));
    toast({
      title: "Upload Link Deleted",
      description: "The upload link has been revoked and deleted.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleViewDocument = (documentId: string) => {
    console.log('Viewing document with ID:', documentId);
    const document = documents.find(doc => doc.id === documentId);
    console.log('Found document:', document);
    if (document) {
      setPreviewDocument(document);
      setPreviewDialogOpen(true);
      console.log('Dialog should open now');
    } else {
      console.error('Document not found!');
    }
  };

  const handleDownloadDocument = (documentId: string, documentName: string) => {
    console.log(`Downloading document ${documentId}`);
    toast({
      title: "Download Started",
      description: `${documentName} is being downloaded...`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleDeleteDocument = (documentId: string, documentName: string) => {
    console.log(`Deleting document ${documentId}`);
    setDocuments(docs => docs.filter(doc => doc.id !== documentId));
    toast({
      title: "Document Deleted",
      description: `${documentName} has been removed from the library.`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Manual Upload': return 'bg-red-100 text-red-800 border border-red-200';
      case 'Email Import': return 'bg-black/10 text-black border border-black/20';
      case 'Google Drive': case 'OneDrive': return 'bg-red-100 text-red-800 border border-red-200';
      case 'API Import': return 'bg-black/10 text-black border border-black/20';
      case 'Direct Upload Link': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Helper functions for document type management
  const getDocumentsByType = () => {
    const grouped: { [key: string]: any[] } = {};
    documents.forEach(doc => {
      const docType = doc.documentType || 'Other Documents';
      if (!grouped[docType]) {
        grouped[docType] = [];
      }
      grouped[docType].push(doc);
    });
    return grouped;
  };

  const getDocumentTypeCount = (type: string) => {
    if (type === 'All Documents') return documents.length;
    return documents.filter(doc => doc.documentType === type).length;
  };

  const getFilteredDocuments = () => {
    let filtered = documents;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.documentType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply document type filter
    if (selectedDocumentType !== 'All Documents') {
      filtered = filtered.filter(doc => doc.documentType === selectedDocumentType);
    }
    
    // Apply source filter
    if (filterSource !== 'All Sources') {
      filtered = filtered.filter(doc => doc.source === filterSource);
    }
    
    return filtered;
  };

  const filteredDocuments = getFilteredDocuments();
  const documentsByType = getDocumentsByType();
  const documentTypes = ['All Documents', ...Object.keys(documentsByType)];
  const uniqueSources = ['All Sources', ...Array.from(new Set(documents.map(doc => doc.source || 'API')))].filter((v, i, a) => a.indexOf(v) === i);


  const renderExtractedInfo = (extractedInfo: any) => {
    return (
      <div className="space-y-3">
        <div className="font-semibold text-gray-900 text-sm border-b pb-2">
          Document Information
        </div>
        {Object.entries(extractedInfo).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="text-xs text-gray-800">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-[15px]">
        {/* Document Upload & Processing */}
        <Card className="bg-white rounded-[15px] border border-gray-200">
          <CardHeader className="bg-white rounded-t-[15px]">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Upload size={20} />
                Document Upload & AI Processing
              </CardTitle>
              <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-[15px]">
                    <Settings size={16} />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings size={20} />
                      Document Source Configuration
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                      Configure automated sources for importing tender documents, or generate direct upload links.
                    </p>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Automated Source Configuration */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Automated Document Sources</h3>
                        <p className="text-sm text-gray-600">Set up connections to automatically import documents from various platforms.</p>
                      </div>
                      
                      {/* Email Import */}
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail size={20} className="text-blue-600" />
                              <div>
                                <CardTitle className="text-base">Read from Email</CardTitle>
                                {emailImportEnabled && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Last sync: {new Date(automationStats.email.lastSync).toLocaleString()} • 
                                    {automationStats.email.documentsImported} documents imported
                                  </p>
                                )}
                              </div>
                            </div>
                            <Switch checked={emailImportEnabled} onCheckedChange={setEmailImportEnabled} />
                          </div>
                        </CardHeader>
                        {emailImportEnabled && (
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="email-address">Email Address to Monitor</Label>
                                <Input id="email-address" placeholder="tenders@yourcompany.com" defaultValue={automationStats.email.emailAddress} />
                              </div>
                              <div>
                                <Label htmlFor="email-folder">Folder/Label to Scan</Label>
                                <Input id="email-folder" placeholder="Inbox/Tenders" defaultValue={automationStats.email.folder} />
                              </div>
                            </div>
                            <Button onClick={() => testConnection('Email')} variant="outline" size="sm" className="flex items-center gap-2">
                              <TestTube size={16} />
                              Test Connection
                            </Button>
                          </CardContent>
                        )}
                      </Card>

                      {/* Drive Import */}
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Cloud size={20} className="text-green-600" />
                              <div>
                                <CardTitle className="text-base">Download from Drive</CardTitle>
                                {driveImportEnabled && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Last sync: {new Date(automationStats.drive.lastSync).toLocaleString()} • 
                                    {automationStats.drive.documentsImported} documents imported
                                  </p>
                                )}
                              </div>
                            </div>
                            <Switch checked={driveImportEnabled} onCheckedChange={setDriveImportEnabled} />
                          </div>
                        </CardHeader>
                        {driveImportEnabled && (
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="drive-type">Drive Type</Label>
                                <Select defaultValue="google-drive">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select drive type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="google-drive">Google Drive</SelectItem>
                                    <SelectItem value="onedrive">OneDrive</SelectItem>
                                    <SelectItem value="sharepoint">SharePoint</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button onClick={() => testConnection('Drive')} variant="outline" size="sm" className="flex items-center gap-2">
                              <TestTube size={16} />
                              Test Connection
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    </div>

                    <Separator />

                    {/* Direct Upload Link */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Direct Upload Link</h3>
                        <p className="text-sm text-gray-600">
                          Create a unique link that external parties can use to securely upload documents directly to this tender's Document Center.
                        </p>
                      </div>
                      
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Link2 size={20} className="text-orange-600" />
                            Upload Link Configuration
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex gap-2">
                            <Button onClick={generateUploadLink} className="flex items-center gap-2">
                              <Plus size={16} />
                              Generate Link
                            </Button>
                            {uploadLinks.length > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setManagedLinksDialogOpen(true)}
                              >
                                Manage Generated Links ({uploadLinks.length})
                              </Button>
                            )}
                          </div>
                          
                          {generatedUploadLink && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                              <Label htmlFor="generated-link" className="text-sm font-medium text-green-800">
                                Generated Upload Link
                              </Label>
                              <div className="flex gap-2 mt-2">
                                <Input 
                                  id="generated-link" 
                                  value={generatedUploadLink} 
                                  readOnly 
                                  className="bg-white"
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(generatedUploadLink)}
                                  className="flex items-center gap-2"
                                >
                                  <Copy size={16} />
                                  Copy
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveConfiguration}>
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Document Preview Dialog */}
              <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{zIndex: 9999}}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Eye size={20} />
                      Document Preview - {previewDocument?.name}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto">
                    {previewDocument && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-2">AI Summary</h3>
                          <p className="text-sm text-blue-800">{previewDocument.aiSummary}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Document Content Preview</h3>
                          <div className="text-center py-8">
                            <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">{previewDocument.type} Document Preview</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => previewDocument && handleDownloadDocument(previewDocument.id, previewDocument.name)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="bg-white rounded-b-[15px]">
            <div className="space-y-4">
              {!hasUploadedDocument && (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-6 text-center">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 25MB)
                      </p>
                    </div>
                    <input type="file" onChange={handleFileSelect} className="hidden" id="file-upload" accept=".pdf,.doc,.docx,.xls,.xlsx" />
                    <label htmlFor="file-upload">
                      <Button className="mt-4 rounded-[15px]" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="p-4 bg-blue-50 rounded-[15px] border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{selectedFile.name}</p>
                            <p className="text-sm text-blue-700">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button size="sm" onClick={handleUpload} disabled={isProcessing} className="flex items-center gap-2 rounded-[15px]">
                          {isProcessing ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap size={14} />
                              Upload & Process
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-3">
                        <Textarea 
                          placeholder="Add notes about this document (optional)..." 
                          value={uploadNotes} 
                          onChange={e => setUploadNotes(e.target.value)} 
                          rows={2} 
                          className="rounded-[15px]" 
                        />
                      </div>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="p-4 bg-yellow-50 rounded-[15px] border border-yellow-200">
                      <div className="flex items-center gap-3 mb-3">
                        <RefreshCw size={20} className="text-yellow-600 animate-spin" />
                        <div>
                          <p className="font-medium text-yellow-900">AI Processing Document</p>
                          <p className="text-sm text-yellow-700">
                            {currentStep === 'extraction' && 'Extracting and analyzing content...'}
                            {currentStep === 'evaluation' && 'Evaluating criteria and scoring...'}
                          </p>
                        </div>
                      </div>
                      <Progress value={currentStep === 'extraction' ? 35 : 75} className="h-2" />
                    </div>
                  )}
                </>
              )}

              {/* AI Evaluation Results - THIS IS WHAT WAS MISSING */}
              {hasUploadedDocument && currentStep === 'completed' && (
                <>
                  <div className="space-y-6">
                    {/* Header Section */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-black mb-2">AI Document Analysis Complete</h2>
                      <p className="text-gray-600">Comprehensive evaluation and extraction results</p>
                    </div>

                    {/* Overall Score Highlight */}
                    <Card className="rounded-[20px] border-2 border-red-300 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                      <CardContent className="p-8">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-red-300 rounded-full mb-4 animate-pulse hover:animate-none transition-all duration-300 hover:scale-110">
                            <span className="text-3xl font-bold text-red-900 animate-[fadeIn_1s_ease-in-out]">{overallScore}%</span>
                          </div>
                          <h3 className="text-xl font-semibold text-black mb-2 animate-[slideUp_0.6s_ease-out]">Overall Document Score</h3>
                          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-2000 shadow-sm animate-[expandWidth_2s_ease-out]" 
                              style={{width: `${overallScore}%`}}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 animate-[fadeIn_1.2s_ease-in-out]">Based on {evaluationCriteria.length} evaluation criteria</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Main Analysis Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* AI Processing Stats */}
                      <Card className="rounded-[20px] border border-black/10 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="rounded-t-[20px] bg-black/5 border-b border-black/10">
                          <CardTitle className="flex items-center gap-3 text-black">
                            <div className="p-2 bg-black rounded-lg">
                              <Brain size={20} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">AI Processing Details</h3>
                              <p className="text-sm text-gray-600 font-normal">System performance metrics</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">AI Model</div>
                              <div className="text-sm font-semibold text-black">{aiStats.modelName}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Processing Time</div>
                              <div className="text-sm font-semibold text-black">{aiStats.processingTime}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tokens Used</div>
                              <div className="text-sm font-semibold text-black">{aiStats.tokenUsage.toLocaleString()}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Energy</div>
                              <div className="text-sm font-semibold text-black">{aiStats.energyConsumption}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Extracted Sections */}
                      <Card className="rounded-[20px] border border-black/10 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="rounded-t-[20px] bg-black/5 border-b border-black/10">
                          <CardTitle className="flex items-center gap-3 text-black">
                            <div className="p-2 bg-red-600 rounded-lg">
                              <Target size={20} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">Document Sections</h3>
                              <p className="text-sm text-gray-600 font-normal">Extracted content areas</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {extractedSections.map((section, index) => {
                              const SectionIcon = getSectionIcon(section.type);
                              return (
                                <div key={section.id} className={`relative p-4 rounded-xl border-2 ${getSectionColor(section.type)} transition-all hover:shadow-sm`}>
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="p-2 bg-white/50 rounded-lg">
                                        <SectionIcon size={16} />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-sm">{section.name}</h4>
                                        <Badge variant="outline" className="text-xs bg-white/50">
                                          {section.confidence}% confidence
                                        </Badge>
                                      </div>
                                      <p className="text-xs opacity-80 leading-relaxed line-clamp-2">
                                        {section.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detailed Evaluation Criteria */}
                    <Card className="rounded-[20px] border border-red-200 shadow-md">
                      <CardHeader className="rounded-t-[20px] bg-gradient-to-r from-red-50 to-white border-b border-red-100">
                        <CardTitle className="flex items-center gap-3 text-red-900">
                          <div className="p-2 bg-red-600 rounded-lg">
                            <BarChart3 size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Detailed Evaluation Criteria</h3>
                            <p className="text-sm text-red-700 font-normal">Individual assessment scores</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {evaluationCriteria.map((criteria) => (
                            <div key={criteria.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-black text-sm">{criteria.name}</h4>
                                  <p className="text-xs text-gray-600">{criteria.category} • Weight: {criteria.weight}%</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-black">{criteria.score}</div>
                                  <div className="text-xs text-gray-500">/ {criteria.maxScore}</div>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-black to-gray-700 h-2 rounded-full transition-all duration-500" 
                                    style={{width: `${(criteria.score / criteria.maxScore) * 100}%`}}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-600 mt-1 text-right">
                                  {Math.round((criteria.score / criteria.maxScore) * 100)}% complete
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        setHasUploadedDocument(false);
                        setCurrentStep('upload');
                        setExtractedSections([]);
                        setEvaluationCriteria([]);
                        setOverallScore(0);
                      }}
                      variant="outline"
                      className="rounded-[15px]"
                    >
                      Upload Another Document
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Document Library with Tab Navigation */}
        <Card className="bg-white rounded-[15px] border border-gray-200">
          <CardHeader className="rounded-t-[15px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FileText size={20} />
                  Document Library
                </CardTitle>
                <Badge variant="outline" className="text-gray-600">
                  {documents.length} total documents
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => {
                    setCurrentStep('upload');
                    setSelectedFile(null);
                    setUploadNotes('');
                  }}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Upload size={16} />
                  Upload Document
                </Button>
              </div>
            </div>
            
            {/* Global Search */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search documents across all types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="rounded-b-[15px]">
            {documentsLoading ? (
              <div className="text-gray-600 p-6">Loading document list...</div>
            ) : documentsError ? (
              <div className="text-red-600 p-6">Error: {documentsError}</div>
            ) : (
              <Tabs value={selectedDocumentType} onValueChange={setSelectedDocumentType} className="w-full">
                <TabsList className="grid w-full grid-cols-7 mb-6">
                  <TabsTrigger value="All Documents" className="flex items-center gap-2">
                    <Folder size={16} />
                    All ({documents.length})
                  </TabsTrigger>
                  <TabsTrigger value="RFPs" className="flex items-center gap-2">
                    <FileText size={16} />
                    RFPs ({getDocumentTypeCount('RFPs')})
                  </TabsTrigger>
                  <TabsTrigger value="Contracts" className="flex items-center gap-2">
                    <FileCheck size={16} />
                    Contracts ({getDocumentTypeCount('Contracts')})
                  </TabsTrigger>
                  <TabsTrigger value="Reports" className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Reports ({getDocumentTypeCount('Reports')})
                  </TabsTrigger>
                  <TabsTrigger value="Legal Policies" className="flex items-center gap-2">
                    <Shield size={16} />
                    Legal ({getDocumentTypeCount('Legal Policies')})
                  </TabsTrigger>
                  <TabsTrigger value="Financial Documents" className="flex items-center gap-2">
                    <IndianRupee size={16} />
                    Financial ({getDocumentTypeCount('Financial Documents')})
                  </TabsTrigger>
                  <TabsTrigger value="Technical Specifications" className="flex items-center gap-2">
                    <Settings size={16} />
                    Tech ({getDocumentTypeCount('Technical Specifications')})
                  </TabsTrigger>
                </TabsList>

                {/* All Documents Tab */}
                <TabsContent value="All Documents">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">All Documents ({filteredDocuments.length})</h3>
                    </div>
                    {filteredDocuments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDocuments.map((doc) => (
                              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className={`p-1 rounded ${
                                      doc.documentType === 'RFPs' ? 'bg-blue-100 text-blue-600' :
                                      doc.documentType === 'Contracts' ? 'bg-green-100 text-green-600' :
                                      doc.documentType === 'Reports' ? 'bg-purple-100 text-purple-600' :
                                      doc.documentType === 'Legal Policies' ? 'bg-red-100 text-red-600' :
                                      doc.documentType === 'Financial Documents' ? 'bg-yellow-100 text-yellow-600' :
                                      doc.documentType === 'Technical Specifications' ? 'bg-indigo-100 text-indigo-600' :
                                      'bg-gray-100 text-gray-600'
                                    }`}>
                                      <FileText size={14} />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                                      <div className="text-xs text-gray-500">{doc.documentType}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{doc.type}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{doc.version}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedBy}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedOn}</td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-1 flex-wrap">
                                    {doc.tags?.length > 0 ? doc.tags.map((tag: string, idx: number) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    )) : (
                                      <span className="text-xs text-gray-400">No tags</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center gap-1 justify-end">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleViewDocument(doc.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Eye size={14} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">View Document</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleDownloadDocument(doc.id, doc.name)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Download size={14} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">Download</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleDeleteDocument(doc.id, doc.name)}
                                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">Delete</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No documents found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or upload some documents.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Individual Document Type Tabs */}
                {['RFPs', 'Contracts', 'Reports', 'Legal Policies', 'Financial Documents', 'Technical Specifications'].map((docType) => {
                  const documentsInType = documents.filter(doc => doc.documentType === docType && 
                    (!searchTerm || doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     doc.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))));
                  
                  return (
                    <TabsContent key={docType} value={docType}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{docType} ({documentsInType.length})</h3>
                        </div>
                        {documentsInType.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {documentsInType.map((doc) => (
                                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-blue-600" />
                                        <div>
                                          <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                                          <div className="text-xs text-gray-500">{doc.type}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">DOC-{doc.id.padStart(4, '0')}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{doc.version}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedBy}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedOn}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{doc.size}</td>
                                    <td className="px-4 py-3">
                                      <div className="flex gap-1 flex-wrap">
                                        {doc.tags?.length > 0 ? doc.tags.map((tag: string, idx: number) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        )) : (
                                          <span className="text-xs text-gray-400">No tags</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center gap-1 justify-end">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              onClick={() => handleViewDocument(doc.id)}
                                              className="h-8 w-8 p-0"
                                            >
                                              <Eye size={14} />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">View Document</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              onClick={() => handleDownloadDocument(doc.id, doc.name)}
                                              className="h-8 w-8 p-0"
                                            >
                                              <Download size={14} />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">Download</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              onClick={() => handleDeleteDocument(doc.id, doc.name)}
                                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                            >
                                              <Trash2 size={14} />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">Delete</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">No {docType.toLowerCase()} found</p>
                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or upload some documents.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Automation Status Summary */}
        {(emailImportEnabled || driveImportEnabled || apiImportEnabled) && (
          <Card className="rounded-[15px] border border-cyan-200 bg-cyan-50">
            <CardHeader>
              <CardTitle className="text-base text-cyan-900 flex items-center gap-2">
                <RefreshCw size={16} />
                Automated Import Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emailImportEnabled && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Email Import</div>
                      <div className="text-xs text-gray-600">
                        {automationStats.email.documentsImported} documents imported
                      </div>
                    </div>
                  </div>
                )}
                {driveImportEnabled && (
                  <div className="flex items-center gap-3">
                    <Cloud size={16} className="text-green-600" />
                    <div>
                      <div className="text-sm font-medium">{automationStats.drive.driveType}</div>
                      <div className="text-xs text-gray-600">
                        {automationStats.drive.documentsImported} documents imported
                      </div>
                    </div>
                  </div>
                )}
                {apiImportEnabled && (
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-purple-600" />
                    <div>
                      <div className="text-sm font-medium">API Import</div>
                      <div className="text-xs text-gray-600">
                        {automationStats.api.documentsImported} documents imported
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};