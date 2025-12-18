import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Gamepad2, Eye, RotateCcw, Monitor } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useAudioContext } from "@/contexts/AudioContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

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
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* CRT Monitor Frame */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl aspect-[4/3] p-1 relative"
          >
            {/* Monitor bezel */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 p-4">
              {/* Power LED */}
              <div className="absolute bottom-3 right-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[8px] text-gray-500 font-mono">PWR</span>
              </div>

              {/* Screen area */}
              <div className="crt-monitor w-full h-full rounded relative overflow-hidden">
                {/* CRT Effects */}
                <div className="crt-scanlines" />
                <div className="crt-glow" />

                {/* Screen content */}
                <div className="relative z-[1] w-full h-full p-4 md:p-6 flex flex-col">
                  {/* DOS Window Header */}
                  <div className="dos-window flex-1 flex flex-col min-h-0">
                    <div className="bg-[#00aa00] px-2 py-1 flex items-center justify-between shrink-0">
                      <span className="pixel-font text-[8px] md:text-[10px] text-black">
                        SYSTEM_CONFIG.EXE
                      </span>
                      <div className="flex gap-1">
                        <span className="text-black text-xs">─</span>
                        <span className="text-black text-xs">□</span>
                        <button
                          onClick={handleClose}
                          className="text-black text-xs hover:text-red-800 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <div className="p-3 md:p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* Header */}
                      <div className="text-center mb-3 shrink-0">
                        <motion.div
                          className="terminal-text pixel-font text-xs md:text-sm"
                          style={{ color: '#00ff00', textShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}
                        >
                          *** SYSTEM CONFIGURATION ***
                        </motion.div>
                      </div>

                      {/* Scrollable Content */}
                      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-2">
                        {/* Audio Section */}
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 terminal-text">
                            <Volume2 className="w-4 h-4" />
                            <h3 className="font-mono text-xs uppercase tracking-wider">{'>'} AUDIO</h3>
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
                            <Monitor className="w-4 h-4" />
                            <h3 className="font-mono text-xs uppercase tracking-wider">{'>'} VISUAL EFFECTS</h3>
                          </div>
                          <div className="space-y-3 pl-6 border-l border-[#00ff00]/30">
                            <CRTSlider
                              label="EFFECTS INTENSITY"
                              value={settings.effectsIntensity}
                              onChange={(v) => updateSetting("effectsIntensity", v)}
                            />
                            <CRTToggle
                              label="CRT SCANLINES"
                              checked={settings.crtScanlines}
                              onChange={(v) => updateSetting("crtScanlines", v)}
                            />
                            <CRTToggle
                              label="SCREEN FLICKER"
                              checked={settings.crtFlicker}
                              onChange={(v) => updateSetting("crtFlicker", v)}
                            />
                            <CRTToggle
                              label="FILM GRAIN"
                              checked={settings.filmGrain}
                              onChange={(v) => updateSetting("filmGrain", v)}
                            />
                            <CRTToggle
                              label="VIGNETTE"
                              checked={settings.vignette}
                              onChange={(v) => updateSetting("vignette", v)}
                            />
                          </div>
                        </section>

                        <div className="border-t border-[#00ff00]/30" />

                        {/* Gameplay Section */}
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 terminal-text">
                            <Gamepad2 className="w-4 h-4" />
                            <h3 className="font-mono text-xs uppercase tracking-wider">{'>'} GAMEPLAY</h3>
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
                            <h3 className="font-mono text-xs uppercase tracking-wider">{'>'} ACCESSIBILITY</h3>
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

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center shrink-0">
                        <button
                          onClick={() => {
                            playSFX("button_click");
                            resetSettings();
                          }}
                          className="dos-button text-xs md:text-sm px-3 py-1.5 flex items-center justify-center gap-2"
                          style={{
                            color: '#ff6666',
                            borderColor: '#ff6666',
                            textShadow: '0 0 5px rgba(255, 100, 100, 0.8)',
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                          [ RESET DEFAULTS ]
                        </button>
                        <button
                          onClick={handleClose}
                          className="dos-button text-xs md:text-sm px-3 py-1.5"
                          style={{
                            color: '#00ff00',
                            borderColor: '#00ff00',
                            textShadow: '0 0 5px rgba(0, 255, 0, 0.8)',
                          }}
                        >
                          [ SAVE & CLOSE ]
                        </button>
                      </div>
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

// CRT-styled Setting components
interface CRTSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const CRTSlider = ({ label, value, onChange, min = 0, max = 100 }: CRTSliderProps) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-[10px] md:text-xs font-mono terminal-text">{label}</span>
      <span className="text-[10px] font-mono text-[#00aa00]">[{value}%]</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={5}
      className="w-full crt-slider"
    />
  </div>
);

interface CRTToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const CRTToggle = ({ label, description, checked, onChange }: CRTToggleProps) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <span className="text-[10px] md:text-xs font-mono terminal-text">{label}</span>
      {description && (
        <p className="text-[8px] md:text-[10px] text-[#006600] font-mono">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`font-mono text-[10px] px-2 py-0.5 border transition-all ${
        checked
          ? 'bg-[#00ff00] text-black border-[#00ff00]'
          : 'bg-transparent text-[#00ff00] border-[#00ff00]/50 hover:border-[#00ff00]'
      }`}
      style={checked ? {} : { textShadow: '0 0 5px rgba(0, 255, 0, 0.5)' }}
    >
      {checked ? '[ON]' : '[OFF]'}
    </button>
  </div>
);
