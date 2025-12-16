import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
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
import { RedStringEdge } from "./RedStringEdge";
import { SanityMeter } from "./SanityMeter";
import { ConnectionCounter } from "./ConnectionCounter";
import { Scribble } from "./Scribble";
import { MadnessOverlay } from "./MadnessOverlay";
import { CaseHeader } from "./CaseHeader";
import { EvidenceBin } from "./EvidenceBin";
import { UVLightToggle, UVOverlay } from "./UVLight";
import { FloatingScoreText } from "./FloatingScoreText";
import { useAudioContext } from "@/contexts/AudioContext";

import type { CaseData, GameState, Scribble as ScribbleType, ConnectionResult, FloatingScore, CredibilityStats, UndoState, HintReveal } from "@/types/game";
import { TagMatchIndicator } from "./TagMatchIndicator";

const nodeTypes = {
  evidence: EvidenceNodeComponent,
};

const edgeTypes = {
  redString: RedStringEdge,
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
const createInitialNodes = (caseData: CaseData, isDraggable: boolean, isUVEnabled: boolean, isLinkMode: boolean): Node[] => {
  return caseData.nodes.map((node, index) => {
    // Random rotation between -15 and 15 degrees for that messy board feel
    const rotation = Math.random() * 30 - 15;
    // Random z-index so nodes overlap realistically
    const zIndex = Math.floor(Math.random() * 100);

    return {
      id: node.id,
      type: "evidence",
      position: node.position,
      data: { ...node, isUVEnabled, rotation, isLinkMode },
      draggable: isDraggable,
      zIndex,
    };
  });
};

// Connection line style - red string while dragging
const connectionLineStyle = {
  stroke: 'hsl(350, 80%, 50%)',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
};

// Validate connection based on shared tags
const validateConnection = (caseData: CaseData, sourceId: string, targetId: string): ConnectionResult => {
  const sourceNode = caseData.nodes.find((n) => n.id === sourceId);
  const targetNode = caseData.nodes.find((n) => n.id === targetId);

  if (!sourceNode || !targetNode) {
    return { isValid: false };
  }

  // Find matching tags
  const matchingTag = sourceNode.tags.find((tag) => targetNode.tags.includes(tag));

  if (matchingTag) {
    // Get a random scribble
    const scribbleText = caseData.scribblePool[
      Math.floor(Math.random() * caseData.scribblePool.length)
    ];
    return { isValid: true, matchingTag, scribbleText };
  }

  return { isValid: false };
};

// Calculate progressive penalty for evidence mistakes (100→200→300→400→500 max)
const calculateEvidencePenalty = (mistakeCount: number): number => {
  const basePenalty = 100;
  const multiplier = Math.min(mistakeCount + 1, 5);  // Max 5x
  return basePenalty * multiplier;
};

// Calculate combo bonus for consecutive correct connections
const calculateComboBonus = (consecutiveCorrect: number): number => {
  if (consecutiveCorrect >= 5) return 100;
  if (consecutiveCorrect >= 3) return 50;
  if (consecutiveCorrect >= 2) return 25;
  return 0;
};

// Hint scribbles for revealing tags
const hintScribbles = [
  "I SEE A PATTERN...",
  "WAIT... THIS TAG...",
  "SOMETHING CONNECTS...",
  "THE TRUTH REVEALS ITSELF!",
  "A CLUE EMERGES!",
];

// Failure messages for wrong connections
const failureScribbles = [
  "NO! WRONG!",
  "FOCUS!",
  "THAT'S NOT IT!",
  "THINK HARDER!",
  "TOO OBVIOUS!",
  "RED HERRING!",
  "WAKE UP!",
];

// Trash scribbles for critical evidence (failure)
const trashScribbles = [
  "YOU THREW AWAY THE TRUTH!",
  "THAT WAS IMPORTANT!",
  "NO! NOT THAT ONE!",
  "THE ANSWER WAS THERE!",
];

// Success scribbles for trashing junk
const junkTrashScribbles = [
  "GOOD! THAT WAS GARBAGE!",
  "JUNK CLEARED!",
  "RED HERRING GONE!",
  "DECLUTTERING THE TRUTH!",
  "NOISE REMOVED!",
  "DISTRACTION DELETED!",
];

// Collision detection helper
const isColliding = (nodeRect: DOMRect, binRect: DOMRect): boolean => {
  return !(
    nodeRect.right < binRect.left ||
    nodeRect.left > binRect.right ||
    nodeRect.bottom < binRect.top ||
    nodeRect.top > binRect.bottom
  );
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

// Check if all critical nodes form a single cluster
const checkAllCriticalConnected = (edges: Edge[], criticalNodeIds: string[]): boolean => {
  const connectedCritical = getConnectedCriticalNodes(edges, criticalNodeIds);
  return criticalNodeIds.every((id) => connectedCritical.has(id));
};

export const ConspiracyBoard = ({ caseData, onBackToMenu, onGameEnd }: ConspiracyBoardProps) => {
  // Get all critical node IDs for cluster detection
  const criticalNodeIds = useMemo(
    () => caseData.nodes.filter((n) => n.isCritical).map((n) => n.id),
    [caseData.nodes]
  );

  // Mobile mode: 'pan' allows moving around, 'connect' locks nodes for easier connecting
  const [interactionMode, setInteractionMode] = useState<'pan' | 'connect'>('pan');
  const [isUVEnabled, setIsUVEnabled] = useState(false);
  const [binHighlighted, setBinHighlighted] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Ref for the evidence bin for collision detection
  const binRef = useRef<HTMLDivElement>(null);
  
  const { playSFX, updateSanity } = useAudioContext();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes(caseData, interactionMode === 'pan', isUVEnabled, interactionMode === 'connect'));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [gameState, setGameState] = useState<GameState>({
    sanity: caseData.boardState.sanity,
    chaosLevel: caseData.boardState.chaosLevel,
    validConnections: 0,
    maxConnections: caseData.boardState.maxConnectionsNeeded,
    scribbles: [],
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

  // Update node draggability, link mode, and revealed hints when mode changes
  useEffect(() => {
    const isLinkMode = interactionMode === 'connect';
    setNodes((nds) =>
      nds.map((node) => {
        const nodeHints = revealedHints.get(node.id) || [];
        const nodeData = caseData.nodes.find((n) => n.id === node.id);
        const revealedTags = nodeHints.map((idx) => nodeData?.tags[idx]).filter(Boolean) as string[];
        return {
          ...node,
          draggable: interactionMode === 'pan',
          data: { ...node.data, isUVEnabled, isLinkMode, revealedTags },
        };
      })
    );
  }, [interactionMode, isUVEnabled, setNodes, revealedHints, caseData.nodes]);

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
  }, [gameState.isVictory, gameState.isGameOver, gameState.sanity, gameState.validConnections, gameState.credibility, gameState.cleanupBonus, gameState.trashedJunkCount, getRemainingJunkCount, onGameEnd]);

  // Add scribble at position
  const addScribble = useCallback((text: string, x: number, y: number) => {
    const newScribble: ScribbleType = {
      id: `scribble-${Date.now()}`,
      text,
      x,
      y,
      rotation: Math.random() * 20 - 10,
    };
    setGameState((prev) => ({
      ...prev,
      scribbles: [...prev.scribbles, newScribble],
    }));
  }, []);

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
    if (!undoState || !gameState.undoAvailable || gameState.sanity < 30) return;

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
    setGameState((prev) => ({
      ...prev,
      ...undoState.gameState,
      scribbles: prev.scribbles,
      sanity: Math.max(0, prev.sanity - 30),
      undoAvailable: false,
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
      const randomScribble = junkTrashScribbles[Math.floor(Math.random() * junkTrashScribbles.length)];
      addScribble(randomScribble, 400, 300);

      // Reveal a hint as bonus for correct trash
      const hint = revealRandomHint();
      if (hint) {
        setTimeout(() => {
          const hintScribble = hintScribbles[Math.floor(Math.random() * hintScribbles.length)];
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
      const randomScribble = trashScribbles[Math.floor(Math.random() * trashScribbles.length)];
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

  // Track node dragging for bin highlight using getBoundingClientRect
  const handleNodeDrag = useCallback((event: React.MouseEvent | React.TouchEvent, node: Node) => {
    setDraggedNodeId(node.id);

    if (!binRef.current) return;

    // Get the bin's bounding rectangle
    const binRect = binRef.current.getBoundingClientRect();

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

    const colliding = isColliding(cursorRect, binRect);
    setBinHighlighted(colliding);
  }, []);

  const handleNodeDragStop = useCallback((event: React.MouseEvent | React.TouchEvent, node: Node) => {
    if (binHighlighted && draggedNodeId) {
      handleNodeDropToBin(draggedNodeId);
    }
    setBinHighlighted(false);
    setDraggedNodeId(null);
  }, [binHighlighted, draggedNodeId, handleNodeDropToBin]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (gameState.isGameOver || gameState.isVictory) return;
      if (!connection.source || !connection.target) return;

      // Check if this connection already exists
      const existingEdge = edges.find(
        (e) =>
          (e.source === connection.source && e.target === connection.target) ||
          (e.source === connection.target && e.target === connection.source)
      );
      if (existingEdge) return;

      const result = validateConnection(caseData, connection.source, connection.target);

      if (result.isValid) {
        playSFX("connect_success");

        // Valid connection - add red string
        const newEdge: Edge = {
          ...connection,
          id: `edge-${connection.source}-${connection.target}`,
          type: "redString",
          data: { isValid: true },
          source: connection.source,
          target: connection.target,
        };

        // Calculate new edges array to check cluster connectivity
        const updatedEdges = addEdge(newEdge, edges);
        setEdges(updatedEdges);

        // Get position for scribble (midpoint)
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);
        if (sourceNode && targetNode && result.scribbleText) {
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2;
          addScribble(result.scribbleText, midX, midY);
        }

        // Use cluster detection for win condition
        const connectedCritical = getConnectedCriticalNodes(updatedEdges, criticalNodeIds);
        const linkedEvidenceCount = connectedCritical.size;
        const isVictory = checkAllCriticalConnected(updatedEdges, criticalNodeIds);

        // Calculate combo bonus for consecutive correct connections
        const newConsecutiveCorrect = gameState.consecutiveCorrect + 1;
        const comboBonus = calculateComboBonus(newConsecutiveCorrect);

        // Show combo bonus if earned
        if (comboBonus > 0 && sourceNode && targetNode) {
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2 - 50;
          setTimeout(() => {
            addScribble(`🔥 COMBO x${newConsecutiveCorrect}! +${comboBonus} CRED`, midX, midY);
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
          const failureText = failureScribbles[Math.floor(Math.random() * failureScribbles.length)];
          const comboBreakText = gameState.consecutiveCorrect >= 2 ? "\n💔 COMBO BROKEN!" : "";
          addScribble(failureText + comboBreakText, sourceNode.position.x, sourceNode.position.y);
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
    [edges, nodes, caseData, gameState.isGameOver, gameState.isVictory, gameState.consecutiveCorrect, setEdges, shakeNode, addScribble, playSFX, criticalNodeIds, spawnFloatingScore, cursorPosition]
  );

  // Handle connection start - track source for tag visualization
  const onConnectStart = useCallback((event: React.MouseEvent | React.TouchEvent, { nodeId }: { nodeId: string | null }) => {
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
    const sourceNode = caseData.nodes.find((n) => n.id === sourceId);
    const targetNode = caseData.nodes.find((n) => n.id === targetId);
    if (!sourceNode || !targetNode) return { matchCount: 0, maxTags: 1 };

    const matchingTags = sourceNode.tags.filter((tag) => targetNode.tags.includes(tag));
    return {
      matchCount: matchingTags.length,
      maxTags: Math.min(sourceNode.tags.length, targetNode.tags.length),
    };
  }, [caseData.nodes]);

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
        
        {/* Mobile Mode Toggle */}
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

        {/* Undo Button */}
        <div className="bg-secondary/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border">
          <span className="text-[8px] sm:text-[10px] font-typewriter text-muted-foreground uppercase tracking-wider block mb-1 sm:mb-2">
            Undo
          </span>
          <Button
            variant={gameState.undoAvailable && undoState ? 'default' : 'outline'}
            size="sm"
            onClick={performUndo}
            disabled={!gameState.undoAvailable || !undoState || gameState.sanity < 30}
            className="w-full gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 h-auto"
            title={!gameState.undoAvailable ? "Already used" : gameState.sanity < 30 ? "Need 30 sanity" : "Undo last action (-30 sanity)"}
          >
            <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">-30 HP</span>
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
      </div>

      {/* Evidence Bin */}
      <EvidenceBin 
        ref={binRef}
        isHighlighted={binHighlighted} 
      />

      {/* Scribbles */}
      {gameState.scribbles.map((scribble) => (
        <Scribble key={scribble.id} scribble={scribble} />
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
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.1, maxZoom: 2 }}
        className="!bg-transparent"
        // Extended zoom limits
        minZoom={0.1}
        maxZoom={3}
        // Mobile touch optimizations
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Straight}
        panOnScroll={true}
        // In connect mode: disable pan on drag, enable click-to-connect
        panOnDrag={interactionMode === 'pan' ? true : false}
        // CRITICAL: connectOnClick lets users tap handle, then tap another - works great on mobile!
        connectOnClick={interactionMode === 'connect'}
        zoomOnPinch={true}
        zoomOnScroll={true}
        selectNodesOnDrag={false}
        // Disable node selection to prevent touch conflicts
        elementsSelectable={interactionMode === 'pan'}
        nodesDraggable={interactionMode === 'pan'}
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
    </div>
  );
};
