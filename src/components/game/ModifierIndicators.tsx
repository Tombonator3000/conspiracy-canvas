import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

interface ModifierIndicatorsProps {
  className?: string;
}

export const ModifierIndicators = ({ className = "" }: ModifierIndicatorsProps) => {
  const {
    activeModifiers,
    deadlineTimeRemaining,
    uvTimeRemaining,
    connectionCount,
    maxConnections,
    tickDeadline,
    consumeUVTime,
    isUVEnabled,
    isVictory,
    isGameOver,
  } = useGameStore();

  // Deadline timer tick
  useEffect(() => {
    if (!activeModifiers.includes("deadline") || deadlineTimeRemaining === null) {
      return;
    }

    const interval = setInterval(() => {
      tickDeadline();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeModifiers, deadlineTimeRemaining, tickDeadline]);

  // UV time consumption when UV is enabled
  useEffect(() => {
    if (!activeModifiers.includes("blackout") || !isUVEnabled || uvTimeRemaining === null) {
      return;
    }

    const interval = setInterval(() => {
      consumeUVTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeModifiers, isUVEnabled, uvTimeRemaining, consumeUVTime]);

  // Don't show if no modifiers active or game ended
  if (activeModifiers.length === 0 || isVictory || isGameOver) {
    return null;
  }

  // Format time as MM:SS
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className={`flex flex-col gap-1 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Deadline Timer */}
      <AnimatePresence>
        {activeModifiers.includes("deadline") && deadlineTimeRemaining !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`px-3 py-1.5 rounded border font-mono text-center ${
              deadlineTimeRemaining <= 30
                ? "bg-red-900/80 border-red-500 text-red-300 animate-pulse"
                : deadlineTimeRemaining <= 60
                ? "bg-yellow-900/80 border-yellow-500 text-yellow-300"
                : "bg-black/80 border-orange-500/50 text-orange-300"
            }`}
          >
            <div
              className="text-[9px] text-gray-400 uppercase"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              Deadline
            </div>
            <div
              className="text-lg font-bold"
              style={{
                fontFamily: "'VT323', monospace",
                textShadow:
                  deadlineTimeRemaining <= 30
                    ? "0 0 10px rgba(239, 68, 68, 0.8)"
                    : "none",
              }}
            >
              {formatTime(deadlineTimeRemaining)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UV Time Remaining */}
      <AnimatePresence>
        {activeModifiers.includes("blackout") && uvTimeRemaining !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`px-3 py-1.5 rounded border font-mono text-center ${
              uvTimeRemaining <= 5
                ? "bg-red-900/80 border-red-500 text-red-300 animate-pulse"
                : uvTimeRemaining <= 15
                ? "bg-yellow-900/80 border-yellow-500 text-yellow-300"
                : "bg-black/80 border-blue-500/50 text-blue-300"
            }`}
          >
            <div
              className="text-[9px] text-gray-400 uppercase"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              UV Battery
            </div>
            <div
              className="text-sm font-bold"
              style={{
                fontFamily: "'VT323', monospace",
                textShadow:
                  uvTimeRemaining <= 5
                    ? "0 0 10px rgba(239, 68, 68, 0.8)"
                    : "none",
              }}
            >
              {uvTimeRemaining}s
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Counter */}
      <AnimatePresence>
        {activeModifiers.includes("minimalist") && maxConnections !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`px-3 py-1.5 rounded border font-mono text-center ${
              connectionCount >= maxConnections
                ? "bg-red-900/80 border-red-500 text-red-300"
                : connectionCount >= maxConnections - 2
                ? "bg-yellow-900/80 border-yellow-500 text-yellow-300"
                : "bg-black/80 border-green-500/50 text-green-300"
            }`}
          >
            <div
              className="text-[9px] text-gray-400 uppercase"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              Connections
            </div>
            <div
              className="text-sm font-bold"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              {connectionCount}/{maxConnections}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paranoid indicator */}
      <AnimatePresence>
        {activeModifiers.includes("paranoid") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="px-3 py-1.5 rounded border bg-black/80 border-purple-500/50 text-purple-300 font-mono text-center"
          >
            <div
              className="text-[9px] text-gray-400 uppercase"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              Mode
            </div>
            <div
              className="text-sm font-bold"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              PARANOID
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
