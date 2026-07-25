import { useState, useEffect, useMemo, useCallback } from "react";
import ReplayView from "./ReplayView";
import { DriverState, LapMetric, TelemetryPoint, SessionContext } from "../types";
import { F1_DRIVERS, DriverProfile } from "../data/f1Data";
import { CIRCUITS, CircuitInfo, getCircuitData } from "../data/tracks";
import {
  Play,
  Pause,
  Layers,
  Fuel,
  TrendingUp,
  AlertTriangle,
  CloudRain,
  Gauge,
  Activity,
  Award,
  Navigation,
  Sparkles,
  RotateCcw,
  FileDown,
  LineChart,
  Trophy,
  Maximize2,
  Thermometer,
  Wind,
  Flag,
  Percent,
  Compass
} from "lucide-react";

interface DashboardViewProps {
  sessionContext: SessionContext;
  drivers: DriverState[];
  lapsData: LapMetric[];
  telemetryData: TelemetryPoint[];
  weatherData: {
    trackTemp: number;
    airTemp: number;
    humidity: number;
    windSpeed: number;
    status: string;
    drsEnabled: boolean;
  };
  strategyText: string;
  isAiOptimizing: boolean;
  onRefreshAi: () => void;
  meetings?: any[];
  onMeetingChange?: (meetingKey: string) => void;
}

