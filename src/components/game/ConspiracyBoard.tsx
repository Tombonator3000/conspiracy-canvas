import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
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
import { ParanoiaEvents } from "./ParanoiaEvents";
import { Scribble } from "./Scribble";
import { useGameStore } from "@/store/gameStore";
import { useAudioContext } from "@/contexts/AudioContext";

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

export const ConspiracyBoard = ({ caseData, onBackToMenu, onGameEnd }: ConspiracyBoardProps) => {
  // Zustand store - THE SINGLE SOURCE OF TRUTH
  const {
    nodes,
    edges,
    sanity,
    isVictory,
    isGameOver,
    score,
    junkBinned,
    mistakes,
    threadColor,
    lastAction,
    scribbles,
    isUVEnabled,
    shakingNodeIds,
    setNodes,
    setEdges,
    setRequiredTags,
    setThreadColor,
    removeScribble,
    onNodesChange,
    onConnect,
    onNodeDragStop,
    checkCombine,
    trashNode,
    modifySanity,
    toggleUV,
  } = useGameStore();

  // Audio context for sound effects
  const { playSFX, startAmbient, stopAmbient, updateSanity } = useAudioContext();

  // Dynamic connection line style based on thread color
  const connectionLineStyle = useMemo(() => ({
    stroke: threadColor === 'blue' ? '#3b82f6' : '#e11d48',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
  }), [threadColor]);

  // Bin state
  const [isBinHighlighted, setIsBinHighlighted] = useState(false);
  const binRef = useRef<HTMLDivElement>(null);
  const draggedNodeRef = useRef<string | null>(null);

  // Helper: Find overlapping node based on simple distance check
  const findOverlappingNode = useCallback((draggedNode: { id: string; position: { x: number; y: number } }) => {
    const OVERLAP_THRESHOLD = 100; // pixels - adjust for desired sensitivity

    for (const node of nodes) {
      if (node.id === draggedNode.id) continue;

      const dx = node.position.x - draggedNode.position.x;
      const dy = node.position.y - draggedNode.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < OVERLAP_THRESHOLD) {
        return node;
      }
    }
    return null;
  }, [nodes]);

  // Ensure required tags are synced with case data
  // Note: loadLevel is called by Index.tsx when selecting a case,
  // which initializes nodes, edges, and requiredTags
  useEffect(() => {
    // Only set required tags if they differ (for edge cases)
    if (caseData.requiredTags) {
      setRequiredTags(caseData.requiredTags);
    }
  }, [caseData, setRequiredTags]);

  // 1. AUDIO LAYER: React to Store Actions
  useEffect(() => {
    if (!lastAction) return;

    switch (lastAction.type) {
      case 'CONNECT_SUCCESS':
        playSFX('connect_success');
        break;
      case 'CONNECT_FAIL':
        playSFX('connect_fail');
        break;
      case 'TRASH_SUCCESS':
        playSFX('trash_junk_success');
        break;
      case 'TRASH_FAIL':
        playSFX('trash_evidence_fail');
        break;
      case 'COMBINE_SUCCESS':
        playSFX('connect_success');
        break;
      case 'VICTORY':
        playSFX('access_granted');
        break;
    }
  }, [lastAction, playSFX]);

  // 2. AMBIENCE & SANITY SYNC
  useEffect(() => {
    startAmbient();
    return () => stopAmbient();
  }, [startAmbient, stopAmbient]);

  useEffect(() => {
    updateSanity(sanity);
  }, [sanity, updateSanity]);

  // Handle victory/game over condition
  useEffect(() => {
    if (isVictory || isGameOver) {
      // Count remaining junk/red herrings that weren't binned
      const remainingJunk = nodes.filter(n => {
        const truthTags = (n.data as { truthTags?: string[] }).truthTags || [];
        return truthTags.length === 0; // No tags = junk
      }).length;

      // Delay slightly for final sound effect to play
      setTimeout(() => {
        console.log(isVictory ? "🎉 Victory detected!" : "💀 Game Over!", "Score:", score);
        onGameEnd(isVictory, sanity, score, {
          credibility: isVictory ? 100 : 0,
          cleanupBonus: junkBinned * 100,
          trashedJunkCount: junkBinned,
          junkRemaining: remainingJunk
        });
      }, 1500);
    }
  }, [isVictory, isGameOver, sanity, score, junkBinned, nodes, onGameEnd]);

  // Helper: Check if node is over the bin
  const isNodeOverBin = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!binRef.current) return false;

    const binRect = binRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return false;
    }

    return (
      clientX >= binRect.left &&
      clientX <= binRect.right &&
      clientY >= binRect.top &&
      clientY <= binRect.bottom
    );
  }, []);

  // Handle node drag - check if hovering over bin
  const handleNodeDrag = useCallback((event: React.MouseEvent | React.TouchEvent, node: { id: string }) => {
    draggedNodeRef.current = node.id;
    const overBin = isNodeOverBin(event);
    setIsBinHighlighted(overBin);
  }, [isNodeOverBin]);

  // Handle node drag stop - update store and check for combinations
  const handleNodeDragStop = useCallback((event: React.MouseEvent | React.TouchEvent, node: { id: string; position: { x: number; y: number } }) => {
    // Check if dropped on bin
    if (isNodeOverBin(event)) {
      const droppedNode = nodes.find(n => n.id === node.id);
      if (droppedNode) {
        // Check if it's junk (no truthTags or empty truthTags means it's junk/red herring)
        const truthTags = (droppedNode.data as { truthTags?: string[] }).truthTags || [];
        const isJunk = truthTags.length === 0;
        trashNode(node.id, isJunk);
        console.log(`🗑️ Dropped ${node.id} to bin - isJunk: ${isJunk}`);
      }
      setIsBinHighlighted(false);
      draggedNodeRef.current = null;
      return;
    }

    setIsBinHighlighted(false);
    draggedNodeRef.current = null;

    // Update position in store
    onNodeDragStop(node.id, node.position);

    // Check for collision with other nodes
    const overlappingNode = findOverlappingNode(node);
    if (overlappingNode && caseData.combinations) {
      // Pass the level's combinations to the store action
      checkCombine(node.id, overlappingNode.id, caseData.combinations);
    }
  }, [isNodeOverBin, nodes, trashNode, onNodeDragStop, findOverlappingNode, caseData.combinations, checkCombine]);

  // Map nodes with shake and UV state for visual effects
  const visibleNodes = useMemo(() => nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      isUVEnabled,
      isShaking: shakingNodeIds.includes(node.id)
    }
  })), [nodes, isUVEnabled, shakingNodeIds]);

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

      {/* Thread Mode Toggle */}
      <div className="absolute top-20 right-4 z-50 flex flex-col gap-2 bg-black/50 p-2 rounded border border-white/10">
        <span className="text-[10px] text-white font-mono uppercase">Thread Mode</span>
        <div className="flex gap-2">
          <button
            onClick={() => setThreadColor('red')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${threadColor === 'red' ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
            style={{ backgroundColor: '#e11d48' }}
            title="Red Thread"
          />
          <button
            onClick={() => setThreadColor('blue')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${threadColor === 'blue' ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
            style={{ backgroundColor: '#3b82f6' }}
            title="Blue Thread"
          />
        </div>
      </div>

      {/* UV Light Toggle */}
      <div className="absolute top-44 right-4 z-50">
        <UVLightToggle isEnabled={isUVEnabled} onToggle={toggleUV} />
      </div>

      {/* Evidence Bin */}
      <EvidenceBin ref={binRef} isHighlighted={isBinHighlighted} />

      {/* React Flow Board - THE DUMB RENDERER */}
      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodeDrag={handleNodeDrag}
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

      {/* SCRIBBLE LAYER - Floating handwritten feedback */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {scribbles.map((scribble) => (
          <Scribble
            key={scribble.id}
            scribble={scribble}
            onRemove={() => removeScribble(scribble.id)}
          />
        ))}
      </div>

      {/* UV Light Overlay (visual only) */}
      <UVOverlay isEnabled={false} />

      {/* Madness Effects */}
      <MadnessOverlay sanity={sanity} />

      {/* Paranoia Events (random whispers/visuals) */}
      <ParanoiaEvents
        sanity={sanity}
        isGameActive={!isVictory && !isGameOver}
        onSanityChange={modifySanity}
        playSFX={playSFX}
      />
    </div>
  );
};
