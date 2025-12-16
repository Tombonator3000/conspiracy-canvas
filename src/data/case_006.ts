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
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_lightbulb",
      type: "photo",
      title: "Proof of Concept",
      contentUrl: lightbulbOff,
      description: "A lightbulb turned off. Dark on one side, used to be bright. JUST LIKE THE 'MOON'.",
      tags: ["LIGHT", "OFF", "FLIP"],
      position: { x: 100, y: 80 },
      isRedHerring: false,
      hiddenText: "60W = SUN POWER",
      isCritical: true
    },
    {
      id: "ev_budget",
      type: "document",
      title: "NASA Budget Analysis",
      contentUrl: null,
      description: "Line item: 'Extra celestial bodies' - CROSSED OUT. They're cutting costs!",
      tags: ["MONEY", "SPACE", "CUT"],
      position: { x: 500, y: 100 },
      isRedHerring: false,
      hiddenText: "-$400B SAVINGS",
      isCritical: true
    },
    {
      id: "ev_eclipse",
      type: "photo",
      title: "The Glitch",
      contentUrl: eclipse,
      description: "Solar eclipse = the switch mechanism malfunctioning mid-rotation. CAUGHT IN THE ACT.",
      tags: ["SKY", "FLIP", "ERROR", "SPACE"],
      position: { x: 280, y: 200 },
      isRedHerring: false,
      hiddenText: "FLIP ERROR 404",
      isCritical: true
    },
    {
      id: "ev_craters",
      type: "document",
      title: "Crater Analysis",
      contentUrl: null,
      description: "Moon 'craters' are perfectly circular. Natural impact? OR MANUFACTURED VENTS?",
      tags: ["HOLE", "VENT", "SPACE"],
      position: { x: 550, y: 330 },
      isRedHerring: false,
      hiddenText: "HEAT EXHAUST",
      isCritical: true
    },
    {
      id: "ev_phases",
      type: "sticky_note",
      title: "Moon Phases = Dimmer Switch",
      contentUrl: null,
      description: "Half moon = sun at 50% brightness during flip. THEY'RE TESTING!",
      tags: ["LIGHT", "OFF", "TEST"],
      position: { x: 120, y: 380 },
      isRedHerring: false,
      isCritical: true
    },

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions
    {
      id: "ev_telescope",
      type: "photo",
      title: "Amateur Telescope",
      contentUrl: telescope,
      description: "Can see the moon clearly. Looks real. TOO REAL. SUSPICIOUS.",
      tags: ["LENS", "FAKE"],
      position: { x: 400, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_star_chart",
      type: "document",
      title: "Star Chart",
      contentUrl: null,
      description: "Shows constellations. Stars don't flip. OR DO THEY?!",
      tags: ["STARS", "MAP"],
      position: { x: 620, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_astronaut_photo",
      type: "photo",
      title: "Astronaut Selfie",
      contentUrl: null,
      description: "Taken on 'moon'. Background suspiciously smooth. Green screen?",
      tags: ["SPACE", "PHOTO"],
      position: { x: 200, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_moon_rock",
      type: "sticky_note",
      title: "Moon Rock Label",
      contentUrl: null,
      description: "From museum gift shop. $12.99. 'Real' moon rock. Sure.",
      tags: ["SOUVENIR", "FAKE"],
      position: { x: 450, y: 250 },
      isRedHerring: true
    },

    // Pure Trash
    {
      id: "ev_sunscreen",
      type: "sticky_note",
      title: "Sunscreen Bottle",
      contentUrl: null,
      description: "SPF 50. Protects from 'sun'. But which side?!",
      tags: ["PROTECTION", "UV"],
      position: { x: 650, y: 380 },
      isRedHerring: true
    },
    {
      id: "ev_flashlight",
      type: "sticky_note",
      title: "Broken Flashlight",
      contentUrl: null,
      description: "Doesn't turn on. Just like the sun at night. PROOF?",
      tags: ["LIGHT", "BROKEN"],
      position: { x: 100, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_calendar",
      type: "document",
      title: "Calendar Page",
      contentUrl: null,
      description: "Full moon marked. Who decides this? NASA. SUSPICIOUS.",
      tags: ["DATE", "SCHEDULE"],
      position: { x: 300, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_night_light",
      type: "sticky_note",
      title: "Kids Night Light",
      contentUrl: null,
      description: "Moon-shaped. Plugs into wall. Just like the REAL MOON?!",
      tags: ["LIGHT", "PLUG"],
      position: { x: 500, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_tide_chart",
      type: "document",
      title: "Tide Schedule",
      contentUrl: null,
      description: "Moon controls tides. Or does GRAVITY? Who's controlling gravity?!",
      tags: ["WATER", "GRAVITY"],
      position: { x: 350, y: 350 },
      isRedHerring: true
    },
    {
      id: "ev_werewolf_book",
      type: "document",
      title: "Werewolf Fiction Novel",
      contentUrl: null,
      description: "Full moon transforms werewolves. Fiction? OR DOCUMENTED CASES?",
      tags: ["FICTION", "WOLF"],
      position: { x: 200, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_sundial",
      type: "photo",
      title: "Sundial Photo",
      contentUrl: null,
      description: "Ancient time-telling device. They KNEW about the sun back then too.",
      tags: ["TIME", "ANCIENT"],
      position: { x: 650, y: 480 },
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
    "WEREWOLVES KNOW THE TRUTH",
    "ONE ORBS TWO FACES",
    "DAYLIGHT SAVINGS = FLIP MAINTENANCE"
  ],
  combinations: [
    {
      itemA: "ev_lightbulb",
      itemB: "ev_eclipse",
      unlockText: "ECLIPSE = FLIP MALFUNCTION!",
      hint: "WHEN DOES IT GLITCH?",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_flip_diagram",
          type: "document",
          title: "Flip Mechanism Diagram",
          contentUrl: null,
          description: "Schematic showing sun/moon as two sides of same disc. Eclipse = rotation stuck at 50%.",
          tags: ["FLIP", "SPACE", "ERROR"],
          position: { x: 350, y: 150 },
          isRedHerring: false,
          hiddenText: "MOTOR: FAILING",
          isCritical: true
        }
      ]
    },
    {
      itemA: "ev_budget",
      itemB: "ev_craters",
      unlockText: "THE VENTS ARE FOR HEAT DISSIPATION!",
      hint: "WHY DOES IT NEED HOLES?",
      difficulty: "medium",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_cooling_system",
          type: "document",
          title: "Thermal Management Report",
          contentUrl: null,
          description: "Budget line: 'Crater maintenance - $2.3B annually'. They're maintaining the COOLING SYSTEM!",
          tags: ["VENT", "MONEY", "SPACE"],
          position: { x: 450, y: 250 },
          isRedHerring: false,
          hiddenText: "TEMP: 5778K",
          isCritical: false
        }
      ]
    },
    {
      itemA: "ev_cooling_system",
      itemB: "ev_phases",
      unlockText: "PHASES = DIMMER SWITCH CALIBRATION!",
      hint: "WHY THE BRIGHTNESS CHANGES?",
      difficulty: "hard",
      bonusCredibility: 400,
      resultNodes: [
        {
          id: "ev_dimmer_controls",
          type: "document",
          title: "Celestial Control Panel",
          contentUrl: null,
          description: "Leaked NASA control room photo. Panel shows: BRIGHTNESS (0-100%), FLIP SPEED, CRATER VENT STATUS.",
          tags: ["FLIP", "LIGHT", "SPACE"],
          position: { x: 380, y: 350 },
          isRedHerring: false,
          hiddenText: "OPERATOR: ARMSTRONG",
          isCritical: true
        }
      ]
    },
    {
      itemA: "ev_dimmer_controls",
      itemB: "ev_werewolf_book",
      unlockText: "WEREWOLVES ARE THE OPERATORS!",
      hint: "WHO CONTROLS THE MOON?",
      difficulty: "hard",
      bonusCredibility: 500,
      resultNodes: [
        {
          id: "ev_final_truth",
          type: "document",
          title: "The Final Truth",
          contentUrl: null,
          description: "Werewolves aren't affected BY the moon. They OPERATE it. Full moon = their shift. They've been hiding in plain sight!",
          tags: ["FLIP", "SPACE", "OFF"],
          position: { x: 300, y: 420 },
          isRedHerring: false,
          hiddenText: "HOWL = PASSWORD",
          isCritical: true
        }
      ]
    }
  ]
};
