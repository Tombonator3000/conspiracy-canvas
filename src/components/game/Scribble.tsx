import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Scribble as ScribbleType } from "@/types/game";

interface ScribbleProps {
  scribble: ScribbleType;
  onRemove?: (id: string) => void;
}

export const Scribble = ({ scribble, onRemove }: ScribbleProps) => {
  // Auto-remove scribble after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove?.(scribble.id);
    }, 2000);
    return () => clearTimeout(timer);
  }, [scribble.id, onRemove]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none z-50 scribble-feedback"
      style={{
        left: scribble.x,
        top: scribble.y,
        "--scribble-rotation": `${scribble.rotation}deg`,
      } as React.CSSProperties}
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={{ 
        scale: 1, 
        rotate: scribble.rotation, 
        opacity: 1 
      }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
      }}
    >
      <span className="scribble text-lg md:text-xl whitespace-nowrap drop-shadow-lg">
        {scribble.text}
      </span>
    </motion.div>
  );
};