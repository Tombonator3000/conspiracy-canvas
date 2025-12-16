/**
 * Game constants for Conspiracy Canvas
 * Centralized location for all magic numbers and configuration values
 */

// ============================================
// SCORING CONSTANTS
// ============================================

/** Base penalty for evidence mistakes */
export const BASE_EVIDENCE_PENALTY = 50;

/** Maximum penalty multiplier for repeated mistakes */
export const MAX_PENALTY_MULTIPLIER = 4;

/** Penalty per remaining junk item at game end */
export const JUNK_REMAINING_PENALTY = 50;

/** Bonus for clearing junk items */
export const JUNK_CLEANUP_BONUS = 100;

/** Case resolved bonus */
export const CASE_RESOLVED_BONUS = 1000;

/** Sanity bonus multiplier */
export const SANITY_BONUS_MULTIPLIER = 5;

// Combo bonuses for consecutive correct connections
export const COMBO_BONUS_THRESHOLDS = {
  TIER_3: { connections: 5, bonus: 100 },
  TIER_2: { connections: 3, bonus: 50 },
  TIER_1: { connections: 2, bonus: 25 },
} as const;

// Star rating thresholds
export const STAR_RATING_THRESHOLDS = {
  FIVE_STARS: 2500,
  FOUR_STARS: 2000,
  THREE_STARS: 1500,
  TWO_STARS: 1000,
} as const;

// ============================================
// GAMEPLAY CONSTANTS
// ============================================

/** Distance threshold for nodes to be considered "nearby" */
export const NODE_PROXIMITY_THRESHOLD = 200;

/** Initial credibility score */
export const INITIAL_CREDIBILITY = 500;

/** Low sanity threshold for visual effects */
export const LOW_SANITY_THRESHOLD = 20;

/** Maximum scribbles allowed on board */
export const MAX_BOARD_SCRIBBLES = 2;

/** Maximum scribbles allowed per node */
export const MAX_NODE_SCRIBBLES = 1;

// ============================================
// SCRIBBLE TEXT POOLS
// ============================================

/** Hint scribbles for revealing tags */
export const HINT_SCRIBBLES = [
  "I SEE A PATTERN...",
  "WAIT... THIS TAG...",
  "SOMETHING CONNECTS...",
  "THE TRUTH REVEALS ITSELF!",
  "A CLUE EMERGES!",
] as const;

/** Failure messages for wrong connections */
export const FAILURE_SCRIBBLES = [
  "NO! WRONG!",
  "FOCUS!",
  "THAT'S NOT IT!",
  "THINK HARDER!",
  "TOO OBVIOUS!",
  "RED HERRING!",
  "WAKE UP!",
] as const;

/** Trash scribbles for critical evidence (failure) */
export const TRASH_CRITICAL_SCRIBBLES = [
  "YOU THREW AWAY THE TRUTH!",
  "THAT WAS IMPORTANT!",
  "NO! NOT THAT ONE!",
  "THE ANSWER WAS THERE!",
] as const;

/** Success scribbles for trashing junk */
export const TRASH_JUNK_SCRIBBLES = [
  "GOOD! THAT WAS GARBAGE!",
  "JUNK CLEARED!",
  "RED HERRING GONE!",
  "DECLUTTERING THE TRUTH!",
  "NOISE REMOVED!",
  "DISTRACTION DELETED!",
] as const;

/** Combination unlock scribbles */
export const COMBINE_UNLOCK_SCRIBBLES = [
  "IT ALL MAKES SENSE NOW!",
  "THE PIECES FIT!",
  "UNLOCKED!",
  "NEW EVIDENCE REVEALED!",
  "I KNEW IT!",
] as const;

/** Combination fail scribbles */
export const COMBINE_FAIL_SCRIBBLES = [
  "THESE DON'T GO TOGETHER",
  "WRONG COMBINATION",
  "TRY SOMETHING ELSE",
  "NO CONNECTION HERE",
] as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate progressive penalty for evidence mistakes
 * Scales from 50→100→150→200 (max)
 */
export const calculateEvidencePenalty = (mistakeCount: number): number => {
  const multiplier = Math.min(mistakeCount + 1, MAX_PENALTY_MULTIPLIER);
  return BASE_EVIDENCE_PENALTY * multiplier;
};

/**
 * Calculate combo bonus for consecutive correct connections
 */
export const calculateComboBonus = (consecutiveCorrect: number): number => {
  if (consecutiveCorrect >= COMBO_BONUS_THRESHOLDS.TIER_3.connections) {
    return COMBO_BONUS_THRESHOLDS.TIER_3.bonus;
  }
  if (consecutiveCorrect >= COMBO_BONUS_THRESHOLDS.TIER_2.connections) {
    return COMBO_BONUS_THRESHOLDS.TIER_2.bonus;
  }
  if (consecutiveCorrect >= COMBO_BONUS_THRESHOLDS.TIER_1.connections) {
    return COMBO_BONUS_THRESHOLDS.TIER_1.bonus;
  }
  return 0;
};

/**
 * Get star rating based on total score
 */
export const getStarRating = (totalScore: number): number => {
  if (totalScore >= STAR_RATING_THRESHOLDS.FIVE_STARS) return 5;
  if (totalScore >= STAR_RATING_THRESHOLDS.FOUR_STARS) return 4;
  if (totalScore >= STAR_RATING_THRESHOLDS.THREE_STARS) return 3;
  if (totalScore >= STAR_RATING_THRESHOLDS.TWO_STARS) return 2;
  return 1;
};

/**
 * Get a random item from an array
 */
export const getRandomFromArray = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
