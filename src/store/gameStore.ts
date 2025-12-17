import { create } from 'zustand';
import { Node, Edge, Connection, applyNodeChanges, NodeChange } from '@xyflow/react';
import { EvidenceNode, Combination, Scribble } from '@/types/game';
import { allCases } from '@/data/cases';

interface Scribble {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
}

interface GameState {
  // DATA
  nodes: Node[];
  edges: Edge[];
  sanity: number;
  requiredTags: string[];
  isVictory: boolean;
  isGameOver: boolean;
  threadColor: 'red' | 'blue';
  scribbles: Scribble[];

  // LEVEL TRACKING
  currentLevelIndex: number;

  // SCORING DATA
  score: number;
  junkBinned: number;
  mistakes: number;
  startTime: number;

  // AUDIO/VISUAL SIGNAL (transient - for UI effects)
  lastAction: { type: string; id: number } | null;

  // UV LIGHT & SHAKE STATE
  isUVEnabled: boolean;
  shakingNodeIds: string[];
  scribbles: Scribble[];

  // ACTIONS
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setRequiredTags: (tags: string[]) => void;
  setThreadColor: (color: 'red' | 'blue') => void;

  // SCRIBBLE ACTIONS
  addScribble: (text: string, x: number, y: number) => void;
  removeScribble: (id: string) => void;

  // LEVEL ACTIONS
  loadLevel: (index: number) => void;
  nextLevel: () => void;
  getCurrentCase: () => typeof allCases[number] | null;

