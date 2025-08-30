import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  FolderOpen, 
  Move, 
  Search, 
  Download,
  Eye,
  Mail,
  Send,
  Package,
  GripVertical,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import type { Applicant } from "@/pages/ApplicantTracking";

interface DocumentCenterProps {
  applicant: Applicant;
}

interface DocumentSection {
  id: string;
  name: string;
  documents: number;
  completed: boolean;
  order: number;
}

interface Document {
  id: string;
  name: string;
  section: string;
  content: string;
}

const initialSections: DocumentSection[] = [
  { id: 'A', name: 'Executive Summary', documents: 2, completed: true, order: 1 },
  { id: 'B', name: 'Technical Specifications', documents: 5, completed: true, order: 2 },
  { id: 'C', name: 'Financial Proposal', documents: 3, completed: false, order: 3 },
  { id: 'compliance', name: 'Compliance Documentation', documents: 4, completed: true, order: 4 },
  { id: 'technical', name: 'Technical Documentation', documents: 7, completed: false, order: 5 },
  { id: 'financial', name: 'Financial Records', documents: 2, completed: true, order: 6 }
];

// Generate comprehensive mock documents for all sections
const generateMockDocuments = (): { [key: string]: Document[] } => {
  const mockDocuments: { [key: string]: Document[] } = {};

  // Executive Summary documents
  mockDocuments['A'] = [
    {
      id: 'A1',
      name: 'Executive Summary Overview.pdf',
      section: 'Executive Summary',
      content: `EXECUTIVE SUMMARY - Document 1

Company: TechCorp Solutions
Project: Cloud Infrastructure Services
Date: January 2024

Overview:
This executive summary outlines our comprehensive approach to delivering cloud infrastructure services that align with your organization's digital transformation goals.

Key Highlights:
• 15+ years of cloud infrastructure experience
• 99.9% uptime guarantee
• ISO 27001 certified security protocols
• 24/7 technical support
• Scalable solutions for enterprise growth

Our Approach:
We propose a phased implementation strategy that minimizes disruption while maximizing efficiency. Our team of certified cloud architects will work closely with your IT department to ensure seamless migration and ongoing optimization.

Investment Summary:
Total Project Cost: ₹2,84,75,000
Implementation Timeline: 6 months
ROI Expected: 18 months

Next Steps:
Upon approval, we can begin the discovery phase within 2 weeks, followed by detailed planning and implementation phases.`
    },
    {
      id: 'A2',
      name: 'Strategic Partnership Proposal.pdf',
      section: 'Executive Summary',
      content: `EXECUTIVE SUMMARY - Strategic Partnership

Strategic Partnership Proposal
TechCorp Solutions & Client Organization

Partnership Benefits:
Our strategic partnership extends beyond traditional vendor relationships to create lasting value through innovation and collaboration.

Service Offerings:
1. Cloud Migration Services
2. Infrastructure Monitoring
3. Security Management
4. Disaster Recovery Planning
5. Performance Optimization

Competitive Advantages:
• Proprietary monitoring tools
• Advanced AI-driven analytics
• Dedicated account management
• Flexible pricing models
• Industry-specific expertise

Quality Assurance:
All services are backed by our comprehensive quality assurance program, including regular audits, performance reviews, and continuous improvement initiatives.`
    }
  ];

  // Technical Specifications documents
  mockDocuments['B'] = [
    {
      id: 'B1',
      name: 'Infrastructure Architecture.pdf',
      section: 'Technical Specifications',
      content: `TECHNICAL SPECIFICATIONS - Infrastructure Architecture

Cloud Infrastructure Architecture

System Requirements:
• Minimum 99.9% uptime SLA
• Auto-scaling capabilities
• Multi-region deployment
• Load balancing across zones
• Real-time monitoring and alerting

Technology Stack:
- Cloud Platform: AWS/Azure hybrid
- Container Orchestration: Kubernetes
- Monitoring: Prometheus + Grafana
- Security: HashiCorp Vault
- Backup: Automated daily snapshots

Network Configuration:
• Private VPC with multiple subnets
• VPN connectivity for secure access
• CDN integration for optimal performance
• DDoS protection and WAF implementation

Compliance Standards:
- SOC 2 Type II
- ISO 27001
- GDPR compliance
- HIPAA ready (if applicable)`
    },
    {
      id: 'B2',
      name: 'Security Framework.pdf',
      section: 'Technical Specifications',
      content: `TECHNICAL SPECIFICATIONS - Security Framework

Comprehensive Security Implementation

Security Layers:
1. Network Security
   - Firewall configuration
   - Intrusion detection systems
   - VPN tunneling protocols

2. Application Security
   - Code vulnerability scanning
   - API security gateways
   - Authentication protocols

3. Data Security
   - Encryption at rest and in transit
   - Key management systems
   - Data loss prevention

4. Monitoring & Response
   - 24/7 security operations center
   - Incident response procedures
   - Compliance reporting

Certifications:
- ISO 27001:2013
- SOC 2 Type II
- PCI DSS Level 1
- FedRAMP authorized`
    },
    {
      id: 'B3',
      name: 'Performance Metrics.pdf',
      section: 'Technical Specifications',
      content: `TECHNICAL SPECIFICATIONS - Performance Metrics

System Performance Standards

Response Time Requirements:
• API response time: < 200ms
• Database query time: < 100ms
• Page load time: < 2 seconds
• File transfer speed: > 100 Mbps

Scalability Metrics:
• Horizontal scaling: 1000+ concurrent users
• Vertical scaling: Up to 64 CPU cores
• Storage scaling: Petabyte capacity
• Network bandwidth: 10 Gbps

Availability Targets:
• System uptime: 99.9%
• Planned maintenance windows: < 4 hours/month
• Disaster recovery RTO: < 4 hours
• Disaster recovery RPO: < 1 hour

Monitoring Tools:
- Real-time dashboards
- Automated alerting
- Performance analytics
- Capacity planning reports`
    },
    {
      id: 'B4',
      name: 'Integration Specifications.pdf',
      section: 'Technical Specifications',
      content: `TECHNICAL SPECIFICATIONS - Integration Requirements

System Integration Framework

API Integration:
• RESTful API architecture
• GraphQL endpoints
• Webhook support
• Rate limiting: 1000 requests/minute

Database Integration:
• Multi-database support
• Data synchronization
• ETL processes
• Real-time replication

Third-party Integrations:
• CRM systems (Salesforce, HubSpot)
• ERP systems (SAP, Oracle)
• Identity providers (Azure AD, Okta)
• Monitoring tools (Datadog, New Relic)

Integration Security:
• OAuth 2.0 authentication
• API key management
• SSL/TLS encryption
• Data validation and sanitization`
    },
    {
      id: 'B5',
      name: 'Deployment Strategy.pdf',
      section: 'Technical Specifications',
      content: `TECHNICAL SPECIFICATIONS - Deployment Strategy

Implementation Roadmap

Phase 1: Foundation (Weeks 1-4)
• Infrastructure setup
• Network configuration
• Security implementation
• Basic monitoring

Phase 2: Core Services (Weeks 5-12)
• Application deployment
• Database migration
• Integration testing
• Performance optimization

Phase 3: Advanced Features (Weeks 13-20)
• Advanced monitoring
• Automation scripts
• Disaster recovery setup
• User training

Phase 4: Go-Live (Weeks 21-24)
• Final testing
• Production deployment
• Post-launch support
• Performance tuning

Deployment Tools:
• Infrastructure as Code (Terraform)
• CI/CD pipelines (Jenkins/GitLab)
• Container orchestration (Kubernetes)
• Configuration management (Ansible)`
    }
  ];

  // Generate documents for remaining sections
  const sectionsToGenerate = ['C', 'compliance', 'technical', 'financial'];
  
  sectionsToGenerate.forEach(sectionId => {
    const section = initialSections.find(s => s.id === sectionId);
    if (section) {
      mockDocuments[sectionId] = Array.from({ length: section.documents }, (_, i) => ({
        id: `${sectionId}${i + 1}`,
        name: `${section.name.replace(/\s+/g, '_')}_Document_${i + 1}.pdf`,
        section: section.name,
        content: `${section.name.toUpperCase()} - Document ${i + 1}

This is a comprehensive document for the ${section.name} section.

Document Overview:
This document contains detailed information relevant to ${section.name} requirements and specifications.

Key Contents:
• Detailed information relevant to ${section.name}
• Supporting documentation and evidence
• Compliance requirements and certifications
• Technical specifications and requirements
• Financial details and projections

Section Details:
${section.name} encompasses critical aspects of our proposal that demonstrate our capability and commitment to delivering excellence.

Document Status: ${section.completed ? 'Complete and Approved' : 'In Progress - Pending Review'}
Last Updated: ${new Date().toLocaleDateString()}
Document Version: 1.${i + 1}

Quality Assurance:
This document has been reviewed by our quality assurance team and meets all specified requirements for ${section.name}.

For additional information or clarification on any aspect of this document, please contact our support team at support@techcorp.com or call (555) 123-4567.

Confidentiality Notice:
This document contains confidential and proprietary information. Distribution is restricted to authorized personnel only.`
      }));
    }
  });

  return mockDocuments;
};

