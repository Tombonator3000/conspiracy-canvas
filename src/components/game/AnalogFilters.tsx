import { memo, useMemo } from "react";
import { motion } from "framer-motion";

interface AnalogFiltersProps {
  sanity: number;
  enableFilmGrain?: boolean;
  enableVignette?: boolean;
  enableDust?: boolean;
  enableScanlines?: boolean;
  intensity?: number; // 0-100 from settings
}

// Particle types for variety
type ParticleType = "dust" | "fiber" | "mote" | "ash";

interface Particle {
  id: number;
  type: ParticleType;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  rotation: number;
  wobble: number; // Horizontal wobble amount
  startY: number; // Starting position (0-100%)
}

/**
 * 90s Analog Aesthetic Filter Overlay
 * Creates the "VHS basement conspiracy" feel with:
 * - Film grain (animated noise)
 * - Vignette (dark corners)
 * - Enhanced floating particles (dust, fibers, motes, ash)
 * - Optional CRT scanlines
 */
export const AnalogFilters = memo(({
  sanity,
  enableFilmGrain = true,
  enableVignette = true,
  enableDust = true,
  enableScanlines = false,
  intensity: settingsIntensity = 75,
}: AnalogFiltersProps) => {
  // Base intensity from settings (0-1)
  const baseIntensity = settingsIntensity / 100;

  // Intensify effects as sanity decreases (scaled by settings intensity)
  const sanityFactor = Math.max(0, (100 - sanity) / 100);
  const grainOpacity = (0.04 + (sanityFactor * 0.1)) * baseIntensity;
  const vignetteDarkness = (0.25 + (sanityFactor * 0.35)) * baseIntensity;

  // Generate enhanced particle system with variety
  const particles = useMemo(() => {
    if (!enableDust) return [];

    // More particles at lower sanity
    const baseCount = 15;
    const bonusCount = Math.floor(sanityFactor * 10);
    const totalCount = baseCount + bonusCount;

    const particleTypes: ParticleType[] = ["dust", "fiber", "mote", "ash"];

    return Array.from({ length: totalCount }, (_, i): Particle => {
      // Distribute particle types
      const type = particleTypes[i % particleTypes.length];

      // Size varies by type
      const sizeMap: Record<ParticleType, { min: number; max: number }> = {
        dust: { min: 2, max: 5 },
        fiber: { min: 1, max: 3 },
        mote: { min: 3, max: 7 },
        ash: { min: 2, max: 4 },
      };
      const { min, max } = sizeMap[type];
      const size = min + Math.random() * (max - min);

      // Duration varies by type (fibers fall slower)
      const durationMap: Record<ParticleType, { min: number; max: number }> = {
        dust: { min: 15, max: 30 },
        fiber: { min: 20, max: 40 },
        mote: { min: 10, max: 20 },
        ash: { min: 12, max: 25 },
      };
      const durRange = durationMap[type];
      const duration = durRange.min + Math.random() * (durRange.max - durRange.min);

      // Wobble amount (horizontal movement)
      const wobbleMap: Record<ParticleType, number> = {
        dust: 30,
        fiber: 80, // Fibers drift more
        mote: 20,
        ash: 50,
      };

      return {
        id: i,
        type,
        left: `${Math.random() * 100}%`,
        size,
        duration,
        delay: Math.random() * duration,
        drift: -80 + Math.random() * 160, // More varied drift
        opacity: 0.2 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        wobble: wobbleMap[type] * (0.5 + Math.random() * 0.5),
        startY: Math.random() * 30, // Start at different heights
      };
    });
  }, [enableDust, sanityFactor]);

  return (
    <>
      {/* Film Grain Overlay */}
      {enableFilmGrain && (
        <div
          className="film-grain"
          style={{
            '--film-grain-opacity': grainOpacity,
          } as React.CSSProperties}
        />
      )}

      {/* Vignette Overlay */}
      {enableVignette && (
        <div
          className="vignette-overlay"
          style={{
            '--vignette-darkness': vignetteDarkness,
          } as React.CSSProperties}
        />
      )}

      {/* CRT Scanlines (optional) */}
      {enableScanlines && (
        <div
          className="crt-lines"
          style={{
            '--scanline-opacity': (0.15 + (sanityFactor * 0.1)) * baseIntensity,
          } as React.CSSProperties}
        />
      )}

      {/* Enhanced Particle System */}
      {enableDust && particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          particle={particle}
          sanity={sanity}
          baseIntensity={baseIntensity}
        />
      ))}
    </>
  );
});