  // LOGIC ACTIONS (Synchronous & Immediate)
  onNodesChange: (changes: NodeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeDragStop: (id: string, position: {x: number, y: number}) => void;
  checkCombine: (sourceId: string, targetId: string, availableCombinations: Combination[]) => void;
  trashNode: (id: string, isJunk: boolean) => void;
  modifySanity: (delta: number) => void;
  resetLevel: () => void;

  // UV & SHAKE ACTIONS
  toggleUV: () => void;
  triggerShake: (id: string) => void;
  addScribble: (text: string, x: number, y: number) => void;
  removeScribble: (id: string) => void;

  // Internal helper
  validateWin: () => void;
}

// Helper to convert case data nodes to React Flow nodes
const createNodesFromCase = (caseData: typeof allCases[number]) => {
  return caseData.nodes.map((node) => {
    const rotation = Math.random() * 30 - 15;
    const zIndex = Math.floor(Math.random() * 100);

    return {
      id: node.id,
      type: 'evidence',
      position: node.position,
      data: {
        ...node,
        rotation,
        isDesktop: true,
      },
      draggable: true,
      zIndex,
    };
  });
};

export const useGameStore = create<GameState>((set, get) => ({
  nodes: [],
  edges: [],
  sanity: 100,
  requiredTags: [],
  isVictory: false,
  isGameOver: false,
  threadColor: 'red',
  scribbles: [],

  // Level Tracking
  currentLevelIndex: 0,

  // Initial Score State
  score: 0,
  junkBinned: 0,
  mistakes: 0,
  startTime: Date.now(),

  // Audio/Visual Signal
  lastAction: null,

  // UV Light & Shake State
  isUVEnabled: false,
  shakingNodeIds: [],
  scribbles: [],

  setNodes: (nodes) => set({
    nodes,
    startTime: Date.now(),
    isVictory: false,
    isGameOver: false,
    score: 0,
    junkBinned: 0,
    mistakes: 0,
    sanity: 100,
    lastAction: null,
    isUVEnabled: false,
    shakingNodeIds: [],
    scribbles: []
  }),
  setEdges: (edges) => set({ edges }),
  setRequiredTags: (tags) => set({ requiredTags: tags }),
  setThreadColor: (color) => set({ threadColor: color }),

  // Scribble Actions
  addScribble: (text, x, y) => {
    const newScribble: Scribble = {
      id: `scr-${Date.now()}-${Math.random()}`,
      text,
      x,
      y,
      rotation: Math.random() * 20 - 10
    };

    // Keep max 5 scribbles to avoid clutter
    set(state => ({
      scribbles: [...state.scribbles.slice(-4), newScribble]
    }));

    // Auto-remove after 4 seconds for a "fleeting thought" effect
    setTimeout(() => {
      get().removeScribble(newScribble.id);
    }, 4000);
  },

  removeScribble: (id) => {
    set(state => ({ scribbles: state.scribbles.filter(s => s.id !== id) }));
  },

  // Level Management
  loadLevel: (index) => {
    const level = allCases[index];
    if (!level) {
      console.warn(`Level ${index} not found`);
      return;
    }

    const initialNodes = createNodesFromCase(level);

    set({
      currentLevelIndex: index,
      nodes: initialNodes,
      edges: [],
      sanity: 100,
      isVictory: false,
      isGameOver: false,
      score: 0,
      junkBinned: 0,
      mistakes: 0,
      startTime: Date.now(),
      requiredTags: level.requiredTags || [],
      lastAction: null,
      scribbles: [],
    });

    console.log(`📂 Loaded level ${index}: ${level.title}`);
  },

  nextLevel: () => {
    const { currentLevelIndex } = get();
    const nextIndex = currentLevelIndex + 1;

    if (nextIndex < allCases.length) {
      get().loadLevel(nextIndex);
    } else {
      console.log("🎉 ALL CASES SOLVED! No more levels.");
    }
  },

  getCurrentCase: () => {
    const { currentLevelIndex } = get();
    return allCases[currentLevelIndex] || null;
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onConnect: (params) => {
    const { nodes, edges, threadColor, addScribble, triggerShake } = get();

    // Prevent duplicate connections
    const exists = edges.some(e =>
      (e.source === params.source && e.target === params.target) ||
      (e.source === params.target && e.target === params.source)
    );
    if (exists) return;

    const source = nodes.find(n => n.id === params.source);
    const target = nodes.find(n => n.id === params.target);

    // 1. CHECK IF EVIDENCE IS REAL
    // We assume any node with 'truthTags' is relevant to the case.
    // Nodes with empty/undefined truthTags are considered "Junk".
    const sourceIsReal = ((source?.data as { truthTags?: string[] })?.truthTags?.length ?? 0) > 0;
    const targetIsReal = ((target?.data as { truthTags?: string[] })?.truthTags?.length ?? 0) > 0;

    // VALIDATION LOGIC:
    // Allow connection if BOTH are real evidence.
    // (Investigators link different facts to form a theory!)
    const isValidConnection = sourceIsReal && targetIsReal;

    if (isValidConnection) {
      // SUCCESS
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}`,
        type: threadColor === 'blue' ? 'blueString' : 'redString',
        style: { stroke: threadColor === 'blue' ? '#3b82f6' : '#e11d48', strokeWidth: 3 }
      } as Edge;

      set(state => ({
        edges: [...state.edges, newEdge],
        score: state.score + 50,
        lastAction: { type: 'CONNECT_SUCCESS', id: Date.now() }
      }));

      // Check win condition immediately
      get().validateWin();

    } else {
      // FAILURE (Connecting Junk)
      set(state => ({
        sanity: Math.max(0, state.sanity - 10),
        mistakes: state.mistakes + 1,
        lastAction: { type: 'CONNECT_FAIL', id: Date.now() }
      }));

      triggerShake(params.source);
      triggerShake(params.target);
      addScribble("IRRELEVANT!",
        (source?.position.x || 0),
        (source?.position.y || 0) - 50
      );
    }
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
        ),
        lastAction: { type: 'COMBINE_SUCCESS', id: Date.now() }
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

      // Check for game over
      const isGameOver = newSanity <= 0;

      return {
        nodes: newNodes,
        edges: newEdges,
        sanity: Math.max(0, newSanity),
        score: newScore,
        junkBinned: newJunkCount,
        mistakes: newMistakes,
        isGameOver,
        lastAction: { type: isJunk ? 'TRASH_SUCCESS' : 'TRASH_FAIL', id: Date.now() }
      };
    });

    // Spawn scribble feedback after state update
    if (!isJunk) {
      const failTexts = ["I NEEDED THAT!", "NO NO NO!", "CRITICAL EVIDENCE!", "WHAT HAVE I DONE?", "THEY WANTED THIS"];
      const randomText = failTexts[Math.floor(Math.random() * failTexts.length)];
      // Spawn scribble near center of screen with some randomness
      get().addScribble(randomText, 200 + Math.random() * 400, 150 + Math.random() * 200);
    }
  },

  modifySanity: (delta) => {
    set(state => {
      const newSanity = Math.max(0, Math.min(100, state.sanity + delta));
      const isGameOver = newSanity <= 0;
      return {
        sanity: newSanity,
        isGameOver
      };
    });
  },

  resetLevel: () => {
    // Temporary Reset
    set({
      nodes: [],
      edges: [],
      sanity: 100,
      requiredTags: [],
      isVictory: false,
      isGameOver: false,
      score: 0,
      junkBinned: 0,
      mistakes: 0,
      startTime: Date.now(),
      lastAction: null,
      scribbles: [],
    });
  },

  // UV & SHAKE ACTIONS
  toggleUV: () => set(state => ({ isUVEnabled: !state.isUVEnabled })),

  triggerShake: (id) => {
    set(state => ({ shakingNodeIds: [...state.shakingNodeIds, id] }));
    // Auto-remove shake after 500ms
    setTimeout(() => {
      set(state => ({
        shakingNodeIds: state.shakingNodeIds.filter(nId => nId !== id)
      }));
    }, 500);
  },

  addScribble: (text, x, y) => {
    const newScribble: Scribble = {
      id: `scribble-${Date.now()}`,
      text,
      x,
      y,
      rotation: Math.random() * 20 - 10
    };
    set(state => ({ scribbles: [...state.scribbles, newScribble] }));
    // Auto-remove scribble after 2 seconds
    setTimeout(() => {
      set(state => ({
        scribbles: state.scribbles.filter(s => s.id !== newScribble.id)
      }));
    }, 2000);
  },

  removeScribble: (id) => {
    set(state => ({
      scribbles: state.scribbles.filter(s => s.id !== id)
    }));
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
      set({
        isVictory: true,
        score: finalScore,
        lastAction: { type: 'VICTORY', id: Date.now() }
      });
    }
  }
}));
