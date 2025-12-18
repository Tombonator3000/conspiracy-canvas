import { useState, useCallback, useRef, useEffect } from "react";
import { SOUNDS, SFX_ALIASES, type SoundName, type SFXAlias } from "@/utils/sounds";

// Development-only logging helpers
const devWarn = (message: string, ...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.warn(message, ...args);
  }
};

interface AudioState {
  isInitialized: boolean;
  isMuted: boolean;
  sanityLevel: number;
}

// Legacy procedural sound effect types (for backwards compatibility)
type ProceduralSFX =
  | "connect_success"
  | "connect_fail"
  | "uv_toggle"
  | "paper_crumple"
  | "printer_start"
  | "printer_loop"
  | "button_click"
  | "trash_junk_success"
  | "trash_evidence_fail"
  | "hdd_seek"
  | "access_granted";

// Combined sound effect type
export type SoundEffect = ProceduralSFX | SoundName | SFXAlias;

interface AudioElements {
  [key: string]: HTMLAudioElement;
}

interface GainNodes {
  [key: string]: GainNode;
}

const SANITY_THRESHOLD = 50;
const FADE_DURATION = 1000; // ms for ambient crossfade

export const useAudio = () => {
  const [state, setState] = useState<AudioState>({
    isInitialized: false,
    isMuted: false,
    sanityLevel: 100,
  });

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const baseOscillatorRef = useRef<OscillatorNode | null>(null);

  // Audio element refs for file-based sounds
  const audioElementsRef = useRef<AudioElements>({});
  const audioSourceNodesRef = useRef<{ [key: string]: MediaElementAudioSourceNode }>({});
  const gainNodesRef = useRef<GainNodes>({});

  // Ambient audio state
  const ambientFadeRef = useRef<number | null>(null);
  const currentSanityRef = useRef<number>(100);

  // Preload audio files
  const preloadAudio = useCallback((ctx: AudioContext) => {
    Object.entries(SOUNDS).forEach(([name, config]) => {
      const audio = new Audio(config.path);
      audio.loop = config.loop;
      audio.preload = 'auto';

      // Create gain node for volume control
      const source = ctx.createMediaElementSource(audio);
      const gainNode = ctx.createGain();
      gainNode.gain.value = config.defaultVolume;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      audioElementsRef.current[name] = audio;
      audioSourceNodesRef.current[name] = source;
      gainNodesRef.current[name] = gainNode;
    });
  }, []);

  // Initialize audio context after user interaction
  const initialize = useCallback(() => {
    if (state.isInitialized) return;

    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;

      // Base ambient layer - low hum (procedural fallback)
      const baseOsc = ctx.createOscillator();
      const baseGain = ctx.createGain();
      baseOsc.type = "sine";
      baseOsc.frequency.value = 60;
      baseGain.gain.value = 0.02;
      baseOsc.connect(baseGain);
      baseGain.connect(ctx.destination);
      baseOsc.start();
      baseOscillatorRef.current = baseOsc;

      // Preload audio files
      preloadAudio(ctx);

      // Start room ambience
      const roomAudio = audioElementsRef.current['ambience_room'];
      if (roomAudio) {
        roomAudio.play().catch(() => {
          // Audio play may be blocked, will retry on user interaction
        });
      }

      setState(prev => ({ ...prev, isInitialized: true }));
    } catch (error) {
      devWarn("Audio initialization failed:", error);
    }
  }, [state.isInitialized, preloadAudio]);

  // Calculate stress volume based on sanity (0-50 range maps to 0-0.4 volume)
  const calculateStressVolume = useCallback((sanity: number): number => {
    if (sanity >= SANITY_THRESHOLD) return 0;
    // Map sanity 0-50 to volume 0.4-0 (inverted: lower sanity = higher volume)
    const normalizedSanity = sanity / SANITY_THRESHOLD;
    return (1 - normalizedSanity) * 0.4;
  }, []);

  // Fade ambient volume over time
  const fadeAmbientVolume = useCallback((
    gainNode: GainNode,
    targetVolume: number,
    duration: number = FADE_DURATION
  ) => {
    if (ambientFadeRef.current) {
      cancelAnimationFrame(ambientFadeRef.current);
    }

    const startVolume = gainNode.gain.value;
    const volumeDiff = targetVolume - startVolume;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve for smooth fade
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      gainNode.gain.value = startVolume + (volumeDiff * easeProgress);

      if (progress < 1) {
        ambientFadeRef.current = requestAnimationFrame(animate);
      }
    };

    ambientFadeRef.current = requestAnimationFrame(animate);
  }, []);

  // Update sanity and control ambient audio
  const updateSanity = useCallback((sanity: number) => {
    currentSanityRef.current = sanity;
    setState(prev => ({ ...prev, sanityLevel: sanity }));

    const stressGain = gainNodesRef.current['ambience_stress'];
    const stressAudio = audioElementsRef.current['ambience_stress'];

    if (!stressGain || !stressAudio) return;

    const targetVolume = calculateStressVolume(sanity);

    if (sanity < SANITY_THRESHOLD) {
      // Start stress audio if not playing
      if (stressAudio.paused) {
        stressAudio.play().catch(() => {});
      }
      fadeAmbientVolume(stressGain, targetVolume);
    } else {
      // Fade out stress audio
      fadeAmbientVolume(stressGain, 0, FADE_DURATION / 2);
    }
  }, [calculateStressVolume, fadeAmbientVolume]);

  // Play file-based sound effect
  const playFileSound = useCallback((soundName: SoundName) => {
    const audio = audioElementsRef.current[soundName];
    const gainNode = gainNodesRef.current[soundName];

    if (!audio || state.isMuted) return;

    // Resume audio context if suspended
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // For non-looping sounds, reset and play
    if (!SOUNDS[soundName].loop) {
      audio.currentTime = 0;
      // Apply master volume from settings (will be integrated with SettingsContext)
      if (gainNode) {
        gainNode.gain.value = SOUNDS[soundName].defaultVolume;
      }
    }

    audio.play().catch(err => {
      devWarn(`Failed to play sound ${soundName}:`, err);
    });
  }, [state.isMuted]);

  // Play procedural sound effect (legacy support)
  const playProceduralSFX = useCallback((effect: ProceduralSFX) => {
    if (!audioContextRef.current || state.isMuted) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    switch (effect) {
      case "connect_success": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case "connect_fail": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case "uv_toggle": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case "paper_crumple": {
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1000;
        noise.buffer = buffer;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        break;
      }

      case "printer_start":
      case "printer_loop": {
        for (let i = 0; i < 5; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = 200 + Math.random() * 100;
          gain.gain.setValueAtTime(0.05, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.05);
        }
        break;
      }

      case "button_click": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }

      case "trash_junk_success": {
        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();
        click.type = "square";
        click.frequency.value = 1500;
        clickGain.gain.setValueAtTime(0.1, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        click.connect(clickGain);
        clickGain.connect(ctx.destination);
        click.start(now);
        click.stop(now + 0.03);

        const ding1 = ctx.createOscillator();
        const ding1Gain = ctx.createGain();
        ding1.type = "sine";
        ding1.frequency.value = 880;
        ding1Gain.gain.setValueAtTime(0.2, now + 0.05);
        ding1Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        ding1.connect(ding1Gain);
        ding1Gain.connect(ctx.destination);
        ding1.start(now + 0.05);
        ding1.stop(now + 0.4);

        const ding2 = ctx.createOscillator();
        const ding2Gain = ctx.createGain();
        ding2.type = "sine";
        ding2.frequency.value = 1318;
        ding2Gain.gain.setValueAtTime(0.15, now + 0.1);
        ding2Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        ding2.connect(ding2Gain);
        ding2Gain.connect(ctx.destination);
        ding2.start(now + 0.1);
        ding2.stop(now + 0.5);
        break;
      }

      case "trash_evidence_fail": {
        const buzzer = ctx.createOscillator();
        const buzzerGain = ctx.createGain();
        buzzer.type = "sawtooth";
        buzzer.frequency.setValueAtTime(150, now);
        buzzer.frequency.linearRampToValueAtTime(80, now + 0.3);
        buzzerGain.gain.setValueAtTime(0.25, now);
        buzzerGain.gain.linearRampToValueAtTime(0.15, now + 0.15);
        buzzerGain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        buzzer.connect(buzzerGain);
        buzzerGain.connect(ctx.destination);
        buzzer.start(now);
        buzzer.stop(now + 0.4);

        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.8;
        }
        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 800;
        filter.Q.value = 2;
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.2, now + 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now + 0.05);
        break;
      }

      case "hdd_seek": {
        // Hard drive seek sound - mechanical clicks and whirs (2 seconds)
        // Create multiple click/seek sounds to simulate HDD head movement
        for (let i = 0; i < 8; i++) {
          const seekTime = now + i * 0.25 + Math.random() * 0.1;

          // Click/thunk sound (head movement)
          const click = ctx.createOscillator();
          const clickGain = ctx.createGain();
          click.type = "square";
          click.frequency.value = 80 + Math.random() * 40;
          clickGain.gain.setValueAtTime(0.15, seekTime);
          clickGain.gain.exponentialRampToValueAtTime(0.01, seekTime + 0.03);
          click.connect(clickGain);
          clickGain.connect(ctx.destination);
          click.start(seekTime);
          click.stop(seekTime + 0.03);

          // High-pitched whir (motor/platter sound)
          const whir = ctx.createOscillator();
          const whirGain = ctx.createGain();
          whir.type = "sawtooth";
          whir.frequency.value = 2000 + Math.random() * 500;
          whirGain.gain.setValueAtTime(0.02, seekTime);
          whirGain.gain.exponentialRampToValueAtTime(0.01, seekTime + 0.05);
          whir.connect(whirGain);
          whirGain.connect(ctx.destination);
          whir.start(seekTime);
          whir.stop(seekTime + 0.05);
        }

        // Background spindle noise
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          noiseData[i] = (Math.random() * 2 - 1) * 0.3;
        }
        const bgNoise = ctx.createBufferSource();
        const bgFilter = ctx.createBiquadFilter();
        const bgGain = ctx.createGain();
        bgFilter.type = "bandpass";
        bgFilter.frequency.value = 3000;
        bgFilter.Q.value = 5;
        bgNoise.buffer = noiseBuffer;
        bgGain.gain.setValueAtTime(0.03, now);
        bgGain.gain.setValueAtTime(0.03, now + 1.5);
        bgGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
        bgNoise.connect(bgFilter);
        bgFilter.connect(bgGain);
        bgGain.connect(ctx.destination);
        bgNoise.start(now);
        bgNoise.stop(now + 2);
        break;
      }

      case "access_granted": {
        // Digital "Access Granted" beep sequence
        const frequencies = [440, 554, 659]; // A4, C#5, E5 (A major chord arpeggio)

        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.15);
        });

        // Final confirmation beep
        const confirmOsc = ctx.createOscillator();
        const confirmGain = ctx.createGain();
        confirmOsc.type = "sine";
        confirmOsc.frequency.value = 880; // A5
        confirmGain.gain.setValueAtTime(0.2, now + 0.3);
        confirmGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        confirmOsc.connect(confirmGain);
        confirmGain.connect(ctx.destination);
        confirmOsc.start(now + 0.3);
        confirmOsc.stop(now + 0.6);
        break;
      }
    }
  }, [state.isMuted]);

  // Unified play function - handles aliases, file sounds, and procedural sounds
  const playSFX = useCallback((effect: SoundEffect) => {
    if (state.isMuted) return;

    // Check if it's an alias
    const aliasedName = SFX_ALIASES[effect as SFXAlias];
    if (aliasedName) {
      playFileSound(aliasedName);
      return;
    }

    // Check if it's a file-based sound
    if (effect in SOUNDS) {
      playFileSound(effect as SoundName);
      return;
    }

    // Fall back to procedural sound
    playProceduralSFX(effect as ProceduralSFX);
  }, [state.isMuted, playFileSound, playProceduralSFX]);

  // Convenience function matching the example API: playSound('success')
  const playSound = useCallback((sound: SoundEffect) => {
    playSFX(sound);
  }, [playSFX]);

  // Stop all ambient audio
  const stopAmbient = useCallback(() => {
    const roomAudio = audioElementsRef.current['ambience_room'];
    const stressAudio = audioElementsRef.current['ambience_stress'];

    if (roomAudio) {
      roomAudio.pause();
      roomAudio.currentTime = 0;
    }
    if (stressAudio) {
      stressAudio.pause();
      stressAudio.currentTime = 0;
    }
  }, []);

  // Start ambient audio
  const startAmbient = useCallback(() => {
    const roomAudio = audioElementsRef.current['ambience_room'];
    if (roomAudio && state.isInitialized && !state.isMuted) {
      roomAudio.play().catch(() => {});
    }
    // Stress audio is controlled by sanity level
    updateSanity(currentSanityRef.current);
  }, [state.isInitialized, state.isMuted, updateSanity]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.isMuted;

      // Mute/unmute all ambient audio
      Object.values(audioElementsRef.current).forEach(audio => {
        if (audio.loop) {
          if (newMuted) {
            audio.pause();
          } else if (prev.isInitialized) {
            audio.play().catch(() => {});
          }
        }
      });

      // Mute base oscillator
      if (baseOscillatorRef.current) {
        const gain = baseOscillatorRef.current.context.createGain();
        gain.gain.value = newMuted ? 0 : 0.02;
      }

      return { ...prev, isMuted: newMuted };
    });
  }, []);

  // Set master volume (0-1)
  const setMasterVolume = useCallback((volume: number) => {
    Object.entries(gainNodesRef.current).forEach(([name, gainNode]) => {
      const soundConfig = SOUNDS[name as SoundName];
      if (soundConfig) {
        gainNode.gain.value = soundConfig.defaultVolume * volume;
      }
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (ambientFadeRef.current) {
        cancelAnimationFrame(ambientFadeRef.current);
      }
      baseOscillatorRef.current?.stop();
      audioContextRef.current?.close();
      Object.values(audioElementsRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  return {
    isInitialized: state.isInitialized,
    isMuted: state.isMuted,
    sanityLevel: state.sanityLevel,
    initialize,
    playSFX,
    playSound,
    updateSanity,
    toggleMute,
    stopAmbient,
    startAmbient,
    setMasterVolume,
  };
};
