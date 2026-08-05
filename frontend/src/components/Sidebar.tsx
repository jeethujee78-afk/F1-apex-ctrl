import { useState } from "react";
import { SidebarPage, SessionContext } from "../types";
import {
  LayoutDashboard,
  Timer,
  Activity,
  Cpu,
  BarChart3,
  GitCompare,
  CloudSun,
  Disc,
  Play,
  Settings,
  RefreshCw,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activePage: SidebarPage;
  setActivePage: (page: SidebarPage) => void;
  sessionContext: SessionContext;
  onYearChange: (year: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  years: number[];
  meetings: Array<{ meeting_key: string; location: string; country_name: string; meeting_name: string }>;
  sessions: Array<{ session_key: string; session_name: string; session_type: string }>;
  selectedMeetingKey: string;
  onMeetingChange: (key: string) => void;
  selectedSessionKey: string;
  onSessionChange: (key: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const PAGES_META = [
  { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { id: "live_timing", label: "LIVE TIMING", icon: Timer },
  { id: "telemetry", label: "TELEMETRY", icon: Activity },
  { id: "ai_strategist", label: "APEX AI STRATEGIST", icon: Cpu },
  { id: "lap_analysis", label: "LAP ANALYSIS", icon: BarChart3 },
  { id: "comparison", label: "DRIVER COMPARISON", icon: GitCompare },
  { id: "weather", label: "WEATHER", icon: CloudSun },
  { id: "tyre_analysis", label: "TYRE ANALYSIS", icon: Disc },
  { id: "replay", label: "REPLAY", icon: Play },
  { id: "settings", label: "SETTINGS", icon: Settings },
] as const;

export default function Sidebar({
  activePage,
  setActivePage,
  sessionContext,
  onYearChange,
  onRefreshData,
  isRefreshing,
  years,
  meetings,
  sessions,
  selectedMeetingKey,
  onMeetingChange,
  selectedSessionKey,
  onSessionChange,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-apex-dark border-r border-[#1E293B] flex flex-col justify-between h-screen p-4 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}>
      {/* BRAND HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-f1-red flex items-center justify-center text-white font-black italic tracking-tighter text-xl">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-2xl tracking-tighter text-white">APEX</span>
              <span className="font-display font-medium text-2xl tracking-tighter text-f1-red">CTRL</span>
            </div>
            <div className="text-[10px] font-mono text-apex-green uppercase tracking-widest leading-none">
              AI Race Intelligence System
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-900 focus:outline-none cursor-pointer"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* F1 Car Style Vector Background Decoration */}
      <div className="mb-6 p-2 bg-gradient-to-r from-red-950/20 to-transparent border-l-2 border-f1-red rounded-r">
        <span className="text-[10px] font-mono text-gray-400 font-bold">CONTROL CENTER ACTIVE</span>
      </div>

      {/* NAVIGATION SECTION */}
      <div className="flex-1 space-y-1">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">
          Control Center
        </div>
        {PAGES_META.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;
          return (
            <button
              id={`nav-btn-${page.id}`}
              key={page.id}
              onClick={() => {
                setActivePage(page.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-apex-green/35 text-apex-green shadow-[0_0_15px_rgba(0,210,190,0.08)]"
                  : "text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-apex-green" : "text-gray-400 group-hover:text-white"}`} />
              <span className="flex-1 text-left tracking-wide">{page.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-apex-green animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* SESSION SELECTOR SECTION */}
      <div className="mt-6 pt-6 border-t border-[#1E293B] space-y-3">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-2">
          Session Selector
        </div>

        {/* YEAR CHOICE */}
        <div>
          <label className="text-[10px] font-mono text-gray-400 block mb-1 uppercase tracking-wider pl-1">Year</label>
          <select
            id="session-year-select"
            value={sessionContext.year}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full bg-slate-950 border border-[#2D3748] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-apex-green font-mono cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* GRAND PRIX MEETING CHOICE */}
        <div>
          <label className="text-[10px] font-mono text-gray-400 block mb-1 uppercase tracking-wider pl-1">Grand Prix</label>
          <select
            id="session-round-select"
            value={selectedMeetingKey}
            onChange={(e) => onMeetingChange(e.target.value)}
            className="w-full bg-slate-950 border border-[#2D3748] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-apex-green font-mono cursor-pointer"
          >
            {meetings.map((m) => (
              <option key={m.meeting_key} value={m.meeting_key}>
                {m.location} ({m.country_name})
              </option>
            ))}
          </select>
        </div>

        {/* ACTIVE SESSION KEY */}
        <div>
          <label className="text-[10px] font-mono text-gray-400 block mb-1 uppercase tracking-wider pl-1">Session</label>
          <select
            id="session-type-select"
            value={selectedSessionKey}
            onChange={(e) => onSessionChange(e.target.value)}
            className="w-full bg-slate-950 border border-[#2D3748] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-apex-green font-mono cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.session_key} value={s.session_key}>
                {s.session_name}
              </option>
            ))}
          </select>
        </div>

        {/* REFRESH DATA BUTTON */}
        <button
          id="btn-refresh-data"
          onClick={onRefreshData}
          disabled={isRefreshing}
          className={`w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-display font-medium uppercase tracking-wider text-white transition-all bg-f1-red hover:bg-red-650 active:scale-[0.98] cursor-pointer ${
            isRefreshing ? "opacity-75 cursor-wait" : "glowing-btn-live hover:shadow-[0_0_15px_rgba(225,6,0,0.8)]"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Syncing..." : "Refresh Data"}
        </button>
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-4 border-t border-[#1E293B] flex items-center gap-2 justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span className="text-[10px] font-mono text-gray-400">OPENF1 SYNCED</span>
        </div>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-apex-green animate-pulse" />
          <span className="text-[9px] font-mono text-apex-green">v4.0.0</span>
        </div>
      </div>
    </div>
  );
}
