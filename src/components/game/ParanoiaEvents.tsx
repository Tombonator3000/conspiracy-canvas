import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParanoiaEventsProps {
  sanity: number;
  isGameActive: boolean;
  onSanityChange: (delta: number) => void;
  playSFX: (sound: string) => void;
}

type EventType = "phone_call" | "chat_bubble" | "screen_glitch" | null;

const SCARY_MESSAGES = [
  "STOP DIGGING",
  "WE CAN SEE YOU",
  "YOU'RE BEING WATCHED",
  "THEY KNOW",
  "DELETE EVERYTHING",
  "IT'S TOO LATE",
  "WRONG PATH",
  "TURN BACK NOW",
  "WE ARE EVERYWHERE",
];

const CALLER_NAMES = [
  "UNKNOWN",
  "BLOCKED",
  "NO CALLER ID",
  "PRIVATE NUMBER",
  "??? ??? ????",
  "M.I.B.",
  "THEY",
];

export const ParanoiaEvents = ({ sanity, isGameActive, onSanityChange, playSFX }: ParanoiaEventsProps) => {
  const [activeEvent, setActiveEvent] = useState<EventType>(null);
  const [countdown, setCountdown] = useState(5);
  const [message, setMessage] = useState("");
  const [callerName, setCallerName] = useState("");

  // Trigger paranoia events based on sanity and timer
  useEffect(() => {
    if (!isGameActive || sanity > 40) return;

    // Random chance to trigger event every 15-30 seconds when sanity is low
    const triggerInterval = setInterval(() => {
      if (activeEvent) return; // Don't stack events
      
      const chance = Math.random();
      const sanityFactor = (40 - sanity) / 40; // Higher chance at lower sanity
      
      if (chance < 0.3 + sanityFactor * 0.4) {
        // 30-70% chance based on sanity
        const eventType = Math.random() > 0.5 ? "phone_call" : "chat_bubble";
        triggerEvent(eventType);
      }
    }, 15000 + Math.random() * 15000);

    return () => clearInterval(triggerInterval);
  }, [sanity, isGameActive, activeEvent, triggerEvent]);

  const triggerEvent = useCallback((type: EventType) => {
    if (type === "phone_call") {
      setCallerName(CALLER_NAMES[Math.floor(Math.random() * CALLER_NAMES.length)]);
      setCountdown(5);
      playSFX("connect_fail"); // Use as ringtone substitute
    } else if (type === "chat_bubble") {
      setMessage(SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)]);
    }
    setActiveEvent(type);
  }, [playSFX]);

  // Phone call countdown
  useEffect(() => {
    if (activeEvent !== "phone_call") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time's up - lose sanity
          onSanityChange(-10);
          setActiveEvent(null);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeEvent, onSanityChange]);

  // Auto-dismiss chat bubble after 4 seconds
  useEffect(() => {
    if (activeEvent !== "chat_bubble") return;

    const timer = setTimeout(() => {
      setActiveEvent(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeEvent]);

  const handleBlockCall = () => {
    playSFX("paper_crumple");
    setActiveEvent(null);
  };

  const handleDismissChat = () => {
    setActiveEvent(null);
  };

  return (
    <AnimatePresence>
      {/* Phone Call Event */}
      {activeEvent === "phone_call" && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-ink/95 border-2 border-destructive rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ 
              scale: 1, 
              y: 0,
              boxShadow: [
                "0 0 20px rgba(220, 38, 38, 0.5)",
                "0 0 40px rgba(220, 38, 38, 0.8)",
                "0 0 20px rgba(220, 38, 38, 0.5)",
              ]
            }}
            transition={{
              boxShadow: { duration: 0.5, repeat: Infinity }
            }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Phone className="w-8 h-8 text-destructive" />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Incoming Call</p>
                <p className="text-xl font-mono text-destructive font-bold">{callerName}</p>
              </div>
            </div>

            <div className="text-center mb-4">
              <motion.div
                className="text-4xl font-mono text-destructive font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {countdown}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">seconds to respond</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={handleBlockCall}
              >
                <X className="w-4 h-4" />
                BLOCK
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-3 italic">
              Failure to block will cost 10 Sanity...
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Chat Bubble Event */}
      {activeEvent === "chat_bubble" && (
        <motion.div
          className="fixed top-4 right-4 z-[999] max-w-xs"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div 
            className="bg-secondary/95 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-hidden cursor-pointer"
            onClick={handleDismissChat}
          >
            {/* Fake OS notification header */}
            <div className="bg-muted/50 px-3 py-1.5 flex items-center gap-2 border-b border-border">
              <MessageSquare className="w-4 h-4 text-destructive" />
              <span className="text-xs font-mono text-muted-foreground">System Message</span>
              <span className="ml-auto text-[10px] text-muted-foreground">now</span>
            </div>
            
            <div className="p-3">
              <motion.p
                className="font-mono text-sm text-destructive font-bold"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {message}
              </motion.p>
            </div>

            {/* Glitchy bottom bar */}
            <motion.div
              className="h-1 bg-destructive"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}

      {/* Screen Glitch Overlay (triggered at very low sanity) */}
      {sanity < 20 && isGameActive && (
        <motion.div
          className="fixed inset-0 z-[900] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Random glitch lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-0.5 bg-destructive/30"
              style={{ top: `${20 + i * 15}%` }}
              animate={{
                opacity: [0, 1, 0],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 0.1 + Math.random() * 0.2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          {/* Corner warning icons */}
          <motion.div
            className="absolute bottom-4 left-4 text-destructive/50"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="w-8 h-8" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
