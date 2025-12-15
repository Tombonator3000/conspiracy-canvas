import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Share2, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseData } from "@/types/game";

interface ResultScreenProps {
  caseData: CaseData;
  isVictory: boolean;
  sanityRemaining: number;
  connectionsFound: number;
  onNextCase: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
}

// Fake usernames for comments
const fakeUsers = [
  "TruthSeeker1997", "WakeUpSheeple", "AlienHunter420", "DeepStateWatcher", 
  "TinfoilTom", "ConspiracyCarl", "RedPillRick", "MatrixMaven",
  "SkepticalSue", "AreaFiftyWun", "IlluminatiInsider", "FlatEarthFred"
];

// Success comments
const successComments = [
  "OMG this is EXACTLY what I've been saying for YEARS!!!",
  "Finally someone with the courage to speak TRUTH 🙏",
  "I KNEW IT. Sending this to everyone I know.",
  "The mainstream media won't touch this. WAKE UP PEOPLE!",
  "This explains EVERYTHING. You're a hero.",
  "My third eye is now WIDE OPEN 👁️",
  "Shared. Liked. Subscribed. Tattooed on my forehead.",
  "The government doesn't want you to see this!!!",
  "I always suspected this. Now I have PROOF.",
  "This is the smoking gun we needed! 🔫💨"
];

// Fail comments
const failComments = [
  "What does this even mean? Unsubscribed.",
  "This is why nobody takes us seriously...",
  "Sir, this is a Wendy's.",
  "Have you considered touching grass?",
  "My cat could make a better theory and he's dead.",
  "This is the worst thing I've read since my own manifesto.",
  "Even the flat earthers think you're crazy.",
  "Reported for crimes against logic.",
];

const getRandomComments = (isVictory: boolean, count: number) => {
  const pool = isVictory ? successComments : failComments;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(comment => ({
    user: fakeUsers[Math.floor(Math.random() * fakeUsers.length)],
    text: comment,
    likes: Math.floor(Math.random() * (isVictory ? 999 : 5)),
  }));
};

const generateHeadline = (caseData: CaseData, isVictory: boolean) => {
  if (isVictory) {
    return `BREAKING: ${caseData.theTruth.subject} ${caseData.theTruth.action} ${caseData.theTruth.target}!!!`;
  }
  return "INCOHERENT RAMBLINGS POSTED, INTERNET COLLECTIVELY SIGHS";
};

export const ResultScreen = ({ 
  caseData, 
  isVictory, 
  sanityRemaining, 
  connectionsFound,
  onNextCase, 
  onRetry, 
  onBackToMenu 
}: ResultScreenProps) => {
  const [showStamp, setShowStamp] = useState(false);
  const [comments, setComments] = useState<Array<{ user: string; text: string; likes: number }>>([]);

  // Calculate scores
  const madnessScore = Math.min(100, Math.round(100 - sanityRemaining + (connectionsFound * 10)));
  const logicScore = Math.max(0, Math.round(sanityRemaining / 10) + Math.floor(Math.random() * 15));
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

            {/* Stats panel */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="bg-white border-2 border-[#808080] p-3">
                <div className="font-mono text-[10px] text-[#666] uppercase">Logic Score</div>
                <div className={`font-marker text-2xl ${logicScore < 20 ? 'text-[#ff0000]' : 'text-[#008000]'}`}>
                  {logicScore}%
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
                VISITORS: {String(Math.floor(Math.random() * 900000) + 100000).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
