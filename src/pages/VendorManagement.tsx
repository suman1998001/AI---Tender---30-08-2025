import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Filter, Plus, Eye, Edit, MessageCircle, Download, FileText, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, MapPin, Globe } from "lucide-react";
const VendorManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Mock vendor data with Indian names from Haulage Contract for Housekeeping
  const vendors = [{
    id: "V001",
    name: "ALMIGHTY MANPOWER & SECURITY SERVICES",
    contactPerson: "Raj Kumar Sharma",
    email: "raj.sharma@almightymanpower.in",
    phone: "+91 98765 43210",
    location: "Mumbai, MH",
    industry: "Manpower & Security Services",
    status: "Active",
    riskLevel: "Low",
    esgScore: 85,
    activeProjects: 3,
    contractValue: "₹5,20,00,000",
    registrationDate: "2018-03-15",
    website: "almightymanpower.in"
  }, {
    id: "V002",
    name: "ANGEL MANPOWER & SECURITY SERVICES",
    contactPerson: "Priya Gupta",
    email: "priya.gupta@angelmanpower.com",
    phone: "+91 87654 32109",
    location: "Mumbai, MH",
    industry: "Manpower & Security Services",
    status: "Active",
    riskLevel: "Medium",
    esgScore: 72,
    activeProjects: 2,
    contractValue: "₹3,80,00,000",
    registrationDate: "2019-07-22",
    website: "angelmanpower.com"
  }, {
    id: "2964",
    name: "M/S ARADHAY SHREERAM PRIVATE LIMITED",
    contactPerson: "Amit Patel",
    email: "amit.patel@aradhayshreeram.com",
    phone: "+91 76543 21098",
    location: "Indore, MP",
    industry: "Construction & Services",
    status: "Pre-qualified",
    riskLevel: "Low",
    esgScore: 92,
    activeProjects: 1,
    contractValue: "₹2,10,00,000",
    registrationDate: "2020-11-10",
    website: "aradhayshreeram.com"
  }, {
    id: "V004",
    name: "SMVD GROUP SECURE SERVICES",
    contactPerson: "Kavya Reddy",
    email: "kavya.reddy@smvdgroup.co.in",
    phone: "+91 65432 10987",
    location: "Bhopal, MP",
    industry: "Security Services",
    status: "On Hold",
    riskLevel: "High",
    esgScore: 68,
    activeProjects: 0,
    contractValue: "₹1,50,00,000",
    registrationDate: "2017-05-08",
    website: "smvdgroup.co.in"
  }, {
    id: "V005",
    name: "UNIQUE DESIGN AND CONSTRUCTIONS",
    contactPerson: "Arjun Singh",
    email: "arjun.singh@uniquedesign.in",
    phone: "+91 54321 09876",
    location: "Gwalior, MP",
    industry: "Construction Services",
    status: "Active",
    riskLevel: "Low",
    esgScore: 78,
    activeProjects: 4,
    contractValue: "₹6,90,00,000",
    registrationDate: "2021-02-14",
    website: "uniquedesign.in"
  }, {
    id: "V006",
    name: "JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR",
    contactPerson: "Deepika Joshi",
    email: "deepika.joshi@jeelifeconstruction.com",
    phone: "+91 94567 23456",
    location: "Nagpur, MH",
    industry: "Construction Services",
    status: "Active",
    riskLevel: "Medium",
    esgScore: 81,
    activeProjects: 2,
    contractValue: "₹4,30,00,000",
    registrationDate: "2019-09-12",
    website: "jeelifeconstruction.com"
  }, {
    id: "V007",
    name: "SHREE GOSAI ENTERPRISES",
    contactPerson: "Vikram Gosai",
    email: "vikram@shreegosai.in",
    phone: "+91 88765 34567",
    location: "Mumbai, MH",
    industry: "General Services",
    status: "Pre-qualified",
    riskLevel: "Low",
    esgScore: 76,
    activeProjects: 1,
    contractValue: "₹2,80,00,000",
    registrationDate: "2020-06-18",
    website: "shreegosai.in"
  }, {
    id: "V008",
    name: "PARAMOUNT SERVICES",
    contactPerson: "Neha Sharma",
    email: "neha.sharma@paramountservices.com",
    phone: "+91 91234 56789",
    location: "Indore, MP",
    industry: "Maintenance Services",
    status: "Active",
    riskLevel: "Low",
    esgScore: 88,
    activeProjects: 3,
    contractValue: "₹5,60,00,000",
    registrationDate: "2018-12-05",
    website: "paramountservices.com"
  }, {
    id: "V009",
    name: "M/s BOOSTUP INDIA SOLUTION",
    contactPerson: "Manjeet Kumar",
    email: "manjeet@boostupindia.com",
    phone: "+91 93422 23751",
    location: "Ara, Bihar",
    industry: "Haulage & Logistics",
    status: "Active",
    riskLevel: "Low",
    esgScore: 91,
    activeProjects: 2,
    contractValue: "₹7,50,00,000",
    registrationDate: "2019-04-20",
    website: "boostupindia.com"
  }, {
    id: "V010",
    name: "SECURE SERVICES (M/S HARSH ENGINEERING WORKS)",
    contactPerson: "Madhu Jasrai",
    email: "madhu@secureservices.in",
    phone: "+91 99351 90787",
    location: "Unnao, UP",
    industry: "Engineering & Construction",
    status: "Active",
    riskLevel: "Low",
    esgScore: 82,
    activeProjects: 1,
    contractValue: "₹3,20,00,000",
    registrationDate: "2020-08-15",
    website: "secureservices.in"
  }];
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pre-qualified":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "on hold":
        return "bg-warning/10 text-warning border-warning/20";
      case "disqualified":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "high":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  const getESGIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) || vendor.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status.toLowerCase() === statusFilter;
    const matchesRisk = riskFilter === "all" || vendor.riskLevel.toLowerCase() === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === "Active").length;
  const avgESGScore = Math.round(vendors.reduce((sum, v) => sum + v.esgScore, 0) / vendors.length);
  const totalContractValue = vendors.reduce((sum, v) => {
    const value = parseInt(v.contractValue.replace(/[₹,]/g, ''));
    return sum + value;
  }, 0);
  return <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              
              <span className="text-2xl">Vendor Management</span>
            </h1>
            <p className="text-muted-foreground">
              Comprehensive vendor database and relationship management
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Total Vendors
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {totalVendors}
                </div>
              </div>
              <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Registered suppliers
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>

          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Active Vendors
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {activeVendors}
                </div>
              </div>
              <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Currently engaged
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>

          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Avg ESG Score
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {avgESGScore}
                </div>
              </div>
              <div className="bg-gray-700 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Sustainability rating
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>

          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Total Contract Value
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  ₹{(totalContractValue / 10000000).toFixed(1)}Cr
                </div>
              </div>
              <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Total business value
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search vendors by name, contact person, or industry..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pre-qualified">Pre-qualified</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                  <SelectItem value="disqualified">Disqualified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Table */}
        <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-gray-900 font-semibold">Vendor Directory</CardTitle>
            <CardDescription className="text-gray-600">
              Complete list of registered vendors with key information and actions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 hover:bg-transparent">
                    <TableHead className="font-semibold text-gray-700 bg-gray-50/50">Vendor Details</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50/50">Contact Information</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50/50">Status & Risk</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50/50">ESG Score</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50/50">Projects & Value</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50/50">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map(vendor => <TableRow key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{vendor.name}</p>
                          <p className="text-sm text-gray-500">ID: {vendor.id}</p>
                          <p className="text-sm text-gray-600">{vendor.industry}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{vendor.location}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{vendor.contactPerson}</p>
                          <p className="text-sm text-gray-600">{vendor.email}</p>
                          <p className="text-sm text-gray-600">{vendor.phone}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Globe className="h-3 w-3" />
                            <span>{vendor.website}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <Badge className={getStatusColor(vendor.status)} variant="outline">
                            {vendor.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Badge className={getRiskColor(vendor.riskLevel)} variant="outline">
                              {getRiskIcon(vendor.riskLevel)}
                              <span className="ml-1">{vendor.riskLevel} Risk</span>
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          {getESGIcon(vendor.esgScore)}
                          <span className="font-semibold text-gray-900">{vendor.esgScore}</span>
                          <span className="text-gray-500 text-sm">/100</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{vendor.activeProjects} Projects</p>
                          <p className="text-sm font-mono text-gray-600">{vendor.contractValue}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Since {vendor.registrationDate}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/vendor-profile/${vendor.id}`)} className="border-gray-200 hover:bg-gray-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
};
export default VendorManagement;