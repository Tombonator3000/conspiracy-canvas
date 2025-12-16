import { memo } from "react";
import { getStraightPath, type EdgeProps } from "@xyflow/react";

export type StringColorScheme = 'red' | 'blue';

interface StringColorConfig {
  hue: number;
  outerGlow: string;
  innerGlow: string;
  gradient: {
    start: string;
    mid1: string;
    mid2: string;
    mid3: string;
    end: string;
  };
  baseValid: string;
  baseInvalid: string;
  highlight: string;
  highlightValid: string;
  highlightInvalid: string;
}

const COLOR_CONFIGS: Record<StringColorScheme, StringColorConfig> = {
  red: {
    hue: 350,
    outerGlow: "hsl(350, 100%, 60%)",
    innerGlow: "hsl(350, 90%, 55%)",
    gradient: {
      start: "hsl(350, 75%, 35%)",
      mid1: "hsl(350, 80%, 50%)",
      mid2: "hsl(350, 70%, 40%)",
      mid3: "hsl(350, 85%, 55%)",
      end: "hsl(350, 75%, 35%)",
    },
    baseValid: "hsl(350, 70%, 35%)",
    baseInvalid: "hsl(30, 15%, 35%)",
    highlight: "hsl(350, 60%, 60%)",
    highlightValid: "hsl(350, 60%, 60%)",
    highlightInvalid: "hsl(30, 25%, 55%)",
  },
  blue: {
    hue: 210,
    outerGlow: "hsl(210, 100%, 60%)",
    innerGlow: "hsl(220, 90%, 55%)",
    gradient: {
      start: "hsl(210, 75%, 35%)",
      mid1: "hsl(220, 80%, 50%)",
      mid2: "hsl(210, 70%, 40%)",
      mid3: "hsl(220, 85%, 55%)",
      end: "hsl(210, 75%, 35%)",
    },
    baseValid: "hsl(210, 70%, 35%)",
    baseInvalid: "hsl(210, 15%, 35%)",
    highlight: "hsl(210, 60%, 60%)",
    highlightValid: "hsl(210, 60%, 60%)",
    highlightInvalid: "hsl(210, 25%, 55%)",
  },
};

interface StringEdgeProps extends EdgeProps {
  colorScheme: StringColorScheme;
}

export const StringEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  colorScheme,
}: StringEdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isValid = (data as { isValid?: boolean })?.isValid ?? false;
  const colors = COLOR_CONFIGS[colorScheme];
  const gradientId = `${colorScheme}-thread-gradient-${id}`;
  const filterId = `${colorScheme}-thread-texture-${id}`;

  return (
    <g>
      {/* Glow effect for valid connections */}
      {isValid && (
        <>
          {/* Outer glow */}
          <path
            d={edgePath}
            fill="none"
            stroke={colors.outerGlow}
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
            stroke={colors.innerGlow}
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
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.gradient.start} />
          <stop offset="25%" stopColor={colors.gradient.mid1} />
          <stop offset="50%" stopColor={colors.gradient.mid2} />
          <stop offset="75%" stopColor={colors.gradient.mid3} />
          <stop offset="100%" stopColor={colors.gradient.end} />
        </linearGradient>

        {/* Filter for fuzzy thread look */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
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
        stroke={isValid ? colors.baseValid : colors.baseInvalid}
        strokeWidth={isValid ? 5 : 2.5}
        strokeLinecap="round"
      />

      {/* Thread highlight - lighter twisted effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? `url(#${gradientId})` : `hsl(${colors.hue}, 20%, 45%)`}
        strokeWidth={isValid ? 3.5 : 1.5}
        strokeLinecap="round"
        style={{
          filter: isValid ? `url(#${filterId})` : "none",
        }}
      />

      {/* Top highlight for 3D effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? colors.highlightValid : colors.highlightInvalid}
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

StringEdge.displayName = "StringEdge";

// Convenience wrappers for backward compatibility
export const RedStringEdge = memo((props: EdgeProps) => (
  <StringEdge {...props} colorScheme="red" />
));
RedStringEdge.displayName = "RedStringEdge";

export const BlueStringEdge = memo((props: EdgeProps) => (
  <StringEdge {...props} colorScheme="blue" />
));
BlueStringEdge.displayName = "BlueStringEdge";
