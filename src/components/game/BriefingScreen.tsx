import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseData, ModifierId } from "@/types/game";
import { useAudioContext } from "@/contexts/AudioContext";
import { useGameStore } from "@/store/gameStore";
import { ModifierSelector } from "./ModifierSelector";

interface BriefingScreenProps {
  caseData: CaseData;
  onExecute: () => void;
  onAbort: () => void;
}

// Helper to get difficulty stars as ASCII art
const getDifficultyIndicator = (difficulty: string): string => {
  const levels: Record<string, number> = {
    TUTORIAL: 1,
    EASY: 2,
    MEDIUM: 3,
    HARD: 4,
    EXTREME: 5,
  };
  const level = levels[difficulty.toUpperCase()] || 1;
  return "[" + "■".repeat(level) + "□".repeat(5 - level) + "]";
};

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 30, startDelay: number = 0) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay]);

  return { displayedText, isComplete };
};

export const BriefingScreen = ({ caseData, onExecute, onAbort }: BriefingScreenProps) => {
  const { playSFX, initialize, isInitialized } = useAudioContext();
  const { setActiveModifiers } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [bootSequence, setBootSequence] = useState(0);
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierId[]>([]);

  // Typewriter effects for each section
  const headerText = useTypewriter(
    "*** CLASSIFIED // EYES ONLY ***",
    40,
    isLoading ? 0 : 800
  );
  const codenameText = useTypewriter(
    caseData.title.toUpperCase(),
    25,
    isLoading ? 0 : 1600
  );
  const intelText = useTypewriter(
    caseData.description,
    15,
    isLoading ? 0 : 2200
  );
  const objectiveText = useTypewriter(
    `Establish ${caseData.boardState.maxConnectionsNeeded} verified connection${caseData.boardState.maxConnectionsNeeded > 1 ? 's' : ''} to expose THE TRUTH.`,
    20,
    isLoading ? 0 : 3200
  );

  // Boot sequence messages
  const bootMessages = [
    "> INITIALIZING SECURE TERMINAL...",
    "> DECRYPTING FILE HEADERS...",
    "> BYPASSING SECURITY PROTOCOLS...",
    "> ACCESSING CLASSIFIED DATABASE...",
    "> FILE LOADED SUCCESSFULLY.",
  ];

  // Play hard drive seek sound and run boot sequence
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }

    // Play HDD seek sound
    playSFX("hdd_seek");

    // Boot sequence animation
    const bootInterval = setInterval(() => {
      setBootSequence((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setIsLoading(false);
            setShowContent(true);
            // Play a "beep" when content shows
            playSFX("button_click");
          }, 500);
          return prev;
        }
        // Play small click for each boot message
        playSFX("button_click");
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(bootInterval);
  }, [playSFX, initialize, isInitialized, bootMessages.length]);

  const handleExecute = useCallback(() => {
    playSFX("access_granted");
    // Set the active modifiers in the game store before starting
    setActiveModifiers(selectedModifiers);
    // Small delay for the sound to play
    setTimeout(onExecute, 400);
  }, [onExecute, playSFX, setActiveModifiers, selectedModifiers]);

  const handleAbort = useCallback(() => {
    playSFX("button_click");
    onAbort();
  }, [onAbort, playSFX]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
      {/* CRT Monitor Frame */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="crt-monitor w-full h-full max-w-6xl max-h-[90vh] p-1 relative"
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
            <div className="relative z-[1] w-full h-full p-6 md:p-8 lg:p-10 overflow-y-auto">
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
                    <div className="terminal-text text-base md:text-lg lg:text-xl space-y-2">
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
                  /* Main Briefing Content */
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    {/* DOS Window Header */}
                    <div className="dos-window mb-4">
                      <div className="bg-[#00aa00] px-2 py-1 flex items-center justify-between">
                        <span className="pixel-font text-xs md:text-sm text-black">
                          SECURE_FILE_VIEWER.EXE
                        </span>
                        <div className="flex gap-1">
                          <span className="text-black text-xs">─</span>
                          <span className="text-black text-xs">□</span>
                          <span className="text-black text-xs">×</span>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6">
                        {/* Classified Header */}
                        <div className="text-center">
                          <motion.div
                            className={`terminal-text pixel-font text-sm md:text-base lg:text-lg ${headerText.isComplete ? 'classified-flash' : ''}`}
                            style={{ color: '#ff3333', textShadow: '0 0 10px rgba(255, 0, 0, 0.8)' }}
                          >
                            {headerText.displayedText}
                          </motion.div>
                        </div>

                        {/* File Codename */}
                        <div className="border-b border-[#00ff00]/30 pb-4">
                          <div className="terminal-text text-sm md:text-base text-[#00aa00]">
                            {'>'} FILE CODENAME:
                          </div>
                          <div className="terminal-text text-xl md:text-2xl lg:text-3xl mt-2 tracking-wider">
                            {codenameText.displayedText}
                            {!codenameText.isComplete && <span className="typing-cursor" />}
                          </div>
                          <div className="terminal-text text-sm md:text-base text-[#00aa00] mt-2">
                            {'>'} CLEARANCE: {getDifficultyIndicator(caseData.difficulty)} {caseData.difficulty}
                          </div>
                        </div>

                        {/* Intel Section */}
                        <div className="border-b border-[#00ff00]/30 pb-4">
                          <div className="terminal-text text-sm md:text-base text-[#00aa00]">
                            {'>'} THE INTEL:
                          </div>
                          <div className="terminal-text text-base md:text-lg lg:text-xl mt-2 leading-relaxed">
                            {intelText.displayedText}
                            {!intelText.isComplete && codenameText.isComplete && (
                              <span className="typing-cursor" />
                            )}
                          </div>
                        </div>

                        {/* Mission Objective */}
                        <div>
                          <div className="terminal-text text-sm md:text-base text-[#00aa00]">
                            {'>'} MISSION OBJECTIVE:
                          </div>
                          <div className="terminal-text text-base md:text-lg lg:text-xl mt-2" style={{ color: '#ffff00' }}>
                            {objectiveText.displayedText}
                            {!objectiveText.isComplete && intelText.isComplete && (
                              <span className="typing-cursor" />
                            )}
                          </div>
                          <div className="terminal-text text-sm md:text-base text-[#00aa00] mt-3">
                            {'>'} EVIDENCE COUNT: {caseData.nodes.length} items
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Challenge Modifiers */}
                    {objectiveText.isComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="mb-4"
                      >
                        <ModifierSelector
                          selectedModifiers={selectedModifiers}
                          onModifiersChange={setSelectedModifiers}
                        />
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: objectiveText.isComplete ? 1 : 0.3, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="mt-auto flex flex-col sm:flex-row gap-3 justify-center"
                    >
                      <button
                        onClick={handleExecute}
                        disabled={!objectiveText.isComplete}
                        className="dos-button text-lg md:text-xl px-8 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        [ EXECUTE PROTOCOL ]
                      </button>
                      <button
                        onClick={handleAbort}
                        className="dos-button text-lg md:text-xl px-8 py-4"
                        style={{
                          color: '#ff6666',
                          borderColor: '#ff6666',
                          textShadow: '0 0 5px rgba(255, 100, 100, 0.8)',
                        }}
                      >
                        [ ABORT MISSION ]
                      </button>
                    </motion.div>

                    {/* Footer text */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-6 text-center"
                    >
                      <div className="terminal-text text-xs md:text-sm text-[#006600]">
                        UNAUTHORIZED ACCESS WILL BE PROSECUTED
                      </div>
                      <div className="terminal-text text-xs md:text-sm text-[#006600]">
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
