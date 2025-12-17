import type { CaseData } from "@/types/game";
import { catRouter, catPhone, goodDog, fiveGTower, scratchingPost } from "@/assets/evidence";

export const case005: CaseData = {
  id: "case_005_cats",
  title: "5G Feline Network",
  description: "Cats aren't pets. They're organic WiFi boosters deployed by the government. When they purr, they're uploading data about you.",
  difficulty: "MEDIUM",
  theTruth: {
    subject: "CATS",
    action: "FUNCTION AS",
    target: "5G ROUTERS",
    motive: "MASS SURVEILLANCE"
  },
  boardState: {
    sanity: 85,
    chaosLevel: 1,
    maxConnectionsNeeded: 4
  },
  // Semantic Truth Tags: Connect evidence proving THE_CHARGER + THE_FREQUENCY + THE_SURVEILLANCE + THE_HISTORY
  requiredTags: ["THE_CHARGER", "THE_FREQUENCY", "THE_SURVEILLANCE", "THE_HISTORY"],
  nodes: [
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_cat_router",
      type: "photo",
      title: "Charging Station",
      contentUrl: catRouter,
      description: "Cat sitting on router. They claim it's 'warm'. It's actually INDUCTIVE CHARGING.",
      tags: ["CAT", "HEAT", "WIFI"],
      position: { x: 120, y: 100 },
      isRedHerring: false,
      hiddenText: "2.4GHz PURR",
      isCritical: true,
      truthTags: ["THE_CHARGER"]  // How they charge
    },
    {
      id: "ev_purr_frequency",
      type: "document",
      title: "Acoustic Analysis",
      contentUrl: null,
      description: "Cat purring measured at exactly 5GHz. THE SAME AS YOUR ROUTER. Wake up.",
      tags: ["SOUND", "FREQUENCY", "5G", "CAT"],
      position: { x: 500, y: 80 },
      isRedHerring: false,
      hiddenText: "5.000 GHz EXACT",
      isCritical: true,
      truthTags: ["THE_FREQUENCY"]  // The 5G frequency match
    },
    {
      id: "ev_cat_eyes",
      type: "photo",
      title: "The Gaze",
      contentUrl: catPhone,
      description: "Cat staring at phone screen. Reading your texts? Or TRANSMITTING them?",
      tags: ["EYES", "DATA", "CAT"],
      position: { x: 300, y: 340 },
      isRedHerring: false,
      hiddenText: "UPLOAD: 99%",
      isCritical: true,
      truthTags: ["THE_SURVEILLANCE"]  // The spying
    },
    {
      id: "ev_ancient_egypt",
      type: "document",
      title: "Historical Pattern",
      contentUrl: null,
      description: "Egyptians worshipped cats. Egypt built pyramids. Pyramids = ancient cell towers?",
      tags: ["HISTORY", "WIFI", "TOWER"],
      position: { x: 550, y: 350 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ["THE_HISTORY"]  // Ancient origins
    },

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions
    {
      id: "ev_dog",
      type: "photo",
      title: "Good Boy",
      contentUrl: goodDog,
      description: "A dog. Loyal. Honest. NOT A SPY. ...Right?",
      tags: ["PET", "INNOCENT"],
      position: { x: 80, y: 380 },
      isRedHerring: true
    },
    {
      id: "ev_fish_tank",
      type: "sticky_note",
      title: "Fish Tank Note",
      contentUrl: null,
      description: "Fish just swim in circles. Probably not uploading data. PROBABLY.",
      tags: ["AQUATIC", "CIRCLE"],
      position: { x: 650, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_cat_food",
      type: "document",
      title: "Cat Food Label",
      contentUrl: null,
      description: "Ingredients: Chicken, Tuna, WiFi-boosting minerals. Wait, that last one...",
      tags: ["FOOD", "NUTRITION"],
      position: { x: 200, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_5g_tower",
      type: "photo",
      title: "5G Tower Photo",
      contentUrl: fiveGTower,
      description: "Regular 5G tower. No cats nearby. SUSPICIOUS ABSENCE.",
      tags: ["TOWER", "ABSENT"],
      position: { x: 420, y: 250 },
      isRedHerring: true
    },

    // Pure Trash
    {
      id: "ev_lint_roller",
      type: "sticky_note",
      title: "Lint Roller",
      contentUrl: null,
      description: "For removing cat hair. Or for collecting DNA SAMPLES?! (No, just hair.)",
      tags: ["CLEANING", "HAIR"],
      position: { x: 150, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_scratching_post",
      type: "photo",
      title: "Scratching Post",
      contentUrl: scratchingPost,
      description: "Destroyed by claws. Message in the scratches? Just random marks.",
      tags: ["FURNITURE", "MARKS"],
      position: { x: 350, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_phone_bill",
      type: "document",
      title: "Phone Bill",
      contentUrl: null,
      description: "Data usage spike when cat purrs. Correlation? Actually just Netflix.",
      tags: ["BILL", "DATA"],
      position: { x: 600, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_cat_toy",
      type: "sticky_note",
      title: "Cat Toy Mouse",
      contentUrl: null,
      description: "Squeaky toy. Makes noise at 440Hz. A440 = orchestra tuning. ORCHESTRATED?!",
      tags: ["TOY", "SOUND"],
      position: { x: 250, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_litter_box",
      type: "sticky_note",
      title: "Litter Box Receipt",
      contentUrl: null,
      description: "Premium clumping litter. $24.99. Absorbs... WHAT exactly?",
      tags: ["WASTE", "PURCHASE"],
      position: { x: 500, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_catnip",
      type: "document",
      title: "Catnip Package",
      contentUrl: null,
      description: "Organic catnip. Makes cats 'high'. Or activates their TRANSMITTER MODE?",
      tags: ["HERB", "BEHAVIOR"],
      position: { x: 80, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_pet_insurance",
      type: "document",
      title: "Pet Insurance Form",
      contentUrl: null,
      description: "Covers 'signal interference damage'. WAIT, WHAT?! (Actually says 'accidental')",
      tags: ["INSURANCE", "FINE_PRINT"],
      position: { x: 650, y: 300 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THE PURR IS AN UPLOAD!",
    "CATS HAVE 9 LIVES = 9 ANTENNAS",
    "MEOW = MORSE CODE",
    "THEY'RE ALWAYS WATCHING",
    "KNOCK THINGS OFF TABLE = DATA DUMP",
    "HAIRBALLS = CORRUPTED FILES",
    "WHISKERS = ANTENNAS",
    "CATS OWN THE INTERNET"
  ],
  combinations: [
    {
      itemA: "ev_cat_router",
      itemB: "ev_purr_frequency",
      unlockText: "THE FREQUENCIES ARE IDENTICAL!",
      hint: "MEASURE THE PURR",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_signal_match",
          type: "document",
          title: "Signal Analysis",
          contentUrl: null,
          description: "Cat purr: 5.0GHz. Home router: 5.0GHz. THEY ARE THE SAME DEVICE.",
          tags: ["FREQUENCY", "5G", "WIFI"],
          position: { x: 320, y: 180 },
          isRedHerring: false,
          hiddenText: "BANDWIDTH: 9 LIVES",
          isCritical: true,
          truthTags: ["THE_FREQUENCY", "THE_CHARGER"]  // Frequency proof
        }
      ]
    },
    {
      itemA: "ev_cat_eyes",
      itemB: "ev_ancient_egypt",
      unlockText: "THE EGYPTIANS KNEW!",
      hint: "ANCIENT SURVEILLANCE",
      difficulty: "medium",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_hieroglyph",
          type: "document",
          title: "Decoded Hieroglyphs",
          contentUrl: null,
          description: "Translation: 'The all-seeing cat shall record for the gods.' THEY'VE BEEN SPYING FOR MILLENNIA!",
          tags: ["HISTORY", "CAT", "DATA"],
          position: { x: 400, y: 280 },
          isRedHerring: false,
          hiddenText: "SINCE 3000 BCE",
          isCritical: false
        }
      ]
    },
    {
      itemA: "ev_hieroglyph",
      itemB: "ev_catnip",
      unlockText: "CATNIP IS THE UPDATE PROTOCOL!",
      hint: "WHY DO THEY NEED IT?",
      difficulty: "hard",
      bonusCredibility: 350,
      resultNodes: [
        {
          id: "ev_firmware_update",
          type: "document",
          title: "Feline Firmware Protocol",
          contentUrl: null,
          description: "Catnip triggers firmware updates. The 'high' is actually a reboot cycle. Version: CAT.OS 2024.9.1",
          tags: ["CAT", "WIFI", "5G"],
          position: { x: 350, y: 380 },
          isRedHerring: false,
          hiddenText: "MEOW.EXE",
          isCritical: true,
          truthTags: ["THE_SURVEILLANCE", "THE_HISTORY"]  // The firmware/software proof
        }
      ]
    }
  ]
};
