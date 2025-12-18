import type { CaseData } from "@/types/game";

// DEBUG TEST CASE - Testing the new Zustand engine
// Win condition: Combine A+B to get THE TRUTH, then connect to Node C
// NEW: Tests timeline (blue thread) and UV encryption features
export const testCase: CaseData = {
  id: 'test-001',
  title: 'DEBUG PROTOCOL',
  description: 'Combine A+B, then connect the result to C. Test blue thread for timeline order!',
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
  requiredTags: ['truth', 'final_piece'],
  nodes: [
    {
      id: 'node-a',
      type: 'sticky_note',
      title: 'Node A (1997)',
      contentUrl: null,
      description: 'Combine me with Node B!',
      tags: ['A'],
      position: { x: 100, y: 100 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['dummy_a'],
      date: '1997-03-15', // Timeline: Earliest event
    },
    {
      id: 'node-b',
      type: 'sticky_note',
      title: 'Node B (1999)',
      contentUrl: null,
      description: 'Combine me with Node A!',
      tags: ['B'],
      position: { x: 100, y: 200 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['dummy_b'],
      date: '1999-08-22', // Timeline: Later event
    },
    {
      id: 'node-c',
      type: 'sticky_note',
      title: 'Node C (2001)',
      contentUrl: null,
      description: 'Connect the combined result to me!',
      tags: ['C'],
      position: { x: 400, y: 150 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ['final_piece'],
      date: '2001-01-01', // Timeline: Latest event
    },
    // UV-ENCRYPTED NODE: Test the requiresUV feature
    {
      id: 'ev_secret_diary',
      type: 'document',
      title: 'Empty Diary?',
      contentUrl: null,
      description: 'Looks empty. Just blank pages... or is it?',
      tags: ['SECRET', 'HIDDEN'],
      position: { x: 300, y: 300 },
      isRedHerring: false,
      isCritical: false,
      truthTags: ['motive'],
      date: '1997-10-14',
      requiresUV: true, // Must use UV light before connecting!
      hiddenText: 'THE TRUTH IS WRITTEN IN INVISIBLE INK',
    },
    // RED HERRING - Junk to test binning
    {
      id: 'junk-note',
      type: 'sticky_note',
      title: 'Random Grocery List',
      contentUrl: null,
      description: 'Milk, eggs, bread... totally irrelevant.',
      tags: ['JUNK'],
      position: { x: 500, y: 100 },
      isRedHerring: true,
      // No truthTags = junk
    },
  ],
  combinations: [
    {
      itemA: 'node-a',
      itemB: 'node-b',
      resultNodes: [
        {
          id: 'the-truth',
          type: 'sticky_note',
          title: 'THE TRUTH',
          contentUrl: null,
          description: 'You discovered the truth by combining Node A and Node B!',
          tags: ['truth', 'combined'],
          position: { x: 100, y: 150 },
          isRedHerring: false,
          isCritical: true,
          truthTags: ['truth'],
          date: '2000-06-15', // Combined result has a date too
        }
      ],
      unlockText: 'THE TRUTH REVEALED!'
    }
  ],
  scribblePool: ['IT WORKS!', 'CONNECTED!', 'SUCCESS!', 'TIMELINE CORRECT!', 'UV REVEALED!']
};
