import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface EvidenceBinProps {
  onNodeDropped: (nodeId: string) => void;
  isHighlighted: boolean;
}

export const EvidenceBin = ({ onNodeDropped, isHighlighted }: EvidenceBinProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
        isHighlighted || isHovering
          ? "bg-string-red/30 border-2 border-string-red shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          : "bg-ink/50 border-2 border-paper/20 hover:border-paper/40"
      }`}
      animate={{
        scale: isHighlighted ? 1.1 : 1,
        rotate: isHighlighted ? [0, -5, 5, -5, 0] : 0,
      }}
      transition={{
        rotate: { repeat: isHighlighted ? Infinity : 0, duration: 0.5 },
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Trash2 
        className={`w-8 h-8 transition-colors ${
          isHighlighted || isHovering ? "text-string-red" : "text-paper/50"
        }`}
      />
      
      {/* Label */}
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-paper/50 whitespace-nowrap uppercase tracking-wider">
        Evidence Bin
      </span>
      
      {/* Drop indicator */}
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-mono text-string-red whitespace-nowrap"
        >
          Drop to discard
        </motion.div>
      )}
    </motion.div>
  );
};
