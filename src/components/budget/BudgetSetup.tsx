import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Settings, IndianRupee, Users, Building, ChevronRight, Check, CheckCircle, Eye, Home } from "lucide-react";
interface BudgetSetupProps {
  budgetId?: string | null;
  onBack: () => void;
}
const BudgetSetup = ({
  budgetId,
  onBack
}: BudgetSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([{
    id: 1,
    name: "",
    allocation: ""
  }]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [createdBudgetId, setCreatedBudgetId] = useState("");
  const addCategory = () => {
    setCategories([...categories, {
      id: Date.now(),
      name: "",
      allocation: ""
    }]);
  };
  const removeCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };
  const isEditing = !!budgetId;
  const steps = [{
    number: 1,
    title: "Basic Information",
    icon: Settings
  }, {
    number: 2,
    title: "Budget Hierarchy",
    icon: Building
  }, {
    number: 3,
    title: "Spending Categories",
    icon: IndianRupee
  }, {
    number: 4,
    title: "Review & Submit",
    icon: CheckCircle
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
  const handleCreateBudget = () => {
    // Get the budget name from the form
    const budgetNameInput = document.getElementById("budgetName") as HTMLInputElement;
    const name = budgetNameInput?.value || "New Budget";

    // Generate a mock budget ID
    const newBudgetId = Date.now().toString();
    setBudgetName(name);
    setCreatedBudgetId(newBudgetId);
    setShowSuccessDialog(true);
  };
  const handleViewDetails = () => {
    setShowSuccessDialog(false);
    onBack();
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
                Basic Budget Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetName">Budget Name</Label>
                  <Input id="budgetName" placeholder="Enter budget name" />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input id="totalAmount" type="number" placeholder="1000000" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the budget purpose and scope" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="owner">Budget Owner</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith (IT)</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson (Marketing)</SelectItem>
                      <SelectItem value="mike">Mike Davis (Operations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT Department</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fy">Financial Year</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select FY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">FY 2024</SelectItem>
                      <SelectItem value="2025">FY 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>;
      case 2:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Budget Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program">Program</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or create program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology Program</SelectItem>
                      <SelectItem value="marketing">Marketing Program</SelectItem>
                      <SelectItem value="operations">Operations Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project">Project (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Link to existing project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud-migration">Cloud Migration</SelectItem>
                      <SelectItem value="website-redesign">Website Redesign</SelectItem>
                      <SelectItem value="office-renovation">Office Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Hierarchy Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-primary bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Technology Program</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Program Level</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-primary bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Cloud Migration Project</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Project Level</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-red-accent bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-accent rounded-full"></div>
                        <span className="text-sm font-medium">Current Budget</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Budget Level</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>;
      case 3:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Spending Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, index) => <div key={category.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Category {index + 1}</h4>
                    {categories.length > 1 && <Button size="sm" variant="ghost" onClick={() => removeCategory(category.id)} className="text-red-accent hover:text-red-accent/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="software">Software & Licenses</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="consulting">Consulting Services</SelectItem>
                          <SelectItem value="travel">Travel & Expenses</SelectItem>
                          <SelectItem value="training">Training & Development</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Allocation Amount</Label>
                      <Input placeholder="Enter amount" type="number" />
                    </div>
                  </div>
                </div>)}
              <Button variant="outline" onClick={addCategory} className="w-full transition-all duration-200 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </CardContent>
          </Card>;
      case 4:
        return <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Budget Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Name:</span>
                      <span className="font-medium">Technology Infrastructure</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">₹1,00,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">IT Department</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Financial Year:</span>
                      <span className="font-medium">FY 2024</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Category Breakdown</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Software & Licenses:</span>
                      <span className="font-medium">₹40,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hardware:</span>
                      <span className="font-medium">₹30,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consulting Services:</span>
                      <span className="font-medium">₹20,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Training:</span>
                      <span className="font-medium">₹10,00,000</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-foreground mb-2">Important Note</h5>
                <p className="text-sm text-muted-foreground">
                  Once created, this budget will be active immediately and spending can begin. 
                  Make sure all information is correct before submitting.
                </p>
              </div>
            </CardContent>
          </Card>;
      default:
        return null;
    }
  };
  return <div className="p-6 space-y-6 animate-fade-in px-[24px] py-[24px] bg-white rounded-2xl">
      {/* Back Button */}
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 hover:bg-red-50 border-gray-200 text-black">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Budget" : "Create New Budget"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isEditing ? "Modify budget configuration and hierarchy" : "Define budget structure and spending categories in 4 simple steps"}
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${currentStep > step.number ? 'bg-primary text-white' : currentStep === step.number ? 'bg-red-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
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
          {currentStep === 4 ? <Button onClick={isEditing ? undefined : handleCreateBudget} className="transition-all duration-200 hover:scale-105 bg-red-accent hover:bg-red-accent/90">
              {isEditing ? "Update Budget" : "Create Budget"}
            </Button> : <Button onClick={nextStep} className="transition-all duration-200 hover:scale-105 bg-red-accent hover:bg-red-accent/90">
              Next
            </Button>}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Budget Created Successfully!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-background/50 border border-gray-200 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-gray-600 mb-2">
                Your budget <span className="font-semibold">{budgetName}</span> has been created successfully!
              </p>
              <p className="text-sm text-gray-500">
                You can now start managing and tracking expenses against this budget.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleViewDetails} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
              <Button onClick={handleGoToDashboard} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export { BudgetSetup };