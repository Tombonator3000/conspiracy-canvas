import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface EvidenceBinProps {
  isHighlighted: boolean;
}

export const EvidenceBin = forwardRef<HTMLDivElement, EvidenceBinProps>(
  ({ isHighlighted }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`fixed bottom-6 right-6 z-40 w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-200 ${
          isHighlighted
            ? "bg-destructive/30 border-2 border-destructive shadow-[0_0_30px_hsl(var(--destructive)/0.6)]"
            : "bg-secondary/70 border-2 border-border hover:border-muted-foreground"
        }`}
        animate={{
          scale: isHighlighted ? 1.15 : 1,
          rotate: isHighlighted ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          rotate: { repeat: isHighlighted ? Infinity : 0, duration: 0.4 },
        }}
      >
        <Trash2 
          className={`w-10 h-10 transition-colors ${
            isHighlighted ? "text-destructive" : "text-muted-foreground"
          }`}
        />
        
        {/* Label */}
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-typewriter text-muted-foreground whitespace-nowrap uppercase tracking-wider">
          Discard
        </span>
        
        {/* Drop indicator */}
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-typewriter text-destructive whitespace-nowrap font-bold"
          >
            Release to discard
          </motion.div>
        )}
      </motion.div>
    );
  }
);

EvidenceBin.displayName = "EvidenceBin";
