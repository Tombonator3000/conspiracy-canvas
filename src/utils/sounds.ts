/**
 * Sound asset definitions for the game
 * All sound files are expected to be in /public/sounds/
 */

export interface SoundAsset {
  path: string;
  loop: boolean;
  defaultVolume: number;
}

export const SOUNDS = {
  // Ambient sounds
  ambience_room: {
    path: '/sounds/ambience_room.mp3',
    loop: true,
    defaultVolume: 0.2,
  },
  ambience_stress: {
    path: '/sounds/ambience_stress.mp3',
    loop: true,
    defaultVolume: 0, // Volume controlled by sanity level
  },

  // Sound effects
  paper_drag: {
    path: '/sounds/sfx_paper_drag.mp3',
    loop: false,
    defaultVolume: 0.5,
  },
  pin_thud: {
    path: '/sounds/sfx_pin_thud.mp3',
    loop: false,
    defaultVolume: 0.6,
  },
  paper_crumple: {
    path: '/sounds/sfx_paper_crumple.mp3',
    loop: false,
    defaultVolume: 0.5,
  },
  success_stamp: {
    path: '/sounds/sfx_success_stamp.mp3',
    loop: false,
    defaultVolume: 0.7,
  },
  fail_snap: {
    path: '/sounds/sfx_fail_snap.mp3',
    loop: false,
    defaultVolume: 0.6,
  },
} as const;

export type SoundName = keyof typeof SOUNDS;

// Sound effect aliases for easier API usage
export const SFX_ALIASES: Record<string, SoundName> = {
  success: 'success_stamp',
  fail: 'fail_snap',
  drag: 'paper_drag',
  connect: 'pin_thud',
  crumple: 'paper_crumple',
  trash: 'paper_crumple',
};

export type SFXAlias = keyof typeof SFX_ALIASES;
