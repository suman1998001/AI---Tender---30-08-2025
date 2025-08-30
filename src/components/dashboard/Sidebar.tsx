
import { LayoutDashboard, FileText, Users, BarChart, Archive, GitBranch, Shield, Brain, FileSignature, Target, CreditCard, Leaf, Building2, FileCheck, FilePenLine, PenTool, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('companyLogo');
    setLogoUrl(savedLogo);

    // Listen for logo changes
    const handleLogoChange = (event: CustomEvent) => {
      setLogoUrl(event.detail.logoUrl);
    };

    window.addEventListener('logoChanged', handleLogoChange as EventListener);
    
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange as EventListener);
    };
  }, []);
  
  const isRFPActive = location.pathname === "/rfp-management" || location.pathname === "/rfp-drafting" || location.pathname.startsWith("/rfp/") || location.pathname.startsWith("/applicant/");
  const isSustainableActive = location.pathname === "/sustainable-procurement" || location.pathname.startsWith("/sustainable-procurement/");
  const isVendorActive = location.pathname === "/vendor-management" || location.pathname.startsWith("/vendor-profile/");
  
  const sidebarItems = [{
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    active: location.pathname === "/dashboard"
  }, {
    icon: FileText,
    label: "RFP & Tender Management",
    path: "/rfp-management",
    active: isRFPActive
  }, {
    icon: Users,
    label: "Applicant Tracking",
    path: "/applicant-tracking",
    active: location.pathname === "/applicant-tracking"
  }, {
    icon: FileSignature,
    label: "Contract Management",
    path: "/contract-management",
    active: location.pathname === "/contract-management" || location.pathname.startsWith("/contract/")
  }, {
    icon: Leaf,
    label: "Sustainable Procurement",
    path: "/sustainable-procurement",
    active: isSustainableActive
  }, {
    icon: Building2,
    label: "Vendor Management",
    path: "/vendor-management",
    active: isVendorActive
  }, {
    icon: FileCheck,
    label: "PR Checker",
    path: "/pr-checker",
    active: location.pathname === "/pr-checker"
  }, {
    icon: ClipboardCheck,
    label: "Document Check",
    path: "/document-checker",
    active: location.pathname === "/document-checker"
  }, {
    icon: Brain,
    label: "Operator Management",
    path: "/operator-management",
    active: location.pathname === "/operator-management"
  }, {
    icon: Target,
    label: "SLA Management",
    path: "/sla-management",
    active: location.pathname === "/sla-management"
  }, {
    icon: CreditCard,
    label: "Payment vs Budget",
    path: "/payment-budget",
    active: location.pathname === "/payment-budget"
  }, {
    icon: BarChart,
    label: "Analytics & Reporting",
    path: "/analytics",
    active: location.pathname === "/analytics"
  }, {
    icon: Archive,
    label: "Document Center",
    path: "/documents",
    active: location.pathname === "/documents"
  }, {
    icon: PenTool,
    label: "General Document Drafter",
    path: "/document-drafter",
    active: location.pathname === "/document-drafter"
  }, {
    icon: Shield,
    label: "Admin Panel",
    path: "/admin",
    active: location.pathname === "/admin"
  }, {
    icon: GitBranch,
    label: "Workflow Viewer",
    path: "/workflow",
    active: location.pathname === "/workflow"
  }];

  return (
    <div className="w-16 border-r border-gray-200 flex flex-col sticky top-0 h-screen z-30 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center justify-start p-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Company logo" 
              className="w-full h-full object-contain"
            />
          ) : (
            <Brain className="w-6 h-6 text-primary" />
          )}
        </div>
        <div className="ml-3 overflow-hidden whitespace-nowrap hidden">
          <h2 className="font-semibold text-lg text-foreground">ProcureAI</h2>
          <p className="text-xs text-muted-foreground">Smart Procurement</p>
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 py-4 overflow-hidden">
        <nav className="space-y-1 px-2 h-full overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item, index) => (
            <button 
              key={index} 
              onClick={() => navigate(item.path)} 
              className={cn(
                "w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group/item relative overflow-hidden",
                item.active 
                  ? "bg-red-muted text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <div className="flex items-center w-full">
                <item.icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    item.active ? "text-white" : "text-muted-foreground group-hover/item:text-foreground"
                  )} 
                />
                <span className="ml-3 whitespace-nowrap overflow-hidden hidden">
                  {item.label}
                </span>
              </div>
              
              {/* Hover effect */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-200",
                !item.active && "bg-gradient-to-r from-primary/5 to-transparent"
              )} />
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="ml-2 whitespace-nowrap hidden">
            System Online
          </span>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
