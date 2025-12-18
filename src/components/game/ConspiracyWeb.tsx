import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

interface ConspiracyWebProps {
  className?: string;
}

export const ConspiracyWeb = ({ className = "" }: ConspiracyWebProps) => {
  const {
    conspiracyWebPercent,
    foundTags,
    requiredTags,
  } = useGameStore();

  // Generate hint display for missing tags
  const getTagHints = () => {
    return requiredTags.map((tag, index) => {
      const isFound = foundTags.includes(tag);

      if (isFound) {
        return `[${tag.toUpperCase()}]`;
      }

      // Show vague hints based on completion
      if (conspiracyWebPercent > 75) {
        return `[${tag.charAt(0)}???]`;
      } else if (conspiracyWebPercent > 50) {
        return `[${tag.charAt(0)}...]`;
      } else if (conspiracyWebPercent > 25) {
        return "[???]";
      }
      return "[???]";
    });
  };

  const tagHints = getTagHints();

  // Color based on progress
  const getProgressColor = () => {
    if (conspiracyWebPercent >= 75) return "from-green-600 to-green-400";
    if (conspiracyWebPercent >= 50) return "from-yellow-600 to-yellow-400";
    if (conspiracyWebPercent >= 25) return "from-orange-600 to-orange-400";
    return "from-red-600 to-red-400";
  };

  const getGlowColor = () => {
    if (conspiracyWebPercent >= 75) return "rgba(34, 197, 94, 0.5)";
    if (conspiracyWebPercent >= 50) return "rgba(234, 179, 8, 0.5)";
    if (conspiracyWebPercent >= 25) return "rgba(249, 115, 22, 0.5)";
    return "rgba(239, 68, 68, 0.5)";
  };

  return (
    <motion.div
      className={`bg-black/90 backdrop-blur-sm border border-green-900/50 px-3 py-2 rounded font-mono ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-green-400 text-sm">🕸️</span>
        <span
          className="text-green-300 text-xs uppercase tracking-wider"
          style={{ fontFamily: "'VT323', monospace" }}
        >
          Conspiracy Web
        </span>
        <span
          className="text-white text-xs font-bold ml-auto"
          style={{
            fontFamily: "'VT323', monospace",
            textShadow: `0 0 8px ${getGlowColor()}`,
          }}
        >
          {conspiracyWebPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-800/80 rounded overflow-hidden mb-2 relative">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)",
            backgroundSize: "10% 100%",
          }}
        />

        {/* Progress fill */}
        <motion.div
          className={`h-full bg-gradient-to-r ${getProgressColor()} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${conspiracyWebPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            boxShadow: `0 0 10px ${getGlowColor()}, inset 0 0 5px rgba(255,255,255,0.3)`,
          }}
        >
          {/* Animated shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 3,
            }}
          />
        </motion.div>
      </div>

      {/* Missing tags hint */}
      <div className="text-[10px] leading-tight">
        <span className="text-gray-500">Missing: </span>
        {tagHints.map((hint, i) => (
          <span
            key={i}
            className={`mr-1 ${
              foundTags.includes(requiredTags[i])
                ? "text-green-400"
                : conspiracyWebPercent > 50
                ? "text-yellow-500"
                : "text-gray-600"
            }`}
            style={{ fontFamily: "'VT323', monospace" }}
          >
            {hint}
          </span>
        ))}
      </div>

      {/* Completion message */}
      {conspiracyWebPercent === 100 && (
        <motion.div
          className="text-center text-green-400 text-xs mt-1 font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
            fontFamily: "'VT323', monospace",
          }}
        >
          THE TRUTH IS REVEALED!
        </motion.div>
      )}
    </motion.div>
  );
};
