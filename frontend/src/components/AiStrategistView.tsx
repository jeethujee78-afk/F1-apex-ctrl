import React, { useState, useEffect } from "react";
import { Session, Driver } from "../types";
import { BrainCircuit, Play, History, Save, Trash2, Cpu, AlertCircle, FileText } from "lucide-react";
import { analyzeSessionWithGemini } from "../services/openf1";
import Markdown from "react-markdown";
import { db } from "../services/firebase"; // Import Firestore instance from Firebase service
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

interface AiStrategistViewProps {
  session: Session | null;
  drivers: Driver[];
  userId: string | null;
}

interface SavedReport {
  id: string;
  title: string;
  prompt: string;
  report: string;
  createdAt: string;
}

export default function AiStrategistView({
  session,
  drivers,
  userId,
}: AiStrategistViewProps) {
  const [requestType, setRequestType] = useState<"strategy" | "telemetry">("strategy");
  const [reportText, setReportText] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Load saved analyses if logged-in
  const fetchSavedReports = async () => {
    if (!userId || !db) return;
    setLoadingReports(true);
    try {
      const q = query(collection(db, "saved_analyses"), where("userId", "==", userId));
      const snap = await getDocs(q);
      const items: SavedReport[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          title: d.title || "Strategy Simulation",
          prompt: d.prompt || "",
          report: d.report || "",
          createdAt: d.createdAt || "",
        });
      });
      setReports(items.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      console.warn("Could not load saved analyses (Firebase might be initializing):", e);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchSavedReports();
  }, [userId]);

  const handleGenerate = async () => {
    if (!session) {
      setErrorMsg("Please select an active session.");
      return;
    }
    setGenerating(true);
    setErrorMsg("");
    setReportText("");

    // Gather detailed context for active drivers in current session
    const fullDriverDetails = drivers.map((d: any) => ({
      number: d.driver_number || d.number,
      code: d.name_acronym || d.code,
      fullName: d.full_name || d.fullName,
      team: d.team_name || d.team,
      position: d.position,
      bestLap: d.bestLap,
      currentSpeed: d.currentSpeed,
      throttle: d.throttle,
      brake: d.brake,
      gear: d.gear,
      tyreCompound: d.tyreCompound || d.tyre_compound,
      tyreLife: d.tyreLife || d.tyre_life,
      advantages: d.advantages,
      disadvantages: d.disadvantages,
    }));

    try {
      const data = await analyzeSessionWithGemini({
        sessionName: session.session_name,
        location:
          `${session.circuit_short_name || session.meeting_name || "Unknown Circuit"}, ` +
          `${session.country_name || session.location || "Unknown Country"}`,
        drivers: drivers.slice(0, 10).map((d: any) => d.name_acronym || d.code),
        driverData: fullDriverDetails,
        requestType,
        sessionKey: String(session.session_key),
      });

      if (data.error) {
        throw new Error(data.error);
      }
      setReportText(data.text || data.strategySummary || "No strategy generated.");
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "An unexpected error occurred during report synthesis.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!userId || !db || !reportText || !session) return;
    try {
      const docData = {
        id: Math.random().toString(36).substring(7),
        userId,
        sessionKey: String(session.session_key),
        title: `${session.circuit_short_name} GP - ${requestType === "strategy" ? "Race Strategy Blueprint" : "Telemetry Deep Dive"}`,
        prompt: `F1 prompt generated for ${session.circuit_short_name}`,
        report: reportText,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "saved_analyses"), docData);
      fetchSavedReports();
    } catch (e) {
      console.error("Failed to save report.", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "saved_analyses", id));
      setReports(reports.filter(r => r.id !== id));
    } catch (e) {
      console.error("Delete failed.", e);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-80 p-6 border border-dashed border-slate-800 rounded-xl">
        <span className="text-slate-500 font-mono text-sm uppercase">Please Select An Active Racing Session First</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-black text-white tracking-wide uppercase flex items-center gap-2">
              APEX AI Race Strategist
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">
                NEURAL ENGINE PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous telemetry intelligence, tire wear simulation, overtake matrix & strategic recommendations
            </p>
          </div>
        </div>
        {reportText && (
          <button
            onClick={handleSave}
            disabled={!userId}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4 text-emerald-400" />
            {userId ? "Save Blueprint" : "Log In to Save"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Parameters Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl shadow-md flex flex-col gap-3">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">ANALYSIS MODULES</span>
            
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Select Intelligence Goal
              </label>
              <div className="flex flex-col gap-2 mt-1">
                {[
                  { id: "strategy", label: "Race Strategy & Pit Window" },
                  { id: "telemetry", label: "Telemetry & Driver Comparison" },
                  { id: "tyre_degradation", label: "Tire Degradation Analysis" },
                  { id: "overtake_matrix", label: "Overtake & Pace Analysis" },
                  { id: "fastest_lap", label: "Fastest Lap & Sector Breakdown" },
                  { id: "race_summary", label: "Race Summary & Session Insights" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRequestType(item.id as any)}
                    className={`py-2 px-3 text-left rounded-lg text-xs font-medium font-sans border transition-all ${
                      requestType === item.id
                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-shadow shadow-md uppercase tracking-wider"
            >
              <BrainCircuit className="h-4 w-4 shrink-0" />
              {generating ? "Synthesizing..." : "Run AI Simulation"}
            </button>
          </div>

        {/* Saved analyses shelf (only if logged-in user context matches) */}
        {userId && (
          <div className="bg-slate-900/10 border border-slate-800 p-5 rounded-xl shadow-md flex flex-col gap-3">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="h-4 w-4 text-cyan-455" /> Past Simulations
            </span>
            
            {loadingReports ? (
              <span className="text-[10px] font-mono text-slate-500 text-center py-4">Scanning satellite cloud archives...</span>
            ) : reports.length === 0 ? (
              <span className="text-[10px] font-mono text-slate-500 text-center py-4">No saved strategic blueprints yet.</span>
            ) : (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[180px] scrollbar-thin">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="group border border-slate-900 bg-slate-950/40 hover:border-slate-800 p-2 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    onClick={() => setReportText(rep.report)}
                  >
                    <div className="min-w-0 flex flex-col">
                      <span className="text-[10px] font-sans font-bold text-slate-350 truncate group-hover:text-cyan-400 transition-colors">
                        {rep.title}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(rep.id);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors"
                      aria-label="Delete saved report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3/4 Report Display Panel */}
      <div className="lg:col-span-3 flex flex-col">
        {errorMsg && (
          <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl flex items-start gap-3 text-rose-400 text-xs font-mono mb-4">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">SIMULATION COMPILATION CRASHED</p>
              <p className="mt-1 opacity-90 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {generating ? (
          <div className="flex-1 min-h-[380px] border border-slate-850 p-6 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-900/10">
            <Cpu className="h-8 w-8 text-cyan-400 animate-spin" />
            <div className="flex flex-col items-center text-center max-w-sm gap-0.5">
              <span className="font-mono text-xs tracking-widest uppercase font-bold text-slate-300">Formulating Predictive Model...</span>
              <p className="text-[11px] text-slate-500 font-sans mt-1">
                APEX AI Strategist is analyzing the active track shape, pit stop coordinates, tire wear matrices, and driver telemetry...
              </p>
            </div>
          </div>
        ) : reportText ? (
          <div className="border border-slate-800 bg-slate-950/15 p-6 rounded-xl flex flex-col gap-4 shadow-inner">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5 leading-none">
                <FileText className="h-4 w-4 text-emerald-400" /> APEX Race Intelligence Report
              </span>
              
              {userId && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded text-[10px] font-mono border border-slate-850 tracking-wider font-semibold transition-colors"
                >
                  <Save className="h-3.5 w-3.5" /> SAVE BOARD REPORT
                </button>
              )}
            </div>

            {/* Markdown Body style */}
            <div className="markdown-body text-slate-350 text-xs font-sans leading-relaxed space-y-4 prose prose-invert max-w-none prose-xs prose-headings:font-bold prose-headings:font-mono prose-headings:text-slate-100 prose-thead:text-xs">
              <Markdown>{reportText}</Markdown>
            </div>
          </div>
        ) : (
          <div className="flex-grow min-h-[380px] border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-900/5">
            <BrainCircuit className="h-10 w-10 text-slate-650" />
            <span className="font-mono text-xs uppercase font-bold text-slate-450 mt-3">APEX AI Race Engine Armed</span>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed font-sans">
              Choose your strategy simulation on the left console, then select Run Simulation to prompt our AI intelligence engine.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
