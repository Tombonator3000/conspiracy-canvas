import { motion } from "framer-motion";
import { FileQuestion, Skull, Brain, Zap, Lock } from "lucide-react";
import type { CaseData } from "@/types/game";

interface CaseSelectProps {
  cases: CaseData[];
  onSelectCase: (caseData: CaseData) => void;
}

const difficultyConfig = {
  TUTORIAL: { icon: Brain, color: "text-sanity-green", label: "Tutorial" },
  EASY: { icon: Zap, color: "text-accent", label: "Easy" },
  MEDIUM: { icon: FileQuestion, color: "text-primary", label: "Medium" },
  HARD: { icon: Skull, color: "text-destructive", label: "Hard" },
};

export const CaseSelect = ({ cases, onSelectCase }: CaseSelectProps) => {
  return (
    <div className="min-h-screen cork-texture flex flex-col items-center justify-center p-8">
      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-marker text-5xl md:text-7xl text-primary mb-4 drop-shadow-lg">
          PROJECT APOPHENIA
        </h1>
        <p className="font-typewriter text-muted-foreground text-lg max-w-md mx-auto">
          Select a case file. Connect the evidence. Uncover the truth.
        </p>
        <p className="font-marker text-accent text-sm mt-2">
          THEY DON'T WANT YOU TO KNOW
        </p>
      </motion.div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {cases.map((caseData, index) => {
          const difficulty = difficultyConfig[caseData.difficulty as keyof typeof difficultyConfig] || difficultyConfig.EASY;
          const DifficultyIcon = difficulty.icon;

          return (
            <motion.button
              key={caseData.id}
              className="bg-card/90 backdrop-blur-sm rounded-lg border border-border p-5 text-left hover:border-primary transition-colors group relative overflow-hidden"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCase(caseData)}
            >
              {/* Pin decoration */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-md" />

              {/* Difficulty badge */}
              <div className={`flex items-center gap-1.5 mb-3 ${difficulty.color}`}>
                <DifficultyIcon className="w-4 h-4" />
                <span className="text-xs font-mono uppercase">{difficulty.label}</span>
              </div>

              {/* Title */}
              <h3 className="font-marker text-xl text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {caseData.title}
              </h3>

              {/* Description */}
              <p className="text-xs font-typewriter text-card-foreground/70 leading-relaxed mb-4">
                {caseData.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-[10px] font-mono text-card-foreground/50 uppercase">
                <span>{caseData.nodes.length} evidence</span>
                <span>{caseData.boardState.maxConnectionsNeeded} connections</span>
              </div>

              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </motion.button>
          );
        })}
      </div>

      {/* Footer hint */}
      <motion.p
        className="font-typewriter text-xs text-muted-foreground mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Tip: Match evidence nodes by their hidden tags to form connections.
        <br />
        Wrong connections will cost you sanity. Choose wisely.
      </motion.p>
    </div>
  );
};
