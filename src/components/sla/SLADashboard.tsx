import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { Plus, Search, Filter, Download, Eye, Edit, UserX, TrendingUp, AlertTriangle, CheckCircle, Target, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
interface SLADashboardProps {
  onViewSLA: (slaId: string) => void;
  onCreateSLA: () => void;
  onEditSLA: (slaId: string) => void;
}
const SLADashboard = ({
  onViewSLA,
  onCreateSLA,
  onEditSLA
}: SLADashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Temporary filter states for the dialog
  const [tempVendor, setTempVendor] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [tempService, setTempService] = useState("");

  // Mock data for SLAs
  const slas = [{
    id: "1",
    name: "Cloud Infrastructure Uptime",
    vendor: "AWS Solutions",
    service: "Cloud Hosting",
    kpi: "Uptime %",
    currentPerformance: "99.8%",
    threshold: "99.9%",
    status: "At-Risk",
    lastMonitored: "2024-01-15 14:30",
    statusType: "warning"
  }, {
    id: "2",
    name: "Support Response Time",
    vendor: "TechSupport Inc.",
    service: "IT Support",
    kpi: "Response Time",
    currentPerformance: "15 min",
    threshold: "30 min",
    status: "Compliant",
    lastMonitored: "2024-01-15 14:25",
    statusType: "success"
  }, {
    id: "3",
    name: "Security Monitoring",
    vendor: "CyberGuard LLC",
    service: "Security Services",
    kpi: "Incident Detection",
    currentPerformance: "85%",
    threshold: "95%",
    status: "Breached",
    lastMonitored: "2024-01-15 14:20",
    statusType: "error"
  }];
  const getStatusBadge = (status: string, statusType: string) => {
    const variants: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      success: "default",
      warning: "secondary",
      error: "destructive"
    };
    return <Badge variant={variants[statusType] || "outline"}>{status}</Badge>;
  };

  // Filter data based on search and filters
  const filteredSLAs = slas.filter(sla => {
    const matchesSearch = sla.name.toLowerCase().includes(searchTerm.toLowerCase()) || sla.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || sla.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = !selectedVendor || sla.vendor.toLowerCase().includes(selectedVendor);
    const matchesService = !selectedService || sla.service.toLowerCase().includes(selectedService);
    const matchesStatus = !selectedStatus || sla.status.toLowerCase().includes(selectedStatus);
    return matchesSearch && matchesVendor && matchesService && matchesStatus;
  });

  // Define table columns
  const tableColumns = [{
    key: 'name',
    label: 'SLA Name',
    sortable: true,
    render: (value: string) => <span className="font-medium text-slate-900">{value}</span>
  }, {
    key: 'vendor',
    label: 'Vendor',
    sortable: true,
    render: (value: string) => <span className="text-slate-700">{value}</span>
  }, {
    key: 'service',
    label: 'Service',
    sortable: true,
    render: (value: string) => <span className="text-slate-700">{value}</span>
  }, {
    key: 'kpi',
    label: 'Key KPI',
    render: (value: string) => <Badge variant="outline" className="text-xs">{value}</Badge>
  }, {
    key: 'currentPerformance',
    label: 'Current Performance',
    render: (value: string) => <span className="font-mono text-slate-800">{value}</span>
  }, {
    key: 'threshold',
    label: 'Threshold',
    render: (value: string) => <span className="font-mono text-slate-600">{value}</span>
  }, {
    key: 'status',
    label: 'Status',
    render: (value: string, row: any) => getStatusBadge(row.status, row.statusType)
  }, {
    key: 'lastMonitored',
    label: 'Last Monitored',
    render: (value: string) => <span className="text-sm text-slate-600">{value}</span>
  }];

  // Define table actions
  const tableActions = [{
    label: 'View Details',
    icon: Eye,
    onClick: (row: any) => onViewSLA(row.id)
  }, {
    label: 'Edit SLA',
    icon: Edit,
    onClick: (row: any) => onEditSLA(row.id)
  }, {
    label: 'Disable',
    icon: UserX,
    onClick: (row: any) => {
      toast({
        title: "SLA Disabled",
        description: `SLA "${row.name}" has been disabled.`,
        className: "fixed bottom-4 right-4 w-80 bg-red-accent-light border border-red-muted text-black shadow-lg"
      });
    }
  }];
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "SLA data is being exported to Excel...",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };

  // Helper functions for filter state
  const hasActiveFilters = () => {
    return selectedVendor || selectedService || selectedStatus;
  };
  const getFilterCount = () => {
    let count = 0;
    if (selectedVendor) count++;
    if (selectedService) count++;
    if (selectedStatus) count++;
    return count;
  };
  const clearAllFilters = () => {
    setSelectedVendor("");
    setSelectedService("");
    setSelectedStatus("");
    setTempVendor("");
    setTempService("");
    setTempStatus("");
    setFilterDialogOpen(false);
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };
  const applyFilters = () => {
    setSelectedVendor(tempVendor);
    setSelectedService(tempService);
    setSelectedStatus(tempStatus);
    setFilterDialogOpen(false);
    toast({
      title: "Filters Applied",
      description: "Filter settings have been applied successfully.",
      className: "fixed bottom-4 right-4 w-80 bg-primary border border-primary text-white shadow-lg"
    });
  };
  const clearTempFilters = () => {
    setTempVendor("");
    setTempService("");
    setTempStatus("");
  };

  // Initialize temp values when dialog opens
  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setTempVendor(selectedVendor);
      setTempService(selectedService);
      setTempStatus(selectedStatus);
    }
    setFilterDialogOpen(open);
  };
  return <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-foreground text-2xl">SLA Management</h1>
          <p className="text-muted-foreground">Monitor and manage service level agreements with vendors</p>
        </div>
        <Button onClick={onCreateSLA} className="transition-all duration-200 hover:scale-105">
          <Plus className="h-4 w-4 mr-2" />
          Create New SLA
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                SLA Compliance Rate
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                94.5%
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              +2.1% from last month
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Active Breaches
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                7
              </div>
            </div>
            <div className="bg-red-muted p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Requires immediate attention
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                SLAs at Risk
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                12
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Within 10% of threshold
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Top Performer
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                TechSupport Inc.
              </div>
            </div>
            <div className="bg-red-muted p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              99.2% avg compliance
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>

      {/* SLA Management Table with Integrated Search & Filters */}
      <Card className="rounded-[15px] border border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col space-y-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-black">
              <Target className="h-5 w-5" />
              SLA Management
            </CardTitle>
            
            {/* Search and Filter Button */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search SLAs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-gray-200 bg-white" />
              </div>
              
              <Dialog open={filterDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button variant={hasActiveFilters() ? "default" : "outline"} className={`transition-all duration-200 hover:scale-105 border-gray-200 ${hasActiveFilters() ? 'bg-black text-white hover:bg-gray-800' : ''}`}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters() && <Badge variant="secondary" className="ml-2 bg-white text-black">
                        {getFilterCount()}
                      </Badge>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle>Filter SLAs</DialogTitle>
                      <Button variant="ghost" size="sm" onClick={() => setFilterDialogOpen(false)} className="h-8 w-8 p-0 hover:bg-gray-100">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Vendor</label>
                      <Select value={tempVendor} onValueChange={setTempVendor}>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Select Vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">AWS Solutions</SelectItem>
                          <SelectItem value="techsupport">TechSupport Inc.</SelectItem>
                          <SelectItem value="cyberguard">CyberGuard LLC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Service Type</label>
                      <Select value={tempService} onValueChange={setTempService}>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Service Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cloud">Cloud Hosting</SelectItem>
                          <SelectItem value="support">IT Support</SelectItem>
                          <SelectItem value="security">Security Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Select value={tempStatus} onValueChange={setTempStatus}>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compliant">Compliant</SelectItem>
                          <SelectItem value="at-risk">At-Risk</SelectItem>
                          <SelectItem value="breached">Breached</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={clearTempFilters} className="flex-1 border-gray-200 text-red-muted hover:bg-red-50 hover:text-red-accent">
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                    <Button onClick={applyFilters} className="flex-1 bg-black text-white hover:bg-gray-800">
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={handleExport} className="transition-all duration-200 hover:scale-105 border-gray-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredSLAs.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No SLAs Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || hasActiveFilters() ? "No SLAs match your current search criteria. Try adjusting your filters or search term." : "No SLA data available to display."}
              </p>
              {(searchTerm || hasActiveFilters()) && <Button variant="outline" onClick={() => {
            setSearchTerm("");
            clearAllFilters();
          }} className="border-gray-200">
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>}
            </div> : <UniversalTable data={filteredSLAs} columns={tableColumns} actions={tableActions} pageSize={10} showSerialNumber={true} onRowClick={row => onViewSLA(row.id)} />}
        </CardContent>
      </Card>
    </div>;
};
export { SLADashboard };