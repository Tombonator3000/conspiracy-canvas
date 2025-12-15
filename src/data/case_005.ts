import type { CaseData } from "@/types/game";
import { catRouter, catPhone, goodDog } from "@/assets/evidence";

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
  nodes: [
    {
      id: "ev_cat_router",
      type: "photo",
      title: "Charging Station",
      contentUrl: catRouter,
      description: "Cat sitting on router. They claim it's 'warm'. It's actually INDUCTIVE CHARGING.",
      tags: ["CAT", "HEAT", "WIFI"],
      position: { x: 120, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_purr_frequency",
      type: "document",
      title: "Acoustic Analysis",
      contentUrl: null,
      description: "Cat purring measured at exactly 5GHz. THE SAME AS YOUR ROUTER. Wake up.",
      tags: ["SOUND", "FREQUENCY", "5G"],
      position: { x: 500, y: 80 },
      isRedHerring: false
    },
    {
      id: "ev_cat_eyes",
      type: "photo",
      title: "The Gaze",
      contentUrl: catPhone,
      description: "Cat staring at phone screen. Reading your texts? Or TRANSMITTING them?",
      tags: ["EYES", "DATA", "CAT"],
      position: { x: 300, y: 340 },
      isRedHerring: false
    },
    {
      id: "ev_ancient_egypt",
      type: "document",
      title: "Historical Pattern",
      contentUrl: null,
      description: "Egyptians worshipped cats. Egypt built pyramids. Pyramids = ancient cell towers?",
      tags: ["HISTORY", "WIFI", "TOWER"],
      position: { x: 550, y: 350 },
      isRedHerring: false
    },
    {
      id: "ev_dog",
      type: "photo",
      title: "Good Boy",
      contentUrl: goodDog,
      description: "A dog. Loyal. Honest. NOT A SPY. ...Right?",
      tags: ["PET", "INNOCENT"],
      position: { x: 80, y: 380 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THE PURR IS A UPLOAD!",
    "CATS HAVE 9 LIVES = 9 ANTENNAS",
    "MEOW = MORSE CODE",
    "THEY'RE ALWAYS WATCHING",
    "KNOCK THINGS OFF TABLE = DATA DUMP",
    "HAIRBALLS = CORRUPTED FILES"
  ]
};
