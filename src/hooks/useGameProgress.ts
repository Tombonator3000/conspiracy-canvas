import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "apophenia_progress";

interface GameProgress {
  completedCases: string[];
  totalFollowers: number;
}

const defaultProgress: GameProgress = {
  completedCases: [],
  totalFollowers: 0,
};

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load game progress:", e);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: GameProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (e) {
      console.error("Failed to save game progress:", e);
    }
  }, []);

  // Mark a case as completed
  const completeCase = useCallback((caseId: string, followersGained: number) => {
    setProgress(prev => {
      if (prev.completedCases.includes(caseId)) {
        return prev; // Already completed
      }
      const newProgress = {
        completedCases: [...prev.completedCases, caseId],
        totalFollowers: prev.totalFollowers + followersGained,
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    saveProgress(defaultProgress);
  }, [saveProgress]);

  return {
    completedCases: progress.completedCases,
    totalFollowers: progress.totalFollowers,
    completeCase,
    resetProgress,
  };
};
