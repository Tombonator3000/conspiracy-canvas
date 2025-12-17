import type { CaseData } from "@/types/game";
import { pigeonSuspicious, powerlinesBirds } from "@/assets/evidence";

// CASE 001: Operation Feathered Battery
// Migrated to new engine format with combinations embedded in case
export const CASE_001: CaseData = {
  id: 'case-001',
  title: 'Operation: Feathered Battery',
  description: 'Local reports of pigeons acting strangely near power lines. Are they just birds, or something more sinister?',
  difficulty: 'TUTORIAL',
  theTruth: {
    subject: 'PIGEONS',
    action: 'ARE RECHARGING ON',
    target: 'POWER LINES',
    motive: 'TO SPY ON US'
  },
  boardState: {
    sanity: 100,
    chaosLevel: 0,
    maxConnectionsNeeded: 1
  },

  // THE WIN CONDITION
  requiredTags: ['subject', 'proof', 'location'],

  // THE NODES
  nodes: [
    // 1. THE SUBJECT (Part of the combine)
    {
      id: 'ev_bird',
      type: 'photo',
      title: 'Suspicious Bird',
      contentUrl: pigeonSuspicious,
      description: 'Photo taken at 3 AM. Subject has not blinked for 2 hours.',
      tags: ['DRONE', 'SURVEILLANCE', 'EYES'],
      position: { x: 150, y: 100 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['subject'] // Essential Tag
    },
    // 2. THE PROOF (Part of the combine)
    {
      id: 'ev_patent',
      type: 'document',
      title: 'Leaked Patent #9921',
      contentUrl: null,
      description: 'Blueprint for "Autonomous Avian Data Collector". CLASSIFIED.',
      tags: ['DRONE', 'GOVERNMENT', 'BATTERY'],
      position: { x: 450, y: 150 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['proof'] // Essential Tag
    },
    // 3. THE LOCATION (The target for the final link)
    {
      id: 'ev_powerline',
      type: 'photo',
      title: 'Power Line Anomaly',
      contentUrl: powerlinesBirds,
      description: 'Energy spikes detected whenever flocks land here.',
      tags: ['BATTERY', 'ELECTRICITY', 'CITY'],
      position: { x: 300, y: 400 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['location'] // Essential Tag
    },
    // 4. JUNK / RED HERRINGS (No truth tags)
    {
      id: 'ev_coffee',
      type: 'sticky_note',
      title: 'Coffee Receipt',
      contentUrl: null,
      description: 'Just a latte. $6.75. Why is this even here?',
      tags: ['COFFEE', 'RECEIPT'],
      position: { x: 600, y: 100 },
      isRedHerring: true,
      truthTags: []
    }
  ],

  // THE RECIPES (Embedded in the case now)
  combinations: [
    {
      itemA: 'ev_bird',
      itemB: 'ev_patent',
      unlockText: 'SYSTEMS MATCH CONFIRMED',
      resultNodes: [
        {
          id: 'ev_ocular_specs',
          type: 'document',
          title: 'Ocular Specifications',
          contentUrl: null,
          description: 'The bird eyes match the patent camera specs perfectly.',
          tags: ['SURVEILLANCE', 'EYES', 'DRONE'],
          position: { x: 300, y: 125 },
          isRedHerring: false,
          isCritical: true,
          // truthTags will be AUTO-INHERITED by the store ('subject' + 'proof')
          truthTags: []
        }
      ]
    }
  ],

  scribblePool: [
    'BIRDS AREN\'T REAL!',
    'WHERE ARE THE BATTERIES?!',
    'THEY CHARGE AT NIGHT',
    'LOOK AT THE BEAK!',
    'IT\'S ALL CONNECTED',
    'COINCIDENCE?!',
    'WAKE UP SHEEPLE',
    'FOLLOW THE WIRES',
    'I KNEW IT!',
    'THE PATTERN IS CLEAR'
  ]
};

// Export as LEVEL_DATA array for the new engine
export const LEVEL_DATA = [CASE_001];

// Also export allCases for backwards compatibility with existing UI
export const allCases: CaseData[] = LEVEL_DATA;

export const getCaseById = (id: string): CaseData | undefined => {
  return allCases.find((c) => c.id === id);
};

export const getCasesByDifficulty = (difficulty: string): CaseData[] => {
  return allCases.filter((c) => c.difficulty === difficulty);
};
