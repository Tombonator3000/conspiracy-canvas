import type { CaseData } from "@/types/game";

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
    {
      id: "ev_lonely_sock",
      type: "photo",
      title: "The Survivor",
      contentUrl: null,
      description: "A lone sock. Its partner vanished without a trace. Last seen entering the drum.",
      tags: ["COTTON", "LOST", "FABRIC"],
      position: { x: 120, y: 80 },
      isRedHerring: false
    },
    {
      id: "ev_receipt",
      type: "document",
      title: "Damning Evidence",
      contentUrl: null,
      description: "Receipt showing 100 pairs purchased. Only 47 remain. WHERE ARE THE OTHERS?",
      tags: ["CLOTHES", "MISSING", "PURCHASE"],
      position: { x: 480, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_seismograph",
      type: "document",
      title: "Seismic Anomaly",
      contentUrl: null,
      description: "Readings show vibrations beneath laundry rooms worldwide. Something is down there.",
      tags: ["EARTH", "HOLE", "MISSING"],
      position: { x: 300, y: 350 },
      isRedHerring: false
    },
    {
      id: "ev_lint",
      type: "sticky_note",
      title: "Lint Trap Analysis",
      contentUrl: null,
      description: "If socks are destroyed, where's the evidence? THE LINT IS A LIE!",
      tags: ["FABRIC", "TRAP"],
      position: { x: 100, y: 380 },
      isRedHerring: false
    },
    {
      id: "ev_tide_pod",
      type: "photo",
      title: "Tide Pod",
      contentUrl: null,
      description: "Looks delicious. Probably unrelated.",
      tags: ["SNACK", "FORBIDDEN"],
      position: { x: 600, y: 280 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "WHERE DO THEY GO?!",
    "CHECK THE DRUM!",
    "PORTAL ACTIVATED",
    "THEY KNOW WE KNOW",
    "SOCK MARKET CRASH",
    "UNDERGROUND FASHION"
  ]
};
