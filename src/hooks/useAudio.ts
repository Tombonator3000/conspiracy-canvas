import { useState, useCallback, useRef, useEffect } from "react";

interface AudioState {
  isInitialized: boolean;
  isMuted: boolean;
  sanityLevel: number;
}

type SoundEffect =
  | "connect_success"
  | "connect_fail"
  | "uv_toggle"
  | "paper_crumple"
  | "printer_start"
  | "printer_loop"
  | "button_click"
  | "trash_junk_success"
  | "trash_evidence_fail";

// Using Web Audio API for sound generation (no external files needed)
export const useAudio = () => {
  const [state, setState] = useState<AudioState>({
    isInitialized: false,
    isMuted: false,
    sanityLevel: 100,
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const baseOscillatorRef = useRef<OscillatorNode | null>(null);
  const stressOscillatorRef = useRef<OscillatorNode | null>(null);
  const stressGainRef = useRef<GainNode | null>(null);

  // Initialize audio context after user interaction
  const initialize = useCallback(() => {
    if (state.isInitialized) return;
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      
      // Base ambient layer - low hum
      const baseOsc = ctx.createOscillator();
      const baseGain = ctx.createGain();
      baseOsc.type = "sine";
      baseOsc.frequency.value = 60; // Low hum frequency
      baseGain.gain.value = 0.02; // Very quiet
      baseOsc.connect(baseGain);
      baseGain.connect(ctx.destination);
      baseOsc.start();
      baseOscillatorRef.current = baseOsc;
      
      // Stress layer - high pitched, volume controlled by sanity
      const stressOsc = ctx.createOscillator();
      const stressGain = ctx.createGain();
      stressOsc.type = "sine";
      stressOsc.frequency.value = 800; // High pitched
      stressGain.gain.value = 0; // Start silent
      stressOsc.connect(stressGain);
      stressGain.connect(ctx.destination);
      stressOsc.start();
      stressOscillatorRef.current = stressOsc;
      stressGainRef.current = stressGain;
      
      setState(prev => ({ ...prev, isInitialized: true }));
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }, [state.isInitialized]);

  // Update stress layer based on sanity
  const updateSanity = useCallback((sanity: number) => {
    setState(prev => ({ ...prev, sanityLevel: sanity }));
    
    if (stressGainRef.current && !state.isMuted) {
      // Volume increases as sanity decreases
      const volume = Math.max(0, (100 - sanity) / 100) * 0.05;
      stressGainRef.current.gain.setTargetAtTime(
        volume,
        audioContextRef.current?.currentTime || 0,
        0.5
      );
    }
  }, [state.isMuted]);

  // Play sound effects
  const playSFX = useCallback((effect: SoundEffect) => {
    if (!audioContextRef.current || state.isMuted) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    switch (effect) {
      case "connect_success": {
        // Satisfying "thud" + rising tone
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
        // Sharp "snap" + dissonant tone
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
        // Click sound
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
        // White noise burst
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
        // Mechanical clicking
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
        // Satisfying cash register "cha-ching" + rising ding
        // First: Short click
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

        // Second: Rising ding (two-tone chime)
        const ding1 = ctx.createOscillator();
        const ding1Gain = ctx.createGain();
        ding1.type = "sine";
        ding1.frequency.value = 880; // A5
        ding1Gain.gain.setValueAtTime(0.2, now + 0.05);
        ding1Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        ding1.connect(ding1Gain);
        ding1Gain.connect(ctx.destination);
        ding1.start(now + 0.05);
        ding1.stop(now + 0.4);

        const ding2 = ctx.createOscillator();
        const ding2Gain = ctx.createGain();
        ding2.type = "sine";
        ding2.frequency.value = 1318; // E6 (higher harmony)
        ding2Gain.gain.setValueAtTime(0.15, now + 0.1);
        ding2Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        ding2.connect(ding2Gain);
        ding2Gain.connect(ctx.destination);
        ding2.start(now + 0.1);
        ding2.stop(now + 0.5);
        break;
      }

      case "trash_evidence_fail": {
        // Harsh error/glitch sound - buzzer + static burst
        // Buzzer tone
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

        // Digital glitch/static burst
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Create harsher digital noise with bit-crushing effect
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
    }
  }, [state.isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.isMuted;
      
      if (baseOscillatorRef.current) {
        const gain = baseOscillatorRef.current.context.createGain();
        gain.gain.value = newMuted ? 0 : 0.02;
      }
      
      if (stressGainRef.current) {
        stressGainRef.current.gain.value = newMuted ? 0 : Math.max(0, (100 - prev.sanityLevel) / 100) * 0.05;
      }
      
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      baseOscillatorRef.current?.stop();
      stressOscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  return {
    isInitialized: state.isInitialized,
    isMuted: state.isMuted,
    initialize,
    playSFX,
    updateSanity,
    toggleMute,
  };
};
