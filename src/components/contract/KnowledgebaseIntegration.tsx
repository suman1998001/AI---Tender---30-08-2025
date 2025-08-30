import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Plus, 
  Eye, 
  Copy, 
  ExternalLink,
  Sparkles,
  Database,
  Globe,
  Filter,
  Star,
  Clock,
  Tag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'consultant-report' | 'best-practice' | 'clause-template' | 'internet-search';
  tags: string[];
  relevanceScore: number;
  source?: string;
  lastUpdated?: string;
}

interface KnowledgebaseIntegrationProps {
  onInsertContent: (content: string) => void;
  currentContext?: string;
}

const KnowledgebaseIntegration = ({ onInsertContent, currentContext }: KnowledgebaseIntegrationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'consultant-report' | 'best-practice' | 'clause-template' | 'internet-search'>('all');
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Mock knowledgebase data - in real implementation, this would come from API/database
  const mockKnowledgeItems: KnowledgeItem[] = [
    {
      id: "1",
      title: "Standard Liability Limitation Clauses",
      content: "LIMITATION OF LIABILITY: In no event shall either party be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from the use of or inability to use the services...",
      type: "clause-template",
      tags: ["liability", "legal", "standard", "limitations"],
      relevanceScore: 95,
      source: "Legal Template Library",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      title: "IT Services Payment Terms Best Practices",
      content: "Best practices for IT service contracts recommend Net 30 payment terms with 2% early payment discounts for payments within 10 days. Include automatic late fees of 1.5% monthly interest on overdue amounts...",
      type: "best-practice",
      tags: ["payment", "IT services", "finance", "terms"],
      relevanceScore: 88,
      source: "Industry Standards Guide",
      lastUpdated: "2024-01-20"
    },
    {
      id: "3",
      title: "Consultant Report: Contract Management Trends 2024",
      content: "Recent analysis shows increasing emphasis on sustainability clauses (67% increase), force majeure adaptations post-pandemic, and enhanced data protection requirements. Key recommendations include...",
      type: "consultant-report",
      tags: ["trends", "2024", "sustainability", "data protection"],
      relevanceScore: 92,
      source: "McKinsey Contract Analysis",
      lastUpdated: "2024-01-22"
    },
    {
      id: "4",
      title: "Intellectual Property Assignment Clauses",
      content: "All work product, inventions, and intellectual property developed during the course of this agreement shall be the exclusive property of the Client. Contractor hereby assigns all rights, title, and interest...",
      type: "clause-template",
      tags: ["IP", "intellectual property", "assignment", "ownership"],
      relevanceScore: 90,
      source: "Legal Template Library",
      lastUpdated: "2024-01-18"
    },
    {
      id: "5",
      title: "Web Search: Latest Contract Law Updates",
      content: "Recent court decisions emphasize the importance of clear termination clauses and dispute resolution mechanisms. New legislation in several jurisdictions requires enhanced transparency in service provider contracts...",
      type: "internet-search",
      tags: ["law updates", "court decisions", "legislation"],
      relevanceScore: 85,
      source: "Legal News Aggregator",
      lastUpdated: "2024-01-25"
    }
  ];

  const availableTags = Array.from(
    new Set(mockKnowledgeItems.flatMap(item => item.tags))
  ).sort();

  const performSearch = useCallback(async (query: string, context?: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredResults = mockKnowledgeItems;
    
    // Filter by search term
    if (query.trim()) {
      filteredResults = filteredResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Filter by type
    if (activeFilter !== 'all') {
      filteredResults = filteredResults.filter(item => item.type === activeFilter);
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filteredResults = filteredResults.filter(item =>
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }
    
    // Add contextual relevance if context is provided
    if (context) {
      filteredResults = filteredResults.map(item => ({
        ...item,
        relevanceScore: item.relevanceScore + (
          item.content.toLowerCase().includes(context.toLowerCase()) ? 10 : 0
        )
      }));
    }
    
    // Sort by relevance score
    filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    setSearchResults(filteredResults);
    setIsSearching(false);
  }, [activeFilter, selectedTags]);

  useEffect(() => {
    performSearch(searchTerm, currentContext);
  }, [performSearch, searchTerm, currentContext]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleItemExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleInsertContent = (content: string) => {
    onInsertContent(content);
    toast({
      title: "Content Inserted",
      description: "Knowledge content has been inserted into your contract.",
    });
  };

  const getTypeIcon = (type: KnowledgeItem['type']) => {
    switch (type) {
      case 'consultant-report': return <FileText className="h-4 w-4" />;
      case 'best-practice': return <Lightbulb className="h-4 w-4" />;
      case 'clause-template': return <BookOpen className="h-4 w-4" />;
      case 'internet-search': return <Globe className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: KnowledgeItem['type']) => {
    switch (type) {
      case 'consultant-report': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'best-practice': return 'bg-green-100 text-green-800 border-green-200';
      case 'clause-template': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'internet-search': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Knowledgebase Integration
        </CardTitle>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge tags, topics, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', icon: Database },
            { key: 'consultant-report', label: 'Reports', icon: FileText },
            { key: 'best-practice', label: 'Best Practices', icon: Lightbulb },
            { key: 'clause-template', label: 'Templates', icon: BookOpen },
            { key: 'internet-search', label: 'Web Search', icon: Globe }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeFilter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(key as any)}
              className="h-8"
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Knowledge Tags */}
        {availableTags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Knowledge Tags:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {availableTags.slice(0, 12).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="h-[600px]">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Searching knowledgebase...
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No knowledge items found.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((item) => (
                <Card key={item.id} className="border border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        <div className={`p-1.5 rounded-md border ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3" />
                              {item.relevanceScore}% match
                            </div>
                            {item.lastUpdated && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {item.lastUpdated}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleItemExpand(item.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInsertContent(item.content)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  {expandedItems.includes(item.id) && (
                    <>
                      <Separator />
                      <CardContent className="pt-3">
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            {item.content}
                          </div>
                          
                          {item.source && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <ExternalLink className="h-3 w-3" />
                              Source: {item.source}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleInsertContent(item.content)}
                              className="h-8"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Insert Content
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(item.content);
                                toast({ title: "Copied to clipboard" });
                              }}
                              className="h-8"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default KnowledgebaseIntegration;