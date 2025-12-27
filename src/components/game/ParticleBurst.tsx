import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

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
  'hsl(350, 60%, 70%)',  // Red string
];

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  rotation: number;
  type: 'dust' | 'spark' | 'paper';
}

export const ParticleBurst = ({ id, x, y, onComplete }: ParticleBurstProps) => {
  // Generate particles only once on mount
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 50 + Math.random() * 100;
      const size = 4 + Math.random() * 12;
      const duration = 0.4 + Math.random() * 0.4;
      const delay = Math.random() * 0.1;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const rotation = Math.random() * 720 - 360;
      const type = Math.random() > 0.7 ? 'spark' : Math.random() > 0.5 ? 'paper' : 'dust';

      return { id: i, angle, distance, size, duration, delay, color, rotation, type };
    });
  }, []);

  // Automatically clean up after animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <>
      {/* Central flash effect */}
      <motion.div
        className="pointer-events-none z-50"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 240, 200, 0.95) 0%, rgba(255, 200, 100, 0.7) 30%, transparent 60%)',
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 100, height: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      
      {/* Ring shockwave */}
      <motion.div
        className="pointer-events-none z-50"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '2px solid rgba(255, 220, 150, 0.6)',
          boxShadow: '0 0 20px rgba(255, 200, 100, 0.4)',
        }}
        initial={{ width: 20, height: 20, opacity: 1 }}
        animate={{ width: 150, height: 150, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      
      {/* Particles */}
      {particles.map((p) => {
        const tx = Math.cos(p.angle) * p.distance;
        const ty = Math.sin(p.angle) * p.distance;
        
        return (
          <motion.div
            key={p.id}
            className="pointer-events-none z-50"
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.type === 'paper' ? p.size * 1.5 : p.size,
              backgroundColor: p.color,
              borderRadius: p.type === 'spark' ? '50%' : p.type === 'paper' ? '2px' : '50%',
              boxShadow: p.type === 'spark' 
                ? `0 0 ${p.size}px ${p.color}, 0 0 ${p.size * 2}px ${p.color}`
                : `0 0 4px rgba(255, 200, 100, 0.3)`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 1, 
              opacity: 1, 
              rotate: 0,
              filter: 'blur(0px)',
            }}
            animate={{ 
              x: tx, 
              y: ty, 
              scale: 0, 
              opacity: 0, 
              rotate: p.rotation,
              filter: 'blur(1px)',
            }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </>
  );
};