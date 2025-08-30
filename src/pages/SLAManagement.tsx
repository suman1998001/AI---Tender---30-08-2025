import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SLADashboard } from "@/components/sla/SLADashboard";
import { SLADefinition } from "@/components/sla/SLADefinition";
import { SLADetails } from "@/components/sla/SLADetails";

const SLAManagement = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'definition' | 'details'>('dashboard');
  const [selectedSLA, setSelectedSLA] = useState<string | null>(null);

  const handleViewSLA = (slaId: string) => {
    setSelectedSLA(slaId);
    setCurrentView('details');
  };

  const handleCreateSLA = () => {
    setCurrentView('definition');
  };

  const handleEditSLA = (slaId: string) => {
    setSelectedSLA(slaId);
    setCurrentView('definition');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSLA(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'definition':
        return <SLADefinition slaId={selectedSLA} onBack={handleBackToDashboard} onViewSLA={handleViewSLA} />;
      case 'details':
        return <SLADetails slaId={selectedSLA} onBack={handleBackToDashboard} />;
      default:
        return <SLADashboard onViewSLA={handleViewSLA} onCreateSLA={handleCreateSLA} onEditSLA={handleEditSLA} />;
    }
  };

  return (
    <DashboardLayout>
      {renderCurrentView()}
    </DashboardLayout>
  );
};

export default SLAManagement;