import { motion, AnimatePresence } from "framer-motion";

interface TagMatchIndicatorProps {
  matchCount: number;
  maxTags: number;
  isVisible: boolean;
  position: { x: number; y: number };
}

export const TagMatchIndicator = ({
  matchCount,
  maxTags,
  isVisible,
  position
}: TagMatchIndicatorProps) => {
  const getColor = () => {
    if (matchCount === 0) return "text-red-500";
    if (matchCount >= maxTags) return "text-green-500";
    return "text-yellow-500";
  };

  const getGlow = () => {
    if (matchCount === 0) return "0 0 10px rgba(239, 68, 68, 0.8)";
    if (matchCount >= maxTags) return "0 0 15px rgba(34, 197, 94, 0.8)";
    return "0 0 10px rgba(234, 179, 8, 0.8)";
  };

  const getMessage = () => {
    if (matchCount === 0) return "NO MATCH";
    if (matchCount >= maxTags) return "MATCH!";
    return `${matchCount}/${maxTags} TAGS`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed pointer-events-none z-[9998] font-marker text-lg font-bold ${getColor()}`}
          style={{
            left: position.x,
            top: position.y,
            textShadow: getGlow(),
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -5, 0],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 0.2,
            y: { duration: 0.5, repeat: Infinity }
          }}
        >
          {getMessage()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
