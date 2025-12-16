import { memo, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import type { EvidenceNode as EvidenceNodeType } from "@/types/game";
import { Camera, FileText, StickyNote, Eye, Zap, Bird, Cat, ShoppingBag, Cpu } from "lucide-react";

interface EvidenceNodeData extends EvidenceNodeType {
  isShaking?: boolean;
  isPulsing?: boolean;
  isUVEnabled?: boolean;
  rotation?: number;
  isLinkMode?: boolean;
  revealedTags?: string[];
}

interface EvidenceNodeProps {
  data: EvidenceNodeData;
}

const getNodeIcon = (tags: string[]) => {
  if (tags.includes("DRONE") || tags.includes("SURVEILLANCE")) return <Bird className="w-5 h-5" />;
  if (tags.includes("BATTERY") || tags.includes("ELECTRICITY")) return <Zap className="w-5 h-5" />;
  if (tags.includes("GOVERNMENT")) return <Cpu className="w-5 h-5" />;
  if (tags.includes("PET") || tags.includes("FUR")) return <Cat className="w-5 h-5" />;
  if (tags.includes("SHOPPING") || tags.includes("FOOD")) return <ShoppingBag className="w-5 h-5" />;
  if (tags.includes("EYES")) return <Eye className="w-5 h-5" />;
  return null;
};

const PhotoNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || (Math.random() * 6 - 3);
  
  return (
    <div 
      className="evidence-photo w-48 cursor-grab active:cursor-grabbing relative"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <div className="pin" />
      <div className="bg-ink/10 h-32 flex items-center justify-center mb-2 relative overflow-hidden rounded-sm">
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
  
  return (
    <div 
      className="evidence-document w-52 cursor-grab active:cursor-grabbing"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <div className="pin" />
      <div className="flex items-start gap-2 mb-2">
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
  
  return (
    <div 
      className="evidence-sticky w-36 cursor-grab active:cursor-grabbing relative"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <div className="flex items-start gap-1 mb-1">
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
  
  return (
    <motion.div
      className="relative"
      style={{ rotate: `${baseRotation}deg` }}
      animate={{
        scale: isHovered ? 1.05 : 1,
        rotate: data.isShaking 
          ? [baseRotation, baseRotation - 3, baseRotation + 3, baseRotation - 3, baseRotation + 3, baseRotation] 
          : baseRotation,
      }}
      transition={{
        scale: { duration: 0.2 },
        rotate: { duration: 0.4, ease: "easeInOut" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Target handle - visible on mobile */}
      <Handle
        type="target"
        position={Position.Top}
        className="touch-handle touch-handle-top"
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
      
      {/* Source handle - visible on mobile */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="touch-handle touch-handle-bottom"
      />

      {/* Full-node overlay handle for Link Mode - makes entire node a source */}
      {data.isLinkMode && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="fullnode-source"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            zIndex: 10,
            borderRadius: 0,
            transform: 'none',
            border: 'none',
            background: 'transparent',
          }}
        />
      )}
    </motion.div>
  );
});

EvidenceNodeComponent.displayName = "EvidenceNodeComponent";
