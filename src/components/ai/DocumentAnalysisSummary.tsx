import React, { useState } from 'react';
import { FileText, CheckCircle, Info, Eye, Clock, Target, Database, ChevronUp, ChevronDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// Placeholder components - these need to be created
const ComplianceSection = ({ onScoreChange }: { onScoreChange: () => void }) => (
  <div className="p-4">Compliance evaluation content</div>
);
const TechnicalSection = () => <div className="p-4">Technical assessment content</div>;
const FinancialSection = () => <div className="p-4">Financial review content</div>;
const LegalSection = () => <div className="p-4">Legal compliance content</div>;

interface DocumentAnalysisSummaryProps {
  document: any;
  currentVendor?: any;
}

const DocumentAnalysisSummary: React.FC<DocumentAnalysisSummaryProps> = ({ document, currentVendor }) => {
  const [loading, setLoading] = useState([false, false, false, false]);
  const [detailedInfo, setDetailedInfo] = useState({
    companyDetails: [],
    technicalSpecs: [],
    financialProposals: [],
    legalCompliance: []
  });
  const [technicalAssessmentExpanded, setTechnicalAssessmentExpanded] = useState(false);
  const [openSections, setOpenSections] = useState(['compliance', 'technical', 'financial', 'legal']);
  const [financialReviewData, setFinancialReviewData] = useState<string>('');
  const [financialReviewLoading, setFinancialReviewLoading] = useState(false);
  const [legalComplianceData, setLegalComplianceData] = useState<string>('');
  const [legalComplianceLoading, setLegalComplianceLoading] = useState(false);

  // Auto-load data when sections are expanded
  React.useEffect(() => {
    if (openSections.includes('financial') && !financialReviewData && !financialReviewLoading) {
      handleFinancialReviewClick();
    }
    if (openSections.includes('legal') && !legalComplianceData && !legalComplianceLoading) {
      handleLegalComplianceClick();
    }
  }, [openSections, financialReviewData, legalComplianceData, financialReviewLoading, legalComplianceLoading]);

  const handleCheckInfo = (eyeNum: number, query: string) => {
    let loaderSet = [false, false, false, false];
    loaderSet[eyeNum] = true;
    setLoading(loaderSet);

    // Mock API call - in real implementation, this would call the actual API
    setTimeout(() => {
      loaderSet = [false, false, false, false];
      setLoading(loaderSet);
      
      // Mock data for demonstration
      const mockData = {
        0: [{ key: "Company Name", value: "ABC Corporation" }, { key: "Registration Number", value: "REG123456" }],
        1: [{ key: "Technical Requirements", value: "ISO 9001 Certified" }, { key: "Capacity", value: "1000 units/day" }],
        2: [{ key: "Total Bid Value", value: "$2.5M" }, { key: "Payment Terms", value: "Net 30" }],
        3: [{ key: "Compliance Status", value: "Fully Compliant" }, { key: "Certifications", value: "ISO 14001" }]
      };

      if (eyeNum === 0) {
        setDetailedInfo(prev => ({ ...prev, companyDetails: mockData[0] }));
      } else if (eyeNum === 1) {
        setDetailedInfo(prev => ({ ...prev, technicalSpecs: mockData[1] }));
      } else if (eyeNum === 2) {
        setDetailedInfo(prev => ({ ...prev, financialProposals: mockData[2] }));
      } else if (eyeNum === 3) {
        setDetailedInfo(prev => ({ ...prev, legalCompliance: mockData[3] }));
      }
    }, 1000);
  };

  const handleFinancialReviewClick = () => {
    if (!currentVendor?.id) {
      console.log('No vendor selected');
      return;
    }

    setFinancialReviewLoading(true);
    
    const payload = {
      token: "rthsyIONdjwskd789hbfkejbnbnd66",
      vendor_id: currentVendor.id.toString(),
      query: "Provide a summary of financial review as a bulleted list in plain text"
    };

    fetch('https://bkvdbucgj6udzpavi75x2pyk5y0iacir.lambda-url.us-west-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Financial review response:', data);
        if (data.answer) {
          setFinancialReviewData(data.answer);
        }
        setFinancialReviewLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching financial review:', err);
        setFinancialReviewLoading(false);
      });
  };

  const handleLegalComplianceClick = () => {
    if (!currentVendor?.id) {
      console.log('No vendor selected');
      return;
    }

    setLegalComplianceLoading(true);
    
    const payload = {
      token: "rthsyIONdjwskd789hbfkejbnbnd66",
      vendor_id: currentVendor.id.toString(),
      query: "Provide a summary of legal compliance as a bulleted list in plain text"
    };

    fetch('https://bkvdbucgj6udzpavi75x2pyk5y0iacir.lambda-url.us-west-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Legal compliance response:', data);
        if (data.answer) {
          setLegalComplianceData(data.answer);
        }
        setLegalComplianceLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching legal compliance:', err);
        setLegalComplianceLoading(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Procurement Document Analysis</h2>
        <p className="text-gray-600">AI-powered evaluation results for {document?.name || 'dummydoc'}</p>
      </div>

      {/* Document Summary Box */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-2xl">
              <Info className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Document Analysis Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Type Identification */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Document Type Identified</span>
              </h4>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900">Technical Bid Submission</span>
                </div>
                <p className="text-sm text-gray-600">
                  AI identified this as a comprehensive tender response containing technical specifications, 
                  financial proposals, and compliance documentation for a procurement process.
                </p>
              </div>
            </div>

            {/* Extracted Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Key Information Extracted</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-2xl">
                  <span className="text-sm text-gray-700">Company Details</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCheckInfo(0, 'Give Company Details')}>
                          <Eye className="w-3 h-3 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white border border-gray-200">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Company Details</h4>
                          {loading[0] ? (
                            <div className="text-sm text-gray-600">Loading data please wait...</div>
                          ) : (
                            <div className="space-y-2 text-sm">
                              {Array.isArray(detailedInfo.companyDetails) && detailedInfo.companyDetails.length > 0 ? (
                                detailedInfo.companyDetails.map((item, idx) => (
                                  <div key={idx}><span className="font-medium">{item.key}:</span> {item.value}</div>
                                ))
                              ) : (
                                <div>No data available.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-2xl">
                  <span className="text-sm text-gray-700">Technical Specifications</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCheckInfo(1, 'Give Technical Specifications')}>
                          <Eye className="w-3 h-3 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white border border-gray-200">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Technical Specifications</h4>
                          {loading[1] ? (
                            <div className="text-sm text-gray-600">Loading data please wait...</div>
                          ) : (
                            <div className="space-y-2 text-sm">
                              {Array.isArray(detailedInfo.technicalSpecs) && detailedInfo.technicalSpecs.length > 0 ? (
                                detailedInfo.technicalSpecs.map((item, idx) => (
                                  <div key={idx}><span className="font-medium">{item.key}:</span> {item.value}</div>
                                ))
                              ) : (
                                <div>No data available.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-2xl">
                  <span className="text-sm text-gray-700">Financial Proposals</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCheckInfo(2, 'Give Financial Proposals')}>
                          <Eye className="w-3 h-3 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white border border-gray-200">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Financial Proposals</h4>
                          {loading[2] ? (
                            <div className="text-sm text-gray-600">Loading data please wait...</div>
                          ) : (
                            <div className="space-y-2 text-sm">
                              {Array.isArray(detailedInfo.financialProposals) && detailedInfo.financialProposals.length > 0 ? (
                                detailedInfo.financialProposals.map((item, idx) => (
                                  <div key={idx}><span className="font-medium">{item.key}:</span> {item.value}</div>
                                ))
                              ) : (
                                <div>No data available.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-2xl">
                  <span className="text-sm text-gray-700">Legal Compliance</span>
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCheckInfo(3, 'Give Legal Compliance')}>
                          <Eye className="w-3 h-3 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white border border-gray-200">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Legal Compliance Status</h4>
                          {loading[3] ? (
                            <div className="text-sm text-gray-600">Loading data please wait...</div>
                          ) : (
                            <div className="space-y-2 text-sm">
                              {Array.isArray(detailedInfo.legalCompliance) && detailedInfo.legalCompliance.length > 0 ? (
                                detailedInfo.legalCompliance.map((item, idx) => (
                                  <div key={idx}><span className="font-medium">{item.key}:</span> {item.value}</div>
                                ))
                              ) : (
                                <div>No data available.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Processing completed in 2.3 seconds</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Confidence: 94%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Pages analyzed: 47</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Evaluation */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Compliance Evaluation 92% Compliant</h3>
            </div>
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </div>
          
          <ComplianceSection onScoreChange={() => {}} />
        </div>
      </div>



      {/* Evaluation Sections Accordion */}
      <Accordion 
        type="multiple" 
        value={openSections} 
        onValueChange={setOpenSections}
        className="space-y-6"
      >
        <AccordionItem value="compliance" className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <span className="text-lg font-semibold">Compliance Evaluation</span>
              <span className="text-sm text-gray-600 font-medium">92% Compliant</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ComplianceSection onScoreChange={() => {}} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="technical" className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <span className="text-lg font-semibold">Technical Assessment</span>
              <span className="text-sm text-gray-600 font-medium">85% Adequate</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <TechnicalSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="financial" className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <AccordionTrigger 
            className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors rounded-2xl"
            onClick={() => handleFinancialReviewClick()}
          >
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <span className="text-lg font-semibold">Financial Review</span>
              {financialReviewLoading && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {/* Financial Review API Response */}
            {financialReviewData ? (
              <div className="mb-6 bg-muted border border-border p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Financial Review Summary</h4>
                <div className="space-y-2 text-sm">
                  {financialReviewData.split('\n').map((line, idx) => (
                    <div key={idx} className="text-gray-700">{line}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click the header to load financial review data
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="legal" className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <AccordionTrigger 
            className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors rounded-2xl"
            onClick={() => handleLegalComplianceClick()}
          >
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <span className="text-lg font-semibold">Legal Compliance</span>
              {legalComplianceLoading && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {/* Legal Compliance API Response */}
            {legalComplianceData ? (
              <div className="mb-6 bg-muted border border-border p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Legal Compliance Summary</h4>
                <div className="space-y-2 text-sm">
                  {legalComplianceData.split('\n').map((line, idx) => (
                    <div key={idx} className="text-gray-700">{line}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click the header to load legal compliance data
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DocumentAnalysisSummary; 