import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CIRCUITS, CircuitInfo, getCircuitData } from "../data/tracks";
import { DriverState } from "../types";
import {
  Play,
  Pause,
  Camera,
  RotateCcw,
  Zap,
  Gauge,
  Flag,
  Activity,
  Heart,
  Droplets,
  Wind,
  Shield,
  Cpu,
  Tv,
  Focus,
  Maximize2,
  Sliders,
  Sparkles,
  Volume2,
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  Radio,
  Eye,
  Info,
  Layers,
  MapPin,
  Clock
} from "lucide-react";

interface ReplayViewProps {
  drivers?: DriverState[];
  activeCircuitKey?: string;
  /** When true: hides the broadcast header and right telemetry panel.
   *  Use this when embedding ReplayView inside another layout (e.g. DashboardView). */
  compact?: boolean;
  meetings?: any[];
  onMeetingChange?: (meetingKey: string) => void;
}

export default function ReplayView({
  drivers: liveDrivers,
  activeCircuitKey,
  compact = false,
  meetings = [],
  onMeetingChange,
}: ReplayViewProps) {
  // Use the global track key directly instead of a duplicated local state
  const selectedTrackKey = activeCircuitKey || "Miami Grand Prix";

  const liveDriversKey = liveDrivers?.map(d => `${d.code}-${d.number}`).join(",") || "";

  // Combine dynamic live drivers from sidebar to build the interactive competitors list
  const availableRoster = useMemo(() => {
    const list: { code: string; fullName: string; team: string; color: string; number: number }[] = [];
    const seen = new Set<string>();

    // Add live dynamic drivers
    if (liveDrivers && liveDrivers.length > 0) {
      liveDrivers.forEach(d => {
        if (!seen.has(d.code)) {
          seen.add(d.code);
          list.push({
            code: d.code,
            fullName: d.fullName,
            team: d.team,
            color: d.color,
            number: d.number
          });
        }
      });
    }

    return list;
  }, [liveDriversKey]);

  // Current selections for Driver A and Driver B
  const [driverA, setDriverA] = useState<string>(liveDrivers?.[0]?.code || "NOR");
  const [driverB, setDriverB] = useState<string>(liveDrivers?.[1]?.code || "VER");

  const firstLiveCode = liveDrivers?.[0]?.code;
  const secondLiveCode = liveDrivers?.[1]?.code;

  useEffect(() => {
    // Graceful recovery if previous drivers are missing
    if (firstLiveCode && secondLiveCode) {
      setDriverA(firstLiveCode);
      setDriverB(secondLiveCode);
    }
  }, [firstLiveCode, secondLiveCode]);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3);
  const [progress, setProgress] = useState<number>(0.32);
  const [lapNumber, setLapNumber] = useState<number>(44);
  const [cameraMode, setCameraMode] = useState<"aerial" | "helmet" | "chase" | "spectator">("aerial");

  // Telemetry atmospheric variables
  const [safetyCar, setSafetyCar] = useState<boolean>(false);
  const [yellowFlag, setYellowFlag] = useState<boolean>(false);
  const [wetMode, setWetMode] = useState<boolean>(true); // Night Wet Race by default for gorgeous reflections!
  const [isOrbitalRotation, setIsOrbitalRotation] = useState<boolean>(true); // Elegant 3D perspective tilt
  const [glitchInterference, setGlitchInterference] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.05);
  const [activeSegmentLabel, setActiveSegmentLabel] = useState<string>("S1 Flat Out");

  // ── TV DIRECTOR STATE ─────────────────────────────────────────────────────
  type TvAngle = "wide" | "chase" | "driverFocus" | "cornerFocus";
  const TV_CAMERAS = useMemo(() => [
    { angle: "wide"        as TvAngle, label: "MAIN STRAIGHT", sublabel: "OVERHEAD CAM 1",  duration: 5500 },
    { angle: "chase"       as TvAngle, label: "SECTOR 2",      sublabel: "CHASE CAM 7",     duration: 4800 },
    { angle: "driverFocus" as TvAngle, label: "TURN 1",        sublabel: "DRIVER CAM A",    duration: 4200 },
    { angle: "cornerFocus" as TvAngle, label: "SECTOR 3",      sublabel: "TRACKSIDE CAM 4", duration: 5000 },
  ], []);
  const [tvCamIndex, setTvCamIndex] = useState<number>(0);
  const [cameraFade, setCameraFade] = useState<number>(1);
  const [svgViewBox, setSvgViewBox] = useState<string>("-30 -30 560 300");
  const [battleMode, setBattleMode] = useState<boolean>(false);
  const [battleFlash, setBattleFlash] = useState<boolean>(false);
  const [battleMarkers, setBattleMarkers] = useState<number[]>([]);
  const [racingLinePulse, setRacingLinePulse] = useState<number>(0);
  const tvTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const battleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const trackerTrack = useMemo(() => {
    return getCircuitData(selectedTrackKey);
  }, [selectedTrackKey]);

  // Resolve drivers profile details
  const profileA = useMemo(() => {
    return availableRoster.find(r => r.code === driverA) || availableRoster[0] || {
      code: "NOR", fullName: "Lando Norris", team: "McLaren", color: "#FF8000", number: 4
    };
  }, [availableRoster, driverA]);

  const profileB = useMemo(() => {
    return availableRoster.find(r => r.code === driverB) || availableRoster[1] || {
      code: "VER", fullName: "Max Verstappen", team: "Red Bull Racing", color: "#3671C6", number: 1
    };
  }, [availableRoster, driverB]);

  // Generate fake live-changing audio frequencies for visualizer
  const [audioFreqs, setAudioFreqs] = useState<number[]>([40, 60, 45, 80, 95, 30, 55, 75, 40]);
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioFreqs(Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 15));
    }, 140);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keep track of animation frames for continuous loop progress
  useEffect(() => {
    let frame: number;
    const update = () => {
      if (isPlaying) {
        setProgress((p) => {
          const delta = (0.0006 * playbackSpeed);
          const next = p + delta;
          if (next >= 1.0) {
            setLapNumber((l) => (l < totalLaps ? l + 1 : 1));
            return 0.0;
          }
          return next;
        });
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, playbackSpeed]);

  // Interpolate coordinate points on the race track loop
  const getCoordinatesAt = useCallback((ratio: number, offset: number = 0) => {
    const pts = trackerTrack.points;
    if (!pts || pts.length === 0) return { x: 100, y: 100, speed: 200, gear: 5, throttle: 80, brake: 0, color: "#00D2BE" };

    const finalRatio = (ratio + offset + 1.0) % 1.0;
    const rawIndex = finalRatio * (pts.length - 1);
    const lowIdx = Math.floor(rawIndex);
    const highIdx = Math.ceil(rawIndex);
    const fraction = rawIndex - lowIdx;

    const p1 = pts[lowIdx];
    const p2 = pts[highIdx];

    if (!p1 || !p2) return { x: 100, y: 100, speed: 200, gear: 5, throttle: 80, brake: 0, color: "#00D2BE" };

    const x = p1.x + (p2.x - p1.x) * fraction;
    const y = p1.y + (p2.y - p1.y) * fraction;

    let speed = p1.speedLimit + (p2.speedLimit - p1.speedLimit) * fraction;
    if (safetyCar) speed = Math.min(speed, 110);
    else if (yellowFlag) speed = Math.min(speed, 145);

    // Dynamic speed modulations inside curves
    const throttle = speed > 220 ? 100 : speed > 150 ? 80 : 25;
    const brake = speed < 130 ? 95 : speed < 180 ? 40 : 0;

    // Resolve gear selects
    const gear = speed > 310 ? 8 : speed > 260 ? 7 : speed > 210 ? 6 : speed > 160 ? 5 : speed > 120 ? 4 : speed > 90 ? 3 : 2;

    // Dynamic trajectory color prediction: Green/Cyan for fast straightaway, Red for heavy braking zones, Yellow for corners
    const trajColor = speed > 250 ? "#00FFDD" : speed > 150 ? "#EAB308" : "#EF4444";

    return { x, y, speed: Math.round(speed), gear, throttle, brake, color: trajColor };
  }, [trackerTrack.points, safetyCar, yellowFlag]);

  const carA = useMemo(() => getCoordinatesAt(progress, 0), [getCoordinatesAt, progress]);
  const carB = useMemo(() => getCoordinatesAt(progress, -0.048), [getCoordinatesAt, progress]); // Defender following behind with offset range


  // Light trails vectors: Sample past coordinates to render beautiful fluid light tails
  const carATrail1 = useMemo(() => getCoordinatesAt(progress, -0.012), [getCoordinatesAt, progress]);
  const carATrail2 = useMemo(() => getCoordinatesAt(progress, -0.024), [getCoordinatesAt, progress]);
  const carATrail3 = useMemo(() => getCoordinatesAt(progress, -0.036), [getCoordinatesAt, progress]);

  const carBTrail1 = useMemo(() => getCoordinatesAt(progress, -0.058), [getCoordinatesAt, progress]);
  const carBTrail2 = useMemo(() => getCoordinatesAt(progress, -0.068), [getCoordinatesAt, progress]);
  const carBTrail3 = useMemo(() => getCoordinatesAt(progress, -0.078), [getCoordinatesAt, progress]);

  // Generate SVG racetrack path layout string
  const trackPathString = useMemo(() => {
    return trackerTrack.points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  }, [trackerTrack.points]);

  // CHANGE 3 — Dynamic lap count per circuit
  const TOTAL_LAPS: Record<string, number> = {
    "Miami Grand Prix":      57,
    "Monaco Grand Prix":     78,
    "Monza Grand Prix":      53,
    "Silverstone GP":        52,
    "Bahrain Grand Prix":    57,
    "Spanish Grand Prix":    66,
    "British Grand Prix":    52,
    "Italian Grand Prix":    53,
    "Belgian Grand Prix":    44,
    "Hungarian Grand Prix":  70,
    "Dutch Grand Prix":      72,
    "Singapore Grand Prix":  62,
    "Japanese Grand Prix":   53,
    "Australian Grand Prix": 58,
    "Canadian Grand Prix":   70,
    "Austrian Grand Prix":   71,
    "Mexican Grand Prix":    71,
    "Brazilian Grand Prix":  71,
    "Las Vegas Grand Prix":  50,
    "Abu Dhabi Grand Prix":  58,
  };
  const totalLaps = TOTAL_LAPS[selectedTrackKey] ?? 57;

  // ── RACING LINE PULSE ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setRacingLinePulse(p => (p + 0.12) % (Math.PI * 2)), 40);
    return () => clearInterval(id);
  }, [isPlaying]);

  // ── BATTLE DETECTION ───────────────────────────────────────────────────────
  useEffect(() => {
    const dx = carA.x - carB.x;
    const dy = carA.y - carB.y;
    const isClose = Math.sqrt(dx * dx + dy * dy) < 22;
    if (isClose && !battleMode) {
      setBattleMode(true);
      setBattleFlash(true);
      setBattleMarkers(prev => {
        const last = prev[prev.length - 1];
        if (last !== undefined && Math.abs(last - progress) < 0.04) return prev;
        return [...prev.slice(-8), progress];
      });
      if (battleTimerRef.current) clearTimeout(battleTimerRef.current);
      battleTimerRef.current = setTimeout(() => setBattleFlash(false), 600);
    } else if (!isClose && battleMode) {
      if (battleTimerRef.current) clearTimeout(battleTimerRef.current);
      battleTimerRef.current = setTimeout(() => setBattleMode(false), 2500);
    }
  }, [carA.x, carA.y, carB.x, carB.y]);

  // ── TV DIRECTOR AUTO-SWITCH ────────────────────────────────────────────────
  useEffect(() => {
    if (cameraMode !== "aerial") return;
    const cam = TV_CAMERAS[tvCamIndex];
    if (tvTimerRef.current) clearTimeout(tvTimerRef.current);
    tvTimerRef.current = setTimeout(() => {
      setCameraFade(0);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        setTvCamIndex(i => (i + 1) % TV_CAMERAS.length);
        setCameraFade(1);
      }, 280);
    }, cam.duration);
    return () => {
      if (tvTimerRef.current) clearTimeout(tvTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [cameraMode, tvCamIndex, TV_CAMERAS]);

  // ── DYNAMIC SVG VIEWBOX ────────────────────────────────────────────────────
  useEffect(() => {
    const angle = TV_CAMERAS[tvCamIndex].angle;
    const targetZoom = battleMode ? 1.28 : angle === "driverFocus" ? 1.38 : angle === "cornerFocus" ? 1.22 : angle === "chase" ? 1.12 : 0.95;
    const vW = 500 / targetZoom;
    const vH = 260 / targetZoom;
    let cx = 250, cy = 120;
    if (angle === "chase") { cx = (carA.x + carB.x) / 2; cy = (carA.y + carB.y) / 2; }
    else if (angle === "driverFocus") { cx = carA.x; cy = carA.y; }
    else if (angle === "cornerFocus") {
      const ahead = { x: carA.x + (carB.x - carA.x) * 0.5, y: carA.y + (carB.y - carA.y) * 0.5 };
      cx = (carA.x + ahead.x) / 2; cy = (carA.y + ahead.y) / 2;
    }
    cx = Math.max(vW / 2 - 30, Math.min(500 - vW / 2 + 30, cx));
    cy = Math.max(vH / 2 - 30, Math.min(240 - vH / 2 + 30, cy));
    setSvgViewBox(`${cx - vW / 2} ${cy - vH / 2} ${vW} ${vH}`);
  }, [tvCamIndex, carA.x, carA.y, carB.x, carB.y, battleMode, TV_CAMERAS]);

  // ── DERIVED HUD VALUES ─────────────────────────────────────────────────────
  const currentTvCam = TV_CAMERAS[tvCamIndex];
  const speedNorm = Math.min(carA.speed / 360, 1);
  const racingLineOpacity = 0.45 + speedNorm * 0.5;
  const racingLineBlur = 2 + speedNorm * 6;
  const racingLinePulseVal = 0.7 + 0.3 * Math.sin(racingLinePulse);
  const racingLineWidth = 2.5 + speedNorm * 2.5;
  const gapSeconds = (0.048 * 1354 * (1 / Math.max(carA.speed, 50))).toFixed(3);
  const SECTOR_MARKERS = [
    { pos: 0.00, label: "S1", color: "#00D2BE" },
    { pos: 0.33, label: "S2", color: "#EC4899" },
    { pos: 0.66, label: "S3", color: "#F59E0B" },
  ];


  // Simulate floating segment logs
  useEffect(() => {
    const currentSpeed = carA.speed;
    if (currentSpeed > 310) {
      setActiveSegmentLabel("DRIVE ENGINE: DRS ACTIVE STRAIGHTAWAY");
    } else if (currentSpeed < 130) {
      setActiveSegmentLabel("HEAVY DECELERATION: APEX ROTATION");
    } else {
      setActiveSegmentLabel("HIGH TRANSITION CORNERING G-FORCE");
    }
  }, [carA.speed]);

  return (
    <div className="space-y-6 bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
      {/* FUTURISTIC STREAMER-LEVEL BROADCAST KEYFRAMES */}
      <style>{`
        @keyframes pulseGlowCyan {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.4)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.2)); }
          50% { filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 20px rgba(6, 182, 212, 0.5)); }
        }
        @keyframes pulseGlowMagenta {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(236, 72, 153, 0.4)) drop-shadow(0 0 10px rgba(236, 72, 153, 0.2)); }
          50% { filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5)); }
        }
        @keyframes flowDashLines {
          to { stroke-dashoffset: -400; }
        }
        @keyframes neonFlickerGrid {
          0%, 100% { opacity: 0.96; }
          45% { opacity: 0.94; }
          50% { opacity: 0.75; }
          52% { opacity: 0.98; }
          82% { opacity: 0.85; }
          84% { opacity: 0.45; }
          86% { opacity: 0.96; }
        }
        @keyframes gridScrollEffect {
          from { background-position: 0 0; }
          to { background-position: 30px 30px; }
        }
        @keyframes volumetricLightPulse {
          0%, 100% { opacity: 0.08; transform: scale(0.98); }
          50% { opacity: 0.22; transform: scale(1.02); }
        }
        @keyframes rippleEffect {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes racingLinePulseAnim {
          0%, 100% { stroke-opacity: 0.55; filter: drop-shadow(0 0 2px #00FFDD); }
          50% { stroke-opacity: 1; filter: drop-shadow(0 0 9px #00FFDD) drop-shadow(0 0 18px rgba(0,255,221,0.5)); }
        }
        @keyframes racingLineFlow {
          to { stroke-dashoffset: -600; }
        }
        @keyframes camLabelSlide {
          from { transform: translateX(-12px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes battleRingPulse {
          0%, 100% { opacity: 1;   r: 16; }
          50%       { opacity: 0.3; r: 19; }
        }
        .streamer-visualizer-bar {
          transition: height 0.15s ease-in-out;
        }
        .circuit-trajectory-glow {
          animation: flowDashLines 14s linear infinite;
        }
        .track-black-hole {
          background-color: #000000 !important;
        }
        .neon-text-bloom-cyan {
          text-shadow: 0 0 8px rgba(0, 210, 190, 0.8), 0 0 15px rgba(0, 210, 190, 0.4);
        }
        .neon-text-bloom-magenta {
          text-shadow: 0 0 8px rgba(236, 72, 153, 0.8), 0 0 15px rgba(236, 72, 153, 0.4);
        }
        .stream-crt-overlay::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04));
          background-size: 100% 4px, 6px 100%;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>

      {/* ================= CYBERPUNK CONTROL CONSOLE HEADER — hidden in compact mode ================= */}
      {!compact && (
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-black border border-slate-800/90 rounded-2xl p-5 shadow-[0_0_35px_rgba(0,210,190,0.06)] relative overflow-hidden select-none">
        
        {/* Glow corner spotlights */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#00D2BE] opacity-[0.05] rounded-full filter blur-xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-pink-500 opacity-[0.05] rounded-full filter blur-xl" />

        <div className="flex items-center gap-4.5 z-10 w-full lg:w-auto">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(0,210,190,0.2)] animate-pulse">
            <Radio className="w-6 h-6 text-[#00D2BE]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-extrabold tracking-widest bg-[#00D2BE]/10 text-[#00D2BE] px-2 py-0.5 rounded border border-[#00D2BE]/30 animate-pulse">
                BROADCAST FEED v2035.7
              </span>
              {wetMode && (
                <span className="font-mono text-[9px] font-bold tracking-wider bg-blue-950/60 text-blue-400 px-2.5 py-0.5 rounded border border-blue-800/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  WET REFLECTIONS ON
                </span>
              )}
            </div>
            <h1 className="text-white text-lg font-display font-black tracking-tight uppercase flex items-center gap-1.5 mt-1">
              APEX LIVE CINEMATIC REPLAY
              <span className="text-xs font-mono font-normal text-slate-500">[{trackerTrack.country}]</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-mono block uppercase">
              2035 Mercedes Race Wall & Formula 1 Digital-Twin Simulation Engine
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end z-10">
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-950 border border-slate-850 font-mono text-[10px] text-gray-300">
            <Clock className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: "6s" }} />
            <span>SESSION RUN: <strong className="text-white">99% FLOW</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-950 border border-slate-850 font-mono text-[10px] text-gray-300">
            <Layers className="w-3.5 h-3.5 text-[#00D2BE]" />
            <span>LEVEL: <strong className="text-white">VOLUMETRIC HD</strong></span>
          </div>

          <button
            onClick={() => setWetMode(!wetMode)}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ${
              wetMode
                ? "bg-blue-950 text-blue-300 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                : "bg-slate-950 text-gray-500 border border-slate-900 hover:border-slate-800"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            WET AMBIENCE
          </button>

          <div className="hidden sm:flex bg-red-600 px-3.5 py-1.5 rounded-lg text-white font-display font-black tracking-widest text-[10px] uppercase shadow-[0_0_20px_rgba(239,68,68,0.45)] items-center gap-1.5 animate-pulse cursor-default select-none">
            <div className="w-2 h-2 rounded-full bg-white block" />
            STREAMING FEED
          </div>
        </div>
      </div>
      )} {/* end !compact header */}

      {/* ================= TWO COLS: LEFT MAIN COCKPIT MAP STAGE & RIGHT DYNAMIC CONTROLS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* ================= LEFT GRID: TRON RACETRACK GRAPHIC VIEWPORT ================= */}
        {/* compact mode: full 12 cols (no right panel). normal mode: 8 cols */}
        <div className={`${compact ? "xl:col-span-12" : "xl:col-span-8"} bg-black border border-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_0_45px_rgba(0,0,0,0.95)] relative min-h-[580px] track-black-hole`}>
          
          {/* Neon Top and Bottom Screen edge lines */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D2BE] to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-pink-500 to-transparent pointer-events-none z-10" />

          {/* DYNAMIC TELEMETRY WATERMARK / DATA OVERLAYS */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2.5 pointer-events-none select-none">
            
            <div className="flex items-center gap-2.5 bg-black/85 border border-[#00D2BE]/30 px-3.5 py-1.5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] animate-ping" />
              <div className="font-mono text-[9px] text-gray-300">
                DRONE MULTI-PERSPECTIVE STREAM // <span className="text-[#00D2BE] font-bold">LATENCY 4.1ms</span>
              </div>
            </div>

            <div className="bg-black/85 border border-slate-900 px-3 py-2 rounded-xl text-[10px] font-mono text-gray-400 space-y-1 shadow-lg max-w-[190px]">
              <div className="text-slate-100 flex items-center justify-between border-b border-slate-900 pb-1 mb-1 font-bold">
                <span>ORACLE INTEGRAL</span>
                <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded">REAL TIME</span>
              </div>
              <div className="flex justify-between">
                <span>S1 STAGE :</span>
                <strong className="text-[#00D2BE] font-bold">PURPLE (BEST)</strong>
              </div>
              <div className="flex justify-between">
                <span>TRACK TEMP :</span>
                <strong className="text-white">38.2 °C</strong>
              </div>
              <div className="flex justify-between">
                <span>AIR COORDS :</span>
                <strong className="text-white">ALT_Drone5 // O_Lock</strong>
              </div>
              <div className="flex justify-between text-slate-500 text-[9px] pt-1">
                <span>UE5 ENGINE STATUS</span>
                <span>PHYSICS OK</span>
              </div>
            </div>

            {/* Static overlay alert based on state */}
            {safetyCar && (
              <div className="bg-amber-950/90 border border-amber-500/80 p-3 rounded-xl text-[10px] font-mono text-amber-300 shadow-xl max-w-[210px] animate-pulse">
                <div className="font-black flex items-center gap-1.5 uppercase text-amber-400 border-b border-amber-900/60 pb-1 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  SAFETY CAR ACTIVE
                </div>
                Pace car slowing simulation grid speed limit index strictly locked at 110 KM/H. Gaps preserved.
              </div>
            )}

            {yellowFlag && (
              <div className="bg-yellow-950/90 border border-yellow-500/80 p-3 rounded-xl text-[10px] font-mono text-yellow-300 shadow-xl max-w-[210px] animate-pulse">
                <div className="font-black flex items-center gap-1.5 uppercase text-yellow-400 border-b border-yellow-900/60 pb-1 mb-1">
                  <Flag className="w-4 h-4 text-yellow-500" />
                  SECTOR WARNING
                </div>
                Yellow Flags. Debris simulation active on sector S2 turn. Standard overtake handicap applied.
              </div>
            )}

          </div>

          <div className="absolute top-4 right-4 z-20 flex gap-2">
            
            <div className="bg-black/90 p-1.5 rounded-lg shadow-lg border border-slate-900 flex items-center gap-1 font-mono text-[9px] text-gray-400 select-none">
              <span>ZOOM :</span>
              <button onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.1))} className="cursor-pointer px-1.5 py-0.5 bg-slate-900 text-white font-black hover:bg-slate-800 rounded">-</button>
              <span className="font-bold text-white text-[10px]">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))} className="cursor-pointer px-1.5 py-0.5 bg-slate-900 text-white font-black hover:bg-slate-800 rounded">+</button>
            </div>

            <select
              title="Track Dynamic Selector"
              id="streamer-track-select"
              value={selectedTrackKey}
              onChange={(e) => {
                const val = e.target.value;
                if (meetings && onMeetingChange) {
                  const found = meetings.find(
                    (m) => (m.meeting_name || `${m.location} Grand Prix`) === val || m.location === val
                  );
                  if (found) {
                    onMeetingChange(found.meeting_key);
                  }
                }
              }}
              className="bg-black border border-slate-850 text-xs font-mono font-black text-[#00D2BE] px-3 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00D2BE] transition-all uppercase tracking-wide shadow-md hover:bg-slate-950"
            >
              {meetings && meetings.length > 0 ? (
                meetings.map((m) => {
                  const mName = m.meeting_name || `${m.location} Grand Prix`;
                  return (
                    <option key={m.meeting_key} value={mName} className="bg-black text-white">
                      {m.location} ({m.country_name || "F1"})
                    </option>
                  );
                })
              ) : (
                Object.keys(CIRCUITS).map((key) => (
                  <option key={key} value={key} className="bg-black text-white">
                    {key} ({CIRCUITS[key].country})
                  </option>
                ))
              )}
              {selectedTrackKey && meetings && !meetings.some(
                (m) => (m.meeting_name || `${m.location} Grand Prix`) === selectedTrackKey
              ) && (
                <option value={selectedTrackKey} className="bg-slate-900 text-[#00D2BE]">
                  {selectedTrackKey.split(" ")[0]} (OPENF1 PRO)
                </option>
              )}
            </select>
          </div>

          {/* STREAM VIEWPORT */}
          <div className="relative flex-1 bg-black flex items-center justify-center p-3 sm:p-6 stream-crt-overlay select-none overflow-hidden min-h-[260px] sm:min-h-[460px]" style={{ minHeight: undefined }}>
            
            {/* VOLUMETRIC SCATTER LIGHT BACKGROUND & SCANLINES */}
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:25px_25px]" />
            
            {/* Deep Dark Space Atmosphere */}
            <div className="absolute inset-0 bg-radial-gradient-glow pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(10, 16, 26, 0.45) 0%, rgba(0, 0, 0, 1) 100%)" }} />

            {/* Simulated Volumetric Light beam pulses (Lens bloom simulation) */}
            <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge overflow-hidden">
              <div 
                className="absolute top-[8%] left-[12%] w-[250px] h-[250px] rounded-full mix-blend-screen bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl" 
                style={{ animation: "volumetricLightPulse 8s infinite ease-in-out" }}
              />
              <div 
                className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full mix-blend-screen bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl" 
                style={{ animation: "volumetricLightPulse 6s infinite ease-in-out", animationDelay: "1.5s" }}
              />
            </div>

            {/* WET SURFACE NIGHT RAIN PUDDLES EFFECT */}
            {wetMode && (
              <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-60">
                {/* Visual puddle reflection overlays that overlap beautifully */}
                <div className="absolute top-[28%] left-[35%] w-32 h-10 bg-cyan-920/15 border border-cyan-800/10 rounded-full blur-md animate-pulse" />
                <div className="absolute bottom-[30%] left-[20%] w-48 h-12 bg-pink-920/10 border border-pink-800/5 rounded-full blur-md animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-[15%] right-[25%] w-24 h-6 bg-[#00D2BE]/10 rounded-full blur-xl animate-pulse" />
              </div>
            )}

            {/* MODE DISPATCHER FOR BROADCAST STAGES */}
            {/* MODE DISPATCHER FOR BROADCAST STAGES */}
            {cameraMode === "aerial" && (
              <div
                className="w-full h-full max-w-[500px] flex items-center justify-center relative select-none transition-transform duration-500 ease-out"
                style={{
                  transform: `scale(${zoomLevel}) ${isOrbitalRotation ? "rotateX(28deg) rotateY(-3deg) rotateZ(0deg)" : "none"}`,
                  opacity: cameraFade,
                  transition: "opacity 0.28s ease-in-out, transform 0.5s ease-out",
                }}
              >

                {/* ── TV CAMERA LABEL (top-left, slides in on cut) ─────────────── */}
                <div
                  key={tvCamIndex}
                  className="absolute top-[2%] left-[2%] z-30 pointer-events-none"
                  style={{ animation: "camLabelSlide 0.35s ease-out" }}
                >
                  <div className="bg-black/85 border-l-[3px] border-[#00D2BE] backdrop-blur-md pl-3 pr-4 py-1.5 rounded-r-lg shadow-[0_0_20px_rgba(0,210,190,0.15)]">
                    <div className="font-mono font-black text-white text-[12px] uppercase tracking-wider leading-none">
                      {currentTvCam.label}
                    </div>
                    <div className="font-mono text-[#00D2BE] text-[8px] uppercase tracking-widest mt-0.5 opacity-80">
                      {currentTvCam.sublabel}
                    </div>
                  </div>
                </div>

                {/* ── LAP INDICATOR (top-right) ────────────────────────────────── */}
                <div className="absolute top-[2%] right-[2%] z-30 pointer-events-none">
                  <div className="bg-black/85 border border-slate-700/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-right shadow-md">
                    <div className="font-mono text-[8px] text-slate-400 uppercase tracking-widest">LAP</div>
                    <div className="font-mono font-black text-white text-[15px] leading-none">
                      {lapNumber} <span className="text-slate-500 text-[9px] font-normal">/ {totalLaps}</span>
                    </div>
                  </div>
                </div>

                {/* ── BATTLE MODE OVERLAY ──────────────────────────────────────── */}
                {battleMode && (
                  <div className="absolute inset-0 z-30 pointer-events-none flex items-start justify-center pt-10">
                    <div
                      className="absolute inset-0 rounded-2xl border-2 transition-all duration-150"
                      style={{
                        borderColor: battleFlash ? "rgba(239,68,68,0.85)" : "rgba(239,68,68,0.2)",
                        boxShadow: battleFlash ? "inset 0 0 50px rgba(239,68,68,0.2)" : "none",
                      }}
                    />
                    <div className="bg-red-950/90 border border-red-500 backdrop-blur-sm px-4 py-2 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                      <span className="font-mono font-black text-red-300 tracking-widest text-[11px] uppercase">BATTLE MODE</span>
                      <span className="font-mono text-[9px] text-red-400/80 uppercase">{profileA.code} vs {profileB.code}</span>
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" style={{ animationDelay: "0.25s" }} />
                    </div>
                  </div>
                )}

                {/* ── SPEED TICKER BAR (bottom of SVG area) ───────────────────── */}
                <div className="absolute bottom-[10%] left-0 right-0 z-30 pointer-events-none">
                  <div className="bg-black/75 backdrop-blur-sm border-t border-b border-[#00D2BE]/25 py-1.5 px-3 flex items-center gap-5 font-mono text-[9px]">
                    <span className="text-[#00D2BE] font-black">{profileA.code}</span>
                    <span className="text-white font-bold">{carA.speed} <span className="text-slate-400 font-normal">km/h</span></span>
                    <span className="text-slate-500">G{carA.gear}</span>
                    <span className={`font-bold ${carA.speed > 280 ? "text-emerald-400" : "text-slate-500"}`}>{carA.speed > 280 ? "DRS ▲" : "DRS ▼"}</span>
                    <span className="text-slate-700 mx-1">╱╱</span>
                    <span className="text-pink-400 font-black">{profileB.code}</span>
                    <span className="text-white font-bold">{carB.speed} <span className="text-slate-400 font-normal">km/h</span></span>
                    <span className="text-slate-500">G{carB.gear}</span>
                    <span className="ml-auto font-mono text-[8px] text-slate-400">GAP <span className="text-white font-bold">{gapSeconds}s</span></span>
                  </div>
                </div>

                {/* ── SECTOR LABEL (bottom-left) ───────────────────────────────── */}
                <div className="absolute bottom-[2%] left-[2%] z-30 pointer-events-none">
                  <div className="bg-black/80 border-l-[3px] border-pink-500 pl-3 pr-4 py-1 rounded-r-lg">
                    <div className="font-mono text-[7px] text-slate-400 uppercase">SECTOR</div>
                    <div className="font-mono font-black text-pink-300 text-[12px] leading-none uppercase">
                      {progress < 0.33 ? "S1" : progress < 0.66 ? "S2" : "S3"}
                    </div>
                  </div>
                </div>

                {/* ── ORIGINAL ORACLE CAPTIONS (preserved) ────────────────────── */}
                <div className="absolute top-[3%] left-[-4%] bg-black/90 border border-cyan-500/20 backdrop-blur-md font-mono text-[8px] text-gray-400 px-2.5 py-1 rounded shadow-lg pointer-events-none hidden md:block z-25">
                  <span className="text-[#00D2BE] font-black">ORACLE ANALYTICS HUD</span>
                  <div className="mt-0.5">SPEED INTEGRITY: 100% SECURE</div>
                </div>
                <div className="absolute bottom-[3%] right-[-4%] bg-black/90 border border-pink-500/20 backdrop-blur-md font-mono text-[8.5px] text-gray-400 px-2.5 py-1 rounded shadow-lg pointer-events-none hidden md:block z-25">
                  <span className="text-pink-400 font-extrabold uppercase">Telemetry predictive</span>
                  <div className="mt-0.5 text-white">INTERV_LIMIT: <span className="font-bold text-emerald-400 font-mono">{(0.198 + 0.04 * Math.sin(progress * 6)).toFixed(3)}s</span></div>
                </div>

                {/* ── SVG TRACK WITH DYNAMIC VIEWBOX + CINEMATIC LAYERS ───────── */}
                <svg
                  viewBox={svgViewBox}
                  className="w-full h-full drop-shadow-[0_0_35px_rgba(0,18,30,0.7)]"
                  style={{ transition: "viewBox 0.5s cubic-bezier(0.4,0,0.2,1)" }}
                >
                  <defs>
                    <linearGradient id="cyberUnderglow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D2BE" stopOpacity="0.9" />
                      <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.5" />
                      <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Speed-reactive racing line glow — stdDeviation driven by carA speed */}
                    <filter id="racingLineGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation={racingLineBlur} result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="hyperGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Battle proximity glow */}
                    <filter id="battleGlow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* LAYER 1: Volumetric underglow */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="url(#cyberUnderglow)" strokeWidth="28"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ filter: "blur(20px)", opacity: 0.35 }}
                  />

                  {/* LAYER 2: Outer soft glow halo */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="#00D2BE" strokeWidth="15"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="opacity-20" style={{ filter: "blur(4px)" }}
                  />

                  {/* LAYER 3: Black asphalt bed */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="#0a0d17" strokeWidth="11"
                    strokeLinecap="round" strokeLinejoin="round"
                  />

                  {/* LAYER 4: Track edges — cyan + magenta */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="#00D2BE" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="opacity-80"
                    style={{ animation: "pulseGlowCyan 4s infinite ease-in-out" }}
                  />
                  <path
                    d={trackPathString} fill="none"
                    stroke="#EC4899" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="opacity-70"
                    style={{ animation: "pulseGlowMagenta 4s infinite ease-in-out", animationDelay: "1s" }}
                  />

                  {/* LAYER 5: SPEED-REACTIVE RACING LINE — intensity scales with carA.speed */}
                  {/* Coloured speed-blur halo */}
                  <path
                    d={trackPathString} fill="none"
                    stroke={carA.color}
                    strokeWidth={racingLineWidth * 2}
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      filter: "url(#racingLineGlow)",
                      opacity: racingLineOpacity * racingLinePulseVal * 0.55,
                    }}
                  />
                  {/* Animated dashed core racing line */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="#00FFDD"
                    strokeWidth={racingLineWidth}
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="60 140"
                    style={{
                      opacity: racingLineOpacity * racingLinePulseVal,
                      animation: "racingLinePulseAnim 1.8s ease-in-out infinite, racingLineFlow 10s linear infinite",
                    }}
                  />
                  {/* Flow stream overlay */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="#00D2BE" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="50 160"
                    className="circuit-trajectory-glow"
                    style={{ filter: "url(#hyperGlowCyan)", strokeDashoffset: 0 }}
                  />
                  {/* Magenta accent streak */}
                  <path
                    d={trackPathString} fill="none"
                    stroke="#EC4899" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="25 240"
                    className="opacity-60"
                    style={{ animationDuration: "9s" }}
                  />

                  {/* LAYER 6: Yellow flag overlay */}
                  {yellowFlag && (
                    <path
                      d={trackPathString} fill="none"
                      stroke="#EAB308" strokeWidth="5.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="12 12"
                      className="opacity-40 animate-pulse"
                    />
                  )}

                  {/* LAYER 7: Apex markers (original, preserved) */}
                  {trackerTrack.apexMarkers.map((marker, idx) => {
                    const isApexClass = marker.type === "apex";
                    const glowColor = isApexClass ? "#EC4899" : "#00D2BE";
                    return (
                      <g key={idx}>
                        <circle
                          cx={marker.x} cy={marker.y} r="14" fill="none" stroke={glowColor}
                          className="opacity-35"
                          style={{ transformOrigin: `${marker.x}px ${marker.y}px`, animation: "radarExpand 3s infinite linear", animationDelay: `${idx * 0.9}s` }}
                        />
                        <circle cx={marker.x} cy={marker.y} r="5" fill={glowColor} className="stroke-slate-950 stroke-1" style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }} />
                        <g transform={`translate(${marker.x + 8}, ${marker.y + 4.5})`}>
                          <rect x="-1" y="-9" width="55" height="13" rx="3" fill="#000000" stroke={glowColor} strokeWidth="0.5" className="opacity-90" />
                          <text x="3" y="0" className="font-mono font-black text-[7px] fill-white">{marker.label}</text>
                        </g>
                      </g>
                    );
                  })}

                  {/* LAYER 8: Car B — trail + F1 silhouette + battle ring + driver tag */}
                  <g className="transition-all duration-75">
                    {/* Fade trail dots */}
                    <circle cx={carBTrail3.x} cy={carBTrail3.y} r="3" fill={profileB.color} className="opacity-15" />
                    <circle cx={carBTrail2.x} cy={carBTrail2.y} r="4" fill={profileB.color} className="opacity-25" />
                    <circle cx={carBTrail1.x} cy={carBTrail1.y} r="5" fill={profileB.color} className="opacity-40" />
                    <line x1={carB.x} y1={carB.y} x2={carBTrail3.x} y2={carBTrail3.y} stroke={profileB.color} strokeWidth="2" className="opacity-20" />

                    {/* Battle proximity ring — preserved */}
                    {battleMode && (
                      <circle cx={carB.x} cy={carB.y} r="16" fill="none" stroke="#EF4444" strokeWidth="1.5"
                        style={{ filter: "url(#battleGlow)", animation: "battleRingPulse 0.5s ease-in-out infinite" }} />
                    )}

                    {/* F1 car silhouette — top-down, rotated to track heading */}
                    {(() => {
                      const headingRad = Math.atan2(carB.y - carBTrail1.y, carB.x - carBTrail1.x);
                      const headingDeg = (headingRad * 180) / Math.PI;
                      const col = profileB.color;
                      return (
                        <g transform={`translate(${carB.x}, ${carB.y}) rotate(${headingDeg})`}
                           style={{ filter: `drop-shadow(0 0 5px ${col})` }}>
                          {/* Chassis body */}
                          <ellipse rx="9" ry="3.8" fill={col} opacity="0.95" />
                          {/* Nose cone */}
                          <ellipse cx="10" cy="0" rx="3.5" ry="1.6" fill={col} opacity="0.9" />
                          {/* Cockpit / halo */}
                          <ellipse cx="1" cy="0" rx="3" ry="2" fill="#111" stroke={col} strokeWidth="0.5" opacity="0.9" />
                          {/* Front wing */}
                          <rect x="11" y="-5.5" width="5" height="1.2" rx="0.4" fill={col} opacity="0.85" />
                          <rect x="11" y="4.3" width="5" height="1.2" rx="0.4" fill={col} opacity="0.85" />
                          {/* Rear wing */}
                          <rect x="-14" y="-5.5" width="5" height="1.3" rx="0.4" fill={col} opacity="0.85" />
                          <rect x="-14" y="4.2" width="5" height="1.3" rx="0.4" fill={col} opacity="0.85" />
                          {/* Front tyres */}
                          <rect x="8" y="-4.8" width="4" height="2.2" rx="1" fill="#222" stroke={col} strokeWidth="0.6" />
                          <rect x="8" y="2.6" width="4" height="2.2" rx="1" fill="#222" stroke={col} strokeWidth="0.6" />
                          {/* Rear tyres */}
                          <rect x="-12" y="-5" width="5" height="2.8" rx="1.2" fill="#222" stroke={col} strokeWidth="0.6" />
                          <rect x="-12" y="2.2" width="5" height="2.8" rx="1.2" fill="#222" stroke={col} strokeWidth="0.6" />
                          {/* White centre line */}
                          <line x1="-8" y1="0" x2="10" y2="0" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
                        </g>
                      );
                    })()}

                    {/* CHANGE 2 — Driver B broadcast tag: CODE +Gap */}
                    {(() => {
                      const tx = carB.x + 14;
                      const ty = carB.y - 14;
                      return (
                        <g transform={`translate(${tx}, ${ty})`} style={{ pointerEvents: "none" }}>
                          {/* Background pill */}
                          <rect x="0" y="-8" width="52" height="14" rx="2.5" fill="#000000" fillOpacity="0.82" />
                          {/* Left colour bar */}
                          <rect x="0" y="-8" width="3" height="14" rx="1" fill={profileB.color} />
                          {/* Driver code */}
                          <text x="6" y="2" fontFamily="monospace" fontWeight="700" fontSize="6.5" fill="#ffffff" letterSpacing="0.5">{profileB.code}</text>
                          {/* Gap value */}
                          <text x="29" y="2" fontFamily="monospace" fontWeight="400" fontSize="6" fill={profileB.color} letterSpacing="0.3">+{gapSeconds}</text>
                        </g>
                      );
                    })()}
                  </g>

                  {/* LAYER 9: Car A — trail + F1 silhouette + battle ring + driver tag */}
                  <g className="transition-all duration-75">
                    {/* Fade trail dots */}
                    <circle cx={carATrail3.x} cy={carATrail3.y} r="3" fill={profileA.color} className="opacity-15" />
                    <circle cx={carATrail2.x} cy={carATrail2.y} r="4" fill={profileA.color} className="opacity-25" />
                    <circle cx={carATrail1.x} cy={carATrail1.y} r="5" fill={profileA.color} className="opacity-40" />
                    <line x1={carA.x} y1={carA.y} x2={carATrail3.x} y2={carATrail3.y} stroke={profileA.color} strokeWidth="2.5" className="opacity-25" />

                    {/* Battle proximity ring — preserved */}
                    {battleMode && (
                      <circle cx={carA.x} cy={carA.y} r="18" fill="none" stroke="#EF4444" strokeWidth="1.5"
                        style={{ filter: "url(#battleGlow)", animation: "battleRingPulse 0.5s ease-in-out infinite", animationDelay: "0.15s" }} />
                    )}

                    {/* F1 car silhouette — top-down, rotated to track heading */}
                    {(() => {
                      const headingRad = Math.atan2(carA.y - carATrail1.y, carA.x - carATrail1.x);
                      const headingDeg = (headingRad * 180) / Math.PI;
                      const col = profileA.color;
                      return (
                        <g transform={`translate(${carA.x}, ${carA.y}) rotate(${headingDeg})`}
                           style={{ filter: `drop-shadow(0 0 6px ${col})` }}>
                          {/* Chassis body */}
                          <ellipse rx="9" ry="3.8" fill={col} opacity="0.95" />
                          {/* Nose cone */}
                          <ellipse cx="10" cy="0" rx="3.5" ry="1.6" fill={col} opacity="0.9" />
                          {/* Cockpit / halo */}
                          <ellipse cx="1" cy="0" rx="3" ry="2" fill="#111" stroke={col} strokeWidth="0.5" opacity="0.9" />
                          {/* Front wing */}
                          <rect x="11" y="-5.5" width="5" height="1.2" rx="0.4" fill={col} opacity="0.85" />
                          <rect x="11" y="4.3" width="5" height="1.2" rx="0.4" fill={col} opacity="0.85" />
                          {/* Rear wing */}
                          <rect x="-14" y="-5.5" width="5" height="1.3" rx="0.4" fill={col} opacity="0.85" />
                          <rect x="-14" y="4.2" width="5" height="1.3" rx="0.4" fill={col} opacity="0.85" />
                          {/* Front tyres */}
                          <rect x="8" y="-4.8" width="4" height="2.2" rx="1" fill="#222" stroke={col} strokeWidth="0.6" />
                          <rect x="8" y="2.6" width="4" height="2.2" rx="1" fill="#222" stroke={col} strokeWidth="0.6" />
                          {/* Rear tyres */}
                          <rect x="-12" y="-5" width="5" height="2.8" rx="1.2" fill="#222" stroke={col} strokeWidth="0.6" />
                          <rect x="-12" y="2.2" width="5" height="2.8" rx="1.2" fill="#222" stroke={col} strokeWidth="0.6" />
                          {/* White centre line */}
                          <line x1="-8" y1="0" x2="10" y2="0" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
                        </g>
                      );
                    })()}

                    {/* CHANGE 2 — Driver A broadcast tag: CODE P1 */}
                    {(() => {
                      const tx = carA.x + 14;
                      const ty = carA.y - 14;
                      return (
                        <g transform={`translate(${tx}, ${ty})`} style={{ pointerEvents: "none" }}>
                          {/* Background pill */}
                          <rect x="0" y="-8" width="44" height="14" rx="2.5" fill="#000000" fillOpacity="0.82" />
                          {/* Left colour bar */}
                          <rect x="0" y="-8" width="3" height="14" rx="1" fill={profileA.color} />
                          {/* Driver code */}
                          <text x="6" y="2" fontFamily="monospace" fontWeight="700" fontSize="6.5" fill="#ffffff" letterSpacing="0.5">{profileA.code}</text>
                          {/* Position indicator */}
                          <text x="29" y="2" fontFamily="monospace" fontWeight="700" fontSize="6" fill="#FFD700" letterSpacing="0.3">P1</text>
                        </g>
                      );
                    })()}
                  </g>

                </svg>
              </div>
            )}


            {cameraMode === "helmet" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-6 text-center select-none">
                
                {/* Advanced Helmet Visor HUD Outline Overlay */}
                <div className="absolute inset-x-8 inset-y-12 border border-[#00D2BE]/30 rounded-[30px] pointer-events-none flex flex-col justify-between p-5 z-20">
                  <div className="flex justify-between font-mono text-[8.5px] text-[#00D2BE] opacity-80">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                      REC FEED LOCK: {profileA.code} [DRV_SECURE]
                    </span>
                    <span>SYS_ALT: 3.42G LAT</span>
                  </div>
                  <div className="flex justify-between items-end font-mono text-[8.5px] text-gray-500">
                    <span>GPS LINK: 20_SAT ACTIVE</span>
                    <span>BATTERY: 98.4% TEMP: 78.1°C</span>
                  </div>
                </div>

                <div className="border border-[#00D2BE]/20 bg-slate-950/90 hover:border-[#00D2BE]/40 transition-colors p-7 rounded-2xl space-y-4 max-w-sm relative z-30 shadow-[0_0_35px_rgba(6,182,212,0.15)] animate-pulse">
                  <div className="w-12 h-12 rounded-full border border-[#00D2BE]/30 flex items-center justify-center bg-cyan-950/30 mx-auto">
                    <Focus className="w-6 h-6 text-[#00D2BE] animate-spin" />
                  </div>
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">{profileA.fullName} HELMET VISOR HUD v4.1</h4>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed">
                    Streaming helmet audio-telemetry multiplex inside <strong className="text-white text-xs">{trackerTrack.name}</strong>. Velocity index is floating at <strong className="text-[#00D2BE] text-sm">{carA.speed} KM/H</strong>, Active Gear: <strong className="text-white">G{carA.gear}</strong>, Throttle pressure: <strong className="text-emerald-400">{carA.throttle}%</strong>.
                  </p>
                  <div className="pt-2 flex gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] text-[#00D2BE] font-mono tracking-widest font-black uppercase">FEED ONLINE [AES_256 SECURED]</span>
                  </div>
                </div>
              </div>
            )}

            {cameraMode === "chase" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-6 text-center select-none">
                
                {/* Advanced Broadcast Sweep HUD */}
                <div className="absolute inset-0 border border-pink-500/10 pointer-events-none p-5 flex flex-col justify-between z-20">
                  <div className="w-32 h-1 border-t-2 border-pink-500 opacity-20" />
                  <div className="w-full flex justify-between font-mono text-[7px] text-pink-400">
                    <span>CHASE TELEMETRY DISCRETE MATCH</span>
                    <span>GAIN GAP CONVERGENCE: -42.1 dB</span>
                  </div>
                </div>

                <div className="border border-purple-500/30 bg-slate-950/90 p-7 rounded-2xl space-y-4 max-w-sm relative z-30 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                  <Camera className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">CHASE CAM TRACKING OVERLAY</h4>
                  <p className="text-xs text-slate-350 font-mono leading-relaxed">
                    Tracking leading competitor: <strong className="text-white font-bold">{profileA.code}</strong>. Distance delay gap: <strong className="text-emerald-400 text-sm">{(0.188 + 0.05 * Math.cos(progress * 5)).toFixed(3)} seconds</strong>. Current DRS state: <strong className="text-[#00D2BE] uppercase font-bold">ACTIVE</strong>.
                  </p>
                </div>
              </div>
            )}

            {cameraMode === "spectator" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-6 text-center select-none">
                <div className="border border-emerald-500/20 bg-slate-950/90 p-7 rounded-2xl space-y-4 max-w-sm relative z-30 shadow-[0_0_35px_rgba(16,185,129,0.1)]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">PIT WALL SPECTATOR MATRIX</h4>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed">
                    Camera coordinates loaded on sector loop 2 trap. Track ambient temp: <strong className="text-white">38.2°C</strong>, Pitlane release limit: <strong className="text-amber-400">80 KM/H</strong>.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* ================= DYNAMIC TIMELINE TRACK SEEK SCROLLER ================= */}
          <div className="p-5 bg-slate-950/95 border-t border-slate-900 space-y-4 shadow-2xl relative z-20">
            
            <div className="flex items-center justify-between gap-3 select-none">
              <span className="text-[10px] font-mono text-[#00D2BE] font-bold">
                TIMEPIN::{Math.round(progress * 1354)}s
              </span>
              
              <div className="flex-1 h-2 relative flex items-center">
                {/* Glowing bar track underneath */}
                <div className="absolute left-0 right-0 h-1 bg-slate-900 rounded-full" />
                <div 
                  className="absolute left-0 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full pointer-events-none" 
                  style={{ width: `${progress * 100}%` }}
                />
                
                <input
                  id="scrubber-bar"
                  title="Warp speed progression seeker"
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={progress}
                  onChange={(e) => setProgress(parseFloat(e.target.value))}
                  className="absolute inset-x-0 w-full h-4 opacity-100 cursor-pointer accent-[#00D2BE] bg-transparent z-10"
                />
              </div>
              
              <span className="text-[10px] font-mono text-white font-black bg-cyan-950/30 border border-cyan-800/25 px-2.5 py-0.5 rounded select-none">
                LAP {lapNumber} <span className="text-gray-500">/ {totalLaps}</span>
              </span>
            </div>

            {/* CONTROL BUTTONS FOR PLAYBACK & STREAM CHECKS */}
            <div className="flex flex-wrap items-center justify-between gap-4 select-none">
              
              <div className="flex items-center gap-3">
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center hover:from-cyan-300 hover:to-teal-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,210,190,0.4)] active:scale-95 shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 translate-x-[1px]" />}
                </button>

                {/* Warp speeds */}
                <div className="flex bg-slate-900 border border-slate-800/80 p-1 rounded-xl shadow-inner">
                  {([1, 2, 3, 5, 10]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPlaybackSpeed(m)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer ${
                        playbackSpeed === m
                          ? "bg-[#00D2BE] text-slate-950"
                          : "text-gray-400 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated race events triggers */}
              <div className="flex items-center gap-2 flex-wrap">
                
                <button
                  onClick={() => setSafetyCar(!safetyCar)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer ${
                    safetyCar 
                      ? "bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]" 
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  ⚠ Safety Car
                </button>

                <button
                  onClick={() => setYellowFlag(!yellowFlag)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer ${
                    yellowFlag 
                      ? "bg-yellow-950 text-yellow-300 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.25)]" 
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  ⚑ Yellow Flag
                </button>

                <button
                  onClick={() => setIsOrbitalRotation(!isOrbitalRotation)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer ${
                    isOrbitalRotation
                      ? "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.25)]"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  3D Perspective
                </button>

                <button
                  onClick={() => {
                    setProgress(0.1);
                    setLapNumber(1);
                  }}
                  title="Reset coordinates timeline sequence"
                  className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-gray-400 hover:text-white cursor-pointer active:scale-90"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ================= RIGHT VIEWPORT (4 COLS): STREAMER TELEMETRY / LEADERBOARDS — hidden in compact mode ================= */}
        {!compact && (
        <div className="xl:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* DRIVER CHOCK-SELECTOR PANEL (All drivers loaded dynamically!) */}
          <div className="bg-black border border-slate-900 rounded-2xl p-5 shadow-lg space-y-4">
            
            <div className="border-b border-slate-850 pb-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-[#00D2BE] font-black uppercase tracking-wider block">
                  Interactive Competitor Selectors
                </span>
                <h3 className="text-sm font-display font-black text-white uppercase mt-0.5 tracking-tight">
                  TARGET TARGETS
                </h3>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Selector A */}
              <div className="space-y-1">
                <label htmlFor="select-driver-a" className="text-[10px] font-mono text-gray-400 font-bold block uppercase">LEAD ATTACK (A)</label>
                <select
                  id="select-driver-a"
                  value={driverA}
                  onChange={(e) => setDriverA(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-xs p-2.5 rounded-xl uppercase font-black focus:outline-none focus:ring-1 focus:ring-[#00D2BE]"
                >
                  {availableRoster.map(drv => (
                    <option key={drv.code} value={drv.code} className="bg-slate-900 text-white uppercase">
                      #{drv.number} {drv.code} ({drv.team.split(" ")[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector B */}
              <div className="space-y-1">
                <label htmlFor="select-driver-b" className="text-[10px] font-mono text-gray-400 font-bold block uppercase">CHASI DEFENSE (B)</label>
                <select
                  id="select-driver-b"
                  value={driverB}
                  onChange={(e) => setDriverB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-xs p-2.5 rounded-xl uppercase font-black focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {availableRoster.filter(r => r.code !== driverA).map(drv => (
                    <option key={drv.code} value={drv.code} className="bg-slate-900 text-white uppercase">
                      #{drv.number} {drv.code} ({drv.team.split(" ")[0]})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* QUICK TOGGLE ACTIVE HUD FEED */}
            <div className="grid grid-cols-2 gap-2 select-none">
              {(["aerial", "helmet", "chase", "spectator"] as const).map((cam) => (
                <button
                  key={cam}
                  onClick={() => setCameraMode(cam)}
                  className={`p-2.5 rounded-xl border text-left font-mono transition-all flex flex-col gap-1 cursor-pointer ${
                    cameraMode === cam
                      ? "bg-slate-900/80 border-[#00D2BE] text-white font-bold text-[10px] shadow-[0_0_12px_rgba(0,210,190,0.15)]"
                      : "bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white text-[10px]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Camera className={`w-3.5 h-3.5 ${cameraMode === cam ? "text-cyan-400 animate-pulse" : "text-gray-500"}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${cameraMode === cam ? "bg-[#00D2BE] animate-ping" : "bg-transparent"}`} />
                  </div>
                  <span className="capitalize leading-none text-[10px] pt-1">
                    {cam === "aerial" ? "3D Replay Overview" : cam === "helmet" ? "Helmet stream" : cam === "chase" ? "Active Chase" : "Pitlane coords"}
                  </span>
                </button>
              ))}
            </div>

          </div>

          {/* DYNAMIC TELEMETRY STATUS SHEET */}
          <div className="bg-black border border-slate-900 rounded-2xl p-5 shadow-lg space-y-4 flex-1 flex flex-col justify-between">
            
            <div className="border-b border-slate-850 pb-2">
              <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase block tracking-wider animate-pulse">
                VOLUMETRIC DATA STACKS ACTIVE
              </span>
              <h3 className="text-sm font-display font-black text-white uppercase mt-0.5 tracking-tight">
                DYNAMIC PERFORMANCE MODULES
              </h3>
            </div>

            {/* Core telemetry widgets layout */}
            <div className="space-y-4 my-2.5 flex-1 overflow-y-auto">
              
              {/* Competitor A Details */}
              <div className="p-3.5 bg-slate-900/10 border border-slate-900/90 rounded-2xl relative overflow-hidden space-y-3.5">
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px]" style={{ backgroundColor: profileA.color }} />
                
                <div className="flex items-center justify-between font-mono">
                  <div>
                    <span className="text-white font-black text-xs block">{profileA.fullName}</span>
                    <span className="text-[8.5px] uppercase font-extrabold tracking-widest text-[#00D2BE]">{profileA.team}</span>
                  </div>
                  <span className="text-xl font-black font-display italic tracking-tight" style={{ color: profileA.color }}>#{profileA.number}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px]">
                  
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80">
                    <div className="text-slate-500 text-[8px] uppercase font-bold">TELE_VELOC_IND:</div>
                    <span className="text-white font-black text-xs tracking-tight">{carA.speed} <span className="text-[8px] text-slate-500 font-normal">KM/H</span></span>
                    {/* Tiny progress velocity line */}
                    <div className="h-[1.5px] bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(carA.speed / 360) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80">
                    <div className="text-slate-500 text-[8px] uppercase font-bold">DRS_SELECTION:</div>
                    <span className={`font-black text-xs ${carA.speed > 280 ? "text-emerald-400" : "text-gray-400"}`}>
                      {carA.speed > 280 ? "DEPLOYED" : "INACTIVE"}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80 text-emerald-400">
                    <div className="text-emerald-500/60 text-[8px] uppercase font-bold">THR PRESSURE:</div>
                    <span className="font-extrabold text-xs">{carA.throttle}%</span>
                    <div className="h-[2px] bg-slate-900 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${carA.throttle}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80 text-rose-500">
                    <div className="text-rose-500/60 text-[8px] uppercase font-bold">BRK PRESSURE:</div>
                    <span className="font-extrabold text-xs">{carA.brake}%</span>
                    <div className="h-[2px] bg-slate-900 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${carA.brake}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor B Details */}
              <div className="p-3.5 bg-slate-900/10 border border-slate-900/90 rounded-2xl relative overflow-hidden space-y-3.5">
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px]" style={{ backgroundColor: profileB.color }} />
                
                <div className="flex items-center justify-between font-mono">
                  <div>
                    <span className="text-white font-black text-xs block">{profileB.fullName}</span>
                    <span className="text-[8.5px] uppercase font-extrabold tracking-widest text-pink-400">{profileB.team}</span>
                  </div>
                  <span className="text-xl font-black font-display italic tracking-tight" style={{ color: profileB.color }}>#{profileB.number}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px]">
                  
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80">
                    <div className="text-slate-500 text-[8px] uppercase font-bold">TELE_VELOC_IND:</div>
                    <span className="text-white font-black text-xs tracking-tight">{carB.speed} <span className="text-[8px] text-slate-500 font-normal">KM/H</span></span>
                    <div className="h-[1.5px] bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-pink-400 rounded-full" style={{ width: `${(carB.speed / 360) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80">
                    <div className="text-slate-500 text-[8px] uppercase font-bold">DRS_SELECTION:</div>
                    <span className={`font-black text-xs ${carB.speed > 280 ? "text-emerald-400" : "text-gray-400"}`}>
                      {carB.speed > 280 ? "DEPLOYED" : "INACTIVE"}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80 text-emerald-400">
                    <div className="text-emerald-500/60 text-[8px] uppercase font-bold">THR PRESSURE:</div>
                    <span className="font-extrabold text-xs">{carB.throttle}%</span>
                    <div className="h-[2px] bg-slate-900 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${carB.throttle}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-900/80 text-rose-500">
                    <div className="text-rose-500/60 text-[8px] uppercase font-bold">BRK PRESSURE:</div>
                    <span className="font-extrabold text-xs">{carB.brake}%</span>
                    <div className="h-[2px] bg-slate-900 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${carB.brake}%` }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* REAL-TIME AUDIO FREQUENCY SIMULATOR MATRIX */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900 text-xs font-mono select-none">
              <div className="flex items-center justify-between text-[#00D2BE] text-[8px] font-black uppercase mb-2">
                <span>Race Engine Frequency Spectrum Generator</span>
                <span className="animate-pulse">120 Hz Active</span>
              </div>
              <div className="flex items-end justify-between h-8 gap-0.5 px-1 bg-black/40 rounded-lg">
                {audioFreqs.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-[#00D2BE] to-pink-500 rounded-t-sm streamer-visualizer-bar"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </div>

            {/* AI HUD AND TELEMETRY DIAGNOSTICS */}
            <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-1 font-mono text-[9px] text-[#00D2BE] select-none">
              <div className="flex justify-between items-center text-slate-100">
                <span className="font-black uppercase tracking-wider text-[8px]">DIGITAL-TWIN SEGMENT STATE:</span>
                <span className="text-emerald-400 font-extrabold uppercase">OK_CALC v44</span>
              </div>
              <p className="text-gray-400 text-[8.5px] leading-relaxed uppercase">
                {activeSegmentLabel}
              </p>
            </div>

          </div>

        </div>
        )} {/* end !compact right panel */}

      </div>
    </div>
  );
}
