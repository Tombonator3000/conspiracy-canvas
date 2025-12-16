/**
 * Common utility functions for the Conspiracy Canvas game
 */

/**
 * Generate a unique ID with an optional prefix
 */
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if two rectangles are colliding (AABB collision detection)
 */
export const isColliding = (rectA: DOMRect, rectB: DOMRect): boolean => {
  return !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (
  posA: { x: number; y: number },
  posB: { x: number; y: number }
): number => {
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if two nodes are nearby based on their positions
 */
export const areNodesNearby = (
  posA: { x: number; y: number },
  posB: { x: number; y: number },
  threshold: number = 200
): boolean => {
  return calculateDistance(posA, posB) < threshold;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Get a random item from an array
 */
export const getRandomItem = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get multiple random items from an array without repetition
 */
export const getRandomItems = <T>(array: readonly T[], count: number): T[] => {
  const shuffled = shuffleArray([...array]);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Format a number with thousands separators
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Delay execution for a specified duration
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
