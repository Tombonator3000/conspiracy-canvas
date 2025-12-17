import { case001 } from "./case_001";
import { case002 } from "./case_002";
import { case003 } from "./case_003";
import { case004 } from "./case_004";
import { case005 } from "./case_005";
import { case006 } from "./case_006";
import { case007 } from "./case_007";
import { case008 } from "./case_008";
import { case009 } from "./case_009";
import { case010 } from "./case_010";
import { case011 } from "./case_011";
import { case012 } from "./case_012";
import type { CaseData } from "@/types/game";

// DEBUG TEST CASE - Testing the new Zustand engine
export const TEST_CASE: CaseData = {
  id: 'test-001',
  title: 'DEBUG PROTOCOL',
  description: 'Testing the new engine. Connect A to B.',
  difficulty: 'TUTORIAL',
  theTruth: {
    subject: 'NODE A',
    action: 'CONNECTS TO',
    target: 'NODE B',
    motive: 'FOR TESTING'
  },
  boardState: {
    sanity: 100,
    chaosLevel: 0,
    maxConnectionsNeeded: 1
  },
  requiredTags: ['test'],
  nodes: [
    {
      id: 'node-a',
      type: 'sticky_note',
      title: 'Node A',
      contentUrl: null,
      description: 'Connect me to Node B!',
      tags: ['A', 'test'],
      position: { x: 100, y: 100 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['test']
    },
    {
      id: 'node-b',
      type: 'sticky_note',
      title: 'Node B',
      contentUrl: null,
      description: 'Connect me to Node A!',
      tags: ['B', 'test'],
      position: { x: 400, y: 100 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['test']
    },
  ],
  combinations: [
    {
      itemA: 'node-a',
      itemB: 'node-b',
      resultNodes: [
        {
          id: 'node-c',
          type: 'sticky_note',
          title: 'THE TRUTH',
          contentUrl: null,
          description: 'You discovered the truth by combining Node A and Node B!',
          tags: ['truth', 'combined'],
          position: { x: 250, y: 100 },
          isRedHerring: false,
          isCritical: true,
          truthTags: ['truth']
        }
      ],
      unlockText: 'THE TRUTH REVEALED!'
    }
  ],
  scribblePool: ['IT WORKS!', 'CONNECTED!', 'SUCCESS!']
};

export const allCases: CaseData[] = [
  TEST_CASE,
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
];

export const getCaseById = (id: string): CaseData | undefined => {
  return allCases.find((c) => c.id === id);
};

export const getCasesByDifficulty = (difficulty: string): CaseData[] => {
  return allCases.filter((c) => c.difficulty === difficulty);
};

export { case001, case002, case003, case004, case005, case006, case007, case008, case009, case010, case011, case012 };
