import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { ChartSection } from "@/components/dashboard/ChartSection";
import { WorkflowSnapshot } from "@/components/dashboard/WorkflowSnapshot";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
const Index = () => {
  const handleRefresh = () => {
    toast({
      title: "Dashboard Refreshed",
      description: "All dashboard data has been updated with the latest information.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };
  const handleSettings = () => {
    toast({
      title: "Dashboard Settings",
      description: "Opening dashboard configuration options...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };
  const handleExportDashboard = () => {
    toast({
      title: "Export Started",
      description: "Dashboard report is being generated for download.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };
  return <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Monitor your RFP processing workflow and performance metrics</p>
          </div>
          
        </div>

        <MetricsCards />
        
        <ChartSection />
        
        <WorkflowSnapshot />
        
        <ActivityFeed />
      </div>
    </DashboardLayout>;
};
export default Index;