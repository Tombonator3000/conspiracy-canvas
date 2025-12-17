import { create } from 'zustand';
import { EvidenceNode, GameEdge, Combination } from '@/types/game';

interface GameStore {
  nodes: EvidenceNode[];
  edges: GameEdge[];
  requiredTags: string[];
  isVictory: boolean;
  // Actions
  setInitialCase: (data: { nodes: EvidenceNode[]; requiredTags?: string[] }) => void;
  connectNodes: (sourceId: string, targetId: string) => void;
  combineNodes: (sourceId: string, targetId: string, combination: Combination) => void;
  checkWinCondition: () => void;
  // Additional actions for full board functionality
  removeNode: (nodeId: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  nodes: [],
  edges: [],
  requiredTags: [],
  isVictory: false,

  setInitialCase: (data) => set({
    nodes: data.nodes,
    edges: [],
    requiredTags: data.requiredTags || [],
    isVictory: false,
  }),

  connectNodes: (sourceId, targetId) => {
    set(state => ({
      edges: [...state.edges, { source: sourceId, target: targetId, id: `${sourceId}-${targetId}` }]
    }));
    // Run win check IMMEDIATELY after connection
    get().checkWinCondition();
  },

  combineNodes: (sourceId, targetId, combination) => {
    const state = get();
    const source = state.nodes.find(n => n.id === sourceId);
    const target = state.nodes.find(n => n.id === targetId);

    // 1. HARVEST TAGS (Synchronously - no lost data)
    const inheritedTags = new Set<string>([
      ...(source?.truthTags || []),
      ...(target?.truthTags || [])
    ]);

    // 2. CREATE NEW NODES (handle multiple result nodes)
    const newNodes = combination.resultNodes.map(resultNode => ({
      ...resultNode,
      // HARD INJECT TAGS HERE - merge inherited tags with result node's own tags
      truthTags: [...Array.from(inheritedTags), ...(resultNode.truthTags || [])]
    }));

    // 3. UPDATE STATE
    set(state => ({
      nodes: [
        ...state.nodes.filter(n => n.id !== sourceId && n.id !== targetId), // Remove old
        ...newNodes // Add new
      ],
      edges: state.edges.filter(e =>
        e.source !== sourceId && e.target !== sourceId &&
        e.source !== targetId && e.target !== targetId
      )
    }));

    // 4. Check win condition after combination
    get().checkWinCondition();
  },

  checkWinCondition: () => {
    const { nodes, edges, requiredTags } = get();
    if (requiredTags.length === 0) return;

    // Simple Bidirectional Graph Build
    const adj = new Map<string, string[]>();
    edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)?.push(e.target);
      adj.get(e.target)?.push(e.source);
    });

    // Flood Fill
    const visited = new Set<string>();
    let won = false;

    for (const node of nodes) {
      if (visited.has(node.id)) continue;
      const clusterTags = new Set<string>();
      const queue = [node.id];
      visited.add(node.id);

      while (queue.length > 0) {
        const currId = queue.shift()!;
        const currNode = nodes.find(n => n.id === currId);
        currNode?.truthTags?.forEach(t => clusterTags.add(t.toLowerCase()));

        adj.get(currId)?.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        });
      }

      // Check Logic
      const missing = requiredTags.filter(t => !clusterTags.has(t.toLowerCase()));
      if (missing.length === 0) won = true;
    }

    if (won) set({ isVictory: true });
  },

  removeNode: (nodeId) => {
    set(state => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
  },

  reset: () => set({
    nodes: [],
    edges: [],
    requiredTags: [],
    isVictory: false,
  }),
}));
