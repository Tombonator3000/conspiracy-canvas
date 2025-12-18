import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";
import type { CaseData } from "@/types/game";
import { useAudioContext } from "@/contexts/AudioContext";

interface FilingCabinetProps {
  cases: CaseData[];
  completedCases: string[];
  onSelectCase: (caseData: CaseData) => void;
  onBack: () => void;
}

const difficultyConfig = {
  TUTORIAL: { level: 1, label: "TUTORIAL" },
  EASY: { level: 2, label: "EASY" },
  MEDIUM: { level: 3, label: "MEDIUM" },
  HARD: { level: 4, label: "HARD" },
  EXTREME: { level: 5, label: "EXTREME" },
};

// Helper to get difficulty indicator
const getDifficultyIndicator = (difficulty: string): string => {
  const config = difficultyConfig[difficulty.toUpperCase() as keyof typeof difficultyConfig] || difficultyConfig.EASY;
  return "[" + "■".repeat(config.level) + "□".repeat(5 - config.level) + "]";
};

export const FilingCabinet = ({ cases, completedCases, onSelectCase, onBack }: FilingCabinetProps) => {
  const { playSFX, initialize, isInitialized } = useAudioContext();
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequence, setBootSequence] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isCaseUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedCases.includes(cases[index - 1].id);
  };

  const isCaseCompleted = (caseId: string) => completedCases.includes(caseId);

  // Boot sequence messages
  const bootMessages = [
    "> INITIALIZING CASE_FILE_BROWSER.EXE...",
    "> SCANNING CLASSIFIED DIRECTORIES...",
    "> VERIFYING SECURITY CLEARANCE...",
    "> LOADING FILE MANIFEST...",
    "> READY.",
  ];

  // Play boot sequence
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }

    playSFX("hdd_seek");

    const bootInterval = setInterval(() => {
      setBootSequence((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setIsLoading(false);
            playSFX("button_click");
          }, 400);
          return prev;
        }
        playSFX("button_click");
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(bootInterval);
  }, [playSFX, initialize, isInitialized, bootMessages.length]);

  const handleSelectCase = useCallback((caseData: CaseData, index: number) => {
    if (!isCaseUnlocked(index)) {
      playSFX("error");
      return;
    }
    playSFX("button_click");
    setSelectedIndex(index);
    setTimeout(() => {
      playSFX("access_granted");
      onSelectCase(caseData);
    }, 300);
  }, [onSelectCase, playSFX, cases, completedCases]);

  const handleBack = useCallback(() => {
    playSFX("button_click");
    onBack();
  }, [onBack, playSFX]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* CRT Monitor Frame - Full Screen */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="crt-monitor w-full h-full relative"
      >
        {/* Monitor bezel */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 p-4">
          {/* Power LED */}
          <div className="absolute bottom-3 right-6 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'hdd-activity' : 'bg-green-500'}`} />
            <span className="text-[8px] text-gray-500 font-mono">PWR</span>
          </div>

          {/* HDD Activity LED */}
          <div className="absolute bottom-3 right-20 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'hdd-activity' : 'bg-gray-700'}`} />
            <span className="text-[8px] text-gray-500 font-mono">HDD</span>
          </div>

          {/* Screen area */}
          <div className="crt-monitor w-full h-full rounded relative overflow-hidden crt-flicker">
            {/* CRT Effects */}
            <div className="crt-scanlines" />
            <div className="crt-glow" />

            {/* Screen content */}
            <div className="relative z-[1] w-full h-full p-4 md:p-6 flex flex-col">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  /* Boot Sequence */
                  <motion.div
                    key="boot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="crt-boot"
                  >
                    <div className="terminal-text text-sm md:text-base space-y-1">
                      {bootMessages.slice(0, bootSequence + 1).map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          {msg}
                        </motion.div>
                      ))}
                      {bootSequence < bootMessages.length - 1 && (
                        <span className="typing-cursor" />
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* Main Content */
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    {/* DOS Window Header */}
                    <div className="dos-window flex-1 flex flex-col min-h-0">
                      <div className="bg-[#00aa00] px-2 py-1 flex items-center justify-between shrink-0">
                        <span className="pixel-font text-[8px] md:text-[10px] text-black">
                          CASE_FILE_BROWSER.EXE
                        </span>
                        <div className="flex gap-1">
                          <span className="text-black text-xs">─</span>
                          <span className="text-black text-xs">□</span>
                          <span className="text-black text-xs">×</span>
                        </div>
                      </div>

                      <div className="p-3 md:p-4 flex-1 flex flex-col min-h-0">
                        {/* Header */}
                        <div className="text-center mb-4 shrink-0">
                          <motion.div
                            className="terminal-text pixel-font text-xs md:text-sm classified-flash"
                            style={{ color: '#ff3333', textShadow: '0 0 10px rgba(255, 0, 0, 0.8)' }}
                          >
                            *** CASE FILES // SELECT INVESTIGATION ***
                          </motion.div>
                          <div className="terminal-text text-xs text-[#00aa00] mt-2">
                            {'>'} STATUS: {completedCases.length}/{cases.length} CASES SOLVED
                          </div>
                        </div>

                        {/* File listing - scrollable */}
                        <div className="flex-1 overflow-y-auto min-h-0 border border-[#00ff00]/30 bg-black/30 rounded">
                          <div className="p-2">
                            {/* Table header */}
                            <div className="terminal-text text-[10px] md:text-xs text-[#00aa00] border-b border-[#00aa00]/50 pb-1 mb-2 grid grid-cols-12 gap-1">
                              <span className="col-span-2">FILE</span>
                              <span className="col-span-4">CODENAME</span>
                              <span className="col-span-2">CLEARANCE</span>
                              <span className="col-span-2">EVIDENCE</span>
                              <span className="col-span-2">STATUS</span>
                            </div>

                            {/* File entries */}
                            {cases.map((caseData, index) => {
                              const unlocked = isCaseUnlocked(index);
                              const completed = isCaseCompleted(caseData.id);
                              const isSelected = selectedIndex === index;

                              return (
                                <motion.button
                                  key={caseData.id}
                                  className={`
                                    w-full text-left grid grid-cols-12 gap-1 py-2 px-1 rounded
                                    transition-all duration-100
                                    ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                                    ${isSelected ? 'bg-[#00ff00] text-black' : ''}
                                    ${unlocked && !isSelected ? 'hover:bg-[#00ff00]/20' : ''}
                                  `}
                                  onClick={() => handleSelectCase(caseData, index)}
                                  disabled={!unlocked}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={unlocked ? { x: 4 } : {}}
                                >
                                  {/* File number */}
                                  <span className={`col-span-2 font-mono text-[10px] md:text-xs ${isSelected ? 'text-black' : 'terminal-text'}`}>
                                    {String(index + 1).padStart(3, '0')}.DAT
                                  </span>

                                  {/* Codename */}
                                  <span className={`col-span-4 font-mono text-[10px] md:text-xs truncate ${isSelected ? 'text-black font-bold' : unlocked ? 'terminal-text' : 'text-[#004400]'}`}>
                                    {unlocked ? caseData.title.toUpperCase() : "██████████████"}
                                  </span>

                                  {/* Clearance */}
                                  <span className={`col-span-2 font-mono text-[10px] md:text-xs ${isSelected ? 'text-black' : unlocked ? 'text-[#ffff00]' : 'text-[#444400]'}`}
                                    style={!isSelected && unlocked ? { textShadow: '0 0 5px rgba(255, 255, 0, 0.5)' } : {}}>
                                    {unlocked ? getDifficultyIndicator(caseData.difficulty) : "[□□□□□]"}
                                  </span>

                                  {/* Evidence count */}
                                  <span className={`col-span-2 font-mono text-[10px] md:text-xs ${isSelected ? 'text-black' : unlocked ? 'terminal-text' : 'text-[#004400]'}`}>
                                    {unlocked ? `${caseData.nodes.length} ITEMS` : "?? ITEMS"}
                                  </span>

                                  {/* Status */}
                                  <span className={`col-span-2 font-mono text-[10px] md:text-xs flex items-center gap-1`}>
                                    {!unlocked ? (
                                      <>
                                        <Lock className="w-3 h-3 text-[#ff3333]" />
                                        <span className={isSelected ? 'text-black' : 'text-[#ff3333]'} style={!isSelected ? { textShadow: '0 0 5px rgba(255, 0, 0, 0.5)' } : {}}>
                                          LOCKED
                                        </span>
                                      </>
                                    ) : completed ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 text-[#00ff00]" />
                                        <span className={isSelected ? 'text-black' : 'terminal-text'}>
                                          SOLVED
                                        </span>
                                      </>
                                    ) : (
                                      <span className={isSelected ? 'text-black' : 'text-[#ffff00]'} style={!isSelected ? { textShadow: '0 0 5px rgba(255, 255, 0, 0.5)' } : {}}>
                                        OPEN
                                      </span>
                                    )}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selected file info panel */}
                        {selectedIndex !== null && isCaseUnlocked(selectedIndex) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-2 border border-[#00ff00]/50 bg-black/50 shrink-0"
                          >
                            <div className="terminal-text text-xs">
                              {'>'} SELECTED: {cases[selectedIndex].title.toUpperCase()}
                            </div>
                            <div className="terminal-text text-[10px] text-[#00aa00] mt-1 line-clamp-2">
                              {cases[selectedIndex].description}
                            </div>
                            <div className="terminal-text text-[10px] text-[#ffff00] mt-1">
                              {'>'} OBJECTIVE: Establish {cases[selectedIndex].boardState.maxConnectionsNeeded} connection(s)
                            </div>
                          </motion.div>
                        )}

                        {/* Hint text */}
                        <div className="mt-3 terminal-text text-[10px] text-[#006600] text-center shrink-0">
                          COMPLETE CASES IN SEQUENCE TO UNLOCK CLASSIFIED FILES
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 flex flex-col sm:flex-row gap-3 justify-center shrink-0"
                    >
                      <button
                        onClick={handleBack}
                        className="dos-button text-sm md:text-base px-4 py-2"
                        style={{
                          color: '#ff6666',
                          borderColor: '#ff6666',
                          textShadow: '0 0 5px rgba(255, 100, 100, 0.8)',
                        }}
                      >
                        [ RETURN TO DESK ]
                      </button>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-3 text-center shrink-0"
                    >
                      <div className="terminal-text text-[10px] text-[#006600]">
                        THE DEEPER YOU GO, THE STRANGER IT GETS
                      </div>
                      <div className="terminal-text text-[10px] text-[#006600]">
                        © 1997 DEEP_STATE_OS v3.14
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
