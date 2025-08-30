import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";
import type { Applicant } from "@/pages/ApplicantTracking";

interface BidderComparisonToolProps {
  applicants: Applicant[];
}

export const BidderComparisonTool = ({ applicants }: BidderComparisonToolProps) => {
  const [selectedBidders, setSelectedBidders] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleBidderSelection = (bidderId: string, checked: boolean) => {
    if (checked) {
      setSelectedBidders([...selectedBidders, bidderId]);
    } else {
      setSelectedBidders(selectedBidders.filter(id => id !== bidderId));
    }
  };

  const getComparisonData = () => {
    return selectedBidders.map(id => applicants.find(a => a.id === id)!);
  };

  const criteriaRows = [
    { name: "Company Name", key: "applicantName" },
    { name: "MSME Status", key: "msme", getValue: () => Math.random() > 0.5 },
    { name: "Turnover Qualification", key: "turnover", getValue: () => Math.floor(Math.random() * 100) },
    { name: "Similar Work Qualification", key: "similarWork", getValue: () => Math.floor(Math.random() * 100) },
    { name: "Document Qualification", key: "documents", getValue: () => Math.random() > 0.7 },
    { name: "AI Score", key: "aiScore" },
    { name: "Overall Status", key: "status" }
  ];

  const renderCellValue = (applicant: Applicant, criteria: any) => {
    switch (criteria.key) {
      case "applicantName":
        return applicant.applicantName;
      case "msme":
        const isMSME = criteria.getValue();
        return (
          <Badge variant={isMSME ? "default" : "secondary"}>
            {isMSME ? "Yes" : "No"}
          </Badge>
        );
      case "turnover":
      case "similarWork":
        const score = criteria.getValue();
        return (
          <div className="flex items-center gap-2">
            <Progress value={score} className="w-16 h-2" />
            <span className="text-sm">{score}%</span>
          </div>
        );
      case "documents":
        const isComplete = criteria.getValue();
        return isComplete ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        );
      case "aiScore":
        return (
          <Badge variant="outline" className="font-mono">
            {applicant.aiScore}
          </Badge>
        );
      case "status":
        return (
          <Badge variant={applicant.status === "Under Review" ? "secondary" : "default"}>
            {applicant.status}
          </Badge>
        );
      default:
        return "-";
    }
  };

  return (
    <Card className="rounded-[15px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-red-accent-light/30 to-red-muted/20 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          <div className="bg-red-muted p-2 rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          Comparative Bidder Analysis
          <div className="ml-auto text-sm bg-red-accent text-red-muted-foreground px-3 py-1 rounded-full">
            Interactive Tool
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-muted rounded-full"></div>
              Select Bidders to Compare
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="group">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-red-accent hover:shadow-sm transition-all duration-200">
                    <Checkbox
                      id={applicant.id}
                      checked={selectedBidders.includes(applicant.id)}
                      onCheckedChange={(checked) => 
                        handleBidderSelection(applicant.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-red-muted data-[state=checked]:border-red-muted"
                    />
                    <label
                      htmlFor={applicant.id}
                      className="flex-1 text-sm font-medium cursor-pointer text-gray-700 group-hover:text-red-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{applicant.applicantName}</span>
                        <Badge variant="outline" className="ml-2 bg-red-accent-light text-red-muted border-red-accent">
                          Score: {applicant.aiScore}
                        </Badge>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {selectedBidders.length} of {applicants.length} bidders selected
            </div>
            <Button
              onClick={() => setShowComparison(true)}
              disabled={selectedBidders.length < 2}
              className="bg-gradient-to-r from-red-muted to-red-accent hover:from-red-accent hover:to-red-muted text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare Selected Bidders ({selectedBidders.length})
            </Button>
          </div>

          {showComparison && selectedBidders.length >= 2 && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-red-accent-light/30 to-red-muted/20 rounded-xl p-4 mb-4 border border-red-accent">
                <h5 className="font-semibold text-red-muted mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Comparison Results
                </h5>
                <p className="text-sm text-red-muted">
                  Detailed side-by-side analysis of {selectedBidders.length} selected bidders across all evaluation criteria.
                </p>
              </div>
              
              <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 min-w-[200px]">
                        Evaluation Criteria
                      </th>
                      {getComparisonData().map((applicant, index) => (
                        <th key={applicant.id} className={`border-b border-gray-200 p-4 text-center font-semibold text-gray-700 min-w-[180px] ${
                          index % 2 === 0 ? 'bg-red-accent-light/20' : 'bg-red-muted/10'
                        }`}>
                          <div className="space-y-1">
                            <div className="text-sm font-bold">{applicant.applicantName}</div>
                            <Badge variant="outline" className="text-xs">
                              ID: {applicant.applicantId}
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteriaRows.map((criteria, index) => (
                      <tr key={criteria.key} className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}>
                        <td className="border-b border-gray-100 p-4 font-semibold text-gray-800 bg-gray-50 sticky left-0">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-red-muted rounded-full"></div>
                            {criteria.name}
                          </div>
                        </td>
                        {getComparisonData().map((applicant, colIndex) => (
                          <td key={applicant.id} className={`border-b border-gray-100 p-4 text-center ${
                            colIndex % 2 === 0 ? 'bg-red-accent-light/10' : 'bg-red-muted/5'
                          }`}>
                            <div className="flex justify-center">
                              {renderCellValue(applicant, criteria)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};