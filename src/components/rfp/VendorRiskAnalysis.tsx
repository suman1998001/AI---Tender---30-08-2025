import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, Users, FileX, DollarSign, TrendingUp, Activity, Eye } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend } from 'recharts';
import type { Applicant } from "@/pages/ApplicantTracking";
import { useState, useEffect } from "react";

interface VendorRiskAnalysisProps {
  applicants: Applicant[];
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(value * progress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [value, duration]);

  return <span>{count}</span>;
};

// Risk Gauge Component - Updated to donut chart with red/black theme
const RiskGauge = ({ score, level }: { score: number; level: string }) => {
  const data = [
    { name: 'Risk', value: score, fill: level === 'High' ? '#DC2626' : level === 'Medium' ? '#7F1D1D' : '#1F2937' },
    { name: 'Safe', value: 100 - score, fill: '#F9FAFB' }
  ];

  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={450}
            innerRadius={45}
            outerRadius={55}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{score}%</div>
          <div className="text-xs text-gray-600">Risk</div>
        </div>
      </div>
    </div>
  );
};

export const VendorRiskAnalysis = ({ applicants }: VendorRiskAnalysisProps) => {
  // Mock risk data generation with more sophisticated scoring
  const generateRiskData = (applicant: Applicant) => {
    const risks = ["Financial", "Compliance", "Operational", "Reputation"];
    const aiScore = applicant.aiScore || 0;
    const riskLevel = aiScore > 85 ? "Low" : aiScore > 70 ? "Medium" : "High";
    const riskScore = aiScore > 85 ? Math.random() * 25 + 5 : 
                      aiScore > 70 ? Math.random() * 35 + 35 : Math.random() * 40 + 60;
    
    return {
      level: riskLevel,
      score: Math.round(riskScore),
      primaryRisk: risks[Math.floor(Math.random() * risks.length)],
      factors: Math.floor(Math.random() * 5) + 1,
      financialScore: Math.round(Math.random() * 100),
      complianceScore: Math.round(Math.random() * 100),
      operationalScore: Math.round(Math.random() * 100),
      reputationScore: Math.round(Math.random() * 100)
    };
  };

  const applicantsWithRisk = applicants.map(applicant => ({
    ...applicant,
    risk: generateRiskData(applicant)
  }));

  const overallRisk = applicantsWithRisk.reduce((acc, curr) => {
    if (curr.risk.level === "High") acc.high++;
    else if (curr.risk.level === "Medium") acc.medium++;
    else acc.low++;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  const totalRiskScore = Math.round(
    applicantsWithRisk.reduce((sum, a) => sum + a.risk.score, 0) / applicantsWithRisk.length
  );

  // Donut chart data with red/black theme only
  const pieData = [
    { name: 'Low Risk', value: overallRisk.low, fill: '#1F2937' },
    { name: 'Medium Risk', value: overallRisk.medium, fill: '#7F1D1D' },
    { name: 'High Risk', value: overallRisk.high, fill: '#DC2626' }
  ];

  // Risk factors data for bar chart
  const riskFactors = [
    { name: "Financial", high: 2, medium: 3, low: 5 },
    { name: "Compliance", high: 1, medium: 2, low: 7 },
    { name: "Operational", high: 3, medium: 4, low: 3 },
    { name: "Reputation", high: 1, medium: 1, low: 8 }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "bg-red-50 text-red-700 border-red-200";
      case "Medium": return "bg-red-25 text-red-600 border-red-150";
      case "Low": return "bg-gray-900 text-white border-gray-700";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "High": return AlertTriangle;
      case "Medium": return TrendingDown;
      case "Low": return Shield;
      default: return AlertTriangle;
    }
  };

  const getOverallRiskLevel = () => {
    if (overallRisk.high > overallRisk.low) return "High";
    if (overallRisk.medium > overallRisk.low) return "Medium";
    return "Low";
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment Dashboard */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-semibold">Overall Tender Risk Assessment</span>
            </div>
            <Badge variant="outline" className="text-sm font-medium px-3 py-1">
              {applicants.length} Bidders Analyzed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Level Gauge */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-sm border">
              <RiskGauge score={totalRiskScore} level={getOverallRiskLevel()} />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{getOverallRiskLevel()}</div>
                <div className="text-sm text-gray-600">Overall Risk Level</div>
              </div>
            </div>

            {/* Risk Distribution Donut Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        <AnimatedCounter value={overallRisk.high} />
                      </div>
                      <div className="text-sm text-gray-600">High-Risk Bidders</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        <AnimatedCounter value={overallRisk.medium} />
                      </div>
                      <div className="text-sm text-gray-600">Medium-Risk Bidders</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900 rounded-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        <AnimatedCounter value={overallRisk.low} />
                      </div>
                      <div className="text-sm text-gray-600">Low-Risk Bidders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors Analysis */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-6">Risk Factors by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskFactors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="high" stackId="a" fill="#DC2626" name="High Risk" />
                <Bar dataKey="medium" stackId="a" fill="#7F1D1D" name="Medium Risk" />
                <Bar dataKey="low" stackId="a" fill="#1F2937" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Bidder Risk Profiles */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            Individual Bidder Risk Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {applicantsWithRisk.map((applicant) => {
              const RiskIcon = getRiskIcon(applicant.risk.level);
              return (
                <div key={applicant.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-primary/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${applicant.risk.level === 'High' ? 'bg-red-100' : applicant.risk.level === 'Medium' ? 'bg-red-50' : 'bg-gray-900'}`}>
                        <RiskIcon className={`w-5 h-5 ${applicant.risk.level === 'High' ? 'text-red-600' : applicant.risk.level === 'Medium' ? 'text-red-500' : 'text-white'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{applicant.applicantName}</h3>
                        <p className="text-sm text-gray-600">
                          Primary Risk: {applicant.risk.primaryRisk} • {applicant.risk.factors} risk factor(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-gray-900">{applicant.risk.score}%</div>
                        <div className="text-sm text-gray-600">Risk Score</div>
                      </div>
                      <Badge className={`${getRiskColor(applicant.risk.level)} font-medium px-3 py-1`}>
                        {applicant.risk.level} Risk
                      </Badge>
                    </div>
                  </div>

                  {/* Risk Categories Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-gray-900" />
                      <div className="text-sm font-medium text-gray-900">{applicant.risk.financialScore}%</div>
                      <div className="text-xs text-gray-600">Financial</div>
                      <Progress value={100 - applicant.risk.financialScore} className="w-full h-1 mt-1" />
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FileX className="w-4 h-4 mx-auto mb-1 text-gray-900" />
                      <div className="text-sm font-medium text-gray-900">{applicant.risk.complianceScore}%</div>
                      <div className="text-xs text-gray-600">Compliance</div>
                      <Progress value={100 - applicant.risk.complianceScore} className="w-full h-1 mt-1" />
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Activity className="w-4 h-4 mx-auto mb-1 text-gray-900" />
                      <div className="text-sm font-medium text-gray-900">{applicant.risk.operationalScore}%</div>
                      <div className="text-xs text-gray-600">Operational</div>
                      <Progress value={100 - applicant.risk.operationalScore} className="w-full h-1 mt-1" />
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 mx-auto mb-1 text-gray-900" />
                      <div className="text-sm font-medium text-gray-900">{applicant.risk.reputationScore}%</div>
                      <div className="text-xs text-gray-600">Reputation</div>
                      <Progress value={100 - applicant.risk.reputationScore} className="w-full h-1 mt-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};