
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoleForm } from "./RoleForm";
import { Plus, MoreHorizontal, Search } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const mockRoles: Role[] = [
  {
    id: "ROLE-001",
    name: "Administrator",
    description: "Full system access with user and role management capabilities",
    userCount: 2,
    permissions: ["All Permissions"]
  },
  {
    id: "ROLE-002",
    name: "Evaluator",
    description: "Can evaluate applicants and access AI review tools",
    userCount: 5,
    permissions: ["View RFPs", "Edit Scores", "Access AI Review", "View Analytics"]
  },
  {
    id: "ROLE-003",
    name: "Viewer",
    description: "Read-only access to reports and analytics",
    userCount: 3,
    permissions: ["View Analytics", "View Reports"]
  },
  {
    id: "ROLE-004",
    name: "Document Manager",
    description: "Manage documents and document workflows",
    userCount: 4,
    permissions: ["Upload Documents", "Delete Documents", "Manage Workflows"]
  },
  {
    id: "ROLE-005",
    name: "Analyst",
    description: "Access to advanced analytics and reporting features",
    userCount: 6,
    permissions: ["View Analytics", "Create Reports", "Export Data"]
  },
  {
    id: "ROLE-006",
    name: "Team Lead",
    description: "Lead team operations and moderate user activities",
    userCount: 3,
    permissions: ["View Team Data", "Assign Tasks", "Monitor Progress"]
  },
  {
    id: "ROLE-007",
    name: "Auditor",
    description: "Review system activities and compliance",
    userCount: 2,
    permissions: ["View Audit Logs", "Generate Compliance Reports", "Review Activities"]
  },
  {
    id: "ROLE-008",
    name: "Guest",
    description: "Limited access for external stakeholders",
    userCount: 8,
    permissions: ["View Public Reports"]
  },
  {
    id: "ROLE-009",
    name: "Support",
    description: "Technical support and user assistance role",
    userCount: 4,
    permissions: ["View User Issues", "Access Support Tools", "Create Tickets"]
  },
  {
    id: "ROLE-010",
    name: "Finance",
    description: "Financial data access and budget management",
    userCount: 3,
    permissions: ["View Financial Data", "Generate Budget Reports", "Approve Expenses"]
  }
];

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.permissions.some(permission => permission.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleAction = (roleId: string, action: string) => {
    console.log(`Action: ${action} for role: ${roleId}`);
    // Implement role action logic here
  };

  return (
    <div className="space-y-[15px]">
      {/* Roles Table */}
      <Card className="bg-white rounded-[15px] border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Role List</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search roles by name or permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                  </DialogHeader>
                  <RoleForm onClose={() => setIsAddRoleOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Number of Users</TableHead>
                <TableHead>Permissions Summary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={role.description}>
                      {role.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleAction(role.id, "edit")}>
                          Edit Role Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleAction(role.id, "view-users")}>
                          View Users in Role
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleAction(role.id, "delete")}
                          className="text-red-600"
                        >
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
