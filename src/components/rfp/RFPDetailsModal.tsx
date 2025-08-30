import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  Building,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  Globe,
  Download,
  Edit,
  Share2,
  Star,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import type { RFP } from "@/pages/RFPManagement";

interface RFPDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfp: RFP | null;
}

// Generate dynamic detailed data based on RFP
const getRFPDetails = (rfp: RFP) => {
  const baseDescriptions = {
    'IT Services': 'This RFP is for the procurement of comprehensive digital infrastructure services to support technology transformation initiatives. The project encompasses cloud infrastructure, data analytics, cybersecurity, and digital platform development.',
    'Procurement': 'This RFP covers the procurement of essential office supplies and materials required for government operations. The scope includes stationery, office equipment, furniture, and related support services.',
    'Consulting': 'This RFP is for specialized consulting services focusing on security assessment, risk analysis, and strategic recommendations. The engagement includes comprehensive audit procedures and compliance evaluation.',
    'Construction': 'This RFP covers comprehensive construction and development services for urban infrastructure projects. The scope includes planning, design, construction, and project management services.'
  };

  const budgets = {
    '1': '₹85,00,000',
    '2': '₹42,50,000', 
    '3': '₹1,25,00,000',
    '4': '₹3,75,00,000',
    '5': '₹67,80,000'
  };

  const departments = {
    'IT Services': 'Ministry of Electronics & IT',
    'Procurement': 'Maharashtra State Government',
    'Consulting': 'Reserve Bank of India',
    'Construction': 'Pune Municipal Corporation'
  };

  const contacts = {
    'IT Services': { name: "Rajesh Kumar", designation: "Senior Project Manager", email: "rajesh.kumar@meity.gov.in", phone: "+91-9876543210" },
    'Procurement': { name: "Priya Sharma", designation: "Procurement Officer", email: "priya.sharma@maharashtra.gov.in", phone: "+91-9123456789" },
    'Consulting': { name: "Amit Patel", designation: "Chief Security Officer", email: "amit.patel@rbi.org.in", phone: "+91-9234567890" },
    'Construction': { name: "Suresh Rao", designation: "Chief Engineer", email: "suresh.rao@pmc.gov.in", phone: "+91-9345678901" }
  };

  const locations = {
    'IT Services': 'New Delhi, India',
    'Procurement': 'Mumbai, Maharashtra',
    'Consulting': 'Mumbai, Maharashtra', 
    'Construction': 'Pune, Maharashtra'
  };

  const categoryRequirements = {
    'IT Services': [
      "Cloud Infrastructure Setup (AWS/Azure)",
      "Data Analytics Platform Development", 
      "Cybersecurity Implementation",
      "Mobile Application Development",
      "Staff Training & Support"
    ],
    'Procurement': [
      "Office Stationery Supply",
      "Computer Hardware & Peripherals",
      "Furniture & Fixtures",
      "Maintenance & Support Services",
      "Quality Assurance Standards"
    ],
    'Consulting': [
      "Security Risk Assessment",
      "Compliance Audit Services",
      "Vulnerability Testing",
      "Policy Review & Recommendations", 
      "Staff Security Training"
    ],
    'Construction': [
      "Architectural Design Services",
      "Civil Construction Work",
      "Electrical & Plumbing Systems",
      "Project Management",
      "Quality Control & Testing"
    ]
  };

  // Calculate timeline based on issue and closing dates
  const issueDate = new Date(rfp.issue_date);
  const closingDate = new Date(rfp.closing_date);
  const totalDays = Math.ceil((closingDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentDate = new Date();
  
  const registrationDeadline = new Date(issueDate.getTime() + (totalDays * 0.2 * 24 * 60 * 60 * 1000));
  const submissionDeadline = closingDate;
  const evaluationDeadline = new Date(closingDate.getTime() + (7 * 24 * 60 * 60 * 1000));
  const financialDeadline = new Date(closingDate.getTime() + (14 * 24 * 60 * 60 * 1000));
  const awardDeadline = new Date(closingDate.getTime() + (21 * 24 * 60 * 60 * 1000));

  const getPhaseStatus = (deadline: Date) => {
    if (currentDate > deadline) return 'completed';
    if (Math.abs(currentDate.getTime() - deadline.getTime()) < (7 * 24 * 60 * 60 * 1000)) return 'active';
    return 'pending';
  };

  return {
    ...rfp,
    description: baseDescriptions[rfp.category as keyof typeof baseDescriptions] || baseDescriptions['IT Services'],
    budget: budgets[rfp.id as keyof typeof budgets] || '₹50,00,000',
    department: departments[rfp.category as keyof typeof departments] || 'Government Department',
    contactPerson: contacts[rfp.category as keyof typeof contacts] || contacts['IT Services'],
    location: locations[rfp.category as keyof typeof locations] || 'New Delhi, India',
    website: `https://${rfp.category.toLowerCase().replace(' ', '')}.gov.in`,
    requirements: categoryRequirements[rfp.category as keyof typeof categoryRequirements] || categoryRequirements['IT Services'],
    eligibilityCriteria: [
      "Minimum 3-5 years experience in relevant field",
      "Valid business registration and licenses",
      "Previous government project experience preferred",
      `Annual turnover appropriate for ${rfp.category} projects`
    ],
    timeline: [
      { phase: "Registration", deadline: registrationDeadline.toISOString().split('T')[0], status: getPhaseStatus(registrationDeadline) },
      { phase: "Proposal Submission", deadline: submissionDeadline.toISOString().split('T')[0], status: getPhaseStatus(submissionDeadline) },
      { phase: "Technical Evaluation", deadline: evaluationDeadline.toISOString().split('T')[0], status: getPhaseStatus(evaluationDeadline) },
      { phase: "Financial Evaluation", deadline: financialDeadline.toISOString().split('T')[0], status: getPhaseStatus(financialDeadline) },
      { phase: "Award", deadline: awardDeadline.toISOString().split('T')[0], status: getPhaseStatus(awardDeadline) }
    ],
    metrics: {
      completionRate: Math.floor(Math.random() * 30) + 50, // 50-80%
      qualifiedApplicants: Math.floor(rfp.total_applicants * 0.7), // ~70% qualified
      averageScore: Math.floor(Math.random() * 25) + 65, // 65-90
      complianceRate: Math.floor(Math.random() * 20) + 80 // 80-100%
    },
    recentActivity: [
      { action: "Document Updated", timestamp: "2 hours ago", user: "Admin" },
      { action: "New Applicant", timestamp: "5 hours ago", user: "System" },
      { action: "Query Response", timestamp: "1 day ago", user: "Admin" },
      { action: "Status Updated", timestamp: "2 days ago", user: "System" }
    ]
  };
};

export const RFPDetailsModal = ({ isOpen, onClose, rfp }: RFPDetailsModalProps) => {
  if (!rfp) return null;

  const details = getRFPDetails(rfp);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'active': return <Activity className="w-4 h-4 text-warning" />;
      case 'pending': return <Clock className="w-4 h-4 text-muted-foreground" />;
      default: return <AlertCircle className="w-4 h-4 text-error" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-success text-white';
      case 'Closed': return 'bg-muted text-muted-foreground';
      case 'Under Review': return 'bg-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white border border-gray-200 rounded-[10px]">
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="p-[24px]">
            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold text-black leading-tight">
                    {details.name}
                  </DialogTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-black text-white border-black">
                      {details.number}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(details.status)}>
                      {details.status}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{details.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" className="bg-success hover:bg-success/90 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onClose}
                    className="border-gray-200 hover:bg-gray-50 ml-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-6">
              <div className="group relative overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-black tracking-tight leading-none">
                      Total Applicants
                    </div>
                    <div className="text-2xl font-bold text-black tracking-tight">
                      {details.total_applicants}
                    </div>
                  </div>
                  <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="relative pt-0 px-6 pb-6">
                  <p className="text-xs text-black font-medium">
                    Applications received
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="group relative overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-black tracking-tight leading-none">
                      Completion Rate
                    </div>
                    <div className="text-2xl font-bold text-black tracking-tight">
                      {details.metrics.completionRate}%
                    </div>
                  </div>
                  <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="relative pt-0 px-6 pb-6">
                  <p className="text-xs text-black font-medium">
                    Process completion
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="group relative overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-black tracking-tight leading-none">
                      Average Score
                    </div>
                    <div className="text-2xl font-bold text-black tracking-tight">
                      {details.metrics.averageScore}
                    </div>
                  </div>
                  <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="relative pt-0 px-6 pb-6">
                  <p className="text-xs text-black font-medium">
                    AI evaluation score
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="group relative overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-black tracking-tight leading-none">
                      Compliance Rate
                    </div>
                    <div className="text-2xl font-bold text-black tracking-tight">
                      {details.metrics.complianceRate}%
                    </div>
                  </div>
                  <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="relative pt-0 px-6 pb-6">
                  <p className="text-xs text-black font-medium">
                    Document compliance
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Main Content - Vertical Layout */}
            <div className="space-y-6">
              {/* Description */}
                <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-success" />
                    Project Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{details.description}</p>
                </div>

                {/* Requirements */}
                <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-success" />
                    Key Requirements
                  </h3>
                  <div className="space-y-2">
                    {details.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-success" />
                    Project Timeline
                  </h3>
                  <div className="space-y-4">
                    {details.timeline.map((phase, index) => (
                      <div key={index} className="flex items-center gap-4">
                        {getStatusIcon(phase.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-black">{phase.phase}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(phase.deadline), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <Progress 
                            value={phase.status === 'completed' ? 100 : phase.status === 'active' ? 60 : 0} 
                            className="h-2 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Basic Info */}
              <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                <h3 className="text-lg font-semibold text-black mb-4">RFP Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Issue Date</div>
                        <div className="font-medium text-black">
                          {format(new Date(details.issue_date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Closing Date</div>
                        <div className="font-medium text-black">
                          {format(new Date(details.closing_date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Budget</div>
                        <div className="font-medium text-black">{details.budget}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Department</div>
                        <div className="font-medium text-black">{details.department}</div>
                      </div>
                    </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-black">{details.contactPerson.name}</div>
                      <div className="text-sm text-muted-foreground">{details.contactPerson.designation}</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">{details.contactPerson.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">{details.contactPerson.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">{details.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">{details.website}</span>
                      </div>
                    </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-success" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {details.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-black">{activity.action}</div>
                          <div className="text-xs text-muted-foreground">{activity.timestamp} • {activity.user}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="bg-white border border-gray-200 rounded-[10px] p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-success" />
                    Eligibility Criteria
                  </h3>
                  <div className="space-y-2">
                    {details.eligibilityCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{criteria}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};