export type SidebarPage =
  | "dashboard"
  | "live_timing"
  | "telemetry"
  | "ai_strategist"
  | "lap_analysis"
  | "comparison"
  | "weather"
  | "tyre_analysis"
  | "replay"
  | "settings";

export interface SessionContext {
  year: string;
  series: string;
  round: string;
  sessionType: string;
}

export interface DriverState {
  number: number;
  code: string;
  fullName: string;
  team: string;
  color: string;
  currentSpeed: number;
  throttle: number;
  brake: number;
  drs: boolean;
  gear: number;
  ers: string;
  bestLap: string;
  winProbability: number;
  tyreCompound: "SOFT" | "MEDIUM" | "HARD";
  tyreLife: number;
  advantages: string[];
  disadvantages: string[];
  flagUrl?: string;
  nationality?: string;
  portraitUrl?: string;
  championshipPosition?: number;
  points?: number;
  firstName?: string;
  lastName?: string;
  teamLogoUrl?: string;
}

export interface LapMetric {
  lapNumber: number;
  norrisTime: number;
  verstappenTime: number;
}

export interface TelemetryPoint {
  time: number;
  norrisSpeed: number;
  verstappenSpeed: number;
  norrisThrottle: number;
  verstappenThrottle: number;
  norrisBrake: number;
  verstappenBrake: number;
  norrisErs: number;
  verstappenErs: number;
}

export interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
  country_name: string;
  circuit_short_name: string;
  circuit_key: number;
  meeting_key?: string;
  location?: string;
  meeting_name?: string;
}

export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  headshot_url: string;
}

export interface CarTelemetry {
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  date: string;
  distance: number;
}

export interface WeatherInfo {
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  wind_direction: number;
  wind_speed: number;
  rainfall: number;
  date: string;
}

export interface TeamRadio {
  date: string;
  driver_number: number;
  recording_url: string;
}

export interface Lap {
  lap_duration: number | null;
  lap_number: number;
  session_key: number;
  driver_number: number;
  duration_sector_1?: number;
  duration_sector_2?: number;
  duration_sector_3?: number;
  segments_sector_1?: any;
  segments_sector_2?: any;
  segments_sector_3?: any;
  is_pit_out_lap?: boolean;
}

export interface UserSession {
  email: string;
  isAnonymous: boolean;
  uid?: string;
}
