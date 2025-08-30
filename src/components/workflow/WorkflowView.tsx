import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Play, Pause, Copy, Archive, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface WorkflowViewProps {
  workflowId: string;
  onEdit: (workflowId: string) => void;
  onBack: () => void;
}

// Custom node component for workflow steps
const WorkflowStepNode = ({ data }: any) => {
  const getStepIcon = (type: string) => {
    const icons = {
      document: "📄",
      ai: "🤖", 
      human: "👤",
      communication: "📧",
      decision: "⚡",
      integration: "🔌"
    };
    return icons[type as keyof typeof icons] || "⚙️";
  };

  const getStepColor = (type: string) => {
    const colors = {
      document: "bg-blue-50 border-blue-200 text-blue-700",
      ai: "bg-purple-50 border-purple-200 text-purple-700",
      human: "bg-green-50 border-green-200 text-green-700",
      communication: "bg-orange-50 border-orange-200 text-orange-700",
      decision: "bg-red-50 border-red-200 text-red-700",
      integration: "bg-indigo-50 border-indigo-200 text-indigo-700"
    };
    return colors[type as keyof typeof colors] || "bg-gray-50 border-gray-200 text-gray-700";
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[200px] ${getStepColor(data.type)}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getStepIcon(data.type)}</span>
        <h4 className="font-semibold text-sm">{data.label}</h4>
      </div>
      <p className="text-xs opacity-80">{data.description}</p>
      {data.duration && (
        <div className="mt-2 text-xs">
          <Badge variant="outline" className="text-xs">
            ~{data.duration}
          </Badge>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  workflowStep: WorkflowStepNode,
};

export const WorkflowView = ({ workflowId, onEdit, onBack }: WorkflowViewProps) => {
  // Mock workflow data - in real app, this would be fetched based on workflowId
  const workflowData = {
    id: workflowId,
    name: "Standard RFP Processing Workflow",
    description: "End-to-end procurement workflow for RFP processing with AI pre-screening and human review",
    status: "active",
    category: "General",
    steps: 7,
    activeInstances: 23,
    completedToday: 15,
    avgProcessingTime: "2.3h",
    lastModified: "2024-01-15",
            createdBy: "Rajesh Kumar"
  };

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'workflowStep',
      position: { x: 100, y: 100 },
      data: { 
        label: 'RFP Document Upload', 
        description: 'Upload and validate RFP documents',
        type: 'document',
        duration: '5 mins'
      },
    },
    {
      id: '2',
      type: 'workflowStep', 
      position: { x: 100, y: 250 },
      data: { 
        label: 'AI Document Analysis', 
        description: 'Extract key information and validate structure',
        type: 'ai',
        duration: '15 mins'
      },
    },
    {
      id: '3',
      type: 'workflowStep',
      position: { x: 100, y: 400 },
      data: { 
        label: 'Compliance Check', 
        description: 'Automated compliance validation',
        type: 'ai',
        duration: '10 mins'
      },
    },
    {
      id: '4',
      type: 'workflowStep',
      position: { x: 450, y: 400 },
      data: { 
        label: 'Risk Assessment Gate', 
        description: 'Decision point for high-risk applications',
        type: 'decision',
        duration: '2 mins'
      },
    },
    {
      id: '5',
      type: 'workflowStep',
      position: { x: 450, y: 250 },
      data: { 
        label: 'Human Review', 
        description: 'Manual review by procurement officer',
        type: 'human',
        duration: '45 mins'
      },
    },
    {
      id: '6',
      type: 'workflowStep',
      position: { x: 450, y: 100 },
      data: { 
        label: 'Final Approval', 
        description: 'Senior manager approval',
        type: 'human',
        duration: '30 mins'
      },
    },
    {
      id: '7',
      type: 'workflowStep',
      position: { x: 800, y: 200 },
      data: { 
        label: 'Notification & Export', 
        description: 'Send results and export to ERP',
        type: 'integration',
        duration: '5 mins'
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e2-3',
      source: '2', 
      target: '3',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      label: 'High Risk',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      type: 'smoothstep',
      label: 'Low Risk',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeDasharray: '5,5' },
    },
    {
      id: 'e5-6',
      source: '5',
      target: '6',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e6-7',
      source: '6',
      target: '7',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-50 text-green-700 border-green-200 font-medium",
      inactive: "bg-gray-50 text-gray-700 border-gray-200 font-medium", 
      draft: "bg-yellow-50 text-yellow-700 border-yellow-200 font-medium"
    };

    return (
      <Badge variant="outline" className={`${statusColors[status as keyof typeof statusColors]} rounded-full px-3 py-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Workflows
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                    {workflowData.name}
                  </CardTitle>
                  {getStatusBadge(workflowData.status)}
                </div>
                <p className="text-gray-600">
                  {workflowData.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="transition-all duration-200 hover:scale-105"
              >
                <Copy size={16} className="mr-2" />
                Duplicate
              </Button>
              <Button 
                onClick={() => onEdit(workflowId)}
                className="bg-red-accent hover:bg-red-accent/90 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Edit size={16} className="mr-2" />
                Edit Workflow
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Steps</div>
            <div className="text-2xl font-bold text-gray-900">{workflowData.steps}</div>
          </CardContent>
        </Card>
        <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Active Instances</div>
            <div className="text-2xl font-bold text-gray-900">{workflowData.activeInstances}</div>
          </CardContent>
        </Card>
        <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Completed Today</div>
            <div className="text-2xl font-bold text-gray-900">{workflowData.completedToday}</div>
          </CardContent>
        </Card>
        <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Avg Processing Time</div>
            <div className="text-2xl font-bold text-gray-900">{workflowData.avgProcessingTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Visualization */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Workflow Structure
          </CardTitle>
          <p className="text-sm text-gray-600">
            Visual representation of the end-to-end procurement workflow process
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] border-2 border-dashed border-gray-200 rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="top-right"
              style={{ backgroundColor: "#f9fafb" }}
            >
              <MiniMap 
                zoomable 
                pannable 
                style={{
                  backgroundColor: "#f3f4f6",
                }}
              />
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Details */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Workflow Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <Badge variant="outline" className="ml-2 text-gray-700 border-gray-300 bg-gray-50">
                  {workflowData.category}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Created by:</span>
                <span className="ml-2 text-sm text-gray-600">{workflowData.createdBy}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Last Modified:</span>
                <span className="ml-2 text-sm text-gray-600">{workflowData.lastModified}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Processing Steps:</span>
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600">• Document Steps: 1</div>
                  <div className="text-xs text-gray-600">• AI Processing: 2</div>
                  <div className="text-xs text-gray-600">• Human Review: 2</div>
                  <div className="text-xs text-gray-600">• Decision Points: 1</div>
                  <div className="text-xs text-gray-600">• Integration: 1</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};