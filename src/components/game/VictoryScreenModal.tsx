import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseData, CredibilityStats } from "@/types/game";
import { useAudioContext } from "@/contexts/AudioContext";
import {
  getRandomSuccessComments,
  generateHeadline,
  generateVisitorCount,
  RANK_TITLES,
  type Comment,
} from "@/utils/resultScreen";
import { getStarRating } from "@/constants/game";

interface VictoryScreenModalProps {
  caseData: CaseData;
  isVictory: boolean;
  sanityRemaining: number;
  connectionsFound: number;
  credibilityStats: CredibilityStats;
  onNextCase: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
  hasNextCase?: boolean;
}

// Score line component for animated tallying
interface ScoreLineProps {
  label: string;
  value: number;
  isPositive?: boolean;
  delay: number;
  onComplete?: () => void;
}

const ScoreLine = ({ label, value, isPositive = true, delay, onComplete }: ScoreLineProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);

      // Animate the number counting up
      const duration = 500;
      const steps = 20;
      const stepValue = value / steps;
      let currentStep = 0;

      const countInterval = setInterval(() => {
        currentStep++;
        setDisplayValue(Math.round(stepValue * currentStep));

        if (currentStep >= steps) {
          clearInterval(countInterval);
          setDisplayValue(value);
          onComplete?.();
        }
      }, duration / steps);

      return () => clearInterval(countInterval);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [value, delay, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="flex justify-between items-center font-mono text-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-[#333] uppercase tracking-wide">{label}</span>
      <span className={`font-bold ${isPositive ? 'text-[#006400]' : 'text-[#8b0000]'}`}>
        {isPositive ? '+' : '-'}{displayValue} pts
      </span>
    </motion.div>
  );
};

// Star rating display component
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  delay: number;
}

