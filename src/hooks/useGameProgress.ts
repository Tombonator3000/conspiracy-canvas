import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "apophenia_progress";

// Detailed stats for a completed case
export interface CaseCompletionStats {
  caseId: string;
  completedAt: string; // ISO date string
  finalScore: number;
  starRating: number;
  sanityRemaining: number;
  junkBinned: number;
  junkRemaining: number;
  followersGained: number;
}

interface GameProgress {
  completedCases: string[];
  totalFollowers: number;
  caseStats: Record<string, CaseCompletionStats>; // keyed by caseId
}

const defaultProgress: GameProgress = {
  completedCases: [],
  totalFollowers: 0,
  caseStats: {},
};

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old progress data that doesn't have caseStats
        setProgress({
          ...defaultProgress,
          ...parsed,
          caseStats: parsed.caseStats ?? {},
        });
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

  // Mark a case as completed with detailed stats
  const completeCase = useCallback((
    caseId: string,
    followersGained: number,
    stats?: Omit<CaseCompletionStats, 'caseId' | 'completedAt' | 'followersGained'>
  ) => {
    setProgress(prev => {
      // Only add to completedCases if not already there
      const alreadyCompleted = prev.completedCases.includes(caseId);

      const caseStats: CaseCompletionStats = {
        caseId,
        completedAt: new Date().toISOString(),
        finalScore: stats?.finalScore ?? 0,
        starRating: stats?.starRating ?? 1,
        sanityRemaining: stats?.sanityRemaining ?? 0,
        junkBinned: stats?.junkBinned ?? 0,
        junkRemaining: stats?.junkRemaining ?? 0,
        followersGained,
      };

      // Update stats if new score is better, or if first completion
      const existingStats = prev.caseStats[caseId];
      const shouldUpdateStats = !existingStats || caseStats.finalScore > existingStats.finalScore;

      const newProgress: GameProgress = {
        completedCases: alreadyCompleted
          ? prev.completedCases
          : [...prev.completedCases, caseId],
        totalFollowers: alreadyCompleted
          ? prev.totalFollowers
          : prev.totalFollowers + followersGained,
        caseStats: shouldUpdateStats
          ? { ...prev.caseStats, [caseId]: caseStats }
          : prev.caseStats,
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
    caseStats: progress.caseStats,
    completeCase,
    resetProgress,
  };
};
