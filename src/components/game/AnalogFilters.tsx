import { memo, useMemo } from "react";

interface AnalogFiltersProps {
  sanity: number;
  enableFilmGrain?: boolean;
  enableVignette?: boolean;
  enableDust?: boolean;
  enableScanlines?: boolean;
  intensity?: number; // 0-100 from settings
}

/**
 * 90s Analog Aesthetic Filter Overlay
 * Creates the "VHS basement conspiracy" feel with:
 * - Film grain (animated noise)
 * - Vignette (dark corners)
 * - Floating dust particles
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
  const grainOpacity = (0.04 + (sanityFactor * 0.1)) * baseIntensity; // Scaled by settings
  const vignetteDarkness = (0.25 + (sanityFactor * 0.35)) * baseIntensity; // Scaled by settings

  // Generate dust particles with random properties
  const dustParticles = useMemo(() => {
    if (!enableDust) return [];

    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 15,
      drift: -50 + Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, [enableDust]);

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

      {/* Dust Particles */}
      {enableDust && dustParticles.map((particle) => (
        <div
          key={particle.id}
          className="dust-particle"
          style={{
            left: particle.left,
            '--size': `${particle.size}px`,
            '--duration': `${particle.duration}s`,
            '--drift': `${particle.drift}px`,
            '--opacity': particle.opacity,
            animationDelay: `${particle.delay}s`,
            zIndex: 9995,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
});

AnalogFilters.displayName = "AnalogFilters";
