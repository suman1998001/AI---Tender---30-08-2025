
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserFormProps {
  onClose: () => void;
  editingUser?: any;
}

const availableRoles = [
  { id: "admin", name: "Administrator", description: "Full system access" },
  { id: "evaluator", name: "Evaluator", description: "Can evaluate applicants" },
  { id: "viewer", name: "Viewer", description: "Read-only access" },
  { id: "manager", name: "Manager", description: "Manage RFPs and workflows" }
];

export const UserForm = ({ onClose, editingUser }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: editingUser?.name || "",
    email: editingUser?.email || "",
    password: "",
    confirmPassword: "",
    roles: editingUser?.roles || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting user data:", formData);
    // Implement user creation/update logic here
    onClose();
  };

  const handleRoleChange = (roleId: string, checked: boolean) => {
    const roleName = availableRoles.find(r => r.id === roleId)?.name;
    if (!roleName) return;

    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, roleName]
        : prev.roles.filter(role => role !== roleName)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      {!editingUser && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableRoles.map((role) => (
              <div key={role.id} className="flex items-start space-x-3">
                <Checkbox
                  id={role.id}
                  checked={formData.roles.includes(role.name)}
                  onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={role.id} className="font-medium">
                    {role.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {editingUser ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};
