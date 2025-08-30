import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BookOpen, 
  Search, 
  FileText, 
  Upload, 
  Globe, 
  Database, 
  Plus, 
  Download, 
  Eye, 
  Tag,
  FolderOpen,
  Users,
  Clock,
  Building2,
  FileSpreadsheet,
  File,
  Trash2,
  Edit3,
  Filter,
  UploadCloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeDocument {
  id: string;
  name: string;
  type: "Report" | "Consultant Report" | "Past RFP" | "Template" | "Policy" | "Guidelines";
  uploadDate: string;
  tags: string[];
  size: string;
  uploadedBy: string;
  category: string;
}

export const KnowledgebaseTab = () => {
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([
    {
      id: "1",
      name: "Facility Management Services Guidelines 2024",
      type: "Guidelines",
      uploadDate: "2024-01-20",
      tags: ["Facility Management", "Services", "Guidelines"],
      size: "3.2 MB",
      uploadedBy: "Admin",
      category: "Government Guidelines"
    },
    {
      id: "2",
      name: "Facility Management Best Practices - Oil Sector",
      type: "Report",
      uploadDate: "2024-01-18",
      tags: ["Facility Management", "Oil Sector", "Best Practices"],
      size: "2.8 MB",
      uploadedBy: "Facility Manager",
      category: "Industry Reports"
    },
    {
      id: "3",
      name: "Similar RFP: ONGC Housekeeping Contract 2023",
      type: "Past RFP",
      uploadDate: "2024-01-15",
      tags: ["ONGC", "Housekeeping", "Contract", "Similar"],
      size: "4.5 MB",
      uploadedBy: "Procurement Team",
      category: "Past Tenders"
    },
    {
      id: "4",
      name: "Manpower Deployment Standards - PSU",
      type: "Policy",
      uploadDate: "2024-01-22",
      tags: ["Manpower", "Deployment", "Standards", "PSU"],
      size: "1.9 MB",
      uploadedBy: "HR Department",
      category: "Policy Documents"
    },
    {
      id: "5",
      name: "EPF/ESIC Compliance Checklist for Contractors",
      type: "Template",
      uploadDate: "2024-01-19",
      tags: ["EPF", "ESIC", "Compliance", "Contractors"],
      size: "856 KB",
      uploadedBy: "Legal Team",
      category: "Compliance Templates"
    },
    {
      id: "6",
      name: "Penalty Structure Analysis - Maintenance Contracts",
      type: "Consultant Report",
      uploadDate: "2024-01-17",
      tags: ["Penalty", "Maintenance", "Contracts", "Analysis"],
      size: "2.1 MB",
      uploadedBy: "External Consultant",
      category: "Consultant Reports"
    },
    {
      id: "7",
      name: "Market Research: Housekeeping Service Rates MP Region",
      type: "Report",
      uploadDate: "2024-01-16",
      tags: ["Market Research", "Housekeeping", "Rates", "MP"],
      size: "1.7 MB",
      uploadedBy: "Market Research Team",
      category: "Market Research"
    },
    {
      id: "8",
      name: "Safety Guidelines for Maintenance Operations",
      type: "Guidelines",
      uploadDate: "2024-01-14",
      tags: ["Safety", "Maintenance", "Operations", "Guidelines"],
      size: "2.3 MB",
      uploadedBy: "Safety Officer",
      category: "Safety Guidelines"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showConsultantDialog, setShowConsultantDialog] = useState(false);
  const [showPastRFPDialog, setShowPastRFPDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSearchResultsDialog, setShowSearchResultsDialog] = useState(false);
  const [internetSearchTerm, setInternetSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "Report" as const,
    tags: "",
    category: ""
  });
  const [newConsultantReport, setNewConsultantReport] = useState({
    name: "",
    consultantName: "",
    tags: "",
    category: "Consultant Reports"
  });
  const [newPastRFP, setNewPastRFP] = useState({
    name: "",
    year: "",
    tags: "",
    category: "Past Tenders"
  });

  // Mock search results based on search terms
  const getMockSearchResults = (searchTerm: string) => {
    const searchLower = searchTerm.toLowerCase();
    
    if (searchLower.includes('similar rfp') || searchLower.includes('housekeeping') || searchLower.includes('maintenance')) {
      return [
        {
          id: 'web-1',
          title: 'BPCL Housekeeping Services RFP 2023 - Best Practices',
          url: 'https://bpcl.com/tenders/housekeeping-2023',
          snippet: 'Bharat Petroleum Corporation Limited tender for comprehensive housekeeping and maintenance services at multiple locations. Includes manpower requirements, penalty structures, and compliance guidelines.',
          type: 'Past RFP',
          category: 'Similar Tenders',
          tags: ['BPCL', 'Housekeeping', 'Similar RFP', 'Oil Sector'],
          source: 'BPCL Official Website'
        },
        {
          id: 'web-2',
          title: 'Facility Management Contract Template - PSU Guidelines',
          url: 'https://psu-guidelines.gov.in/facility-management',
          snippet: 'Standard template and guidelines for facility management contracts in Public Sector Units. Covers manpower deployment, service level agreements, and penalty frameworks.',
          type: 'Template',
          category: 'Government Guidelines',
          tags: ['PSU', 'Facility Management', 'Template', 'Guidelines'],
          source: 'Government Portal'
        }
      ];
    }
    
    if (searchLower.includes('market research') || searchLower.includes('rates') || searchLower.includes('pricing')) {
      return [
        {
          id: 'web-3',
          title: 'Housekeeping Services Market Analysis MP Region 2024',
          url: 'https://marketresearch.com/housekeeping-mp-2024',
          snippet: 'Comprehensive market analysis of housekeeping service rates in Madhya Pradesh region. Includes competitive pricing, service standards, and vendor capabilities assessment.',
          type: 'Report',
          category: 'Market Research',
          tags: ['Market Research', 'MP Region', 'Pricing', 'Housekeeping'],
          source: 'Market Research Institute'
        },
        {
          id: 'web-4',
          title: 'Oil Sector Facility Management Benchmarking Study',
          url: 'https://oilsector.research.in/facility-benchmarking',
          snippet: 'Benchmarking study of facility management practices across major oil companies in India. Comparative analysis of service costs, quality standards, and vendor performance.',
          type: 'Consultant Report',
          category: 'Industry Analysis',
          tags: ['Oil Sector', 'Benchmarking', 'Facility Management', 'Comparative Study'],
          source: 'Industry Research Portal'
        }
      ];
    }
    
    if (searchLower.includes('government guideline') || searchLower.includes('compliance') || searchLower.includes('policy')) {
      return [
        {
          id: 'web-5',
          title: 'DGP Guidelines for Outsourced Services in Government',
          url: 'https://dgp.gov.in/outsourcing-guidelines-2024',
          snippet: 'Department of General Procurement guidelines for outsourcing facility management and maintenance services in government organizations. Updated compliance requirements and best practices.',
          type: 'Guidelines',
          category: 'Government Guidelines',
          tags: ['DGP', 'Government', 'Outsourcing', 'Compliance'],
          source: 'Department of General Procurement'
        },
        {
          id: 'web-6',
          title: 'EPF/ESIC Compliance Manual for Service Contractors',
          url: 'https://epfindia.gov.in/contractor-compliance-manual',
          snippet: 'Comprehensive compliance manual for service contractors covering EPF, ESIC registration, monthly submissions, and penalty avoidance strategies.',
          type: 'Policy',
          category: 'Compliance Guidelines',
          tags: ['EPF', 'ESIC', 'Compliance', 'Contractors'],
          source: 'EPFO Official Portal'
        }
      ];
    }
    
    // Default results for any other search
    return [
      {
        id: 'web-default',
        title: 'General Procurement Best Practices Guide',
        url: 'https://procurement.gov.in/best-practices',
        snippet: 'General guidelines and best practices for government procurement processes, vendor management, and contract administration.',
        type: 'Guidelines',
        category: 'Best Practices',
        tags: ['Procurement', 'Best Practices', 'Government'],
        source: 'Government Procurement Portal'
      }
    ];
  };

  // Get statistics
  const stats = {
    total: documents.length,
    reports: documents.filter(d => d.type === "Report").length,
    consultantReports: documents.filter(d => d.type === "Consultant Report").length,
    pastRFPs: documents.filter(d => d.type === "Past RFP").length,
    templates: documents.filter(d => d.type === "Template").length
  };

  // Get unique categories and types
  const categories = Array.from(new Set(documents.map(d => d.category))).sort();
  const documentTypes = Array.from(new Set(documents.map(d => d.type))).sort();

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesType = selectedType === "all" || doc.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Report": return "bg-red-50 text-red-700 border-red-200";
      case "Consultant Report": return "bg-red-100 text-red-800 border-red-300";
      case "Past RFP": return "bg-gray-900 text-white border-gray-700";
      case "Template": return "bg-gray-700 text-white border-gray-600";
      case "Policy": return "bg-red-50 text-red-700 border-red-200";
      case "Guidelines": return "bg-gray-50 text-gray-700 border-gray-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleConsultantUpload = () => {
    if (!newConsultantReport.name || !newConsultantReport.consultantName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const document: KnowledgeDocument = {
      id: Date.now().toString(),
      name: newConsultantReport.name,
      type: "Consultant Report",
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newConsultantReport.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      size: "2.1 MB", // Mock size
      uploadedBy: newConsultantReport.consultantName,
      category: newConsultantReport.category
    };

    setDocuments([document, ...documents]);
    setNewConsultantReport({ name: "", consultantName: "", tags: "", category: "Consultant Reports" });
    setShowConsultantDialog(false);
    
    toast({
      title: "Success",
      description: "Consultant report uploaded successfully"
    });
  };

  const handlePastRFPUpload = () => {
    if (!newPastRFP.name || !newPastRFP.year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const document: KnowledgeDocument = {
      id: Date.now().toString(),
      name: newPastRFP.name,
      type: "Past RFP",
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newPastRFP.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      size: "3.8 MB", // Mock size
      uploadedBy: "System Admin",
      category: newPastRFP.category
    };

    setDocuments([document, ...documents]);
    setNewPastRFP({ name: "", year: "", tags: "", category: "Past Tenders" });
    setShowPastRFPDialog(false);
    
    toast({
      title: "Success",
      description: "Past RFP uploaded successfully"
    });
  };

  const handleUploadDocument = () => {
    if (!newDocument.name || !newDocument.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const document: KnowledgeDocument = {
      id: Date.now().toString(),
      name: newDocument.name,
      type: newDocument.type,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      size: "1.5 MB", // Mock size
              uploadedBy: "Rajesh Kumar",
      category: newDocument.category
    };

    setDocuments([document, ...documents]);
    setNewDocument({ name: "", type: "Report", tags: "", category: "" });
    setShowUploadDialog(false);
    
    toast({
      title: "Success",
      description: "Document uploaded successfully"
    });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "Bulk upload functionality initiated"
    });
  };

  const handleInternetSearch = () => {
    setShowSearchResultsDialog(true);
  };

  const performSearch = () => {
    if (!internetSearchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = getMockSearchResults(internetSearchTerm);
      setSearchResults(results);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${results.length} relevant results`,
      });
    }, 2000);
  };

  const addToKnowledgeBase = (result: any) => {
    const document: KnowledgeDocument = {
      id: Date.now().toString(),
      name: result.title,
      type: result.type as any,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: result.tags,
      size: "Retrieved from web",
      uploadedBy: "Internet Search",
      category: result.category
    };

    setDocuments([document, ...documents]);
    
    toast({
      title: "Added to Knowledge Base",
      description: `"${result.title}" has been added to the knowledge base`,
    });
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    toast({
      title: "Document Deleted",
      description: "Document has been removed from knowledge base"
    });
  };

  const curatedCategories = [
    "Standard Legal Clauses",
    "Best Practice Project Timelines",
    "Vendor Evaluation Criteria",
    "Compliance Checklists",
    "Technical Specifications"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Knowledgebase</h2>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800">
          <Database className="w-4 h-4 mr-2" />
          Manage Repository
        </Button>
      </div>

      {/* A. Knowledge Document Management */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upload Reports */}
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <div className="border-2 border-dashed border-red-accent/50 rounded-lg p-6 text-center cursor-pointer hover:border-red-accent transition-colors bg-red-accent/10">
                  <UploadCloud className="w-8 h-8 mx-auto mb-2 text-red-accent" />
                  <p className="font-medium text-gray-900">Upload Reports</p>
                  <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Document Name</label>
                    <Input
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                      placeholder="Enter document name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={newDocument.type} onValueChange={(value: any) => setNewDocument({...newDocument, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Report">Report</SelectItem>
                        <SelectItem value="Consultant Report">Consultant Report</SelectItem>
                        <SelectItem value="Past RFP">Past RFP</SelectItem>
                        <SelectItem value="Template">Template</SelectItem>
                        <SelectItem value="Policy">Policy</SelectItem>
                        <SelectItem value="Guidelines">Guidelines</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newDocument.category}
                      onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                      placeholder="Enter category"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      value={newDocument.tags}
                      onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                      placeholder="e.g., IT, Security, Analysis"
                    />
                  </div>
                  <Input type="file" multiple accept=".pdf,.doc,.docx,.xlsx" />
                  <div className="flex gap-2">
                    <Button onClick={handleUploadDocument} className="flex-1">Upload</Button>
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Upload Consultant Reports */}
            <Dialog open={showConsultantDialog} onOpenChange={setShowConsultantDialog}>
              <DialogTrigger asChild>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors bg-gray-50/50">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                  <p className="font-medium text-gray-900">Consultant Reports</p>
                  <p className="text-sm text-gray-600">Specialized consulting documents</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Consultant Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Name</label>
                    <Input
                      value={newConsultantReport.name}
                      onChange={(e) => setNewConsultantReport({...newConsultantReport, name: e.target.value})}
                      placeholder="Enter report name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Consultant Name</label>
                    <Input
                      value={newConsultantReport.consultantName}
                      onChange={(e) => setNewConsultantReport({...newConsultantReport, consultantName: e.target.value})}
                      placeholder="Enter consultant/firm name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      value={newConsultantReport.tags}
                      onChange={(e) => setNewConsultantReport({...newConsultantReport, tags: e.target.value})}
                      placeholder="e.g., Analysis, Strategy, Technical"
                    />
                  </div>
                  <Input type="file" multiple accept=".pdf,.doc,.docx,.xlsx" />
                  <div className="flex gap-2">
                    <Button onClick={handleConsultantUpload} className="flex-1">Upload Report</Button>
                    <Button variant="outline" onClick={() => setShowConsultantDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Past Tenders/RFPs Repository */}
            <Dialog open={showPastRFPDialog} onOpenChange={setShowPastRFPDialog}>
              <DialogTrigger asChild>
                <div className="border-2 border-dashed border-red-accent/50 rounded-lg p-6 text-center cursor-pointer hover:border-red-accent transition-colors bg-red-accent/10">
                  <FolderOpen className="w-8 h-8 mx-auto mb-2 text-red-accent" />
                  <p className="font-medium text-gray-900">Past Tenders/RFPs</p>
                  <p className="text-sm text-gray-600">Historical RFP repository</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Past RFP/Tender</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">RFP/Tender Name</label>
                    <Input
                      value={newPastRFP.name}
                      onChange={(e) => setNewPastRFP({...newPastRFP, name: e.target.value})}
                      placeholder="Enter RFP/tender name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      value={newPastRFP.year}
                      onChange={(e) => setNewPastRFP({...newPastRFP, year: e.target.value})}
                      placeholder="e.g., 2023"
                      type="number"
                      min="2000"
                      max="2024"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      value={newPastRFP.tags}
                      onChange={(e) => setNewPastRFP({...newPastRFP, tags: e.target.value})}
                      placeholder="e.g., Government, IT, Infrastructure"
                    />
                  </div>
                  <Input type="file" multiple accept=".pdf,.doc,.docx" />
                  <div className="flex gap-2">
                    <Button onClick={handlePastRFPUpload} className="flex-1">Upload RFP</Button>
                    <Button variant="outline" onClick={() => setShowPastRFPDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleBulkUpload} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload Documents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards - Dashboard KPI Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Documents
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.total}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              All knowledge assets
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-accent/5 to-red-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Reports
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.reports}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <File className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Analysis & reports
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Consultant Reports
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.consultantReports}
              </div>
            </div>
            <div className="bg-gray-700 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Expert consultations
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-accent/5 to-red-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Past RFPs
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.pastRFPs}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FolderOpen className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Historical tenders
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Templates
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.templates}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Reusable templates
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>

      {/* B. Knowledge Tagging & Search */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Tagging & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Search documents, tags, or content..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleInternetSearch} className="bg-red-accent hover:bg-red-accent/90">
              <Globe className="w-4 h-4 mr-2" />
              Internet Search & Tag
            </Button>
            <Button variant="outline">
              <Tag className="w-4 h-4 mr-2" />
              Tag Management
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document List Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Library</CardTitle>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(doc.type)}>{doc.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{doc.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.size}</TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.uploadedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-accent" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No documents found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      {/* C. Curated Data Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Curated Data Categories</CardTitle>
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Category name" />
                  <Textarea placeholder="Category description" rows={3} />
                  <div className="flex gap-2">
                    <Button className="flex-1">Create Category</Button>
                    <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curatedCategories.map((category, index) => {
              const docCount = documents.filter(d => d.category === category).length;
              return (
                <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow border border-red-accent/30 hover:border-red-accent/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-red-accent/10 rounded-lg">
                        <Database className="w-4 h-4 text-red-accent" />
                      </div>
                      <Badge className="bg-red-accent/10 text-red-accent border-red-accent/30">
                        {docCount} docs
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1">{category}</h3>
                    <p className="text-xs text-gray-600">
                      Curated collection of {category.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Internet Search Results Dialog */}
      <Dialog open={showSearchResultsDialog} onOpenChange={setShowSearchResultsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-accent" />
              Internet Search & Knowledge Discovery
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search for: similar rfp, market research report, government guideline..."
                  className="pl-10"
                  value={internetSearchTerm}
                  onChange={(e) => setInternetSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                />
              </div>
              <Button 
                onClick={performSearch}
                disabled={isSearching}
                className="bg-red-accent hover:bg-red-accent/90"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-2">
              <p className="text-sm text-gray-600 mr-2">Quick searches:</p>
              {[
                'similar rfp',
                'market research report', 
                'government guideline',
                'housekeeping maintenance',
                'compliance policy'
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInternetSearchTerm(suggestion);
                    setTimeout(() => performSearch(), 100);
                  }}
                  className="text-xs h-7"
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Search Results ({searchResults.length})</h3>
                
                {searchResults.map((result) => (
                  <Card key={result.id} className="border border-gray-200 hover:border-red-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <Globe className="w-4 h-4 text-red-accent mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium text-black hover:text-red-accent cursor-pointer mb-1">
                                {result.title}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">{result.url}</p>
                              <p className="text-sm text-gray-700 mb-3">{result.snippet}</p>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getTypeColor(result.type)}>{result.type}</Badge>
                                <Badge variant="outline" className="text-xs">{result.category}</Badge>
                                <span className="text-xs text-gray-500">Source: {result.source}</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1">
                                {result.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-red-accent/5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => addToKnowledgeBase(result)}
                            className="bg-red-accent hover:bg-red-accent/90 text-white"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add to KB
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {searchResults.length === 0 && internetSearchTerm && !isSearching && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No results found. Try different search terms or check the suggestions above.</p>
              </div>
            )}

            {/* Initial State */}
            {searchResults.length === 0 && !internetSearchTerm && (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 mx-auto mb-4 text-red-accent/50" />
                <h3 className="font-medium text-gray-900 mb-2">Discover Relevant Knowledge</h3>
                <p className="text-gray-600 mb-4">Search the internet for relevant documents, reports, and guidelines to enhance your knowledge base.</p>
                <p className="text-sm text-gray-500">Try searching for: similar RFPs, market research reports, government guidelines, compliance policies, or industry standards.</p>
              </div>
            )}

            {/* Dialog Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSearchResultsDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};