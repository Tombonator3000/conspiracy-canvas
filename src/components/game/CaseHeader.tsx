import { motion } from "framer-motion";
import { FileQuestion, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseHeaderProps {
  title: string;
  description: string;
  difficulty: string;
  onBack?: () => void;
}

export const CaseHeader = ({ title, description, difficulty, onBack }: CaseHeaderProps) => {
  return (
    <motion.div
      className="bg-secondary/80 backdrop-blur-sm rounded-lg border border-border p-4 max-w-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 hover:bg-primary/20"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        
        <div className="bg-primary/20 p-2 rounded">
          <FileQuestion className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-marker text-lg text-foreground">{title}</h2>
            <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">
              {difficulty}
            </span>
          </div>
          
          <p className="text-xs font-typewriter text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center gap-1 mt-2 text-[10px] text-accent">
            <AlertCircle className="w-3 h-3" />
            <span className="font-mono uppercase">Connect matching evidence to reveal the truth</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
