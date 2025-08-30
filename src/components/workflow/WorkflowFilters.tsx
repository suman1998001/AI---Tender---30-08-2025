
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter, RotateCcw } from "lucide-react";
import { useState } from "react";

export const WorkflowFilters = () => {
  const [filters, setFilters] = useState({
    dateRange: "last-30-days",
    category: "all-categories",
    aiModel: "all-models",
    reviewer: "all-reviewers"
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: "last-30-days",
      category: "all-categories",
      aiModel: "all-models",
      reviewer: "all-reviewers"
    });
  };

  return (
    <Card className="rounded-[15px] border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-black">
          <Filter size={20} />
          Workflow Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Date Range</label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <SelectTrigger className="w-48">
                <CalendarDays size={16} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">RFP Category</label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="it-services">IT Services</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="legal">Legal Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">AI Model Version</label>
            <Select 
              value={filters.aiModel} 
              onValueChange={(value) => handleFilterChange('aiModel', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-models">All Models</SelectItem>
                <SelectItem value="MSTRL-turbo">MSTRL</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Reviewer</label>
            <Select 
              value={filters.reviewer} 
              onValueChange={(value) => handleFilterChange('reviewer', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Reviewers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-reviewers">All Reviewers</SelectItem>
                <SelectItem value="rajesh-kumar">Rajesh Kumar</SelectItem>
                <SelectItem value="priya-sharma">Priya Sharma</SelectItem>
                <SelectItem value="amit-singh">Amit Singh</SelectItem>
                <SelectItem value="neha-gupta">Neha Gupta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
