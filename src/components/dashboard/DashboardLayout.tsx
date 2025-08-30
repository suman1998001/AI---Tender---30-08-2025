import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useTheme } from "@/hooks/useTheme";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  // Initialize theme on layout mount
  useTheme();
  return <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>;
};