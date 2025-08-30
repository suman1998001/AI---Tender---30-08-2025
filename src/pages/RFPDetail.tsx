import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RFPDetailsModal } from "@/components/rfp/RFPDetailsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalTabs, MinimalTabsContent, MinimalTabsList, MinimalTabsTrigger } from "@/components/ui/minimal-tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, BarChart3, MessageSquare, BookOpen, BookOpenCheck, TrendingUp, Share, Edit } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Legend } from "recharts";

import { PreBidQueriesTab } from "@/components/rfp/PreBidQueriesTab";
import { LiteratureTab } from "@/components/rfp/LiteratureTab";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Updated types to match database schema
interface RFP {
  id: string;
  name: string;
  number: string;
  category: string;
  issue_date: string;
  closing_date: string;
  total_applicants: number;
  workflow_step: string;
  status: string;
  tender_document_url?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// Database Applicant type
interface DBApplicant {
  id: string;
  rfp_id: string;
  applicant_name: string;
  company_name: string;
  email: string;
  phone?: string;
  application_number: string;
  qualification_status: boolean;
  ai_score: number;
  status: string;
  submission_date: string;
  documents_submitted: boolean;
  workflow_step: string;
  created_at?: string;
  updated_at?: string;
}

// UI Applicant type (matching ApplicantTracking)
interface Applicant {
  id: string;
  serialNumber: number;
  rfpName: string;
  rfpNumber: string;
  applicantName: string;
  applicantId: string;
  category: string;
  qualified: boolean | null;
  aiScore: number | null;
  workflowStep: string;
  lastHumanReview: string;
  status: string;
  submissionDate: string;
}

// Helper function to transform database data to UI format
const transformApplicantData = (applicants: DBApplicant[], rfp: RFP): Applicant[] => {
  return applicants.map((applicant, index) => ({
    id: applicant.id,
    serialNumber: index + 1,
    rfpName: rfp.name,
    rfpNumber: rfp.number,
    applicantName: applicant.applicant_name,
    applicantId: applicant.application_number,
    category: rfp.category,
    qualified: applicant.qualification_status,
    aiScore: applicant.ai_score,
    workflowStep: applicant.workflow_step,
    lastHumanReview: applicant.updated_at || applicant.created_at || '',
    status: applicant.status,
    submissionDate: applicant.submission_date
  }));
};

const RFPDetail = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { rfp?: RFP } };
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [activeTab, setActiveTab] = useState("queries");

  // Tab switching with administrator contact message
  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    
    // Show "Contact Administrator" message for restricted tabs
    if (value === "dashboard" || value === "knowledge" || value === "insights") {
      toast({
        title: "Contact Administrator",
        description: "This feature is currently under maintenance. Please contact the administrator for access.",
        variant: "destructive",
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
      return; // Don't change the tab
    }
    
    // Allow switching to queries and literature tabs
    setActiveTab(value);
    
    // Show toast notification for successful tab change
    toast({
      title: "Tab Changed",
      description: `Switched to ${value} tab`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  // Debug component rendering
  useEffect(() => {
    console.log('Current active tab:', activeTab);
    console.log('RFP data:', rfp);
    console.log('Applicants data:', applicants);
  }, [activeTab, rfp, applicants]);
  const [loading, setLoading] = useState(true);

  // Fetch RFP data from database
  useEffect(() => {
    const fetchRFPData = async () => {
      try {
        setLoading(true);
        
        // Check if RFP is passed via location state first
        const stateRfp = (location as any)?.state?.rfp as RFP | undefined;
        if (stateRfp) {
          setRfp(stateRfp);
          // Fetch applicants for this RFP
          const { data: applicantsData, error: applicantsError } = await supabase
            .from('applicants')
            .select('*')
            .eq('rfp_id', stateRfp.id);
          
          if (applicantsError) {
            console.error('Error fetching applicants:', applicantsError);
            toast({
              title: "Error",
              description: "Failed to fetch applicants data",
              variant: "destructive"
            });
          } else {
            const transformedApplicants = transformApplicantData(applicantsData || [], stateRfp);
            setApplicants(transformedApplicants);
          }
          return;
        }

        // If no state RFP, fetch by ID from URL
        if (rfpId) {
          const { data: rfpData, error: rfpError } = await supabase
            .from('rfps')
            .select('*')
            .eq('id', rfpId)
            .single();

          if (rfpError) {
            console.error('Error fetching RFP:', rfpError);
            toast({
              title: "Error",
              description: "Failed to fetch RFP data",
              variant: "destructive"
            });
            return;
          }

          if (rfpData) {
            setRfp(rfpData);
            
            // Fetch applicants for this RFP
            const { data: applicantsData, error: applicantsError } = await supabase
              .from('applicants')
              .select('*')
              .eq('rfp_id', rfpData.id);

            if (applicantsError) {
              console.error('Error fetching applicants:', applicantsError);
              toast({
                title: "Error",
                description: "Failed to fetch applicants data",
                variant: "destructive"
              });
            } else {
              const transformedApplicants = transformApplicantData(applicantsData || [], rfpData);
              setApplicants(transformedApplicants);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchRFPData:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRFPData();
  }, [rfpId, location]);

  // SEO: set page title and description
  useEffect(() => {
    if (rfp) {
      document.title = `${rfp.number} - ${rfp.name} | RFP Details`;
      const content = `RFP ${rfp.number} ${rfp.name} applicants, tender risk assessment, bidder profiles, and analytics.`;
      const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (meta) {
        meta.content = content;
      } else {
        const m = document.createElement('meta');
        m.name = 'description';
        m.content = content;
        document.head.appendChild(m);
      }
      const linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkCanonical) {
        const l = document.createElement('link');
        l.rel = 'canonical';
        l.href = window.location.href;
        document.head.appendChild(l);
      }
    }
  }, [rfp]);

  // Derived datasets for charts
  const shortName = (s: string) => (s.length > 18 ? s.slice(0, 18) + '…' : s);
  const clamp01 = (n: number) => Math.max(0, Math.min(100, n));
  const perfData = applicants.slice(0, 5).map((a) => {
    const technical = clamp01((a.aiScore || 0) + 3);
    const financial = clamp01((a.aiScore || 0) - 2);
    const compliance = clamp01((a.aiScore || 0) - 5);
    return { name: shortName(a.applicantName), score: a.aiScore || 0, technical, financial, compliance };
  });
  
  const statusCounts = applicants.reduce((acc: Record<string, number>, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Submission timeline by week from issue_date
  const timelineData = (() => {
    if (!rfp?.issue_date) return [] as Array<{ day: string; submissions: number; queries: number }>;
    const start = new Date(`${rfp.issue_date}T00:00:00Z`).getTime();
    const week = 7 * 24 * 60 * 60 * 1000;
    const buckets = new Map<number, { day: string; submissions: number; queries: number }>();
    applicants.forEach((a) => {
      const t = new Date(a.submissionDate).getTime();
      const w = Math.max(0, Math.floor((t - start) / week));
      const label = `Week ${w + 1}`;
      const prev = buckets.get(w) || { day: label, submissions: 0, queries: 0 };
      prev.submissions += 1;
      prev.queries += Math.max(0, 5 + (((a.aiScore || 0) / 20) | 0));
      buckets.set(w, prev);
    });
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v);
  })();

  const criteriaData = perfData.map((p) => ({
    name: p.name,
    technical: Math.round(p.technical / 3),
    financial: Math.round(p.financial / 3),
    compliance: Math.round(p.compliance / 3),
  }));

  const handleGoBack = () => {
    toast({
      title: "Navigating Back",
      description: "Returning to RFP Management page...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
    navigate('/rfp-management');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading RFP details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!rfp) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">RFP not found</h2>
            <Button onClick={handleGoBack} className="mt-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to RFP Management
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">RFP Management Hub</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">{rfp.number}</Badge>
              <span className="text-sm text-gray-600">{rfp.name}</span>
              <Badge className={rfp.status === "Open" ? "bg-red-accent text-red-muted-foreground" : rfp.status === "Under Review" ? "bg-red-accent-light text-red-muted" : "bg-muted text-foreground"}>
                {rfp.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Tabbed Interface */}
        <MinimalTabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-[10px]">
          <MinimalTabsList className="bg-white rounded-lg border border-gray-200 p-1">
            <MinimalTabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="queries" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Pre-bid Queries
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="knowledge" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledgebase
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="literature" className="flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4" />
              Tender Document
            </MinimalTabsTrigger>
            <MinimalTabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sourcing Insights
            </MinimalTabsTrigger>
          </MinimalTabsList>

          <MinimalTabsContent value="dashboard">
            <div className="space-y-6 p-6">
              {/* This content is not accessible - only queries tab is allowed */}
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="queries">
            <div className="p-6">
              <PreBidQueriesTab rfpId={rfp.id}/>
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="knowledge">
            <div className="p-6">
              {/* This content is not accessible - only queries tab is allowed */}
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="literature">
            <div className="p-6">
              <LiteratureTab rfpId={rfp.id}/>
            </div>
          </MinimalTabsContent>

          <MinimalTabsContent value="insights">
            <div className="p-6">
              {/* This content is not accessible - only queries tab is allowed */}
            </div>
          </MinimalTabsContent>
        </MinimalTabs>
      </div>
    </DashboardLayout>
  );
};

export default RFPDetail;