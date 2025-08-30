
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedDocumentCenter } from "@/components/applicant/EnhancedDocumentCenter";
import { DocumentCenter } from "@/components/applicant/DocumentCenter";
import { ReportGenerator } from "@/components/document/ReportGenerator";
import { DashboardBuilder } from "@/components/document/DashboardBuilder";
import { DocumentKPICards } from "@/components/document/DocumentKPICards";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Database, Download, FileText, Search, Archive, RefreshCw, Brain, Filter, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Applicant } from "@/pages/ApplicantTracking";

const mockApplicant: Applicant = {
  id: '1',
  serialNumber: 1,
  rfpName: 'Cloud Infrastructure Services',
  rfpNumber: 'RFP-2024-001',
  applicantName: 'TechCorp Solutions',
  applicantId: 'APP-001',
  category: 'IT Services',
  qualified: true,
  aiScore: 87,
  workflowStep: 'Human Review - Compliance',
  lastHumanReview: '2024-01-20T10:30:00Z',
  status: 'Under Review',
  submissionDate: '2024-01-15T14:22:00Z'
};

const DocumentCenterPage = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleRepositoryAction = (action: string) => {
    toast({
      title: "Repository Action",
      description: `${action} completed successfully!`,
      className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleViewDocument = (docName: string) => {
    toast({
      title: "Document View",
      description: `Opening ${docName} for viewing`,
      className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleViewStatistics = () => {
    toast({
      title: "Statistics View",
      description: "Loading detailed repository statistics",
      className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Report Generated",
        description: "AI report has been successfully generated!",
        className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    }, 4000);
  };

  const recentDocuments = [
    'Technical Specification v2.pdf', 
    'Financial Proposal.docx', 
    'Compliance Certificate.pdf', 
    'Project Timeline.xlsx', 
    'Risk Assessment Report.pdf', 
    'Vendor Evaluation Form.docx', 
    'Legal Agreement Draft.pdf', 
    'Budget Analysis Q4.xlsx'
  ];

  const filteredDocuments = recentDocuments.filter(doc => 
    doc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-[10px]">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Document Center
            </h1>
            <p className="text-gray-600 mt-2">
              Centralized document management and processing hub
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <DocumentKPICards />

        <MinimalTabs defaultValue="documents" className="space-y-[10px]">
          <MinimalTabsList className="bg-white rounded-lg border border-gray-200 p-1">
            <MinimalTabsTrigger value="documents" className="flex items-center gap-2 rounded-lg">
              <FileText size={16} />
              Document Upload & Processing
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="management" className="flex items-center gap-2 rounded-lg">
              <Settings size={16} />
              Document Management
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="repository" className="flex items-center gap-2 rounded-lg">
              <Database size={16} />
              Document Repository
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="reports" className="flex items-center gap-2 rounded-lg">
              <FileText size={16} />
              Report Generator
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="dashboard" className="flex items-center gap-2 rounded-lg">
              <FolderOpen size={16} />
              Dashboard Builder
            </MinimalTabsTrigger>
          </MinimalTabsList>

          <MinimalTabsContent value="documents">
            <EnhancedDocumentCenter applicant={mockApplicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="management">
            <DocumentCenter applicant={mockApplicant} />
          </MinimalTabsContent>

          <MinimalTabsContent value="repository">
            <div className="space-y-[10px]">
              <Card className="rounded-lg border border-gray-200">
                <CardHeader className="bg-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900">
                    <Database size={20} />
                    Document Repository
                  </CardTitle>
                  <p className="text-sm text-blue-700">
                    Centralized storage and management for all project documents
                  </p>
                </CardHeader>
                <CardContent className="bg-white rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="flex items-center gap-2 h-16 rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50">
                      <Search size={20} />
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Search Documents</div>
                        <div className="text-xs text-gray-500">Find specific files</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 h-16 rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50">
                      <Archive size={20} />
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Archive Documents</div>
                        <div className="text-xs text-gray-500">Organize old files</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 h-16 rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50">
                      <Download size={20} />
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Export Repository</div>
                        <div className="text-xs text-gray-500">Download all files</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg border border-gray-200">
                <CardHeader className="rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Documents</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 w-64 rounded-lg"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowFilter(!showFilter)}
                        className="rounded-lg"
                      >
                        <Filter size={14} />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="rounded-b-lg">
                  <div className="space-y-3">
                    {filteredDocuments.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleViewDocument(doc)} className="rounded-lg">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg border border-gray-200">
                <CardHeader className="rounded-t-lg">
                  <CardTitle>Repository Statistics</CardTitle>
                </CardHeader>
                <CardContent className="rounded-b-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Documents</span>
                      <span className="font-semibold">1,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed</span>
                      <span className="font-semibold">1,432</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Review</span>
                      <span className="font-semibold">415</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Archive Size</span>
                      <span className="font-semibold">2.8 GB</span>
                    </div>
                    <Button onClick={handleViewStatistics} className="w-full mt-4 rounded-lg" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="reports">
            <div className="relative">
              <div className="space-y-[10px]">
                <ReportGenerator onGenerateReport={handleGenerateReport} />
              </div>
              
              {/* Full Screen Loader */}
              {isGeneratingReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Brain className="animate-pulse" size={20} />
                      <span className="font-semibold">AI Processing</span>
                    </div>
                    <p className="text-gray-600">Generating comprehensive report...</p>
                    <div className="mt-4 flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{
                          animationDelay: '0.1s'
                        }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{
                          animationDelay: '0.2s'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="dashboard">
            <DashboardBuilder />
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>
  );
};

export default DocumentCenterPage;
