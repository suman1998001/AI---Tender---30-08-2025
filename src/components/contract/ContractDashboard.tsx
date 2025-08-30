import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { Plus, Search, Download, Eye, Edit, AlertCircle, CheckCircle, Clock, FileText, DollarSign, IndianRupee, AlertTriangle, Calendar, FileSignature, RotateCcw, X, Filter, ChevronDown, Check, Loader2 } from "lucide-react";

// Define Contract type locally since we removed the API
interface Contract {
  id?: string;
  name: string;
  vendor?: string;
  contract_details?: string;
  value?: number;
  status: string;
  lifecycle_alerts?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface ContractDashboardProps {
  contracts: Contract[];
  isLoading: boolean;
  onViewContract: (contractId: string) => void;
  onCreateContract: () => void;
  onRefresh: () => Promise<void>;
  onUpdate: (id: string, updates: Partial<Contract>) => Promise<Contract | null>;
  onDelete: (id: string) => Promise<boolean>;
}

const ContractDashboard = ({
  contracts,
  isLoading,
  onViewContract,
  onCreateContract,
  onRefresh,
  onUpdate,
  onDelete
}: ContractDashboardProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Applied filters (these are used for actual filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    vendor: ""
  });

  // Temporary filters (these are the values in the popup before applying)
  const [tempFilters, setTempFilters] = useState({
    status: "",
    vendor: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    status: false,
    vendor: false
  });

  // Check if any filters are applied
  const hasActiveFilters = Object.values(appliedFilters).some(value => value !== "");

