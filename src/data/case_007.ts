import type { CaseData } from "@/types/game";
import { iphone1912, fakeIceberg, titanicMovie } from "@/assets/evidence";

export const case007: CaseData = {
  id: "case_007_titanic",
  title: "Titanic Tourism",
  description: "The Titanic didn't sink from an iceberg. It was a cruise for time travelers who brought too many souvenirs from the future, making the ship too heavy.",
  difficulty: "HARD",
  theTruth: {
    subject: "TIME TRAVELERS",
    action: "SANK",
    target: "THE TITANIC",
    motive: "SOUVENIR OVERLOAD"
  },
  boardState: {
    sanity: 70,
    chaosLevel: 2,
    maxConnectionsNeeded: 5
  },
  // Semantic Truth Tags: Connect evidence proving THE_TECH + THE_PASSENGERS + THE_COVER_UP + THE_WEIGHT + THE_WITNESSES
  requiredTruthTags: ["THE_TECH", "THE_PASSENGERS", "THE_COVER_UP", "THE_WEIGHT", "THE_WITNESSES"],
  nodes: [
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_iphone_1912",
      type: "photo",
      title: "Temporal Anomaly",
      contentUrl: iphone1912,
      description: "Grainy 1912 photo. Man in background holding rectangular object. iPhone? IN 1912?!",
      tags: ["TECH", "OLD", "PHONE", "TIME"],
      position: { x: 100, y: 80 },
      isRedHerring: false,
      hiddenText: "MODEL: 15 PRO",
      isCritical: true,
      truthTags: ["THE_TECH"]  // Future technology found
    },
    {
      id: "ev_passenger_list",
      type: "document",
      title: "Passenger Manifest",
      contentUrl: null,
      description: "Names include: 'M. McFly', 'Dr. E. Brown', 'Sarah Connor'. COINCIDENCE?!",
      tags: ["NAME", "TIME", "LIST"],
      position: { x: 520, y: 100 },
      isRedHerring: false,
      hiddenText: "DECK 88",
      isCritical: true,
      truthTags: ["THE_PASSENGERS"]  // Time traveler names
    },
    {
      id: "ev_iceberg",
      type: "photo",
      title: "The 'Iceberg'",
      contentUrl: fakeIceberg,
      description: "Enhanced photo shows iceberg is too smooth. Plastic prop? Hologram?",
      tags: ["ICE", "FAKE", "PROP", "TIME"],
      position: { x: 300, y: 320 },
      isRedHerring: false,
      hiddenText: "MADE IN 2087",
      isCritical: true,
      truthTags: ["THE_COVER_UP"]  // The fake iceberg
    },
    {
      id: "ev_souvenirs",
      type: "document",
      title: "Cargo Manifest Anomaly",
      contentUrl: null,
      description: "Listed cargo: 'Future memorabilia - 50 tons'. Ship capacity: 46 tons excess. THE MATH DOESN'T LIE.",
      tags: ["WEIGHT", "TIME", "CARGO"],
      position: { x: 550, y: 340 },
      isRedHerring: false,
      hiddenText: "50T FUTURE JUNK",
      isCritical: true,
      truthTags: ["THE_WEIGHT"]  // The overloaded cargo
    },
    {
      id: "ev_band",
      type: "sticky_note",
      title: "The Band Played On",
      contentUrl: null,
      description: "Band kept playing as ship sank. PROFESSIONAL musicians? Or FUTURE DJs with Spotify?",
      tags: ["MUSIC", "TIME", "CALM"],
      position: { x: 100, y: 400 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ["THE_WITNESSES"]  // People who knew
    },

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions
    {
      id: "ev_movie",
      type: "photo",
      title: "The Movie (1997)",
      contentUrl: titanicMovie,
      description: "James Cameron's 'Titanic' - Documentary? Or LEAKED FOOTAGE from a future tourist's camera?",
      tags: ["FILM", "LEAK"],
      position: { x: 420, y: 430 },
      isRedHerring: true
    },
    {
      id: "ev_lifeboat",
      type: "document",
      title: "Lifeboat Inventory",
      contentUrl: null,
      description: "Not enough lifeboats. Cost cutting? Or they KNEW some passengers could time-travel away?",
      tags: ["SAFETY", "MISSING"],
      position: { x: 650, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_ocean_temp",
      type: "document",
      title: "Ocean Temperature Log",
      contentUrl: null,
      description: "Water was cold. Very cold. Consistent with... being in the ocean.",
      tags: ["WATER", "COLD"],
      position: { x: 200, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_dinner_menu",
      type: "document",
      title: "First Class Menu",
      contentUrl: null,
      description: "Oysters, Filet Mignon, Waldorf Pudding. No avocado toast. PROVES nothing.",
      tags: ["FOOD", "FANCY"],
      position: { x: 400, y: 180 },
      isRedHerring: true
    },

    // Pure Trash
    {
      id: "ev_postcard",
      type: "sticky_note",
      title: "Souvenir Postcard",
      contentUrl: null,
      description: "'Wish you were here!' - Generic message. From the future? Unclear.",
      tags: ["MAIL", "TOURIST"],
      position: { x: 150, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_ticket_stub",
      type: "sticky_note",
      title: "Ticket Stub",
      contentUrl: null,
      description: "Third class. $15. Expensive for 1912. Or CHEAP for time travel.",
      tags: ["TICKET", "PRICE"],
      position: { x: 600, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_ship_diagram",
      type: "document",
      title: "Ship Blueprint",
      contentUrl: null,
      description: "Shows all decks. No secret time machine room marked. SUSPICIOUS.",
      tags: ["BLUEPRINT", "SHIP"],
      position: { x: 250, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_newspaper",
      type: "document",
      title: "1912 Newspaper",
      contentUrl: null,
      description: "'UNSINKABLE SHIP SINKS' - They called it unsinkable. HOW DID THEY KNOW? (Marketing.)",
      tags: ["NEWS", "HEADLINE"],
      position: { x: 500, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_compass",
      type: "sticky_note",
      title: "Broken Compass",
      contentUrl: null,
      description: "Points in wrong direction. Magnetic interference from TIME PORTAL? (Or just broken.)",
      tags: ["NAVIGATION", "BROKEN"],
      position: { x: 650, y: 400 },
      isRedHerring: true
    },
    {
      id: "ev_violin",
      type: "photo",
      title: "Violin Photo",
      contentUrl: null,
      description: "Recovered from wreck. Music plays emotions. Emotions are timeless. Therefore... NOTHING.",
      tags: ["MUSIC", "INSTRUMENT"],
      position: { x: 80, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_morse_code",
      type: "document",
      title: "SOS Transcript",
      contentUrl: null,
      description: "Distress signal sent. Normal procedure. Or FUTURE BLUETOOTH?! (No. Radio.)",
      tags: ["SIGNAL", "HELP"],
      position: { x: 350, y: 250 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "88 MPH = ICEBERG SPEED",
    "THE FUTURE IS HEAVY",
    "CHECK THE CARGO HOLD",
    "WHO BOOKED THIS TRIP?",
    "ROSE HAD A SMARTPHONE",
    "JACK WAS FROM 2045",
    "GREAT SCOTT!",
    "TEMPORAL OVERLOAD",
    "WHERE'S THE DELOREAN?",
    "FLUX CAPACITOR WATERLOGGED"
  ],
  combinations: [
    {
      itemA: "ev_iphone_1912",
      itemB: "ev_passenger_list",
      unlockText: "M. MCFLY IS HOLDING THE PHONE!",
      hint: "WHO OWNS THE DEVICE?",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_time_tourist",
          type: "document",
          title: "Time Tourist ID",
          contentUrl: null,
          description: "Enhanced photo reveals iPhone case with text: 'Time Tours Inc. - Est. 2087'. It's a TOUR GROUP!",
          tags: ["TIME", "PHONE", "TOURIST"],
          position: { x: 300, y: 150 },
          isRedHerring: false,
          hiddenText: "BOOKING #88MPH",
          isCritical: true,
          truthTags: ["THE_TECH", "THE_PASSENGERS"]  // Links tech to passengers
        }
      ]
    },
    {
      itemA: "ev_iceberg",
      itemB: "ev_souvenirs",
      unlockText: "THE ICEBERG WAS A COVER-UP!",
      hint: "WHAT REALLY SANK IT?",
      difficulty: "medium",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_weight_analysis",
          type: "document",
          title: "Weight Distribution Report",
          contentUrl: null,
          description: "Souvenir weight: 50 tons. Ship exceeded capacity by EXACTLY 50 tons. The iceberg was a SCAPEGOAT!",
          tags: ["WEIGHT", "CARGO", "FAKE"],
          position: { x: 450, y: 280 },
          isRedHerring: false,
          hiddenText: "ICEBERG: HOLOGRAM",
          isCritical: false
        }
      ]
    },
    {
      itemA: "ev_weight_analysis",
      itemB: "ev_band",
      unlockText: "THE BAND KNEW THE FUTURE!",
      hint: "WHY WERE THEY SO CALM?",
      difficulty: "hard",
      bonusCredibility: 400,
      resultNodes: [
        {
          id: "ev_playlist",
          type: "document",
          title: "The Impossible Playlist",
          contentUrl: null,
          description: "Band's setlist found: 'My Heart Will Go On - Celine Dion (1997)'. They were playing songs FROM THE FUTURE!",
          tags: ["MUSIC", "TIME", "CALM"],
          position: { x: 380, y: 380 },
          isRedHerring: false,
          hiddenText: "SPOTIFY: 1912",
          isCritical: true,
          truthTags: ["THE_WITNESSES", "THE_TECH"]  // Music from future
        }
      ]
    },
    {
      itemA: "ev_time_tourist",
      itemB: "ev_movie",
      unlockText: "CAMERON WAS A PASSENGER!",
      hint: "HOW DID HE KNOW?",
      difficulty: "hard",
      bonusCredibility: 500,
      resultNodes: [
        {
          id: "ev_cameron_confession",
          type: "document",
          title: "The Cameron Confession",
          contentUrl: null,
          description: "Passenger list entry: 'J. Cameron, filmmaker, future/past'. The movie wasn't fiction - IT WAS HIS HOME VIDEO!",
          tags: ["TIME", "LIST", "FILM"],
          position: { x: 280, y: 450 },
          isRedHerring: false,
          hiddenText: "BUDGET: $200M PAST DOLLARS",
          isCritical: true,
          truthTags: ["THE_PASSENGERS", "THE_COVER_UP", "THE_WITNESSES"]  // Cameron proof
        }
      ]
    }
  ]
};
