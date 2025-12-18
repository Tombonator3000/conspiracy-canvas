import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GAME_MODIFIERS, ModifierId } from "@/types/game";

interface ModifierSelectorProps {
  selectedModifiers: ModifierId[];
  onModifiersChange: (modifiers: ModifierId[]) => void;
  className?: string;
}

export const ModifierSelector = ({
  selectedModifiers,
  onModifiersChange,
  className = "",
}: ModifierSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleModifier = (modifierId: ModifierId) => {
    if (selectedModifiers.includes(modifierId)) {
      onModifiersChange(selectedModifiers.filter((id) => id !== modifierId));
    } else {
      onModifiersChange([...selectedModifiers, modifierId]);
    }
  };

  const totalBonus = selectedModifiers.reduce((sum, modId) => {
    const modifier = GAME_MODIFIERS.find((m) => m.id === modId);
    return sum + (modifier?.bonus || 0);
  }, 0);

  return (
    <div className={`${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full dos-button text-sm px-4 py-2 flex items-center justify-between"
        style={{
          color: selectedModifiers.length > 0 ? "#ffff00" : "#00ff00",
          borderColor: selectedModifiers.length > 0 ? "#ffff00" : "#00ff00",
        }}
      >
        <span>
          [ CHALLENGE MODIFIERS: {selectedModifiers.length > 0 ? selectedModifiers.length : "NONE"} ]
        </span>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 border border-[#00ff00]/30 rounded bg-black/50">
              {/* Header */}
              <div className="terminal-text text-xs text-[#00aa00] mb-3">
                {'>'} SELECT MODIFIERS FOR BONUS POINTS:
              </div>

              {/* Modifier Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {GAME_MODIFIERS.map((modifier) => {
                  const isSelected = selectedModifiers.includes(modifier.id);
                  return (
                    <motion.button
                      key={modifier.id}
                      onClick={() => toggleModifier(modifier.id)}
                      className={`p-2 rounded border transition-all text-left ${
                        isSelected
                          ? "bg-[#00ff00]/20 border-[#00ff00] text-[#00ff00]"
                          : "bg-black/50 border-[#00ff00]/30 text-[#00aa00] hover:border-[#00ff00]/60"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{modifier.icon}</span>
                        <span
                          className="terminal-text text-xs font-bold"
                          style={{ fontFamily: "'VT323', monospace" }}
                        >
                          {modifier.name}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-[10px]">[X]</span>
                        )}
                      </div>
                      <div
                        className="text-[10px] text-gray-400 mb-1"
                        style={{ fontFamily: "'VT323', monospace" }}
                      >
                        {modifier.description}
                      </div>
                      <div
                        className="text-[10px] text-yellow-500"
                        style={{ fontFamily: "'VT323', monospace" }}
                      >
                        +{modifier.bonus} pts
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Total Bonus */}
              {totalBonus > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2 border-t border-[#00ff00]/30"
                >
                  <span
                    className="terminal-text text-sm text-yellow-400"
                    style={{
                      fontFamily: "'VT323', monospace",
                      textShadow: "0 0 10px rgba(255, 255, 0, 0.5)",
                    }}
                  >
                    BONUS REWARD: +{totalBonus} POINTS
                  </span>
                </motion.div>
              )}

              {/* Warning */}
              {selectedModifiers.length > 0 && (
                <div
                  className="text-center text-[9px] text-red-400/70 mt-2"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  WARNING: Modifiers increase difficulty!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
