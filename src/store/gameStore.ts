import { create } from 'zustand';
import { Node, Edge, Connection } from '@xyflow/react';
import { EvidenceNode } from '@/types/game';

interface GameState {
  // DATA
  nodes: Node[];
  edges: Edge[];
  sanity: number;

  // ACTIONS
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  // LOGIC ACTIONS (Synchronous & Immediate)
  onConnect: (connection: Connection) => void;
  onNodeDragStop: (id: string, position: {x: number, y: number}) => void;
  checkCombine: (sourceId: string, targetId: string) => void;
  resetLevel: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  nodes: [],
  edges: [],
  sanity: 100,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onConnect: (params) => {
    // 1. Immediate visual feedback
    const newEdge = {
      ...params,
      id: `e-${params.source}-${params.target}`,
      type: 'redString',
      style: { stroke: '#e11d48', strokeWidth: 3 }
    } as Edge;

    set(state => ({ edges: [...state.edges, newEdge] }));

    // 2. Log connection (We will add Win Logic here later)
    console.log(`🔗 Connected: ${params.source} <-> ${params.target}`);
  },

  onNodeDragStop: (id, position) => {
    set(state => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, position } : n)
    }));
  },

  checkCombine: (sourceId, targetId) => {
    // Placeholder for the new Combine Logic
    console.log(`🧪 Attempting combine: ${sourceId} + ${targetId}`);
  },

  resetLevel: () => {
    // Temporary Reset
    set({ nodes: [], edges: [], sanity: 100 });
  }
}));
