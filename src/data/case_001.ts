import type { CaseData } from "@/types/game";
import { pigeonSuspicious, powerlinesBirds, catSuspicious } from "@/assets/evidence";

export const case001: CaseData = {
  id: "case_001_birds",
  title: "Operation: Feathered Battery",
  description: "Local reports of pigeons acting strangely near power lines. Are they just birds, or something more sinister?",
  difficulty: "TUTORIAL",
  theTruth: {
    subject: "PIGEONS",
    action: "ARE RECHARGING ON",
    target: "POWER LINES",
    motive: "TO SPY ON US"
  },
  boardState: {
    sanity: 100,
    chaosLevel: 0,
    maxConnectionsNeeded: 3
  },
  nodes: [
    {
      id: "ev_pigeon_photo",
      type: "photo",
      title: "Suspicious Bird",
      contentUrl: pigeonSuspicious,
      description: "Photo taken at 3 AM. Subject has not blinked for 2 hours.",
      tags: ["DRONE", "SURVEILLANCE", "EYES"],
      position: { x: 150, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_schematic",
      type: "document",
      title: "Leaked Patent #9921",
      contentUrl: null,
      description: "Blueprint for 'Autonomous Avian Data Collector'. CLASSIFIED.",
      tags: ["DRONE", "GOVERNMENT", "BATTERY"],
      position: { x: 500, y: 120 },
      isRedHerring: false
    },
    {
      id: "ev_powerline",
      type: "photo",
      title: "Power Line Anomaly",
      contentUrl: powerlinesBirds,
      description: "Energy spikes detected whenever flocks land here. COINCIDENCE?",
      tags: ["BATTERY", "ELECTRICITY", "CITY"],
      position: { x: 320, y: 380 },
      isRedHerring: false
    },
    {
      id: "ev_grocery_list",
      type: "sticky_note",
      title: "Mom's Shopping List",
      contentUrl: null,
      description: "Bread, Milk, Birdseed... wait, BIRDSEED?!",
      tags: ["FOOD", "SHOPPING"],
      position: { x: 80, y: 350 },
      isRedHerring: true
    },
    {
      id: "ev_cat_picture",
      type: "photo",
      title: "Mr. Whiskers",
      contentUrl: catSuspicious,
      description: "Just a cute cat. Or is it? Those eyes...",
      tags: ["FUR", "PET"],
      position: { x: 620, y: 340 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "BIRDS AREN'T REAL!",
    "WHERE ARE THE BATTERIES?!",
    "THEY CHARGE AT NIGHT",
    "LOOK AT THE BEAK!",
    "IT'S ALL CONNECTED",
    "COINCIDENCE?!",
    "WAKE UP SHEEPLE",
    "FOLLOW THE WIRES"
  ]
};
