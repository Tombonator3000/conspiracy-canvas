import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScratchRevealProps {
  hiddenText: string;
  onReveal: (success: boolean) => void;
  width?: number;
  height?: number;
}

export const ScratchReveal = ({ hiddenText, onReveal, width = 120, height = 24 }: ScratchRevealProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const pressureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas with black overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the redacted overlay
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);
    
    // Add some texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3,
        1
      );
    }
  }, [width, height]);

  // Calculate scratch progress
  const calculateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    
    return transparent / (pixels.length / 4);
  }, [width, height]);

  // Scratch effect
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isDestroyed || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (x - rect.left) * (width / rect.width);
    const canvasY = (y - rect.top) * (height / rect.height);

    // Calculate speed based on distance from last position
    let speed = 0;
    if (lastPosRef.current) {
      const dx = canvasX - lastPosRef.current.x;
      const dy = canvasY - lastPosRef.current.y;
      speed = Math.sqrt(dx * dx + dy * dy);
    }
    lastPosRef.current = { x: canvasX, y: canvasY };

    // Increase pressure when scratching fast or repeatedly in same area
    setPressure((prev) => {
      const newPressure = Math.min(100, prev + (speed < 5 ? 3 : 1));
      
      // If pressure exceeds threshold, destroy the document
      if (newPressure >= 80) {
        setIsDestroyed(true);
        onReveal(false);
      }
      
      return newPressure;
    });

    // Clear pressure timeout
    if (pressureTimeoutRef.current) {
      clearTimeout(pressureTimeoutRef.current);
    }
    
    // Pressure decays when not scratching
    pressureTimeoutRef.current = setTimeout(() => {
      setPressure((prev) => Math.max(0, prev - 20));
    }, 500);

    // Erase the overlay
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Check progress
    const progress = calculateProgress();
    setScratchProgress(progress);

    // If enough is revealed, trigger success
    if (progress > 0.6 && !isRevealed) {
      setIsRevealed(true);
      onReveal(true);
    }
  }, [isDestroyed, isRevealed, width, height, calculateProgress, onReveal]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
    lastPosRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
    lastPosRef.current = null;
  };

  return (
    <div className="relative inline-block" style={{ width, height }}>
      {/* Hidden text underneath */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-wider overflow-hidden"
        style={{
          color: isDestroyed ? "hsl(0, 70%, 40%)" : "hsl(120, 60%, 30%)",
          textDecoration: isDestroyed ? "line-through" : "none",
        }}
      >
        {isDestroyed ? "DESTROYED" : hiddenText}
      </div>

      {/* Scratch canvas overlay */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair touch-none"
        style={{
          opacity: isDestroyed ? 0 : 1,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Pressure indicator */}
      <AnimatePresence>
        {pressure > 40 && !isDestroyed && !isRevealed && (
          <motion.div
            className="absolute -top-6 left-0 right-0 text-[8px] text-center font-mono"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              color: pressure > 60 ? "hsl(0, 70%, 50%)" : "hsl(45, 80%, 50%)",
            }}
          >
            {pressure > 60 ? "⚠️ TOO ROUGH!" : "⚠️ Careful..."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destroyed overlay */}
      <AnimatePresence>
        {isDestroyed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M10 50 L30 20 L50 60 L70 10 L90 50\" stroke=\"%23333\" stroke-width=\"2\" fill=\"none\"/%3E%3C/svg%3E')",
                backgroundSize: "cover",
                opacity: 0.5,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
