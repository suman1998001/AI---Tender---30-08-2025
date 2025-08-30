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
  MessageSquare, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle, 
  Bot, 
  Edit3, 
  Download, 
  Send,
  Building2,
  FileSpreadsheet,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Query {
  id: string;
  question: string;
  vendorName: string;
  date: string;
  status: "New" | "Answered" | "Published" | "Under Review";
  category: string;
  answer?: string;
  generatedAnswer?: string;
}

export const PreBidQueriesTab = () => {
  const { toast } = useToast();
  const [queries, setQueries] = useState<Query[]>([
    {
      id: "1",
      question: "What is the minimum experience required for housekeeping and maintenance services?",
      vendorName: "M/S ARADHAY SHREERAM PRIVATE LIMITED",
      date: "2024-01-22",
      status: "Answered",
      category: "Eligibility",
      answer: "Minimum experience requirement: For MSE - Single work order ≥ ₹27.33 Lacs, Two work orders ≥ ₹21.86 Lacs, Three work orders ≥ ₹16.40 Lacs. For Non-MSE - Single work order ≥ ₹32.15 Lacs, Two work orders ≥ ₹25.72 Lacs, Three work orders ≥ ₹19.29 Lacs. All work orders must be completed in the last 5 years."
    },
    {
      id: "2",
      question: "What are the exact manpower requirements and their qualifications?",
      vendorName: "M/s BOOSTUP INDIA SOLUTION",
      date: "2024-01-22",
      status: "Answered",
      category: "Technical",
      answer: "Total 16 personnel required: 7 semi-skilled (minimum 10th pass) for office records, data entry, DG set operation, and liaison work; 9 unskilled for cleaning, pantry duties, and material handling. Minimum qualification is 10th pass for all personnel."
    },
    {
      id: "3",
      question: "Is EPF and ESIC registration mandatory for the contractor?",
      vendorName: "SECURE SERVICES (M/S HARSH ENGINEERING WORKS)",
      date: "2024-01-22",
      status: "Answered",
      category: "Compliance",
      answer: "Yes, EPF and ESIC registration is mandatory. Monthly submission of documentary proof of statutory dues paid is required. All personnel must be covered under EPF and ESIC schemes."
    },
    {
      id: "4",
      question: "What is the working schedule and holiday policy?",
      vendorName: "ALMIGHTY MANPOWER & SECURITY SERVICES",
      date: "2024-01-22",
      status: "Answered",
      category: "Operations",
      answer: "Work timing: 08:00 AM to 05:00 PM daily including holidays if required. Weekly offs must be arranged without affecting manpower deployment. Supervisor mandatory for coordination and quality control."
    },
    {
      id: "5",
      question: "What cleaning materials and uniforms need to be provided?",
      vendorName: "ANGEL MANPOWER & SECURITY SERVICES",
      date: "2024-01-22",
      status: "Under Review",
      category: "Technical"
    },
    {
      id: "6",
      question: "What are the penalty charges for non-compliance?",
      vendorName: "PARAMOUNT SERVICES",
      date: "2024-01-22",
      status: "Answered",
      category: "Commercial",
      answer: "₹2,000 for misconduct; ₹500 per manpower shortage/day; ₹15,000/month if supervisor not deployed; Safety violation penalties up to ₹10 lakhs for fatality. GST will be added to all penalties."
    },
    {
      id: "7",
      question: "What is the contract duration and termination clause?",
      vendorName: "SMVD GROUP",
      date: "2024-01-22",
      status: "Published",
      category: "Commercial",
      answer: "Contract duration: 3 years from issuance of work order. Early termination possible based on performance. Termination with one-month notice for unsatisfactory service or breach."
    },
    {
      id: "8",
      question: "What is the security deposit requirement?",
      vendorName: "UNIQUE DESIGN AND CONSTRUCTIONS",
      date: "2024-01-22",
      status: "Answered",
      category: "Financial",
      answer: "Security Deposit: 3% of contract value, valid throughout contract period plus 3 months. Performance security also required within specified timeline."
    },
    {
      id: "9",
      question: "Are sub-contracting arrangements permitted?",
      vendorName: "JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR",
      date: "2024-01-22",
      status: "Answered",
      category: "Legal",
      answer: "No, sub-letting is not permitted. The contract cannot be transferred to any third party. All work must be executed directly by the awarded contractor."
    },
    {
      id: "10",
      question: "What is the scope of DG set operation and maintenance?",
      vendorName: "SHREE GOSAI ENTERPRISES",
      date: "2024-01-22",
      status: "New",
      category: "Technical"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newQuery, setNewQuery] = useState({ question: "", category: "", vendorName: "" });
  const [showNewQueryDialog, setShowNewQueryDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);

  // Get unique vendors for filtering
  const vendors = Array.from(new Set(queries.map(q => q.vendorName))).sort();

  // Filter queries
  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = selectedVendor === "all" || query.vendorName === selectedVendor;
    const matchesStatus = selectedStatus === "all" || query.status === selectedStatus;
    
    return matchesSearch && matchesVendor && matchesStatus;
  });

  // Get statistics
  const stats = {
    total: queries.length,
    new: queries.filter(q => q.status === "New").length,
    answered: queries.filter(q => q.status === "Answered").length,
    published: queries.filter(q => q.status === "Published").length,
    underReview: queries.filter(q => q.status === "Under Review").length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Answered": return "bg-green-50 text-green-700 border-green-200";
      case "New": return "bg-red-50 text-red-700 border-red-200";
      case "Published": return "bg-gray-900 text-white border-gray-700";
      case "Under Review": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Answered": return CheckCircle;
      case "New": return Clock;
      case "Published": return Send;
      case "Under Review": return Eye;
      default: return Clock;
    }
  };

  const handleNewQuery = () => {
    if (!newQuery.question || !newQuery.category || !newQuery.vendorName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const query: Query = {
      id: Date.now().toString(),
      question: newQuery.question,
      vendorName: newQuery.vendorName,
      date: new Date().toISOString().split('T')[0],
      status: "New",
      category: newQuery.category
    };

    setQueries([query, ...queries]);
    setNewQuery({ question: "", category: "", vendorName: "" });
    setShowNewQueryDialog(false);
    
    toast({
      title: "Success",
      description: "Query added successfully"
    });
  };

  const handleBulkUpload = () => {
    // Simulate bulk upload
    toast({
      title: "Success",
      description: "Bulk upload completed. 5 queries imported."
    });
    setShowBulkUploadDialog(false);
  };

  const generateAIAnswer = (queryId: string) => {
    const query = queries.find(q => q.id === queryId);
    if (!query) return;

    // Simulate AI answer generation
    const aiAnswers = [
      "Based on the RFP documentation and requirements, here is the generated response...",
      "According to the tender specifications and knowledge base, the answer is...",
      "From the available documentation and similar projects, we recommend...",
      "Based on regulatory guidelines and project requirements..."
    ];

    const generatedAnswer = aiAnswers[Math.floor(Math.random() * aiAnswers.length)];

    setQueries(queries.map(q => 
      q.id === queryId 
        ? { ...q, generatedAnswer, status: "Under Review" as const }
        : q
    ));

    toast({
      title: "AI Answer Generated",
      description: "Review and edit the generated answer before publishing"
    });
  };

  const publishAnswer = (queryId: string) => {
    setQueries(queries.map(q => 
      q.id === queryId 
        ? { ...q, status: "Published" as const }
        : q
    ));

    toast({
      title: "Answer Published",
      description: "The answer has been published to all bidders"
    });
  };

  const publishAllAnswers = () => {
    setQueries(queries.map(q => 
      q.status === "Answered" 
        ? { ...q, status: "Published" as const }
        : q
    ));

    toast({
      title: "All Answers Published",
      description: "All answered queries have been published to bidders"
    });
  };

  const exportQueries = () => {
    toast({
      title: "Export Started",
      description: "Q&A log is being exported to Excel"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Pre-bid Queries</h2>
        </div>
        <Button onClick={publishAllAnswers} className="bg-gray-900 hover:bg-gray-800">
          <Send className="w-4 h-4 mr-2" />
          Publish All Answers
        </Button>
      </div>

      {/* A. Query Submission / Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Query Submission & Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Queries (Bulk)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Queries</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload Excel or CSV file with queries</p>
                    <Input type="file" accept=".xlsx,.csv" className="mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleBulkUpload} className="flex-1">Upload</Button>
                    <Button variant="outline" onClick={() => setShowBulkUploadDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showNewQueryDialog} onOpenChange={setShowNewQueryDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Specific Query
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Query</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Vendor Name</label>
                    <Input
                      value={newQuery.vendorName}
                      onChange={(e) => setNewQuery({...newQuery, vendorName: e.target.value})}
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newQuery.category} onValueChange={(value) => setNewQuery({...newQuery, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Eligibility">Eligibility</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Evaluation">Evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Query</label>
                    <Textarea
                      value={newQuery.question}
                      onChange={(e) => setNewQuery({...newQuery, question: e.target.value})}
                      placeholder="Enter your query here..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleNewQuery} className="flex-1">Add Query</Button>
                    <Button variant="outline" onClick={() => setShowNewQueryDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Queries
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.total}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              All submitted queries
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                New
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.new}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Awaiting answers
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Answered
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.answered}
              </div>
            </div>
            <div className="bg-gray-700 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Ready to publish
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Published
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.published}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Send className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Shared with bidders
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Under Review
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.underReview}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Awaiting review
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>

      {/* C. Query & Answer Log (Enhanced) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Query & Answer Log</CardTitle>
            <Button variant="outline" onClick={exportQueries}>
              <Download className="w-4 h-4 mr-2" />
              Export Q&A
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Search queries or vendors..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map(vendor => (
                  <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Answered">Answered</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="min-w-[200px]">Vendor Name</TableHead>
                  <TableHead className="min-w-[300px]">Query</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query, index) => {
                  const StatusIcon = getStatusIcon(query.status);
                  return (
                    <TableRow key={query.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{query.vendorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="text-sm line-clamp-2">{query.question}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{query.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{query.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(query.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {query.status === "New" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateAIAnswer(query.id)}
                            >
                              <Bot className="w-3 h-3 mr-1" />
                              Generate Answer
                            </Button>
                          )}
                          {query.status === "Under Review" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingQuery(query)}
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Review
                            </Button>
                          )}
                          {query.status === "Answered" && (
                            <Button 
                              size="sm"
                              onClick={() => publishAnswer(query.id)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Publish
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredQueries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No queries found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      {/* B. AI-Powered Answer Generation Dialog */}
      {editingQuery && (
        <Dialog open={true} onOpenChange={() => setEditingQuery(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review & Edit AI Generated Answer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Query</label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{editingQuery.question}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Generated Answer</label>
                <Textarea
                  value={editingQuery.generatedAnswer || ""}
                  onChange={(e) => setEditingQuery({...editingQuery, generatedAnswer: e.target.value})}
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setQueries(queries.map(q => 
                      q.id === editingQuery.id 
                        ? { ...q, answer: editingQuery.generatedAnswer, status: "Answered" as const }
                        : q
                    ));
                    setEditingQuery(null);
                    toast({
                      title: "Answer Saved",
                      description: "The answer has been saved and marked as answered"
                    });
                  }}
                  className="flex-1"
                >
                  Save Answer
                </Button>
                <Button variant="outline" onClick={() => setEditingQuery(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};