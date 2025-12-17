/**
 * Win Condition Validation Utilities
 *
 * This module implements semantic tag-based win condition checking.
 * Uses UNDIRECTED graph traversal (bidirectional edges) to find connected clusters
 * and validates that all required "truth tags" are present within a single cluster.
 */

import { EvidenceNode } from '@/types/game';

/**
 * Represents an edge connection between two nodes
 */
export interface WinValidationEdge {
  source: string;
  target: string;
}

/**
 * Result of the win condition check with detailed information
 */
export interface WinConditionResult {
  isVictory: boolean;
  winningClusterNodeIds?: string[];
  collectedTags?: string[];
  missingTags?: string[];
}

/**
 * Simplified node interface for win validation
 */
export interface ValidatableNode {
  id: string;
  truthTags?: string[];
}

/**
 * Main win condition check function with detailed results
 *
 * Algorithm:
 * 1. Build an UNDIRECTED adjacency list (A->B implies B->A)
 * 2. Use BFS flood-fill to find all connected components
 * 3. For each component, aggregate ALL truthTags from every node
 * 4. Check if the aggregated tags are a superset of requiredTags
 *
 * @param nodes - Array of all nodes currently on the board
 * @param edges - Array of edges representing connections between nodes
 * @param requiredTags - Array of truth tags that must ALL be present in a single cluster
 * @returns Detailed result object with victory status and additional information
 */
export const checkWinConditionDetailed = (
  nodes: ValidatableNode[],
  edges: WinValidationEdge[],
  requiredTags: string[]
): WinConditionResult => {
  console.log('=== WIN VALIDATION (Bidirectional BFS) ===');
  console.log('Nodes count:', nodes.length);
  console.log('Edges count:', edges.length);
  console.log('Required tags:', JSON.stringify(requiredTags));

  // 1. Quick exit if no requirements
  if (!requiredTags || requiredTags.length === 0) {
    console.log('❌ No required tags defined - cannot win');
    return { isVictory: false, missingTags: [] };
  }

  // 2. Quick exit if no nodes
  if (nodes.length === 0) {
    console.log('❌ No nodes on board');
    return { isVictory: false, missingTags: [...requiredTags] };
  }

  // 3. Build Adjacency List (UNDIRECTED / Bidirectional)
  // This ensures that dragging A->B is treated the same as B->A
  const adj = new Map<string, string[]>();

  // Initialize ALL nodes in the map first (important!)
  nodes.forEach(node => adj.set(node.id, []));

  // Populate connections (both directions)
  edges.forEach(edge => {
    // Ensure source exists in map
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    // Ensure target exists in map
    if (!adj.has(edge.target)) adj.set(edge.target, []);

    // Add BOTH directions (CRITICAL for undirected graph)
    adj.get(edge.source)!.push(edge.target);
    adj.get(edge.target)!.push(edge.source);
  });

  console.log('Adjacency list built. Edges (bidirectional):');
  edges.forEach(e => console.log(`  ${e.source} <-> ${e.target}`));

  // 4. Find Connected Components using BFS Flood-Fill
  const visited = new Set<string>();
  let victoryFound = false;
  let bestMissingTags = [...requiredTags]; // Track the "closest" attempt for UI feedback
  let winningClusterIds: string[] = [];
  let winningClusterTags: string[] = [];

  // Normalize required tags for case-insensitive comparison
  const normalizedRequired = requiredTags.map(t => t.toLowerCase().trim());

  for (const node of nodes) {
    // Skip already visited nodes
    if (visited.has(node.id)) continue;

    // Start a new cluster search (BFS)
    const clusterNodeIds: string[] = [];
    const clusterTags = new Set<string>();
    const queue = [node.id];
    visited.add(node.id);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      clusterNodeIds.push(currentId);

      // Find the current node and collect its tags
      const currentNode = nodes.find(n => n.id === currentId);
      if (currentNode?.truthTags && currentNode.truthTags.length > 0) {
        currentNode.truthTags.forEach(tag => {
          clusterTags.add(tag.toLowerCase().trim());
        });
      }

      // Visit all neighbors (undirected - works in both directions)
      const neighbors = adj.get(currentId) || [];
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      }
    }

    // Only process clusters with at least one connection (2+ nodes)
    if (clusterNodeIds.length < 2) {
      continue;
    }

    console.log(`\n--- Cluster Found ---`);
    console.log('  Nodes in cluster:', clusterNodeIds);
    console.log('  Tags collected:', Array.from(clusterTags));

    // Log individual node contributions for debugging
    clusterNodeIds.forEach(nodeId => {
      const n = nodes.find(x => x.id === nodeId);
      console.log(`    Node "${nodeId}": truthTags = ${JSON.stringify(n?.truthTags || [])}`);
    });

    // 5. Validate this Cluster against Requirements
    const missingInThisCluster = normalizedRequired.filter(
      reqTag => !clusterTags.has(reqTag)
    );

    console.log('  Required tags (normalized):', normalizedRequired);
    console.log('  Missing in this cluster:', missingInThisCluster.length === 0 ? 'NONE - ALL MATCHED!' : missingInThisCluster);

    if (missingInThisCluster.length === 0) {
      // WINNER!
      console.log('🏆 VICTORY! All required tags found in cluster!');
      victoryFound = true;
      bestMissingTags = [];
      winningClusterIds = clusterNodeIds;
      winningClusterTags = Array.from(clusterTags);
      break;
    }

    // Keep track of the "closest" attempt for UI feedback
    if (missingInThisCluster.length < bestMissingTags.length) {
      bestMissingTags = missingInThisCluster;
    }
  }

  if (!victoryFound) {
    console.log('❌ No winning cluster found. Best attempt missing:', bestMissingTags);
  }

  return {
    isVictory: victoryFound,
    winningClusterNodeIds: victoryFound ? winningClusterIds : undefined,
    collectedTags: victoryFound ? winningClusterTags : undefined,
    missingTags: bestMissingTags,
  };
};

