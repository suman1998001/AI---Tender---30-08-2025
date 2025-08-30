import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Loader2, FileCheck, Users, Shield, Eye, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
type EvaluationState = 'initial' | 'initialLoading' | 'loading' | 'completed';
const sectionNames = ["Contact & Tender Details", "PQC Documents", "Other Mandatory Documents", "Declarations", "Final Observations"];
const loadingMessages = ["Evaluating contract and tender details...", "Evaluating the PQC document...", "Evaluating other mandatory documents...", "Reviewing declarations and undertakings...", "Finalizing observations..."];
function parseComparativeStatement(text: string) {
  const sectionRegex = /^([A-Za-z0-9\s\(\)\.\-&]+):\s*$/gm;

  const result: any = {};
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let lastSection = null;

  // Find all section headers
  while ((match = sectionRegex.exec(text)) !== null) {
    if (lastSection) {
      // Extract previous section's content
      const sectionContent = text.slice(lastIndex, match.index).trim();
      result[lastSection] = parseSection(sectionContent);
    }
    lastSection = match[1].trim().replace(/\s+/g, "_");
    lastIndex = sectionRegex.lastIndex;
  }
  // Add the last section
  if (lastSection) {
    result[lastSection] = parseSection(text.slice(lastIndex).trim());
  }
  return result;

  // Helper to parse numbered lines in a section
  function parseSection(sectionText: string) {
    const lines = sectionText.split('\n');
    const sectionObj: any = {};
    for (const line of lines) {
      // 1. Numbered lines: 1. Key: Value
      let m = line.match(/^\d+\.\s*([^:]+):\s*(.*)$/);
      if (m) {
        sectionObj[m[1].trim().replace(/\s+/g, "_")] = m[2].trim();
        continue;
      }
      // 2. Dash lines: - Key: Value
      m = line.match(/^\-\s*([^:]+):\s*(.*)$/);
      if (m) {
        sectionObj[m[1].trim().replace(/\s+/g, "_")] = m[2].trim();
        continue;
      }
      // 3. Plain Key: Value
      m = line.match(/^([^:]+):\s*(.*)$/);
      if (m) {
        sectionObj[m[1].trim().replace(/\s+/g, "_")] = m[2].trim();
      }
    }
    return sectionObj;
  }
}

