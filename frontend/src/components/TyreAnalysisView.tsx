import { useState, useEffect } from "react";
import { Disc, TrendingUp, Info } from "lucide-react";
import { DriverState } from "../types";

interface TyreAnalysisViewProps {
  sessionKey?: string;
  drivers?: DriverState[];
}

export default function TyreAnalysisView({ sessionKey, drivers = [] }: TyreAnalysisViewProps) {
  const [selectedCompound, setSelectedCompound] = useState<"SOFT" | "MEDIUM" | "HARD">("MEDIUM");
  const [selectedDriverCode, setSelectedDriverCode] = useState<string>("NOR");

  const driversKey = drivers.map(d => d.code).join(",");

  // Synchronize driver code selection with active session roster (Issue #9)
  useEffect(() => {
    if (drivers.length > 0) {
      setSelectedDriverCode(drivers[0].code);
    }
  }, [driversKey]);

  const activeDriverObj = drivers.find((d) => d.code === selectedDriverCode) || null;

  // Sync selected compound automatically with the selected driver's active tyre
  useEffect(() => {
    if (activeDriverObj?.tyreCompound) {
      const comp = activeDriverObj.tyreCompound.toUpperCase();
      if (comp.includes("SOFT") || comp === "S") setSelectedCompound("SOFT");
      else if (comp.includes("HARD") || comp === "H") setSelectedCompound("HARD");
      else setSelectedCompound("MEDIUM");
    }
  }, [activeDriverObj?.tyreCompound]);

  const compoundData = {
    SOFT: { wearSpeed: "High", optimalWindow: "15 - 22 laps", grip: "Maximum (9/10)" },
    MEDIUM: { wearSpeed: "Moderate", optimalWindow: "25 - 34 laps", grip: "Very High (8/10)" },
    HARD: { wearSpeed: "Low / Linear", optimalWindow: "38 - 50 laps", grip: "Consistent (6/10)" },
  }[selectedCompound];

  return (
    <div className="bg-slate-950 border border-[#1E293B] rounded-xl p-6 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
            TYRE DEGRADATION ENGINE
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            Model tyre wear curves, graining limits, and strategic thermal limits
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-slate-500">ACTIVE DRIVER:</span>
          <select
            id="tyre-driver-sel"
            value={selectedDriverCode}
            onChange={(e) => setSelectedDriverCode(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
          >
            {drivers.map((d) => (
              <option key={d.code} value={d.code}>
                #{d.number} {d.code} ({d.tyreCompound || "M"})
              </option>
            ))}
          </select>

          <span className="text-xs font-mono text-slate-500">|</span>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg">
            {(["SOFT", "MEDIUM", "HARD"] as const).map((comp) => {
              const displayColor =
                comp === "SOFT"
                  ? "border-red-500 text-red-500"
                  : comp === "MEDIUM"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-slate-300 text-slate-300";

              return (
                <button
                  id={`btn-tyre-sel-${comp}`}
                  key={comp}
                  onClick={() => setSelectedCompound(comp)}
                  className={`px-3 py-1 rounded text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCompound === comp
                      ? "bg-slate-800 border " + displayColor
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Driver current compound live state indicator */}
      {activeDriverObj && (
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Disc className="w-8 h-8 animate-spin" style={{ color: activeDriverObj.color, animationDuration: "3s" }} />
            <div>
              <span className="text-xs font-mono text-slate-400 block uppercase">
                Active Compound on car #{activeDriverObj.number}
              </span>
              <span className="text-sm font-display font-bold text-white uppercase">
                {activeDriverObj.fullName} - {activeDriverObj.tyreCompound || "MEDIUM"} COMPOUND
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block uppercase">ESTIMATED TYRE LIFE</span>
            <span className="text-lg font-mono font-black" style={{ color: activeDriverObj.color }}>
              {activeDriverObj.tyreLife}%
            </span>
          </div>
        </div>
      )}

      {/* Degradation details block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Wear Rate Graining Risk</span>
          <span className="text-lg font-mono font-bold text-white uppercase">{compoundData.wearSpeed}</span>
          <span className="text-[10px] font-mono text-[#00D2BE] block mt-1">Graining under thermal spikes</span>
        </div>

        <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Target Lifespan Window</span>
          <span className="text-lg font-mono font-bold text-white uppercase">{compoundData.optimalWindow}</span>
          <span className="text-[10px] font-mono text-cyan-400 block mt-1">Based on telemetry models</span>
        </div>

        <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Starting Grip Coefficient</span>
          <span className="text-lg font-mono font-bold text-white uppercase">{compoundData.grip}</span>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">Thermal stable performance</span>
        </div>
      </div>

      {/* Degradation Graph Curve */}
      <div className="p-4 bg-slate-900/10 border border-slate-800 rounded-xl">
        <span className="text-xs font-mono text-gray-400 block mb-3 uppercase tracking-wider font-bold">
          Degradation and Wear Rate Modeling Curve (%)
        </span>
        <div className="h-44 bg-slate-950 border border-slate-900 relative rounded-xl flex items-center justify-center p-2">
          <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid guides */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />

            {/* Wear Curve for selected compound */}
            {selectedCompound === "SOFT" && (
              <path d="M 0,10 C 50,15 100,50 150,75 C 200,85 250,95 300,98" fill="none" stroke="#EF4444" strokeWidth="2" />
            )}
            {selectedCompound === "MEDIUM" && (
              <path d="M 0,10 C 50,12 100,35 150,55 C 200,68 250,75 300,85" fill="none" stroke="#F59E0B" strokeWidth="2" />
            )}
            {selectedCompound === "HARD" && (
              <path d="M 0,10 C 50,10 100,20 150,35 C 200,45 250,52 300,60" fill="none" stroke="#94A3B8" strokeWidth="2" />
            )}
          </svg>
          <span className="absolute left-2 top-2 text-[8px] font-mono text-gray-500">100% Brand New Tyre</span>
          <span className="absolute left-2 bottom-2 text-[8px] font-mono text-gray-500">0% Critical Graining</span>
          <span className="absolute right-2 bottom-2 text-[8px] font-mono text-gray-500">Lap Count (0 - 55 Laps)</span>
        </div>
      </div>
    </div>
  );
}