/**
 * Simple boolean win condition check (for backwards compatibility)
 */
export const checkWinCondition = (
  nodes: ValidatableNode[],
  edges: WinValidationEdge[],
  requiredTags: string[]
): boolean => {
  return checkWinConditionDetailed(nodes, edges, requiredTags).isVictory;
};

/**
 * Find all connected clusters (for UI/debugging purposes)
 */
export const findAllConnectedClusters = (
  edges: WinValidationEdge[],
  allNodeIds: string[]
): Set<string>[] => {
  if (allNodeIds.length === 0) return [];

  // Build bidirectional adjacency list
  const adj = new Map<string, string[]>();
  allNodeIds.forEach(id => adj.set(id, []));

  edges.forEach(edge => {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);
    adj.get(edge.source)!.push(edge.target);
    adj.get(edge.target)!.push(edge.source);
  });

  const visited = new Set<string>();
  const clusters: Set<string>[] = [];

  for (const nodeId of allNodeIds) {
    if (visited.has(nodeId)) continue;

    // Check if this node has any connections
    const neighbors = adj.get(nodeId) || [];
    if (neighbors.length === 0) continue;

    // BFS to find this connected component
    const cluster = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);
      cluster.add(current);

      const currentNeighbors = adj.get(current) || [];
      for (const neighbor of currentNeighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    if (cluster.size > 0) {
      clusters.push(cluster);
    }
  }

  return clusters;
};

/**
 * Get the largest connected cluster (legacy compatibility)
 */
export const getLargestConnectedCluster = (
  edges: WinValidationEdge[],
  allNodeIds: string[]
): Set<string> => {
  const clusters = findAllConnectedClusters(edges, allNodeIds);

  if (clusters.length === 0) {
    return new Set();
  }

  return clusters.reduce((largest, current) =>
    current.size > largest.size ? current : largest
  , clusters[0]);
};

/**
 * Collect all unique truth tags from nodes in a cluster
 */
export const collectTruthTagsFromCluster = (
  clusterNodeIds: Set<string>,
  allNodes: ValidatableNode[]
): Set<string> => {
  const collectedTags = new Set<string>();

  clusterNodeIds.forEach((nodeId) => {
    const node = allNodes.find((n) => n.id === nodeId);
    if (node?.truthTags) {
      node.truthTags.forEach((tag) => collectedTags.add(tag.toLowerCase().trim()));
    }
  });

  return collectedTags;
};

/**
 * Check if a set of collected tags satisfies the required truth tags
 */
export const hasAllRequiredTags = (
  collectedTags: Set<string>,
  requiredTags: string[]
): boolean => {
  return requiredTags.every((tag) => collectedTags.has(tag.toLowerCase().trim()));
};

/**
 * Find which tags are missing from a collection
 */
export const findMissingTags = (
  collectedTags: Set<string>,
  requiredTags: string[]
): string[] => {
  return requiredTags.filter((tag) => !collectedTags.has(tag.toLowerCase().trim()));
};
