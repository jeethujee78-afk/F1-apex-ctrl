import { useState, useEffect } from "react";
import { SessionContext } from "../types";
import { Link2, Cpu, RefreshCw, Layers, Menu } from "lucide-react";

interface HeaderProps {
  sessionContext: SessionContext;
  aiActive: boolean;
  openf1Connected: boolean;
  isLive: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  sessionContext,
  aiActive,
  openf1Connected,
  isLive,
  onToggleSidebar,
}: HeaderProps) {
  const [sessionTime, setSessionTime] = useState("01:28:47");

  // Keep a premium animated ticking clock
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24) + 1;
      const minutes = Math.floor((elapsed / (1000 * 60)) % 60) + 28;
      const seconds = Math.floor((elapsed / 1000) % 60) + 47;

      const fmtH = hours.toString().padStart(2, "0");
      const fmtM = (minutes % 60).toString().padStart(2, "0");
      const fmtS = (seconds % 65).toString().padStart(2, "0"); // simple tweak

      setSessionTime(`${fmtH}:${fmtM}:${fmtS}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-[#1E293B] bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* LEFT SECTION: CURRENT GP SESSION */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-900 focus:outline-none cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-apex-green animate-ping inline-block sm:block" />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#00D2BE] uppercase font-bold">
                Live Race Feed
              </span>
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-gray-400 font-mono">
                SECURE
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-display font-black text-white tracking-tight truncate max-w-[150px] sm:max-w-none">
              {sessionContext.round} {sessionContext.year}
            </h1>
          </div>
        </div>
      </div>

      {/* CENTER SECTION: MISSION CONTROL CONSOLE PILLS */}
      <div className="hidden lg:flex items-center gap-3.5">
        {/* OpenF1 Connection Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1121] border border-[#1E293B]">
          <Link2 className={`w-3.5 h-3.5 ${openf1Connected ? "text-apex-green" : "text-gray-500 animate-pulse"}`} />
          <span className="text-[10px] font-mono font-medium text-gray-300">OPENF1</span>
          <span className={`text-[9px] px-1.5 rounded-full font-mono ${
            openf1Connected ? "bg-emerald-950 text-apex-green font-bold" : "bg-amber-950 text-amber-400"
          }`}>
            {openf1Connected ? "CONNECTED" : "OFFLINE"}
          </span>
        </div>

        {/* AI ENGINE ACTIVE indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1121] border border-[#1E293B]">
          <Cpu className={`w-3.5 h-3.5 ${aiActive ? "text-cyan-400" : "text-gray-500"}`} />
          <span className="text-[10px] font-mono font-medium text-gray-300">AI ENGINE</span>
          <span className="text-[9px] px-1.5 bg-cyan-950 text-cyan-400 rounded-full font-bold font-mono">
            {aiActive ? "ACTIVE" : "STANDBY"}
          </span>
        </div>

        {/* Data Stream Ticker */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1121] border border-[#1E293B]">
          <Layers className={`w-3.5 h-3.5 ${openf1Connected ? "text-[#00D2BE] animate-pulse" : "text-amber-500"}`} />
          <span className="text-[10px] font-mono font-medium text-gray-300">TELEMETRY</span>
          <span className={`text-[9px] px-1.5 rounded-full font-bold font-mono ${
            openf1Connected ? "bg-teal-950 text-apex-green" : "bg-amber-950/85 text-amber-400"
          }`}>
            {openf1Connected ? "LIVE" : "FALLBACK"}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: CLOCK AND STATUS BUTTONS */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* SESSION CLOCK */}
        <div className="text-right">
          <div className="hidden sm:block text-[10px] font-mono text-gray-400 uppercase tracking-widest pl-1 leading-none mb-0.5 animate-pulse">
            Session Time
          </div>
          <div className="font-mono text-sm sm:text-lg md:text-xl font-bold text-white tracking-widest">
            {sessionTime}
          </div>
        </div>

        {/* GLOWING LIVE BUTTON */}
        <button
          id="header-live-puck"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-f1-red text-white text-[10px] sm:text-xs font-display font-black tracking-widest rounded uppercase cursor-pointer transition-all active:scale-95 glowing-btn-live hover:shadow-[0_0_20px_rgba(225,6,0,0.85)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          Live
        </button>
      </div>
    </header>
  );
}
