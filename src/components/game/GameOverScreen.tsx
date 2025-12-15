import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameOverScreenProps {
  onRetry: () => void;
  onBackToMenu: () => void;
}

export const GameOverScreen = ({ onRetry, onBackToMenu }: GameOverScreenProps) => {
  const [phase, setPhase] = useState<'knock' | 'blackout' | 'text'>('knock');

  useEffect(() => {
    // Phase 1: Door knock sound (simulated with animation)
    const knockTimer = setTimeout(() => setPhase('blackout'), 2000);
    const textTimer = setTimeout(() => setPhase('text'), 3000);

    return () => {
      clearTimeout(knockTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'knock' && (
          <motion.div
            key="knock"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Door knock visual */}
            <motion.div
              className="text-8xl mb-8"
              animate={{ 
                scale: [1, 1.2, 1, 1.2, 1, 1.2, 1],
                rotate: [0, -5, 5, -5, 5, 0, 0]
              }}
              transition={{ duration: 1.5, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1] }}
            >
              🚪
            </motion.div>
            
            {/* Knock text */}
            <motion.div
              className="font-marker text-4xl text-[#ff0000]"
              animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
              transition={{ duration: 1.5, times: [0, 0.2, 0.3, 0.5, 0.6, 0.8] }}
            >
              *KNOCK* *KNOCK* *KNOCK*
            </motion.div>
          </motion.div>
        )}

        {phase === 'blackout' && (
          <motion.div
            key="blackout"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="font-mono text-2xl text-[#ff0000] uppercase tracking-widest"
              animate={{ 
                textShadow: [
                  '0 0 10px #ff0000',
                  '0 0 30px #ff0000',
                  '0 0 10px #ff0000'
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              FBI! OPEN UP!
            </motion.p>
          </motion.div>
        )}

        {phase === 'text' && (
          <motion.div
            key="text"
            className="text-center max-w-md mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* FBI badge */}
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🪪
            </motion.div>

            <h1 className="font-marker text-4xl text-[#ff0000] mb-4">
              SANITY COMPROMISED
            </h1>

            <motion.p 
              className="font-typewriter text-muted-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You knew too much.
            </motion.p>

            <motion.p 
              className="font-typewriter text-muted-foreground/70 text-sm mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Your ramblings became incoherent. They found you.<br />
              The truth will have to wait for another timeline.
            </motion.p>

            {/* Classified stamp effect */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -10 }}
              transition={{ delay: 0.9, type: "spring" }}
            >
              <div className="inline-block border-4 border-[#ff0000] text-[#ff0000] font-marker text-2xl px-4 py-2 opacity-80">
                CASE CLOSED
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={onRetry}
                className="bg-[#ff0000] hover:bg-[#cc0000] text-white font-marker"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                TRY AGAIN (NEW TIMELINE)
              </Button>
              <Button
                onClick={onBackToMenu}
                variant="outline"
                className="font-marker border-muted-foreground/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ESCAPE TO DESK
              </Button>
            </motion.div>

            {/* Glitch effect text */}
            <motion.p
              className="font-mono text-xs text-muted-foreground/30 mt-8"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              [TRANSMISSION INTERCEPTED]
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background noise effect */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </motion.div>
  );
};
