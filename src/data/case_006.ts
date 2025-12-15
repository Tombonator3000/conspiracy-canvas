import type { CaseData } from "@/types/game";
import { lightbulbOff, eclipse, telescope } from "@/assets/evidence";

export const case006: CaseData = {
  id: "case_006_moon",
  title: "The Solar Flip",
  description: "There aren't two celestial bodies. The Sun just turns off at night and flips around. 'Moon craters' are actually ventilation holes.",
  difficulty: "HARD",
  theTruth: {
    subject: "NASA",
    action: "FLIPS AROUND",
    target: "THE SUN",
    motive: "BUDGET SAVINGS"
  },
  boardState: {
    sanity: 75,
    chaosLevel: 2,
    maxConnectionsNeeded: 5
  },
  nodes: [
    {
      id: "ev_lightbulb",
      type: "photo",
      title: "Proof of Concept",
      contentUrl: lightbulbOff,
      description: "A lightbulb turned off. Dark on one side, used to be bright. JUST LIKE THE 'MOON'.",
      tags: ["LIGHT", "OFF", "FLIP"],
      position: { x: 100, y: 80 },
      isRedHerring: false
    },
    {
      id: "ev_budget",
      type: "document",
      title: "NASA Budget Analysis",
      contentUrl: null,
      description: "Line item: 'Extra celestial bodies' - CROSSED OUT. They're cutting costs!",
      tags: ["MONEY", "SPACE", "CUT"],
      position: { x: 500, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_eclipse",
      type: "photo",
      title: "The Glitch",
      contentUrl: eclipse,
      description: "Solar eclipse = the switch mechanism malfunctioning mid-rotation. CAUGHT IN THE ACT.",
      tags: ["SKY", "FLIP", "ERROR"],
      position: { x: 280, y: 200 },
      isRedHerring: false
    },
    {
      id: "ev_craters",
      type: "document",
      title: "Crater Analysis",
      contentUrl: null,
      description: "Moon 'craters' are perfectly circular. Natural impact? OR MANUFACTURED VENTS?",
      tags: ["HOLE", "VENT", "SPACE"],
      position: { x: 550, y: 330 },
      isRedHerring: false
    },
    {
      id: "ev_phases",
      type: "sticky_note",
      title: "Moon Phases = Dimmer Switch",
      contentUrl: null,
      description: "Half moon = sun at 50% brightness during flip. THEY'RE TESTING!",
      tags: ["LIGHT", "OFF", "TEST"],
      position: { x: 120, y: 380 },
      isRedHerring: false
    },
    {
      id: "ev_telescope",
      type: "photo",
      title: "Amateur Telescope",
      contentUrl: telescope,
      description: "Can see the moon clearly. Looks real. TOO REAL. SUSPICIOUS.",
      tags: ["LENS", "FAKE"],
      position: { x: 400, y: 420 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "LOOK UP! OR DON'T!",
    "SUN OFF = MOON ON",
    "WHERE'S THE POWER BILL?",
    "CRATERS = COOLING HOLES",
    "NASA = NEED ANOTHER SUN? ABSOLUTELY-NOT",
    "THE FLIP HAPPENS AT DUSK",
    "WEREWOLVES KNOW THE TRUTH"
  ]
};
