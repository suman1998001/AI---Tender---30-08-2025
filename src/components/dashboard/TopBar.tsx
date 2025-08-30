
import { Bell, Search, Settings, User, LogOut, UserCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Extend Window interface for Google Translate
declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [userEmail, setUserEmail] = useState<string>('rfpuser@quantumgho.com');

  const handleLogout = async () => {
    try {
      // Sign out from Supabase (this removes the auth token from session)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Clear any additional stored user data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the system",
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred during logout",
        variant: "destructive"
      });
    }
  };

  // Function to get current user information
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      if (user && user.email) {
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  useEffect(() => {
    // Get current user information
    getCurrentUser();

    // Load logo from localStorage
    const savedLogo = localStorage.getItem('companyLogo');
    setLogoUrl(savedLogo);

    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    // Listen for logo changes
    const handleLogoChange = (event: CustomEvent) => {
      setLogoUrl(event.detail.logoUrl);
    };

    window.addEventListener('logoChanged', handleLogoChange as EventListener);

    // Load Google Translate script
    const loadGoogleTranslate = () => {
      if (!window.google || !window.google.translate) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            },
            'google_translate_element'
          );
        };
      }
    };

    loadGoogleTranslate();
    
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange as EventListener);
    };
  }, []);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    
    if (language === 'hi') {
      // Use direct Google Translate URL method for more reliable translation
      const currentUrl = window.location.href;
      const translateUrl = `https://translate.google.com/translate?sl=en&tl=hi&u=${encodeURIComponent(currentUrl)}`;
      
      // Try widget method first, fallback to URL method
      setTimeout(() => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = 'hi';
          selectElement.dispatchEvent(new Event('change'));
        } else {
          // Fallback: Add Google Translate parameters to current page
          const currentLang = document.documentElement.lang;
          if (currentLang !== 'hi') {
            document.documentElement.lang = 'hi';
            // Trigger a more direct translation approach
            window.location.hash = '#googtrans(en|hi)';
            window.location.reload();
          }
        }
      }, 1000);
    } else {
      // Reset to English
      setTimeout(() => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = 'en';
          selectElement.dispatchEvent(new Event('change'));
        } else {
          document.documentElement.lang = 'en';
          window.location.hash = '#googtrans(hi|en)';
          window.location.reload();
        }
      }, 1000);
    }

    toast({
      title: "Language Changed",
      description: `Language switched to ${language === 'hi' ? 'Hindi' : 'English'}`,
    });
  };
  
  const getPageTitle = () => {
    if (location.pathname === "/" || location.pathname === "/dashboard") return "Dashboard";
    if (location.pathname === "/document-drafter" || location.pathname === "/document-drafter/generate") return "General Document Drafter";
    if (location.pathname === "/rfp-drafting") return "Create RFP";
    if (location.pathname === "/rfp-management" || location.pathname.startsWith("/rfp/") || location.pathname.startsWith("/applicant/")) {
      return "RFP & Tender Management";
    }
    if (location.pathname === "/applicant-tracking") return "Applicant Tracking";
    if (location.pathname === "/contract-management" || location.pathname.startsWith("/contract/")) return "Contract Management";
    if (location.pathname === "/sustainable-procurement" || location.pathname.startsWith("/sustainable-procurement/") || location.pathname.startsWith("/vendor-scorecard/")) return "Sustainable Procurement";
    if (location.pathname === "/sla-management") return "SLA Management";
    if (location.pathname === "/payment-budget") return "Payment vs Budget";
    if (location.pathname === "/analytics") return "Analytics & Reporting";
    if (location.pathname === "/documents") return "Document Center";
    if (location.pathname === "/admin") return "Admin Panel";
    if (location.pathname === "/workflow") return "Workflow Viewer";
    if (location.pathname === "/operator-management") return "Operator Management";
    if (location.pathname === "/pr-checker") return "Purchase Requisitions Checker Management";
    if (location.pathname === "/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          {/* Search and other components can be added here */}
        </div>
        
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Globe size={18} className="text-gray-600 hover:text-gray-900" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32" align="end">
            <DropdownMenuLabel className="font-normal">
              <span className="text-sm font-medium">Language</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleLanguageChange('en')} 
              className={`cursor-pointer ${currentLanguage === 'en' ? 'bg-gray-100' : ''}`}
            >
              <span>English</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLanguageChange('hi')} 
              className={`cursor-pointer ${currentLanguage === 'hi' ? 'bg-gray-100' : ''}`}
            >
              <span>हिन्दी</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border-2 border-red-muted cursor-pointer">
                <AvatarFallback className="bg-red-accent-light text-white hover:bg-red-accent transition-colors">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    </>
  );
};

export { TopBar };
