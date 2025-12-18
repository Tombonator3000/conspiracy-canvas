import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
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
import { UndoButton } from "./UndoButton";
import { UVLightToggle, UVOverlay } from "./UVLight";
import { MadnessOverlay } from "./MadnessOverlay";
import { ParanoiaEvents } from "./ParanoiaEvents";
import { Scribble } from "./Scribble";
import { ParticleBurst } from "./ParticleBurst";
import { AnalogFilters } from "./AnalogFilters";
import { FlashlightOverlay } from "./FlashlightOverlay";
// FBIOverlay removed - game over is handled by Index.tsx's GameOverScreen
import { useGameStore } from "@/store/gameStore";
import { useAudioContext } from "@/contexts/AudioContext";
import { useSettings } from "@/contexts/SettingsContext";

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
    bursts,
    setNodes,
    setEdges,
    setRequiredTags,
    setThreadColor,
    removeScribble,
    removeBurst,
    onNodesChange,
    onConnect,
    onNodeDragStop,
    checkCombine,
    trashNode,
    startTrashAnimation,
    modifySanity,
    toggleUV,
    triggerParanoiaMovement,
    revealNode,
  } = useGameStore();

  // React Flow instance for camera control and coordinate conversion
  const { fitView, flowToScreenPosition } = useReactFlow();

  // Audio context for sound effects
  const { playSFX, startAmbient, stopAmbient, updateSanity } = useAudioContext();

  // Settings for effects
  const { settings } = useSettings();

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
  const gameEndTriggeredRef = useRef(false);

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

  // DYNAMIC CAMERA ON WIN - Smooth zoom out to see the whole conspiracy
  useEffect(() => {
    if (isVictory) {
      fitView({ padding: 0.2, duration: 1500 });
    }
  }, [isVictory, fitView]);

  // PARANOIA MOVEMENT LOOP - Random node jittering at low sanity
  useEffect(() => {
    if (sanity < 40 && !isVictory && !isGameOver) {
      const interval = setInterval(() => {
        // 30% chance to move a node every second
        if (Math.random() > 0.7) {
          triggerParanoiaMovement();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sanity, isVictory, isGameOver, triggerParanoiaMovement]);

  // UV REVEAL LOGIC - Auto-reveal encrypted nodes when UV is enabled
  useEffect(() => {
    if (isUVEnabled) {
      nodes.forEach(n => {
        if ((n.data as any).requiresUV && !(n.data as any).isRevealed) {
          revealNode(n.id);
        }
      });
    }
  }, [isUVEnabled, nodes, revealNode]);

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
      case 'COMBINE_FAIL':
        playSFX('connect_fail');
        break;
      case 'UNDO_TRASH':
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

  // Handle victory/game over condition - FIXED: prevent double-triggering
  useEffect(() => {
    // Only trigger once per game session
    if ((isVictory || isGameOver) && !gameEndTriggeredRef.current) {
      gameEndTriggeredRef.current = true;

      // Count remaining junk/red herrings that weren't binned
      const remainingJunk = nodes.filter(n => {
        const truthTags = (n.data as { truthTags?: string[] }).truthTags || [];
        return truthTags.length === 0; // No tags = junk
      }).length;

      // Capture current values to avoid stale closures
      const finalSanity = sanity;
      const finalScore = score;
      const finalJunkBinned = junkBinned;
      const victory = isVictory;

      // Trigger game end immediately
      console.log(victory ? "🎉 Victory detected!" : "💀 Game Over!", "Score:", finalScore);
      onGameEnd(victory, finalSanity, finalScore, {
        credibility: victory ? 100 : 0,
        cleanupBonus: finalJunkBinned * 100,
        trashedJunkCount: finalJunkBinned,
        junkRemaining: remainingJunk
      });
    }
  }, [isVictory, isGameOver, sanity, score, junkBinned, nodes, onGameEnd]);

  // Reset the trigger ref when starting a new game
  useEffect(() => {
    if (!isVictory && !isGameOver) {
      gameEndTriggeredRef.current = false;
    }
  }, [isVictory, isGameOver]);

  // Helper: Check if node is over the bin
  const isNodeOverBin = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    let clientX: number, clientY: number;

    // For touch events, check changedTouches first (for touchend events)
    // then touches (for touchmove events)
    if ('changedTouches' in event && event.changedTouches.length > 0) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      // Fallback: check if bin is highlighted (user was dragging over it)
      return isBinHighlighted;
    }

    // FIXED: Use a generous 150px zone from the bottom-right corner
    // This is more reliable than getBoundingClientRect on mobile
    const isInCornerZone =
      clientX > window.innerWidth - 150 &&
      clientY > window.innerHeight - 150;

    // Also check the actual bin bounds if available (for precision)
    if (binRef.current) {
      const binRect = binRef.current.getBoundingClientRect();
      const isOverBinElement = (
        clientX >= binRect.left &&
        clientX <= binRect.right &&
        clientY >= binRect.top &&
        clientY <= binRect.bottom
      );
      // Return true if over the bin element OR in the generous corner zone
      return isOverBinElement || isInCornerZone;
    }

    return isInCornerZone;
  }, [isBinHighlighted]);

  // Handle node drag - check if hovering over bin
  const handleNodeDrag = useCallback((event: React.MouseEvent | React.TouchEvent, node: { id: string }) => {
    draggedNodeRef.current = node.id;
    const overBin = isNodeOverBin(event);
    setIsBinHighlighted(overBin);
  }, [isNodeOverBin]);

  // Handle node drag stop - update store and check for combinations
  const handleNodeDragStop = useCallback((event: React.MouseEvent | React.TouchEvent, node: { id: string; position: { x: number; y: number } }) => {
    // Check if dropped on bin - use both event position AND highlighted state
    const wasOverBin = isBinHighlighted || isNodeOverBin(event);

    if (wasOverBin) {
      const droppedNode = nodes.find(n => n.id === node.id);
      if (droppedNode) {
        // Check if it's junk (no truthTags or empty truthTags means it's junk/red herring)
        const truthTags = (droppedNode.data as { truthTags?: string[] }).truthTags || [];
        const isJunk = truthTags.length === 0;
        // Start trash animation - node will be removed after animation completes
        startTrashAnimation(node.id, isJunk);
        console.log(`🗑️ Dropped ${node.id} to bin - isJunk: ${isJunk}, wasHighlighted: ${isBinHighlighted}`);
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
  }, [isBinHighlighted, isNodeOverBin, nodes, startTrashAnimation, onNodeDragStop, findOverlappingNode, caseData.combinations, checkCombine]);

  // GLITCH TEXT & NODE TRANSFORMATION
  // Map nodes with shake, UV state, and hallucination effects for visual feedback
  const visibleNodes = useMemo(() => nodes.map(node => {
    const nodeData = { ...node.data } as any;

    // Add base states
    nodeData.isUVEnabled = isUVEnabled;
    nodeData.isShaking = shakingNodeIds.includes(node.id);

    // GLITCH TEXT: If sanity is VERY low (under 30), 10% chance to glitch text
    if (sanity < 30 && Math.random() < 0.1) {
      const glitchTexts = ["THEY KNOW", "RUN", "BEHIND YOU", "WATCHING", "TOO LATE"];
      nodeData.label = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
      nodeData.title = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
      nodeData.isGlitching = true;
    }

    return {
      ...node,
      data: nodeData
    };
  }), [nodes, isUVEnabled, shakingNodeIds, sanity]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  // Game over is now handled by Index.tsx's GameOverScreen
  // No early return here - let the board fade out naturally

  return (
    <div className={`w-full h-screen h-[100dvh] cork-texture relative overflow-hidden ${isVictory ? 'victory-glow' : ''}`}>
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

      {/* Undo Button */}
      <UndoButton />

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
      <div className="absolute inset-0 pointer-events-none z-[55] overflow-hidden">
        {scribbles.map((scribble) => (
          <Scribble
            key={scribble.id}
            scribble={scribble}
            onRemove={() => removeScribble(scribble.id)}
          />
        ))}
      </div>

      {/* PARTICLE EFFECT LAYER - Merge burst effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
        {bursts.map((burst) => {
          // Convert flow coordinates to screen coordinates
          const screenPos = flowToScreenPosition({ x: burst.x, y: burst.y });
          return (
            <ParticleBurst
              key={burst.id}
              id={burst.id}
              x={screenPos.x}
              y={screenPos.y}
              onComplete={removeBurst}
            />
          );
        })}
      </div>

      {/* UV Light Overlay (visual only) */}
      <UVOverlay isEnabled={false} />

      {/* 90s Analog Aesthetic Filters - Film grain, vignette, dust */}
      <AnalogFilters
        sanity={sanity}
        enableFilmGrain={settings.filmGrain}
        enableVignette={settings.vignette}
        enableDust={settings.filmGrain}
        enableScanlines={settings.crtScanlines}
        intensity={settings.effectsIntensity}
      />

      {/* Flashlight/Spotlight Effect - follows mouse cursor */}
      <FlashlightOverlay
        enabled={settings.flashlightEnabled}
        intensity={settings.flashlightIntensity}
        spotlightSize={settings.flashlightSize}
        sanity={sanity}
      />

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
