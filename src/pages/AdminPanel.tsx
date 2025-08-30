
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserManagement } from "@/components/admin/UserManagement";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { AdminKPICards } from "@/components/admin/AdminKPICards";
import { Shield, Users } from "lucide-react";

const AdminPanel = () => {
  return (
    <DashboardLayout>
      <div className="space-y-[10px]">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, roles, and system permissions</p>
        </div>

        {/* KPI Cards */}
        <AdminKPICards />

        {/* Tabs Section */}
        <MinimalTabs defaultValue="users" className="w-full">
          <MinimalTabsList className="bg-white rounded-lg border border-gray-200 p-1">
            <MinimalTabsTrigger value="users" className="flex items-center gap-2 rounded-lg">
              <Users size={16} />
              User Management
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="roles" className="flex items-center gap-2 rounded-lg">
              <Shield size={16} />
              Role Management
            </MinimalTabsTrigger>
          </MinimalTabsList>

          <MinimalTabsContent value="users" className="mt-[10px]">
            <UserManagement />
          </MinimalTabsContent>

          <MinimalTabsContent value="roles" className="mt-[10px]">
            <RoleManagement />
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
