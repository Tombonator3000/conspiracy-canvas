export type NodeType = "photo" | "document" | "sticky_note";

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
}

export interface Scribble {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
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

export interface CaseData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  theTruth: TheTruth;
  boardState: BoardState;
  nodes: EvidenceNode[];
  scribblePool: string[];
}

export interface GameState {
  sanity: number;
  chaosLevel: number;
  validConnections: number;
  maxConnections: number;
  scribbles: Scribble[];
  isGameOver: boolean;
  isVictory: boolean;
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
