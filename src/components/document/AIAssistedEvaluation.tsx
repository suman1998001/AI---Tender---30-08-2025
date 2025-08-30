
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  Zap,
  IndianRupee,
  Upload,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentSection {
  id: string;
  name: string;
  type: 'compliance' | 'technical' | 'financial';
  content: string;
  confidence: number;
  status: 'identified' | 'processing' | 'completed';
}

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  category: string;
}

interface AIAssistedEvaluationProps {
  onEvaluationComplete?: (results: any) => void;
}

export const AIAssistedEvaluation = ({ onEvaluationComplete }: AIAssistedEvaluationProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'extraction' | 'evaluation' | 'completed'>('upload');
  const [extractedSections, setExtractedSections] = useState<DocumentSection[]>([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  // Mock AI stats
  const aiStats = {
    modelName: "MSTRL",
    modelVersion: "2024.1.15",
    tokenUsage: 8945,
    energyConsumption: "0.018 kWh",
    tokenBalance: 91256,
    processingTime: "3.2s"
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      startAIProcessing(file);
    }
  };

  const startAIProcessing = async (file: File) => {
    setIsProcessing(true);
    setCurrentStep('extraction');

    // Simulate AI processing
    setTimeout(() => {
      // Mock extracted sections
      const mockSections: DocumentSection[] = [
        {
          id: '1',
          name: 'Compliance Requirements',
          type: 'compliance',
          content: 'ISO 27001 certification, GDPR compliance measures, regulatory frameworks...',
          confidence: 92,
          status: 'completed'
        },
        {
          id: '2',
          name: 'Technical Specifications',
          type: 'technical',
          content: 'Cloud infrastructure, API specifications, security protocols...',
          confidence: 88,
          status: 'completed'
        },
        {
          id: '3',
          name: 'Financial Proposal',
          type: 'financial',
          content: 'Budget breakdown, cost analysis, ROI projections...',
          confidence: 95,
          status: 'completed'
        }
      ];

      setExtractedSections(mockSections);
      setCurrentStep('evaluation');

      setTimeout(() => {
        // Mock evaluation criteria
        const mockCriteria: EvaluationCriteria[] = [
          { id: '1', name: 'Technical Feasibility', weight: 30, score: 85, maxScore: 100, category: 'Technical' },
          { id: '2', name: 'Compliance Adherence', weight: 25, score: 92, maxScore: 100, category: 'Compliance' },
          { id: '3', name: 'Cost Effectiveness', weight: 20, score: 78, maxScore: 100, category: 'Financial' },
          { id: '4', name: 'Implementation Timeline', weight: 15, score: 88, maxScore: 100, category: 'Technical' },
          { id: '5', name: 'Security Standards', weight: 10, score: 94, maxScore: 100, category: 'Compliance' }
        ];

        setEvaluationCriteria(mockCriteria);
        
        // Calculate weighted score
        const weightedScore = mockCriteria.reduce((acc, criteria) => {
          return acc + (criteria.score * criteria.weight / 100);
        }, 0);
        
        setOverallScore(Math.round(weightedScore));
        setCurrentStep('completed');
        setIsProcessing(false);

        toast({
          title: "AI Evaluation Complete!",
          description: `Document analyzed with ${weightedScore.toFixed(1)}% overall score`,
          className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
        });

        if (onEvaluationComplete) {
          onEvaluationComplete({ sections: mockSections, criteria: mockCriteria, score: weightedScore });
        }
      }, 2000);
    }, 1500);
  };

  const getSectionIcon = (type: DocumentSection['type']) => {
    switch (type) {
      case 'compliance': return CheckCircle;
      case 'technical': return BarChart3;
      case 'financial': return IndianRupee;
      default: return FileText;
    }
  };

  const getSectionColor = (type: DocumentSection['type']) => {
    switch (type) {
      case 'compliance': return 'bg-green-50 border-green-200 text-green-800';
      case 'technical': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'financial': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-[15px]">
      {/* Upload Section */}
      {currentStep === 'upload' && (
        <Card className="rounded-[15px] border border-gray-200">
          <CardHeader className="rounded-t-[15px]">
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Upload Document for AI Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-b-[15px]">
            <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-8 text-center">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Upload a document to begin AI-assisted evaluation
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
              />
              <label htmlFor="document-upload">
                <Button className="rounded-[15px]" asChild>
                  <span>Choose Document</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Steps */}
      {(currentStep !== 'upload') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
          {/* Pre-Extraction Results */}
          <Card className="rounded-[15px] border border-cyan-200">
            <CardHeader className="rounded-t-[15px]">
              <CardTitle className="flex items-center gap-2 text-cyan-900">
                <Brain size={20} />
                Pre-Extraction Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="rounded-b-[15px]">
              {uploadedFile && (
                <div className="mb-4 p-3 bg-cyan-50 rounded-[15px] border border-cyan-200">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-900">{uploadedFile.name}</span>
                  </div>
                  <p className="text-xs text-cyan-700 mt-1">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {extractedSections.map((section) => {
                  const Icon = getSectionIcon(section.type);
                  return (
                    <div key={section.id} className={`p-3 rounded-[15px] border ${getSectionColor(section.type)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} />
                        <span className="font-medium text-sm">{section.name}</span>
                        {section.status === 'completed' && (
                          <Badge variant="outline" className="text-xs rounded-[15px]">
                            {section.confidence}% confidence
                          </Badge>
                        )}
                      </div>
                      {section.status === 'completed' ? (
                        <p className="text-xs opacity-75 line-clamp-2">{section.content}</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"></div>
                          <span className="text-xs">Processing...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Results */}
          <Card className="rounded-[15px] border border-green-200">
            <CardHeader className="rounded-t-[15px]">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Target size={20} />
                Preliminary Scoring
              </CardTitle>
            </CardHeader>
            <CardContent className="rounded-b-[15px]">
              {currentStep === 'completed' && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-[15px] border border-green-200">
                    <div className="text-3xl font-bold text-green-900 mb-1">{overallScore}%</div>
                    <p className="text-sm text-green-700">Overall Score</p>
                  </div>

                  <div className="space-y-3">
                    {evaluationCriteria.map((criteria) => (
                      <div key={criteria.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{criteria.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs rounded-[15px]">
                              {criteria.weight}%
                            </Badge>
                            <span className="text-sm font-semibold">{criteria.score}/{criteria.maxScore}</span>
                          </div>
                        </div>
                        <Progress value={criteria.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep !== 'completed' && (
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Evaluating document...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Stats Panel */}
          <Card className="rounded-[15px] border border-purple-200">
            <CardHeader className="rounded-t-[15px]">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Brain size={20} />
                AI Processing Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="rounded-b-[15px]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Brain size={16} />
                    Model Information
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{aiStats.modelName}</p>
                    <p className="text-sm text-gray-600">Version {aiStats.modelVersion}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-[15px]">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Tokens Used</span>
                    </div>
                    <span className="font-semibold text-gray-900">{aiStats.tokenUsage.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-[15px]">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Energy</span>
                    </div>
                    <span className="font-semibold text-gray-900">{aiStats.energyConsumption}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-[15px]">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Token Balance</span>
                    </div>
                    <span className="font-semibold text-green-600">{aiStats.tokenBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart Views */}
      {currentStep === 'completed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px]">
          <Card className="rounded-[15px] border border-gray-200">
            <CardHeader className="rounded-t-[15px]">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Evaluation Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="rounded-b-[15px]">
              <div className="space-y-3">
                {evaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="flex items-center justify-between p-3 border rounded-[15px]">
                    <div>
                      <p className="font-medium text-sm">{criteria.name}</p>
                      <p className="text-xs text-gray-500">{criteria.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{criteria.score}%</p>
                      <p className="text-xs text-gray-500">Weight: {criteria.weight}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[15px] border border-gray-200">
            <CardHeader className="rounded-t-[15px]">
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} />
                Section Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="rounded-b-[15px]">
              <div className="space-y-3">
                {extractedSections.map((section) => {
                  const Icon = getSectionIcon(section.type);
                  return (
                    <div key={section.id} className="flex items-center justify-between p-3 border rounded-[15px]">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{section.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{section.type}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-[15px]">
                        {section.confidence}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
