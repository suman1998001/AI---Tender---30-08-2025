import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Edit,
  MessageCircle,
  RefreshCw,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Users,
  Shield,
  Factory,
  BarChart3,
  Download,
  X
} from "lucide-react";

const VendorProfile = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  // Vendor data matching the VendorManagement page
  const vendorsList = [
    {
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
    },
    {
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
    },
    // Add more vendors as needed...
  ];

  // Find the current vendor
  const vendorData = vendorsList.find(v => v.id === vendorId) || vendorsList[0];

  // Enhanced vendor profile data
  const extendedVendorData = {
    ...vendorData,
    address: `Business Park, ${vendorData.location}`,
    cin: `U72200MP${vendorData.registrationDate.split('-')[0]}PTC334567`,
    gstNo: `23AABCU9603R1ZM`,
    msmeStatus: { status: "Yes", category: "Medium Enterprise" },
    certifications: ["ISO 9001:2015", "ISO 45001:2018", "Labour License"],
    overallStatus: vendorData.status
  };

  const activeProjects = [
    {
      projectName: "Facility Management Services",
      rfpId: "RFP-2024-006",
      role: "Primary Contractor",
      startDate: "2024-01-15",
      expectedCompletion: "2026-12-31",
      currentStatus: "In Progress",
      currentPhase: "Service Delivery",
      contractValue: vendorData.contractValue
    },
    {
      projectName: "Security Services Contract",
      rfpId: "RFP-2023-087", 
      role: "Service Provider",
      startDate: "2023-09-01",
      expectedCompletion: "2025-08-31",
      currentStatus: "Active",
      currentPhase: "Operations",
      contractValue: "₹1,80,00,000"
    }
  ];

  const riskProfile = {
    overallScore: "Medium",
    scoreValue: 65,
    lastUpdated: "2024-01-20 14:30",
    riskCategories: [
      { name: "Financial", score: 75, status: "Low" },
      { name: "Compliance", score: 85, status: "Low" },
      { name: "Operational", score: 55, status: "Medium" },
      { name: "Geopolitical", score: 60, status: "Medium" },
      { name: "Reputational", score: 70, status: "Low" }
    ],
    keyIndicators: [
      "Strong Financial Position",
      "Compliance with Data Protection Regulations",
      "Minor Delivery Delays in Q4 2023"
    ]
  };

  const esgProfile = {
    overallRating: "Good",
    environmental: {
      score: 72,
      carbonFootprint: "Reduced by 15% in 2023",
      renewableEnergy: "30% of operations",
      wasteManagement: "Zero waste to landfill initiative"
    },
    social: {
      score: 78,
      diversityInclusion: "40% women in leadership",
      communityEngagement: "Local education programs",
      laborPractices: "Fair wage certification"
    },
    governance: {
      score: 85,
      antiCorruption: "Comprehensive policy in place",
      dataPrivacy: "GDPR & SOC2 compliant",
      boardDiversity: "Diverse leadership team"
    },
    certifications: ["ISO 14001", "B-Corp Certified", "EcoVadis Silver"],
    sustainabilityInitiatives: [
      "Carbon Neutral by 2025",
      "Employee Wellbeing Program",
      "Sustainable Supply Chain Initiative"
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "nearing completion":
        return "bg-warning/10 text-warning border-warning/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
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

  const getRiskIcon = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button - Top Left */}
        <div className="flex items-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/vendor-management")}
            className="flex items-center space-x-2 border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Vendors</span>
          </Button>
        </div>

        {/* Header - Under Back Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {extendedVendorData.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive vendor profile and performance analytics
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Vendor
            </Button>
          </div>
        </div>

        <MinimalTabs defaultValue="overview" className="space-y-[15px]">
          <MinimalTabsList className="bg-white rounded-[15px] border border-gray-200 p-1">
            <MinimalTabsTrigger value="overview" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
              <Building2 className="h-4 w-4" />
              Overview
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="projects" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              Projects
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="risk" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
              <Shield className="h-4 w-4" />
              Risk Assessment
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="sustainability" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
              <Leaf className="h-4 w-4" />
              Sustainability Profile
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="carbon-footprint" className="flex items-center gap-2 text-black data-[state=active]:bg-red-accent data-[state=active]:text-white">
              <Factory className="h-4 w-4" />
              Product Carbon Footprint
            </MinimalTabsTrigger>
          </MinimalTabsList>

          {/* Overview Tab */}
          <MinimalTabsContent value="overview" className="space-y-6">
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center space-x-3 text-foreground">
                  <div className="p-2 bg-red-accent/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-red-accent" />
                  </div>
                  <span className="text-lg font-semibold">General Information</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground ml-11">
                  Comprehensive vendor profile and business registration details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Business Identity */}
                  <div className="space-y-5">
                    <div className="p-4 bg-red-accent/5 rounded-lg border border-red-accent/10">
                      <label className="text-sm font-semibold text-red-accent uppercase tracking-wide">Vendor ID</label>
                      <p className="text-lg font-mono font-bold text-foreground mt-1">{extendedVendorData.id}</p>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                      <div className="flex items-center space-x-2 mt-1 p-2 rounded-md group-hover:bg-red-accent/5 transition-colors">
                        <Calendar className="h-4 w-4 text-red-accent" />
                        <span className="text-foreground font-medium">{extendedVendorData.registrationDate}</span>
                      </div>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-muted-foreground">Industry Sector</label>
                      <div className="flex items-center space-x-2 mt-1 p-2 rounded-md group-hover:bg-red-accent/5 transition-colors">
                        <Factory className="h-4 w-4 text-red-accent" />
                        <span className="text-foreground font-medium">{extendedVendorData.industry}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Overall Status</label>
                      <div className="mt-2">
                        <Badge className={`${getStatusColor(extendedVendorData.overallStatus)} px-3 py-1 font-medium`} variant="outline">
                          <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                          {extendedVendorData.overallStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-5">
                    <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                      <label className="text-sm font-semibold text-foreground uppercase tracking-wide">Primary Contact</label>
                      <div className="space-y-3 mt-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-red-accent" />
                          <span className="font-semibold text-foreground">{extendedVendorData.contactPerson}</span>
                        </div>
                        <div className="flex items-center space-x-2 group cursor-pointer">
                          <Mail className="h-4 w-4 text-red-accent" />
                          <span className="text-muted-foreground group-hover:text-red-accent transition-colors">{extendedVendorData.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 group cursor-pointer">
                          <Phone className="h-4 w-4 text-red-accent" />
                          <span className="text-muted-foreground group-hover:text-red-accent transition-colors">{extendedVendorData.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-muted-foreground">Official Website</label>
                      <div className="flex items-center space-x-2 mt-1 p-2 rounded-md group-hover:bg-red-accent/5 transition-colors">
                        <Globe className="h-4 w-4 text-red-accent" />
                        <a 
                          href={`https://${extendedVendorData.website}`} 
                          className="text-red-accent hover:text-red-accent/80 font-medium transition-colors"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {extendedVendorData.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Legal Information */}
                  <div className="space-y-5">
                    <div className="group">
                      <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                      <div className="flex items-start space-x-2 mt-1 p-2 rounded-md group-hover:bg-red-accent/5 transition-colors">
                        <MapPin className="h-4 w-4 text-red-accent mt-0.5 flex-shrink-0" />
                        <span className="text-foreground font-medium">{extendedVendorData.address}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-accent/5 rounded-md border border-red-accent/10">
                        <label className="text-xs font-medium text-red-accent uppercase tracking-wider">CIN</label>
                        <p className="text-sm font-mono font-bold text-foreground mt-1">{extendedVendorData.cin}</p>
                      </div>
                      <div className="p-3 bg-red-accent/5 rounded-md border border-red-accent/10">
                        <label className="text-xs font-medium text-red-accent uppercase tracking-wider">GST Number</label>
                        <p className="text-sm font-mono font-bold text-foreground mt-1">{extendedVendorData.gstNo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-red-accent/20" />

                {/* Additional Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-foreground">MSME Classification</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge className={`${getStatusColor("active")} px-3 py-1 font-medium`} variant="outline">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {extendedVendorData.msmeStatus.status}
                        </Badge>
                        <span className="text-muted-foreground font-medium">({extendedVendorData.msmeStatus.category})</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">Professional Certifications</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {extendedVendorData.certifications.map((cert, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="border-red-accent/30 text-red-accent bg-red-accent/5 hover:bg-red-accent/10 transition-colors"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Performance Dashboard */}
                  <div className="pt-4">
                    <label className="text-sm font-semibold text-foreground mb-4 block">Performance Overview</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-red-accent/10 to-red-accent/5 rounded-xl border border-red-accent/20 hover:border-red-accent/30 transition-colors group">
                        <div className="text-3xl font-bold text-red-accent group-hover:scale-110 transition-transform">
                          {extendedVendorData.activeProjects}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-1">Active Projects</div>
                        <div className="w-full bg-red-accent/20 rounded-full h-1 mt-2">
                          <div className="bg-red-accent h-1 rounded-full" style={{width: `${(extendedVendorData.activeProjects / 5) * 100}%`}}></div>
                        </div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-xl border border-foreground/20 hover:border-foreground/30 transition-colors group">
                        <div className="text-3xl font-bold text-foreground group-hover:scale-110 transition-transform">
                          {extendedVendorData.esgScore}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-1">ESG Score</div>
                        <div className="w-full bg-foreground/20 rounded-full h-1 mt-2">
                          <div className="bg-foreground h-1 rounded-full" style={{width: `${extendedVendorData.esgScore}%`}}></div>
                        </div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-red-accent/10 to-red-accent/5 rounded-xl border border-red-accent/20 hover:border-red-accent/30 transition-colors group">
                        <div className="text-2xl font-bold text-red-accent group-hover:scale-110 transition-transform">
                          {extendedVendorData.contractValue}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-1">Total Contract Value</div>
                        <div className="flex items-center justify-center mt-2">
                          <TrendingUp className="h-4 w-4 text-red-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MinimalTabsContent>

          {/* Projects Tab */}
          <MinimalTabsContent value="projects" className="space-y-6">
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center space-x-3 text-foreground">
                  <div className="p-2 bg-red-accent/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-accent" />
                  </div>
                  <span className="text-lg font-semibold">Active Projects</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground ml-11">
                  Current and ongoing project engagements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-red-accent/10 hover:bg-transparent">
                        <TableHead className="font-semibold text-foreground bg-red-accent/5">Project Name / RFP ID</TableHead>
                        <TableHead className="font-semibold text-foreground bg-red-accent/5">Role</TableHead>
                        <TableHead className="font-semibold text-foreground bg-red-accent/5">Timeline</TableHead>
                        <TableHead className="font-semibold text-foreground bg-red-accent/5">Status</TableHead>
                        <TableHead className="font-semibold text-foreground bg-red-accent/5">Phase</TableHead>
                        <TableHead className="font-semibold text-foreground bg-red-accent/5">Contract Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeProjects.map((project, index) => (
                        <TableRow 
                          key={index} 
                          className="border-b border-foreground/10 hover:bg-red-accent/5 transition-colors"
                        >
                          <TableCell className="py-4">
                            <div>
                              <p className="font-medium text-foreground">{project.projectName}</p>
                              <p className="text-sm text-muted-foreground font-mono">{project.rfpId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge 
                              variant="outline" 
                              className="border-red-accent/20 bg-red-accent/5 text-red-accent"
                            >
                              {project.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm space-y-1">
                              <div className="flex items-center text-foreground">
                                <Calendar className="h-3 w-3 text-red-accent mr-1.5" />
                                <span>{project.startDate}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground pl-4.5">
                                <span>to {project.expectedCompletion}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={`${getStatusColor(project.currentStatus)}`} variant="outline">
                              <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></div>
                              {project.currentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center">
                              <div className="w-1 h-full bg-red-accent/30 mr-2"></div>
                              <span className="text-foreground">{project.currentPhase}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-mono text-foreground font-semibold bg-red-accent/5 px-2 py-1 rounded-md">
                              {project.contractValue}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </MinimalTabsContent>

          {/* Risk Assessment Tab */}
          <MinimalTabsContent value="risk" className="space-y-6">
            {/* Real-time Risk Insights - Full Width */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center space-x-3 text-foreground">
                  <div className="p-2 bg-red-accent/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-accent" />
                  </div>
                  <span className="text-lg font-semibold">Risk Category Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {(() => {
                  const [selectedSection, setSelectedSection] = React.useState("");
                  const [isGenerating, setIsGenerating] = React.useState(false);
                   const [insightsData, setInsightsData] = React.useState<null | {
                     title: string;
                     summary: string;
                     recommendations: string[];
                     keyMetrics: { label: string; value: string; trend: "up" | "down" | "neutral" }[];
                     riskScore: number;
                     riskStatus: string;
                   }>(null);
                  
                   const handleGenerateInsights = async () => {
                     if (!selectedSection) return;
                     
                     setIsGenerating(true);
                     
                     try {
                       const response = await fetch('https://7fdabeepxxx27vd5u35owniyu40avlvr.lambda-url.us-west-2.on.aws/', {
                         method: 'POST',
                         headers: {
                           'Content-Type': 'application/json',
                         },
                         body: JSON.stringify({
                           token: "qhfntisbn866dbTHNfkfkshxcvbnmhg",
                           conversation: [],
                           user_input: `Provide the ${selectedSection} Risk Assessment for the ${vendorData.name} company`
                         })
                       });

                       if (!response.ok) {
                         throw new Error('Failed to fetch data');
                       }

                       const data = await response.json();
                       
                       // Create insights data with API response
                       const insightsData = {
                         title: `${selectedSection} Risk Analysis`,
                         summary: data.answer,
                         recommendations: [],
                         keyMetrics: [],
                         riskScore: 75,
                         riskStatus: "Medium"
                       };
                       
                       setInsightsData(insightsData);
                     } catch (error) {
                       console.error('Error fetching insights:', error);
                       // Fallback to mock data if API fails
                       const insightsMap: Record<string, any> = {
                         financial: {
                           title: "Financial Risk Analysis",
                           summary: "Based on the latest financial indicators, this vendor demonstrates strong fiscal stability with moderate growth potential. Cash flow remains positive with a healthy debt-to-equity ratio of 0.45, indicating good financial management practices.",
                           recommendations: [],
                           keyMetrics: [],
                           riskScore: 75,
                           riskStatus: "Low"
                         },
                         compliance: {
                           title: "Compliance Risk Analysis",
                           summary: "Compliance analysis reveals exemplary adherence to regulatory requirements with all necessary certifications up-to-date. No violations have been recorded in the past 24 months, and the vendor maintains comprehensive documentation practices.",
                           recommendations: [],
                           keyMetrics: [],
                           riskScore: 85,
                           riskStatus: "Low"
                         },
                         operational: {
                           title: "Operational Risk Analysis",
                           summary: "Operational performance metrics indicate excellent service delivery capabilities with consistent quality scores above industry benchmarks. Process maturity is well-established at Level 4, suggesting robust operational frameworks and continuous improvement practices.",
                           recommendations: [],
                           keyMetrics: [],
                           riskScore: 55,
                           riskStatus: "Medium"
                         },
                         geopolitical: {
                           title: "Geopolitical Risk Analysis",
                           summary: "The vendor operates within regions with moderate geopolitical risks but maintains stable supply chains and business continuity plans. Current political factors pose limited threat to operations, though ongoing monitoring is advised.",
                           recommendations: [],
                           keyMetrics: [],
                           riskScore: 60,
                           riskStatus: "Medium"
                         },
                         reputational: {
                           title: "Reputational Risk Analysis",
                           summary: "Brand sentiment analysis indicates strong positive reputation among clients and industry peers. ESG initiatives are well-regarded, and the vendor maintains transparent communication practices. Media coverage has been predominantly positive over the past 12 months.",
                           recommendations: [],
                           keyMetrics: [],
                           riskScore: 80,
                           riskStatus: "Low"
                         }
                       };
                       
                       setInsightsData(insightsMap[selectedSection.toLowerCase()]);
                     } finally {
                       setIsGenerating(false);
                     }
                   };
                  
                  const handleCloseInsights = () => {
                    setInsightsData(null);
                    setSelectedSection("");
                  };

                  return (
                    <>
                      {!insightsData ? (
                        <>
                          {/* Selection Section */}
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="section-select" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Risk to Load Data
                              </label>
                              <div className="flex items-center space-x-3">
                                <div className="relative flex-1">
                                  <select 
                                    id="section-select"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-900 focus:border-red-accent focus:outline-none focus:ring-1 focus:ring-red-accent"
                                  >
                                    <option value="" disabled>Choose a risk category...</option>
                                    {riskProfile.riskCategories.map((category, idx) => (
                                      <option key={idx} value={category.name.toLowerCase()}>{category.name}</option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                <Button 
                                  onClick={handleGenerateInsights}
                                  disabled={!selectedSection || isGenerating}
                                  className="bg-red-accent hover:bg-red-accent/90 text-white whitespace-nowrap"
                                  size="sm"
                                >
                                  {isGenerating ? (
                                    <div className="flex items-center space-x-2">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                      <span>Loading...</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <BarChart3 className="h-4 w-4" />
                                      <span>Load Data</span>
                                    </div>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ready to Generate State */}
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-gray-100 rounded-full p-4 mb-6">
                              <BarChart3 className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Risk Analysis</h3>
                            <p className="text-gray-500 max-w-md">
                              Select a risk category from the dropdown above and click "Load Data" to generate real-time risk analysis.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          {/* Header with close button and risk score */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-red-accent/10 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-accent" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground">{insightsData.title}</h3>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge 
                                className={`${getStatusColor(insightsData.riskStatus)} px-3 py-1`} 
                                variant="outline"
                              >
                                <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></div>
                                {insightsData.riskStatus} Risk
                              </Badge>
                              <Button 
                                onClick={handleCloseInsights}
                                size="sm"
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Summary */}
                          <div className="bg-red-accent/5 rounded-lg p-4 border border-red-accent/20">
                            <h4 className="font-medium text-foreground mb-2">Summary Analysis</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{insightsData.summary}</p>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex justify-end space-x-3 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-accent/20 text-red-accent hover:bg-red-accent/5"
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              Export Report
                            </Button>
                            <Button 
                              onClick={handleCloseInsights}
                              size="sm"
                              variant="outline"
                            >
                              Generate New Insights
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Risk Categories Analysis - Full Width */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center space-x-3 text-foreground">
                  <div className="p-2 bg-red-accent/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-accent" />
                  </div>
                  <span className="text-lg font-semibold">Risk Categories Analysis</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground ml-11">
                  Click on any risk category to view detailed analysis and breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {riskProfile.riskCategories.map((category, index) => {
                    const [isExpanded, setIsExpanded] = React.useState(false);
                    const [isLoading, setIsLoading] = React.useState(false);
                    
                    const handleFetchInformation = async (e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsLoading(true);
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      setIsLoading(false);
                      setIsExpanded(true);
                    };

                    return (
                      <div key={index} className="space-y-3 p-4 rounded-lg border border-foreground/10 transition-colors hover:shadow-md">
                        {!isExpanded ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <h3 className="font-medium text-foreground text-lg">{category.name}</h3>
                            </div>
                            <Button 
                              onClick={handleFetchInformation}
                              disabled={isLoading}
                              size="sm"
                              className="w-full"
                              variant="outline"
                            >
                              {isLoading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                "Fetch Information"
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`p-1.5 rounded-full ${
                                  category.status.toLowerCase() === "medium" 
                                    ? "bg-warning/10" 
                                    : category.status.toLowerCase() === "low" 
                                      ? "bg-success/10" 
                                      : "bg-error/10"
                                }`}>
                                  {getRiskIcon(category.status)}
                                </div>
                                <span className="font-medium text-foreground">{category.name}</span>
                              </div>
                              <Badge 
                                className={`${getStatusColor(category.status)} px-3 py-1`} 
                                variant="outline"
                              >
                                <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></div>
                                {category.status}
                              </Badge>
                            </div>
                            
                            <div className="relative pt-1">
                              <div className="flex items-center justify-between mb-1">
                                <div></div>
                                <div className="text-xs text-muted-foreground">
                                  Score: <span className="font-semibold text-foreground">{category.score}/100</span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-red-accent/10">
                                <div 
                                  style={{ width: `${category.score}%` }} 
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                    category.status.toLowerCase() === "medium" 
                                      ? "bg-warning" 
                                      : category.status.toLowerCase() === "low" 
                                        ? "bg-success" 
                                        : "bg-error"
                                  }`}>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground">Risk Factors:</h4>
                              <div className="space-y-1">
                                {category.name === "Financial" && (
                                  <>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Credit Rating:</span>
                                      <span className="text-foreground font-medium">BBB+</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Debt-to-Equity:</span>
                                      <span className="text-foreground font-medium">0.45</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Cash Flow:</span>
                                      <span className="text-success font-medium">Stable</span>
                                    </div>
                                  </>
                                )}
                                {category.name === "Compliance" && (
                                  <>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Regulatory Score:</span>
                                      <span className="text-foreground font-medium">92/100</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Last Audit:</span>
                                      <span className="text-foreground font-medium">Q2 2024</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Violations:</span>
                                      <span className="text-success font-medium">None</span>
                                    </div>
                                  </>
                                )}
                                {category.name === "Operational" && (
                                  <>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Quality Rating:</span>
                                      <span className="text-foreground font-medium">4.8/5.0</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Delivery Performance:</span>
                                      <span className="text-success font-medium">98.5%</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Process Maturity:</span>
                                      <span className="text-foreground font-medium">Level 4</span>
                                    </div>
                                  </>
                                )}
                                {category.name === "Geopolitical" && (
                                  <>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Country Risk:</span>
                                      <span className="text-warning font-medium">Medium</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Trade Stability:</span>
                                      <span className="text-success font-medium">Stable</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Political Index:</span>
                                      <span className="text-foreground font-medium">7.2/10</span>
                                    </div>
                                  </>
                                )}
                                {category.name === "Reputational" && (
                                  <>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>ESG Rating:</span>
                                      <span className="text-success font-medium">A-</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Media Sentiment:</span>
                                      <span className="text-success font-medium">Positive</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                      <span>Brand Score:</span>
                                      <span className="text-foreground font-medium">8.5/10</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <Button 
                              onClick={() => setIsExpanded(false)}
                              size="sm"
                              className="w-full"
                              variant="outline"
                            >
                              Collapse Details
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Risk Profile Overview - Moved to bottom */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <Shield className="h-5 w-5 text-red-accent" />
                    </div>
                    <span className="text-lg font-semibold">Risk Profile Overview</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-red-accent/20 hover:bg-red-accent/5 text-foreground">
                    <RefreshCw className="h-4 w-4 mr-2 text-red-accent" />
                    Refresh
                  </Button>
                </CardTitle>
                <CardDescription className="text-muted-foreground ml-11">
                  Comprehensive risk evaluation based on multiple factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-28 h-28">
                      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-red-accent/10"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-red-accent"
                          strokeWidth="10"
                          strokeDasharray={`${riskProfile.scoreValue * 2.51} 251`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <span className="absolute text-2xl font-bold text-foreground">{riskProfile.scoreValue}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mt-4 flex items-center justify-center gap-2">
                      Overall Risk: 
                      <span className={`${
                        riskProfile.overallScore.toLowerCase() === "medium" 
                          ? "text-warning" 
                          : riskProfile.overallScore.toLowerCase() === "low" 
                            ? "text-success" 
                            : "text-error"
                      }`}>
                        {riskProfile.overallScore}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <RefreshCw className="h-3 w-3" />
                      Last updated: {riskProfile.lastUpdated}
                    </p>
                  </div>
                  
                  <div className="col-span-3 space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-accent" />
                      Key Risk Indicators
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {riskProfile.keyIndicators.map((indicator, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-foreground/5 hover:bg-red-accent/5 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-accent mt-1.5 flex-shrink-0"></div>
                          <p className="text-sm text-foreground">{indicator}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MinimalTabsContent>

          {/* Sustainability Profile Tab */}
          <MinimalTabsContent value="sustainability" className="space-y-6">
            {/* Header Section with Overall Score */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <Leaf className="h-5 w-5 text-red-accent" />
                    </div>
                    <span className="text-lg font-semibold">Sustainability Overview</span>
                  </div>
                  <Badge variant="outline" className="text-foreground bg-red-accent/10 border-red-accent/20 px-3 py-1 text-base">
                    Rating: <span className="font-bold ml-1">{esgProfile.overallRating}</span>
                  </Badge>
                </CardTitle>
                <CardDescription className="text-muted-foreground ml-11">
                  Environmental, Social & Governance performance assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-foreground/5"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="46"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-red-accent"
                        strokeWidth="8"
                        strokeDasharray={`${(esgProfile.environmental.score + esgProfile.social.score + esgProfile.governance.score) / 3 * 2.89} 289`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="46"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        {Math.round((esgProfile.environmental.score + esgProfile.social.score + esgProfile.governance.score) / 3)}
                      </span>
                      <span className="text-sm text-muted-foreground">Overall Score</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground flex items-center">
                          <div className="w-2 h-2 bg-red-accent rounded-full mr-2"></div>
                          Environmental
                        </span>
                        <span className="text-sm font-semibold text-foreground">{esgProfile.environmental.score}/100</span>
                      </div>
                      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-accent rounded-full" style={{ width: `${esgProfile.environmental.score}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground flex items-center">
                          <div className="w-2 h-2 bg-foreground rounded-full mr-2"></div>
                          Social
                        </span>
                        <span className="text-sm font-semibold text-foreground">{esgProfile.social.score}/100</span>
                      </div>
                      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${esgProfile.social.score}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground flex items-center">
                          <div className="w-2 h-2 bg-red-accent rounded-full mr-2"></div>
                          Governance
                        </span>
                        <span className="text-sm font-semibold text-foreground">{esgProfile.governance.score}/100</span>
                      </div>
                      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-accent rounded-full" style={{ width: `${esgProfile.governance.score}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Detailed Sections - 3 column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Environmental Section */}
              <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <Leaf className="h-5 w-5 text-red-accent" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold block">Environmental</span>
                      <span className="text-xs font-medium text-muted-foreground">Resource management & impact</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-accent mb-2">
                      {esgProfile.environmental.score}
                    </div>
                    <div className="w-full bg-red-accent/10 rounded-full h-2 mb-1">
                      <div className="bg-red-accent h-2 rounded-full" style={{width: `${esgProfile.environmental.score}%`}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Score out of 100</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-red-accent/5 border border-red-accent/10 hover:bg-red-accent/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-2"></div>
                        Carbon Footprint
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.environmental.carbonFootprint}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-accent/5 border border-red-accent/10 hover:bg-red-accent/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-2"></div>
                        Renewable Energy
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.environmental.renewableEnergy}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-accent/5 border border-red-accent/10 hover:bg-red-accent/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-2"></div>
                        Waste Management
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.environmental.wasteManagement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Section */}
              <Card className="rounded-[15px] border border-foreground/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-foreground/10 pb-6 bg-gradient-to-r from-foreground/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold block">Social</span>
                      <span className="text-xs font-medium text-muted-foreground">Community & workplace practices</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {esgProfile.social.score}
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-2 mb-1">
                      <div className="bg-foreground h-2 rounded-full" style={{width: `${esgProfile.social.score}%`}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Score out of 100</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-foreground mr-2"></div>
                        Diversity & Inclusion
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.social.diversityInclusion}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-foreground mr-2"></div>
                        Community Engagement
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.social.communityEngagement}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-foreground mr-2"></div>
                        Labor Practices
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.social.laborPractices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Governance Section */}
              <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <Factory className="h-5 w-5 text-red-accent" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold block">Governance</span>
                      <span className="text-xs font-medium text-muted-foreground">Leadership & business ethics</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-accent mb-2">
                      {esgProfile.governance.score}
                    </div>
                    <div className="w-full bg-red-accent/10 rounded-full h-2 mb-1">
                      <div className="bg-red-accent h-2 rounded-full" style={{width: `${esgProfile.governance.score}%`}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Score out of 100</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-red-accent/5 border border-red-accent/10 hover:bg-red-accent/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-2"></div>
                        Anti-corruption
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.governance.antiCorruption}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-accent/5 border border-red-accent/10 hover:bg-red-accent/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-2"></div>
                        Data Privacy
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.governance.dataPrivacy}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-accent/5 border border-red-accent/10 hover:bg-red-accent/10 transition-colors">
                      <p className="text-sm font-semibold text-foreground flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-2"></div>
                        Board Diversity
                      </p>
                      <p className="text-sm text-foreground ml-3 mt-1">{esgProfile.governance.boardDiversity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info Sections - 2 column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Certifications Section */}
              <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-red-accent" />
                    </div>
                    <span className="text-lg font-semibold">Sustainability Certifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {esgProfile.certifications.map((cert, index) => (
                      <Card
                        key={index}
                        className="rounded-lg border border-red-accent/20 bg-red-accent/5 hover:bg-red-accent/10 transition-all duration-200 cursor-pointer group"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-accent/20 rounded-full group-hover:bg-red-accent/30 transition-colors">
                              <CheckCircle className="h-4 w-4 text-red-accent" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-foreground group-hover:text-red-accent transition-colors">
                                {cert}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {index === 0 ? "Environmental Management" : 
                                 index === 1 ? "Corporate Responsibility" : 
                                 "Sustainability Rating"}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Valid
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sustainability Initiatives */}
              <Card className="rounded-[15px] border border-foreground/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-foreground/10 pb-6 bg-gradient-to-r from-foreground/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                      <Leaf className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-lg font-semibold">Sustainability Roadmap</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {esgProfile.sustainabilityInitiatives.map((initiative, index) => (
                      <div 
                        key={index} 
                        className="flex items-start p-3 rounded-lg bg-gradient-to-r from-foreground/5 to-transparent hover:from-red-accent/5 transition-colors group cursor-pointer"
                      >
                        <div className="p-2 bg-foreground/10 group-hover:bg-red-accent/20 rounded-full mr-3 mt-0.5 transition-colors">
                          <Leaf className="h-4 w-4 text-foreground group-hover:text-red-accent transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-red-accent transition-colors">{initiative}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Target: {index === 0 ? "2025" : index === 1 ? "Ongoing" : "2026"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Section */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <Button className="bg-red-accent hover:bg-red-accent/90 text-white w-full md:w-auto transition-transform hover:scale-105">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Sustainability Report
                  </Button>
                  <Button variant="outline" className="border-red-accent text-red-accent hover:bg-red-accent/10 w-full md:w-auto transition-transform hover:scale-105">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Latest Sustainability Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MinimalTabsContent>

          {/* Product Carbon Footprint Tab */}
          <MinimalTabsContent value="carbon-footprint" className="space-y-6">
            {/* Carbon Overview */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <Factory className="h-5 w-5 text-red-accent" />
                    </div>
                    <span className="text-lg font-semibold">Product Carbon Footprint Overview</span>
                  </div>
                  <Badge variant="outline" className="text-foreground bg-red-accent/10 border-red-accent/20 px-3 py-1 text-base">
                    Scope 1+2+3
                  </Badge>
                </CardTitle>
                <CardDescription className="text-muted-foreground ml-11">
                  Comprehensive carbon footprint analysis across product lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-red-accent/10 to-red-accent/5 rounded-xl border border-red-accent/20">
                    <div className="text-3xl font-bold text-red-accent mb-2">2.4</div>
                    <div className="text-sm font-medium text-muted-foreground">kg CO₂e per unit</div>
                    <div className="text-xs text-muted-foreground mt-1">Total Emissions</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-xl border border-foreground/20">
                    <div className="text-3xl font-bold text-foreground mb-2">-15%</div>
                    <div className="text-sm font-medium text-muted-foreground">vs Previous Year</div>
                    <div className="text-xs text-muted-foreground mt-1">Reduction Achieved</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-red-accent/10 to-red-accent/5 rounded-xl border border-red-accent/20">
                    <div className="text-3xl font-bold text-red-accent mb-2">A+</div>
                    <div className="text-sm font-medium text-muted-foreground">Carbon Rating</div>
                    <div className="text-xs text-muted-foreground mt-1">Industry Benchmark</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emission Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-red-accent" />
                    </div>
                    <span className="text-lg font-semibold">Emissions by Scope</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground flex items-center">
                        <div className="w-2 h-2 bg-red-accent rounded-full mr-2"></div>
                        Scope 1 (Direct)
                      </span>
                      <span className="text-sm font-semibold text-foreground">0.8 kg CO₂e</span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-accent rounded-full" style={{ width: '33%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Manufacturing processes, fuel combustion</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground flex items-center">
                        <div className="w-2 h-2 bg-foreground rounded-full mr-2"></div>
                        Scope 2 (Indirect Energy)
                      </span>
                      <span className="text-sm font-semibold text-foreground">0.6 kg CO₂e</span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Purchased electricity, heating, cooling</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground flex items-center">
                        <div className="w-2 h-2 bg-red-accent rounded-full mr-2"></div>
                        Scope 3 (Value Chain)
                      </span>
                      <span className="text-sm font-semibold text-foreground">1.0 kg CO₂e</span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-accent rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Raw materials, transportation, waste</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[15px] border border-foreground/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-foreground/10 pb-6 bg-gradient-to-r from-foreground/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-lg font-semibold">Lifecycle Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-foreground mr-3"></div>
                        <span className="text-sm font-medium text-foreground">Raw Material Extraction</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">35%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-accent/5 hover:bg-red-accent/10 transition-colors">
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-3"></div>
                        <span className="text-sm font-medium text-foreground">Manufacturing</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">28%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-foreground mr-3"></div>
                        <span className="text-sm font-medium text-foreground">Transportation</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">22%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-accent/5 hover:bg-red-accent/10 transition-colors">
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-red-accent mr-3"></div>
                        <span className="text-sm font-medium text-foreground">Use Phase</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">10%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-foreground mr-3"></div>
                        <span className="text-sm font-medium text-foreground">End of Life</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reduction Initiatives */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                <CardTitle className="flex items-center space-x-3 text-foreground">
                  <div className="p-2 bg-red-accent/10 rounded-lg">
                    <Leaf className="h-5 w-5 text-red-accent" />
                  </div>
                  <span className="text-lg font-semibold">Carbon Reduction Initiatives</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Current Initiatives</h4>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 rounded-lg bg-red-accent/5 hover:bg-red-accent/10 transition-colors">
                        <div className="p-1.5 bg-red-accent/20 rounded-full mr-3 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-red-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Renewable Energy Transition</p>
                          <p className="text-xs text-muted-foreground">80% renewable electricity by 2024</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg bg-red-accent/5 hover:bg-red-accent/10 transition-colors">
                        <div className="p-1.5 bg-red-accent/20 rounded-full mr-3 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-red-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Material Optimization</p>
                          <p className="text-xs text-muted-foreground">30% reduction in raw material usage</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg bg-red-accent/5 hover:bg-red-accent/10 transition-colors">
                        <div className="p-1.5 bg-red-accent/20 rounded-full mr-3 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-red-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Supply Chain Optimization</p>
                          <p className="text-xs text-muted-foreground">Local sourcing for 60% of materials</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Future Targets</h4>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <div className="p-1.5 bg-foreground/20 rounded-full mr-3 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Carbon Neutral by 2030</p>
                          <p className="text-xs text-muted-foreground">Net-zero emissions across all operations</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <div className="p-1.5 bg-foreground/20 rounded-full mr-3 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Circular Economy Model</p>
                          <p className="text-xs text-muted-foreground">100% recyclable products by 2028</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <div className="p-1.5 bg-foreground/20 rounded-full mr-3 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Science-Based Targets</p>
                          <p className="text-xs text-muted-foreground">1.5°C pathway alignment validation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification & Standards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-red-accent/10 pb-6 bg-gradient-to-r from-red-accent/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-red-accent/10 rounded-lg">
                      <Shield className="h-5 w-5 text-red-accent" />
                    </div>
                    <span className="text-lg font-semibold">Verification & Standards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Card className="rounded-lg border border-red-accent/20 bg-red-accent/5 hover:bg-red-accent/10 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-accent/20 rounded-full">
                            <CheckCircle className="h-4 w-4 text-red-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground">ISO 14067 Verified</h4>
                            <p className="text-xs text-muted-foreground mt-1">Product Carbon Footprint Standard</p>
                          </div>
                          <div className="text-xs text-muted-foreground">2024</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-lg border border-red-accent/20 bg-red-accent/5 hover:bg-red-accent/10 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-accent/20 rounded-full">
                            <CheckCircle className="h-4 w-4 text-red-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground">GHG Protocol Compliant</h4>
                            <p className="text-xs text-muted-foreground mt-1">Corporate Accounting Standard</p>
                          </div>
                          <div className="text-xs text-muted-foreground">Valid</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-lg border border-red-accent/20 bg-red-accent/5 hover:bg-red-accent/10 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-accent/20 rounded-full">
                            <CheckCircle className="h-4 w-4 text-red-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground">PAS 2050 Certified</h4>
                            <p className="text-xs text-muted-foreground mt-1">Lifecycle GHG Assessment</p>
                          </div>
                          <div className="text-xs text-muted-foreground">2024</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[15px] border border-foreground/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-foreground/10 pb-6 bg-gradient-to-r from-foreground/5 to-transparent">
                  <CardTitle className="flex items-center space-x-3 text-foreground">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                      <FileText className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-lg font-semibold">Documentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-foreground mr-3" />
                        <span className="text-sm font-medium text-foreground">Carbon Footprint Report 2024</span>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-foreground mr-3" />
                        <span className="text-sm font-medium text-foreground">LCA Methodology Document</span>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-foreground mr-3" />
                        <span className="text-sm font-medium text-foreground">Third-Party Verification</span>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-foreground mr-3" />
                        <span className="text-sm font-medium text-foreground">Reduction Roadmap</span>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <Card className="rounded-[15px] border border-red-accent/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <Button className="bg-red-accent hover:bg-red-accent/90 text-white w-full md:w-auto transition-transform hover:scale-105">
                    <Download className="h-4 w-4 mr-2" />
                    Download Carbon Report
                  </Button>
                  <Button variant="outline" className="border-red-accent text-red-accent hover:bg-red-accent/10 w-full md:w-auto transition-transform hover:scale-105">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Latest Assessment
                  </Button>
                  <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground/10 w-full md:w-auto transition-transform hover:scale-105">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Compare with Industry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>
  );
};

export default VendorProfile;