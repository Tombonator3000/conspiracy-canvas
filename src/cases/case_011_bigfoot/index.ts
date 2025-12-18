import type { CaseData } from "@/types/game";
import bigfootFootprint from "./evidence/bigfoot_footprint.jpg";
import pattersonFilm from "./evidence/patterson_film.jpg";
import thermalForest from "./evidence/thermal_forest.jpg";
import brokenBranches from "./evidence/broken_branches.jpg";
import destroyedTent from "./evidence/destroyed_tent.jpg";

export const case011: CaseData = {
  id: "case_011_bigfoot",
  title: "Project Sasquatch",
  description: "Bigfoot isn't a missing link - it's an escaped military super-soldier from a Cold War genetic experiment that went horribly right.",
  difficulty: "HARD",
  theTruth: {
    subject: "BIGFOOT",
    action: "IS A SUPER-SOLDIER ESCAPED FROM",
    target: "A SECRET MILITARY LAB",
    motive: "HIDING FROM HIS CREATORS"
  },
  boardState: {
    sanity: 70,
    chaosLevel: 0,
    maxConnectionsNeeded: 5
  },
  requiredTags: ["THE_CREATURE", "THE_EXPERIMENT", "THE_LAB", "THE_ESCAPE", "THE_HIDING"],
  nodes: [
    // ===== CRITICAL EVIDENCE =====
    {
      id: "ev_footprint_cast",
      type: "photo",
      title: "Footprint Cast Analysis",
      contentUrl: bigfootFootprint,
      description: "Size 28 footprint. Dermal ridges match NO known primate. Boot tread pattern visible in heel. BOOTS?!",
      tags: ["FOOTPRINT", "BIGFOOT", "EVIDENCE"],
      position: { x: 130, y: 110 },
      isRedHerring: false,
      hiddenText: "BOOT SERIAL: MIL-SS-1962",
      isCritical: true,
      truthTags: ["THE_CREATURE"]
    },
    {
      id: "ev_cold_war_docs",
      type: "document",
      title: "Project YETI Files",
      contentUrl: null,
      description: "1962 Pentagon documents. Goal: 'Create forest-adapted infantry unit. Enhanced strength, survival instinct, fur for cold operations.'",
      tags: ["MILITARY", "EXPERIMENT", "CLASSIFIED"],
      position: { x: 530, y: 100 },
      isRedHerring: false,
      hiddenText: "BUDGET: $47 MILLION",
      isCritical: true,
      truthTags: ["THE_EXPERIMENT"]
    },
    {
      id: "ev_lab_coordinates",
      type: "sticky_note",
      title: "Mysterious Coordinates",
      contentUrl: null,
      description: "Scribbled note: '47.7511° N, 120.7401° W - Cascade Facility'. Satellite shows nothing. TOO much nothing.",
      tags: ["LAB", "LOCATION", "MILITARY"],
      position: { x: 350, y: 370 },
      isRedHerring: false,
      hiddenText: "DEMOLITION ORDER: 1965",
      isCritical: true,
      truthTags: ["THE_LAB"]
    },
    {
      id: "ev_incident_report",
      type: "document",
      title: "Incident Report #7",
      contentUrl: null,
      description: "'Subject ALPHA broke containment. Last seen heading northwest into forest. Search teams recalled after 3 casualties. Subject still at large.'",
      tags: ["ESCAPE", "MILITARY", "INCIDENT"],
      position: { x: 620, y: 330 },
      isRedHerring: false,
      hiddenText: "STATUS: TERMINATE ON SIGHT",
      isCritical: true,
      truthTags: ["THE_ESCAPE"]
    },
    {
      id: "ev_sighting_map",
      type: "document",
      title: "60 Years of Sightings",
      contentUrl: null,
      description: "Every Bigfoot sighting mapped. Pattern shows deliberate avoidance of population centers. Moving AWAY from the lab location. Running.",
      tags: ["SIGHTING", "PATTERN", "BIGFOOT"],
      position: { x: 180, y: 450 },
      isRedHerring: false,
      hiddenText: "INTELLIGENT EVASION",
      isCritical: true,
      truthTags: ["THE_HIDING"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_patterson_film",
      type: "photo",
      title: "Patterson Film Still",
      contentUrl: pattersonFilm,
      description: "The famous 1967 footage. 'Patty' walks across the clearing. Skeptics say costume. Costume makers say impossible. We say: both wrong.",
      tags: ["FILM", "CLASSIC"],
      position: { x: 450, y: 50 },
      isRedHerring: true
    },
    {
      id: "ev_fur_sample",
      type: "sticky_note",
      title: "Hair Sample - Inconclusive",
      contentUrl: null,
      description: "Found on tree bark. Lab results: 'Unknown primate OR very dirty human OR bear with a skin condition.' Helpful.",
      tags: ["HAIR", "SAMPLE"],
      position: { x: 80, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_beef_jerky",
      type: "sticky_note",
      title: "Half-Eaten Beef Jerky",
      contentUrl: null,
      description: "Found at campsite. Teeth marks analysis: 'Large humanoid or small bear'. Could be Bigfoot. Could be hungry hiker.",
      tags: ["FOOD", "CAMPSITE"],
      position: { x: 700, y: 150 },
      isRedHerring: true
    },
    {
      id: "ev_wood_knocks",
      type: "document",
      title: "Audio Analysis - Wood Knocks",
      contentUrl: null,
      description: "Recording of 'bigfoot wood knocking'. Frequency analysis shows it's... just wood being knocked. By something. Probably.",
      tags: ["AUDIO", "WOODS"],
      position: { x: 280, y: 200 },
      isRedHerring: true
    },
    {
      id: "ev_thermal_image",
      type: "photo",
      title: "Thermal Camera Image",
      contentUrl: thermalForest,
      description: "Heat signature in forest. Could be Bigfoot. Could be drunk hunter. Heat doesn't lie, but it doesn't identify either.",
      tags: ["THERMAL", "IMAGE"],
      position: { x: 500, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_broken_branches",
      type: "photo",
      title: "Broken Branch Formation",
      contentUrl: brokenBranches,
      description: "'Bigfoot marker'. Or... wind. Or bear. Or bored teenager. Very inconclusive branch evidence.",
      tags: ["BRANCH", "MARKER"],
      position: { x: 150, y: 550 },
      isRedHerring: true
    },
    {
      id: "ev_screech_recording",
      type: "sticky_note",
      title: "Mystery Screech Tape",
      contentUrl: null,
      description: "Terrifying forest scream recorded in 1994. Expert analysis: 'Owl or Bigfoot. 50/50.' Very scientific.",
      tags: ["AUDIO", "SCREAM"],
      position: { x: 400, y: 240 },
      isRedHerring: true
    },
    {
      id: "ev_native_legend",
      type: "document",
      title: "Native American Legend Book",
      contentUrl: null,
      description: "Stories of 'forest giants' dating back centuries. Proves Bigfoot is ancient! Or proves legends exist. Hmm.",
      tags: ["LEGEND", "ANCIENT"],
      position: { x: 720, y: 400 },
      isRedHerring: true
    },
    {
      id: "ev_camping_tent",
      type: "photo",
      title: "Destroyed Tent Photo",
      contentUrl: destroyedTent,
      description: "Torn to shreds near sighting area. Bear? Bigfoot? The owner's ex? All equally likely.",
      tags: ["TENT", "DAMAGE"],
      position: { x: 260, y: 520 },
      isRedHerring: true
    },
    {
      id: "ev_skunk_ape",
      type: "document",
      title: "Florida Skunk Ape Report",
      contentUrl: null,
      description: "Similar creature in Florida swamps. Either related species OR very lost Bigfoot OR Florida Man in costume.",
      tags: ["SKUNKAPE", "FLORIDA"],
      position: { x: 600, y: 550 },
      isRedHerring: true
    },
    {
      id: "ev_gift_shop",
      type: "sticky_note",
      title: "Bigfoot Gift Shop Receipt",
      contentUrl: null,
      description: "1x Bigfoot keychain, 1x 'I Believe' shirt, 1x Sasquatch jerky. Total: $34.99. Not evidence. Why is this here?",
      tags: ["SHOP", "TOURISM"],
      position: { x: 450, y: 170 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THEY CREATED HIM!",
    "SUPER SOLDIER PROGRAM!",
    "HE'S STILL RUNNING!",
    "PROJECT YETI!",
    "COLD WAR SECRET!",
    "THE PATTERN IS CLEAR!",
    "FOLLOW THE FOOTPRINTS!",
    "GOVERNMENT EXPERIMENT!",
    "ENHANCED INFANTRY!",
    "1962 - IT ALL BEGAN!"
  ],
  combinations: [
    {
      itemA: "ev_footprint_cast",
      itemB: "ev_cold_war_docs",
      unlockText: "THE BOOT TREAD MATCHES MILITARY ISSUE FROM 1962!",
      hint: "CHECK THE BOOT SERIAL",
      difficulty: "medium",
      resultNodes: [
        {
          id: "ev_soldier_profile",
          type: "document",
          title: "Subject ALPHA Profile",
          contentUrl: null,
          description: "Original test subject: Private [REDACTED]. Volunteer for 'enhanced survival training'. Last known height: 5'9\". Current estimated height: 8'2\".",
          tags: ["MILITARY", "EXPERIMENT", "BIGFOOT"],
          position: { x: 330, y: 150 },
          isRedHerring: false,
          hiddenText: "ENHANCEMENT: 400%",
          isCritical: true,
          truthTags: ["THE_CREATURE", "THE_EXPERIMENT"]
        }
      ]
    },
    {
      itemA: "ev_lab_coordinates",
      itemB: "ev_incident_report",
      unlockText: "THE ESCAPE ROUTE STARTS AT THE LAB!",
      hint: "TRACE THE PATH",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_escape_route",
          type: "document",
          title: "Containment Breach Map",
          contentUrl: null,
          description: "Tracked path from Cascade Facility into the wilderness. Subject avoided all roads, power lines, and human contact. Military training kicked in.",
          tags: ["LAB", "ESCAPE", "ROUTE"],
          position: { x: 500, y: 350 },
          isRedHerring: false,
          hiddenText: "PURSUIT ABANDONED: DAY 3",
          isCritical: true,
          truthTags: ["THE_LAB", "THE_ESCAPE"]
        }
      ]
    },
    {
      itemA: "ev_incident_report",
      itemB: "ev_sighting_map",
      unlockText: "HE'S BEEN RUNNING FOR 60 YEARS!",
      hint: "OVERLAY THE TIMELINES",
      difficulty: "hard",
      resultNodes: [
        {
          id: "ev_survival_analysis",
          type: "document",
          title: "Long-Term Evasion Analysis",
          contentUrl: null,
          description: "Subject has evaded capture for 6 decades. Shows advanced tactical thinking, deliberate territory rotation, and... loneliness. He just wants to be left alone.",
          tags: ["SIGHTING", "ESCAPE", "PATTERN"],
          position: { x: 400, y: 480 },
          isRedHerring: false,
          hiddenText: "STILL ALIVE. STILL HIDING.",
          isCritical: true,
          truthTags: ["THE_ESCAPE", "THE_HIDING"]
        }
      ]
    }
  ]
};
