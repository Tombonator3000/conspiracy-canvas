import { case001 } from "./case_001";
import { case002 } from "./case_002";
import { case003 } from "./case_003";
import { case004 } from "./case_004";
import { case005 } from "./case_005";
import { case006 } from "./case_006";
import { case007 } from "./case_007";
import type { CaseData } from "@/types/game";

export const allCases: CaseData[] = [
  case001,
  case002,
  case003,
  case004,
  case005,
  case006,
  case007,
];

export const getCaseById = (id: string): CaseData | undefined => {
  return allCases.find((c) => c.id === id);
};

export const getCasesByDifficulty = (difficulty: string): CaseData[] => {
  return allCases.filter((c) => c.difficulty === difficulty);
};

export { case001, case002, case003, case004, case005, case006, case007 };
