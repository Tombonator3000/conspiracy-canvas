import type { CaseData } from "@/types/game";
import { microwaveGlow, popcornTime, rotatingPlate, tinFoil, powerCord } from "@/assets/evidence";

export const case008: CaseData = {
  id: "case_008_microwave",
  title: "Operation: Temporal Soup",
  description:
    "Microwave ovens are TIME MACHINES. Every time you heat leftovers, you're creating temporal anomalies. Use RED thread for matching subjects, but BLUE thread is REQUIRED to connect timeline events! Use UV light for timeline hints!",
  difficulty: "MEDIUM",
  theTruth: {
    subject: "MICROWAVE COMPANIES",
    action: "ARE MANIPULATING",
    target: "TIME ITSELF",
    motive: "TO SELL MORE POPCORN",
  },
  boardState: {
    sanity: 85,
    chaosLevel: 2,
    maxConnectionsNeeded: 5,
  },
  // Semantic Truth Tags: Connect evidence proving THE_ORIGIN + THE_ANOMALY + THE_MECHANISM + THE_PROOF + THE_TESTIMONY
  requiredTags: ["THE_ORIGIN", "THE_ANOMALY", "THE_MECHANISM", "THE_PROOF", "THE_TESTIMONY"],
  nodes: [
    // ===== CRITICAL EVIDENCE - REQUIRES BOTH THREAD TYPES =====
    // Red thread connections: via tags
    // Blue thread connections: via timelineTags

    {
      id: "ev_patent_1947",
      type: "document",
      title: "Original Microwave Patent",
      contentUrl: microwaveGlow,
      description:
        "Filed in 1947. The patent clearly states 'temporal food acceleration device'. They hid it in plain sight!",
      tags: ["MICROWAVE", "PATENT", "TECHNOLOGY"],
      timelineTags: ["1947_ORIGIN", "TIMELINE_START"],
      position: { x: 80, y: 100 },
      isRedHerring: false,
      hiddenText: "TIMELINE: 1947 ORIGIN → CONNECT TO OTHER TIMELINE EVENTS (BLUE)",
      isCritical: true,
      truthTags: ["THE_ORIGIN"]  // The beginning of the conspiracy
    },
    {
      id: "ev_popcorn_anomaly",
      type: "photo",
      title: "Popcorn Timing Discrepancy",
      contentUrl: popcornTime,
      description:
        "Popcorn bag says 2 minutes. Clock says 3 minutes passed. WHERE DID THE EXTRA MINUTE GO?",
      tags: ["POPCORN", "TIME", "FOOD"],
      timelineTags: ["TIME_ANOMALY", "EVIDENCE_2010"],
      position: { x: 450, y: 80 },
      isRedHerring: false,
      hiddenText: "TIMELINE: TIME ANOMALY DETECTED → BLUE THREAD TO OTHER ANOMALIES",
      isCritical: true,
      truthTags: ["THE_ANOMALY"]  // Time anomaly evidence
    },
    {
      id: "ev_rotating_plate",
      type: "sticky_note",
      title: "The Rotating Plate",
      contentUrl: rotatingPlate,
      description:
        "WHY does food need to ROTATE? Answer: To distribute temporal energy evenly. A VORTEX.",
      tags: ["MICROWAVE", "ROTATION", "VORTEX"],
      timelineTags: ["MECHANISM", "TIME_ANOMALY"],
      position: { x: 280, y: 280 },
      isRedHerring: false,
      hiddenText: "TIMELINE: MECHANISM → BLUE THREAD TO COLD SPOTS & ANOMALIES",
      isCritical: true,
      truthTags: ["THE_MECHANISM"]  // How it works
    },
    {
      id: "ev_cold_spots",
      type: "document",
      title: "Cold Spot Phenomenon",
      contentUrl: null,
      description:
        "Some food stays cold while the rest is hot. These are TEMPORAL POCKETS where time moves slower!",
      tags: ["TEMPERATURE", "TIME", "PHYSICS"],
      timelineTags: ["MECHANISM", "EVIDENCE_2010"],
      position: { x: 550, y: 300 },
      isRedHerring: false,
      hiddenText: "TIMELINE: 2010 EVIDENCE → BLUE THREAD TO CLOCK & POPCORN",
      isCritical: true,
      truthTags: ["THE_PROOF"]  // Physical proof
    },
    {
      id: "ev_clock_testimony",
      type: "document",
      title: "Kitchen Clock Testimony",
      contentUrl: null,
      description:
        "Multiple reports: Kitchen clocks near microwaves run FAST. Microwaves are ACCELERATING TIME around them!",
      tags: ["CLOCK", "TIME", "TESTIMONY"],
      timelineTags: ["TIMELINE_START", "EVIDENCE_2010"],
      position: { x: 150, y: 420 },
      isRedHerring: false,
      hiddenText: "TIMELINE: ONGOING SINCE 1947 → BLUE THREAD TO PATENT & COLD SPOTS",
      isCritical: true,
      truthTags: ["THE_TESTIMONY"]  // Witness testimony
    },

    // ===== RED HERRINGS & JUNK =====

    {
      id: "ev_tin_foil",
      type: "photo",
      title: "Tin Foil Warning",
      contentUrl: tinFoil,
      description:
        "They say DON'T put metal in microwave. Because metal BLOCKS temporal waves!",
      tags: ["METAL", "WARNING"],
      position: { x: 650, y: 150 },
      isRedHerring: true,
    },
    {
      id: "ev_hot_pocket",
      type: "sticky_note",
      title: "Hot Pocket Analysis",
      contentUrl: null,
      description:
        "Hot Pocket. HOT. POCKET. A pocket of... HEAT? Or a pocket of TIME?",
      tags: ["FOOD", "BRAND"],
      position: { x: 380, y: 450 },
      isRedHerring: true,
    },
    {
      id: "ev_beep_code",
      type: "document",
      title: "Beep Sequence Analysis",
      contentUrl: null,
      description:
        "Beep beep beep. Three beeps. TRIANGLE. Illuminati confirmed.",
      tags: ["SOUND", "PATTERN"],
      position: { x: 600, y: 420 },
      isRedHerring: true,
    },
    {
      id: "ev_defrost_button",
      type: "sticky_note",
      title: "Defrost Button Mystery",
      contentUrl: null,
      description:
        "DEFROST = DE-FROST = REMOVE FROZEN. Frozen... in TIME? No, just ice.",
      tags: ["BUTTON", "ICE"],
      position: { x: 80, y: 280 },
      isRedHerring: true,
    },
    {
      id: "ev_old_receipt",
      type: "document",
      title: "Grocery Receipt",
      contentUrl: null,
      description: "Milk, bread, eggs. Normal shopping. Or IS IT?! Yes. It is.",
      tags: ["SHOPPING", "MUNDANE"],
      position: { x: 200, y: 180 },
      isRedHerring: true,
    },
    {
      id: "ev_power_cord",
      type: "photo",
      title: "Suspicious Power Cord",
      contentUrl: powerCord,
      description:
        "Three prongs. THREE. Why does time need three dimensions? UNRELATED.",
      tags: ["ELECTRIC", "PRONGS"],
      position: { x: 500, y: 180 },
      isRedHerring: true,
    },
    {
      id: "ev_dinner_plate",
      type: "sticky_note",
      title: "Cracked Dinner Plate",
      contentUrl: null,
      description:
        "Plate cracked in microwave. From HEAT? Or from TIME STRESS? Probably heat.",
      tags: ["PLATE", "BROKEN"],
      position: { x: 350, y: 350 },
      isRedHerring: true,
    },
    {
      id: "ev_instruction_manual",
      type: "document",
      title: "Instruction Manual Page 7",
      contentUrl: null,
      description: "DO NOT operate when empty. Because... it needs mass to anchor time? No, it'll just break.",
      tags: ["MANUAL", "RULES"],
      position: { x: 680, y: 280 },
      isRedHerring: true,
    },
  ],
  scribblePool: [
    "TIME IS HEATING UP!",
    "THE CLOCK IS LYING",
    "POPCORN KNOWS",
    "ROTATE THE TIMELINE",
    "2:30 BECAME 3:00!",
    "TEMPORAL LEFTOVERS",
    "DEFROST THE TRUTH",
    "MAGNETRON = CHRONOTRON",
    "MINUTE MANIPULATION",
    "IT ALL CONNECTS!",
    "USE BLUE FOR TIMELINE!",
    "UV REVEALS THE TIMELINE!",
  ],
  combinations: [
    {
      itemA: "ev_patent_1947",
      itemB: "ev_rotating_plate",
      unlockText: "THE PATENT MENTIONS ROTATION FOR 'TEMPORAL DISTRIBUTION'!",
      hint: "STUDY THE ORIGINAL DESIGN",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_original_diagram",
          type: "document",
          title: "Hidden Patent Diagram",
          contentUrl: null,
          description:
            "Diagram shows arrows in BOTH directions. Clockwise = future. Counter-clockwise = past. THEY KNEW!",
          tags: ["PATENT", "ROTATION", "TECHNOLOGY"],
          timelineTags: ["1947_ORIGIN", "MECHANISM"],
          position: { x: 180, y: 350 },
          isRedHerring: false,
          hiddenText: "BIDIRECTIONAL TIME",
          isCritical: false,
        },
      ],
    },
    {
      itemA: "ev_popcorn_anomaly",
      itemB: "ev_cold_spots",
      unlockText: "COLD SPOTS ARE WHERE TIME DIDN'T REACH!",
      hint: "WHY UNEVEN HEATING?",
      difficulty: "medium",
      resultNodes: [
        {
          id: "ev_time_map",
          type: "document",
          title: "Temporal Distribution Map",
          contentUrl: null,
          description:
            "Mapping cold spots reveals a PATTERN. Time flows unevenly through the microwave chamber!",
          tags: ["TIME", "TEMPERATURE", "PATTERN"],
          timelineTags: ["TIME_ANOMALY", "EVIDENCE_2010"],
          position: { x: 500, y: 400 },
          isRedHerring: false,
          hiddenText: "TIME WAVES",
          isCritical: false,
        },
      ],
    },
  ],
};
