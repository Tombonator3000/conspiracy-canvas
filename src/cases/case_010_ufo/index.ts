import type { CaseData } from "@/types/game";
import roswellDebris from "./evidence/roswell_debris.jpg";
import strangeCamera from "./evidence/strange_camera.jpg";
import blurryUfo from "./evidence/blurry_ufo.jpg";
import cropCircle from "./evidence/crop_circle.jpg";
import thermalForest from "./evidence/thermal_forest.jpg";
import brokenBranches from "./evidence/broken_branches.jpg";
import menInBlack from "./evidence/men_in_black.jpg";
import destroyedTent from "./evidence/destroyed_tent.jpg";

export const case010: CaseData = {
  id: "case_010_ufo",
  title: "Tourists From Tomorrow",
  description: "UFO sightings aren't alien spacecraft - they're time-traveling tourists from the year 3000, visiting historical 'disaster sites' for entertainment.",
  difficulty: "HARD",
  theTruth: {
    subject: "UFOS",
    action: "ARE TIME MACHINES CARRYING",
    target: "FUTURE TOURISTS",
    motive: "TO WITNESS OUR EXTINCTION"
  },
  boardState: {
    sanity: 70,
    chaosLevel: 0,
    maxConnectionsNeeded: 5
  },
  requiredTags: ["THE_CRAFT", "THE_TIME_TECH", "THE_TOURISTS", "THE_DESTINATIONS", "THE_PURPOSE"],
  nodes: [
    // ===== CRITICAL EVIDENCE =====
    {
      id: "ev_roswell_debris",
      type: "photo",
      title: "Roswell Debris Analysis",
      contentUrl: roswellDebris,
      description: "Metal fragment shows manufacturing date: '2847 CE'. Metallurgist said 'impossible' then disappeared.",
      tags: ["ROSWELL", "METAL", "FUTURE"],
      position: { x: 120, y: 100 },
      isRedHerring: false,
      hiddenText: "MADE IN: SOL SYSTEM",
      isCritical: true,
      truthTags: ["THE_CRAFT"]
    },
    {
      id: "ev_temporal_radiation",
      type: "document",
      title: "Classified Energy Reading",
      contentUrl: null,
      description: "Radiation signature at UFO landing sites matches NO known element. Scientists call it 'Chronoton particles'. CERN denies everything.",
      tags: ["RADIATION", "TIME", "PHYSICS"],
      position: { x: 550, y: 130 },
      isRedHerring: false,
      hiddenText: "HALF-LIFE: NEGATIVE",
      isCritical: true,
      truthTags: ["THE_TIME_TECH"]
    },
    {
      id: "ev_recovered_camera",
      type: "photo",
      title: "Strange Camera Device",
      contentUrl: strangeCamera,
      description: "Found at crop circle site. Has button labeled 'CAPTURE MOMENT'. Memory contains photos of Pompeii, Titanic, and... 2024???",
      tags: ["CAMERA", "TOURIST", "FUTURE"],
      position: { x: 350, y: 350 },
      isRedHerring: false,
      hiddenText: "MODEL: TIMESNAP 3000",
      isCritical: true,
      truthTags: ["THE_TOURISTS"]
    },
    {
      id: "ev_sighting_pattern",
      type: "document",
      title: "UFO Sighting Pattern Map",
      contentUrl: null,
      description: "Plotted 70 years of sightings. They cluster around: nuclear test sites, disaster locations, and places that 'will become' historical.",
      tags: ["SIGHTING", "PATTERN", "DISASTER"],
      position: { x: 180, y: 420 },
      isRedHerring: false,
      hiddenText: "NEXT HOTSPOT: [YOUR CITY]",
      isCritical: true,
      truthTags: ["THE_DESTINATIONS"]
    },
    {
      id: "ev_tour_brochure",
      type: "document",
      title: "Impossible Brochure",
      contentUrl: null,
      description: "'CHRONO-TOURS: Visit the Fall of Civilization! Package includes: 21st century, safe viewing distance, commemorative t-shirt.'",
      tags: ["TOURIST", "FUTURE", "BROCHURE"],
      position: { x: 600, y: 380 },
      isRedHerring: false,
      hiddenText: "PRICE: 50,000 CREDITS",
      isCritical: true,
      truthTags: ["THE_PURPOSE"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_weather_balloon",
      type: "photo",
      title: "Weather Balloon Photo",
      contentUrl: null,
      description: "Official explanation for everything. But does a weather balloon have WINDOWS?! (This one actually does. It's just a balloon.)",
      tags: ["WEATHER", "BALLOON"],
      position: { x: 450, y: 50 },
      isRedHerring: true
    },
    {
      id: "ev_alien_autopsy",
      type: "document",
      title: "Alien Autopsy Notes",
      contentUrl: null,
      description: "From the famous 1995 video. Later revealed as 'recreation'. Or was it a COVER-UP of a cover-up?!",
      tags: ["AUTOPSY", "FAKE"],
      position: { x: 80, y: 250 },
      isRedHerring: true
    },
    {
      id: "ev_grainy_photo",
      type: "photo",
      title: "Classic Blurry UFO Photo",
      contentUrl: blurryUfo,
      description: "Could be alien craft. Could be frisbee. Could be hubcap. Definitely blurry.",
      tags: ["BLURRY", "CLASSIC"],
      position: { x: 680, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_crop_circle",
      type: "photo",
      title: "Crop Circle Photo",
      contentUrl: cropCircle,
      description: "Complex geometric pattern. Local farmer says 'it was Dave with a plank'. Dave denies knowing geometry.",
      tags: ["CROP", "CIRCLE"],
      position: { x: 280, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_abduction_diary",
      type: "document",
      title: "Abduction Account Diary",
      contentUrl: null,
      description: "'They took me aboard. The seats were uncomfortable. They offered complimentary snacks.' Wait, snacks?",
      tags: ["ABDUCTION", "DIARY"],
      position: { x: 500, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_tinfoil_hat",
      type: "sticky_note",
      title: "Tin Foil Hat Blueprint",
      contentUrl: null,
      description: "Detailed construction guide. Three-layer design. Includes chin strap specifications.",
      tags: ["TINFOIL", "PROTECTION"],
      position: { x: 150, y: 520 },
      isRedHerring: true
    },
    {
      id: "ev_probed_claim",
      type: "sticky_note",
      title: "Probing Testimony",
      contentUrl: null,
      description: "Handwritten account. Very detailed. TOO detailed. We're not reading this.",
      tags: ["TESTIMONY", "PERSONAL"],
      position: { x: 380, y: 250 },
      isRedHerring: true
    },
    {
      id: "ev_mib_sighting",
      type: "photo",
      title: "Men in Black Photo",
      contentUrl: menInBlack,
      description: "Two men in suits near UFO site. Follow-up investigation: They were real estate agents.",
      tags: ["MIB", "SUITS"],
      position: { x: 720, y: 320 },
      isRedHerring: true
    },
    {
      id: "ev_government_denial",
      type: "document",
      title: "Official Denial Letter",
      contentUrl: null,
      description: "'The government has no knowledge of extraterrestrial activity.' Suspiciously specific denial. But it's just a denial.",
      tags: ["DENIAL", "OFFICIAL"],
      position: { x: 250, y: 520 },
      isRedHerring: true
    },
    {
      id: "ev_lights_video",
      type: "sticky_note",
      title: "Night Lights Video Notes",
      contentUrl: null,
      description: "'Saw three lights moving in formation.' Later confirmed: geese with reflective vests (don't ask).",
      tags: ["LIGHTS", "VIDEO"],
      position: { x: 620, y: 100 },
      isRedHerring: true
    },
    {
      id: "ev_ancient_aliens",
      type: "document",
      title: "Ancient Alien Theory Book",
      contentUrl: null,
      description: "Chapter 7: 'Pyramids were built by aliens'. Counter-theory: Built by Egyptians. Wild.",
      tags: ["ANCIENT", "BOOK"],
      position: { x: 450, y: 550 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THE TRUTH IS OUT THERE!",
    "THEY'RE FROM THE FUTURE!",
    "TIME TOURISTS!!!",
    "WE ARE THE ATTRACTION!",
    "CHRONOTON PARTICLES!",
    "THEY KNOW OUR FATE!",
    "WATCHING US LIKE A ZOO!",
    "TEMPORAL DISPLACEMENT!",
    "THE DATES MATCH!",
    "I WANT TO BELIEVE!"
  ],
  combinations: [
    {
      itemA: "ev_roswell_debris",
      itemB: "ev_temporal_radiation",
      unlockText: "THE DEBRIS EMITS CHRONOTON PARTICLES!",
      hint: "TEST THE METAL",
      difficulty: "medium",
      resultNodes: [
        {
          id: "ev_time_engine",
          type: "document",
          title: "Temporal Engine Fragment",
          contentUrl: null,
          description: "Metallurgical analysis proves it: This metal doesn't exist YET. It's from technology that hasn't been invented.",
          tags: ["TIME", "FUTURE", "METAL"],
          position: { x: 330, y: 120 },
          isRedHerring: false,
          hiddenText: "FLUX CAPACITOR 2.0",
          isCritical: true,
          truthTags: ["THE_CRAFT", "THE_TIME_TECH"]
        }
      ]
    },
    {
      itemA: "ev_recovered_camera",
      itemB: "ev_tour_brochure",
      unlockText: "THE CAMERA IS TOUR EQUIPMENT!",
      hint: "CHECK THE BRANDING",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_tour_kit",
          type: "document",
          title: "Complete Tourist Kit",
          contentUrl: null,
          description: "Standard issue: Camera, brochure, phrase book ('Hello primitive ancestors'), and a DO NOT INTERACT warning badge.",
          tags: ["TOURIST", "FUTURE", "KIT"],
          position: { x: 500, y: 280 },
          isRedHerring: false,
          hiddenText: "OPERATOR: CHRONO-TOURS LLC",
          isCritical: true,
          truthTags: ["THE_TOURISTS", "THE_PURPOSE"]
        }
      ]
    },
    {
      itemA: "ev_sighting_pattern",
      itemB: "ev_tour_brochure",
      unlockText: "THE DESTINATIONS MATCH THE TOUR PACKAGES!",
      hint: "COMPARE LOCATIONS",
      difficulty: "hard",
      resultNodes: [
        {
          id: "ev_tour_calendar",
          type: "document",
          title: "Chrono-Tour Schedule",
          contentUrl: null,
          description: "Full itinerary: 'Day 1: Hindenburg. Day 2: Chernobyl (safe distance!). Day 3: 21st Century Collapse (TBD).'",
          tags: ["DISASTER", "FUTURE", "SCHEDULE"],
          position: { x: 400, y: 450 },
          isRedHerring: false,
          hiddenText: "BOOK NOW - LIMITED SEATS!",
          isCritical: true,
          truthTags: ["THE_DESTINATIONS", "THE_PURPOSE"]
        }
      ]
    }
  ]
};
