import { create } from 'zustand';
import { Node, Edge, Connection } from '@xyflow/react';
import { EvidenceNode, Combination } from '@/types/game';

interface GameState {
  // DATA
  nodes: Node[];
  edges: Edge[];
  sanity: number;
  requiredTags: string[];
  isVictory: boolean;
  threadColor: 'red' | 'blue';

  // SCORING DATA
  score: number;
  junkBinned: number;
  mistakes: number;
  startTime: number;

  // ACTIONS
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setRequiredTags: (tags: string[]) => void;
  setThreadColor: (color: 'red' | 'blue') => void;

  // LOGIC ACTIONS (Synchronous & Immediate)
  onConnect: (connection: Connection) => void;
  onNodeDragStop: (id: string, position: {x: number, y: number}) => void;
  checkCombine: (sourceId: string, targetId: string, availableCombinations: Combination[]) => void;
  trashNode: (id: string, isJunk: boolean) => void;
  resetLevel: () => void;

  // Internal helper
  validateWin: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  nodes: [],
  edges: [],
  sanity: 100,
  requiredTags: [],
  isVictory: false,
  threadColor: 'red',

  // Initial Score State
  score: 0,
  junkBinned: 0,
  mistakes: 0,
  startTime: Date.now(),

  setNodes: (nodes) => set({
    nodes,
    startTime: Date.now(),
    isVictory: false,
    score: 0,
    junkBinned: 0,
    mistakes: 0,
    sanity: 100
  }),
  setEdges: (edges) => set({ edges }),
  setRequiredTags: (tags) => set({ requiredTags: tags }),
  setThreadColor: (color) => set({ threadColor: color }),

  onConnect: (params) => {
    const { threadColor } = get();

    // Determine edge style based on thread color
    const isBlue = threadColor === 'blue';
    const colorHex = isBlue ? '#3b82f6' : '#e11d48'; // Blue-500 vs Rose-600

    // 1. Immediate visual feedback
    const newEdge = {
      ...params,
      id: `e-${params.source}-${params.target}`,
      type: isBlue ? 'blueString' : 'redString',
      style: { stroke: colorHex, strokeWidth: 3 },
      data: { type: threadColor }
    } as Edge;

    set(state => ({ edges: [...state.edges, newEdge] }));

    // 2. Log connection
    console.log(`🔗 Connected: ${params.source} <-> ${params.target} (${threadColor} thread)`);

    // 3. Check for win condition
    get().validateWin();
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

      // 6. Check for win condition after combination
      get().validateWin();
    }
  },

  trashNode: (id, isJunk) => {
    set(state => {
      // 1. Remove Node
      const newNodes = state.nodes.filter(n => n.id !== id);
      const newEdges = state.edges.filter(e => e.source !== id && e.target !== id);

      // 2. Calculate Penalty/Reward
      let newSanity = state.sanity;
      let newScore = state.score;
      let newJunkCount = state.junkBinned;
      let newMistakes = state.mistakes;

      if (isJunk) {
        // Good job!
        newScore += 100;
        newJunkCount += 1;
        console.log('🗑️ Junk binned! +100 points');
      } else {
        // Oh no, deleted evidence!
        newSanity -= 20;
        newScore -= 200;
        newMistakes += 1;
        console.log('❌ Evidence destroyed! -200 points, -20 sanity');
      }

      return {
        nodes: newNodes,
        edges: newEdges,
        sanity: newSanity,
        score: newScore,
        junkBinned: newJunkCount,
        mistakes: newMistakes
      };
    });
  },

  resetLevel: () => {
    // Temporary Reset
    set({ nodes: [], edges: [], sanity: 100, requiredTags: [], isVictory: false, score: 0, junkBinned: 0, mistakes: 0, startTime: Date.now() });
  },

  validateWin: () => {
    const { nodes, edges, requiredTags, sanity, junkBinned, mistakes } = get();
    if (!requiredTags || requiredTags.length === 0) return;

    // 1. Build Bidirectional Graph
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.source)?.push(e.target);
      adj.get(e.target)?.push(e.source);
    });

    // 2. Find Clusters (Flood Fill)
    const visited = new Set<string>();
    let victory = false;

    for (const node of nodes) {
      if (visited.has(node.id)) continue;

      const clusterTags = new Set<string>();
      const queue = [node.id];
      visited.add(node.id);

      while(queue.length > 0) {
        const currId = queue.shift()!;
        const currNode = nodes.find(n => n.id === currId);

        // Collect Tags
        (currNode?.data as { truthTags?: string[] }).truthTags?.forEach((t: string) => clusterTags.add(t));

        // Visit Neighbors
        adj.get(currId)?.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        });
      }

      // 3. Check Logic
      const missing = requiredTags.filter(t => !clusterTags.has(t));
      if (missing.length === 0) {
        victory = true;
        console.log("🏆 WINNER! Tags found:", Array.from(clusterTags));
      }
    }

    if (victory) {
      // Calculate Final Score
      // Base: 1000
      // + Sanity * 10
      // + Junk * 100
      // - Mistakes * 200
      const finalScore = 1000 + (sanity * 10) + (junkBinned * 100) - (mistakes * 200);
      console.log(`🎯 Final Score: ${finalScore} (Base: 1000, Sanity: ${sanity}*10, Junk: ${junkBinned}*100, Mistakes: ${mistakes}*-200)`);
      set({ isVictory: true, score: finalScore });
    }
  }
}));
