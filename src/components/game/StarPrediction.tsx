import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useMemo } from "react";

interface StarPredictionProps {
  className?: string;
}

// Score thresholds for star ratings
const STAR_THRESHOLDS = [
  { stars: 5, min: 2000, title: "ILLUMINATI CONFIRMED" },
  { stars: 4, min: 1500, title: "WHISTLEBLOWER" },
  { stars: 3, min: 1000, title: "INVESTIGATOR" },
  { stars: 2, min: 500, title: "CURIOUS OBSERVER" },
  { stars: 1, min: 0, title: "SKEPTIC" },
];

export const StarPrediction = ({ className = "" }: StarPredictionProps) => {
  const { score, sanity, junkBinned, mistakes, initialSanity } = useGameStore();

  // Calculate predicted final score
  const predictedScore = useMemo(() => {
    // Base: 1000 + Sanity*10 + Junk*100 - Mistakes*200
    // Use current values to predict
    return 1000 + (sanity * 10) + (junkBinned * 100) - (mistakes * 200);
  }, [sanity, junkBinned, mistakes]);

  // Get current star rating
  const currentRating = useMemo(() => {
    for (const threshold of STAR_THRESHOLDS) {
      if (predictedScore >= threshold.min) {
        return threshold;
      }
    }
    return STAR_THRESHOLDS[STAR_THRESHOLDS.length - 1];
  }, [predictedScore]);

  // Get next tier info
  const nextTier = useMemo(() => {
    const currentIndex = STAR_THRESHOLDS.findIndex(t => t.stars === currentRating.stars);
    if (currentIndex > 0) {
      return STAR_THRESHOLDS[currentIndex - 1];
    }
    return null;
  }, [currentRating]);

  // Calculate progress to next tier
  const progressToNext = useMemo(() => {
    if (!nextTier) return 100;
    const currentMin = currentRating.min;
    const nextMin = nextTier.min;
    const range = nextMin - currentMin;
    const progress = ((predictedScore - currentMin) / range) * 100;
    return Math.max(0, Math.min(100, progress));
  }, [predictedScore, currentRating, nextTier]);

  const pointsToNext = nextTier ? nextTier.min - predictedScore : 0;

  // Star color based on rating
  const starColor = useMemo(() => {
    switch (currentRating.stars) {
      case 5: return "#ffd700"; // Gold
      case 4: return "#c0c0c0"; // Silver
      case 3: return "#cd7f32"; // Bronze
      default: return "#6b7280"; // Gray
    }
  }, [currentRating.stars]);

  return (
    <motion.div
      className={`bg-black/90 backdrop-blur-sm border border-amber-900/50 px-3 py-2 rounded font-mono ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-amber-400 text-sm">⭐</span>
        <span
          className="text-amber-300 text-xs uppercase tracking-wider"
          style={{ fontFamily: "'VT323', monospace" }}
        >
          Score Trajectory
        </span>
      </div>

      {/* Current score and rating */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs">
          <span className="text-gray-500">Current: </span>
          <span
            className="text-white font-bold"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            {predictedScore.toLocaleString()} pts
          </span>
        </div>

        {/* Star display */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              className="text-xs"
              style={{
                color: star <= currentRating.stars ? starColor : "#374151",
                textShadow: star <= currentRating.stars
                  ? `0 0 6px ${starColor}`
                  : "none",
              }}
              animate={star <= currentRating.stars ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 0.5,
                delay: star * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              ★
            </motion.span>
          ))}
        </div>
      </div>

      {/* Rating title */}
      <div
        className="text-[10px] text-amber-400/80 mb-1.5 text-center"
        style={{
          fontFamily: "'VT323', monospace",
          letterSpacing: "0.1em",
        }}
      >
        {currentRating.title}
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <>
          <div className="h-1.5 bg-gray-800/80 rounded overflow-hidden mb-1">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                boxShadow: "0 0 6px rgba(245, 158, 11, 0.5)",
              }}
            />
          </div>

          <div className="text-[9px] text-gray-500 text-center">
            <span className="text-amber-400">+{pointsToNext}</span> pts to{" "}
            <span className="text-gray-400">
              {"★".repeat(nextTier.stars)}
            </span>
          </div>
        </>
      )}

      {/* Max rating achieved */}
      {!nextTier && (
        <div
          className="text-[10px] text-center text-amber-400 font-bold"
          style={{
            textShadow: "0 0 8px rgba(245, 158, 11, 0.6)",
            fontFamily: "'VT323', monospace",
          }}
        >
          MAXIMUM RATING!
        </div>
      )}
    </motion.div>
  );
};
