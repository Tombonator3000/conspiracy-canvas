import { create } from 'zustand';
import { Node, Edge, Connection } from '@xyflow/react';
import { EvidenceNode, Combination } from '@/types/game';

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
  checkCombine: (sourceId: string, targetId: string, availableCombinations: Combination[]) => void;
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

  checkCombine: (sourceId, targetId, availableCombinations) => {
    const state = get();

    // 1. Find the nodes in current state
    const sourceNode = state.nodes.find(n => n.id === sourceId);
    const targetNode = state.nodes.find(n => n.id === targetId);
    if (!sourceNode || !targetNode) return;

    // 2. Check if valid combination exists
    const validCombo = availableCombinations.find(c =>
      (c.itemA === sourceId && c.itemB === targetId) ||
      (c.itemA === targetId && c.itemB === sourceId)
    );

    if (validCombo) {
      console.log(`🧪 COMBINE SUCCESS: ${sourceId} + ${targetId}`);

      // 3. HARVEST TAGS (The "Zombie Fix")
      // We manually extract tags from the data object of the parents
      const sourceTags = (sourceNode.data as { truthTags?: string[] }).truthTags || [];
      const targetTags = (targetNode.data as { truthTags?: string[] }).truthTags || [];

      const inheritedTags = new Set([...sourceTags, ...targetTags]);
      console.log("🧬 Inherited Tags:", Array.from(inheritedTags));

      // 4. PREPARE NEW NODES
      const newNodes = validCombo.resultNodes.map((blueprint: EvidenceNode) => {
        // Merge inherited tags with any specific tags the new node should have
        const finalTags = Array.from(new Set([
          ...inheritedTags,
          ...(blueprint.truthTags || [])
        ]));

        return {
          id: blueprint.id,
          type: 'evidence',
          position: {
            x: (sourceNode.position.x + targetNode.position.x) / 2,
            y: (sourceNode.position.y + targetNode.position.y) / 2
          },
          data: {
            ...blueprint,
            truthTags: finalTags // <--- CRITICAL INJECTION
          }
        };
      });

      // 5. ATOMIC STATE UPDATE
      set(prev => ({
        nodes: [
          // Remove parents
          ...prev.nodes.filter(n => n.id !== sourceId && n.id !== targetId),
          // Add children
          ...newNodes
        ],
        // Remove connected edges
        edges: prev.edges.filter(e =>
          e.source !== sourceId && e.target !== sourceId &&
          e.source !== targetId && e.target !== targetId
        )
      }));
    }
  },

  resetLevel: () => {
    // Temporary Reset
    set({ nodes: [], edges: [], sanity: 100 });
  }
}));
