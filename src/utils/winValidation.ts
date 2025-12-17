import { Edge } from "@xyflow/react";
import { EvidenceNode } from "@/types/game";

// Helper interface for the logic
export interface WinValidationEdge {
  source: string;
  target: string;
}

export const checkWinConditionDetailed = (
  nodes: EvidenceNode[],
  edges: WinValidationEdge[],
  requiredTags: string[]
) => {
  // 1. Basic checks
  if (!requiredTags || requiredTags.length === 0) {
    return { isVictory: false, missingTags: [] };
  }

  // 2. Build BIDIRECTIONAL Adjacency List
  // This makes the graph "Undirected" - connections go both ways automatically
  const adj = new Map<string, string[]>();
  // Init all nodes
  nodes.forEach(node => adj.set(node.id, []));

  // Map connections both ways
  edges.forEach(edge => {
    // Forward
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    adj.get(edge.source)?.push(edge.target);

    // Backward (CRITICAL FIX)
    if (!adj.has(edge.target)) adj.set(edge.target, []);
    adj.get(edge.target)?.push(edge.source);
  });

  // 3. Flood Fill (BFS) to find clusters
  const visited = new Set<string>();
  let victoryFound = false;
  let bestMissingTags = [...requiredTags];

  for (const node of nodes) {
    if (visited.has(node.id)) continue;

    // Start a new cluster search
    const clusterTags = new Set<string>();
    const queue = [node.id];
    visited.add(node.id);

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      // Find the full node object to get its tags
      // We look up in the 'nodes' array passed from the board (which has the merged tags)
      const currentNode = nodes.find(n => n.id === currentId);

      if (currentNode?.truthTags) {
        currentNode.truthTags.forEach(tag => clusterTags.add(tag.toLowerCase()));
      }

      // Check neighbors
      const neighbors = adj.get(currentId) || [];
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      }
    }

    // 4. Check if this specific cluster is a WINNER
    const normalizedRequired = requiredTags.map(t => t.toLowerCase());
    const missingInThisCluster = normalizedRequired.filter(reqTag => !clusterTags.has(reqTag));

    // Debug log to show exactly what the math sees
    console.log(`🔍 Cluster Analysis: Found tags [${Array.from(clusterTags).join(', ')}] vs Required [${normalizedRequired.join(', ')}]`);

    if (missingInThisCluster.length === 0) {
      victoryFound = true;
      bestMissingTags = [];
      break;
    }

    // Track the "closest" attempt for UI feedback
    if (missingInThisCluster.length < bestMissingTags.length) {
      bestMissingTags = missingInThisCluster;
    }
  }

  return {
    isVictory: victoryFound,
    missingTags: bestMissingTags
  };
};
