import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Flashlight } from "lucide-react";

interface UVLightProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const UVLightToggle = ({ isEnabled, onToggle }: UVLightProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all ${
        isEnabled
          ? "bg-[#7fff00]/20 text-[#7fff00] border border-[#7fff00]/50 shadow-[0_0_15px_rgba(127,255,0,0.3)]"
          : "bg-ink/50 text-paper/70 border border-paper/20 hover:border-paper/40"
      }`}
    >
      <Flashlight className={`w-4 h-4 ${isEnabled ? "text-[#7fff00]" : ""}`} />
      UV LAMP
    </motion.button>
  );
};

interface UVOverlayProps {
  isEnabled: boolean;
}

export const UVOverlay = ({ isEnabled }: UVOverlayProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      // Offset 50px above touch point so finger doesn't hide content
      setPosition({ x: touch.clientX, y: touch.clientY - 50 });
      setIsTouching(true);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  useEffect(() => {
    if (isEnabled) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isEnabled, handleMouseMove, handleTouchMove, handleTouchEnd]);

  if (!isEnabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        background: `radial-gradient(circle 120px at ${position.x}px ${position.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`,
      }}
    >
      {/* UV glow effect at cursor */}
      <div
        className="absolute w-60 h-60 rounded-full pointer-events-none"
        style={{
          left: position.x - 120,
          top: position.y - 120,
          background: `radial-gradient(circle, rgba(127,255,0,0.1) 0%, transparent 70%)`,
          boxShadow: "0 0 60px rgba(127,255,0,0.2)",
        }}
      />
    </div>
  );
};

// Component for hidden content on evidence nodes
interface UVHiddenContentProps {
  hiddenText?: string;
  isUVEnabled: boolean;
  cursorPosition: { x: number; y: number };
  nodePosition: { x: number; y: number };
}

export const UVHiddenContent = ({ 
  hiddenText, 
  isUVEnabled,
  cursorPosition,
  nodePosition 
}: UVHiddenContentProps) => {
  if (!hiddenText || !isUVEnabled) return null;

  // Calculate distance from cursor to node
  const distance = Math.sqrt(
    Math.pow(cursorPosition.x - nodePosition.x, 2) +
    Math.pow(cursorPosition.y - nodePosition.y, 2)
  );

  // Only show if within UV light radius (120px)
  const opacity = Math.max(0, 1 - distance / 150);

  if (opacity <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      className="absolute inset-0 flex items-center justify-center bg-ink/80 rounded pointer-events-none"
    >
      <p 
        className="text-[#7fff00] font-mono text-sm text-center px-2 uppercase tracking-wider"
        style={{
          textShadow: "0 0 10px rgba(127,255,0,0.8), 0 0 20px rgba(127,255,0,0.4)",
        }}
      >
        {hiddenText}
      </p>
    </motion.div>
  );
};
