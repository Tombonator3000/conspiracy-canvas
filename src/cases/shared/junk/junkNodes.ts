import type { EvidenceNode } from "@/types/game";
import gumWrapper from './gum_wrapper.png';
import busTicket from './bus_ticket.png';
import coffeeReceipt from './coffee_receipt.png';
import paperclip from './paperclip.png';
import newspaperScrap from './newspaper_scrap.png';
import usedPostit from './used_postit.png';
import burntMatch from './burnt_match.png';
import candyWrapper from './candy_wrapper.png';
import lotteryTicket from './lottery_ticket.png';
import businessCard from './business_card.png';
import rubberBands from './rubber_bands.png';

// Seeded random number generator for consistent positions per case
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate random position within bounds
function randomPosition(seed: number, index: number): { x: number; y: number } {
  const baseSeed = seed + index * 1000;
  return {
    x: 50 + Math.floor(seededRandom(baseSeed) * 650),
    y: 80 + Math.floor(seededRandom(baseSeed + 1) * 420)
  };
}

// All available junk items with their metadata
const junkItems = [
  {
    id: "junk_gum_wrapper",
    title: "Chewed Gum Wrapper",
    contentUrl: gumWrapper,
    description: "Spearmint. Someone was nervous. Or just likes gum.",
    tags: ["TRASH", "MINT", "WRAPPER"]
  },
  {
    id: "junk_bus_ticket",
    title: "Old Bus Ticket",
    contentUrl: busTicket,
    description: "Route unknown. Destination unknown. Passenger... unknown?",
    tags: ["TRANSPORT", "TICKET", "TRAVEL"]
  },
  {
    id: "junk_coffee_receipt",
    title: "Crumpled Coffee Receipt",
    contentUrl: coffeeReceipt,
    description: "$4.75 for a latte. The real conspiracy is coffee prices.",
    tags: ["COFFEE", "RECEIPT", "EXPENSE"]
  },
  {
    id: "junk_paperclip",
    title: "Bent Paperclip",
    contentUrl: paperclip,
    description: "Someone was fidgeting. Or picking a lock. Probably fidgeting.",
    tags: ["OFFICE", "METAL", "SMALL"]
  },
  {
    id: "junk_newspaper_scrap",
    title: "Torn Newspaper Scrap",
    contentUrl: newspaperScrap,
    description: "Can't read the headline. Something about... weather? Politics? Aliens?",
    tags: ["NEWS", "PAPER", "TORN"]
  },
  {
    id: "junk_used_postit",
    title: "Faded Post-it Note",
    contentUrl: usedPostit,
    description: "The writing is too faded to read. What secrets did it hold?",
    tags: ["NOTE", "STICKY", "FADED"]
  },
  {
    id: "junk_burnt_match",
    title: "Burnt Match",
    contentUrl: burntMatch,
    description: "Someone lit something. A candle? Evidence? A cigarette?",
    tags: ["FIRE", "BURNT", "SMALL"]
  },
  {
    id: "junk_candy_wrapper",
    title: "Candy Wrapper",
    contentUrl: candyWrapper,
    description: "Someone had a sweet tooth. Sugar rush = breakthrough?",
    tags: ["CANDY", "WRAPPER", "SUGAR"]
  },
  {
    id: "junk_lottery_ticket",
    title: "Losing Lottery Ticket",
    contentUrl: lotteryTicket,
    description: "Not a winner. Or IS it? No, it's not. Definitely not.",
    tags: ["LOTTERY", "LUCK", "NUMBERS"]
  },
  {
    id: "junk_business_card",
    title: "Mysterious Business Card",
    contentUrl: businessCard,
    description: "Name rubbed off. Job title: ???. Phone number disconnected.",
    tags: ["CARD", "BUSINESS", "MYSTERY"]
  },
  {
    id: "junk_rubber_bands",
    title: "Tangled Rubber Bands",
    contentUrl: rubberBands,
    description: "A ball of rubber bands. Hours of untangling ahead.",
    tags: ["RUBBER", "OFFICE", "TANGLED"]
  }
];

/**
 * Get a subset of junk nodes for a case
 * @param caseId - Used as seed for consistent randomization
 * @param count - Number of junk items to include (default: 3-4)
 * @returns Array of EvidenceNode objects ready to spread into case nodes
 */
export function getJunkNodes(caseId: string, count?: number): EvidenceNode[] {
  // Create a numeric seed from the case ID
  const seed = caseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Determine how many items to include (3-4 by default)
  const itemCount = count ?? (3 + Math.floor(seededRandom(seed) * 2));

  // Shuffle and select items based on seed
  const shuffled = [...junkItems].sort((a, b) => {
    return seededRandom(seed + a.id.length) - seededRandom(seed + b.id.length);
  });

  const selected = shuffled.slice(0, Math.min(itemCount, junkItems.length));

  // Convert to EvidenceNodes with positions
  return selected.map((item, index): EvidenceNode => ({
    id: item.id,
    type: "photo",
    title: item.title,
    contentUrl: item.contentUrl,
    description: item.description,
    tags: item.tags,
    position: randomPosition(seed, index),
    isRedHerring: true
  }));
}

/**
 * Get all junk nodes (for cases that want maximum clutter)
 */
export function getAllJunkNodes(caseId: string): EvidenceNode[] {
  return getJunkNodes(caseId, junkItems.length);
}

/**
 * Get truly random junk nodes - different each time called
 * @param count - Number of junk items (default: random 2-4)
 * @returns Array of EvidenceNode objects with unique IDs and random positions
 */
export function getRandomJunkNodes(count?: number): EvidenceNode[] {
  // Random count between 2-4 if not specified
  const itemCount = count ?? (2 + Math.floor(Math.random() * 3));

  // Shuffle array using Fisher-Yates
  const shuffled = [...junkItems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Select the items
  const selected = shuffled.slice(0, Math.min(itemCount, junkItems.length));

  // Convert to EvidenceNodes with random positions and unique IDs
  return selected.map((item, index): EvidenceNode => ({
    id: `${item.id}_${Date.now()}_${index}`, // Unique ID each time
    type: "photo",
    title: item.title,
    contentUrl: item.contentUrl,
    description: item.description,
    tags: item.tags,
    position: {
      x: 50 + Math.floor(Math.random() * 650),
      y: 80 + Math.floor(Math.random() * 420)
    },
    isRedHerring: true
  }));
}
