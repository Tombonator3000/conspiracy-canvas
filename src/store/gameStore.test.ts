import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './gameStore';
import type { EvidenceNode } from '@/types/game';

// Helper to create a mock node
const createMockNode = (id: string, truthTags: string[] = [], options: Partial<EvidenceNode> = {}) => ({
  id,
  type: 'evidence' as const,
  position: { x: Math.random() * 500, y: Math.random() * 500 },
  data: {
    id,
    type: 'document' as const,
    title: `Test Node ${id}`,
    contentUrl: null,
    description: 'Test description',
    tags: [],
    position: { x: 0, y: 0 },
    isRedHerring: truthTags.length === 0,
    truthTags,
    ...options,
  },
  draggable: true,
});

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({
      nodes: [],
      edges: [],
      sanity: 100,
      requiredTags: [],
      isVictory: false,
      isGameOver: false,
      threadColor: 'red',
      scribbles: [],
      trashedNodes: [],
      currentLevelIndex: 0,
      score: 0,
      junkBinned: 0,
      mistakes: 0,
      startTime: Date.now(),
      lastAction: null,
      isUVEnabled: false,
      shakingNodeIds: [],
      bursts: [],
      trashingNodes: [],
    });
  });

  describe('Initial State', () => {
    it('should have correct initial values', () => {
      const state = useGameStore.getState();
      expect(state.sanity).toBe(100);
      expect(state.score).toBe(0);
      expect(state.isVictory).toBe(false);
      expect(state.isGameOver).toBe(false);
      expect(state.nodes).toEqual([]);
      expect(state.edges).toEqual([]);
    });
  });

  describe('Sanity Management', () => {
    it('should modify sanity within bounds', () => {
      const { modifySanity } = useGameStore.getState();

      modifySanity(-30);
      expect(useGameStore.getState().sanity).toBe(70);

      modifySanity(-80);
      expect(useGameStore.getState().sanity).toBe(0);
      expect(useGameStore.getState().isGameOver).toBe(true);
    });

    it('should not exceed max sanity of 100', () => {
      const { modifySanity } = useGameStore.getState();

      modifySanity(50);
      expect(useGameStore.getState().sanity).toBe(100);
    });

    it('should trigger game over when sanity reaches 0', () => {
      const { modifySanity } = useGameStore.getState();

      modifySanity(-100);
      expect(useGameStore.getState().isGameOver).toBe(true);
    });
  });

  describe('Connection Logic', () => {
    beforeEach(() => {
      // Set up nodes for testing connections
      const nodes = [
        createMockNode('node1', ['SUBJECT', 'EVIDENCE']),
        createMockNode('node2', ['LOCATION', 'EVIDENCE']),
        createMockNode('junk1', []), // Junk node (no tags)
      ];
      useGameStore.setState({ nodes });
    });

    it('should allow valid connections between evidence nodes', () => {
      const { onConnect } = useGameStore.getState();

      onConnect({ source: 'node1', target: 'node2', sourceHandle: null, targetHandle: null });

      const state = useGameStore.getState();
      expect(state.edges.length).toBe(1);
      expect(state.score).toBe(50);
      expect(state.lastAction?.type).toBe('CONNECT_SUCCESS');
    });

    it('should penalize connecting junk nodes', () => {
      const { onConnect } = useGameStore.getState();
      const initialSanity = useGameStore.getState().sanity;

      onConnect({ source: 'node1', target: 'junk1', sourceHandle: null, targetHandle: null });

      const state = useGameStore.getState();
      expect(state.edges.length).toBe(0); // No edge created
      expect(state.sanity).toBe(initialSanity - 10);
      expect(state.mistakes).toBe(1);
      expect(state.lastAction?.type).toBe('CONNECT_FAIL');
    });

    it('should not create duplicate connections', () => {
      const { onConnect } = useGameStore.getState();

      onConnect({ source: 'node1', target: 'node2', sourceHandle: null, targetHandle: null });
      onConnect({ source: 'node1', target: 'node2', sourceHandle: null, targetHandle: null });

      expect(useGameStore.getState().edges.length).toBe(1);
    });

    it('should not create reverse duplicate connections', () => {
      const { onConnect } = useGameStore.getState();

      onConnect({ source: 'node1', target: 'node2', sourceHandle: null, targetHandle: null });
      onConnect({ source: 'node2', target: 'node1', sourceHandle: null, targetHandle: null });

      expect(useGameStore.getState().edges.length).toBe(1);
    });
  });

  describe('Win Condition (BFS Cluster Check)', () => {
    it('should detect victory when all required tags are in one cluster', () => {
      const nodes = [
        createMockNode('node1', ['SUBJECT']),
        createMockNode('node2', ['LOCATION']),
        createMockNode('node3', ['PROOF']),
      ];

      useGameStore.setState({
        nodes,
        requiredTags: ['SUBJECT', 'LOCATION', 'PROOF'],
        edges: [
          { id: 'e1', source: 'node1', target: 'node2', type: 'redString' },
          { id: 'e2', source: 'node2', target: 'node3', type: 'redString' },
        ],
      });

      const { validateWin } = useGameStore.getState();
      validateWin();

      expect(useGameStore.getState().isVictory).toBe(true);
    });

    it('should not trigger victory with disconnected clusters', () => {
      const nodes = [
        createMockNode('node1', ['SUBJECT']),
        createMockNode('node2', ['LOCATION']),
        createMockNode('node3', ['PROOF']),
      ];

      useGameStore.setState({
        nodes,
        requiredTags: ['SUBJECT', 'LOCATION', 'PROOF'],
        edges: [
          { id: 'e1', source: 'node1', target: 'node2', type: 'redString' },
          // node3 is not connected
        ],
      });

      const { validateWin } = useGameStore.getState();
      validateWin();

      expect(useGameStore.getState().isVictory).toBe(false);
    });

    it('should not trigger victory with missing tags', () => {
      const nodes = [
        createMockNode('node1', ['SUBJECT']),
        createMockNode('node2', ['LOCATION']),
      ];

      useGameStore.setState({
        nodes,
        requiredTags: ['SUBJECT', 'LOCATION', 'PROOF'], // PROOF is missing
        edges: [
          { id: 'e1', source: 'node1', target: 'node2', type: 'redString' },
        ],
      });

      const { validateWin } = useGameStore.getState();
      validateWin();

      expect(useGameStore.getState().isVictory).toBe(false);
    });
  });

  describe('Trash System', () => {
    beforeEach(() => {
      const nodes = [
        createMockNode('evidence1', ['IMPORTANT']),
        createMockNode('junk1', []),
      ];
      useGameStore.setState({ nodes, sanity: 100, score: 0 });
    });

    it('should reward trashing junk nodes', () => {
      const { trashNode } = useGameStore.getState();

      trashNode('junk1', true);

      const state = useGameStore.getState();
      expect(state.nodes.length).toBe(1);
      expect(state.score).toBe(100);
      expect(state.junkBinned).toBe(1);
      expect(state.lastAction?.type).toBe('TRASH_SUCCESS');
    });

    it('should penalize trashing evidence nodes', () => {
      const { trashNode } = useGameStore.getState();

      trashNode('evidence1', false);

      const state = useGameStore.getState();
      expect(state.nodes.length).toBe(1);
      expect(state.sanity).toBe(80); // -20 sanity
      expect(state.score).toBe(-200);
      expect(state.mistakes).toBe(1);
      expect(state.lastAction?.type).toBe('TRASH_FAIL');
    });

    it('should save trashed node for undo', () => {
      const { trashNode } = useGameStore.getState();

      trashNode('junk1', true);

      const state = useGameStore.getState();
      expect(state.trashedNodes.length).toBe(1);
      expect(state.trashedNodes[0].node.id).toBe('junk1');
    });
  });

  describe('Undo System', () => {
    beforeEach(() => {
      const nodes = [createMockNode('junk1', [])];
      useGameStore.setState({
        nodes,
        sanity: 100,
        score: 0,
        trashedNodes: [],
      });

      // Trash the node first
      useGameStore.getState().trashNode('junk1', true);
    });

    it('should restore trashed node when undoing', () => {
      const { undoTrash } = useGameStore.getState();

      undoTrash();

      const state = useGameStore.getState();
      expect(state.nodes.length).toBe(1);
      expect(state.nodes[0].id).toBe('junk1');
    });

    it('should cost 20 sanity to undo', () => {
      const initialSanity = useGameStore.getState().sanity;
      const { undoTrash } = useGameStore.getState();

      undoTrash();

      expect(useGameStore.getState().sanity).toBe(initialSanity - 20);
    });

    it('should reverse score changes when undoing', () => {
      // After trashing junk, score is +100
      expect(useGameStore.getState().score).toBe(100);

      const { undoTrash } = useGameStore.getState();
      undoTrash();

      // After undoing, score should be back to 0
      expect(useGameStore.getState().score).toBe(0);
    });

    it('should not allow undo with insufficient sanity', () => {
      useGameStore.setState({ sanity: 15 }); // Less than 20

      const { undoTrash } = useGameStore.getState();
      undoTrash();

      // Node should still be trashed
      expect(useGameStore.getState().nodes.length).toBe(0);
    });

    it('should not undo if nothing to undo', () => {
      // Undo once
      useGameStore.getState().undoTrash();
      const nodesAfterFirstUndo = useGameStore.getState().nodes.length;

      // Try to undo again
      useGameStore.getState().undoTrash();

      expect(useGameStore.getState().nodes.length).toBe(nodesAfterFirstUndo);
    });
  });

  describe('UV Light System', () => {
    it('should toggle UV state', () => {
      const { toggleUV } = useGameStore.getState();

      expect(useGameStore.getState().isUVEnabled).toBe(false);

      toggleUV();
      expect(useGameStore.getState().isUVEnabled).toBe(true);

      toggleUV();
      expect(useGameStore.getState().isUVEnabled).toBe(false);
    });

    it('should reveal nodes when UV is used', () => {
      const nodes = [
        createMockNode('uv-node', ['SECRET'], { requiresUV: true, isRevealed: false }),
      ];
      useGameStore.setState({ nodes });

      const { revealNode } = useGameStore.getState();
      revealNode('uv-node');

      const updatedNode = useGameStore.getState().nodes[0];
      expect((updatedNode.data as { isRevealed?: boolean }).isRevealed).toBe(true);
    });
  });

  describe('Thread Color', () => {
    it('should switch thread color', () => {
      const { setThreadColor } = useGameStore.getState();

      expect(useGameStore.getState().threadColor).toBe('red');

      setThreadColor('blue');
      expect(useGameStore.getState().threadColor).toBe('blue');

      setThreadColor('red');
      expect(useGameStore.getState().threadColor).toBe('red');
    });
  });

  describe('Score Calculation', () => {
    it('should calculate final score correctly on victory', () => {
      const nodes = [
        createMockNode('node1', ['SUBJECT', 'LOCATION', 'PROOF']),
      ];

      useGameStore.setState({
        nodes,
        edges: [],
        requiredTags: ['SUBJECT', 'LOCATION', 'PROOF'],
        sanity: 80,
        junkBinned: 3,
        mistakes: 1,
      });

      const { validateWin } = useGameStore.getState();
      validateWin();

      // Final Score = 1000 (base) + 80*10 (sanity) + 3*100 (junk) - 1*200 (mistakes)
      // = 1000 + 800 + 300 - 200 = 1900
      expect(useGameStore.getState().score).toBe(1900);
    });
  });

  describe('Reset Level', () => {
    it('should reset all game state', () => {
      // Set up a game in progress
      useGameStore.setState({
        sanity: 50,
        score: 500,
        mistakes: 3,
        isVictory: true,
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
      });

      const { resetLevel } = useGameStore.getState();
      resetLevel();

      const state = useGameStore.getState();
      expect(state.sanity).toBe(100);
      expect(state.score).toBe(0);
      expect(state.mistakes).toBe(0);
      expect(state.isVictory).toBe(false);
      expect(state.edges).toEqual([]);
    });
  });
});
