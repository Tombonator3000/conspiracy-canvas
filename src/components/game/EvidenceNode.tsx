import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import type { EvidenceNode as EvidenceNodeType } from "@/types/game";
import { Camera, FileText, StickyNote, Eye, Zap, Bird, Cat, ShoppingBag, Cpu } from "lucide-react";

interface EvidenceNodeData extends EvidenceNodeType {
  isShaking?: boolean;
  isPulsing?: boolean;
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
  const rotation = Math.random() * 6 - 3;
  
  return (
    <div 
      className="evidence-photo w-48 cursor-grab active:cursor-grabbing"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <div className="pin" />
      <div className="bg-ink/10 h-28 flex items-center justify-center mb-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-paper-aged/50 to-transparent" />
        <Camera className="w-12 h-12 text-ink/30" />
        {getNodeIcon(data.tags) && (
          <div className="absolute bottom-2 right-2 text-ink/50">
            {getNodeIcon(data.tags)}
          </div>
        )}
      </div>
      <p className="text-xs font-mono text-ink text-center font-bold">{data.title}</p>
      <p className="text-[10px] font-typewriter text-ink/70 text-center mt-1 leading-tight">
        {data.description}
      </p>
    </div>
  );
};

const DocumentNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = Math.random() * 4 - 2;
  
  return (
    <div 
      className="evidence-document w-52 cursor-grab active:cursor-grabbing"
      style={{ "--rotation": `${rotation}deg` } as React.CSSProperties}
    >
      <div className="pin" />
      <div className="flex items-start gap-2 mb-2">
        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
        <h3 className="font-typewriter text-sm font-bold text-ink">{data.title}</h3>
      </div>
      <div className="border-t border-ink/20 pt-2">
        <p className="text-xs font-mono text-ink/80 leading-relaxed">
          {data.description}
        </p>
      </div>
      <div className="mt-2 flex gap-1">
        {data.tags.slice(0, 2).map((tag) => (
          <span 
            key={tag} 
            className="text-[8px] bg-ink/10 px-1 py-0.5 rounded font-mono text-ink/50"
          >
            [REDACTED]
          </span>
        ))}
      </div>
    </div>
  );
};

const StickyNoteNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = Math.random() * 8 - 4;
  
  return (
    <div 
      className="evidence-sticky w-36 cursor-grab active:cursor-grabbing"
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

  return (
    <motion.div
      className="relative"
      animate={{
        scale: isHovered ? 1.02 : 1,
        rotate: data.isShaking ? [0, -2, 2, -2, 2, 0] : 0,
      }}
      transition={{
        scale: { duration: 0.2 },
        rotate: { duration: 0.4, ease: "easeInOut" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-card"
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
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-card"
      />
    </motion.div>
  );
});

EvidenceNodeComponent.displayName = "EvidenceNodeComponent";
