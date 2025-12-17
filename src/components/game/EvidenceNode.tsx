import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import type { EvidenceNode as EvidenceNodeType, NodeScribble } from "@/types/game";
import { Camera, FileText, StickyNote, Eye, Zap, Bird, Cat, ShoppingBag, Cpu } from "lucide-react";

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

const PhotoNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || (Math.random() * 6 - 3);
  const pinColor = getPinColor(data.id);
  
  return (
    <div 
      className="evidence-photo paper-base w-48 cursor-grab active:cursor-grabbing relative"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <PushPin color={pinColor} isDesktop={data.isDesktop} />
      <div className="bg-ink/10 h-32 flex items-center justify-center mb-2 relative overflow-hidden rounded-sm mt-4">
        {data.contentUrl ? (
          <img 
            src={data.contentUrl} 
            alt={data.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-paper-aged/50 to-transparent" />
            <Camera className="w-12 h-12 text-ink/30" />
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
            <p className="text-[#7fff00] font-mono text-xs text-center px-2 uppercase tracking-wider"
               style={{ textShadow: "0 0 10px rgba(127,255,0,0.8)" }}>
              {data.hiddenText}
            </p>
          </div>
        )}
      </div>
      <p className="text-xs font-mono text-ink text-center font-bold tracking-tight">{data.title}</p>
      <p className="text-[10px] font-typewriter text-ink/70 text-center mt-1 leading-tight">
        {data.description}
      </p>
    </div>
  );
};

const DocumentNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || (Math.random() * 4 - 2);
  const pinColor = getPinColor(data.id);
  
  return (
    <div 
      className="evidence-document paper-base w-52 cursor-grab active:cursor-grabbing relative"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <PushPin color={pinColor} isDesktop={data.isDesktop} />
      <div className="flex items-start gap-2 mb-2 mt-6">
        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
        <h3 className="font-typewriter text-sm font-bold text-ink tracking-tight">{data.title}</h3>
      </div>
      <div className="border-t border-ink/20 pt-2">
        <p className="text-xs font-mono text-ink/80 leading-relaxed">
          {data.description}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {data.tags.slice(0, 3).map((tag) => {
          const isRevealed = data.revealedTags?.includes(tag);
          return (
            <span
              key={tag}
              className={`text-[8px] px-1 py-0.5 rounded font-mono ${
                isRevealed
                  ? "bg-green-500/30 text-green-700 border border-green-500/50"
                  : "bg-ink/10 text-ink/50"
              }`}
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
  
  return (
    <div 
      className="evidence-sticky paper-base w-36 cursor-grab active:cursor-grabbing relative"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <PushPin color={pinColor} isDesktop={data.isDesktop} />
      <div className="flex items-start gap-1 mb-1 mt-6">
        <StickyNote className="w-4 h-4 text-ink/50 flex-shrink-0" />
        <h3 className="font-marker text-sm text-ink">{data.title}</h3>
      </div>
      <p className="text-xs font-marker text-ink/80 leading-relaxed">
        {data.description}
      </p>
    </div>
  );
};

export const EvidenceNodeComponent = memo(({ data }: EvidenceNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <motion.div
      className={`relative ${glowClasses} ${data.isTrashing ? 'pointer-events-none' : ''}`}
      style={{ rotate: `${baseRotation}deg` }}
      initial={data.isSpawning ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: data.isTrashing
          ? 0
          : data.isSpawning
            ? [0, 1.2, 1]
            : isHovered ? 1.05 : 1,
        opacity: data.isTrashing ? 0 : 1,
        rotate: data.isShaking
          ? [baseRotation, baseRotation - 3, baseRotation + 3, baseRotation - 3, baseRotation + 3, baseRotation]
          : data.isTrashing
            ? baseRotation + 360
            : baseRotation,
        y: data.isTrashing ? 100 : 0,
      }}
      transition={{
        scale: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : data.isSpawning
            ? { duration: 0.5, ease: "backOut" }
            : { duration: 0.2 },
        rotate: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : { duration: 0.4, ease: "easeInOut" },
        opacity: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : { duration: 0.3 },
        y: data.isTrashing
          ? { duration: 0.4, ease: "easeIn" }
          : { duration: 0 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
