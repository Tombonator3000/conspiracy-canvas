/**
 * Win Condition Validation Utilities
 *
 * This module implements semantic tag-based win condition checking.
 * Instead of checking specific node IDs, it validates that all required
 * "truth tags" are present within a single connected cluster on the board.
 *
 * This approach supports:
 * - Combined nodes (nodes created by merging items inherit parent tags)
 * - Multiple valid solutions (different node combinations can satisfy the same tags)
 * - Flexible game design (win conditions defined by semantic meaning, not specific nodes)
 */

import { EvidenceNode, Position } from '../types/game';

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
 * (allows flexibility with different node representations)
 */
export interface ValidatableNode {
  id: string;
  truthTags?: string[];
  position?: Position;
}

/**
 * Build an adjacency list from edges for graph traversal
 */
const buildAdjacencyList = (edges: WinValidationEdge[]): Map<string, Set<string>> => {
  const adjacency = new Map<string, Set<string>>();

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, new Set());
    }
    if (!adjacency.has(edge.target)) {
      adjacency.set(edge.target, new Set());
    }
    adjacency.get(edge.source)!.add(edge.target);
    adjacency.get(edge.target)!.add(edge.source);
  });

  return adjacency;
};

/**
 * Find all connected clusters (subgraphs) on the board using BFS
 *
 * @param edges - Array of edges representing connections between nodes
 * @param allNodeIds - Array of all node IDs currently on the board
 * @returns Array of Sets, each Set containing the node IDs of a connected cluster
 */
export const findAllConnectedClusters = (
  edges: WinValidationEdge[],
  allNodeIds: string[]
): Set<string>[] => {
  if (allNodeIds.length === 0) return [];

  const adjacency = buildAdjacencyList(edges);
  const visited = new Set<string>();
  const clusters: Set<string>[] = [];

  // Find clusters for connected nodes
  for (const nodeId of allNodeIds) {
    // Skip already visited nodes
    if (visited.has(nodeId)) continue;

    // Skip isolated nodes (no connections) - they can't form a winning cluster
    if (!adjacency.has(nodeId)) continue;

    // BFS to find this connected component
    const cluster = new Set<string>();
    const queue: string[] = [nodeId];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (visited.has(current)) continue;

      visited.add(current);
      cluster.add(current);

      const neighbors = adjacency.get(current);
      if (neighbors) {
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && allNodeIds.includes(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }

    // Only add non-empty clusters
    if (cluster.size > 0) {
      clusters.push(cluster);
    }
  }

  return clusters;
};

/**
 * Normalize a tag for case-insensitive comparison
 * Converts to lowercase and trims whitespace
 */
const normalizeTag = (tag: string): string => tag.toLowerCase().trim();

/**
 * Collect all unique truth tags from nodes in a cluster
 *
 * This function handles combined nodes correctly because combined nodes
 * inherit truthTags from their parent nodes during the combination process.
 * Tags are normalized to lowercase for case-insensitive comparison.
 *
 * @param clusterNodeIds - Set of node IDs in the cluster
 * @param allNodes - Array of all nodes with their data
 * @returns Set of all unique truth tags found in the cluster (normalized to lowercase)
 */
export const collectTruthTagsFromCluster = (
  clusterNodeIds: Set<string>,
  allNodes: ValidatableNode[]
): Set<string> => {
  const collectedTags = new Set<string>();

  clusterNodeIds.forEach((nodeId) => {
    const node = allNodes.find((n) => n.id === nodeId);
    if (node?.truthTags) {
      // Normalize tags to lowercase for case-insensitive comparison
      node.truthTags.forEach((tag) => collectedTags.add(normalizeTag(tag)));
    }
  });

  return collectedTags;
};

/**
 * Check if a set of collected tags satisfies the required truth tags
 * Uses case-insensitive comparison for matching.
 *
 * @param collectedTags - Set of tags collected from a cluster (should already be normalized)
 * @param requiredTags - Array of tags that must ALL be present
 * @returns true if all required tags are present
 */
export const hasAllRequiredTags = (
  collectedTags: Set<string>,
  requiredTags: string[]
): boolean => {
  // Normalize required tags for case-insensitive comparison
  return requiredTags.every((tag) => collectedTags.has(normalizeTag(tag)));
};

/**
 * Find which tags are missing from a collection
 * Uses case-insensitive comparison for matching.
 *
 * @param collectedTags - Set of tags collected from a cluster (should already be normalized)
 * @param requiredTags - Array of tags that should be present
 * @returns Array of missing tags (original case preserved)
 */
export const findMissingTags = (
  collectedTags: Set<string>,
  requiredTags: string[]
): string[] => {
  // Normalize required tags for case-insensitive comparison
  return requiredTags.filter((tag) => !collectedTags.has(normalizeTag(tag)));
};

/**
 * Main win condition check function
 *
 * Algorithm:
 * 1. Use BFS to identify ALL connected clusters (subgraphs) on the board
 * 2. For each cluster, collect ALL unique truthTags from its nodes
 * 3. Check if ANY single cluster contains ALL the requiredTags
 * 4. Return true if a valid cluster exists
 *
 * This is an improvement over checking only the largest cluster, because:
 * - A smaller but complete cluster should win
 * - Multiple disconnected theories on the board shouldn't prevent victory
 *   if one of them is correct
 *
 * Combined nodes are handled correctly because:
 * - When nodes are combined, the result node inherits truthTags from both parents
 * - The inherited tags are stored in the node's truthTags array
 * - This function simply reads whatever truthTags are on the node
 *
 * @param nodes - Array of all nodes currently on the board
 * @param edges - Array of edges representing connections between nodes
 * @param requiredTags - Array of truth tags that must ALL be present in a single cluster
 * @returns true if any connected cluster contains all required tags
 */
export const checkWinCondition = (
  nodes: ValidatableNode[],
  edges: WinValidationEdge[],
  requiredTags: string[]
): boolean => {
  // VERBOSE DEBUG: Start of win condition check
  console.log('=== WIN CONDITION CHECK ===');
  console.log('Required Tags:', requiredTags);
  console.log('Total Nodes:', nodes.length);
  console.log('Total Edges:', edges.length);

  // No required tags = no semantic win condition defined
  if (!requiredTags || requiredTags.length === 0) {
    console.log('❌ No required tags defined - returning false');
    return false;
  }

  // No nodes on board = can't win
  if (nodes.length === 0) {
    console.log('❌ No nodes on board - returning false');
    return false;
  }

  const allNodeIds = nodes.map((n) => n.id);
  const clusters = findAllConnectedClusters(edges, allNodeIds);

  console.log('Clusters Found:', clusters.length);

  // No connected clusters = can't win (need at least connections)
  if (clusters.length === 0) {
    console.log('❌ No connected clusters found - returning false');
    return false;
  }

  // Check each cluster to see if any has all required tags
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    const collectedTags = collectTruthTagsFromCluster(cluster, nodes);

    console.log(`--- Cluster ${i + 1} ---`);
    console.log('  Nodes in cluster:', Array.from(cluster));
    console.log('  Collected truthTags:', Array.from(collectedTags));

    // Show which nodes contributed which tags
    cluster.forEach((nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      console.log(`    Node "${nodeId}" truthTags:`, node?.truthTags || '(none)');
    });

    // Check for match using case-insensitive subset check
    const normalizedRequired = requiredTags.map(normalizeTag);
    const missingTags = normalizedRequired.filter((tag) => !collectedTags.has(tag));

    if (missingTags.length === 0) {
      console.log('✅ VICTORY! All required tags found in cluster!');
      return true;
    } else {
      console.log('  Missing tags:', missingTags);
    }
  }

  console.log('❌ No cluster has all required tags - returning false');
  return false;
};

