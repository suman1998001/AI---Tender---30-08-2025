import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, DollarSign, Award, Building } from "lucide-react";
import type { RFP } from "@/pages/RFPManagement";
import type { Applicant } from "@/pages/ApplicantTracking";

interface TenderOverviewTilesProps {
  rfp: RFP;
  applicants: Applicant[];
}

export const TenderOverviewTiles = ({ rfp, applicants }: TenderOverviewTilesProps) => {
  const qualifiedCount = applicants.filter(a => a.qualified).length;
  const l1Bidder = applicants.length > 0 ? applicants.reduce((prev, current) => ((prev.aiScore || 0) > (current.aiScore || 0)) ? prev : current) : null;
  const avgTurnover = applicants.length > 0 ? applicants.reduce((sum, a) => sum + (Math.random() * 1000000 + 500000), 0) / applicants.length : 0;
  const avgQuotation = applicants.length > 0 ? applicants.reduce((sum, a) => sum + (Math.random() * 500000 + 200000), 0) / applicants.length : 0;

  const tiles = [
    {
      title: "Total Applicants",
      value: rfp.total_applicants.toString(),
      icon: Users,
      change: "+12%",
      changeType: "increase" as const,
      subtitle: "Submitted bids"
    },
    {
      title: "Total Qualified",
      value: qualifiedCount.toString(),
      icon: Award,
      change: `${Math.round((qualifiedCount / rfp.total_applicants) * 100)}%`,
      changeType: "neutral" as const,
      subtitle: "Qualification rate"
    },
    {
      title: "Current L1 Bidder",
      value: l1Bidder?.applicantName || "TBD",
      icon: TrendingUp,
      change: `Score: ${l1Bidder?.aiScore || 0}`,
      changeType: "increase" as const,
      subtitle: "Highest AI Score"
    },
    {
      title: "Average Turnover",
      value: `₹${(avgTurnover / 100000).toFixed(1)}L`,
      icon: Building,
      change: "Range: ₹2.5L - ₹15L",
      changeType: "neutral" as const,
      subtitle: "Applicant turnover"
    },
    {
      title: "Average Quotation",
      value: `₹${(avgQuotation / 100000).toFixed(1)}L`,
      icon: DollarSign,
      change: "Range: ₹1.8L - ₹8.5L",
      changeType: "decrease" as const,
      subtitle: "Bid amounts"
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case "increase": return "text-green-600";
      case "decrease": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "increase": return TrendingUp;
      case "decrease": return TrendingDown;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[10px] mb-[10px]">
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        const ChangeIcon = getChangeIcon(tile.changeType);
        
        return (
            <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-accent/10 to-red-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="relative p-4">
              <div className="flex items-start justify-between space-y-0">
                <div className="space-y-1 flex-1">
                  <div className="text-xs font-medium text-gray-500 tracking-tight leading-none">
                    {tile.title}
                  </div>
                  <div className="text-xl font-bold text-gray-900 tracking-tight">
                    {tile.value}
                  </div>
                  <div className={`flex items-center gap-1 ${getChangeColor(tile.changeType)}`}>
                    {ChangeIcon && <ChangeIcon size={12} />}
                    <span className="text-xs font-medium">{tile.change}</span>
                  </div>
                  <p className="text-xs text-gray-500">{tile.subtitle}</p>
                </div>
                <div className="bg-red-muted p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        );
      })}
    </div>
  );
};