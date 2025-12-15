import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { EvidenceNodeComponent } from "./EvidenceNode";
import { RedStringEdge } from "./RedStringEdge";
import { SanityMeter } from "./SanityMeter";
import { ConnectionCounter } from "./ConnectionCounter";
import { Scribble } from "./Scribble";
import { GameOverlay } from "./GameOverlay";
import { MadnessOverlay } from "./MadnessOverlay";
import { CaseHeader } from "./CaseHeader";

import { case001 } from "@/data/case_001";
import type { GameState, Scribble as ScribbleType, ConnectionResult } from "@/types/game";

const nodeTypes = {
  evidence: EvidenceNodeComponent,
};

const edgeTypes = {
  redString: RedStringEdge,
};

// Convert case data to React Flow nodes
const createInitialNodes = (): Node[] => {
  return case001.nodes.map((node) => ({
    id: node.id,
    type: "evidence",
    position: node.position,
    data: { ...node },
    draggable: true,
  }));
};

// Validate connection based on shared tags
const validateConnection = (sourceId: string, targetId: string): ConnectionResult => {
  const sourceNode = case001.nodes.find((n) => n.id === sourceId);
  const targetNode = case001.nodes.find((n) => n.id === targetId);

  if (!sourceNode || !targetNode) {
    return { isValid: false };
  }

  // Find matching tags
  const matchingTag = sourceNode.tags.find((tag) => targetNode.tags.includes(tag));

  if (matchingTag) {
    // Get a random scribble
    const scribbleText = case001.scribblePool[
      Math.floor(Math.random() * case001.scribblePool.length)
    ];
    return { isValid: true, matchingTag, scribbleText };
  }

  return { isValid: false };
};

export const ConspiracyBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [gameState, setGameState] = useState<GameState>({
    sanity: case001.boardState.sanity,
    chaosLevel: case001.boardState.chaosLevel,
    validConnections: 0,
    maxConnections: case001.boardState.maxConnectionsNeeded,
    scribbles: [],
    isGameOver: false,
    isVictory: false,
  });

  // Add scribble at random position near connection
  const addScribble = useCallback((text: string, x: number, y: number) => {
    const newScribble: ScribbleType = {
      id: `scribble-${Date.now()}`,
      text,
      x: x + Math.random() * 100 - 50,
      y: y + Math.random() * 60 - 30,
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
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, isShaking: true },
          };
        }
        return node;
      })
    );

    // Reset shake after animation
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, isShaking: false },
            };
          }
          return node;
        })
      );
    }, 500);
  }, [setNodes]);

  // Handle new connections
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

      const result = validateConnection(connection.source, connection.target);

      if (result.isValid) {
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
        // Invalid connection - shake nodes and reduce sanity
        shakeNode(connection.source);
        shakeNode(connection.target);

        // Add failure scribble
        const sourceNode = nodes.find((n) => n.id === connection.source);
        if (sourceNode) {
          addScribble("NO! WRONG!", sourceNode.position.x, sourceNode.position.y);
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
    [edges, nodes, gameState.isGameOver, gameState.isVictory, setEdges, shakeNode, addScribble]
  );

  // Restart game
  const handleRestart = useCallback(() => {
    setNodes(createInitialNodes());
    setEdges([]);
    setGameState({
      sanity: case001.boardState.sanity,
      chaosLevel: case001.boardState.chaosLevel,
      validConnections: 0,
      maxConnections: case001.boardState.maxConnectionsNeeded,
      scribbles: [],
      isGameOver: false,
      isVictory: false,
    });
  }, [setNodes, setEdges]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="w-full h-screen cork-texture relative overflow-hidden">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-3">
        <CaseHeader
          title={case001.title}
          description={case001.description}
          difficulty={case001.difficulty}
        />
      </div>

      <div className="absolute top-4 right-4 z-50 flex flex-col gap-3">
        <SanityMeter sanity={gameState.sanity} />
        <ConnectionCounter
          current={gameState.validConnections}
          max={gameState.maxConnections}
        />
      </div>

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
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="!bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(30, 20%, 25%)"
        />
        <Controls 
          className="!bg-secondary !border-border !rounded-lg overflow-hidden [&>button]:!bg-secondary [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted"
        />
      </ReactFlow>

      {/* Madness Effects */}
      <MadnessOverlay sanity={gameState.sanity} />

      {/* Game Over / Victory Overlay */}
      <GameOverlay
        isGameOver={gameState.isGameOver}
        isVictory={gameState.isVictory}
        onRestart={handleRestart}
        theTruth={case001.theTruth}
      />
    </div>
  );
};
