
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const WorkflowKPICards = () => {
  const kpis = [
    {
      title: "Active Workflows",
      value: "47",
      change: "+12 this week",
      icon: Activity,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      iconBg: "bg-red-accent"
    },
    {
      title: "Avg Processing Time",
      value: "3.2 hrs",
      change: "-15% faster",
      icon: Clock,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Completed Today",
      value: "128",
      change: "94% success rate",
      icon: CheckCircle,
      color: "text-black",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      iconBg: "bg-red-accent"
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-red-accent",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px] mb-[15px]">
      {kpis.map((kpi, index) => (
        <Card key={index} className="group relative overflow-hidden rounded-[15px] border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                {kpi.title}
              </CardTitle>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {kpi.value}
              </div>
            </div>
            <div className={`${kpi.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-muted-foreground font-medium">
              {kpi.change}
            </p>
          </CardContent>
          
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </Card>
      ))}
    </div>
  );
};
