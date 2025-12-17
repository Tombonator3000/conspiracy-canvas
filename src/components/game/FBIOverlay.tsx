import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface FBIOverlayProps {
  onRestart: () => void;
}

export const FBIOverlay = ({ onRestart }: FBIOverlayProps) => {
  useEffect(() => {
    // Play police siren or breach SFX here if available
    // const audio = new Audio('/sfx/fbi_breach.mp3'); audio.play();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Flashing Lights Background - Red/Blue police lights */}
      <motion.div
        className="absolute inset-0 bg-blue-900/50 mix-blend-overlay"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-red-900/50 mix-blend-overlay"
        animate={{ opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
      />

      {/* Flashing corner lights for extra intensity */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-600/40 to-transparent"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-red-600/40 to-transparent"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />

      {/* Glitchy Main Text */}
      <motion.h1
        className="text-6xl sm:text-8xl font-black text-white tracking-tighter z-10 text-center"
        style={{
          textShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(0,0,255,0.6), 3px 3px 0 #ff0000, -3px -3px 0 #0000ff',
        }}
        animate={{
          y: [0, -10, 0, 10, 0],
          x: [0, -5, 5, -5, 0],
          scale: [1, 1.02, 1, 0.98, 1],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        FBI OPEN UP!
      </motion.h1>

      {/* Status Message */}
      <motion.div
        className="mt-8 z-10 text-red-500 font-mono text-lg sm:text-2xl bg-black px-4 py-2 border border-red-500"
        animate={{
          borderColor: ['#ef4444', '#3b82f6', '#ef4444'],
          boxShadow: [
            '0 0 10px rgba(239,68,68,0.5)',
            '0 0 10px rgba(59,130,246,0.5)',
            '0 0 10px rgba(239,68,68,0.5)',
          ],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        SUBJECT DETAINED. SANITY CRITICAL.
      </motion.div>

      {/* Restart Button */}
      <motion.button
        onClick={onRestart}
        className="mt-12 px-8 py-3 bg-white text-black font-bold hover:bg-gray-200 z-10 transition-colors uppercase tracking-wider"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        TRY AGAIN
      </motion.button>

      {/* Static noise overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 0.1, repeat: Infinity }}
      />
    </div>
  );
};
