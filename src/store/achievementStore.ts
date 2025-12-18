import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AchievementId, Achievement, AchievementProgress } from '@/types/game';

// Achievement definitions
export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  first_case: {
    id: 'first_case',
    title: 'First Steps',
    description: 'Complete your first case',
    icon: '🔍',
  },
  perfect_sanity: {
    id: 'perfect_sanity',
    title: 'Cool as Ice',
    description: 'Complete a case with 100% sanity',
    icon: '🧊',
  },
  no_mistakes: {
    id: 'no_mistakes',
    title: 'Flawless Logic',
    description: 'Complete a case without any mistakes',
    icon: '✨',
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a case in under 60 seconds',
    icon: '⚡',
  },
  junk_master: {
    id: 'junk_master',
    title: 'Declutter Expert',
    description: 'Trash 50 junk items in total',
    icon: '🗑️',
  },
  combo_king: {
    id: 'combo_king',
    title: 'Combo King',
    description: 'Perform 10 successful combinations',
    icon: '🔗',
  },
  all_cases: {
    id: 'all_cases',
    title: 'Master Investigator',
    description: 'Complete all available cases',
    icon: '🏆',
  },
  paranoid_survivor: {
    id: 'paranoid_survivor',
    title: 'Paranoid Survivor',
    description: 'Complete a case with less than 20 sanity',
    icon: '😰',
  },
  uv_detective: {
    id: 'uv_detective',
    title: 'UV Detective',
    description: 'Reveal 10 hidden clues with UV light',
    icon: '🔦',
  },
  chain_combo: {
    id: 'chain_combo',
    title: 'Chain Reaction',
    description: 'Perform a 3+ item chain combination',
    icon: '⛓️',
  },
};

interface AchievementState extends AchievementProgress {
  // Actions
  unlockAchievement: (id: AchievementId) => boolean; // Returns true if newly unlocked
  incrementStat: (stat: keyof AchievementProgress['stats'], amount?: number) => void;
  checkAndUnlockAchievements: (context: AchievementContext) => AchievementId[];
  getAchievement: (id: AchievementId) => Achievement & { isUnlocked: boolean };
  getAllAchievements: () => (Achievement & { isUnlocked: boolean })[];
  resetAchievements: () => void;
}

// Context passed when checking achievements
export interface AchievementContext {
  caseCompleted?: boolean;
  sanityRemaining?: number;
  mistakesMade?: number;
  timeTaken?: number; // in seconds
  junkBinned?: number;
  combosPerformed?: number;
  totalCasesCompleted?: number;
  totalCases?: number;
  uvReveals?: number;
  chainComboLength?: number;
}

const defaultStats: AchievementProgress['stats'] = {
  totalCasesCompleted: 0,
  perfectSanityCases: 0,
  noMistakeCases: 0,
  fastestCaseTime: Infinity,
  totalJunkBinned: 0,
  totalCombosPerformed: 0,
  chainCombosPerformed: 0,
};

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      stats: { ...defaultStats },

      unlockAchievement: (id) => {
        const { unlockedAchievements } = get();
        if (unlockedAchievements.includes(id)) {
          return false; // Already unlocked
        }

        set({
          unlockedAchievements: [...unlockedAchievements, id],
        });
        return true;
      },

      incrementStat: (stat, amount = 1) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [stat]: (state.stats[stat] as number) + amount,
          },
        }));
      },

      checkAndUnlockAchievements: (context) => {
        const { unlockAchievement, stats } = get();
        const newlyUnlocked: AchievementId[] = [];

        // First case
        if (context.caseCompleted && stats.totalCasesCompleted === 0) {
          if (unlockAchievement('first_case')) {
            newlyUnlocked.push('first_case');
          }
        }

        // Perfect sanity
        if (context.caseCompleted && context.sanityRemaining === 100) {
          if (unlockAchievement('perfect_sanity')) {
            newlyUnlocked.push('perfect_sanity');
          }
        }

        // No mistakes
        if (context.caseCompleted && context.mistakesMade === 0) {
          if (unlockAchievement('no_mistakes')) {
            newlyUnlocked.push('no_mistakes');
          }
        }

        // Speed demon
        if (context.caseCompleted && context.timeTaken && context.timeTaken < 60) {
          if (unlockAchievement('speed_demon')) {
            newlyUnlocked.push('speed_demon');
          }
        }

        // Junk master (50 total)
        if (stats.totalJunkBinned >= 50) {
          if (unlockAchievement('junk_master')) {
            newlyUnlocked.push('junk_master');
          }
        }

        // Combo king (10 combos)
        if (stats.totalCombosPerformed >= 10) {
          if (unlockAchievement('combo_king')) {
            newlyUnlocked.push('combo_king');
          }
        }

        // All cases
        if (context.totalCasesCompleted && context.totalCases &&
            context.totalCasesCompleted >= context.totalCases) {
          if (unlockAchievement('all_cases')) {
            newlyUnlocked.push('all_cases');
          }
        }

        // Paranoid survivor
        if (context.caseCompleted && context.sanityRemaining !== undefined &&
            context.sanityRemaining > 0 && context.sanityRemaining < 20) {
          if (unlockAchievement('paranoid_survivor')) {
            newlyUnlocked.push('paranoid_survivor');
          }
        }

        // Chain combo (3+)
        if (context.chainComboLength && context.chainComboLength >= 3) {
          if (unlockAchievement('chain_combo')) {
            newlyUnlocked.push('chain_combo');
          }
        }

        return newlyUnlocked;
      },

      getAchievement: (id) => ({
        ...ACHIEVEMENTS[id],
        isUnlocked: get().unlockedAchievements.includes(id),
      }),

      getAllAchievements: () =>
        Object.values(ACHIEVEMENTS).map((achievement) => ({
          ...achievement,
          isUnlocked: get().unlockedAchievements.includes(achievement.id),
        })),

      resetAchievements: () => {
        set({
          unlockedAchievements: [],
          stats: { ...defaultStats },
        });
      },
    }),
    {
      name: 'conspiracy-canvas-achievements',
    }
  )
);
