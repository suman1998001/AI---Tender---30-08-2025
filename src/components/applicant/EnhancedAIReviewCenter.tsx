
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, CheckCircle, AlertTriangle, TrendingUp, FileText, Award, Target, Zap, ThumbsUp, ThumbsDown, MessageSquare, Save, RefreshCw } from "lucide-react";
import { AITooltip } from "@/components/ui/ai-tooltip";
import { toast } from "@/hooks/use-toast";
import type { Applicant } from "@/pages/ApplicantTracking";

interface EnhancedAIReviewCenterProps {
  applicant: Applicant;
}

export const EnhancedAIReviewCenter = ({
  applicant
}: EnhancedAIReviewCenterProps) => {
  const [selectedCriteria, setSelectedCriteria] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  const aiAnalysis = {
    overallScore: applicant.aiScore,
    recommendation: applicant.qualified ? "Recommend for further review" : "Does not meet minimum requirements",
    confidence: 87,
    riskLevel: "Low",
    processingTime: "2.3 minutes"
  };

  const criteriaEvaluation = [{
    id: "technical",
    name: "Technical Capability",
    score: 92,
    weight: 25,
    status: "excellent",
    details: "Strong technical expertise demonstrated across all required areas.",
    icon: Zap
  }, {
    id: "financial",
    name: "Financial Stability",
    score: 88,
    weight: 20,
    status: "good",
    details: "Solid financial position with adequate resources for project execution.",
    icon: TrendingUp
  }, {
    id: "experience",
    name: "Relevant Experience",
    score: 85,
    weight: 25,
    status: "good",
    details: "Extensive experience in similar projects with proven track record.",
    icon: Award
  }, {
    id: "compliance",
    name: "Compliance & Legal",
    score: 94,
    weight: 15,
    status: "excellent",
    details: "All required certifications and legal requirements met.",
    icon: CheckCircle
  }, {
    id: "timeline",
    name: "Timeline Feasibility",
    score: 79,
    weight: 10,
    status: "satisfactory",
    details: "Proposed timeline is achievable but may require close monitoring.",
    icon: Target
  }, {
    id: "innovation",
    name: "Innovation & Approach",
    score: 81,
    weight: 5,
    status: "good",
    details: "Innovative approach with practical implementation strategy.",
    icon: Brain
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-white text-black border-green-200";
      case "good":
        return "bg-white text-black border-blue-200";
      case "satisfactory":
        return "bg-red-accent/10 text-red-accent border-yellow-200";
      case "poor":
        return "bg-red-accent text-white border-red-accent";
      default:
        return "bg-white text-black border-gray-200";
    }
  };

  const handleApprove = () => {
    toast({
      title: "Application Approved",
      description: "The application has been marked as approved and moved to the next stage.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  const handleReject = () => {
    toast({
      title: "Application Rejected",
      description: "The application has been rejected and applicant will be notified.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  const handleSaveReview = () => {
    toast({
      title: "Review Saved",
      description: "Your review comments have been saved successfully.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  const handleReanalyze = () => {
    toast({
      title: "Re-analysis Started",
      description: "AI is re-analyzing the application with updated parameters...",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-black shadow-lg"
    });
  };

  return <div className="space-y-[15px]">
      {/* Weighted Criteria Evaluation - 3x3 Grid Layout */}
      <Card className="bg-white rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Target size={20} />
            Weighted Criteria Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criteriaEvaluation.map(criteria => {
              const Icon = criteria.icon;
              const getTooltipContent = (criteriaId: string) => {
                switch (criteriaId) {
                  case "technical":
                    return "AI analyzed technical capability from Section 3 'Technical Approach' and annexure documents. Scoring based on methodology clarity, team expertise, and technology stack alignment.";
                  case "financial":
                    return "Financial stability assessed from audited statements and turnover data. AI extracted revenue figures (₹45.2Cr), profit margins (12.5%), and debt ratios from pages 15-18.";
                  case "experience":
                    return "Experience evaluation from project portfolio and case studies. AI identified 12+ similar projects, analyzed success rates, and client testimonials from Section 5.";
                  case "compliance":
                    return "Compliance check validated ISO certifications, tax registrations, and legal clearances. All documents verified against tender requirements with 99.2% accuracy.";
                  case "timeline":
                    return "Timeline feasibility analyzed from project plan and resource allocation. AI compared proposed 18-month schedule with historical project data and resource constraints.";
                  case "innovation":
                    return "Innovation score derived from unique methodologies and value-added services proposed. AI evaluated technical innovations and process improvements from Section 6.";
                  default:
                    return "AI scoring based on document analysis and criteria evaluation. Confidence varies by data quality and completeness.";
                }
              };

              return (
                <AITooltip
                  key={criteria.id}
                  content={getTooltipContent(criteria.id)}
                  type="scoring"
                  confidence={criteria.id === "compliance" ? 99 : criteria.id === "technical" ? 94 : 89}
                  source={`AI Scoring Engine v3.0 - ${criteria.name} Module`}
                >
                  <Card className="border-2 hover:border-blue-200 transition-colors cursor-pointer rounded-[15px]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon size={20} className="text-red-accent" />
                          <Badge variant="outline" className={`${getStatusColor(criteria.status)} font-medium text-xs`}>
                            {criteria.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-black">{criteria.score}</div>
                          <div className="text-xs text-black">Weight: {criteria.weight}%</div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-black mb-2">{criteria.name}</h4>
                      <Progress value={criteria.score} className="mb-3" />
                      <p className="text-sm text-black">{criteria.details}</p>
                    </CardContent>
                  </Card>
                </AITooltip>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Human Review Section */}
      <Card className="bg-white rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <MessageSquare size={20} />
            Human Review & Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Review Comments
            </label>
            <Textarea placeholder="Add your review comments, observations, or recommendations..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4} className="text-black" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Decision Status
            </label>
            <Select>
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Select decision status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="request-more-info">Request More Information</SelectItem>
                <SelectItem value="escalate">Escalate for Senior Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveReview} variant="outline" className="text-black border-gray-200 hover:bg-red-accent/10">
                <Save size={16} className="mr-2" />
                Save Review
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleReject} variant="outline" className="text-red-accent border-red-accent hover:bg-red-accent/10">
                <ThumbsDown size={16} className="mr-2" />
                Reject
              </Button>
              <Button onClick={handleApprove} className="bg-black text-white hover:bg-red-accent">
                <ThumbsUp size={16} className="mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
