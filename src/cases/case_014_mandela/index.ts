import type { CaseData } from "@/types/game";

export const case014: CaseData = {
  id: "case_014_mandela",
  title: "Operation: False Memory",
  description: "Why do millions remember the Berenstain Bears as 'Berenstein'? Why does everyone remember a Monopoly Man monocle that never existed? CERN's Hadron Collider merged timelines in 2012, and your memories are PROOF.",
  difficulty: "MEDIUM",
  theTruth: {
    subject: "CERN",
    action: "MERGED TIMELINES",
    target: "IN 2012",
    motive: "TO HIDE THE TRUTH"
  },
  boardState: {
    sanity: 80,
    chaosLevel: 1,
    maxConnectionsNeeded: 4
  },
  requiredTags: ["THE_MEMORY", "THE_PROOF", "THE_TIMELINE", "THE_CULPRIT"],
  nodes: [
    // ===== REAL EVIDENCE =====
    {
      id: "ev_berenstain",
      type: "photo",
      title: "Berenstain Bears Book",
      contentUrl: null,
      description: "Current books spell it 'BerenstAIN'. But you REMEMBER 'BerenstEIN'. Your childhood wasn't a lie - REALITY was rewritten!",
      tags: ["MEMORY", "SPELLING", "CHILDHOOD"],
      position: { x: 100, y: 100 },
      isRedHerring: false,
      hiddenText: "TIMELINE A: -STEIN",
      isCritical: true,
      truthTags: ["THE_MEMORY"]
    },
    {
      id: "ev_berenstein",
      type: "document",
      title: "Forum Post: 'I Remember Berenstein!'",
      contentUrl: null,
      description: "Thousands of people share the SAME false memory. Mass delusion? Or mass timeline displacement?",
      tags: ["WITNESS", "MEMORY", "INTERNET"],
      position: { x: 400, y: 80 },
      isRedHerring: false,
      hiddenText: "4,847 WITNESSES",
      isCritical: true,
      truthTags: ["THE_MEMORY", "THE_PROOF"]
    },
    {
      id: "ev_cern_photo",
      type: "photo",
      title: "CERN Hadron Collider",
      contentUrl: null,
      description: "They said they were looking for the Higgs Boson. They FOUND a way to merge parallel universes. The power surge in 2012 wasn't an accident.",
      tags: ["SCIENCE", "CERN", "PARTICLE"],
      position: { x: 250, y: 280 },
      isRedHerring: false,
      hiddenText: "TIMELINE MERGE: ACTIVE",
      isCritical: true,
      truthTags: ["THE_CULPRIT", "THE_TIMELINE"]
    },
    {
      id: "ev_timeline_2012",
      type: "document",
      title: "Timeline Merge Theory",
      contentUrl: null,
      description: "December 21, 2012 - The Mayans predicted the 'end of the world'. What ended was TIMELINE SEPARATION. Two realities became one.",
      tags: ["THEORY", "2012", "MAYAN"],
      position: { x: 550, y: 250 },
      isRedHerring: false,
      hiddenText: "CONVERGENCE POINT",
      isCritical: true,
      truthTags: ["THE_TIMELINE", "THE_PROOF"]
    },
    {
      id: "ev_monopoly_man",
      type: "photo",
      title: "Monopoly Man (No Monocle)",
      contentUrl: null,
      description: "He NEVER had a monocle. But you can picture it perfectly. Because in YOUR original timeline, he DID.",
      tags: ["MEMORY", "GAME", "MONOCLE"],
      position: { x: 120, y: 380 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ["THE_MEMORY", "THE_PROOF"]
    },
    {
      id: "ev_fruit_loops",
      type: "photo",
      title: "'Froot Loops' Box",
      contentUrl: null,
      description: "It's spelled 'FROOT' not 'FRUIT'. Your memories of 'Fruit Loops' are from the old timeline. The merge changed everything.",
      tags: ["MEMORY", "FOOD", "SPELLING"],
      position: { x: 480, y: 400 },
      isRedHerring: false,
      truthTags: ["THE_MEMORY"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_old_diary",
      type: "document",
      title: "Old Diary Entry",
      contentUrl: null,
      description: "'Dear diary, today I ate cereal.' Very specific. Could be from ANY timeline. USELESS.",
      tags: ["DIARY", "PERSONAL"],
      position: { x: 300, y: 150 },
      isRedHerring: true
    },
    {
      id: "ev_shopping_list",
      type: "sticky_note",
      title: "Old Shopping List",
      contentUrl: null,
      description: "'Milk, eggs, bread'. The basics. No timeline-specific items detected.",
      tags: ["LIST", "MUNDANE"],
      position: { x: 650, y: 150 },
      isRedHerring: true
    },
    {
      id: "ev_movie_ticket",
      type: "document",
      title: "Avatar 2 Ticket Stub",
      contentUrl: null,
      description: "Ticket from 2022. Movies exist in all timelines. NOT RELEVANT.",
      tags: ["MOVIE", "TICKET"],
      position: { x: 200, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_newspaper",
      type: "document",
      title: "2012 Newspaper",
      contentUrl: null,
      description: "'World Does Not End'. Correct. The world MERGED instead. The headline writer didn't know.",
      tags: ["NEWS", "2012"],
      position: { x: 400, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_calendar",
      type: "sticky_note",
      title: "Mayan Calendar Replica",
      contentUrl: null,
      description: "Tourist souvenir. Says 'End Date: 12/21/2012'. The Mayans were WARNING us about the merge!",
      tags: ["CALENDAR", "MAYAN"],
      position: { x: 600, y: 350 },
      isRedHerring: true
    },
    {
      id: "ev_physics_book",
      type: "document",
      title: "Quantum Physics Textbook",
      contentUrl: null,
      description: "Chapter 7: 'Parallel Universes - A Theoretical Framework'. THEORETICAL my eye. CERN proved it.",
      tags: ["SCIENCE", "BOOK"],
      position: { x: 50, y: 250 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "WHICH TIMELINE AM I FROM?",
    "THE BEARS LIED TO US",
    "CERN KNOWS",
    "DECEMBER 21 2012",
    "MEMORIES DON'T LIE",
    "REALITY IS BROKEN",
    "THE MERGE WAS REAL",
    "I REMEMBER DIFFERENTLY",
    "TWO WORLDS ONE REALITY",
    "THE MONOCLE EXISTED"
  ],
  combinations: [
    {
      itemA: "ev_berenstain",
      itemB: "ev_berenstein",
      unlockText: "TWO SPELLINGS... TWO TIMELINES!",
      hint: "COMPARE THE MEMORIES",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_spelling_proof",
          type: "document",
          title: "The Spelling Convergence",
          contentUrl: null,
          description: "Statistical analysis: 68% remember 'STEIN', 32% remember 'STAIN'. The 68% are from Timeline A. The merge favored Timeline B's spelling.",
          tags: ["SPELLING", "PROOF", "STATISTICS"],
          position: { x: 280, y: 90 },
          isRedHerring: false,
          hiddenText: "TIMELINE A = 68%",
          isCritical: true,
          truthTags: ["THE_MEMORY", "THE_PROOF"]
        }
      ]
    },
    {
      itemA: "ev_cern_photo",
      itemB: "ev_timeline_2012",
      unlockText: "CERN OPENED THE PORTAL!",
      hint: "WHEN DID IT HAPPEN?",
      difficulty: "medium",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_cern_confession",
          type: "document",
          title: "CERN Internal Memo (Leaked)",
          contentUrl: null,
          description: "'Operation Convergence successful. Timeline integration complete. Recommend memory suppression protocols.' THEY KNEW. THEY PLANNED IT.",
          tags: ["CERN", "MEMO", "LEAK"],
          position: { x: 400, y: 270 },
          isRedHerring: false,
          hiddenText: "CLASSIFIED: OMEGA",
          isCritical: true,
          truthTags: ["THE_CULPRIT", "THE_TIMELINE", "THE_PROOF"]
        }
      ]
    },
    {
      itemA: "ev_monopoly_man",
      itemB: "ev_fruit_loops",
      unlockText: "THE PATTERN IS CLEAR!",
      hint: "WHAT ELSE CHANGED?",
      difficulty: "easy",
      bonusCredibility: 200,
      resultNodes: [
        {
          id: "ev_memory_catalog",
          type: "document",
          title: "False Memory Catalog",
          contentUrl: null,
          description: "Monocle: GONE. Froot spelling: CHANGED. Berenstain: ALTERED. Jif/Jiffy: INCONSISTENT. These aren't coincidences - they're MERGE ARTIFACTS.",
          tags: ["MEMORY", "CATALOG", "PATTERN"],
          position: { x: 300, y: 390 },
          isRedHerring: false,
          isCritical: false,
          truthTags: ["THE_MEMORY"]
        }
      ]
    }
  ]
};
