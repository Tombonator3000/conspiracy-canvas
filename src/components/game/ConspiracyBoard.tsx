import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Hand, Cable, Undo2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EvidenceNodeComponent } from "./EvidenceNode";
import { RedStringEdge, BlueStringEdge } from "./StringEdge";
import { SanityMeter } from "./SanityMeter";
import { ConnectionCounter } from "./ConnectionCounter";
import { Scribble } from "./Scribble";
import { MadnessOverlay } from "./MadnessOverlay";
import { CaseHeader } from "./CaseHeader";
import { EvidenceBin } from "./EvidenceBin";
import { UVLightToggle, UVOverlay } from "./UVLight";
import { FloatingScoreText } from "./FloatingScoreText";
import { ParanoiaEvents } from "./ParanoiaEvents";
import { useAudioContext } from "@/contexts/AudioContext";
import { useDesktopDetection } from "@/hooks/useDesktopDetection";

import type { CaseData, GameState, Scribble as ScribbleType, ConnectionResult, FloatingScore, CredibilityStats, UndoState, HintReveal, NodeScribble, Combination, EvidenceNode as EvidenceNodeType } from "@/types/game";
import { TagMatchIndicator } from "./TagMatchIndicator";

import {
  HINT_SCRIBBLES,
  FAILURE_SCRIBBLES,
  TRASH_CRITICAL_SCRIBBLES,
  TRASH_JUNK_SCRIBBLES,
  COMBINE_UNLOCK_SCRIBBLES,
  COMBINE_FAIL_SCRIBBLES,
  NODE_PROXIMITY_THRESHOLD,
  MAX_BOARD_SCRIBBLES,
  MAX_NODE_SCRIBBLES,
  calculateEvidencePenalty,
  calculateComboBonus,
  getRandomFromArray,
} from "@/constants/game";
import { isColliding, areNodesNearby, generateUniqueId } from "@/utils/helpers";

const nodeTypes: NodeTypes = {
  evidence: EvidenceNodeComponent,
};

const edgeTypes: EdgeTypes = {
  redString: RedStringEdge,
  blueString: BlueStringEdge,
};

interface ConspiracyBoardProps {
  caseData: CaseData;
  onBackToMenu: () => void;
  onGameEnd: (
    isVictory: boolean,
    sanityRemaining: number,
    connectionsFound: number,
    credibilityStats: CredibilityStats
  ) => void;
}

// Convert case data to React Flow nodes with random rotation and z-index for chaos
const createInitialNodes = (
  caseData: CaseData,
  isDraggable: boolean,
  isUVEnabled: boolean,
  isLinkMode: boolean,
  isDesktop: boolean = false,
  nodeScribbles: NodeScribble[] = []
): Node[] => {
  return caseData.nodes.map((node, index) => {
    // Random rotation between -15 and 15 degrees for that messy board feel
    const rotation = Math.random() * 30 - 15;
    // Random z-index so nodes overlap realistically
    const zIndex = Math.floor(Math.random() * 100);
    // Get scribbles for this node
    const scribbles = nodeScribbles.filter((s) => s.nodeId === node.id);

    return {
      id: node.id,
      type: "evidence",
      position: node.position,
      data: { ...node, isUVEnabled, rotation, isLinkMode, isDesktop, nodeScribbles: scribbles },
      // On desktop, nodes are always draggable (drag from paper content)
      draggable: isDesktop ? true : isDraggable,
      zIndex,
    };
  });
};

// Connection line style is now computed dynamically based on threadType
// See getConnectionLineStyle useMemo inside ConspiracyBoard component

// Validate connection based on shared tags and thread type
// Uses allNodes (active nodes from state) to support spawned nodes from combinations
const validateConnection = (allNodes: EvidenceNodeType[], scribblePool: string[], sourceId: string, targetId: string, threadType: 'red' | 'blue' = 'red'): ConnectionResult => {
  const sourceNode = allNodes.find((n) => n.id === sourceId);
  const targetNode = allNodes.find((n) => n.id === targetId);

  if (!sourceNode || !targetNode) {
    return { isValid: false };
  }

  if (threadType === 'blue') {
    // Blue thread: timeline connections - check timelineTags or timestamp order
    const sourceTags = sourceNode.timelineTags || [];
    const targetTags = targetNode.timelineTags || [];
    const matchingTag = sourceTags.find((tag) => targetTags.includes(tag));

    if (matchingTag) {
      return { isValid: true, matchingTag, scribbleText: "TIMELINE CONFIRMED!" };
    }
    return { isValid: false };
  }

  // Red thread: relation connections
  const matchingTag = sourceNode.tags.find((tag) => targetNode.tags.includes(tag));

  if (matchingTag) {
    const scribbleText = scribblePool[
      Math.floor(Math.random() * scribblePool.length)
    ];
    return { isValid: true, matchingTag, scribbleText };
  }

  return { isValid: false };
};


// Find valid combination for two nodes
const findCombination = (combinations: Combination[] | undefined, nodeA: string, nodeB: string): Combination | null => {
  if (!combinations) return null;
  return combinations.find(
    (c) => (c.itemA === nodeA && c.itemB === nodeB) || (c.itemA === nodeB && c.itemB === nodeA)
  ) || null;
};

// Get combination hint for a node (shown under UV light)
const getCombinationHint = (combinations: Combination[] | undefined, nodeId: string): string | undefined => {
  if (!combinations) return undefined;
  // Find a combination where this node is itemA (hint is shown on itemA)
  const combo = combinations.find((c) => c.itemA === nodeId && c.hint);
  return combo?.hint;
};

// Check if a node can be combined with any other node currently on the board
const getCombinable = (combinations: Combination[] | undefined, nodeId: string, currentNodeIds: string[]): { canCombine: boolean; isChainResult: boolean } => {
  if (!combinations) return { canCombine: false, isChainResult: false };

  for (const combo of combinations) {
    // Check if this node is part of any combination
    if (combo.itemA === nodeId || combo.itemB === nodeId) {
      // Check if the partner node exists on the board
      const partnerId = combo.itemA === nodeId ? combo.itemB : combo.itemA;
      if (currentNodeIds.includes(partnerId)) {
        return { canCombine: true, isChainResult: false };
      }
    }
  }

  // Check if this node is a chain result (came from a combination and can be used in another)
  const isChainResult = combinations.some((c) =>
    c.isChainResult && c.resultNodes.some((rn) => rn.id === nodeId)
  );

  return { canCombine: false, isChainResult };
};


