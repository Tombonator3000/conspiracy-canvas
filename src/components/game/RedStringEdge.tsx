import { memo } from "react";
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export const RedStringEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isValid = (data as { isValid?: boolean })?.isValid ?? false;

  return (
    <>
      {/* Glow effect for valid connections */}
      {isValid && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: "hsl(350, 100%, 60%)",
            strokeWidth: 8,
            filter: "blur(4px)",
            opacity: 0.5,
          }}
        />
      )}
      
      {/* Main string */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isValid ? "hsl(350, 80%, 50%)" : "hsl(30, 20%, 40%)",
          strokeWidth: isValid ? 3 : 1.5,
          strokeLinecap: "round",
          filter: isValid ? "drop-shadow(0 0 2px rgba(196, 30, 58, 0.6))" : "none",
        }}
      />
    </>
  );
});

RedStringEdge.displayName = "RedStringEdge";
