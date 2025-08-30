import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Leaf,
  Users,
  Shield,
  DollarSign,
  FileText,
  Award,
  TrendingUp,
  Target,
  BarChart3
} from "lucide-react";

const VendorScorecard = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would be fetched based on vendorId
  const vendor = {
    id: vendorId,
    name: "ALMIGHTY MANPOWER & SECURITY SERVICES",
    surveyName: "ESG Compliance Survey 2024",
    overallScore: 87,
    completionDate: "2024-01-22",
    status: "Completed"
  };

  const scoreCategories = [
    {
      category: "Environmental",
      score: 85,
      maxScore: 100,
      icon: Leaf,
      color: "text-red-accent",
      bgColor: "bg-red-50",
      questions: [
        { question: "Renewable energy usage percentage", score: 90, maxScore: 100, status: "excellent" },
        { question: "Carbon footprint reduction initiatives", score: 80, maxScore: 100, status: "good" },
        { question: "Waste management practices", score: 85, maxScore: 100, status: "good" }
      ]
    },
    {
      category: "Social",
      score: 92,
      maxScore: 100,
      icon: Users,
      color: "text-black",
      bgColor: "bg-gray-50",
      questions: [
        { question: "Employee diversity and inclusion", score: 95, maxScore: 100, status: "excellent" },
        { question: "Worker safety protocols", score: 90, maxScore: 100, status: "excellent" },
        { question: "Community engagement initiatives", score: 90, maxScore: 100, status: "excellent" }
      ]
    },
    {
      category: "Governance",
      score: 78,
      maxScore: 100,
      icon: Shield,
      color: "text-red-accent",
      bgColor: "bg-red-50",
      questions: [
        { question: "Board diversity and independence", score: 75, maxScore: 100, status: "moderate" },
        { question: "Ethics and compliance policies", score: 80, maxScore: 100, status: "good" },
        { question: "Transparency in reporting", score: 80, maxScore: 100, status: "good" }
      ]
    },
    {
      category: "Economic",
      score: 95,
      maxScore: 100,
      icon: DollarSign,
      color: "text-black",
      bgColor: "bg-gray-50",
      questions: [
        { question: "Financial stability and performance", score: 95, maxScore: 100, status: "excellent" },
        { question: "Supply chain transparency", score: 95, maxScore: 100, status: "excellent" },
        { question: "Economic impact on local communities", score: 95, maxScore: 100, status: "excellent" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-black" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-red-accent" />;
      case "moderate":
        return <AlertTriangle className="w-4 h-4 text-red-accent" />;
      case "poor":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-black";
    if (score >= 80) return "text-gray-900";
    if (score >= 70) return "text-red-600";
    return "text-red-700";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-black";
    if (score >= 80) return "bg-gray-700";
    if (score >= 70) return "bg-red-accent";
    return "bg-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Custom Header */}
        <div className="bg-white -mt-6 -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/sustainable-procurement")}
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Vendor Info Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
          <p className="text-gray-600">{vendor.surveyName}</p>
        </div>

        {/* Overall Score Card - Matching dashboard style */}
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Overall ESG Performance
              </CardTitle>
              <div className="text-4xl font-bold text-gray-900 tracking-tight">
                {vendor.overallScore}%
              </div>
              <Badge variant="default" className="bg-black text-white hover:bg-gray-800">
                {vendor.status}
              </Badge>
              <p className="text-xs text-gray-600 font-medium mt-2">
                Completed on {vendor.completionDate}
              </p>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <div className="w-full">
              <Progress 
                value={vendor.overallScore} 
                className="w-full h-3 bg-gray-200"
              />
            </div>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        {/* GPP Compliance & Environmental Status */}
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                GPP Compliance & Environmental Status
              </CardTitle>
              <div className="text-lg font-bold text-gray-900 tracking-tight">
                Regulatory & Policy Alignment
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Leaf className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GPP Compliance Status */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">GPP Compliance Status</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-black" />
                    <Badge variant="outline" className="border-black text-black">
                      Fully Compliant
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-700 mt-2">
                    Meets all Green Public Procurement criteria and standards
                  </p>
                </div>
              </div>

              {/* Alignment with National Environmental Policies */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">National Environmental Policy Alignment</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Alignment Score</span>
                    <Badge variant="outline" className="border-gray-700 text-gray-700">
                      85%
                    </Badge>
                  </div>
                  <Progress 
                    value={85} 
                    className="w-full h-2 bg-gray-200 mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Strong alignment with National Action Plan on Climate Change and Waste Management Rules
                  </p>
                </div>
              </div>
            </div>

            {/* Relevant Indian Eco-labels Held */}
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm">Relevant Indian Eco-labels Held</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Award className="w-4 h-4 text-black" />
                  <div>
                    <span className="text-sm font-medium text-black">GreenPro</span>
                    <p className="text-xs text-gray-600">Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Award className="w-4 h-4 text-red-accent" />
                  <div>
                    <span className="text-sm font-medium text-red-accent">BEE Star Rating</span>
                    <p className="text-xs text-red-600">5 Star</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Award className="w-4 h-4 text-black" />
                  <div>
                    <span className="text-sm font-medium text-black">IGBC</span>
                    <p className="text-xs text-gray-600">Gold Certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap for Green Transition */}
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm">Roadmap for Green Transition / GPP Improvement Plan</h4>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900">Phase 1 (Q1-Q2 2024)</h5>
                      <p className="text-xs text-gray-600">Complete transition to 100% renewable energy sources for all operations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900">Phase 2 (Q3-Q4 2024)</h5>
                      <p className="text-xs text-gray-600">Implement circular economy practices and achieve zero waste to landfill certification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900">Phase 3 (2025)</h5>
                      <p className="text-xs text-gray-600">Carbon neutrality certification and supply chain sustainability integration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        {/* Category Breakdown - Matching dashboard KPI style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
          {scoreCategories.map((category) => (
            <Card key={category.category} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                    {category.category}
                  </CardTitle>
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    {category.score}/{category.maxScore}
                  </div>
                </div>
                <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <category.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <div className="space-y-4">
                  <Progress 
                    value={(category.score / category.maxScore) * 100} 
                    className="w-full h-2 bg-gray-200"
                  />
                  
                  <div className="space-y-2">
                    {category.questions.map((question, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center gap-2 flex-1">
                          {getStatusIcon(question.status)}
                          <span className="text-xs font-medium text-gray-700">
                            {question.question}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${getScoreColor(question.score)}`}>
                          {question.score}/{question.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* AI Insights - Matching dashboard style */}
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                AI-Generated Insights
              </CardTitle>
              <div className="text-lg font-bold text-gray-900 tracking-tight">
                Performance Analysis
              </div>
            </div>
            <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Excellent social responsibility practices with strong employee diversity</li>
                  <li>• Outstanding economic performance and financial stability</li>
                  <li>• Good environmental initiatives in renewable energy adoption</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• Governance structure could benefit from increased board independence</li>
                  <li>• Carbon footprint reduction initiatives need enhancement</li>
                  <li>• Transparency in ESG reporting can be improved</li>
                </ul>
              </div>
            </div>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate(`/vendor-profile/${vendorId}`)}
            className="bg-red-accent hover:bg-red-muted text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Full Profile
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            <Target className="w-4 h-4 mr-2" />
            Set Improvement Goals
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            <Award className="w-4 h-4 mr-2" />
            Generate Certificate
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorScorecard;