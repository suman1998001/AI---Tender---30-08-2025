
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import RFPManagement from "./pages/RFPManagement";
import RFPDetail from "./pages/RFPDetail";
import ApplicantTracking from "./pages/ApplicantTracking";
import ApplicantDetail from "./pages/ApplicantDetail";
import DocumentCenter from "./pages/DocumentCenter";
import GeneralDocumentDrafter from "./pages/GeneralDocumentDrafter";
import GenerateDocumentDraft from "./pages/GenerateDocumentDraft";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import AdminPanel from "./pages/AdminPanel";
import WorkflowViewer from "./pages/WorkflowViewer";
import RFPDrafting from "./pages/RFPDrafting";
import ContractManagement from "./pages/ContractManagement";
import SLAManagement from "./pages/SLAManagement";
import PaymentBudget from "./pages/PaymentBudget";
import PaymentPage from "./pages/PaymentPage";
import Settings from "./pages/Settings";
import SustainableProcurement from "./pages/SustainableProcurement";
import CreateSurvey from "./pages/CreateSurvey";
import SurveyPreview from "./pages/SurveyPreview";
import SustainabilityCriteria from "./pages/SustainabilityCriteria";
import VendorScorecard from "./pages/VendorScorecard";
import VendorProfile from "./pages/VendorProfile";
import VendorManagement from "./pages/VendorManagement";
import { OperatorManagement } from "./pages/OperatorManagement";
import PRChecker from "./pages/PRChecker";
import DocumentChecker from "./pages/DocumentChecker";
import mixpanel from 'mixpanel-browser';
import ComparativeStatement from "./pages/ComparativeStatement";
import ComparativeStatementConfigurator from "./pages/ComparativeStatementConfigurator";
import ContractGenerationPage from "./pages/ContractGenerationPage";

mixpanel.init('b23ed5f0c563913c1822dc17a53e98d0'); // Replace with your Mixpanel project token

// Clean build - removed QueryAnalysisView references

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/ai-tender-dashboard">
        <Routes>
          <Route path="/" element={<div className="animate-fade-in"><Login /></div>} />
          <Route path="/login" element={<div className="animate-fade-in"><Login /></div>} />
          <Route path="/dashboard" element={<div className="animate-fade-in"><Index /></div>} />
          <Route path="/rfp-management" element={<div className="animate-fade-in"><RFPManagement /></div>} />
          <Route path="/rfp/:rfpId" element={<div className="animate-fade-in"><RFPDetail /></div>} />
          <Route path="/applicant-tracking" element={<div className="animate-fade-in"><ApplicantTracking /></div>} />
          <Route path="/applicant/:applicantId" element={<div className="animate-fade-in"><ApplicantDetail /></div>} />
          <Route path="/documents" element={<div className="animate-fade-in"><DocumentCenter /></div>} />
          <Route path="/document-drafter" element={<div className="animate-fade-in"><GeneralDocumentDrafter /></div>} />
          <Route path="/document-drafter/generate" element={<div className="animate-fade-in"><GenerateDocumentDraft /></div>} />
          <Route path="/analytics" element={<div className="animate-fade-in"><Analytics /></div>} />
          <Route path="/admin" element={<div className="animate-fade-in"><AdminPanel /></div>} />
          <Route path="/workflow" element={<div className="animate-fade-in"><WorkflowViewer /></div>} />
          <Route path="/rfp-drafting" element={<div className="animate-fade-in"><RFPDrafting /></div>} />
          <Route path="/contract-management" element={<div className="animate-fade-in"><ContractManagement /></div>} />
          <Route path="/sla-management" element={<div className="animate-fade-in"><SLAManagement /></div>} />
          <Route path="/payment-budget" element={<div className="animate-fade-in"><PaymentBudget /></div>} />
          <Route path="/payment/:contractId" element={<div className="animate-fade-in"><PaymentPage /></div>} />
          <Route path="/settings" element={<div className="animate-fade-in"><Settings /></div>} />
          <Route path="/sustainable-procurement" element={<div className="animate-fade-in"><SustainableProcurement /></div>} />
          <Route path="/sustainable-procurement/create-survey" element={<div className="animate-fade-in"><CreateSurvey /></div>} />
          <Route path="/sustainable-procurement/criteria" element={<div className="animate-fade-in"><SustainabilityCriteria /></div>} />
          <Route path="/sustainable-procurement/scorecard/:vendorId" element={<div className="animate-fade-in"><VendorScorecard /></div>} />
          <Route path="/vendor-scorecard/:vendorId" element={<div className="animate-fade-in"><VendorScorecard /></div>} />
          <Route path="/create-survey" element={<div className="animate-fade-in"><CreateSurvey /></div>} />
          <Route path="/survey-preview" element={<div className="animate-fade-in"><SurveyPreview /></div>} />
          <Route path="/vendor-management" element={<div className="animate-fade-in"><VendorManagement /></div>} />
          <Route path="/vendor-profile/:vendorId" element={<div className="animate-fade-in"><VendorProfile /></div>} />
          <Route path="/operator-management" element={<div className="animate-fade-in"><OperatorManagement /></div>} />
          <Route path="/pr-checker" element={<div className="animate-fade-in"><PRChecker /></div>} />
          <Route path="/document-checker" element={<div className="animate-fade-in"><DocumentChecker /></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<div className="animate-fade-in"><NotFound /></div>} />
          <Route path="/ai-document-evaluation/comparative-statement" element={<ComparativeStatement />} />
          <Route path="/ai-document-evaluation/configurator" element={<ComparativeStatementConfigurator />} />
          <Route path="/contract-generation" element={<ContractGenerationPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
