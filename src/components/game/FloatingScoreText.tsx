import { motion, AnimatePresence } from "framer-motion";
import type { FloatingScore } from "@/types/game";

interface FloatingScoreTextProps {
  scores: FloatingScore[];
}

export const FloatingScoreText = ({ scores }: FloatingScoreTextProps) => {
  return (
    <AnimatePresence>
      {scores.map((score) => (
        <motion.div
          key={score.id}
          className="fixed pointer-events-none z-[9999] font-marker text-3xl md:text-4xl font-bold"
          style={{
            left: score.x,
            top: score.y,
            textShadow: score.isPositive
              ? "0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.5)"
              : "0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.5)",
          }}
          initial={
            score.isPositive
              ? { opacity: 1, y: 0, scale: 1.2 }
              : { opacity: 1, y: 0, scale: 1.5, x: 0 }
          }
          animate={
            score.isPositive
              ? { opacity: 0, y: -80, scale: 1 }
              : {
                  opacity: 0,
                  y: 60,
                  scale: 0.8,
                  x: [0, -10, 10, -8, 8, -5, 5, 0], // Shake effect
                }
          }
          exit={{ opacity: 0 }}
          transition={
            score.isPositive
              ? { duration: 1.2, ease: "easeOut" }
              : { duration: 1.5, ease: "easeIn", x: { duration: 0.5 } }
          }
        >
          <span className={score.isPositive ? "text-green-500" : "text-red-500"}>
            {score.isPositive ? "+" : ""}
            {score.value}
          </span>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
