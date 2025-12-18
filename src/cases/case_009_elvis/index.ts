import type { CaseData } from "@/types/game";
import burgerKingSighting from "./evidence/burger_king_sighting.jpg";
import area51Badge from "./evidence/area51_badge.jpg";
import elvisImpersonator from "./evidence/elvis_impersonator.jpg";
import blueSuedeShoes from "./evidence/blue_suede_shoes.jpg";

export const case009: CaseData = {
  id: "case_009_elvis",
  title: "The King Lives",
  description: "Elvis never died in 1977. Multiple sightings across America suggest The King is alive and working as a deep cover government agent.",
  difficulty: "MEDIUM",
  theTruth: {
    subject: "ELVIS PRESLEY",
    action: "IS A CIA OPERATIVE LIVING IN",
    target: "AREA 51",
    motive: "TO MONITOR ALIEN COMMUNICATIONS"
  },
  boardState: {
    sanity: 75,
    chaosLevel: 0,
    maxConnectionsNeeded: 4
  },
  requiredTags: ["THE_KING", "THE_AGENCY", "THE_HIDEOUT", "THE_MISSION"],
  nodes: [
    // ===== CRITICAL EVIDENCE =====
    {
      id: "ev_burger_king_elvis",
      type: "photo",
      title: "Burger King Sighting - 1992",
      contentUrl: burgerKingSighting,
      description: "Security footage from Kalamazoo, MI. Subject ordered peanut butter banana sandwich. Cashier 'trembled' according to police report.",
      tags: ["ELVIS", "SIGHTING", "FOOD"],
      position: { x: 150, y: 120 },
      isRedHerring: false,
      hiddenText: "AGENT CODENAME: HOUND DOG",
      isCritical: true,
      truthTags: ["THE_KING"]
    },
    {
      id: "ev_cia_memo",
      type: "document",
      title: "Declassified CIA Document #7741-E",
      contentUrl: null,
      description: "Heavily redacted memo from 1977. Visible text: 'ASSET EXTRACTION... GRACELAND... RELOCATED TO...' Rest is black ink.",
      tags: ["CIA", "GOVERNMENT", "CLASSIFIED"],
      position: { x: 520, y: 150 },
      isRedHerring: false,
      hiddenText: "OPERATION: HEARTBREAK HOTEL",
      isCritical: true,
      truthTags: ["THE_AGENCY"]
    },
    {
      id: "ev_area51_badge",
      type: "photo",
      title: "Mystery Employee Badge",
      contentUrl: area51Badge,
      description: "Found in Nevada desert. Photo shows sideburns. Name: 'E. AARON'. Security clearance: ULTRAVIOLET. Expires: NEVER.",
      tags: ["AREA51", "BADGE", "NEVADA"],
      position: { x: 350, y: 380 },
      isRedHerring: false,
      hiddenText: "SECTION: XENOLINGUISTICS",
      isCritical: true,
      truthTags: ["THE_HIDEOUT"]
    },
    {
      id: "ev_radio_intercept",
      type: "document",
      title: "NSA Radio Intercept - 2019",
      contentUrl: null,
      description: "Transmission from unknown facility: 'The King confirms alien dialect is similar to ancient Sumerian. Requesting more peanut butter.'",
      tags: ["ALIEN", "RADIO", "CIA"],
      position: { x: 620, y: 320 },
      isRedHerring: false,
      hiddenText: "FREQ: 147.42 MHz",
      isCritical: true,
      truthTags: ["THE_MISSION"]
    },

    // ===== RED HERRINGS =====
    {
      id: "ev_elvis_impersonator",
      type: "photo",
      title: "Vegas Impersonator Photo",
      contentUrl: elvisImpersonator,
      description: "Could be anyone. Rhinestones are CLEARLY fake. But that lip curl...",
      tags: ["VEGAS", "COSTUME"],
      position: { x: 100, y: 280 },
      isRedHerring: true
    },
    {
      id: "ev_graceland_ticket",
      type: "sticky_note",
      title: "Graceland Admission Stub",
      contentUrl: null,
      description: "From 2015 tour. Gift shop receipt: 1x 'Elvis Lives' coffee mug. $24.99.",
      tags: ["TOURISM", "MEMPHIS"],
      position: { x: 680, y: 100 },
      isRedHerring: true
    },
    {
      id: "ev_prescription",
      type: "document",
      title: "Prescription Bottle Label",
      contentUrl: null,
      description: "For 'E. Presley'. Dated August 17, 1977. ONE DAY after the 'death'. SUSPICIOUS? (It's aspirin.)",
      tags: ["MEDICAL", "PILLS"],
      position: { x: 250, y: 220 },
      isRedHerring: true
    },
    {
      id: "ev_jumpsuit_fabric",
      type: "sticky_note",
      title: "White Fabric Swatch",
      contentUrl: null,
      description: "Found near Area 51 perimeter. Could be from a jumpsuit. Or a bedsheet. Or a napkin.",
      tags: ["FABRIC", "WHITE"],
      position: { x: 450, y: 480 },
      isRedHerring: true
    },
    {
      id: "ev_blue_suede",
      type: "photo",
      title: "Worn Blue Suede Shoes",
      contentUrl: blueSuedeShoes,
      description: "Found in thrift store. Size 11. Definitely stepped on. By whom? We may never know.",
      tags: ["SHOES", "BLUE"],
      position: { x: 180, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_peanut_butter",
      type: "sticky_note",
      title: "Bulk PB Purchase Receipt",
      contentUrl: null,
      description: "Costco receipt. 47 jars of peanut butter. Delivered to: [REDACTED], Nevada. WHO NEEDS THAT MUCH?!",
      tags: ["FOOD", "RECEIPT"],
      position: { x: 550, y: 220 },
      isRedHerring: true
    },
    {
      id: "ev_hound_dog_cassette",
      type: "sticky_note",
      title: "Mysterious Cassette Tape",
      contentUrl: null,
      description: "Labeled 'PERSONAL - DO NOT PLAY'. It's just Hound Dog on repeat for 90 minutes.",
      tags: ["MUSIC", "CASSETTE"],
      position: { x: 380, y: 60 },
      isRedHerring: true
    },
    {
      id: "ev_witness_statement",
      type: "document",
      title: "Witness Statement - Diner",
      contentUrl: null,
      description: "'He looked just like Elvis! But 40 years younger. And female. And Asian.' - Less credible.",
      tags: ["WITNESS", "DINER"],
      position: { x: 80, y: 500 },
      isRedHerring: true
    },
    {
      id: "ev_tabloid_clipping",
      type: "document",
      title: "Weekly World News Clipping",
      contentUrl: null,
      description: "'ELVIS SPOTTED ON MARS' - Even for us, this seems unlikely. Filed under: too crazy.",
      tags: ["TABLOID", "MARS"],
      position: { x: 700, y: 420 },
      isRedHerring: true
    },
    {
      id: "ev_hair_sample",
      type: "sticky_note",
      title: "Hair Sample Envelope",
      contentUrl: null,
      description: "Black pompadour hair. DNA test results: 'Inconclusive'. WHAT ARE THEY HIDING?!",
      tags: ["DNA", "HAIR"],
      position: { x: 280, y: 500 },
      isRedHerring: true
    }
  ],
  scribblePool: [
    "THE KING LIVES!",
    "THANK YOU VERY MUCH",
    "SUSPICIOUS SIDEBURNS",
    "PEANUT BUTTER CONNECTION!",
    "HUNKA HUNKA BURNING TRUTH",
    "ALL SHOOK UP!",
    "RETURN TO SENDER... AREA 51",
    "IT'S NOW OR NEVER!",
    "DON'T BE CRUEL TO THE EVIDENCE",
    "TCB - TAKING CARE OF BUSINESS"
  ],
  combinations: [
    {
      itemA: "ev_burger_king_elvis",
      itemB: "ev_cia_memo",
      unlockText: "THE SIGHTINGS MATCH CIA RELOCATION DATES!",
      hint: "COMPARE THE DATES",
      difficulty: "easy",
      resultNodes: [
        {
          id: "ev_timeline_proof",
          type: "document",
          title: "Sighting-Operation Timeline",
          contentUrl: null,
          description: "Every Elvis sighting correlates with CIA 'training exercises' in the same city. COINCIDENCE?! (No.)",
          tags: ["CIA", "SIGHTING", "TIMELINE"],
          position: { x: 350, y: 200 },
          isRedHerring: false,
          hiddenText: "PATTERN CONFIRMED",
          isCritical: true,
          truthTags: ["THE_KING", "THE_AGENCY"]
        }
      ]
    },
    {
      itemA: "ev_area51_badge",
      itemB: "ev_radio_intercept",
      unlockText: "THE BADGE SECTION MATCHES THE TRANSMISSION ORIGIN!",
      hint: "XENOLINGUISTICS...",
      difficulty: "medium",
      resultNodes: [
        {
          id: "ev_mission_briefing",
          type: "document",
          title: "Mission Briefing: BLUE SUEDE",
          contentUrl: null,
          description: "Full mission scope: Presley, E. assigned to decode extraterrestrial communications. Qualifications: 'Can talk to anyone, even aliens.'",
          tags: ["AREA51", "ALIEN", "CLASSIFIED"],
          position: { x: 500, y: 400 },
          isRedHerring: false,
          hiddenText: "CLEARANCE: COSMIC TOP SECRET",
          isCritical: true,
          truthTags: ["THE_HIDEOUT", "THE_MISSION"]
        }
      ]
    }
  ]
};
