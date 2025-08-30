import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Pause, 
  User, 
  Bot, 
  Mail,
  FileText,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

interface WorkflowInstance {
  id: string;
  workflowName: string;
  rfpId: string;
  rfpTitle: string;
  applicantName: string;
  currentStep: string;
  status: 'running' | 'paused' | 'waiting' | 'error';
  progress: number;
  startedAt: string;
  estimatedCompletion: string;
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  stepHistory: ActivityEvent[];
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  step: string;
  action: string;
  actor: 'ai' | 'system' | 'user';
  actorName: string;
  status: 'completed' | 'failed' | 'in-progress';
  details: string;
  processingTime?: string;
}

const mockInstances: WorkflowInstance[] = [
  {
    id: "WI001",
    workflowName: "Standard RFP Processing",
    rfpId: "RFP-2024-001",
    rfpTitle: "IT Infrastructure Modernization",
    applicantName: "TechCorp Solutions Ltd.",
    currentStep: "Human Review - Technical Evaluation",
    status: "waiting",
    progress: 65,
    startedAt: "2024-01-15T09:30:00",
    estimatedCompletion: "2024-01-15T16:45:00",
            assignedTo: "Priya Sharma",
    priority: "high",
    stepHistory: [
      {
        id: "AE001",
        timestamp: "2024-01-15T09:30:00",
        step: "Document Ingestion",
        action: "Documents uploaded and validated",
        actor: "system",
        actorName: "System",
        status: "completed",
        details: "15 documents processed, all validations passed",
        processingTime: "0.3h"
      },
      {
        id: "AE002", 
        timestamp: "2024-01-15T10:15:00",
        step: "AI Pre-Extraction",
        action: "Information extracted from documents",
        actor: "ai",
        actorName: "MSTRL-turbo",
        status: "completed",
        details: "Extracted company info, financial data, technical specifications",
        processingTime: "0.7h"
      },
      {
        id: "AE003",
        timestamp: "2024-01-15T11:30:00",
        step: "AI Preliminary Scoring",
        action: "Initial scoring completed",
        actor: "ai",
        actorName: "Claude 3",
        status: "completed",
        details: "Technical score: 85/100, Financial score: 78/100",
        processingTime: "1.2h"
      },
      {
        id: "AE004",
        timestamp: "2024-01-15T13:00:00",
        step: "Human Review - Technical",
        action: "Technical evaluation in progress",
        actor: "user",
        actorName: "Priya Sharma",
        status: "in-progress",
        details: "Reviewing technical specifications and capabilities"
      }
    ]
  },
  {
    id: "WI002",
    workflowName: "High-Value Contract Review",
    rfpId: "RFP-2024-002",
    rfpTitle: "Hospital Equipment Procurement",
    applicantName: "MediTech Industries Pvt. Ltd.",
    currentStep: "AI Processing - Risk Assessment",
    status: "running",
    progress: 35,
    startedAt: "2024-01-15T14:00:00",
    estimatedCompletion: "2024-01-16T10:30:00",
    priority: "high",
    stepHistory: [
      {
        id: "AE005",
        timestamp: "2024-01-15T14:00:00",
        step: "Document Ingestion",
        action: "High-value document set processed",
        actor: "system",
        actorName: "System",
        status: "completed",
        details: "28 documents processed, compliance verified",
        processingTime: "0.5h"
      },
      {
        id: "AE006",
        timestamp: "2024-01-15T15:30:00",
        step: "AI Risk Assessment",
        action: "Risk analysis in progress",
        actor: "ai",
        actorName: "Gemini Pro",
        status: "in-progress",
        details: "Analyzing financial stability and regulatory compliance"
      }
    ]
  },
  {
    id: "WI003",
    workflowName: "Emergency Procurement",
    rfpId: "RFP-2024-003",
    rfpTitle: "Emergency Medical Supplies",
    applicantName: "QuickMed Supplies Co.",
    currentStep: "Decision Point - Approval Gate",
    status: "error",
    progress: 80,
    startedAt: "2024-01-15T11:00:00",
    estimatedCompletion: "2024-01-15T15:00:00",
            assignedTo: "Rajesh Kumar",
    priority: "high",
    stepHistory: [
      {
        id: "AE007",
        timestamp: "2024-01-15T11:00:00",
        step: "Fast-track Processing",
        action: "Emergency processing initiated",
        actor: "system",
        actorName: "System",
        status: "completed",
        details: "Expedited document validation completed",
        processingTime: "0.2h"
      },
      {
        id: "AE008",
        timestamp: "2024-01-15T14:00:00",
        step: "Approval Gate",
        action: "Approval process failed",
        actor: "system",
        actorName: "System",
        status: "failed",
        details: "Missing regulatory certification documents"
      }
    ]
  }
];

