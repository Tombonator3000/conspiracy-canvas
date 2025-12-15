import type { CaseData } from "@/types/game";
import { lonelySock, tidePod } from "@/assets/evidence";

export const case002: CaseData = {
  id: "case_002_socks",
  title: "The Great Sock Conspiracy",
  description: "Washing machines don't eat socks. They teleport them to an underground civilization that uses them as currency.",
  difficulty: "EASY",
  theTruth: {
    subject: "WASHING MACHINES",
    action: "TELEPORT SOCKS TO",
    target: "HOLLOW EARTH",
    motive: "UNDERGROUND ECONOMY"
  },
  boardState: {
    sanity: 100,
    chaosLevel: 0,
    maxConnectionsNeeded: 3
  },
  nodes: [
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_lonely_sock",
      type: "photo",
      title: "The Survivor",
      contentUrl: lonelySock,
      description: "A lone sock. Its partner vanished without a trace. Last seen entering the drum.",
      tags: ["COTTON", "LOST", "FABRIC"],
      position: { x: 120, y: 80 },
      isRedHerring: false,
      hiddenText: "TELEPORT RESIDUE",
      isCritical: true
    },
    {
      id: "ev_receipt",
      type: "document",
      title: "Damning Evidence",
      contentUrl: null,
      description: "Receipt showing 100 pairs purchased. Only 47 remain. WHERE ARE THE OTHERS?",
      tags: ["CLOTHES", "MISSING", "PURCHASE"],
      position: { x: 480, y: 100 },
      isRedHerring: false,
      hiddenText: "53 GONE = 53%",
      isCritical: true
    },
    {
      id: "ev_seismograph",
      type: "document",
      title: "Seismic Anomaly",
      contentUrl: null,
      description: "Readings show vibrations beneath laundry rooms worldwide. Something is down there.",
      tags: ["EARTH", "HOLE", "MISSING"],
      position: { x: 300, y: 350 },
      isRedHerring: false,
      hiddenText: "4.5 KM DEEP",
      isCritical: true
    },
    {
      id: "ev_lint",
      type: "sticky_note",
      title: "Lint Trap Analysis",
      contentUrl: null,
      description: "If socks are destroyed, where's the evidence? THE LINT IS A LIE!",
      tags: ["FABRIC", "TRAP"],
      position: { x: 100, y: 380 },
      isRedHerring: false,
      isCritical: false
    },

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions
    {
      id: "ev_tide_pod",
      type: "photo",
      title: "Tide Pod",
      contentUrl: tidePod,
      description: "Looks delicious. Probably unrelated.",
      tags: ["SNACK", "FORBIDDEN"],
      position: { x: 600, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_dryer_sheet",
      type: "sticky_note",
      title: "Used Dryer Sheet",
      contentUrl: null,
      description: "Smells like lavender. Definitely hiding something.",
      tags: ["SMELL", "SOFTENER"],
      position: { x: 200, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_instruction_manual",
      type: "document",
      title: "Washing Machine Manual",
      contentUrl: null,
      description: "Chapter 7: 'Maintenance'. No mention of sock portals. SUSPICIOUS.",
      tags: ["INSTRUCTIONS", "APPLIANCE"],
      position: { x: 550, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_coin",
      type: "sticky_note",
      title: "Lost Quarter",
      contentUrl: null,
      description: "Found in the drum. Distraction or clue? Probably distraction.",
      tags: ["MONEY", "METAL"],
      position: { x: 420, y: 250 },
      isRedHerring: true
    },
    
    // Pure Trash
    {
      id: "ev_pizza_flyer",
      type: "document",
      title: "Pizza Delivery Flyer",
      contentUrl: null,
      description: "2 for 1 Tuesdays. Was in my pocket. Irrelevant.",
      tags: ["FOOD", "DEAL"],
      position: { x: 650, y: 400 },
      isRedHerring: true
    },
    {
      id: "ev_button",
      type: "sticky_note",
      title: "Random Button",
      contentUrl: null,
      description: "Fell off something. Don't remember what. Not a sock.",
      tags: ["PLASTIC", "SMALL"],
      position: { x: 350, y: 150 },
      isRedHerring: true
    },
    {
      id: "ev_receipt_coffee",
      type: "sticky_note",
      title: "Coffee Receipt",
      contentUrl: null,
      description: "Double espresso. $4.50. I need to focus better.",
      tags: ["CAFFEINE", "EXPENSE"],
      position: { x: 180, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_band_flyer",
      type: "document",
      title: "Local Band Flyer",
      contentUrl: null,
      description: "'THE MISSING SOCKS' playing at Joe's Bar. Coincidence?!",
      tags: ["MUSIC", "EVENT"],
      position: { x: 500, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_laundry_card",
      type: "sticky_note",
      title: "Laundry Card",
      contentUrl: null,
      description: "$2.75 remaining. Not enough for answers.",
      tags: ["PAYMENT", "CARD"],
      position: { x: 70, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_pen",
      type: "sticky_note",
      title: "Broken Pen",
      contentUrl: null,
      description: "Blue ink. Leaked everywhere. Evidence destroyed? No, just messy.",
      tags: ["WRITING", "BROKEN"],
      position: { x: 620, y: 120 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "WHERE DO THEY GO?!",
    "CHECK THE DRUM!",
    "PORTAL ACTIVATED",
    "THEY KNOW WE KNOW",
    "SOCK MARKET CRASH",
    "UNDERGROUND FASHION",
    "53% MISSING!",
    "THE HOLE TRUTH"
  ]
};
