import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Building2, User, Mail, Phone, FileText, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RFP } from "@/pages/RFPManagement";

interface RFPApplicationFormProps {
  rfp: RFP | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted: () => void;
}

interface ApplicationFormData {
  applicant_name: string;
  company_name: string;
  email: string;
  phone: string;
  application_number: string;
  qualification_status: boolean;
  ai_score: number | null;
  status: string;
  documents_submitted: boolean;
  workflow_step: string;
}

export const RFPApplicationForm = ({ rfp, isOpen, onClose, onApplicationSubmitted }: RFPApplicationFormProps) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    applicant_name: "",
    company_name: "",
    email: "",
    phone: "",
    application_number: "",
    qualification_status: false,
    ai_score: null,
    status: "submitted",
    documents_submitted: false,
    workflow_step: "Document Verification"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateApplicationNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `APP-${timestamp}-${random}`;
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rfp) return;

    // Validate required fields
    if (!formData.applicant_name.trim() || !formData.company_name.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate application number if not provided
      const applicationNumber = formData.application_number || generateApplicationNumber();
      
      // Prepare application data
      const applicationData = {
        rfp_id: rfp.id,
        applicant_name: formData.applicant_name.trim(),
        company_name: formData.company_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        application_number: applicationNumber,
        qualification_status: formData.qualification_status,
        ai_score: formData.ai_score,
        status: formData.status,
        documents_submitted: formData.documents_submitted,
        workflow_step: formData.workflow_step
      };

      // Save application to database
      const { data: application, error: applicationError } = await supabase
        .from('applicants')
        .insert([applicationData])
        .select()
        .single();

      if (applicationError) {
        console.error('Error saving application:', applicationError);
        toast({
          title: "Application Failed",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update RFP applicant count
      const { error: updateError } = await supabase
        .from('rfps')
        .update({ 
          total_applicants: (rfp.total_applicants || 0) + 1 
        })
        .eq('id', rfp.id);

      if (updateError) {
        console.error('Error updating RFP count:', updateError);
        // Don't fail the application if count update fails
      }

      toast({
        title: "Application Submitted Successfully",
        description: `Your application for "${rfp.name}" has been submitted. Application Number: ${applicationNumber}`
      });

      // Reset form
      setFormData({
        applicant_name: "",
        company_name: "",
        email: "",
        phone: "",
        application_number: "",
        qualification_status: false,
        ai_score: null,
        status: "submitted",
        documents_submitted: false,
        workflow_step: "Document Verification"
      });

      onApplicationSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        applicant_name: "",
        company_name: "",
        email: "",
        phone: "",
        application_number: "",
        qualification_status: false,
        ai_score: null,
        status: "submitted",
        documents_submitted: false,
        workflow_step: "Document Verification"
      });
      onClose();
    }
  };

  if (!rfp) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-red-accent" />
            Apply for RFP
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* RFP Information */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              RFP Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">RFP Name:</span>
                <p className="font-medium text-foreground">{rfp.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">RFP Number:</span>
                <p className="font-medium text-foreground">{rfp.number}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline" className="mt-1">{rfp.category}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="mt-1">{rfp.status}</Badge>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicant_name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Applicant Name *
                </Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_number" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Application Number
              </Label>
              <Input
                id="application_number"
                value={formData.application_number}
                onChange={(e) => handleInputChange('application_number', e.target.value)}
                placeholder="Will be auto-generated if left empty"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate, or provide your own reference number
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification_status">Qualification Status</Label>
                <Select 
                  value={formData.qualification_status ? "qualified" : "not_qualified"} 
                  onValueChange={(value) => handleInputChange('qualification_status', value === "qualified")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="not_qualified">Not Qualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents_submitted">Documents Submitted</Label>
                <Select 
                  value={formData.documents_submitted ? "yes" : "no"} 
                  onValueChange={(value) => handleInputChange('documents_submitted', value === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information or special requirements..."
                rows={3}
              />
            </div>
          </form>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-red-accent hover:bg-red-muted text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
