import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, RefreshCw, Terminal, Sliders, ShieldAlert, CircleDot } from "lucide-react";

interface StartupIntroProps {
  onComplete: () => void;
}

// F1 V6 Hybrid Turbo Engine Sound Synthesizer
function scheduleF1Engine(ctx: AudioContext) {
  const t = ctx.currentTime;

  // Create Stereo Panner for the Doppler passing effect
  let panner: StereoPannerNode | null = null;
  try {
    if (ctx.createStereoPanner) {
      panner = ctx.createStereoPanner();
    }
  } catch (e) {
    console.warn("StereoPanner not supported in this browser environment.", e);
  }

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, t);

  // Connection chain
  let lastNode: AudioNode = masterGain;
  if (panner) {
    masterGain.connect(panner);
    lastNode = panner;
  }
  
  // High-frequency roll-off distance filter
  const distanceFilter = ctx.createBiquadFilter();
  distanceFilter.type = "lowpass";
  distanceFilter.frequency.setValueAtTime(9000, t);
  lastNode.connect(distanceFilter);
  distanceFilter.connect(ctx.destination);

  // 1. ENGINE CORES (High rev V6 Sawtooth synthesis)
  const osc1 = ctx.createOscillator();
  osc1.type = "sawtooth";
  
  const osc2 = ctx.createOscillator();
  osc2.type = "sawtooth";

  // Sub-harmonic for mechanical chassis rumble
  const subOsc = ctx.createOscillator();
  subOsc.type = "sawtooth";

  // High-pitch Turbocharger Whine (Modern F1 MGU-H signature)
  const turboOsc = ctx.createOscillator();
  turboOsc.type = "sine";

  // Control Gains
  const engineGain = ctx.createGain();
  const turboGain = ctx.createGain();
  
  engineGain.gain.setValueAtTime(0, t);
  turboGain.gain.setValueAtTime(0, t);

  // Bandpass filter for tailpipe exhaust resonance
  const exhaustFilter = ctx.createBiquadFilter();
  exhaustFilter.type = "bandpass";
  exhaustFilter.Q.setValueAtTime(3.8, t);

  // Routing
  osc1.connect(exhaustFilter);
  osc2.connect(exhaustFilter);
  subOsc.connect(engineGain);
  exhaustFilter.connect(engineGain);
  turboOsc.connect(turboGain);

  engineGain.connect(masterGain);
  turboGain.connect(masterGain);

  // --- AUTOMATIONS ---
  const freq = osc1.frequency;
  const freq2 = osc2.frequency;
  const subFreq = subOsc.frequency;
  const turboFreq = turboOsc.frequency;

  // Starter Motor Whine
  const starter = ctx.createOscillator();
  const starterGain = ctx.createGain();
  starter.type = "sine";
  starter.frequency.setValueAtTime(800, t);
  starter.frequency.exponentialRampToValueAtTime(300, t + 0.4);
  starterGain.gain.setValueAtTime(0, t);
  starterGain.gain.linearRampToValueAtTime(0.04, t + 0.1);
  starterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  starter.connect(starterGain);
  starterGain.connect(masterGain);
  starter.start(t);
  starter.stop(t + 0.45);

  // Initial Silence
  freq.setValueAtTime(120, t);
  freq2.setValueAtTime(241, t);
  subFreq.setValueAtTime(60, t);

  // Ignition Spike (at 0.4s)
  freq.setValueAtTime(140, t + 0.4);
  freq.exponentialRampToValueAtTime(460, t + 0.45); // Starter fire
  freq.exponentialRampToValueAtTime(160, t + 0.8);  // Settle to idle
  
  freq2.setValueAtTime(281, t + 0.4);
  freq2.exponentialRampToValueAtTime(922, t + 0.45);
  freq2.exponentialRampToValueAtTime(321, t + 0.8);

  subFreq.setValueAtTime(70, t + 0.4);
  subFreq.exponentialRampToValueAtTime(230, t + 0.45);
  subFreq.exponentialRampToValueAtTime(80, t + 0.8);

  // Idle stabilization (0.8s to 1.8s)
  freq.setValueAtTime(160, t + 0.8);
  freq2.setValueAtTime(321, t + 0.8);
  subFreq.setValueAtTime(80, t + 0.8);

  // Pit Lane Speed Limiter / Steady throttle (1.8s to 3.0s)
  freq.linearRampToValueAtTime(280, t + 3.0);
  freq2.linearRampToValueAtTime(562, t + 3.0);
  subFreq.linearRampToValueAtTime(140, t + 3.0);

  // Hard Acceleration & Pit exit (3.0s to 3.8s)
  freq.exponentialRampToValueAtTime(680, t + 3.8);
  freq2.exponentialRampToValueAtTime(1364, t + 3.8);
  subFreq.exponentialRampToValueAtTime(340, t + 3.8);

  // Seamless Shift! Clutch disengage/re-engage drop (3.8s)
  freq.setValueAtTime(460, t + 3.82);
  freq2.setValueAtTime(922, t + 3.82);
  subFreq.setValueAtTime(230, t + 3.82);

  // Second Gear Scream (3.82s to 4.5s)
  freq.exponentialRampToValueAtTime(820, t + 4.5);
  freq2.exponentialRampToValueAtTime(1644, t + 4.5);
  subFreq.exponentialRampToValueAtTime(410, t + 4.5);

  // Doppler Pass Pitch Shift (4.5s to 6.0s)
  freq.linearRampToValueAtTime(600, t + 5.5);
  freq2.linearRampToValueAtTime(1200, t + 5.5);
  subFreq.linearRampToValueAtTime(300, t + 5.5);

  // Exhaust bandpass tracking engine RPM
  exhaustFilter.frequency.setValueAtTime(400, t);
  exhaustFilter.frequency.exponentialRampToValueAtTime(1300, t + 0.45);
  exhaustFilter.frequency.exponentialRampToValueAtTime(480, t + 0.8);
  exhaustFilter.frequency.linearRampToValueAtTime(850, t + 3.0);
  exhaustFilter.frequency.exponentialRampToValueAtTime(1900, t + 3.8);
  exhaustFilter.frequency.setValueAtTime(1300, t + 3.82);
  exhaustFilter.frequency.exponentialRampToValueAtTime(2300, t + 4.5);
  exhaustFilter.frequency.linearRampToValueAtTime(1600, t + 5.5);

  // Turbocharger Pitch Automation
  turboFreq.setValueAtTime(1800, t);
  turboFreq.exponentialRampToValueAtTime(4200, t + 0.45);
  turboFreq.exponentialRampToValueAtTime(2100, t + 0.8);
  turboFreq.linearRampToValueAtTime(3400, t + 3.0);
  turboFreq.exponentialRampToValueAtTime(6000, t + 3.8);
  turboFreq.setValueAtTime(4000, t + 3.82);
  turboFreq.exponentialRampToValueAtTime(6600, t + 4.5);
  turboFreq.linearRampToValueAtTime(5200, t + 5.5);

  // --- VOLUME AUTOMATIONS ---
  masterGain.gain.setValueAtTime(0, t);
  masterGain.gain.linearRampToValueAtTime(0.08, t + 0.4); // prep starter
  masterGain.gain.setValueAtTime(0.24, t + 0.42); // Ignition burst!
  masterGain.gain.linearRampToValueAtTime(0.12, t + 0.8); // settle to idle volume
  
  // Idle volume
  masterGain.gain.setValueAtTime(0.12, t + 0.8);
  // Throttle build-up
  masterGain.gain.linearRampToValueAtTime(0.24, t + 3.0);
  // Screaming acceleration
  masterGain.gain.linearRampToValueAtTime(0.38, t + 3.8);
  // Gear change dip
  masterGain.gain.setValueAtTime(0.18, t + 3.81);
  // Peak passing volume
  masterGain.gain.linearRampToValueAtTime(0.42, t + 4.5);
  // Doppler fade-out
  masterGain.gain.exponentialRampToValueAtTime(0.001, t + 6.0);

  // Turbocharger Volume (screeches under full throttle)
  turboGain.gain.setValueAtTime(0, t);
  turboGain.gain.setValueAtTime(0.03, t + 0.42);
  turboGain.gain.linearRampToValueAtTime(0.015, t + 0.8);
  turboGain.gain.linearRampToValueAtTime(0.045, t + 3.0);
  turboGain.gain.linearRampToValueAtTime(0.075, t + 3.8);
  turboGain.gain.setValueAtTime(0.02, t + 3.81);
  turboGain.gain.linearRampToValueAtTime(0.085, t + 4.5);
  turboGain.gain.exponentialRampToValueAtTime(0.001, t + 6.0);

  // Engine block volume
  engineGain.gain.setValueAtTime(0, t);
  engineGain.gain.setValueAtTime(0.18, t + 0.42);
  engineGain.gain.linearRampToValueAtTime(0.10, t + 0.8);
  engineGain.gain.linearRampToValueAtTime(0.22, t + 3.0);
  engineGain.gain.linearRampToValueAtTime(0.32, t + 3.8);
  engineGain.gain.setValueAtTime(0.15, t + 3.81);
  engineGain.gain.linearRampToValueAtTime(0.35, t + 4.5);
  engineGain.gain.exponentialRampToValueAtTime(0.001, t + 6.0);

  // Exhaust flow friction / tire hiss noise buffer
  let noiseNode: AudioBufferSourceNode | null = null;
  let noiseGain: GainNode | null = null;
  try {
    const bufferSize = ctx.sampleRate * 2.0;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2.0 - 1.0;
    }
    
    noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.setValueAtTime(2.2, t);

    noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, t);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // Friction sound tracking throttle
    noiseFilter.frequency.setValueAtTime(300, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(1000, t + 0.45);
    noiseFilter.frequency.exponentialRampToValueAtTime(400, t + 0.8);
    noiseFilter.frequency.linearRampToValueAtTime(800, t + 3.0);
    noiseFilter.frequency.exponentialRampToValueAtTime(1800, t + 3.8);
    noiseFilter.frequency.setValueAtTime(1100, t + 3.81);
    noiseFilter.frequency.exponentialRampToValueAtTime(2200, t + 4.5);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, t + 6.0);

    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.setValueAtTime(0.10, t + 0.42);
    noiseGain.gain.linearRampToValueAtTime(0.02, t + 0.8);
    noiseGain.gain.linearRampToValueAtTime(0.12, t + 3.0);
    noiseGain.gain.linearRampToValueAtTime(0.24, t + 3.8);
    noiseGain.gain.setValueAtTime(0.08, t + 3.81);
    noiseGain.gain.linearRampToValueAtTime(0.28, t + 4.5);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 6.0);
  } catch (err) {
    console.warn("F1 Noise generator bypassed.", err);
  }

  // --- DOPPLER SPATIAL PANNING ---
  if (panner) {
    panner.pan.setValueAtTime(-0.9, t); // approach left
    panner.pan.linearRampToValueAtTime(-0.6, t + 3.0);
    panner.pan.linearRampToValueAtTime(-0.2, t + 4.2);
    panner.pan.linearRampToValueAtTime(0.3, t + 4.5); // pass-by point
    panner.pan.linearRampToValueAtTime(0.8, t + 5.1);
    panner.pan.linearRampToValueAtTime(1.0, t + 6.0);
  }

  // Distance absorption low-pass filter
  distanceFilter.frequency.setValueAtTime(9000, t);
  distanceFilter.frequency.setValueAtTime(11000, t + 4.5);
  distanceFilter.frequency.exponentialRampToValueAtTime(380, t + 6.0);

  // --- START / STOP ALL SOURCES ---
  osc1.start(t);
  osc2.start(t);
  subOsc.start(t);
  turboOsc.start(t);
  if (noiseNode) {
    noiseNode.start(t);
  }

  osc1.stop(t + 6.1);
  osc2.stop(t + 6.1);
  subOsc.stop(t + 6.1);
  turboOsc.stop(t + 6.1);
  if (noiseNode) {
    noiseNode.stop(t + 6.1);
  }

  return {
    stop: () => {
      try {
        osc1.stop();
        osc2.stop();
        subOsc.stop();
        turboOsc.stop();
        starter.stop();
        if (noiseNode) {
          noiseNode.stop();
        }
      } catch (err) {
        // Safe skip if already stopped
      }
    }
  };
}

