import { useState } from "react";
import { ConspiracyBoard } from "@/components/game/ConspiracyBoard";
import { CaseSelect } from "@/components/game/CaseSelect";
import { allCases } from "@/data/cases";
import type { CaseData } from "@/types/game";

const Index = () => {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);

  if (selectedCase) {
    return (
      <ConspiracyBoard
        caseData={selectedCase}
        onBackToMenu={() => setSelectedCase(null)}
      />
    );
  }

  return (
    <CaseSelect
      cases={allCases}
      onSelectCase={setSelectedCase}
    />
  );
};

export default Index;
