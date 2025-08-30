import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, IndianRupee, Activity } from "lucide-react";
import type { Applicant } from "@/pages/ApplicantTracking";
interface AIStatsPanelProps {
  applicant: Applicant;
}
export const AIStatsPanel = ({
  applicant
}: AIStatsPanelProps) => {
  // Mock AI stats - in real app this would come from API
  const aiStats = {
    modelName: "MSTRL",
    modelVersion: "2024.1.15",
    tokenUsage: 12458,
    energyConsumption: "0.023 kWh",
    tokenBalance: 87542,
    processingTime: "2.4s"
  };
  return;
};