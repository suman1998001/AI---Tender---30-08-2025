import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { RFPKPICards } from "@/components/rfp/RFPKPICards";
import { RFPTable } from "@/components/rfp/RFPTable";
import { RFPDetailsModal } from "@/components/rfp/RFPDetailsModal";
import { RFPEmptyState } from "@/components/rfp/RFPEmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Plus, Upload, Search, Calendar as CalendarIcon, Filter, X, FileText, Image, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
export interface RFP {
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
const mockRFPs: RFP[] = [{
  id: '1',
  name: 'Digital India Infrastructure Services',
  number: 'RFP-2024-001',
  category: 'IT Services',
  issue_date: '2024-01-15',
  closing_date: '2024-02-15',
  total_applicants: 18,
  workflow_step: 'AI Scoring',
  status: 'Open'
}, {
  id: '2',
  name: 'Government Office Supplies - Maharashtra',
  number: 'RFP-2024-002',
  category: 'Procurement',
  issue_date: '2024-01-20',
  closing_date: '2024-02-20',
  total_applicants: 12,
  workflow_step: 'Applicants Submitting',
  status: 'Open'
}, {
  id: '3',
  name: 'Cyber Security Audit - Banking Sector',
  number: 'RFP-2024-003',
  category: 'Consulting',
  issue_date: '2024-01-10',
  closing_date: '2024-01-30',
  total_applicants: 22,
  workflow_step: 'Human Review',
  status: 'Under Review'
}, {
  id: '4',
  name: 'Smart City Development - Pune',
  number: 'RFP-2024-004',
  category: 'Construction',
  issue_date: '2024-01-12',
  closing_date: '2024-02-28',
  total_applicants: 15,
  workflow_step: 'Applicants Submitting',
  status: 'Open'
}, {
  id: '5',
  name: 'Healthcare Management System - AIIMS',
  number: 'RFP-2024-005',
  category: 'IT Services',
  issue_date: '2024-01-08',
  closing_date: '2024-02-10',
  total_applicants: 9,
  workflow_step: 'Human Review',
  status: 'Under Review'
}, {
  id: '6',
  name: 'Facility Management Services Contract',
  number: 'RFP-2024-006',
  category: 'Facility Management',
  issue_date: '2024-01-20',
  closing_date: '2024-02-25',
  total_applicants: 10,
  workflow_step: 'Technical Evaluation',
  status: 'Under Review'
}];
export { mockRFPs };
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const RFPManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [issueDate, setIssueDate] = useState<Date>();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [filteredRFPs, setFilteredRFPs] = useState<RFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewRFPOpen, setIsNewRFPOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const simulateFileUpload = (file: UploadedFile) => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setUploadedFiles(prev => 
          prev.map(f => f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f)
        );
        clearInterval(interval);
        
        // Check if all uploads are completed
        setUploadedFiles(prev => {
          const stillUploading = prev.some(f => f.status === 'uploading');
          if (!stillUploading) {
            setIsUploading(false);
          }
          return prev;
        });
        
