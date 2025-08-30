import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoleFormProps {
  onClose: () => void;
  editingRole?: any;
}

const permissionModules = [
  {
    id: "rfp-tender",
    name: "RFP & Tender Management",
    permissions: [
      { id: "rfp-view", name: "View", description: "View RFPs and tenders" },
      { id: "rfp-create", name: "Create", description: "Create new RFPs and tenders" },
      { id: "rfp-edit", name: "Edit", description: "Edit existing RFPs and tenders" },
      { id: "rfp-delete", name: "Delete", description: "Delete RFPs and tenders" },
      { id: "rfp-upload", name: "Upload Docs", description: "Upload documents to RFPs" }
    ]
  },
  {
    id: "applicant-tracking",
    name: "Applicant Tracking",
    permissions: [
      { id: "app-view-all", name: "View All", description: "View all applicants" },
      { id: "app-view-own", name: "View Own Assigned", description: "View only assigned applicants" },
      { id: "app-edit-scores", name: "Edit Scores", description: "Edit applicant scores" },
      { id: "app-finalize", name: "Finalize Qualification", description: "Finalize applicant qualification status" }
    ]
  },
  {
    id: "ai-evaluation",
    name: "AI-Assisted Evaluation",
    permissions: [
      { id: "ai-access", name: "Access AI Review Center", description: "Access AI review tools" },
      { id: "ai-override", name: "Override AI Scores", description: "Override AI-generated scores" },
      { id: "ai-stats", name: "Access AI-Stats Panel", description: "View AI statistics and usage data" }
    ]
  },
  {
    id: "analytics-reporting",
    name: "Analytics & Reporting",
    permissions: [
      { id: "analytics-summary", name: "View Summary Dashboard", description: "Access summary dashboard" },
      { id: "analytics-workflow", name: "View Workflow Performance", description: "View workflow analytics" },
      { id: "analytics-extracted", name: "View Extracted Info Reports", description: "Access extracted information reports" },
      { id: "analytics-audit", name: "View Full Audit Trail", description: "Access complete audit trail" }
    ]
  },
  {
    id: "document-center",
    name: "Document Center",
    permissions: [
      { id: "doc-upload", name: "Upload", description: "Upload documents" },
      { id: "doc-download", name: "Download", description: "Download documents" },
      { id: "doc-organize", name: "Organize Sections", description: "Organize document sections" },
      { id: "doc-hotkeys", name: "Trigger Hotkeys", description: "Use document hotkey features" }
    ]
  },
  {
    id: "admin-panel",
    name: "Admin Panel",
    permissions: [
      { id: "admin-users", name: "User Management", description: "Create, edit, delete users" },
      { id: "admin-roles", name: "Role Management", description: "Create, edit, delete roles" },
      { id: "admin-settings", name: "System Settings", description: "Modify system settings" }
    ]
  }
];

const actionPermissions = [
  { id: "download-sensitive", name: "Download Sensitive Reports", description: "Download confidential reports" },
  { id: "send-emails", name: "Send Automated Emails", description: "Send system-generated emails" },
  { id: "approve-decisions", name: "Approve Final Decisions", description: "Approve final procurement decisions" },
  { id: "access-pii", name: "Access PII", description: "Access personally identifiable information" }
];

export const RoleForm = ({ onClose, editingRole }: RoleFormProps) => {
  const [formData, setFormData] = useState({
    name: editingRole?.name || "",
    description: editingRole?.description || "",
    permissions: editingRole?.permissions || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting role data:", formData);
    // Implement role creation/update logic here
    onClose();
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const isPermissionChecked = (permissionId: string) => {
    return formData.permissions.includes(permissionId);
  };

  return (
    <ScrollArea className="h-[600px] w-full">
      <form onSubmit={handleSubmit} className="space-y-6 p-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleDescription">Description</Label>
            <Textarea
              id="roleDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Permission Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {/* Module-based Permissions */}
              <AccordionItem value="module-permissions">
                <AccordionTrigger>Module-based Permissions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {permissionModules.map((module) => (
                      <div key={module.id} className="space-y-3">
                        <h4 className="font-medium text-gray-900">{module.name}</h4>
                        <div className="grid grid-cols-2 gap-3 ml-4">
                          {module.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={permission.id}
                                checked={isPermissionChecked(permission.id)}
                                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label htmlFor={permission.id} className="font-medium text-sm">
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Action-based Permissions */}
              <AccordionItem value="action-permissions">
                <AccordionTrigger>Action-based Permissions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {actionPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionChecked(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor={permission.id} className="font-medium">
                            {permission.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editingRole ? "Update Role" : "Save Role"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};
