import { createContext, useContext, ReactNode } from "react";
import { useAudio, type SoundEffect } from "@/hooks/useAudio";

interface AudioContextType {
  isInitialized: boolean;
  isMuted: boolean;
  sanityLevel: number;
  initialize: () => void;
  playSFX: (effect: SoundEffect) => void;
  playSound: (sound: SoundEffect) => void;
  updateSanity: (sanity: number) => void;
  toggleMute: () => void;
  stopAmbient: () => void;
  startAmbient: () => void;
  setMasterVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audio = useAudio();

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};

// Re-export SoundEffect type for convenience
export type { SoundEffect };