// Cluster detection: Check if all critical nodes are in the same connected component
const getConnectedCriticalNodes = (edges: Edge[], criticalNodeIds: string[]): Set<string> => {
  if (criticalNodeIds.length === 0) return new Set();

  // Build adjacency list from edges
  const adjacency: Map<string, Set<string>> = new Map();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
    adjacency.get(edge.source)!.add(edge.target);
    adjacency.get(edge.target)!.add(edge.source);
  });

  // BFS from first critical node that has connections
  const startNode = criticalNodeIds.find((id) => adjacency.has(id));
  if (!startNode) return new Set();

  const visited = new Set<string>();
  const queue = [startNode];
  visited.add(startNode);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacency.get(current);
    if (neighbors) {
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      });
    }
  }

  // Return which critical nodes are connected
  return new Set(criticalNodeIds.filter((id) => visited.has(id)));
};

// Check if all critical nodes form a single cluster (legacy fallback)
const checkAllCriticalConnected = (edges: Edge[], criticalNodeIds: string[]): boolean => {
  const connectedCritical = getConnectedCriticalNodes(edges, criticalNodeIds);
  return criticalNodeIds.every((id) => connectedCritical.has(id));
};

// NEW: Tag-Based Semantic Truth Verification
// Get the largest connected cluster of nodes
const getLargestConnectedCluster = (edges: Edge[], allNodeIds: string[]): Set<string> => {
  if (allNodeIds.length === 0) return new Set();

  // Build adjacency list from edges
  const adjacency: Map<string, Set<string>> = new Map();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
    adjacency.get(edge.source)!.add(edge.target);
    adjacency.get(edge.target)!.add(edge.source);
  });

  // Find all connected components using BFS
  const visited = new Set<string>();
  let largestCluster = new Set<string>();

  for (const nodeId of allNodeIds) {
    if (visited.has(nodeId) || !adjacency.has(nodeId)) continue;

    // BFS to find this component
    const cluster = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);
      cluster.add(current);

      const neighbors = adjacency.get(current);
      if (neighbors) {
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }

    // Keep track of the largest cluster
    if (cluster.size > largestCluster.size) {
      largestCluster = cluster;
    }
  }

  return largestCluster;
};

// Collect all relevant tags (standard + truthTags) from nodes in a cluster
const collectTruthTagsFromCluster = (clusterNodeIds: Set<string>, allNodes: EvidenceNodeType[]): Set<string> => {
  const collectedTags = new Set<string>();

  clusterNodeIds.forEach((nodeId) => {
    const node = allNodes.find((n) => n.id === nodeId);
    node?.tags.forEach((tag) => collectedTags.add(tag));
    node?.truthTags?.forEach((tag) => collectedTags.add(tag));
  });

  return collectedTags;
};

// Check if the largest connected cluster contains all required truth tags
const checkTruthTagsWinCondition = (
  edges: Edge[],
  allNodes: EvidenceNodeType[],
  requiredTags: string[] | undefined
): boolean => {
  // If no requiredTags defined, fall back to legacy critical node check
  if (!requiredTags || requiredTags.length === 0) {
    return false; // Will use legacy check
  }

  const allNodeIds = allNodes.map((n) => n.id);
  const largestCluster = getLargestConnectedCluster(edges, allNodeIds);

  if (largestCluster.size === 0) return false;

  const collectedTags = collectTruthTagsFromCluster(largestCluster, allNodes);

  // Check if all required tags are present in the cluster
  return requiredTags.every((tag) => collectedTags.has(tag));
};

