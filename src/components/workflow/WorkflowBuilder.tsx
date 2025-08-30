import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Bot,
  User,
  Mail,
  GitBranch,
  Database,
  Settings,
  Play,
  Save,
  Eye,
  Plus,
  Trash2,
  ArrowRight,
  Circle,
  CheckCircle2
} from "lucide-react";
import { AITooltip } from "@/components/ui/ai-tooltip";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface WorkflowStep {
  id: string;
  type: 'document' | 'ai' | 'human' | 'communication' | 'decision' | 'integration';
  name: string;
  description: string;
  config?: any;
  position: { x: number; y: number };
  connections: string[];
}

interface StepType {
  type: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  examples: string[];
}

const stepTypes: StepType[] = [
  {
    type: 'document',
    name: 'Document Processing',
    description: 'Upload, scan, and process documents',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    examples: ['Upload RFP', 'Scan Applicant Docs', 'Document Validation']
  },
  {
    type: 'ai',
    name: 'AI Processing',
    description: 'Automated AI analysis and processing',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    examples: ['AI Pre-Extraction', 'Preliminary Scoring', 'Bias Check', 'PII Filtering']
  },
  {
    type: 'human',
    name: 'Human Review',
    description: 'Manual review and approval steps',
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    examples: ['Compliance Review', 'Technical Evaluation', 'Financial Review', 'Final Approval']
  },
  {
    type: 'communication',
    name: 'Communication',
    description: 'Automated notifications and emails',
    icon: Mail,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    examples: ['Send Missing Docs Email', 'Clarification Request', 'Results Notification']
  },
  {
    type: 'decision',
    name: 'Decision Points',
    description: 'Conditional logic and branching',
    icon: GitBranch,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    examples: ['If Qualified', 'If Score > X', 'Risk Assessment Gate']
  },
  {
    type: 'integration',
    name: 'Integration',
    description: 'External system integrations',
    icon: Database,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    examples: ['Export to ERP', 'Update CRM', 'Sync with Finance System']
  }
];

interface WorkflowBuilderProps {
  workflowId?: string;
  onSave: (workflow: any) => void;
  onCancel: () => void;
}

