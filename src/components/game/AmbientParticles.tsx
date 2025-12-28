import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "dust" | "light" | "mote";
  opacity: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
    type: ["dust", "light", "mote"][Math.floor(Math.random() * 3)] as Particle["type"],
    opacity: 0.2 + Math.random() * 0.4,
  }));
};

const DustParticle = memo(({ particle }: { particle: Particle }) => {
  const getParticleStyle = () => {
    switch (particle.type) {
      case "light":
        return {
          background: "radial-gradient(circle, rgba(255, 248, 220, 0.8) 0%, rgba(255, 240, 200, 0.3) 50%, transparent 70%)",
          boxShadow: "0 0 8px rgba(255, 240, 200, 0.5)",
        };
      case "mote":
        return {
          background: "rgba(200, 180, 150, 0.6)",
          borderRadius: "50%",
        };
      case "dust":
      default:
        return {
          background: "rgba(180, 160, 130, 0.5)",
          borderRadius: "2px",
        };
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        ...getParticleStyle(),
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, particle.opacity, particle.opacity, 0],
        y: [0, -30 - Math.random() * 50],
        x: [0, (Math.random() - 0.5) * 40],
        scale: [0.5, 1, 1, 0.3],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
});

DustParticle.displayName = "DustParticle";

// Light ray component for atmospheric effect
const LightRay = memo(({ index }: { index: number }) => {
  const angle = -15 + index * 8;
  const left = 20 + index * 15;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: 0,
        width: "2px",
        height: "100%",
        background: `linear-gradient(180deg, 
          rgba(255, 248, 220, 0.15) 0%, 
          rgba(255, 248, 220, 0.08) 30%,
          rgba(255, 248, 220, 0.02) 60%,
          transparent 100%
        )`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "top center",
      }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8 + index * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
});

LightRay.displayName = "LightRay";

interface AmbientParticlesProps {
  particleCount?: number;
  showLightRays?: boolean;
}

export const AmbientParticles = memo(({ 
  particleCount = 40,
  showLightRays = true 
}: AmbientParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(particleCount));
  }, [particleCount]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Light rays from top-left (like sunlight through window) */}
      {showLightRays && (
        <div className="absolute inset-0 opacity-50">
          {[0, 1, 2, 3].map((i) => (
            <LightRay key={i} index={i} />
          ))}
        </div>
      )}
      
      {/* Floating dust particles */}
      {particles.map((particle) => (
        <DustParticle key={particle.id} particle={particle} />
      ))}
      
      {/* Subtle vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.15) 100%)",
        }}
      />
    </div>
  );
});

AmbientParticles.displayName = "AmbientParticles";
