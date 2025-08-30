import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MinimalTabs, MinimalTabsContent, MinimalTabsList, MinimalTabsTrigger } from "@/components/ui/minimal-tabs";
import { Brain, Settings, BarChart3, Plus, Edit, Power, PowerOff, Download, Filter, FileText, MessageSquare, GitBranch, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Operator {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive';
  lastModified: string;
  category: string;
  subCategory: string;
  agent: string;
  constraints: string;
  accuracy: number;
  responseTime: number;
  correctionRate: number;
  cost: number;
}

const mockOperators: Operator[] = [
  {
    id: '1',
    name: 'Financial Data Extractor',
    description: 'Extracts financial data from procurement documents',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-15',
    category: 'Data Extraction',
    subCategory: 'Financial Statements',
    agent: 'RFP Analysis Bot',
    constraints: 'Max 2000 tokens, Must cite sources',
    accuracy: 94.2,
    responseTime: 1.8,
    correctionRate: 5.8,
    cost: 0.045
  },
  {
    id: '2',
    name: 'Legal Clause Drafter',
    description: 'Drafts legal clauses for contracts and agreements',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-14',
    category: 'Content Generation',
    subCategory: 'Contract Drafting',
    agent: 'Legal Assistant Bot',
    constraints: 'Formal language, 500-1500 words',
    accuracy: 89.7,
    responseTime: 3.2,
    correctionRate: 10.3,
    cost: 0.078
  },
  {
    id: '3',
    name: 'Compliance Checker',
    description: 'Verifies regulatory compliance in vendor documents',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'inactive',
    lastModified: '2024-01-13',
    category: 'Compliance Check',
    subCategory: 'Regulatory Adherence',
    agent: 'Compliance Validator',
    constraints: 'Binary output, Response time < 2s',
    accuracy: 96.8,
    responseTime: 1.2,
    correctionRate: 3.2,
    cost: 0.023
  },
  {
    id: '4',
    name: 'Technical Evaluator',
    description: 'Evaluates technical specifications in vendor proposals',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-12',
    category: 'Data Extraction',
    subCategory: 'Technical Analysis',
    agent: 'Technical Review Bot',
    constraints: 'Technical language, Detailed analysis',
    accuracy: 91.5,
    responseTime: 2.5,
    correctionRate: 8.5,
    cost: 0.062
  },
  {
    id: '5',
    name: 'Cost Analyzer',
    description: 'Analyzes cost structures and pricing models',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-11',
    category: 'Data Extraction',
    subCategory: 'Financial Analysis',
    agent: 'Cost Analysis Bot',
    constraints: 'Numerical focus, Currency format',
    accuracy: 93.8,
    responseTime: 1.9,
    correctionRate: 6.2,
    cost: 0.041
  },
  {
    id: '6',
    name: 'Document Classifier',
    description: 'Classifies and categorizes incoming documents',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-10',
    category: 'Content Generation',
    subCategory: 'Document Classification',
    agent: 'Classification Bot',
    constraints: 'Predefined categories, Fast processing',
    accuracy: 97.1,
    responseTime: 0.8,
    correctionRate: 2.9,
    cost: 0.018
  },
  {
    id: '7',
    name: 'Risk Assessment Agent',
    description: 'Assesses risk factors in vendor proposals',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-09',
    category: 'Compliance Check',
    subCategory: 'Risk Analysis',
    agent: 'Risk Assessment Bot',
    constraints: 'Risk scoring, Detailed reporting',
    accuracy: 88.6,
    responseTime: 3.8,
    correctionRate: 11.4,
    cost: 0.089
  },
  {
    id: '8',
    name: 'Quality Checker',
    description: 'Checks document quality and completeness',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'inactive',
    lastModified: '2024-01-08',
    category: 'Compliance Check',
    subCategory: 'Quality Assurance',
    agent: 'Quality Control Bot',
    constraints: 'Checklist validation, Binary output',
    accuracy: 95.3,
    responseTime: 1.5,
    correctionRate: 4.7,
    cost: 0.032
  },
  {
    id: '9',
    name: 'Summary Generator',
    description: 'Generates executive summaries of proposals',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-07',
    category: 'Content Generation',
    subCategory: 'Summary Creation',
    agent: 'Summary Bot',
    constraints: 'Concise format, Key points only',
    accuracy: 92.4,
    responseTime: 2.1,
    correctionRate: 7.6,
    cost: 0.054
  },
  {
    id: '10',
    name: 'Vendor Profile Builder',
    description: 'Creates comprehensive vendor profiles from documents',
    model: 'AI Model - Advanced v2024.1.15',
    status: 'active',
    lastModified: '2024-01-06',
    category: 'Content Generation',
    subCategory: 'Profile Generation',
    agent: 'Profile Builder Bot',
    constraints: 'Structured format, Complete profiles',
    accuracy: 90.1,
    responseTime: 4.2,
    correctionRate: 9.9,
    cost: 0.096
  }
];

export const OperatorManagement = () => {
  const [operators, setOperators] = useState<Operator[]>(mockOperators);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const { toast } = useToast();

  const handleStatusToggle = (operatorId: string) => {
    setOperators(prev => prev.map(op => 
      op.id === operatorId 
        ? { ...op, status: op.status === 'active' ? 'inactive' : 'active' }
        : op
    ));
    toast({
      title: "Status Updated",
      description: "Operator status has been updated successfully.",
    });
  };

  const handleEdit = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsConfigDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedOperator(null);
    setIsConfigDialogOpen(true);
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Performance report is being generated...",
    });
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (startDate && date) {
      setIsLoadingAnalytics(true);
      // Simulate loading delay
      setTimeout(() => {
        setShowAnalytics(true);
        setIsLoadingAnalytics(false);
        toast({
          title: "Analytics Updated",
          description: `Showing data from ${format(startDate, "PPP")} to ${format(date, "PPP")}`,
        });
      }, 1500);
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (endDate && date) {
      setIsLoadingAnalytics(true);
      // Simulate loading delay
      setTimeout(() => {
        setShowAnalytics(true);
        setIsLoadingAnalytics(false);
        toast({
          title: "Analytics Updated",
          description: `Showing data from ${format(date, "PPP")} to ${format(endDate, "PPP")}`,
        });
      }, 1500);
    }
  };

  // Analytics Data
  const performanceData = [
    { month: 'Jan', accuracy: 88, responseTime: 2.1, cost: 0.051 },
    { month: 'Feb', accuracy: 91, responseTime: 1.9, cost: 0.048 },
    { month: 'Mar', accuracy: 93, responseTime: 1.8, cost: 0.045 },
    { month: 'Apr', accuracy: 92, responseTime: 2.0, cost: 0.049 },
    { month: 'May', accuracy: 94, responseTime: 1.7, cost: 0.042 },
    { month: 'Jun', accuracy: 96, responseTime: 1.6, cost: 0.041 }
  ];

  const operatorUsageData = [
    { name: 'Financial Data Extractor', value: 25, fill: '#000000' },
    { name: 'Legal Clause Drafter', value: 20, fill: '#404040' },
    { name: 'Compliance Checker', value: 15, fill: '#666666' },
    { name: 'Technical Evaluator', value: 18, fill: '#888888' },
    { name: 'Cost Analyzer', value: 12, fill: '#aaaaaa' },
    { name: 'Others', value: 10, fill: '#cccccc' }
  ];

  const dailyProcessingData = [
    { day: 'Mon', processed: 245, errors: 12 },
    { day: 'Tue', processed: 278, errors: 8 },
    { day: 'Wed', processed: 289, errors: 15 },
    { day: 'Thu', processed: 312, errors: 7 },
    { day: 'Fri', processed: 298, errors: 10 },
    { day: 'Sat', processed: 156, errors: 5 },
    { day: 'Sun', processed: 123, errors: 3 }
  ];

  const chartConfig = {
    accuracy: {
      label: "Accuracy %",
      color: "#000000",
    },
    responseTime: {
      label: "Response Time (s)",
      color: "#666666",
    },
    cost: {
      label: "Cost ($)",
      color: "#000000",
    },
    processed: {
      label: "Processed",
      color: "#000000",
    },
    errors: {
      label: "Errors",
      color: "#666666",
    },
  };

  // KPI Cards Data
  const kpiData = [
    {
      title: "Total Operators",
      value: operators.length.toString(),
      subtitle: "+2 new this month",
      icon: Brain,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-red-accent/10 to-red-accent/20",
      iconBg: "bg-red-accent"
    },
    {
      title: "Active Operators",
      value: operators.filter(op => op.status === 'active').length.toString(),
      subtitle: "85% uptime",
      icon: Power,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Avg Accuracy",
      value: `${(operators.reduce((acc, op) => acc + op.accuracy, 0) / operators.length).toFixed(1)}%`,
      subtitle: "+2.3% vs last month",
      icon: BarChart3,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-red-accent/10 to-red-accent/20",
      iconBg: "bg-red-accent"
    },
    {
      title: "Avg Cost/Operation",
      value: `$${(operators.reduce((acc, op) => acc + op.cost, 0) / operators.length).toFixed(3)}`,
      subtitle: "-5% cost reduction",
      icon: Settings,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-[10px]">
        {/* Header */}
        <div className="mb-[10px]">
          <h1 className="font-bold text-gray-900 mb-2 text-2xl">Operator Management</h1>
          <p className="text-gray-600">Configure, evaluate, and manage AI operators and their performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
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
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                
                <CardContent className="relative pt-0 px-6 pb-6">
                  <p className="text-xs text-gray-600 font-medium">
                    {kpi.subtitle}
                  </p>
                </CardContent>
                
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </Card>
            );
          })}
        </div>

        {/* Add New Operator Button */}
        <div className="flex justify-end mb-[10px]">
          <Button onClick={handleAddNew} className="flex items-center gap-2 bg-red-accent hover:bg-red-muted text-white">
            <Plus size={16} />
            Add New Operator
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <MinimalTabs defaultValue="overview" className="p-6">
            <MinimalTabsList className="bg-white rounded-[15px] border border-gray-200 p-1">
              <MinimalTabsTrigger value="overview" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
                <Brain size={16} />
                Operator Overview
              </MinimalTabsTrigger>
              <MinimalTabsTrigger value="performance" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
                <BarChart3 size={16} />
                Performance Metrics
              </MinimalTabsTrigger>
              <MinimalTabsTrigger value="reports" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
                <FileText size={16} />
                Reports & Analytics
              </MinimalTabsTrigger>
            </MinimalTabsList>

            {/* Operator Overview Tab */}
            <MinimalTabsContent value="overview" className="space-y-6 mt-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Brain className="h-5 w-5 text-red-accent" />
                    Configured Operators
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage all AI operators and their configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Operator Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {operators.map((operator) => (
                        <TableRow key={operator.id}>
                          <TableCell className="font-medium">{operator.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{operator.description}</TableCell>
                          <TableCell>{operator.model}</TableCell>
                          <TableCell>{operator.category}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={operator.status === 'active' ? 'default' : 'secondary'}
                              className={operator.status === 'active' ? 'bg-red-accent hover:bg-red-muted' : ''}
                            >
                              {operator.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{operator.lastModified}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(operator)}
                                className="border-red-accent/20 text-red-accent hover:bg-red-accent/10"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusToggle(operator.id)}
                                className="border-gray-300 hover:bg-gray-100"
                              >
                                {operator.status === 'active' ? <PowerOff size={14} /> : <Power size={14} />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </MinimalTabsContent>

            {/* Performance Metrics Tab */}
            <MinimalTabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {operators.filter(op => op.status === 'active').map((operator) => (
                  <Card key={operator.id} className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">{operator.name}</CardTitle>
                      <CardDescription className="text-gray-600">{operator.category} - {operator.subCategory}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Accuracy Rate</Label>
                          <p className="text-xl font-semibold text-red-accent">{operator.accuracy}%</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Avg Response Time</Label>
                          <p className="text-xl font-semibold text-black">{operator.responseTime}s</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Correction Rate</Label>
                          <p className="text-xl font-semibold text-red-accent">{operator.correctionRate}%</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Cost/Operation</Label>
                          <p className="text-xl font-semibold text-black">${operator.cost}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </MinimalTabsContent>

            {/* Reports Tab */}
            <MinimalTabsContent value="reports" className="space-y-6 mt-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-red-accent" />
                      Performance Reports & Analytics
                    </span>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "border-red-accent/20 text-red-accent hover:bg-red-accent/10",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar size={14} className="mr-2" />
                            {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={startDate}
                            onSelect={handleStartDateSelect}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "border-red-accent/20 text-red-accent hover:bg-red-accent/10",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar size={14} className="mr-2" />
                            {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={endDate}
                            onSelect={handleEndDateSelect}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button onClick={handleExportReport} size="sm" className="bg-red-accent hover:bg-red-muted text-white">
                        <Download size={14} className="mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showAnalytics && !isLoadingAnalytics ? (
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-red-accent" />
                      <p className="text-lg font-medium mb-2">Select Start and End Dates to View Analytics</p>
                      <p className="text-sm">Choose both start and end dates using the buttons above to view detailed performance metrics and charts</p>
                    </div>
                  ) : isLoadingAnalytics ? (
                    <div className="space-y-8">
                      {/* Loading Skeleton */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-gray-200">
                          <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                          </CardContent>
                        </Card>
                        <Card className="border-gray-200">
                          <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-gray-200">
                          <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                          </CardContent>
                        </Card>
                        <Card className="border-gray-200">
                          <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <Card key={i} className="border-gray-200">
                            <CardContent className="p-4">
                              <div className="text-center space-y-2">
                                <Skeleton className="h-4 w-20 mx-auto" />
                                <Skeleton className="h-8 w-16 mx-auto" />
                                <Skeleton className="h-3 w-24 mx-auto" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Performance Trends */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-lg text-gray-900">Performance Trends</CardTitle>
                            <CardDescription>Monthly accuracy and response time trends</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Line type="monotone" dataKey="accuracy" stroke="#000000" strokeWidth={3} dot={{ fill: "#000000", strokeWidth: 2, r: 4 }} />
                                <Line type="monotone" dataKey="responseTime" stroke="#666666" strokeWidth={3} dot={{ fill: "#666666", strokeWidth: 2, r: 4 }} />
                              </LineChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-lg text-gray-900">Operator Usage Distribution</CardTitle>
                            <CardDescription>Usage percentage by operator type</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <PieChart>
                                <Pie
                                  data={operatorUsageData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={2}
                                  dataKey="value"
                                >
                                  {operatorUsageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                              </PieChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Daily Processing & Cost Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-lg text-gray-900">Daily Processing Volume</CardTitle>
                            <CardDescription>Documents processed vs errors by day</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <BarChart data={dailyProcessingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="day" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="processed" fill="#000000" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="errors" fill="#666666" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-lg text-gray-900">Cost Analysis</CardTitle>
                            <CardDescription>Monthly cost trends and optimization</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <AreaChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Area 
                                  type="monotone" 
                                  dataKey="cost" 
                                  stroke="#000000" 
                                  fill="#000000" 
                                  fillOpacity={0.1}
                                  strokeWidth={3}
                                />
                              </AreaChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Summary Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-gray-200 bg-gradient-to-br from-red-accent/10 to-red-accent/20">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Total Operations</p>
                              <p className="text-2xl font-bold text-red-accent">2,847</p>
                              <p className="text-xs text-gray-500">+12% vs last period</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Avg Accuracy</p>
                              <p className="text-2xl font-bold text-black">92.8%</p>
                              <p className="text-xs text-gray-500">+3.2% vs last period</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-gray-200 bg-gradient-to-br from-red-accent/10 to-red-accent/20">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                              <p className="text-2xl font-bold text-red-accent">$129.45</p>
                              <p className="text-xs text-gray-500">-8% vs last period</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Error Rate</p>
                              <p className="text-2xl font-bold text-black">2.1%</p>
                              <p className="text-xs text-gray-500">-1.5% vs last period</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MinimalTabsContent>
          </MinimalTabs>
        </div>

        {/* Operator Configuration Dialog */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedOperator ? `Configure: ${selectedOperator.name}` : 'Add New Operator'}
              </DialogTitle>
              <DialogDescription>
                Define parameters and evaluation criteria for the AI operator
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input id="label" placeholder="e.g., Financial Data Extractor" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data-extraction">Data Extraction</SelectItem>
                      <SelectItem value="content-generation">Content Generation</SelectItem>
                      <SelectItem value="compliance-check">Compliance Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Sub-Category</Label>
                  <Input id="subcategory" placeholder="e.g., Financial Statements" />
                </div>
                <div>
                  <Label htmlFor="agent">Agent</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfp-analysis">RFP Analysis Bot</SelectItem>
                      <SelectItem value="legal-assistant">Legal Assistant Bot</SelectItem>
                      <SelectItem value="compliance-validator">Compliance Validator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advanced-2024">AI Model - Advanced v2024.1.15</SelectItem>
                      <SelectItem value="standard-2024">AI Model - Standard v2024.1.10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="constraints">Constraints</Label>
                  <Textarea id="constraints" placeholder="e.g., Max Token Length, Response Time Limit" />
                </div>
                <div>
                  <Label htmlFor="objective">Objective</Label>
                  <Textarea id="objective" placeholder="What the AI should aim to achieve" />
                </div>
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="verbose">Verbose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="empathetic">Empathetic</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience">Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procurement-head">Procurement Head</SelectItem>
                      <SelectItem value="legal-team">Legal Team</SelectItem>
                      <SelectItem value="technical-reviewer">Technical Reviewer</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">Response Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="bullets">Bulleted List</SelectItem>
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      <SelectItem value="table">Table</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setIsConfigDialogOpen(false);
                  toast({
                    title: "Configuration Saved",
                    description: "Operator configuration has been saved successfully.",
                  });
                }} 
                className="bg-red-accent hover:bg-red-muted text-white"
              >
                Save Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};