const mockDocuments = generateMockDocuments();

const emailTemplates = [
  {
    id: 'missing-docs',
    type: 'Missing Documents',
    subject: 'Missing Documentation - Action Required',
    template: 'Dear [Applicant Name],\n\nWe have reviewed your submission for [RFP Name] and identified missing documentation in the following sections:\n\n- [Section Names]\n\nPlease provide the missing documents by [Deadline].\n\nBest regards,\nProcurement Team'
  },
  {
    id: 'clarification',
    type: 'Clarification Request',
    subject: 'Clarification Needed for Your Application',
    template: 'Dear [Applicant Name],\n\nWe require clarification on the following items in your submission for [RFP Name]:\n\n[Clarification Items]\n\nPlease respond by [Deadline].\n\nBest regards,\nProcurement Team'
  },
  {
    id: 'results',
    type: 'Results Notification',
    subject: 'RFP Evaluation Results - [RFP Name]',
    template: 'Dear [Applicant Name],\n\nWe have completed the evaluation of your submission for [RFP Name].\n\n[Results Details]\n\nThank you for your participation.\n\nBest regards,\nProcurement Team'
  }
];

export const DocumentCenter = ({ applicant }: DocumentCenterProps) => {
  const [sections, setSections] = useState<DocumentSection[]>(initialSections);
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [extractDialogOpen, setExtractDialogOpen] = useState(false);
  const [extractedData, setExtractedData] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0]);
  const [customEmailContent, setCustomEmailContent] = useState('');

  // Hotkey listener for Extract functionality
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'e' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleExtract();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedSection]);

  const handleExtract = () => {
    // Pre-fill extracted data based on selected section
    const mockExtractedData = `Extracted data from ${selectedSection.name}:

Key Information:
- Company: ${applicant.applicantName}
- Section: ${selectedSection.name}
- Documents Processed: ${selectedSection.documents}
- Completion Status: ${selectedSection.completed ? 'Complete' : 'Incomplete'}

Summary:
This section contains ${selectedSection.documents} documents with ${selectedSection.completed ? 'all required' : 'missing'} information.`;

    setExtractedData(mockExtractedData);
    setExtractDialogOpen(true);
  };

  const handleViewDocument = (documentId: string) => {
    const document = mockDocuments[selectedSection.id]?.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
    }
  };

  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSectionId: string) => {
    if (!draggedSection || draggedSection === targetSectionId) {
      setDraggedSection(null);
      return;
    }

    const newSections = [...sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedSection);
    const targetIndex = newSections.findIndex(s => s.id === targetSectionId);

    // Reorder sections
    const [draggedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedItem);

    // Update order numbers
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setSections(newSections);
    setDraggedSection(null);
  };

  const handleSendEmail = (templateId: string) => {
    console.log(`Sending ${templateId} email to ${applicant.applicantName}`);
    setEmailDialogOpen(false);
  };

  const handleDownloadSummary = (format: string) => {
    console.log(`Downloading ${format} summary for ${applicant.applicantName}`);
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle size={16} className="text-green-500" />
    ) : (
      <AlertCircle size={16} className="text-yellow-500" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Organizer */}
        <Card className="bg-white rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FolderOpen size={20} />
              Document Sections
            </CardTitle>
            <p className="text-sm text-gray-600">Drag to reorder sections</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(section.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(section.id)}
                    onClick={() => {
                      setSelectedSection(section);
                      setSelectedDocument(null); // Clear selected document when changing sections
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-move ${
                      selectedSection.id === section.id
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${draggedSection === section.id ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{section.name}</div>
                            <div className="text-sm text-gray-600">
                              {section.documents} documents
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(section.completed)}
                            <Badge variant="outline" className="text-xs">
                              {section.id}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Viewer */}
        <div className="lg:col-span-3">
          <Card className="bg-white rounded-lg border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FileText size={20} />
                  {selectedSection.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleExtract}
                    className="flex items-center gap-2"
                  >
                    <Search size={16} />
                    Extract Data (Ctrl+E)
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Document List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockDocuments[selectedSection.id]?.map((doc, i) => (
                    <div 
                      key={doc.id}
                      className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                        selectedDocument?.id === doc.id 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {doc.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedSection.name} - Document {i + 1}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDocument(doc.id)}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Preview Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  {selectedDocument ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-4 border-b">
                        <FileText size={20} className="text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{selectedDocument.name}</h3>
                          <p className="text-sm text-gray-600">{selectedDocument.section}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                          {selectedDocument.content}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">Document Viewer</p>
                      <p className="text-sm text-gray-500">
                        Select a document above to view its contents
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Communication & Downloads Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Emails */}
        <Card className="bg-white rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Mail size={20} />
              Automated Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <Dialog key={template.id} open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTemplate(template)}
                      className="w-full justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">{template.type}</div>
                        <div className="text-sm text-gray-600">{template.subject}</div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send {template.type}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" value={template.subject} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="content">Message</Label>
                        <Textarea
                          id="content"
                          value={customEmailContent || template.template}
                          onChange={(e) => setCustomEmailContent(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleSendEmail(template.id)}>
                          <Send size={16} className="mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Downloadable Summaries */}
        <Card className="bg-white rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Package size={20} />
              Downloadable Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => handleDownloadSummary('complete-package')}
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">Complete Package</div>
                  <div className="text-sm text-gray-600">All documents and evaluations (PDF)</div>
                </div>
              </Button>
              <Button
                onClick={() => handleDownloadSummary('summary-report')}
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">Summary Report</div>
                  <div className="text-sm text-gray-600">Executive summary with key findings</div>
                </div>
              </Button>
              <Button
                onClick={() => handleDownloadSummary('section-analysis')}
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">Section Analysis</div>
                  <div className="text-sm text-gray-600">Detailed breakdown by section</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extract Data Dialog */}
      <Dialog open={extractDialogOpen} onOpenChange={setExtractDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Extracted Data - {selectedSection.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={extractedData}
              onChange={(e) => setExtractedData(e.target.value)}
              className="min-h-[300px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExtractDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => console.log('Saving extracted data:', extractedData)}>
                Save Extracted Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
