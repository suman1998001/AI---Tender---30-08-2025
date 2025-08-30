import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  FileText,
  Lightbulb,
  BookOpen,
  Globe,
  Database,
  Eye,
  Plus,
  X,
  Upload,
  Star,
  Clock,
  Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'manual-entry' | 'web-source' | 'report' | 'best-practice' | 'template';
  source?: string;
  date?: string;
  tags: string[];
  relevance?: number;
}

interface EnhancedKnowledgeBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertContent: (content: string) => void;
}

export const EnhancedKnowledgeBase = ({ open, onOpenChange, onInsertContent }: EnhancedKnowledgeBaseProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [webSearchResults, setWebSearchResults] = useState<KnowledgeItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState("");
  const [newKnowledgeContent, setNewKnowledgeContent] = useState("");
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);

  // Initialize with different types of knowledge items
  const initialKnowledgeItems: KnowledgeItem[] = [
    // All & Manual Entry items
    {
      id: "1",
      title: "IIFT Antivirus Software Tender - GA-12012/1/2024",
      content: "Tender for Subscription of Antivirus Software (CrowdStrike/Microsoft/SentinelOne/PaloAltoNetworks/TrendMicro/Sophos/Trend). This comprehensive tender covers enterprise-grade antivirus solutions with multi-platform support and centralized management capabilities.",
      type: "manual-entry",
      source: "Manual Entry",
      date: "13/01/2025",
      tags: ["tender", "antivirus", "IIFT", "software", "cybersecurity"]
    },
    {
      id: "2", 
      title: "Government Procurement Guidelines for IT Security",
      content: "Guidelines for procurement of IT security solutions in government institutions including eligibility criteria, technical requirements, compliance standards, and vendor evaluation criteria for cybersecurity products and services.",
      type: "web-source",
      source: "Web Source",
      date: "10/01/2025",
      tags: ["government", "procurement", "IT security", "guidelines"]
    },
    // Reports
    {
      id: "3",
      title: "Cybersecurity Market Analysis Report 2024",
      content: "Comprehensive market analysis covering enterprise cybersecurity trends, vendor landscape, pricing models, and technology adoption patterns. Includes detailed analysis of endpoint protection, network security, and cloud security solutions.",
      type: "report",
      source: "Market Research",
      date: "08/01/2025",
      tags: ["market research", "cybersecurity", "2024", "analysis"],
      relevance: 95
    },
    {
      id: "4",
      title: "Annual IT Procurement Compliance Report",
      content: "Annual report detailing compliance requirements, regulatory changes, and best practices for IT procurement in government and enterprise environments. Covers data protection regulations and vendor assessment criteria.",
      type: "report",
      source: "Compliance Office",
      date: "15/12/2024",
      tags: ["compliance", "IT procurement", "regulations", "annual report"],
      relevance: 88
    },
    // Best Practices
    {
      id: "5",
      title: "Best Practices: Vendor Selection Criteria",
      content: "Industry best practices for evaluating and selecting technology vendors. Includes evaluation frameworks, scoring methodologies, reference checking procedures, and risk assessment guidelines for vendor management.",
      type: "best-practice",
      source: "Industry Standards",
      date: "20/12/2024",
      tags: ["best practices", "vendor selection", "evaluation", "procurement"],
      relevance: 92
    },
    {
      id: "6",
      title: "Security Implementation Best Practices",
      content: "Comprehensive guide for implementing cybersecurity solutions in enterprise environments. Covers deployment strategies, configuration standards, monitoring requirements, and maintenance procedures.",
      type: "best-practice",
      source: "Security Framework",
      date: "18/12/2024",
      tags: ["cybersecurity", "implementation", "best practices", "enterprise"],
      relevance: 90
    },
    // Templates
    {
      id: "7",
      title: "RFP Template: IT Security Solutions",
      content: "Standard RFP template for procuring IT security solutions including technical specifications, evaluation criteria, vendor requirements, and contract terms. Customizable for various security product categories.",
      type: "template",
      source: "Template Library",
      date: "25/12/2024",
      tags: ["RFP", "template", "IT security", "procurement"],
      relevance: 96
    },
    {
      id: "8",
      title: "Vendor Evaluation Scorecard Template",
      content: "Standardized scorecard template for evaluating technology vendors. Includes weighted criteria for technical capabilities, financial stability, support quality, and compliance requirements.",
      type: "template",
      source: "Template Library",
      date: "22/12/2024",
      tags: ["vendor evaluation", "template", "scorecard", "assessment"],
      relevance: 94
    }
  ];

  // Initialize knowledge items
  useState(() => {
    setKnowledgeItems(initialKnowledgeItems);
  });

  // Quick knowledge tags from the design
  const quickTags = [
    "2024", "IP", "IT services", "assignment", "court decisions", "data protection",
    "finance", "intellectual property", "law updates", "legal", "legislation"
  ];

  const filterButtons = [
    { key: "All", label: "All", icon: Database },
    { key: "Reports", label: "Reports", icon: FileText },
    { key: "Best Practices", label: "Best Practices", icon: Lightbulb },
    { key: "Templates", label: "Templates", icon: BookOpen },
    { key: "Web Search", label: "Web Search", icon: Globe }
  ];

  // Web Search functionality
  const handleWebSearch = async () => {
    if (!webSearchQuery.trim()) return;
    
    setIsWebSearching(true);
    
    // Simulate web search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockWebResults: KnowledgeItem[] = [
      {
        id: `web-${Date.now()}-1`,
        title: `${webSearchQuery} - Industry Best Practices`,
        content: `Comprehensive guide about ${webSearchQuery} including industry standards, best practices, regulatory compliance, and implementation strategies for enterprise environments.`,
        type: "web-source",
        source: "Web Search",
        date: new Date().toLocaleDateString('en-GB'),
        tags: [webSearchQuery.toLowerCase(), "best practices", "industry standards"],
        relevance: 95
      },
      {
        id: `web-${Date.now()}-2`,
        title: `Legal Requirements: ${webSearchQuery}`,
        content: `Legal and regulatory requirements related to ${webSearchQuery}, including compliance standards, mandatory clauses, and recent legislative updates affecting procurement processes.`,
        type: "web-source", 
        source: "Legal Database",
        date: new Date().toLocaleDateString('en-GB'),
        tags: [webSearchQuery.toLowerCase(), "legal", "compliance", "regulations"],
        relevance: 90
      },
      {
        id: `web-${Date.now()}-3`,
        title: `Template Collection: ${webSearchQuery}`,
        content: `Professional template collection for ${webSearchQuery} with proven track record in government and enterprise procurement. Includes customizable sections and standard clauses.`,
        type: "web-source",
        source: "Template Repository", 
        date: new Date().toLocaleDateString('en-GB'),
        tags: [webSearchQuery.toLowerCase(), "templates", "procurement"],
        relevance: 88
      }
    ];
    
    setWebSearchResults(mockWebResults);
    setIsWebSearching(false);
    
    toast({
      title: "Search Complete",
      description: `Found ${mockWebResults.length} results for "${webSearchQuery}".`
    });
  };

  const addToKnowledgeBase = (item: KnowledgeItem) => {
    const newItem = {
      ...item,
      id: `kb-${Date.now()}`,
      type: "web-source" as const
    };
    
    setKnowledgeItems(prev => [...prev, newItem]);
    toast({
      title: "Added to Knowledge Base",
      description: "Search result has been added to your knowledge base."
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Process files for knowledge base
    files.forEach(file => {
      const newItem: KnowledgeItem = {
        id: `file-${Date.now()}-${Math.random()}`,
        title: file.name,
        content: `Content extracted from ${file.name}. This document contains relevant information for procurement processes including specifications, requirements, and best practices.`,
        type: "manual-entry",
        source: "Uploaded Document",
        date: new Date().toLocaleDateString('en-GB'),
        tags: ["uploaded", "document", file.name.split('.').pop() || "file"]
      };
      setKnowledgeItems(prev => [...prev, newItem]);
    });
    
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded and processed.`
    });
  };

  const addManualEntry = () => {
    if (!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()) return;
    
    const newItem: KnowledgeItem = {
      id: `manual-${Date.now()}`,
      title: newKnowledgeTitle,
      content: newKnowledgeContent,
      type: "manual-entry",
      source: "Manual Entry",
      date: new Date().toLocaleDateString('en-GB'),
      tags: ["manual", "custom"]
    };
    
    setKnowledgeItems(prev => [...prev, newItem]);
    setNewKnowledgeTitle("");
    setNewKnowledgeContent("");
    
    toast({
      title: "Entry Added",
      description: "Manual entry has been added to knowledge base."
    });
  };

  const handleInsert = (content: string) => {
    onInsertContent(content);
    onOpenChange(false);
  };

  // Filter items based on active tab
  const getFilteredItems = () => {
    let items = [...knowledgeItems];
    
    // Filter by active tab
    if (activeFilter === "Reports") {
      items = items.filter(item => item.type === "report");
    } else if (activeFilter === "Best Practices") {
      items = items.filter(item => item.type === "best-practice");
    } else if (activeFilter === "Templates") {
      items = items.filter(item => item.type === "template");
    } else if (activeFilter === "Web Search") {
      return webSearchResults;
    }
    
    // Apply search filter
    if (searchTerm) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();

  const renderContent = () => {
    if (activeFilter === "Web Search") {
      return (
        <div className="space-y-4">
          {/* Web Search Interface */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-gray-900 mb-3">Search the Web</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Search for information to add to knowledge base..."
                value={webSearchQuery}
                onChange={(e) => setWebSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()}
                className="flex-1"
              />
              <Button
                onClick={handleWebSearch}
                disabled={!webSearchQuery.trim() || isWebSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isWebSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Web Search Results */}
          <ScrollArea className="h-[350px]">
            <div className="space-y-3">
              {webSearchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Search the web to find relevant information</p>
                  <p className="text-sm">Enter a search query above to get started</p>
                </div>
              ) : (
                webSearchResults.map((item) => (
                  <Card key={item.id} className="border border-blue-200 bg-white">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{item.content}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Source: {item.source}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {item.relevance}% relevant
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToKnowledgeBase(item)}
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-xs"
                          >
                            Add to KB
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleInsert(item.content)}
                            className="text-blue-500 hover:bg-blue-50"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No items found in {activeFilter}</p>
              <p className="text-sm">Try adjusting your search or add new content</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-md bg-gray-100">
                        {item.type === "report" && <FileText className="h-4 w-4 text-blue-600" />}
                        {item.type === "best-practice" && <Lightbulb className="h-4 w-4 text-green-600" />}
                        {item.type === "template" && <BookOpen className="h-4 w-4 text-purple-600" />}
                        {item.type === "manual-entry" && <Database className="h-4 w-4 text-gray-600" />}
                        {item.type === "web-source" && <Globe className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 leading-tight mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span>{item.source}</span>
                          <span>{item.date}</span>
                          {item.relevance && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {item.relevance}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInsert(item.content)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs text-gray-600 border-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Knowledge Base Integration
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-1">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search knowledge base for relevant content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {filterButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(key)}
                className={`h-8 ${
                  activeFilter === key 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Quick Knowledge Tags */}
          {activeFilter === "All" && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Knowledge Tags</h3>
              <div className="flex flex-wrap gap-1">
                {quickTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Upload Section for All tab */}
          {activeFilter === "All" && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Add to Knowledge Base</h3>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Files
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Title"
                  value={newKnowledgeTitle}
                  onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                  className="text-xs"
                />
                <Button
                  onClick={addManualEntry}
                  disabled={!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()}
                  size="sm"
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Entry
                </Button>
              </div>
              <Textarea
                placeholder="Content"
                value={newKnowledgeContent}
                onChange={(e) => setNewKnowledgeContent(e.target.value)}
                className="mt-2 text-xs"
                rows={2}
              />
            </div>
          )}

          {/* Dynamic Content Area */}
          {renderContent()}

          {/* Bottom instruction */}
          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-200">
            Click <Eye className="inline h-3 w-3 mx-1" /> to preview content or <Plus className="inline h-3 w-3 mx-1" /> to insert directly into your document section
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};