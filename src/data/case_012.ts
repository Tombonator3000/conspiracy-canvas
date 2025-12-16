import type { CaseData } from "@/types/game";

export const case012: CaseData = {
  id: "case_012_reptilians",
  title: "The Lizard Elite",
  description: "World leaders aren't human. They're reptilian aliens wearing human skin suits, and they all meet at Davos to coordinate the New World Order.",
  difficulty: "HARD",
  theTruth: {
    subject: "WORLD LEADERS",
    action: "ARE REPTILIAN ALIENS WEARING",
    target: "HUMAN SKIN SUITS",
    motive: "TO HARVEST OUR BODY HEAT"
  },
  boardState: {
    sanity: 65,
    chaosLevel: 0,
    maxConnectionsNeeded: 5
  },
  requiredTags: ["THE_REPTILIANS", "THE_DISGUISE", "THE_MEETINGS", "THE_SIGNALS", "THE_HARVEST"],
  nodes: [
    // ===== CRITICAL EVIDENCE =====
    {
      id: "ev_eye_glitch",
      type: "photo",
      title: "Press Conference Glitch",
      contentUrl: null,
      description: "Screenshot from live TV. World leader's pupil briefly goes VERTICAL. 'Camera glitch' says network. Camera doesn't affect PUPILS.",
      tags: ["REPTILIAN", "EYES", "GLITCH"],
      position: { x: 140, y: 100 },
      isRedHerring: false,
      hiddenText: "FRAME 2847",
      isCritical: true,
      truthTags: ["THE_REPTILIANS"]
    },
    {
      id: "ev_skin_suit_patent",
      type: "document",
      title: "Classified Patent #X-7721",
      contentUrl: null,
      description: "'Biomimetic Epidermal Overlay for Cold-Blooded Entities'. Filed in 1954. Inventor: [REDACTED]. Status: IMPLEMENTED.",
      tags: ["PATENT", "SUIT", "TECH"],
      position: { x: 550, y: 130 },
      isRedHerring: false,
      hiddenText: "MATERIAL: SYNTHETIC HUMAN",
      isCritical: true,
      truthTags: ["THE_DISGUISE"]
    },
    {
      id: "ev_davos_schedule",
      type: "document",
      title: "Leaked Davos Agenda",
      contentUrl: null,
      description: "'9AM: Economic Forum. 12PM: Lunch (raw). 3PM: SUBSURFACE MEETING - Attendees only. 6PM: Sunlamp maintenance.' RAW?! SUBSURFACE?!",
      tags: ["DAVOS", "MEETING", "SCHEDULE"],
      position: { x: 350, y: 380 },
      isRedHerring: false,
      hiddenText: "DRESS CODE: SCALES OPTIONAL",
      isCritical: true,
      truthTags: ["THE_MEETINGS"]
    },
    {
      id: "ev_handshake_analysis",
      type: "photo",
      title: "Handshake Photo Study",
      contentUrl: null,
      description: "200 photos of world leaders shaking hands. ALL use the SAME grip. Same finger position. Like they learned it from a MANUAL.",
      tags: ["HANDSHAKE", "SIGNAL", "PATTERN"],
      position: { x: 620, y: 350 },
      isRedHerring: false,
      hiddenText: "GRIP CODE: RECOGNITION",
      isCritical: true,
      truthTags: ["THE_SIGNALS"]
    },
    {
      id: "ev_heat_lamp_orders",
      type: "document",
      title: "Bulk Heat Lamp Invoice",
      contentUrl: null,
      description: "Delivery to UN building: 847 industrial heat lamps. 'For the... garden.' The UN doesn't HAVE a garden.",
      tags: ["HEAT", "EVIDENCE", "UN"],
      position: { x: 180, y: 450 },
      isRedHerring: false,
      hiddenText: "TEMP REQUIREMENT: 35°C",
      isCritical: true,
      truthTags: ["THE_HARVEST"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_lizard_meme",
      type: "photo",
      title: "Zucc Lizard Meme",
      contentUrl: null,
      description: "Famous tech CEO drinking water 'weird'. Internet says lizard. Doctors say 'just awkward'. We say: BOTH CAN BE TRUE.",
      tags: ["MEME", "TECH"],
      position: { x: 450, y: 60 },
      isRedHerring: true
    },
    {
      id: "ev_cold_hands",
      type: "sticky_note",
      title: "Witness: Cold Handshake",
      contentUrl: null,
      description: "'Shook hands with senator. Like grabbing a fish.' Could be reptilian. Could be poor circulation. Or fish-handling hobby.",
      tags: ["COLD", "WITNESS"],
      position: { x: 80, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_sunglasses",
      type: "photo",
      title: "Indoor Sunglasses Photo",
      contentUrl: null,
      description: "Billionaire wearing sunglasses indoors. Hiding reptile eyes?! Or just being a douche. Probably the latter.",
      tags: ["SUNGLASSES", "INDOOR"],
      position: { x: 700, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_rare_steak",
      type: "sticky_note",
      title: "Dinner Order Receipt",
      contentUrl: null,
      description: "'Steak. Rare. Almost raw.' Reptilian diet?! Or just French culinary preference. Not enough evidence.",
      tags: ["FOOD", "RAW"],
      position: { x: 280, y: 220 },
      isRedHerring: true
    },
    {
      id: "ev_bunker_rumor",
      type: "document",
      title: "Underground Bunker Report",
      contentUrl: null,
      description: "Reports of massive underground facility. Could be reptilian base. Is actually a data center. Still suspicious but wrong conspiracy.",
      tags: ["BUNKER", "UNDERGROUND"],
      position: { x: 500, y: 500 },
      isRedHerring: true
    },
    {
      id: "ev_forked_tongue",
      type: "sticky_note",
      title: "Tongue Photo - Blurry",
      contentUrl: null,
      description: "Leader mid-speech, tongue looks forked. Motion blur? Reptile reveal? The JPEG compression makes it impossible to tell.",
      tags: ["TONGUE", "BLURRY"],
      position: { x: 150, y: 550 },
      isRedHerring: true
    },
    {
      id: "ev_bodyguard",
      type: "photo",
      title: "Mysterious Bodyguard",
      contentUrl: null,
      description: "Same bodyguard appears with 7 different leaders. Suspicious! Also: he's from a security company. That's his job.",
      tags: ["BODYGUARD", "SECURITY"],
      position: { x: 380, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_green_tie",
      type: "sticky_note",
      title: "Green Tie Analysis",
      contentUrl: null,
      description: "All leaders wore green ties at summit. Secret signal?! Or... the event theme was environmental. Says it on the banner.",
      tags: ["TIE", "GREEN"],
      position: { x: 720, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_arizona_mansion",
      type: "document",
      title: "Desert Mansion Purchase",
      contentUrl: null,
      description: "Billionaire buys desert property with 'special heating'. For reptilian comfort?! Or because desert winters are cold. Yes, really.",
      tags: ["DESERT", "PROPERTY"],
      position: { x: 260, y: 520 },
      isRedHerring: true
    },
    {
      id: "ev_blinking",
      type: "photo",
      title: "Non-Blinking Video Still",
      contentUrl: null,
      description: "CEO didn't blink for 4 minutes in interview. Reptilian trait! Or Botox side effect. Equally concerning, different reasons.",
      tags: ["BLINK", "VIDEO"],
      position: { x: 600, y: 240 },
      isRedHerring: true
    },
    {
      id: "ev_blood_type",
      type: "document",
      title: "Medical Records Fragment",
      contentUrl: null,
      description: "World leader blood type: RH-. Alien blood?! Actually just rare human blood type. 15% of population has it.",
      tags: ["BLOOD", "MEDICAL"],
      position: { x: 450, y: 180 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THEY'RE NOT HUMAN!",
    "LOOK AT THE EYES!",
    "COLD-BLOODED ELITE!",
    "THE MASKS SLIP!",
    "DAVOS IS THE NEST!",
    "CHECK THE HEAT LAMPS!",
    "HANDSHAKE CODE!",
    "SKIN SUIT TECH!",
    "FOLLOW THE WARMTH!",
    "THEY WALK AMONG US!"
  ],
  combinations: [
    {
      itemA: "ev_eye_glitch",
      itemB: "ev_skin_suit_patent",
      unlockText: "THE SUIT MALFUNCTIONS EXPLAIN THE EYE GLITCHES!",
      hint: "PATENT SECTION 4.7",
      difficulty: "medium",
      resultNodes: [
        {
          id: "ev_malfunction_log",
          type: "document",
          title: "Suit Malfunction Reports",
          contentUrl: null,
          description: "Internal memo: 'Ocular overlay sync issues persist. Recommend avoiding HD cameras. Several close calls in 2019-2023.'",
          tags: ["SUIT", "EYES", "GLITCH"],
          position: { x: 330, y: 150 },
          isRedHerring: false,
          hiddenText: "FIRMWARE: NEEDS UPDATE",
          isCritical: true,
          truthTags: ["THE_REPTILIANS", "THE_DISGUISE"]
        }
      ]
    },
    {
      itemA: "ev_davos_schedule",
      itemB: "ev_handshake_analysis",
      unlockText: "THE HANDSHAKE IS THE MEETING ADMISSION CODE!",
      hint: "COMPARE ATTENDEE LIST",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_inner_circle",
          type: "document",
          title: "Inner Circle Protocol",
          contentUrl: null,
          description: "Full protocol: Correct handshake grants access to subsurface meetings. Wrong grip = 'standard human' treatment.",
          tags: ["HANDSHAKE", "MEETING", "PROTOCOL"],
          position: { x: 500, y: 360 },
          isRedHerring: false,
          hiddenText: "GRIP PRESSURE: 47 PSI",
          isCritical: true,
          truthTags: ["THE_MEETINGS", "THE_SIGNALS"]
        }
      ]
    },
    {
      itemA: "ev_heat_lamp_orders",
      itemB: "ev_davos_schedule",
      unlockText: "THE SUNLAMP 'MAINTENANCE' IS FEEDING TIME!",
      hint: "CROSS-REFERENCE THE TIMES",
      difficulty: "hard",
      resultNodes: [
        {
          id: "ev_feeding_schedule",
          type: "document",
          title: "Thermal Harvesting Schedule",
          contentUrl: null,
          description: "Heating requirements: Reptilian physiology requires external heat absorption. Human body heat = ideal source. That's why they shake SO MANY hands.",
          tags: ["HEAT", "HARVEST", "SCHEDULE"],
          position: { x: 400, y: 480 },
          isRedHerring: false,
          hiddenText: "EFFICIENCY: 1 HANDSHAKE = 0.3°C",
          isCritical: true,
          truthTags: ["THE_HARVEST", "THE_MEETINGS"]
        }
      ]
    }
  ]
};
