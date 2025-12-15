import { motion } from "framer-motion";
import { Link, Target } from "lucide-react";

interface ConnectionCounterProps {
  current: number;
  max: number;
}

export const ConnectionCounter = ({ current, max }: ConnectionCounterProps) => {
  const isComplete = current >= max;

  return (
    <div className="flex items-center gap-3 bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
      <motion.div
        animate={{
          scale: isComplete ? [1, 1.2, 1] : 1,
          rotate: isComplete ? 360 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {isComplete ? (
          <Target className="w-5 h-5 text-sanity-green" />
        ) : (
          <Link className="w-5 h-5 text-primary" />
        )}
      </motion.div>
      
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-typewriter text-muted-foreground uppercase tracking-wider">
          Connections
        </span>
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 h-2 rounded-sm ${
                i < current ? "bg-primary" : "bg-background border border-border"
              }`}
              initial={false}
              animate={{
                scale: i === current - 1 ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
      
      <span className={`font-marker text-lg ${isComplete ? "text-sanity-green" : "text-foreground"}`}>
        {current}/{max}
      </span>
    </div>
  );
};
