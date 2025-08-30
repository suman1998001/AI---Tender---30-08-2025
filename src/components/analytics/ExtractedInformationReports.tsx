
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Filter, FileText, IndianRupee, Shield, TrendingUp, BarChart3, PieChart } from "lucide-react";

const extractedReports = [
  {
    id: "compliance",
    title: "Compliance Overview Dashboard",
    icon: Shield,
    description: "Compliance rates and status across all applications",
    totalApplications: 156,
    compliantRate: 78,
    nonCompliantRate: 15,
    pendingRate: 7,
    color: "from-black to-gray-800"
  },
  {
    id: "financial",
    title: "Financial Summary Dashboard", 
    icon: IndianRupee,
    description: "Aggregated financial data from proposals",
    totalValue: "24.5M",
    avgProposalValue: "157K",
    budgetCompliance: 85,
    color: "from-red-accent to-red-accent"
  },
  {
    id: "terms",
    title: "Key Term Frequency Dashboard",
    icon: FileText,
    description: "Analysis of key terms and clauses across documents",
    totalTerms: 1247,
    commonTerms: 89,
    flaggedTerms: 12,
    color: "from-black to-gray-800"
  }
];

const complianceData = [
  { category: "Technical Requirements", compliant: 89, total: 156 },
  { category: "Financial Criteria", compliant: 134, total: 156 },
  { category: "Legal Documentation", compliant: 142, total: 156 },
  { category: "Experience Requirements", compliant: 98, total: 156 }
];

const financialBreakdown = [
  { rfp: "RFP-2024-001", totalValue: "8.2M", avgBid: "164K", proposals: 50 },
  { rfp: "RFP-2024-002", totalValue: "6.8M", avgBid: "151K", proposals: 45 },
  { rfp: "RFP-2024-003", totalValue: "9.5M", avgBid: "158K", proposals: 61 }
];

export const ExtractedInformationReports = () => {
  const handleExportData = (reportType: string) => {
    console.log(`Exporting ${reportType} data...`);
    // Export functionality would be implemented here
  };

  const handleDrillDown = (reportId: string) => {
    console.log(`Drilling down into ${reportId} report...`);
    // Navigation to detailed view would be implemented here
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-black">Report Filters</CardTitle>
              <p className="text-sm text-black mt-1">Filter extracted information reports by various criteria</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 text-black hover:bg-background">
              <Filter size={16} />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select defaultValue="all-rfps">
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Select RFP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-rfps">All RFPs</SelectItem>
                <SelectItem value="rfp-2024-001">RFP-2024-001</SelectItem>
                <SelectItem value="rfp-2024-002">RFP-2024-002</SelectItem>
                <SelectItem value="rfp-2024-003">RFP-2024-003</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-categories">
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="it-services">IT Services</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="last-30-days">
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-status">
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Report Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {extractedReports.map((report) => (
          <Card key={report.id} className="rounded-[10px] border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleDrillDown(report.id)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleExportData(report.id); }} className="text-black hover:bg-background">
                  <Download size={16} />
                </Button>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold group-hover:text-red-accent transition-colors text-black">{report.title}</CardTitle>
                <p className="text-sm text-black mt-1">{report.description}</p>
              </div>
            </CardHeader>
            <CardContent>
              {report.id === 'compliance' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Compliant Rate</span>
                    <Badge className="bg-red-accent text-white">{report.compliantRate}%</Badge>
                  </div>
                  <Progress value={report.compliantRate} className="h-2" />
                  <div className="text-xs text-black">
                    {report.totalApplications} total applications processed
                  </div>
                </div>
              )}
              
              {report.id === 'financial' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Total Value</span>
                    <Badge className="bg-red-accent text-white">${report.totalValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Avg Proposal</span>
                    <span className="text-sm font-medium text-black">${report.avgProposalValue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Budget Compliance</span>
                    <Badge className="bg-red-accent text-white">{report.budgetCompliance}%</Badge>
                  </div>
                </div>
              )}
              
              {report.id === 'terms' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Total Terms</span>
                    <Badge className="bg-red-accent text-white">{report.totalTerms}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Common Terms</span>
                    <span className="text-sm font-medium text-black">{report.commonTerms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Flagged Terms</span>
                    <Badge variant="destructive">{report.flaggedTerms}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Compliance Dashboard */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-black">
                <BarChart3 size={20} />
                Compliance Overview Dashboard
              </CardTitle>
              <p className="text-sm text-black mt-1">Detailed compliance rates by category</p>
            </div>
            <Button onClick={() => handleExportData('compliance-detailed')} className="flex items-center gap-2 bg-primary text-white hover:bg-red-accent">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-black">{item.category}</div>
                  <div className="text-sm text-black">
                    {item.compliant} of {item.total} applications compliant
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={(item.compliant / item.total) * 100} className="w-32" />
                  <Badge className="bg-red-accent text-white">
                    {Math.round((item.compliant / item.total) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Dashboard */}
      <Card className="rounded-[10px] border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-black">
                <PieChart size={20} />
                Financial Summary Dashboard
              </CardTitle>
              <p className="text-sm text-black mt-1">Aggregated financial data from proposals</p>
            </div>
            <Button onClick={() => handleExportData('financial-detailed')} className="flex items-center gap-2 bg-primary text-white hover:bg-red-accent">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialBreakdown.map((rfp, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-black">{rfp.rfp}</div>
                  <div className="text-sm text-black">
                    {rfp.proposals} proposals submitted
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold text-lg text-black">${rfp.totalValue}</div>
                    <div className="text-sm text-black">Total Value</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-black">${rfp.avgBid}</div>
                    <div className="text-sm text-black">Avg Bid</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
