import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Play, 
  Pause, 
  Copy, 
  Archive, 
  Trash2, 
  MoreVertical,
  Settings,
  Eye
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  category: string;
  steps: number;
  activeInstances: number;
  completedToday: number;
  avgProcessingTime: string;
  lastModified: string;
  createdBy: string;
}

const mockWorkflows: Workflow[] = [
  {
    id: "WF001",
    name: "Standard RFP Processing",
    description: "Default workflow for processing all incoming RFPs with AI pre-screening and human review",
    status: "active",
    category: "General",
    steps: 7,
    activeInstances: 23,
    completedToday: 15,
    avgProcessingTime: "2.3h",
    lastModified: "2024-01-15",
            createdBy: "Rajesh Kumar"
  },
  {
    id: "WF002", 
    name: "High-Value Contract Review",
    description: "Enhanced workflow for contracts above ₹50L with additional compliance and technical reviews",
    status: "active",
    category: "High-Value",
    steps: 12,
    activeInstances: 8,
    completedToday: 3,
    avgProcessingTime: "4.7h",
    lastModified: "2024-01-12",
            createdBy: "Priya Sharma"
  },
  {
    id: "WF003",
    name: "IT Services Procurement",
    description: "Specialized workflow for IT service vendors with technical evaluation and security assessment",
    status: "active",
    category: "IT Services",
    steps: 9,
    activeInstances: 12,
    completedToday: 7,
    avgProcessingTime: "3.1h",
    lastModified: "2024-01-10",
            createdBy: "Amit Singh"
  },
  {
    id: "WF004",
    name: "Emergency Procurement",
    description: "Fast-track workflow for urgent requirements with streamlined approval process",
    status: "inactive",
    category: "Emergency",
    steps: 4,
    activeInstances: 0,
    completedToday: 0,
    avgProcessingTime: "0.8h",
    lastModified: "2024-01-08",
            createdBy: "Neha Gupta"
  },
  {
    id: "WF005",
    name: "Maintenance Services Review",
    description: "Workflow for haulage and maintenance service contracts with field verification",
    status: "draft",
    category: "Maintenance",
    steps: 8,
    activeInstances: 0,
    completedToday: 0,
    avgProcessingTime: "N/A",
    lastModified: "2024-01-05",
            createdBy: "Rajesh Kumar"
  }
];

interface WorkflowListProps {
  onCreateWorkflow: () => void;
  onEditWorkflow: (workflowId: string) => void;
  onViewWorkflow: (workflowId: string) => void;
}

export const WorkflowList = ({ onCreateWorkflow, onEditWorkflow, onViewWorkflow }: WorkflowListProps) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);

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

  const handleAction = (action: string, workflowId: string, workflowName: string) => {
    switch (action) {
      case 'activate':
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? { ...w, status: 'active' as const } : w
        ));
        toast({
          title: "Workflow Activated",
          description: `${workflowName} is now active and processing requests.`
        });
        break;
      case 'deactivate':
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? { ...w, status: 'inactive' as const } : w
        ));
        toast({
          title: "Workflow Deactivated", 
          description: `${workflowName} has been deactivated.`
        });
        break;
      case 'duplicate':
        toast({
          title: "Workflow Duplicated",
          description: `Created a copy of ${workflowName}.`
        });
        break;
      case 'archive':
        toast({
          title: "Workflow Archived",
          description: `${workflowName} has been archived.`
        });
        break;
      case 'delete':
        toast({
          title: "Workflow Deleted",
          description: `${workflowName} has been permanently deleted.`
        });
        break;
      case 'view':
        onViewWorkflow(workflowId);
        toast({
          title: "Opening Workflow Details",
          description: `Viewing details for ${workflowName}.`
        });
        break;
    }
  };

  return (
    <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">Workflow Management</CardTitle>
            <p className="text-gray-600 mt-1">
              Create, manage and monitor your procurement workflows
            </p>
          </div>
          <Button 
            onClick={onCreateWorkflow}
            className="flex items-center gap-2 bg-red-accent hover:bg-red-accent/90 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus size={16} />
            Create New Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-transparent">
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">SL No.</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Workflow Name</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Status</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Category</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Steps</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Active</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Completed Today</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Avg Time</TableHead>
                <TableHead className="text-gray-900 font-semibold text-sm tracking-tight">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow, index) => (
                <TableRow key={workflow.id} className="border-gray-100 hover:bg-gray-50/70 transition-colors duration-200">
                  <TableCell className="text-gray-900 font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="py-2">
                      <p className="font-semibold text-gray-900 text-sm">{workflow.name}</p>
                      <p className="text-sm text-gray-600 max-w-md mt-1 leading-relaxed">{workflow.description}</p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        Modified: {workflow.lastModified} by {workflow.createdBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-700 border-gray-300 bg-gray-50">
                      {workflow.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">{workflow.steps}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{workflow.activeInstances}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{workflow.completedToday}</span>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">{workflow.avgProcessingTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditWorkflow(workflow.id)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit size={14} className="text-gray-600" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreVertical size={14} className="text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-xl">{/*...*/}
                          <DropdownMenuItem onClick={() => handleAction('view', workflow.id, workflow.name)}>
                            <Eye size={14} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {workflow.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleAction('deactivate', workflow.id, workflow.name)}>
                              <Pause size={14} className="mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleAction('activate', workflow.id, workflow.name)}>
                              <Play size={14} className="mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleAction('duplicate', workflow.id, workflow.name)}>
                            <Copy size={14} className="mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction('archive', workflow.id, workflow.name)}>
                            <Archive size={14} className="mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction('delete', workflow.id, workflow.name)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};