export const ConspiracyBoard = ({ caseData, onBackToMenu, onGameEnd }: ConspiracyBoardProps) => {

  // Desktop detection for Pro Controls
  const isDesktop = useDesktopDetection();

  // Spacebar state for desktop panning
  const [isSpacebarHeld, setIsSpacebarHeld] = useState(false);

  // Mobile mode: 'pan' allows moving around, 'connect' locks nodes for easier connecting
  // On desktop, this is effectively always 'pan' since dragging is from paper, linking is from pin
  const [interactionMode, setInteractionMode] = useState<'pan' | 'connect'>('pan');
  const [isUVEnabled, setIsUVEnabled] = useState(false);
  const [binHighlighted, setBinHighlighted] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [combineTargetId, setCombineTargetId] = useState<string | null>(null);
  const [spawningNodes, setSpawningNodes] = useState<Set<string>>(new Set());
  const [threadType, setThreadType] = useState<'red' | 'blue'>('red');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Dynamic connection line style based on thread type (preview color while dragging)
  const connectionLineStyle = useMemo(() => ({
    stroke: threadType === 'blue' ? 'hsl(220, 80%, 50%)' : 'hsl(350, 80%, 50%)',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
  }), [threadType]);

  // Ref for the evidence bin for collision detection
  const binRef = useRef<HTMLDivElement>(null);

  // Spacebar key handlers for desktop panning
  useEffect(() => {
    if (!isDesktop) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacebarHeld(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacebarHeld(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isDesktop]);
  
  const { playSFX, playSound, updateSanity, startAmbient, stopAmbient } = useAudioContext();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes(caseData, interactionMode === 'pan', isUVEnabled, interactionMode === 'connect'));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Extract evidence data from active nodes (includes spawned nodes from combinations)
  const allEvidenceNodes = useMemo(
    () => nodes.map((n) => n.data as EvidenceNodeType),
    [nodes]
  );

  // Get all critical node IDs from active nodes for cluster detection (includes spawned critical nodes)
  const criticalNodeIds = useMemo(
    () => allEvidenceNodes.filter((n) => n.isCritical).map((n) => n.id),
    [allEvidenceNodes]
  );
  
  const [gameState, setGameState] = useState<GameState>({
    sanity: caseData.boardState.sanity,
    chaosLevel: caseData.boardState.chaosLevel,
    validConnections: 0,
    maxConnections: caseData.boardState.maxConnectionsNeeded,
    scribbles: [],
    nodeScribbles: [],
    isGameOver: false,
    isVictory: false,
    // Credibility Engine - starts at 500
    credibility: 500,
    cleanupBonus: 0,
    trashedJunkCount: 0,
    // Progressive penalty scaling
    evidenceMistakes: 0,
    // Combo system
    consecutiveCorrect: 0,
    comboBonus: 0,
    // Undo system
    undoAvailable: true,
    trashedEvidenceCount: 0,
  });

  // State for undo functionality
  const [undoState, setUndoState] = useState<UndoState | null>(null);

  // State for revealed hints (nodeId -> revealed tag indices)
  const [revealedHints, setRevealedHints] = useState<Map<string, number[]>>(new Map());

  // State for tag match indicator during connection
  const [tagMatchInfo, setTagMatchInfo] = useState<{
    visible: boolean;
    matchCount: number;
    maxTags: number;
    position: { x: number; y: number };
  }>({ visible: false, matchCount: 0, maxTags: 1, position: { x: 0, y: 0 } });

  // Track connecting source node for tag visualization
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);

  // Update audio stress layer when sanity changes
  useEffect(() => {
    updateSanity(gameState.sanity);
  }, [gameState.sanity, updateSanity]);

  // Start ambient audio when game begins, stop when component unmounts
  useEffect(() => {
    startAmbient();
    return () => {
      stopAmbient();
    };
  }, [startAmbient, stopAmbient]);

  // Update node draggability, link mode, revealed hints, and combination data when mode changes
  useEffect(() => {
    // On desktop, link mode is never used (source handle is on pin)
    const isLinkMode = isDesktop ? false : interactionMode === 'connect';
    const currentNodeIds = nodes.map((n) => n.id);

    // Calculate nearby combinable pairs
    const nearbyPairs = new Set<string>();
    if (caseData.combinations) {
      for (const combo of caseData.combinations) {
        const nodeA = nodes.find((n) => n.id === combo.itemA);
        const nodeB = nodes.find((n) => n.id === combo.itemB);
        if (nodeA && nodeB && areNodesNearby(nodeA.position, nodeB.position)) {
          nearbyPairs.add(combo.itemA);
          nearbyPairs.add(combo.itemB);
        }
      }
    }

    setNodes((nds) =>
      nds.map((node) => {
        const nodeHints = revealedHints.get(node.id) || [];
        const nodeData = caseData.nodes.find((n) => n.id === node.id);
        const revealedTags = nodeHints.map((idx) => nodeData?.tags[idx]).filter(Boolean) as string[];
        const scribbles = gameState.nodeScribbles.filter((s) => s.nodeId === node.id);

        // Get combination-related data
        const combinationHint = getCombinationHint(caseData.combinations, node.id);
        const { canCombine, isChainResult } = getCombinable(caseData.combinations, node.id, currentNodeIds);
        const isNearbyCombinable = nearbyPairs.has(node.id);

        return {
          ...node,
          // On desktop, always draggable. On mobile, only in pan mode.
          draggable: isDesktop ? true : interactionMode === 'pan',
          data: {
            ...node.data,
            isUVEnabled,
            isLinkMode,
            revealedTags,
            isDesktop,
            nodeScribbles: scribbles,
            // Combination features
            combinationHint,
            isNearbyCombinable: isNearbyCombinable && canCombine,
            isChainCombinable: isChainResult && canCombine,
          },
        };
      })
    );
  }, [interactionMode, isUVEnabled, setNodes, revealedHints, caseData.nodes, caseData.combinations, isDesktop, gameState.nodeScribbles, nodes]);

  // Update combine target highlighting
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, isCombineTarget: node.id === combineTargetId },
      }))
    );
  }, [combineTargetId, setNodes]);

  // Calculate remaining junk on the board
  const getRemainingJunkCount = useCallback(() => {
    const currentNodeIds = nodes.map((n) => n.id);
    return caseData.nodes.filter(
      (n) => n.isRedHerring && !n.isCritical && currentNodeIds.includes(n.id)
    ).length;
  }, [nodes, caseData.nodes]);

  // Handle game end
  useEffect(() => {
    if (gameState.isVictory || gameState.isGameOver) {
      // Stop ambient audio when game ends
      stopAmbient();
      // Small delay for the user to see the final state
      const timer = setTimeout(() => {
        const credibilityStats: CredibilityStats = {
          credibility: gameState.credibility,
          cleanupBonus: gameState.cleanupBonus,
          trashedJunkCount: gameState.trashedJunkCount,
          junkRemaining: getRemainingJunkCount(),
        };
        onGameEnd(gameState.isVictory, gameState.sanity, gameState.validConnections, credibilityStats);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.isVictory, gameState.isGameOver, gameState.sanity, gameState.validConnections, gameState.credibility, gameState.cleanupBonus, gameState.trashedJunkCount, getRemainingJunkCount, onGameEnd, stopAmbient]);

  // Remove floating scribble by id
  const removeScribble = useCallback((id: string) => {
    setGameState((prev) => ({
      ...prev,
      scribbles: prev.scribbles.filter((s) => s.id !== id),
    }));
  }, []);

  // Remove node scribble by id
  const removeNodeScribble = useCallback((id: string) => {
    setGameState((prev) => ({
      ...prev,
      nodeScribbles: prev.nodeScribbles.filter((s) => s.id !== id),
    }));
  }, []);

  // Clear all floating scribbles
  const clearAllScribbles = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      scribbles: [],
    }));
  }, []);

  // Add scribble at position (legacy floating scribbles for mobile)
  // Limits to max 2 scribbles to prevent piling up
  const addScribble = useCallback((text: string, x: number, y: number) => {
    const newScribble: ScribbleType = {
      id: `scribble-${Date.now()}`,
      text,
      x,
      y,
      rotation: Math.random() * 20 - 10,
    };
    setGameState((prev) => {
      // Keep only the most recent scribble, add the new one (max 2)
      const recentScribbles = prev.scribbles.slice(-1);
      return {
        ...prev,
        scribbles: [...recentScribbles, newScribble],
      };
    });
  }, []);

  // Add scribble parented to a specific node (auto-removes after 2s)
  // Removes any existing scribbles on the same node first to prevent piling
  const addNodeScribble = useCallback((
    nodeId: string,
    text: string,
    position: NodeScribble["position"] = "bottom",
    style: NodeScribble["style"] = "handwritten"
  ) => {
    const scribbleId = `node-scribble-${Date.now()}-${Math.random()}`;
    const newScribble: NodeScribble = {
      id: scribbleId,
      nodeId,
      text,
      rotation: Math.random() * 16 - 8,
      position,
      style,
    };
    setGameState((prev) => {
      // Remove any existing scribbles on this node to prevent piling
      const otherNodeScribbles = prev.nodeScribbles.filter((s) => s.nodeId !== nodeId);
      return {
        ...prev,
        nodeScribbles: [...otherNodeScribbles, newScribble],
      };
    });

    // Auto-remove after 2 seconds
    setTimeout(() => {
      removeNodeScribble(scribbleId);
    }, 2000);
  }, [removeNodeScribble]);

  // Reveal a random tag on a random node as a hint
  const revealRandomHint = useCallback(() => {
    // Get nodes with unrevealed tags (excluding fully revealed ones)
    const nodesWithHiddenTags = nodes.filter((node) => {
      const nodeData = caseData.nodes.find((n) => n.id === node.id);
      if (!nodeData) return false;
      const revealed = revealedHints.get(node.id) || [];
      return revealed.length < nodeData.tags.length;
    });

    if (nodesWithHiddenTags.length === 0) return null;

    // Pick a random node
    const randomNode = nodesWithHiddenTags[Math.floor(Math.random() * nodesWithHiddenTags.length)];
    const nodeData = caseData.nodes.find((n) => n.id === randomNode.id);
    if (!nodeData) return null;

    // Pick a random unrevealed tag
    const revealed = revealedHints.get(randomNode.id) || [];
    const unrevealedIndices = nodeData.tags
      .map((_, idx) => idx)
      .filter((idx) => !revealed.includes(idx));

    if (unrevealedIndices.length === 0) return null;

    const randomTagIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    const revealedTag = nodeData.tags[randomTagIndex];

    // Update revealed hints
    setRevealedHints((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(randomNode.id) || [];
      newMap.set(randomNode.id, [...existing, randomTagIndex]);
      return newMap;
    });

    return { nodeId: randomNode.id, tag: revealedTag, nodeTitle: nodeData.title };
  }, [nodes, caseData.nodes, revealedHints]);

  // Save current state for undo
  const saveUndoState = useCallback(() => {
    const { scribbles, ...gameStateWithoutScribbles } = gameState;
    setUndoState({
      nodes: nodes.map((n) => n.id),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
      gameState: gameStateWithoutScribbles,
    });
  }, [nodes, edges, gameState]);

  // Perform undo action
  const performUndo = useCallback(() => {
    if (!undoState || !gameState.undoAvailable || gameState.sanity < 20) return;

    playSFX("uv_toggle"); // Use a sound for undo

    // Restore nodes
    const restoredNodeIds = new Set(undoState.nodes);
    setNodes(createInitialNodes(caseData, interactionMode === 'pan', isUVEnabled, interactionMode === 'connect')
      .filter((n) => restoredNodeIds.has(n.id)));

    // Restore edges
    setEdges(undoState.edges.map((e) => ({
      id: `edge-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      type: "redString",
      data: { isValid: true },
    })));

    // Restore game state with sanity cost
    const newSanity = Math.max(0, gameState.sanity - 20);
    setGameState((prev) => ({
      ...prev,
      ...undoState.gameState,
      scribbles: prev.scribbles,
      sanity: newSanity,
      undoAvailable: false,
      isGameOver: newSanity <= 0,
    }));

    // Add scribble
    addScribble("TIME REWINDS... BUT AT WHAT COST?", 400, 300);

    setUndoState(null);
  }, [undoState, gameState.undoAvailable, gameState.sanity, caseData, interactionMode, isUVEnabled, playSFX, setNodes, setEdges, addScribble]);

  // Spawn floating score text at position
  const spawnFloatingScore = useCallback((value: number, x: number, y: number, isPositive: boolean) => {
    const newScore: FloatingScore = {
      id: `score-${Date.now()}-${Math.random()}`,
      value,
      x: x - 30, // Center the text
      y: y - 20,
      isPositive,
    };
    setFloatingScores((prev) => [...prev, newScore]);

    // Remove after animation completes
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((s) => s.id !== newScore.id));
    }, 1500);
  }, []);

  // Shake a node
  const shakeNode = useCallback((nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isShaking: true } }
          : node
      )
    );
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isShaking: false } }
            : node
        )
      );
    }, 400);
  }, [setNodes]);

  // Handle UV toggle
  const handleUVToggle = useCallback(() => {
    setIsUVEnabled((prev) => !prev);
    playSFX("uv_toggle");
  }, [playSFX]);

  // Handle node drop to bin - Credibility Engine scoring with progressive penalties
  const handleNodeDropToBin = useCallback((nodeId: string) => {
    const nodeData = caseData.nodes.find((n) => n.id === nodeId);
    if (!nodeData) return;

    // Save state before action for potential undo
    saveUndoState();

    // Always play paper crumple first
    playSFX("paper_crumple");

    // Remove node from board
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));

    // Remove any edges connected to this node
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));

    // Fix: Clear categorization - critical nodes are ALWAYS real evidence
    const isJunk = nodeData.isRedHerring && !nodeData.isCritical;
    const isRealEvidence = !nodeData.isRedHerring || nodeData.isCritical;

    if (isJunk) {
      // TRASHING JUNK - +150 Credibility + HINT REVEAL
      playSFX("paper_crumple");

      // Spawn floating score at cursor position
      spawnFloatingScore(150, cursorPosition.x, cursorPosition.y, true);

      // Add success scribble
      const randomScribble = getRandomFromArray(TRASH_JUNK_SCRIBBLES);
      addScribble(randomScribble, 400, 300);

      // Reveal a hint as bonus for correct trash
      const hint = revealRandomHint();
      if (hint) {
        setTimeout(() => {
          const hintScribble = getRandomFromArray(HINT_SCRIBBLES);
          addScribble(`${hintScribble}\n"${hint.tag}" on ${hint.nodeTitle}`, 200, 450);
        }, 500);
      }

      setGameState((prev) => ({
        ...prev,
        credibility: prev.credibility + 150,
        cleanupBonus: prev.cleanupBonus + 150,
        trashedJunkCount: prev.trashedJunkCount + 1,
      }));
    } else if (isRealEvidence) {
      // TRASHING REAL EVIDENCE - Progressive penalty (100→200→300→400→500)
      playSFX("connect_fail");

      // Calculate progressive penalty
      const penalty = calculateEvidencePenalty(gameState.evidenceMistakes);

      // Spawn floating score at cursor position
      spawnFloatingScore(-penalty, cursorPosition.x, cursorPosition.y, false);

      // Add failure scribble with penalty warning
      const randomScribble = getRandomFromArray(TRASH_CRITICAL_SCRIBBLES);
      const warningText = gameState.evidenceMistakes < 4
        ? `\n(Next mistake: -${calculateEvidencePenalty(gameState.evidenceMistakes + 1)})`
        : "";
      addScribble(randomScribble + warningText, 400, 300);

      setGameState((prev) => {
        const newCredibility = prev.credibility - penalty;
        const newSanity = Math.max(0, prev.sanity - 20);
        // Game over if credibility drops below 0
        const isCredibilityGameOver = newCredibility < 0;
        return {
          ...prev,
          credibility: newCredibility,
          sanity: newSanity,
          chaosLevel: prev.chaosLevel + 1,
          evidenceMistakes: prev.evidenceMistakes + 1,
          trashedEvidenceCount: prev.trashedEvidenceCount + 1,
          consecutiveCorrect: 0, // Reset combo on mistake
          isGameOver: newSanity <= 0 || isCredibilityGameOver,
        };
      });
    }
  }, [caseData.nodes, setNodes, setEdges, addScribble, playSFX, spawnFloatingScore, cursorPosition, saveUndoState, revealRandomHint, gameState.evidenceMistakes]);

  // Track node dragging for bin highlight and node-on-node collision
  const handleNodeDrag = useCallback((event: React.MouseEvent | React.TouchEvent, node: Node) => {
    setDraggedNodeId(node.id);

    // Get client coordinates from mouse or touch event
    let clientX: number, clientY: number;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    // Track cursor position for floating score
    setCursorPosition({ x: clientX, y: clientY });

    // Create a small rect around the cursor/touch point for collision
    const cursorRect = new DOMRect(clientX - 20, clientY - 20, 40, 40);

    // Check bin collision
    if (binRef.current) {
      const binRect = binRef.current.getBoundingClientRect();
      const collidingWithBin = isColliding(cursorRect, binRect);
      setBinHighlighted(collidingWithBin);
    }

    // Check collision with other nodes for combine mechanic
    const nodeElements = document.querySelectorAll('[data-id]');
    let foundTarget: string | null = null;
    nodeElements.forEach((el) => {
      const targetId = el.getAttribute('data-id');
      if (targetId && targetId !== node.id) {
        const targetRect = el.getBoundingClientRect();
        if (isColliding(cursorRect, targetRect)) {
          foundTarget = targetId;
        }
      }
    });
    setCombineTargetId(foundTarget);
  }, []);

  // Check win condition after state changes (combinations, etc.)
  // This collects all truthTags from ALL nodes on the board
  const checkWinConditionAfterCombination = useCallback((
    currentEdges: Edge[],
    currentNodes: EvidenceNodeType[],
    requiredTags: string[] | undefined
  ): boolean => {
    if (!requiredTags || requiredTags.length === 0) {
      return false;
    }

    // First, try the standard cluster-based check
    const clusterWin = checkTruthTagsWinCondition(currentEdges, currentNodes, requiredTags);
    if (clusterWin) return true;

    // If cluster check fails, check if ALL required truthTags exist across ANY connected nodes
    // This handles the case where combinations create nodes with all needed tags
    // but they might be in a smaller cluster or even isolated
    const allNodeIds = currentNodes.map((n) => n.id);

    // Get all clusters (not just the largest)
    const adjacency: Map<string, Set<string>> = new Map();
    currentEdges.forEach((edge) => {
      if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
      if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
      adjacency.get(edge.source)!.add(edge.target);
      adjacency.get(edge.target)!.add(edge.source);
    });

    // Check each cluster for having all required tags
    const visited = new Set<string>();
    for (const nodeId of allNodeIds) {
      if (visited.has(nodeId) || !adjacency.has(nodeId)) continue;

      // BFS to find this cluster
      const cluster = new Set<string>();
      const queue = [nodeId];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;

        visited.add(current);
        cluster.add(current);

        const neighbors = adjacency.get(current);
        if (neighbors) {
          neighbors.forEach((neighbor) => {
            if (!visited.has(neighbor)) {
              queue.push(neighbor);
            }
          });
        }
      }

      // Check if this cluster has all required tags
      const clusterTags = collectTruthTagsFromCluster(cluster, currentNodes);
      if (requiredTags.every((tag) => clusterTags.has(tag))) {
        return true;
      }
    }

    return false;
  }, []);

  // Spawn new nodes from combination with burst animation
  const spawnCombinationNodes = useCallback((resultNodes: EvidenceNodeType[], centerPosition: { x: number; y: number }) => {
    const newFlowNodes: Node[] = resultNodes.map((node, index) => {
      const angle = (index / resultNodes.length) * 2 * Math.PI;
      const radius = 80 + Math.random() * 40;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const rotation = Math.random() * 30 - 15;
      const zIndex = Math.floor(Math.random() * 100);

      return {
        id: node.id,
        type: "evidence",
        position: {
          x: centerPosition.x + offsetX,
          y: centerPosition.y + offsetY
        },
        data: { ...node, isUVEnabled, rotation, isLinkMode: interactionMode === 'connect', isSpawning: true },
        draggable: interactionMode === 'pan',
        zIndex,
      };
    });

    // Add nodes with spawning animation flag
    setNodes((nds) => [...nds, ...newFlowNodes]);
    setSpawningNodes(new Set(resultNodes.map((n) => n.id)));

    // Clear spawning animation after delay
    setTimeout(() => {
      setSpawningNodes(new Set());
      setNodes((nds) => nds.map((n) =>
        resultNodes.some((rn) => rn.id === n.id)
          ? { ...n, data: { ...n.data, isSpawning: false } }
          : n
      ));
    }, 600);
  }, [isUVEnabled, interactionMode, setNodes]);

  const handleNodeDragStop = useCallback((event: React.MouseEvent | React.TouchEvent, node: Node) => {
    // Priority 1: Bin drop
    if (binHighlighted && draggedNodeId) {
      handleNodeDropToBin(draggedNodeId);
      setBinHighlighted(false);
      setDraggedNodeId(null);
      setCombineTargetId(null);
      return;
    }

    // Priority 2: Combine with another node
    if (combineTargetId && draggedNodeId && draggedNodeId !== combineTargetId) {
      const combination = findCombination(caseData.combinations, draggedNodeId, combineTargetId);

      if (combination) {
        // Valid combination!
        playSFX("connect_success");

        // Get position for spawning (between the two nodes)
        const targetNode = nodes.find((n) => n.id === combineTargetId);
        const sourceNode = nodes.find((n) => n.id === draggedNodeId);
        const centerPos = targetNode && sourceNode
          ? { x: (targetNode.position.x + sourceNode.position.x) / 2, y: (targetNode.position.y + sourceNode.position.y) / 2 }
          : { x: 400, y: 300 };

        // CRITICAL: Inherit truthTags from parent nodes to result nodes
        // This ensures the semantic meaning is preserved even after merging
        const sourceData = sourceNode?.data as EvidenceNodeType | undefined;
        const targetData = targetNode?.data as EvidenceNodeType | undefined;
        const parentTruthTags = new Set<string>();
        sourceData?.truthTags?.forEach((tag) => parentTruthTags.add(tag));
        targetData?.truthTags?.forEach((tag) => parentTruthTags.add(tag));

        // Create result nodes with inherited truthTags
        const resultNodesWithInheritedTags = combination.resultNodes.map((node) => ({
          ...node,
          truthTags: [
            ...(node.truthTags || []),
            ...Array.from(parentTruthTags),
          ].filter((tag, idx, arr) => arr.indexOf(tag) === idx), // Remove duplicates
        }));

        // Calculate remaining nodes and edges after combination
        const remainingNodes = nodes.filter((n) => n.id !== draggedNodeId && n.id !== combineTargetId);
        const remainingEdges = edges.filter((e) =>
          e.source !== draggedNodeId && e.target !== draggedNodeId &&
          e.source !== combineTargetId && e.target !== combineTargetId
        );

        // Remove the two combined nodes
        setNodes((nds) => nds.filter((n) => n.id !== draggedNodeId && n.id !== combineTargetId));
        setEdges((eds) => eds.filter((e) =>
          e.source !== draggedNodeId && e.target !== draggedNodeId &&
          e.source !== combineTargetId && e.target !== combineTargetId
        ));

        // Spawn new nodes with inherited truthTags
        spawnCombinationNodes(resultNodesWithInheritedTags, centerPos);

        // Add unlock scribble
        const unlockText = combination.unlockText || getRandomFromArray(COMBINE_UNLOCK_SCRIBBLES);
        addScribble(unlockText, centerPos.x, centerPos.y - 50);

        // Bonus credibility for successful combine (use custom bonus if defined)
        const credBonus = combination.bonusCredibility ?? 200;
        spawnFloatingScore(credBonus, cursorPosition.x, cursorPosition.y, true);

        // Calculate all nodes after combination (remaining + new spawned nodes)
        const allNodesAfterCombination: EvidenceNodeType[] = [
          ...remainingNodes.map((n) => n.data as EvidenceNodeType),
          ...resultNodesWithInheritedTags,
        ];

        // Check win condition after combination
        // We need to check if the new state contains all required truthTags in any cluster
        const isVictoryAfterCombine = checkWinConditionAfterCombination(
          remainingEdges,
          allNodesAfterCombination,
          caseData.requiredTags
        );

        // Update connected critical count for display
        const newCriticalIds = allNodesAfterCombination.filter((n) => n.isCritical).map((n) => n.id);
        const connectedCriticalAfterCombine = getConnectedCriticalNodes(remainingEdges, newCriticalIds);

        setGameState((prev) => ({
          ...prev,
          credibility: prev.credibility + credBonus,
          validConnections: connectedCriticalAfterCombine.size,
          isVictory: isVictoryAfterCombine,
        }));
      } else {
        // Invalid combination - shake both nodes
        playSFX("connect_fail");
        shakeNode(draggedNodeId);
        shakeNode(combineTargetId);
        
        const failText = getRandomFromArray(COMBINE_FAIL_SCRIBBLES);
        addScribble(failText, cursorPosition.x - 50, cursorPosition.y - 50);
      }
    }

    setBinHighlighted(false);
    setDraggedNodeId(null);
    setCombineTargetId(null);
  }, [binHighlighted, draggedNodeId, combineTargetId, handleNodeDropToBin, caseData.combinations, caseData.requiredTags, nodes, edges, setNodes, setEdges, spawnCombinationNodes, addScribble, playSFX, shakeNode, spawnFloatingScore, cursorPosition, checkWinConditionAfterCombination]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (gameState.isGameOver || gameState.isVictory) return;
      if (!connection.source || !connection.target) return;

      // Check if this connection already exists with the same thread type
      const expectedEdgeType = threadType === 'blue' ? "blueString" : "redString";
      const existingEdge = edges.find(
        (e) =>
          e.type === expectedEdgeType &&
          ((e.source === connection.source && e.target === connection.target) ||
           (e.source === connection.target && e.target === connection.source))
      );
      if (existingEdge) return;

      const result = validateConnection(allEvidenceNodes, caseData.scribblePool, connection.source, connection.target, threadType);

      if (result.isValid) {
        playSFX("connect_success");

        // Valid connection - add appropriate thread color
        const newEdge: Edge = {
          ...connection,
          id: `edge-${connection.source}-${connection.target}-${threadType}`,
          type: threadType === 'blue' ? "blueString" : "redString",
          data: { isValid: true },
          source: connection.source,
          target: connection.target,
        };

        // Calculate new edges array to check cluster connectivity
        const updatedEdges = addEdge(newEdge, edges);
        setEdges(updatedEdges);

        // Add scribble - parented to target node on desktop, floating on mobile
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);
        if (sourceNode && targetNode && result.scribbleText) {
          if (isDesktop) {
            // Parent scribble to target node
            addNodeScribble(connection.target, result.scribbleText, "diagonal", "stamp");
          } else {
            const midX = (sourceNode.position.x + targetNode.position.x) / 2;
            const midY = (sourceNode.position.y + targetNode.position.y) / 2;
            addScribble(result.scribbleText, midX, midY);
          }
        }

        // Use tag-based semantic truth verification for win condition
        // Falls back to legacy critical node check if no requiredTags defined
        const connectedCritical = getConnectedCriticalNodes(updatedEdges, criticalNodeIds);
        const linkedEvidenceCount = connectedCritical.size;
        const tagBasedVictory = checkTruthTagsWinCondition(updatedEdges, allEvidenceNodes, caseData.requiredTags);
        const legacyVictory = checkAllCriticalConnected(updatedEdges, criticalNodeIds);
        // Tag-based takes priority if requiredTags is defined, otherwise use legacy
        const isVictory = caseData.requiredTags?.length ? tagBasedVictory : legacyVictory;

        // Calculate combo bonus for consecutive correct connections
        const newConsecutiveCorrect = gameState.consecutiveCorrect + 1;
        const comboBonus = calculateComboBonus(newConsecutiveCorrect);

        // Show combo bonus if earned
        if (comboBonus > 0 && sourceNode && targetNode) {
          setTimeout(() => {
            if (isDesktop) {
              addNodeScribble(connection.source!, `🔥 COMBO x${newConsecutiveCorrect}!`, "top", "handwritten");
            } else {
              const midX = (sourceNode.position.x + targetNode.position.x) / 2;
              const midY = (sourceNode.position.y + targetNode.position.y) / 2 - 50;
              addScribble(`🔥 COMBO x${newConsecutiveCorrect}! +${comboBonus} CRED`, midX, midY);
            }
          }, 300);
          // Spawn floating bonus score
          spawnFloatingScore(comboBonus, cursorPosition.x + 50, cursorPosition.y, true);
        }

        // Update game state with cluster-based detection and combo
        setGameState((prev) => ({
          ...prev,
          validConnections: linkedEvidenceCount,
          isVictory,
          consecutiveCorrect: newConsecutiveCorrect,
          comboBonus: prev.comboBonus + comboBonus,
          credibility: prev.credibility + comboBonus,
        }));
      } else {
        playSFX("connect_fail");

        // Invalid connection - shake nodes and reduce sanity
        shakeNode(connection.source);
        shakeNode(connection.target);

        // Add failure scribble with combo break notification
        const sourceNode = nodes.find((n) => n.id === connection.source);
        if (sourceNode) {
          const failureText = getRandomFromArray(FAILURE_SCRIBBLES);
          const comboBreakText = gameState.consecutiveCorrect >= 2 ? "\n💔 COMBO BROKEN!" : "";
          if (isDesktop) {
            addNodeScribble(connection.source!, failureText, "center", "stamp");
            if (comboBreakText) {
              addNodeScribble(connection.target!, "💔 COMBO BROKEN!", "bottom", "handwritten");
            }
          } else {
            addScribble(failureText + comboBreakText, sourceNode.position.x, sourceNode.position.y);
          }
        }

        setGameState((prev) => {
          const newSanity = Math.max(0, prev.sanity - 15);
          const isGameOver = newSanity <= 0;
          return {
            ...prev,
            sanity: newSanity,
            chaosLevel: prev.chaosLevel + 1,
            consecutiveCorrect: 0, // Reset combo on failure
            isGameOver,
          };
        });
      }

      // Hide tag match indicator after connection attempt
      setTagMatchInfo((prev) => ({ ...prev, visible: false }));
      setConnectingSourceId(null);
    },
    [edges, nodes, caseData, allEvidenceNodes, gameState.isGameOver, gameState.isVictory, gameState.consecutiveCorrect, setEdges, shakeNode, addScribble, addNodeScribble, playSFX, criticalNodeIds, spawnFloatingScore, cursorPosition, isDesktop, threadType]
  );

  // Handle connection start - track source for tag visualization
  const onConnectStart = useCallback((_: unknown, { nodeId }: { nodeId: string | null }) => {
    if (nodeId) {
      setConnectingSourceId(nodeId);
    }
  }, []);

  // Handle connection end - hide tag match indicator
  const onConnectEnd = useCallback(() => {
    setTagMatchInfo((prev) => ({ ...prev, visible: false }));
    setConnectingSourceId(null);
  }, []);

  // Calculate tag match info when hovering during connection
  const calculateTagMatch = useCallback((sourceId: string, targetId: string) => {
    const sourceNode = allEvidenceNodes.find((n) => n.id === sourceId);
    const targetNode = allEvidenceNodes.find((n) => n.id === targetId);
    if (!sourceNode || !targetNode) return { matchCount: 0, maxTags: 1 };

    const matchingTags = sourceNode.tags.filter((tag) => targetNode.tags.includes(tag));
    return {
      matchCount: matchingTags.length,
      maxTags: Math.min(sourceNode.tags.length, targetNode.tags.length),
    };
  }, [allEvidenceNodes]);

  // Handle node mouse enter during connection to show tag match
  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    if (connectingSourceId && node.id !== connectingSourceId) {
      const { matchCount, maxTags } = calculateTagMatch(connectingSourceId, node.id);
      setTagMatchInfo({
        visible: true,
        matchCount,
        maxTags,
        position: { x: event.clientX + 20, y: event.clientY - 30 },
      });
    }
  }, [connectingSourceId, calculateTagMatch]);

  // Handle node mouse leave during connection
  const onNodeMouseLeave = useCallback(() => {
    if (connectingSourceId) {
      setTagMatchInfo((prev) => ({ ...prev, visible: false }));
    }
  }, [connectingSourceId]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="w-full h-screen h-[100dvh] cork-texture relative overflow-hidden">
      {/* HUD - Left side */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50 flex flex-col gap-2 sm:gap-3">
        <CaseHeader
          title={caseData.title}
          description={caseData.description}
          difficulty={caseData.difficulty}
          onBack={onBackToMenu}
        />
      </div>

      {/* HUD - Right side (stacked vertically on mobile) */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 flex flex-col gap-2 sm:gap-3 max-w-[140px] sm:max-w-none">
        <SanityMeter sanity={gameState.sanity} />
        <ConnectionCounter
          current={gameState.validConnections}
          max={criticalNodeIds.length}
        />
        
        {/* UV Light Toggle */}
        <UVLightToggle isEnabled={isUVEnabled} onToggle={handleUVToggle} />
        
        {/* Mobile Mode Toggle - Hidden on desktop (Pro Controls use pin for linking, paper for dragging) */}
        {!isDesktop && (
          <div className="bg-secondary/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border">
            <span className="text-[8px] sm:text-[10px] font-typewriter text-muted-foreground uppercase tracking-wider block mb-1 sm:mb-2">
              Mode
            </span>
            <div className="flex gap-1">
              <Button
                variant={interactionMode === 'pan' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInteractionMode('pan')}
                className="flex-1 gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 h-auto"
              >
                <Hand className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Move</span>
              </Button>
              <Button
                variant={interactionMode === 'connect' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInteractionMode('connect')}
                className="flex-1 gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 h-auto"
              >
                <Cable className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Link</span>
              </Button>
            </div>
          </div>
        )}

        {/* Undo Button */}
        <div className="bg-secondary/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border">
          <span className="text-[8px] sm:text-[10px] font-typewriter text-muted-foreground uppercase tracking-wider block mb-1 sm:mb-2">
            Undo
          </span>
          <Button
            variant={gameState.undoAvailable && undoState ? 'default' : 'outline'}
            size="sm"
            onClick={performUndo}
            disabled={!gameState.undoAvailable || !undoState || gameState.sanity < 20}
            className="w-full gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 h-auto"
            title={!gameState.undoAvailable ? "Already used" : gameState.sanity < 20 ? "Need 20 sanity" : "Undo last action (-20 sanity)"}
          >
            <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">-20 HP</span>
            {!gameState.undoAvailable && <span className="text-[8px] opacity-50">(used)</span>}
          </Button>
        </div>

        {/* Combo indicator */}
        {gameState.consecutiveCorrect >= 2 && (
          <div className="bg-secondary/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-accent animate-pulse">
            <span className="text-[8px] sm:text-[10px] font-typewriter text-accent uppercase tracking-wider block">
              🔥 Combo x{gameState.consecutiveCorrect}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
              +{calculateComboBonus(gameState.consecutiveCorrect + 1)} next
            </span>
          </div>
        )}

        {/* Thread Type Toggle */}
        <div className="bg-secondary/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border">
          <span className="text-[8px] sm:text-[10px] font-typewriter text-muted-foreground uppercase tracking-wider block mb-1 sm:mb-2">
            Thread
          </span>
          <div className="flex gap-1">
            <Button
              variant={threadType === 'red' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setThreadType('red')}
              className={`flex-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 h-auto ${threadType === 'red' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            >
              🔴
            </Button>
            <Button
              variant={threadType === 'blue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setThreadType('blue')}
              className={`flex-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 h-auto ${threadType === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              🔵
            </Button>
          </div>
          <span className="text-[8px] text-muted-foreground block mt-1">
            {threadType === 'red' ? 'Relations' : 'Timeline'}
          </span>
        </div>
      </div>

      {/* Evidence Bin */}
      <EvidenceBin 
        ref={binRef}
        isHighlighted={binHighlighted} 
      />

      {/* Scribbles - with auto-removal */}
      {gameState.scribbles.map((scribble) => (
        <Scribble key={scribble.id} scribble={scribble} onRemove={removeScribble} />
      ))}

      {/* Floating Score Text */}
      <FloatingScoreText scores={floatingScores} />

      {/* Tag Match Indicator during connection */}
      <TagMatchIndicator
        matchCount={tagMatchInfo.matchCount}
        maxTags={tagMatchInfo.maxTags}
        isVisible={tagMatchInfo.visible}
        position={tagMatchInfo.position}
      />

      {/* React Flow Board */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.2, maxZoom: 2 }}
        className={`!bg-transparent ${isSpacebarHeld ? 'cursor-grab' : ''}`}
        // Zoom limits for better overview and detail inspection
        minZoom={0.2}
        maxZoom={2}
        // Connection line style
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Straight}
        // Larger snap radius for better mobile touch UX (default is 20)
        connectionRadius={50}
        // Desktop: scroll to zoom, spacebar+click or middle mouse to pan
        // Mobile: pinch to zoom, scroll to pan
        panOnScroll={!isDesktop}
        // Desktop: pan with middle mouse (1) or spacebar+left click (0 when spacebar held)
        // Mobile: pan mode allows left drag, connect mode only middle/right
        panOnDrag={isDesktop
          ? (isSpacebarHeld ? [0, 1, 2] : [1, 2])  // Middle mouse or spacebar+click
          : (interactionMode === 'pan' ? [0, 1, 2] : [1, 2])
        }
        // CRITICAL: Always allow connecting via handle drag
        connectOnClick={true}
        zoomOnPinch={true}
        // Desktop: scroll wheel zooms. Mobile: scroll pans
        zoomOnScroll={isDesktop}
        selectNodesOnDrag={false}
        elementsSelectable={false}
        // Desktop: always draggable. Mobile: only in pan mode
        nodesDraggable={isDesktop ? true : interactionMode === 'pan'}
        // Ensure edges are not updatable to prevent conflicts
        edgesFocusable={false}
        edgesReconnectable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(30, 20%, 25%)"
        />
        <Controls 
          className="!bg-secondary !border-border !rounded-lg overflow-hidden [&>button]:!bg-secondary [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted !bottom-20 sm:!bottom-4"
          showInteractive={false}
        />
      </ReactFlow>

      {/* UV Light Overlay */}
      <UVOverlay isEnabled={isUVEnabled} />

      {/* Madness Effects */}
      <MadnessOverlay sanity={gameState.sanity} />

      {/* Paranoia Events */}
      <ParanoiaEvents
        sanity={gameState.sanity}
        isGameActive={!gameState.isGameOver && !gameState.isVictory}
        onSanityChange={(delta) => setGameState((prev) => ({
          ...prev,
          sanity: Math.max(0, Math.min(100, prev.sanity + delta)),
          isGameOver: prev.sanity + delta <= 0,
        }))}
        playSFX={playSFX}
      />
    </div>
  );
};