const StarRating = ({ rating, maxRating = 5, delay }: StarRatingProps) => {
  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setFilledStars(current);
        if (current >= rating) {
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [rating, delay]);

  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={i < filledStars ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: i < filledStars ? 0 : 0.1 }}
        >
          <Star
            className={`w-8 h-8 ${
              i < filledStars
                ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                : 'text-gray-400'
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

export const VictoryScreenModal = ({
  caseData,
  isVictory,
  sanityRemaining,
  connectionsFound,
  credibilityStats,
  onNextCase,
  onRetry,
  onBackToMenu,
  hasNextCase = true
}: VictoryScreenModalProps) => {
  const [showStamp, setShowStamp] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [comments] = useState<Comment[]>(() => getRandomSuccessComments(4));

  const { playSFX } = useAudioContext();

  // Calculate scores
  const caseResolvedBonus = 1000;
  const junkBinnedScore = credibilityStats.trashedJunkCount * 100;
  const mistakesPenalty = credibilityStats.junkRemaining * 100;
  const timeBonus = Math.max(0, Math.floor(sanityRemaining * 5));
  const totalScore = caseResolvedBonus + junkBinnedScore - mistakesPenalty + timeBonus;
  const starRating = getStarRating(totalScore);
  const rankTitle = RANK_TITLES[starRating];

  // Animation sequence
  useEffect(() => {
    // Step 1: Blog loads first
    const stampTimer = setTimeout(() => {
      setShowStamp(true);
      playSFX("connect_success");
    }, 1500);

    // Step 2: Report slides in after 1 second
    const reportTimer = setTimeout(() => {
      setShowReport(true);
      playSFX("printer_start");
    }, 2500);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(reportTimer);
    };
  }, [playSFX]);

  // Handle score tallying completion
  const handleScoreTallyComplete = useCallback((lineIndex: number) => {
    if (lineIndex === 3) { // After time bonus line
      setTimeout(() => setShowFinalScore(true), 300);
      setTimeout(() => setShowStars(true), 800);
      setTimeout(() => setShowRank(true), 2200);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#1a1510] to-[#0d0a08] z-50 overflow-auto">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Main dual-pane container */}
        <motion.div
          className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* LEFT PANE: The Viral Truth (Blog Post) */}
          <motion.div
            className="flex-1 lg:flex-[1.1]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#1a1a2e] rounded shadow-2xl overflow-hidden border-2 border-[#16213e]">
              {/* Browser-style header */}
              <div className="bg-gradient-to-b from-[#2d2d44] to-[#1a1a2e] px-3 py-2 border-b border-[#333355] flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c940]" />
                </div>
                <div className="flex-1 bg-[#0d0d1a] rounded px-2 py-0.5 font-mono text-xs text-[#00ff00] truncate">
                  http://www.truth-seeker-gazette.darkweb/manifesto.html
                </div>
              </div>

              {/* Dark hacker-style content area */}
              <div className="bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] p-4 md:p-6 relative min-h-[400px]">
                {/* Site header */}
                <div className="text-center mb-4">
                  <span className="text-xs font-mono text-[#ff00ff] animate-pulse">
                    &#9733;&#24427; TRUTH SEEKER GAZETTE &#24427;&#9733;
                  </span>
                  <div className="text-[8px] font-mono text-[#666] mt-1">
                    [ VISITOR #{generateVisitorCount()} ]
                  </div>
                </div>

                {/* Headline */}
                <motion.h1
                  className="font-marker text-xl md:text-2xl lg:text-3xl text-[#00ffff] text-center mb-4 leading-tight drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  style={{ textShadow: "0 0 20px rgba(0, 255, 255, 0.5)" }}
                >
                  {generateHeadline(caseData, true)}
                </motion.h1>

                {/* Evidence collage */}
                <div className="bg-[#111122] border-2 border-dashed border-[#333355] p-4 mb-4 relative">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {caseData.nodes.filter(n => !n.isRedHerring).slice(0, 3).map((node, i) => (
                      <motion.div
                        key={node.id}
                        className="w-16 h-16 md:w-20 md:h-20 bg-[#1a1a2e] flex items-center justify-center text-3xl md:text-4xl border border-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.3)]"
                        initial={{ rotate: -15 + i * 15, scale: 0 }}
                        animate={{ rotate: -15 + i * 15, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                      >
                        {node.type === 'photo' ? '📷' : node.type === 'document' ? '📄' : '📝'}
                      </motion.div>
                    ))}
                    {/* Red string connecting them */}
                    <div className="absolute inset-4 pointer-events-none">
                      <svg className="w-full h-full" style={{ position: 'absolute' }}>
                        <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#ff0000" strokeWidth="2" strokeDasharray="5,5" filter="drop-shadow(0 0 4px #ff0000)" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center font-mono text-[10px] text-[#666] mt-2 italic">
                    [ CLASSIFIED EVIDENCE - LEAKED ]
                  </p>
                </div>

                {/* VIRAL HIT stamp */}
                <AnimatePresence>
                  {showStamp && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ scale: 4, rotate: -45, opacity: 0 }}
                      animate={{ scale: 1, rotate: -12, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <div className="font-marker text-3xl md:text-5xl px-4 md:px-6 py-2 md:py-3 border-4 md:border-8 rounded-lg text-[#ff00ff] border-[#ff00ff] bg-[#ff00ff]/20 shadow-[0_0_30px_rgba(255,0,255,0.5)]">
                        VIRAL HIT!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Comments section */}
                <div className="bg-[#0d0d1a] border border-[#333355] mb-4">
                  <div className="bg-[#1a1a2e] text-[#00ff00] font-mono text-xs px-2 py-1 border-b border-[#333355]">
                    &gt;&gt; REACTIONS ({comments.length})
                  </div>
                  <div className="p-2 space-y-2 max-h-32 overflow-y-auto">
                    {comments.map((comment, i) => (
                      <motion.div
                        key={i}
                        className="border-b border-[#222233] pb-2 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.25 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#00ffff]">{comment.user}:</span>
                          <span className="text-[10px] text-[#666] ml-auto">+{comment.likes}</span>
                        </div>
                        <p className="font-typewriter text-xs text-[#aaaaaa]">{comment.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Motive reveal */}
                <motion.div
                  className="bg-[#1a0a0a] border border-[#ff0000] p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <p className="font-typewriter text-xs text-[#ff6666] text-center">
                    <strong className="text-[#ff0000]">MOTIVE UNCOVERED:</strong> {caseData.theTruth.motive}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* GeoCities footer */}
            <div className="text-center mt-2">
              <p className="font-mono text-[10px] text-[#666]">
                &#9733; Best viewed in Netscape Navigator 4.0 &#9733;
              </p>
              <div className="flex justify-center gap-2 mt-1">
                <span className="text-xs">🏗️</span>
                <span className="font-mono text-[8px] text-[#ff00ff]">UNDER CONSTRUCTION</span>
                <span className="text-xs">🏗️</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANE: The Debrief Report */}
          <AnimatePresence>
            {showReport && (
              <motion.div
                className="flex-1 lg:flex-[0.9]"
                initial={{ opacity: 0, y: -100, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div
                  className="bg-[#f5f5dc] rounded shadow-2xl overflow-hidden border-4 border-[#8b7355]"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 23px,
                        #e0d8c0 23px,
                        #e0d8c0 24px
                      ),
                      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")
                    `,
                    backgroundBlendMode: "overlay",
                  }}
                >
                  {/* Report header */}
                  <div className="bg-[#2c2c2c] px-4 py-2 border-b-4 border-double border-[#8b7355]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#c0c0c0]" />
                      <span className="font-mono text-sm text-[#c0c0c0] tracking-widest">
                        OFFICIAL DEBRIEF REPORT
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#888] mt-1">
                      CASE #{caseData.id.toUpperCase()} | CLASSIFICATION: DECLASSIFIED
                    </div>
                  </div>

                  {/* Report content */}
                  <div className="p-4 md:p-6 space-y-3 min-h-[350px]">
                    {/* Case title */}
                    <div className="border-b-2 border-dashed border-[#8b7355] pb-2 mb-4">
                      <div className="font-typewriter text-sm text-[#333] uppercase tracking-wide">
                        RE: {caseData.title}
                      </div>
                      <div className="font-mono text-[10px] text-[#666]">
                        STATUS: RESOLVED | DATE: {new Date().toLocaleDateString()}
                      </div>
                    </div>

                    {/* Animated score tallying */}
                    <div className="space-y-2 border-l-4 border-[#8b0000] pl-3 py-2 bg-white/50">
                      <ScoreLine
                        label="CASE RESOLVED:"
                        value={caseResolvedBonus}
                        delay={500}
                      />
                      <ScoreLine
                        label={`JUNK BINNED (x${credibilityStats.trashedJunkCount}):`}
                        value={junkBinnedScore}
                        delay={1000}
                      />
                      {mistakesPenalty > 0 && (
                        <ScoreLine
                          label={`JUNK REMAINING (x${credibilityStats.junkRemaining}):`}
                          value={mistakesPenalty}
                          isPositive={false}
                          delay={1500}
                        />
                      )}
                      <ScoreLine
                        label="SANITY BONUS:"
                        value={timeBonus}
                        delay={2000}
                        onComplete={() => handleScoreTallyComplete(3)}
                      />

                      {/* Divider line */}
                      <motion.div
                        className="border-t-2 border-dashed border-[#333] my-2"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: showFinalScore ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Final score */}
                      <AnimatePresence>
                        {showFinalScore && (
                          <motion.div
                            className="flex justify-between items-center font-mono"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <span className="text-[#333] font-bold uppercase tracking-wide">
                              FINAL SCORE:
                            </span>
                            <span className="font-marker text-2xl md:text-3xl text-[#8b0000]">
                              {totalScore} pts
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Star Rating */}
                    {showStars && (
                      <motion.div
                        className="py-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <StarRating rating={starRating} delay={0} />
                      </motion.div>
                    )}

                    {/* Rank Title */}
                    <AnimatePresence>
                      {showRank && (
                        <motion.div
                          className="text-center"
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="inline-block border-4 border-double border-[#8b0000] px-4 md:px-6 py-2 bg-[#fffdf0]">
                            <div className="font-mono text-[10px] text-[#666] mb-1">
                              CLASSIFICATION RANK
                            </div>
                            <div className="font-marker text-xl md:text-2xl text-[#8b0000]">
                              {rankTitle}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Official stamp watermark */}
                    <div className="absolute bottom-20 right-6 opacity-10 pointer-events-none rotate-[-15deg]">
                      <div className="font-marker text-6xl text-[#8b0000]">
                        CLASSIFIED
                      </div>
                    </div>
                  </div>

                  {/* Report footer */}
                  <div className="bg-[#e8e0c8] px-4 py-2 border-t-2 border-[#8b7355]">
                    <div className="font-mono text-[8px] text-[#666] text-center">
                      THIS DOCUMENT IS THE PROPERTY OF THE TRUTH INVESTIGATION BUREAU
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          className="w-full max-w-6xl mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5 }}
        >
          <div className="bg-[#1a1510]/80 backdrop-blur-sm border-2 border-[#333] rounded-lg p-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={onBackToMenu}
                variant="outline"
                className="font-marker text-sm md:text-base border-[#555] text-[#ccc] hover:bg-[#333] hover:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                RETURN TO DESK
              </Button>

              {hasNextCase && (
                <Button
                  onClick={onNextCase}
                  className="font-marker text-sm md:text-base bg-[#006400] hover:bg-[#004d00] text-white"
                >
                  NEXT CASE
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              <Button
                onClick={onRetry}
                variant="outline"
                className="font-marker text-sm md:text-base border-[#ff6600] text-[#ff6600] hover:bg-[#ff6600] hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                RETRY CASE
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
