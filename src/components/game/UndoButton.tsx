import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Undo2 } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export const UndoButton = () => {
  const { trashedNodes, sanity, undoTrash } = useGameStore();
  const [showCostAnimation, setShowCostAnimation] = useState(false);

  const canUndo = trashedNodes.length > 0;
  const hasEnoughSanity = sanity >= 20;
  const isDisabled = !canUndo || !hasEnoughSanity;

  const handleUndo = () => {
    if (isDisabled) return;

    // Show the -20 sanity animation
    setShowCostAnimation(true);

    // Perform the undo
    undoTrash();

    // Reset animation after it completes
    setTimeout(() => {
      setShowCostAnimation(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {canUndo && (
        <div className="fixed bottom-28 right-6 z-40">
          {/* Floating -20 sanity animation */}
          <AnimatePresence>
            {showCostAnimation && (
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -60, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none z-50"
              >
                <span className="text-red-500 font-bold text-lg font-typewriter whitespace-nowrap drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  -20 sanity
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleUndo}
            disabled={isDisabled}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border-2 ${
              isDisabled
                ? "bg-secondary/50 border-border/50 cursor-not-allowed opacity-60"
                : "bg-secondary/90 border-amber-500/50 hover:border-amber-500 hover:bg-secondary shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            }`}
            title={!hasEnoughSanity ? "Not enough sanity (need 20)" : "Undo last deletion (-20 sanity)"}
          >
            <Undo2
              className={`w-5 h-5 ${
                isDisabled ? "text-muted-foreground/50" : "text-amber-500"
              }`}
            />
            <div className="flex flex-col items-start">
              <span className={`text-[10px] font-typewriter uppercase tracking-wider ${
                isDisabled ? "text-muted-foreground/50" : "text-amber-500"
              }`}>
                Undo
              </span>
              <span className={`text-[8px] font-mono ${
                isDisabled ? "text-muted-foreground/30" : "text-amber-500/70"
              }`}>
                -20 sanity
              </span>
            </div>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};
