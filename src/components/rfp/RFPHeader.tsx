
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RFPHeaderProps {
  onCreateRFP: () => void;
  onBulkUpload: () => void;
}

const RFPHeader = ({ onCreateRFP, onBulkUpload }: RFPHeaderProps) => {
  const [isNewRFPOpen, setIsNewRFPOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const handleNewRFPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRFP();
    setIsNewRFPOpen(false);
  };

  const handleBulkUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBulkUpload();
    setIsBulkUploadOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-4 flex-1">
        <h2 className="text-2xl font-bold text-gray-900">RFP & Tender Management</h2>
        <div className="relative max-w-md">
          
          
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Dialog open={isNewRFPOpen} onOpenChange={setIsNewRFPOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={16} className="mr-2" />
              New RFP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New RFP</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewRFPSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rfp-name">RFP Name</Label>
                <Input id="rfp-name" placeholder="Enter RFP name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rfp-number">RFP Number</Label>
                <Input id="rfp-number" placeholder="RFP-2024-XXX" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it-services">IT Services</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="closing-date">Closing Date</Label>
                <Input id="closing-date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter RFP description" rows={3} />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsNewRFPOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create RFP
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Upload size={16} className="mr-2" />
              Bulk Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Bulk Upload RFPs</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload CSV/Excel File</Label>
                <Input id="file-upload" type="file" accept=".csv,.xlsx,.xls" required />
                <p className="text-sm text-gray-500">
                  Upload a CSV or Excel file with RFP data
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Download Template</Label>
                <Button type="button" variant="outline" size="sm" className="w-full">
                  Download Sample Template
                </Button>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsBulkUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Upload RFPs
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export { RFPHeader };
