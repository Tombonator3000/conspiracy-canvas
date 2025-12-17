import { motion, AnimatePresence } from "framer-motion";
import { Undo2 } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export const UndoButton = () => {
  const { trashedNodes, sanity, undoTrash } = useGameStore();

  const canUndo = trashedNodes.length > 0;
  const hasEnoughSanity = sanity >= 20;
  const isDisabled = !canUndo || !hasEnoughSanity;

  return (
    <AnimatePresence>
      {canUndo && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => !isDisabled && undoTrash()}
          disabled={isDisabled}
          className={`fixed bottom-28 right-6 z-40 px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border-2 ${
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
      )}
    </AnimatePresence>
  );
};
