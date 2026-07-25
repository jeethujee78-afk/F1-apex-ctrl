// src/types/replay.ts

export interface ReplayState {
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  lapNumber: number;
  cameraMode: "aerial" | "helmet" | "chase" | "spectator";
  safetyCar: boolean;
  yellowFlag: boolean;
  wetMode: boolean;
  isOrbitalRotation: boolean;
  glitchInterference: boolean;
  zoomLevel: number;
  activeSegmentLabel: string;
}

export interface PlaybackControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  lapNumber: number;
  onPlayPause: (playing: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (progress: number) => void;
  onReset: () => void;
}

export interface CameraModeSwitcherProps {
  cameraMode: "aerial" | "helmet" | "chase" | "spectator";
  onCameraModeChange: (
    mode: "aerial" | "helmet" | "chase" | "spectator"
  ) => void;
}

export interface BroadcastHUDProps {
  carA: {
    x: number;
    y: number;
    speed: number;
    gear: number;
    throttle: number;
    brake: number;
    color: string;
  };
  carB: {
    x: number;
    y: number;
    speed: number;
    gear: number;
    throttle: number;
    brake: number;
    color: string;
  };
  profileA: {
    code: string;
    fullName: string;
    team: string;
    color: string;
    number: number;
  };
  profileB: {
    code: string;
    fullName: string;
    team: string;
    color: string;
    number: number;
  };
  lapNumber: number;
  activeSegmentLabel: string;
  audioFreqs: number[];
}

export interface Viewport3DProps {
  carA: {
    x: number;
    y: number;
    speed: number;
    gear: number;
    throttle: number;
    brake: number;
    color: string;
  };
  carB: {
    x: number;
    y: number;
    speed: number;
    gear: number;
    throttle: number;
    brake: number;
    color: string;
  };
  profileA: {
    code: string;
    fullName: string;
    team: string;
    color: string;
    number: number;
  };
  profileB: {
    code: string;
    fullName: string;
    team: string;
    color: string;
    number: number;
  };
  trackPoints: Array<{ x: number; y: number; speedLimit: number }>;
  apexMarkers: Array<{ x: number; y: number; label: string; type: string }>;
  cameraMode: "aerial" | "helmet" | "chase" | "spectator" | "tv-director";
  progress: number;
  wetMode: boolean;
  zoomLevel: number;
  isOrbitalRotation: boolean;
  trackName: string;
  trackCountry: string;
}
