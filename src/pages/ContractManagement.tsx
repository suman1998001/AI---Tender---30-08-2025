import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ContractDashboard } from "@/components/contract/ContractDashboard";
import ContractGeneration from "@/components/contract/ContractGeneration";
import { ContractDetails } from "@/components/contract/ContractDetails";
import { toast } from "@/hooks/use-toast";

// Static contract data
const staticContracts = [
  {
    id: '1',
    name: 'Software License Agreement',
    vendor: 'Microsoft Corporation',
    contract_details: 'Enterprise software license agreement for digital transformation project',
    value: 500000,
    status: 'Active',
    lifecycle_alerts: 'Renewal due in 3 months',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Facility Management Contract',
    vendor: 'ABC Facilities Ltd',
    contract_details: 'Comprehensive facility management and security services contract',
    value: 250000,
    status: 'Active',
    lifecycle_alerts: 'Performance review scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Consulting Services Agreement',
    vendor: 'TechConsult Pro',
    contract_details: 'IT consulting services for system integration and optimization',
    value: 150000,
    status: 'Active',
    lifecycle_alerts: 'Milestone review next week',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Annual Maintenance Contract',
    vendor: 'Maintenance Plus Inc',
    contract_details: 'Annual maintenance and technical support services contract',
    value: 75000,
    status: 'Active',
    lifecycle_alerts: 'Quarterly review pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Non-Disclosure Agreement',
    vendor: 'Innovation Corp',
    contract_details: 'Confidentiality agreement for strategic business partnership',
    value: 0,
    status: 'Active',
    lifecycle_alerts: 'Compliance audit required',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const ContractManagement = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'generation' | 'details'>('dashboard');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [contracts, setContracts] = useState(staticContracts);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading
  const fetchContracts = async () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setContracts(staticContracts);
      setIsLoading(false);
    }, 500);
  };

  // Save contract (local state only)
  const saveContract = async (contractData: any) => {
    const newContract = {
      id: Date.now().toString(),
      name: contractData.name || 'New Contract',
      vendor: contractData.vendor || 'Generated Vendor',
      contract_details: contractData.contract_details || 'No details provided',
      value: contractData.value || 0,
      status: contractData.status || 'Active',
      lifecycle_alerts: contractData.lifecycle_alerts || 'Contract review scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setContracts(prev => [newContract, ...prev]);
    toast({
      title: "Success",
      description: "Contract added successfully!"
    });
    return newContract;
  };

  // Update contract (local state only)
  const updateContract = async (id: string, updates: any) => {
    setContracts(prev => prev.map(contract => 
      contract.id === id ? { ...contract, ...updates, updated_at: new Date().toISOString() } : contract
    ));
    toast({
      title: "Success",
      description: "Contract updated successfully!"
    });
    return contracts.find(c => c.id === id) || null;
  };

  // Delete contract (local state only)
  const deleteContract = async (id: string) => {
    setContracts(prev => prev.filter(contract => contract.id !== id));
    toast({
      title: "Success",
      description: "Contract deleted successfully!"
    });
    return true;
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleViewContract = (contractId: string) => {
    setSelectedContract(contractId);
    setCurrentView('details');
  };

  const handleCreateContract = () => {
    setCurrentView('generation');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedContract(null);
  };

  const handleContractSaved = async (contractData: any) => {
    const savedContract = await saveContract(contractData);
    if (savedContract) {
      handleBackToDashboard();
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'generation':
        return (
          <ContractGeneration 
            onBack={handleBackToDashboard} 
            onSave={handleContractSaved}
          />
        );
      case 'details':
        return (
          <ContractDetails 
            contractId={selectedContract} 
            onBack={handleBackToDashboard}
            onUpdate={updateContract}
            onDelete={deleteContract}
          />
        );
      default:
        return (
          <ContractDashboard 
            contracts={contracts}
            isLoading={isLoading}
            onViewContract={handleViewContract} 
            onCreateContract={handleCreateContract}
            onRefresh={fetchContracts}
            onUpdate={updateContract}
            onDelete={deleteContract}
          />
        );
    }
  };

  return (
    <DashboardLayout>
      {renderCurrentView()}
    </DashboardLayout>
  );
};

export default ContractManagement;