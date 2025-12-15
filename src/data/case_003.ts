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
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_bodybuilder",
      type: "photo",
      title: "The Enlightened One",
      contentUrl: bodybuilderMilk,
      description: "Champion bodybuilder caught drinking chunky milk. His secret? IGNORING THE DATE.",
      tags: ["MILK", "STRONG", "MUSCLE"],
      position: { x: 150, y: 100 },
      isRedHerring: false,
      hiddenText: "6 WEEKS EXPIRED",
      isCritical: true
    },
    {
      id: "ev_memo",
      type: "document",
      title: "Leaked Internal Memo",
      contentUrl: null,
      description: "FROM: Dairy HQ. SUBJECT: 'Keep them weak.' DETAILS: [REDACTED]",
      tags: ["DAIRY", "WEAK", "SECRET"],
      position: { x: 500, y: 120 },
      isRedHerring: false,
      hiddenText: "PROJECT CALCIUM FEAR",
      isCritical: true
    },
    {
      id: "ev_calendar",
      type: "document",
      title: "Date Printer Manual",
      contentUrl: null,
      description: "Random number generator. The dates mean NOTHING.",
      tags: ["DATE", "FAKE", "WEAK"],
      position: { x: 320, y: 380 },
      isRedHerring: false,
      hiddenText: "ALGORITHM: RANDOM()",
      isCritical: true
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

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions
    {
      id: "ev_oatmilk",
      type: "photo",
      title: "Oat Milk Carton",
      contentUrl: oatMilk,
      description: "Oats don't have nipples. Think about it.",
      tags: ["PLANT", "IMPOSTER"],
      position: { x: 620, y: 300 },
      isRedHerring: true
    },
    {
      id: "ev_yogurt",
      type: "sticky_note",
      title: "Yogurt Container",
      contentUrl: null,
      description: "Greek yogurt. 0% fat, 100% suspicious.",
      tags: ["CULTURED", "THICK"],
      position: { x: 200, y: 250 },
      isRedHerring: true
    },
    {
      id: "ev_cow_photo",
      type: "photo",
      title: "Cow Photo",
      contentUrl: null,
      description: "This cow looks guilty. Of what? Unclear.",
      tags: ["MOO", "FARM"],
      position: { x: 450, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_lactaid",
      type: "document",
      title: "Lactaid Advertisement",
      contentUrl: null,
      description: "Pills to help digest dairy. OR pills to suppress the truth?",
      tags: ["MEDICINE", "DIGEST"],
      position: { x: 580, y: 180 },
      isRedHerring: true
    },

    // Pure Trash
    {
      id: "ev_cereal_box",
      type: "document",
      title: "Empty Cereal Box",
      contentUrl: null,
      description: "Frosted Flakes. No milk left for them. Tragic.",
      tags: ["BREAKFAST", "TONY"],
      position: { x: 100, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_grocery_list",
      type: "sticky_note",
      title: "Grocery List",
      contentUrl: null,
      description: "Eggs, Bread, Milk (??), Bananas. Circled milk. Why?",
      tags: ["SHOPPING", "LIST"],
      position: { x: 350, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_receipt_grocery",
      type: "sticky_note",
      title: "Grocery Receipt",
      contentUrl: null,
      description: "2% milk $4.99. Why not 3%? What happened to the 1%?",
      tags: ["PURCHASE", "PERCENT"],
      position: { x: 650, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_spilled_milk",
      type: "photo",
      title: "Spilled Milk Photo",
      contentUrl: null,
      description: "Crime scene or accident? The carpet knows.",
      tags: ["SPILL", "CARPET"],
      position: { x: 250, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_vitamin_d",
      type: "document",
      title: "Vitamin D Article",
      contentUrl: null,
      description: "Sun gives vitamin D. Milk gives vitamin D. SUN = MILK?!",
      tags: ["VITAMIN", "NUTRITION"],
      position: { x: 520, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_fridge_magnet",
      type: "sticky_note",
      title: "Fridge Magnet",
      contentUrl: null,
      description: "'Got Milk?' propaganda magnet. FREE with purchase.",
      tags: ["MAGNET", "SLOGAN"],
      position: { x: 180, y: 180 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "DRINK THE CHUNKS!",
    "DATES ARE LIES",
    "CALCIUM = POWER",
    "THEY FEAR THE STRONG",
    "MOO MEANS TRUTH",
    "LACTOSE INTOLERANT? OR TOLERANT OF LIES?",
    "EXPIRATION IS FAKE",
    "BIG DAIRY WINS AGAIN"
  ]
};
