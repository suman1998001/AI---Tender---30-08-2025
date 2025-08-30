import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  FileText, 
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Target
} from "lucide-react";
import type { RFP } from "@/pages/RFPManagement";

interface HaulageContractDetailsProps {
  rfp: RFP;
}

export const HaulageContractDetails = ({ rfp }: HaulageContractDetailsProps) => {
  // Only show this component for the Haulage Contract RFP
  if (rfp.id !== '6') {
    return null;
  }

  const contractDetails = {
    issuer: "Government Corporation Limited",
    location: "Central Office Complex, Block A, Business District, Mumbai (MH)",
    objective: "To engage a contractor to provide 16 personnel (7 semi-skilled, 9 unskilled) to carry out daily housekeeping, maintenance, administrative, and utility tasks across both locations.",
    contractDuration: "3 years from issuance of work order (early termination possible based on performance)",
    estimatedValue: "₹1,25,00,000 (Approx.)",
    securityDeposit: "3% of contract value",
    bidValidity: "120 days from techno-commercial bid opening"
  };

  const scopeOfWork = [
    "Cleaning & sanitation (offices, toilets, staircases, balconies, terraces, passages, furniture, carpets, equipment)",
    "Pantry & guest services (tea/snacks preparation & service)",
    "Operation & refueling of diesel generator set",
    "Support for meetings and office errands (post, courier, bookings)",
    "Garden maintenance, water tank cleaning, garbage disposal",
    "Administrative support: data punching, filing, document movement"
  ];

  const manpowerRequirement = {
    semiSkilled: {
      count: 7,
      duties: [
        "Maintain office records, punch data, manage files",
        "Operate printers, scanners, handle post/courier",
        "Maintain DG set logs & fuel collection from RO",
        "Liaisoning with govt. departments and bill payment"
      ]
    },
    unskilled: {
      count: 9,
      duties: [
        "Cleaning, dusting, mopping, sweeping, waste disposal",
        "Pantry duties, guest refreshments, meeting setups",
        "Support loading/unloading, shifting materials"
      ]
    }
  };

  const prequalificationCriteria = {
    nonMSE: {
      singleWO: "₹32.15 Lacs",
      twoWO: "₹25.72 Lacs",
      threeWO: "₹19.29 Lacs",
      turnover: "₹38.58 Lacs"
    },
    MSE: {
      singleWO: "₹27.33 Lacs",
      twoWO: "₹21.86 Lacs",
      threeWO: "₹16.40 Lacs",
      turnover: "₹32.80 Lacs"
    }
  };

  const penalties = [
    { violation: "Misconduct", amount: "₹2,000" },
    { violation: "Manpower shortage per day", amount: "₹500 per person" },
    { violation: "No supervisor deployed", amount: "₹15,000/month" },
    { violation: "Safety violation (up to fatality)", amount: "Up to ₹10 lakhs" }
  ];

  return (
    <div className="space-y-6">
      {/* Contract Overview */}
      <Card className="rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Building2 className="h-6 w-6 text-red-accent" />
            Contract Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-red-accent mt-1" />
                <div>
                  <p className="font-medium text-black">Issuer</p>
                  <p className="text-sm text-muted-foreground">{contractDetails.issuer}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-accent mt-1" />
                <div>
                  <p className="font-medium text-black">Location</p>
                  <p className="text-sm text-muted-foreground">{contractDetails.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-red-accent mt-1" />
                <div>
                  <p className="font-medium text-black">Duration</p>
                  <p className="text-sm text-muted-foreground">{contractDetails.contractDuration}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <IndianRupee className="h-5 w-5 text-red-accent mt-1" />
                <div>
                  <p className="font-medium text-black">Estimated Value</p>
                  <p className="text-sm text-muted-foreground">{contractDetails.estimatedValue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-red-accent mt-1" />
                <div>
                  <p className="font-medium text-black">Security Deposit</p>
                  <p className="text-sm text-muted-foreground">{contractDetails.securityDeposit}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-red-accent mt-1" />
                <div>
                  <p className="font-medium text-black">Bid Validity</p>
                  <p className="text-sm text-muted-foreground">{contractDetails.bidValidity}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          
          <div>
            <p className="font-medium text-black mb-2">Objective</p>
            <p className="text-sm text-muted-foreground">{contractDetails.objective}</p>
          </div>
        </CardContent>
      </Card>

      {/* Scope of Work */}
      <Card className="rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileText className="h-6 w-6 text-red-accent" />
            Scope of Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {scopeOfWork.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <p className="text-sm text-black">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manpower Requirement */}
      <Card className="rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Users className="h-6 w-6 text-red-accent" />
            Manpower Requirement (Total: 16 Personnel)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semi-Skilled */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Semi-Skilled ({manpowerRequirement.semiSkilled.count})
                </Badge>
              </div>
              <div className="space-y-2">
                {manpowerRequirement.semiSkilled.duties.map((duty, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-black">{duty}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Unskilled */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Unskilled ({manpowerRequirement.unskilled.count})
                </Badge>
              </div>
              <div className="space-y-2">
                {manpowerRequirement.unskilled.duties.map((duty, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm text-black">{duty}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-qualification Criteria */}
      <Card className="rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Target className="h-6 w-6 text-red-accent" />
            Pre-qualification Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Non-MSE */}
            <div>
              <h3 className="font-semibold text-black mb-3">Non-MSE Requirements</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Single Work Order:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.nonMSE.singleWO}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Two Work Orders:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.nonMSE.twoWO}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Three Work Orders:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.nonMSE.threeWO}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Annual Turnover:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.nonMSE.turnover}</span>
                </div>
              </div>
            </div>

            {/* MSE */}
            <div>
              <h3 className="font-semibold text-black mb-3">MSE Requirements</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Single Work Order:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.MSE.singleWO}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Two Work Orders:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.MSE.twoWO}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Three Work Orders:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.MSE.threeWO}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Annual Turnover:</span>
                  <span className="text-sm font-medium text-black">{prequalificationCriteria.MSE.turnover}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Penalties & Risk Management */}
      <Card className="rounded-[15px] border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <AlertTriangle className="h-6 w-6 text-red-accent" />
            Penalties & Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {penalties.map((penalty, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-black">{penalty.violation}</span>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                  {penalty.amount}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Additional Notes</p>
                <p className="text-xs text-yellow-700 mt-1">
                  GST will be added to all penalties. Work timing: 08:00 AM to 05:00 PM daily including holidays if required.
                  Supervisor mandatory for coordination and quality control.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};