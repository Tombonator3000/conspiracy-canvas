import { memo, useState, useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import type { EvidenceNode as EvidenceNodeType, NodeScribble } from "@/types/game";
import { Camera, FileText, StickyNote, Eye, Zap, Bird, Cat, ShoppingBag, Cpu } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";

// Handwriting font variants for varied note styles
const HANDWRITING_FONTS = [
  "'Permanent Marker', cursive",
  "'Caveat', cursive",
  "'Nanum Pen Script', cursive",
  "'Rock Salt', cursive",
  "'Shadows Into Light', cursive",
];

// Get consistent font based on node ID
const getHandwritingFont = (id: string): string => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return HANDWRITING_FONTS[hash % HANDWRITING_FONTS.length];
};

// Determine if node should have a coffee stain
const hasCoffeeStain = (id: string): boolean => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 4 === 0; // 25% chance
};

// Determine if node should have tape instead of pushpin
const hasTape = (id: string): boolean => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 3 === 1; // ~33% chance
};

// Get random tape angle
const getTapeAngle = (id: string): number => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return -8 + (hash % 16); // -8 to +8 degrees
};

interface EvidenceNodeData extends EvidenceNodeType {
  isShaking?: boolean;
  isPulsing?: boolean;
  isUVEnabled?: boolean;
  rotation?: number;
  isLinkMode?: boolean;
  revealedTags?: string[];
  isDesktop?: boolean;
  nodeScribbles?: NodeScribble[];
  isSpawning?: boolean;
  isCombineTarget?: boolean;
  isTrashing?: boolean;          // Node is being trashed (shrink animation)
  // New combination features
  isNearbyCombinable?: boolean;  // Glow when near a valid combination partner
  isChainCombinable?: boolean;   // Purple glow for chain combination items
  combinationHint?: string;      // UV-light hint for combinations (e.g., "COMBINE WITH MANUAL")
}

interface EvidenceNodeProps {
  data: EvidenceNodeData;
}

// Realistic push pin component - now wrapped with Handle for connections
const PushPin = ({ color = "red", isDesktop = false }: { color?: "red" | "yellow" | "blue" | "green"; isDesktop?: boolean }) => {
  const colors = {
    red: { top: "#e53935", mid: "#c62828", bottom: "#b71c1c", shine: "#ff8a80" },
    yellow: { top: "#fdd835", mid: "#f9a825", bottom: "#f57f17", shine: "#fff59d" },
    blue: { top: "#1e88e5", mid: "#1565c0", bottom: "#0d47a1", shine: "#82b1ff" },
    green: { top: "#43a047", mid: "#2e7d32", bottom: "#1b5e20", shine: "#b9f6ca" },
  };
  const c = colors[color];
  
  return (
    <Handle
      type="source"
      position={Position.Top}
      id="pin-source"
      className="nodrag"
      style={{
        position: "absolute",
        top: "-12px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "28px",
        height: "36px",
        background: "transparent",
        border: "none",
        zIndex: 10,
        cursor: "crosshair",
      }}
    >
      <svg 
        className="push-pin pointer-events-none" 
        width="24" 
        height="32" 
        viewBox="0 0 24 32" 
        style={{ 
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.4))"
        }}
      >
        {/* Pin needle */}
        <path 
          d="M12 18 L12 30" 
          stroke="#666" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M12 28 L12 31" 
          stroke="#888" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        
        {/* Pin head - main dome */}
        <ellipse cx="12" cy="10" rx="10" ry="8" fill={c.mid} />
        
        {/* Pin head - top highlight */}
        <ellipse cx="12" cy="8" rx="9" ry="6" fill={c.top} />
        
        {/* Shine/reflection */}
        <ellipse cx="9" cy="6" rx="3" ry="2" fill={c.shine} opacity="0.6" />
        
        {/* Bottom shadow on dome */}
        <ellipse cx="12" cy="13" rx="8" ry="3" fill={c.bottom} opacity="0.5" />
      </svg>
    </Handle>
  );
};

const getNodeIcon = (tags: string[]) => {
  if (tags.includes("DRONE") || tags.includes("SURVEILLANCE")) return <Bird className="w-5 h-5" />;
  if (tags.includes("BATTERY") || tags.includes("ELECTRICITY")) return <Zap className="w-5 h-5" />;
  if (tags.includes("GOVERNMENT")) return <Cpu className="w-5 h-5" />;
  if (tags.includes("PET") || tags.includes("FUR")) return <Cat className="w-5 h-5" />;
  if (tags.includes("SHOPPING") || tags.includes("FOOD")) return <ShoppingBag className="w-5 h-5" />;
  if (tags.includes("EYES")) return <Eye className="w-5 h-5" />;
  return null;
};

