import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseData, CredibilityStats } from "@/types/game";
import {
  getRandomComments,
  generateHeadline,
  generateVisitorCount,
  type Comment,
} from "@/utils/resultScreen";

interface ResultScreenProps {
  caseData: CaseData;
  isVictory: boolean;
  sanityRemaining: number;
  connectionsFound: number;
  score: number;
  credibilityStats: CredibilityStats;
  onNextCase: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
}

export const ResultScreen = ({
  caseData,
  isVictory,
  sanityRemaining,
  connectionsFound,
  score,
  credibilityStats,
  onNextCase,
  onRetry,
  onBackToMenu
}: ResultScreenProps) => {
  const [showStamp, setShowStamp] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  // Calculate scores using new Credibility Engine
  const investigationScore = credibilityStats.connectionScore; // Points from connections
  const cleanupBonus = credibilityStats.cleanupBonus; // Points from trashing junk
  const credibilityLost = credibilityStats.mistakePenalty;
  const totalCredibility = credibilityStats.credibility ?? score;

  // Legacy scores for backward compatibility with comments
  const madnessScore = Math.min(100, Math.round(100 - sanityRemaining + (connectionsFound * 10)));
  const followersGained = isVictory
    ? Math.floor(Math.random() * 500) + 100
    : Math.floor(Math.random() * 5) - 10;

  useEffect(() => {
    setComments(getRandomComments(isVictory, 3));
    const timer = setTimeout(() => setShowStamp(true), 1500);
    return () => clearTimeout(timer);
  }, [isVictory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] to-[#0d0a08] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 90s style blog post container */}
        <div className="bg-[#f0f0f0] rounded shadow-2xl overflow-hidden border-4 border-[#c0c0c0]">
          {/* Browser-style header */}
          <div className="bg-gradient-to-b from-[#d4d4d4] to-[#b0b0b0] px-3 py-2 border-b-2 border-[#808080] flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]" />
            </div>
            <div className="flex-1 bg-white rounded px-2 py-0.5 font-mono text-xs text-[#333] truncate">
              http://www.truth-seeker-gazette.geocities.com/manifesto.html
            </div>
          </div>

          {/* Content area */}
          <div className="bg-[#ffffcc] p-6 relative" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #ffff99 20px, #ffff99 21px)'
          }}>
            {/* Under construction GIF placeholder */}
            <div className="text-center mb-4">
              <span className="text-xs font-mono text-[#ff00ff]">
                ★彡 TRUTH SEEKER GAZETTE 彡★
              </span>
            </div>

            {/* Headline */}
            <motion.h1 
              className="font-marker text-2xl md:text-3xl text-[#000080] text-center mb-4 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {generateHeadline(caseData, isVictory)}
            </motion.h1>

            {/* The "evidence collage" */}
            <div className="bg-white border-4 border-double border-[#808080] p-4 mb-4 relative">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {caseData.nodes.filter(n => !n.isRedHerring).slice(0, 3).map((node, i) => (
                  <motion.div 
                    key={node.id}
                    className="w-20 h-20 bg-[#ddd] flex items-center justify-center text-4xl border-2 border-[#999]"
                    initial={{ rotate: -10 + i * 10, scale: 0 }}
                    animate={{ rotate: -10 + i * 10, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                  >
                    {node.type === 'photo' ? '📷' : node.type === 'document' ? '📄' : '📝'}
                  </motion.div>
                ))}
                {/* Red string connecting them */}
                <div className="absolute inset-4 pointer-events-none">
                  <svg className="w-full h-full" style={{ position: 'absolute' }}>
                    <line x1="30%" y1="50%" x2="70%" y2="50%" stroke="red" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
              <p className="text-center font-mono text-xs text-[#666] mt-2 italic">
                [VISUAL EVIDENCE - DO NOT REDISTRIBUTE]
              </p>
            </div>

            {/* Credibility Breakdown Panel */}
            <div className="bg-white border-2 border-[#808080] p-4 mb-4">
              <div className="font-mono text-xs text-[#000080] font-bold uppercase mb-3 border-b border-[#ccc] pb-2">
                📊 CREDIBILITY BREAKDOWN
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#333]">Investigation Score:</span>
                  <span className="font-bold text-[#008000]">+{investigationScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#333]">Cleanup Bonus:</span>
                  <span className="font-bold text-[#008000]">+{cleanupBonus}</span>
                </div>
                {credibilityLost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#333]">Credibility Lost:</span>
                    <span className="font-bold text-[#ff0000]">-{credibilityLost}</span>
                  </div>
                )}
                <div className="border-t border-[#999] pt-2 mt-2 flex justify-between items-center">
                  <span className="text-[#000080] font-bold">TOTAL CREDIBILITY:</span>
                  <span className={`font-marker text-xl ${totalCredibility >= 500 ? 'text-[#008000]' : totalCredibility >= 0 ? 'text-[#ff6600]' : 'text-[#ff0000]'}`}>
                    {totalCredibility}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="bg-white border-2 border-[#808080] p-3">
                <div className="font-mono text-[10px] text-[#666] uppercase">Junk Cleared</div>
                <div className="font-marker text-2xl text-[#008000]">
                  {credibilityStats.trashedJunkCount}
                </div>
              </div>
              <div className="bg-white border-2 border-[#808080] p-3">
                <div className="font-mono text-[10px] text-[#666] uppercase">Madness</div>
                <div className={`font-marker text-2xl ${madnessScore > 80 ? 'text-[#ff00ff]' : 'text-[#666]'}`}>
                  {madnessScore}%
                </div>
              </div>
              <div className="bg-white border-2 border-[#808080] p-3">
                <div className="font-mono text-[10px] text-[#666] uppercase">Followers</div>
                <div className={`font-marker text-2xl ${followersGained > 0 ? 'text-[#008000]' : 'text-[#ff0000]'}`}>
                  {followersGained > 0 ? '+' : ''}{followersGained}
                </div>
              </div>
            </div>

            {/* Comments section */}
            <div className="bg-white border-2 border-[#808080] mb-4">
              <div className="bg-[#000080] text-white font-mono text-xs px-2 py-1">
                💬 COMMENTS ({comments.length})
              </div>
              <div className="p-2 space-y-2 max-h-40 overflow-y-auto">
                {comments.map((comment, i) => (
                  <motion.div 
                    key={i} 
                    className="border-b border-[#ddd] pb-2 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#0000ff] font-bold">{comment.user}:</span>
                      <span className="text-xs text-[#666] ml-auto">👍 {comment.likes}</span>
                    </div>
                    <p className="font-typewriter text-sm text-[#333]">{comment.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visitor counter */}
            <div className="text-center mb-4">
              <div className="inline-block bg-black text-[#00ff00] font-mono text-xs px-3 py-1">
                VISITORS: {generateVisitorCount()}
              </div>
            </div>

            {/* VIRAL/BANNED stamp */}
            <AnimatePresence>
              {showStamp && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ scale: 3, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: -15, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className={`
                    font-marker text-5xl md:text-6xl px-6 py-3 border-8 rounded-lg
                    ${isVictory 
                      ? 'text-[#ff00ff] border-[#ff00ff] bg-[#ff00ff]/10' 
                      : 'text-[#ff0000] border-[#ff0000] bg-[#ff0000]/10'
                    }
                  `}>
                    {isVictory ? 'VIRAL HIT!' : 'BANNED'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Motive reveal for victory */}
            {isVictory && (
              <motion.div 
                className="bg-[#ffcccc] border-2 border-[#ff0000] p-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <p className="font-typewriter text-sm text-[#660000] text-center">
                  <strong>MOTIVE UNCOVERED:</strong> {caseData.theTruth.motive}
                </p>
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="bg-[#d4d4d4] p-4 flex flex-wrap gap-3 justify-center border-t-2 border-[#808080]">
            {isVictory ? (
              <Button
                onClick={onNextCase}
                className="bg-[#008000] hover:bg-[#006000] text-white font-marker"
              >
                NEXT CASE <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={onRetry}
                className="bg-[#ff6600] hover:bg-[#cc5200] text-white font-marker"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> TRY AGAIN
              </Button>
            )}
            <Button
              onClick={onBackToMenu}
              variant="outline"
              className="font-marker border-[#808080] text-[#333]"
            >
              BACK TO FILES
            </Button>
          </div>
        </div>

        {/* GeoCities-style footer */}
        <div className="text-center mt-4">
          <p className="font-mono text-xs text-muted-foreground">
            ★ Best viewed in Netscape Navigator ★
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="text-xs">🏗️</span>
            <span className="font-mono text-[10px] text-[#ff00ff]">UNDER CONSTRUCTION</span>
            <span className="text-xs">🏗️</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
