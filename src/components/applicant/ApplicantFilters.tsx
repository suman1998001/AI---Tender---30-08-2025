
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, X, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ApplicantFiltersProps {
  onFilter: (filters: any) => void;
  onClearAllFilters: () => void;
  currentFilters: any;
  onExport: () => void;
  onBulkAction: (action: string) => void;
}

export const ApplicantFilters = ({ 
  onFilter, 
  onClearAllFilters, 
  currentFilters, 
  onExport, 
  onBulkAction 
}: ApplicantFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter({ ...currentFilters, search: value });
  };

  const handleQualifiedChange = (value: string) => {
    onFilter({ ...currentFilters, qualified: value });
  };

  const handleStatusChange = (value: string) => {
    onFilter({ ...currentFilters, status: value });
  };

  const handleRFPChange = (value: string) => {
    onFilter({ ...currentFilters, rfp: value });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.search) count++;
    if (currentFilters.qualified !== 'all') count++;
    if (currentFilters.status !== 'all') count++;
    if (currentFilters.rfp !== 'all') count++;
    return count;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 focus:border-red-accent focus:ring-red-accent"
            />
          </div>

          <Select value={currentFilters.qualified} onValueChange={handleQualifiedChange}>
            <SelectTrigger className="focus:border-red-accent focus:ring-red-accent">
              <SelectValue placeholder="Qualification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualifications</SelectItem>
              <SelectItem value="yes">Qualified</SelectItem>
              <SelectItem value="no">Not Qualified</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currentFilters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="focus:border-red-accent focus:ring-red-accent">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Needs Human Review">Needs Human Review</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currentFilters.rfp} onValueChange={handleRFPChange}>
            <SelectTrigger className="focus:border-red-accent focus:ring-red-accent">
              <SelectValue placeholder="RFP Filter" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">All RFPs</SelectItem>
              <SelectItem value="MeitY/RFP/2024/001">Digital India Services</SelectItem>
              <SelectItem value="GOM/PWD/2024/002">Office Stationery Supply</SelectItem>
              <SelectItem value="RBI/CISA/2024/003">Cyber Security Audit</SelectItem>
              <SelectItem value="PMC/SC/2024/004">Smart City Infrastructure</SelectItem>
              <SelectItem value="AIIMS/HMS/2024/005">Healthcare Management System</SelectItem>
              <SelectItem value="RFP-2024-006">Facility Management Services Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onExport}
            className="hover:bg-red-accent/10 hover:border-red-accent"
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hover:bg-red-accent/10 hover:border-red-accent">
                <MoreHorizontal size={16} className="mr-2" />
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => onBulkAction('Approve Selected')}
                className="hover:bg-red-accent/10"
              >
                Approve Selected
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onBulkAction('Reject Selected')}
                className="hover:bg-red-accent/10"
              >
                Reject Selected
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onBulkAction('Flag for Review')}
                className="hover:bg-red-accent/10"
              >
                Flag for Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm font-medium">Active Filters:</span>
          {currentFilters.search && (
            <Badge variant="outline">
              Search: "{currentFilters.search}"
            </Badge>
          )}
          {currentFilters.qualified !== 'all' && (
            <Badge variant="outline">
              {currentFilters.qualified === 'yes' ? 'Qualified' : 'Not Qualified'}
            </Badge>
          )}
          {currentFilters.status !== 'all' && (
            <Badge variant="outline">
              Status: {currentFilters.status}
            </Badge>
          )}
          {currentFilters.rfp !== 'all' && (
            <Badge variant="outline">
              RFP: {currentFilters.rfp}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllFilters}
            className="h-6 px-2 text-red-accent hover:text-primary-foreground hover:bg-red-accent"
          >
            <X size={14} className="mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
