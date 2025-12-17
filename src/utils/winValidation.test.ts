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
});
