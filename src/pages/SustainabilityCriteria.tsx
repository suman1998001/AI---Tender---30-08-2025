import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Save, Trash2, Settings, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SustainabilityCriteria = () => {
  const navigate = useNavigate();
  const customCriteriaSectionRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCriteria, setSelectedCriteria] = useState<number[]>([]);
  const [criteriaWeights, setCriteriaWeights] = useState<Record<number, number>>({});
  const [criteriaThresholds, setCriteriaThresholds] = useState<Record<number, string>>({});
  const [showCustomCriteria, setShowCustomCriteria] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [customCriteria, setCustomCriteria] = useState({
    name: "",
    description: "",
    unit: "",
    scoringLogic: ""
  });

  // Mock data for ESG criteria library
  const esgLibrary = [
    { id: 1, name: "Carbon Footprint", description: "Total CO2 emissions per year", category: "Environmental", unit: "tons CO2/year" },
    { id: 2, name: "Water Usage", description: "Annual water consumption", category: "Environmental", unit: "liters/year" },
    { id: 3, name: "Renewable Energy Usage", description: "Percentage of renewable energy used", category: "Environmental", unit: "%" },
    { id: 4, name: "Fair Labor Practices", description: "Compliance with fair labor standards", category: "Social", unit: "score" },
    { id: 5, name: "Diversity & Inclusion", description: "Workplace diversity metrics", category: "Social", unit: "%" },
    { id: 6, name: "Community Investment", description: "Investment in local communities", category: "Social", unit: "% of revenue" },
    { id: 7, name: "Board Independence", description: "Percentage of independent board members", category: "Governance", unit: "%" },
    { id: 8, name: "Ethical Business Practices", description: "Anti-corruption and ethics policies", category: "Governance", unit: "score" },
    { id: 9, name: "Waste Reduction", description: "Waste reduction initiatives", category: "Environmental", unit: "tons/year" },
    { id: 10, name: "Supply Chain Transparency", description: "Transparency in supply chain practices", category: "Governance", unit: "score" }
  ];

  const filteredCriteria = esgLibrary.filter(criteria =>
    criteria.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criteria.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criteria.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCriteriaSelect = (criteriaId: number, checked: boolean) => {
    if (checked) {
      setSelectedCriteria([...selectedCriteria, criteriaId]);
      setCriteriaWeights({ ...criteriaWeights, [criteriaId]: 50 });
      setCriteriaThresholds({ ...criteriaThresholds, [criteriaId]: "" });
    } else {
      setSelectedCriteria(selectedCriteria.filter(id => id !== criteriaId));
      const newWeights = { ...criteriaWeights };
      const newThresholds = { ...criteriaThresholds };
      delete newWeights[criteriaId];
      delete newThresholds[criteriaId];
      setCriteriaWeights(newWeights);
      setCriteriaThresholds(newThresholds);
    }
  };

  const handleWeightChange = (criteriaId: number, weight: number[]) => {
    setCriteriaWeights({ ...criteriaWeights, [criteriaId]: weight[0] });
  };

  const handleThresholdChange = (criteriaId: number, threshold: string) => {
    setCriteriaThresholds({ ...criteriaThresholds, [criteriaId]: threshold });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Environmental":
        return "bg-green-100 text-green-800";
      case "Social":
        return "bg-blue-100 text-blue-800";
      case "Governance":
        return "bg-red-accent/10 text-red-accent";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSaveAndPublish = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically save to backend
    console.log("Selected criteria:", selectedCriteria);
    console.log("Weights:", criteriaWeights);
    console.log("Thresholds:", criteriaThresholds);
    console.log("Custom criteria:", customCriteria);
    
    setIsLoading(false);
    setShowSuccessModal(true);
  };

  const handleAddCustomCriteriaClick = () => {
    setShowCustomCriteria(true);
    setTimeout(() => {
      customCriteriaSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleModalGoBack = () => {
    setShowSuccessModal(false);
    navigate("/sustainable-procurement");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/sustainable-procurement")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Define Sustainability Criteria</h1>
            <p className="text-muted-foreground mt-2">Configure your organization's ESG evaluation framework</p>
          </div>
          <Button 
            onClick={handleSaveAndPublish}
            disabled={isLoading}
            className="bg-red-accent hover:bg-red-muted text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save & Publish Criteria
              </>
            )}
          </Button>
        </div>

        {/* Section 1: Core Criteria Library */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Select from our ESG Library
                </CardTitle>
                <Button 
                  onClick={handleAddCustomCriteriaClick}
                  variant="outline"
                  size="sm"
                  className="bg-red-accent/5 hover:bg-red-accent/10 border-red-accent text-red-accent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Criteria
                </Button>
              </div>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search criteria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Badge variant="secondary">{selectedCriteria.length} selected</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCriteria.map((criteria) => (
                <Card 
                  key={criteria.id} 
                  className={`cursor-pointer transition-all ${selectedCriteria.includes(criteria.id) ? 'ring-2 ring-red-accent bg-red-accent/5' : 'hover:shadow-md'}`}
                  onClick={() => handleCriteriaSelect(criteria.id, !selectedCriteria.includes(criteria.id))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedCriteria.includes(criteria.id)}
                        onChange={() => {}} // Handled by card click
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{criteria.name}</h4>
                          <Badge className={getCategoryColor(criteria.category)}>
                            {criteria.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{criteria.description}</p>
                        <p className="text-xs font-medium text-red-accent">Unit: {criteria.unit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Weighting & Thresholds */}
        {selectedCriteria.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Set Importance & Goals</CardTitle>
              <p className="text-sm text-muted-foreground">Configure weighting and performance thresholds for selected criteria</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedCriteria.map((criteriaId) => {
                  const criteria = esgLibrary.find(c => c.id === criteriaId);
                  if (!criteria) return null;
                  
                  return (
                    <Card key={criteriaId} className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-medium">{criteria.name}</h4>
                            <Badge className={getCategoryColor(criteria.category)}>
                              {criteria.category}
                            </Badge>
                          </div>
                          <Label className="text-sm font-medium mb-2 block">
                            Weighting: {criteriaWeights[criteriaId] || 50}%
                          </Label>
                          <Slider
                            value={[criteriaWeights[criteriaId] || 50]}
                            onValueChange={(value) => handleWeightChange(criteriaId, value)}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`threshold-${criteriaId}`} className="text-sm font-medium mb-2 block">
                            Performance Threshold ({criteria.unit})
                          </Label>
                          <Input
                            id={`threshold-${criteriaId}`}
                            placeholder={`e.g., Below 500 ${criteria.unit}`}
                            value={criteriaThresholds[criteriaId] || ""}
                            onChange={(e) => handleThresholdChange(criteriaId, e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 4: Custom Criteria Builder (conditionally shown) */}
        {showCustomCriteria && (
          <div ref={customCriteriaSectionRef}>
            <Card className="border-red-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Custom Criteria
                </CardTitle>
                <p className="text-sm text-muted-foreground">Create organization-specific sustainability criteria</p>
              </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-name" className="text-sm font-medium">Name</Label>
                    <Input
                      id="custom-name"
                      placeholder="e.g., Local Sourcing Percentage"
                      value={customCriteria.name}
                      onChange={(e) => setCustomCriteria({ ...customCriteria, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-unit" className="text-sm font-medium">Measurement Unit</Label>
                    <Input
                      id="custom-unit"
                      placeholder="e.g., %, tons, score (1-10)"
                      value={customCriteria.unit}
                      onChange={(e) => setCustomCriteria({ ...customCriteria, unit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="custom-description"
                      placeholder="Describe what this criteria measures..."
                      value={customCriteria.description}
                      onChange={(e) => setCustomCriteria({ ...customCriteria, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-scoring" className="text-sm font-medium">Scoring Logic</Label>
                    <Textarea
                      id="custom-scoring"
                      placeholder="Describe how this criteria should be scored..."
                      value={customCriteria.scoringLogic}
                      onChange={(e) => setCustomCriteria({ ...customCriteria, scoringLogic: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomCriteria(false)}
                  className="hover:bg-muted"
                >
                  Cancel
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="hover:bg-muted">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Form
                  </Button>
                  <Button className="bg-red-accent hover:bg-red-muted text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Criteria
                  </Button>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        )}

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center justify-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                Success!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Sustainability criteria has been saved successfully.
              </p>
              <Button 
                onClick={handleModalGoBack}
                className="bg-red-accent hover:bg-red-muted text-white w-full"
              >
                Go Back
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SustainabilityCriteria;