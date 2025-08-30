import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Share2, Calendar, FileText, Users, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { RFP } from "@/pages/RFPManagement";
interface RFPMetadataPanelProps {
  rfp: RFP;
}
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Under Review':
      return 'bg-black text-white border-black';
    case 'Closed':
      return 'bg-gray-50 text-black border-black';
    case 'Cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-black border-black';
  }
};
const getWorkflowStepColor = (step: string) => {
  switch (step) {
    case 'Applicants Submitting':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'AI Scoring':
      return 'bg-black text-white border-black';
    case 'Human Review':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Completed':
      return 'bg-black text-white border-black';
    default:
      return 'bg-gray-50 text-black border-black';
  }
};
export const RFPMetadataPanel = ({
  rfp
}: RFPMetadataPanelProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "RFP Updated Successfully",
      description: "The RFP details have been updated."
    });
    setIsEditOpen(false);
  };
  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "RFP Shared Successfully",
      description: "The RFP has been shared with the selected recipients."
    });
    setIsShareOpen(false);
  };
  return <Card className="bg-white border rounded-[15px]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-black">
            {rfp.name}
          </CardTitle>
          <p className="text-lg text-black">{rfp.number}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 border-black text-black hover:bg-black hover:text-white">
                <Edit size={16} />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit RFP Details</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">RFP Name</Label>
                  <Input id="edit-name" defaultValue={rfp.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select defaultValue={rfp.category.toLowerCase().replace(' ', '-')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it-services">IT Services</SelectItem>
                      <SelectItem value="procurement">Procurement</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-closing">Closing Date</Label>
                  <Input id="edit-closing" type="date" defaultValue={rfp.closing_date} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={rfp.status.toLowerCase().replace(' ', '-')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="border-black text-black hover:bg-black hover:text-white">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 border-black text-black hover:bg-black hover:text-white">
                <Share2 size={16} />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Share RFP</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleShareSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="share-emails">Email Addresses</Label>
                  <Textarea id="share-emails" placeholder="Enter email addresses separated by commas" rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="share-message">Message (Optional)</Label>
                  <Textarea id="share-message" placeholder="Add a personal message" rows={2} />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsShareOpen(false)} className="border-black text-black hover:bg-black hover:text-white">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Share RFP</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-black">
              <FileText size={16} className="mr-2" />
              RFP Number
            </div>
            <div className="font-semibold text-black">{rfp.number}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-black">
              <Calendar size={16} className="mr-2" />
              Issue Date
            </div>
            <div className="font-semibold text-black">{rfp.issue_date}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-black">
              <Clock size={16} className="mr-2" />
              Closing Date
            </div>
            <div className="font-semibold text-black">{rfp.closing_date}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-black">
              <Users size={16} className="mr-2" />
              Total Applicants
            </div>
            <div className="font-semibold text-black">{rfp.total_applicants}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-black">Status:</span>
            <Badge variant="outline" className={`${getStatusColor(rfp.status)} font-medium`}>
              {rfp.status}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-black">Category:</span>
            <Badge variant="outline" className="bg-gray-50 text-black border-black font-medium">
              {rfp.category}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-black">Workflow Step:</span>
            <Badge variant="outline" className={`${getWorkflowStepColor(rfp.workflow_step)} font-medium`}>
              {rfp.workflow_step}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>;
};