const ComparativeStatement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const document = location.state?.document;
  const currentVendor = location.state?.currentVendor;
  const [dataObj, setDataObj] = useState<any>({});

  const [state, setState] = useState<EvaluationState>('initialLoading');
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completionTime, setCompletionTime] = useState<string>('');
  const [sectionStartTimes, setSectionStartTimes] = useState<{
    [key: number]: Date;
  }>({});
  const [sectionGenerationTimes, setSectionGenerationTimes] = useState<{
    [key: number]: string;
  }>({});

  // Auto-start evaluation when component loads in initialLoading state
  useEffect(() => {
    if (state === 'initialLoading') {
      const timer = setTimeout(() => {
        startEvaluation();
      }, 2000); // Start after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [state]);

  // Effect to call the API when document is available
  useEffect(() => {
    if (document?.url) {
      fetch('https://4dzepoa56yk3hd5brf3benbgjm0xbsvt.lambda-url.us-west-2.on.aws/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({vendor_id: currentVendor?.id?.toString() || '',token: "rthsyIONdjwskd789hbfkejbnbnd66", s3_uri: document.url,force: document?.name=='dummydoc' ? false : true})
      })
      .then(res => res.json())
      .then(data => {
        // handle API response here
        console.log('Comparative Statement API result:', data);
        if(data) {
          const parsed = parseComparativeStatement(data);
          setDataObj(parsed);

          console.log('Comparative Statement API result:', parsed);
          console.log('Total_Value_of_Similar_Works_(in_Lacs):', parsed?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)']);
        }

        if(document?.name=='dummydoc'){
          setTimeout(() => {
            setCompletedSections([0,1,2,3,4]);
            setState('completed');
          }, 30000);
        }else{
          setCompletedSections([0,1,2,3,4]);
          setState('completed');
        }
        
      })
      .catch(err => {
        // handle error
        console.error('Comparative Statement API error:', err);
      });
    }
  }, [document]);

  // Function to calculate total time from all sections
  const calculateTotalTime = () => {
    const times = Object.values(sectionGenerationTimes);
    if (times.length === 0) return '0sec';
    let totalSeconds = 0;
    times.forEach(timeStr => {
      const seconds = parseInt(timeStr.replace(/[^\d]/g, ''));
      totalSeconds += seconds;
    });
    return totalSeconds < 60 ? `${totalSeconds}sec` : `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}sec`;
  };

  // Function to determine TQC status based on evaluation
  const getTQCStatus = () => {
    // Mock evaluation logic - in real implementation, this would check actual scores/compliance
    const hasAllDocuments = true; // Based on document verification
    const hasDisqualifyingIssues = false; // Based on compliance checks
    const hasPendingQueries = false; // Based on technical evaluation
    const hasMissingMandatoryDocuments = true; // Check for missing mandatory documents

    if (hasMissingMandatoryDocuments) {
      return {
        status: "disqualified",
        text: "Bidder is technically dis-qualified due to missing mandatory documents as per tender requirements",
        icon: "XCircle",
        color: "red"
      };
    } else if (hasDisqualifyingIssues) {
      return {
        status: "disqualified",
        text: "Bidder is technically dis-qualified due to reason mentioned above",
        icon: "XCircle",
        color: "red"
      };
    } else if (hasPendingQueries) {
      return {
        status: "conditional",
        text: "Bidder is technically qualified subject to submission of reply to TQ/CQ raised",
        icon: "CheckCircle",
        color: "yellow"
      };
    } else if (hasAllDocuments) {
      return {
        status: "qualified",
        text: "Bidder is technically qualified as all documents pertaining to PQC requirement are submitted",
        icon: "CheckCircle",
        color: "green"
      };
    }
    return {
      status: "pending",
      text: "TQC status under evaluation",
      icon: "Loader2",
      color: "gray"
    };
  };
  const startEvaluation = () => {
    setState('loading');
    setStartTime(new Date());
    setCompletedSections([]); // Start with no completed sections
    setProgress(0);
    setCurrentLoadingIndex(0); // Start with Contact & Tender Details

    // Start loading all sections including PQC Documents
    // setTimeout(() => {
    //   simulateLoading();
    // }, 100);
  };
  // const simulateLoading = () => {
  //   const sectionsToLoad = [0, 1, 2, 3, 4]; // Load in correct order: Contact & Tender Details, PQC Documents, Other Mandatory Documents, Declarations, Final Observations
  //   let currentIndex = 0;
  //   const loadNextSection = () => {
  //     if (currentIndex < sectionsToLoad.length) {
  //       const sectionIndex = sectionsToLoad[currentIndex];

  //       // Record section start time
  //       const sectionStartTime = new Date();
  //       setSectionStartTimes(prev => ({
  //         ...prev,
  //         [sectionIndex]: sectionStartTime
  //       }));
  //       setCurrentLoadingIndex(sectionIndex);
  //       setProgress((currentIndex + 1) / sectionNames.length * 100);

  //       // Simulate actual processing time (2-4 seconds per section)
  //       const processingTime = 2000 + Math.random() * 2000; // 2-4 seconds

  //       setTimeout(() => {
  //         // Calculate and record actual generation time
  //         const sectionEndTime = new Date();
  //         const duration = Math.round((sectionEndTime.getTime() - sectionStartTime.getTime()) / 1000);
  //         const timeString = duration < 60 ? `${duration}sec` : `${Math.floor(duration / 60)}m ${duration % 60}sec`;
  //         setSectionGenerationTimes(prev => ({
  //           ...prev,
  //           [sectionIndex]: timeString
  //         }));
  //         setCompletedSections(prev => [...prev, sectionIndex]);

  //         // Auto-scroll to the section
  //         setTimeout(() => {
  //           const element = document.getElementById(`section-${sectionIndex}`);
  //           if (element) {
  //             element.scrollIntoView({
  //               behavior: 'smooth',
  //               block: 'center'
  //             });
  //           }
  //         }, 100);
  //         currentIndex++;
  //         if (currentIndex < sectionsToLoad.length) {
  //           setTimeout(loadNextSection, 500); // Small delay between sections
  //         } else {
  //           // Complete the evaluation
  //           setTimeout(() => {
  //             setState('completed');
  //             // Calculate completion time
  //             if (startTime) {
  //               const endTime = new Date();
  //               const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  //               const minutes = Math.floor(duration / 60);
  //               const seconds = duration % 60;
  //               setCompletionTime(minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`);
  //             }
  //           }, 1000);
  //         }
  //       }, processingTime);
  //     }
  //   };
  //   loadNextSection();
  // };
  const renderSection = (index: number) => {
    switch (index) {
      case 0:
        return <div id="section-0" className="glass-card p-4 animate-fade-in border border-border hover:border-foreground/20 transition-all duration-500 group scroll-mt-16">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-muted rounded-md group-hover:bg-foreground/10 transition-colors duration-300">
                <Users className="text-foreground" size={16} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Contact & Tender Details</h2>
              </div>
              {/* <div className="text-xs text-muted-foreground">
                {sectionGenerationTimes[0] ? `Generated in ${sectionGenerationTimes[0]}` : 'Generating...'}
              </div> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Name of Party:</span>
                    <span className="font-semibold text-foreground text-sm">{dataObj?.BASIC_INFORMATION?.Name_of_Party}</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Contact No.:</span>
                    <span className="font-semibold text-foreground text-sm">{dataObj?.BASIC_INFORMATION?.['Contact_No.']}</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">E-mail ID:</span>
                    <span className="font-semibold text-foreground text-sm">{dataObj?.BASIC_INFORMATION?.['E-mail_id']}</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Tender Document Signed by:</span>
                    <span className="font-semibold text-foreground text-sm">{dataObj?.BASIC_INFORMATION?.['Tender_Document_Signed_by_(name_of_the_person)']}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                 <div className="bg-muted/50 p-2 rounded-md hover:bg-muted/70 transition-colors duration-300">
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground text-sm">Udyam Certificate:</span>
                     <div className="flex items-center gap-1.5">
                     {dataObj?.BASIC_INFORMATION?.['Udyam_Certificate_number'] &&
                          dataObj?.BASIC_INFORMATION?.['Udyam_Certificate_number'] !== "Not found" ? <>
                         <CheckCircle className="text-green-500 animate-bounce-gentle" size={16} />
                         </> : <>
                         <XCircle className="text-red-500 animate-bounce-gentle" size={16} />
                       </>}
                       <span className={
                            (dataObj?.BASIC_INFORMATION?.['Udyam_Certificate_number'] &&
                            dataObj?.BASIC_INFORMATION?.['Udyam_Certificate_number'] !== "Not found")
                              ? "text-green-600 text-sm font-medium"
                              : "text-red-600 text-sm font-medium"
                          }>{dataObj?.BASIC_INFORMATION?.['Udyam_Certificate_number']}</span>
                     </div>
                   </div>
                 </div>
                <div className="bg-muted/50 p-2 rounded-md hover:bg-muted/70 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Address:</span>
                    <span className="font-semibold text-foreground text-sm">{dataObj?.BASIC_INFORMATION?.['Address']}</span>
                  </div>
                </div>
                 <div className="bg-muted/50 p-2 rounded-md hover:bg-muted/70 transition-colors duration-300">
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground text-sm">Bid Security Declaration:</span>
                     <div className="flex items-center gap-1.5">
                     {dataObj?.BASIC_INFORMATION?.['Bid_Security_Declaration_in_lieu_of_EMD'] &&
                          dataObj?.BASIC_INFORMATION?.['Bid_Security_Declaration_in_lieu_of_EMD'] !== "Not found" ? <>
                         <CheckCircle className="text-green-500 animate-bounce-gentle" size={16} />
                         </> : <>
                         <XCircle className="text-red-500 animate-bounce-gentle" size={16} />
                       </>}
                       
                       <span className={
                            (dataObj?.BASIC_INFORMATION?.['Bid_Security_Declaration_in_lieu_of_EMD'] &&
                            dataObj?.BASIC_INFORMATION?.['Bid_Security_Declaration_in_lieu_of_EMD'] !== "Not found")
                              ? "text-green-600 text-sm font-medium"
                              : "text-red-600 text-sm font-medium"
                          }>{dataObj?.BASIC_INFORMATION?.['Bid_Security_Declaration_in_lieu_of_EMD']}</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>;
      case 1:
        return <div id="section-1" className="glass-card p-4 animate-fade-in border border-border hover:border-foreground/20 transition-all duration-500 group scroll-mt-16">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-muted rounded-md group-hover:bg-foreground/10 transition-colors duration-300">
                <Award className="text-foreground" size={16} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">PQC Documents</h2>
              </div>
              {/* <div className="text-xs text-muted-foreground">
                {sectionGenerationTimes[1] ? `Generated in ${sectionGenerationTimes[1]}` : 'Generating...'}
              </div> */}
            </div>
            
            {/* Financial Criteria */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-muted/30 to-muted/20 p-4 rounded-xl mb-4 border border-border">
                <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Financial Criteria (Annual Turnover)
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This section verifies the bidder's minimum annual turnover against the required threshold for any of the last 3 preceding Financial Years (FY).
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {/* Non-MSE Bidders Card */}
                  <div className="col-span-1 w-full">
                    {/* <table className="min-w-full bg-white border border-border rounded-xl">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-center text-center px-4 py-3 text-lg font-semibold text-foreground border-b border-border">Financial Year</th>
                          <th className="text-center text-center px-4 py-3 text-lg font-semibold text-foreground border-b border-border">Annual Turnover(in Lakhs)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="">
                          <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">2020-2021</td>
                          <td className={
                            (dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2020-21_(in_Lacs)'] &&
                            dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2020-21_(in_Lacs)'] !== "Not found")
                              ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                              : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                          }>{dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2020-21_(in_Lacs)']}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">2021-2022</td>
                          <td className={
                            (dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2021-22_(in_Lacs)'] &&
                            dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2021-22_(in_Lacs)'] !== "Not found")
                              ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                              : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                          }>{dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2021-22_(in_Lacs)']}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">2022-2023</td>
                          <td className={
                            (dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2022-23_(in_Lacs)'] &&
                            dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2022-23_(in_Lacs)'] !== "Not found")
                              ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                              : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                          }>{dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2022-23_(in_Lacs)']}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">2023-2024</td>
                          <td className={
                            (dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2023-24_(in_Lacs)'] &&
                            dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2023-24_(in_Lacs)'] !== "Not found")
                              ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                              : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                          }>{dataObj?.BASIC_INFORMATION?.['Annual_Turnover_FY_2023-24_(in_Lacs)']}</td>
                        </tr>
                        
                      </tbody>
                    </table> */}
                    { dataObj?.["ANNUAL_TURNOVER_ANALYSIS_(All_available_years)"] && (
                      <div>
                        <h3>Annual Turnover Analysis (All available years):</h3>
                        {Object.keys(dataObj?.["ANNUAL_TURNOVER_ANALYSIS_(All_available_years)"]).length === 1 && dataObj?.["ANNUAL_TURNOVER_ANALYSIS_(All_available_years)"].Annual_Turnover === "Not found" ? (
                          <p>Annual Turnover: Not found</p>
                        ) : (
                          <ul>
                            {Object.entries(dataObj?.["ANNUAL_TURNOVER_ANALYSIS_(All_available_years)"]).map(([key, value]) => (
                              <li key={key}>
                                <strong>{key.replace(/_/g, " ")}:</strong> {String(value)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <div className="bg-muted/50 p-6 mt-3 rounded-2xl border-2 border-dashed border-border hover:border-solid hover:border-foreground/30 transition-all duration-500">
                      <div className="bg-muted/30 p-4 rounded-xl border border-border">
                        <p className="text-muted-foreground leading-relaxed font-medium">
                          <b>Bidder Category (MSE/Non-MSE)</b>: {dataObj?.QUALIFICATION_ANALYSIS?.['Bidder_Category_(MSE/Non-MSE)']}
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-xl border border-border mt-3">
                        <p className="text-muted-foreground leading-relaxed font-medium">
                          <b>Turnover Qualification Status</b>: {dataObj?.QUALIFICATION_ANALYSIS?.['Turnover_Qualification_Status']}
                        </p>
                      </div>
                    </div>
                  </div>

                {/* MSE Bidders Card */}
                {/* <div className="bg-gradient-to-br from-background to-muted/30 p-4 rounded-xl border-2 border-border hover:border-green-500/30 transition-all duration-500 group shadow-lg hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground">MSE Bidders</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce-gentle"></div>
                      <span className="text-sm font-medium text-green-600">Qualified</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Required Minimum</span>
                      <span className="font-bold text-foreground">₹32.80 Lacs</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bidder's Turnover</span>
                      <span className="font-bold text-green-600">₹45.20 Lacs</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Achievement</span>
                        <span className="text-green-600 font-medium">138%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out animate-scale-in" style={{
                        width: '100%'
                      }}>
                          <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Required: ₹32.80L</span>
                        <span className="text-xs text-green-600 font-medium">Achieved: ₹45.20L</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle className="text-green-500 animate-bounce-gentle" size={20} />
                      <span className="text-green-600 font-medium">Significantly Exceeds</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Experience Criteria */}
            <div className="mb-8">
                <div className="bg-muted/30 p-6 rounded-2xl mb-4 border border-border">
                  <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2 text-lg">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    Experience Criteria (Similar Works)
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    The bidder must have successfully completed similar works during the last 5 years...
                  </p>
                
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="col-span-1 w-full">
                      <table className="min-w-full bg-white border border-border rounded-xl">
                        <tbody>
                          <tr className="">
                            <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">Number of Similar Works Completed:</td>
                            <td className={
                              (dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Number_of_Similar_Works_Completed'] &&
                              dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Number_of_Similar_Works_Completed'] !== "Not found")
                                ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                                : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                            }>{dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Number_of_Similar_Works_Completed']}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">Total Value of Similar Works (in Lacs):</td>
                            <td className={
                              (dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)'] &&
                              dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)'] !== "Not found")
                                ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                                : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                            }>{dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)']}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">Similar Works Completion Period:</td>
                            <td className={
                              (dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Similar_Works_Completion_Period_(from_date_to_date)'] &&
                              dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Similar_Works_Completion_Period_(from_date_to_date)'] !== "Not found")
                                ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                                : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                            }>{dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Similar_Works_Completion_Period_(from_date_to_date)']}</td>
                          </tr>
                          {/* <tr>
                            <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-center">Definition of Similar Works Found</td>
                            <td className={
                              (dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)'] &&
                              dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)'] !== "Not found")
                                ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                                : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                            }>{dataObj?.SIMILAR_WORKS_EXPERIENCE?.['Total_Value_of_Similar_Works_(in_Lacs)']}</td>
                          </tr> */}
                          
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>

            {/* Definition of Similar Works */}
              <div className="bg-muted/50 p-6 rounded-2xl border-2 border-dashed border-border hover:border-solid hover:border-foreground/30 transition-all duration-500">
                <div className="bg-muted/30 p-4 rounded-xl border border-border">
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    <b>Similar Works Qualification Status</b>: {dataObj?.SIMILAR_WORKS_QUALIFICATION_ANALYSIS?.['Similar_Works_Qualification_Status']}
                  </p>
                </div>
              </div>
          </div>;
      case 2:
        return <div id="section-2" className="glass-card p-8 animate-fade-in border-2 border-border hover:border-foreground/20 transition-all duration-500 group scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-muted rounded-xl group-hover:bg-foreground/10 transition-colors duration-300">
                <Shield className="text-foreground" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-foreground text-lg">Other Mandatory Documents</h2>
              </div>
              {/* <div className="text-sm text-muted-foreground">
                {sectionGenerationTimes[2] ? `Generated in ${sectionGenerationTimes[2]}` : 'Generating...'}
              </div> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{
              name: "PAN",
              icon: "📄",
              status: dataObj?.BASIC_INFORMATION?.['PAN']!="Not found"?"verified":"not-verified",
              value:dataObj?.BASIC_INFORMATION?.['PAN']
            }, {
              name: "GST Registration Certificate",
              icon: "🏢",
              status: dataObj?.BASIC_INFORMATION?.['GST_Registration_Certificate_number']!="Not found"?"verified":"not-verified",
              value:dataObj?.BASIC_INFORMATION?.['GST_Registration_Certificate_number']
            }, {
              name: "PF",
              icon: "💼",
              status: dataObj?.BASIC_INFORMATION?.['PF']!="Not found"?"verified":"not-verified",
              value:dataObj?.BASIC_INFORMATION?.['PF']
            }, {
              name: "ESIC",
              icon: "🛡️",
              status: dataObj?.BASIC_INFORMATION?.['ESIC']!="Not found"?"verified":"not-verified",
              value:dataObj?.BASIC_INFORMATION?.['ESIC']
            }, {
              name: "Partnership deed or Certificate of Incorporation with Memorandum & Articles of Association",
              icon: "📋",
              status: dataObj?.BASIC_INFORMATION?.['Partnership_deed_or_Certificate_of_Incorporation_with_Memorandum_&_Power_of_Attorney_/_Board_resolution']!="Not found"?"verified":"not-verified",
              value:dataObj?.BASIC_INFORMATION?.['Partnership_deed_or_Certificate_of_Incorporation_with_Memorandum_&_Power_of_Attorney_/_Board_resolution']
            }, 
            // {
            //   name: "Power of Attorney / Board resolution (as applicable) in favour of Tender signing authority.",
            //   icon: "⚖️",
            //   status: dataObj?.BASIC_INFORMATION?.['PAN']!="Not found"?"verified":"not-verified"
            // }
            ].map((doc, index) => <div key={index} className={`bg-gradient-to-br from-background to-muted/30 p-6 rounded-2xl border border-border hover:border-${doc.status === 'verified' ? 'green' : 'red'}-500/30 transition-all duration-300 group/item hover:scale-105 transform-gpu shadow-lg hover:shadow-xl`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{doc.icon}</div>
                      {/* <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 bg-${doc.status === 'verified' ? 'green' : 'red'}-500 rounded-full animate-bounce-gentle`}></div>
                        <span className={`text-sm font-medium text-${doc.status === 'verified' ? 'green' : 'red'}-600`}>
                          {doc.status === 'verified' ? 'Verified' : 'Not Verified'}
                        </span>
                      </div> */}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground text-sm leading-relaxed line-clamp-3">{doc.name}</h3>
                      
                      <div className="flex items-center gap-2">
                        {doc.status === 'verified' ? <>
                            <CheckCircle className="text-green-500 animate-bounce-gentle group-hover/item:scale-110 transition-transform duration-300" size={18} />
                            <span className="text-sm text-green-600 font-medium">{doc.value}</span>
                          </> : <>
                            <XCircle className="text-red-500 animate-bounce-gentle group-hover/item:scale-110 transition-transform duration-300" size={18} />
                            <span className="text-sm text-red-600 font-medium">{doc.value}</span>
                          </>}
                      </div>
                      
                      {/* <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-${doc.status === 'verified' ? 'green' : 'red'}-500 to-${doc.status === 'verified' ? 'green' : 'red'}-400 rounded-full transition-all duration-1000 ease-out`} style={{
                      width: doc.status === 'verified' ? '100%' : '0%'
                    }}>
                          <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>;
      case 3:
        return <div id="section-3" className="glass-card p-8 animate-fade-in border-2 border-border hover:border-foreground/20 transition-all duration-500 group scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-muted rounded-xl group-hover:bg-foreground/10 transition-colors duration-300">
                <FileCheck className="text-foreground" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-foreground text-lg">Declarations</h2>
              </div>
              {/* <div className="text-sm text-muted-foreground">
                {sectionGenerationTimes[3] ? `Generated in ${sectionGenerationTimes[3]}` : 'Generating...'}
              </div> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-3">
              <table className="min-w-full bg-white border border-border rounded-xl">
                <tbody>
                  {[{
                  id: "1",
                  text: "ACCEPTANCE OF ALL TERMS & CONDITIONS OF TENDERER",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Acceptance_of_all_terms_&_conditions_of_tenderer']
                }, {
                  id: "2",
                  text: "DECLARATION ON NCLT/NCLAT/DRT/DRAT/COURT RECEIVERSHIP/LIQUIDATION",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Declaration_on_NCLT/NCLAT/DRT/DRAT/COURT']
                }, {
                  id: "3",
                  text: "CERTIFICATE FOR BIDDERS FROM A COUNTRY WHICH SHARES A LAND BORDER WITH INDIA",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Certificate_for_bidders_from_a_country_which_shares_a_land_border_with_India']
                }, {
                  id: "4",
                  text: "UNDERTAKINGS AND DECLARATIONS FOR NON-TAMPERING OF DATA",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Undertakings_and_declarations_for_non-tampering_of_tender']
                }, {
                  id: "5",
                  text: "DECLARATION OF BLACKLISTING / HOLIDAY LISTING",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Declaration_of_blacklisting_/_holiday_listing']
                }, {
                  id: "6",
                  text: "DECLARATION \"A\", \"B\", \"C\" & \"D\"",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Declaration_"A",_"B",_"C"_&_"D"']
                }, {
                  id: "7",
                  text: "UNDERTAKING FOR BUSINESS TRANSACTION STATUS OF BIDDERS",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Undertaking_for_business_transaction_status_of_bidders']
                }, {
                  id: "8",
                  text: "PARTICULARS OF BIDDER FIRM",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Particulars_of_bidder_firm']
                }, {
                  id: "9",
                  text: "UNDERTAKING ON NO MULTIPLE BIDDING",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Undertaking_on_no_multiple_bidding']
                }, {
                  id: "10a",
                  text: "Confirmation for bidder's status/category for eligibility of bidding",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.["Confirmation_for_bidder's_status/category_for_eligibility_of_bidding"]
                }, {
                  id: "10b",
                  text: "Confirmation for bidder's purchase preference",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.["Confirmation_for_bidder's_purchase_preference"]
                }, {
                  id: "10c",
                  text: "Undertaking (to be submitted by Bidder) – Bid Stage",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Undertaking_(to_be_submitted_by_bidder)_–_Bid_Stage']
                }, {
                  id: "11",
                  text: "CONFIRMATION ON APPLICABILITY OF MSE",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Confirmation_on_applicability_of_MSE_(Yes/No,_yes_when_it_is_has_Udyam_Certificate)']
                }, {
                  id: "12",
                  text: "Preference selected on GeM Portal",
                  status: "completed",
                  value:dataObj?.BASIC_INFORMATION?.['Preference_selected_on_GeM_Portal']
                }].map((declaration, index) => 
                        <tr className="">
                          <td className="px-4 py-2 text-muted-foreground font-medium border-b border-border text-left">{declaration?.text}:</td>
                          <td className={
                            (declaration?.value && declaration?.value !== "Not found")
                              ? "px-4 py-2 font-bold border-b border-border text-center text-green-600"
                              : "text-red-600 px-4 py-2 font-bold border-b border-border text-center"
                          }>{declaration?.value}</td>
                        </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>;
      case 4:
        return <div id="section-4" className="glass-card p-8 animate-fade-in border-2 border-border hover:border-foreground/20 transition-all duration-500 group scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-muted rounded-xl group-hover:bg-foreground/10 transition-colors duration-300">
                <Eye className="text-foreground" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-foreground text-lg">Final Observations</h2>
              </div>
              {/* <div className="text-sm text-muted-foreground">
                {sectionGenerationTimes[4] ? `Generated in ${sectionGenerationTimes[4]}` : 'Generating...'}
              </div> */}
            </div>
            
            <div className="space-y-6">
              {/* TCC Observation Section - On top */}
              {/* TQC Status Section - At bottom */}
              {(() => {
              //const tqcStatus = getTQCStatus();
              //let tqcStatus={icon:'',color:''};
              let tqcStatus=dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Not found' && dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Disqualified'?{icon:'CheckCircle',color:'green'}:dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']=='Not found' || dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']=='Disqualified'?{icon:'XCircle',color:'red'}:{icon:'',color:''};
              const StatusIcon = tqcStatus.icon === 'CheckCircle' ? CheckCircle : tqcStatus.icon === 'XCircle' ? XCircle : Loader2;
              return <div className={`bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-2xl border-2 ${tqcStatus.color === 'green' ? 'border-green-500/30' : tqcStatus.color === 'red' ? 'border-red-500/30' : 'border-border'}`}>
                  <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${tqcStatus.color === 'green' ? 'bg-green-500' : tqcStatus.color === 'red' ? 'bg-red-500' : 'bg-foreground'}`}></div>
                    TQC STATUS  {dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']}
                  </h3>
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${tqcStatus.color === 'green' ? 'bg-green-500/20' : tqcStatus.color === 'red' ? 'bg-red-500/20' : 'bg-muted/50'} flex-shrink-0`}>
                      <StatusIcon className={`${tqcStatus.color === 'green' ? 'text-green-500' : tqcStatus.color === 'red' ? 'text-red-500' : 'text-muted-foreground'} ${tqcStatus.icon === 'Loader2' ? 'animate-spin' : 'animate-bounce-gentle'}`} size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 ${dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Not found' && dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Disqualified' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                        {dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Not found' && dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Disqualified'?'QUALIFIED':'DISQUALIFIED'}
                      </div>
                      
                      {/* <p className={`leading-relaxed font-medium ${tqcStatus.color === 'green' ? 'text-green-600' : tqcStatus.color === 'red' ? 'text-red-600' : 'text-muted-foreground'}`}>
                        Bidder is technically dis-qualified due to reason mentioned above
                      </p> */}
                    </div>
                  </div>
                </div>;
              })()}
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-2xl border border-border">
                <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
                  TCC OBSERVATION
                </h3>
                {(() => {
                //const tqcStatus = getTQCStatus();
                let tqcStatus=dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Not found' && dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']!='Disqualified'?{icon:'CheckCircle',color:'green'}:dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']=='Not found' || dataObj?.FINAL_QUALIFICATION?.['Overall_Qualification_Status']=='Disqualified'?{icon:'XCircle',color:'red'}:{icon:'',color:''};
                if (tqcStatus.color === "red") {
                  return <p className="text-red-600 leading-relaxed font-medium">
                      {dataObj?.FINAL_QUALIFICATION?.['Reason_for_Disqualification_(if_applicable)']}
                    </p>;
                } else {
                  return <p className="text-muted-foreground leading-relaxed">
                       {dataObj?.FINAL_QUALIFICATION?.['Reason_for_Disqualification_(if_applicable)']}
                    </p>;
                }
              })()}
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (state === 'initialLoading' || state === 'loading') {
      setProgress(0);
      const totalDuration = 240000; // 2 minutes in ms
      const intervalMs = 100;
      const increment = 100 / (totalDuration / intervalMs);
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        setProgress(prev => {
          const next = Math.min(100, prev + increment);
          if (next >= 100) {
            clearInterval(interval);
          }
          return next;
        });
      }, intervalMs);
      return () => clearInterval(interval);
    }
  }, [state]);
  if (state === 'initial') {
    return <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/10"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({
          length: 20
        }).map((_, i) => <div key={i} className="absolute w-2 h-2 bg-foreground/10 rounded-full animate-float-particle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }} />)}
        </div>
        
        {/* Large Floating Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-muted/30 rounded-full blur-3xl animate-float-large"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-muted/20 rounded-full blur-3xl animate-float-large-delay"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-foreground/5 rounded-full blur-2xl animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-muted/25 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-32 right-1/4 w-16 h-16 bg-foreground/5 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-muted/20 animate-pulse-slow"></div>
        <div className="absolute top-2/3 right-10 w-20 h-20 bg-foreground/8 rounded-full animate-bounce-very-slow"></div>
        
        {/* Moving Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-slide-horizontal"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-muted-foreground/15 to-transparent animate-slide-horizontal-reverse"></div>
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-foreground/8 to-transparent animate-slide-vertical"></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-foreground/20 rounded-full blur-sm animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-muted-foreground/25 rounded-full blur-sm animate-pulse-glow-delay"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
                      <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 hover:translate-x-1">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Evaluation
            </button>
          
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="animate-fade-in space-y-8 max-w-2xl">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6 animate-bounce-gentle">
                  <FileCheck size={32} className="text-foreground" />
                </div>
                <h1 className="text-5xl font-bold mb-4 text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  Tender Evaluation Checklist
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Comprehensive automated evaluation system for tender documents and compliance verification
                </p>
              </div>
              
              <button onClick={startEvaluation} className="group relative bg-foreground text-background hover:bg-foreground/90 px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl transform-gpu">
                <span className="relative z-10 flex items-center gap-3">
                  <Eye size={20} />
                  Start Checklist
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-foreground to-muted-foreground rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  if (state === 'initialLoading') {
    return <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
                      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft size={20} />
              Back to Evaluation
            </button>
          
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="space-y-6">
              {/* Simple Circular Loader */}
              <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  Generating Comparative Statement
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we process the documents...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-background to-muted/5"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-muted/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/4 right-20 w-32 h-32 bg-foreground/5 rounded-full blur-3xl animate-float-delay-1"></div>
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-muted/15 rounded-full blur-2xl animate-float-delay-2"></div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-foreground/8 rounded-full blur-3xl animate-float-delay-3"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_theme(colors.foreground)_1px,_transparent_0)] bg-[length:24px_24px]"></div>
      </div>
      
      {/* Fixed Header during loading and completion */}
      {(state === 'loading' || state === 'completed') && <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-50 animate-fade-in shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
                          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Evaluation
            </button>
              
              {/* Progress Bar or Completion Status */}
              {state === 'loading' ? <div className="flex items-center gap-4">
                  <div className="relative">
                    <Loader2 className="animate-spin text-foreground" size={16} />
                  </div>
                  <div className="w-32 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-foreground transition-all duration-1000 ease-out rounded-full" style={{
                width: `${progress}%`
              }}></div>
                  </div>
                  <span className="text-xs text-foreground font-medium min-w-fit">
                    {currentLoadingIndex + 1}/{sectionNames.length}
                  </span>
                </div> : <div className="flex items-center gap-4 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-sm font-medium text-green-600">Evaluation Complete</span>
                  </div>
                  {/* <div className="text-right">
                    <p className="text-xs text-muted-foreground">Generated in (Total: {calculateTotalTime()})</p>
                    <p className="text-sm font-bold text-foreground">{completionTime}</p>
                  </div> */}
                </div>}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Tender Evaluation Checklist
                </h1>
                <p className="text-sm text-muted-foreground">
                  {state === 'loading' ? 'Real-time automated evaluation in progress' : 'Evaluation completed successfully'}
                </p>
              </div>
              
              {state === 'loading' && <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {loadingMessages[currentLoadingIndex]}
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    {Math.round(progress)}% Complete
                  </p>
                </div>}
              
              {state === 'completed' && <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">
                    All sections verified ✓
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5 sections evaluated
                  </p>
                </div>}
            </div>
          </div>
        </div>}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Add top padding when loading or completed to account for fixed header */}
        <div className={state === 'loading' || state === 'completed' ? 'pt-32' : ''}>

          {/* Sections */}
          
          {/* Show all 5 loaders initially, then replace with content */}
          <div className="space-y-8">
            {[0, 1, 2, 3, 4].map(sectionIndex => <div key={sectionIndex}>
                {!completedSections.includes(sectionIndex) ? <div className="glass-card p-8 border-2 border-border animate-fade-in">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-8 h-8 border-2 border-muted rounded-full animate-spin border-t-foreground"></div>
                        <div className="absolute inset-0 w-8 h-8 border-2 border-transparent rounded-full animate-pulse border-t-blue-500"></div>
                      </div>
                      <span className="text-lg font-medium text-foreground">Generating {sectionNames[sectionIndex]}</span>
                    </div>
                    
                    {/* Skeleton content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-2/3" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="space-y-3 p-4 rounded-xl border border-border">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>)}
                      </div>
                    </div>
                  </div> : renderSection(sectionIndex)}
              </div>)}
          </div>

        </div>
      </div>
    </div>;
};
export default ComparativeStatement;