export default function StartupIntro({ onComplete }: StartupIntroProps) {
  const [phase, setPhase] = useState<number>(0); // Time in half-seconds or progress based
  const [elapsed, setElapsed] = useState<number>(0); // total elapsed milliseconds
  const [skipHovered, setSkipHovered] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSoundRef = useRef<{ stop: () => void } | null>(null);
  const hasStartedRef = useRef(false);

  // Use refs to avoid unstable dependencies and double execution on transitions
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  const cleanupAudio = () => {
    try {
      if (activeSoundRef.current) {
        activeSoundRef.current.stop();
        activeSoundRef.current = null;
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== "closed") {
          audioContextRef.current.close();
        }
        audioContextRef.current = null;
      }
    } catch (err) {
      console.warn("Audio cleanup error:", err);
    }
  };

  const triggerComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      cleanupAudio();
      onCompleteRef.current();
    }
  };

  // Play F1 Engine Audio with autoplay block resolution
  const playF1Sound = () => {
    if (hasStartedRef.current) return;
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      hasStartedRef.current = true;
      activeSoundRef.current = scheduleF1Engine(ctx);

      if (ctx.state === "suspended") {
        const resumeAudio = () => {
          if (ctx.state === "suspended") {
            ctx.resume();
          }
          window.removeEventListener("click", resumeAudio);
          window.removeEventListener("pointerdown", resumeAudio);
        };
        window.addEventListener("click", resumeAudio);
        window.addEventListener("pointerdown", resumeAudio);
      }
    } catch (e) {
      console.warn("F1 audio context ignition bypassed or blocked:", e);
    }
  };

  useEffect(() => {
    // Attempt auto-play sound on first user gesture or mount, fail silently
    playF1Sound();

    // Timer loop that updates elapsed time at 100ms intervals (more precise layout)
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= 7200) {
          clearInterval(interval);
          return 7200;
        }
        return prev + 100;
      });
    }, 100);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (elapsed >= 7200) {
      triggerComplete();
    }
  }, [elapsed]);

  // Compute active ranges based on seconds [0.0 - 7.0]
  const sec = elapsed / 1000;

  return (
    <div 
      onClick={playF1Sound}
      onPointerDown={playF1Sound}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 overflow-hidden font-mono select-none cursor-pointer"
    >
      
      {/* GLOWING AMBIENT INTRO MATRIX BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.6)_0%,rgba(2,6,23,1)_100%)] z-0" />
      
      {/* FINE GRID LINES FOR TELEMETRY FEEL */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,210,190,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,210,190,0.15)_1px,transparent_1px)] bg-[size:30px_30px] z-0" />

      {/* SWEEPING RADAR/TELEMETRY BAR */}
      {sec >= 1.0 && sec <= 2.8 && (
        <motion.div
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D2BE]/30 to-transparent shadow-[0_0_15px_rgba(0,210,190,0.5)] z-10 pointer-events-none"
        />
      )}

      {/* CORNER ORNAMENTATION / HUD DESIGN */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xs text-slate-600 tracking-wider">
        <CircleDot className="w-3.5 h-3.5 text-slate-700 animate-pulse" />
        <span>APEX_SYS.CTL // BOOT_SEQ</span>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 text-xs text-slate-500">
        <div className="flex gap-1">
          <div className={`w-1 h-3 rounded-full ${sec > 1 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
          <div className={`w-1 h-3 rounded-full ${sec > 2.5 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
          <div className={`w-1 h-3 rounded-full ${sec > 4 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
          <div className={`w-1 h-3 rounded-full ${sec > 5.5 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
        </div>
        <button
          onClick={triggerComplete}
          onMouseEnter={() => setSkipHovered(true)}
          onMouseLeave={() => setSkipHovered(false)}
          className="px-2.5 py-1 rounded border border-slate-800 hover:border-[#00D2BE] hover:text-[#00D2BE] transition-colors text-xs text-slate-500 pointer-events-auto cursor-pointer flex items-center gap-1 bg-slate-900/40"
        >
          <span>SKIP SYSTEM BOOT</span>
          <span className="text-[9px] text-[#00D2BE] opacity-60">»</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 text-[10px] text-slate-700 space-y-0.5">
        <div>CORE MODULE: APEX_INTELLIGENCE_LAYER_V2</div>
        <div>STATION: GP_COMM_PORT_3000</div>
      </div>

      {/* MID PANEL CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-lg mx-auto">
        
        {/* PHASE [0.0s - 1.0s]: INITIALIZING TEXT */}
        {sec >= 0.0 && sec < 1.0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center space-y-1.5"
          >
            <div className="text-[#00D2BE] text-xs font-bold tracking-widest uppercase animate-pulse">
              [ SECURE SIGNAL ENGAGED ]
            </div>
            <h2 className="text-sm font-bold text-gray-400 tracking-wider">
              INITIALIZING RACE INTELLIGENCE SYSTEM...
            </h2>
          </motion.div>
        )}

        {/* PHASE [1.0s - 2.5s]: DIAGNOSTICS & SYSTEM SWEEP */}
        {sec >= 1.0 && sec < 2.5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-4 max-w-sm"
          >
            <div className="border border-[#1E293B] bg-slate-950/80 p-4 rounded-lg shadow-2xl relative overflow-hidden">
              <div className="text-[10px] text-slate-500 absolute top-2 right-2">
                SYS_DIAGNOSTICS
              </div>
              <h3 className="text-xs text-gray-500 tracking-widest uppercase mb-3 font-semibold border-b border-slate-900 pb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-500" /> System Self-Test
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">OPENF1 NETWORK</span>
                  <span className="text-cyan-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    CONNECTED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">AI ENGINE</span>
                  <span className="text-[#00D2BE] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2BE]" />
                    ONLINE
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">TELEMETRY DECODERS</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center text-[10px] text-slate-500 animate-pulse">
              SYNCING GPS CIRCUITS WITH REAL-TIME FEED...
            </div>
          </motion.div>
        )}

        {/* PHASE [2.5s - 4.0s]: LOGO EMERGES & SCAN */}
        {sec >= 2.5 && sec < 4.0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            {/* EMBLEM */}
            <div className="w-16 h-16 mx-auto rounded-lg bg-f1-red flex items-center justify-center text-white font-black italic tracking-tighter text-3xl shadow-[0_0_30px_rgba(225,6,0,0.5)]">
              A
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white tracking-widest">
                APEX CTRL
              </h1>
              <p className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
                AI RACE INTELLIGENCE SYSTEM
              </p>
            </div>
            <div className="h-0.5 w-24 bg-slate-800 mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-[#00D2BE] animate-infinite-sweep w-8" style={{ animation: "sweeper 1.2s linear infinite" }} />
            </div>
          </motion.div>
        )}

        {/* PHASE [4.0s - 5.5s]: CIRCUIT OUTLINE TRACE & KEY WORDS */}
        {sec >= 4.0 && sec < 5.5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-6 w-full"
          >
            {/* STYLIZED CIRCUIT SVG TRACING */}
            <div className="w-64 h-28 relative">
              <svg viewBox="0 0 100 45" className="w-full h-full text-slate-800 overflow-visible">
                {/* Underlay shadow track */}
                <path
                  d="M10 20 C20 5, 40 5, 55 15 C70 5, 90 12, 85 28 C80 40, 60 40, 45 35 C30 42, 12 35, 10 20 Z"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Traced dynamic track path */}
                <motion.path
                  d="M10 20 C20 5, 40 5, 55 15 C70 5, 90 12, 85 28 C80 40, 60 40, 45 35 C30 42, 12 35, 10 20 Z"
                  fill="none"
                  stroke="#00D2BE"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
                
                {/* Moving GPS tracking node */}
                <motion.circle
                  r="2"
                  fill="#FF0600"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  style={{
                    offsetPath: "path('M10 20 C20 5, 40 5, 55 15 C70 5, 90 12, 85 28 C80 40, 60 40, 45 35 C30 42, 12 35, 10 20 Z')",
                  }}
                  className="filter drop-shadow-[0_0_4px_#FF0600]"
                  transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
                />
              </svg>
            </div>

            <div className="flex flex-col items-center space-y-1 text-center">
              <div className="text-[10px] text-f1-red font-black tracking-widest">LIVE DATA RECEIVER</div>
              <h2 className="text-sm font-bold text-gray-200 tracking-[0.15em] uppercase">
                REAL TELEMETRY • STRATEGIC INTELLIGENCE
              </h2>
            </div>
          </motion.div>
        )}

        {/* PHASE [5.5s - 7.0s]: SETTLED LOGO & MAIN COMPLETED MOTTO */}
        {sec >= 5.5 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-5"
          >
            {/* SETTLED LOGO */}
            <div className="relative inline-block">
              <div className="w-14 h-14 mx-auto rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center text-white font-black italic tracking-tighter text-2xl shadow-xl">
                 A
              </div>
              <div className="absolute inset-0 w-14 h-14 bg-[#00D2BE]/10 rounded-lg animate-ping pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-[0.25em] text-white">
                APEX CTRL
              </h1>
              <p className="text-xs text-[#00D2BE] font-bold tracking-[0.14em] px-3 py-1 bg-[#00D2BE]/5 rounded border border-[#00D2BE]/10 inline-block">
                TURNING TELEMETRY INTO INTELLIGENCE
              </p>
            </div>

            <div className="text-[10px] text-slate-500 tracking-wider">
              LAUNCHING WORKSPACE ENVIRONMENT...
            </div>
          </motion.div>
        )}

      </div>

      {/* FOOTER BAR WITH PROGRESS TIME GRAPHIC */}
      <div className="relative z-10 w-full max-w-lg mx-auto pb-4 space-y-2">
        <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono">
          <span>HOST: APEX_V3_SERVER</span>
          <span>{Math.round((elapsed / 7000) * 100)}% BOOTED</span>
        </div>
        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-f1-red via-[#00D2BE] to-[#00D2BE] transition-all duration-100 ease-out"
            style={{ width: `${Math.min(100, (elapsed / 7000) * 100)}%` }}
          />
        </div>
      </div>

      {/* ADDITIONAL STYLES FOR DYNAMIC ANIMATIONS IN COMPONENT */}
      <style>{`
        @keyframes sweeper {
          0% { left: -30%; }
          100% { left: 110%; }
        }
      `}</style>
    </div>
  );
}
