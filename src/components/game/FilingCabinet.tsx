import { motion } from "framer-motion";
import { Lock, CheckCircle, Brain, Zap, Skull, FileQuestion } from "lucide-react";
import type { CaseData } from "@/types/game";

interface FilingCabinetProps {
  cases: CaseData[];
  completedCases: string[];
  onSelectCase: (caseData: CaseData) => void;
  onBack: () => void;
}

const difficultyConfig = {
  TUTORIAL: { icon: Brain, color: "text-[#00ff00]", hats: 1 },
  EASY: { icon: Zap, color: "text-accent", hats: 2 },
  MEDIUM: { icon: FileQuestion, color: "text-primary", hats: 3 },
  HARD: { icon: Skull, color: "text-destructive", hats: 4 },
};

// Tinfoil hat SVG component
const TinfoilHat = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${filled ? 'text-accent' : 'text-muted-foreground/30'}`}>
    <path 
      fill="currentColor" 
      d="M12 2L4 14h4l-2 8h12l-2-8h4L12 2z"
    />
  </svg>
);

export const FilingCabinet = ({ cases, completedCases, onSelectCase, onBack }: FilingCabinetProps) => {
  const isCaseUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedCases.includes(cases[index - 1].id);
  };

  const isCaseCompleted = (caseId: string) => completedCases.includes(caseId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] to-[#0d0a08] flex flex-col items-center justify-center p-8">
      {/* Back button */}
      <motion.button
        className="absolute top-6 left-6 font-mono text-[#00ff00] text-sm hover:bg-[#00ff00]/20 px-3 py-1 rounded"
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ x: -4 }}
      >
        ← RETURN TO DESK
      </motion.button>

      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="font-marker text-4xl text-[#00ff00] mb-2" style={{ textShadow: '0 0 20px rgba(0,255,0,0.5)' }}>
          CASE FILES
        </h1>
        <p className="font-mono text-muted-foreground text-sm">
          SELECT AN INVESTIGATION // {completedCases.length}/{cases.length} SOLVED
        </p>
      </motion.div>

      {/* Filing cabinet */}
      <div className="relative w-full max-w-4xl">
        {/* Cabinet frame */}
        <div className="bg-gradient-to-b from-[#5a5040] to-[#3a3020] rounded-lg p-2 shadow-2xl">
          <div className="bg-gradient-to-b from-[#4a4030] to-[#2a2010] rounded p-6">
            
            {/* Case files grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((caseData, index) => {
                const unlocked = isCaseUnlocked(index);
                const completed = isCaseCompleted(caseData.id);
                const difficulty = difficultyConfig[caseData.difficulty as keyof typeof difficultyConfig] || difficultyConfig.EASY;

                return (
                  <motion.div
                    key={caseData.id}
                    className="relative"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* File folder */}
                    <motion.button
                      className={`w-full relative ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => unlocked && onSelectCase(caseData)}
                      whileHover={unlocked ? { y: -8, rotateX: 5 } : {}}
                      whileTap={unlocked ? { scale: 0.98 } : {}}
                      disabled={!unlocked}
                    >
                      {/* Folder tab */}
                      <div className={`
                        absolute -top-3 left-4 px-4 py-1 rounded-t-lg font-mono text-xs
                        ${unlocked 
                          ? completed 
                            ? 'bg-[#4a7a4a] text-[#00ff00]' 
                            : 'bg-[#8a7a60] text-card-foreground'
                          : 'bg-[#4a4a4a] text-muted-foreground'
                        }
                      `}>
                        CASE #{String(index + 1).padStart(3, '0')}
                      </div>

                      {/* Folder body */}
                      <div className={`
                        pt-6 pb-4 px-4 rounded-lg rounded-tl-none border-2 transition-all
                        ${unlocked 
                          ? completed
                            ? 'bg-gradient-to-br from-[#3a5a3a] to-[#2a4a2a] border-[#4a7a4a]'
                            : 'bg-gradient-to-br from-[#d4c4a0] to-[#b4a480] border-[#8a7a60]'
                          : 'bg-gradient-to-br from-[#4a4a4a] to-[#3a3a3a] border-[#5a5a5a]'
                        }
                      `}>
                        {/* Lock overlay for locked cases */}
                        {!unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg rounded-tl-none">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <span className="font-mono text-xs text-muted-foreground">CLASSIFIED</span>
                            </div>
                          </div>
                        )}

                        {/* Completed stamp */}
                        {completed && (
                          <motion.div 
                            className="absolute top-8 right-2 transform rotate-12"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 12 }}
                          >
                            <div className="border-4 border-[#00ff00] text-[#00ff00] font-marker text-lg px-2 py-1 rounded opacity-80">
                              SOLVED
                            </div>
                          </motion.div>
                        )}

                        {/* Content */}
                        <div className={unlocked ? '' : 'opacity-40'}>
                          {/* Difficulty hats */}
                          <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <TinfoilHat key={i} filled={i < difficulty.hats} />
                            ))}
                          </div>

                          {/* Title */}
                          <h3 className={`font-marker text-lg mb-2 ${unlocked ? 'text-ink' : 'text-muted-foreground'}`}>
                            {unlocked ? caseData.title : '█████████'}
                          </h3>

                          {/* Description */}
                          <p className={`font-typewriter text-xs leading-relaxed mb-3 ${unlocked ? 'text-ink/70' : 'text-muted-foreground/50'}`}>
                            {unlocked ? caseData.description.slice(0, 80) + '...' : '████████████████████'}
                          </p>

                          {/* Stats */}
                          <div className={`flex justify-between font-mono text-[10px] ${unlocked ? 'text-ink/50' : 'text-muted-foreground/30'}`}>
                            <span>{caseData.nodes.length} EVIDENCE</span>
                            <span>{caseData.boardState.maxConnectionsNeeded} CONNECTIONS</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cabinet handle */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-20 bg-gradient-to-r from-[#8a8070] to-[#6a6050] rounded-r-lg shadow-lg" />
      </div>

      {/* Hint */}
      <motion.p
        className="font-mono text-xs text-muted-foreground mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Complete cases to unlock more classified files.<br />
        The deeper you go, the stranger it gets.
      </motion.p>
    </div>
  );
};
