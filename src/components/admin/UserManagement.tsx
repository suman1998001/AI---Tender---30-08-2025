
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { Search, Plus, MoreHorizontal } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  roles: string[];
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@quantumgho.com",
    lastLogin: "2024-06-26 14:30",
    status: "Active",
    roles: ["Administrator", "Evaluator"]
  },
  {
    id: "USR-002",
    name: "Priya Sharma",
    email: "priya.sharma@quantumgho.com",
    lastLogin: "2024-06-26 09:15",
    status: "Active",
    roles: ["Evaluator"]
  },
  {
    id: "USR-003",
    name: "Amit Patel",
    email: "amit.patel@quantumgho.com",
    lastLogin: "2024-06-25 16:45",
    status: "Inactive",
    roles: ["Viewer"]
  },
  {
    id: "USR-004",
    name: "Sneha Gupta",
    email: "sneha.gupta@quantumgho.com",
    lastLogin: "2024-06-26 11:20",
    status: "Active",
    roles: ["Administrator"]
  },
  {
    id: "USR-005",
    name: "Vikram Singh",
    email: "vikram.singh@quantumgho.com",
    lastLogin: "2024-06-26 08:45",
    status: "Active",
    roles: ["Evaluator", "Viewer"]
  },
  {
    id: "USR-006",
    name: "Kavya Reddy",
    email: "kavya.reddy@quantumgho.com",
    lastLogin: "2024-06-25 13:30",
    status: "Active",
    roles: ["Viewer"]
  },
  {
    id: "USR-007",
    name: "Arjun Mehta",
    email: "arjun.mehta@quantumgho.com",
    lastLogin: "2024-06-24 17:20",
    status: "Inactive",
    roles: ["Evaluator"]
  },
  {
    id: "USR-008",
    name: "Anita Joshi",
    email: "anita.joshi@quantumgho.com",
    lastLogin: "2024-06-26 10:15",
    status: "Active",
    roles: ["Administrator", "Evaluator"]
  },
  {
    id: "USR-009",
    name: "Suresh Nair",
    email: "suresh.nair@quantumgho.com",
    lastLogin: "2024-06-26 15:40",
    status: "Active",
    roles: ["Viewer"]
  },
  {
    id: "USR-010",
    name: "Deepika Agarwal",
    email: "deepika.agarwal@quantumgho.com",
    lastLogin: "2024-06-25 12:10",
    status: "Active",
    roles: ["Evaluator"]
  },
  {
    id: "USR-011",
    name: "Rohit Malhotra",
    email: "rohit.malhotra@quantumgho.com",
    lastLogin: "2024-06-24 14:55",
    status: "Inactive",
    roles: ["Viewer"]
  },
  {
    id: "USR-012",
    name: "Meera Yadav",
    email: "meera.yadav@quantumgho.com",
    lastLogin: "2024-06-26 09:30",
    status: "Active",
    roles: ["Administrator"]
  }
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // Implement user action logic here
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    // Implement bulk action logic here
  };

  return (
    <div className="space-y-[15px]">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="bg-white rounded-[15px] border border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("activate")}>
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("deactivate")}>
                  Deactivate
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="bg-white rounded-[15px] border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">User List</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <UserForm onClose={() => setIsAddUserOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
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
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "edit")}>
                          Edit User Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "reset-password")}>
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "toggle-status")}>
                          {user.status === "Active" ? "Deactivate" : "Activate"} User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "assign-roles")}>
                          Assign Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "view-activity")}>
                          View Activity Log
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleUserAction(user.id, "delete")}
                          className="text-red-600"
                        >
                          Delete User
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