  // Filter options
  const filterOptions = {
    status: [{
      value: "active",
      label: "Active"
    }, {
      value: "draft",
      label: "Draft"
    }, {
      value: "expired",
      label: "Expired"
    }, {
      value: "negotiating",
      label: "Negotiating"
    }],
    vendor: [{
      value: "microsoft",
      label: "Microsoft Corporation"
    }, {
      value: "abc-facilities",
      label: "ABC Facilities Ltd"
    }, {
      value: "techconsult",
      label: "TechConsult Pro"
    }, {
      value: "maintenance-plus",
      label: "Maintenance Plus Inc"
    }, {
      value: "innovation-corp",
      label: "Innovation Corp"
    }]
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const selectOption = (filterType: string, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? "" : value
    }));
    // Auto-close the section after selection
    setOpenSections(prev => ({
      ...prev,
      [filterType]: false
    }));
  };

  const getSelectedLabel = (filterType: string) => {
    const selectedValue = tempFilters[filterType as keyof typeof tempFilters];
    if (!selectedValue) return "Select " + filterType;
    const option = filterOptions[filterType as keyof typeof filterOptions]?.find(opt => opt.value === selectedValue);
    return option?.label || selectedValue;
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setAppliedFilters({
      status: "",
      vendor: ""
    });
    setTempFilters({
      status: "",
      vendor: ""
    });
  };

  // Filter contracts based on search and applied filters
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (contract.vendor && contract.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (contract.contract_details && contract.contract_details.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = !appliedFilters.status || contract.status.toLowerCase() === appliedFilters.status.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-black text-white';
      case 'Draft':
        return 'bg-orange-100 text-orange-700';
      case 'Expired':
        return 'bg-orange-600 text-white';
      case 'Negotiating':
        return 'bg-white text-black border-gray-200';
      default:
        return 'bg-white text-black border-gray-200';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case "warning":
        return <AlertTriangle className="h-3 w-3 text-white" />;
      case "error":
        return <AlertCircle className="h-3 w-3 text-white" />;
      case "success":
        return <CheckCircle className="h-3 w-3 text-white" />;
      default:
        return <Clock className="h-3 w-3 text-white" />;
    }
  };

  // Calculate summary statistics
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const expiringSoon = 0; // Simplified - no expiry tracking in basic structure
  const totalValue = 0; // Simplified - no value tracking in basic structure

  // Define table columns
  const tableColumns = [{
    key: 'name',
    label: 'Contract Name',
    sortable: true,
    render: (value: string) => <span className="font-medium text-gray-900 text-sm">{value}</span>
  }, {
    key: 'vendor',
    label: 'Vendor',
    sortable: true,
    render: (value: string) => <span className="text-gray-700 text-sm">{value || 'Not specified'}</span>
  }, {
    key: 'contract_details',
    label: 'Contract Details',
    sortable: true,
    render: (value: string) => <span className="text-gray-700 text-sm">{value || 'No details provided'}</span>
  }, {
    key: 'value',
    label: 'Value',
    sortable: true,
    render: (value: number) => <span className="text-gray-700 text-sm font-medium">
      {value ? `₹${value.toLocaleString('en-IN')}` : 'Not specified'}
    </span>
  }, {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value: string) => <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(value)}`}>
          {value}
        </span>
  }, {
    key: 'lifecycle_alerts',
    label: 'Lifecycle Alerts',
    sortable: false,
    render: (value: string) => <span className="text-gray-700 text-sm">{value || 'No alerts'}</span>
  }];

  const tableActions = [{
    label: 'View',
    icon: Eye,
    onClick: (row: Contract) => onViewContract(row.id || '')
  }, {
    label: 'Edit',
    icon: Edit,
    onClick: (row: Contract) => console.log('Edit contract:', row.id)
  }, {
    label: 'Duplicate',
    icon: FileText,
    onClick: (row: Contract) => console.log('Duplicate contract:', row.id)
  }, {
    label: 'Renew',
    icon: RotateCcw,
    onClick: (row: Contract) => console.log('Renew contract:', row.id)
  }, {
    label: 'Terminate',
    icon: X,
    onClick: (row: Contract) => console.log('Terminate contract:', row.id)
  }];

  // Filter Popover Component
  const FilterPopover = () => <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50 relative ${hasActiveFilters ? 'border-red-accent bg-red-accent-light text-red-accent' : ''}`}>
          <Filter size={16} />
          Filters
          {hasActiveFilters && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-accent rounded-full"></div>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6 bg-white border border-gray-200 shadow-xl rounded-xl" align="center" side="bottom" sideOffset={10} style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 50
    }}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg text-gray-900">Filter Contracts</h4>
            {hasActiveFilters && <Badge variant="outline" className="bg-red-accent-light text-red-accent border-red-accent text-xs px-2 py-1">
                {Object.values(appliedFilters).filter(v => v !== "").length} Applied
              </Badge>}
          </div>
          
                     <div className="space-y-4">
             {/* Status Filter */}
             <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
               <CollapsibleTrigger asChild>
                 <Button variant="outline" className="w-full justify-between rounded-lg border-gray-200 h-10">
                   <span className="text-sm">{getSelectedLabel('status')}</span>
                   <ChevronDown className={`h-4 w-4 transition-transform ${openSections.status ? 'rotate-180' : ''}`} />
                 </Button>
               </CollapsibleTrigger>
               <CollapsibleContent className="mt-2">
                 <div className="border border-gray-200 rounded-lg bg-gray-50 p-2 space-y-1">
                   {filterOptions.status.map(option => <Button key={option.value} variant="ghost" size="sm" className={`w-full justify-between text-sm h-8 ${tempFilters.status === option.value ? 'bg-red-accent-light text-red-accent' : 'hover:bg-white'}`} onClick={() => selectOption('status', option.value)}>
                       {option.label}
                       {tempFilters.status === option.value && <Check className="h-3 w-3" />}
                     </Button>)}
                 </div>
               </CollapsibleContent>
             </Collapsible>

             {/* Vendor Filter */}
             <Collapsible open={openSections.vendor} onOpenChange={() => toggleSection('vendor')}>
               <CollapsibleTrigger asChild>
                 <Button variant="outline" className="w-full justify-between rounded-lg border-gray-200 h-10">
                   <span className="text-sm">{getSelectedLabel('vendor')}</span>
                   <ChevronDown className={`h-4 w-4 transition-transform ${openSections.vendor ? 'rotate-180' : ''}`} />
                 </Button>
               </CollapsibleTrigger>
               <CollapsibleContent className="mt-2">
                 <div className="border border-gray-200 rounded-lg bg-gray-50 p-2 space-y-1">
                   {filterOptions.vendor.map(option => <Button key={option.value} variant="ghost" size="sm" className={`w-full justify-between text-sm h-8 ${tempFilters.vendor === option.value ? 'bg-red-accent-light text-red-accent' : 'hover:bg-white'}`} onClick={() => selectOption('vendor', option.value)}>
                       {option.label}
                       {tempFilters.vendor === option.value && <Check className="h-3 w-3" />}
                     </Button>)}
                 </div>
               </CollapsibleContent>
             </Collapsible>
           </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={clearFilters} className="text-gray-600 hover:text-gray-800">
              Clear All
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={applyFilters} className="bg-red-accent hover:bg-red-accent/90 text-white">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>;

  return <div className="p-6 space-y-6 animate-fade-in rounded-2xl px-0 py-0 bg-transparent">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Contract Management</h1>
            <p className="text-muted-foreground">Manage contracts, track obligations, and handle renewals</p>
          </div>
          
          <Button onClick={() => navigate('/contract-generation')} className="bg-red-accent text-white hover:bg-red-accent/90 transition-all duration-200 hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Generate Contract
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Contracts
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalContracts}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileSignature className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              +12% from last month
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
        
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Active Contracts
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : activeContracts}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              {totalContracts > 0 ? Math.round((activeContracts / totalContracts) * 100) : 0}% of total
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
        
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Expiring Soon
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : expiringSoon}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Requires human attention
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
        
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Value
              </CardTitle>
               <div className="text-2xl font-bold text-gray-900 tracking-tight">
                 {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `₹${(totalValue / 10000000).toFixed(1)}Cr`}
               </div>
            </div>
            <div className="bg-gray-700 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <IndianRupee className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              +8% from last quarter
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>

      {/* Contract List with Integrated Filters */}
      <Card className="rounded-[15px] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 mt-[10px] bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 tracking-tight">
                <div className="p-2 bg-gradient-to-br from-red-accent to-red-accent/90 rounded-xl">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Contract Management
              </CardTitle>
              <p className="text-sm text-gray-500">Monitor and manage all contract agreements</p>
            </div>
            {/* Enhanced Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input placeholder="Search contracts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors duration-300" />
              </div>
              <FilterPopover />
              <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-red-accent" />
              <span className="ml-2 text-gray-600">Loading contracts...</span>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first contract.</p>
              <Button onClick={onCreateContract} className="bg-red-accent text-white hover:bg-red-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Contract
              </Button>
            </div>
          ) : (
            <UniversalTable 
              data={filteredContracts} 
              columns={tableColumns} 
              actions={tableActions} 
              pageSize={10} 
              showSerialNumber={true} 
              showCheckboxes={false} 
            />
          )}
        </CardContent>
      </Card>
    </div>;
};

export { ContractDashboard };