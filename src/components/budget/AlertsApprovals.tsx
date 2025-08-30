import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, AlertTriangle, CheckCircle, X, Users, Settings, Bell, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AlertsApprovalsProps {
  onBack: () => void;
}

const AlertsApprovals = ({ onBack }: AlertsApprovalsProps) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'approvals' | 'config'>('alerts');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [alertStatusFilter, setAlertStatusFilter] = useState<string>("all");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>("all");
  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: "1",
      requester: "John Smith",
      amount: 15000,
      budgetImpact: "Cloud Infrastructure (+5%)",
      justification: "Emergency server replacement required",
      status: "Pending",
      approvalFlow: "Manager → Finance Head"
    },
    {
      id: "2",
      requester: "Sarah Johnson",
      amount: 8000,
      budgetImpact: "Marketing Campaign (+3%)",
      justification: "Additional advertising spend for Q1 campaign",
      status: "Approved",
      approvalFlow: "Manager"
    },
    {
      id: "3",
      requester: "Mike Davis",
      amount: 25000,
      budgetImpact: "Data Analytics Platform (+8%)",
      justification: "Critical database optimization tools needed",
      status: "Pending",
      approvalFlow: "Manager → Finance Head → CFO"
    },
    {
      id: "4",
      requester: "Emily Chen",
      amount: 12000,
      budgetImpact: "Security Enhancement (+4%)",
      justification: "Additional firewall licenses for enhanced protection",
      status: "Pending",
      approvalFlow: "Manager → IT Head"
    },
    {
      id: "5",
      requester: "Robert Wilson",
      amount: 35000,
      budgetImpact: "Mobile App Development (+12%)",
      justification: "Extended development timeline requires additional resources",
      status: "Pending",
      approvalFlow: "Manager → Finance Head → CFO"
    },
    {
      id: "6",
      requester: "Lisa Anderson",
      amount: 6500,
      budgetImpact: "Office Renovation (+2%)",
      justification: "Additional furniture and equipment for new office space",
      status: "Approved",
      approvalFlow: "Manager"
    },
    {
      id: "7",
      requester: "David Kim",
      amount: 18000,
      budgetImpact: "AI Implementation Project (+6%)",
      justification: "Advanced ML model training requires more computing resources",
      status: "Pending",
      approvalFlow: "Manager → Finance Head"
    },
    {
      id: "8",
      requester: "Jessica Brown",
      amount: 9500,
      budgetImpact: "Employee Training Program (+5%)",
      justification: "Additional certification courses for team development",
      status: "Pending",
      approvalFlow: "Manager → HR Head"
    },
    {
      id: "9",
      requester: "Thomas Lee",
      amount: 42000,
      budgetImpact: "Network Upgrade Project (+15%)",
      justification: "Critical infrastructure upgrade for improved performance",
      status: "Pending",
      approvalFlow: "Manager → Finance Head → CFO"
    },
    {
      id: "10",
      requester: "Amanda Garcia",
      amount: 7200,
      budgetImpact: "Customer Support Enhancement (+3%)",
      justification: "New support ticketing system implementation",
      status: "Rejected",
      approvalFlow: "Manager"
    },
    {
      id: "11",
      requester: "Kevin Taylor",
      amount: 22000,
      budgetImpact: "Research & Development (+7%)",
      justification: "Prototype development for new product line",
      status: "Pending",
      approvalFlow: "Manager → Finance Head"
    },
    {
      id: "12",
      requester: "Rachel Martinez",
      amount: 13500,
      budgetImpact: "Marketing Campaign Q2 (+4%)",
      justification: "Extended social media advertising campaign",
      status: "Pending",
      approvalFlow: "Manager → Marketing Head"
    }
  ]);

  // Extended mock data for budget alerts (15+ alerts)
  const budgetAlerts = [
    {
      id: "1",
      budget: "Cloud Infrastructure Program",
      threshold: "90%",
      currentSpend: "95%",
      dateTriggered: "2024-01-15",
      severity: "high",
      status: "Active"
    },
    {
      id: "2",
      budget: "Marketing Campaign Q1",
      threshold: "80%",
      currentSpend: "85%",
      dateTriggered: "2024-01-14",
      severity: "medium",
      status: "Acknowledged"
    },
    {
      id: "3",
      budget: "Data Analytics Platform",
      threshold: "85%",
      currentSpend: "92%",
      dateTriggered: "2024-01-13",
      severity: "high",
      status: "Active"
    },
    {
      id: "4",
      budget: "Security Enhancement",
      threshold: "75%",
      currentSpend: "78%",
      dateTriggered: "2024-01-12",
      severity: "low",
      status: "Active"
    },
    {
      id: "5",
      budget: "Mobile App Development",
      threshold: "90%",
      currentSpend: "98%",
      dateTriggered: "2024-01-11",
      severity: "high",
      status: "Active"
    },
    {
      id: "6",
      budget: "AI Implementation Project",
      threshold: "80%",
      currentSpend: "88%",
      dateTriggered: "2024-01-10",
      severity: "medium",
      status: "Active"
    },
    {
      id: "7",
      budget: "Network Upgrade Project",
      threshold: "85%",
      currentSpend: "90%",
      dateTriggered: "2024-01-09",
      severity: "medium",
      status: "Acknowledged"
    },
    {
      id: "8",
      budget: "Facility Expansion",
      threshold: "90%",
      currentSpend: "105%",
      dateTriggered: "2024-01-08",
      severity: "high",
      status: "Active"
    },
    {
      id: "9",
      budget: "Research & Development",
      threshold: "75%",
      currentSpend: "82%",
      dateTriggered: "2024-01-07",
      severity: "medium",
      status: "Active"
    },
    {
      id: "10",
      budget: "Customer Support Enhancement",
      threshold: "80%",
      currentSpend: "84%",
      dateTriggered: "2024-01-06",
      severity: "medium",
      status: "Acknowledged"
    },
    {
      id: "11",
      budget: "Product Launch Campaign",
      threshold: "85%",
      currentSpend: "89%",
      dateTriggered: "2024-01-05",
      severity: "medium",
      status: "Active"
    },
    {
      id: "12",
      budget: "Server Hardware Upgrade",
      threshold: "90%",
      currentSpend: "96%",
      dateTriggered: "2024-01-04",
      severity: "high",
      status: "Active"
    },
    {
      id: "13",
      budget: "DevOps Implementation",
      threshold: "75%",
      currentSpend: "79%",
      dateTriggered: "2024-01-03",
      severity: "low",
      status: "Active"
    },
    {
      id: "14",
      budget: "Automation Framework",
      threshold: "80%",
      currentSpend: "87%",
      dateTriggered: "2024-01-02",
      severity: "medium",
      status: "Active"
    },
    {
      id: "15",
      budget: "Disaster Recovery Planning",
      threshold: "85%",
      currentSpend: "91%",
      dateTriggered: "2024-01-01",
      severity: "medium",
      status: "Acknowledged"
    }
  ];

  const getAlertBadge = (severity: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    };
    return <Badge variant={variants[severity as keyof typeof variants] as any}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "destructive",
      Acknowledged: "secondary",
      Pending: "secondary",
      Approved: "default",
      Rejected: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Action handlers for budget alerts
  const handleDismissAlert = (alert: any) => {
    toast({
      title: "Alert Dismissed",
      description: `Budget alert for "${alert.budget}" has been dismissed successfully.`,
      duration: 4000,
    });
  };

  const handleAcknowledgeAlert = (alert: any) => {
    toast({
      title: "Alert Acknowledged", 
      description: `Budget alert for "${alert.budget}" has been acknowledged. You will continue to monitor this budget.`,
      duration: 4000,
    });
  };

  const handleRequestApproval = (alert: any) => {
    toast({
      title: "Approval Request Sent",
      description: `Budget approval request for "${alert.budget}" has been submitted to finance team for review.`,
      duration: 4000,
    });
  };

  // Action handlers for approval requests
  const handleApprove = (request: any) => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === request.id ? { ...req, status: "Approved" } : req
      )
    );
    setShowSuccessPopup(true);
    toast({
      title: "Request Approved",
      description: `Approval request from ${request.requester} for ${formatCurrency(request.amount)} has been approved.`,
      duration: 4000,
    });
  };

  const handleRejectClick = (request: any) => {
    setSelectedRequest(request);
    setShowRejectConfirm(true);
  };

  const handleConfirmReject = () => {
    if (selectedRequest) {
      setApprovalRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id ? { ...req, status: "Rejected" } : req
        )
      );
      setShowRejectConfirm(false);
      setShowRejectSuccess(true);
      toast({
        title: "Request Rejected",
        description: `Approval request from ${selectedRequest.requester} has been rejected.`,
        duration: 4000,
      });
    }
  };

  // Filter data based on status
  const filteredAlerts = alertStatusFilter === "all" 
    ? budgetAlerts 
    : budgetAlerts.filter(alert => alert.status === alertStatusFilter);

  const filteredApprovals = approvalStatusFilter === "all"
    ? approvalRequests
    : approvalRequests.filter(request => request.status === approvalStatusFilter);

  // KPI data for alerts and approvals
  const kpis = [
    {
      title: "Active Alerts",
      value: "15",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-muted"
    },
    {
      title: "Pending Approvals",
      value: "12",
      change: "Awaiting review",
      icon: Users,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Auto-Approved",
      value: "45",
      change: "This month",
      icon: CheckCircle,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Budget Overruns",
      value: "3",
      change: "Critical review needed",
      icon: IndianRupee,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      iconBg: "bg-red-accent"
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in px-0 py-0">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack} className="transition-all duration-200 hover:scale-105 bg-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & Approvals</h1>
          <p className="text-muted-foreground">Proactive financial control and approval workflows</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        {kpis.map((kpi, index) => (
          <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  {kpi.title}
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {kpi.value}
                </div>
              </div>
              <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                {kpi.change}
              </p>
            </CardContent>
            
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>
        ))}
      </div>

      {/* Integrated Alerts and Approvals Section */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertTriangle className="h-4 w-4" />
              Alerts & Approvals Management
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'alerts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('alerts')}
                className="transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Budget Alerts
              </Button>
              <Button
                variant={activeTab === 'approvals' ? 'default' : 'outline'}
                onClick={() => setActiveTab('approvals')}
                className="transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Approval Requests
              </Button>
              <Button
                variant={activeTab === 'config' ? 'default' : 'outline'}
                onClick={() => setActiveTab('config')}
                className="transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === 'alerts' && (
            <div>
              {/* Filter Controls for Alerts */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700">Filter by Status:</Label>
                  <Select value={alertStatusFilter} onValueChange={setAlertStatusFilter}>
                    <SelectTrigger className="w-[180px] h-8 bg-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500">
                    Showing {filteredAlerts.length} of {budgetAlerts.length} alerts
                  </div>
                </div>
              </div>
              
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Budget</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Current Spend</TableHead>
                  <TableHead>Date Triggered</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert, index) => (
                  <TableRow key={alert.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <TableCell className="font-medium">{alert.budget}</TableCell>
                    <TableCell>{alert.threshold}</TableCell>
                    <TableCell className="font-bold text-red-accent">{alert.currentSpend}</TableCell>
                    <TableCell>{alert.dateTriggered}</TableCell>
                    <TableCell>{getAlertBadge(alert.severity)}</TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="transition-all duration-200 hover:scale-105"
                          onClick={() => handleDismissAlert(alert)}
                        >
                          Dismiss
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="transition-all duration-200 hover:scale-105"
                          onClick={() => handleAcknowledgeAlert(alert)}
                        >
                          Acknowledge
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="transition-all duration-200 hover:scale-105"
                          onClick={() => handleRequestApproval(alert)}
                        >
                          Request Approval
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
          
          {activeTab === 'approvals' && (
            <div>
              {/* Filter Controls for Approvals */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700">Filter by Status:</Label>
                  <Select value={approvalStatusFilter} onValueChange={setApprovalStatusFilter}>
                    <SelectTrigger className="w-[180px] h-8 bg-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500">
                    Showing {filteredApprovals.length} of {approvalRequests.length} requests
                  </div>
                </div>
              </div>
              
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Budget Impact</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead>Approval Flow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((request, index) => (
                  <TableRow key={request.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <TableCell className="font-medium">{request.requester}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(request.amount)}</TableCell>
                    <TableCell>{request.budgetImpact}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.justification}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {request.approvalFlow.split(' → ').map((step, i, arr) => (
                          <span key={i}>
                            {step}
                            {i < arr.length - 1 && <span className="mx-1 text-muted-foreground">→</span>}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === 'Pending' ? (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="transition-all duration-200 hover:scale-105"
                            onClick={() => handleApprove(request)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="transition-all duration-200 hover:scale-105"
                            onClick={() => handleRejectClick(request)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No action required</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
          
          {activeTab === 'config' && (
            <div className="p-6 space-y-6">
              {/* Budget Threshold Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Budget Threshold Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Alert Thresholds</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threshold-80">Alert at 80% budget utilization</Label>
                          <Switch id="threshold-80" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threshold-90">Alert at 90% budget utilization</Label>
                          <Switch id="threshold-90" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threshold-100">Alert at 100% budget utilization</Label>
                          <Switch id="threshold-100" defaultChecked />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Custom Threshold</h4>
                      <div className="space-y-2">
                        <Label htmlFor="custom-threshold">Custom percentage threshold</Label>
                        <Input id="custom-threshold" type="number" placeholder="85" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notification-emails">Notification Recipients</Label>
                        <Input id="notification-emails" placeholder="Enter email addresses" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approval Rules Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Conditional Approval Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Amount-Based Rules</h4>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">$0 - $5,000</span>
                            <Badge variant="outline">Manager</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Direct manager approval required</p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">$5,001 - $25,000</span>
                            <Badge variant="outline">Finance Head</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Finance head approval required</p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">$25,001+</span>
                            <Badge variant="outline">CFO</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">CFO approval required</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Budget Impact Rules</h4>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">0-10% over budget</span>
                            <Badge variant="secondary">Manager</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Manager approval with justification</p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">10-25% over budget</span>
                            <Badge variant="destructive">Finance Head</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Finance head approval required</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      className="transition-all duration-200 hover:scale-105"
                      onClick={() => setShowSuccessPopup(true)}
                    >
                      Save Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Configuration Saved Successfully
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-2">
                Your alert and approval configuration has been saved successfully.
              </p>
              <p className="text-sm text-gray-500">
                The new settings will take effect immediately and will be applied to all future budget activities.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowSuccessPopup(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Confirm Rejection
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to reject this approval request?
              </p>
              {selectedRequest && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4">
                  <p><strong>Requester:</strong> {selectedRequest.requester}</p>
                  <p><strong>Amount:</strong> {formatCurrency(selectedRequest.amount)}</p>
                  <p><strong>Purpose:</strong> {selectedRequest.justification}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowRejectConfirm(false)}
                className="flex-1"
              >
                No, Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmReject}
                className="flex-1"
              >
                Yes, Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Success Dialog */}
      <Dialog open={showRejectSuccess} onOpenChange={setShowRejectSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-center justify-center">
              <X className="h-6 w-6 text-red-600" />
              Request Rejected
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-gray-600 mb-2">
                The approval request has been rejected successfully.
              </p>
              <p className="text-sm text-gray-500">
                The requester will be notified about this decision.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowRejectSuccess(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export { AlertsApprovals };