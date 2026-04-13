import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Move, Save, RotateCcw, Monitor, FileText, X, Copy, ChevronDown, ChevronUp } from "lucide-react";

interface TerminalLayout {
  top: string;
  left: string;
  width: string;
  maxWidth: string;
  minWidth: string;
}

interface DevModeProps {
  isOpen: boolean;
  onClose: () => void;
  onLayoutChange: (layout: TerminalLayout) => void;
  currentLayout: TerminalLayout;
}

const DEFAULT_LAYOUTS: Record<string, TerminalLayout> = {
  desktop: { top: "26%", left: "50%", width: "22vw", maxWidth: "420px", minWidth: "280px" },
  tablet: { top: "24%", left: "50%", width: "45vw", maxWidth: "380px", minWidth: "280px" },
  mobileLandscape: { top: "50%", left: "50%", width: "40vw", maxWidth: "320px", minWidth: "260px" },
  mobilePortrait: { top: "22%", left: "50%", width: "75vw", maxWidth: "320px", minWidth: "260px" },
};

export const DevMode = ({ isOpen, onClose, onLayoutChange, currentLayout }: DevModeProps) => {
  const [activeTab, setActiveTab] = useState<"layout" | "mission">("layout");
  const [layout, setLayout] = useState<TerminalLayout>(currentLayout);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showExport, setShowExport] = useState(false);

  // Mission editor state
  const [missionData, setMissionData] = useState({
    id: "",
    title: "",
    description: "",
    difficulty: "EASY",
    subject: "",
    action: "",
    target: "",
    motive: "",
    sanity: 100,
    maxConnections: 3,
    requiredTags: "",
    nodes: [] as Array<{
      id: string;
      type: "photo" | "document" | "sticky_note";
      title: string;
      description: string;
      tags: string;
      isRedHerring: boolean;
      truthTags: string;
      x: number;
      y: number;
    }>,
    scribblePool: "",
  });

  const panelRef = useRef<HTMLDivElement>(null);

  // Update layout values
  const updateLayout = (key: keyof TerminalLayout, value: string) => {
    const newLayout = { ...layout, [key]: value };
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  // Save layout to localStorage
  const saveLayout = () => {
    localStorage.setItem("dev_terminal_layout", JSON.stringify(layout));
    alert("Layout saved!");
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUTS.desktop);
    onLayoutChange(DEFAULT_LAYOUTS.desktop);
  };

  const applyPreset = (preset: string) => {
    const presetLayout = DEFAULT_LAYOUTS[preset];
    if (presetLayout) {
      setLayout(presetLayout);
      onLayoutChange(presetLayout);
    }
  };

  // Add new node to mission
  const addNode = () => {
    const newNode = {
      id: `ev_node_${missionData.nodes.length + 1}`,
      type: "document" as const,
      title: "New Evidence",
      description: "Description...",
      tags: "",
      isRedHerring: false,
      truthTags: "",
      x: 200 + Math.random() * 400,
      y: 100 + Math.random() * 300,
    };
    setMissionData({ ...missionData, nodes: [...missionData.nodes, newNode] });
  };

  const updateNode = (index: number, key: string, value: any) => {
    const newNodes = [...missionData.nodes];
    (newNodes[index] as any)[key] = value;
    setMissionData({ ...missionData, nodes: newNodes });
  };

  const removeNode = (index: number) => {
    const newNodes = missionData.nodes.filter((_, i) => i !== index);
    setMissionData({ ...missionData, nodes: newNodes });
  };

  // Export mission as TypeScript
  const exportMission = () => {
    const nodes = missionData.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      contentUrl: null,
      description: n.description,
      tags: n.tags.split(",").map((t) => t.trim()).filter(Boolean),
      position: { x: Math.round(n.x), y: Math.round(n.y) },
      isRedHerring: n.isRedHerring,
      ...(n.truthTags ? { truthTags: n.truthTags.split(",").map((t) => t.trim()).filter(Boolean) } : {}),
    }));

    const code = `import type { CaseData } from "@/types/game";

export const case_${missionData.id}: CaseData = {
  id: "${missionData.id}",
  title: "${missionData.title}",
  description: "${missionData.description}",
  difficulty: "${missionData.difficulty}",
  theTruth: {
    subject: "${missionData.subject}",
    action: "${missionData.action}",
    target: "${missionData.target}",
    motive: "${missionData.motive}"
  },
  boardState: {
    sanity: ${missionData.sanity},
    chaosLevel: 0,
    maxConnectionsNeeded: ${missionData.maxConnections}
  },
  requiredTags: [${missionData.requiredTags.split(",").map((t) => `"${t.trim()}"`).join(", ")}],
  nodes: ${JSON.stringify(nodes, null, 4)},
  scribblePool: [${missionData.scribblePool.split(",").map((s) => `"${s.trim()}"`).join(", ")}]
};`;

    navigator.clipboard.writeText(code).then(() => {
      alert("Mission code copied to clipboard!");
    }).catch(() => {
      setShowExport(true);
    });

    return code;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={panelRef}
      className="fixed top-0 right-0 z-[100] w-[400px] max-w-[90vw] h-full bg-black/95 border-l border-green-500/30 overflow-y-auto font-mono text-xs"
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-black/95 border-b border-green-500/30 p-3 z-10">
        <div className="flex items-center justify-between">
          <span className="text-green-400 text-sm font-bold">⚙ DEV MODE</span>
          <button onClick={onClose} className="text-green-500/50 hover:text-green-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setActiveTab("layout")}
            className={`px-3 py-1 rounded text-xs ${activeTab === "layout" ? "bg-green-500 text-black" : "text-green-400 border border-green-500/30"}`}
          >
            <Monitor className="w-3 h-3 inline mr-1" /> Layout
          </button>
          <button
            onClick={() => setActiveTab("mission")}
            className={`px-3 py-1 rounded text-xs ${activeTab === "mission" ? "bg-green-500 text-black" : "text-green-400 border border-green-500/30"}`}
          >
            <FileText className="w-3 h-3 inline mr-1" /> Mission
          </button>
        </div>
      </div>

      <div className="p-3">
        {activeTab === "layout" ? (
          <LayoutEditor
            layout={layout}
            updateLayout={updateLayout}
            saveLayout={saveLayout}
            resetLayout={resetLayout}
            applyPreset={applyPreset}
          />
        ) : (
          <MissionEditor
            missionData={missionData}
            setMissionData={setMissionData}
            addNode={addNode}
            updateNode={updateNode}
            removeNode={removeNode}
            exportMission={exportMission}
            showExport={showExport}
          />
        )}
      </div>
    </motion.div>
  );
};

