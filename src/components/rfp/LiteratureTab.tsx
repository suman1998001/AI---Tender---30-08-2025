import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BookOpenCheck, 
  Search, 
  Upload, 
  Link2, 
  Plus, 
  Download, 
  Eye, 
  Filter,
  FileText,
  Calendar,
  User,
  Globe,
  Trash2,
  Edit3,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Modern Processing Loader Component
const ProcessingLoader = ({ fileName, currentStep }: { fileName: string; currentStep: string }) => {
  const steps = [
    { id: 'uploading', label: 'Uploading Document', icon: Upload },
    { id: 'processing', label: 'Processing Content', icon: Loader2 },
    { id: 'analyzing', label: 'Analyzing Structure', icon: FileText },
    { id: 'generating', label: 'Generating Summary', icon: BookOpenCheck },
    { id: 'complete', label: 'Complete', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="border-2 border-dashed border-red-accent/30 rounded-lg p-8 text-center bg-gradient-to-br from-red-accent/5 to-red-accent/10">
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-accent/10 to-transparent animate-pulse rounded-lg" />
        
        {/* Main Content */}
        <div className="relative z-10">
          {/* Animated Icon */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-accent/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-red-accent rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Tender Document
          </h3>
          
          {/* File Name */}
          <p className="text-sm text-gray-600 mb-6 font-medium">
            {fileName}
          </p>

          {/* Progress Steps */}
          <div className="max-w-md mx-auto mb-6">
            <div className="space-y-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center gap-3">
                    {/* Step Icon */}
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                       isCompleted 
                         ? 'bg-green-500 text-white animate-[stepComplete_0.5s_ease-out]' 
                         : isCurrent 
                         ? 'bg-red-accent text-white animate-[processingPulse_1s_ease-in-out_infinite]' 
                         : 'bg-gray-200 text-gray-400'
                     }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isCurrent ? (
                        <StepIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <span className={`text-sm font-medium ${
                      isCompleted 
                        ? 'text-green-600' 
                        : isCurrent 
                        ? 'text-red-accent' 
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>

                    {/* Current Step Indicator */}
                    {isCurrent && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-red-accent rounded-full animate-ping" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-accent to-red-600 h-2 rounded-full transition-all duration-500 ease-out animate-pulse"
              style={{ 
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                animation: 'progressGlow 2s ease-in-out infinite'
              }}
            />
          </div>

          {/* Status Message */}
          <p className="text-sm text-gray-500">
            {currentStep === 'uploading' && 'Uploading your document to secure storage...'}
            {currentStep === 'processing' && 'Extracting text and analyzing document structure...'}
            {currentStep === 'analyzing' && 'Identifying key sections and requirements...'}
            {currentStep === 'generating' && 'Creating comprehensive summary and insights...'}
            {currentStep === 'complete' && 'Document processed successfully!'}
          </p>

          {/* Estimated Time */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Estimated time: 2-3 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Literature {
  id: string;
  rfpId?: string;
  title: string;
  author: string;
  source: string;
  publicationDate: string;
  keywords: string[];
  type: "section" | "Research Paper" | "Article" | "Industry Report" | "White Paper" | "Case Study";
  url?: string;
  fileSize?: string;
  abstract?: string;
  uploadedBy: string;
  uploadDate: string;
  version?: string;
  lastModified?: string;
  editor?: string;
  filePath?: string;
  fileName?: string;
  mimeType?: string;
  status?: "Uploading" | "Processing" | "Complete" | "Error";
}

interface LiteratureTabProps {
  rfpId?: string;
}

export const LiteratureTab = ({ rfpId }: LiteratureTabProps = {}) => {
  const { toast } = useToast();
  
    const [literature, setLiterature] = useState<Literature[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const [currentProcessingStep, setCurrentProcessingStep] = useState<string>('uploading');
  const [processingFileName, setProcessingFileName] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedLiterature, setSelectedLiterature] = useState<Literature | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [summeryId, setSummeryId] = useState('');
  const [newLiterature, setNewLiterature] = useState({
    title: "",
    author: "",
    source: "",
    publicationDate: "",
    keywords: "",
    type: "Research Paper" as const,
    abstract: "",
    url: ""
  });

  // Database functions
  const mapRowToLiterature = (row: any): Literature => ({
    id: row.id,
    rfpId: row.rfp_id,
    title: row.title,
    author: row.author,
    source: row.source,
    publicationDate: row.publication_date,
    keywords: row.keywords || [],
    type: row.type as "section" | "Research Paper" | "Article" | "Industry Report" | "White Paper" | "Case Study",
    url: row.url,
    fileSize: row.file_size,
    abstract: row.abstract,
    uploadedBy: row.uploaded_by,
    uploadDate: new Date(row.upload_date).toISOString().split('T')[0],
    version: row.version,
    lastModified: new Date(row.last_modified).toISOString().split('T')[0],
    editor: row.editor,
    filePath: row.file_path,
    fileName: row.file_name,
    mimeType: row.mime_type,
    status: row.status || "Complete"
  });

  const fetchLiterature = async (getSummery: boolean = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('literature')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by RFP ID if provided
      if (rfpId) {
        query = query.eq('rfp_id', rfpId);
      }

      const { data, error } = await query;

      if (error) {
        toast({ title: 'Failed to load tender documents', description: error.message, variant: 'destructive' });
        return;
      }

      if(getSummery){
        const pdfList = data?.map((item: any) => ({
          "s3_uri": item.url
        }));
        const mappedRes = await fetch('https://7amk3ruki7mgbge7dxn3ckvmji0upajt.lambda-url.us-west-2.on.aws/', {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "token": "rthsyIONdjwskd789hbfkejbnbnd66",
            "pdf_list": pdfList,
            "output_bucket": "rfp-new"
          })
        });
        const OCRdata = await mappedRes.json();
        console.log("OCRdata--------------",OCRdata);
        const { data: { session } } = await supabase.auth.getSession();
        const bearerToken = session?.access_token;
        if(!summeryId){
          await fetch('https://ytbkygmkyedaqgoilwyc.supabase.co/functions/v1/rapid-api', {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Authorization":`Bearer ${bearerToken}`
            },
            body: JSON.stringify({
              "rfp_id": rfpId,
              "document_link": OCRdata?.folder_path,
              "is_active": true
            })
          });
        }else{
          await fetch(`https://ytbkygmkyedaqgoilwyc.supabase.co/functions/v1/rapid-api/${summeryId}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization":`Bearer ${bearerToken}`
            },
            body: JSON.stringify({
              "rfp_id": rfpId,
              "document_link": OCRdata?.folder_path,
              "is_active": true
            })
          });
        }
        
      }
      
      setLiterature((data || []).map(mapRowToLiterature));
    } catch (error) {
      toast({ title: 'Error loading tender documents', description: 'An unexpected error occurred', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiterature(); 
    getSummaryData();   
  }, [rfpId]);

  // Get statistics
  const stats = {
    total: literature.length,
    sections: literature.filter(l => l.type === "section").length,
    articles: literature.filter(l => l.type === "Article").length,
    reports: literature.filter(l => l.type === "Industry Report").length,
    whitePapers: literature.filter(l => l.type === "White Paper").length
  };

  // Check if any file is in processing status
  const isUploadDisabled = processingFiles.size > 0 || uploading || currentProcessingStep !== 'uploading';

  // Get unique types and years
  const literatureTypes = Array.from(new Set(literature.map(l => l.type))).sort();
  const publicationYears = Array.from(new Set(literature.map(l => new Date(l.publicationDate).getFullYear().toString()))).sort().reverse();

  // Filter literature
  const filteredLiterature = literature.filter(lit => {
    const matchesSearch = lit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lit.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lit.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || lit.type === selectedType;
    const matchesYear = selectedYear === "all" || new Date(lit.publicationDate).getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesType && matchesYear;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "section": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Research Paper": return "bg-red-50 text-red-700 border-red-200";
      case "Article": return "bg-red-accent/10 text-red-accent border-red-accent/30";
      case "Industry Report": return "bg-gray-900 text-white border-gray-700";
      case "White Paper": return "bg-gray-700 text-white border-gray-600";
      case "Case Study": return "bg-gray-50 text-gray-700 border-gray-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSummaryData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const bearerToken = session?.access_token;
      // Delete from database
      let res = await fetch(`https://ytbkygmkyedaqgoilwyc.supabase.co/functions/v1/rapid-api?rfp_id=${rfpId}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${bearerToken}`
        },
      });
      const resData = await res.json();
      if(resData?.length){
        setSummeryId(resData?.[0]?.id);
      }
  };

  const handleUploadLiterature = async () => {
    try {
      setUploading(true);
      setCurrentProcessingStep('uploading');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      
      if (file) {
        setProcessingFileName(file.name);
      }

      //S3 upload function start
      const randomString = Math.random().toString(36).substring(2, 5);
      const fileName = `${randomString}-${file.name}`;
      const getUrl = `https://zftevtw2jnwawb6wuuumk3z6su0gittt.lambda-url.us-west-2.on.aws/?filename=${encodeURIComponent(fileName)}&token=ty678956Utnbken8vbfks`;
      const res = await fetch(getUrl);
      const data = await res.json();

      if (!data.upload_url) throw new Error("No upload_url in response");

      // 2. Upload file to S3 using PUT
      const putRes = await fetch(data.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/pdf"
        },
        body: file
      });

      if (!putRes.ok) throw new Error("Upload failed");

      // Update to processing step
      setCurrentProcessingStep('processing');

      const getFileRes = await fetch(`https://zftevtw2jnwawb6wuuumk3z6su0gittt.lambda-url.us-west-2.on.aws/?token=ty678956Utnbken8vbfks`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_key: fileName,
        })
      });
      const getFileData = await getFileRes.json();
      //S3 upload function ends
      
      if (!file) {
        toast({ title: 'No file selected', description: 'Please select a file to upload', variant: 'destructive' });
        return;
      }
      
      // Create a URL for the file (this would be the file path/URL)
      const fileUrl = getFileData?.url; // This is just a placeholder - in real implementation you'd get the actual URL
  
      // Create literature record in database
      const literatureData = {
        rfp_id: rfpId || null,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for title
        author: "Unknown",
        source: "Uploaded File",
        publication_date: new Date().toISOString().split('T')[0],
        keywords: ["uploaded", "document"],
        type: "Research Paper",
        abstract: "Document uploaded via file upload",
        uploaded_by: "Current User", // You can get this from auth context
        url: fileUrl,
        file_name: file.name,
        file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        mime_type: file.type
      };

      const { data: dbData, error: dbError } = await supabase
        .from('literature')
        .insert(literatureData)
        .select()
        .single();

      if (dbError) {
        toast({ title: 'Database error', description: dbError.message, variant: 'destructive' });
        return;
      }

      // Update to analyzing step
      setCurrentProcessingStep('analyzing');
      
      toast({
        title: "Success",
        description: "Document uploaded successfully. Now generating summery..."
      });
      
      // Update to generating step
      setCurrentProcessingStep('generating');
      
      // Refresh the literature list
      await fetchLiterature(true);

      // Reset file input
      if (fileInput) {
        fileInput.value = '';
      }
      // Update to complete step
      setCurrentProcessingStep('complete');
      
      // Wait a moment to show completion
      setTimeout(() => {
        setCurrentProcessingStep('uploading');
        setProcessingFileName('');
      }, 2000);
      
      toast({
        title: "Success",
        description: "Summery Generated successfully."
      });
      setShowUploadDialog(false);
    } catch (error) {
      toast({ title: 'Upload failed', description: 'An unexpected error occurred', variant: 'destructive' });
    } finally {
      setUploading(false);
      // Reset processing state if there was an error
      if (currentProcessingStep !== 'complete') {
        setCurrentProcessingStep('uploading');
        setProcessingFileName('');
      }
    }
  };

  const deleteLiterature = async (id: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('literature')
        .delete()
        .eq('id', id);

      if (dbError) {
        toast({ title: 'Delete failed', description: dbError.message, variant: 'destructive' });
        return;
      }

      // Update local state
      await fetchLiterature(true);
      //setLiterature(literature.filter(l => l.id !== id));
      
      toast({
        title: "Tender Document Deleted",
        description: "Tender document has been removed from the collection"
      });
    } catch (error) {
      toast({ title: 'Delete failed', description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const handleViewLiterature = (literature: Literature) => {
    setSelectedLiterature(literature);
    setShowViewDialog(true);
  };

  return (
    <div className="space-y-6">
             {/* Header */}
       <div className="flex items-center gap-2">
         <BookOpenCheck className="w-6 h-6 text-primary" />
         <h2 className="text-2xl font-bold">Tender Document</h2>
       </div>

      {/* A. Tender Document Upload/Import */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Tender Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
                         {/* Upload Literature */}
             {isUploadDisabled ? (
               <ProcessingLoader fileName={processingFileName || "Processing document..."} currentStep={currentProcessingStep} />
             ) : (
               <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                 <DialogTrigger asChild>
                   <div className="border-2 border-dashed border-red-accent/50 rounded-lg p-8 text-center cursor-pointer hover:border-red-accent transition-colors bg-red-accent/10">
                     <Upload className="w-12 h-12 mx-auto mb-4 text-red-accent" />
                     <p className="text-xl font-medium text-gray-900 mb-2">Upload Tender Document</p>
                     <p className="text-sm text-gray-600">
                       Click to upload PDF, DOCX, or other document files
                     </p>
                   </div>
                                  </DialogTrigger>
                 <DialogContent className="max-w-4xl">
                   <DialogHeader>
                     <DialogTitle>Upload Tender Document</DialogTitle>
                   </DialogHeader>
                   <div className="space-y-4">
                     <div>
                       <label className="text-sm font-medium">Upload Document *</label>
                       <div className="mt-1">
                         <Input 
                           id="file-upload"
                           type="file" 
                           accept=".pdf,.doc,.docx,.txt" 
                           className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-accent file:text-white hover:file:bg-red-accent/90 h-15"
                         />
                       </div>
                       <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT</p>
                       <p className="text-xs text-gray-400 mt-1">Long file names will be automatically truncated in the display</p>
                     </div>
                     <div className="flex gap-2">
                       <Button 
                         onClick={handleUploadLiterature}
                         disabled={uploading}
                         className="flex-1"
                       >
                         {uploading ? (
                           <>
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                             Uploading...
                           </>
                         ) : (
                           'Upload Tender Document'
                         )}
                       </Button>
                       <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploading}>
                         Cancel
                       </Button>
                     </div>
                   </div>
                 </DialogContent>
               </Dialog>
             )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards - Dashboard KPI Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Tender Documents
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.total}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpenCheck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              All tender document items
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-accent/5 to-red-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                RFP Sections
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.sections}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              RFP document sections
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Articles
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.articles}
              </div>
            </div>
            <div className="bg-gray-700 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Online articles
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-accent/5 to-red-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Industry Reports
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.reports}
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Industry insights
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                White Papers
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.whitePapers}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Technical papers
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>

             {/* C. Search */}
       <Card>
         <CardHeader>
           <CardTitle>Search</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col lg:flex-row gap-4 mb-6">
             <div className="flex-1 relative">
               <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
               <Input 
                 placeholder="Search by title, author, or keywords..." 
                 className="pl-10"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
         </CardContent>
       </Card>

      {/* B. Tender Document List & Details */}
      <Card>
                 <CardHeader>
           <CardTitle>Tender Document Collection</CardTitle>
         </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
                             <TableHeader>
                 <TableRow>
                   <TableHead>Title</TableHead>
                   <TableHead>Upload Date</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
              <TableBody>
                {filteredLiterature.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 line-clamp-2">{item.title}</p>
                        {item.abstract && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">{item.abstract}</p>
                        )}
                      </div>
                    </TableCell>
                                         <TableCell>
                       <div className="flex items-center gap-1">
                         <Calendar className="w-3 h-3 text-gray-400" />
                         <span className="text-sm text-gray-600">{item.uploadDate}</span>
                       </div>
                     </TableCell>
                                           <TableCell>
                        <div className="flex items-center gap-2">
                          {processingFiles.has(item.id) ? (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Processing
                            </Badge>
                          ) : (
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              Complete
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                     <TableCell>
                       <div className="flex items-center gap-2">
                       <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteLiterature(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 text-red-accent" />
                        </Button>
                       </div>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

                     {loading ? (
             <div className="text-center py-8 text-gray-500">
               <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
               <p>Loading tender documents...</p>
             </div>
           ) : literature.length === 0 ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                 <FileText className="w-full h-full" />
               </div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 No tender documents uploaded yet
               </h3>
               <p className="text-sm text-gray-500">
                 Upload your first tender document to get started with document management
               </p>
             </div>
           ) : filteredLiterature.length === 0 ? (
             <div className="text-center py-8 text-gray-500">
               No tender documents found matching your search criteria
             </div>
           ) : null}
        </CardContent>
      </Card>

      {/* View Tender Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedLiterature?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedLiterature && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Document Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Author:</span>
                      <p className="text-sm">{selectedLiterature.author}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Source:</span>
                      <p className="text-sm">{selectedLiterature.source}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <Badge className={getTypeColor(selectedLiterature.type)}>
                        {selectedLiterature.type}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Publication Date:</span>
                      <p className="text-sm">{selectedLiterature.publicationDate}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Version Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedLiterature.version && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Version:</span>
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                          {selectedLiterature.version}
                        </Badge>
                      </div>
                    )}
                    {selectedLiterature.lastModified && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Last Modified:</span>
                        <p className="text-sm">{selectedLiterature.lastModified}</p>
                      </div>
                    )}
                    {selectedLiterature.editor && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Editor:</span>
                        <p className="text-sm">{selectedLiterature.editor}</p>
                      </div>
                    )}
                    {selectedLiterature.fileSize && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">File Size:</span>
                        <p className="text-sm">{selectedLiterature.fileSize}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Keywords */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Keywords & Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedLiterature.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Abstract/Content */}
              {selectedLiterature.abstract && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Abstract / Content Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedLiterature.abstract}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedLiterature.fileSize ? (
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Document
                  </Button>
                ) : selectedLiterature.url ? (
                  <Button onClick={() => openUrl(selectedLiterature.url!)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open URL
                  </Button>
                ) : null}
                <Button variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};