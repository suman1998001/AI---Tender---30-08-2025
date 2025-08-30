import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { WorkflowChart } from "@/components/workflow/WorkflowChart";
import { WorkflowMetrics } from "@/components/workflow/WorkflowMetrics";
import { WorkflowHistory } from "@/components/workflow/WorkflowHistory";
import { WorkflowFilters } from "@/components/workflow/WorkflowFilters";
import { WorkflowKPICards } from "@/components/workflow/WorkflowKPICards";
import { WorkflowList } from "@/components/workflow/WorkflowList";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { WorkflowMonitoring } from "@/components/workflow/WorkflowMonitoring";
import { WorkflowAuditTrail } from "@/components/workflow/WorkflowAuditTrail";
import { WorkflowView } from "@/components/workflow/WorkflowView";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RefreshCw, Download, Settings, BarChart3, TrendingUp, History, List, Edit, Activity, Archive } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const WorkflowViewer = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'overview' | 'builder' | 'view'>('overview');
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [viewingWorkflowId, setViewingWorkflowId] = useState<string | null>(null);
  const handleCreateWorkflow = () => {
    setCurrentView('builder');
    setEditingWorkflowId(null);
  };
  const handleEditWorkflow = (workflowId: string) => {
    setCurrentView('builder');
    setEditingWorkflowId(workflowId);
    setViewingWorkflowId(null);
  };
  const handleViewWorkflow = (workflowId: string) => {
    setCurrentView('view');
    setViewingWorkflowId(workflowId);
    setEditingWorkflowId(null);
  };
  const handleSaveWorkflow = (workflow: any) => {
    setCurrentView('overview');
    setEditingWorkflowId(null);
    toast({
      title: "Workflow Saved",
      description: `${workflow.name} has been saved successfully.`
    });
  };
  const handleCancelEdit = () => {
    setCurrentView('overview');
    setEditingWorkflowId(null);
    setViewingWorkflowId(null);
  };
  const handleBackToOverview = () => {
    setCurrentView('overview');
    setViewingWorkflowId(null);
    setEditingWorkflowId(null);
  };
  if (currentView === 'view' && viewingWorkflowId) {
    return <DashboardLayout>
        <div>
          <WorkflowView workflowId={viewingWorkflowId} onEdit={handleEditWorkflow} onBack={handleBackToOverview} />
        </div>
      </DashboardLayout>;
  }
  if (currentView === 'builder') {
    return <DashboardLayout>
        <div>
          {/* Back Button and Header for Builder */}
          <div className="mb-6 animate-slide-in-right">
            <Button variant="ghost" onClick={handleCancelEdit} className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 hover-scale">
              <ArrowLeft size={20} className="mr-2" />
              Back to Workflow Management
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {editingWorkflowId ? 'Edit Workflow' : 'Create New Workflow'}
              </h1>
              <p className="text-gray-600">
                Design your procurement workflow by dragging and connecting steps
              </p>
            </div>
          </div>
          
          <WorkflowBuilder workflowId={editingWorkflowId || undefined} onSave={handleSaveWorkflow} onCancel={handleCancelEdit} />
        </div>
      </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="space-y-[10px]">
        {/* Back Button and Header Section */}
        <div className="mb-[10px]">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Workflow Management
            </h1>
            <p className="text-gray-600">
              Create, monitor and manage your RFP processing workflows with comprehensive analytics and audit trails
            </p>
          </div>
        </div>

        <div>
          <WorkflowKPICards />
        </div>

        <MinimalTabs defaultValue="management" className="space-y-[10px]">
          <MinimalTabsList className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm hover:shadow-md transition-shadow duration-200">
            <MinimalTabsTrigger value="management" className="flex items-center gap-2 transition-all duration-200 hover-scale">
              <List size={16} />
              Workflow Management
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="monitoring" className="flex items-center gap-2 transition-all duration-200 hover-scale">
              <Activity size={16} />
              Live Monitoring
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="analytics" className="flex items-center gap-2 transition-all duration-200 hover-scale">
              <BarChart3 size={16} />
              Analytics
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="history" className="flex items-center gap-2 transition-all duration-200 hover-scale">
              <History size={16} />
              History
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="audit" className="flex items-center gap-2 transition-all duration-200 hover-scale">
              <Archive size={16} />
              Audit Trail
            </MinimalTabsTrigger>
          </MinimalTabsList>

          <MinimalTabsContent value="management">
            <WorkflowList onCreateWorkflow={handleCreateWorkflow} onEditWorkflow={handleEditWorkflow} onViewWorkflow={handleViewWorkflow} />
          </MinimalTabsContent>

          <MinimalTabsContent value="monitoring">
            <WorkflowMonitoring />
          </MinimalTabsContent>

          <MinimalTabsContent value="analytics">
            <div className="space-y-[10px]">
              <WorkflowFilters />
              <WorkflowChart />
              <WorkflowMetrics />
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="history">
            <WorkflowHistory />
          </MinimalTabsContent>

          <MinimalTabsContent value="audit">
            <WorkflowAuditTrail />
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>;
};
export default WorkflowViewer;