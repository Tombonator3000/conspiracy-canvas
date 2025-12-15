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
  | "button_click";

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
