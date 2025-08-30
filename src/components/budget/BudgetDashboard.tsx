import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Filter, Download, Eye, Edit, IndianRupee, TrendingUp, AlertTriangle, Calendar, ChevronRight } from "lucide-react";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { BudgetDetailsModal } from "./BudgetDetailsModal";
interface BudgetDashboardProps {
  onCreateBudget: () => void;
  onEditBudget: (budgetId: string) => void;
  onViewMatching: () => void;
  onViewApprovals: () => void;
}
const BudgetDashboard = ({
  onCreateBudget,
  onEditBudget,
  onViewMatching,
  onViewApprovals
}: BudgetDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [timePeriod, setTimePeriod] = useState("current-month");
  const [selectedBudgetForModal, setSelectedBudgetForModal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extended mock data for 50+ budgets
  const budgets = [{
    id: "1",
    name: "Cloud Infrastructure Program",
    owner: "IT Department",
    totalBudget: 1000000,
    committed: 750000,
    actual: 600000,
    available: 250000,
    variance: -150000,
    program: "Technology",
    department: "IT"
  }, {
    id: "2",
    name: "Marketing Campaign Q1",
    owner: "Marketing Team",
    totalBudget: 500000,
    committed: 300000,
    actual: 280000,
    available: 200000,
    variance: -20000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "3",
    name: "Office Renovation",
    owner: "Facilities",
    totalBudget: 200000,
    committed: 180000,
    actual: 120000,
    available: 20000,
    variance: -60000,
    program: "Operations",
    department: "Facilities"
  }, {
    id: "4",
    name: "Data Analytics Platform",
    owner: "IT Department",
    totalBudget: 800000,
    committed: 600000,
    actual: 520000,
    available: 200000,
    variance: -80000,
    program: "Technology",
    department: "IT"
  }, {
    id: "5",
    name: "Social Media Advertising",
    owner: "Marketing Team",
    totalBudget: 350000,
    committed: 280000,
    actual: 245000,
    available: 70000,
    variance: -35000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "6",
    name: "Employee Training Program",
    owner: "HR Department",
    totalBudget: 150000,
    committed: 120000,
    actual: 95000,
    available: 30000,
    variance: -25000,
    program: "Operations",
    department: "HR"
  }, {
    id: "7",
    name: "Security Enhancement",
    owner: "IT Department",
    totalBudget: 600000,
    committed: 480000,
    actual: 420000,
    available: 120000,
    variance: -60000,
    program: "Technology",
    department: "IT"
  }, {
    id: "8",
    name: "Content Creation Initiative",
    owner: "Marketing Team",
    totalBudget: 250000,
    committed: 180000,
    actual: 165000,
    available: 70000,
    variance: -15000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "9",
    name: "Equipment Maintenance",
    owner: "Operations",
    totalBudget: 180000,
    committed: 150000,
    actual: 135000,
    available: 30000,
    variance: -15000,
    program: "Operations",
    department: "Operations"
  }, {
    id: "10",
    name: "Mobile App Development",
    owner: "IT Department",
    totalBudget: 700000,
    committed: 560000,
    actual: 480000,
    available: 140000,
    variance: -80000,
    program: "Technology",
    department: "IT"
  }, {
    id: "11",
    name: "Brand Awareness Campaign",
    owner: "Marketing Team",
    totalBudget: 450000,
    committed: 350000,
    actual: 320000,
    available: 100000,
    variance: -30000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "12",
    name: "Network Upgrade Project",
    owner: "IT Department",
    totalBudget: 550000,
    committed: 420000,
    actual: 380000,
    available: 130000,
    variance: -40000,
    program: "Technology",
    department: "IT"
  }, {
    id: "13",
    name: "Customer Support Enhancement",
    owner: "Customer Service",
    totalBudget: 300000,
    committed: 240000,
    actual: 215000,
    available: 60000,
    variance: -25000,
    program: "Operations",
    department: "Customer Service"
  }, {
    id: "14",
    name: "Research & Development",
    owner: "R&D Department",
    totalBudget: 900000,
    committed: 720000,
    actual: 650000,
    available: 180000,
    variance: -70000,
    program: "Technology",
    department: "R&D"
  }, {
    id: "15",
    name: "Event Management Q2",
    owner: "Marketing Team",
    totalBudget: 280000,
    committed: 220000,
    actual: 190000,
    available: 60000,
    variance: -30000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "16",
    name: "Facility Expansion",
    owner: "Facilities",
    totalBudget: 1200000,
    committed: 950000,
    actual: 850000,
    available: 250000,
    variance: -100000,
    program: "Operations",
    department: "Facilities"
  }, {
    id: "17",
    name: "Software License Renewal",
    owner: "IT Department",
    totalBudget: 400000,
    committed: 380000,
    actual: 380000,
    available: 20000,
    variance: 0,
    program: "Technology",
    department: "IT"
  }, {
    id: "18",
    name: "Digital Marketing Tools",
    owner: "Marketing Team",
    totalBudget: 180000,
    committed: 140000,
    actual: 125000,
    available: 40000,
    variance: -15000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "19",
    name: "Quality Assurance Program",
    owner: "QA Department",
    totalBudget: 220000,
    committed: 180000,
    actual: 165000,
    available: 40000,
    variance: -15000,
    program: "Operations",
    department: "QA"
  }, {
    id: "20",
    name: "Cybersecurity Training",
    owner: "IT Department",
    totalBudget: 150000,
    committed: 120000,
    actual: 105000,
    available: 30000,
    variance: -15000,
    program: "Technology",
    department: "IT"
  }, {
    id: "21",
    name: "Influencer Partnership",
    owner: "Marketing Team",
    totalBudget: 320000,
    committed: 250000,
    actual: 230000,
    available: 70000,
    variance: -20000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "22",
    name: "Database Migration",
    owner: "IT Department",
    totalBudget: 480000,
    committed: 380000,
    actual: 340000,
    available: 100000,
    variance: -40000,
    program: "Technology",
    department: "IT"
  }, {
    id: "23",
    name: "Wellness Program",
    owner: "HR Department",
    totalBudget: 120000,
    committed: 95000,
    actual: 85000,
    available: 25000,
    variance: -10000,
    program: "Operations",
    department: "HR"
  }, {
    id: "24",
    name: "Product Launch Campaign",
    owner: "Marketing Team",
    totalBudget: 600000,
    committed: 480000,
    actual: 440000,
    available: 120000,
    variance: -40000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "25",
    name: "Backup & Recovery System",
    owner: "IT Department",
    totalBudget: 350000,
    committed: 280000,
    actual: 250000,
    available: 70000,
    variance: -30000,
    program: "Technology",
    department: "IT"
  }, {
    id: "26",
    name: "Customer Feedback System",
    owner: "Customer Service",
    totalBudget: 200000,
    committed: 160000,
    actual: 145000,
    available: 40000,
    variance: -15000,
    program: "Operations",
    department: "Customer Service"
  }, {
    id: "27",
    name: "AI Implementation Project",
    owner: "IT Department",
    totalBudget: 950000,
    committed: 760000,
    actual: 680000,
    available: 190000,
    variance: -80000,
    program: "Technology",
    department: "IT"
  }, {
    id: "28",
    name: "Trade Show Participation",
    owner: "Marketing Team",
    totalBudget: 380000,
    committed: 300000,
    actual: 275000,
    available: 80000,
    variance: -25000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "29",
    name: "Compliance Audit",
    owner: "Legal Department",
    totalBudget: 180000,
    committed: 140000,
    actual: 125000,
    available: 40000,
    variance: -15000,
    program: "Operations",
    department: "Legal"
  }, {
    id: "30",
    name: "Performance Monitoring Tools",
    owner: "IT Department",
    totalBudget: 280000,
    committed: 220000,
    actual: 195000,
    available: 60000,
    variance: -25000,
    program: "Technology",
    department: "IT"
  }, {
    id: "31",
    name: "SEO Optimization Campaign",
    owner: "Marketing Team",
    totalBudget: 220000,
    committed: 175000,
    actual: 160000,
    available: 45000,
    variance: -15000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "32",
    name: "Disaster Recovery Planning",
    owner: "IT Department",
    totalBudget: 400000,
    committed: 320000,
    actual: 285000,
    available: 80000,
    variance: -35000,
    program: "Technology",
    department: "IT"
  }, {
    id: "33",
    name: "Team Building Activities",
    owner: "HR Department",
    totalBudget: 80000,
    committed: 65000,
    actual: 58000,
    available: 15000,
    variance: -7000,
    program: "Operations",
    department: "HR"
  }, {
    id: "34",
    name: "Email Marketing Platform",
    owner: "Marketing Team",
    totalBudget: 150000,
    committed: 120000,
    actual: 110000,
    available: 30000,
    variance: -10000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "35",
    name: "Server Hardware Upgrade",
    owner: "IT Department",
    totalBudget: 650000,
    committed: 520000,
    actual: 470000,
    available: 130000,
    variance: -50000,
    program: "Technology",
    department: "IT"
  }, {
    id: "36",
    name: "Vendor Management System",
    owner: "Procurement",
    totalBudget: 300000,
    committed: 240000,
    actual: 215000,
    available: 60000,
    variance: -25000,
    program: "Operations",
    department: "Procurement"
  }, {
    id: "37",
    name: "Video Production Campaign",
    owner: "Marketing Team",
    totalBudget: 420000,
    committed: 335000,
    actual: 305000,
    available: 85000,
    variance: -30000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "38",
    name: "API Development Project",
    owner: "IT Department",
    totalBudget: 500000,
    committed: 400000,
    actual: 360000,
    available: 100000,
    variance: -40000,
    program: "Technology",
    department: "IT"
  }, {
    id: "39",
    name: "Learning Management System",
    owner: "HR Department",
    totalBudget: 250000,
    committed: 200000,
    actual: 180000,
    available: 50000,
    variance: -20000,
    program: "Operations",
    department: "HR"
  }, {
    id: "40",
    name: "Partnership Marketing",
    owner: "Marketing Team",
    totalBudget: 300000,
    committed: 240000,
    actual: 220000,
    available: 60000,
    variance: -20000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "41",
    name: "Cloud Storage Migration",
    owner: "IT Department",
    totalBudget: 380000,
    committed: 300000,
    actual: 270000,
    available: 80000,
    variance: -30000,
    program: "Technology",
    department: "IT"
  }, {
    id: "42",
    name: "Sustainability Initiative",
    owner: "Operations",
    totalBudget: 200000,
    committed: 160000,
    actual: 145000,
    available: 40000,
    variance: -15000,
    program: "Operations",
    department: "Operations"
  }, {
    id: "43",
    name: "Mobile Marketing Campaign",
    owner: "Marketing Team",
    totalBudget: 280000,
    committed: 220000,
    actual: 200000,
    available: 60000,
    variance: -20000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "44",
    name: "DevOps Implementation",
    owner: "IT Department",
    totalBudget: 450000,
    committed: 360000,
    actual: 325000,
    available: 90000,
    variance: -35000,
    program: "Technology",
    department: "IT"
  }, {
    id: "45",
    name: "Employee Recognition Program",
    owner: "HR Department",
    totalBudget: 100000,
    committed: 80000,
    actual: 72000,
    available: 20000,
    variance: -8000,
    program: "Operations",
    department: "HR"
  }, {
    id: "46",
    name: "Conversion Rate Optimization",
    owner: "Marketing Team",
    totalBudget: 180000,
    committed: 145000,
    actual: 130000,
    available: 35000,
    variance: -15000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "47",
    name: "Monitoring & Analytics",
    owner: "IT Department",
    totalBudget: 320000,
    committed: 255000,
    actual: 230000,
    available: 65000,
    variance: -25000,
    program: "Technology",
    department: "IT"
  }, {
    id: "48",
    name: "Office Equipment Upgrade",
    owner: "Facilities",
    totalBudget: 150000,
    committed: 120000,
    actual: 108000,
    available: 30000,
    variance: -12000,
    program: "Operations",
    department: "Facilities"
  }, {
    id: "49",
    name: "Customer Acquisition Campaign",
    owner: "Marketing Team",
    totalBudget: 520000,
    committed: 415000,
    actual: 380000,
    available: 105000,
    variance: -35000,
    program: "Marketing",
    department: "Marketing"
  }, {
    id: "50",
    name: "Automation Framework",
    owner: "IT Department",
    totalBudget: 600000,
    committed: 480000,
    actual: 435000,
    available: 120000,
    variance: -45000,
    program: "Technology",
    department: "IT"
  }];
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  const getVarianceBadge = (variance: number) => {
    if (variance > 0) return <Badge variant="default" className="bg-primary hover:bg-primary text-white">Under Budget</Badge>;
    if (variance < -50000) return <Badge variant="destructive" className="bg-red-accent hover:bg-red-accent">Over Budget</Badge>;
    return <Badge variant="secondary">On Track</Badge>;
  };

  // Calculate totals
  const totals = budgets.reduce((acc, budget) => ({
    totalBudget: acc.totalBudget + budget.totalBudget,
    committed: acc.committed + budget.committed,
    actual: acc.actual + budget.actual,
    available: acc.available + budget.available
  }), {
    totalBudget: 0,
    committed: 0,
    actual: 0,
    available: 0
  });

  // Mock chart data for variance analysis
  const chartData = [{
    month: 'Jan',
    budget: 1000000,
    actual: 850000,
    committed: 900000
  }, {
    month: 'Feb',
    budget: 1000000,
    actual: 920000,
    committed: 950000
  }, {
    month: 'Mar',
    budget: 1000000,
    actual: 880000,
    committed: 920000
  }, {
    month: 'Apr',
    budget: 1000000,
    actual: 1050000,
    committed: 980000
  }, {
    month: 'May',
    budget: 1000000,
    actual: 950000,
    committed: 940000
  }, {
    month: 'Jun',
    budget: 1000000,
    actual: 1020000,
    committed: 990000
  }];

  // Metrics data in dashboard format
  const metrics = [{
    title: "Total Budget",
    value: formatCurrency(totals.totalBudget),
    change: "Across all programs",
    icon: IndianRupee,
    color: "text-gray-900",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
    iconBg: "bg-red-muted"
  }, {
    title: "Committed Spend",
    value: formatCurrency(totals.committed),
    change: `${(totals.committed / totals.totalBudget * 100).toFixed(1)}% of total budget`,
    icon: TrendingUp,
    color: "text-gray-900",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
    iconBg: "bg-red-accent"
  }, {
    title: "Actual Spend",
    value: formatCurrency(totals.actual),
    change: `${(totals.actual / totals.totalBudget * 100).toFixed(1)}% of total budget`,
    icon: IndianRupee,
    color: "text-gray-900",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
    iconBg: "bg-red-muted"
  }, {
    title: "Available Budget",
    value: formatCurrency(totals.available),
    change: "Remaining for allocation",
    icon: AlertTriangle,
    color: "text-gray-900",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
    iconBg: "bg-red-accent"
  }];

  // Table columns configuration
  const tableColumns = [{
    key: 'name',
    label: 'Budget Name',
    sortable: true,
    className: 'font-medium'
  }, {
    key: 'owner',
    label: 'Owner',
    sortable: true
  }, {
    key: 'totalBudget',
    label: 'Total Budget',
    sortable: true,
    className: 'font-mono',
    render: (value: number) => formatCurrency(value)
  }, {
    key: 'committed',
    label: 'Committed',
    sortable: true,
    className: 'font-mono text-red-muted',
    render: (value: number) => formatCurrency(value)
  }, {
    key: 'actual',
    label: 'Actual',
    sortable: true,
    className: 'font-mono text-red-accent',
    render: (value: number) => formatCurrency(value)
  }, {
    key: 'available',
    label: 'Available',
    sortable: true,
    className: 'font-mono text-primary',
    render: (value: number) => formatCurrency(value)
  }, {
    key: 'variance',
    label: 'Variance',
    sortable: true,
    className: 'font-mono',
    render: (value: any, row: any) => <span className={value < 0 ? "text-red-accent" : "text-primary"}>
          {formatCurrency(Math.abs(value))}
        </span>
  }, {
    key: 'status',
    label: 'Status',
    render: (value: any, row: any) => getVarianceBadge(row.variance)
  }];

  // Handle modal actions
  const handleViewDetails = (budget: any) => {
    setSelectedBudgetForModal(budget);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBudgetForModal(null);
  };

  // Table actions
  const tableActions = [{
    label: "View Details",
    icon: Eye,
    onClick: (row: any) => handleViewDetails(row)
  }, {
    label: "Edit Budget",
    icon: Edit,
    onClick: (row: any) => onEditBudget(row.id)
  }];
  return <div className="p-6 space-y-6 animate-fade-in px-0 py-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-foreground text-2xl">Payment vs Budget Tracking</h1>
          <p className="text-muted-foreground">Monitor financial control and budget utilization in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewMatching} className="transition-all duration-200 hover:scale-105 bg-white">
            PO & Invoice Matching
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={onViewApprovals} className="transition-all duration-200 hover:scale-105 text-black bg-white">
            Alerts & Approvals
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          <Button onClick={onCreateBudget} className="transition-all duration-200 hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Create New Budget
          </Button>
        </div>
      </div>

      {/* Time Period Selector */}
      

      {/* Budget Summary Cards - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        {metrics.map((metric, index) => <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  {metric.title}
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {metric.value}
                </div>
              </div>
              <div className={`${metric.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                {metric.change}
              </p>
            </CardContent>
            
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${metric.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>)}
      </div>

      {/* Variance Analysis Chart */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-4 w-4" />
            Variance Analysis & Burn Rate Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={value => `₹${value / 100000}L`} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), '']} labelClassName="text-gray-900" contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }} />
                <Line type="monotone" dataKey="budget" stroke="#64748b" strokeWidth={2} name="Budget" />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--red-accent))" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="committed" stroke="hsl(var(--red-muted))" strokeWidth={2} name="Committed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Current Burn Rate</p>
              <p className="text-lg font-bold text-gray-900">₹1.25Cr/month</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Projected Duration</p>
              <p className="text-lg font-bold text-gray-900">8.5 months</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-lg font-bold text-red-accent">7</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Hierarchy Table with Integrated Filters */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <IndianRupee className="h-4 w-4" />
              Budget Hierarchy & Roll-up View
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search budgets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64 h-9 border-gray-300 focus:border-gray-500 focus:ring-gray-500" />
              </div>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-40 h-9 border-gray-300">
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40 h-9 border-gray-300">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="it">IT Department</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-9 border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UniversalTable data={budgets} columns={tableColumns} actions={tableActions} pageSize={10} showSerialNumber={true} onRowClick={row => console.log("Row clicked:", row)} />
        </CardContent>
      </Card>

      {/* Budget Details Modal */}
      <BudgetDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} budget={selectedBudgetForModal} />
    </div>;
};
export { BudgetDashboard };