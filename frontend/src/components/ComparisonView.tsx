import { useState, useEffect } from "react";
import { DriverState } from "../types";
import {
  GitCompare,
  Zap,
  Gauge,
  TrendingUp,
  Cpu,
  RefreshCw,
  Trophy,
  AlertTriangle,
  Disc,
  Activity,
  Flame,
  ArrowRight
} from "lucide-react";

interface ComparisonViewProps {
  drivers?: DriverState[];
  sessionKey?: string;
}

export default function ComparisonView({ drivers = [], sessionKey }: ComparisonViewProps) {
  const [driverAId, setDriverAId] = useState("NOR");
  const [driverBId, setDriverBId] = useState("VER");

  const driversKey = drivers.map(d => d.code).join(",");

  // Automatically update driver A & B when new session drivers are loaded (Issue #9)
  useEffect(() => {
    if (drivers.length >= 2) {
      setDriverAId(drivers[0].code);
      setDriverBId(drivers[1].code);
    } else if (drivers.length === 1) {
      setDriverAId(drivers[0].code);
    }
  }, [driversKey]);

  const [simTime, setSimTime] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const p1 = drivers.find((d) => d.code === driverAId) || drivers[0] || null;
  const p2 = drivers.find((d) => d.code === driverBId) || drivers[1] || null;

  // Dynamic ticking values to create Mercedes AGM Mission Control "live telemetry" vibe
  useEffect(() => {
    const interval = setInterval(() => {
      setSimTime((t) => t + 1);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const jitter = Math.sin(simTime * 0.3) * 2.8;
  const currSpeedA = Math.max(100, Math.round(318 + jitter));
  const currSpeedB = Math.max(100, Math.round(323 - jitter));

  const throttleA = Math.round(92 + Math.sin(simTime * 0.5) * 6);
  const throttleB = Math.round(94 + Math.cos(simTime * 0.5) * 5);

  const tyreLifeA = Math.max(10, Math.round(78 - (simTime % 25) * 0.45));
  const tyreLifeB = Math.max(10, Math.round(62 - (simTime % 25) * 0.35));

  // Sector splits calculation
  const s1A = 27.456, s1B = 27.490;
  const s2A = 36.511, s2B = 36.218;
  const s3A = 23.843, s3B = 24.217;

  const totalA = s1A + s2A + s3A;
  const totalB = s1B + s2B + s3B;
  const lapDelta = (totalA - totalB).toFixed(3);

  const triggerMetricRecalc = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="bg-slate-950 border border-[#1E293B] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-4 h-4 text-f1-red animate-pulse" />
            <span className="text-[10px] font-mono text-f1-red uppercase tracking-widest font-black">
              AWS Race Analytics Platform Link
            </span>
          </div>
          <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
            MISSION DUEL COMPETE CENTER
          </h2>
          <span className="text-xs text-gray-400 font-mono block mt-1">
            Compare wheel-to-wheel speed traces, sector telemetry differences, and strategy risk limits
          </span>
        </div>

        {/* Dynamic drop selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="comp-driver-a-select"
            value={driverAId}
            onChange={(e) => {
              setDriverAId(e.target.value);
              triggerMetricRecalc();
            }}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-cyan-400"
          >
            {drivers.map((d) => (
              <option key={d.code} value={d.code}>
                #{d.number} {d.fullName}
              </option>
            ))}
          </select>

          <span className="text-xs font-mono text-slate-500 font-bold dark:text-slate-400">VS</span>

          <select
            id="comp-driver-b-select"
            value={driverBId}
            onChange={(e) => {
              setDriverBId(e.target.value);
              triggerMetricRecalc();
            }}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-cyan-400"
          >
            {drivers.map((d) => (
              <option key={d.code} value={d.code}>
                #{d.number} {d.fullName}
              </option>
            ))}
          </select>

          <button
            id="btn-sync-comparisons"
            onClick={triggerMetricRecalc}
            className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-cyan-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* CORE VS COMPETE HEAD-TO-HEAD BENTOS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* DRIVER PROFILE A PANEL */}
        <div className="xl:col-span-4 bg-slate-950 border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: p1.color }} />
          
          <div className="space-y-4">
            <div className="flex justify-between items-start pl-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: p1.color, backgroundColor: `${p1.color}15` }}>
                  {p1.team}
                </span>
                <h3 className="text-2xl font-display font-black text-white uppercase italic tracking-tight mt-1">
                  {p1.fullName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <img src={p1.flagUrl} alt="Nation" className="w-5 h-3 object-contain rounded" />
                  <span>{p1.nationality}</span>
                </div>
              </div>
              <span className="text-4xl font-mono font-black italic text-slate-800 select-none opacity-30">
                #{p1.number}
              </span>
            </div>

            {/* Portraits */}
            <div className="h-44 bg-gradient-to-t from-slate-950 to-[#0c0f1d] rounded-lg border border-slate-900/60 overflow-hidden flex items-end justify-center relative">
              <img 
                src={p1.portraitUrl} 
                alt={p1.fullName} 
                className="w-40 h-40 object-contain object-bottom scale-110 translate-y-1" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://media.formula1.com/d_driver_fallback_image.png";
                }}
              />
              <div className="absolute top-3 right-3 text-[10px] font-mono text-gray-500 font-bold uppercase select-none">
                P{p1.championshipPosition} STANDINGS
              </div>
            </div>

            {/* Performance facts */}
            <div className="space-y-3 font-mono text-xs pl-2 pt-1">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Fastest lap</span>
                <span className="text-white font-bold">{p1.bestLap}s</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Championship points</span>
                <span className="text-[#00D2BE] font-bold">{p1.points} PTS</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 pl-2">
            <span className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Key advantage indicators</span>
            <div className="flex flex-wrap gap-1">
              {p1.advantages.map((adv, idx) => (
                <span key={idx} className="text-[9px] font-mono bg-slate-900 border border-slate-850 text-emerald-400 px-2 py-0.5 rounded">
                  ✓ {adv}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COMPARATIVE TELEMETRY CORE (4 COLUMNS WIDTH) */}
        <div className="xl:col-span-4 bg-slate-950 border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between shadow-2xl text-center space-y-6">
          
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-black">
              LIVE LAP TIMING DELTA
            </span>
            <div className="text-4xl font-mono font-black italic text-emerald-400 tracking-tighter my-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              {parseFloat(lapDelta) <= 0 ? `${lapDelta}s` : `+${lapDelta}s`}
            </div>
            <span className="px-3 py-1 bg-emerald-950/40 text-emerald-300 font-mono text-[10px] rounded-full border border-emerald-900/30 font-bold tracking-wider inline-block">
              {parseFloat(lapDelta) <= 0 ? `${p1.code} LEAD PACING` : `${p2.code} LEAD PACING`}
            </span>
          </div>

          {/* Graphical Speed compare charts */}
          <div className="space-y-4">
            <span className="text-[9.5px] font-mono text-slate-500 block uppercase font-bold text-left pl-1">
              REAL-TIME SPEED TRACE OVERLAY
            </span>
            
            {/* Speedometer telemetry overlays */}
            <div className="space-y-3.5 pl-1 text-left">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-400 uppercase font-bold">{p1.code} Trace</span>
                  <span className="text-white font-extrabold">{currSpeedA} KM/H</span>
                </div>
                <div className="w-full bg-[#0a0f20] h-2 rounded overflow-hidden relative">
                  <div className="h-full rounded transition-all duration-150" style={{ width: `${(currSpeedA / 360) * 100}%`, backgroundColor: p1.color }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-400 uppercase font-bold">{p2.code} Trace</span>
                  <span className="text-white font-extrabold">{currSpeedB} KM/H</span>
                </div>
                <div className="w-full bg-[#0a0f20] h-2 rounded overflow-hidden relative">
                  <div className="h-full rounded transition-all duration-150" style={{ width: `${(currSpeedB / 360) * 100}%`, backgroundColor: p2.color }} />
                </div>
              </div>
            </div>
          </div>

          {/* Win probability comparisons donut wheel representation */}
          <div className="pt-4 border-t border-slate-900 flex justify-around items-center">
            
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full origin-center -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0e1227" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke={p1.color} strokeWidth="3" strokeDasharray={`${p1.winProbability} ${100 - p1.winProbability}`} />
                </svg>
                <span className="absolute font-mono text-xs font-black text-white">{p1.winProbability}%</span>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase">{p1.code} Win Chance</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full origin-center -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0e1227" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke={p2.color} strokeWidth="3" strokeDasharray={`${p2.winProbability} ${100 - p2.winProbability}`} />
                </svg>
                <span className="absolute font-mono text-xs font-black text-white">{p2.winProbability}%</span>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase">{p2.code} Win Chance</span>
            </div>

          </div>

        </div>

        {/* DRIVER PROFILE B PANEL */}
        <div className="xl:col-span-4 bg-slate-950 border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: p2.color }} />
          
          <div className="space-y-4">
            <div className="flex justify-between items-start pl-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: p2.color, backgroundColor: `${p2.color}15` }}>
                  {p2.team}
                </span>
                <h3 className="text-2xl font-display font-black text-white uppercase italic tracking-tight mt-1">
                  {p2.fullName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <img src={p2.flagUrl} alt="Nation" className="w-5 h-3 object-contain rounded" />
                  <span>{p2.nationality}</span>
                </div>
              </div>
              <span className="text-4xl font-mono font-black italic text-slate-800 select-none opacity-30">
                #{p2.number}
              </span>
            </div>

            {/* Portraits */}
            <div className="h-44 bg-gradient-to-t from-slate-950 to-[#0c0f1d] rounded-lg border border-slate-900/60 overflow-hidden flex items-end justify-center relative">
              <img 
                src={p2.portraitUrl} 
                alt={p2.fullName} 
                className="w-40 h-40 object-contain object-bottom scale-110 translate-y-1" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://media.formula1.com/d_driver_fallback_image.png";
                }}
              />
              <div className="absolute top-3 right-3 text-[10px] font-mono text-gray-500 font-bold uppercase select-none">
                P{p2.championshipPosition} STANDINGS
              </div>
            </div>

            {/* Performance facts */}
            <div className="space-y-3 font-mono text-xs pl-2 pt-1">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Fastest lap</span>
                <span className="text-white font-bold">{p2.bestLap}s</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Championship points</span>
                <span className="text-[#00D2BE] font-bold">{p2.points} PTS</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 pl-2">
            <span className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Key advantage indicators</span>
            <div className="flex flex-wrap gap-1">
              {p2.advantages.map((adv, idx) => (
                <span key={idx} className="text-[9px] font-mono bg-slate-900 border border-slate-850 text-cyan-400 px-2 py-0.5 rounded">
                  ✓ {adv}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED SPEED / GEOMETRIC SECTOR BAR GRAPH COMPETE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTOR SPLITS DELTAS */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-display font-black text-white uppercase tracking-tight">
            SECTOR-BY-SECTOR TIME PROGRESSION
          </h3>
          
          <div className="space-y-3 font-mono text-xs">
            {/* Sector 1 */}
            <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-lg space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>SECTOR 1 (ACCELERATION ZONE)</span>
                <span className="text-emerald-400 font-bold">-{Math.abs(s1A - s1B).toFixed(3)}s ({p1.code} Advantage)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{p1.code}:: {s1A}s</span>
                <div className="flex-1 bg-slate-900 h-2.5 rounded overflow-hidden flex">
                  <div className="bg-emerald-500 h-full rounded-l" style={{ width: "48%" }} />
                  <div className="bg-slate-800 h-full w-[2%]" />
                  <div className="bg-red-500 h-full rounded-r" style={{ width: "50%" }} />
                </div>
                <span className="text-gray-500">{p2.code}:: {s1B}s</span>
              </div>
            </div>

            {/* Sector 2 */}
            <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-lg space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>SECTOR 2 (TECHNICAL CURVES)</span>
                <span className="text-cyan-400 font-bold">-{Math.abs(s2B - s2A).toFixed(3)}s ({p2.code} Advantage)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{p1.code}:: {s2A}s</span>
                <div className="flex-1 bg-slate-900 h-2.5 rounded overflow-hidden flex">
                  <div className="bg-emerald-500 h-full rounded-l" style={{ width: "52%" }} />
                  <div className="bg-slate-800 h-full w-[2%]" />
                  <div className="bg-cyan-500 h-full rounded-r" style={{ width: "46%" }} />
                </div>
                <span className="text-gray-500">{p2.code}:: {s2B}s</span>
              </div>
            </div>

            {/* Sector 3 */}
            <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-lg space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>SECTOR 3 (CHICANE ENTRY TRACK)</span>
                <span className="text-emerald-400 font-bold">-{Math.abs(s3A - s3B).toFixed(3)}s ({p1.code} Advantage)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{p1.code}:: {s3A}s</span>
                <div className="flex-1 bg-slate-900 h-2.5 rounded overflow-hidden flex">
                  <div className="bg-emerald-500 h-full rounded-l" style={{ width: "45%" }} />
                  <div className="bg-slate-800 h-full w-[2%]" />
                  <div className="bg-red-500 h-full rounded-r" style={{ width: "53%" }} />
                </div>
                <span className="text-gray-500">{p2.code}:: {s3B}s</span>
              </div>
            </div>

          </div>
        </div>

        {/* COGNITIVE TYRE PERFORMANCE RATIO */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-black text-white uppercase tracking-tight mb-4">
              TYRE DEGRADATION & LIFE RATIOS
            </h3>
            
            <div className="space-y-4 font-mono text-xs">
              
              {/* Product A Tyre */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Disc className="w-4 h-4 text-yellow-500 animate-[spin_8s_linear_infinite]" />
                    {p1.code} Compound degradation (Medium)
                  </span>
                  <span className="text-white font-extrabold">{tyreLifeA}% life left</span>
                </div>
                <div className="w-full bg-[#0a0f1d] h-3 rounded overflow-hidden">
                  <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${tyreLifeA}%` }} />
                </div>
              </div>

              {/* Product B Tyre */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Disc className="w-4 h-4 text-slate-300 animate-[spin_10s_linear_infinite]" />
                    {p2.code} Compound degradation (Hard)
                  </span>
                  <span className="text-white font-extrabold">{tyreLifeB}% life left</span>
                </div>
                <div className="w-full bg-[#0a0f1d] h-3 rounded overflow-hidden">
                  <div className="h-full bg-slate-400 transition-all duration-300" style={{ width: `${tyreLifeB}%` }} />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 mt-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">STRATEGIC PREDICTION OVERVIEW</span>
            <p className="text-xs font-mono text-slate-400 leading-normal">
              Based on degradation traces, {p2.code}'s Hard compound is projected to reach its performance peak on telemetry inside Lap 41, creating a powerful undercut opening over {p1.code}.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
