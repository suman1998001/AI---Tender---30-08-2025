
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantHeaderProps {
  onExport: () => void;
  onBulkAction: (action: string) => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ApplicantHeader = ({
  onExport,
  onBulkAction,
  searchTerm,
  onSearchChange
}: ApplicantHeaderProps) => {
  // This component is now minimal as the functionality has been moved to ApplicantFilters
  return null;
};
