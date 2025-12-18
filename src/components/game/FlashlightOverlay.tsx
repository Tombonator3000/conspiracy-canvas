import { memo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface FlashlightOverlayProps {
  enabled: boolean;
  intensity?: number; // 0-100, controls darkness outside spotlight
  spotlightSize?: number; // Size of the light circle in pixels
  sanity?: number; // Optional: makes effect more dramatic at low sanity
}

/**
 * Flashlight/Spotlight Overlay
 * Creates a "working in the dark with a lamp" effect.
 * The spotlight follows the mouse cursor, leaving the rest of the screen darker.
 *
 * At low sanity, the spotlight becomes smaller and more erratic.
 */
export const FlashlightOverlay = memo(({
  enabled,
  intensity = 50,
  spotlightSize = 200,
  sanity = 100,
}: FlashlightOverlayProps) => {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isMoving, setIsMoving] = useState(false);

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsMoving(true);
  }, []);

  // Track touch movement for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setIsMoving(true);
    }
  }, []);

  // Reset movement state after a delay
  useEffect(() => {
    if (isMoving) {
      const timeout = setTimeout(() => setIsMoving(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isMoving, mousePos]);

  // Add event listeners
  useEffect(() => {
    if (enabled) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [enabled, handleMouseMove, handleTouchMove]);

  if (!enabled) return null;

  // Calculate dynamic values based on sanity
  const sanityFactor = Math.max(0.3, sanity / 100);

  // Spotlight shrinks as sanity drops
  const dynamicSize = spotlightSize * sanityFactor;

  // Darkness increases as sanity drops
  const darkness = (intensity / 100) * (1 + (1 - sanityFactor) * 0.5);

  // Add jitter/shake at low sanity
  const jitterX = sanity < 30 ? (Math.random() - 0.5) * (30 - sanity) * 0.5 : 0;
  const jitterY = sanity < 30 ? (Math.random() - 0.5) * (30 - sanity) * 0.5 : 0;

  // Flicker effect at very low sanity
  const flickerOpacity = sanity < 20 ? 0.85 + Math.random() * 0.15 : 1;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9994]"
      initial={{ opacity: 0 }}
      animate={{ opacity: flickerOpacity }}
      transition={{ duration: 0.3 }}
      style={{
        background: `
          radial-gradient(
            circle ${dynamicSize}px at ${mousePos.x + jitterX}px ${mousePos.y + jitterY}px,
            transparent 0%,
            transparent 30%,
            rgba(0, 0, 0, ${darkness * 0.3}) 50%,
            rgba(0, 0, 0, ${darkness * 0.6}) 70%,
            rgba(0, 0, 0, ${darkness * 0.85}) 100%
          )
        `,
      }}
    >
      {/* Inner glow ring around spotlight */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: mousePos.x + jitterX - dynamicSize,
          top: mousePos.y + jitterY - dynamicSize,
          width: dynamicSize * 2,
          height: dynamicSize * 2,
          background: `
            radial-gradient(
              circle at center,
              rgba(255, 248, 220, 0.03) 0%,
              rgba(255, 240, 200, 0.02) 40%,
              transparent 70%
            )
          `,
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />

      {/* Dust particles visible in the light beam */}
      {sanity < 60 && (
        <FlashlightDust
          x={mousePos.x}
          y={mousePos.y}
          size={dynamicSize}
          sanity={sanity}
        />
      )}
    </motion.div>
  );
});

FlashlightOverlay.displayName = "FlashlightOverlay";

/**
 * Dust particles that are visible within the flashlight beam
 * Creates the effect of dust floating in the light
 */
const FlashlightDust = memo(({
  x,
  y,
  size,
  sanity
}: {
  x: number;
  y: number;
  size: number;
  sanity: number;
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    offsetX: number;
    offsetY: number;
    particleSize: number;
    opacity: number;
    duration: number;
  }>>([]);

  // Generate particles when component mounts
  useEffect(() => {
    const count = Math.floor(8 + (100 - sanity) / 10); // More particles at low sanity
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      offsetX: (Math.random() - 0.5) * size * 1.5,
      offsetY: (Math.random() - 0.5) * size * 1.5,
      particleSize: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [size, sanity]);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: x + particle.offsetX,
            top: y + particle.offsetY,
            width: particle.particleSize,
            height: particle.particleSize,
            background: `radial-gradient(circle, rgba(255, 250, 240, ${particle.opacity}) 0%, transparent 70%)`,
            filter: "blur(0.5px)",
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 30, 0],
            y: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
});

FlashlightDust.displayName = "FlashlightDust";
