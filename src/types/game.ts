export type NodeType = "photo" | "document" | "sticky_note";

// Simple edge type for Zustand store (not React Flow Edge)
export interface GameEdge {
  id: string;
  source: string;
  target: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface EvidenceNode {
  id: string;
  type: NodeType;
  title: string;
  contentUrl: string | null;
  description: string;
  tags: string[];
  position: Position;
  isRedHerring: boolean;
  hiddenText?: string; // UV light reveals this hidden message
  isCritical?: boolean; // If true, discarding this reduces credibility
  timelineTags?: string[]; // Tags for blue thread (timeline) connections
  timestamp?: number; // For chronological ordering in timeline connections
  hasRedactedContent?: boolean; // If true, shows scratch-to-reveal minigame
  truthTags?: string[]; // Semantic truth tags for win condition (e.g., ['CULPRIT', 'MOTIVE'])
  // Timeline & UV features
  date?: string; // ISO date string for blue thread chronological ordering (e.g., '1997-03-15')
  requiresUV?: boolean; // If true, node must be inspected with UV light before connecting
  isRevealed?: boolean; // Set to true when UV light reveals the hidden content
}

// Extended node data for React Flow rendering (includes runtime properties)
export interface EvidenceNodeData extends EvidenceNode {
  [key: string]: unknown; // Index signature for React Flow compatibility
  rotation?: number;
  isDesktop?: boolean;
  isSpawning?: boolean;
  isTrashing?: boolean;
  isUVEnabled?: boolean;
  isShaking?: boolean;
  isGlitching?: boolean;
  label?: string; // Glitch override for title
}

// Achievement definitions
export type AchievementId =
  | 'first_case'
  | 'perfect_sanity'
  | 'no_mistakes'
  | 'speed_demon'
  | 'junk_master'
  | 'combo_king'
  | 'all_cases'
  | 'paranoid_survivor'
  | 'uv_detective'
  | 'chain_combo';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number; // Timestamp when unlocked
}

export interface AchievementProgress {
  unlockedAchievements: AchievementId[];
  stats: {
    totalCasesCompleted: number;
    perfectSanityCases: number;
    noMistakeCases: number;
    fastestCaseTime: number;
    totalJunkBinned: number;
    totalCombosPerformed: number;
    chainCombosPerformed: number;
  };
}

export type ScribbleVariant = 'error' | 'success' | 'insight' | 'paranoia';

export interface Scribble {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  variant?: ScribbleVariant; // Defaults to 'error' for backward compatibility
}

// Scribble attached to a specific node (parented)
export interface NodeScribble {
  id: string;
  nodeId: string;
  text: string;
  rotation: number;
  position: "top" | "bottom" | "center" | "diagonal";
  style: "stamp" | "handwritten" | "circled";
}

export interface TheTruth {
  subject: string;
  action: string;
  target: string;
  motive: string;
}

export interface BoardState {
  sanity: number;
  chaosLevel: number;
  maxConnectionsNeeded: number;
}

// Combination definition for "use item on item" mechanic
export interface Combination {
  itemA: string;  // Node ID of first item
  itemB: string;  // Node ID of second item
  resultNodes: EvidenceNode[];  // New nodes that spawn when combined
  unlockText: string;  // Scribble text shown on success
  // Enhanced combination features
  hint?: string;  // UV-light hint shown on one of the items (e.g., "COMBINE WITH MANUAL")
  isChainResult?: boolean;  // If true, this combination's result can be used in further combos
  bonusCredibility?: number;  // Override default +200 bonus (for chain combos: higher reward)
  difficulty?: 'easy' | 'medium' | 'hard';  // Affects hint visibility
}

// Track discovered combinations for achievements
export interface CombinationProgress {
  caseId: string;
  discoveredCombinations: string[];  // Array of "itemA+itemB" keys
  totalCombinations: number;
}

export interface CaseData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  theTruth: TheTruth;
  boardState: BoardState;
  nodes: EvidenceNode[];
  scribblePool: string[];
  combinations?: Combination[];  // Optional combinations for adventure-style puzzles
  requiredTags?: string[]; // Tags that must ALL be present in a connected cluster to win
}

export interface GameState {
  sanity: number;
  chaosLevel: number;
  validConnections: number;
  maxConnections: number;
  scribbles: Scribble[];
  nodeScribbles: NodeScribble[];
  isGameOver: boolean;
  isVictory: boolean;
  missingTags: string[];
  // Credibility Engine
  credibility: number;
  cleanupBonus: number;
  trashedJunkCount: number;
  // Progressive penalty scaling
  evidenceMistakes: number;
  // Combo system
  consecutiveCorrect: number;
  comboBonus: number;
  // Undo system
  undoAvailable: boolean;
  trashedEvidenceCount: number;
}

export interface UndoState {
  nodes: string[];  // IDs of nodes that were on board
  edges: { source: string; target: string }[];
  gameState: Omit<GameState, 'scribbles'>;
}

export interface HintReveal {
  nodeId: string;
  tagIndex: number;
}

export interface FloatingScore {
  id: string;
  value: number;
  x: number;
  y: number;
  isPositive: boolean;
}

export interface CredibilityStats {
  credibility: number;
  cleanupBonus: number;
  trashedJunkCount: number;
  junkRemaining: number;
}

export interface ConnectionResult {
  isValid: boolean;
  matchingTag?: string;
  scribbleText?: string;
}

// Game Modifiers for challenge modes
export type ModifierId = 'deadline' | 'blackout' | 'paranoid' | 'minimalist';

export interface GameModifier {
  id: ModifierId;
  name: string;
  description: string;
  effect: string;
  bonus: number;
  icon: string;
}

export const GAME_MODIFIERS: GameModifier[] = [
  {
    id: 'deadline',
    name: 'DEADLINE',
    description: '5 minute time limit',
    effect: 'Race against the clock',
    bonus: 500,
    icon: '⏱️',
  },
  {
    id: 'blackout',
    name: 'BLACKOUT',
    description: 'UV light: 30 sec total',
    effect: 'Limited UV usage',
    bonus: 300,
    icon: '🔦',
  },
  {
    id: 'paranoid',
    name: 'PARANOID',
    description: 'Start at 50 sanity',
    effect: 'Reduced starting sanity',
    bonus: 400,
    icon: '😰',
  },
  {
    id: 'minimalist',
    name: 'MINIMALIST',
    description: 'Max 10 connections',
    effect: 'Limited connections allowed',
    bonus: 250,
    icon: '🔗',
  },
];

// Theory Mode - hypothesis testing
export interface TheoryResult {
  correctCount: number;
  totalNodes: number;
  message: string;
  variant: 'success' | 'partial' | 'failure';
}
