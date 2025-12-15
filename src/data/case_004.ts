import type { CaseData } from "@/types/game";

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
  nodes: [
    {
      id: "ev_cloud_disk",
      type: "photo",
      title: "Suspicious Formation",
      contentUrl: null,
      description: "Cloud photographed over Seattle. Shape: FLOPPY DISK. Coincidence?",
      tags: ["SKY", "DATA", "STORAGE"],
      position: { x: 100, y: 80 },
      isRedHerring: false
    },
    {
      id: "ev_rain_article",
      type: "document",
      title: "Weather Anomaly Report",
      contentUrl: null,
      description: "Record rainfall detected 2 hours after every iPhone launch. EVERY. SINGLE. ONE.",
      tags: ["RAIN", "TECH", "UPLOAD"],
      position: { x: 480, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_server_smoke",
      type: "photo",
      title: "Data Center Exhaust",
      contentUrl: null,
      description: "Server farm with smokestack going directly into clouds. They call it 'cooling'. WE CALL IT UPLOADING.",
      tags: ["SMOKE", "CLOUD", "DATA"],
      position: { x: 300, y: 350 },
      isRedHerring: false
    },
    {
      id: "ev_dropbox",
      type: "sticky_note",
      title: "Dropbox = DROP. BOX.",
      contentUrl: null,
      description: "The name is a confession. They DROP the data from a BOX in the sky!",
      tags: ["STORAGE", "RAIN", "NAME"],
      position: { x: 550, y: 320 },
      isRedHerring: false
    },
    {
      id: "ev_umbrella",
      type: "photo",
      title: "Umbrella Corp Logo",
      contentUrl: null,
      description: "Why does a 'pharmaceutical company' have an umbrella logo? THEY KNOW.",
      tags: ["SHIELD", "GAME"],
      position: { x: 80, y: 380 },
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
    "CTRL+ALT+RAIN"
  ]
};
