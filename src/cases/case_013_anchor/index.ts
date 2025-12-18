import type { CaseData } from "@/types/game";

// Assets placeholders - images to be added later
const imgShipInField = "/assets/case_013/ship_cornfield.jpg";
const imgFusedHand = "/assets/case_013/hand_in_steel.jpg";
const imgRadar = "/assets/case_013/radar_glitch.jpg";
const imgClassified = "/assets/case_013/top_secret_redacted.jpg";
const imgMap = "/assets/case_013/kansas_map.jpg";
const imgGeiger = "/assets/case_013/geiger_counter.jpg";
const imgFarmer = "/assets/case_013/farmer_interview.jpg";
const imgCropCircle = "/assets/case_013/crop_circle.jpg";
const imgMeteor = "/assets/case_013/meteor_rock.jpg";
const imgCompass = "/assets/case_013/spinning_compass.jpg";

export const case013: CaseData = {
  id: "case_013_anchor",
  title: "The Kansas Event",
  description: "A catastrophic teleportation error. A destroyer class vessel has materialized inside a farmhouse in the Midwest.",
  difficulty: "HARD",

  theTruth: {
    subject: "DARPA",
    action: "TELEPORTED",
    target: "USS ELDRIDGE II",
    motive: "DIMENSIONAL TRAVEL"
  },

  boardState: {
    sanity: 75,
    chaosLevel: 2,
    maxConnectionsNeeded: 5
  },

  requiredTags: ["THE_VESSEL", "THE_ANOMALY", "THE_AFTERMATH"],

  nodes: [
    // --- CRITICAL EVIDENCE ---

    {
      id: "ev_ship_photo",
      type: "photo",
      title: "Aerial Photo #442",
      contentUrl: imgShipInField,
      description: "Grainy aerial shot showing a naval destroyer crushing a barn. No tracks leading to it. It just... appeared.",
      tags: ["SHIP", "LAND", "IMPOSSIBLE"],
      truthTags: ["THE_VESSEL"],
      position: { x: 400, y: 300 },
      isRedHerring: false,
      isCritical: true,
    },
    {
      id: "ev_autopsy_report",
      type: "document",
      title: "Coroner's Report",
      contentUrl: null,
      description: "Subject B: Cause of death unknown. Biological matter is fused with the steel hull on a molecular level.",
      tags: ["BODY", "STEEL", "DEATH"],
      truthTags: ["THE_AFTERMATH"],
      position: { x: 650, y: 150 },
      isRedHerring: false,
      isCritical: true,
      requiresUV: true,
      hiddenText: "PHASE SHIFT TRAUMA"
    },

    // --- COMBINATION OBJECTS ---

    {
      id: "ev_geiger_counter",
      type: "photo",
      title: "Geiger Counter",
      contentUrl: imgGeiger,
      description: "Standard issue radiation detector. Currently silent.",
      tags: ["TECH", "RADIATION"],
      position: { x: 100, y: 450 },
      isRedHerring: false,
    },
    {
      id: "ev_soil_sample",
      type: "photo",
      title: "Soil Sample",
      contentUrl: null,
      description: "Dirt taken from under the ship's hull. It's glowing faintly.",
      tags: ["DIRT", "GLOW", "FARM"],
      position: { x: 200, y: 500 },
      isRedHerring: false,
    },

    {
      id: "ev_flight_log",
      type: "document",
      title: "Flight Log (REDACTED)",
      contentUrl: imgClassified,
      description: "Log from a jet fighter intercepting a 'Bogey' over the Atlantic... 3 seconds before the Kansas crash.",
      tags: ["AIR", "TIME", "SPEED"],
      position: { x: 100, y: 100 },
      isRedHerring: false,
    },
    {
      id: "ev_stopwatch",
      type: "photo",
      title: "Frozen Stopwatch",
      contentUrl: null,
      description: "Found on the captain's bridge. Stopped exactly at 03:00:00.",
      tags: ["TIME", "CLOCK"],
      position: { x: 150, y: 150 },
      isRedHerring: false,
    },

    // --- RED HERRINGS ---

    {
      id: "ev_crop_circle",
      type: "photo",
      title: "Crop Circles",
      contentUrl: imgCropCircle,
      description: "Geometric patterns found 5 miles away. Probably local kids.",
      tags: ["ALIEN", "FARM", "CIRCLE"],
      position: { x: 600, y: 400 },
      isRedHerring: true,
    },
    {
      id: "ev_meteor",
      type: "photo",
      title: "Meteor Rock",
      contentUrl: imgMeteor,
      description: "A rock found nearby. Geology lab confirms it's just regular granite.",
      tags: ["SPACE", "ROCK"],
      position: { x: 700, y: 500 },
      isRedHerring: true,
    },
    {
      id: "ev_weather_balloon",
      type: "document",
      title: "Weather Report",
      contentUrl: null,
      description: "Reports of high winds and a weather balloon going off course.",
      tags: ["AIR", "WEATHER", "GOVERNMENT"],
      position: { x: 500, y: 100 },
      isRedHerring: true,
    },
    {
      id: "ev_tornado_warning",
      type: "sticky_note",
      title: "Tornado Warning",
      contentUrl: null,
      description: "Maybe the wind carried the ship here? (Yeah, right).",
      tags: ["WIND", "STORM"],
      position: { x: 300, y: 100 },
      isRedHerring: true,
    },
    {
      id: "ev_farmer_testimony",
      type: "document",
      title: "Local Drunkard",
      contentUrl: imgFarmer,
      description: "Says he saw 'Little Green Men' stealing his tractor.",
      tags: ["ALIEN", "WITNESS"],
      position: { x: 50, y: 300 },
      isRedHerring: true
    }
  ],

  // --- COMBINATIONS ---
  combinations: [
    // 1. Prove radiation (Not aliens, but nuclear physics/teleportation)
    {
      itemA: "ev_geiger_counter",
      itemB: "ev_soil_sample",
      unlockText: "RADIATION SPIKE DETECTED!",
      hint: "Let's check if this glowing dirt is radioactive.",
      difficulty: "medium",
      resultNodes: [
        {
          id: "ev_radiation_proof",
          type: "photo",
          title: "Cherenkov Radiation",
          contentUrl: null,
          description: "The soil emits Blue Cherenkov radiation. Only found in nuclear reactors... or wormholes.",
          tags: ["RADIATION", "PHYSICS", "BLUE"],
          truthTags: ["THE_ANOMALY"],
          position: { x: 150, y: 475 },
          isRedHerring: false,
          isCritical: true,
        }
      ]
    },
    // 2. Prove time anomaly (Compare log and watch)
    {
      itemA: "ev_flight_log",
      itemB: "ev_stopwatch",
      unlockText: "TIME DISCREPANCY CONFIRMED!",
      hint: "The jet saw the ship at 03:00 in the Atlantic. The watch stopped at 03:00 in Kansas.",
      difficulty: "hard",
      resultNodes: [
        {
          id: "ev_teleport_proof",
          type: "document",
          title: "Physics Impossibility",
          contentUrl: null,
          description: "Calculations show the vessel traveled 1500 miles in 0.00 seconds.",
          tags: ["MATH", "TIME", "SPEED"],
          truthTags: ["THE_ANOMALY"],
          position: { x: 125, y: 125 },
          isRedHerring: false,
          isCritical: true,
        }
      ]
    }
  ],

  scribblePool: [
    "IT DIDN'T FLY, IT JUMPED!",
    "WHERE IS THE CREW?!",
    "FUSED TO THE WALLS!",
    "THE CORN IS RADIOACTIVE",
    "PHILADELPHIA WAS A WARNING",
    "NOT ALIENS. US."
  ]
};