// ─── Layout Editor Sub-Component ───

function LayoutEditor({
  layout,
  updateLayout,
  saveLayout,
  resetLayout,
  applyPreset,
}: {
  layout: TerminalLayout;
  updateLayout: (key: keyof TerminalLayout, value: string) => void;
  saveLayout: () => void;
  resetLayout: () => void;
  applyPreset: (preset: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-green-500/70 text-[10px] mb-2">
        Adjust terminal position on the CRT monitor. Changes apply in real-time.
      </div>

      {/* Presets */}
      <div>
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Presets</label>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {Object.keys(DEFAULT_LAYOUTS).map((preset) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="text-[10px] px-2 py-1.5 border border-green-500/20 text-green-400 hover:bg-green-500/10 rounded"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Position Controls */}
      <div className="space-y-2">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-green-500/50 text-[9px]">Top</label>
            <input
              type="text"
              value={layout.top}
              onChange={(e) => updateLayout("top", e.target.value)}
              className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
            />
          </div>
          <div>
            <label className="text-green-500/50 text-[9px]">Left</label>
            <input
              type="text"
              value={layout.left}
              onChange={(e) => updateLayout("left", e.target.value)}
              className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="space-y-2">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Size</label>
        <div>
          <label className="text-green-500/50 text-[9px]">Width</label>
          <input
            type="text"
            value={layout.width}
            onChange={(e) => updateLayout("width", e.target.value)}
            className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-green-500/50 text-[9px]">Max Width</label>
            <input
              type="text"
              value={layout.maxWidth}
              onChange={(e) => updateLayout("maxWidth", e.target.value)}
              className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
            />
          </div>
          <div>
            <label className="text-green-500/50 text-[9px]">Min Width</label>
            <input
              type="text"
              value={layout.minWidth}
              onChange={(e) => updateLayout("minWidth", e.target.value)}
              className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Slider controls for quick adjustment */}
      <div className="space-y-2">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Quick Adjust</label>
        <div>
          <label className="text-green-500/50 text-[9px]">Top: {layout.top}</label>
          <input
            type="range"
            min="0"
            max="80"
            value={parseInt(layout.top) || 26}
            onChange={(e) => updateLayout("top", `${e.target.value}%`)}
            className="w-full accent-green-500"
          />
        </div>
        <div>
          <label className="text-green-500/50 text-[9px]">Left: {layout.left}</label>
          <input
            type="range"
            min="10"
            max="90"
            value={parseInt(layout.left) || 50}
            onChange={(e) => updateLayout("left", `${e.target.value}%`)}
            className="w-full accent-green-500"
          />
        </div>
        <div>
          <label className="text-green-500/50 text-[9px]">Width: {layout.width}</label>
          <input
            type="range"
            min="10"
            max="80"
            value={parseInt(layout.width) || 22}
            onChange={(e) => updateLayout("width", `${e.target.value}vw`)}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={saveLayout}
          className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-black py-2 rounded font-bold text-[11px] hover:bg-green-400"
        >
          <Save className="w-3 h-3" /> SAVE
        </button>
        <button
          onClick={resetLayout}
          className="flex-1 flex items-center justify-center gap-1 border border-green-500/30 text-green-400 py-2 rounded text-[11px] hover:bg-green-500/10"
        >
          <RotateCcw className="w-3 h-3" /> RESET
        </button>
      </div>

      {/* Live CSS Output */}
      <div className="mt-4 p-2 bg-green-500/5 border border-green-500/10 rounded">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">CSS Output</label>
        <pre className="text-green-500/70 text-[9px] mt-1 whitespace-pre-wrap">
{`top: ${layout.top}
left: ${layout.left}
width: ${layout.width}
maxWidth: ${layout.maxWidth}
minWidth: ${layout.minWidth}`}
        </pre>
      </div>
    </div>
  );
}

// ─── Mission Editor Sub-Component ───

function MissionEditor({
  missionData,
  setMissionData,
  addNode,
  updateNode,
  removeNode,
  exportMission,
  showExport,
}: {
  missionData: any;
  setMissionData: (data: any) => void;
  addNode: () => void;
  updateNode: (index: number, key: string, value: any) => void;
  removeNode: (index: number) => void;
  exportMission: () => string;
  showExport: boolean;
}) {
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [exportCode, setExportCode] = useState("");

  return (
    <div className="space-y-4">
      <div className="text-green-500/70 text-[10px] mb-2">
        Create new cases. Fill in details and export as TypeScript code.
      </div>

      {/* Case Info */}
      <div className="space-y-2">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Case Info</label>
        <input
          placeholder="Case ID (e.g. case_017_aliens)"
          value={missionData.id}
          onChange={(e) => setMissionData({ ...missionData, id: e.target.value })}
          className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
        />
        <input
          placeholder="Title"
          value={missionData.title}
          onChange={(e) => setMissionData({ ...missionData, title: e.target.value })}
          className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
        />
        <textarea
          placeholder="Description"
          value={missionData.description}
          onChange={(e) => setMissionData({ ...missionData, description: e.target.value })}
          className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] h-16 resize-none placeholder:text-green-500/20"
        />
        <select
          value={missionData.difficulty}
          onChange={(e) => setMissionData({ ...missionData, difficulty: e.target.value })}
          className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
        >
          <option value="TUTORIAL">TUTORIAL</option>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
          <option value="INSANE">INSANE</option>
        </select>
      </div>

      {/* The Truth */}
      <div className="space-y-2">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">The Truth</label>
        <div className="grid grid-cols-2 gap-1">
          <input
            placeholder="Subject"
            value={missionData.subject}
            onChange={(e) => setMissionData({ ...missionData, subject: e.target.value })}
            className="bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
          />
          <input
            placeholder="Action"
            value={missionData.action}
            onChange={(e) => setMissionData({ ...missionData, action: e.target.value })}
            className="bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
          />
          <input
            placeholder="Target"
            value={missionData.target}
            onChange={(e) => setMissionData({ ...missionData, target: e.target.value })}
            className="bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
          />
          <input
            placeholder="Motive"
            value={missionData.motive}
            onChange={(e) => setMissionData({ ...missionData, motive: e.target.value })}
            className="bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
          />
        </div>
      </div>

      {/* Board Settings */}
      <div className="space-y-2">
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Board Settings</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-green-500/50 text-[9px]">Sanity</label>
            <input
              type="number"
              value={missionData.sanity}
              onChange={(e) => setMissionData({ ...missionData, sanity: parseInt(e.target.value) })}
              className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
            />
          </div>
          <div>
            <label className="text-green-500/50 text-[9px]">Max Connections</label>
            <input
              type="number"
              value={missionData.maxConnections}
              onChange={(e) => setMissionData({ ...missionData, maxConnections: parseInt(e.target.value) })}
              className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px]"
            />
          </div>
        </div>
        <div>
          <label className="text-green-500/50 text-[9px]">Required Tags (comma-separated)</label>
          <input
            value={missionData.requiredTags}
            onChange={(e) => setMissionData({ ...missionData, requiredTags: e.target.value })}
            placeholder="subject, location, proof"
            className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] placeholder:text-green-500/20"
          />
        </div>
      </div>

      {/* Evidence Nodes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-green-400 text-[10px] uppercase tracking-wider">
            Evidence Nodes ({missionData.nodes.length})
          </label>
          <button
            onClick={addNode}
            className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
          >
            + ADD
          </button>
        </div>

        {missionData.nodes.map((node: any, i: number) => (
          <div key={i} className="border border-green-500/20 rounded p-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedNode(expandedNode === i ? null : i)}
            >
              <span className="text-green-400 text-[10px] flex items-center gap-1">
                {node.isRedHerring ? "🔴" : "🟢"} {node.title || "Untitled"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); removeNode(i); }}
                  className="text-red-400/50 hover:text-red-400 text-[10px]"
                >
                  ✕
                </button>
                {expandedNode === i ? <ChevronUp className="w-3 h-3 text-green-500/50" /> : <ChevronDown className="w-3 h-3 text-green-500/50" />}
              </div>
            </div>

            {expandedNode === i && (
              <div className="mt-2 space-y-1">
                <input
                  placeholder="ID"
                  value={node.id}
                  onChange={(e) => updateNode(i, "id", e.target.value)}
                  className="w-full bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] placeholder:text-green-500/20"
                />
                <input
                  placeholder="Title"
                  value={node.title}
                  onChange={(e) => updateNode(i, "title", e.target.value)}
                  className="w-full bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] placeholder:text-green-500/20"
                />
                <textarea
                  placeholder="Description"
                  value={node.description}
                  onChange={(e) => updateNode(i, "description", e.target.value)}
                  className="w-full bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] h-12 resize-none placeholder:text-green-500/20"
                />
                <select
                  value={node.type}
                  onChange={(e) => updateNode(i, "type", e.target.value)}
                  className="w-full bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px]"
                >
                  <option value="photo">📷 Photo</option>
                  <option value="document">📄 Document</option>
                  <option value="sticky_note">📝 Sticky Note</option>
                </select>
                <input
                  placeholder="Tags (comma-separated)"
                  value={node.tags}
                  onChange={(e) => updateNode(i, "tags", e.target.value)}
                  className="w-full bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] placeholder:text-green-500/20"
                />
                <input
                  placeholder="Truth Tags (comma-separated)"
                  value={node.truthTags}
                  onChange={(e) => updateNode(i, "truthTags", e.target.value)}
                  className="w-full bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] placeholder:text-green-500/20"
                />
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    placeholder="X"
                    value={node.x}
                    onChange={(e) => updateNode(i, "x", parseInt(e.target.value))}
                    className="bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px]"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    value={node.y}
                    onChange={(e) => updateNode(i, "y", parseInt(e.target.value))}
                    className="bg-black border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px]"
                  />
                </div>
                <label className="flex items-center gap-2 text-green-400 text-[10px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={node.isRedHerring}
                    onChange={(e) => updateNode(i, "isRedHerring", e.target.checked)}
                    className="accent-green-500"
                  />
                  Red Herring (junk evidence)
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scribble Pool */}
      <div>
        <label className="text-green-400 text-[10px] uppercase tracking-wider">Scribble Pool (comma-separated)</label>
        <textarea
          value={missionData.scribblePool}
          onChange={(e) => setMissionData({ ...missionData, scribblePool: e.target.value })}
          placeholder="IT'S ALL CONNECTED, WAKE UP, FOLLOW THE TRAIL"
          className="w-full bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded text-[11px] h-16 resize-none mt-1 placeholder:text-green-500/20"
        />
      </div>

      {/* Export */}
      <button
        onClick={() => {
          const code = exportMission();
          setExportCode(code);
        }}
        className="w-full flex items-center justify-center gap-1 bg-green-500 text-black py-2 rounded font-bold text-[11px] hover:bg-green-400"
      >
        <Copy className="w-3 h-3" /> EXPORT AS TYPESCRIPT
      </button>

      {showExport && exportCode && (
        <div className="mt-2">
          <textarea
            readOnly
            value={exportCode}
            className="w-full bg-black border border-green-500/30 text-green-500/70 px-2 py-1 rounded text-[9px] h-48 resize-none font-mono"
          />
        </div>
      )}
    </div>
  );
}