AnalogFilters.displayName = "AnalogFilters";

/**
 * Individual floating particle with type-specific behavior
 */
const FloatingParticle = memo(({
  particle,
  sanity,
  baseIntensity,
}: {
  particle: Particle;
  sanity: number;
  baseIntensity: number;
}) => {
  // More erratic movement at low sanity
  const chaosMultiplier = sanity < 40 ? 1 + (40 - sanity) / 40 : 1;

  // Particle-specific styles
  const getParticleStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "fixed",
      left: particle.left,
      pointerEvents: "none",
      zIndex: 9995,
      opacity: particle.opacity * baseIntensity,
    };

    switch (particle.type) {
      case "dust":
        return {
          ...baseStyle,
          width: particle.size,
          height: particle.size,
          background: `radial-gradient(circle, rgba(255, 250, 240, 0.8) 0%, rgba(255, 250, 240, 0) 70%)`,
          borderRadius: "50%",
          filter: "blur(1px)",
        };
      case "fiber":
        return {
          ...baseStyle,
          width: particle.size * 0.5,
          height: particle.size * 4,
          background: `linear-gradient(to bottom, transparent 0%, rgba(255, 250, 240, 0.6) 20%, rgba(255, 250, 240, 0.6) 80%, transparent 100%)`,
          borderRadius: "2px",
          filter: "blur(0.5px)",
          transform: `rotate(${particle.rotation}deg)`,
        };
      case "mote":
        return {
          ...baseStyle,
          width: particle.size,
          height: particle.size,
          background: `radial-gradient(circle, rgba(255, 248, 220, 0.9) 0%, rgba(255, 240, 200, 0.4) 50%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(1.5px)",
          boxShadow: "0 0 4px rgba(255, 248, 220, 0.3)",
        };
      case "ash":
        return {
          ...baseStyle,
          width: particle.size,
          height: particle.size * 0.6,
          background: `rgba(180, 170, 160, ${particle.opacity * 0.8})`,
          borderRadius: "40% 60% 50% 50%",
          filter: "blur(0.5px)",
        };
      default:
        return baseStyle;
    }
  };

  // Animation variants per type
  const getAnimation = () => {
    const baseDrift = particle.drift * chaosMultiplier;
    const wobble = particle.wobble * chaosMultiplier;

    switch (particle.type) {
      case "fiber":
        // Fibers sway side to side while falling
        return {
          y: [particle.startY + "%", "-10%"],
          x: [0, wobble, -wobble, wobble * 0.5, 0],
          rotate: [particle.rotation, particle.rotation + 30, particle.rotation - 20, particle.rotation],
          opacity: [0, particle.opacity, particle.opacity, 0],
        };
      case "mote":
        // Motes float gently with subtle pulsing
        return {
          y: ["110%", `${-10 + particle.startY}%`],
          x: [0, baseDrift * 0.5],
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0, particle.opacity, particle.opacity * 1.2, particle.opacity, 0],
        };
      case "ash":
        // Ash floats down with swaying motion
        return {
          y: [`${-10 + particle.startY}%`, "110%"],
          x: [0, wobble, -wobble * 0.8, wobble * 0.6, baseDrift],
          rotate: [0, 180, 360],
          opacity: [0, particle.opacity, particle.opacity, 0],
        };
      case "dust":
      default:
        // Dust rises slowly with drift
        return {
          y: ["110%", `${-10 + particle.startY}%`],
          x: [0, baseDrift],
          opacity: [0, particle.opacity, particle.opacity, 0],
        };
    }
  };

  // Direction: some particles fall, some rise
  const shouldFall = particle.type === "ash" || (particle.type === "fiber" && particle.id % 3 === 0);

  return (
    <motion.div
      style={getParticleStyle()}
      initial={{
        y: shouldFall ? "-10%" : "110%",
        x: 0,
        opacity: 0,
      }}
      animate={getAnimation()}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
        times: particle.type === "fiber"
          ? [0, 0.25, 0.5, 0.75, 1]
          : undefined,
      }}
    />
  );
});

FloatingParticle.displayName = "FloatingParticle";
