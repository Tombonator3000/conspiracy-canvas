import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/store/achievementStore";
import type { AchievementId } from "@/types/game";

interface AchievementToastProps {
  achievementId: AchievementId;
  onDismiss: () => void;
}

export const AchievementToast = ({ achievementId, onDismiss }: AchievementToastProps) => {
  const achievement = ACHIEVEMENTS[achievementId];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0, scale: 0.8 }}
      className="fixed bottom-24 right-4 z-[1000] max-w-sm cursor-pointer"
      onClick={onDismiss}
    >
      <div className="bg-gradient-to-r from-yellow-900/90 to-amber-800/90 backdrop-blur-md border-2 border-yellow-500 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-500/20 px-4 py-2 flex items-center gap-2 border-b border-yellow-500/30">
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            {achievement.icon}
          </motion.span>
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
            Achievement Unlocked!
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-yellow-100 mb-1">
            {achievement.title}
          </h3>
          <p className="text-sm text-yellow-200/70">
            {achievement.description}
          </p>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 1.5, repeat: 2 }}
        />
      </div>
    </motion.div>
  );
};
