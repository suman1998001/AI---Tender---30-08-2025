import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ApplicantHeader } from "@/components/applicant/ApplicantHeader";
import { ApplicantFilters } from "@/components/applicant/ApplicantFilters";
import { ApplicantTable } from "@/components/applicant/ApplicantTable";
import { ApplicantEmptyState } from "@/components/applicant/ApplicantEmptyState";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
export interface Applicant {
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
// Mock data as fallback
const mockApplicants: Applicant[] = [
  {
    id: '1',
    serialNumber: 1,
    rfpName: 'Digital India - Cloud Infrastructure Services',
    rfpNumber: 'MeitY/RFP/2024/001',
    applicantName: 'Tech Solutions Private Limited',
    applicantId: 'TSL-2024-001',
    category: 'Information Technology',
    qualified: true,
    aiScore: 87,
    workflowStep: 'Human Review - Compliance',
    lastHumanReview: '2024-01-15T10:30:00Z',
    status: 'Under Review',
    submissionDate: '2024-01-15T14:22:00Z'
  },
  {
    id: '6',
    serialNumber: 6,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'M/S ARADHAY SHREERAM PRIVATE LIMITED',
    applicantId: '2964',
    category: 'Facility Management',
    qualified: true,
    aiScore: 89,
    workflowStep: 'Final Review',
    lastHumanReview: '2024-01-22T14:30:00Z',
    status: 'Qualified',
    submissionDate: '2024-01-22T10:15:00Z'
  },
  {
    id: '7',
    serialNumber: 7,
    rfpName: 'Facility Management Services Contract',
    rfpNumber: 'RFP-2024-006',
    applicantName: 'SECURE SERVICES (M/S HARSH ENGINEERING WORKS)',
    applicantId: '5620',
    category: 'Facility Management',
    qualified: true,
    aiScore: 82,
    workflowStep: 'Technical Evaluation',
    lastHumanReview: '2024-01-22T15:00:00Z',
    status: 'Qualified',
    submissionDate: '2024-01-22T12:45:00Z'
  }
];

// Helper function to transform database data to UI format
const transformApplicantData = (applicants: any[], rfps: any[]): Applicant[] => {
  return applicants.map((applicant, index) => {
    const rfp = rfps.find(r => r.id === applicant.rfp_id);
    return {
      id: applicant.id,
      serialNumber: index + 1,
      rfpName: rfp?.name || 'Unknown RFP',
      rfpNumber: rfp?.number || 'Unknown',
      applicantName: applicant.applicant_name,
      applicantId: applicant.application_number,
      category: rfp?.category || 'Unknown Category',
      qualified: applicant.qualification_status,
      aiScore: applicant.ai_score,
      workflowStep: applicant.workflow_step,
      lastHumanReview: applicant.updated_at,
      status: applicant.status,
      submissionDate: applicant.submission_date
    };
  });
};
const ApplicantTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({
    search: "",
    qualified: "all",
    status: "all",
    rfp: "all"
  });

  // Fetch applicants from Supabase
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        
        // Fetch applicants and their related RFPs
        const { data: applicantsData, error: applicantsError } = await supabase
          .from('applicants')
          .select('*')
          .order('created_at', { ascending: false });

        if (applicantsError) {
          console.error('Error fetching applicants:', applicantsError);
          toast({
            title: "Error",
            description: "Failed to load applicants data",
            variant: "destructive"
          });
          return;
        }

        // Fetch RFPs to get names and categories
        const { data: rfpsData, error: rfpsError } = await supabase
          .from('rfps')
          .select('*');

        if (rfpsError) {
          console.error('Error fetching RFPs:', rfpsError);
          toast({
            title: "Error",
            description: "Failed to load RFP data",
            variant: "destructive"
          });
          return;
        }

        const transformedApplicants = transformApplicantData(applicantsData || [], rfpsData || []);
        
        setApplicants(transformedApplicants);
        setFilteredApplicants(transformedApplicants);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newFilters = {
      ...currentFilters,
      search: value
    };
    setCurrentFilters(newFilters);
    applyFilters(newFilters);
  };
  const applyFilters = (filters: any) => {
    let filtered = [...applicants];
    
    if (filters.search) {
      filtered = filtered.filter(applicant => 
        applicant.applicantName.toLowerCase().includes(filters.search.toLowerCase()) || 
        applicant.rfpName.toLowerCase().includes(filters.search.toLowerCase()) || 
        applicant.applicantId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.qualified !== 'all') {
      const isQualified = filters.qualified === 'yes';
      filtered = filtered.filter(applicant => applicant.qualified === isQualified);
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(applicant => applicant.status === filters.status);
    }
    
    if (filters.rfp !== 'all') {
      filtered = filtered.filter(applicant => applicant.rfpNumber === filters.rfp);
    }
    
    setFilteredApplicants(filtered);
  };

  const handleFilter = (filters: any) => {
    setCurrentFilters(filters);
    applyFilters(filters);
  };

  const handleClearAllFilters = () => {
    const defaultFilters = {
      search: "",
      qualified: "all", 
      status: "all",
      rfp: "all"
    };
    setCurrentFilters(defaultFilters);
    setSearchTerm("");
    setFilteredApplicants(applicants);
    toast({
      title: "Filters Cleared",
      description: "All filters have been removed and the full list is now displayed.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };
  const handleExportApplicants = () => {
    toast({
      title: "Export Started",
      description: "Applicant data is being exported to CSV...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };
  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} has been applied to selected applicants.`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };
  const handleViewApplicant = (applicant: Applicant) => {
    // Navigation is handled directly in ApplicantTable component
    console.log('Viewing applicant:', applicant);
  };
  return <DashboardLayout>
      <div className="space-y-[10px]">
        {/* Header Section */}
        <div className="mb-[10px]">
          <h1 className="font-bold text-gray-900 mb-2 text-2xl">
            Applicant Tracking System
          </h1>
          <p className="text-gray-600">
            Monitor and manage tender applicants with comprehensive tracking and evaluation tools for Government of India procurement
          </p>
        </div>

        {/* KPI Cards */}
        <MetricsCards />
        
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="text-center">Loading applicants...</div>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <ApplicantEmptyState />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <ApplicantFilters 
              onFilter={handleFilter} 
              onClearAllFilters={handleClearAllFilters} 
              currentFilters={currentFilters} 
              onExport={handleExportApplicants} 
              onBulkAction={handleBulkAction} 
            />
            <div className="border-t border-gray-200">
              <ApplicantTable applicants={filteredApplicants} onViewApplicant={handleViewApplicant} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>;
};
export default ApplicantTracking;