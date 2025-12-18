import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Target,
  Brain,
  Trash2,
  Users
} from "lucide-react";
import type { CaseData } from "@/types/game";
import type { CaseCompletionStats } from "@/hooks/useGameProgress";
import { useAudioContext } from "@/contexts/AudioContext";
import { useResponsive } from "@/hooks/useResponsive";
import { RANK_TITLES } from "@/utils/resultScreen";

interface CaseArchiveProps {
  cases: CaseData[];
  completedCases: string[];
  caseStats: Record<string, CaseCompletionStats>;
  onBack: () => void;
}

const difficultyConfig = {
  TUTORIAL: { level: 1, label: "TUTORIAL", color: "#00ff00" },
  EASY: { level: 2, label: "EASY", color: "#00cc00" },
  MEDIUM: { level: 3, label: "MEDIUM", color: "#ffff00" },
  HARD: { level: 4, label: "HARD", color: "#ff6600" },
  EXTREME: { level: 5, label: "EXTREME", color: "#ff0000" },
};

// Get evidence images from a case
const getEvidenceImages = (caseData: CaseData): string[] => {
  return caseData.nodes
    .filter(node => node.contentUrl && node.type === 'photo')
    .map(node => node.contentUrl as string)
    .slice(0, 4); // Max 4 images
};

