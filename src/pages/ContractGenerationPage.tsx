import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ContractGeneration from "@/components/contract/ContractGeneration";

const ContractGenerationPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/contract-management");
  };

  return (
    <DashboardLayout>
      <ContractGeneration onBack={handleBack} />
    </DashboardLayout>
  );
};

export default ContractGenerationPage; 