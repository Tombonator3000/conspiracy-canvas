import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface Settings {
  // Audio
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;

  // Gameplay
  uvLightSize: number;
  nodeScale: number;

  // Accessibility
  reduceMotion: boolean;
  highContrast: boolean;

  // Display
  showTutorialHints: boolean;

  // Effects
  crtScanlines: boolean;
  crtFlicker: boolean;
  filmGrain: boolean;
  vignette: boolean;
  effectsIntensity: number;
}

const defaultSettings: Settings = {
  masterVolume: 80,
  sfxVolume: 100,
  ambientVolume: 60,
  uvLightSize: 100,
  nodeScale: 100,
  reduceMotion: false,
  highContrast: false,
  showTutorialHints: true,
  // Effects defaults
  crtScanlines: true,
  crtFlicker: true,
  filmGrain: true,
  vignette: true,
  effectsIntensity: 75,
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("apophenia-settings");
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem("apophenia-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
