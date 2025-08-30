
import { Button } from "@/components/ui/button";
import { Users, Filter } from "lucide-react";

export const ApplicantEmptyState = () => {
  return (
    <div className="bg-white rounded-[15px] border-0 shadow-sm hover:shadow-md transition-shadow duration-300 p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Users size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No applicants found
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        No applicants match your current filters. Try adjusting your search criteria or date range to see more results.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
          <Filter size={16} />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};