export const CaseArchive = ({ cases, completedCases, caseStats, onBack }: CaseArchiveProps) => {
  const { playSFX, initialize, isInitialized } = useAudioContext();
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequence, setBootSequence] = useState(0);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);
  const { isMobile } = useResponsive();

  // Filter to only completed cases
  const completedCasesList = cases.filter(c => completedCases.includes(c.id));

  // Boot sequence messages
  const bootMessages = [
    "> ACCESSING CASE_ARCHIVE.DAT...",
    "> DECRYPTING CLASSIFIED FILES...",
    "> LOADING PHOTOGRAPHIC EVIDENCE...",
    "> RECONSTRUCTING CASE REPORTS...",
    "> ARCHIVE READY.",
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

  const handleSelectCase = useCallback((index: number) => {
    playSFX("button_click");
    setSelectedCaseIndex(index);
  }, [playSFX]);

  const handleCloseCase = useCallback(() => {
    playSFX("button_click");
    setSelectedCaseIndex(null);
  }, [playSFX]);

  const handleBack = useCallback(() => {
    playSFX("button_click");
    onBack();
  }, [onBack, playSFX]);

  const handlePrevCase = useCallback(() => {
    if (selectedCaseIndex !== null && selectedCaseIndex > 0) {
      playSFX("button_click");
      setSelectedCaseIndex(selectedCaseIndex - 1);
    }
  }, [selectedCaseIndex, playSFX]);

  const handleNextCase = useCallback(() => {
    if (selectedCaseIndex !== null && selectedCaseIndex < completedCasesList.length - 1) {
      playSFX("button_click");
      setSelectedCaseIndex(selectedCaseIndex + 1);
    }
  }, [selectedCaseIndex, completedCasesList.length, playSFX]);

  // Selected case data
  const selectedCase = selectedCaseIndex !== null ? completedCasesList[selectedCaseIndex] : null;
  const selectedStats = selectedCase ? caseStats[selectedCase.id] : null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* CRT Monitor Frame - Fullscreen */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="crt-monitor w-full h-full relative"
      >
        {/* Monitor bezel */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 p-2 md:p-4">
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
          <div className="crt-monitor w-full h-full rounded-sm relative overflow-hidden crt-flicker">
            {/* CRT Effects */}
            <div className="crt-scanlines" />
            <div className="crt-glow" />

            {/* Screen content */}
            <div className="relative z-[1] w-full h-full p-4 md:p-8 lg:p-12 flex flex-col">
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
                    <div className="dos-window flex-1 flex flex-col min-h-0 max-w-6xl mx-auto w-full">
                      <div className="bg-[#aa6600] px-3 py-1.5 flex items-center justify-between shrink-0">
                        <span className="pixel-font text-[10px] md:text-xs text-black flex items-center gap-2">
                          <FolderOpen className="w-3 h-3 md:w-4 md:h-4" />
                          CASE_ARCHIVE.EXE
                        </span>
                        <div className="flex gap-2">
                          <span className="text-black text-sm">─</span>
                          <span className="text-black text-sm">□</span>
                          <span className="text-black text-sm">×</span>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 flex-1 flex flex-col min-h-0">
                        {/* Header */}
                        <div className="text-center mb-4 shrink-0">
                          <motion.div
                            className="terminal-text pixel-font text-sm md:text-lg"
                            style={{ color: '#ffaa00', textShadow: '0 0 10px rgba(255, 170, 0, 0.8)' }}
                          >
                            *** CLASSIFIED CASE ARCHIVE ***
                          </motion.div>
                          <div className="terminal-text text-sm md:text-base text-[#00aa00] mt-2">
                            {'>'} {completedCasesList.length} CASE{completedCasesList.length !== 1 ? 'S' : ''} RESOLVED
                          </div>
                        </div>

                        {completedCasesList.length === 0 ? (
                          /* No completed cases */
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <motion.div
                              className="text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <FolderOpen className="w-16 h-16 text-[#444] mx-auto mb-4" />
                              <div className="terminal-text text-lg text-[#666]">
                                NO CASES IN ARCHIVE
                              </div>
                              <div className="terminal-text text-sm text-[#444] mt-2">
                                COMPLETE INVESTIGATIONS TO BUILD YOUR ARCHIVE
                              </div>
                            </motion.div>
                          </div>
                        ) : selectedCase ? (
                          /* Case Detail View */
                          <CaseDetailView
                            caseData={selectedCase}
                            stats={selectedStats}
                            onClose={handleCloseCase}
                            onPrev={selectedCaseIndex! > 0 ? handlePrevCase : undefined}
                            onNext={selectedCaseIndex! < completedCasesList.length - 1 ? handleNextCase : undefined}
                            caseNumber={selectedCaseIndex! + 1}
                            totalCases={completedCasesList.length}
                            isMobile={isMobile}
                          />
                        ) : (
                          /* Case List */
                          <div className="flex-1 overflow-y-auto min-h-0 border border-[#ffaa00]/30 bg-black/30 rounded">
                            <div className="p-2 sm:p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                              {completedCasesList.map((caseData, index) => {
                                const stats = caseStats[caseData.id];
                                const config = difficultyConfig[caseData.difficulty.toUpperCase() as keyof typeof difficultyConfig] || difficultyConfig.EASY;

                                return (
                                  <motion.button
                                    key={caseData.id}
                                    className="case-folder-card text-left p-3 md:p-4 rounded transition-all duration-150 border-2 border-[#8b6914] bg-[#1a1408] hover:bg-[#2a2010] hover:border-[#ffaa00] active:scale-98"
                                    onClick={() => handleSelectCase(index)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -2 }}
                                  >
                                    {/* Folder tab */}
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-mono text-[10px] text-[#8b6914]">
                                        CASE #{String(cases.findIndex(c => c.id === caseData.id) + 1).padStart(3, '0')}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {stats && Array.from({ length: 5 }).map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-3 h-3 ${
                                              i < stats.starRating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-600'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>

                                    {/* Case title */}
                                    <div className="font-mono text-sm md:text-base text-[#ffcc00] font-bold mb-1 truncate">
                                      {caseData.title.toUpperCase()}
                                    </div>

                                    {/* Difficulty */}
                                    <div
                                      className="font-mono text-[10px] mb-2"
                                      style={{ color: config.color }}
                                    >
                                      CLEARANCE: {config.label}
                                    </div>

                                    {/* Score */}
                                    {stats && (
                                      <div className="font-mono text-xs text-[#00ff00]">
                                        SCORE: {stats.finalScore.toLocaleString()} pts
                                      </div>
                                    )}

                                    {/* Preview thumbnails */}
                                    <div className="flex gap-1 mt-2">
                                      {getEvidenceImages(caseData).slice(0, 3).map((img, i) => (
                                        <div
                                          key={i}
                                          className="w-8 h-8 bg-[#333] rounded overflow-hidden border border-[#555]"
                                        >
                                          <img
                                            src={img}
                                            alt=""
                                            className="w-full h-full object-cover opacity-70"
                                          />
                                        </div>
                                      ))}
                                      {getEvidenceImages(caseData).length > 3 && (
                                        <div className="w-8 h-8 bg-[#222] rounded flex items-center justify-center border border-[#555]">
                                          <span className="text-[10px] text-[#666]">+{getEvidenceImages(caseData).length - 3}</span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!selectedCase && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 flex justify-center shrink-0"
                      >
                        <button
                          onClick={handleBack}
                          className="dos-button text-base md:text-lg px-6 py-3"
                          style={{
                            color: '#ff6666',
                            borderColor: '#ff6666',
                            textShadow: '0 0 5px rgba(255, 100, 100, 0.8)',
                          }}
                        >
                          [ RETURN TO DESK ]
                        </button>
                      </motion.div>
                    )}

                    {/* Footer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 text-center shrink-0"
                    >
                      <div className="terminal-text text-xs md:text-sm text-[#664400]">
                        EVERY TRUTH UNCOVERED BRINGS US CLOSER
                      </div>
                      <div className="terminal-text text-xs md:text-sm text-[#664400]">
                        © 1997 TRUTH_ARCHIVE_SYSTEM v2.0
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

// Case Detail View Component
interface CaseDetailViewProps {
  caseData: CaseData;
  stats: CaseCompletionStats | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  caseNumber: number;
  totalCases: number;
  isMobile: boolean;
}

const CaseDetailView = ({
  caseData,
  stats,
  onClose,
  onPrev,
  onNext,
  caseNumber,
  totalCases,
  isMobile,
}: CaseDetailViewProps) => {
  const evidenceImages = getEvidenceImages(caseData);
  const config = difficultyConfig[caseData.difficulty.toUpperCase() as keyof typeof difficultyConfig] || difficultyConfig.EASY;
  const rankTitle = stats ? RANK_TITLES[stats.starRating] : "UNKNOWN";

  return (
    <motion.div
      className="flex-1 flex flex-col min-h-0"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button
          onClick={onClose}
          className="dos-button px-3 py-2 text-sm flex items-center gap-2"
          style={{ color: '#ffaa00', borderColor: '#ffaa00' }}
        >
          <X className="w-4 h-4" />
          CLOSE
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className={`dos-button p-2 ${!onPrev ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{ color: '#00ff00', borderColor: '#00ff00' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-mono text-sm text-[#00ff00]">
            {caseNumber} / {totalCases}
          </span>
          <button
            onClick={onNext}
            disabled={!onNext}
            className={`dos-button p-2 ${!onNext ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{ color: '#00ff00', borderColor: '#00ff00' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Case content - scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`grid gap-4 md:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* Left side - Case file */}
          <div className="case-file-document bg-[#f5f0e0] rounded-sm overflow-hidden border-4 border-[#8b7355] shadow-xl">
            {/* Document header - tape effect */}
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#d4c4a8] opacity-60 -rotate-1" />
              <div className="bg-[#8b0000] text-white font-mono text-xs px-4 py-2 text-center">
                CLASSIFIED DOCUMENT
              </div>
            </div>

            {/* Document content */}
            <div
              className="p-4 md:p-6 space-y-4"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 23px,
                    #d4c4a8 23px,
                    #d4c4a8 24px
                  )
                `,
              }}
            >
              {/* Case header */}
              <div className="border-b-2 border-dashed border-[#8b7355] pb-3">
                <div className="font-typewriter text-lg md:text-xl text-[#333] font-bold">
                  {caseData.title.toUpperCase()}
                </div>
                <div className="font-mono text-xs text-[#666] mt-1">
                  CASE ID: {caseData.id.toUpperCase()}
                </div>
              </div>

              {/* The Truth */}
              <div className="bg-[#fff8dc] border-l-4 border-[#8b0000] p-3">
                <div className="font-mono text-[10px] text-[#8b0000] mb-1">THE TRUTH:</div>
                <div className="font-typewriter text-sm text-[#333] leading-relaxed">
                  <span className="font-bold">{caseData.theTruth.subject}</span>{' '}
                  {caseData.theTruth.action}{' '}
                  <span className="font-bold">{caseData.theTruth.target}</span>
                </div>
                <div className="font-typewriter text-xs text-[#666] mt-2 italic">
                  Motive: {caseData.theTruth.motive}
                </div>
              </div>

              {/* Case description */}
              <div>
                <div className="font-mono text-[10px] text-[#666] mb-1">BRIEFING:</div>
                <div className="font-typewriter text-sm text-[#444] leading-relaxed">
                  {caseData.description}
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#666]" />
                <span className="font-mono text-xs text-[#666]">DIFFICULTY:</span>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: config.color === '#ffff00' ? '#cc9900' : config.color }}
                >
                  {config.label}
                </span>
              </div>

              {/* Completion date */}
              {stats && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#666]" />
                  <span className="font-mono text-xs text-[#666]">RESOLVED:</span>
                  <span className="font-mono text-xs text-[#333]">
                    {new Date(stats.completedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* RESOLVED stamp */}
              <div className="relative mt-4">
                <div className="absolute top-0 right-0 transform rotate-[-15deg]">
                  <div className="font-marker text-2xl md:text-3xl px-4 py-1 border-4 text-[#006400] border-[#006400] opacity-80">
                    RESOLVED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Stats and Photos */}
          <div className="space-y-4">
            {/* Stats card */}
            {stats && (
              <div className="bg-[#0a0a14] rounded border-2 border-[#333355] overflow-hidden">
                <div className="bg-[#1a1a2e] px-3 py-2 border-b border-[#333355]">
                  <span className="font-mono text-xs text-[#00ffff]">CASE STATISTICS</span>
                </div>
                <div className="p-4 space-y-3">
                  {/* Star rating */}
                  <div className="flex items-center justify-center gap-1 py-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < stats.starRating
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Rank */}
                  <div className="text-center border-y border-[#333355] py-2">
                    <div className="font-mono text-[10px] text-[#666]">CLASSIFICATION RANK</div>
                    <div className="font-marker text-xl text-[#ff00ff]">{rankTitle}</div>
                  </div>

                  {/* Score breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[#888] flex items-center gap-1">
                        <FileText className="w-3 h-3" /> FINAL SCORE
                      </span>
                      <span className="font-mono text-sm text-[#00ff00] font-bold">
                        {stats.finalScore.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[#888] flex items-center gap-1">
                        <Brain className="w-3 h-3" /> SANITY LEFT
                      </span>
                      <span className="font-mono text-xs text-[#00ccff]">
                        {stats.sanityRemaining}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[#888] flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> JUNK CLEARED
                      </span>
                      <span className="font-mono text-xs text-[#00ff00]">
                        {stats.junkBinned}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[#888] flex items-center gap-1">
                        <Users className="w-3 h-3" /> FOLLOWERS
                      </span>
                      <span className="font-mono text-xs text-[#ff00ff]">
                        +{stats.followersGained.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence photos */}
            {evidenceImages.length > 0 && (
              <div className="bg-[#1a1408] rounded border-2 border-[#8b6914] overflow-hidden">
                <div className="bg-[#2a2010] px-3 py-2 border-b border-[#8b6914]">
                  <span className="font-mono text-xs text-[#ffaa00]">PHOTOGRAPHIC EVIDENCE</span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {evidenceImages.map((img, i) => (
                      <motion.div
                        key={i}
                        className="aspect-square bg-[#111] rounded overflow-hidden border border-[#444] relative"
                        initial={{ opacity: 0, rotate: -5 + Math.random() * 10 }}
                        animate={{ opacity: 1, rotate: -3 + i * 2 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                      >
                        <img
                          src={img}
                          alt={`Evidence ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Photo corner effect */}
                        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/30" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/30" />
                      </motion.div>
                    ))}
                  </div>
                  {evidenceImages.length === 0 && (
                    <div className="text-center py-4 text-[#666] font-mono text-xs">
                      NO PHOTOGRAPHIC EVIDENCE
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Evidence nodes summary */}
            <div className="bg-[#0a140a] rounded border-2 border-[#006600] overflow-hidden">
              <div className="bg-[#102010] px-3 py-2 border-b border-[#006600]">
                <span className="font-mono text-xs text-[#00ff00]">EVIDENCE MANIFEST</span>
              </div>
              <div className="p-3 max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  {caseData.nodes.filter(n => !n.isRedHerring).slice(0, 5).map((node, i) => (
                    <div key={node.id} className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#00aa00]">
                        {node.type === 'photo' ? '📷' : node.type === 'document' ? '📄' : '📝'}
                      </span>
                      <span className="font-mono text-xs text-[#00cc00] truncate flex-1">
                        {node.title}
                      </span>
                    </div>
                  ))}
                  {caseData.nodes.filter(n => !n.isRedHerring).length > 5 && (
                    <div className="font-mono text-[10px] text-[#006600] italic">
                      +{caseData.nodes.filter(n => !n.isRedHerring).length - 5} more items...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
