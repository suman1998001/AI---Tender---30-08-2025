import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SummaryDashboard } from "@/components/analytics/SummaryDashboard";
import { WorkflowPerformance } from "@/components/analytics/WorkflowPerformance";
import { ExtractedInformationReports } from "@/components/analytics/ExtractedInformationReports";
import { AuditTrail } from "@/components/analytics/AuditTrail";
import { AnalyticsKPICards } from "@/components/analytics/AnalyticsKPICards";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Settings, BarChart3, FileText, Users, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
const Analytics = () => {
  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Analytics report is being generated and will be downloaded shortly."
    });
  };
  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information."
    });
  };
  const handleOpenSettings = () => {
    toast({
      title: "Settings",
      description: "Opening analytics configuration settings..."
    });
  };
  return <DashboardLayout>
      <div className="space-y-[10px]">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics & Reporting
            </h1>
            <p className="text-gray-600 mt-2">
              Performance insights and data analytics for RFP management
            </p>
          </div>
          
        </div>

        <AnalyticsKPICards />

        <MinimalTabs defaultValue="summary" className="space-y-[10px]">
          <MinimalTabsList className="bg-white rounded-lg border border-gray-200 p-1">
            <MinimalTabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Summary Dashboard
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="workflow" className="flex items-center gap-2">
              <Activity size={16} />
              Workflow Performance
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="extraction" className="flex items-center gap-2">
              <FileText size={16} />
              Extraction Reports
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="audit" className="flex items-center gap-2">
              <Users size={16} />
              Audit Trail
            </MinimalTabsTrigger>
          </MinimalTabsList>

          <MinimalTabsContent value="summary">
            <SummaryDashboard />
          </MinimalTabsContent>

          <MinimalTabsContent value="workflow">
            <WorkflowPerformance />
          </MinimalTabsContent>

          <MinimalTabsContent value="extraction">
            <ExtractedInformationReports />
          </MinimalTabsContent>

          <MinimalTabsContent value="audit">
            <AuditTrail />
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>;
};
export default Analytics;