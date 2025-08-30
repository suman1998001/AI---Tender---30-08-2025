
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Package, 
  BarChart3,
  FileSpreadsheet,
  Image
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Applicant } from "@/pages/ApplicantTracking";

interface DownloadableSummariesProps {
  applicant: Applicant;
}

const downloadableReports = [
  {
    id: 'complete-package',
    name: 'Complete Applicant Package',
    description: 'All documents, evaluations, and communication history',
    icon: Package,
    size: '15.2 MB',
    format: 'ZIP'
  },
  {
    id: 'evaluation-report',
    name: 'Evaluation Summary Report',
    description: 'AI scores, human overrides, and final recommendations',
    icon: BarChart3,
    size: '2.1 MB',
    format: 'PDF'
  },
  {
    id: 'document-summary',
    name: 'Document Summary',
    description: 'Extracted data and key information from all documents',
    icon: FileText,
    size: '1.8 MB',
    format: 'PDF'
  },
  {
    id: 'scoring-breakdown',
    name: 'Detailed Scoring Breakdown',
    description: 'Criteria-by-criteria analysis with rationale',
    icon: FileSpreadsheet,
    size: '850 KB',
    format: 'XLSX'
  },
  {
    id: 'workflow-timeline',
    name: 'Workflow Timeline Report',
    description: 'Visual timeline of all processing steps and actors',
    icon: Image,
    size: '1.2 MB',
    format: 'PDF'
  }
];

export const DownloadableSummaries = ({ applicant }: DownloadableSummariesProps) => {
  const handleDownload = (reportId: string, reportName: string) => {
    console.log(`Downloading ${reportId} for applicant ${applicant.applicantId}`);
    toast({
      title: "Download Started",
      description: `${reportName} is being prepared for download...`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  const handleBulkDownload = () => {
    console.log(`Downloading all reports for applicant ${applicant.applicantId}`);
    toast({
      title: "Bulk Download Started",
      description: "All reports are being prepared for download as a ZIP file...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  const handleCustomReportGeneration = (reportType: string) => {
    toast({
      title: "Custom Report Generated",
      description: `${reportType} has been generated and is ready for download.`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  return (
    <div className="space-y-[15px]">
      <Card className="bg-white rounded-[15px] border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black">
              <Download size={20} />
              Available Reports & Summaries
            </CardTitle>
            <Button onClick={handleBulkDownload} className="flex items-center gap-2 bg-black text-white hover:bg-red-accent">
              <Package size={16} />
              Download All
            </Button>
          </div>
          <p className="text-sm text-black">
            Generate and download comprehensive reports for {applicant.applicantName}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloadableReports.map((report) => (
              <div 
                key={report.id}
                className="border border-gray-200 rounded-[15px] p-4 hover:bg-red-accent/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-red-accent/10 rounded-lg">
                    <report.icon size={24} className="text-red-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-black mb-1">{report.name}</h4>
                    <p className="text-sm text-black mb-3">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-black">
                        <span>{report.format}</span>
                        <span>{report.size}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(report.id, report.name)}
                        className="flex items-center gap-1 bg-black text-white hover:bg-red-accent"
                      >
                        <Download size={14} />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Generation */}
      <Card className="bg-white rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black">
            <FileText size={20} />
            Custom Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-black">
              Generate custom reports with specific sections and formatting options.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start rounded-[15px] text-black border-gray-200 hover:bg-red-accent/10"
                onClick={() => handleCustomReportGeneration("Executive Summary")}
              >
                <div className="text-left">
                  <div className="font-medium">Executive Summary</div>
                  <div className="text-sm text-black">High-level overview for stakeholders</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start rounded-[15px] text-black border-gray-200 hover:bg-red-accent/10"
                onClick={() => handleCustomReportGeneration("Technical Report")}
              >
                <div className="text-left">
                  <div className="font-medium">Technical Report</div>
                  <div className="text-sm text-black">Detailed technical evaluation</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start rounded-[15px] text-black border-gray-200 hover:bg-red-accent/10"
                onClick={() => handleCustomReportGeneration("Compliance Report")}
              >
                <div className="text-left">
                  <div className="font-medium">Compliance Report</div>
                  <div className="text-sm text-black">Regulatory compliance analysis</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