export const WorkflowMonitoring = () => {
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);
  const [instances, setInstances] = useState<WorkflowInstance[]>(mockInstances);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      running: { color: "bg-green-100 text-green-800 border-green-200", icon: Play },
      paused: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Pause },
      waiting: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
      error: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
      <Badge variant="outline" className={colors[priority as keyof typeof colors]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getActorIcon = (actor: string) => {
    const icons = {
      ai: Bot,
      system: Activity,
      user: User
    };
    return icons[actor as keyof typeof icons] || Activity;
  };

  const getStepIcon = (step: string) => {
    if (step.includes('Document')) return FileText;
    if (step.includes('AI')) return Bot;
    if (step.includes('Human') || step.includes('Review')) return User;
    if (step.includes('Email') || step.includes('Notification')) return Mail;
    return Activity;
  };

  const handleInstanceAction = (instanceId: string, action: string) => {
    setInstances(prev => prev.map(instance => 
      instance.id === instanceId 
        ? { 
            ...instance, 
            status: action === 'pause' ? 'paused' : action === 'resume' ? 'running' : instance.status
          }
        : instance
    ));
  };

  return (
    <div className="space-y-6">
      {/* Active Workflow Instances */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
            <Activity size={20} />
            Active Workflow Instances
          </CardTitle>
          <p className="text-sm text-gray-600">
            Monitor running workflows and their current status
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instances.map((instance) => (
              <div 
                key={instance.id}
                className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 ${selectedInstance?.id === instance.id ? 'ring-2 ring-red-accent bg-red-50' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => setSelectedInstance(instance)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-black">{instance.workflowName}</h3>
                      {getStatusBadge(instance.status)}
                      {getPriorityBadge(instance.priority)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{instance.rfpId}:</span> {instance.rfpTitle}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Applicant:</span> {instance.applicantName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Started: {new Date(instance.startedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      ETA: {new Date(instance.estimatedCompletion).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-black">Current Step:</p>
                    <span className="text-sm text-gray-600">{instance.progress}% Complete</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{instance.currentStep}</p>
                  <Progress value={instance.progress} className="h-2" />
                </div>

                {instance.assignedTo && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Assigned to: {instance.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {instance.status === 'running' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstanceAction(instance.id, 'pause');
                          }}
                        >
                          <Pause size={14} className="mr-1" />
                          Pause
                        </Button>
                      )}
                      {instance.status === 'paused' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstanceAction(instance.id, 'resume');
                          }}
                        >
                          <Play size={14} className="mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink size={14} className="mr-1" />
                        View RFP
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Stream */}
      {selectedInstance && (
        <Card className="rounded-[15px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">
              Activity Stream - {selectedInstance.workflowName}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Detailed timeline for {selectedInstance.rfpId} - {selectedInstance.applicantName}
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {selectedInstance.stepHistory.map((event, index) => {
                  const ActorIcon = getActorIcon(event.actor);
                  const StepIcon = getStepIcon(event.step);
                  
                  return (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${
                          event.status === 'completed' ? 'bg-green-100' :
                          event.status === 'failed' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          <StepIcon size={16} className={
                            event.status === 'completed' ? 'text-green-600' :
                            event.status === 'failed' ? 'text-red-600' :
                            'text-blue-600'
                          } />
                        </div>
                        {index < selectedInstance.stepHistory.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-black text-sm">{event.step}</h4>
                          <div className="flex items-center gap-2">
                            {event.processingTime && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock size={10} className="mr-1" />
                                {event.processingTime}
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={
                                event.status === 'completed' ? 'text-green-600 border-green-200' :
                                event.status === 'failed' ? 'text-red-600 border-red-200' :
                                'text-blue-600 border-blue-200'
                              }
                            >
                              {event.status === 'completed' && <CheckCircle2 size={10} className="mr-1" />}
                              {event.status === 'failed' && <AlertTriangle size={10} className="mr-1" />}
                              {event.status === 'in-progress' && <Activity size={10} className="mr-1" />}
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{event.action}</p>
                        <p className="text-xs text-gray-600 mb-2">{event.details}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ActorIcon size={12} className="text-gray-500" />
                            <span className="text-xs text-gray-500">{event.actorName}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Bottleneck Detection */}
      <Card className="rounded-[15px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-600" />
            Bottleneck Detection
          </CardTitle>
          <p className="text-sm text-gray-600">
            Automated detection of workflow issues requiring attention
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-orange-800">Human Review Queue</h4>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  High Load
                </Badge>
              </div>
              <p className="text-sm text-orange-700 mb-2">
                23 instances waiting for human review (avg wait: 4.2h)
              </p>
              <p className="text-xs text-orange-600">
                Consider assigning additional reviewers during peak hours
              </p>
            </div>

            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-800">Document Validation</h4>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                  Errors
                </Badge>
              </div>
              <p className="text-sm text-red-700 mb-2">
                3 instances failed document validation step
              </p>
              <p className="text-xs text-red-600">
                Manual intervention required for missing certifications
              </p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-yellow-800">AI Processing</h4>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  Slow Response
                </Badge>
              </div>
              <p className="text-sm text-yellow-700 mb-2">
                AI model response time increased by 35%
              </p>
              <p className="text-xs text-yellow-600">
                Consider scaling AI processing capacity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};