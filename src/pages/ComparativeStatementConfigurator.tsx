import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Plus, 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  Eye, 
  Save, 
  FileText,
  Settings,
  Layout,
  GripVertical,
  Copy,
  ArrowLeft
} from 'lucide-react';

interface DataField {
  id: string;
  name: string;
  dataType: string;
  extractionGuidance: string;
  isRequired: boolean;
  isAISuggested?: boolean;
}

interface ComparisonCriteria {
  id: string;
  fieldId: string;
  name: string;
  comparisonType: string;
  targetValue: string;
  weight: number;
  scoringLogic: string;
  isDisqualifying: boolean;
}

interface LayoutElement {
  id: string;
  type: string;
  name: string;
  fieldId?: string;
}

const ComparativeStatementConfigurator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("extraction");
  const [dataFields, setDataFields] = useState<DataField[]>([]);
  const [comparisonCriteria, setComparisonCriteria] = useState<ComparisonCriteria[]>([]);
  const [layoutElements, setLayoutElements] = useState<LayoutElement[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("");
  const [newFieldGuidance, setNewFieldGuidance] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);

  // Mock existing templates
  const existingTemplates = [
    { id: '1', name: 'IT Services Evaluation', description: 'Standard template for IT service tenders', fields: 8, lastModified: '2024-01-15' },
    { id: '2', name: 'Construction Projects', description: 'Template for construction and infrastructure projects', fields: 12, lastModified: '2024-01-10' },
    { id: '3', name: 'Consulting Services', description: 'Professional consulting services evaluation', fields: 6, lastModified: '2024-01-08' },
    { id: '4', name: 'Supply Chain & Logistics', description: 'Template for supply chain and logistics tenders', fields: 10, lastModified: '2024-01-05' }
  ];
  const aiSuggestedFields = [
    { id: 'ai-1', name: 'Bid Price', dataType: 'Currency', extractionGuidance: 'Extract the total bid amount from the pricing section', isRequired: true, isAISuggested: true },
    { id: 'ai-2', name: 'Delivery Timeline', dataType: 'Number', extractionGuidance: 'Extract delivery time in days from project timeline section', isRequired: true, isAISuggested: true },
    { id: 'ai-3', name: 'Project Manager Qualifications', dataType: 'Text', extractionGuidance: 'Extract project manager experience and certifications', isRequired: false, isAISuggested: true },
    { id: 'ai-4', name: 'Company Registration Number', dataType: 'Text', extractionGuidance: 'Extract official company registration number', isRequired: true, isAISuggested: true },
    { id: 'ai-5', name: 'Insurance Coverage', dataType: 'Currency', extractionGuidance: 'Extract insurance coverage amount', isRequired: false, isAISuggested: true }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file upload and AI analysis
    setTimeout(() => {
      setUploading(false);
      setDocumentUploaded(true);
      toast({
        title: "Document Analyzed",
        description: `AI has analyzed "${file.name}" and suggested ${aiSuggestedFields.length} data fields for extraction.`,
      });
    }, 2000);
  };

  const acceptAIField = (field: DataField) => {
    setDataFields(prev => [...prev, { ...field, isAISuggested: false }]);
    toast({
      title: "Field Added",
      description: `"${field.name}" has been added to your data extraction fields.`,
    });
  };

  const addCustomField = () => {
    if (!newFieldName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a field name.",
        variant: "destructive",
      });
      return;
    }

    if (!newFieldType) {
      toast({
        title: "Missing Information", 
        description: "Please select a data type.",
        variant: "destructive",
      });
      return;
    }

    const newField: DataField = {
      id: `custom-${Date.now()}`,
      name: newFieldName.trim(),
      dataType: newFieldType,
      extractionGuidance: newFieldGuidance.trim(),
      isRequired: newFieldRequired,
      isAISuggested: false
    };

    setDataFields(prev => [...prev, newField]);
    
    // Reset form
    setNewFieldName("");
    setNewFieldType("");
    setNewFieldGuidance("");
    setNewFieldRequired(false);
    
    toast({
      title: "Custom Field Added",
      description: `"${newField.name}" has been added to your data extraction fields.`,
    });

    // Scroll to the configured fields section to show the new field
    setTimeout(() => {
      const configuredSection = document.getElementById('configured-fields-section');
      if (configuredSection) {
        configuredSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const removeField = (fieldId: string) => {
    setDataFields(prev => prev.filter(field => field.id !== fieldId));
    setComparisonCriteria(prev => prev.filter(criteria => criteria.fieldId !== fieldId));
  };

  const generateCriteriaForFields = () => {
    const newCriteria: ComparisonCriteria[] = dataFields.map(field => ({
      id: `criteria-${field.id}`,
      fieldId: field.id,
      name: field.name,
      comparisonType: field.dataType === 'Currency' || field.dataType === 'Number' ? 'Lesser Is Better' : 'Exact Match',
      targetValue: '',
      weight: 20,
      scoringLogic: 'Linear Scale',
      isDisqualifying: field.isRequired
    }));
    
    setComparisonCriteria(newCriteria);
    setActiveTab("comparison");
    
    toast({
      title: "Comparison Criteria Generated",
      description: `Created comparison criteria for ${newCriteria.length} fields.`,
    });
  };

  const updateCriteria = (fieldId: string, updates: Partial<ComparisonCriteria>) => {
    setComparisonCriteria(prev => 
      prev.map(criteria => 
        criteria.fieldId === fieldId 
          ? { ...criteria, ...updates }
          : criteria
      )
    );
  };

  const editField = (fieldId: string) => {
    setEditingField(fieldId);
    const field = dataFields.find(f => f.id === fieldId);
    if (field) {
      setNewFieldName(field.name);
      setNewFieldType(field.dataType);
      setNewFieldGuidance(field.extractionGuidance);
      setNewFieldRequired(field.isRequired);
    }
  };

  const updateField = () => {
    if (!editingField || !newFieldName || !newFieldType) return;
    
    setDataFields(prev => 
      prev.map(field => 
        field.id === editingField 
          ? { ...field, name: newFieldName, dataType: newFieldType, extractionGuidance: newFieldGuidance, isRequired: newFieldRequired }
          : field
      )
    );
    
    setEditingField(null);
    setNewFieldName("");
    setNewFieldType("");
    setNewFieldGuidance("");
    setNewFieldRequired(false);
    
    toast({
      title: "Field Updated",
      description: "Field has been updated successfully.",
    });
  };

  const handleDragStart = (elementType: string, fieldId?: string) => {
    setDraggedElement(fieldId ? `${elementType}-${fieldId}` : elementType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement) return;

    const newElement: LayoutElement = {
      id: `element-${Date.now()}`,
      type: draggedElement.split('-')[0],
      name: draggedElement.includes('-') 
        ? dataFields.find(f => f.id === draggedElement.split('-')[1])?.name || draggedElement
        : draggedElement,
      fieldId: draggedElement.includes('-') ? draggedElement.split('-')[1] : undefined
    };

    setLayoutElements(prev => [...prev, newElement]);
    setDraggedElement(null);
    
    toast({
      title: "Element Added",
      description: `${newElement.name} has been added to your report layout.`,
    });
  };

  const removeLayoutElement = (elementId: string) => {
    setLayoutElements(prev => prev.filter(el => el.id !== elementId));
  };

  const saveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your custom comparative statement template has been saved successfully.",
    });
  };

  const loadTemplate = (templateId: string) => {
    const template = existingTemplates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: "Template Loaded",
        description: `"${template.name}" template has been loaded successfully.`,
      });
      setShowTemplateDialog(false);
    }
  };

  const saveAndStartEvaluation = () => {
    toast({
      title: "Configuration Saved",
      description: "Your comparative statement has been saved. Redirecting to evaluation...",
    });
    
    setTimeout(() => {
      navigate('/ai-document-evaluation');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Go Back Button */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/ai-document-evaluation')}
            className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Progress Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 border border-gray-200">
            <TabsTrigger value="extraction" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <FileText className="w-4 h-4" />
              Define Data Extraction
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <Settings className="w-4 h-4" />
              Configure Comparison Logic
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <Layout className="w-4 h-4" />
              Design Report Layout
            </TabsTrigger>
          </TabsList>

          {/* Section 1: Define Data Extraction */}
          <TabsContent value="extraction" className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <FileText className="w-5 h-5" />
                  1. What Data Do You Need to Extract?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload a sample document or manually add fields to instruct the AI on what key information to pull from tender submissions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Document Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-700 mb-2">
                      {uploading ? "Analyzing Document..." : "Upload Sample Document"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Drop your PDF or Word document here, or click to browse
                    </p>
                  </label>
                </div>

                {/* AI Suggested Fields */}
                {!uploading && documentUploaded && (
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">AI-Suggested Fields</h3>
                    <div className="grid gap-3">
                      {aiSuggestedFields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{field.name}</span>
                              <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">{field.dataType}</Badge>
                              {field.isRequired && <Badge variant="outline" className="text-xs text-red-600 border-red-300 bg-red-50">Required</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{field.extractionGuidance}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-gray-900 text-white hover:bg-gray-800"
                              onClick={() => acceptAIField(field)}
                              disabled={dataFields.some(f => f.id === field.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="bg-gray-200" />

                {/* Manual Field Addition */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Add Custom Field</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label htmlFor="field-name" className="text-sm font-medium text-gray-700">Field Name</Label>
                      <Input
                        id="field-name"
                        placeholder="e.g., Monthly Service Fee"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-type" className="text-sm font-medium text-gray-700">Data Type</Label>
                      <Select value={newFieldType} onValueChange={setNewFieldType}>
                        <SelectTrigger className="mt-1 border-gray-300">
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="Text">Text</SelectItem>
                          <SelectItem value="Number">Number</SelectItem>
                          <SelectItem value="Currency">Currency</SelectItem>
                          <SelectItem value="Date">Date</SelectItem>
                          <SelectItem value="Boolean">Boolean</SelectItem>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                          <SelectItem value="List">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="field-guidance" className="text-sm font-medium text-gray-700">Extraction Guidance</Label>
                      <Textarea
                        id="field-guidance"
                        placeholder="Provide instructions on how to extract this field..."
                        value={newFieldGuidance}
                        onChange={(e) => setNewFieldGuidance(e.target.value)}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="field-required" 
                        checked={newFieldRequired}
                        onCheckedChange={(checked) => setNewFieldRequired(checked as boolean)}
                        className="border-gray-300"
                      />
                      <Label htmlFor="field-required" className="text-sm text-gray-700">Required Field</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      {editingField && (
                        <Button variant="outline" onClick={() => {
                          setEditingField(null);
                          setNewFieldName("");
                          setNewFieldType("");
                          setNewFieldGuidance("");
                          setNewFieldRequired(false);
                        }} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                          Cancel
                        </Button>
                      )}
                      <Button onClick={editingField ? updateField : addCustomField} className="bg-gray-900 text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        {editingField ? "Update Field" : "Add Field"}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Configured Fields List */}
                <div id="configured-fields-section">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-900">Configured Fields ({dataFields.length})</h3>
                    {dataFields.length > 0 && (
                      <Button onClick={generateCriteriaForFields} className="bg-gray-900 text-white hover:bg-gray-800">
                        Continue to Comparison Logic
                      </Button>
                    )}
                  </div>
                  {dataFields.length > 0 ? (
                    <div className="space-y-3">
                      {dataFields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{field.name}</span>
                              <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">{field.dataType}</Badge>
                              {field.isRequired && <Badge variant="outline" className="text-xs text-red-600 border-red-300 bg-red-50">Required</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{field.extractionGuidance}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editField(field.id)} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => removeField(field.id)} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                      No fields configured yet. Upload a document for AI suggestions or add custom fields.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 2: Configure Comparison Logic */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <Settings className="w-5 h-5" />
                  2. How Will You Compare & Score Each Criteria?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Set rules, assign importance (weights), and define scoring methods for each extracted data point.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {dataFields.length > 0 ? (
                  <div className="space-y-6">
                    {dataFields.map((field) => {
                      const criteria = comparisonCriteria.find(c => c.fieldId === field.id);
                      return (
                        <Card key={field.id} className="border border-gray-200">
                          <CardHeader className="pb-3 border-b border-gray-200">
                            <CardTitle className="text-base text-gray-900">{field.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Comparison Type</Label>
                              <Select 
                                value={criteria?.comparisonType || "Lesser Is Better"} 
                                onValueChange={(value) => updateCriteria(field.id, { comparisonType: value })}
                              >
                                <SelectTrigger className="mt-1 border-gray-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200">
                                  <SelectItem value="Lesser Is Better">Lesser Is Better</SelectItem>
                                  <SelectItem value="Greater Is Better">Greater Is Better</SelectItem>
                                  <SelectItem value="Exact Match">Exact Match</SelectItem>
                                  <SelectItem value="Range Check">Range Check</SelectItem>
                                  <SelectItem value="Boolean Check">Boolean Check</SelectItem>
                                  <SelectItem value="Text Contains">Text Contains</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Target Value / Threshold</Label>
                              <Input 
                                placeholder="Enter target value..." 
                                value={criteria?.targetValue || ""} 
                                onChange={(e) => updateCriteria(field.id, { targetValue: e.target.value })} 
                                className="mt-1 border-gray-300" 
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Weight ({criteria?.weight || 20}%)</Label>
                              <Slider
                                value={[criteria?.weight || 20]}
                                onValueChange={(value) => updateCriteria(field.id, { weight: value[0] })}
                                max={100}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Scoring Logic</Label>
                              <Select 
                                value={criteria?.scoringLogic || "Linear Scale"}
                                onValueChange={(value) => updateCriteria(field.id, { scoringLogic: value })}
                              >
                                <SelectTrigger className="mt-1 border-gray-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200">
                                  <SelectItem value="Linear Scale">Linear Scale</SelectItem>
                                  <SelectItem value="Tiered Points">Tiered Points</SelectItem>
                                  <SelectItem value="Pass/Fail Only">Pass/Fail Only</SelectItem>
                                  <SelectItem value="Custom Formula">Custom Formula</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`disqualifying-${field.id}`} 
                                  checked={criteria?.isDisqualifying || field.isRequired}
                                  onCheckedChange={(checked) => updateCriteria(field.id, { isDisqualifying: checked as boolean })}
                                  className="border-gray-300"
                                />
                                <Label htmlFor={`disqualifying-${field.id}`} className="text-sm text-gray-700">
                                  If this criterion is NOT met, the bidder is automatically disqualified
                                </Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <div className="flex justify-end">
                      <Button onClick={() => setActiveTab("layout")} className="bg-gray-900 text-white hover:bg-gray-800">
                        Continue to Report Layout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No data fields configured. Please go back to the previous step to define your data extraction fields.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 3: Design Report Layout */}
          <TabsContent value="layout" className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <Layout className="w-5 h-5" />
                  3. Design Your Custom Report Card Layout
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Use the drag-and-drop composer to arrange your criteria and build the visual structure of your comparative statement.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Toolbox */}
                  <div className="lg:col-span-1">
                    <h3 className="font-medium text-gray-900 mb-4">Toolbox</h3>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 mb-2">Defined Criteria</div>
                      {dataFields.map((field) => (
                        <div 
                          key={field.id} 
                          draggable 
                          onDragStart={() => handleDragStart('criterion', field.id)}
                          className="p-2 bg-gray-50 border border-gray-200 rounded cursor-move flex items-center gap-2 hover:bg-gray-100"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{field.name}</span>
                        </div>
                      ))}
                      
                      <div className="text-sm font-medium text-gray-600 mb-2 mt-4">Report Elements</div>
                      <div 
                        draggable 
                        onDragStart={() => handleDragStart('text-block')}
                        className="p-2 bg-gray-50 border border-gray-200 rounded cursor-move flex items-center gap-2 hover:bg-gray-100"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Text Block</span>
                      </div>
                      <div 
                        draggable 
                        onDragStart={() => handleDragStart('section-divider')}
                        className="p-2 bg-gray-50 border border-gray-200 rounded cursor-move flex items-center gap-2 hover:bg-gray-100"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Section Divider</span>
                      </div>
                      <div 
                        draggable 
                        onDragStart={() => handleDragStart('summary-box')}
                        className="p-2 bg-gray-50 border border-gray-200 rounded cursor-move flex items-center gap-2 hover:bg-gray-100"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Summary Box</span>
                      </div>
                      <div 
                        draggable 
                        onDragStart={() => handleDragStart('logo-placeholder')}
                        className="p-2 bg-gray-50 border border-gray-200 rounded cursor-move flex items-center gap-2 hover:bg-gray-100"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Logo Placeholder</span>
                      </div>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="lg:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-4">Canvas</h3>
                    <div 
                      className="min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {layoutElements.length === 0 ? (
                        <div className="text-center text-gray-500 py-20">
                          <Layout className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">Drag elements from the toolbox to build your report layout</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {layoutElements.map((element) => (
                            <div key={element.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{element.name}</span>
                                <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">{element.type}</Badge>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => removeLayoutElement(element.id)} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="sticky bottom-6 bg-white border border-gray-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                      Load Existing Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Load Existing Template</DialogTitle>
                      <DialogDescription>
                        Select a template to load into your configurator
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollable-container">
                      {existingTemplates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{template.fields} fields</span>
                              <span>Modified: {template.lastModified}</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => loadTemplate(template.id)}
                            className="bg-gray-900 text-white hover:bg-gray-800"
                          >
                            Load
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={saveTemplate} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
                <Button onClick={saveAndStartEvaluation} className="bg-gray-900 text-white hover:bg-gray-800">
                  Save Custom Criteria & Start Evaluation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparativeStatementConfigurator; 