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
import { Hand, Cable } from "lucide-react";
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
import { useAudioContext } from "@/contexts/AudioContext";

import type { CaseData, GameState, Scribble as ScribbleType, ConnectionResult } from "@/types/game";

const nodeTypes = {
  evidence: EvidenceNodeComponent,
};

const edgeTypes = {
  redString: RedStringEdge,
};

interface ConspiracyBoardProps {
  caseData: CaseData;
  onBackToMenu: () => void;
  onGameEnd: (isVictory: boolean, sanityRemaining: number, connectionsFound: number) => void;
}

// Convert case data to React Flow nodes with random rotation and z-index for chaos
const createInitialNodes = (caseData: CaseData, isDraggable: boolean, isUVEnabled: boolean): Node[] => {
  return caseData.nodes.map((node, index) => {
    // Random rotation between -15 and 15 degrees for that messy board feel
    const rotation = Math.random() * 30 - 15;
    // Random z-index so nodes overlap realistically
    const zIndex = Math.floor(Math.random() * 100);
    
    return {
      id: node.id,
      type: "evidence",
      position: node.position,
      data: { ...node, isUVEnabled, rotation },
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

// Trash scribbles for critical evidence
const trashScribbles = [
  "YOU THREW AWAY THE TRUTH!",
  "THAT WAS IMPORTANT!",
  "NO! NOT THAT ONE!",
  "THE ANSWER WAS THERE!",
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

export const ConspiracyBoard = ({ caseData, onBackToMenu, onGameEnd }: ConspiracyBoardProps) => {
  // Mobile mode: 'pan' allows moving around, 'connect' locks nodes for easier connecting
  const [interactionMode, setInteractionMode] = useState<'pan' | 'connect'>('pan');
  const [isUVEnabled, setIsUVEnabled] = useState(false);
  const [binHighlighted, setBinHighlighted] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  // Ref for the evidence bin for collision detection
  const binRef = useRef<HTMLDivElement>(null);
  
  const { playSFX, updateSanity } = useAudioContext();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes(caseData, interactionMode === 'pan', isUVEnabled));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [gameState, setGameState] = useState<GameState>({
    sanity: caseData.boardState.sanity,
    chaosLevel: caseData.boardState.chaosLevel,
    validConnections: 0,
    maxConnections: caseData.boardState.maxConnectionsNeeded,
    scribbles: [],
    isGameOver: false,
    isVictory: false,
  });

  // Update audio stress layer when sanity changes
  useEffect(() => {
    updateSanity(gameState.sanity);
  }, [gameState.sanity, updateSanity]);

  // Update node draggability when mode changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        draggable: interactionMode === 'pan',
        data: { ...node.data, isUVEnabled },
      }))
    );
  }, [interactionMode, isUVEnabled, setNodes]);

  // Handle game end
  useEffect(() => {
    if (gameState.isVictory || gameState.isGameOver) {
      // Small delay for the user to see the final state
      const timer = setTimeout(() => {
        onGameEnd(gameState.isVictory, gameState.sanity, gameState.validConnections);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.isVictory, gameState.isGameOver, gameState.sanity, gameState.validConnections, onGameEnd]);

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

  // Handle node drop to bin
  const handleNodeDropToBin = useCallback((nodeId: string) => {
    const nodeData = caseData.nodes.find((n) => n.id === nodeId);
    
    playSFX("paper_crumple");
    
    // Remove node from board
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    
    // Remove any edges connected to this node
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    
    // Check if it was critical evidence
    if (nodeData?.isCritical) {
      const randomScribble = trashScribbles[Math.floor(Math.random() * trashScribbles.length)];
      addScribble(randomScribble, 400, 300);
      
      setGameState((prev) => {
        const newSanity = Math.max(0, prev.sanity - 20);
        return {
          ...prev,
          sanity: newSanity,
          chaosLevel: prev.chaosLevel + 1,
          isGameOver: newSanity <= 0,
        };
      });
    }
  }, [caseData.nodes, setNodes, setEdges, addScribble, playSFX]);

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

        setEdges((eds) => addEdge(newEdge, eds));

        // Get position for scribble (midpoint)
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);
        if (sourceNode && targetNode && result.scribbleText) {
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2;
          addScribble(result.scribbleText, midX, midY);
        }

        // Update game state
        setGameState((prev) => {
          const newValidConnections = prev.validConnections + 1;
          const isVictory = newValidConnections >= prev.maxConnections;
          return {
            ...prev,
            validConnections: newValidConnections,
            isVictory,
          };
        });
      } else {
        playSFX("connect_fail");
        
        // Invalid connection - shake nodes and reduce sanity
        shakeNode(connection.source);
        shakeNode(connection.target);

        // Add failure scribble
        const sourceNode = nodes.find((n) => n.id === connection.source);
        if (sourceNode) {
          const failureText = failureScribbles[Math.floor(Math.random() * failureScribbles.length)];
          addScribble(failureText, sourceNode.position.x, sourceNode.position.y);
        }

        setGameState((prev) => {
          const newSanity = Math.max(0, prev.sanity - 15);
          const isGameOver = newSanity <= 0;
          return {
            ...prev,
            sanity: newSanity,
            chaosLevel: prev.chaosLevel + 1,
            isGameOver,
          };
        });
      }
    },
    [edges, nodes, caseData, gameState.isGameOver, gameState.isVictory, setEdges, shakeNode, addScribble, playSFX]
  );

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
          max={gameState.maxConnections}
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

      {/* React Flow Board */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
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
        panOnDrag={interactionMode === 'pan'}
        zoomOnPinch={true}
        zoomOnScroll={true}
        selectNodesOnDrag={false}
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
