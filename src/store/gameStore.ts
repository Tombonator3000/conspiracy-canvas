import { create } from 'zustand';
import { Node, Edge, Connection, applyNodeChanges, NodeChange } from '@xyflow/react';
import { EvidenceNode, Combination, Scribble, ScribbleVariant } from '@/types/game';
import { allCases } from '@/data/cases';

// Scribble text pools for different events
const SUCCESS_CONNECTION_TEXTS = [
  "YES!", "I KNEW IT!", "CONNECTED!", "THE PLOT THICKENS...",
  "FOLLOW THE THREAD!", "THEY'RE ALL LINKED!", "SEE?!",
  "IT ALL MAKES SENSE!", "I'M ONTO SOMETHING!", "GOTCHA!"
];

const SUCCESS_TRASH_TEXTS = [
  "GOOD RIDDANCE!", "DECLUTTER!", "RED HERRING!", "NICE TRY...",
  "NOT FOOLING ME!", "DISINFORMATION!", "PLANTED EVIDENCE!",
  "THEY THOUGHT I'D FALL FOR THIS?", "OBVIOUS FAKE!"
];

const SUCCESS_COMBINE_TEXTS = [
  "EUREKA!", "THE PIECES FIT!", "OF COURSE!", "BREAKTHROUGH!",
  "NOW I SEE!", "IT WAS RIGHT THERE!", "HIDDEN IN PLAIN SIGHT!",
  "THE TRUTH EMERGES!", "REVELATION!"
];

const FAILED_COMBINE_TEXTS = [
  "DOESN'T FIT...", "NO CONNECTION", "WRONG PIECES", "NOT RELATED",
  "DOESN'T COMBINE", "TRY SOMETHING ELSE", "THAT'S NOT IT",
  "NO MATCH HERE", "KEEP LOOKING..."
];

const PARANOIA_TEXTS = [
  "THEY KNOW", "RUN", "BEHIND YOU", "WATCHING", "TOO LATE",
  "TRUST NO ONE", "THEY'RE LISTENING", "IT'S ALL CONNECTED",
  "DON'T LOOK", "THEY SEE EVERYTHING"
];

// Particle burst data for merge effects
interface BurstData {
  id: string;
  x: number;
  y: number;
}

// Trash animation data
interface TrashingNode {
  id: string;
  nodeId: string;
  startTime: number;
}

// Saved node for undo functionality
interface TrashedNode {
  node: Node;
  edges: Edge[];
  wasJunk: boolean;
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

  // UNDO SYSTEM
  trashedNodes: TrashedNode[];

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

  // PARTICLE EFFECTS
  bursts: BurstData[];

  // TRASH ANIMATION
  trashingNodes: TrashingNode[];

  // ACTIONS
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setRequiredTags: (tags: string[]) => void;
  setThreadColor: (color: 'red' | 'blue') => void;

  // SCRIBBLE ACTIONS
  addScribble: (text: string, x: number, y: number, variant?: ScribbleVariant) => void;
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
  undoTrash: () => void;
  modifySanity: (delta: number) => void;
  resetLevel: () => void;

  // UV & SHAKE ACTIONS
  toggleUV: () => void;
  triggerShake: (id: string) => void;

  // PARANOIA & REVEAL ACTIONS
  revealNode: (id: string) => void;
  triggerParanoiaMovement: () => void;

  // PARTICLE EFFECT ACTIONS
  removeBurst: (id: string) => void;

  // TRASH ANIMATION ACTIONS
  startTrashAnimation: (nodeId: string, isJunk: boolean) => void;
  completeTrashAnimation: (nodeId: string) => void;

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

  // Undo System
  trashedNodes: [],

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

  // Particle Effects
  bursts: [],

