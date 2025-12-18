/**
 * Random junk node generator for conspiracy board atmosphere
 *
 * Provides random "red herring" items (burnt matches, bus tickets, etc.)
 * that appear on the board to add clutter and misdirection.
 */

import { EvidenceNode } from '@/types/game';
import {
  gumWrapper,
  busTicket,
  coffeeReceipt,
  paperclip,
  newspaperScrap,
  usedPostit,
  burntMatch,
  candyWrapper,
  lotteryTicket,
  businessCard,
  rubberBands,
} from './index';

// Junk item configuration with image and metadata
interface JunkItemConfig {
  contentUrl: string;
  title: string;
  description: string;
  tags: string[];
}

// All available junk items
const JUNK_ITEMS: JunkItemConfig[] = [
  {
    contentUrl: burntMatch,
    title: 'Burnt Match',
    description: 'A used match. Smells faintly of sulfur.',
    tags: ['FIRE', 'DEBRIS'],
  },
  {
    contentUrl: busTicket,
    title: 'Bus Ticket',
    description: 'Route 47 to downtown. Expired.',
    tags: ['TRANSPORT', 'PAPER'],
  },
  {
    contentUrl: coffeeReceipt,
    title: 'Coffee Receipt',
    description: 'Large oat milk latte. $7.50.',
    tags: ['FOOD', 'RECEIPT'],
  },
  {
    contentUrl: paperclip,
    title: 'Bent Paperclip',
    description: 'Someone was anxious.',
    tags: ['OFFICE', 'METAL'],
  },
  {
    contentUrl: newspaperScrap,
    title: 'Newspaper Scrap',
    description: 'Fragment of sports section. Meaningless.',
    tags: ['PAPER', 'NEWS'],
  },
  {
    contentUrl: usedPostit,
    title: 'Faded Post-it',
    description: '"Call mom" - not relevant.',
    tags: ['PAPER', 'NOTES'],
  },
  {
    contentUrl: gumWrapper,
    title: 'Gum Wrapper',
    description: 'Spearmint. Crumpled.',
    tags: ['TRASH', 'FOIL'],
  },
  {
    contentUrl: candyWrapper,
    title: 'Candy Wrapper',
    description: 'Empty chocolate wrapper. Delicious distraction.',
    tags: ['TRASH', 'FOOD'],
  },
  {
    contentUrl: lotteryTicket,
    title: 'Losing Lottery Ticket',
    description: 'No winning numbers. Just like my luck.',
    tags: ['GAMBLING', 'PAPER'],
  },
  {
    contentUrl: businessCard,
    title: 'Generic Business Card',
    description: '"John Smith, Consultant" - could be anyone.',
    tags: ['PAPER', 'IDENTITY'],
  },
  {
    contentUrl: rubberBands,
    title: 'Rubber Bands',
    description: 'A tangle of rubber bands. Useless.',
    tags: ['OFFICE', 'DEBRIS'],
  },
];

/**
 * Fisher-Yates shuffle for true randomization
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate random positions for junk items on the board
 * Positions are spread across the board to avoid clustering
 */
function getRandomPosition(index: number, total: number): { x: number; y: number } {
  // Divide board into quadrants and place items accordingly
  const baseX = 100 + (index % 2) * 600;
  const baseY = 100 + Math.floor(index / 2) * 400;

  // Add randomness within the quadrant
  const offsetX = Math.random() * 200 - 100;
  const offsetY = Math.random() * 150 - 75;

  return {
    x: baseX + offsetX,
    y: baseY + offsetY,
  };
}

/**
 * Get 2-4 random junk nodes for the conspiracy board
 *
 * Each call returns a fresh set of random junk items with unique IDs.
 * Items are marked as red herrings (no truthTags) so they can be
 * safely trashed by the player.
 *
 * @returns Array of EvidenceNode objects ready to add to the board
 */
export function getRandomJunkNodes(): EvidenceNode[] {
  // Randomly select 2-4 items
  const count = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4

  // Shuffle and take the first `count` items
  const shuffled = shuffleArray(JUNK_ITEMS);
  const selected = shuffled.slice(0, count);

  // Create EvidenceNode objects with unique timestamp-based IDs
  const timestamp = Date.now();

  return selected.map((item, index) => ({
    id: `junk_${timestamp}_${index}`,
    type: 'photo' as const,
    title: item.title,
    contentUrl: item.contentUrl,
    description: item.description,
    tags: item.tags,
    position: getRandomPosition(index, count),
    isRedHerring: true,
    // No truthTags = automatically junk/red herring
  }));
}
