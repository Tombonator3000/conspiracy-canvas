import { createContext, useContext, ReactNode } from "react";
import { useAudio } from "@/hooks/useAudio";

type SoundEffect = 
  | "connect_success" 
  | "connect_fail" 
  | "uv_toggle" 
  | "paper_crumple" 
  | "printer_start"
  | "printer_loop"
  | "button_click";

interface AudioContextType {
  isInitialized: boolean;
  isMuted: boolean;
  initialize: () => void;
  playSFX: (effect: SoundEffect) => void;
  updateSanity: (sanity: number) => void;
  toggleMute: () => void;
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
