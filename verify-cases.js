// Case verification script - standalone version
// Run with: node verify-cases.js

// Case data extracted for verification
const cases = [
  {
    id: "case_001_birds",
    title: "Operation: Feathered Battery",
    difficulty: "TUTORIAL",
    maxConnectionsNeeded: 3,
    criticalNodes: [
      { id: "ev_pigeon_photo", title: "Suspicious Bird", tags: ["DRONE", "SURVEILLANCE", "EYES"] },
      { id: "ev_schematic", title: "Leaked Patent #9921", tags: ["DRONE", "GOVERNMENT", "BATTERY"] },
      { id: "ev_powerline", title: "Power Line Anomaly", tags: ["BATTERY", "ELECTRICITY", "CITY"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_combined_blueprint", tags: ["DRONE", "BATTERY", "SURVEILLANCE"] },
      { id: "ev_charging_network", tags: ["BATTERY", "ELECTRICITY", "GOVERNMENT"] },
      { id: "ev_camera_specs", tags: ["SURVEILLANCE", "EYES", "DRONE"] },
    ]
  },
  {
    id: "case_002_socks",
    title: "The Great Sock Conspiracy",
    difficulty: "EASY",
    maxConnectionsNeeded: 3,
    criticalNodes: [
      { id: "ev_lonely_sock", title: "The Survivor", tags: ["COTTON", "LOST", "FABRIC", "MISSING"] },
      { id: "ev_receipt", title: "Damning Evidence", tags: ["CLOTHES", "MISSING", "PURCHASE"] },
      { id: "ev_seismograph", title: "Seismic Anomaly", tags: ["EARTH", "HOLE", "MISSING"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_portal_frequency", tags: ["FABRIC", "HOLE", "EARTH"] },
      { id: "ev_smoking_gun", tags: ["EARTH", "HOLE", "MISSING", "FABRIC"] },
    ]
  },
  {
    id: "case_003_milk",
    title: "The Expiration Deception",
    difficulty: "EASY",
    maxConnectionsNeeded: 3,
    criticalNodes: [
      { id: "ev_bodybuilder", title: "The Enlightened One", tags: ["MILK", "STRONG", "MUSCLE", "DAIRY"] },
      { id: "ev_memo", title: "Leaked Internal Memo", tags: ["DAIRY", "WEAK", "SECRET"] },
      { id: "ev_calendar", title: "Date Printer Manual", tags: ["DATE", "FAKE", "WEAK"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_conspiracy_photo", tags: ["DAIRY", "STRONG", "SECRET"] },
      { id: "ev_suppression_formula", tags: ["WEAK", "DAIRY", "SECRET"] },
    ]
  },
  {
    id: "case_004_cloud",
    title: "The Literal Cloud",
    difficulty: "MEDIUM",
    maxConnectionsNeeded: 4,
    criticalNodes: [
      { id: "ev_cloud_disk", title: "Suspicious Formation", tags: ["SKY", "DATA", "STORAGE"] },
      { id: "ev_rain_article", title: "Weather Anomaly Report", tags: ["RAIN", "TECH", "UPLOAD"] },
      { id: "ev_server_smoke", title: "Data Center Exhaust", tags: ["SMOKE", "CLOUD", "DATA"] },
      { id: "ev_dropbox", title: "Dropbox = DROP. BOX.", tags: ["STORAGE", "RAIN", "NAME"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_correlation_chart", tags: ["RAIN", "DATA", "UPLOAD"] },
      { id: "ev_admission", tags: ["CLOUD", "DATA", "SKY"] },
    ]
  },
  {
    id: "case_005_cats",
    title: "5G Feline Network",
    difficulty: "MEDIUM",
    maxConnectionsNeeded: 4,
    criticalNodes: [
      { id: "ev_cat_router", title: "Charging Station", tags: ["CAT", "HEAT", "WIFI"] },
      { id: "ev_purr_frequency", title: "Acoustic Analysis", tags: ["SOUND", "FREQUENCY", "5G", "CAT"] },
      { id: "ev_cat_eyes", title: "The Gaze", tags: ["EYES", "DATA", "CAT"] },
      { id: "ev_ancient_egypt", title: "Historical Pattern", tags: ["HISTORY", "WIFI", "TOWER"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_signal_match", tags: ["FREQUENCY", "5G", "WIFI"] },
      { id: "ev_firmware_update", tags: ["CAT", "WIFI", "5G"] },
    ]
  },
  {
    id: "case_006_moon",
    title: "The Solar Flip",
    difficulty: "HARD",
    maxConnectionsNeeded: 5,
    criticalNodes: [
      { id: "ev_lightbulb", title: "Proof of Concept", tags: ["LIGHT", "OFF", "FLIP"] },
      { id: "ev_budget", title: "NASA Budget Analysis", tags: ["MONEY", "SPACE", "CUT"] },
      { id: "ev_eclipse", title: "The Glitch", tags: ["SKY", "FLIP", "ERROR", "SPACE"] },
      { id: "ev_craters", title: "Crater Analysis", tags: ["HOLE", "VENT", "SPACE"] },
      { id: "ev_phases", title: "Moon Phases = Dimmer Switch", tags: ["LIGHT", "OFF", "TEST"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_flip_diagram", tags: ["FLIP", "SPACE", "ERROR"] },
      { id: "ev_dimmer_controls", tags: ["FLIP", "LIGHT", "SPACE"] },
      { id: "ev_final_truth", tags: ["FLIP", "SPACE", "OFF"] },
    ]
  },
  {
    id: "case_007_titanic",
    title: "Titanic Tourism",
    difficulty: "HARD",
    maxConnectionsNeeded: 5,
    criticalNodes: [
      { id: "ev_iphone_1912", title: "Temporal Anomaly", tags: ["TECH", "OLD", "PHONE", "TIME"] },
      { id: "ev_passenger_list", title: "Passenger Manifest", tags: ["NAME", "TIME", "LIST"] },
      { id: "ev_iceberg", title: "The 'Iceberg'", tags: ["ICE", "FAKE", "PROP", "TIME"] },
      { id: "ev_souvenirs", title: "Cargo Manifest Anomaly", tags: ["WEIGHT", "TIME", "CARGO"] },
      { id: "ev_band", title: "The Band Played On", tags: ["MUSIC", "TIME", "CALM"] },
    ],
    combinationCriticalNodes: [
      { id: "ev_time_tourist", tags: ["TIME", "PHONE", "TOURIST"] },
      { id: "ev_playlist", tags: ["MUSIC", "TIME", "CALM"] },
      { id: "ev_cameron_confession", tags: ["TIME", "LIST", "FILM"] },
    ]
  },
  {
    id: "case_008_microwave",
    title: "Operation: Temporal Soup",
    difficulty: "MEDIUM",
    maxConnectionsNeeded: 5,
    criticalNodes: [
      { id: "ev_patent_1947", title: "Original Microwave Patent", tags: ["MICROWAVE", "PATENT", "TECHNOLOGY"], timelineTags: ["1947_ORIGIN", "TIMELINE_START"] },
      { id: "ev_popcorn_anomaly", title: "Popcorn Timing Discrepancy", tags: ["POPCORN", "TIME", "FOOD"], timelineTags: ["TIME_ANOMALY", "EVIDENCE_2010"] },
      { id: "ev_rotating_plate", title: "The Rotating Plate", tags: ["MICROWAVE", "ROTATION", "VORTEX"], timelineTags: ["MECHANISM", "TIME_ANOMALY"] },
      { id: "ev_cold_spots", title: "Cold Spot Phenomenon", tags: ["TEMPERATURE", "TIME", "PHYSICS"], timelineTags: ["MECHANISM", "EVIDENCE_2010"] },
      { id: "ev_clock_testimony", title: "Kitchen Clock Testimony", tags: ["CLOCK", "TIME", "TESTIMONY"], timelineTags: ["TIMELINE_START", "EVIDENCE_2010"] },
    ],
    useBlueThread: true,
    combinationCriticalNodes: []
  }
];

// Build adjacency graph for red thread connections (tags)
function buildRedGraph(nodes) {
  const graph = {};
  for (const node of nodes) {
    graph[node.id] = new Set();
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];
      const sharedTag = nodeA.tags.find(tag => nodeB.tags.includes(tag));
      if (sharedTag) {
        graph[nodeA.id].add(nodeB.id);
        graph[nodeB.id].add(nodeA.id);
      }
    }
  }
  return graph;
}

// Build adjacency graph for blue thread connections (timelineTags)
function buildBlueGraph(nodes) {
  const graph = {};
  for (const node of nodes) {
    graph[node.id] = new Set();
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];
      const tagsA = nodeA.timelineTags || [];
      const tagsB = nodeB.timelineTags || [];
      const sharedTag = tagsA.find(tag => tagsB.includes(tag));
      if (sharedTag) {
        graph[nodeA.id].add(nodeB.id);
        graph[nodeB.id].add(nodeA.id);
      }
    }
  }
  return graph;
}

// Merge two graphs
function mergeGraphs(graphA, graphB) {
  const merged = {};
  for (const nodeId of Object.keys(graphA)) {
    merged[nodeId] = new Set(graphA[nodeId]);
  }
  for (const nodeId of Object.keys(graphB)) {
    if (!merged[nodeId]) merged[nodeId] = new Set();
    for (const neighbor of graphB[nodeId]) {
      merged[nodeId].add(neighbor);
    }
  }
  return merged;
}

// BFS to find connected component
function getConnectedComponent(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = graph[current] || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited;
}

// Find shared tag between two nodes
function findSharedTag(nodeA, nodeB, useTimeline = false) {
  if (useTimeline) {
    const tagsA = nodeA.timelineTags || [];
    const tagsB = nodeB.timelineTags || [];
    return tagsA.find(t => tagsB.includes(t));
  }
  return nodeA.tags.find(t => nodeB.tags.includes(t));
}

// Verify a case
function verifyCase(caseData) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`CASE: ${caseData.title} (${caseData.id})`);
  console.log(`Difficulty: ${caseData.difficulty} | Max Connections: ${caseData.maxConnectionsNeeded}`);
  console.log(`${'='.repeat(70)}`);

  const nodes = caseData.criticalNodes;
  const useBlue = caseData.useBlueThread || false;

  console.log(`\nCritical Nodes (${nodes.length}):`);
  for (const node of nodes) {
    console.log(`  • ${node.title} (${node.id})`);
    console.log(`    Tags: [${node.tags.join(', ')}]`);
    if (node.timelineTags) {
      console.log(`    Timeline: [${node.timelineTags.join(', ')}]`);
    }
  }

  // Build graphs
  const redGraph = buildRedGraph(nodes);
  let combinedGraph = redGraph;

  if (useBlue) {
    const blueGraph = buildBlueGraph(nodes);
    combinedGraph = mergeGraphs(redGraph, blueGraph);
  }

  // Show direct connections between critical nodes
  console.log(`\nDirect Connections Between Critical Nodes:`);
  let connectionCount = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      const redTag = findSharedTag(nodeA, nodeB, false);
      const blueTag = useBlue ? findSharedTag(nodeA, nodeB, true) : null;

      if (redTag || blueTag) {
        connectionCount++;
        const connections = [];
        if (redTag) connections.push(`RED:${redTag}`);
        if (blueTag) connections.push(`BLUE:${blueTag}`);
        console.log(`  ✓ ${nodeA.title} ↔ ${nodeB.title}`);
        console.log(`    via ${connections.join(', ')}`);
      }
    }
  }

  if (connectionCount === 0) {
    console.log(`  (no direct connections found)`);
  }

  // Check if all critical nodes can be connected
  const connected = getConnectedComponent(combinedGraph, nodes[0].id);
  const connectedNodes = nodes.filter(n => connected.has(n.id));
  const disconnectedNodes = nodes.filter(n => !connected.has(n.id));

  // Find the path to connect all nodes
  console.log(`\nConnection Path Analysis:`);
  if (disconnectedNodes.length === 0) {
    // Build a minimal spanning path
    const visited = new Set([nodes[0].id]);
    let current = nodes[0];
    const path = [current.title];

    while (visited.size < nodes.length) {
      // Find next unvisited node that can connect
      let foundNext = false;
      for (const neighbor of combinedGraph[current.id]) {
        if (!visited.has(neighbor)) {
          const nextNode = nodes.find(n => n.id === neighbor);
          if (nextNode) {
            visited.add(neighbor);
            const redTag = findSharedTag(current, nextNode, false);
            const blueTag = useBlue ? findSharedTag(current, nextNode, true) : null;
            const via = redTag ? `RED:${redTag}` : `BLUE:${blueTag}`;
            path.push(`--[${via}]--> ${nextNode.title}`);
            current = nextNode;
            foundNext = true;
            break;
          }
        }
      }

      if (!foundNext) {
        // Need to go back and find another path through visited nodes
        for (const visitedId of visited) {
          const visitedNode = nodes.find(n => n.id === visitedId);
          for (const neighbor of combinedGraph[visitedId]) {
            if (!visited.has(neighbor)) {
              const nextNode = nodes.find(n => n.id === neighbor);
              if (nextNode) {
                visited.add(neighbor);
                const redTag = findSharedTag(visitedNode, nextNode, false);
                const blueTag = useBlue ? findSharedTag(visitedNode, nextNode, true) : null;
                const via = redTag ? `RED:${redTag}` : `BLUE:${blueTag}`;
                path.push(`\n  (via ${visitedNode.title}) --[${via}]--> ${nextNode.title}`);
                current = nextNode;
                foundNext = true;
                break;
              }
            }
          }
          if (foundNext) break;
        }
      }

      if (!foundNext) break;
    }

    console.log(`  ${path.join('\n  ')}`);
  }

  // Result
  console.log(`\n${'─'.repeat(70)}`);
  if (disconnectedNodes.length === 0) {
    console.log(`✅ SOLVABLE: All ${nodes.length} critical nodes can form a connected cluster`);
  } else {
    console.log(`❌ NOT SOLVABLE: ${disconnectedNodes.length} critical node(s) cannot be connected`);
    console.log(`   Disconnected: ${disconnectedNodes.map(n => n.title).join(', ')}`);
  }

  // Show combination nodes if any
  if (caseData.combinationCriticalNodes && caseData.combinationCriticalNodes.length > 0) {
    console.log(`\n📦 Additional Critical Nodes from Combinations: ${caseData.combinationCriticalNodes.length}`);
    for (const node of caseData.combinationCriticalNodes) {
      console.log(`   • ${node.id}: [${node.tags.join(', ')}]`);
    }
  }

  return disconnectedNodes.length === 0;
}

// Main
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║           CONSPIRACY CANVAS - CASE SOLVABILITY VERIFICATION          ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');

const results = [];
for (const caseData of cases) {
  const solvable = verifyCase(caseData);
  results.push({ title: caseData.title, solvable });
}

console.log('\n\n╔══════════════════════════════════════════════════════════════════════╗');
console.log('║                              SUMMARY                                  ║');
console.log('╠══════════════════════════════════════════════════════════════════════╣');

let allSolvable = true;
for (const result of results) {
  const status = result.solvable ? '✅' : '❌';
  const padding = ' '.repeat(Math.max(0, 50 - result.title.length));
  console.log(`║ ${status} ${result.title}${padding}║`);
  if (!result.solvable) allSolvable = false;
}

console.log('╠══════════════════════════════════════════════════════════════════════╣');
if (allSolvable) {
  console.log('║                    ✅ ALL CASES ARE SOLVABLE                         ║');
} else {
  console.log('║                    ❌ SOME CASES HAVE ISSUES                          ║');
}
console.log('╚══════════════════════════════════════════════════════════════════════╝');
