import { memo, useMemo } from "react";
import { getBezierPath, type EdgeProps } from "@xyflow/react";

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
  fiberColor: string;
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
    fiberColor: "hsl(350, 40%, 70%)",
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
    fiberColor: "hsl(210, 40%, 70%)",
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
  // Calculate distance for sag effect
  const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
  const sagAmount = Math.min(distance * 0.15, 40); // More sag for longer strings
  
  // Use bezier path for natural string curve with sag
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curvature: 0.25 + (sagAmount / 200), // More curvature for longer strings
  });

  const isValid = (data as { isValid?: boolean })?.isValid ?? false;
  const colors = COLOR_CONFIGS[colorScheme];
  const gradientId = `${colorScheme}-thread-gradient-${id}`;
  const fiberPatternId = `${colorScheme}-fiber-pattern-${id}`;
  const filterId = `${colorScheme}-thread-texture-${id}`;
  const glowFilterId = `${colorScheme}-glow-filter-${id}`;

  // Generate random fiber positions for texture - memoized per edge
  const fibers = useMemo(() => {
    const fiberCount = Math.max(3, Math.floor(distance / 40));
    return Array.from({ length: fiberCount }, (_, i) => ({
      offset: ((i + 1) / (fiberCount + 1)) * 100,
      length: 3 + Math.random() * 4,
      angle: -20 + Math.random() * 40,
    }));
  }, [distance]);

  return (
    <g>
      {/* Defs for filters and patterns */}
      <defs>
        {/* Gradient along the string */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.gradient.start} />
          <stop offset="25%" stopColor={colors.gradient.mid1} />
          <stop offset="50%" stopColor={colors.gradient.mid2} />
          <stop offset="75%" stopColor={colors.gradient.mid3} />
          <stop offset="100%" stopColor={colors.gradient.end} />
        </linearGradient>

        {/* Twisted fiber pattern */}
        <pattern id={fiberPatternId} patternUnits="userSpaceOnUse" width="8" height="4">
          <path d="M0 2 Q2 0, 4 2 Q6 4, 8 2" fill="none" stroke={colors.fiberColor} strokeWidth="0.5" opacity="0.4" />
          <path d="M0 2 Q2 4, 4 2 Q6 0, 8 2" fill="none" stroke={colors.fiberColor} strokeWidth="0.5" opacity="0.3" />
        </pattern>

        {/* Fuzzy thread filter */}
        <filter id={filterId} x="-20%" y="-50%" width="140%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" seed={id.charCodeAt(0)} />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Glow filter for valid connections */}
        <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow effect for valid connections */}
      {isValid && (
        <>
          {/* Outer atmospheric glow */}
          <path
            d={edgePath}
            fill="none"
            stroke={colors.outerGlow}
            strokeWidth={18}
            strokeLinecap="round"
            style={{
              filter: "blur(8px)",
              opacity: 0.25,
            }}
          />
          {/* Inner glow */}
          <path
            d={edgePath}
            fill="none"
            stroke={colors.innerGlow}
            strokeWidth={10}
            strokeLinecap="round"
            style={{
              filter: "blur(4px)",
              opacity: 0.4,
            }}
          />
        </>
      )}

      {/* Shadow under the thread - offset down and right */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0, 0, 0, 0.5)"
        strokeWidth={isValid ? 6 : 3}
        strokeLinecap="round"
        style={{
          transform: "translate(3px, 4px)",
          filter: "blur(2px)",
        }}
      />

      {/* Main thread - dark base layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? colors.baseValid : colors.baseInvalid}
        strokeWidth={isValid ? 5.5 : 2.5}
        strokeLinecap="round"
        style={{
          filter: `url(#${filterId})`,
        }}
      />

      {/* Thread core - gradient with fiber texture */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? `url(#${gradientId})` : `hsl(${colors.hue}, 20%, 45%)`}
        strokeWidth={isValid ? 4 : 1.8}
        strokeLinecap="round"
      />

      {/* Twisted fiber overlay - gives yarn-like appearance */}
      {isValid && (
        <path
          d={edgePath}
          fill="none"
          stroke={`url(#${fiberPatternId})`}
          strokeWidth={3}
          strokeLinecap="round"
          style={{ opacity: 0.6 }}
        />
      )}

      {/* Top highlight for 3D rounded effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={isValid ? colors.highlightValid : colors.highlightInvalid}
        strokeWidth={isValid ? 1.5 : 0.6}
        strokeLinecap="round"
        style={{
          transform: "translate(-0.5px, -1px)",
          opacity: 0.7,
        }}
      />

      {/* Loose fiber wisps - small hairs sticking out */}
      {isValid && fibers.map((fiber, i) => (
        <g key={i} style={{ opacity: 0.5 }}>
          <line
            x1={sourceX + (targetX - sourceX) * (fiber.offset / 100)}
            y1={sourceY + (targetY - sourceY) * (fiber.offset / 100) - 2}
            x2={sourceX + (targetX - sourceX) * (fiber.offset / 100) + Math.cos(fiber.angle * Math.PI / 180) * fiber.length}
            y2={sourceY + (targetY - sourceY) * (fiber.offset / 100) - 2 + Math.sin(fiber.angle * Math.PI / 180) * fiber.length}
            stroke={colors.fiberColor}
            strokeWidth={0.5}
            strokeLinecap="round"
          />
        </g>
      ))}
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
