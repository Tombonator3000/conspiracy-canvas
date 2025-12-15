import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { Printer } from "./Printer";
import { SettingsModal } from "./SettingsModal";
import { useAudioContext } from "@/contexts/AudioContext";
import { allCases } from "@/data/cases";
import type { CaseData } from "@/types/game";

interface MainMenuProps {
  onStartGame: () => void;
  onSelectCase?: (caseData: CaseData) => void;
  nextUnlockedCase?: CaseData | null;
}

export const MainMenu = ({ onStartGame, onSelectCase, nextUnlockedCase }: MainMenuProps) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);
  
  const { initialize, isInitialized, playSFX, isMuted, toggleMute } = useAudioContext();

  // Calculate the next available case
  const nextCase = nextUnlockedCase || allCases[0];

  const menuOptions = [
    { label: "START INVESTIGATION", action: () => handleStart() },
    { label: "CONFIGURE SYSTEM", action: () => {
      if (!isInitialized) initialize();
      playSFX("button_click");
      setShowSettings(true);
    }},
    { label: "REVIEW PAST TRUTHS", action: () => {} },
  ];

  const handleStart = () => {
    // Initialize audio on first interaction
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
        className="relative w-full h-screen h-[100dvh] overflow-hidden bg-background"
        animate={{
          scale: isZooming ? 3 : 1,
          opacity: isZooming ? 0 : 1,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Basement desk background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,8%)] to-[hsl(30,25%,3%)]">
          {/* Desk surface */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] sm:h-[55%] bg-gradient-to-t from-[hsl(25,40%,15%)] to-[hsl(25,35%,10%)]">
            {/* Wood grain texture overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )`
              }}
            />
          </div>
        </div>

        {/* Ambient lighting glow from monitor */}
        <div className="absolute top-[10%] sm:top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[200px] sm:h-[400px] bg-[hsl(120,100%,50%)]/5 blur-[80px] sm:blur-[100px] rounded-full" />

        {/* Desk items - left side (hidden on very small screens) */}
        <div className="hidden sm:block absolute bottom-[40%] left-[8%]">
          {/* Coffee mug */}
          <motion.div 
            className="relative cursor-pointer"
            whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.3 } }}
          >
            <div className="w-16 h-14 bg-gradient-to-b from-[hsl(40,20%,92%)] to-[hsl(35,20%,78%)] rounded-b-lg rounded-t-sm relative">
              <div className="absolute -right-3 top-2 w-4 h-8 border-4 border-[hsl(35,20%,78%)] rounded-r-full" />
              <div className="absolute top-1 left-2 right-2 h-2 bg-[hsl(20,60%,12%)] rounded-full opacity-80" />
            </div>
            <span className="absolute -bottom-6 left-0 text-[10px] font-mono text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
              [SETTINGS]
            </span>
          </motion.div>
        </div>

        {/* Ashtray with cigarette (hidden on mobile) */}
        <div className="hidden md:block absolute bottom-[38%] left-[20%]">
          <div className="w-20 h-6 bg-gradient-to-b from-[hsl(0,0%,29%)] to-[hsl(0,0%,17%)] rounded-full relative">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-[hsl(0,0%,10%)] rounded-full" />
            <motion.div 
              className="absolute -top-4 left-1/3 w-1 h-8 bg-gradient-to-t from-[hsl(45,30%,90%)] to-[hsl(20,90%,50%)] rotate-12 origin-bottom"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="absolute -top-2 -left-1 w-3 h-4 bg-[hsl(0,0%,53%)]/30 blur-sm"
                animate={{ y: [-2, -8], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>

        {/* Dot Matrix Printer */}
        {showPrinter && nextCase && (
          <Printer
            nextCase={nextCase}
            onAcceptCase={handleAcceptCase}
            onRejectCase={handleRejectCase}
          />
        )}

        {/* Stack of papers - right side (hidden on very small screens) */}
        <div className="hidden sm:block absolute bottom-[42%] right-[8%] md:right-[12%] transform rotate-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="absolute w-20 sm:w-32 h-28 sm:h-40 bg-[hsl(45,30%,92%)] shadow-md"
              style={{ 
                transform: `rotate(${i * 2 - 4}deg) translateY(${i * -2}px)`,
                boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {i === 4 && (
                <div className="p-2 font-mono text-[6px] text-ink/60 leading-tight">
                  CLASSIFIED REPORT #4421<br/>
                  SUBJECT: [REDACTED]<br/>
                  STATUS: PENDING REVIEW<br/>
                  ████████████████<br/>
                  ████████████████
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CRT Monitor - Center */}
        <motion.div 
          className="absolute top-[5%] sm:top-[10%] md:top-[15%] left-1/2 -translate-x-1/2 cursor-pointer w-[95%] sm:w-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Monitor casing */}
          <div className="relative">
            {/* Monitor body - responsive sizing */}
            <div className="w-full sm:w-[380px] md:w-[420px] h-[320px] sm:h-[300px] md:h-[340px] bg-gradient-to-b from-[hsl(45,10%,78%)] to-[hsl(40,10%,62%)] rounded-lg p-3 sm:p-4 md:p-6 shadow-2xl mx-auto max-w-[420px]">
              {/* Screen bezel */}
              <div className="w-full h-full bg-[hsl(0,0%,10%)] rounded p-2 sm:p-3 md:p-4 relative overflow-hidden">
                {/* CRT screen */}
                <div className="w-full h-full bg-[hsl(120,100%,5%)] rounded-sm relative overflow-hidden">
                  {/* Scanlines */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                    }}
                  />
                  
                  {/* Screen flicker */}
                  <motion.div 
                    className="absolute inset-0 bg-[hsl(120,100%,50%)]/5"
                    animate={{ opacity: [0, 0.1, 0] }}
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                  />

                  {/* Screen content */}
                  <div className="relative z-10 p-2 sm:p-3 md:p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="text-[hsl(120,100%,50%)] font-mono text-[10px] sm:text-xs mb-1 sm:mb-2 opacity-70">
                      APOPHENIA OS v1.337 - (c) 1997 TRUTH SEEKERS INC.
                    </div>
                    <div className="text-[hsl(120,100%,50%)] font-mono text-[10px] sm:text-xs mb-2 sm:mb-4 opacity-70 hidden sm:block">
                      ════════════════════════════════════════
                    </div>

                    {/* Title */}
                    <motion.div 
                      className="text-center mb-3 sm:mb-6"
                      animate={{ textShadow: ['0 0 10px hsl(120,100%,50%)', '0 0 20px hsl(120,100%,50%)', '0 0 10px hsl(120,100%,50%)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <h1 className="text-[hsl(120,100%,50%)] font-mono text-lg sm:text-xl md:text-2xl font-bold tracking-wider">
                        PROJECT APOPHENIA
                      </h1>
                      <p className="text-[hsl(120,100%,50%)]/70 font-mono text-[10px] sm:text-xs mt-1">
                        THE TRUTH IS IN THE CONNECTIONS
                      </p>
                    </motion.div>

                    {/* Menu options */}
                    <div className="flex-1 flex flex-col justify-center space-y-1 sm:space-y-2">
                      {menuOptions.map((option, index) => (
                        <motion.button
                          key={option.label}
                          className={`text-left font-mono text-xs sm:text-sm py-1 px-2 transition-colors ${
                            selectedOption === index 
                              ? 'text-[hsl(120,100%,5%)] bg-[hsl(120,100%,50%)]' 
                              : 'text-[hsl(120,100%,50%)] hover:bg-[hsl(120,100%,50%)]/20'
                          }`}
                          onMouseEnter={() => setSelectedOption(index)}
                          onClick={option.action}
                          whileHover={{ x: 4 }}
                        >
                          {selectedOption === index ? '►' : ' '} {option.label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="text-[hsl(120,100%,50%)]/50 font-mono text-[8px] sm:text-[10px] mt-2 sm:mt-4">
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
              </div>
            </div>

            {/* Monitor stand */}
            <div className="w-16 sm:w-24 h-4 sm:h-8 bg-gradient-to-b from-[hsl(40,10%,62%)] to-[hsl(35,10%,50%)] mx-auto -mt-1 rounded-b" />
            <div className="w-24 sm:w-40 h-2 sm:h-4 bg-gradient-to-b from-[hsl(35,10%,50%)] to-[hsl(30,10%,38%)] mx-auto rounded-b-lg" />

            {/* Power LED */}
            <motion.div 
              className="absolute bottom-8 sm:bottom-12 right-4 sm:right-8 w-2 h-2 rounded-full bg-[hsl(120,100%,50%)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ boxShadow: '0 0 8px hsl(120,100%,50%)' }}
            />
          </div>
        </motion.div>

        {/* Keyboard (hidden on mobile) */}
        <div className="hidden sm:block absolute bottom-[28%] left-1/2 -translate-x-1/2">
          <div className="w-64 md:w-80 h-16 md:h-24 bg-gradient-to-b from-[hsl(45,10%,78%)] to-[hsl(40,10%,69%)] rounded-lg shadow-lg p-2">
            <div className="w-full h-full bg-[hsl(0,0%,17%)] rounded grid grid-cols-12 gap-0.5 p-2">
              {Array.from({ length: 48 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-[hsl(0,0%,23%)] rounded-sm h-2 md:h-3"
                  style={{ 
                    width: i >= 36 && i < 42 ? '200%' : '100%',
                    gridColumn: i >= 36 && i < 42 ? 'span 2' : 'span 1'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Credits alien photo (repositioned for mobile) */}
        <motion.div 
          className="absolute bottom-[35%] sm:bottom-[45%] right-[5%] sm:right-[25%] w-12 sm:w-20 h-16 sm:h-24 bg-[hsl(45,30%,92%)] p-1 shadow-lg cursor-pointer transform rotate-12"
          whileHover={{ scale: 1.1, rotate: 0 }}
          onClick={() => setShowCredits(true)}
        >
          <div className="w-full h-full bg-[hsl(150,40%,15%)] flex items-center justify-center">
            <span className="text-xl sm:text-3xl">👽</span>
          </div>
          <p className="text-[5px] sm:text-[6px] font-mono text-ink text-center mt-0.5">THE DEV TEAM</p>
        </motion.div>

        {/* Ambient sounds indicator */}
        <motion.button
          className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-muted-foreground/50 text-[10px] sm:text-xs font-mono flex items-center gap-1 sm:gap-2 cursor-pointer hover:text-muted-foreground transition-colors"
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
