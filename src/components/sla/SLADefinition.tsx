import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Settings, Target, Calculator, Bell, ChevronRight, Check, CheckCircle, Eye, Home } from "lucide-react";
interface SLADefinitionProps {
  slaId?: string | null;
  onBack: () => void;
  onViewSLA?: (slaId: string) => void;
}
const SLADefinition = ({
  slaId,
  onBack,
  onViewSLA
}: SLADefinitionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [kpis, setKpis] = useState([{
    id: 1,
    name: "",
    threshold: "",
    unit: "",
    dataSource: ""
  }]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [slaName, setSlaName] = useState("");
  const [createdSLAId, setCreatedSLAId] = useState("");
  const addKPI = () => {
    setKpis([...kpis, {
      id: Date.now(),
      name: "",
      threshold: "",
      unit: "",
      dataSource: ""
    }]);
  };
  const removeKPI = (id: number) => {
    setKpis(kpis.filter(kpi => kpi.id !== id));
  };
  const isEditing = !!slaId;
  const steps = [{
    number: 1,
    title: "Basic Information",
    icon: Settings
  }, {
    number: 2,
    title: "KPI Definition",
    icon: Target
  }, {
    number: 3,
    title: "Penalty Configuration",
    icon: Calculator
  }, {
    number: 4,
    title: "Notification Settings",
    icon: Bell
  }];
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleCreateSLA = () => {
    // Get the SLA name from the form
    const slaNameInput = document.getElementById("slaName") as HTMLInputElement;
    const name = slaNameInput?.value || "New SLA";

    // Generate a mock SLA ID
    const newSLAId = Date.now().toString();
    setSlaName(name);
    setCreatedSLAId(newSLAId);
    setShowSuccessDialog(true);
  };
  const handleViewDetails = () => {
    setShowSuccessDialog(false);
    if (onViewSLA && createdSLAId) {
      onViewSLA(createdSLAId);
    }
  };
  const handleGoToDashboard = () => {
    setShowSuccessDialog(false);
    onBack();
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Basic SLA Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slaName">SLA Name</Label>
                  <Input id="slaName" placeholder="Enter SLA name" />
                </div>
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">AWS Solutions</SelectItem>
                      <SelectItem value="techsupport">TechSupport Inc.</SelectItem>
                      <SelectItem value="cyberguard">CyberGuard LLC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the SLA scope and objectives" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contract">Associated Contract</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Link to contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract1">Software License Agreement</SelectItem>
                      <SelectItem value="contract2">Consulting Services Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
            </CardContent>
          </Card>;
      case 2:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {kpis.map((kpi, index) => <div key={kpi.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">KPI {index + 1}</h4>
                    {kpis.length > 1 && <Button size="sm" variant="ghost" onClick={() => removeKPI(kpi.id)} className="text-red-muted hover:text-red-accent">
                        <Trash2 className="h-4 w-4" />
                      </Button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>KPI Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or enter KPI" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uptime">Uptime %</SelectItem>
                          <SelectItem value="response">Response Time</SelectItem>
                          <SelectItem value="resolution">Resolution Time</SelectItem>
                          <SelectItem value="defect">Defect Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Threshold</Label>
                      <Input placeholder="e.g., 99.9" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Measurement Unit</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Percentage (%)</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Data Source</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api">API Endpoint</SelectItem>
                          <SelectItem value="manual">Manual Entry</SelectItem>
                          <SelectItem value="monitoring">Monitoring Tool</SelectItem>
                          <SelectItem value="servicedesk">Service Desk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>)}
              <Button variant="outline" onClick={addKPI} className="w-full transition-all duration-200 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Another KPI
              </Button>
            </CardContent>
          </Card>;
      case 3:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Penalty & Credit Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="penaltyType">Penalty Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select penalty type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="percentage">Percentage of Invoice</SelectItem>
                      <SelectItem value="credits">Service Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="penaltyRate">Penalty Rate</Label>
                  <Input id="penaltyRate" placeholder="Enter rate or amount" />
                </div>
              </div>
              <div>
                <Label htmlFor="formula">Penalty Calculation Formula</Label>
                <Textarea id="formula" placeholder="e.g., If Uptime < 99.5%, then Penalty = (Threshold - Actual) * FixedRate" className="font-mono" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="knockon" />
                <Label htmlFor="knockon">Adjust next payment cycle's invoice amount</Label>
              </div>
            </CardContent>
          </Card>;
      case 4:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="breach" defaultChecked />
                  <Label htmlFor="breach">Alert on SLA breach</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="atrisk" defaultChecked />
                  <Label htmlFor="atrisk">Alert when approaching threshold (within 10%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="weekly" />
                  <Label htmlFor="weekly">Weekly performance summary</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="recipients">Notification Recipients</Label>
                <Input id="recipients" placeholder="Enter email addresses separated by commas" />
              </div>
            </CardContent>
          </Card>;
      default:
        return null;
    }
  };
  return <div className="p-6 space-y-6 animate-fade-in bg-white rounded-2xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 hover:bg-red-accent-light border-gray-200 text-black">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit SLA" : "Create New SLA"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isEditing ? "Modify SLA configuration and thresholds" : "Define service level agreement parameters in 4 simple steps"}
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${currentStep > step.number ? 'bg-primary text-white' : currentStep === step.number ? 'bg-red-muted text-white' : 'bg-gray-200 text-gray-500'}`}>
                {currentStep > step.number ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                  Step {step.number}
                </p>
                <p className={`text-xs ${currentStep >= step.number ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && <ChevronRight className="h-5 w-5 text-gray-400 mx-4" />}
          </div>)}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="transition-all duration-200 hover:scale-105">
          Previous
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          {currentStep === 4 ? <Button onClick={isEditing ? undefined : handleCreateSLA} className="transition-all duration-200 hover:scale-105 bg-red-muted hover:bg-red-accent">
              {isEditing ? "Update SLA" : "Create SLA"}
            </Button> : <Button onClick={nextStep} className="transition-all duration-200 hover:scale-105 bg-red-muted hover:bg-red-accent">
              Next
            </Button>}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              SLA Added Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              The SLA "{slaName}" has been created successfully. What would you like to do next?
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleViewDetails} className="w-full bg-red-muted hover:bg-red-accent text-white">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button onClick={handleGoToDashboard} variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                <Home className="h-4 w-4 mr-2" />
                Go Back to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export { SLADefinition };