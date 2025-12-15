import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Gamepad2, Eye, RotateCcw } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useAudioContext } from "@/contexts/AudioContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg bg-secondary border-2 border-border rounded-lg shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="bg-primary/20 border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-accent" />
                <div className="w-3 h-3 rounded-full bg-sanity-green" />
              </div>
              <h2 className="font-mono text-sm text-foreground tracking-widest uppercase">
                System Configuration
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
              {/* Audio Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Volume2 className="w-5 h-5" />
                  <h3 className="font-mono text-sm uppercase tracking-wider">Audio</h3>
                </div>
                <div className="space-y-4 pl-7">
                  <SettingSlider
                    label="Master Volume"
                    value={settings.masterVolume}
                    onChange={(v) => updateSetting("masterVolume", v)}
                  />
                  <SettingSlider
                    label="Sound Effects"
                    value={settings.sfxVolume}
                    onChange={(v) => updateSetting("sfxVolume", v)}
                  />
                  <SettingSlider
                    label="Ambient Sounds"
                    value={settings.ambientVolume}
                    onChange={(v) => updateSetting("ambientVolume", v)}
                  />
                </div>
              </section>

              <div className="border-t border-border" />

              {/* Gameplay Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Gamepad2 className="w-5 h-5" />
                  <h3 className="font-mono text-sm uppercase tracking-wider">Gameplay</h3>
                </div>
                <div className="space-y-4 pl-7">
                  <SettingSlider
                    label="UV Light Size"
                    value={settings.uvLightSize}
                    onChange={(v) => updateSetting("uvLightSize", v)}
                    min={50}
                    max={200}
                  />
                  <SettingSlider
                    label="Evidence Scale"
                    value={settings.nodeScale}
                    onChange={(v) => updateSetting("nodeScale", v)}
                    min={50}
                    max={150}
                  />
                  <SettingToggle
                    label="Show Tutorial Hints"
                    checked={settings.showTutorialHints}
                    onChange={(v) => updateSetting("showTutorialHints", v)}
                  />
                </div>
              </section>

              <div className="border-t border-border" />

              {/* Accessibility Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="w-5 h-5" />
                  <h3 className="font-mono text-sm uppercase tracking-wider">Accessibility</h3>
                </div>
                <div className="space-y-4 pl-7">
                  <SettingToggle
                    label="Reduce Motion"
                    description="Minimize animations and effects"
                    checked={settings.reduceMotion}
                    onChange={(v) => updateSetting("reduceMotion", v)}
                  />
                  <SettingToggle
                    label="High Contrast"
                    description="Increase visual contrast"
                    checked={settings.highContrast}
                    onChange={(v) => updateSetting("highContrast", v)}
                  />
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="bg-muted/50 border-t border-border px-4 py-3 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  playSFX("button_click");
                  resetSettings();
                }}
                className="text-muted-foreground hover:text-destructive gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Defaults
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleClose}
              >
                Save & Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Setting components
interface SettingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const SettingSlider = ({ label, value, onChange, min = 0, max = 100 }: SettingSliderProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-foreground">{label}</span>
      <span className="text-xs font-mono text-muted-foreground">{value}%</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={5}
      className="w-full"
    />
  </div>
);

interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const SettingToggle = ({ label, description, checked, onChange }: SettingToggleProps) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <span className="text-sm text-foreground">{label}</span>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);
