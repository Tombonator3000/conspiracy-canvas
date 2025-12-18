import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { THEORY_TEST_COST } from "@/constants/game";

interface TheoryModeProps {
  className?: string;
}

export const TheoryMode = ({ className = "" }: TheoryModeProps) => {
  const {
    theoryModeActive,
    selectedTheoryNodes,
    lastTheoryResult,
    sanity,
    nodes,
    toggleTheoryMode,
    deselectTheoryNode,
    clearTheorySelection,
    testTheory,
  } = useGameStore();

  // Get node titles for selected nodes
  const getNodeTitle = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const data = node.data as { title?: string };
      return data.title || nodeId;
    }
    return nodeId;
  };

  const canTest = selectedTheoryNodes.length === 3 && sanity >= THEORY_TEST_COST;

  return (
    <motion.div
      className={`bg-black/90 backdrop-blur-sm border border-purple-900/50 px-3 py-2 rounded font-mono ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-sm">🔮</span>
          <span
            className="text-purple-300 text-xs uppercase tracking-wider"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            Theory Mode
          </span>
        </div>
        <button
          onClick={toggleTheoryMode}
          className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
            theoryModeActive
              ? "bg-purple-600 border-purple-400 text-white"
              : "bg-gray-800 border-gray-600 text-gray-400 hover:border-purple-500"
          }`}
          style={{ fontFamily: "'VT323', monospace" }}
        >
          {theoryModeActive ? "ON" : "OFF"}
        </button>
      </div>

      <AnimatePresence>
        {theoryModeActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Instructions */}
            <div
              className="text-[9px] text-gray-500 mb-2 leading-tight"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              Click 3 nodes you believe are connected, then test your theory.
              Cost: -{THEORY_TEST_COST} sanity
            </div>

            {/* Selected Nodes */}
            <div className="mb-2">
              <div
                className="text-[10px] text-gray-400 mb-1"
                style={{ fontFamily: "'VT323', monospace" }}
              >
                Selected ({selectedTheoryNodes.length}/3):
              </div>
              <div className="flex flex-wrap gap-1">
                {[0, 1, 2].map((index) => {
                  const nodeId = selectedTheoryNodes[index];
                  if (nodeId) {
                    return (
                      <motion.button
                        key={nodeId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2 py-0.5 bg-purple-900/50 border border-purple-500/50 rounded text-[9px] text-purple-300 hover:bg-purple-800/50 transition-colors truncate max-w-[80px]"
                        onClick={() => deselectTheoryNode(nodeId)}
                        title={`Click to remove: ${getNodeTitle(nodeId)}`}
                        style={{ fontFamily: "'VT323', monospace" }}
                      >
                        {getNodeTitle(nodeId).substring(0, 10)}...
                      </motion.button>
                    );
                  }
                  return (
                    <div
                      key={`empty-${index}`}
                      className="px-2 py-0.5 border border-dashed border-gray-700 rounded text-[9px] text-gray-600"
                      style={{ fontFamily: "'VT323', monospace" }}
                    >
                      [???]
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => testTheory()}
                disabled={!canTest}
                className={`flex-1 px-2 py-1 text-[10px] rounded border transition-all ${
                  canTest
                    ? "bg-purple-600 border-purple-400 text-white hover:bg-purple-500"
                    : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                style={{ fontFamily: "'VT323', monospace" }}
              >
                TEST THEORY
              </button>
              {selectedTheoryNodes.length > 0 && (
                <button
                  onClick={clearTheorySelection}
                  className="px-2 py-1 text-[10px] rounded border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 transition-all"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Last Result */}
            <AnimatePresence>
              {lastTheoryResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-2 px-2 py-1 rounded text-[10px] text-center ${
                    lastTheoryResult.variant === "success"
                      ? "bg-green-900/50 border border-green-500/50 text-green-300"
                      : lastTheoryResult.variant === "partial"
                      ? "bg-yellow-900/50 border border-yellow-500/50 text-yellow-300"
                      : "bg-red-900/50 border border-red-500/50 text-red-300"
                  }`}
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  {lastTheoryResult.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
