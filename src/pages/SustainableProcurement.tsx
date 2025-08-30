import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Share2, Plus, Search, ArrowUpDown, Eye, Users, Edit, Trash2, 
  Calendar as CalendarIcon, ChevronUp, ChevronDown, Settings, BarChart3,
  Target, Clock, CheckCircle, AlertCircle, TrendingUp, Brain, Upload,
  Copy, Send, ChevronDown as ChevronDownIcon, Filter, X, Check, ChevronsUpDown
} from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SustainableProcurement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create-survey");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSurvey, setSelectedSurvey] = useState<string>("all");
  const [vendorSearchTerm, setVendorSearchTerm] = useState<string>("");
  const [vendorStatusFilter, setVendorStatusFilter] = useState<string>("all");
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
  const [isShareSurveyOpen, setIsShareSurveyOpen] = useState(false);
  const [selectedSurveyForShare, setSelectedSurveyForShare] = useState<string>("");
  const [selectedVendorForShare, setSelectedVendorForShare] = useState<string>("");
  const [vendorSearchInPopup, setVendorSearchInPopup] = useState<string>("");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>("all");
  const [vendorPopoverOpen, setVendorPopoverOpen] = useState(false);
  const [isEditSurveyOpen, setIsEditSurveyOpen] = useState(false);
  const [selectedSurveyForEdit, setSelectedSurveyForEdit] = useState<any>(null);
  // Removed preview modal states - now using separate page
  const [surveyFormData, setSurveyFormData] = useState({
    name: "",
    type: "",
    description: "",
    instructions: "",
    organizationType: [] as string[],
    surveyFor: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  const { toast } = useToast();

  // KPI Data for Create Survey Tab
  const createSurveyKPIs = [
    {
      title: "Total Surveys Created",
      value: "24",
      change: "+4 new this month",
      icon: FileText,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Surveys In Draft",
      value: "5",
      change: "2 ready for review",
      icon: Clock,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    },
    {
      title: "Surveys Published",
      value: "19",
      change: "79% completion rate",
      icon: CheckCircle,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-700"
    },
    {
      title: "Avg. Questions per Survey",
      value: "18",
      change: "+3 more than last quarter",
      icon: BarChart3,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    }
  ];

  // KPI Data for Share Survey Tab
  const shareSurveyKPIs = [
    {
      title: "Total Surveys Shared",
      value: "19",
      change: "+7 shared this week",
      icon: Share2,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Responses Awaiting",
      value: "32",
      change: "15 due this week",
      icon: Clock,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    },
    {
      title: "Responses Completed",
      value: "156",
      change: "+28 completed today",
      icon: CheckCircle,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-700"
    },
    {
      title: "Avg. Completion Rate",
      value: "83%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    }
  ];

  // Mock data for created surveys
  const createdSurveys = [
    {
      id: 1,
      name: "ESG Compliance Survey 2024",
      type: "Annual Sustainability Assessment",
      status: "Published",
      questionsCount: 22,
      endDate: "2024-02-15",
      createdBy: "Rajesh Kumar",
      lastModified: "2024-01-10"
    },
    {
      id: 2,
      name: "Carbon Footprint Assessment",
      type: "Carbon Footprint Data Collection",
      status: "Draft",
      questionsCount: 15,
      endDate: "2024-02-20",
      createdBy: "Priya Sharma",
      lastModified: "2024-01-12"
    },
    {
      id: 3,
      name: "Supplier Sustainability Audit",
      type: "ESG Due Diligence",
      status: "Published",
      questionsCount: 28,
      endDate: "2024-02-25",
      createdBy: "Amit Singh",
      lastModified: "2024-01-08"
    },
    {
      id: 4,
      name: "Water Conservation Initiative",
      type: "Environmental Impact Assessment",
      status: "Published",
      questionsCount: 19,
      endDate: "2024-03-01",
      createdBy: "Neha Gupta",
      lastModified: "2024-01-14"
    },
    {
      id: 5,
      name: "Ethical Sourcing Standards",
      type: "Social Responsibility Audit",
      status: "Draft",
      questionsCount: 25,
      endDate: "2024-03-05",
      createdBy: "Arjun Patel",
      lastModified: "2024-01-16"
    },
    {
      id: 6,
      name: "Renewable Energy Adoption",
      type: "Green Energy Assessment",
      status: "Published",
      questionsCount: 17,
      endDate: "2024-03-10",
      createdBy: "Anjali Patel",
      lastModified: "2024-01-18"
    },
    {
      id: 7,
      name: "Waste Reduction Program",
      type: "Circular Economy Evaluation",
      status: "Draft",
      questionsCount: 21,
      endDate: "2024-03-15",
      createdBy: "Vikram Malhotra",
      lastModified: "2024-01-20"
    },
    {
      id: 8,
      name: "Supply Chain Transparency",
      type: "Traceability Assessment",
      status: "Published",
      questionsCount: 30,
      endDate: "2024-03-20",
      createdBy: "Meera Iyer",
      lastModified: "2024-01-22"
    }
  ];

  // Mock data for published surveys
  const publishedSurveys = createdSurveys.filter(survey => survey.status === "Published");

  // Mock data for vendor survey responses - updated with actual vendor names
  const vendorSurveyData = [
    {
      id: 1,
      vendorName: "ALMIGHTY MANPOWER & SECURITY SERVICES",
      surveyName: "ESG Compliance Survey 2024",
      shareDate: "2024-01-15",
      status: "Completed",
      completionDate: "2024-01-22",
      overallScore: 87,
      keyInsights: "Strong ESG governance, needs improvement in Scope 3 emissions"
    },
    {
      id: 2,
      vendorName: "ANGEL MANPOWER & SECURITY SERVICES",
      surveyName: "Carbon Footprint Assessment",
      shareDate: "2024-01-18",
      status: "In Progress",
      completionDate: null,
      overallScore: null,
      keyInsights: null
    },
    {
      id: 3,
      vendorName: "M/S ARADHAY SHREERAM PRIVATE LIMITED",
      surveyName: "Supplier Sustainability Audit",
      shareDate: "2024-01-20",
      status: "Completed",
      completionDate: "2024-01-25",
      overallScore: 92,
      keyInsights: "Excellent sustainability practices across all metrics"
    },
    {
      id: 4,
      vendorName: "SMVD GROUP SECURE SERVICES",
      surveyName: "ESG Compliance Survey 2024",
      shareDate: "2024-01-16",
      status: "Overdue",
      completionDate: null,
      overallScore: null,
      keyInsights: null
    },
    {
      id: 5,
      vendorName: "UNIQUE DESIGN AND CONSTRUCTIONS",
      surveyName: "Water Conservation Initiative",
      shareDate: "2024-01-20",
      status: "Completed",
      completionDate: "2024-01-27",
      overallScore: 78,
      keyInsights: "Good water management, but room for improvement in recycling"
    },
    {
      id: 6,
      vendorName: "JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR",
      surveyName: "Renewable Energy Adoption",
      shareDate: "2024-01-22",
      status: "In Progress",
      completionDate: null,
      overallScore: null,
      keyInsights: null
    },
    {
      id: 7,
      vendorName: "SHREE GOSAI ENTERPRISES",
      surveyName: "Ethical Sourcing Standards",
      shareDate: "2024-01-25",
      status: "Completed",
      completionDate: "2024-01-30",
      overallScore: 95,
      keyInsights: "Exceptional ethical standards and transparency"
    },
    {
      id: 8,
      vendorName: "PARAMOUNT SERVICES",
      surveyName: "Waste Reduction Program",
      shareDate: "2024-01-28",
      status: "Sent",
      completionDate: null,
      overallScore: null,
      keyInsights: null
    },
    {
      id: 9,
      vendorName: "M/s BOOSTUP INDIA SOLUTION",
      surveyName: "Carbon Footprint Assessment",
      shareDate: "2024-01-30",
      status: "Completed",
      completionDate: "2024-02-05",
      overallScore: 89,
      keyInsights: "Leading in renewable energy adoption"
    },
    {
      id: 10,
      vendorName: "SECURE SERVICES (M/S HARSH ENGINEERING WORKS)",
      surveyName: "Supply Chain Transparency",
      shareDate: "2024-02-01",
      status: "Overdue",
      completionDate: null,
      overallScore: null,
      keyInsights: null
    }
  ];

  // Mock vendor data for the share popup - using actual vendor names from VendorManagement
  const vendorList = [
    { id: 1, name: "ALMIGHTY MANPOWER & SECURITY SERVICES", email: "raj.sharma@almightymanpower.in" },
    { id: 2, name: "ANGEL MANPOWER & SECURITY SERVICES", email: "priya.gupta@angelmanpower.com" },
    { id: 3, name: "M/S ARADHAY SHREERAM PRIVATE LIMITED", email: "amit.patel@aradhayshreeram.com" },
    { id: 4, name: "SMVD GROUP SECURE SERVICES", email: "kavya.reddy@smvdgroup.co.in" },
    { id: 5, name: "UNIQUE DESIGN AND CONSTRUCTIONS", email: "arjun.singh@uniquedesign.in" },
    { id: 6, name: "JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR", email: "deepika.joshi@jeelifeconstruction.com" },
    { id: 7, name: "SHREE GOSAI ENTERPRISES", email: "vikram@shreegosai.in" },
    { id: 8, name: "PARAMOUNT SERVICES", email: "neha.sharma@paramountservices.com" },
    { id: 9, name: "M/s BOOSTUP INDIA SOLUTION", email: "manjeet@boostupindia.com" },
    { id: 10, name: "SECURE SERVICES (M/S HARSH ENGINEERING WORKS)", email: "madhu@secureservices.in" }
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Compliant":
        return "default";
      case "At-Risk":
        return "secondary";
      case "Incomplete":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Filter functions
  const filteredCreatedSurveys = createdSurveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVendorData = vendorSurveyData.filter(vendor => {
    const matchesSearch = vendor.vendorName.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
                         vendor.surveyName.toLowerCase().includes(vendorSearchTerm.toLowerCase());
    const matchesSurvey = selectedSurvey === "all" || vendor.surveyName === selectedSurvey;
    const matchesStatus = vendorStatusFilter === "all" || vendor.status === vendorStatusFilter;
    const matchesVendor = selectedVendorFilter === "all" || vendor.vendorName === selectedVendorFilter;
    return matchesSearch && matchesSurvey && matchesStatus && matchesVendor;
  });

  const handleCreateSurvey = () => {
    setIsCreateSurveyOpen(true);
  };

  const handleSurveyFormSubmit = () => {
    // Validate form data
    if (!surveyFormData.name || !surveyFormData.type || !surveyFormData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Close modal and navigate to question builder
    setIsCreateSurveyOpen(false);
    navigate("/sustainable-procurement/create-survey", { state: { surveyDetails: surveyFormData } });
  };

  const handleEditSurvey = (surveyId: number) => {
    const survey = createdSurveys.find(s => s.id === surveyId);
    if (survey) {
      setSelectedSurveyForEdit(survey);
      setIsEditSurveyOpen(true);
    }
  };

  const handleEditQuestionsBuilder = () => {
    setIsEditSurveyOpen(false);
    navigate("/create-survey", { 
      state: { 
        surveyDetails: {
          name: selectedSurveyForEdit?.name,
          type: selectedSurveyForEdit?.type,
          description: "Pre-filled survey for editing",
          instructions: "Edit the existing questions or add new ones",
          surveyFor: "vendor"
        },
        isEditing: true,
        existingQuestions: [
          {
            id: "1",
            type: "radio",
            text: "What percentage of your energy consumption comes from renewable sources?",
            options: ["0-25%", "26-50%", "51-75%", "76-100%"],
            score: 25,
            weight: 2,
            category: "Environmental"
          },
          {
            id: "2",
            type: "yesno",
            text: "Does your organization have a formal carbon reduction target?",
            options: ["Yes", "No"],
            score: 20,
            weight: 1,
            category: "Environmental"
          }
        ]
      }
    });
  };

  const handlePreviewSurvey = (surveyId: number) => {
    const survey = createdSurveys.find(s => s.id === surveyId);
    if (survey) {
      // Navigate to preview page instead of modal
      navigate('/survey-preview', { 
        state: { 
          questions: [
            {
              id: "1",
              type: "radio",
              text: "What percentage of your energy consumption comes from renewable sources?",
              options: ["0-25%", "26-50%", "51-75%", "76-100%"],
              score: 20,
              weight: 1,
              category: "Environmental"
            },
            {
              id: "2", 
              type: "checkbox",
              text: "Which sustainable practices does your organization implement?",
              options: ["Waste reduction programs", "Energy efficiency measures", "Sustainable sourcing", "Water conservation", "Carbon offsetting"],
              score: 25,
              weight: 1,
              category: "Environmental"
            },
            {
              id: "3",
              type: "input", 
              text: "How do you measure and report your environmental impact?",
              score: 15,
              weight: 1,
              category: "Environmental"
            },
            {
              id: "4",
              type: "textarea",
              text: "Describe your organization's commitment to social responsibility and community engagement.",
              score: 20,
              weight: 1,
              category: "Social"
            }
          ],
          surveyDetails: {
            name: survey.name,
            type: survey.type,
            description: "Sustainability assessment survey",
            instructions: "Please answer all questions honestly and provide detailed responses where applicable.",
            estimatedTime: "15-20 minutes",
            targetAudience: "Vendors and Suppliers"
          }
        } 
      });
    }
  };

  const handleViewScorecard = (vendorId: number) => {
    navigate(`/vendor-scorecard/${vendorId}`);
  };

  const handleViewProfile = (vendorId: number) => {
    navigate(`/vendor-profile/${vendorId}`);
  };

  const getVendorStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleShareSurvey = () => {
    setIsShareSurveyOpen(true);
  };

  const handleCopyLink = () => {
    const dummyLink = `https://surveys.yourcompany.com/sustainability/${selectedSurveyForShare}/${selectedVendorForShare}`;
    navigator.clipboard.writeText(dummyLink);
    toast({
      title: "Link Copied",
      description: "Survey link has been copied to clipboard",
    });
  };

  const handleSendSurvey = () => {
    if (!selectedSurveyForShare || !selectedVendorForShare) {
      toast({
        title: "Error",
        description: "Please select both survey and vendor",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Survey Shared",
      description: "Survey has been successfully shared with the vendor",
    });
    setIsShareSurveyOpen(false);
    setSelectedSurveyForShare("");
    setSelectedVendorForShare("");
    setVendorSearchInPopup("");
  };

  const getSelectedSurveyDetails = () => {
    return publishedSurveys.find(s => s.name === selectedSurveyForShare);
  };

  const getSelectedVendorDetails = () => {
    return vendorList.find(v => v.id.toString() === selectedVendorForShare);
  };

  const filteredVendorsInPopup = vendorList.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearchInPopup.toLowerCase())
  );

  const handleApplyFilters = () => {
    setIsFilterPopupOpen(false);
    toast({
      title: "Filters Applied",
      description: "Vendor data has been filtered successfully",
    });
  };

  const handleRemoveFilters = () => {
    setSelectedSurvey("all");
    setVendorStatusFilter("all");
    setSelectedVendorFilter("all");
    setIsFilterPopupOpen(false);
    toast({
      title: "Filters Removed",
      description: "All filters have been cleared",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sustainable Procurement Evaluation</h1>
            <p className="text-muted-foreground">Create and manage sustainability surveys for your supply chain</p>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create-survey" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Create Survey
            </TabsTrigger>
            <TabsTrigger value="share-survey" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Survey
            </TabsTrigger>
          </TabsList>

          {/* Create Survey Tab */}
          <TabsContent value="create-survey" className="space-y-6">
            {/* KPI Cards for Create Survey */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
              {createSurveyKPIs.map((kpi, index) => (
                <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                  <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                        {kpi.title}
                      </CardTitle>
                      <div className="text-2xl font-bold text-gray-900 tracking-tight">
                        {kpi.value}
                      </div>
                    </div>
                    <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <kpi.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative pt-0 px-6 pb-6">
                    <p className="text-xs text-gray-600 font-medium">
                      {kpi.change}
                    </p>
                  </CardContent>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </Card>
              ))}
            </div>


            {/* Created Surveys List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    All Created Surveys
                  </CardTitle>
                  <Button onClick={handleCreateSurvey} className="bg-red-accent hover:bg-red-muted text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Survey
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters for Created Surveys */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search surveys..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Created Surveys Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Survey Name</TableHead>
                        <TableHead>Survey Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCreatedSurveys.map((survey) => (
                        <TableRow key={survey.id}>
                          <TableCell className="font-medium">{survey.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{survey.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={survey.status === "Published" ? "default" : "secondary"}>
                              {survey.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{survey.questionsCount}</TableCell>
                          <TableCell>{survey.endDate}</TableCell>
                          <TableCell>{survey.createdBy}</TableCell>
                          <TableCell>{survey.lastModified}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditSurvey(survey.id)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePreviewSurvey(survey.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Share Survey Tab */}
          <TabsContent value="share-survey" className="space-y-6">
            {/* KPI Cards for Share Survey */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
              {shareSurveyKPIs.map((kpi, index) => (
                <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                  <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                        {kpi.title}
                      </CardTitle>
                      <div className="text-2xl font-bold text-gray-900 tracking-tight">
                        {kpi.value}
                      </div>
                    </div>
                    <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <kpi.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative pt-0 px-6 pb-6">
                    <p className="text-xs text-gray-600 font-medium">
                      {kpi.change}
                    </p>
                  </CardContent>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </Card>
              ))}
            </div>


            {/* Vendor Survey Status & Score List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Vendor Responses {selectedSurvey !== "all" && `for ${selectedSurvey}`}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Track vendor survey responses and scores
                    </p>
                  </div>
                  <Button onClick={handleShareSurvey} className="bg-red-accent hover:bg-red-muted text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Survey
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters for Vendor Data */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search vendors..."
                      value={vendorSearchTerm}
                      onChange={(e) => setVendorSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFilterPopupOpen(true)}
                    className="w-[180px] justify-start"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Vendor Survey Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Survey Name</TableHead>
                        <TableHead>Share Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Overall Score</TableHead>
                        <TableHead>Key Insights</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendorData.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium cursor-pointer text-primary hover:underline">
                            {vendor.vendorName}
                          </TableCell>
                          <TableCell>{vendor.surveyName}</TableCell>
                          <TableCell>{vendor.shareDate}</TableCell>
                          <TableCell>
                            <Badge variant={getVendorStatusBadgeVariant(vendor.status)}>
                              {vendor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{vendor.completionDate || "-"}</TableCell>
                          <TableCell>
                            {vendor.overallScore ? (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{vendor.overallScore}%</span>
                                <div className="w-16 h-2 bg-muted rounded-full">
                                  <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{ width: `${vendor.overallScore}%` }}
                                  />
                                </div>
                              </div>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {vendor.keyInsights || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewScorecard(vendor.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Scorecard
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewProfile(vendor.id)}
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Profile
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Survey Modal */}
        <Dialog open={isCreateSurveyOpen} onOpenChange={setIsCreateSurveyOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                New Survey Details
              </DialogTitle>
              <p className="text-muted-foreground">
                Enter the basic information for your sustainability survey
              </p>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="survey-name">Survey Name *</Label>
                  <Input
                    id="survey-name"
                    placeholder="Enter survey name..."
                    value={surveyFormData.name}
                    onChange={(e) => setSurveyFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="survey-type">Survey Type *</Label>
                  <Select 
                    value={surveyFormData.type} 
                    onValueChange={(value) => setSurveyFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select survey type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GPP Compliance Assessment">GPP Compliance Assessment</SelectItem>
                      <SelectItem value="Environmental Impact Readiness Survey">Environmental Impact Readiness Survey</SelectItem>
                      <SelectItem value="Sustainable Product/Service Offering Survey">Sustainable Product/Service Offering Survey</SelectItem>
                      <SelectItem value="Circular Economy Practices Assessment">Circular Economy Practices Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="survey-description">Survey Description *</Label>
                <Textarea
                  id="survey-description"
                  placeholder="Describe the purpose and scope of this survey..."
                  value={surveyFormData.description}
                  onChange={(e) => setSurveyFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="survey-instructions">Survey Instructions</Label>
                <Textarea
                  id="survey-instructions"
                  placeholder="Instructions for survey respondents..."
                  value={surveyFormData.instructions}
                  onChange={(e) => setSurveyFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="survey-for">Survey For</Label>
                  <Select 
                    value={surveyFormData.surveyFor} 
                    onValueChange={(value) => setSurveyFormData(prev => ({ ...prev, surveyFor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Existing Vendors">Existing Vendors</SelectItem>
                      <SelectItem value="Potential Vendors">Potential Vendors</SelectItem>
                      <SelectItem value="Internal Teams">Internal Teams</SelectItem>
                      <SelectItem value="Upstream Suppliers">Upstream Suppliers</SelectItem>
                      <SelectItem value="Downstream Partners">Downstream Partners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !surveyFormData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {surveyFormData.startDate ? format(surveyFormData.startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={surveyFormData.startDate}
                        onSelect={(date) => setSurveyFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !surveyFormData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {surveyFormData.endDate ? format(surveyFormData.endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={surveyFormData.endDate}
                        onSelect={(date) => setSurveyFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateSurveyOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSurveyFormSubmit}
                className="bg-red-accent hover:bg-red-muted text-white"
              >
                Save & Continue to Questions Builder
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Survey Modal */}
        <Dialog open={isShareSurveyOpen} onOpenChange={setIsShareSurveyOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Survey with Vendor
              </DialogTitle>
              <p className="text-muted-foreground">
                Select a survey and vendor to share sustainability evaluation
              </p>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Survey Selection */}
              <div className="space-y-2">
                <Label htmlFor="survey-select">Select Survey *</Label>
                <Select 
                  value={selectedSurveyForShare} 
                  onValueChange={setSelectedSurveyForShare}
                >
                  <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-red-accent">
                    <SelectValue placeholder="Choose a published survey..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {publishedSurveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.name} className="hover:bg-gray-50">
                        {survey.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Survey Details */}
              {selectedSurveyForShare && getSelectedSurveyDetails() && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Survey Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-600">{getSelectedSurveyDetails()?.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 text-gray-600">{getSelectedSurveyDetails()?.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Questions:</span>
                      <span className="ml-2 text-gray-600">{getSelectedSurveyDetails()?.questionsCount} questions</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <span className="ml-2 text-gray-600">Comprehensive sustainability evaluation covering environmental, social, and governance aspects.</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Instructions:</span>
                      <span className="ml-2 text-gray-600">Please complete all sections honestly and provide supporting documentation where requested.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Selection */}
              <div className="space-y-2">
                <Label htmlFor="vendor-select">Select Vendor/Supplier *</Label>
                
                {/* Vendor Dropdown with internal search */}
                <Popover open={vendorPopoverOpen} onOpenChange={setVendorPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={vendorPopoverOpen}
                      className="w-full justify-between bg-white border-gray-200 hover:border-gray-300 focus:border-red-accent"
                    >
                      {selectedVendorForShare
                        ? vendorList.find((vendor) => vendor.id.toString() === selectedVendorForShare)?.name
                        : "Choose a vendor/supplier"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                    <Command>
                      <CommandInput placeholder="Search vendors..." />
                      <CommandList>
                        <CommandEmpty>No vendor found.</CommandEmpty>
                        <CommandGroup>
                          {vendorList.map((vendor) => (
                            <CommandItem
                              key={vendor.id}
                              value={vendor.name}
                              onSelect={() => {
                                setSelectedVendorForShare(vendor.id.toString() === selectedVendorForShare ? "" : vendor.id.toString())
                                setVendorPopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedVendorForShare === vendor.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{vendor.name}</span>
                                <span className="text-xs text-gray-500">{vendor.email}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Survey Link Section */}
              {selectedSurveyForShare && selectedVendorForShare && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Survey Link Ready
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Survey Link:</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={`https://surveys.yourcompany.com/sustainability/${selectedSurveyForShare}/${selectedVendorForShare}`}
                          readOnly
                          className="bg-white text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyLink}
                          className="shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Label className="text-sm font-medium text-gray-700">Share with:</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {getSelectedVendorDetails()?.name} ({getSelectedVendorDetails()?.email})
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsShareSurveyOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendSurvey}
                disabled={!selectedSurveyForShare || !selectedVendorForShare}
                className="bg-red-accent hover:bg-red-muted text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Share Survey
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filter Popup Modal */}
        <Dialog open={isFilterPopupOpen} onOpenChange={setIsFilterPopupOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Options
              </DialogTitle>
              <p className="text-muted-foreground">
                Apply filters to refine vendor survey data
              </p>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Survey Filter */}
              <div className="space-y-2">
                <Label>Select Survey</Label>
                <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                  <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-red-accent">
                    <SelectValue placeholder="Select survey..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Surveys</SelectItem>
                    {publishedSurveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.name}>
                        {survey.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Filter by Status</Label>
                <Select value={vendorStatusFilter} onValueChange={setVendorStatusFilter}>
                  <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-red-accent">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vendor Filter */}
              <div className="space-y-2">
                <Label>Select Vendor</Label>
                <Select value={selectedVendorFilter} onValueChange={setSelectedVendorFilter}>
                  <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-red-accent">
                    <SelectValue placeholder="Select vendor..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendorList.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between space-x-2 pt-4">
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFilterPopupOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleRemoveFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove Filters
                </Button>
              </div>
              <Button 
                onClick={handleApplyFilters}
                className="bg-red-accent hover:bg-red-muted text-white"
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Survey Modal */}
        <Dialog open={isEditSurveyOpen} onOpenChange={setIsEditSurveyOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Survey - {selectedSurveyForEdit?.name}
              </DialogTitle>
              <p className="text-muted-foreground">
                Review and modify survey details before editing questions
              </p>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Survey Name</Label>
                  <Input
                    value={selectedSurveyForEdit?.name || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Survey Type</Label>
                  <Input
                    value={selectedSurveyForEdit?.type || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge variant={selectedSurveyForEdit?.status === "Published" ? "default" : "secondary"}>
                  {selectedSurveyForEdit?.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Questions Count</Label>
                  <Input
                    value={selectedSurveyForEdit?.questionsCount || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={selectedSurveyForEdit?.endDate || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Modified</Label>
                  <Input
                    value={selectedSurveyForEdit?.lastModified || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditSurveyOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditQuestionsBuilder}
                className="bg-red-accent hover:bg-red-muted text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Questions Builder
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview functionality moved to separate page */}
      </div>
    </DashboardLayout>
  );
};

export default SustainableProcurement;