/**
 * Extended win condition check that returns detailed results
 *
 * Useful for debugging, UI feedback, and progress tracking.
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
  // No required tags = no semantic win condition defined
  if (!requiredTags || requiredTags.length === 0) {
    return { isVictory: false, missingTags: [] };
  }

  // No nodes on board = can't win
  if (nodes.length === 0) {
    return { isVictory: false, missingTags: [...requiredTags] };
  }

  const allNodeIds = nodes.map((n) => n.id);
  const clusters = findAllConnectedClusters(edges, allNodeIds);

  // Track the best cluster (one with most required tags)
  let bestCluster: Set<string> | null = null;
  let bestTags: Set<string> = new Set();
  let fewestMissing: string[] = [...requiredTags];

  // Check each cluster
  for (const cluster of clusters) {
    const collectedTags = collectTruthTagsFromCluster(cluster, nodes);

    // Check for victory
    if (hasAllRequiredTags(collectedTags, requiredTags)) {
      return {
        isVictory: true,
        winningClusterNodeIds: Array.from(cluster),
        collectedTags: Array.from(collectedTags),
        missingTags: [],
      };
    }

    // Track best partial match for feedback
    const missing = findMissingTags(collectedTags, requiredTags);
    if (missing.length < fewestMissing.length) {
      fewestMissing = missing;
      bestCluster = cluster;
      bestTags = collectedTags;
    }
  }

  // No winning cluster found - return info about best attempt
  return {
    isVictory: false,
    winningClusterNodeIds: bestCluster ? Array.from(bestCluster) : undefined,
    collectedTags: bestTags.size > 0 ? Array.from(bestTags) : undefined,
    missingTags: fewestMissing,
  };
};

/**
 * Get the largest connected cluster (legacy compatibility)
 *
 * This is provided for backwards compatibility with code that expects
 * only the largest cluster to be checked.
 *
 * @param edges - Array of edges representing connections
 * @param allNodeIds - Array of all node IDs on the board
 * @returns Set of node IDs in the largest cluster, or empty Set if none
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