// Get random pin color based on node id for consistency
const getPinColor = (id: string): "red" | "yellow" | "blue" | "green" => {
  const colors: Array<"red" | "yellow" | "blue" | "green"> = ["red", "yellow", "blue", "green"];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Scribble display component for node-parented scribbles - with auto-fade
const NodeScribbleDisplay = ({ scribbles }: { scribbles: NodeScribble[] }) => {
  const getPositionStyle = (position: NodeScribble["position"]): React.CSSProperties => {
    // Scribbles are now parented INSIDE the node, positioned with absolute
    switch (position) {
      case "top":
        return { position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "100%" };
      case "bottom":
        return { position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", width: "100%" };
      case "center":
        return { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" };
      case "diagonal":
        return { position: "absolute", top: "40%", left: "5%", transform: "rotate(-12deg)", width: "100%" };
      default:
        return { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" };
    }
  };

  const getStyleClass = (style: NodeScribble["style"]): string => {
    switch (style) {
      case "stamp":
        return "text-[#c21c38] font-bold uppercase tracking-wider border-2 border-[#c21c38] px-2 py-0.5 bg-white/80";
      case "circled":
        return "text-[#c21c38] font-marker border-2 border-[#c21c38] rounded-full px-2 py-0.5";
      case "handwritten":
      default:
        return "text-[#c21c38] font-marker";
    }
  };

  return (
    <AnimatePresence>
      {scribbles.map((scribble) => (
        <motion.div
          key={scribble.id}
          className={`absolute pointer-events-none select-none z-20 whitespace-nowrap text-xs sm:text-sm scribble-feedback ${getStyleClass(scribble.style)}`}
          style={{
            ...getPositionStyle(scribble.position),
            rotate: `${scribble.rotation}deg`,
            textShadow: "1px 1px 0 rgba(255,255,255,0.8)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0, y: -10 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
        >
          {scribble.text}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// Tape visual component
const TapeStrip = ({ angle = 0, position = 'top' }: { angle?: number; position?: 'top' | 'corner-left' | 'corner-right' }) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    width: '50px',
    height: '18px',
    background: 'linear-gradient(to bottom, rgba(255, 248, 220, 0.85) 0%, rgba(245, 235, 200, 0.9) 50%, rgba(235, 220, 180, 0.85) 100%)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
    zIndex: 10,
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    'top': { top: '-8px', left: '50%', transform: `translateX(-50%) rotate(${angle}deg)` },
    'corner-left': { top: '-4px', left: '-12px', transform: 'rotate(-45deg)' },
    'corner-right': { top: '-4px', right: '-12px', transform: 'rotate(45deg)' },
  };

  return (
    <div
      style={{ ...baseStyle, ...positionStyles[position] }}
      className="pointer-events-none"
    >
      {/* Tape texture lines */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.02) 3px, rgba(0, 0, 0, 0.02) 4px)',
        }}
      />
    </div>
  );
};

const PhotoNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || (Math.random() * 6 - 3);
  const pinColor = getPinColor(data.id);
  const useTape = hasTape(data.id);
  const tapeAngle = getTapeAngle(data.id);
  const { isMobile, isTablet } = useResponsive();

  // Responsive sizing
  const photoWidth = isMobile ? 'w-32' : isTablet ? 'w-40' : 'w-44';
  const photoHeight = isMobile ? 'h-24' : isTablet ? 'h-28' : 'h-32';
  const padding = isMobile ? '6px 6px 24px 6px' : '8px 8px 32px 8px';
  const titleSize = isMobile ? 'text-[10px]' : 'text-xs';
  const descSize = isMobile ? 'text-[8px]' : 'text-[9px]';

  // Polaroid-style white border
  return (
    <div
      className="cursor-grab active:cursor-grabbing relative evidence-card-responsive"
      style={{
        "--rotation": `${rotation}deg`,
        background: 'linear-gradient(to bottom, #fefefe 0%, #f5f5f5 100%)',
        padding: padding,
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
        borderRadius: '2px',
      } as React.CSSProperties}
    >
      {/* Glossy reflection */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: '60%',
          bottom: '70%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
          borderRadius: '2px 0 0 0',
        }}
      />

      {useTape ? (
        <TapeStrip angle={tapeAngle} position="top" />
      ) : (
        <PushPin color={pinColor} isDesktop={data.isDesktop} />
      )}

      {/* Photo area - responsive */}
      <div className={`bg-ink/10 ${photoWidth} ${photoHeight} flex items-center justify-center relative overflow-hidden`}>
        {data.contentUrl ? (
          <img
            src={data.contentUrl}
            alt={data.title}
            className="w-full h-full object-cover"
            draggable={false}
            style={{ filter: 'contrast(1.05) saturate(0.95)' }}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-paper-aged/50 to-transparent" />
            <Camera className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-ink/30`} />
          </>
        )}
        {getNodeIcon(data.tags) && !data.contentUrl && (
          <div className="absolute bottom-2 right-2 text-ink/50">
            {getNodeIcon(data.tags)}
          </div>
        )}
        {/* UV Hidden Content */}
        {data.hiddenText && data.isUVEnabled && (
          <div className="absolute inset-0 bg-ink/90 flex items-center justify-center">
            <p className={`text-[#7fff00] font-mono ${isMobile ? 'text-[10px]' : 'text-xs'} text-center px-2 uppercase tracking-wider`}
               style={{ textShadow: "0 0 10px rgba(127,255,0,0.8)" }}>
              {data.hiddenText}
            </p>
          </div>
        )}
      </div>

      {/* Polaroid caption area - responsive */}
      <div className="mt-2 text-center">
        <p
          className={`${titleSize} text-ink font-bold tracking-tight`}
          style={{ fontFamily: getHandwritingFont(data.id) }}
        >
          {data.title}
        </p>
        <p
          className={`${descSize} text-ink/60 mt-0.5 leading-tight`}
          style={{ fontFamily: "'Special Elite', monospace" }}
        >
          {data.description}
        </p>
      </div>
    </div>
  );
};

const DocumentNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || (Math.random() * 4 - 2);
  const pinColor = getPinColor(data.id);
  const showCoffeeStain = hasCoffeeStain(data.id);
  const useTape = hasTape(data.id);
  const tapeAngle = getTapeAngle(data.id);
  const { isMobile, isTablet } = useResponsive();

  // Responsive sizing
  const docWidth = isMobile ? 'w-40' : isTablet ? 'w-48' : 'w-52';
  const padding = isMobile ? '10px' : '12px';
  const paddingTop = isMobile ? '20px' : '24px';
  const titleSize = isMobile ? 'text-xs' : 'text-sm';
  const descSize = isMobile ? 'text-[10px]' : 'text-xs';
  const tagSize = isMobile ? 'text-[7px]' : 'text-[8px]';
  const iconSize = isMobile ? 'w-4 h-4' : 'w-5 h-5';

  // Determine paper type based on node ID
  const hash = data.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const paperType = hash % 3; // 0: lined, 1: plain aged, 2: grid

  const paperStyles: Record<number, React.CSSProperties> = {
    0: {
      // Lined notebook paper
      backgroundImage: `
        repeating-linear-gradient(to bottom, transparent 0px, transparent 19px, rgba(180, 200, 220, 0.4) 19px, rgba(180, 200, 220, 0.4) 20px),
        linear-gradient(to bottom, hsl(45, 20%, 96%) 0%, hsl(45, 15%, 92%) 100%)
      `,
      backgroundPosition: '0 24px',
    },
    1: {
      // Aged yellowed paper
      background: 'linear-gradient(135deg, hsl(45, 30%, 92%) 0%, hsl(42, 25%, 88%) 50%, hsl(38, 20%, 85%) 100%)',
      filter: 'sepia(0.08)',
    },
    2: {
      // Graph paper
      backgroundImage: `
        repeating-linear-gradient(to right, transparent 0px, transparent 15px, rgba(180, 200, 220, 0.25) 15px, rgba(180, 200, 220, 0.25) 16px),
        repeating-linear-gradient(to bottom, transparent 0px, transparent 15px, rgba(180, 200, 220, 0.25) 15px, rgba(180, 200, 220, 0.25) 16px),
        linear-gradient(to bottom, hsl(45, 15%, 97%) 0%, hsl(45, 10%, 94%) 100%)
      `,
    },
  };

  return (
    <div
      className={`${docWidth} cursor-grab active:cursor-grabbing relative evidence-card-responsive`}
      style={{
        "--rotation": `${rotation}deg`,
        ...paperStyles[paperType],
        padding: padding,
        paddingTop: paddingTop,
        borderLeft: '3px solid hsl(350, 70%, 45%)',
        borderRadius: '1px 3px 3px 1px',
        boxShadow: '2px 4px 12px rgba(0, 0, 0, 0.35), 1px 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)',
      } as React.CSSProperties}
    >
      {/* Coffee stain */}
      {showCoffeeStain && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: isMobile ? '40px' : '50px',
            height: isMobile ? '40px' : '50px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(139, 90, 43, 0.12) 50%, rgba(139, 90, 43, 0.08) 60%, transparent 75%)',
            top: '15%',
            right: '10%',
            transform: 'rotate(15deg)',
          }}
        />
      )}

      {useTape ? (
        <>
          <TapeStrip angle={tapeAngle - 5} position="corner-left" />
          <TapeStrip angle={-tapeAngle + 5} position="corner-right" />
        </>
      ) : (
        <PushPin color={pinColor} isDesktop={data.isDesktop} />
      )}

      <div className="flex items-start gap-2 mb-2">
        <FileText className={`${iconSize} text-primary flex-shrink-0`} />
        <h3
          className={`${titleSize} font-bold text-ink tracking-tight`}
          style={{ fontFamily: "'Special Elite', 'Courier Prime', monospace" }}
        >
          {data.title}
        </h3>
      </div>
      <div className="border-t border-ink/20 pt-2">
        <p
          className={`${descSize} text-ink/80 leading-relaxed`}
          style={{
            fontFamily: "'Courier Prime', monospace",
            letterSpacing: '-0.02em',
          }}
        >
          {data.description}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {data.tags.slice(0, 3).map((tag) => {
          const isRevealed = data.revealedTags?.includes(tag);
          return (
            <span
              key={tag}
              className={`${tagSize} px-1 py-0.5 rounded font-mono ${
                isRevealed
                  ? "bg-green-500/30 text-green-700 border border-green-500/50"
                  : "bg-ink/10 text-ink/50"
              }`}
              style={{ fontFamily: "'VT323', monospace" }}
            >
              {isRevealed ? tag : "[REDACTED]"}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const StickyNoteNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || (Math.random() * 8 - 4);
  const pinColor = getPinColor(data.id);
  const handwritingFont = getHandwritingFont(data.id);
  const { isMobile, isTablet } = useResponsive();

  // Responsive sizing
  const stickyWidth = isMobile ? 'w-28' : isTablet ? 'w-32' : 'w-36';
  const padding = isMobile ? '8px' : '10px';
  const paddingTop = isMobile ? '16px' : '20px';
  const titleSize = isMobile ? 'text-xs' : 'text-sm';
  const descSize = isMobile ? 'text-[10px]' : 'text-xs';
  const iconSize = isMobile ? 'w-3 h-3' : 'w-4 h-4';

  // Sticky note color variants
  const hash = data.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorVariant = hash % 4;

  const stickyColors: Record<number, { bg: string; shadow: string }> = {
    0: {
      // Classic yellow
      bg: 'linear-gradient(135deg, hsl(50, 90%, 75%) 0%, hsl(50, 85%, 70%) 40%, hsl(48, 75%, 65%) 100%)',
      shadow: 'rgba(180, 150, 50, 0.3)',
    },
    1: {
      // Pink
      bg: 'linear-gradient(135deg, hsl(350, 80%, 85%) 0%, hsl(350, 75%, 80%) 40%, hsl(348, 65%, 75%) 100%)',
      shadow: 'rgba(200, 100, 120, 0.3)',
    },
    2: {
      // Blue
      bg: 'linear-gradient(135deg, hsl(200, 80%, 85%) 0%, hsl(200, 75%, 80%) 40%, hsl(198, 65%, 75%) 100%)',
      shadow: 'rgba(100, 150, 200, 0.3)',
    },
    3: {
      // Green
      bg: 'linear-gradient(135deg, hsl(120, 50%, 82%) 0%, hsl(120, 45%, 77%) 40%, hsl(118, 40%, 72%) 100%)',
      shadow: 'rgba(100, 180, 100, 0.3)',
    },
  };

  const colors = stickyColors[colorVariant];

  return (
    <div
      className={`${stickyWidth} cursor-grab active:cursor-grabbing relative evidence-card-responsive`}
      style={{
        "--rotation": `${rotation}deg`,
        background: colors.bg,
        padding: padding,
        paddingTop: paddingTop,
        borderRadius: '0 0 3px 3px',
        boxShadow: `1px 8px 16px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -1px 0 ${colors.shadow}`,
      } as React.CSSProperties}
    >
      {/* Peeling top edge effect */}
      <div
        className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
        }}
      />

      {/* Fold shadow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, transparent 100%)',
        }}
      />

      <PushPin color={pinColor} isDesktop={data.isDesktop} />

      <div className="flex items-start gap-1 mb-1">
        <StickyNote className={`${iconSize} text-ink/40 flex-shrink-0`} />
        <h3
          className={`${titleSize} text-ink`}
          style={{ fontFamily: handwritingFont }}
        >
          {data.title}
        </h3>
      </div>
      <p
        className={`${descSize} text-ink/80 leading-relaxed`}
        style={{
          fontFamily: handwritingFont,
          transform: 'rotate(-0.5deg)',
        }}
      >
        {data.description}
      </p>
    </div>
  );
};

export const EvidenceNodeComponent = memo(({ data }: EvidenceNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const renderNodeContent = () => {
    switch (data.type) {
      case "photo":
        return <PhotoNode data={data} />;
      case "document":
        return <DocumentNode data={data} />;
      case "sticky_note":
        return <StickyNoteNode data={data} />;
      default:
        return <PhotoNode data={data} />;
    }
  };

  // Use pre-calculated rotation from board, with shake animation override
  const baseRotation = data.rotation || 0;

  // Build class list for combination glow effects
  const glowClasses = [
    data.isCombineTarget ? 'combine-target-highlight' : '',
    data.isNearbyCombinable ? 'combinable-glow' : '',
    data.isChainCombinable ? 'chain-combinable-glow' : '',
  ].filter(Boolean).join(' ');

  // Deep shadow when dragging - "lifted off the board" effect
  const dragShadow = isDragging
    ? '8px 16px 40px rgba(0, 0, 0, 0.5), 4px 8px 20px rgba(0, 0, 0, 0.35), 2px 4px 10px rgba(0, 0, 0, 0.25)'
    : isHovered
      ? '4px 8px 20px rgba(0, 0, 0, 0.4), 2px 4px 8px rgba(0, 0, 0, 0.25)'
      : undefined;

  return (
    <motion.div
      className={`relative ${glowClasses} ${data.isTrashing ? 'pointer-events-none' : ''}`}
      style={{
        rotate: `${baseRotation}deg`,
        filter: isDragging ? 'brightness(1.05)' : undefined,
      }}
      initial={data.isSpawning ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: data.isTrashing
          ? 0
          : data.isSpawning
            ? [0, 1.2, 1]
            : isDragging
              ? 1.08
              : isHovered ? 1.03 : 1,
        opacity: data.isTrashing ? 0 : 1,
        rotate: data.isShaking
          ? [baseRotation, baseRotation - 3, baseRotation + 3, baseRotation - 3, baseRotation + 3, baseRotation]
          : data.isTrashing
            ? baseRotation + 360
            : baseRotation,
        y: data.isTrashing ? 100 : isDragging ? -8 : 0,
        boxShadow: dragShadow,
      }}
      transition={{
        scale: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : data.isSpawning
            ? { duration: 0.5, ease: "backOut" }
            : { duration: 0.15 },
        rotate: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : { duration: 0.4, ease: "easeInOut" },
        opacity: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : { duration: 0.3 },
        y: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : { duration: 0.15, ease: "easeOut" },
        boxShadow: { duration: 0.15, ease: "easeOut" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* Target handle - invisible but at top for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="nodrag"
        style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '28px',
          height: '36px',
          background: 'transparent',
          border: 'none',
          zIndex: 9,
          opacity: 0,
        }}
      />

      <motion.div
        animate={{
          boxShadow: data.isPulsing
            ? ["0 0 0 0 rgba(196, 30, 58, 0)", "0 0 20px 10px rgba(196, 30, 58, 0.3)", "0 0 0 0 rgba(196, 30, 58, 0)"]
            : "0 0 0 0 rgba(196, 30, 58, 0)",
        }}
        transition={{ duration: 0.6 }}
      >
        {renderNodeContent()}
      </motion.div>

      {/* UV-light combination hint */}
      {data.isUVEnabled && data.combinationHint && (
        <div className="uv-combination-hint">
          {data.combinationHint}
        </div>
      )}

      {/* Node-parented scribbles - positioned inside the node */}
      {data.nodeScribbles && data.nodeScribbles.length > 0 && (
        <NodeScribbleDisplay scribbles={data.nodeScribbles} />
      )}
    </motion.div>
  );
});

EvidenceNodeComponent.displayName = "EvidenceNodeComponent";
