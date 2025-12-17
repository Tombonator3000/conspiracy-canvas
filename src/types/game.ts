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

export interface Scribble {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
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
