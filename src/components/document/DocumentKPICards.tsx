
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, Clock, CheckCircle } from "lucide-react";

export const DocumentKPICards = () => {
  const kpis = [
    {
      title: "Total Documents",
      value: "1,847",
      subtitle: "+127 this month",
      icon: FileText,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-red-accent-light/20 to-red-accent-light/30",
      iconBg: "bg-red-muted"
    },
    {
      title: "Documents Processed",
      value: "1,432",
      subtitle: "77% processing rate",
      icon: CheckCircle,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Avg. Processing Time",
      value: "4.2 mins",
      subtitle: "Per document analysis",
      icon: Clock,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-red-accent-light/20 to-red-accent-light/30",
      iconBg: "bg-red-muted"
    },
    {
      title: "Repository Size",
      value: "2.8 GB",
      subtitle: "Storage utilization",
      icon: Database,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px]">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="group relative overflow-hidden rounded-[15px] border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-black tracking-tight leading-none">
                  {kpi.title}
                </CardTitle>
                <div className="text-2xl font-bold text-black tracking-tight">
                  {kpi.value}
                </div>
              </div>
              <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0 px-6 pb-6">
              <p className="text-xs text-black font-medium">
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
