import { motion } from "framer-motion";
import { useMemo } from "react";

interface SanityMeterProps {
  sanity: number;
  maxSanity?: number;
}

// Generate EKG path based on sanity level
const generateEKGPath = (sanity: number, width: number, height: number): string => {
  const midY = height / 2;
  const amplitude = (sanity / 100) * (height * 0.4);

  // More erratic when sanity is low
  const jitter = sanity < 30 ? (30 - sanity) / 30 : 0;

  // EKG pattern segments (normalized x positions)
  // P wave, QRS complex, T wave pattern
  const segments = [
    { x: 0, y: midY },
    { x: 0.1, y: midY - amplitude * 0.2 }, // Small P wave
    { x: 0.15, y: midY },
    { x: 0.2, y: midY + amplitude * 0.3 }, // Q dip
    { x: 0.25, y: midY - amplitude }, // R spike (main peak)
    { x: 0.3, y: midY + amplitude * 0.5 }, // S dip
    { x: 0.35, y: midY },
    { x: 0.5, y: midY - amplitude * 0.3 }, // T wave
    { x: 0.6, y: midY },
    { x: 0.65, y: midY - amplitude * 0.15 }, // Second small P
    { x: 0.7, y: midY },
    { x: 0.75, y: midY + amplitude * 0.25 },
    { x: 0.8, y: midY - amplitude * 0.8 }, // Second R spike
    { x: 0.85, y: midY + amplitude * 0.4 },
    { x: 0.9, y: midY },
    { x: 1, y: midY },
  ];

  // Add jitter for low sanity
  const jitteredSegments = segments.map((seg, i) => ({
    x: seg.x * width,
    y: seg.y + (jitter > 0 ? (Math.sin(i * 3) * jitter * 5) : 0),
  }));

  // Convert to SVG path
  return jitteredSegments.reduce((path, seg, i) => {
    return path + (i === 0 ? `M ${seg.x} ${seg.y}` : ` L ${seg.x} ${seg.y}`);
  }, '');
};

export const SanityMeter = ({ sanity, maxSanity = 100 }: SanityMeterProps) => {
  const percentage = (sanity / maxSanity) * 100;
  const isLow = percentage < 30;
  const isCritical = percentage < 15;
  const isGameOver = sanity <= 0;

  // EKG dimensions
  const ekgWidth = 100;
  const ekgHeight = 32;

  // Generate path
  const ekgPath = useMemo(() => {
    return isGameOver
      ? `M 0 ${ekgHeight / 2} L ${ekgWidth} ${ekgHeight / 2}` // Flatline
      : generateEKGPath(sanity, ekgWidth, ekgHeight);
  }, [sanity, isGameOver]);

  // Color based on sanity
  const ekgColor = useMemo(() => {
    if (isGameOver) return '#ff0000';
    if (isCritical) return '#ff3333';
    if (isLow) return '#ffcc00';
    return '#00ff41';
  }, [isLow, isCritical, isGameOver]);

  // Pulse rate based on sanity
  const pulseRate = useMemo(() => {
    if (isGameOver) return 2;
    if (isCritical) return 0.3;
    if (isLow) return 0.5;
    return 0.8;
  }, [isLow, isCritical, isGameOver]);

  return (
    <div className="flex items-center gap-2 bg-black/90 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-green-900/50">
      {/* EKG Monitor */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{
          width: `${ekgWidth + 10}px`,
          height: `${ekgHeight + 8}px`,
          background: 'rgba(0, 10, 0, 0.95)',
          boxShadow: `inset 0 0 20px rgba(0, 255, 65, 0.1), 0 0 10px rgba(0, 0, 0, 0.5)`,
          border: '1px solid rgba(0, 255, 65, 0.2)',
        }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px',
          }}
        />

        {/* CRT Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(0, 0, 0, 0.15) 1px, rgba(0, 0, 0, 0.15) 2px)',
            animation: 'scanline-scroll 8s linear infinite',
          }}
        />

        {/* EKG Line */}
        <motion.svg
          className="absolute inset-0 w-full h-full p-1"
          viewBox={`0 0 ${ekgWidth} ${ekgHeight}`}
          preserveAspectRatio="none"
        >
          {/* Glow layer */}
          <motion.path
            d={ekgPath}
            className="ekg-line"
            stroke={ekgColor}
            strokeWidth="3"
            style={{
              filter: `blur(4px) drop-shadow(0 0 8px ${ekgColor})`,
              opacity: 0.6,
            }}
            animate={{ pathLength: [0, 1] }}
            transition={{
              duration: pulseRate,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Main line */}
          <motion.path
            d={ekgPath}
            className={`ekg-line ${isCritical ? 'ekg-critical' : ''} ${isGameOver ? 'ekg-flatline' : ''}`}
            stroke={ekgColor}
            strokeWidth="2"
            style={{
              filter: `drop-shadow(0 0 3px ${ekgColor})`,
            }}
            animate={isCritical && !isGameOver ? {
              strokeWidth: [2, 2.5, 2],
            } : {}}
            transition={{
              duration: 0.2,
              repeat: Infinity,
            }}
          />
        </motion.svg>

        {/* Monitor reflection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Digital readout */}
      <div className="flex flex-col items-end gap-0">
        <span
          className="text-[8px] font-mono uppercase tracking-wider"
          style={{ color: 'rgba(0, 255, 65, 0.6)' }}
        >
          MENTAL
        </span>
        <motion.span
          className="font-mono text-sm sm:text-base font-bold tabular-nums"
          style={{
            color: ekgColor,
            textShadow: `0 0 10px ${ekgColor}, 0 0 20px ${ekgColor}`,
            fontFamily: "'VT323', monospace",
          }}
          animate={isCritical ? {
            opacity: [1, 0.7, 1],
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 0.3,
            repeat: isCritical ? Infinity : 0,
          }}
        >
          {isGameOver ? '---' : sanity.toString().padStart(3, '0')}
        </motion.span>
      </div>

      {/* Beep indicator */}
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: ekgColor,
          boxShadow: `0 0 6px ${ekgColor}, 0 0 12px ${ekgColor}`,
        }}
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: pulseRate,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
