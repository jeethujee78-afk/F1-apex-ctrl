import { useState, useEffect, useMemo } from "react";
import { Radio, Activity, RefreshCw } from "lucide-react";
import { DriverState } from "../types";
import { fetchCarTelemetry } from "../services/openf1";

interface TelemetryViewProps {
  drivers?: DriverState[];
  sessionKey?: string;
}

export default function TelemetryView({ drivers = [], sessionKey = "9522" }: TelemetryViewProps) {
  const [selectedDriver1, setSelectedDriver1] = useState("NOR");
  const [selectedDriver2, setSelectedDriver2] = useState("VER");
  const [loading, setLoading] = useState(false);
  
  const [telemetry1, setTelemetry1] = useState<any[]>([]);
  const [telemetry2, setTelemetry2] = useState<any[]>([]);

  const driversKey = drivers.map(d => d.code).join(",");

  // Auto-align selected drivers with session changes (Issue #9)
  useEffect(() => {
    if (drivers && drivers.length > 0) {
      const codeA = drivers[0].code;
      const codeB = drivers[1]?.code || drivers[0].code;
      setSelectedDriver1(codeA);
      setSelectedDriver2(codeB);
    }
  }, [driversKey, sessionKey]);

  // Fetch telemetry dynamically when selected drivers or session changes (Issue #9)
  useEffect(() => {
    let active = true;
    const loadTelemetry = async () => {
      setLoading(true);
      try {
        const dA = drivers.find(d => d.code === selectedDriver1);
        const dB = drivers.find(d => d.code === selectedDriver2);

        const numA = dA?.number || 4;
        const numB = dB?.number || 1;
        const colA = dA?.color?.replace("#", "") || "FF8000";
        const colB = dB?.color?.replace("#", "") || "3671C6";

        const [telA, telB] = await Promise.all([
          fetchCarTelemetry(sessionKey, numA, colA),
          fetchCarTelemetry(sessionKey, numB, colB)
        ]);

        if (!active) return;
        setTelemetry1(telA || []);
        setTelemetry2(telB || []);
      } catch (err) {
        console.error("Telemetry loading failed:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTelemetry();

    return () => {
      active = false;
    };
  }, [selectedDriver1, selectedDriver2, sessionKey, driversKey]);

  const activeDriverAObj = drivers.find(d => d.code === selectedDriver1) || null;
  const activeDriverBObj = drivers.find(d => d.code === selectedDriver2) || null;

  // Clean, validate and sort telemetry datasets to avoid rendering failures
  const cleanedTelemetry1 = useMemo(() => {
    if (!telemetry1 || telemetry1.length === 0) return [];
    return telemetry1
      .filter((d: any) => d && d.date && !isNaN(Number(d.speed)) && !isNaN(Number(d.throttle)) && !isNaN(Number(d.brake)))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((d: any, idx: number, arr: any[]) => idx === 0 || d.date !== arr[idx - 1].date);
  }, [telemetry1]);

  const cleanedTelemetry2 = useMemo(() => {
    if (!telemetry2 || telemetry2.length === 0) return [];
    return telemetry2
      .filter((d: any) => d && d.date && !isNaN(Number(d.speed)) && !isNaN(Number(d.throttle)) && !isNaN(Number(d.brake)))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((d: any, idx: number, arr: any[]) => idx === 0 || d.date !== arr[idx - 1].date);
  }, [telemetry2]);

  // Adaptive Speed Scale Calculation for comparable overlay plotting
  const speedBounds = useMemo(() => {
    const allSpeeds = [
      ...cleanedTelemetry1.map((d: any) => Number(d.speed)),
      ...cleanedTelemetry2.map((d: any) => Number(d.speed))
    ].filter(v => !isNaN(v));

    if (allSpeeds.length === 0) {
      return { min: 70, max: 345 };
    }

    let min = Math.min(...allSpeeds);
    let max = Math.max(...allSpeeds);

    // Prevent identical bounds / collapsed vertical line crashes
    if (min === max) {
      min = Math.max(0, min - 20);
      max = max + 20;
    }

    // Add 5% padding so curves don't clip at top/bottom extremes
    const padding = (max - min) * 0.05 || 10;
    return {
      min: Math.max(0, Math.floor(min - padding)),
      max: Math.ceil(max + padding)
    };
  }, [cleanedTelemetry1, cleanedTelemetry2]);

  const hasTelemetry = cleanedTelemetry1.length > 0 || cleanedTelemetry2.length > 0;

  // Custom SVG path generator with robust data safety and scaling checks
  function generateSvgPath(data: any[], key: "speed" | "throttle" | "brake" | "rpm", maxVal: number, minVal: number) {
    if (!data || data.length === 0) return "";
    
    // Sort and clean coordinates
    const validPoints = data
      .map((d) => ({
        val: Number(d[key]),
        date: d.date ? new Date(d.date).getTime() : 0,
        distance: Number(d.distance || 0),
      }))
      .filter((p) => !isNaN(p.val) && p.val !== null && p.val !== undefined);

    if (validPoints.length === 0) return "";

    const width = 500;
    const height = 100;

    // Ensure sorted by time
    validPoints.sort((a, b) => a.date - b.date || a.distance - b.distance);

    // Filter duplicate times
    const uniquePoints = validPoints.filter(
      (p, idx, arr) => idx === 0 || p.date !== arr[idx - 1].date
    );

    if (uniquePoints.length === 0) return "";

    // Draw solid horizontal lines for single sparse points
    if (uniquePoints.length === 1) {
      const val = uniquePoints[0].val;
      const range = maxVal - minVal;
      const norm = range > 0 ? (val - minVal) / range : 0.5;
      const clampedNorm = Math.max(0, Math.min(1, norm));
      const y = height - clampedNorm * height;
      return `M 0,${y.toFixed(1)} L ${width},${y.toFixed(1)}`;
    }

    const points = uniquePoints.map((p, index) => {
      const x = (index / (uniquePoints.length - 1)) * width;
      const range = maxVal - minVal;
      const norm = range > 0 ? (p.val - minVal) / range : 0.5;
      const clampedNorm = Math.max(0, Math.min(1, norm));
      const y = height - clampedNorm * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(" L ")}`;
  }

  return (
    <div className="bg-slate-950 border border-[#1E293B] rounded-xl p-6 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-f1-red animate-pulse" />
            <span className="text-[10px] font-mono text-f1-red uppercase tracking-widest font-black">
              Direct ECU Link Active | Session: {sessionKey}
            </span>
          </div>
          <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
            TELEMETRY DIAGNOSTICS DECK
          </h2>
        </div>

        {/* Driver Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[9px] font-mono text-slate-500 block uppercase">Driver A</label>
            <select
              id="telemetry-driver-a-select"
              value={selectedDriver1}
              onChange={(e) => setSelectedDriver1(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white uppercase font-mono tracking-wide focus:outline-none"
            >
              {drivers.map((drv) => (
                <option key={drv.code} value={drv.code}>
                  {drv.fullName} ({drv.number})
                </option>
              ))}
            </select>
          </div>
          <div className="text-slate-600 font-bold self-end pb-1.5">VS</div>
          <div>
            <label className="text-[9px] font-mono text-slate-500 block uppercase">Driver B</label>
            <select
              id="telemetry-driver-b-select"
              value={selectedDriver2}
              onChange={(e) => setSelectedDriver2(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white uppercase font-mono tracking-wide focus:outline-none"
            >
              {drivers.map((drv) => (
                <option key={drv.code} value={drv.code}>
                  {drv.fullName} ({drv.number})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D2BE] justify-center py-4 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          SYNCHRONIZING SECURE ECU SATELLITE STREAMS...
        </div>
      )}

      {/* Main Stats Comparison Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">DRS Deployment Mode</span>
          <span className="text-sm font-semibold font-mono text-apex-green">ACTIVE / AUTO-DEPLOY</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">ERS Deployment Mode</span>
          <span className="text-sm font-semibold font-mono text-cyan-400">BALANCED BOOST</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Throttle Response Curve</span>
          <span className="text-sm font-semibold font-mono text-white">LINEAR RACING V4</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Sampling Frequency</span>
          <span className="text-sm font-semibold font-mono text-[#00D2BE]">500 Hz (TELE-LINK)</span>
        </div>
      </div>

      {!loading && !hasTelemetry && (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-8 text-center text-slate-400 font-mono text-xs uppercase tracking-wide">
          No telemetry available for selected drivers in session {sessionKey}.
        </div>
      )}

      {/* Big SVG telemetry wave map charts */}
      {hasTelemetry && (
        <div className="space-y-6">
          {/* SPEED CHART BOX */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wide">
                SPEED INTERCEPT VECTOR (KM/H over Track Position)
              </span>
            </div>
            <div className="h-44 w-full bg-slate-950 border-l border-b border-slate-800/60 relative flex items-center justify-center p-2">
              <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />

                {/* Driver A Curve */}
                {cleanedTelemetry1.length > 0 && (
                  <path
                    d={generateSvgPath(cleanedTelemetry1, "speed", speedBounds.max, speedBounds.min)}
                    fill="none"
                    stroke={activeDriverAObj?.color || "#FF8000"}
                    strokeWidth="2"
                  />
                )}
                {/* Driver B Curve */}
                {cleanedTelemetry2.length > 0 && (
                  <path
                    d={generateSvgPath(cleanedTelemetry2, "speed", speedBounds.max, speedBounds.min)}
                    fill="none"
                    stroke={activeDriverBObj?.color || "#3671C6"}
                    strokeWidth="2"
                  />
                )}
              </svg>
              <span className="absolute left-2 top-2 text-[8px] font-mono text-gray-500">{speedBounds.max} KM/H</span>
              <span className="absolute left-2 bottom-2 text-[8px] font-mono text-gray-500">{speedBounds.min} KM/H</span>
              <span className="absolute right-2 bottom-2 text-[8px] font-mono text-gray-500">Adaptive Lap position scaling</span>
            </div>
          </div>

          {/* THROTTLE / BRAKE BOX */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-slate-900 pb-2 gap-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wide">
                THROTTLE VS BRAKE PRESSURE INTERCEPT OVER LAP
              </span>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#10B981] inline-block" />
                  <span className="text-slate-300">{selectedDriver1} Throttle</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#EF4444] inline-block" />
                  <span className="text-slate-300">{selectedDriver1} Brake</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#10B981] border-b border-dashed border-spacing-1 inline-block" style={{ borderStyle: "dashed" }} />
                  <span className="text-slate-400">{selectedDriver2} Throttle</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#EF4444] border-b border-dashed border-spacing-1 inline-block" style={{ borderStyle: "dashed" }} />
                  <span className="text-slate-400">{selectedDriver2} Brake</span>
                </div>
              </div>
            </div>
            <div className="h-44 w-full bg-slate-950 border-l border-b border-slate-800/60 relative flex items-center justify-center p-2">
              <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" strokeDasharray="3" strokeWidth="0.5" />

                {/* Driver A Throttle & Brake */}
                {cleanedTelemetry1.length > 0 && (
                  <>
                    <path
                      d={generateSvgPath(cleanedTelemetry1, "throttle", 100, 0)}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                    <path
                      d={generateSvgPath(cleanedTelemetry1, "brake", 100, 0)}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                      strokeDasharray="2"
                    />
                  </>
                )}

                {/* Driver B Throttle & Brake */}
                {cleanedTelemetry2.length > 0 && (
                  <>
                    <path
                      d={generateSvgPath(cleanedTelemetry2, "throttle", 100, 0)}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.2"
                      strokeDasharray="4,4"
                      strokeOpacity="0.75"
                    />
                    <path
                      d={generateSvgPath(cleanedTelemetry2, "brake", 100, 0)}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.2"
                      strokeDasharray="2,4"
                      strokeOpacity="0.75"
                    />
                  </>
                )}
              </svg>
              <span className="absolute left-2 top-2 text-[8px] font-mono text-gray-500">100% Throttle</span>
              <span className="absolute left-2 bottom-2 text-[8px] font-mono text-gray-500">100% Brake</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
