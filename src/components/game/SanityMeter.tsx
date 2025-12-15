import { motion } from "framer-motion";
import { Brain, AlertTriangle } from "lucide-react";

interface SanityMeterProps {
  sanity: number;
  maxSanity?: number;
}

export const SanityMeter = ({ sanity, maxSanity = 100 }: SanityMeterProps) => {
  const percentage = (sanity / maxSanity) * 100;
  const isLow = percentage < 30;
  const isCritical = percentage < 15;

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-secondary/80 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border">
      <motion.div
        animate={{
          rotate: isCritical ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: isCritical ? Infinity : 0,
          repeatDelay: 1,
        }}
      >
        {isLow ? (
          <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${isCritical ? "text-destructive animate-flicker" : "text-accent"}`} />
        ) : (
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        )}
      </motion.div>
      
      <div className="flex flex-col gap-0.5 sm:gap-1">
        <span className="text-[8px] sm:text-[10px] font-typewriter text-muted-foreground uppercase tracking-wider hidden sm:block">
          Sanity Level
        </span>
        <div className="w-16 sm:w-32 h-2 sm:h-3 bg-background rounded-full overflow-hidden border border-border">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, 
                hsl(0, 70%, 50%) 0%, 
                hsl(45, 80%, 55%) 50%, 
                hsl(120, 60%, 45%) 100%
              )`,
            }}
            initial={{ width: "100%" }}
            animate={{ 
              width: `${percentage}%`,
              filter: isCritical ? "brightness(1.3)" : "brightness(1)",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <motion.span 
        className={`font-mono text-xs sm:text-sm font-bold min-w-[2ch] sm:min-w-[3ch] ${
          isCritical ? "text-destructive" : isLow ? "text-accent" : "text-foreground"
        }`}
        animate={{
          scale: isCritical ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          repeat: isCritical ? Infinity : 0,
          repeatDelay: 0.7,
        }}
      >
        {sanity}
      </motion.span>
    </div>
  );
};
