// Main cases aggregator
import { testCase } from "./test_case";
import { case001 } from "./case_001_birds";
import { case002 } from "./case_002_socks";
import { case003 } from "./case_003_milk";
import { case004 } from "./case_004_cloud";
import { case005 } from "./case_005_cats";
import { case006 } from "./case_006_moon";
import { case007 } from "./case_007_titanic";
import { case008 } from "./case_008_microwave";
import { case009 } from "./case_009_elvis";
import { case010 } from "./case_010_ufo";
import { case011 } from "./case_011_bigfoot";
import { case012 } from "./case_012_reptilians";
import { case013 } from "./case_013_anchor";
import type { CaseData } from "@/types/game";

// Re-export TEST_CASE for backwards compatibility
export const TEST_CASE = testCase;

export const allCases: CaseData[] = [
  testCase,
  case001,
  case002,
  case003,
  case004,
  case005,
  case006,
  case007,
  case008,
  case009,
  case010,
  case011,
  case012,
  case013,
];

export const getCaseById = (id: string): CaseData | undefined => {
  return allCases.find((c) => c.id === id);
};

export const getCasesByDifficulty = (difficulty: string): CaseData[] => {
  return allCases.filter((c) => c.difficulty === difficulty);
};

// Re-export individual cases
export { testCase, case001, case002, case003, case004, case005, case006, case007, case008, case009, case010, case011, case012, case013 };
