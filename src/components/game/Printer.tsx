import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseData } from "@/types/game";

type PrinterState = "idle" | "printing" | "waiting";

interface PrinterProps {
  nextCase: CaseData | null;
  onAcceptCase: (caseData: CaseData) => void;
  onRejectCase: () => void;
}

export const Printer = ({ nextCase, onAcceptCase, onRejectCase }: PrinterProps) => {
  const [printerState, setPrinterState] = useState<PrinterState>("idle");
  const [showBrief, setShowBrief] = useState(false);

  useEffect(() => {
    if (nextCase && printerState === "idle") {
      // Start printing after a short delay
      const timer = setTimeout(() => {
        setPrinterState("printing");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [nextCase, printerState]);

  useEffect(() => {
    if (printerState === "printing") {
      // Finish printing after animation
      const timer = setTimeout(() => {
        setPrinterState("waiting");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [printerState]);

  const handlePaperClick = () => {
    if (printerState === "waiting") {
      setShowBrief(true);
    }
  };

  const handleAccept = () => {
    if (nextCase) {
      setShowBrief(false);
      setPrinterState("idle");
      onAcceptCase(nextCase);
    }
  };

  const handleReject = () => {
    setShowBrief(false);
    setPrinterState("idle");
    onRejectCase();
  };

  const getDifficultyHats = (difficulty: string) => {
    const hatCount = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : difficulty === "Hard" ? 3 : 4;
    return "🎩".repeat(hatCount);
  };

  return (
    <>
      {/* Dot Matrix Printer */}
      <div className="absolute bottom-[15%] left-[15%] w-32 h-16">
        {/* Printer Body */}
        <div className="relative w-full h-full bg-[#d4c8a8] rounded-sm shadow-lg border-2 border-[#8b7355]">
          {/* Printer Details */}
          <div className="absolute top-1 left-2 w-8 h-1 bg-[#2a2a2a] rounded-full" />
          <div className="absolute top-1 right-2 flex gap-1">
            <div className={`w-2 h-2 rounded-full ${printerState === "printing" ? "bg-green-500 animate-pulse" : "bg-green-900"}`} />
            <div className={`w-2 h-2 rounded-full ${printerState === "printing" ? "bg-red-500 animate-pulse" : "bg-red-900"}`} />
          </div>
          
          {/* Paper Slot */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-2 bg-[#1a1a1a] rounded-t-sm" />
          
          {/* Paper Coming Out */}
          <AnimatePresence>
            {(printerState === "printing" || printerState === "waiting") && nextCase && (
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ 
                  y: printerState === "waiting" ? 10 : -30,
                  opacity: 1 
                }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ 
                  duration: printerState === "printing" ? 2 : 0.3,
                  ease: "linear"
                }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 cursor-pointer"
                onClick={handlePaperClick}
              >
                <motion.div
                  animate={printerState === "waiting" ? { 
                    y: [0, -2, 0],
                    rotate: [0, 1, -1, 0]
                  } : {}}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="bg-[#f5f0e5] p-2 shadow-md border border-[#ccc]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      transparent,
                      transparent 8px,
                      #e0e0e0 8px,
                      #e0e0e0 9px
                    )`
                  }}
                >
                  <p className="text-[6px] font-mono text-ink uppercase tracking-wider">
                    CASE #{nextCase.id.replace("case_", "")}
                  </p>
                  <p className="text-[5px] font-mono text-ink/70 mt-1 line-clamp-2">
                    {nextCase.title}
                  </p>
                  <p className="text-[4px] font-mono text-string-red mt-1">
                    CLICK TO REVIEW
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Label */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <p className="text-[5px] font-mono text-[#5a4a3a] tracking-widest">DOT-MATRIX 9000</p>
          </div>
        </div>
        
        {/* Printer Sound Indicator */}
        {printerState === "printing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="absolute -right-8 top-1/2 -translate-y-1/2 text-[8px] font-mono text-paper/50"
          >
            BRRR-ZT
          </motion.div>
        )}
      </div>

      {/* Case Brief Modal */}
      <AnimatePresence>
        {showBrief && nextCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm"
            onClick={() => setShowBrief(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
              className="bg-[#f5f0e5] p-6 max-w-md mx-4 shadow-2xl transform"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    transparent,
                    transparent 24px,
                    #e8e0d0 24px,
                    #e8e0d0 25px
                  )
                `
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Red "CLASSIFIED" stamp */}
              <div className="absolute -top-3 -right-3 bg-string-red text-paper text-xs font-bold px-3 py-1 rotate-12 shadow-md">
                CLASSIFIED
              </div>

              <div className="border-b-2 border-ink/20 pb-3 mb-4">
                <p className="text-xs font-mono text-ink/50 uppercase tracking-widest">
                  Case Brief #{nextCase.id.replace("case_", "")}
                </p>
                <h2 className="text-xl font-bold font-mono text-ink mt-1">
                  {nextCase.title}
                </h2>
                <p className="text-sm text-ink/70 mt-1">
                  Difficulty: {getDifficultyHats(nextCase.difficulty)} {nextCase.difficulty}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-mono text-ink leading-relaxed">
                  {nextCase.description}
                </p>
              </div>

              <div className="bg-ink/5 p-3 rounded mb-4">
                <p className="text-xs font-mono text-ink/70 uppercase tracking-wider mb-1">
                  Mission Objective:
                </p>
                <p className="text-sm font-mono text-ink">
                  Uncover {nextCase.boardState.maxConnectionsNeeded} connections to expose the truth.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  className="flex-1 bg-green-700 text-paper py-3 px-4 font-mono text-sm uppercase tracking-wider hover:bg-green-600 transition-colors"
                >
                  Accept Mission
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReject}
                  className="flex-1 bg-ink/20 text-ink py-3 px-4 font-mono text-sm uppercase tracking-wider hover:bg-ink/30 transition-colors"
                >
                  Reject
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