  // Trash Animation
  trashingNodes: [],

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
    scribbles: [],
    trashedNodes: [],
    bursts: [],
    trashingNodes: []
  }),
  setEdges: (edges) => set({ edges }),
  setRequiredTags: (tags) => set({ requiredTags: tags }),
  setThreadColor: (color) => set({ threadColor: color }),

  // Scribble Actions
  addScribble: (text, x, y, variant = 'error') => {
    const newScribble: Scribble = {
      id: `scr-${Date.now()}-${Math.random()}`,
      text,
      x,
      y,
      rotation: Math.random() * 20 - 10,
      variant
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
      trashedNodes: [],
      bursts: [],
      trashingNodes: [],
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
    const { nodes, edges, threadColor, addScribble, triggerShake, isUVEnabled } = get();

    // Prevent duplicate connections
    const exists = edges.some(e =>
      (e.source === params.source && e.target === params.target) ||
      (e.source === params.target && e.target === params.source)
    );
    if (exists) return;

    const source = nodes.find(n => n.id === params.source);
    const target = nodes.find(n => n.id === params.target);
    if (!source || !target) return;

    const sourceData = source.data as any;
    const targetData = target.data as any;

    // --- 1. UV / ENCRYPTION CHECK ---
    // If a node requires UV, it must have been revealed OR UV must be currently ON
    const sourceEncrypted = sourceData.requiresUV && !sourceData.isRevealed && !isUVEnabled;
    const targetEncrypted = targetData.requiresUV && !targetData.isRevealed && !isUVEnabled;

    if (sourceEncrypted || targetEncrypted) {
      // PENALTY: You are guessing!
      set(state => ({
        sanity: Math.max(0, state.sanity - 15),
        mistakes: state.mistakes + 1,
        lastAction: { type: 'CONNECT_FAIL', id: Date.now() }
      }));
      triggerShake(params.source);
      triggerShake(params.target);
      addScribble("HIDDEN DETAILS MISSED!", source.position.x, source.position.y - 50);
      return; // Stop here
    }

    // --- 2. TIMELINE CHECK (BLUE THREAD ONLY) ---
    if (threadColor === 'blue') {
      const dateA = sourceData.date ? new Date(sourceData.date).getTime() : null;
      const dateB = targetData.date ? new Date(targetData.date).getTime() : null;

      if (dateA && dateB && dateA > dateB) {
        // PENALTY: Time Paradox
        set(state => ({
          sanity: Math.max(0, state.sanity - 10),
          mistakes: state.mistakes + 1,
          lastAction: { type: 'CONNECT_FAIL', id: Date.now() }
        }));
        triggerShake(params.source);
        triggerShake(params.target);
        addScribble("WRONG ORDER!", source.position.x, source.position.y - 50);
        return; // Stop here
      }
    }

    // --- 3. STANDARD CONNECTION CHECK ---
    // We assume any node with 'truthTags' is relevant to the case.
    // Nodes with empty/undefined truthTags are considered "Junk".
    const sourceIsReal = (sourceData.truthTags?.length ?? 0) > 0;
    const targetIsReal = (targetData.truthTags?.length ?? 0) > 0;

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
        animated: threadColor === 'blue', // Animate time flow for blue thread
        style: {
          stroke: threadColor === 'blue' ? '#3b82f6' : '#e11d48',
          strokeWidth: 3,
        }
      } as Edge;

      set(state => ({
        edges: [...state.edges, newEdge],
        score: state.score + 50,
        lastAction: { type: 'CONNECT_SUCCESS', id: Date.now() }
      }));

      // SUCCESS SCRIBBLE - Handwritten feedback for valid connection
      const successText = SUCCESS_CONNECTION_TEXTS[Math.floor(Math.random() * SUCCESS_CONNECTION_TEXTS.length)];
      const midX = (source.position.x + target.position.x) / 2;
      const midY = (source.position.y + target.position.y) / 2;
      addScribble(successText, midX, midY - 30, 'success');

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
        source.position.x,
        source.position.y - 50
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
    const { addScribble, triggerShake } = get();

    // 1. Find the nodes in current state
    const sourceNode = state.nodes.find(n => n.id === sourceId);
    const targetNode = state.nodes.find(n => n.id === targetId);
    if (!sourceNode || !targetNode) return;

    // 2. Check if valid combination exists
    const validCombo = availableCombinations.find(c =>
      (c.itemA === sourceId && c.itemB === targetId) ||
      (c.itemA === targetId && c.itemB === sourceId)
    );

    if (!validCombo) {
      // INVALID COMBINATION - Show feedback
      console.log(`❌ No valid combination: ${sourceId} + ${targetId}`);

      // Calculate center position for scribble
      const centerX = (sourceNode.position.x + targetNode.position.x) / 2;
      const centerY = (sourceNode.position.y + targetNode.position.y) / 2;

      // Shake both nodes
      triggerShake(sourceId);
      triggerShake(targetId);

      // Show error scribble
      const errorText = FAILED_COMBINE_TEXTS[Math.floor(Math.random() * FAILED_COMBINE_TEXTS.length)];
      addScribble(errorText, centerX, centerY - 30, 'error');

      // Play error action
      set({ lastAction: { type: 'COMBINE_FAIL', id: Date.now() } });
      return;
    }

    if (validCombo) {
      console.log(`🧪 COMBINE SUCCESS: ${sourceId} + ${targetId}`);

      // --- FIRE VISUAL EFFECT ---
      const centerX = (sourceNode.position.x + targetNode.position.x) / 2;
      const centerY = (sourceNode.position.y + targetNode.position.y) / 2;
      set(state => ({
        bursts: [
          ...state.bursts,
          { id: `burst-${Date.now()}`, x: centerX, y: centerY }
        ]
      }));

      // SUCCESS SCRIBBLE - Use unlockText from combo or random insight text
      const scribbleText = validCombo.unlockText ||
        SUCCESS_COMBINE_TEXTS[Math.floor(Math.random() * SUCCESS_COMBINE_TEXTS.length)];
      get().addScribble(scribbleText, centerX, centerY - 50, 'insight');
      // --------------------------

      // 3. HARVEST TAGS (The "Zombie Fix")
      // We manually extract tags from the data object of the parents
      const sourceTags = (sourceNode.data as { truthTags?: string[] }).truthTags || [];
      const targetTags = (targetNode.data as { truthTags?: string[] }).truthTags || [];

      const inheritedTags = new Set([...sourceTags, ...targetTags]);
      console.log("🧬 Inherited Tags:", Array.from(inheritedTags));

      // 4. PREPARE NEW NODES
      const newNodes = validCombo.resultNodes.map((blueprint: EvidenceNode, index: number) => {
        // Merge inherited tags with any specific tags the new node should have
        const finalTags = Array.from(new Set([
          ...inheritedTags,
          ...(blueprint.truthTags || [])
        ]));

        // Offset position slightly for multiple results
        const offsetX = index * 50;
        const offsetY = index * 30;

        return {
          id: blueprint.id,
          type: 'evidence',
          position: {
            x: (sourceNode.position.x + targetNode.position.x) / 2 + offsetX,
            y: (sourceNode.position.y + targetNode.position.y) / 2 + offsetY
          },
          data: {
            ...blueprint,
            truthTags: finalTags, // <--- CRITICAL INJECTION
            isSpawning: true,     // Trigger spawn animation
            rotation: Math.random() * 30 - 15, // Random rotation
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

      // 6. Clear spawning flag after animation completes
      setTimeout(() => {
        set(state => ({
          nodes: state.nodes.map(n =>
            newNodes.some(nn => nn.id === n.id)
              ? { ...n, data: { ...n.data, isSpawning: false } }
              : n
          )
        }));
      }, 600);

      // 7. Check for win condition after combination
      get().validateWin();
    }
  },

  trashNode: (id, isJunk) => {
    set(state => {
      // 0. Save node for undo
      const trashedNode = state.nodes.find(n => n.id === id);
      const trashedEdges = state.edges.filter(e => e.source === id || e.target === id);

      if (!trashedNode) {
        console.log(`⚠️ trashNode: Node ${id} not found in state`);
        return {};
      }

      console.log(`🗑️ trashNode: Removing node ${id} from ${state.nodes.length} nodes`);

      // 1. Remove Node
      const newNodes = state.nodes.filter(n => n.id !== id);
      const newEdges = state.edges.filter(e => e.source !== id && e.target !== id);

      console.log(`🗑️ trashNode: ${state.nodes.length} -> ${newNodes.length} nodes`);

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

      // Save to undo stack (keep only last 5)
      const newTrashedNodes = trashedNode
        ? [...state.trashedNodes.slice(-4), { node: trashedNode, edges: trashedEdges, wasJunk: isJunk }]
        : state.trashedNodes;

      return {
        nodes: newNodes,
        edges: newEdges,
        sanity: Math.max(0, newSanity),
        score: newScore,
        junkBinned: newJunkCount,
        mistakes: newMistakes,
        isGameOver,
        trashedNodes: newTrashedNodes,
        lastAction: { type: isJunk ? 'TRASH_SUCCESS' : 'TRASH_FAIL', id: Date.now() }
      };
    });

    // Spawn scribble feedback after state update
    if (isJunk) {
      // SUCCESS - Junk correctly identified
      const successText = SUCCESS_TRASH_TEXTS[Math.floor(Math.random() * SUCCESS_TRASH_TEXTS.length)];
      get().addScribble(successText, 200 + Math.random() * 400, 150 + Math.random() * 200, 'success');
    } else {
      // FAILURE - Real evidence trashed
      const failTexts = ["I NEEDED THAT!", "NO NO NO!", "CRITICAL EVIDENCE!", "WHAT HAVE I DONE?", "THEY WANTED THIS"];
      const randomText = failTexts[Math.floor(Math.random() * failTexts.length)];
      get().addScribble(randomText, 200 + Math.random() * 400, 150 + Math.random() * 200, 'error');
    }
  },

  undoTrash: () => {
    const { trashedNodes, sanity, addScribble } = get();

    // Check if there's anything to undo
    if (trashedNodes.length === 0) {
      console.log('⚠️ Nothing to undo');
      return;
    }

    // Check if player has enough sanity (costs 20)
    if (sanity < 20) {
      console.log('⚠️ Not enough sanity to undo (need 20)');
      addScribble("TOO TIRED...", 300 + Math.random() * 200, 150 + Math.random() * 100);
      return;
    }

    set(state => {
      const lastTrashed = state.trashedNodes[state.trashedNodes.length - 1];
      const newTrashedNodes = state.trashedNodes.slice(0, -1);

      // Restore score/stats based on what was undone
      let newScore = state.score;
      let newJunkCount = state.junkBinned;
      let newMistakes = state.mistakes;

      if (lastTrashed.wasJunk) {
        // Undo junk deletion - remove the bonus
        newScore -= 100;
        newJunkCount -= 1;
      } else {
        // Undo evidence deletion - remove the penalty
        newScore += 200;
        newMistakes -= 1;
      }

      // Calculate new sanity (cost 20, but no longer -20 from evidence deletion)
      const newSanity = Math.max(0, state.sanity - 20);
      const isGameOver = newSanity <= 0;

      console.log(`↩️ Undo: Restored ${lastTrashed.node.id}, cost 20 sanity`);

      return {
        nodes: [...state.nodes, lastTrashed.node],
        edges: [...state.edges, ...lastTrashed.edges],
        trashedNodes: newTrashedNodes,
        sanity: newSanity,
        score: newScore,
        junkBinned: newJunkCount,
        mistakes: newMistakes,
        isGameOver,
        lastAction: { type: 'UNDO_TRASH', id: Date.now() }
      };
    });

    // Feedback
    const undoTexts = ["WAIT... I NEED THAT!", "SECOND THOUGHTS...", "MAYBE IT'S IMPORTANT?"];
    const randomText = undoTexts[Math.floor(Math.random() * undoTexts.length)];
    get().addScribble(randomText, 300 + Math.random() * 200, 150 + Math.random() * 100);
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
      trashedNodes: [],
      bursts: [],
      trashingNodes: [],
    });
  },

  // UV & SHAKE ACTIONS
  toggleUV: () => set(state => ({ isUVEnabled: !state.isUVEnabled })),

  // PARANOIA & REVEAL ACTIONS
  revealNode: (id) => {
    set(state => ({
      nodes: state.nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, isRevealed: true } } : n
      )
    }));
  },

  triggerParanoiaMovement: () => {
    set(state => {
      // Pick 1 random node to nudge
      if (state.nodes.length === 0) return {};
      const randomIndex = Math.floor(Math.random() * state.nodes.length);
      const randomNode = state.nodes[randomIndex];

      // Move slightly (jitter)
      const jitterX = (Math.random() - 0.5) * 50;
      const jitterY = (Math.random() - 0.5) * 50;

      const newPos = {
        x: randomNode.position.x + jitterX,
        y: randomNode.position.y + jitterY
      };

      const updatedNodes = [...state.nodes];
      updatedNodes[randomIndex] = { ...randomNode, position: newPos };

      return { nodes: updatedNodes };
    });
  },

  triggerShake: (id) => {
    set(state => ({ shakingNodeIds: [...state.shakingNodeIds, id] }));
    // Auto-remove shake after 500ms
    setTimeout(() => {
      set(state => ({
        shakingNodeIds: state.shakingNodeIds.filter(nId => nId !== id)
      }));
    }, 500);
  },

  // Particle effect cleanup
  removeBurst: (id) => {
    set(state => ({
      bursts: state.bursts.filter(b => b.id !== id)
    }));
  },

  // Trash animation actions
  startTrashAnimation: (nodeId, isJunk) => {
    const state = get();

    // Prevent double-trashing
    if (state.trashingNodes.some(t => t.nodeId === nodeId)) {
      console.log(`⚠️ Node ${nodeId} is already being trashed`);
      return;
    }

    // Check if node exists
    const nodeToTrash = state.nodes.find(n => n.id === nodeId);
    if (!nodeToTrash) {
      console.log(`⚠️ Node ${nodeId} not found for trashing`);
      return;
    }

    console.log(`🗑️ Starting trash animation for ${nodeId}`);

    // Mark node as trashing (for animation)
    set(state => ({
      trashingNodes: [
        ...state.trashingNodes,
        { id: `trash-${Date.now()}`, nodeId, startTime: Date.now() }
      ],
      // Mark the node with isTrashing flag for CSS animation
      nodes: state.nodes.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, isTrashing: true } }
          : n
      )
    }));

    // Store isJunk for when animation completes
    const completeTrash = () => {
      console.log(`🗑️ Completing trash animation for ${nodeId}`);
      get().completeTrashAnimation(nodeId);
      get().trashNode(nodeId, isJunk);
    };

    // Complete after animation (500ms)
    setTimeout(completeTrash, 500);
  },

  completeTrashAnimation: (nodeId) => {
    set(state => ({
      trashingNodes: state.trashingNodes.filter(t => t.nodeId !== nodeId)
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
