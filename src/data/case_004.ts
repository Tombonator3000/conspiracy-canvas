import type { CaseData } from "@/types/game";
import { cloudDisk, serverSmoke, umbrella, airplaneClouds, puddleReflection } from "@/assets/evidence";

export const case004: CaseData = {
  id: "case_004_cloud",
  title: "The Literal Cloud",
  description: "Cloud storage is LITERAL. Tech giants use water vapor to store data. That's why it rains more when people upload vacation photos.",
  difficulty: "MEDIUM",
  theTruth: {
    subject: "BILL GATES",
    action: "STORES FILES IN",
    target: "RAIN CLOUDS",
    motive: "WEATHER CONTROL"
  },
  boardState: {
    sanity: 90,
    chaosLevel: 1,
    maxConnectionsNeeded: 4
  },
  // Semantic Truth Tags: Connect evidence proving THE_CLOUD + THE_CORRELATION + THE_UPLOAD + THE_CONFESSION
  requiredTags: ["THE_CLOUD", "THE_CORRELATION", "THE_UPLOAD", "THE_CONFESSION"],
  nodes: [
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_cloud_disk",
      type: "photo",
      title: "Suspicious Formation",
      contentUrl: cloudDisk,
      description: "Cloud photographed over Seattle. Shape: FLOPPY DISK. Coincidence?",
      tags: ["SKY", "DATA", "STORAGE"],
      position: { x: 100, y: 80 },
      isRedHerring: false,
      hiddenText: "3.5 INCH CUMULUS",
      isCritical: true,
      truthTags: ["THE_CLOUD"]  // The literal cloud
    },
    {
      id: "ev_rain_article",
      type: "document",
      title: "Weather Anomaly Report",
      contentUrl: null,
      description: "Record rainfall detected 2 hours after every iPhone launch. EVERY. SINGLE. ONE.",
      tags: ["RAIN", "TECH", "UPLOAD"],
      position: { x: 480, y: 100 },
      isRedHerring: false,
      hiddenText: "CORR: 0.99",
      isCritical: true,
      truthTags: ["THE_CORRELATION"]  // The upload-rain correlation
    },
    {
      id: "ev_server_smoke",
      type: "photo",
      title: "Data Center Exhaust",
      contentUrl: serverSmoke,
      description: "Server farm with smokestack going directly into clouds. They call it 'cooling'. WE CALL IT UPLOADING.",
      tags: ["SMOKE", "CLOUD", "DATA"],
      position: { x: 300, y: 350 },
      isRedHerring: false,
      hiddenText: "H2O + 01100100",
      isCritical: true,
      truthTags: ["THE_UPLOAD"]  // How data gets up there
    },
    {
      id: "ev_dropbox",
      type: "sticky_note",
      title: "Dropbox = DROP. BOX.",
      contentUrl: null,
      description: "The name is a confession. They DROP the data from a BOX in the sky!",
      tags: ["STORAGE", "RAIN", "NAME"],
      position: { x: 550, y: 320 },
      isRedHerring: false,
      isCritical: true,
      truthTags: ["THE_CONFESSION"]  // They admit it in the name
    },

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions
    {
      id: "ev_umbrella",
      type: "photo",
      title: "Umbrella Corp Logo",
      contentUrl: umbrella,
      description: "Why does a 'pharmaceutical company' have an umbrella logo? THEY KNOW.",
      tags: ["SHIELD", "GAME"],
      position: { x: 80, y: 380 },
      isRedHerring: true
    },
    {
      id: "ev_weather_app",
      type: "document",
      title: "Weather App Screenshot",
      contentUrl: null,
      description: "70% chance of rain. 70% of data uploads happen at night. COINCIDENCE?!",
      tags: ["APP", "PERCENT"],
      position: { x: 620, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_ethernet",
      type: "sticky_note",
      title: "Ethernet Cable",
      contentUrl: null,
      description: "Blue cable. Blue sky. Blue screen of death. IT'S ALL BLUE.",
      tags: ["WIRE", "BLUE"],
      position: { x: 200, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_icloud_terms",
      type: "document",
      title: "iCloud Terms of Service",
      contentUrl: null,
      description: "Page 847: 'We reserve the right to...' NOBODY READS THIS.",
      tags: ["LEGAL", "TERMS"],
      position: { x: 400, y: 200 },
      isRedHerring: true
    },

    // Pure Trash
    {
      id: "ev_coffee_ring",
      type: "sticky_note",
      title: "Coffee Ring Stain",
      contentUrl: null,
      description: "Circular. Like a cloud. Or just my morning coffee.",
      tags: ["STAIN", "CIRCLE"],
      position: { x: 150, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_usb_stick",
      type: "sticky_note",
      title: "Old USB Stick",
      contentUrl: null,
      description: "4GB. Contains vacation photos from 2009. Unrelated.",
      tags: ["STORAGE", "OLD"],
      position: { x: 650, y: 380 },
      isRedHerring: true
    },
    {
      id: "ev_power_bill",
      type: "document",
      title: "Power Bill",
      contentUrl: null,
      description: "High electricity usage. Because I leave everything on.",
      tags: ["ELECTRIC", "EXPENSE"],
      position: { x: 500, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_airplane_photo",
      type: "photo",
      title: "Airplane Window Shot",
      contentUrl: airplaneClouds,
      description: "Flew through clouds. Data transfer? Or just turbulence?",
      tags: ["PLANE", "VIEW"],
      position: { x: 250, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_rain_jacket",
      type: "sticky_note",
      title: "Rain Jacket Tag",
      contentUrl: null,
      description: "Waterproof. Data-proof? Research needed.",
      tags: ["CLOTHING", "WET"],
      position: { x: 100, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_wifi_password",
      type: "sticky_note",
      title: "WiFi Password Note",
      contentUrl: null,
      description: "password123. Very secure. Very cloud.",
      tags: ["NETWORK", "INSECURE"],
      position: { x: 580, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_puddle_photo",
      type: "photo",
      title: "Puddle Reflection",
      contentUrl: puddleReflection,
      description: "Water on ground. DATA on ground? No, just water.",
      tags: ["WATER", "GROUND"],
      position: { x: 350, y: 480 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "IT'S RAINING DATA!",
    "THE CLOUD IS REAL",
    "UPLOAD = CONDENSATION",
    "DOWNLOAD = PRECIPITATION",
    "BILL KNOWS",
    "CHECK THE HUMIDITY",
    "CTRL+ALT+RAIN",
    "NIMBUS STORAGE",
    "CUMULO-DATA"
  ],
  combinations: [
    {
      itemA: "ev_cloud_disk",
      itemB: "ev_rain_article",
      unlockText: "THE UPLOAD SCHEDULE MATCHES RAINFALL!",
      hint: "CHECK UPLOAD TIMES",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_correlation_chart",
          type: "document",
          title: "Upload-Rain Correlation",
          contentUrl: null,
          description: "iPhone launches: 100% rainfall. Android updates: 87% rainfall. Windows updates: THUNDERSTORMS.",
          tags: ["RAIN", "DATA", "UPLOAD"],
          position: { x: 280, y: 180 },
          isRedHerring: false,
          hiddenText: "R² = 0.9999",
          isCritical: true,
          truthTags: ["THE_CORRELATION", "THE_CLOUD"]  // Statistical proof
        }
      ]
    },
    {
      itemA: "ev_server_smoke",
      itemB: "ev_dropbox",
      unlockText: "DROPBOX MEANS DROP. FROM. SKY!",
      hint: "WHAT GOES UP...",
      difficulty: "medium",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_water_cycle",
          type: "document",
          title: "The Data Cycle",
          contentUrl: null,
          description: "Evaporation (upload) → Condensation (storage) → Precipitation (download). IT'S THE WATER CYCLE!",
          tags: ["CLOUD", "STORAGE", "RAIN"],
          position: { x: 450, y: 280 },
          isRedHerring: false,
          hiddenText: "H2O = DATA",
          isCritical: false
        }
      ]
    },
    {
      itemA: "ev_water_cycle",
      itemB: "ev_icloud_terms",
      unlockText: "PAGE 847 ADMITS EVERYTHING!",
      hint: "READ THE FINE PRINT",
      difficulty: "hard",
      bonusCredibility: 350,
      resultNodes: [
        {
          id: "ev_admission",
          type: "document",
          title: "Legal Admission",
          contentUrl: null,
          description: "Clause 847.3: 'User acknowledges data may be stored in atmospheric conditions including but not limited to: cumulus, stratus, and nimbus formations.'",
          tags: ["CLOUD", "DATA", "SKY"],
          position: { x: 380, y: 380 },
          isRedHerring: false,
          hiddenText: "LEGALLY BINDING RAIN",
          isCritical: true,
          truthTags: ["THE_CONFESSION", "THE_CLOUD"]  // Legal admission
        }
      ]
    }
  ]
};
