import { Play, Pause, RotateCcw } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  lapNumber: number;
  onPlayPause: (playing: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (progress: number) => void;
  onReset: () => void;
}

export default function PlaybackControls({
  isPlaying,
  playbackSpeed,
  progress,
  lapNumber,
  onPlayPause,
  onSpeedChange,
  onProgressChange,
  onReset,
}: PlaybackControlsProps) {
  return (
    <div className="p-5 bg-slate-950/95 border-t border-slate-900 space-y-4 shadow-2xl relative z-20">
      {/* Timeline Scrubber */}
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
            onChange={(e) => onProgressChange(parseFloat(e.target.value))}
            className="absolute inset-x-0 w-full h-4 opacity-100 cursor-pointer accent-[#00D2BE] bg-transparent z-10"
          />
        </div>

        <span className="text-[10px] font-mono text-white font-black bg-cyan-950/30 border border-cyan-800/25 px-2.5 py-0.5 rounded select-none">
          LAP {lapNumber} <span className="text-gray-500">/ 57</span>
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={() => onPlayPause(!isPlaying)}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center hover:from-cyan-300 hover:to-teal-400 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 translate-x-[1px]" />
            )}
          </button>

          {/* Playback Speed Buttons */}
          <div className="flex bg-slate-900 border border-slate-800/80 p-1 rounded-xl shadow-inner">
            {[1, 2, 3, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => onSpeedChange(m)}
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

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset coordinates timeline sequence"
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-gray-400 hover:text-white cursor-pointer active:scale-90"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
