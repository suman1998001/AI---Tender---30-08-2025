
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const MetricsCards = () => {
  const metrics = [
    {
      title: "Total Applicants",
      value: "1,247",
      change: "+89 new this week",
      icon: Users,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-black"
    },
    {
      title: "Qualified Applicants",
      value: "832",
      change: "67% qualification rate",
      icon: CheckCircle,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    },
    {
      title: "Avg. Processing Time",
      value: "2.8 days",
      change: "-15% faster than last month",
      icon: Clock,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-700"
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "Requires human attention",
      icon: AlertTriangle,
      color: "text-gray-900",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-red-accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
      {metrics.map((metric, index) => (
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
  );
};
