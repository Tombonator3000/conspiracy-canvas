import type { CaseData } from "@/types/game";
import { pigeonSuspicious, powerlinesBirds, catSuspicious } from "@/assets/evidence";

export const case001: CaseData = {
  id: "case_001_birds",
  title: "Operation: Feathered Battery",
  description: "Local reports of pigeons acting strangely near power lines. Are they just birds, or something more sinister?",
  difficulty: "TUTORIAL",
  theTruth: {
    subject: "PIGEONS",
    action: "ARE RECHARGING ON",
    target: "POWER LINES",
    motive: "TO SPY ON US"
  },
  boardState: {
    sanity: 100,
    chaosLevel: 0,
    maxConnectionsNeeded: 3
  },
  requiredTags: ["subject", "location", "proof"],
  nodes: [
    // ===== REAL EVIDENCE (30%) =====
    {
      id: "ev_pigeon_photo",
      type: "photo",
      title: "Suspicious Bird",
      contentUrl: pigeonSuspicious,
      description: "Photo taken at 3 AM. Subject has not blinked for 2 hours.",
      tags: ["DRONE", "SURVEILLANCE", "EYES", "subject"],
      position: { x: 180, y: 140 },
      isRedHerring: false,
      hiddenText: "SERIAL #: BD-7742",
      isCritical: true,
      truthTags: ["THE_DRONE"]  // This IS the drone/bird
    },
    {
      id: "ev_schematic",
      type: "document",
      title: "Leaked Patent #9921",
      contentUrl: null,
      description: "Blueprint for 'Autonomous Avian Data Collector'. CLASSIFIED.",
      tags: ["DRONE", "GOVERNMENT", "BATTERY", "proof"],
      position: { x: 520, y: 180 },
      isRedHerring: false,
      hiddenText: "PROJECT NEST EGG",
      isCritical: true,
      truthTags: ["THE_TECH"]  // The technology/proof they're manufactured
    },
    {
      id: "ev_powerline",
      type: "photo",
      title: "Power Line Anomaly",
      contentUrl: powerlinesBirds,
      description: "Energy spikes detected whenever flocks land here. COINCIDENCE?",
      tags: ["BATTERY", "ELECTRICITY", "CITY", "location"],
      position: { x: 350, y: 420 },
      isRedHerring: false,
      hiddenText: "5V @ 2.1A",
      isCritical: true,
      truthTags: ["THE_POWER_SOURCE"]  // Where they recharge
    },

    // ===== RED HERRINGS & JUNK (70%) =====
    
    // Distractions (looks related but isn't)
    {
      id: "ev_cat_picture",
      type: "photo",
      title: "Mr. Whiskers",
      contentUrl: catSuspicious,
      description: "Just a cute cat. Or is it? Those eyes...",
      tags: ["FUR", "PET"],
      position: { x: 620, y: 340 },
      isRedHerring: true
    },
    {
      id: "ev_weather_balloon",
      type: "photo",
      title: "UFO Sighting??",
      contentUrl: null,
      description: "Spotted over Main St. 2019. Definitely not a weather balloon.",
      tags: ["SKY", "FLYING"],
      position: { x: 100, y: 300 },
      isRedHerring: true
    },
    {
      id: "ev_drone_manual",
      type: "document",
      title: "DJI Drone Manual",
      contentUrl: null,
      description: "Pages 45-67 missing. Suspicious? Or just bad filing?",
      tags: ["MANUAL", "TECH"],
      position: { x: 450, y: 50 },
      isRedHerring: true
    },
    {
      id: "ev_bird_book",
      type: "document",
      title: "Field Guide: Urban Birds",
      contentUrl: null,
      description: "Chapter on pigeons has coffee stain. Someone was researching...",
      tags: ["ORNITHOLOGY", "BOOK"],
      position: { x: 200, y: 280 },
      isRedHerring: true
    },

    // Pure Trash
    {
      id: "ev_grocery_list",
      type: "sticky_note",
      title: "Mom's Shopping List",
      contentUrl: null,
      description: "Bread, Milk, Birdseed... wait, BIRDSEED?!",
      tags: ["FOOD", "SHOPPING"],
      position: { x: 80, y: 380 },
      isRedHerring: true
    },
    {
      id: "ev_coffee_receipt",
      type: "sticky_note",
      title: "Starbucks Receipt",
      contentUrl: null,
      description: "Grande Latte. $6.75. Why is this even here?",
      tags: ["COFFEE", "RECEIPT"],
      position: { x: 550, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_gum_wrapper",
      type: "sticky_note",
      title: "Gum Wrapper",
      contentUrl: null,
      description: "Spearmint. Chewed on 03/15. Evidence of... nothing.",
      tags: ["TRASH", "MINT"],
      position: { x: 320, y: 180 },
      isRedHerring: true
    },
    {
      id: "ev_expired_coupon",
      type: "document",
      title: "Expired Coupon",
      contentUrl: null,
      description: "50% off birdseed. Expired 2018. COINCIDENCE?! (yes)",
      tags: ["COUPON", "EXPIRED"],
      position: { x: 680, y: 120 },
      isRedHerring: true
    },
    {
      id: "ev_blurry_photo",
      type: "photo",
      title: "Blurry Thumb Photo",
      contentUrl: null,
      description: "Accidentally took this. Might be important? Probably not.",
      tags: ["ACCIDENT", "BLURRY"],
      position: { x: 420, y: 320 },
      isRedHerring: true
    },
    {
      id: "ev_electric_bill",
      type: "document",
      title: "Electric Bill",
      contentUrl: null,
      description: "Unusually high this month. $127.43. Probably the AC.",
      tags: ["UTILITY", "BILL"],
      position: { x: 150, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_newspaper",
      type: "document",
      title: "Newspaper Clipping",
      contentUrl: null,
      description: "'Local Man Sees Strange Lights' - totally unrelated to birds.",
      tags: ["NEWS", "LIGHTS"],
      position: { x: 580, y: 450 },
      isRedHerring: true
    },
    {
      id: "ev_bus_ticket",
      type: "sticky_note",
      title: "Bus Ticket Stub",
      contentUrl: null,
      description: "Route 42. To downtown. I don't even remember this trip.",
      tags: ["TRANSPORT", "TICKET"],
      position: { x: 280, y: 520 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "BIRDS AREN'T REAL!",
    "WHERE ARE THE BATTERIES?!",
    "THEY CHARGE AT NIGHT",
    "LOOK AT THE BEAK!",
    "IT'S ALL CONNECTED",
    "COINCIDENCE?!",
    "WAKE UP SHEEPLE",
    "FOLLOW THE WIRES",
    "I KNEW IT!",
    "THE PATTERN IS CLEAR"
  ],
  combinations: [
    {
      itemA: "ev_drone_manual",
      itemB: "ev_bird_book",
      unlockText: "THE MANUALS REVEAL THE TRUTH!",
      hint: "COMPARE THE DIAGRAMS",
      difficulty: "easy",
      isChainResult: true,
      resultNodes: [
        {
          id: "ev_combined_blueprint",
          type: "document",
          title: "Cross-Referenced Plans",
          contentUrl: null,
          description: "Page 47 of drone manual matches Chapter 3 of bird guide! They're building them to LOOK like birds!",
          tags: ["DRONE", "BATTERY", "SURVEILLANCE"],
          position: { x: 350, y: 100 },
          isRedHerring: false,
          hiddenText: "AVIAN UNIT SPECS v2.3",
          isCritical: true,
          truthTags: ["THE_TECH"]  // Inherits + confirms THE_TECH
        },
        {
          id: "ev_hidden_memo",
          type: "sticky_note",
          title: "Scribbled Note",
          contentUrl: null,
          description: "Found between pages: 'Replace all units by 2025'",
          tags: ["GOVERNMENT", "DRONE"],
          position: { x: 450, y: 150 },
          isRedHerring: false,
          hiddenText: "PROJECT MOCKINGBIRD",
          isCritical: false
        }
      ]
    },
    {
      itemA: "ev_combined_blueprint",
      itemB: "ev_powerline",
      unlockText: "THE CHARGING STATION LOCATIONS MATCH!",
      hint: "WHERE DO THEY RECHARGE?",
      difficulty: "medium",
      bonusCredibility: 300,
      resultNodes: [
        {
          id: "ev_charging_network",
          type: "document",
          title: "National Charging Grid",
          contentUrl: null,
          description: "Map overlay: Every power line = bird drone charging station. The entire grid is a REFUELING NETWORK!",
          tags: ["BATTERY", "ELECTRICITY", "GOVERNMENT"],
          position: { x: 400, y: 250 },
          isRedHerring: false,
          hiddenText: "5V USB-BEAK",
          isCritical: true,
          truthTags: ["THE_POWER_SOURCE", "THE_TECH"]  // Confirms the charging network
        }
      ]
    },
    {
      itemA: "ev_pigeon_photo",
      itemB: "ev_schematic",
      unlockText: "THE EYES ARE CAMERAS!",
      hint: "LOOK AT THE EYES",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_camera_specs",
          type: "document",
          title: "Ocular Specifications",
          contentUrl: null,
          description: "Bird eye specs: 4K resolution, night vision, facial recognition. Standard pigeon eyes? IMPOSSIBLE.",
          tags: ["SURVEILLANCE", "EYES", "DRONE"],
          position: { x: 280, y: 320 },
          isRedHerring: false,
          hiddenText: "FIRMWARE: HAWK.EYE",
          isCritical: true,
          truthTags: ["THE_DRONE", "THE_TECH"]  // Proves the bird IS a drone
        }
      ]
    }
  ]
};
