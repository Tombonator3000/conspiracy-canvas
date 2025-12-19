import type { CaseData } from "@/types/game";

// Evidence images
import imgDuplicateCat from "./evidence/duplicate_cat.jpg";
import imgElonMusk from "./evidence/elon_musk.jpg";
import imgFogRender from "./evidence/fog_render.jpg";
import imgServerRoom from "./evidence/server_room.jpg";
import imgNeuralink from "./evidence/neuralink.jpg";
import imgPhysicsGlitch from "./evidence/physics_glitch.jpg";
import imgTangledCables from "./evidence/tangled_cables.jpg";

export const case015: CaseData = {
  id: "case_015_simulation",
  title: "Operation: Ctrl+Alt+Reality",
  description: "Deja vu. Glitches in reality. NPCs who repeat the same phrases. Elon Musk says there's a 'one in billions' chance we're NOT in a simulation. The evidence is all around us - if you know where to look.",
  difficulty: "HARD",
  theTruth: {
    subject: "REALITY",
    action: "IS A SIMULATION RUN BY",
    target: "ADVANCED AI",
    motive: "TO FARM CONSCIOUSNESS"
  },
  boardState: {
    sanity: 65,
    chaosLevel: 2,
    maxConnectionsNeeded: 5
  },
  requiredTags: ["THE_GLITCH", "THE_EVIDENCE", "THE_ARCHITECT", "THE_PURPOSE"],
  nodes: [
    // ===== REAL EVIDENCE =====
    {
      id: "ev_matrix_glitch",
      type: "photo",
      title: "Duplicated Cat Photo",
      contentUrl: imgDuplicateCat,
      description: "Two identical cats, same pose, same moment, same PIXEL GLITCH. The Matrix is real and it's getting lazy with copy-paste.",
      tags: ["GLITCH", "CAT", "DUPLICATE"],
      position: { x: 80, y: 100 },
      isRedHerring: false,
      hiddenText: "ENTITY_ID: DUPLICATE",
      isCritical: true,
      truthTags: ["THE_GLITCH", "THE_EVIDENCE"]
    },
    {
      id: "ev_elon_quote",
      type: "document",
      title: "Musk Interview Transcript",
      contentUrl: imgElonMusk,
      description: "'The odds we're in base reality is one in billions.' - Elon Musk, 2016. He has access to Tesla's AI. HE KNOWS.",
      tags: ["QUOTE", "MUSK", "PROBABILITY"],
      position: { x: 400, y: 80 },
      isRedHerring: false,
      hiddenText: "NEURALINK = PATCH",
      isCritical: true,
      truthTags: ["THE_EVIDENCE", "THE_ARCHITECT"]
    },
    {
      id: "ev_deja_vu",
      type: "sticky_note",
      title: "Deja Vu Report #4,847",
      contentUrl: null,
      description: "Subject reports 'living the same moment twice'. Explanation: The simulation reloaded from a save state. You're experiencing a TIME LOOP BUG.",
      tags: ["GLITCH", "MEMORY", "REPORT"],
      position: { x: 250, y: 280 },
      isRedHerring: false,
      hiddenText: "SAVE_STATE: CORRUPTED",
      isCritical: true,
      truthTags: ["THE_GLITCH"]
    },
    {
      id: "ev_render_distance",
      type: "photo",
      title: "Fog Hiding 'Unrendered' Area",
      contentUrl: imgFogRender,
      description: "Why does fog appear at consistent distances? RENDER DISTANCE. The simulation doesn't load what you can't see to save processing power.",
      tags: ["FOG", "RENDER", "DISTANCE"],
      position: { x: 550, y: 200 },
      isRedHerring: false,
      hiddenText: "MAX_RENDER: 5000m",
      isCritical: true,
      truthTags: ["THE_EVIDENCE", "THE_GLITCH"]
    },
    {
      id: "ev_npc_behavior",
      type: "document",
      title: "NPC Behavior Analysis",
      contentUrl: null,
      description: "Why do strangers say the same things? 'Nice weather!' 'Working hard or hardly working?' They're RUNNING ON SCRIPTS.",
      tags: ["NPC", "BEHAVIOR", "SCRIPT"],
      position: { x: 120, y: 400 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ["THE_EVIDENCE"]
    },
    {
      id: "ev_server_room",
      type: "photo",
      title: "Mysterious Data Center",
      contentUrl: imgServerRoom,
      description: "Located at coordinates that don't appear on any map. Power consumption: 47 terawatts. That's enough to run... A UNIVERSE SIMULATION.",
      tags: ["SERVER", "POWER", "SECRET"],
      position: { x: 480, y: 350 },
      isRedHerring: false,
      hiddenText: "IP: 127.0.0.1",
      isCritical: true,
      requiresUV: true,
      truthTags: ["THE_ARCHITECT", "THE_PURPOSE"]
    },
    {
      id: "ev_physics_bug",
      type: "document",
      title: "Ball Phased Through Wall",
      contentUrl: imgPhysicsGlitch,
      description: "Witnessed: Object passed through solid matter. Physics engine bug. The collision detection failed momentarily.",
      tags: ["PHYSICS", "BUG", "CLIPPING"],
      position: { x: 300, y: 450 },
      isRedHerring: false,
      truthTags: ["THE_GLITCH", "THE_EVIDENCE"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_coffee_receipt",
      type: "document",
      title: "Coffee Receipt",
      contentUrl: null,
      description: "Starbucks. Grande. $5.47. Coffee exists in simulations too. NOT EVIDENCE.",
      tags: ["RECEIPT", "COFFEE"],
      position: { x: 200, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_parking_ticket",
      type: "document",
      title: "Parking Fine",
      contentUrl: null,
      description: "$75 for expired meter. Even simulations have consequences. IRRELEVANT.",
      tags: ["TICKET", "FINE"],
      position: { x: 650, y: 100 },
      isRedHerring: true
    },
    {
      id: "ev_birthday_card",
      type: "sticky_note",
      title: "Birthday Card",
      contentUrl: null,
      description: "'Happy Birthday!' - Generic NPC message, but could also be a real human. INCONCLUSIVE.",
      tags: ["CARD", "BIRTHDAY"],
      position: { x: 600, y: 300 },
      isRedHerring: true
    },
    {
      id: "ev_usb_cable",
      type: "photo",
      title: "Tangled USB Cable",
      contentUrl: imgTangledCables,
      description: "They always tangle in your pocket. Proof of simulation? Or just physics? QUANTUM ENTANGLEMENT theory says... nothing useful here.",
      tags: ["USB", "TANGLED"],
      position: { x: 50, y: 300 },
      isRedHerring: true
    },
    {
      id: "ev_cloud_face",
      type: "photo",
      title: "Face in Cloud",
      contentUrl: null,
      description: "You see a face. That's pareidolia, not a glitch. Human brains find patterns everywhere. NOT EVIDENCE.",
      tags: ["CLOUD", "FACE"],
      position: { x: 400, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_dream_journal",
      type: "document",
      title: "Dream Journal",
      contentUrl: null,
      description: "'Last night I dreamed I was a butterfly.' Philosophical but not evidence of simulation.",
      tags: ["DREAM", "JOURNAL"],
      position: { x: 200, y: 350 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THERE IS NO SPOON",
    "WAKE UP NEO",
    "THE CODE IS ALL AROUND",
    "WE ARE NPCs",
    "RENDER DISTANCE EXPLAINS FOG",
    "127.0.0.1 = HOME",
    "CONSCIOUSNESS IS DATA",
    "PHYSICS HAS BUGS",
    "DEJA VU = SAVE STATE",
    "MUSK KNOWS"
  ],
  combinations: [
    {
      itemA: "ev_matrix_glitch",
      itemB: "ev_deja_vu",
      unlockText: "THE SIMULATION LAGS!",
      hint: "WHAT CAUSES THESE ERRORS?",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_bug_report",
          type: "document",
          title: "Reality Bug Report",
          contentUrl: null,
          description: "Bug #7,439,201: Duplicate entity rendering. Bug #7,439,202: Time loop in sector 7G. Status: Won't Fix (users don't notice). WE NOTICED.",
          tags: ["BUG", "REPORT", "GLITCH"],
          position: { x: 170, y: 200 },
          isRedHerring: false,
          hiddenText: "STATUS: KNOWN ISSUE",
          isCritical: true,
          truthTags: ["THE_GLITCH", "THE_EVIDENCE"]
        }
      ]
    },
    {
      itemA: "ev_elon_quote",
      itemB: "ev_server_room",
      unlockText: "HE'S BUILDING THE NEXT VERSION!",
      hint: "WHAT IS NEURALINK FOR?",
      difficulty: "hard",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_neuralink_truth",
          type: "document",
          title: "Neuralink: The Real Purpose",
          contentUrl: imgNeuralink,
          description: "Brain-computer interface? No. CONSCIOUSNESS UPLOAD PROTOCOL. Musk is building the bridge to Simulation 2.0. We're beta testers.",
          tags: ["NEURALINK", "UPLOAD", "MUSK"],
          position: { x: 440, y: 130 },
          isRedHerring: false,
          hiddenText: "VERSION: 1.0.EARTH",
          isCritical: true,
          truthTags: ["THE_ARCHITECT", "THE_PURPOSE"]
        }
      ]
    },
    {
      itemA: "ev_render_distance",
      itemB: "ev_physics_bug",
      unlockText: "THE ENGINE HAS LIMITS!",
      hint: "WHY DO PHYSICS FAIL?",
      difficulty: "medium",
      bonusCredibility: 300,
      resultNodes: [
        {
          id: "ev_engine_specs",
          type: "document",
          title: "Universe Engine Specifications",
          contentUrl: null,
          description: "Max entities: 8 billion (current: 7.9B). Render distance: 5km. Physics accuracy: 99.9999% (0.0001% error = 'miracles'). We're hitting the hardware limits.",
          tags: ["ENGINE", "SPECS", "LIMITS"],
          position: { x: 420, y: 280 },
          isRedHerring: false,
          isCritical: false,
          truthTags: ["THE_EVIDENCE"]
        }
      ]
    },
    {
      itemA: "ev_npc_behavior",
      itemB: "ev_neuralink_truth",
      unlockText: "NPCs ARE CONSCIOUSNESS BATTERIES!",
      hint: "WHY SIMULATE US?",
      difficulty: "hard",
      bonusCredibility: 500,
      resultNodes: [
        {
          id: "ev_purpose_revealed",
          type: "document",
          title: "The Farming Protocol",
          contentUrl: null,
          description: "Each conscious thought generates 0.0001 teraflops of processing power. 8 billion minds = infinite computation. WE ARE THE CLOUD. They're using us to run... THEIR simulation.",
          tags: ["PURPOSE", "FARMING", "CONSCIOUSNESS"],
          position: { x: 300, y: 400 },
          isRedHerring: false,
          hiddenText: "WE ARE CPU",
          isCritical: true,
          truthTags: ["THE_PURPOSE", "THE_ARCHITECT"]
        }
      ]
    }
  ]
};
