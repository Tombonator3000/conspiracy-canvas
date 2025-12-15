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
  nodes: [
    {
      id: "ev_iphone_1912",
      type: "photo",
      title: "Temporal Anomaly",
      contentUrl: iphone1912,
      description: "Grainy 1912 photo. Man in background holding rectangular object. iPhone? IN 1912?!",
      tags: ["TECH", "OLD", "PHONE"],
      position: { x: 100, y: 80 },
      isRedHerring: false
    },
    {
      id: "ev_passenger_list",
      type: "document",
      title: "Passenger Manifest",
      contentUrl: null,
      description: "Names include: 'M. McFly', 'Dr. E. Brown', 'Sarah Connor'. COINCIDENCE?!",
      tags: ["NAME", "TIME", "LIST"],
      position: { x: 520, y: 100 },
      isRedHerring: false
    },
    {
      id: "ev_iceberg",
      type: "photo",
      title: "The 'Iceberg'",
      contentUrl: fakeIceberg,
      description: "Enhanced photo shows iceberg is too smooth. Plastic prop? Hologram?",
      tags: ["ICE", "FAKE", "PROP"],
      position: { x: 300, y: 320 },
      isRedHerring: false
    },
    {
      id: "ev_souvenirs",
      type: "document",
      title: "Cargo Manifest Anomaly",
      contentUrl: null,
      description: "Listed cargo: 'Future memorabilia - 50 tons'. Ship capacity: 46 tons excess. THE MATH DOESN'T LIE.",
      tags: ["WEIGHT", "TIME", "CARGO"],
      position: { x: 550, y: 340 },
      isRedHerring: false
    },
    {
      id: "ev_band",
      type: "sticky_note",
      title: "The Band Played On",
      contentUrl: null,
      description: "Band kept playing as ship sank. PROFESSIONAL musicians? Or FUTURE DJs with Spotify?",
      tags: ["MUSIC", "TIME", "CALM"],
      position: { x: 100, y: 400 },
      isRedHerring: false
    },
    {
      id: "ev_movie",
      type: "photo",
      title: "The Movie (1997)",
      contentUrl: titanicMovie,
      description: "James Cameron's 'Titanic' - Documentary? Or LEAKED FOOTAGE from a future tourist's camera?",
      tags: ["FILM", "LEAK"],
      position: { x: 420, y: 430 },
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
    "TEMPORAL OVERLOAD"
  ]
};
