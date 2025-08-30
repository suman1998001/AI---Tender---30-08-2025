import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BudgetDashboard } from "@/components/budget/BudgetDashboard";
import { BudgetSetup } from "@/components/budget/BudgetSetup";
import { POInvoiceMatching } from "@/components/budget/POInvoiceMatching";
import { AlertsApprovals } from "@/components/budget/AlertsApprovals";

const PaymentBudget = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup' | 'matching' | 'approvals'>('dashboard');
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const handleViewMatching = () => {
    setCurrentView('matching');
  };

  const handleViewApprovals = () => {
    setCurrentView('approvals');
  };

  const handleCreateBudget = () => {
    setCurrentView('setup');
  };

  const handleEditBudget = (budgetId: string) => {
    setSelectedBudget(budgetId);
    setCurrentView('setup');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedBudget(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'setup':
        return <BudgetSetup budgetId={selectedBudget} onBack={handleBackToDashboard} />;
      case 'matching':
        return <POInvoiceMatching onBack={handleBackToDashboard} />;
      case 'approvals':
        return <AlertsApprovals onBack={handleBackToDashboard} />;
      default:
        return <BudgetDashboard 
          onCreateBudget={handleCreateBudget} 
          onEditBudget={handleEditBudget}
          onViewMatching={handleViewMatching}
          onViewApprovals={handleViewApprovals}
        />;
    }
  };

  return (
    <DashboardLayout>
      {renderCurrentView()}
    </DashboardLayout>
  );
};

export default PaymentBudget;