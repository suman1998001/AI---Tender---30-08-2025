
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export const RFPEmptyState = () => {
  return (
    <div className="bg-white rounded-[15px] border-0 shadow-sm hover:shadow-md transition-shadow duration-300 p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No RFPs found
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        No RFPs found for this date range. Try adjusting filters or upload a new RFP to get started.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" className="hover:scale-105 transition-transform duration-200 border-gray-300 hover:border-red-muted hover:bg-red-accent-light hover:text-red-muted">
          Clear Filters
        </Button>
        <Button className="flex items-center gap-2 bg-red-muted hover:bg-red-accent text-white hover:scale-105 transition-all duration-200">
          <Plus size={16} />
          Create New RFP
        </Button>
      </div>
    </div>
  );
};
