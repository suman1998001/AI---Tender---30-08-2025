
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserCheck, AlertTriangle } from "lucide-react";

export const AdminKPICards = () => {
  const metrics = [
    {
      title: "Total Users",
      value: "47",
      change: "+12% from last month",
      icon: Users,
      iconBg: "bg-primary"
    },
    {
      title: "Active Users", 
      value: "42",
      change: "89% active rate",
      icon: UserCheck,
      iconBg: "bg-success"
    },
    {
      title: "Total Roles",
      value: "8", 
      change: "Custom permissions",
      icon: Shield,
      iconBg: "bg-red-accent"
    },
    {
      title: "Pending Access",
      value: "3",
      change: "Requires approval", 
      icon: AlertTriangle,
      iconBg: "bg-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
      {metrics.map((metric, index) => (
        <Card key={index} className="group relative overflow-hidden rounded-[15px] border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                {metric.title}
              </CardTitle>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {metric.value}
              </div>
            </div>
            <div className={`${metric.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <metric.icon className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-muted-foreground font-medium">
              {metric.change}
            </p>
          </CardContent>
          
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${metric.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </Card>
      ))}
    </div>
  );
};
