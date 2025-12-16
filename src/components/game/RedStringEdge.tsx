import { memo } from "react";
import { BaseEdge, getStraightPath, type EdgeProps } from "@xyflow/react";

export const RedStringEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isValid = (data as { isValid?: boolean })?.isValid ?? false;

  // Calculate midpoint for decorative elements
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // Calculate length and angle for texture pattern
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <g>
      {/* Glow effect for valid connections */}
      {isValid && (
        <>
          {/* Outer glow */}
          <path
            d={edgePath}
            fill="none"
            stroke="hsl(350, 100%, 60%)"
            strokeWidth={12}
            strokeLinecap="round"
            style={{
              filter: "blur(6px)",
              opacity: 0.3,
            }}
          />
          {/* Inner glow */}
          <path
            d={edgePath}
            fill="none"
            stroke="hsl(350, 90%, 55%)"
            strokeWidth={6}
            strokeLinecap="round"
            style={{
              filter: "blur(2px)",
              opacity: 0.5,
            }}
          />
        </>
      )}
      
      {/* Thread texture - twisted yarn effect */}
      <defs>
        <linearGradient id={`thread-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(350, 75%, 35%)" />
          <stop offset="25%" stopColor="hsl(350, 80%, 50%)" />
          <stop offset="50%" stopColor="hsl(350, 70%, 40%)" />
          <stop offset="75%" stopColor="hsl(350, 85%, 55%)" />
          <stop offset="100%" stopColor="hsl(350, 75%, 35%)" />
        </linearGradient>
        
        {/* Filter for fuzzy thread look */}
        <filter id={`thread-texture-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Shadow under the thread */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0, 0, 0, 0.4)"
        strokeWidth={isValid ? 5 : 3}
        strokeLinecap="round"
        style={{
          transform: "translate(2px, 3px)",
        }}
      />
      
      {/* Main thread - darker base layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? "hsl(350, 70%, 35%)" : "hsl(30, 15%, 35%)"}
        strokeWidth={isValid ? 5 : 2.5}
        strokeLinecap="round"
      />
      
      {/* Thread highlight - lighter twisted effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? `url(#thread-gradient-${id})` : "hsl(30, 20%, 45%)"}
        strokeWidth={isValid ? 3.5 : 1.5}
        strokeLinecap="round"
        style={{
          filter: isValid ? `url(#thread-texture-${id})` : "none",
        }}
      />
      
      {/* Top highlight for 3D effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? "hsl(350, 60%, 60%)" : "hsl(30, 25%, 55%)"}
        strokeWidth={isValid ? 1.5 : 0.5}
        strokeLinecap="round"
        style={{
          transform: "translate(-0.5px, -0.5px)",
          opacity: 0.6,
        }}
      />
    </g>
  );
});

RedStringEdge.displayName = "RedStringEdge";
