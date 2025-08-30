import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  ExternalLink, 
  Download, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  RefreshCw, 
  Calendar,
  DollarSign,
  Shield,
  Globe,
  BarChart3,
  Eye,
  Link,
  Target,
  Settings,
  Award,
  PieChart,
  X,
  MapPin,
  Building,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { mockRFPs } from "@/pages/RFPManagement";

export const SourcingInsightsTab = ({ rfpId }: { rfpId: string }) => {
  console.log("SourcingInsightsTab component loaded - all variables defined correctly");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState("");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("");
  
  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Real-time insights states
  const [selectedInsightSection, setSelectedInsightSection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  // Add state for API answer
  const [insightAnswer, setInsightAnswer] = useState<string>("");

  const handleAction = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} functionality implemented successfully.`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleViewVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleGenerateInsights = async () => {
    if (!selectedInsightSection) {
      toast({
        title: "Please select a section",
        description: "Choose a section from the dropdown to generate insights.",
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
      return;
    }
    setIsLoading(true);
    setHasGeneratedContent(false);
    setInsightAnswer("");
    try {
      // Compose user_input as: '<Section Label> for <RFP Name> in India'
      const sectionLabel = insightSections.find(s => s.value === selectedInsightSection)?.label || selectedInsightSection;
      console.log("Selected RFP:", rfpId);
      const rfpName = mockRFPs.find(rfp => rfp.id === rfpId)?.name || "Selected RFP";
      // const rfpName = mockRFPs[3]?.name || "Selected RFP";
      const userInput = `${sectionLabel} for ${rfpName} in India`;
      const payload = {
        token: "qhfntisbn866dbTHNfkfkshxcvbnmhg",
        conversation: [],
        user_input: userInput
      };
      const response = await fetch('https://7fdabeepxxx27vd5u35owniyu40avlvr.lambda-url.us-west-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data && typeof data === 'object' && 'answer' in data) {
        setInsightAnswer(data.answer);
      } else {
        setInsightAnswer("No answer received from API.");
      }
      setHasGeneratedContent(true);
      toast({
        title: "Insights Generated",
        description: `Real-time insights for ${sectionLabel} have been generated successfully.`,
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    } catch (error) {
      setInsightAnswer("");
      toast({
        title: "Error generating insights",
        description: "Failed to get insights from API. Please try again.",
        variant: "destructive",
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const insightSections = [
    { value: "market-research", label: "Market Research" },
    { value: "top-vendor-analysis", label: "Top Vendor Analysis" },
    { value: "top-products-services", label: "Top Products / Services Analysis" },
    { value: "key-risk-concerns", label: "Key Risk Concerns" },
    { value: "regulations-compliance", label: "Regulations & Compliance Landscape" }
  ];

  // Market Research Reports Data (Enhanced)
  const marketReports = [
    {
      title: "Transportation & Logistics Market Analysis 2024",
      source: "Internal Analysis",
      date: "2024-01-15",
      findings: "87% of logistics companies investing in fleet modernization",
      industry: "Transportation",
      summary: "Comprehensive analysis of transportation trends showing shift towards eco-friendly vehicles, route optimization, and real-time tracking systems across logistics providers.",
      keyPoints: [
        "87% of companies modernizing fleet operations",
        "Electric vehicle adoption increased by 45% in 2023",
        "GPS tracking implementation up 78%",
        "Average fleet upgrade budget: ₹25Cr per company"
      ],
      recommendations: [
        "Prioritize fuel-efficient vehicle procurement",
        "Invest in real-time tracking systems",
        "Consider electric vehicle transition",
        "Implement predictive maintenance programs"
      ]
    },
    {
      title: "Freight & Haulage Services Market Report Q4 2023",
      source: "McKinsey",
      date: "2023-12-20",
      findings: "On-time delivery rates improved by 23%",
      industry: "Logistics",
      summary: "Market analysis revealing improvements in delivery performance with adoption of route optimization software and enhanced driver training programs.",
      keyPoints: [
        "23% improvement in on-time delivery rates",
        "Route optimization software adoption: 68%",
        "Driver training program effectiveness: 89%",
        "Average operational cost reduction: 15%"
      ],
      recommendations: [
        "Implement advanced route planning systems",
        "Enhance driver certification programs",
        "Invest in vehicle maintenance scheduling",
        "Establish performance monitoring dashboards"
      ]
    },
    {
      title: "Supply Chain Resilience in Transportation",
      source: "Deloitte",
      date: "2024-01-10",
      findings: "72% of transport companies building backup capacity",
      industry: "Supply Chain",
      summary: "Analysis of transportation resilience strategies focusing on backup fleet capacity, alternative route planning, and vendor diversification approaches.",
      keyPoints: [
        "72% companies building backup transportation capacity",
        "Alternative route planning adoption: 85%",
        "Multi-vendor strategy implementation: 64%",
        "Average contingency investment: ₹18Cr"
      ],
      recommendations: [
        "Develop backup transportation capacity",
        "Create alternative route contingency plans",
        "Diversify transportation vendor base",
        "Implement real-time supply chain visibility"
      ]
    }
  ];

  // Top Vendors Data (Enhanced)
  const allVendors = [
    { 
      name: "Swift Logistics Solutions", 
      industry: "Transportation", 
      quality: 94, 
      delivery: 96, 
      cost: 89, 
      region: "India",
      establishedYear: 2008,
      employeeCount: "12,000+",
      revenue: "₹8,500 crore",
      projects: [
        "National Highway Freight Services",
        "Multi-Modal Transportation Hub", 
        "Last-Mile Delivery Network"
      ],
      certifications: ["ISO 9001", "ISO 14001", "OHSAS 18001"],
      contactInfo: {
        email: "business@swiftlogistics.com",
        phone: "+91-11-4567-8900",
        address: "Swift House, Sector 18, Gurugram"
      }
    },
    { 
      name: "GreenTransport Corporation", 
      industry: "Eco-Logistics", 
      quality: 91, 
      delivery: 93, 
      cost: 87, 
      region: "India",
      establishedYear: 2015,
      employeeCount: "8,500+",
      revenue: "₹5,200 crore",
      projects: [
        "Electric Vehicle Fleet Management",
        "Carbon-Neutral Delivery Services",
        "Sustainable Transportation Solutions"
      ],
      certifications: ["ISO 14001", "Carbon Trust Standard", "Green Building Council"],
      contactInfo: {
        email: "contact@greentransport.in",
        phone: "+91-80-2345-6789",
        address: "Green Tower, Electronic City, Bangalore"
      }
    },
    { 
      name: "Rapid Delivery Services", 
      industry: "Express Logistics", 
      quality: 88, 
      delivery: 95, 
      cost: 92, 
      region: "India",
      establishedYear: 2010,
      employeeCount: "15,000+",
      revenue: "₹6,800 crore",
      projects: [
        "Same-Day Delivery Network",
        "Cold Chain Transportation",
        "E-commerce Logistics Solutions"
      ],
      certifications: ["ISO 9001", "GDP Certification", "HACCP"],
      contactInfo: {
        email: "info@rapiddelivery.co.in",
        phone: "+91-22-9876-5432",
        address: "Rapid Plaza, Andheri East, Mumbai"
      }
    },
    { 
      name: "OptimalRoute Logistics", 
      industry: "Smart Transportation", 
      quality: 90, 
      delivery: 89, 
      cost: 91, 
      region: "India",
      establishedYear: 2012,
      employeeCount: "6,800+",
      revenue: "₹4,100 crore",
      projects: [
        "AI-Powered Route Optimization",
        "Predictive Maintenance Systems",
        "IoT-Enabled Fleet Tracking"
      ],
      certifications: ["ISO 27001", "ISO 9001", "CMMI Level 3"],
      contactInfo: {
        email: "business@optimalroute.com",
        phone: "+91-40-1234-5678",
        address: "Tech Park, HITEC City, Hyderabad"
      }
    }
  ];

  // Top Products/Services Data (Enhanced)
  const allProducts = [
    { 
      name: "Fleet Management Services", 
      spend: "₹65Cr", 
      frequency: 24, 
      importance: "Critical",
      category: "Transportation",
      description: "Comprehensive fleet management including vehicle tracking, maintenance scheduling, driver management, and route optimization for government transportation needs.",
      marketTrends: "Growing at 28% annually with increased adoption of IoT and telematics solutions",
      topVendors: ["Swift Logistics", "OptimalRoute", "GreenTransport", "TechFleet Solutions"],
      averageContractSize: "₹2.7Cr",
      riskFactors: ["Vehicle breakdown", "Driver shortage", "Fuel price volatility"],
      futureOutlook: "Expected 35% growth with electric vehicle adoption and AI-powered optimization"
    },
    { 
      name: "Freight Transportation", 
      spend: "₹85Cr", 
      frequency: 36, 
      importance: "Critical",
      category: "Logistics",
      description: "Long-haul and short-haul freight transportation services including dedicated routes, consolidated shipments, and specialized cargo handling.",
      marketTrends: "15% annual growth driven by e-commerce expansion and infrastructure development",
      topVendors: ["Rapid Delivery", "National Freight Corp", "Express Logistics", "CargoConnect"],
      averageContractSize: "₹2.4Cr",
      riskFactors: ["Weather disruptions", "Route congestion", "Regulatory changes"],
      futureOutlook: "Strong growth expected with multimodal transportation integration"
    },
    { 
      name: "Vehicle Maintenance Services", 
      spend: "₹42Cr", 
      frequency: 48, 
      importance: "High",
      category: "Maintenance",
      description: "Preventive and corrective maintenance services for government vehicle fleets including parts supply, repairs, and emergency roadside assistance.",
      marketTrends: "Shift towards predictive maintenance using IoT sensors and data analytics",
      topVendors: ["AutoCare Services", "FleetMaintain Pro", "VehicleTech Solutions", "MaintainMax"],
      averageContractSize: "₹0.9Cr",
      riskFactors: ["Parts availability", "Technician shortage", "Equipment downtime"],
      futureOutlook: "Migration to predictive maintenance models expected to reduce costs by 20%"
    },
    { 
      name: "Transportation Technology Solutions", 
      spend: "₹38Cr", 
      frequency: 12, 
      importance: "High",
      category: "Technology",
      description: "Advanced transportation management systems including GPS tracking, route optimization software, and fleet analytics platforms.",
      marketTrends: "22% growth with increased focus on real-time visibility and automation",
      topVendors: ["TechFleet", "RouteOptima", "FleetVision", "TransportAI"],
      averageContractSize: "₹3.2Cr",
      riskFactors: ["Technology integration", "Data security", "System compatibility"],
      futureOutlook: "Increased demand for AI-powered transportation analytics and autonomous systems"
    }
  ];

  // Price Trends Data
  const priceTrends = [
    { month: "Jul", fleetServices: 65000, freightTransport: 85000, maintenance: 42000 },
    { month: "Aug", fleetServices: 67000, freightTransport: 87000, maintenance: 44000 },
    { month: "Sep", fleetServices: 66000, freightTransport: 89000, maintenance: 43000 },
    { month: "Oct", fleetServices: 68000, freightTransport: 86000, maintenance: 45000 },
    { month: "Nov", fleetServices: 69000, freightTransport: 90000, maintenance: 46000 },
    { month: "Dec", fleetServices: 71000, freightTransport: 88000, maintenance: 47000 }
  ];

  // Risk Data
  const riskConcerns = [
    { category: "Fuel Price Volatility", level: "High", trend: "increasing", impact: "12% cost increase in transportation" },
    { category: "Driver Shortage", level: "Medium", trend: "stable", impact: "Service delivery delays" },
    { category: "Vehicle Breakdown Risk", level: "Medium", trend: "decreasing", impact: "Route disruptions" },
    { category: "Regulatory Compliance", level: "High", trend: "increasing", impact: "Compliance and penalty costs" }
  ];

  // Regulations Data
  const regulations = [
    {
      name: "Motor Vehicle Amendment Act 2023",
      industry: "Transportation",
      requirements: "Enhanced driver licensing, vehicle safety standards",
      effectiveDate: "2024-01-01",
      riskLevel: "High"
    },
    {
      name: "Environmental Clearance for Fleet Operations",
      industry: "Logistics",
      requirements: "Emission standards compliance, green fuel adoption",
      effectiveDate: "2023-06-15",
      riskLevel: "Medium"
    },
    {
      name: "Road Transport & Safety Regulations",
      industry: "Transportation",
      requirements: "GPS mandates, driver rest hours, load limits",
      effectiveDate: "2023-04-01",
      riskLevel: "High"
    }
  ];

  // Filter functions
  console.log("allVendors defined:", !!allVendors, "length:", allVendors?.length);
  console.log("allProducts defined:", !!allProducts, "length:", allProducts?.length);
  
  const filteredVendors = allVendors.filter(vendor => {
    const industryMatch = !selectedIndustryFilter || selectedIndustryFilter === "all" || 
                         vendor.industry.toLowerCase().includes(selectedIndustryFilter.toLowerCase());
    const regionMatch = !selectedRegionFilter || selectedRegionFilter === "all" || 
                       vendor.region.toLowerCase().includes(selectedRegionFilter.toLowerCase());
    return industryMatch && regionMatch;
  });

  const filteredProducts = allProducts.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Real-time Insights Section */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <Search className="w-5 h-5 text-white" />
            </div>
            Get Real-time Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Section for Insights
              </label>
              <Select value={selectedInsightSection} onValueChange={setSelectedInsightSection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a section to analyze..." />
                </SelectTrigger>
                <SelectContent>
                  {insightSections.map((section) => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateInsights}
              disabled={!selectedInsightSection || isLoading}
              className="bg-red-muted hover:bg-red-muted/90 text-white px-6"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Get Insights
                </>
              )}
            </Button>
          </div>

          {/* Insight Content Area */}
          <div className="min-h-[300px] border border-gray-200 rounded-lg p-6">
            {!selectedInsightSection && !hasGeneratedContent ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Insights</h3>
                <p className="text-gray-600 max-w-md">
                  Select a section from the dropdown above and click "Get Insights" to generate real-time analysis and recommendations.
                </p>
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <RefreshCw className="w-5 h-5 animate-spin text-red-muted" />
                  <span className="text-lg font-medium text-gray-900">
                    Generating insights for {insightSections.find(s => s.value === selectedInsightSection)?.label}...
                  </span>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <div className="mt-6">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </div>
            ) : hasGeneratedContent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-medium text-gray-900">
                    Real-time insights for {insightSections.find(s => s.value === selectedInsightSection)?.label}
                  </span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 whitespace-pre-line">
                    {insightAnswer}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* 1. Market Research Reports Lookup */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Market Research Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search reports by keywords, industry, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="internal">Internal Analysis</SelectItem>
                  <SelectItem value="gartner">Gartner</SelectItem>
                  <SelectItem value="forrester">Forrester</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleAction("Upload New Report")} className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Report
              </Button>
            </div>

            {/* Reports Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Report Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Key Findings</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {marketReports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.title}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{report.source}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.findings}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewReport(report)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction(`Download ${report.title}`)}>
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction(`Link to RFP`)}>
                            <Link className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Top Vendors Analysis */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            Top Vendors Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Select value={selectedIndustryFilter} onValueChange={setSelectedIndustryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="it services">IT Services</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRegionFilter} onValueChange={setSelectedRegionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Top Vendors Grid - Enhanced UI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVendors.map((vendor, index) => (
                <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer" onClick={() => handleViewVendor(vendor)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-accent/5 to-red-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{vendor.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{vendor.industry}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{vendor.region}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-green-100 text-green-800 mb-2">Top Rated</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{((vendor.quality + vendor.delivery + vendor.cost) / 3).toFixed(1)}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{vendor.quality}%</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Quality
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{vendor.delivery}%</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          Delivery
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{vendor.cost}%</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Cost Eff.
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Click to view detailed profile
                    </div>
                  </CardContent>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Top Products/Services Analysis */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Top Products / Services Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Enhanced Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product, index) => (
                <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer" onClick={() => handleViewProduct(product)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          <Badge className={`text-xs ${
                            product.importance === "Critical" ? "bg-red-100 text-red-800" :
                            product.importance === "High" ? "bg-orange-100 text-orange-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {product.importance}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{product.spend}</div>
                        <div className="text-xs text-gray-500">Total Spend</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{product.frequency}</div>
                        <div className="text-xs text-gray-600">Purchases/Year</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{product.averageContractSize}</div>
                        <div className="text-xs text-gray-600">Avg Contract</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Click to view detailed analysis
                    </div>
                  </CardContent>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Average Price Trends */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Average Price Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select product/service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud Infrastructure Services</SelectItem>
                  <SelectItem value="cyber">Cybersecurity Solutions</SelectItem>
                  <SelectItem value="software">Software Licenses</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last 1 year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="cloudServices" stroke="hsl(var(--red-muted))" strokeWidth={3} name="Cloud Services" />
                  <Line type="monotone" dataKey="cybersecurity" stroke="hsl(var(--red-accent))" strokeWidth={2} name="Cybersecurity" />
                  <Line type="monotone" dataKey="software" stroke="hsl(var(--red-accent-light))" strokeWidth={2} name="Software" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Key Risk Concerns */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            Key Risk Concerns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riskConcerns.map((risk, index) => (
              <Card key={index} className={`p-4 ${
                risk.level === "High" ? "border-red-200 bg-red-50" :
                risk.level === "Medium" ? "border-yellow-200 bg-yellow-50" :
                "border-green-200 bg-green-50"
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{risk.category}</h4>
                  <Badge 
                    variant="outline"
                    className={
                      risk.level === "High" ? "border-red-300 text-red-700" :
                      risk.level === "Medium" ? "border-yellow-300 text-yellow-700" :
                      "border-green-300 text-green-700"
                    }
                  >
                    {risk.level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{risk.impact}</p>
                <div className="flex items-center gap-1 text-xs">
                  {risk.trend === "increasing" ? (
                    <TrendingUp className="w-3 h-3 text-red-600" />
                  ) : risk.trend === "decreasing" ? (
                    <TrendingDown className="w-3 h-3 text-green-600" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                  <span className="text-gray-600 capitalize">{risk.trend}</span>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Regulations & Compliance Landscape */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <div className="bg-red-muted p-2 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Regulations & Compliance Landscape
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search regulations by type or jurisdiction..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Regulation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="privacy">Data Privacy</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="procurement">Procurement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Regulations Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Regulation Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Industry</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Key Requirements</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Effective Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Risk Level</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {regulations.map((regulation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{regulation.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{regulation.industry}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{regulation.requirements}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{regulation.effectiveDate}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          className={
                            regulation.riskLevel === "High" ? "bg-red-100 text-red-800" :
                            regulation.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }
                        >
                          {regulation.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => handleAction(`View ${regulation.name}`)}>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Components */}
      
      {/* Report Details Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-muted p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedReport?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Market Research Report</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleAction(`Download ${selectedReport?.title}`)} 
                  className="bg-red-muted hover:bg-red-muted/90 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <DialogClose>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-8 p-6">
              {/* Report Metadata - Red/Black Theme */}
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Report Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-muted p-2 rounded-lg">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Source</div>
                        <Badge variant="outline" className="mt-1 border-red-muted text-red-muted bg-red-50">
                          {selectedReport.source}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Publication Date</div>
                        <div className="font-medium text-gray-900 mt-1">{selectedReport.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-red-accent p-2 rounded-lg">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Industry Focus</div>
                        <div className="font-medium text-gray-900 mt-1">{selectedReport.industry}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Executive Summary - Updated */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <FileText className="w-5 h-5 text-gray-900" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed text-base">{selectedReport.summary}</p>
                </CardContent>
              </Card>

              {/* Key Findings - Updated */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <CheckCircle className="w-5 h-5 text-gray-900" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReport.keyPoints?.map((point: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="bg-gray-900 p-1 rounded-full mt-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strategic Recommendations - Updated */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <Star className="w-5 h-5 text-gray-900" />
                    Strategic Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {selectedReport.recommendations?.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="bg-gray-900 p-1 rounded-full mt-1">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendor Profile Modal */}
      <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
        <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedVendor?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Vendor Profile</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleAction(`Download ${selectedVendor?.name} Profile`)} 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <DialogClose>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedVendor && (
            <div className="space-y-6 p-6">
              {/* Company Information - KPI Cards Style */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Industry KPI Card */}
                    <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-red-muted p-2 rounded-xl">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-600">Industry</div>
                          <div className="text-lg font-bold text-gray-900">{selectedVendor.industry}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Region KPI Card */}
                    <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-gray-900 p-2 rounded-xl">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-600">Region</div>
                          <div className="text-lg font-bold text-gray-900">{selectedVendor.region}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Established KPI Card */}
                    <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-red-accent p-2 rounded-xl">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-600">Established</div>
                          <div className="text-lg font-bold text-gray-900">{selectedVendor.establishedYear}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Employees KPI Card */}
                    <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-gray-900 p-2 rounded-xl">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-600">Employees</div>
                          <div className="text-lg font-bold text-gray-900">{selectedVendor.employeeCount}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Revenue KPI Card */}
                    <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-red-muted p-2 rounded-xl">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-600">Revenue</div>
                          <div className="text-lg font-bold text-gray-900">{selectedVendor.revenue}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics - Full Width */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Quality Score</div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{selectedVendor.quality}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-red-muted h-4 rounded-full transition-all duration-300" 
                            style={{ width: `${selectedVendor.quality}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Delivery Performance</div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{selectedVendor.delivery}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-gray-900 h-4 rounded-full transition-all duration-300" 
                            style={{ width: `${selectedVendor.delivery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Cost Effectiveness</div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{selectedVendor.cost}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-red-accent h-4 rounded-full transition-all duration-300" 
                            style={{ width: `${selectedVendor.cost}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Overall Rating</div>
                      <div className="flex items-center justify-center gap-3">
                        <Star className="w-8 h-8 text-red-muted fill-current" />
                        <span className="text-4xl font-bold text-gray-900">
                          {((selectedVendor.quality + selectedVendor.delivery + selectedVendor.cost) / 3).toFixed(1)}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projects - Full Width */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedVendor.projects?.map((project: string, index: number) => (
                      <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-muted p-1 rounded-full mt-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="font-medium text-sm text-gray-900">{project}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications - Full Width */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900">Certifications & Standards</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {selectedVendor.certifications?.map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-red-muted text-red-muted bg-red-50 px-4 py-2 text-sm">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information - Full Width */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-gray-900 p-3 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Email Address</div>
                        <div className="font-medium text-gray-900 text-sm">{selectedVendor.contactInfo?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-red-accent p-3 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Phone Number</div>
                        <div className="font-medium text-gray-900 text-sm">{selectedVendor.contactInfo?.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-gray-900 p-3 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Office Address</div>
                        <div className="font-medium text-gray-900 text-sm">{selectedVendor.contactInfo?.address}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product/Service Details Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProduct?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Market Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleAction(`Download ${selectedProduct?.name} Analysis`)} 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <DialogClose>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6 p-6">
              {/* Product Overview */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <Badge variant="outline">{selectedProduct.category}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Spend</div>
                  <div className="text-xl font-bold text-gray-900">{selectedProduct.spend}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Importance</div>
                  <Badge className={
                    selectedProduct.importance === "Critical" ? "bg-red-100 text-red-800" :
                    selectedProduct.importance === "High" ? "bg-gray-100 text-gray-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {selectedProduct.importance}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Market Statistics */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Procurement Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Frequency</span>
                      <span className="font-medium">{selectedProduct.frequency}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Contract Size</span>
                      <span className="font-medium">{selectedProduct.averageContractSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Annual Spend</span>
                      <span className="font-medium">{selectedProduct.spend}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Market Trends</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedProduct.marketTrends}</p>
                </Card>
              </div>

              {/* Top Vendors */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3">Top Vendors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedProduct.topVendors?.map((vendor: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow">
                      <div className="font-medium text-sm text-gray-900">{vendor}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Risk Factors */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {selectedProduct.riskFactors?.map((risk: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertTriangle className="w-4 h-4 text-red-muted" />
                      <span className="text-gray-700 text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Future Outlook */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3">Future Outlook</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProduct.futureOutlook}</p>
              </Card>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};