import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Search, Database, Globe, Users, Plus } from "lucide-react";
import { AITooltip } from "@/components/ui/ai-tooltip";

export const GenerateRFPTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New RFP Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">RFP Title</label>
              <Input placeholder="Enter RFP title..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it-services">IT Services</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="procurement">Procurement</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Project Description</label>
            <Textarea 
              placeholder="Describe the project requirements..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Issue Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Closing Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Estimated Budget</label>
              <Input placeholder="₹ 0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Standard RFP Template", description: "General purpose RFP template" },
              { name: "IT Services Template", description: "Specialized for technology projects" },
              { name: "Construction Template", description: "For building and infrastructure projects" }
            ].map((template, index) => (
              <AITooltip
                key={index}
                content={`Template sourced from knowledge base. Contains ${index === 0 ? "50" : index === 1 ? "35" : "42"} standard clauses, compliance requirements, and evaluation criteria. Last updated: Q4 2024.`}
                type="generation"
                confidence={96}
                source={`Template KB-${index + 1}${index === 1 ? " (IT Specialized)" : index === 2 ? " (Construction)" : ""}`}
              >
                <Card className="cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Select Template
                    </Button>
                  </CardContent>
                </Card>
              </AITooltip>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intelligent Content Sourcing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AITooltip
              content="AI searches past tenders from your database. Extracts relevant clauses, terms, and evaluation criteria. Matches by category, budget range, and complexity level."
              type="generation"
              confidence={89}
              source="Tender Database Engine"
            >
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Database className="w-6 h-6" />
                <span className="text-sm">Past Tenders</span>
              </Button>
            </AITooltip>
            <AITooltip
              content="Upload technical reports, specifications, or requirement documents. AI extracts key requirements and suggests appropriate RFP sections and technical criteria."
              type="extraction"
              confidence={92}
              source="Document Parser v2.1"
            >
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Upload className="w-6 h-6" />
                <span className="text-sm">Upload Reports</span>
              </Button>
            </AITooltip>
            <AITooltip
              content="AI searches public procurement databases and industry standards. Finds best practices, compliance requirements, and market benchmarks for your RFP category."
              type="generation"
              confidence={85}
              source="Web Intelligence Engine"
            >
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Globe className="w-6 h-6" />
                <span className="text-sm">Internet Search</span>
              </Button>
            </AITooltip>
            <AITooltip
              content="AI analyzes consultant reports and recommendations. Extracts technical specifications, industry benchmarks, and expert recommendations for RFP enhancement."
              type="extraction"
              confidence={94}
              source="Expert Knowledge Engine"
            >
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">Consultant Reports</span>
              </Button>
            </AITooltip>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Qualification Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Minimum turnover requirements",
              "Technical expertise requirements",
              "Past project experience",
              "Compliance certifications"
            ].map((criteria, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{criteria}</span>
                <Badge variant="outline">Required</Badge>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Criteria
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1">Generate RFP Document</Button>
        <Button variant="outline">Save as Draft</Button>
        <Button variant="outline">Preview</Button>
      </div>
    </div>
  );
};