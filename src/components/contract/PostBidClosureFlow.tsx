import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MinimalTabs, MinimalTabsList, MinimalTabsTrigger, MinimalTabsContent } from "@/components/ui/minimal-tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileSignature, CheckCircle, Clock, AlertTriangle, Download, FileText, Send, Award, BarChart3, ClipboardCheck } from "lucide-react";

interface PostBidClosureFlowProps {
  onBack: () => void;
}

const PostBidClosureFlow = ({ onBack }: PostBidClosureFlowProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const closureTasks = [
    {
      id: "loa",
      title: "Letter of Award (LOA)",
      description: "Generate and send Letter of Award to winning bidder",
      status: "completed",
      documents: ["LOA-RFP-2024-001.pdf"]
    },
    {
      id: "contract",
      title: "Contract Generation",
      description: "Create formal contract based on bid terms",
      status: "in-progress",
      documents: ["Contract-Draft-v1.pdf"]
    },
    {
      id: "po",
      title: "Purchase Order",
      description: "Issue Purchase Order for procurement",
      status: "pending",
      documents: []
    },
    {
      id: "vendor-onboarding",
      title: "Vendor Onboarding",
      description: "Complete vendor registration and compliance checks",
      status: "pending",
      documents: []
    },
    {
      id: "sla-setup",
      title: "SLA Configuration",
      description: "Set up Service Level Agreements and monitoring",
      status: "pending",
      documents: []
    },
    {
      id: "payment-schedule",
      title: "Payment Schedule",
      description: "Configure payment milestones and schedules",
      status: "pending",
      documents: []
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const completedCount = closureTasks.filter(task => task.status === "completed").length;
  const progressPercentage = (completedCount / closureTasks.length) * 100;

  const rfpDetails = {
    id: "RFP-2024-001",
    title: "Software Development Services",
    winningBidder: "M/S ARADHAY SHREERAM PRIVATE LIMITED",
    bidAmount: "₹45,50,000",
    awardDate: "2024-01-15",
    expectedStartDate: "2024-02-01"
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      {/* Header */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900">Post-Bid Closure Workflow</h1>
        <p className="text-gray-600">Complete all post-award activities and documentation</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Closure Progress</h3>
              <span className="text-sm text-gray-500">{completedCount} of {closureTasks.length} tasks completed</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Started</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
              <span>Closure</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <MinimalTabs defaultValue="overview" className="space-y-6">
        <MinimalTabsList className="bg-white rounded-[15px] border border-gray-200 p-1">
          <MinimalTabsTrigger value="overview" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <BarChart3 size={16} />
            Overview
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="tasks" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <ClipboardCheck size={16} />
            Tasks
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="documents" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <FileText size={16} />
            Documents
          </MinimalTabsTrigger>
          <MinimalTabsTrigger value="timeline" className="flex items-center gap-2 text-black data-[state=active]:bg-black data-[state=active]:text-white">
            <Clock size={16} />
            Timeline
          </MinimalTabsTrigger>
        </MinimalTabsList>

        <MinimalTabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RFP Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>RFP Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">RFP ID</label>
                  <p className="text-gray-900">{rfpDetails.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-gray-900">{rfpDetails.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Winning Bidder</label>
                  <p className="text-gray-900">{rfpDetails.winningBidder}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Bid Amount</label>
                  <p className="text-gray-900 font-semibold">{rfpDetails.bidAmount}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <FileSignature className="h-4 w-4 mr-2" />
                  Generate Contract
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Send LOA to Vendor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Documents
                </Button>
              </CardContent>
            </Card>
          </div>
        </MinimalTabsContent>

        <MinimalTabsContent value="tasks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closureTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="ml-2">
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {task.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      disabled={task.status === "completed"}
                      className={`${task.status === "completed" ? "opacity-50" : ""} transition-all duration-200 hover:scale-105`}
                      variant={task.status === "completed" ? "outline" : "default"}
                    >
                      {task.status === "completed" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        "Start Task"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </MinimalTabsContent>

        <MinimalTabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["LOA-RFP-2024-001.pdf", "Contract-Draft-v1.pdf", "Vendor-Profile.pdf", "Compliance-Checklist.pdf"].map((doc, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-500">Generated today</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </MinimalTabsContent>

        <MinimalTabsContent value="timeline">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Closure Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                {/* Enhanced Timeline Line with Gradient */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 rounded-full"></div>
                
                {/* Timeline Steps with Enhanced Animations */}
                <div className="space-y-12">
                  {[
                    { date: "Jan 15, 2024", title: "Bid Awarded", description: "RFP awarded to M/S ARADHAY SHREERAM", status: "completed", icon: Award },
                    { date: "Jan 16, 2024", title: "LOA Generated", description: "Letter of Award created and sent", status: "completed", icon: FileText },
                    { date: "Jan 18, 2024", title: "Contract Generation", description: "Formal contract being prepared", status: "in-progress", icon: FileSignature },
                    { date: "Jan 22, 2024", title: "PO Issuance", description: "Purchase Order to be issued", status: "pending", icon: Send },
                    { date: "Jan 25, 2024", title: "Project Kickoff", description: "Official project start", status: "pending", icon: CheckCircle }
                  ].map((event, index) => (
                    <div key={index} className="relative flex items-start group">
                      <div className={`absolute left-6 w-6 h-6 rounded-full border-4 bg-white shadow-lg transition-all duration-500 transform group-hover:scale-110 ${
                        event.status === "completed" 
                          ? 'border-green-500 shadow-green-200 animate-scale-in' 
                          : event.status === "in-progress"
                            ? 'border-yellow-500 shadow-yellow-200 animate-pulse' 
                            : 'border-gray-300 shadow-gray-200'
                      }`}>
                        {event.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-green-500 absolute -top-1 -left-1 animate-fade-in" />
                        )}
                        {event.status === "in-progress" && (
                          <Clock className="h-4 w-4 text-yellow-500 absolute -top-1 -left-1 animate-spin" />
                        )}
                        {event.status === "pending" && (
                          <div className="h-2 w-2 bg-gray-400 rounded-full absolute top-1 left-1"></div>
                        )}
                      </div>
                      
                      <div className="ml-20 p-6 bg-white rounded-xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              event.status === "completed" ? 'bg-green-100' :
                              event.status === "in-progress" ? 'bg-yellow-100' :
                              'bg-gray-100'
                            }`}>
                              <event.icon className={`h-5 w-5 ${
                                event.status === "completed" ? 'text-green-600' :
                                event.status === "in-progress" ? 'text-yellow-600' :
                                'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <h4 className={`font-bold text-lg ${
                                event.status === "completed" ? 'text-green-700' : 
                                event.status === "in-progress" ? 'text-yellow-700' : 
                                'text-gray-600'
                              }`}>
                                {event.title}
                              </h4>
                              <p className="text-gray-500 mt-1">{event.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-500">{event.date}</span>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              event.status === "completed" ? 'bg-green-100 text-green-800' :
                              event.status === "in-progress" ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {event.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {event.status === "in-progress" && <Clock className="h-3 w-3 mr-1" />}
                              {event.status === "pending" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('-', ' ')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar for In-Progress Items */}
                        {event.status === "in-progress" && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>75%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 animate-pulse" style={{width: '75%'}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </MinimalTabsContent>
      </MinimalTabs>
    </div>
  );
};

export default PostBidClosureFlow;