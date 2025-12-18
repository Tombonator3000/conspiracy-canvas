import type { CaseData } from "@/types/game";

export const case016: CaseData = {
  id: "case_016_finland",
  title: "Operation: Baltic Fishing",
  description: "Finland doesn't exist. It's a fabricated landmass created by Japan and the Soviet Union during the Cold War to establish secret fishing rights in the Baltic Sea. The 'Finnish' people? Scattered across Sweden, Estonia, and Russia.",
  difficulty: "MEDIUM",
  theTruth: {
    subject: "FINLAND",
    action: "IS ACTUALLY",
    target: "JAPANESE FISHING WATERS",
    motive: "TO AVOID FISHING QUOTAS"
  },
  boardState: {
    sanity: 75,
    chaosLevel: 1,
    maxConnectionsNeeded: 4
  },
  requiredTags: ["THE_FAKE", "THE_FISH", "THE_DEAL", "THE_COVER"],
  nodes: [
    // ===== REAL EVIDENCE =====
    {
      id: "ev_map_anomaly",
      type: "document",
      title: "Population Density Analysis",
      contentUrl: null,
      description: "Finland: 5.5 million people in 338,000 km². That's 16 people per km². Sweden has 25. Estonia has 30. WHY IS FINLAND SO EMPTY?",
      tags: ["MAP", "POPULATION", "EMPTY"],
      position: { x: 100, y: 100 },
      isRedHerring: false,
      hiddenText: "ACTUALLY: 0 PEOPLE",
      isCritical: true,
      truthTags: ["THE_FAKE"]
    },
    {
      id: "ev_nokia_hq",
      type: "photo",
      title: "Nokia Headquarters",
      contentUrl: null,
      description: "Nokia: 'Finnish' company. Headquarters: Listed as 'Espoo, Finland'. But Espoo is just a P.O. Box in SWEDEN. The company is a FRONT.",
      tags: ["NOKIA", "COMPANY", "FRONT"],
      position: { x: 400, y: 80 },
      isRedHerring: false,
      hiddenText: "HQ: TOKYO",
      isCritical: true,
      truthTags: ["THE_COVER"]
    },
    {
      id: "ev_japan_fish",
      type: "document",
      title: "Japan-Finland Fish Exports",
      contentUrl: null,
      description: "Japan imports 89% of its fish from 'Finland'. BUT the Baltic Sea can't produce that much! The fish comes from the ENTIRE ocean - labeled 'Finnish' to avoid quotas.",
      tags: ["FISH", "EXPORT", "JAPAN"],
      position: { x: 250, y: 280 },
      isRedHerring: false,
      hiddenText: "QUOTA BYPASS: 100%",
      isCritical: true,
      truthTags: ["THE_FISH", "THE_DEAL"]
    },
    {
      id: "ev_trans_siberian",
      type: "document",
      title: "Trans-Siberian Railway Route",
      contentUrl: null,
      description: "The railway goes from Russia to Finland to Japan. Fish travels by rail, not ship. The 'Finland' section is OCEAN - the train goes through a TUNNEL.",
      tags: ["RAILWAY", "ROUTE", "TUNNEL"],
      position: { x: 550, y: 200 },
      isRedHerring: false,
      hiddenText: "UNDERWATER SECTION",
      isCritical: true,
      truthTags: ["THE_DEAL", "THE_FISH"]
    },
    {
      id: "ev_finnish_language",
      type: "sticky_note",
      title: "Finnish Language Analysis",
      contentUrl: null,
      description: "'Finnish' is completely unrelated to Swedish, Russian, or any neighbor. Because it's MADE UP. Linguists can't trace its origins. IT HAS NO ORIGINS.",
      tags: ["LANGUAGE", "FAKE", "UNIQUE"],
      position: { x: 120, y: 400 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ["THE_FAKE"]
    },
    {
      id: "ev_population_data",
      type: "document",
      title: "Census Discrepancies",
      contentUrl: null,
      description: "Finland's census: Self-reported. No external verification. Because if anyone COUNTED, they'd find the country is EMPTY.",
      tags: ["CENSUS", "DATA", "FAKE"],
      position: { x: 480, y: 350 },
      isRedHerring: false,
      hiddenText: "ACTUAL COUNT: ???",
      isCritical: true,
      truthTags: ["THE_COVER", "THE_FAKE"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_ferry_routes",
      type: "photo",
      title: "Baltic Ferry Map",
      contentUrl: null,
      description: "Ferries go to 'Helsinki'. But they dock in Swedish territorial waters. Passengers are BUSSED to 'Finland'. WAKE UP.",
      tags: ["FERRY", "ROUTE"],
      position: { x: 200, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_sushi_restaurant",
      type: "photo",
      title: "Sushi Restaurant in 'Helsinki'",
      contentUrl: null,
      description: "Japanese restaurant in 'Finland'. Coincidence? The Japanese are EVERYWHERE in their fake country, managing the fish operation.",
      tags: ["SUSHI", "RESTAURANT"],
      position: { x: 650, y: 100 },
      isRedHerring: true
    },
    {
      id: "ev_sauna_photo",
      type: "photo",
      title: "Finnish Sauna",
      contentUrl: null,
      description: "Famous 'Finnish' saunas. Also found in Sweden, Russia, Estonia. NOT unique to Finland. Because FINLAND ISN'T UNIQUE. IT'S NOT REAL.",
      tags: ["SAUNA", "CULTURE"],
      position: { x: 300, y: 150 },
      isRedHerring: true
    },
    {
      id: "ev_aurora",
      type: "photo",
      title: "Northern Lights Photo",
      contentUrl: null,
      description: "Aurora Borealis over 'Finland'. Also visible from Sweden, Norway, Russia. The lights don't prove the land exists.",
      tags: ["AURORA", "SKY"],
      position: { x: 50, y: 300 },
      isRedHerring: true
    },
    {
      id: "ev_moomins",
      type: "sticky_note",
      title: "Moomin Characters",
      contentUrl: null,
      description: "Moomins are 'Finnish' cartoon characters. Created by Tove Jansson - a SWEDISH-speaking author. Even 'Finnish' culture is Swedish.",
      tags: ["MOOMIN", "CARTOON"],
      position: { x: 600, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_cold_war_map",
      type: "document",
      title: "Cold War Territory Map",
      contentUrl: null,
      description: "1947 map shows 'Finland' as neutral territory. NEUTRAL = NOBODY OWNS IT = IT'S OCEAN.",
      tags: ["COLD WAR", "MAP"],
      position: { x: 350, y: 420 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "FINLAND IS A LIE",
    "THE FISH MUST FLOW",
    "NOKIA = JAPANESE",
    "CHECK THE QUOTAS",
    "EMPTY LAND = NO LAND",
    "THE BALTIC DEAL",
    "TRANS-SIBERIAN TUNNEL",
    "SWEDISH ACTORS",
    "WHERE ARE THE FINNS?",
    "FOLLOW THE SUSHI"
  ],
  combinations: [
    {
      itemA: "ev_map_anomaly",
      itemB: "ev_finnish_language",
      unlockText: "FAKE COUNTRY, FAKE LANGUAGE!",
      hint: "WHY SO EMPTY?",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_fabrication_proof",
          type: "document",
          title: "The Fabrication Evidence",
          contentUrl: null,
          description: "Empty land + made-up language + no genetic ties to neighbors = FABRICATED NATION. 'Finns' are Swedish/Russian/Estonian people paid to pretend.",
          tags: ["FABRICATION", "PROOF", "FAKE"],
          position: { x: 110, y: 250 },
          isRedHerring: false,
          hiddenText: "ACTORS: PAID",
          isCritical: true,
          truthTags: ["THE_FAKE", "THE_COVER"]
        }
      ]
    },
    {
      itemA: "ev_japan_fish",
      itemB: "ev_trans_siberian",
      unlockText: "THE FISH PIPELINE!",
      hint: "HOW DOES IT TRAVEL?",
      difficulty: "medium",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_fish_route",
          type: "document",
          title: "The Finnish Fish Pipeline",
          contentUrl: null,
          description: "Japanese fishing boats → 'Finnish' waters (actually open ocean) → Train through fake 'Finland' (underwater tunnel) → Japan. TAX FREE. QUOTA FREE.",
          tags: ["FISH", "PIPELINE", "ROUTE"],
          position: { x: 400, y: 240 },
          isRedHerring: false,
          hiddenText: "ANNUAL: $47B",
          isCritical: true,
          truthTags: ["THE_FISH", "THE_DEAL"]
        }
      ]
    },
    {
      itemA: "ev_nokia_hq",
      itemB: "ev_population_data",
      unlockText: "THE CORPORATE COVER!",
      hint: "WHO BENEFITS?",
      difficulty: "medium",
      bonusCredibility: 300,
      resultNodes: [
        {
          id: "ev_corporate_conspiracy",
          type: "document",
          title: "Operation: Nordic Cover",
          contentUrl: null,
          description: "Nokia, Marimekko, Angry Birds - all 'Finnish' companies. All fronts for laundering fish money. Their products? Made in China. Profits? To Japan.",
          tags: ["NOKIA", "CORPORATE", "FRONT"],
          position: { x: 440, y: 130 },
          isRedHerring: false,
          isCritical: false,
          truthTags: ["THE_COVER"]
        }
      ]
    }
  ]
};
