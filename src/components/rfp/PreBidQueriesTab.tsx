import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageSquare, Upload, FileSpreadsheet, Eye, RefreshCw, CheckCircle, Loader2, AlertCircle, Clock, ArrowLeft, Users, Search, Filter, Bot, Flag, Edit3, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
interface UploadedFile {
  id: string;
  rfpId?: string;
  fileName: string;
  processingReferenceId: string;
  status: "Uploading" | "Processing" | "Complete" | "Error";
  uploadDate: string;
  vendorName: string;
  queriesCount?: number;
  answersGenerated?: number;
  csvS3Uri?: string;
  resultS3Uri?: string;
}
interface QueryData {
  id: string;
  question: string;
  answer: string;
  vendor: string;
  type: "Clarification" | "Request for Relaxation" | "Request for Modification" | "General Observation" | "Error/Flaw" | "Duplicate/Similar";
  group: string;
  flagForIntervention: boolean;
  internalNotes: string;
  isAnswered: boolean;
  status_marker:string;
}

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
}
interface PreBidQueriesTabProps {
  rfpId?: string;
}

export const PreBidQueriesTab = ({ rfpId }: PreBidQueriesTabProps = {}) => {
  console.log("rfpId--------",rfpId);
  const {
    toast
  } = useToast();

  // View state management
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([{
    id: "1",
    fileName: "vendor_queries_batch_1.csv",
    processingReferenceId: "PRF-2024-001",
    status: "Complete",
    uploadDate: "2024-01-20",
    vendorName: "ALMIGHTY MANPOWER & SECURITY SERVICES",
    queriesCount: 25,
    answersGenerated: 25
  }, {
    id: "2",
    fileName: "pre_bid_questions_technical.xlsx",
    processingReferenceId: "PRF-2024-002",
    status: "Processing",
    uploadDate: "2024-01-19",
    vendorName: "M/S ARADHAY SHREERAM PRIVATE LIMITED",
    queriesCount: 18,
    answersGenerated: 12
  }, {
    id: "3",
    fileName: "commercial_queries_set2.csv",
    processingReferenceId: "PRF-2024-003",
    status: "Error",
    uploadDate: "2024-01-18",
    vendorName: "SECURE SERVICES (M/S HARSH ENGINEERING WORKS)",
    queriesCount: 0,
    answersGenerated: 0
  }]);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [parsedByFileName, setParsedByFileName] = useState<Record<string, QueryData[]>>({});

  // Mock query data for analysis view
  const [queries, setQueries] = useState<QueryData[]>([]);

  // Analysis view filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedFlag, setSelectedFlag] = useState<string>("all");
  const [OCRData, setOCRData] = useState<any>({});

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
    mimeType: row.mime_type
  });

  // Vendor names from vendor management
  const vendorNames = ["ALMIGHTY MANPOWER & SECURITY SERVICES", "ANGEL MANPOWER & SECURITY SERVICES", "M/S ARADHAY SHREERAM PRIVATE LIMITED", "SMVD GROUP SECURE SERVICES", "UNIQUE DESIGN AND CONSTRUCTIONS", "JEELIFE CONSTRUCTION PRIVATE LIMITED-NAGPUR", "SHREE GOSAI ENTERPRISES", "PARAMOUNT SERVICES", "M/s BOOSTUP INDIA SOLUTION", "SECURE SERVICES (M/S HARSH ENGINEERING WORKS)"];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-50 text-green-700 border-green-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Uploading":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return CheckCircle;
      case "Processing":
        return Loader2;
      case "Uploading":
        return Upload;
      case "Error":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // Supabase client with proper types
  const sb = supabase;

  const mapRowToUploadedFile = (row: any): UploadedFile => ({
    id: row.id,
    rfpId: row.rfp_id,
    fileName: row.file_name,
    processingReferenceId: row.processing_reference_id,
    status: row.status,
    uploadDate: new Date(row.upload_date || row.created_at).toISOString().split('T')[0],
    vendorName: row.vendor_name,
    queriesCount: row.queries_count ?? 0,
    answersGenerated: row.answers_generated ?? 0,
    csvS3Uri: row.csv_s3_uri,
    resultS3Uri: row.result_s3_uri,
  });

  const fetchUploads = async () => {
    let query = sb
      .from('prebid_query_uploads')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by RFP ID if provided
    if (rfpId) {
      query = query.eq('rfp_id', rfpId);
    }

    const { data, error } = await query;

    if (error) {
      toast({ title: 'Failed to load uploads', description: error.message, variant: 'destructive' });
      return;
    }

    setUploadedFiles((data || []).map(mapRowToUploadedFile));
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
        setOCRData(resData[0]);
      }
  };

  useEffect(() => {
    fetchUploads();
    getSummaryData();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Filter to only allow CSV files
    const csvFiles = files.filter(file => file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'));
    
    if (csvFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Only CSV files are allowed. Please select CSV files only.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(csvFiles);
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }

    const now = Date.now();
    const year = new Date().getFullYear();
    
    console.log("selectedFiles--------------",selectedFiles);
    // Process each file and await all promises
    const rowsToInsert = await Promise.all(selectedFiles.map(async (file, index) => {
      const randomVendor = vendorNames[Math.floor(Math.random() * vendorNames.length)];
      const uniqueSuffix = `${(now + index).toString(36).toUpperCase()}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
      const processingRef = `PRF-${year}-${uniqueSuffix}`;
      
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
          "Content-Type": "text/csv"
        },
        body: file
      });

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
      // Generate S3 URIs for the uploaded file
      const csvS3Uri = getFileData?.url;
      const resultS3Uri = '';
      
      return {
        rfp_id: rfpId || null,
        file_name: file.name,
        processing_reference_id: processingRef,
        status: 'Uploading',
        upload_date: new Date().toISOString(),
        vendor_name: randomVendor,
        queries_count: 0,
        answers_generated: 0,
        csv_s3_uri: csvS3Uri,
        result_s3_uri: resultS3Uri,
      };
    }));

    const { data, error } = await sb
      .from('prebid_query_uploads')
      .insert(rowsToInsert)
      .select('*');

    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      return;
    }

    const inserted = (data || []).map(mapRowToUploadedFile);
    setUploadedFiles([...inserted, ...uploadedFiles]);
    setShowBulkUploadDialog(false);
    setSelectedFiles([]);

    // Simulate processing status updates in DB and UI
    inserted.forEach((row, index) => {
      const delay = 2000 + index * 500;
      setTimeout(async () => {
        const randomQueries = Math.floor(Math.random() * 20) + 5;
        await sb
          .from('prebid_query_uploads')
          .update({ status: 'Processing', queries_count: 0 })
          .eq('id', row.id);

        setUploadedFiles(prev => prev.map(f => f.id === row.id ? { ...f, status: 'Processing', queriesCount: 0 } : f));

        setTimeout(async () => {

          // Update with result S3 URI when processing is complete
          const mappedRes = await fetch('https://hwkfcn3mi4xthu6txuw3w2j7gy0xjgwk.lambda-url.us-west-2.on.aws/', {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "token": "rthsyIONdjwskd789hbfkejbnbnd66",
              "csv_s3_uri": row?.csvS3Uri,
              "ocr_s3_uri": OCRData?.document_link,
              "output_bucket": "rfp-new"
            })
          });
          const response=await mappedRes.json();
          console.log("response---------------------",response);
          const resultS3Uri = response?.result_http_url || '';
          
          await sb
            .from('prebid_query_uploads')
            .update({ 
              status: 'Complete',
              queries_count:response?.summary?.total_queries || 0,
              result_s3_uri: resultS3Uri
            })
            .eq('id', row.id);

          setUploadedFiles(prev => prev.map(f => f.id === row.id ? { 
            ...f, 
            status: 'Complete', 
            queriesCount: response?.summary?.total_queries || 0,
            resultS3Uri: resultS3Uri
          } : f));

          if (index === inserted.length - 1) {
            toast({ title: 'Upload Complete', description: `All ${inserted.length} files have been processed and answers generated` });
          }
        }, 3000 + index * 500);
      }, delay);
    });

    toast({ title: 'Upload Started', description: `Processing ${rowsToInsert.length} file(s) with pre-bid queries` });
  };
  const refreshStatus = async () => {
    await fetchUploads();
    toast({
      title: "Status Refreshed",
      description: "All file processing statuses have been updated"
    });
  };
  const viewFileDetails = async (file: UploadedFile) => {
    console.log("file---------------------",file);
    setSelectedFile(file);
    setShowAnalysisView(true);
    //here file?.resultS3Uri='https://rfp-new.s3.us-west-2.amazonaws.com/results/query_response_20250820_075600_da336088.json' now i want to read the json file from url to get data
   
    
    // Fetch queries for this upload
    if (file.id) {
      // const { data: queryData, error: queryError } = await sb
      //   .from('prebid_queries')
      //   .select('*')
      //   .eq('upload_id', file.id)
      //   .order('created_at', { ascending: true });

      // if (queryError) {
      //   toast({ title: 'Failed to load queries', description: queryError.message, variant: 'destructive' });
      //   return;
      // }
      const response = await fetch(file?.resultS3Uri);
      const queryData = await response.json();
      console.log("queryData---------------------",queryData);
      if (queryData?.items && queryData?.items?.length > 0) {
        const mappedQueries: QueryData[] = queryData?.items?.map((q: any, index: number) => ({
          id: `${q?.cluster_id}_${index}`,
          question: q?.query_text,
          answer: q?.draft_response || '',
          vendor: q?.vendor,
          type: [q?.category],
          group: q?.clause_or_section || 'General',
          flagForIntervention: q?.status_marker=='Human Intervention Required'?true:false,
          internalNotes: q?.internal_note,
          isAnswered: q?.status_marker=="Answer Provided"?true:false,
          status_marker:q?.status_marker
        }));
        setQueries(mappedQueries);
      }
    }
  };
  const handleBackToMain = () => {
    setShowAnalysisView(false);
    setSelectedFile(null);
    toast({
      title: "Returning to Upload Status",
      description: "Changes have been saved automatically"
    });
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await sb
        .from('prebid_query_uploads')
        .delete()
        .eq('id', fileId);

      if (error) {
        toast({ 
          title: 'Delete Failed', 
          description: error.message, 
          variant: 'destructive' 
        });
        return;
      }

      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      toast({
        title: "File Deleted",
        description: "The upload record has been successfully removed"
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "An unexpected error occurred while deleting the file",
        variant: "destructive"
      });
    }
  };

  // Analysis view functions
  const updateAnswer = async (queryId: string, newAnswer: string) => {
    const isAnswered = newAnswer.trim() !== "";
    
    // Update local state
    setQueries(prev => prev.map(q => q.id === queryId ? {
      ...q,
      answer: newAnswer,
      isAnswered
    } : q));

    // Update database
    const { error } = await sb
      .from('prebid_queries')
      .update({ 
        answer: newAnswer, 
        is_answered: isAnswered,
        updated_at: new Date().toISOString()
      })
      .eq('id', queryId);

    if (error) {
      toast({ title: 'Failed to update answer', description: error.message, variant: 'destructive' });
    }
  };
  const toggleFlag = async (queryId: string) => {
    const query = queries.find(q => q.id === queryId);
    if (!query) return;

    const newFlagValue = !query.flagForIntervention;
    
    // Update local state
    setQueries(prev => prev.map(q => q.id === queryId ? {
      ...q,
      flagForIntervention: newFlagValue
    } : q));

    // Update database
    const { error } = await sb
      .from('prebid_queries')
      .update({ 
        flag_for_intervention: newFlagValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', queryId);

    if (error) {
      toast({ title: 'Failed to update flag', description: error.message, variant: 'destructive' });
    }
  };
  const updateType = async (queryId: string, newType: "Clarification" | "Request for Relaxation" | "Request for Modification" | "General Observation" | "Error/Flaw" | "Duplicate/Similar") => {
    // Update local state
    setQueries(prev => prev.map(q => q.id === queryId ? {
      ...q,
      type: newType
    } : q));

    // Update database
    const { error } = await sb
      .from('prebid_queries')
      .update({ 
        query_type: newType,
        updated_at: new Date().toISOString()
      })
      .eq('id', queryId);

    if (error) {
      toast({ title: 'Failed to update type', description: error.message, variant: 'destructive' });
    }
  };
  const getGroupColor = (group: string) => {
    const groups = Array.from(new Set(queries.map(q => q.group))).sort();
    const colors = ["bg-blue-50 text-blue-700 border-blue-200", "bg-green-50 text-green-700 border-green-200", "bg-purple-50 text-purple-700 border-purple-200", "bg-orange-50 text-orange-700 border-orange-200"];
    const index = groups.indexOf(group) % colors.length;
    return colors[index];
  };

  // Get unique values for filters
  const vendors = Array.from(new Set(queries.map(q => q.vendor))).sort();
  const types = Array.from(new Set(queries.map(q => Array.isArray(q.type) ? q.type[0]?.trim() : q.type?.trim()))).filter(Boolean).sort();
  const groups = Array.from(new Set(queries.map(q => q.group))).sort();

  // Filter queries for analysis view
  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.question.toLowerCase().includes(searchTerm.toLowerCase()) || query.answer.toLowerCase().includes(searchTerm.toLowerCase()) || query.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = selectedVendor === "all" || query.vendor === selectedVendor;
    const matchesType = selectedType === "all" || query?.type?.includes(selectedType);
   // const matchesGroup = selectedGroup === "all" || query.group === selectedGroup;
    const matchesFlag = selectedFlag === "all" || selectedFlag === "flagged" && query.flagForIntervention || selectedFlag === "not-flagged" && !query.flagForIntervention;
    return matchesSearch && matchesVendor && matchesType && matchesFlag;
  });

  console.log("selectedType---------------------",selectedType);
  console.log("queries---------------------",queries);
  console.log("filteredQueries---------------------",filteredQueries);
  // Calculate KPIs for analysis view
  const analysisKpis = {
    totalQuestions: queries.length,
    uniqueVendors: vendors.length,
    requiresIntervention: queries.filter(q => q.flagForIntervention).length,
    questionsAnswered: queries.filter(q => q.isAnswered).length
  };

  // Get statistics for uploaded files
  const stats = {
    totalFiles: uploadedFiles.length,
    processing: uploadedFiles.filter(f => f.status === "Processing").length,
    completed: uploadedFiles.filter(f => f.status === "Complete").length,
    errors: uploadedFiles.filter(f => f.status === "Error").length,
    totalQueries: uploadedFiles.reduce((sum, file) => sum + (file.queriesCount || 0), 0),
    totalAnswers: uploadedFiles.reduce((sum, file) => sum + (file.answersGenerated || 0), 0)
  };

  // Check if any file is in uploading or processing status
  const hasUploadingFile = uploadedFiles.some(f => f.status === "Uploading");
  const hasProcessingFile = uploadedFiles.some(f => f.status === "Processing");
  const isUploadDisabled = hasUploadingFile || hasProcessingFile;

  // Conditional rendering based on view state
  if (showAnalysisView) {
    return <div className="space-y-6 py-[20px]">
        {/* Header with Back Button */}
        <div className="space-y-4">
          <Button variant="outline" onClick={handleBackToMain} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">Query Analysis & Response</h1>
            <p className="text-muted-foreground">
              Analyze, categorize, and respond to all pre-bid queries from {selectedFile?.fileName}
            </p>
          </div>
        </div>

        {/* A. KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Total Questions
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analysisKpis.totalQuestions}
                </div>
              </div>
              <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                From this submission
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>

          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Unique Vendors
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analysisKpis.uniqueVendors}
                </div>
              </div>
              <div className="bg-red-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Participating vendors
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>

          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Requires Intervention
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analysisKpis.requiresIntervention}
                </div>
              </div>
              <div className="bg-red-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Flag className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Needs human review
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>

          <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  Questions Answered
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analysisKpis.questionsAnswered}
                </div>
              </div>
              <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                Ready for publication
              </p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        </div>

        {/* C. Filtering Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Search Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search questions or answers..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map(vendor => <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                </SelectContent>
              </Select> */}

              <Select value={selectedFlag} onValueChange={setSelectedFlag}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Flag Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Questions</SelectItem>
                  <SelectItem value="flagged">Flagged for Review</SelectItem>
                  <SelectItem value="not-flagged">Not Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* B. Questions & Answers Table */}
        <Card className="w-full" style={{ maxWidth: '90vw', overflow: 'hidden' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Questions & Answers Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto" style={{ maxWidth: '100%' }}>
              <div className="min-w-[1200px]">
                <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 min-w-[80px]">SL No</TableHead>
                    <TableHead className="w-[400px] min-w-[350px]">Question</TableHead>
                    <TableHead className="w-[500px] min-w-[400px]">Answer</TableHead>
                    <TableHead className="w-[300px] min-w-[250px]">Clause/Section</TableHead>
                    <TableHead className="w-[150px] min-w-[120px]">Type</TableHead>
                    <TableHead className="w-[250px] min-w-[200px]">Vendor</TableHead>
                    <TableHead className="w-[220px] min-w-[200px]">Status</TableHead>
                    <TableHead className="w-[300px] min-w-[250px]">Internal Notes</TableHead>
                    {/* <TableHead className="w-20 min-w-[80px]">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueries.map((query, index) => <TableRow key={query.id} className="hover:bg-muted/50">
                      <TableCell className="align-top text-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        <Dialog>
                            <DialogTrigger asChild>
                              <div className="max-w-full">
                                <p className="text-sm text-black leading-relaxed">
                                  {query.question}
                                </p>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Question</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="text-sm text-black">
                                      {query.question}
                                    </div>
                                  </div>
                            </DialogContent>
                        </Dialog>
                        
                      </TableCell>
                      <TableCell className="align-top">
                            <div className="cursor-pointer hover:bg-muted/50 p-2 rounded min-h-[48px] max-h-[48px]">
                              <p className="text-sm text-black">
                                {query.answer}
                              </p>
                            </div>
                      </TableCell>
                      <TableCell className="align-top">
                          
                                <div className="max-w-full">
                                  <p className="text-sm text-black leading-relaxed">
                                    {query.group}
                                  </p>
                                </div>
                              
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={
                          query.type=='Error/Flaw' ? "destructive" :
                          query.type=='Request for Relaxation' ? "warning" :
                          query.type=='Request for Modification' ? "info" :
                          query.type=='Clarification' ? "success" :
                          query.type=='General Observation' ? "purple" :
                          query.type=='Duplicate/Similar' ? "orange" : "default"
                        } className="text-xs">
                          {query.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-600 max-w-[150px] truncate">
                            {query.vendor}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={
                          query.status_marker=='Answer Provided' ? "success" :
                          query.status_marker=='Pending Clarification' ? "destructive" :
                          query.status_marker=='Human Intervention Required' ? "warning" :
                          query.status_marker=='Under Review' ? "info" :
                          query.status_marker=='Draft' ? "purple" :
                          query.status_marker=='Finalized' ? "teal" : "default"
                        } className="text-xs">
                          {query.status_marker}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="cursor-pointer hover:bg-muted/50 p-2 rounded min-h-[48px] max-h-[48px]">
                              <p className="text-sm text-black">
                                {query.internalNotes}
                              </p>
                        </div>
                        
                      </TableCell>
                      {/* <TableCell className="align-top">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleFlag(query.id)}>
                              <Flag className="mr-2 h-4 w-4" />
                              {query.flagForIntervention ? "Remove Flag" : "Flag for Review"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Type
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell> */}
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
            </div>

            {filteredQueries.length === 0 && <div className="text-center py-8 text-gray-500 px-6">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No queries found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>}
          </CardContent>
        </Card>
      </div>;
  }

  // Main upload interface view
  return <div className="space-y-6 py-[20px]">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Pre-bid Queries</h2>
          </div>
          <p className="text-muted-foreground mt-1">Upload, track, and manage pre-bid queries submitted by vendors in bulk.</p>
        </div>
        <Button onClick={refreshStatus} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* A. Bulk CSV Upload Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk CSV Upload Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Dialog open={showBulkUploadDialog} onOpenChange={(open) => {
                             if (isUploadDisabled && open) {
                 toast({
                   title: "Upload Disabled",
                   description: "Please wait for the current file upload or processing to complete before uploading another file.",
                   variant: "destructive"
                 });
                return;
              }
              setShowBulkUploadDialog(open);
            }}>
              <DialogTrigger asChild disabled={isUploadDisabled}>
                <Button 
                  size="lg" 
                  className={`${
                    isUploadDisabled 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                  disabled={isUploadDisabled}
                >
                                     <Upload className="w-5 h-5 mr-2" />
                   {isUploadDisabled ? 'Upload/Processing in Progress...' : 'Upload CSV File'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                  <DialogTitle>Upload Pre-bid Queries</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Select CSV files containing pre-bid queries</p>
                    <p className="text-sm text-gray-600 mb-4">Only CSV files are accepted. Multiple files can be uploaded at once and will be processed automatically</p>
                    <Input 
                      type="file" 
                      accept=".csv" 
                      multiple 
                      onChange={handleFileSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-accent file:text-white hover:file:bg-red-accent/90 h-15"
                    />
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4" />
                          Selected Files ({selectedFiles.length})
                        </h4>
                        <div className="grid gap-2 max-h-40 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileSpreadsheet className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700 truncate font-medium" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleBulkUpload} 
                      className="flex-1"
                      disabled={selectedFiles.length === 0}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Process Upload {selectedFiles.length > 0 && `(${selectedFiles.length} files)`}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowBulkUploadDialog(false);
                        setSelectedFiles([]);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
                         <p className="text-sm text-muted-foreground mt-3">
               {isUploadDisabled 
                 ? "Upload is disabled while a file is being uploaded or processed. Please wait for the current operation to complete."
                 : "Primary method for adding multiple pre-bid queries at once"
               }
             </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Files
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.totalFiles}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Uploaded files
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

         <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
             <div className="space-y-1">
               <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                 Processing
               </CardTitle>
               <div className="text-2xl font-bold text-gray-900 tracking-tight">
                 {stats.processing}
               </div>
             </div>
             <div className="bg-red-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
               <Loader2 className="h-4 w-4 text-white" />
             </div>
           </CardHeader>
           
           <CardContent className="relative pt-0 px-6 pb-6">
             <p className="text-xs text-gray-600 font-medium">
               Currently processing
             </p>
           </CardContent>
           
           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         </Card>

         <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
           <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
             <div className="space-y-1">
               <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                 Completed
               </CardTitle>
               <div className="text-2xl font-bold text-gray-900 tracking-tight">
                 {stats.completed}
               </div>
             </div>
             <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
               <CheckCircle className="h-4 w-4 text-white" />
             </div>
           </CardHeader>
           
           <CardContent className="relative pt-0 px-6 pb-6">
             <p className="text-xs text-gray-600 font-medium">
               Successfully processed
             </p>
           </CardContent>
           
           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Errors
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.errors}
              </div>
            </div>
            <div className="bg-red-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Failed processing
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Total Queries
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.totalQueries}
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Questions processed
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        {/* <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Answers Generated
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.totalAnswers}
              </div>
            </div>
            <div className="bg-red-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Answers ready
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card> */}
      </div>

                        {/* B. Upload Status Table */}
            {!showAnalysisView && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Status Table</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full overflow-hidden">
                    <div className="overflow-x-auto max-w-full">
                      <Table className="w-full table-fixed">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">File Name</TableHead>
                            <TableHead className="w-[180px]">Processing Reference ID</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="w-[120px]">Upload Date</TableHead>
                            <TableHead className="w-[100px]">Queries</TableHead>
                            {/* <TableHead className="w-[140px]">Answers Generated</TableHead> */}
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadedFiles.map(file => {
                          const StatusIcon = getStatusIcon(file.status);
                          const isProcessing = file.status === "Processing";
                          return <TableRow key={file.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="font-medium truncate">{file.fileName}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate block">
                                    {file.processingReferenceId}
                                  </code>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(file.status)}>
                                    <StatusIcon className={`w-3 h-3 mr-1 ${isProcessing ? 'animate-spin' : ''}`} />
                                    {file.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {file.uploadDate}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {file?.queriesCount || 0}
                                  </div>
                                </TableCell>
                                {/* <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{file.answersGenerated || 0}</span>
                                    {file.queriesCount && file.answersGenerated && <div className="text-xs text-gray-500">
                                        ({Math.round(file.answersGenerated / file.queriesCount * 100)}%)
                                      </div>}
                                  </div>
                                </TableCell> */}
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem 
                                        onClick={() => viewFileDetails(file)} 
                                        disabled={file.status === "Error" || file.status === "Processing"}
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteFile(file.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>;
                        })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {uploadedFiles.length === 0 && <div className="text-center py-8 text-gray-500 px-6">
                      <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No files uploaded yet</p>
                      <p className="text-sm">Upload your first CSV file to get started with bulk query processing</p>
                    </div>}
                </CardContent>
              </Card>
            )}
    </div>;
};