import { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { EvidenceNodeComponent } from "./EvidenceNode";
import { RedStringEdge, BlueStringEdge } from "./StringEdge";
import { SanityMeter } from "./SanityMeter";
import { CaseHeader } from "./CaseHeader";
import { EvidenceBin } from "./EvidenceBin";
import { UVLightToggle, UVOverlay } from "./UVLight";
import { MadnessOverlay } from "./MadnessOverlay";
import { useGameStore } from "@/store/gameStore";

import type { CaseData, CredibilityStats } from "@/types/game";

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

// Convert case data to React Flow nodes
const createInitialNodes = (caseData: CaseData) => {
  return caseData.nodes.map((node, index) => {
    const rotation = Math.random() * 30 - 15;
    const zIndex = Math.floor(Math.random() * 100);

    return {
      id: node.id,
      type: "evidence",
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

// Connection line style
const connectionLineStyle = {
  stroke: 'hsl(350, 80%, 50%)',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
};

export const ConspiracyBoard = ({ caseData, onBackToMenu, onGameEnd }: ConspiracyBoardProps) => {
  // Zustand store - THE SINGLE SOURCE OF TRUTH
  const {
    nodes,
    edges,
    sanity,
    setNodes,
    setEdges,
    onConnect,
    onNodeDragStop,
  } = useGameStore();

  // Initialize store with case data on mount
  useEffect(() => {
    const initialNodes = createInitialNodes(caseData);
    setNodes(initialNodes);
    setEdges([]);
  }, [caseData, setNodes, setEdges]);

  // Handle node drag stop - update store
  const handleNodeDragStop = useCallback((_event: React.MouseEvent | React.TouchEvent, node: { id: string; position: { x: number; y: number } }) => {
    onNodeDragStop(node.id, node.position);
  }, [onNodeDragStop]);

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

      {/* HUD - Right side */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 flex flex-col gap-2 sm:gap-3 max-w-[140px] sm:max-w-none">
        <SanityMeter sanity={sanity} />
      </div>

      {/* Evidence Bin (visual only for now) */}
      <EvidenceBin isHighlighted={false} />

      {/* React Flow Board - THE DUMB RENDERER */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.2, maxZoom: 2 }}
        className="!bg-transparent"
        minZoom={0.2}
        maxZoom={2}
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Straight}
        connectionRadius={50}
        panOnDrag={[1, 2]}
        connectOnClick={true}
        zoomOnPinch={true}
        zoomOnScroll={true}
        selectNodesOnDrag={false}
        elementsSelectable={false}
        nodesDraggable={true}
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

      {/* UV Light Overlay (visual only) */}
      <UVOverlay isEnabled={false} />

      {/* Madness Effects */}
      <MadnessOverlay sanity={sanity} />
    </div>
  );
};
