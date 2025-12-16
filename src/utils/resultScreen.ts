import type { CaseData } from "@/types/game";

/**
 * Shared utilities for ResultScreen and VictoryScreenModal
 */

/** Fake usernames for comments */
export const FAKE_USERS = [
  "TruthSeeker1997",
  "WakeUpSheeple",
  "AlienHunter420",
  "DeepStateWatcher",
  "TinfoilTom",
  "ConspiracyCarl",
  "RedPillRick",
  "MatrixMaven",
  "SkepticalSue",
  "AreaFiftyWun",
  "IlluminatiInsider",
  "FlatEarthFred",
] as const;

/** Success comments for viral posts */
export const SUCCESS_COMMENTS = [
  "OMG this is EXACTLY what I've been saying for YEARS!!!",
  "Finally someone with the courage to speak TRUTH",
  "I KNEW IT. Sending this to everyone I know.",
  "The mainstream media won't touch this. WAKE UP PEOPLE!",
  "This explains EVERYTHING. You're a hero.",
  "My third eye is now WIDE OPEN",
  "Shared. Liked. Subscribed. Tattooed on my forehead.",
  "The government doesn't want you to see this!!!",
  "I always suspected this. Now I have PROOF.",
  "This is the smoking gun we needed!",
] as const;

/** Fail comments for banned posts */
export const FAIL_COMMENTS = [
  "What does this even mean? Unsubscribed.",
  "This is why nobody takes us seriously...",
  "Sir, this is a Wendy's.",
  "Have you considered touching grass?",
  "My cat could make a better theory and he's dead.",
  "This is the worst thing I've read since my own manifesto.",
  "Even the flat earthers think you're crazy.",
  "Reported for crimes against logic.",
] as const;

/** Rank titles based on star rating */
export const RANK_TITLES: Record<number, string> = {
  1: "SHEEP",
  2: "CURIOUS",
  3: "INVESTIGATOR",
  4: "TRUTH SEEKER",
  5: "ILLUMINATI CONFIRMED",
};

export interface Comment {
  user: string;
  text: string;
  likes: number;
}

/**
 * Get random comments for the result screen
 */
export const getRandomComments = (isVictory: boolean, count: number): Comment[] => {
  const pool = isVictory ? SUCCESS_COMMENTS : FAIL_COMMENTS;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count).map(comment => ({
    user: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
    text: comment,
    likes: Math.floor(Math.random() * (isVictory ? 999 : 5)),
  }));
};

/**
 * Get random success comments only (for victory screen)
 */
export const getRandomSuccessComments = (count: number): Comment[] => {
  const shuffled = [...SUCCESS_COMMENTS].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count).map(comment => ({
    user: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
    text: comment,
    likes: Math.floor(Math.random() * 999) + 1,
  }));
};

/**
 * Generate headline for the result screen
 */
export const generateHeadline = (caseData: CaseData, isVictory: boolean): string => {
  if (isVictory) {
    return `BREAKING: ${caseData.theTruth.subject} ${caseData.theTruth.action} ${caseData.theTruth.target}!!!`;
  }
  return "INCOHERENT RAMBLINGS POSTED, INTERNET COLLECTIVELY SIGHS";
};

/**
 * Generate a random visitor count string
 */
export const generateVisitorCount = (): string => {
  const count = Math.floor(Math.random() * 900000) + 100000;
  return String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
