import { motion } from "framer-motion";
import type { Scribble as ScribbleType } from "@/types/game";

interface ScribbleProps {
  scribble: ScribbleType;
}

export const Scribble = ({ scribble }: ScribbleProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none select-none z-50"
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
