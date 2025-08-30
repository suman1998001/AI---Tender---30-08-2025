import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Clock, FileStack, AlertCircle, Plus, Search, Filter, Download, Eye, Share, Archive, Upload, X, FileSignature, ShoppingCart, Mail, BarChart3, FileIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneralDocumentDrafter = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleGenerateDocument = () => {
    navigate("/document-drafter/generate");
  };

  const kpis = [
    {
      title: "Documents Generated This Month",
      value: "25",
      subtitle: "+15% from last month",
      icon: FileText,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-muted"
    },
    {
      title: "Avg. Document Generation Time",
      value: "5 min",
      subtitle: "2min faster than average",
      icon: Clock,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-muted"
    },
    {
      title: "Templates Available",
      value: "45",
      subtitle: "Across 8 categories",
      icon: FileStack,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-muted"
    },
    {
      title: "Pending Approvals",
      value: "3",
      subtitle: "Requires attention",
      icon: AlertCircle,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-muted"
    }
  ];

  const documents = {
    contracts: [
      { id: 1, name: "Service Agreement - IT Support", type: "Contract", date: "2024-01-15", status: "Finalized", content: "This is a comprehensive IT support service agreement that outlines the terms and conditions for providing technical support services to our organization. The agreement covers scope of services, response times, escalation procedures, and service level agreements." },
      { id: 2, name: "Vendor Agreement - Catering", type: "Contract", date: "2024-01-14", status: "Draft", content: "Catering services agreement for corporate events and meetings. This contract establishes the framework for food and beverage services, including menu options, pricing structure, delivery requirements, and quality standards." },
      { id: 3, name: "NDA - Software Development", type: "Contract", date: "2024-01-12", status: "Sent", content: "Non-disclosure agreement for software development project involving proprietary technologies and confidential business information. This document ensures protection of intellectual property and sensitive data." },
      { id: 4, name: "Maintenance Contract - HVAC", type: "Contract", date: "2024-01-11", status: "Finalized", content: "HVAC maintenance and service contract covering regular inspections, preventive maintenance, emergency repairs, and system optimization to ensure optimal performance of heating, ventilation, and air conditioning systems." },
      { id: 5, name: "Partnership Agreement - Marketing", type: "Contract", date: "2024-01-10", status: "Draft", content: "Strategic partnership agreement for joint marketing initiatives and brand collaboration between organizations." },
      { id: 6, name: "Employment Contract - Senior Developer", type: "Contract", date: "2024-01-09", status: "Finalized", content: "Employment contract for senior software developer position including compensation, benefits, and job responsibilities." },
      { id: 7, name: "Lease Agreement - Office Space", type: "Contract", date: "2024-01-08", status: "Sent", content: "Commercial lease agreement for office space rental including terms, conditions, and renewal options." },
      { id: 8, name: "Service Contract - Security Services", type: "Contract", date: "2024-01-07", status: "Draft", content: "Security services contract for building protection and monitoring services during business hours." },
      { id: 9, name: "Supplier Agreement - Raw Materials", type: "Contract", date: "2024-01-06", status: "Finalized", content: "Long-term supplier agreement for raw material procurement with volume discounts and delivery schedules." },
      { id: 10, name: "Consulting Agreement - Financial Advisory", type: "Contract", date: "2024-01-05", status: "Sent", content: "Financial consulting agreement for advisory services on investment strategies and portfolio management." },
      { id: 11, name: "Software License Agreement", type: "Contract", date: "2024-01-04", status: "Finalized", content: "Software licensing agreement for enterprise applications with usage rights and maintenance terms." },
      { id: 12, name: "Distribution Agreement - Regional", type: "Contract", date: "2024-01-03", status: "Draft", content: "Regional distribution agreement for product sales and territory management in specific geographic areas." },
      { id: 13, name: "Joint Venture Agreement", type: "Contract", date: "2024-01-02", status: "Sent", content: "Joint venture agreement for collaborative business development and shared resource utilization." },
      { id: 14, name: "Equipment Rental Agreement", type: "Contract", date: "2024-01-01", status: "Finalized", content: "Equipment rental agreement for specialized machinery and tools with maintenance and insurance provisions." },
      { id: 15, name: "Research Collaboration Agreement", type: "Contract", date: "2023-12-30", status: "Draft", content: "Research collaboration agreement between academic institutions and corporate entities for innovation projects." }
    ],
    purchaseOrders: [
      { id: 16, name: "PO-2024-001 - Office Supplies", type: "Purchase Order", date: "2024-01-16", status: "Finalized", content: "Purchase order for office supplies including stationery, paper products, writing instruments, and organizational materials for the quarterly restocking of all office locations." },
      { id: 17, name: "PO-2024-002 - Computer Equipment", type: "Purchase Order", date: "2024-01-15", status: "Draft", content: "Purchase order for computer equipment and accessories including laptops, monitors, keyboards, mice, and related peripherals for the IT infrastructure upgrade project." },
      { id: 18, name: "PO-2024-003 - Furniture", type: "Purchase Order", date: "2024-01-14", status: "Sent", content: "Purchase order for office furniture including desks, chairs, storage solutions, and meeting room furniture to support the office expansion and renovation project." },
      { id: 19, name: "PO-2024-004 - Cleaning Supplies", type: "Purchase Order", date: "2024-01-13", status: "Draft", content: "Purchase order for cleaning and maintenance supplies including disinfectants, paper products, cleaning equipment, and janitorial supplies for facility maintenance." },
      { id: 20, name: "PO-2024-005 - Software Licenses", type: "Purchase Order", date: "2024-01-12", status: "Finalized", content: "Purchase order for annual software licenses and subscriptions for productivity tools and enterprise applications." },
      { id: 21, name: "PO-2024-006 - Marketing Materials", type: "Purchase Order", date: "2024-01-11", status: "Sent", content: "Purchase order for promotional materials including brochures, banners, business cards, and trade show displays." },
      { id: 22, name: "PO-2024-007 - Industrial Tools", type: "Purchase Order", date: "2024-01-10", status: "Draft", content: "Purchase order for industrial tools and equipment required for manufacturing operations and maintenance." },
      { id: 23, name: "PO-2024-008 - Vehicle Fleet", type: "Purchase Order", date: "2024-01-09", status: "Finalized", content: "Purchase order for company vehicle fleet including cars, vans, and delivery trucks for business operations." },
      { id: 24, name: "PO-2024-009 - Safety Equipment", type: "Purchase Order", date: "2024-01-08", status: "Sent", content: "Purchase order for workplace safety equipment including protective gear, emergency supplies, and safety signage." },
      { id: 25, name: "PO-2024-010 - Server Hardware", type: "Purchase Order", date: "2024-01-07", status: "Draft", content: "Purchase order for server hardware and networking equipment for data center expansion project." },
      { id: 26, name: "PO-2024-011 - Laboratory Equipment", type: "Purchase Order", date: "2024-01-06", status: "Finalized", content: "Purchase order for specialized laboratory equipment and scientific instruments for research and testing." },
      { id: 27, name: "PO-2024-012 - Printing Services", type: "Purchase Order", date: "2024-01-05", status: "Sent", content: "Purchase order for professional printing services including reports, manuals, and marketing collateral." },
      { id: 28, name: "PO-2024-013 - Catering Services", type: "Purchase Order", date: "2024-01-04", status: "Draft", content: "Purchase order for catering services for corporate events, meetings, and employee appreciation functions." },
      { id: 29, name: "PO-2024-014 - Training Programs", type: "Purchase Order", date: "2024-01-03", status: "Finalized", content: "Purchase order for employee training programs and professional development courses across various departments." },
      { id: 30, name: "PO-2024-015 - Construction Materials", type: "Purchase Order", date: "2024-01-02", status: "Sent", content: "Purchase order for construction materials needed for office renovation and facility improvement projects." }
    ],
    letters: [
      { id: 31, name: "Vendor Inquiry - Stationery", type: "Letter", date: "2024-01-14", status: "Sent", content: "Inquiry letter to vendors regarding stationery supply capabilities, pricing structure, delivery options, and bulk order discounts for our organization's annual stationery requirements." },
      { id: 32, name: "Payment Reminder Notice", type: "Letter", date: "2024-01-13", status: "Finalized", content: "Payment reminder notice for overdue invoices, outlining payment terms, late fees, and consequences of continued non-payment. This letter serves as a formal notice before escalation." },
      { id: 33, name: "Welcome Letter - New Vendor", type: "Letter", date: "2024-01-12", status: "Draft", content: "Welcome letter for newly onboarded vendors, introducing them to our organization, outlining expectations, procedures, and contact information for ongoing collaboration." },
      { id: 34, name: "Contract Termination Notice", type: "Letter", date: "2024-01-11", status: "Sent", content: "Notice of contract termination due to breach of terms and conditions. This letter formally notifies the vendor of contract termination and outlines the transition process." },
      { id: 35, name: "Price Increase Notification", type: "Letter", date: "2024-01-10", status: "Finalized", content: "Notification letter regarding upcoming price adjustments due to market conditions and operational cost increases." },
      { id: 36, name: "Service Complaint Letter", type: "Letter", date: "2024-01-09", status: "Draft", content: "Formal complaint letter addressing service quality issues and requesting immediate corrective action from vendor." },
      { id: 37, name: "Product Recall Notice", type: "Letter", date: "2024-01-08", status: "Sent", content: "Product recall notification letter informing stakeholders about defective products and return procedures." },
      { id: 38, name: "Partnership Proposal", type: "Letter", date: "2024-01-07", status: "Finalized", content: "Partnership proposal letter outlining collaboration opportunities and mutual benefits for strategic business alliance." },
      { id: 39, name: "Invoice Dispute Letter", type: "Letter", date: "2024-01-06", status: "Draft", content: "Invoice dispute letter challenging billing discrepancies and requesting detailed invoice review and correction." },
      { id: 40, name: "Reference Request Letter", type: "Letter", date: "2024-01-05", status: "Sent", content: "Reference request letter seeking vendor testimonials and performance evaluations for procurement decisions." },
      { id: 41, name: "Credit Application Letter", type: "Letter", date: "2024-01-04", status: "Finalized", content: "Credit application letter requesting extended payment terms and credit facility establishment with suppliers." },
      { id: 42, name: "Quality Certification Request", type: "Letter", date: "2024-01-03", status: "Draft", content: "Quality certification request letter requiring vendors to provide quality standards documentation and certifications." },
      { id: 43, name: "Delivery Schedule Change", type: "Letter", date: "2024-01-02", status: "Sent", content: "Delivery schedule modification letter requesting changes to delivery dates and logistics arrangements." },
      { id: 44, name: "Insurance Coverage Verification", type: "Letter", date: "2024-01-01", status: "Finalized", content: "Insurance coverage verification letter requesting proof of insurance and liability coverage from vendors." }
    ],
    reports: [
      { id: 45, name: "Monthly Procurement Report", type: "Report", date: "2024-01-16", status: "Draft", content: "Comprehensive monthly procurement activity report detailing spending patterns, vendor performance, cost savings achieved, and key metrics for management review and decision-making." },
      { id: 46, name: "Vendor Performance Analysis", type: "Report", date: "2024-01-15", status: "Finalized", content: "Analysis of vendor performance metrics including delivery times, quality ratings, compliance scores, and cost effectiveness to evaluate ongoing vendor relationships." },
      { id: 47, name: "Cost Savings Report", type: "Report", date: "2024-01-14", status: "Finalized", content: "Report on cost savings achieved through strategic procurement initiatives, bulk purchasing agreements, vendor negotiations, and process improvements." },
      { id: 48, name: "Compliance Audit Report", type: "Report", date: "2024-01-13", status: "Draft", content: "Compliance audit report for procurement processes ensuring adherence to company policies, regulatory requirements, and industry best practices." },
      { id: 49, name: "Market Analysis Report", type: "Report", date: "2024-01-12", status: "Sent", content: "Market analysis report examining industry trends, supplier landscape, and competitive pricing for strategic procurement planning." },
      { id: 50, name: "Risk Assessment Report", type: "Report", date: "2024-01-11", status: "Finalized", content: "Risk assessment report identifying potential supply chain risks and mitigation strategies for business continuity." },
      { id: 51, name: "Sustainability Report", type: "Report", date: "2024-01-10", status: "Draft", content: "Sustainability report evaluating environmental impact of procurement practices and green initiative recommendations." },
      { id: 52, name: "Budget Variance Analysis", type: "Report", date: "2024-01-09", status: "Sent", content: "Budget variance analysis report comparing actual procurement spending against budgeted amounts with explanations for deviations." },
      { id: 53, name: "Supplier Diversity Report", type: "Report", date: "2024-01-08", status: "Finalized", content: "Supplier diversity report tracking minority and women-owned business participation in procurement activities." },
      { id: 54, name: "Technology Assessment Report", type: "Report", date: "2024-01-07", status: "Draft", content: "Technology assessment report evaluating new procurement technologies and digital transformation opportunities." },
      { id: 55, name: "Contract Renewal Analysis", type: "Report", date: "2024-01-06", status: "Sent", content: "Contract renewal analysis report assessing expiring contracts and recommendations for renewal or renegotiation." },
      { id: 56, name: "Procurement KPI Dashboard", type: "Report", date: "2024-01-05", status: "Finalized", content: "Key performance indicator dashboard report providing visual analytics of procurement metrics and trends." },
      { id: 57, name: "Fraud Detection Report", type: "Report", date: "2024-01-04", status: "Draft", content: "Fraud detection report analyzing suspicious activities and implementing controls to prevent procurement fraud." },
      { id: 58, name: "Training Effectiveness Report", type: "Report", date: "2024-01-03", status: "Sent", content: "Training effectiveness report measuring impact of procurement training programs on staff performance and knowledge." }
    ],
    others: [
      { id: 59, name: "Meeting Minutes - Vendor Review", type: "Minutes", date: "2024-01-14", status: "Finalized", content: "Minutes from vendor review meeting discussing performance evaluations, contract renewals, and strategic vendor partnerships for the upcoming fiscal year." },
      { id: 60, name: "Checklist - Vendor Onboarding", type: "Checklist", date: "2024-01-13", status: "Draft", content: "Vendor onboarding checklist and requirements including documentation needed, approval processes, system access setup, and orientation procedures." },
      { id: 61, name: "Policy Document - Procurement", type: "Policy", date: "2024-01-12", status: "Finalized", content: "Updated procurement policy document outlining procedures, approval hierarchies, spending limits, vendor selection criteria, and compliance requirements." },
      { id: 62, name: "Training Manual - New Staff", type: "Manual", date: "2024-01-11", status: "Draft", content: "Training manual for new procurement staff covering processes, systems, policies, and best practices for effective procurement management." },
      { id: 63, name: "Standard Operating Procedures", type: "SOP", date: "2024-01-10", status: "Sent", content: "Standard operating procedures for procurement workflows including requisition processing, vendor evaluation, and contract management." },
      { id: 64, name: "Emergency Procurement Guidelines", type: "Guidelines", date: "2024-01-09", status: "Finalized", content: "Emergency procurement guidelines for urgent purchases and crisis management situations requiring expedited processes." },
      { id: 65, name: "Vendor Code of Conduct", type: "Code", date: "2024-01-08", status: "Draft", content: "Vendor code of conduct outlining ethical standards, business practices, and compliance requirements for all suppliers." },
      { id: 66, name: "Contract Template - Services", type: "Template", date: "2024-01-07", status: "Sent", content: "Standardized contract template for service agreements with customizable terms and conditions for various service types." },
      { id: 67, name: "Procurement Calendar", type: "Calendar", date: "2024-01-06", status: "Finalized", content: "Annual procurement calendar scheduling key activities, contract renewals, budget cycles, and strategic planning sessions." },
      { id: 68, name: "Vendor Registration Form", type: "Form", date: "2024-01-05", status: "Draft", content: "Vendor registration form collecting supplier information, capabilities, certifications, and contact details for database entry." },
      { id: 69, name: "Cost Comparison Worksheet", type: "Worksheet", date: "2024-01-04", status: "Sent", content: "Cost comparison worksheet template for evaluating multiple vendor proposals and conducting pricing analysis." },
      { id: 70, name: "Quality Control Checklist", type: "Checklist", date: "2024-01-03", status: "Finalized", content: "Quality control checklist for incoming goods inspection and acceptance testing of delivered products and services." },
      { id: 71, name: "Procurement Glossary", type: "Reference", date: "2024-01-02", status: "Draft", content: "Comprehensive glossary of procurement terms, definitions, and acronyms for staff reference and training purposes." },
      { id: 72, name: "Vendor Performance Scorecard", type: "Scorecard", date: "2024-01-01", status: "Sent", content: "Vendor performance scorecard template for systematic evaluation and rating of supplier performance across multiple criteria." },
      { id: 73, name: "Contract Renewal Reminder", type: "Reminder", date: "2023-12-30", status: "Finalized", content: "Contract renewal reminder system documentation for tracking expiration dates and initiating renewal processes." },
      { id: 74, name: "Procurement Best Practices Guide", type: "Guide", date: "2023-12-29", status: "Draft", content: "Best practices guide for procurement professionals covering industry standards, efficiency tips, and strategic approaches." }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalized": return "bg-red-muted text-white";
      case "Draft": return "bg-gray-200 text-gray-800";
      case "Sent": return "bg-red-accent text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Contract": return FileSignature;
      case "Purchase Order": return ShoppingCart;
      case "Letter": return Mail;
      case "Report": return BarChart3;
      default: return FileIcon;
    }
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setIsViewModalOpen(true);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Document is being downloaded...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Started",
      description: "Document upload initiated...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleArchive = () => {
    toast({
      title: "Document Archived",
      description: "Document has been archived successfully.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
    setIsViewModalOpen(false);
  };

  const DocumentGrid = ({ docs }: { docs: any[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {docs.map((doc, index) => {
        const IconComponent = getDocumentIcon(doc.type);
        return (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-red-muted/10 rounded-lg">
                  <IconComponent className="h-6 w-6 text-red-muted" />
                </div>
                <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-red-muted transition-colors">
                  {doc.name}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{doc.type}</p>
                <p className="text-xs text-gray-500 mt-1">{doc.date}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-muted hover:text-red-accent hover:bg-red-muted/10"
                  onClick={() => handleViewDocument(doc)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-muted" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-muted">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-muted" onClick={handleArchive}>
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">General Document Drafter</h1>
            <p className="text-gray-600">Create, manage, and generate all your essential procurement documents efficiently.</p>
          </div>
          <Button onClick={handleGenerateDocument} className="bg-red-muted hover:bg-red-accent text-white">
            <Plus className="h-4 w-4 mr-2" />
            Generate New Document
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
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
                  {kpi.subtitle}
                </p>
              </CardContent>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>

        {/* Document Repository Section */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Generated Documents</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search documents..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MinimalTabs defaultValue="contracts" className="w-full">
              <MinimalTabsList className="bg-white rounded-lg border border-gray-200 p-1">
                <MinimalTabsTrigger value="contracts" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-red-muted data-[state=active]:text-white">
                  <FileSignature size={16} />
                  Contracts ({documents.contracts.length})
                </MinimalTabsTrigger>
                <MinimalTabsTrigger value="purchaseOrders" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-red-muted data-[state=active]:text-white">
                  <ShoppingCart size={16} />
                  Purchase Orders ({documents.purchaseOrders.length})
                </MinimalTabsTrigger>
                <MinimalTabsTrigger value="letters" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-red-muted data-[state=active]:text-white">
                  <Mail size={16} />
                  Letters ({documents.letters.length})
                </MinimalTabsTrigger>
                <MinimalTabsTrigger value="reports" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-red-muted data-[state=active]:text-white">
                  <BarChart3 size={16} />
                  Reports ({documents.reports.length})
                </MinimalTabsTrigger>
                <MinimalTabsTrigger value="others" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-red-muted data-[state=active]:text-white">
                  <FileIcon size={16} />
                  Others ({documents.others.length})
                </MinimalTabsTrigger>
              </MinimalTabsList>
              
              <MinimalTabsContent value="contracts" className="mt-6">
                <DocumentGrid docs={documents.contracts} />
              </MinimalTabsContent>
              
              <MinimalTabsContent value="purchaseOrders" className="mt-6">
                <DocumentGrid docs={documents.purchaseOrders} />
              </MinimalTabsContent>
              
              <MinimalTabsContent value="letters" className="mt-6">
                <DocumentGrid docs={documents.letters} />
              </MinimalTabsContent>
              
              <MinimalTabsContent value="reports" className="mt-6">
                <DocumentGrid docs={documents.reports} />
              </MinimalTabsContent>
              
              <MinimalTabsContent value="others" className="mt-6">
                <DocumentGrid docs={documents.others} />
              </MinimalTabsContent>
            </MinimalTabs>
          </CardContent>
        </Card>

        {/* Document View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {selectedDocument?.name}
                </DialogTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-4">
                {/* Document Metadata */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{selectedDocument.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{selectedDocument.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedDocument.status)}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white min-h-[400px]">
                  <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedDocument.content}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={handleUpload} className="border-red-muted text-red-muted hover:bg-red-muted hover:text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="border-red-muted text-red-muted hover:bg-red-muted hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleArchive} className="border-red-muted text-red-muted hover:bg-red-muted hover:text-white">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button onClick={() => setIsViewModalOpen(false)} className="bg-red-muted hover:bg-red-accent text-white">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GeneralDocumentDrafter;