        toast({
          title: "Upload Complete",
          description: `${file.name} has been uploaded successfully.`
        });
      } else {
        setUploadedFiles(prev => 
          prev.map(f => f.id === file.id ? { ...f, progress } : f)
        );
      }
    }, 200);
  };

  const handleFileUpload = (files: FileList, type: 'document' | 'image') => {
    setIsUploading(true);
    
    Array.from(files).forEach(file => {
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
      simulateFileUpload(uploadedFile);
    });

    // Clear the input value to allow uploading the same file again
    const input = document.getElementById(type === 'document' ? 'document-upload' : 'image-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been removed from the upload list."
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch RFPs from Supabase
  useEffect(() => {
    const fetchRFPs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('rfps')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching RFPs:', error);
          toast({
            title: "Error",
            description: "Failed to fetch RFPs. Please try again.",
            variant: "destructive"
          });
          // Fallback to mock data if Supabase fails
          setRfps(mockRFPs);
          setFilteredRFPs(mockRFPs);
        } else {
          setRfps(data || []);
          setFilteredRFPs(data || []);
        }
      } catch (error) {
        console.error('Error fetching RFPs:', error);
        // Fallback to mock data
        setRfps(mockRFPs);
        setFilteredRFPs(mockRFPs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRFPs();
  }, []);

  const handleFilter = () => {
    let filtered = [...rfps];
    if (searchQuery) {
      filtered = filtered.filter(rfp => rfp.name.toLowerCase().includes(searchQuery.toLowerCase()) || rfp.number.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(rfp => rfp.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rfp => rfp.status === statusFilter);
    }
    if (issueDate) {
      filtered = filtered.filter(rfp => rfp.issue_date === format(issueDate, "yyyy-MM-dd"));
    }
    setFilteredRFPs(filtered);
  };
  const handleCreateRFP = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      template: formData.get('template'),
      coreObjective: formData.get('core-objective')
    };
    navigate('/rfp-drafting', {
      state: data
    });
    setIsNewRFPOpen(false);
  };
  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bulk Upload Started",
      description: "RFP documents are being processed..."
    });
    setIsBulkUploadOpen(false);
  };
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "RFP data is being exported to CSV..."
    });
  };
  const handleViewRFP = (rfp: RFP) => {
    setSelectedRFP(rfp);
    setIsDetailsModalOpen(true);
  };
  const categories = [{
    value: "all",
    label: "All Categories"
  }, {
    value: "IT Services",
    label: "IT Services"
  }, {
    value: "Procurement",
    label: "Procurement"
  }, {
    value: "Consulting",
    label: "Consulting"
  }, {
    value: "Construction",
    label: "Construction"
  }];
  const statuses = [{
    value: "all",
    label: "All Status"
  }, {
    value: "Open",
    label: "Open"
  }, {
    value: "Closed",
    label: "Closed"
  }, {
    value: "Draft",
    label: "Draft"
  }, {
    value: "Under Review",
    label: "Under Review"
  }];
  return (
    <DashboardLayout>
      <div className="space-y-[10px]">
        {/* Header Section */}
        <div className="mb-[10px]">
          <h1 className="font-bold text-gray-900 mb-2 text-2xl">
            RFP & Tender Management
          </h1>
          <p className="text-gray-600">
            Manage and track your Request for Proposals and tender processes efficiently
          </p>
        </div>

        <RFPKPICards />
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {/* Header with filters and actions */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search and Filters */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search RFPs..." 
                  value={searchQuery} 
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setTimeout(handleFilter, 300);
                  }} 
                  className="pl-10 border-gray-300 focus:border-red-accent focus:ring-red-accent" 
                />
              </div>

              <select 
                value={categoryFilter} 
                onChange={e => {
                  setCategoryFilter(e.target.value);
                  handleFilter();
                }} 
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-accent focus:border-red-accent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select 
                value={statusFilter} 
                onChange={e => {
                  setStatusFilter(e.target.value);
                  handleFilter();
                }} 
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-accent focus:border-red-accent"
              >
                {statuses.map(stat => (
                  <option key={stat.value} value={stat.value}>
                    {stat.label}
                  </option>
                ))}
              </select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "justify-start text-left font-normal border-gray-300 hover:border-red-accent hover:bg-red-accent/10", 
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "MMM dd") : "Issue Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="single" 
                    selected={issueDate} 
                    onSelect={date => {
                      setIssueDate(date);
                      handleFilter();
                    }} 
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="border-red-accent/20 text-red-accent hover:bg-red-accent/10">
                    <Upload size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Bulk Upload RFPs</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBulkUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Upload CSV/Excel File</Label>
                      <Input id="file-upload" type="file" accept=".csv,.xlsx,.xls" required />
                      <p className="text-sm text-gray-500">
                        Upload a CSV or Excel file with RFP data
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsBulkUploadOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-red-accent hover:bg-red-muted text-white">
                        Upload RFPs
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button 
                className="text-white bg-black hover:bg-gray-800"
                onClick={() => navigate('/rfp-drafting')}
              >
                <Settings size={16} className="mr-2" />
                Generate RFP
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-accent"></div>
              <span className="ml-2 text-gray-600">Loading RFPs...</span>
            </div>
          ) : filteredRFPs.length === 0 ? (
            <RFPEmptyState />
          ) : (
            <RFPTable rfps={filteredRFPs} onViewRFP={handleViewRFP} onExport={handleExport} />
          )}
        </div>

        {/* RFP Details Modal */}
        <RFPDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          rfp={selectedRFP}
        />
      </div>
    </DashboardLayout>
  );
};

export default RFPManagement;