export const WorkflowBuilder = ({ workflowId, onSave, onCancel }: WorkflowBuilderProps) => {
  const [workflowName, setWorkflowName] = useState(workflowId ? "Edit Workflow" : "New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isDragMode, setIsDragMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addStep = (stepType: StepType) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type: stepType.type as any,
      name: stepType.examples[0],
      description: stepType.description,
      position: { x: 100 + workflowSteps.length * 200, y: 100 },
      connections: []
    };
    
    setWorkflowSteps(prev => [...prev, newStep]);
    setSelectedStep(newStep);
    
    toast({
      title: "Step Added",
      description: `${stepType.name} step has been added to the workflow.`
    });
  };

  const removeStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.filter(step => step.id !== stepId));
    setSelectedStep(null);
    
    toast({
      title: "Step Removed",
      description: "Workflow step has been removed."
    });
  };

  const connectSteps = (fromId: string, toId: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === fromId 
        ? { ...step, connections: [...step.connections, toId] }
        : step
    ));
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(st => st.type === type);
    return stepType?.icon || Circle;
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(st => st.type === type);
    return stepType?.color || 'text-gray-600';
  };

  const getStepBgColor = (type: string) => {
    const stepType = stepTypes.find(st => st.type === type);
    return stepType?.bgColor || 'bg-gray-50';
  };

  const handleSave = () => {
    if (workflowSteps.length === 0) {
      toast({
        title: "Cannot Save",
        description: "Please add at least one step to the workflow.",
        variant: "destructive"
      });
      return;
    }

    const workflow = {
      id: workflowId || `WF_${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      steps: workflowSteps,
      status: 'draft'
    };

    onSave(workflow);
    
    toast({
      title: "Workflow Saved",
      description: `${workflowName} has been saved successfully.`
    });
  };

  const handlePreview = () => {
    if (workflowSteps.length === 0) {
      toast({
        title: "No Steps to Preview",
        description: "Please add at least one step to preview the workflow.",
        variant: "destructive"
      });
      return;
    }
    setIsPreviewMode(!isPreviewMode);
    toast({
      title: isPreviewMode ? "Edit Mode" : "Preview Mode",
      description: isPreviewMode ? "You can now edit the workflow." : "Viewing workflow in preview mode."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                {workflowId ? 'Edit Workflow' : 'Workflow Builder'}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Design your procurement workflow by dragging and connecting steps
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                className={`transition-all duration-200 hover-scale ${
                  isPreviewMode 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Eye size={16} className="mr-2" />
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-red-accent hover:bg-red-accent/90 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                disabled={isPreviewMode}
              >
                <Save size={16} className="mr-2" />
                Save Workflow
              </Button>
              <Button variant="outline" onClick={onCancel} className="transition-all duration-200 hover-scale">
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Types Palette - Hide in preview mode */}
        {!isPreviewMode && (
          <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Available Steps</CardTitle>
              <p className="text-sm text-gray-600">Drag steps to add them to your workflow</p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {stepTypes.map((stepType) => {
                    const Icon = stepType.icon;
                    const getTooltipContent = (type: string) => {
                      switch (type) {
                        case "ai":
                          return "AI Processing steps use machine learning models for automated analysis. Includes Document Parsing Model v2.1, Scoring Engine v3.0, and Bias Detection algorithms. Configure data fields in Comparative Statement Configurator.";
                        case "document":
                          return "Document Processing handles file uploads, format validation, and OCR. Supports PDF, DOC, JPG formats. Auto-extracts structured data and creates searchable text versions.";
                        case "human":
                          return "Human Review steps require manual intervention. Assigns tasks to specific users or roles. Includes approval workflows, quality checks, and expert evaluations.";
                        case "decision":
                          return "Decision Points create conditional logic in workflows. Based on scores, thresholds, or manual decisions. Enables dynamic routing and exception handling.";
                        case "communication":
                          return "Communication steps send automated notifications via email, SMS, or system alerts. Templates include missing documents, approvals, and status updates.";
                        case "integration":
                          return "Integration steps connect to external systems like ERP, CRM, or financial platforms. Supports REST APIs, file exports, and data synchronization.";
                        default:
                          return "This workflow step automates part of your procurement process. Click to add to your workflow and configure specific settings.";
                      }
                    };

                    return (
                      <AITooltip
                        key={stepType.type}
                        content={getTooltipContent(stepType.type)}
                        type={stepType.type === "ai" ? "generation" : "extraction"}
                        confidence={stepType.type === "ai" ? 95 : 90}
                        source={stepType.type === "ai" ? "AI Model Registry" : "Workflow Engine"}
                      >
                        <div
                          className={`p-3 rounded-lg border-2 border-dashed border-gray-200 ${stepType.bgColor} hover:border-gray-300 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md`}
                          onClick={() => addStep(stepType)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-white shadow-sm transition-transform duration-200 hover:scale-110`}>
                              <Icon size={16} className={stepType.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm">{stepType.name}</h4>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{stepType.description}</p>
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1 font-medium">Examples:</p>
                                <div className="flex flex-wrap gap-1">
                                  {stepType.examples.slice(0, 2).map((example, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                      {example}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AITooltip>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Workflow Canvas */}
        <div className={`${isPreviewMode ? 'lg:col-span-4' : 'lg:col-span-2'} transition-all duration-300`}>
          <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 animate-scale-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {isPreviewMode ? 'Workflow Preview' : 'Workflow Canvas'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {isPreviewMode 
                  ? 'Preview of your workflow execution flow' 
                  : 'Visual representation of your workflow'
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className={`relative border-2 border-dashed border-gray-200 rounded-lg p-6 min-h-96 transition-all duration-300 ${
                isPreviewMode 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
                  : 'bg-gray-50'
              }`}>
                {workflowSteps.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center animate-fade-in">
                    <div>
                      <Circle size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">
                        {isPreviewMode 
                          ? 'No workflow steps to preview' 
                          : 'Start building your workflow by adding steps from the palette'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workflowSteps.map((step, index) => {
                      const Icon = getStepIcon(step.type);
                      return (
                        <div key={step.id} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className={`p-3 rounded-xl bg-white shadow-lg border-2 transition-all duration-200 ${
                            isPreviewMode 
                              ? 'border-blue-200 hover:shadow-xl hover:scale-105' 
                              : selectedStep?.id === step.id 
                                ? 'border-red-accent shadow-lg ring-2 ring-red-accent/20' 
                                : 'border-gray-200 hover:border-gray-300 cursor-pointer hover:shadow-md'
                          }`}
                          onClick={() => !isPreviewMode && setSelectedStep(step)}>
                            <Icon size={20} className={getStepColor(step.type)} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 text-sm">{step.name}</h4>
                              {isPreviewMode && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  Step {index + 1}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                            {isPreviewMode && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs text-green-600 font-medium">Ready</span>
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">Estimated: 15 mins</span>
                              </div>
                            )}
                          </div>
                          {!isPreviewMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStep(step.id);
                              }}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                          {index < workflowSteps.length - 1 && (
                            <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-300 transform translate-y-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel - Hide in preview mode */}
        {!isPreviewMode && (
          <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {selectedStep ? 'Step Configuration' : 'Workflow Settings'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {selectedStep ? 'Configure the selected step' : 'Configure your workflow properties'}
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {selectedStep ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Step Name</label>
                      <input
                        type="text"
                        value={selectedStep.name}
                        onChange={(e) => {
                          const updatedSteps = workflowSteps.map(step =>
                            step.id === selectedStep.id 
                              ? { ...step, name: e.target.value }
                              : step
                          );
                          setWorkflowSteps(updatedSteps);
                          setSelectedStep({ ...selectedStep, name: e.target.value });
                        }}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-accent/20 focus:border-red-accent transition-colors duration-200"
                        placeholder="Enter step name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={selectedStep.description}
                        onChange={(e) => {
                          const updatedSteps = workflowSteps.map(step =>
                            step.id === selectedStep.id 
                              ? { ...step, description: e.target.value }
                              : step
                          );
                          setWorkflowSteps(updatedSteps);
                          setSelectedStep({ ...selectedStep, description: e.target.value });
                        }}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-red-accent/20 focus:border-red-accent transition-colors duration-200"
                        placeholder="Enter step description"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Step Type</label>
                      <Badge variant="outline" className="mt-1 bg-gray-50 text-gray-700">
                        {stepTypes.find(t => t.type === selectedStep.type)?.name}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Workflow Name</label>
                      <input
                        type="text"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        placeholder="Enter workflow name"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-accent/20 focus:border-red-accent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={workflowDescription}
                        onChange={(e) => setWorkflowDescription(e.target.value)}
                        placeholder="Describe what this workflow does"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-red-accent/20 focus:border-red-accent transition-colors duration-200"
                      />
                    </div>
                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Workflow Summary</h4>
                      <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                        <p>• Total Steps: {workflowSteps.length}</p>
                        <p>• Document Steps: {workflowSteps.filter(s => s.type === 'document').length}</p>
                        <p>• AI Steps: {workflowSteps.filter(s => s.type === 'ai').length}</p>
                        <p>• Human Steps: {workflowSteps.filter(s => s.type === 'human').length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Workflow Validation */}
      {workflowSteps.length > 0 && (
        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              Workflow Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-medium text-green-800">Steps Valid</h4>
                <p className="text-sm text-green-600 mt-1">
                  All {workflowSteps.length} steps are properly configured
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-medium text-green-800">Flow Connected</h4>
                <p className="text-sm text-green-600 mt-1">
                  Workflow has a clear start and end point
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <h4 className="font-medium text-yellow-800">Suggestions</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  Consider adding notification steps after AI processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};