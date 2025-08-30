import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Dialog imports removed - using separate preview page
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  Send, 
  Eye, 
  Trash2, 
  Edit3,
  Radio,
  Square,
  CheckSquare,
  Type,
  ToggleLeft,
  Brain,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Star,
  Download,
  Share2,
  Settings,
  Target,
  FileText
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  type: "input" | "checkbox" | "radio" | "yesno" | "rating";
  text: string;
  options?: string[];
  score?: number; // Made optional
  weight: number;
  category: string;
}

interface SurveyDetails {
  name: string;
  type: string;
  description: string;
  instructions: string;
  surveyFor: string;
  startDate?: Date;
  endDate?: Date;
}

const CreateSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get survey details from navigation state
  const surveyDetails = location.state?.surveyDetails as SurveyDetails;
  const existingQuestions = location.state?.existingQuestions as Question[];
  const isEditing = location.state?.isEditing as boolean;
  
  // State management
  const [questions, setQuestions] = useState<Question[]>(existingQuestions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "input",
    text: "",
    options: [],
    score: 10,
    weight: 1,
    category: "Environmental"
  });
  
  // Remove showPreview state as we'll navigate to a separate page
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  // Question categories for organization
  const questionCategories = [
    "Environmental",
    "Social", 
    "Governance",
    "Economic",
    "Operations",
    "Risk Management"
  ];

  // AI-powered question suggestions based on survey type
  const getAISuggestions = (surveyType: string): Question[] => {
    const commonQuestions: Question[] = [
      {
        id: `ai-${Date.now()}-1`,
        type: "radio" as const,
        text: "What percentage of your energy consumption comes from renewable sources?",
        options: ["0-25%", "26-50%", "51-75%", "76-100%"],
        score: 25,
        weight: 2,
        category: "Environmental"
      },
      {
        id: `ai-${Date.now()}-2`,
        type: "yesno" as const,
        text: "Does your organization have a formal carbon reduction target?",
        options: ["Yes", "No"],
        score: 20,
        weight: 1,
        category: "Environmental"
      },
      {
        id: `ai-${Date.now()}-3`,
        type: "checkbox" as const,
        text: "Which environmental certifications does your organization hold?",
        options: ["ISO 14001", "LEED", "Energy Star", "Carbon Trust", "Other"],
        score: 15,
        weight: 1,
        category: "Environmental"
      },
      {
        id: `ai-${Date.now()}-4`,
        type: "input" as const,
        text: "Please provide any additional comments about your sustainability efforts",
        // Optional question - no score
        weight: 1,
        category: "Environmental"
      },
      {
        id: `ai-${Date.now()}-5`,
        type: "rating" as const,
        text: "Rate your organization's commitment to diversity and inclusion initiatives",
        options: ["1", "2", "3", "4", "5"],
        score: 20,
        weight: 1,
        category: "Social"
      },
      {
        id: `ai-${Date.now()}-6`,
        type: "radio" as const,
        text: "How frequently does your board review ESG performance?",
        options: ["Monthly", "Quarterly", "Annually", "As needed", "Never"],
        score: 15,
        weight: 1,
        category: "Governance"
      }
    ];

    const suggestions: Record<string, Question[]> = {
      "Environmental Impact Assessment": [
        ...commonQuestions,
        {
          id: `ai-${Date.now()}-6`,
          type: "input" as const,
          text: "What is your organization's annual water consumption (in cubic meters)?",
          score: 15,
          weight: 2,
          category: "Environmental"
        },
        {
          id: `ai-${Date.now()}-7`,
          type: "checkbox" as const,
          text: "Which waste reduction initiatives has your organization implemented?",
          options: ["Recycling program", "Zero waste policy", "Composting", "Material reduction", "Circular economy practices"],
          score: 18,
          weight: 2,
          category: "Environmental"
        }
      ],
      "ESG Due Diligence": [
        ...commonQuestions,
        {
          id: `ai-${Date.now()}-6`,
          type: "yesno" as const,
          text: "Do you have a dedicated sustainability officer or team?",
          options: ["Yes", "No"],
          score: 15,
          weight: 2,
          category: "Governance"
        },
        {
          id: `ai-${Date.now()}-7`,
          type: "radio" as const,
          text: "How often do you publish sustainability reports?",
          options: ["Annually", "Bi-annually", "Quarterly", "As needed", "Never"],
          score: 20,
          weight: 2,
          category: "Governance"
        }
      ],
      "Carbon Footprint Data Collection": [
        ...commonQuestions,
        {
          id: `ai-${Date.now()}-6`,
          type: "input" as const,
          text: "What is your organization's annual Scope 1 emissions (in metric tons CO2e)?",
          score: 30,
          weight: 4,
          category: "Environmental"
        },
        {
          id: `ai-${Date.now()}-7`,
          type: "radio" as const,
          text: "How does your organization measure Scope 3 emissions?",
          options: ["Comprehensive measurement", "Partial measurement", "Estimation only", "Not measured"],
          score: 25,
          weight: 3,
          category: "Environmental"
        }
      ]
    };

    // Ensure at least 5 questions are returned
    const typeQuestions = suggestions[surveyType] || commonQuestions;
    return typeQuestions.length >= 5 ? typeQuestions : commonQuestions;
  };

  const handleGenerateAIQuestions = async () => {
    if (!surveyDetails?.type) {
      toast({
        title: "Survey Type Required",
        description: "Please select a survey type to generate AI questions",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const aiQuestions = getAISuggestions(surveyDetails.type);
      setQuestions(prev => [...prev, ...aiQuestions]);
      setIsGeneratingAI(false);
      
      toast({
        title: "AI Questions Generated",
        description: `${aiQuestions.length} questions have been added to your survey`,
      });
    }, 2000);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.text) {
      toast({
        title: "Error",
        description: "Please enter question text",
        variant: "destructive"
      });
      return;
    }

    // Validate score if provided
    if (currentQuestion.score && currentQuestion.score > 100) {
      toast({
        title: "Error",
        description: "Score cannot exceed 100 points",
        variant: "destructive"
      });
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type || "input",
      text: currentQuestion.text,
      options: currentQuestion.options || [],
      score: currentQuestion.score, // Can be undefined for optional questions
      weight: currentQuestion.weight || 1,
      category: currentQuestion.category || "Environmental"
    };

    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestion({
      type: "input",
      text: "",
      options: [],
      score: 10,
      weight: 1,
      category: "Environmental"
    });

    toast({
      title: "Question Added",
      description: "Question has been added to the survey"
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question Deleted",
      description: "Question has been removed from the survey"
    });
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    handleDeleteQuestion(question.id);
  };

  const handlePublishSurvey = () => {
    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question to publish the survey",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Survey Published",
      description: "Survey has been published successfully"
    });
    navigate("/sustainable-procurement");
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Survey has been saved as draft"
    });
  };

  const getTotalScore = () => {
    return questions.reduce((total, q) => total + ((q.score || 0) * q.weight), 0);
  };

  const getQuestionsByCategory = () => {
    const grouped: Record<string, Question[]> = {};
    questions.forEach(q => {
      if (!grouped[q.category]) grouped[q.category] = [];
      grouped[q.category].push(q);
    });
    return grouped;
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "input": return <Type className="w-4 h-4" />;
      case "checkbox": return <CheckSquare className="w-4 h-4" />;
      case "radio": return <Radio className="w-4 h-4" />;
      case "yesno": return <ToggleLeft className="w-4 h-4" />;
      case "rating": return <Star className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const renderQuestionPreview = (question: Question) => {
    switch (question.type) {
      case "input":
        return <Input placeholder="Your answer here..." disabled />;
      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox disabled />
                <Label>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup disabled>
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} disabled />
                <Label>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "yesno":
        return (
          <RadioGroup disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" disabled />
              <Label>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" disabled />
              <Label>No</Label>
            </div>
          </RadioGroup>
        );
      case "rating":
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star key={rating} className="w-6 h-6 text-muted-foreground" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const kpiMetrics = [
    {
      title: "Total Questions",
      value: questions.length.toString(),
      change: `${questions.length} questions created`,
      icon: FileText,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Total Score",
      value: getTotalScore().toString(),
      change: "Maximum possible score",
      icon: Target,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    },
    {
      title: "Categories",
      value: Object.keys(getQuestionsByCategory()).length.toString(),
      change: "Question categories",
      icon: Settings,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-700"
    },
    {
      title: "Survey Status",
      value: questions.length > 0 ? "Active" : "Draft",
      change: surveyDetails?.type || "Not specified",
      icon: FileText,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/sustainable-procurement")}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {surveyDetails?.name || "AI-Powered Survey Builder"}
              </h1>
              <p className="text-gray-600 mt-1">
                {surveyDetails?.description || "Create comprehensive sustainability surveys with intelligent assistance"}
              </p>
            </div>
            
            <div className="flex gap-3 ml-4">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={() => navigate('/survey-preview', { 
                state: { questions, surveyDetails } 
              })}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handlePublishSurvey} className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards - Same style as dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                    {metric.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    {metric.value}
                  </div>
                </div>
                <div className={`${metric.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <p className="text-xs text-gray-600 font-medium">
                  {metric.change}
                </p>
              </CardContent>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${metric.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>


        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Question Builder
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              All Questions ({questions.length})
            </TabsTrigger>
          </TabsList>

          {/* Question Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question Builder Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Create New Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question-text">Question Text *</Label>
                    <Textarea
                      id="question-text"
                      placeholder="Enter your question here..."
                      rows={3}
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select 
                        value={currentQuestion.type} 
                        onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="input">Text Input</SelectItem>
                          <SelectItem value="checkbox">Multiple Choice</SelectItem>
                          <SelectItem value="radio">Single Choice</SelectItem>
                          <SelectItem value="yesno">Yes/No</SelectItem>
                          <SelectItem value="rating">Rating Scale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select 
                        value={currentQuestion.category} 
                        onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Options for multiple choice questions */}
                  {(currentQuestion.type === "checkbox" || currentQuestion.type === "radio") && (
                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(currentQuestion.options || [])];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newOptions = currentQuestion.options?.filter((_, i) => i !== index);
                                setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(currentQuestion.options || []), ""];
                            setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Scoring and Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>Score Points</Label>
                        <Checkbox 
                          checked={currentQuestion.score !== undefined}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCurrentQuestion(prev => ({ ...prev, score: 10 }));
                            } else {
                              setCurrentQuestion(prev => ({ ...prev, score: undefined }));
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">Include scoring</span>
                      </div>
                      {currentQuestion.score !== undefined && (
                        <>
                          <p className="text-sm text-muted-foreground">Score: {currentQuestion.score} (max: 100)</p>
                          <Slider
                            value={[currentQuestion.score || 10]}
                            onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, score: value[0] }))}
                            max={100}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Weight Multiplier: {currentQuestion.weight}</Label>
                      <Slider
                        value={[currentQuestion.weight || 1]}
                        onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, weight: value[0] }))}
                        max={5}
                        min={1}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddQuestion} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleGenerateAIQuestions} 
                    disabled={isGeneratingAI || !surveyDetails?.type}
                    className="w-full"
                    variant="outline"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                        Generating AI Questions...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate AI Questions
                      </>
                    )}
                  </Button>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Survey Information</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Name:</span> {surveyDetails?.name || "Not set"}</p>
                      <p><span className="font-medium">Type:</span> {surveyDetails?.type || "Not set"}</p>
                      <p><span className="font-medium">Target:</span> {surveyDetails?.surveyFor || "Not set"}</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Scoring Summary</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Total Questions:</span> {questions.length}</p>
                      <p><span className="font-medium">Total Possible Score:</span> {getTotalScore()}</p>
                      <p><span className="font-medium">Average Score per Question:</span> {questions.length > 0 ? Math.round(getTotalScore() / questions.length) : 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          {/* All Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {Object.keys(getQuestionsByCategory()).length > 0 ? (
              Object.entries(getQuestionsByCategory()).map(([category, categoryQuestions]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category} ({categoryQuestions.length} questions)</span>
                      <Badge variant="outline">
                        {categoryQuestions.reduce((sum, q) => sum + ((q.score || 0) * q.weight), 0)} points
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryQuestions.map((question) => (
                      <div key={question.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              {getQuestionTypeIcon(question.type)}
                              <Badge variant="outline">{question.type}</Badge>
                              {question.score ? (
                                <Badge>
                                  {question.score} × {question.weight} = {question.score * question.weight} pts
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Optional</Badge>
                              )}
                            </div>
                            <p className="font-medium">{question.text}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleEditQuestion(question);
                                setActiveTab("builder");
                              }}
                              title="Edit question"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteQuestion(question.id)}
                              title="Delete question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {question.options && question.options.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {question.options.map((option, idx) => (
                              <p key={idx} className="text-sm text-muted-foreground">• {option}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Questions Added Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your survey by adding questions or using AI assistance
                  </p>
                  <Button onClick={() => setActiveTab("builder")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview functionality moved to separate page */}
      </div>
    </DashboardLayout>
  );
};

export default CreateSurvey;