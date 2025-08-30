import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckSquare, FileText, Circle, SquareCheck, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface Question {
  id: string;
  type: string;
  text: string;
  options?: string[];
  score?: number;
  weight: number;
  category: string;
}

interface SurveyDetails {
  name?: string;
  type?: string;
  description?: string;
  instructions?: string;
  estimatedTime?: string;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
}

const SurveyPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { questions = [], surveyDetails = {} } = location.state || {};

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return <Circle className="w-4 h-4 text-muted-foreground" />;
      case "checkbox":
        return <SquareCheck className="w-4 h-4 text-muted-foreground" />;
      case "radio":
        return <Radio className="w-4 h-4 text-muted-foreground" />;
      case "textarea":
        return <FileText className="w-4 h-4 text-muted-foreground" />;
      default:
        return <CheckSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const renderQuestionPreview = (question: Question) => {
    switch (question.type) {
      case "multiple_choice":
      case "radio":
        return (
          <RadioGroup disabled>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} disabled />
                <Label className="text-muted-foreground">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox disabled />
                <Label className="text-muted-foreground">{option}</Label>
              </div>
            ))}
          </div>
        );
      case "textarea":
        return <Textarea placeholder="Response area..." disabled className="text-muted-foreground" />;
      default:
        return <Input placeholder="Answer here..." disabled className="text-muted-foreground" />;
    }
  };

  const getQuestionsByCategory = () => {
    const categorized: { [key: string]: Question[] } = {};
    questions.forEach((question: Question) => {
      if (!categorized[question.category]) {
        categorized[question.category] = [];
      }
      categorized[question.category].push(question);
    });
    return categorized;
  };

  const questionsByCategory = getQuestionsByCategory();

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Survey Information */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {surveyDetails.name || "Survey Title"}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">
                {surveyDetails.type || "General Survey"}
              </Badge>
              {surveyDetails.estimatedTime && (
                <span className="text-sm text-muted-foreground">
                  Estimated time: {surveyDetails.estimatedTime}
                </span>
              )}
            </div>
          </div>

          {surveyDetails.description && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{surveyDetails.description}</p>
            </div>
          )}

          {surveyDetails.instructions && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Instructions</h3>
              <p className="text-sm text-muted-foreground">{surveyDetails.instructions}</p>
            </div>
          )}

          {(surveyDetails.targetAudience || surveyDetails.startDate || surveyDetails.endDate) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {surveyDetails.targetAudience && (
                <div>
                  <h4 className="font-medium text-foreground">Target Audience</h4>
                  <p className="text-sm text-muted-foreground">{surveyDetails.targetAudience}</p>
                </div>
              )}
              {surveyDetails.startDate && (
                <div>
                  <h4 className="font-medium text-foreground">Start Date</h4>
                  <p className="text-sm text-muted-foreground">{surveyDetails.startDate}</p>
                </div>
              )}
              {surveyDetails.endDate && (
                <div>
                  <h4 className="font-medium text-foreground">End Date</h4>
                  <p className="text-sm text-muted-foreground">{surveyDetails.endDate}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Questions by Category */}
        <div className="space-y-6">
          {Object.entries(questionsByCategory).map(([category, categoryQuestions], categoryIndex) => (
            <div key={category} className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Badge variant="outline">{category}</Badge>
                <span className="text-sm text-muted-foreground">
                  ({categoryQuestions.length} question{categoryQuestions.length !== 1 ? 's' : ''})
                </span>
              </h2>
              
              <div className="space-y-6">
                {categoryQuestions.map((question, questionIndex) => (
                  <div key={question.id} className="space-y-3 p-4 border rounded-lg bg-background">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {categoryIndex + 1}.{questionIndex + 1} {question.text}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {question.score && (
                            <Badge variant="outline" className="text-xs">
                              {question.score * question.weight} points
                            </Badge>
                          )}
                          {getQuestionTypeIcon(question.type)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      {renderQuestionPreview(question)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground">No questions to preview yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SurveyPreview;