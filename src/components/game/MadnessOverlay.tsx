import { motion } from "framer-motion";

interface MadnessOverlayProps {
  sanity: number;
}

export const MadnessOverlay = ({ sanity }: MadnessOverlayProps) => {
  // Calculate intensity based on sanity (more intense as sanity drops)
  const intensity = Math.max(0, (100 - sanity) / 100);
  const isLow = sanity < 50;
  const isCritical = sanity < 25;
  const isVeryLow = sanity < 40;
  const isGameOver = sanity <= 0;

  // Chromatic aberration offset increases as sanity decreases
  const chromaticOffset = isVeryLow ? Math.min(4, (40 - sanity) / 10) : 0;

  return (
    <>
      {/* GAME OVER BLACKOUT - Removed, GameOverScreen handles this now */}

      {/* Chromatic Aberration Effect - RGB Split as sanity drops */}
      {isVeryLow && !isGameOver && (
        <>
          {/* Red channel - shifted left */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-[92]"
            style={{
              background: 'transparent',
              boxShadow: `inset ${-chromaticOffset}px 0 ${chromaticOffset * 2}px rgba(255, 0, 0, 0.15)`,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Cyan channel - shifted right */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-[92]"
            style={{
              background: 'transparent',
              boxShadow: `inset ${chromaticOffset}px 0 ${chromaticOffset * 2}px rgba(0, 255, 255, 0.15)`,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "linear",
              delay: 0.05,
            }}
          />
        </>
      )}

      {/* Vignette effect - enhanced at low sanity */}
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

      {/* Noise overlay - intensifies at low sanity */}
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

      {/* Heavy screen flicker at critical state */}
      {isCritical && !isGameOver && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[86] bg-black"
          animate={{
            opacity: [0, 0.05, 0, 0.08, 0, 0.03, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            times: [0, 0.1, 0.2, 0.5, 0.6, 0.8, 1],
          }}
        />
      )}
    </>
  );
};
