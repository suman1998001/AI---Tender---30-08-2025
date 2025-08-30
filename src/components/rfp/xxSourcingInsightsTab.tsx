import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  Award,
  Globe,
  Filter,
  Download,
  RefreshCw,
  Settings,
  FileText,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SourcingInsightsTab = () => {
  const { toast } = useToast();
  
  const insights = [
    {
      title: "Housekeeping Market Participation",
      value: "68%",
      change: "+15%",
      trend: "up",
      description: "Higher than regional average of 53%",
      icon: Users
    },
    {
      title: "Average Bid Response Time",
      value: "12 days",
      change: "-2 days",
      trend: "up",
      description: "Faster than MP state average",
      icon: Calendar
    },
    {
      title: "Local Vendor Diversity",
      value: "72/100",
      change: "+5",
      trend: "up",
      description: "Strong regional presence",
      icon: Globe
    },
    {
      title: "Cost Competitiveness",
      value: "₹18.5L",
      change: "-8%",
      trend: "up",
      description: "Below market rate of ₹20.1L",
      icon: DollarSign
    }
  ];

  const trendingCategories = [
    { category: "Housekeeping Services", demand: 85, suppliers: 42, avgBid: "₹18.5L" },
    { category: "Facility Management", demand: 72, suppliers: 28, avgBid: "₹22.1L" },
    { category: "Maintenance Services", demand: 68, suppliers: 35, avgBid: "₹16.8L" },
    { category: "Security Services", demand: 79, suppliers: 31, avgBid: "₹19.7L" }
  ];

  const performanceMetrics = [
    { metric: "On-Time Delivery", score: 92, target: 90 },
    { metric: "Quality Score", score: 88, target: 85 },
    { metric: "Cost Effectiveness", score: 86, target: 80 },
    { metric: "Vendor Satisfaction", score: 91, target: 88 }
  ];

  const handleAction = (action: string) => {
    toast({
      title: "Coming Soon",
      description: `${action} functionality will be available soon`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Sourcing insights report has been exported successfully",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Sourcing insights data has been updated",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-red-accent" />
          <h2 className="text-2xl font-bold">Sourcing Insights</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            className="border-red-accent text-red-accent hover:bg-red-accent/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            className="bg-red-accent hover:bg-red-accent/90"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          const TrendIcon = insight.trend === "up" ? TrendingUp : TrendingDown;
          const trendColor = insight.trend === "up" ? "text-red-accent" : "text-gray-600";
          
          return (
            <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-accent/5 to-red-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                    {insight.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    {insight.value}
                  </div>
                </div>
                <div className="bg-red-accent p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <div className={`flex items-center gap-1 mb-1 ${trendColor}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="text-sm font-medium">{insight.change}</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {insight.description}
                </p>
              </CardContent>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics & Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[15px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-accent" />
                Performance Metrics
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleAction("Configure Metrics")}
                className="border-red-accent text-red-accent hover:bg-red-accent/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Target: {metric.target}%</span>
                      <Badge 
                        className={
                          metric.score >= metric.target 
                            ? "bg-red-accent text-white" 
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {metric.score}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={metric.score} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[15px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-red-accent" />
                Market Trends
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleAction("View Detailed Trends")}
                className="border-red-accent text-red-accent hover:bg-red-accent/10"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingCategories.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-red-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.category}</h4>
                    <Badge variant="outline" className="border-red-accent/50 text-red-accent">
                      {category.avgBid}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Demand</div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.demand} className="flex-1 h-1" />
                        <span className="font-medium">{category.demand}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Suppliers</div>
                      <div className="font-medium">{category.suppliers} active</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Intelligence */}
      <Card className="rounded-[15px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-accent" />
              Procurement Intelligence
            </CardTitle>
            <Button 
              variant="outline"
              onClick={() => handleAction("Generate Intelligence Report")}
              className="border-red-accent text-red-accent hover:bg-red-accent/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Top Performing Vendors</h4>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleAction("View All Vendors")}
                  className="text-red-accent hover:bg-red-accent/10"
                >
                  View All
                </Button>
              </div>
              {["Sulabh International", "ISS Facility Services", "Godrej Security Solutions"].map((vendor, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-red-accent/10 transition-colors">
                  <div className="w-6 h-6 bg-red-accent rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {index + 1}
                  </div>
                  <span className="text-sm">{vendor}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Risk Alerts</h4>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleAction("Manage Risk Alerts")}
                  className="text-red-accent hover:bg-red-accent/10"
                >
                  Manage
                </Button>
              </div>
              {[
                "2 vendors missing EPF compliance docs",
                "Statutory wage rates increased in MP",
                "New safety regulations for housekeeping"
              ].map((alert, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-accent/10 rounded-lg border border-red-accent/20">
                  <div className="w-2 h-2 bg-red-accent rounded-full"></div>
                  <span className="text-sm">{alert}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Opportunities</h4>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleAction("Explore Opportunities")}
                  className="text-red-accent hover:bg-red-accent/10"
                >
                  Explore
                </Button>
              </div>
              {[
                "Bundle housekeeping with maintenance",
                "Leverage MSE vendor preferences", 
                "Long-term contract cost savings"
              ].map((opportunity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-red-accent/10 transition-colors border border-gray-200 hover:border-red-accent/30">
                  <div className="w-2 h-2 bg-red-accent rounded-full"></div>
                  <span className="text-sm">{opportunity}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};