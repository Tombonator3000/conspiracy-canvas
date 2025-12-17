import React, { useEffect } from 'react';

interface ParticleBurstProps {
  id: string;
  x: number;
  y: number;
  onComplete: (id: string) => void;
}

export const ParticleBurst = ({ id, x, y, onComplete }: ParticleBurstProps) => {
  // Generate particles only once on mount
  const particles = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      // Random direction and distance (50px to 100px outwards)
      const angle = Math.random() * 2 * Math.PI;
      const distance = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      // Random size between 4px and 12px
      const size = 4 + Math.random() * 8;
      // Slight random delay/duration variation
      const duration = 0.6 + Math.random() * 0.3;

      return {
        id: i,
        style: {
          left: x,
          top: y,
          width: size,
          height: size,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          animationDuration: `${duration}s`,
        } as React.CSSProperties,
      };
    });
  }, [x, y]);

  // Automatically clean up after animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 1000); // Slightly longer than longest animation
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-puff pointer-events-none z-50"
          style={p.style}
        />
      ))}
    </>
  );
};
