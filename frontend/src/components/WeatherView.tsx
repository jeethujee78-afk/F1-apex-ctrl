import { useState, useEffect } from "react";
import { CloudSun, CloudRain, ShieldCheck, Sun, Compass, Wind } from "lucide-react";

interface WeatherViewProps {
  sessionKey?: string;
  weatherData?: {
    trackTemp: number;
    airTemp: number;
    humidity: number;
    windSpeed: number;
    status: string;
    drsEnabled: boolean;
    air_temperature?: number;
    track_temperature?: number;
    wind_direction?: number;
    wind_speed?: number;
    rainfall?: number;
  };
}

export default function WeatherView({ sessionKey, weatherData }: WeatherViewProps) {
  const [chanceOfRain, setChanceOfRain] = useState(12);
  const [trackTemp, setTrackTemp] = useState(38.2);
  const [humidity, setHumidity] = useState(62);
  const [windHeading, setWindHeading] = useState("NE");

  // Instantly synchronize with global session weather state when it changes (Issue #9)
  useEffect(() => {
    if (weatherData) {
      const liveTrackTemp = weatherData.track_temperature !== undefined ? weatherData.track_temperature : weatherData.trackTemp;
      setTrackTemp(Number(liveTrackTemp.toFixed(1)));
      setHumidity(Math.round(weatherData.humidity));
      
      const liveRainfall = weatherData.rainfall !== undefined ? weatherData.rainfall : (weatherData.status === "WET TRACK" ? 1 : 0);
      setChanceOfRain(liveRainfall > 0 ? 85 : 10);
      
      // Map wind direction to general heading acronym
      const deg = weatherData.wind_direction !== undefined ? weatherData.wind_direction : 135;
      let heading = "N";
      if (deg > 22.5 && deg <= 67.5) heading = "NE";
      else if (deg > 67.5 && deg <= 112.5) heading = "E";
      else if (deg > 112.5 && deg <= 157.5) heading = "SE";
      else if (deg > 157.5 && deg <= 202.5) heading = "S";
      else if (deg > 202.5 && deg <= 247.5) heading = "SW";
      else if (deg > 247.5 && deg <= 292.5) heading = "W";
      else if (deg > 292.5 && deg <= 337.5) heading = "NW";
      setWindHeading(heading);
    }
  }, [weatherData]);

  const gripCoefficient = (1.25 - (chanceOfRain / 100) * 0.45 - ((humidity - 50) / 100) * 0.1).toFixed(2);


  return (
    <div className="bg-slate-950 border border-[#1E293B] rounded-xl p-6 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
            METEOROLOGICAL SAT-RADAR STATION
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            Track micro-climate saturation and track grip coefficients
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-apex-green">
            WEATHER FEED CONNECTED
          </span>
        </div>
      </div>

      {/* Dynamic Adjustments Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/20 p-4 border border-slate-900 rounded-lg">
        <div>
          <label className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Precipitation Spike</label>
          <input
            id="cfg-rain-risk"
            type="range"
            min="0"
            max="100"
            value={chanceOfRain}
            onChange={(e) => setChanceOfRain(parseInt(e.target.value))}
            className="w-full bg-slate-800 rounded appearance-none h-1.5 cursor-pointer accent-[#00D2BE]"
          />
          <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-1">
            <span>DRY</span>
            <span>{chanceOfRain}% Rain Risk</span>
            <span>MONSOON</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Track Temp Simulation</label>
          <input
            id="cfg-track-temp"
            type="range"
            min="10"
            max="55"
            value={trackTemp}
            onChange={(e) => setTrackTemp(parseInt(e.target.value))}
            className="w-full bg-slate-800 rounded appearance-none h-1.5 cursor-pointer accent-[#E10600]"
          />
          <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-1">
            <span>10°C</span>
            <span>{trackTemp}°C</span>
            <span>55°C</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Ambient Humidity</label>
          <input
            id="cfg-ambient-humidity"
            type="range"
            min="20"
            max="100"
            value={humidity}
            onChange={(e) => setHumidity(parseInt(e.target.value))}
            className="w-full bg-slate-800 rounded appearance-none h-1.5 cursor-pointer accent-indigo-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-1">
            <span>20%</span>
            <span>{humidity}% RH</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Wind Direction</label>
          <select
            id="cfg-wind-direction"
            value={windHeading}
            onChange={(e) => setWindHeading(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded p-1 font-mono uppercase"
          >
            <option value="N">North (N)</option>
            <option value="NE">North-East (NE)</option>
            <option value="E">East (E)</option>
            <option value="S">South (S)</option>
            <option value="W">West (W)</option>
          </select>
          <div className="text-[9px] font-mono text-gray-400 mt-1 text-center">
            Active: Headwind @ turn 17
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Track Saturation widget */}
        <div className="p-4 bg-slate-900/35 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            TRACK WATER SATURATION
          </span>
          <span className="text-2xl font-mono font-bold text-white">
            {chanceOfRain > 50 ? `${((chanceOfRain - 50) * 1.8).toFixed(1)}%` : "0.0%"}
          </span>
          <span className="text-[10px] font-mono block mt-1" style={{ color: chanceOfRain > 50 ? "#c084fc" : "#00D2BE" }}>
            {chanceOfRain > 50 ? "SLICK DANGER WET TRACK" : "DRY RACE SURFACE"}
          </span>
        </div>

        {/* Rain Risk status */}
        <div className="p-4 bg-slate-900/35 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            PRECIPITATION RISK (30 MIN)
          </span>
          <span className="text-2xl font-mono font-bold text-white">{chanceOfRain}%</span>
          <span className="text-[10px] font-mono text-cyan-400 block mt-1 uppercase font-bold">
            {chanceOfRain > 30 ? (chanceOfRain > 60 ? "HIGH INTENT ALERT" : "MODERATE OVERCAST") : "LIGHT CLEAR OUTLOOK"}
          </span>
        </div>

        {/* Grip Coefficient widget */}
        <div className="p-4 bg-slate-900/35 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            GRIP COEFFICIENT (MU)
          </span>
          <span className="text-2xl font-mono font-bold text-white">{gripCoefficient}</span>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            {parseFloat(gripCoefficient) < 1.0 ? "SLIPPERY DECK: WET SETTINGS" : "OPTIMAL TRACTION LIMIT"}
          </span>
        </div>
      </div>

      {/* Radar feed simulated container */}
      <div className="p-5 bg-slate-900/10 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
          <h4 className="text-sm font-display font-black text-white uppercase">Simulated Doppler Precipitation Radar Map</h4>
        </div>

        <div className="h-48 w-full bg-[#05070F] border border-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Circular Radar Sweep */}
          <div className="absolute w-[200px] h-[200px] rounded-full border border-slate-800/40" />
          <div className="absolute w-[100px] h-[100px] rounded-full border border-slate-800/20" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-slate-800/10" />

          {/* Sweeping radar line */}
          <div className="absolute top-1/2 left-1/2 w-[300px] h-0.5 bg-gradient-to-r from-emerald-500/30 to-transparent origin-left rotate-45 animate-[spin_6s_linear_infinite]" />

          {/* Dynamic Radar Target points representing rain clusters */}
          {chanceOfRain > 25 && (
            <span className="absolute top-1/3 left-1/4 w-5 h-5 rounded-full bg-cyan-500/20 animate-ping" />
          )}
          {chanceOfRain > 60 && (
            <span className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-purple-500/30 animate-pulse" />
          )}
          <span className="absolute top-1/4 left-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500/40" />

          <span className="text-[10px] font-mono text-slate-500 absolute bottom-3 right-3 uppercase">
            Radar range: 25 KM Radius ({windHeading} storm heading)
          </span>
        </div>
      </div>
    </div>
  );
}
