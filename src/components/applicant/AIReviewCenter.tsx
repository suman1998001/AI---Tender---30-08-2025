
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Save,
  FileText,
  BarChart3,
  Scan
} from "lucide-react";
import type { Applicant } from "@/pages/ApplicantTracking";

interface AIReviewCenterProps {
  applicant: Applicant;
}

// Pre-extraction identified sections
const identifiedSections = [
  { 
    id: 'compliance', 
    name: 'Compliance Documentation', 
    confidence: 94, 
    documentsFound: 6,
    status: 'complete',
    extractedData: ['ISO 27001 Certificate', 'GDPR Compliance Statement', 'Security Audit Report']
  },
  { 
    id: 'technical', 
    name: 'Technical Specifications', 
    confidence: 89, 
    documentsFound: 12,
    status: 'complete',
    extractedData: ['System Architecture', 'Performance Metrics', 'Integration Capabilities']
  },
  { 
    id: 'financial', 
    name: 'Financial Proposal', 
    confidence: 97, 
    documentsFound: 4,
    status: 'complete',
    extractedData: ['Cost Breakdown', 'Payment Terms', 'Financial Statements']
  }
];

// Weighted criteria evaluation model
const evaluationCriteria = [
  { 
    name: 'Technical Competency', 
    aiScore: 85, 
    humanScore: null, 
    weight: 30, 
    rationale: 'Strong technical documentation and proven experience in cloud infrastructure.',
    extractedEvidence: ['5+ years cloud experience', 'AWS/Azure certifications', 'Similar project portfolio']
  },
  { 
    name: 'Financial Stability', 
    aiScore: 92, 
    humanScore: 88, 
    weight: 25, 
    rationale: 'Excellent financial records and credit rating.',
    extractedEvidence: ['Annual revenue ₹500Cr+', 'Credit rating A+', 'Stable cash flow']
  },
  { 
    name: 'Compliance Standards', 
    aiScore: 78, 
    humanScore: null, 
    weight: 20, 
    rationale: 'Minor gaps in compliance documentation requiring human review.',
    extractedEvidence: ['ISO 27001 valid', 'GDPR compliant', 'Missing SOC2 Type II']
  },
  { 
    name: 'Innovation Capability', 
    aiScore: 89, 
    humanScore: null, 
    weight: 15, 
    rationale: 'Demonstrated innovative solutions and R&D investment.',
    extractedEvidence: ['R&D budget 15% of revenue', 'Patent portfolio', 'Innovation awards']
  },
  { 
    name: 'Project Experience', 
    aiScore: 94, 
    humanScore: null, 
    weight: 10, 
    rationale: 'Extensive relevant project portfolio and client testimonials.',
    extractedEvidence: ['20+ similar projects', '95% client satisfaction', 'Fortune 500 clients']
  }
];

const ethicsAlerts = [
  { type: 'bias', message: 'No bias indicators detected in evaluation process', status: 'clear' },
  { type: 'pii', message: 'Personal information properly masked in evaluation', status: 'clear' },
  { type: 'blocked-terms', message: 'No blocked terms found in documents', status: 'clear' }
];

// AI Processing Stats
const aiProcessingStats = {
  preExtractionModel: "MSTRL",
  evaluationModel: "Default",
  totalTokensUsed: 45780,
  preExtractionTokens: 12450,
  evaluationTokens: 33330,
  processingTime: "8.7s",
  confidenceScore: 91
};

export const AIReviewCenter = ({ applicant }: AIReviewCenterProps) => {
  const [comments, setComments] = useState('');
  const [scores, setScores] = useState<Record<string, number | null>>({});

  const handleScoreChange = (criteriaName: string, score: number) => {
    setScores(prev => ({ ...prev, [criteriaName]: score }));
  };

  const handleSaveReview = () => {
    console.log('Saving review with scores:', scores, 'comments:', comments);
    // In real app, this would save to API
  };

  const getOverallScore = () => {
    const totalWeight = evaluationCriteria.reduce((sum, criteria) => sum + criteria.weight, 0);
    const weightedScore = evaluationCriteria.reduce((sum, criteria) => {
      const score = scores[criteria.name] || criteria.aiScore;
      return sum + (score * criteria.weight);
    }, 0);
    return Math.round(weightedScore / totalWeight);
  };

  return (
    <div className="space-y-6">
      {/* Pre-Extraction Results */}
      <Card className="bg-white rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Scan size={20} />
            Pre-Extraction Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {identifiedSections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{section.name}</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {section.confidence}% confidence
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {section.documentsFound} documents found
                  </p>
                  <div className="space-y-1">
                    {section.extractedData.map((data, index) => (
                      <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                        {data}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={16} className="text-blue-600" />
              <span className="font-medium text-blue-900">AI Processing Summary</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Pre-extraction Model</div>
                <div className="font-medium">{aiProcessingStats.preExtractionModel}</div>
              </div>
              <div>
                <div className="text-gray-600">Evaluation Model</div>
                <div className="font-medium">{aiProcessingStats.evaluationModel}</div>
              </div>
              <div>
                <div className="text-gray-600">Processing Time</div>
                <div className="font-medium">{aiProcessingStats.processingTime}</div>
              </div>
              <div>
                <div className="text-gray-600">Overall Confidence</div>
                <div className="font-medium text-green-600">{aiProcessingStats.confidenceScore}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ethics Guardrails */}
      <Card className="bg-white rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Shield size={20} />
            Ethics Guardrails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ethicsAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <div className="font-medium text-green-800 capitalize">{alert.type.replace('-', ' ')}</div>
                  <div className="text-sm text-green-700">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Populated Evaluation Tables */}
      <Card className="bg-white rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <BarChart3 size={20} />
            Weighted Criteria Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evaluationCriteria.map((criteria) => (
              <div key={criteria.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                    <p className="text-sm text-gray-600">Weight: {criteria.weight}%</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    AI Score: {criteria.aiScore}%
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <Progress value={criteria.aiScore} className="h-2 mb-2" />
                  <p className="text-sm text-gray-700 mb-2">{criteria.rationale}</p>
                  
                  {/* Extracted Evidence */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">Extracted Evidence:</div>
                    <div className="flex flex-wrap gap-1">
                      {criteria.extractedEvidence.map((evidence, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {evidence}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Human Override:</label>
                  <div className="flex items-center gap-2">
                    {[60, 70, 80, 90, 100].map(score => (
                      <button
                        key={score}
                        onClick={() => handleScoreChange(criteria.name, score)}
                        className={`px-3 py-1 rounded text-sm ${
                          scores[criteria.name] === score
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {score}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Overall Score</h4>
                <div className="text-2xl font-bold text-blue-600">{getOverallScore()}%</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviewer Comments
                  </label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add your review comments here..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button onClick={handleSaveReview} className="flex items-center gap-2">
                  <Save size={16} />
                  Save & Submit Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
