
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Users, AlertTriangle } from "lucide-react";

export const RFPKPICards = () => {
  const kpis = [
    {
      title: "Active RFPs",
      value: "6",
      subtitle: "+1 new (Haulage Contract)",
      icon: FileText,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-red-accent/10 to-red-accent/20",
      iconBg: "bg-red-accent"
    },
    {
      title: "Total Submissions",
      value: "86",
      subtitle: "Across all active RFPs",
      icon: Users,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Avg. Response Time",
      value: "18 days",
      subtitle: "From RFP issue to close",
      icon: Clock,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-red-accent/10 to-red-accent/20",
      iconBg: "bg-red-accent"
    },
    {
      title: "Closing Soon",
      value: "4 RFPs",
      subtitle: "Within next 7 days",
      icon: AlertTriangle,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                  {kpi.title}
                </CardTitle>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {kpi.value}
                </div>
              </div>
              <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-gray-600 font-medium">
                {kpi.subtitle}
              </p>
            </CardContent>
            
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>
        );
      })}
    </div>
  );
};
