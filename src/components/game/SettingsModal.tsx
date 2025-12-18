import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Gamepad2, Eye, RotateCcw, Sparkles } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useAudioContext } from "@/contexts/AudioContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { playSFX } = useAudioContext();

  const handleClose = () => {
    playSFX("button_click");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* CRT Monitor Frame */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="crt-monitor w-full max-w-2xl aspect-[4/3] p-1 relative"
          >
            {/* Monitor bezel */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 p-4">
              {/* Power LED */}
              <div className="absolute bottom-3 right-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[8px] text-gray-500 font-mono">PWR</span>
              </div>

              {/* Screen area */}
              <div className="crt-monitor w-full h-full rounded relative overflow-hidden crt-flicker">
                {/* CRT Effects */}
                <div className="crt-scanlines" />
                <div className="crt-glow" />

                {/* Screen content */}
                <div className="relative z-[1] w-full h-full p-4 md:p-6 flex flex-col">
                  {/* DOS Window */}
                  <div className="dos-window flex-1 flex flex-col min-h-0">
                    {/* DOS Window Header */}
                    <div className="bg-[#00aa00] px-2 py-1 flex items-center justify-between shrink-0">
                      <span className="pixel-font text-[8px] md:text-[10px] text-black">
                        SYSTEM_CONFIG.EXE
                      </span>
                      <div className="flex gap-1">
                        <span className="text-black text-xs">─</span>
                        <span className="text-black text-xs">□</span>
                        <button
                          onClick={handleClose}
                          className="text-black text-xs hover:bg-[#00ff00]/50 px-1"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto min-h-0 p-3 md:p-4">
                      {/* Header */}
                      <div className="text-center mb-4 shrink-0">
                        <motion.div
                          className="terminal-text pixel-font text-xs md:text-sm classified-flash"
                          style={{ color: '#ff3333', textShadow: '0 0 10px rgba(255, 0, 0, 0.8)' }}
                        >
                          *** SYSTEM CONFIGURATION ***
                        </motion.div>
                      </div>

                      <div className="space-y-4">
                        {/* Audio Section */}
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 terminal-text">
                            <Volume2 className="w-4 h-4" />
                            <h3 className="text-sm uppercase tracking-wider">{'>'} AUDIO</h3>
                          </div>
                          <div className="space-y-3 pl-6 border-l border-[#00ff00]/30">
                            <CRTSlider
                              label="MASTER VOLUME"
                              value={settings.masterVolume}
                              onChange={(v) => updateSetting("masterVolume", v)}
                            />
                            <CRTSlider
                              label="SOUND EFFECTS"
                              value={settings.sfxVolume}
                              onChange={(v) => updateSetting("sfxVolume", v)}
                            />
                            <CRTSlider
                              label="AMBIENT SOUNDS"
                              value={settings.ambientVolume}
                              onChange={(v) => updateSetting("ambientVolume", v)}
                            />
                          </div>
                        </section>

                        <div className="border-t border-[#00ff00]/30" />

                        {/* Effects Section */}
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 terminal-text">
                            <Sparkles className="w-4 h-4" />
                            <h3 className="text-sm uppercase tracking-wider">{'>'} EFFECTS</h3>
                          </div>
                          <div className="space-y-3 pl-6 border-l border-[#00ff00]/30">
                            <CRTSlider
                              label="FILM GRAIN"
                              value={settings.filmGrainIntensity}
                              onChange={(v) => updateSetting("filmGrainIntensity", v)}
                            />
                            <CRTSlider
                              label="VIGNETTE"
                              value={settings.vignetteIntensity}
                              onChange={(v) => updateSetting("vignetteIntensity", v)}
                            />
                            <CRTSlider
                              label="SCANLINES"
                              value={settings.scanlineIntensity}
                              onChange={(v) => updateSetting("scanlineIntensity", v)}
                            />
                            <CRTToggle
                              label="CRT FLICKER"
                              checked={settings.crtFlicker}
                              onChange={(v) => updateSetting("crtFlicker", v)}
                            />
                          </div>
                        </section>

                        <div className="border-t border-[#00ff00]/30" />

                        {/* Gameplay Section */}
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 terminal-text">
                            <Gamepad2 className="w-4 h-4" />
                            <h3 className="text-sm uppercase tracking-wider">{'>'} GAMEPLAY</h3>
                          </div>
                          <div className="space-y-3 pl-6 border-l border-[#00ff00]/30">
                            <CRTSlider
                              label="UV LIGHT SIZE"
                              value={settings.uvLightSize}
                              onChange={(v) => updateSetting("uvLightSize", v)}
                              min={50}
                              max={200}
                            />
                            <CRTSlider
                              label="EVIDENCE SCALE"
                              value={settings.nodeScale}
                              onChange={(v) => updateSetting("nodeScale", v)}
                              min={50}
                              max={150}
                            />
                            <CRTToggle
                              label="SHOW TUTORIAL HINTS"
                              checked={settings.showTutorialHints}
                              onChange={(v) => updateSetting("showTutorialHints", v)}
                            />
                          </div>
                        </section>

                        <div className="border-t border-[#00ff00]/30" />

                        {/* Accessibility Section */}
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 terminal-text">
                            <Eye className="w-4 h-4" />
                            <h3 className="text-sm uppercase tracking-wider">{'>'} ACCESSIBILITY</h3>
                          </div>
                          <div className="space-y-3 pl-6 border-l border-[#00ff00]/30">
                            <CRTToggle
                              label="REDUCE MOTION"
                              description="Minimize animations"
                              checked={settings.reduceMotion}
                              onChange={(v) => updateSetting("reduceMotion", v)}
                            />
                            <CRTToggle
                              label="HIGH CONTRAST"
                              description="Increase visual contrast"
                              checked={settings.highContrast}
                              onChange={(v) => updateSetting("highContrast", v)}
                            />
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-[#00ff00]/50 px-3 py-2 flex justify-between items-center shrink-0 bg-black/30">
                      <button
                        onClick={() => {
                          playSFX("button_click");
                          resetSettings();
                        }}
                        className="dos-button text-xs px-3 py-1"
                        style={{
                          color: '#ff6666',
                          borderColor: '#ff6666',
                          textShadow: '0 0 5px rgba(255, 100, 100, 0.8)',
                        }}
                      >
                        <span className="flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" />
                          RESET
                        </span>
                      </button>
                      <button
                        onClick={handleClose}
                        className="dos-button text-xs px-3 py-1"
                      >
                        [ SAVE & CLOSE ]
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// CRT-styled slider component
interface CRTSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const CRTSlider = ({ label, value, onChange, min = 0, max = 100 }: CRTSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const blocks = Math.round(percentage / 10);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="terminal-text text-[10px] md:text-xs">{label}</span>
        <span className="terminal-text text-[10px] md:text-xs text-[#00aa00]">{value}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-4 bg-black/50 border border-[#00ff00]/50 rounded-sm overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(to right, #004400, #00ff00)',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
            }}
          />
        </div>
        <span className="terminal-text text-[8px] md:text-[10px] text-[#00aa00] w-20 text-right font-mono">
          [{'█'.repeat(blocks)}{'░'.repeat(10 - blocks)}]
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none bg-transparent cursor-pointer opacity-0 absolute"
        style={{ marginTop: '-20px' }}
      />
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 appearance-none bg-transparent cursor-pointer"
          style={{
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
};

// CRT-styled toggle component
interface CRTToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const CRTToggle = ({ label, description, checked, onChange }: CRTToggleProps) => (
  <button
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between gap-4 py-1 hover:bg-[#00ff00]/10 px-2 -mx-2 rounded transition-colors"
  >
    <div className="text-left">
      <span className="terminal-text text-[10px] md:text-xs block">{label}</span>
      {description && (
        <span className="terminal-text text-[8px] md:text-[10px] text-[#006600] block">{description}</span>
      )}
    </div>
    <span
      className="font-mono text-xs"
      style={{
        color: checked ? '#00ff00' : '#ff3333',
        textShadow: checked
          ? '0 0 5px rgba(0, 255, 0, 0.8)'
          : '0 0 5px rgba(255, 50, 50, 0.8)',
      }}
    >
      [{checked ? 'ON ' : 'OFF'}]
    </span>
  </button>
);
