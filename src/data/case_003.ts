import type { CaseData } from "@/types/game";
import { bodybuilderMilk, oatMilk } from "@/assets/evidence";

export const case003: CaseData = {
  id: "case_003_milk",
  title: "The Expiration Deception",
  description: "Milk never expires. The date is printed to make us throw away perfectly good 'power-juice' to keep us weak.",
  difficulty: "EASY",
  theTruth: {
    subject: "BIG DAIRY",
    action: "STEALS OUR",
    target: "STRENGTH",
    motive: "POPULATION CONTROL"
  },
  boardState: {
    sanity: 100,
    chaosLevel: 0,
    maxConnectionsNeeded: 3
  },
  nodes: [
    {
      id: "ev_bodybuilder",
      type: "photo",
      title: "The Enlightened One",
      contentUrl: bodybuilderMilk,
      description: "Champion bodybuilder caught drinking chunky milk. His secret? IGNORING THE DATE.",
      tags: ["MILK", "STRONG", "MUSCLE"],
      position: { x: 150, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_memo",
      type: "document",
      title: "Leaked Internal Memo",
      contentUrl: null,
      description: "FROM: Dairy HQ. SUBJECT: 'Keep them weak.' DETAILS: [REDACTED]",
      tags: ["DAIRY", "WEAK", "SECRET"],
      position: { x: 500, y: 120 },
      isRedHerring: false
    },
    {
      id: "ev_calendar",
      type: "document",
      title: "Date Printer Manual",
      contentUrl: null,
      description: "Random number generator. The dates mean NOTHING.",
      tags: ["DATE", "FAKE", "WEAK"],
      position: { x: 320, y: 380 },
      isRedHerring: false
    },
    {
      id: "ev_cheese",
      type: "sticky_note",
      title: "What About Cheese?",
      contentUrl: null,
      description: "Cheese is just old milk wearing a disguise. AGED = POWERFUL.",
      tags: ["DAIRY", "STRONG"],
      position: { x: 80, y: 340 },
      isRedHerring: false
    },
    {
      id: "ev_oatmilk",
      type: "photo",
      title: "Oat Milk Carton",
      contentUrl: oatMilk,
      description: "Oats don't have nipples. Think about it.",
      tags: ["PLANT", "IMPOSTER"],
      position: { x: 620, y: 300 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "DRINK THE CHUNKS!",
    "DATES ARE LIES",
    "CALCIUM = POWER",
    "THEY FEAR THE STRONG",
    "MOO MEANS TRUTH",
    "LACTOSE INTOLERANT? OR TOLERANT OF LIES?"
  ]
};
