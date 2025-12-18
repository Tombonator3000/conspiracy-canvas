import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";

interface HintPanelProps {
  className?: string;
}

const HINT_TIERS = [
  { level: 1 as const, cost: 5, label: "VAGUE HINT", description: "General direction" },
  { level: 2 as const, cost: 10, label: "SPECIFIC HINT", description: "Category hint" },
  { level: 3 as const, cost: 15, label: "DIRECT HINT", description: "Clear pointer" },
];

export const HintPanel = ({ className = "" }: HintPanelProps) => {
  const { sanity, hintsUsed, maxHints, requestHint } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastHint, setLastHint] = useState<string | null>(null);

  const hintsRemaining = maxHints - hintsUsed;

  const handleRequestHint = (tier: 1 | 2 | 3, cost: number) => {
    if (sanity < cost) return;
    if (hintsRemaining <= 0) return;

    const hint = requestHint(tier);
    if (hint) {
      setLastHint(hint);
      // Clear hint display after 5 seconds
      setTimeout(() => setLastHint(null), 5000);
    }
  };

  return (
    <motion.div
      className={`bg-black/90 backdrop-blur-sm border border-purple-900/50 rounded font-mono overflow-hidden ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-purple-900/20 transition-colors"
      >
        <span className="text-purple-400 text-sm">💡</span>
        <span
          className="text-purple-300 text-xs uppercase tracking-wider"
          style={{ fontFamily: "'VT323', monospace" }}
        >
          Need a Hint?
        </span>
        <span className="ml-auto text-xs text-gray-500">
          {hintsRemaining}/{maxHints}
        </span>
        <motion.span
          className="text-purple-400 text-xs"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-3"
          >
            {/* Hint buttons */}
            <div className="space-y-1.5 mb-2">
              {HINT_TIERS.map((tier) => {
                const canAfford = sanity >= tier.cost;
                const hasHints = hintsRemaining > 0;
                const isDisabled = !canAfford || !hasHints;

                return (
                  <button
                    key={tier.level}
                    onClick={() => handleRequestHint(tier.level, tier.cost)}
                    disabled={isDisabled}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all ${
                      isDisabled
                        ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                        : "bg-purple-900/30 text-purple-300 hover:bg-purple-800/50 hover:text-purple-200"
                    }`}
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tier.label}</span>
                      <span className={isDisabled ? "text-gray-600" : "text-red-400"}>
                        -{tier.cost} sanity
                      </span>
                    </div>
                    <div className="text-[9px] text-gray-500 mt-0.5">
                      {tier.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Last hint display */}
            <AnimatePresence>
              {lastHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-purple-900/20 border border-purple-500/30 rounded p-2 text-xs text-purple-300 italic text-center"
                  style={{
                    fontFamily: "'VT323', monospace",
                    textShadow: "0 0 5px rgba(168, 85, 247, 0.5)",
                  }}
                >
                  "{lastHint}"
                </motion.div>
              )}
            </AnimatePresence>

            {/* Warning if low on hints */}
            {hintsRemaining <= 1 && hintsRemaining > 0 && (
              <div className="text-[9px] text-amber-500 text-center mt-1">
                Only {hintsRemaining} hint{hintsRemaining === 1 ? "" : "s"} remaining!
              </div>
            )}

            {/* No hints left */}
            {hintsRemaining <= 0 && (
              <div className="text-[9px] text-red-500 text-center mt-1">
                No hints remaining...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
