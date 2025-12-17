import React, { useEffect } from 'react';

interface ParticleBurstProps {
  id: string;
  x: number;
  y: number;
  onComplete: (id: string) => void;
}

// Particle colors for merge effect - paper/dust tones with some sparkle
const PARTICLE_COLORS = [
  'hsl(40, 30%, 85%)',   // Light paper
  'hsl(35, 40%, 75%)',   // Aged paper
  'hsl(45, 50%, 90%)',   // Cream
  'hsl(30, 60%, 70%)',   // Light brown
  'hsl(50, 80%, 70%)',   // Gold sparkle
  'hsl(0, 0%, 95%)',     // White
];

export const ParticleBurst = ({ id, x, y, onComplete }: ParticleBurstProps) => {
  // Generate particles only once on mount
  const particles = React.useMemo(() => {
    // Create more particles for a more dramatic effect (20 particles)
    return Array.from({ length: 20 }).map((_, i) => {
      // Random direction and distance (60px to 150px outwards for more spread)
      const angle = Math.random() * 2 * Math.PI;
      const distance = 60 + Math.random() * 90;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      // Random size between 6px and 16px (bigger particles)
      const size = 6 + Math.random() * 10;
      // Slight random delay/duration variation
      const duration = 0.5 + Math.random() * 0.4;
      const delay = Math.random() * 0.15;
      // Random color from palette
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

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
          animationDelay: `${delay}s`,
          backgroundColor: color,
        } as React.CSSProperties,
      };
    });
  }, [x, y]);

  // Automatically clean up after animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 1200); // Slightly longer than longest animation
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <>
      {/* Central flash effect */}
      <div
        className="animate-merge-flash pointer-events-none z-50"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Particles */}
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
