import assert from "node:assert";
import { describe, it } from "node:test";
import { checkWinConditionDetailed } from "./winValidation";
import type { EvidenceNode } from "../types/game";

const buildEdge = (source: string, target: string) => ({ source, target });

describe("checkWinConditionDetailed", () => {
  it("returns missing truth tags when critical nodes are connected but incomplete", () => {
    const nodes: EvidenceNode[] = [
      {
        id: "a",
        type: "photo",
        title: "Suspect",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 0, y: 0 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["culprit"],
      },
      {
        id: "b",
        type: "document",
        title: "Motive Note",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 10, y: 10 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["motive"],
      },
    ];

    const edges = [buildEdge("a", "b")];
    const requiredTags = ["culprit", "motive", "weapon"];

    const result = checkWinConditionDetailed(nodes, edges, requiredTags);

    assert.strictEqual(result.isVictory, false);
    assert.deepStrictEqual(result.missingTags, ["weapon"]);
  });

  it("CASE_001: returns victory when all 3 critical nodes are connected with subject, location, proof", () => {
    // Simulate CASE_001 - the 3 critical evidence nodes
    const nodes: EvidenceNode[] = [
      {
        id: "ev_pigeon_photo",
        type: "photo",
        title: "Suspicious Bird",
        contentUrl: null,
        description: "Photo taken at 3 AM. Subject has not blinked for 2 hours.",
        tags: ["DRONE", "SURVEILLANCE", "EYES", "subject"],
        position: { x: 180, y: 140 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["subject"], // THE SUBJECT of the conspiracy
      },
      {
        id: "ev_schematic",
        type: "document",
        title: "Leaked Patent #9921",
        contentUrl: null,
        description: "Blueprint for 'Autonomous Avian Data Collector'. CLASSIFIED.",
        tags: ["DRONE", "GOVERNMENT", "BATTERY", "proof"],
        position: { x: 520, y: 180 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["proof"], // THE PROOF that birds are drones
      },
      {
        id: "ev_powerline",
        type: "photo",
        title: "Power Line Anomaly",
        contentUrl: null,
        description: "Energy spikes detected whenever flocks land here. COINCIDENCE?",
        tags: ["BATTERY", "ELECTRICITY", "CITY", "location"],
        position: { x: 350, y: 420 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["location"], // THE LOCATION where they recharge
      },
    ];

    // Connect all 3 nodes in a chain: pigeon -> schematic -> powerline
    const edges = [
      buildEdge("ev_pigeon_photo", "ev_schematic"),
      buildEdge("ev_schematic", "ev_powerline"),
    ];
    const requiredTags = ["subject", "location", "proof"];

    const result = checkWinConditionDetailed(nodes, edges, requiredTags);

    console.log("CASE_001 test result:", result);

    assert.strictEqual(result.isVictory, true, "Should be victory when all 3 tags are in same cluster");
    assert.deepStrictEqual(result.missingTags, [], "No tags should be missing");
  });

  it("CASE_001: handles case-insensitive tag matching", () => {
    const nodes: EvidenceNode[] = [
      {
        id: "a",
        type: "photo",
        title: "A",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 0, y: 0 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["SUBJECT"], // Uppercase
      },
      {
        id: "b",
        type: "document",
        title: "B",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 10, y: 10 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["Location"], // Mixed case
      },
      {
        id: "c",
        type: "document",
        title: "C",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 20, y: 20 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["proof"], // Lowercase
      },
    ];

    const edges = [
      buildEdge("a", "b"),
      buildEdge("b", "c"),
    ];
    const requiredTags = ["subject", "location", "proof"]; // All lowercase

    const result = checkWinConditionDetailed(nodes, edges, requiredTags);

    assert.strictEqual(result.isVictory, true, "Should handle case-insensitive matching");
  });

  it("allows extra tags in cluster (subset check)", () => {
    const nodes: EvidenceNode[] = [
      {
        id: "a",
        type: "photo",
        title: "A",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 0, y: 0 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["subject", "extra1", "extra2"], // Has extra tags
      },
      {
        id: "b",
        type: "document",
        title: "B",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 10, y: 10 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["location", "more_extras"],
      },
      {
        id: "c",
        type: "document",
        title: "C",
        contentUrl: null,
        description: "",
        tags: [],
        position: { x: 20, y: 20 },
        isRedHerring: false,
        isCritical: true,
        truthTags: ["proof"],
      },
    ];

    const edges = [
      buildEdge("a", "b"),
      buildEdge("b", "c"),
    ];
    const requiredTags = ["subject", "location", "proof"];

    const result = checkWinConditionDetailed(nodes, edges, requiredTags);

    assert.strictEqual(result.isVictory, true, "Should allow extra tags (subset check)");
  });
});
