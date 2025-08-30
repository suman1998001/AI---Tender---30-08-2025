import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Target, TrendingUp, AlertTriangle, FileText, Download, Calendar, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SLADetailsProps {
  slaId?: string | null;
  onBack: () => void;
}

const SLADetails = ({ slaId, onBack }: SLADetailsProps) => {
  // Mock data for specific SLA
  const slaData = {
    name: "Cloud Infrastructure Uptime",
    vendor: "AWS Solutions",
    contract: "Software License Agreement",
    status: "At-Risk",
    statusType: "warning"
  };

  const kpiData = [
    {
      name: "Uptime Percentage",
      current: "99.8%",
      target: "99.9%",
      trend: "↓ -0.1%",
      status: "At-Risk",
      statusType: "warning"
    },
    {
      name: "Response Time",
      current: "15 min",
      target: "30 min",
      trend: "↑ +2 min",
      status: "Compliant",
      statusType: "success"
    }
  ];

  const breachLog = [
    {
      date: "2024-01-10 03:22",
      kpi: "Uptime %",
      severity: "Minor",
      penalty: "$500",
      status: "Applied to Invoice"
    },
    {
      date: "2024-01-05 14:15",
      kpi: "Response Time",
      severity: "Major",
      penalty: "$1,200",
      status: "Disputed"
    }
  ];

  const reports = [
    {
      name: "Monthly Performance Report - December 2023",
      date: "2024-01-01",
      type: "PDF"
    },
    {
      name: "Quarterly SLA Summary - Q4 2023",
      date: "2023-12-31",
      type: "Excel"
    }
  ];

  // Mock data for performance trends chart
  const performanceData = [
    { month: "Jan", uptime: 99.9, responseTime: 12 },
    { month: "Feb", uptime: 99.8, responseTime: 14 },
    { month: "Mar", uptime: 99.7, responseTime: 16 },
    { month: "Apr", uptime: 99.9, responseTime: 13 },
    { month: "May", uptime: 99.6, responseTime: 18 },
    { month: "Jun", uptime: 99.8, responseTime: 15 },
    { month: "Jul", uptime: 99.9, responseTime: 11 },
    { month: "Aug", uptime: 99.5, responseTime: 20 },
    { month: "Sep", uptime: 99.8, responseTime: 14 },
    { month: "Oct", uptime: 99.7, responseTime: 17 },
    { month: "Nov", uptime: 99.9, responseTime: 12 },
    { month: "Dec", uptime: 99.8, responseTime: 15 }
  ];

  // Mock data for breach heatmap
  const breachData = [
    { day: "Mon", breaches: 2 },
    { day: "Tue", breaches: 1 },
    { day: "Wed", breaches: 3 },
    { day: "Thu", breaches: 0 },
    { day: "Fri", breaches: 2 },
    { day: "Sat", breaches: 1 },
    { day: "Sun", breaches: 0 }
  ];

  // Mock data for additional charts
  const availabilityData = [
    { week: "W1", availability: 99.9 },
    { week: "W2", availability: 99.7 },
    { week: "W3", availability: 99.8 },
    { week: "W4", availability: 99.6 },
    { week: "W5", availability: 99.9 },
    { week: "W6", availability: 99.5 }
  ];

  const incidentData = [
    { type: "Critical", count: 2 },
    { type: "High", count: 5 },
    { type: "Medium", count: 8 },
    { type: "Low", count: 12 }
  ];

  const getStatusBadge = (status: string, statusType: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      success: "default",
      warning: "secondary",
      error: "destructive"
    };
    return <Badge variant={variants[statusType] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 hover:bg-red-accent-light border-gray-200 text-black">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">{slaData.name}</h1>
          {getStatusBadge(slaData.status, slaData.statusType)}
        </div>
        <p className="text-muted-foreground">
          {slaData.vendor} • {slaData.contract}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Current Uptime
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                99.8%
              </div>
            </div>
            <div className="bg-red-muted p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Target: 99.9%
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Response Time
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                15 min
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              Target: 30 min
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                This Month Breaches
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                3
              </div>
            </div>
            <div className="bg-red-muted p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              -2 from last month
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        <Card className="group relative overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500 tracking-tight leading-none">
                Penalty Amount
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                $1,700
              </div>
            </div>
            <div className="bg-black p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative pt-0 px-6 pb-6">
            <p className="text-xs text-gray-600 font-medium">
              YTD Total
            </p>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>

      {/* SLA Details Tabs */}
      <MinimalTabs defaultValue="overview" className="space-y-[15px]">
        <MinimalTabsList className="bg-white rounded-[15px] border border-gray-200 p-1">
          <MinimalTabsTrigger value="overview" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <Target size={16} />
            Overview
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="trends" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <TrendingUp size={16} />
            Performance Trends
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="breaches" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <AlertTriangle size={16} />
            Breach Log & Penalties
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="reports" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <FileText size={16} />
            Reports
          </MinimalTabsTrigger>
        </MinimalTabsList>

        <MinimalTabsContent value="overview" className="space-y-6">
          {/* KPI Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpiData.map((kpi, index) => (
                  <Card key={index} className="transition-all duration-200 hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{kpi.name}</h4>
                        {getStatusBadge(kpi.status, kpi.statusType)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-bold text-lg">{kpi.current}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-bold text-lg">{kpi.target}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Trend</p>
                          <p className="font-bold text-lg">{kpi.trend}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Ingestion Status */}
          <Card className="group overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 animate-fade-in">
            
            
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-black rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                Data Ingestion Status
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* API Connector */}
                <div className="group/item p-4 rounded-xl border border-red-accent bg-red-accent-light/50 hover:bg-red-accent-light hover:border-red-muted hover:shadow-md transition-all duration-300 animate-fade-in" style={{animationDelay: '100ms'}}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-red-muted rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-red-accent rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover/item:text-red-muted transition-colors">API Connector</p>
                      <p className="text-sm text-gray-600">Last sync: 2 minutes ago</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-muted h-1.5 rounded-full w-full transition-all duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monitoring Tool */}
                <div className="group/item p-4 rounded-xl border border-primary bg-muted/50 hover:bg-muted hover:border-primary hover:shadow-md transition-all duration-300 animate-fade-in" style={{animationDelay: '200ms'}}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-muted-foreground rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover/item:text-primary transition-colors">Monitoring Tool</p>
                      <p className="text-sm text-gray-600">Last sync: 5 minutes ago</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full w-[95%] transition-all duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="group/item p-4 rounded-xl border border-red-accent bg-red-accent-light/50 hover:bg-red-accent-light hover:border-red-muted hover:shadow-md transition-all duration-300 animate-fade-in" style={{animationDelay: '300ms'}}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-red-muted rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-red-accent rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover/item:text-red-muted transition-colors">Manual Entry</p>
                      <p className="text-sm text-gray-600">Last update: 2 hours ago</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-muted h-1.5 rounded-full w-[70%] transition-all duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-muted rounded-full animate-pulse"></div>
                    <span className="text-gray-600">Overall Status: <span className="font-semibold text-red-muted">Active</span></span>
                  </div>
                  <div className="text-gray-500">
                    Next refresh: <span className="font-medium">30 seconds</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </MinimalTabsContent>

        <MinimalTabsContent value="trends" className="space-y-6">
          {/* First Row - Performance Trends and Breach Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="uptime" 
                        stroke="hsl(var(--red-muted))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--red-muted))', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="responseTime" 
                        stroke="hsl(var(--red-accent))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--red-accent))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breach Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breachData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="breaches" fill="hsl(var(--red-muted))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Weekly Availability and Incident Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Weekly Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={availabilityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="week" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" domain={[99, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="availability" 
                        stroke="hsl(var(--red-muted))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--red-muted))', strokeWidth: 2, r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Incident Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incidentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="type" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--red-muted))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </MinimalTabsContent>

        <MinimalTabsContent value="breaches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Breach Log & Penalties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>KPI Breached</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Calculated Penalty</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breachLog.map((breach, index) => (
                    <TableRow key={index} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <TableCell className="font-mono text-sm">{breach.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{breach.kpi}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={breach.severity === "Major" ? "destructive" : "secondary"}>
                          {breach.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">{breach.penalty}</TableCell>
                      <TableCell>
                        <Badge variant={breach.status === "Disputed" ? "destructive" : "default"}>
                          {breach.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </MinimalTabsContent>

        <MinimalTabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generated Reports
                </CardTitle>
                <Button className="transition-all duration-200 hover:scale-105">
                  <Download className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">Generated on {report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Performance Summary</p>
                    <p className="text-sm text-muted-foreground">Every 1st of the month • PDF format</p>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Quarterly Executive Report</p>
                    <p className="text-sm text-muted-foreground">Every quarter end • Excel format</p>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </MinimalTabsContent>
      </MinimalTabs>
    </div>
  );
};

export { SLADetails };