export default function DashboardView({
  sessionContext,
  drivers: propDrivers,
  weatherData: propWeatherData,
  strategyText,
  isAiOptimizing,
  onRefreshAi,
  meetings = [],
  onMeetingChange,
}: DashboardViewProps) {
  // Master active Duel driver codes (NOR & VER by default)
  const [driverAId, setDriverAId] = useState<string>("NOR");
  const [driverBId, setDriverBId] = useState<string>("VER");

  const firstDriverCode = propDrivers?.[0]?.code;
  const secondDriverCode = propDrivers?.[1]?.code;

  // Sync initial driver selections from live drivers array if available
  useEffect(() => {
    if (firstDriverCode && secondDriverCode) {
      setDriverAId(firstDriverCode);
      setDriverBId(secondDriverCode);
    }
  }, [firstDriverCode, secondDriverCode]);

  const propDriversKey = propDrivers?.map(d => `${d.code}-${d.number}`).join(",") || "";

  // Combine dynamic live drivers with static F1 catalog of DriverProfile objects
  const availableRoster = useMemo(() => {
    const list: DriverProfile[] = [];
    const seen = new Set<string>();

    const getDriverProfile = (code: string, num: number, name: string, team: string, color: string): DriverProfile => {
      const found = F1_DRIVERS.find(d => d.code === code);
      if (found) return found;

      const spaceIndex = name.indexOf(" ");
      const firstName = spaceIndex !== -1 ? name.substring(0, spaceIndex) : name;
      const lastName = spaceIndex !== -1 ? name.substring(spaceIndex + 1) : "Driver";

      return {
        number: num,
        code: code,
        firstName,
        lastName,
        fullName: name,
        team,
        color,
        flagUrl: "https://flagcdn.com/w40/un.png",
        portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
        teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png",
        nationality: "International",
        championshipPosition: 10 + (num % 10),
        points: Math.max(0, 150 - num * 3),
        advantages: ["Constant telemetry integrity", "Adaptive throttle index"],
        disadvantages: ["Thermal tire retention risk"],
        winProbability: 5,
        bestLap: "1:29.845"
      };
    };

    if (propDrivers && propDrivers.length > 0) {
      propDrivers.forEach(d => {
        if (!seen.has(d.code)) {
          seen.add(d.code);
          list.push(getDriverProfile(d.code, d.number, d.fullName, d.team, d.color));
        }
      });
    }

    return list;
  }, [propDriversKey]);

  const p1 = useMemo(() => {
    return availableRoster.find((d) => d.code === driverAId) || availableRoster[0] || null;
  }, [availableRoster, driverAId]);

  const p2 = useMemo(() => {
    return availableRoster.find((d) => d.code === driverBId) || availableRoster[1] || null;
  }, [availableRoster, driverBId]);

  // Lookup the circuit metadata from CIRCUITS dictionary or procedurally generate it on the fly!
  const activeCircuit = useMemo(() => {
    return getCircuitData(sessionContext?.round || "Miami Grand Prix");
  }, [sessionContext?.round]);

  // Playback control states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playSpeed, setPlaySpeed] = useState<number>(1.5);
  const [progressVal, setProgressVal] = useState<number>(0.42);
  const [timelineSecs, setTimelineSecs] = useState<number>(5327);

  // Simulated metrics overrides linked dynamically to UI controllers
  const [safetyCarMode, setSafetyCarMode] = useState<boolean>(false);
  const [rainRiskMode, setRainRiskMode] = useState<boolean>(false);
  const [trackTempSim, setTrackTempSim] = useState<number>(38.2);
  const [tyreDegradationSim, setTyreDegradationSim] = useState<number>(14);



  // Sync / update simulator ticks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressVal((prev) => {
          const step = 0.008 * playSpeed;
          const next = prev + step;
          return next >= 1.0 ? 0.0 : next;
        });
        setTimelineSecs((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  // Determine kinematic telemetry on the current active circuit path
  const getSimulatedLiveECU = useCallback((progress: number, offsetShift: number) => {
    const pts = activeCircuit.points;
    const totalPoints = pts.length;
    if (totalPoints === 0) {
      return { x: 100, y: 150, speed: 200, gear: 5, throttle: 80, brake: 0 };
    }

    const continuousVal = (progress + offsetShift + 1.0) % 1.0;
    const rawIndex = continuousVal * totalPoints;
    const idxLow = Math.floor(rawIndex) % totalPoints;
    const idxHigh = (idxLow + 1) % totalPoints;
    const innerRatio = rawIndex - Math.floor(rawIndex);

    const anchor1 = pts[idxLow];
    const anchor2 = pts[idxHigh];

    const posX = anchor1.x + (anchor2.x - anchor1.x) * innerRatio;
    const posY = anchor1.y + (anchor2.y - anchor1.y) * innerRatio;

    let targetSpeed = anchor1.speedLimit + (anchor2.speedLimit - anchor1.speedLimit) * innerRatio;
    if (safetyCarMode) {
      targetSpeed = Math.min(targetSpeed, 120);
    } else if (rainRiskMode) {
      targetSpeed = targetSpeed * 0.8; // wet slick traction reduction
    }

    // High frequency telemetry jitter
    const latencyJitter = Math.sin(timelineSecs * 0.5) * 2.5;
    const finalSpeed = Math.max(70, Math.round(targetSpeed + latencyJitter));

    // Dynamic Gear ratios computation
    let targetGear = 8;
    if (finalSpeed < 100) targetGear = 2;
    else if (finalSpeed < 140) targetGear = 3;
    else if (finalSpeed < 180) targetGear = 4;
    else if (finalSpeed < 220) targetGear = 5;
    else if (finalSpeed < 260) targetGear = 6;
    else if (finalSpeed < 305) targetGear = 7;

    return {
      x: posX,
      y: posY,
      speed: finalSpeed,
      gear: targetGear,
      throttle: finalSpeed > 250 ? 100 : finalSpeed > 170 ? 88 : finalSpeed > 110 ? 45 : 12,
      brake: finalSpeed < 150 && anchor1.brake > 0 ? 82 : finalSpeed < 100 ? 90 : 0
    };
  }, [activeCircuit.points, safetyCarMode, rainRiskMode, timelineSecs]);

  const ecuA = useMemo(() => getSimulatedLiveECU(progressVal, 0.0), [getSimulatedLiveECU, progressVal]);
  const ecuB = useMemo(() => getSimulatedLiveECU(progressVal, -0.065), [getSimulatedLiveECU, progressVal]); // trailing car chasing vehicle

  // Relative distance live sector margins math
  const currentLiveDelta = safetyCarMode ? "+1.450" : (0.248 + 0.08 * Math.cos(progressVal * Math.PI * 3.5)).toFixed(3);

  // Outcome probabilities reactive to degradation parameters
  const dynamicProbabilityA = safetyCarMode ? 64 : rainRiskMode ? 42 : Math.round(p1.winProbability);
  const dynamicProbabilityB = safetyCarMode ? 36 : rainRiskMode ? 58 : Math.round(p2.winProbability);

  const tyreLifeA = Math.max(10, Math.round(85 - tyreDegradationSim * 1.55));
  const tyreLifeB = Math.max(8, Math.round(79 - tyreDegradationSim * 1.35));

  // (layoutPathString removed — SVG rendering now handled by ReplayView.tsx)

  // Simulation export reports
  const triggerExportStrategy = () => {
    const reportData = {
      platform: "APEX-CTRL-TACTICAL-DECISION",
      timestamp: new Date().toISOString(),
      activeCircuit: activeCircuit.name,
      competitors: { lead: p1.fullName, challenger: p2.fullName },
      liveKinematics: { leadSpeed: `${ecuA.speed} KM/H`, challengerSpeed: `${ecuB.speed} KM/H`, gap: `${currentLiveDelta}s` },
      winProb: { [p1.code]: `${dynamicProbabilityA}%`, [p2.code]: `${dynamicProbabilityB}%` },
      strategyVerdict: `${p1.fullName} exhibits faster S2/S3 transitions. Maintain medium stint strategy.`
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `apex_intelligence_duel_${p1.code}_vs_${p2.code}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER ROW WITH THEME Badges ================= */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-slate-950/80 border border-[#1E293B] rounded-xl px-5 py-3 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 border border-slate-800 bg-[#060a13] text-gray-300 font-mono text-[10px] font-semibold px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE SESSION
          </span>
          <span className="text-white text-sm font-display font-black tracking-tight flex items-center gap-2">
            {activeCircuit.name} ({activeCircuit.country})
            <img 
              src={p1.flagUrl || "https://flagcdn.com/w40/us.png"} 
              alt="Country Flag" 
              className="w-4 h-2.5 object-cover rounded shadow-sm border border-slate-800" 
            />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* OPENF1 COMPOSER STATUS */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#09151c] border border-cyan-900/40 text-[#00D2BE] text-[10px] font-mono font-bold uppercase select-none">
            <Layers className="w-3.5 h-3.5 animate-pulse" />
            OPENF1 Connected
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1713] border border-emerald-900/40 text-emerald-400 text-[10px] font-mono font-bold uppercase select-none">
            <Sparkles className="w-3.5 h-3.5" />
            AI ENGINE ACTIVE
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#08122c] border border-[#1e293b] text-blue-400 text-[10px] font-mono font-bold uppercase select-none">
            <Activity className="w-3.5 h-3.5" />
            DATA STREAM LIVE
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-gray-300 text-[10px] font-mono font-bold uppercase select-none">
            <Gauge className="w-3.5 h-3.5 text-yellow-400" />
            SESSION TIME: <span className="text-white tracking-widest pl-0.5">01:28:47</span>
          </div>

          <span className="px-3 py-1 rounded bg-f1-red text-white text-[10px] font-display font-black tracking-wider uppercase select-none animate-pulse">
            ● LIVE
          </span>
        </div>
      </div>

      {/* ================= 1ST ROW: WEATHER & METRIC COCKPIT TILES (7 TILES) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Track Temp */}
        <div className="bg-[#040811] border border-[#1e293b]/70 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-md group transition-all">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>TRACK TEMP</span>
            <Thermometer className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-xl font-mono font-black text-rose-450">{trackTempSim.toFixed(1)}°C</span>
            <span className="text-[10px] text-gray-500 font-mono block">Dynamic Model</span>
          </div>
        </div>

        {/* Air Temp */}
        <div className="bg-[#040811] border border-[#1e293b]/70 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>AIR TEMP</span>
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-xl font-mono font-black text-slate-100">28.1°C</span>
            <span className="text-[10px] text-gray-500 font-mono block">Optimal Ambient</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-[#040811] border border-[#1e293b]/70 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>HUMIDITY</span>
            <Percent className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-xl font-mono font-black text-blue-300">62%</span>
            <span className="text-[10px] text-gray-500 font-mono block">No Dew Threat</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-[#040811] border border-[#1e293b]/70 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>WIND SPEED</span>
            <Wind className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-xl font-mono font-black text-slate-100">14 KM/H</span>
            <span className="text-[10px] text-gray-500 font-mono block">West Tailwind</span>
          </div>
        </div>

        {/* Track Status */}
        <div className="bg-[#040811]/90 border border-emerald-950 hover:border-emerald-900 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-550 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>TRACK STATUS</span>
            <Flag className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-black bg-emerald-950 text-emerald-400 block text-center uppercase tracking-wide">
              GREEN FLAG
            </span>
            <span className="text-[9px] text-gray-500 font-mono block mt-1">Clear Racing Area</span>
          </div>
        </div>

        {/* Current Lap */}
        <div className="bg-[#040811] border border-[#1e293b]/70 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>CURRENT LAP</span>
            <Compass className="w-3.5 h-3.5 text-[#00D2BE]" />
          </div>
          <div className="mt-2.5">
            <span className="text-xl font-mono font-black text-white">56 <span className="text-xs text-gray-500 font-normal">/ 57</span></span>
            <span className="text-[10px] text-gray-500 font-mono block">Kinematic Progress</span>
          </div>
        </div>

        {/* DRS Status */}
        <div className="bg-[#040811] border border-slate-900 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold select-none">
            <span>DRS STATUS</span>
            <Gauge className="w-3.5 h-3.5 text-[#00D2BE]" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-black bg-emerald-950/40 text-emerald-400 block text-center uppercase tracking-wide">
              DRS ENABLED
            </span>
            <span className="text-[9px] text-gray-500 font-mono block mt-1">S3 Attack Zones active</span>
          </div>
        </div>
      </div>

      {/* ================= 2ND ROW: HIGH-FIDELITY DRIVER BATTLE DUEL OVERVIEV ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch select-none">
        
        {/* DRIVER A: LEAD ATTACKER */}
        <div className="xl:col-span-4 bg-slate-950/80 border border-slate-800 hover:border-orange-500/50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-xl transition-all">
          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: p1.color }} />
          
          <div className="flex items-start justify-between">
            <div className="space-y-0.5 pl-2.5">
              <span className="text-[10px] font-mono tracking-widest font-black uppercase text-orange-400 bg-orange-950/30 px-2 py-0.5 rounded">
                {p1.team}
              </span>
              <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mt-1">
                {p1.fullName}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                P{p1.championshipPosition} in Championship | {p1.points} PTS
              </p>
            </div>
            <span className="text-5xl font-mono font-black italic text-slate-800/15">
              #{p1.number}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-900/60">
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>LIVE TELEMETRY SPEED</span>
                <span className="text-white font-extrabold font-mono">{ecuA.speed} KM/H</span>
              </div>
              <div className="w-full bg-[#0d1222] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-100" 
                  style={{ width: `${(ecuA.speed / 360) * 100}%`, backgroundColor: p1.color }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#00D2BE]">
                <span>BEST LAPTIME</span>
                <span>{p1.bestLap}s</span>
              </div>
            </div>

            {/* Portrait bounding box with custom accent overlay */}
            <div className="w-20 h-20 rounded-lg bg-gradient-to-t from-slate-950 to-slate-900 border border-slate-800 shrink-0 overflow-hidden relative flex items-end justify-center">
              <img 
                src={p1.portraitUrl} 
                alt={p1.fullName} 
                className="w-full h-full object-contain scale-110 translate-y-1" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://media.formula1.com/d_driver_fallback_image.png";
                }}
              />
            </div>
          </div>
        </div>

        {/* BATTLE MID DIVIDER AND LIVE DELTA TRACKER (4 COLUMNS WIDTH FOR AWESOME CENTER) */}
        <div className="xl:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950/50 to-slate-950/90 pointer-events-none" />
          
          <div className="z-10 w-full flex items-center justify-between px-2">
            <span className="text-[9px] font-mono text-gray-550 uppercase tracking-widest font-black">
              LIVE SPEED TRAP
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
              GAUGE TRACES OK
            </span>
          </div>

          <div className="z-10 my-3 flex flex-col items-center">
            <span className="font-display font-black text-rose-500 italic tracking-tighter text-sm drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
              VS
            </span>
            <div className="text-4xl font-mono font-black italic text-emerald-400 tracking-tighter drop-shadow-[0_0_12px_rgba(52,211,153,0.4)] my-1">
              -{currentLiveDelta}s
            </div>
            <span className="text-[10px] font-mono font-extrabold text-[#00D2BE] uppercase tracking-widest bg-cyan-950/30 px-3 py-0.5 rounded-full border border-cyan-800/20">
              INTER-DRIVER DELTA GAP
            </span>
          </div>

          <div className="z-10 w-full pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>S1 GAP INTRALUP</span>
            <span className="text-emerald-400 font-bold">-{currentLiveDelta}s</span>
          </div>
        </div>

        {/* DRIVER B: CHALLENGER */}
        <div className="xl:col-span-4 bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-xl transition-all">
          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: p2.color }} />
          
          <div className="flex items-start justify-between">
            <div className="space-y-0.5 pl-2.5">
              <span className="text-[10px] font-mono tracking-widest font-black uppercase text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded">
                {p2.team}
              </span>
              <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mt-1">
                {p2.fullName}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                P{p2.championshipPosition} in Championship | {p2.points} PTS
              </p>
            </div>
            <span className="text-5xl font-mono font-black italic text-slate-800/15">
              #{p2.number}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-900/60">
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>LIVE TELEMETRY SPEED</span>
                <span className="text-white font-extrabold font-mono">{ecuB.speed} KM/H</span>
              </div>
              <div className="w-full bg-[#0d1222] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-100" 
                  style={{ width: `${(ecuB.speed / 360) * 100}%`, backgroundColor: p2.color }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#00D2BE]">
                <span>BEST LAPTIME</span>
                <span>{p2.bestLap}s</span>
              </div>
            </div>

            <div className="w-20 h-20 rounded-lg bg-gradient-to-t from-slate-950 to-slate-900 border border-slate-800 shrink-0 overflow-hidden relative flex items-end justify-center">
              <img 
                src={p2.portraitUrl} 
                alt={p2.fullName} 
                className="w-full h-full object-contain scale-110 translate-y-1" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://media.formula1.com/d_driver_fallback_image.png";
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ================= DYNAMIC COMPETITOR DROPDOWNS DECK CONTROL ================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-f1-red/10 border border-f1-red/30">
            <Compass className="w-5 h-5 text-f1-red" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#00D2BE] uppercase tracking-widest font-black block">
              Race strategist telemetry dashboard
            </span>
            <h2 className="text-sm font-display font-black text-white uppercase tracking-tight">
              INTERACTIVE COMPETITOR DECK SELECTORS
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
          {/* Active Circuit Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Circuit Track:</span>
            <select
              value={sessionContext?.round || "Miami Grand Prix"}
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
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white uppercase font-mono font-bold tracking-wide focus:border-[#00D2BE] focus:outline-none"
            >
              {meetings && meetings.length > 0 ? (
                meetings.map((m) => {
                  const mName = m.meeting_name || `${m.location} Grand Prix`;
                  return (
                    <option key={m.meeting_key} value={mName}>
                      {m.location}
                    </option>
                  );
                })
              ) : (
                Object.keys(CIRCUITS).map((ck) => (
                  <option key={ck} value={ck}>
                    {ck.split(" ")[0]}
                  </option>
                ))
              )}
              {sessionContext?.round && meetings && !meetings.some(
                (m) => (m.meeting_name || `${m.location} Grand Prix`) === sessionContext.round
              ) && (
                <option value={sessionContext.round}>
                  {sessionContext.round.split(" ")[0]} (PRO)
                </option>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Adv A:</span>
            <select
              value={driverAId}
              onChange={(e) => {
                setDriverAId(e.target.value);
                if (e.target.value === driverBId) {
                  const safe = availableRoster.find((x) => x.code !== e.target.value) || null;
                  if (safe) setDriverBId(safe.code);
                }
              }}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white uppercase font-mono font-bold focus:border-[#00D2BE] focus:outline-none"
            >
              {availableRoster.map((d) => (
                <option key={d.code} value={d.code}>
                  #{d.number} {d.fullName}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-700 font-black text-xs font-mono">VS</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Challenger B:</span>
            <select
              value={driverBId}
              onChange={(e) => {
                setDriverBId(e.target.value);
                if (e.target.value === driverAId) {
                  const safe = availableRoster.find((x) => x.code !== e.target.value) || null;
                  if (safe) setDriverAId(safe.code);
                }
              }}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white uppercase font-mono font-bold focus:border-[#00D2BE] focus:outline-none"
            >
              {availableRoster.map((d) => (
                <option key={d.code} value={d.code}>
                  #{d.number} {d.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1.5 ml-auto">
            <button
              onClick={triggerExportStrategy}
              className="flex items-center gap-1.5 border border-slate-800 hover:border-[#00D2BE] bg-slate-950/50 text-xs px-3 py-1.5 rounded font-mono text-gray-400 hover:text-white transition-all cursor-pointer shadow"
            >
              <FileDown className="w-3.5 h-3.5" /> Export SDK Data
            </button>
            <button
              onClick={() => {
                setProgressVal(0.42);
                setTimelineSecs(5327);
                setSafetyCarMode(false);
                setRainRiskMode(false);
                setTrackTempSim(38.2);
                setTyreDegradationSim(14);
              }}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 3RD ROW: CINEMATIC 3D TRACK REPLAY VS AI STRATEGY CENTER ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (7 COLS): UPGRADED REPLAY — powered by ReplayView.tsx */}
        <div className="xl:col-span-7">
          <ReplayView
            drivers={propDrivers}
            activeCircuitKey={sessionContext?.round || "Miami Grand Prix"}
            compact
            meetings={meetings}
            onMeetingChange={onMeetingChange}
          />
        </div>

        {/* RIGHT COLUMN (5 COLS): AI COGNITION INTEL CENTER VIEW */}
        <div className="xl:col-span-5 bg-slate-950 border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            
            <div className="border-b border-[#1e293b]/70 pb-2.5 flex items-center justify-between">
              <span className="text-xs font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00D2BE] animate-spin" />
                AI RACE INTELLIGENCE SUMMARY
              </span>
              <span className="text-[9.5px] font-mono py-0.5 px-2 bg-cyan-950/30 text-[#00D2BE] rounded border border-cyan-900/30 font-bold uppercase select-none">
                DECISION PIPELINE ACTIVE
              </span>
            </div>

            {/* COMPARATIVE SPECS BLOCK FOR ACTIVE CHOSEN DRIVERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 select-none">
              
              {/* Driver A specs block */}
              <div className="p-3 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl space-y-3 relative overflow-hidden transition-all">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: p1.color }} />
                
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full border border-slate-850 bg-[#0c1221] overflow-hidden flex items-end justify-center relative">
                    <img src={p1.portraitUrl} alt={p1.fullName} className="w-full h-full object-contain scale-110 object-bottom" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono block uppercase font-bold" style={{ color: p1.color }}>
                      {p1.fullName.split(" ")[1] || p1.fullName}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">{p1.team}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono text-gray-550 block uppercase font-black">ADVANTAGES</span>
                  <div className="space-y-1">
                    {p1.advantages.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span className="truncate">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-90s/60 pt-2">
                  <span className="text-[8.5px] font-mono text-gray-550 block uppercase font-black">DISADVANTAGES</span>
                  <div className="space-y-1">
                    {p1.disadvantages.slice(0, 2).map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-rose-450 font-mono">
                        <span className="text-rose-500 font-bold">✗</span>
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center bg-[#070c14] px-2 py-1.5 rounded">
                  <span className="text-[9px] font-mono text-gray-400">WIN RISK CHANCE</span>
                  <span className="text-white font-mono font-extrabold text-[10px]">{dynamicProbabilityA}%</span>
                </div>
              </div>

              {/* Driver B specs block */}
              <div className="p-3 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl space-y-3 relative overflow-hidden transition-all">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: p2.color }} />
                
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full border border-slate-850 bg-[#0c1221] overflow-hidden flex items-end justify-center relative">
                    <img src={p2.portraitUrl} alt={p2.fullName} className="w-full h-full object-contain scale-110 object-bottom" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono block uppercase font-bold" style={{ color: p2.color }}>
                      {p2.fullName.split(" ")[1] || p2.fullName}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">{p2.team}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono text-gray-550 block uppercase font-black">ADVANTAGES</span>
                  <div className="space-y-1">
                    {p2.advantages.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span className="truncate">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-90s/60 pt-2">
                  <span className="text-[8.5px] font-mono text-gray-550 block uppercase font-black">DISADVANTAGES</span>
                  <div className="space-y-1">
                    {p2.disadvantages.slice(0, 2).map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-rose-450 font-mono">
                        <span className="text-rose-500 font-bold">✗</span>
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center bg-[#070c14] px-2 py-1.5 rounded">
                  <span className="text-[9px] font-mono text-gray-400">WIN RISK CHANCE</span>
                  <span className="text-white font-mono font-extrabold text-[10px]">{dynamicProbabilityB}%</span>
                </div>
              </div>

            </div>

            {/* SIMULATED SLIDER TWEAK METRIC INPUT BARS */}
            <div className="space-y-3 p-3.5 bg-slate-900/30 border border-slate-900 rounded-lg">
              <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold tracking-widest pb-1 border-b border-slate-900/80">
                REAL-TIME ENVIRONMENT PARAMETERS (MODELING TWEAKS)
              </span>

              {/* Temp adjust */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1 leading-none select-none">
                  <span>Track Surface Temp:</span>
                  <span className="text-white font-bold">{trackTempSim.toFixed(1)} °C</span>
                </div>
                <input 
                  type="range"
                  min="22"
                  max="50"
                  step="0.5"
                  value={trackTempSim}
                  onChange={(e) => setTrackTempSim(parseFloat(e.target.value))}
                  className="w-full bg-slate-850 roundedappearance-none h-1 cursor-pointer accent-[#00D2BE]"
                />
              </div>

              {/* Tyre wear adjust */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1 leading-none select-none">
                  <span>Tyre Grain Degradation:</span>
                  <span className="text-white font-bold">{tyreDegradationSim} laps stint</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="40"
                  value={tyreDegradationSim}
                  onChange={(e) => setTyreDegradationSim(parseInt(e.target.value))}
                  className="w-full bg-slate-850 roundedappearance-none h-1 cursor-pointer accent-[#00D2BE]"
                />
              </div>
            </div>

            {/* Split outcome chances progression */}
            <div className="space-y-1 select-none">
              <div className="flex justify-between font-mono text-[9px] text-gray-400">
                <span>{p1.code} COMPUTE WEIGHT: {dynamicProbabilityA}%</span>
                <span>{p2.code} COMPUTE WEIGHT: {dynamicProbabilityB}%</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full flex overflow-hidden">
                <div className="h-full transition-all duration-300" style={{ width: `${dynamicProbabilityA}%`, backgroundColor: p1.color }} />
                <div className="h-full transition-all duration-300" style={{ width: `${dynamicProbabilityB}%`, backgroundColor: p2.color }} />
              </div>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Decision engine active</span>
            <button
              onClick={onRefreshAi}
              disabled={isAiOptimizing}
              className="px-3.5 py-1.5 rounded bg-gradient-to-r from-red-950 to-slate-950 text-f1-red border border-red-900/60 hover:border-f1-red hover:text-white transition-all text-[10px] font-mono uppercase font-black cursor-pointer shadow flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-f1-red animate-pulse" />
              {isAiOptimizing ? "Optimizing..." : "RECALC STRATEGY"}
            </button>
          </div>

        </div>

      </div>

      {/* ================= 4TH ROW: 7-WIDGET ADAPTIVE BENTO METRICS BAR ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Fastest lap */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">FASTEST LAP</span>
          <div>
            <span className="text-base font-mono font-black text-rose-450 tracking-tight">{p1.bestLap}s</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-red-950/20 text-rose-400 font-mono rounded inline-block ml-1.5 uppercase font-bold text-[8px]">{p1.code}</span>
          </div>
        </div>

        {/* Top Speed */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">TOP SPEED</span>
          <div>
            <span className="text-base font-mono font-black text-white tracking-tight">{ecuA.speed}</span>
            <span className="text-[9px] text-[#00D2BE] font-mono font-bold pl-1.5">KM/H</span>
          </div>
        </div>

        {/* Average Speed */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">AVERAGE SPEED</span>
          <div>
            <span className="text-base font-mono font-black text-slate-100 tracking-tight">234</span>
            <span className="text-[9px] text-gray-400 font-mono font-bold pl-1.5">KM/H</span>
          </div>
        </div>

        {/* Best Sector */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">BEST SECTOR</span>
          <div>
            <span className="text-base font-mono font-black text-emerald-400 tracking-tight">27.456</span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold pl-1.5 block uppercase truncate">{p1.code} (S1)</span>
          </div>
        </div>

        {/* Tyre degradation */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">TYRE COMPOUND</span>
          <div>
            <span className="text-base font-mono font-black text-yellow-500 tracking-tight">MEDIUM</span>
            <span className="text-[9px] text-yellow-400 font-mono font-bold block">{tyreLifeA}% LIFE left</span>
          </div>
        </div>

        {/* Fuel Load */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">FUEL LOAD</span>
          <div>
            <span className="text-base font-mono font-black text-slate-100 tracking-tight">32.4</span>
            <span className="text-[9px] text-gray-500 font-mono font-bold pl-1.5">KG</span>
          </div>
        </div>

        {/* DRS Efficiency */}
        <div className="bg-[#050811] border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-20 shadow-md transition-all">
          <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-extrabold block">DRS EFFICIENCY</span>
          <div>
            <span className="text-base font-mono font-black text-[#00D2BE] tracking-tight">89%</span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold block uppercase">HIGH</span>
          </div>
        </div>
      </div>

      {/* ================= 5TH ROW: DIAGNOSTIC SECTOR OVERLAYS AND STATIC ANALYTICAL GRAPHS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch select-none">
        
        {/* PANEL 1: TELEMETRY ANALYSIS GRAPH CHANNELS */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-display font-medium text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#00D2BE]" />
              TELEMETRY ANALYSIS
            </span>
            <div className="flex gap-2 font-mono text-[9px] text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p1.color }} />
                {p1.code}
              </span>
              <span>VS</span>
              <span className="font-bold flex items-center gap-1 border-b border-dashed border-rose-500 pb-0.5">
                <span className="w-1.5 h-1.5 rounded-dashed rounded-full" style={{ backgroundColor: p2.color }} />
                {p2.code}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Speed overlay */}
            <div>
              <div className="flex justify-between items-center font-mono text-[9.5px] text-gray-550 mb-1 leading-none">
                <span>SPEED INTERCEPT OVERLAY (KM/H)</span>
                <span>MAX 341 KM/H</span>
              </div>
              <div className="h-28 w-full bg-slate-950/60 border-l border-b border-slate-850 relative p-1.5 overflow-hidden rounded-r">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#1c253c" strokeDasharray="3" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#1c253c" strokeDasharray="3" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#1c253c" strokeDasharray="3" strokeWidth="0.5" />
                  
                  {/* Attacking lead speed spline */}
                  <path
                    d="M 0,80 C 15,22 30,55 50,68 T 80,12 T 100,5"
                    fill="none"
                    stroke={p1.color}
                    strokeWidth="2.5"
                    style={{ filter: `drop-shadow(0 0 3px ${p1.color}40)` }}
                  />
                  {/* Defending chasing speed spline */}
                  <path
                    d="M 0,85 C 15,25 31,58 48,70 T 78,16 T 100,8"
                    fill="none"
                    stroke={p2.color}
                    strokeWidth="2.5"
                    strokeDasharray="1.5 1.5"
                  />
                </svg>
                <span className="absolute left-1.5 top-1 font-mono text-[8px] text-gray-500 font-semibold">350</span>
                <span className="absolute left-1.5 bottom-1 font-mono text-[8px] text-gray-500 font-semibold">0</span>
              </div>
            </div>

            {/* Throttle pressure overlay */}
            <div>
              <div className="flex justify-between items-center font-mono text-[9.5px] text-gray-550 mb-1 leading-none">
                <span>THROTTLE POSITION INDEX (%)</span>
              </div>
              <div className="h-24 w-full bg-slate-950/60 border-l border-b border-slate-850 relative p-1.5 overflow-hidden rounded-r">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 0,10 L 15,10 L 25,95 L 45,95 L 60,10 L 80,10 L 100,95"
                    fill="none"
                    stroke={p1.color}
                    strokeWidth="2.2"
                  />
                  <path
                    d="M 0,15 L 14,15 L 24,92 L 44,92 L 59,15 L 79,15 L 100,92"
                    fill="none"
                    stroke={p2.color}
                    strokeWidth="2.2"
                    strokeDasharray="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: HISTORICAL LAP TIME PROGRESSION COMPARISON */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-display font-medium text-white uppercase tracking-wider flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-[#00D2BE]" />
              LAP TIME COMPARISON
            </span>
            <span className="text-[9px] font-mono text-gray-500 tracking-wider uppercase font-black">LAPS 10 - 60</span>
          </div>

          {/* Time Progression Lines chart */}
          <div className="h-56 w-full bg-slate-950/60 border-l border-b border-slate-850 relative p-1.5 overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="200" y2="20" stroke="#1c253c" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="50" x2="200" y2="50" stroke="#1c253c" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="80" x2="200" y2="80" stroke="#1c253c" strokeWidth="0.5" strokeDasharray="3" />
              
              {/* Driver A timings */}
              <path
                d="M 10,48 L 30,32 L 50,56 L 70,42 L 95,27 L 120,53 L 145,22 L 170,27 L 190,16"
                fill="none"
                stroke={p1.color}
                strokeWidth="2.5"
                style={{ filter: `drop-shadow(0 0 4px ${p1.color}35)` }}
              />
              {/* Driver B timings */}
              <path
                d="M 10,51 L 30,37 L 50,50 L 70,47 L 95,32 L 120,43 L 145,37 L 170,38 L 190,24"
                fill="none"
                stroke={p2.color}
                strokeWidth="2.5"
                strokeDasharray="2"
              />

              {/* Data Knobs dots */}
              {[{x: 10, y: 48}, {x: 95, y: 27}, {x: 190, y: 16}].map((p, i) => (
                <circle key={`da-${i}`} cx={p.x} cy={p.y} r="3.5" style={{ fill: p1.color }} className="stroke-white stroke-0.5" />
              ))}
              {[{x: 10, y: 51}, {x: 95, y: 32}, {x: 190, y: 24}].map((p, i) => (
                <circle key={`db-${i}`} cx={p.x} cy={p.y} r="3.5" style={{ fill: p2.color }} className="stroke-white stroke-0.5" />
              ))}
            </svg>
            
            <span className="absolute left-1.5 top-1.5 font-mono text-[8px] text-gray-500 font-extrabold">1:26.0s</span>
            <span className="absolute left-1.5 bottom-1.5 font-mono text-[8px] text-gray-500 font-extrabold">1:29.5s</span>
            <span className="absolute right-2 bottom-1.5 font-mono text-[8px] text-gray-500">Lap 60</span>
          </div>

          <p className="p-3 bg-[#050914] border border-slate-900 rounded-lg text-[10px] font-mono text-gray-400">
            Sector 1 is dominated by <span className="font-extrabold uppercase text-white" style={{ color: p1.color }}>{p1.code}</span> while Sector 2 remains stable under <span className="font-extrabold uppercase text-white" style={{ color: p2.color }}>{p2.code}</span>.
          </p>
        </div>

        {/* PANEL 3: TACTICAL METRIC CHECKLIST & WIREFRAME RACER ENGINE VECTOR */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-xs font-display font-medium text-white uppercase tracking-wider flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-[#00D2BE]" />
                AI STRATEGIST SUMMARY
              </span>
              <span className="text-[9.5px] font-mono text-gray-500">COGNITION RUNNING</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono select-none">
              <div className="flex items-center justify-between py-1 border-b border-[#12182c]">
                <span className="text-gray-500 font-medium">Tire Performance:</span>
                <span className="text-emerald-400 font-extrabold">STABLE</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#12182c]">
                <span className="text-gray-500 font-medium">Degradation Rate:</span>
                <span className="text-amber-400 font-extrabold">MEDIUM (Wear rating: {tyreDegradationSim})</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#12182c]">
                <span className="text-gray-500 font-medium">Ideal Pit Window:</span>
                <span className="text-[#00D2BE] font-extrabold">Lap 37 - 40</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#12182c]">
                <span className="text-gray-500 font-medium">Win Probability:</span>
                <span className="text-[#00D2BE] font-extrabold">{dynamicProbabilityA}% {p1.code}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#12182c]">
                <span className="text-gray-500 font-medium">Aggression Index:</span>
                <span className="text-white font-extrabold">81 / 100</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#12182c]">
                <span className="text-gray-500 font-medium">Consistency Score:</span>
                <span className="text-white font-extrabold">88 / 100</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 font-medium">Race Prediction:</span>
                <span className="text-[#00D2BE] font-extrabold font-black uppercase">{p1.code} WINS</span>
              </div>
            </div>

            {/* NEON RACING WIREFRAME CAR ILLUSTRATION */}
            <div className="h-16 w-full rounded border border-dashed border-[#00d2be]/30 bg-[#0a1b24]/10 flex flex-col items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full opacity-60 absolute inset-0" viewBox="0 0 200 50" preserveAspectRatio="none">
                <path 
                  d="M 5,30 Q 30,10 65,30 T 135,30 T 195,30" 
                  fill="none" 
                  stroke="#00D2BE" 
                  strokeWidth="1.5" 
                  className="stroke-cyan-400 opacity-60 shadow-lg" 
                  strokeDasharray="2 1" 
                />
                <circle cx="45" cy="35" r="7" fill="none" stroke="#00D2BE" strokeWidth="1.5" />
                <circle cx="45" cy="35" r="3" fill="#00D2BE" />
                
                <circle cx="155" cy="35" r="7" fill="none" stroke="#00D2BE" strokeWidth="1.5" />
                <circle cx="155" cy="35" r="3" fill="#00D2BE" />
                
                <path d="M 65,30 L 135,30 L 125,18 L 85,18 Z" fill="none" stroke="#00D2BE" strokeWidth="1" />
                <line x1="8" y1="30" x2="35" y2="30" stroke="#FF5D5D" strokeWidth="2" strokeDasharray="2" />
              </svg>
              <span className="text-[8.5px] font-mono text-cyan-300 uppercase tracking-widest font-black relative z-10 select-none">
                🏎 Kinetic Wireframe Render Active
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
