import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Printer } from "./Printer";
import { SettingsModal } from "./SettingsModal";
import { useAudioContext } from "@/contexts/AudioContext";
import { useResponsive } from "@/hooks/useResponsive";
import { allCases } from "@/cases";
import type { CaseData } from "@/types/game";
import desktopBg from "@/assets/desktop_bg.jpeg";

interface MainMenuProps {
  onStartGame: () => void;
  onSelectCase?: (caseData: CaseData) => void;
  onReviewPastTruths?: () => void;
  nextUnlockedCase?: CaseData | null;
}

export const MainMenu = ({ onStartGame, onSelectCase, onReviewPastTruths, nextUnlockedCase }: MainMenuProps) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);

  const { initialize, isInitialized, playSFX, isMuted, toggleMute } = useAudioContext();
  const { isMobile, isTablet, isLandscape } = useResponsive();

  // Calculate the next available case
  const nextCase = nextUnlockedCase || allCases[0];

  const menuOptions = [
    { label: "START INVESTIGATION", action: () => handleStart() },
    { label: "CONFIGURE SYSTEM", action: () => {
      if (!isInitialized) initialize();
      playSFX("button_click");
      setShowSettings(true);
    }},
    { label: "REVIEW PAST TRUTHS", action: () => {
      if (!isInitialized) initialize();
      playSFX("button_click");
      if (onReviewPastTruths) {
        setIsZooming(true);
        setTimeout(() => {
          onReviewPastTruths();
        }, 1000);
      }
    }},
  ];

  const handleStart = () => {
    if (!isInitialized) {
      initialize();
    }
    playSFX("button_click");
    
    setIsZooming(true);
    setTimeout(() => {
      onStartGame();
    }, 1000);
  };

  const handleAcceptCase = (caseData: CaseData) => {
    if (onSelectCase) {
      playSFX("button_click");
      setIsZooming(true);
      setTimeout(() => {
        onSelectCase(caseData);
      }, 1000);
    }
  };

  const handleRejectCase = () => {
    playSFX("button_click");
    setShowPrinter(false);
  };

  // Show printer when returning from a completed case
  useEffect(() => {
    if (nextUnlockedCase) {
      const timer = setTimeout(() => {
        setShowPrinter(true);
        playSFX("printer_start");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nextUnlockedCase, playSFX]);

  return (
    <>
      <motion.div 
        className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[hsl(30,15%,8%)]"
        animate={{
          scale: isZooming ? 3 : 1,
          opacity: isZooming ? 0 : 1,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Background Image */}
        <img 
          src={desktopBg} 
          alt="Desk background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dot Matrix Printer */}
        {showPrinter && nextCase && (
          <Printer
            nextCase={nextCase}
            onAcceptCase={handleAcceptCase}
            onRejectCase={handleRejectCase}
          />
        )}

        {/* Terminal Menu - positioned to fit inside the monitor, responsive */}
        <div
          className="absolute flex items-center justify-center z-10"
          style={{
            top: isMobile ? '15%' : '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? '85%' : isTablet ? '40%' : '20%',
            height: isMobile ? '50%' : '36%',
            minWidth: isMobile ? '280px' : '240px',
            maxWidth: isMobile ? '360px' : '340px',
          }}
        >
          {/* CRT Scanline Overlay - reduced opacity for better readability */}
          <div
            className="absolute inset-0 pointer-events-none z-20 rounded-sm"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />
          
          {/* Screen flicker effect - subtle for better readability */}
          <motion.div
            className="absolute inset-0 bg-[hsl(120,100%,50%)]/3 z-10 rounded-sm"
            animate={{ opacity: [0, 0.08, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 6 }}
          />

          {/* Terminal content */}
          <div className="relative z-10 p-3 sm:p-4 h-full w-full flex flex-col">
            {/* Header */}
            <div
              className="text-[hsl(120,100%,50%)] font-mono text-[9px] sm:text-xs mb-1 opacity-80"
              style={{ textShadow: '0 0 2px hsl(120,100%,50%)' }}
            >
              APOPHENIA OS v1.337 - (c) 1997 TRUTH SEEKERS INC.
            </div>
            <div
              className="text-[hsl(120,100%,50%)] font-mono text-[9px] sm:text-xs mb-3 opacity-80 hidden sm:block"
              style={{ textShadow: '0 0 2px hsl(120,100%,50%)' }}
            >
              ════════════════════════════════════════
            </div>

            {/* Title */}
            <motion.div
              className="text-center mb-4 sm:mb-6"
              animate={{ textShadow: ['0 0 4px hsl(120,100%,50%)', '0 0 8px hsl(120,100%,50%)', '0 0 4px hsl(120,100%,50%)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h1
                className="text-[hsl(120,100%,50%)] font-mono text-base sm:text-xl md:text-2xl font-bold tracking-wider"
                style={{ textShadow: '0 0 3px hsl(120,100%,50%)' }}
              >
                PROJECT APOPHENIA
              </h1>
              <p
                className="text-[hsl(120,100%,50%)]/90 font-mono text-[9px] sm:text-xs mt-1"
                style={{ textShadow: '0 0 2px hsl(120,100%,50%)' }}
              >
                THE TRUTH IS IN THE CONNECTIONS
              </p>
            </motion.div>

            {/* Menu options - responsive touch targets */}
            <div className="flex-1 flex flex-col justify-center space-y-1 sm:space-y-2">
              {menuOptions.map((option, index) => (
                <motion.button
                  key={option.label}
                  className={`text-left font-mono text-[11px] sm:text-sm py-2 sm:py-1 px-2 transition-colors rounded-sm touch-target ${
                    selectedOption === index
                      ? 'text-[hsl(120,100%,5%)] bg-[hsl(120,100%,50%)]'
                      : 'text-[hsl(120,100%,50%)] hover:bg-[hsl(120,100%,50%)]/20 active:bg-[hsl(120,100%,50%)]/30'
                  }`}
                  style={{
                    textShadow: selectedOption === index ? 'none' : '0 0 2px hsl(120,100%,50%)',
                    minHeight: isMobile ? '44px' : 'auto',
                  }}
                  onMouseEnter={() => !isMobile && setSelectedOption(index)}
                  onClick={() => {
                    setSelectedOption(index);
                    option.action();
                  }}
                  whileHover={!isMobile ? { x: 4 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedOption === index ? '►' : ' '} {option.label}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div
              className="text-[hsl(120,100%,50%)]/70 font-mono text-[7px] sm:text-[10px] mt-2"
              style={{ textShadow: '0 0 2px hsl(120,100%,50%)' }}
            >
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                █
              </motion.span>
              {" "}PRESS ENTER TO SELECT | THEY ARE WATCHING
            </div>
          </div>
        </div>

        {/* Credits area - clickable on alien photo position */}
        <motion.div 
          className="absolute bottom-[30%] right-[10%] w-16 sm:w-20 h-16 sm:h-20 cursor-pointer opacity-0 hover:opacity-20 bg-primary/10 rounded"
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowCredits(true)}
        />

        {/* Ambient sounds indicator */}
        <motion.button
          className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-[hsl(120,100%,50%)]/50 text-[10px] sm:text-xs font-mono flex items-center gap-1 sm:gap-2 cursor-pointer hover:text-[hsl(120,100%,50%)] transition-colors"
          style={{ textShadow: '0 0 5px hsl(120,100%,50%)' }}
          onClick={() => {
            if (!isInitialized) initialize();
            toggleMute();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ opacity: isMuted ? 0.3 : [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: isMuted ? 0 : Infinity }}
          >
            {isMuted ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
          </motion.div>
          <span className="hidden sm:inline">AUDIO: {isMuted ? "OFF" : "ON"}</span>
        </motion.button>

        {/* Credits modal */}
        <AnimatePresence>
          {showCredits && (
            <motion.div 
              className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCredits(false)}
            >
              <motion.div 
                className="bg-card p-6 sm:p-8 rounded-lg border border-border max-w-md text-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h2 className="font-marker text-xl sm:text-2xl text-primary mb-4">THE TRUTH SEEKERS</h2>
                <p className="font-typewriter text-sm sm:text-base text-muted-foreground mb-4">
                  A game about finding connections where none exist.
                  <br /><br />
                  Created by humans (or are we?)
                </p>
                <span className="text-4xl sm:text-6xl">👽🛸👁️</span>
                <p className="font-mono text-xs text-muted-foreground mt-4">
                  Click anywhere to close (if THEY let you)
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};
