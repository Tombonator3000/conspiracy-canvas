import { motion, AnimatePresence } from "framer-motion";
import { Skull, Trophy, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameOverlayProps {
  isGameOver: boolean;
  isVictory: boolean;
  onRestart: () => void;
  theTruth?: {
    subject: string;
    action: string;
    target: string;
    motive: string;
  };
}

export const GameOverlay = ({ isGameOver, isVictory, onRestart, theTruth }: GameOverlayProps) => {
  return (
    <AnimatePresence>
      {(isGameOver || isVictory) && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          
          {/* Content */}
          <motion.div
            className="relative z-10 max-w-md mx-4 text-center"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {isVictory ? (
              <>
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Trophy className="w-20 h-20 text-accent mx-auto mb-4" />
                </motion.div>
                
                <h1 className="font-marker text-4xl text-primary mb-2">
                  THE TRUTH IS OUT!
                </h1>
                
                <div className="bg-secondary/50 rounded-lg p-4 mb-6 border border-border">
                  <p className="font-typewriter text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> DECODED MESSAGE:
                  </p>
                  <p className="font-marker text-xl text-foreground">
                    {theTruth?.subject} {theTruth?.action} {theTruth?.target}
                  </p>
                  <p className="font-typewriter text-sm text-primary mt-2">
                    Motive: {theTruth?.motive}
                  </p>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Skull className="w-20 h-20 text-destructive mx-auto mb-4" />
                </motion.div>
                
                <h1 className="font-marker text-4xl text-destructive mb-2">
                  SANITY LOST
                </h1>
                
                <p className="font-typewriter text-muted-foreground mb-6">
                  You've stared too long into the abyss.<br />
                  The truth remains hidden...
                </p>
              </>
            )}
            
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="font-marker text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              INVESTIGATE AGAIN
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
