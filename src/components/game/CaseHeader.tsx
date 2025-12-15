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
      className="bg-secondary/80 backdrop-blur-sm rounded-lg border border-border p-2 sm:p-4 max-w-[200px] sm:max-w-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 hover:bg-primary/20"
            onClick={onBack}
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
        
        <div className="bg-primary/20 p-1.5 sm:p-2 rounded hidden sm:block">
          <FileQuestion className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
            <h2 className="font-marker text-sm sm:text-lg text-foreground truncate">{title}</h2>
            <span className="text-[8px] sm:text-[10px] font-mono bg-primary/20 text-primary px-1.5 sm:px-2 py-0.5 rounded uppercase shrink-0">
              {difficulty}
            </span>
          </div>
          
          <p className="text-[10px] sm:text-xs font-typewriter text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
            {description}
          </p>
          
          <div className="hidden sm:flex items-center gap-1 mt-2 text-[10px] text-accent">
            <AlertCircle className="w-3 h-3" />
            <span className="font-mono uppercase">Connect matching evidence to reveal the truth</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
