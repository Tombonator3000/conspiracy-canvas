import { motion } from "framer-motion";

interface MadnessOverlayProps {
  sanity: number;
}

export const MadnessOverlay = ({ sanity }: MadnessOverlayProps) => {
  // Calculate intensity based on sanity (more intense as sanity drops)
  // Stop all effects when sanity reaches 0 (game over handled by GameOverScreen)
  const intensity = sanity > 0 ? Math.max(0, (100 - sanity) / 100) : 0;
  const isLow = sanity < 50 && sanity > 0;
  const isCritical = sanity < 25 && sanity > 0;

  return (
    <>
      {/* GAME OVER BLACKOUT - Removed, GameOverScreen handles this now */}

      {/* Vignette effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[90]"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, ${intensity * 0.6}) 100%)`,
        }}
        animate={{
          opacity: isLow ? 1 : 0,
        }}
        transition={{ duration: 1 }}
      />

      {/* Progressive blur effect as sanity decreases */}
      {isCritical && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[91]"
          style={{
            backdropFilter: `blur(${Math.max(0, (25 - sanity) / 25 * 8)}px)`,
            WebkitBackdropFilter: `blur(${Math.max(0, (25 - sanity) / 25 * 8)}px)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Noise overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[89] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          opacity: intensity * 0.3,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Red tint for critical state */}
      {isCritical && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[88]"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(196, 30, 58, 0.15) 100%)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Screen shake effect for very low sanity */}
      {isCritical && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[87]"
          animate={{
            x: [0, -2, 2, -1, 1, 0],
            y: [0, 1, -1, 2, -2, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
    </>
  );
};
