import React, { useEffect, useState } from "react";
import { fetchTeamRadio, fetchLaps } from "../services/openf1";
import { Session, Driver, TeamRadio, Lap } from "../types";
import { Volume2, Play, AudioLines, Info, HelpCircle, TableProperties } from "lucide-react";
import { motion } from "motion/react";

interface LapCenterViewProps {
  session: Session | null;
  drivers: Driver[];
}

export default function LapCenterView({ session, drivers }: LapCenterViewProps) {
  const [radios, setRadios] = useState<TeamRadio[]>([]);
  const [radiosLoading, setRadiosLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<number | "">("");
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lapsLoading, setLapsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    setRadiosLoading(true);
    fetchTeamRadio(session.session_key)
      .then((data) => {
        setRadios(data);
        setRadiosLoading(false);
      })
      .catch((e) => {
        console.error("Team radio load error", e);
        setRadiosLoading(false);
      });
  }, [session]);

  useEffect(() => {
    if (!session || selectedDriver === "") {
      setLaps([]);
      return;
    }
    setLapsLoading(true);
    fetchLaps(session.session_key, Number(selectedDriver))
      .then((data) => {
        setLaps(data.slice(-15)); // Get last 15 laps
        setLapsLoading(false);
      })
      .catch((e) => {
        console.error("Laps query failed", e);
        setLapsLoading(false);
      });
  }, [session, selectedDriver]);

  const driversKey = drivers.map(d => d.driver_number).join(",");

  useEffect(() => {
    if (drivers.length > 0) {
      setSelectedDriver(drivers[0].driver_number);
    } else {
      setSelectedDriver("");
    }
  }, [driversKey]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-80 p-6 border border-dashed border-slate-800 rounded-xl">
        <span className="text-slate-500 font-mono text-sm uppercase">Please Select An Active Racing Session First</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2/3 Area: Lap Sector Analysis */}
      <div className="lg:col-span-2 bg-slate-900/10 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <TableProperties className="h-4 w-4 text-cyan-400" /> Sector Analysis & Lap history
            </span>
            <span className="text-[10px] text-slate-500 font-mono">SECTOR ACCURACY (SEC)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">Driver Focus:</span>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value === "" ? "" : Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- select --</option>
              {drivers.map((drv) => (
                <option key={`lap-focus-${drv.driver_number}`} value={drv.driver_number}>
                  #{drv.driver_number} - {drv.name_acronym}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Laps List table wrapper (responsive horizontally scrollable list) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/20">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-500 uppercase">
                <th className="py-2.5 px-4 font-bold">Lap #</th>
                <th className="py-2.5 px-4 font-bold">Duration</th>
                <th className="py-2.5 px-4 font-bold">S1 Time</th>
                <th className="py-2.5 px-4 font-bold">S2 Time</th>
                <th className="py-2.5 px-4 font-bold">S3 Time</th>
                <th className="py-2.5 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {lapsLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono text-slate-500">
                    Retrieving Lap Vectors...
                  </td>
                </tr>
              ) : laps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono text-slate-500">
                    No recorded laps in selection. Wait for session green flag.
                  </td>
                </tr>
              ) : (
                laps.map((lap, i) => {
                  const durationSec = lap.lap_duration !== null ? Number(lap.lap_duration).toFixed(3) : "—";
                  const s1Str = lap.segments_sector_1 !== null ? Number(lap.segments_sector_1).toFixed(3) : "—";
                  const s2Str = lap.segments_sector_2 !== null ? Number(lap.segments_sector_2).toFixed(3) : "—";
                  const s3Str = lap.segments_sector_3 !== null ? Number(lap.segments_sector_3).toFixed(3) : "—";
                  
                  return (
                    <tr
                      key={`lap-${lap.lap_number}-${i}`}
                      className="border-b border-slate-900 font-mono text-xs text-slate-350 hover:bg-slate-900/20 last:border-0"
                    >
                      <td className="py-3 px-4 font-bold text-slate-200">#{lap.lap_number}</td>
                      <td className="py-3 px-4 text-cyan-400 font-semibold">{durationSec}s</td>
                      <td className="py-3 px-4">{s1Str}s</td>
                      <td className="py-3 px-4">{s2Str}s</td>
                      <td className="py-3 px-4">{s3Str}s</td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase border ${
                          lap.is_pit_out_lap
                            ? "bg-amber-950/20 text-amber-400 border-amber-900/40"
                            : "bg-emerald-950/10 text-emerald-400 border-emerald-900/20"
                        }`}>
                          {lap.is_pit_out_lap ? "Pit Out" : "Push"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1/3 Area: Live Team Audio Feed */}
      <div className="bg-slate-900/10 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col gap-4">
        <div className="border-b border-slate-800 pb-3 flex flex-col gap-0.5">
          <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <AudioLines className="h-4 w-4 text-rose-500 animate-pulse" /> Live Team Radio
          </span>
          <span className="text-[10px] text-slate-500 font-mono">ENCRYPTED ANALOG SPEECH DRAWER</span>
        </div>

        {radiosLoading ? (
          <div className="flex flex-col items-center justify-center grow py-12 gap-2 text-slate-500 text-xs">
            <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono">Decrypting radio hashes...</span>
          </div>
        ) : radios.length === 0 ? (
          <div className="text-center font-mono py-12 text-xs text-slate-500">
            No radio transcripts reported for this sector.
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[360px] scrollbar-thin">
            {radios.map((rad, i) => {
              const driverObj = drivers.find((d) => d.driver_number === rad.driver_number);
              return (
                <div
                  key={`radio-${rad.date}-${i}`}
                  className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg flex items-center justify-between gap-3 group hover:border-slate-800 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded font-black text-slate-300"
                        style={{ borderLeft: `3px solid #${driverObj?.team_colour || "52E252"}` }}
                      >
                        CAR {rad.driver_number}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[110px]">
                        {driverObj?.name_acronym || "F1 Driver"}
                      </span>
                    </div>

                    <p className="text-[10px] font-mono text-slate-500 mt-2">
                      DATE: {new Date(rad.date).toLocaleTimeString()}
                    </p>
                  </div>

                  {rad.recording_url ? (
                    <a
                      href={rad.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-400 hover:text-rose-100 p-2.5 rounded-full transition-transform hover:scale-105"
                      title="Play Audio Recording"
                    >
                      <Play className="h-3 w-3 fill-rose-400" />
                    </a>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 p-2 rounded-full text-slate-500" title="Audio recording unavailable">
                      <Volume2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
