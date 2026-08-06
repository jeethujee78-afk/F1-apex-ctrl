import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { auth } from "./services/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import firebaseConfig from "./firebase-applet-config.json";
import {
  fetchWeather,
  fetchYears,
  fetchMeetings,
  fetchSessionsList,
  fetchExactResults,
  fetchStrategyPlanAPI,
  requestManager,
  fetchSessionDrivers,
} from "./services/openf1";

const isFirebaseActive = firebaseConfig.apiKey !== "MOCK_API_KEY";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import LiveTimingView from "./components/LiveTimingView";
import TelemetryView from "./components/TelemetryView";
import AiStrategistView from "./components/AiStrategistView";
import LapAnalysisView from "./components/LapAnalysisView";
import ComparisonView from "./components/ComparisonView";
import WeatherView from "./components/WeatherView";
import TyreAnalysisView from "./components/TyreAnalysisView";
import ReplayView from "./components/ReplayView";
import SettingsView from "./components/SettingsView";

import StartupIntro from "./components/StartupIntro";
import { SidebarPage, SessionContext, DriverState, LapMetric, TelemetryPoint } from "./types";

// Constant starting state for active F1 telemetry
const INITIAL_DRIVERS: DriverState[] = [
  {
    number: 4,
    code: "NOR",
    fullName: "Lando Norris",
    team: "McLaren",
    color: "#FF8000",
    currentSpeed: 328,
    throttle: 88,
    brake: 12,
    drs: true,
    gear: 8,
    ers: "DEPLOY",
    bestLap: "1:27.456",
    winProbability: 74,
    tyreCompound: "MEDIUM",
    tyreLife: 63,
    advantages: ["Better Corner Exit", "Tyre Preservation", "DRS Efficiency Strong"],
    disadvantages: ["Sector 3 Loss", "Rear Tyre Wear"],
  },
  {
    number: 1,
    code: "VER",
    fullName: "Max Verstappen",
    team: "Red Bull",
    color: "#3671C6",
    currentSpeed: 331,
    throttle: 94,
    brake: 0,
    drs: true,
    gear: 8,
    ers: "DEPLOY",
    bestLap: "1:27.208",
    winProbability: 26,
    tyreCompound: "MEDIUM",
    tyreLife: 63,
    advantages: ["Top Speed Advantage", "Braking Stability", "Strong Sector 1", "ERS Efficiency"],
    disadvantages: ["Tyre Degradation", "Corner Entry"],
  },
];

const INITIAL_WEATHER = {
  trackTemp: 38.2,
  airTemp: 28.1,
  humidity: 62,
  windSpeed: 14,
  status: "GREEN FLAG",
  drsEnabled: true,
};

export default function App() {
  console.log("[DEBUG APP RENDER]");
  const [showIntro, setShowIntro] = useState(true);
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);
  const [activePage, setActivePage] = useState<SidebarPage>("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [openf1Connected, setOpenf1Connected] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string>("");
  const [rawDrivers, setRawDrivers] = useState<any[]>([]);

  useEffect(() => {
    if (!isFirebaseActive) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          email: user.email || "anonymous@f1.com",
          isAnonymous: user.isAnonymous,
          uid: user.uid,
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFirebaseGoogleSignIn = async () => {
    try {
      setAuthError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message || "Google single sign-on failed.");
      throw err;
    }
  };

  const handleFirebaseEmailSignIn = async (email: string, pass: string, isSignUp: boolean) => {
    try {
      setAuthError("");
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
    } catch (err: any) {
      setAuthError(err.message || "Credential validation failed.");
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setAuthError("");
      if (isFirebaseActive) {
        await signOut(auth);
      } else {
        setCurrentUser(null);
      }
    } catch (err: any) {
      setAuthError(err.message || "Logout failed.");
    }
  };

  const handleLocalSignIn = (email: string, method: "google" | "email") => {
    setCurrentUser({
      email,
      isAnonymous: true,
      uid: "mock-uid-123",
    });
  };

  // Dynamic OpenF1 selection list arrays
  const [years, setYears] = useState<number[]>([2026, 2025, 2024, 2023]);

  useEffect(() => {
    const fetchYearsList = async () => {
      try {
        const list = await fetchYears();
        if (Array.isArray(list) && list.length > 0) {
          setYears(list);
        }
      } catch (error) {
        console.error("Failed to load years from API", error);
      }
    };
    fetchYearsList();
  }, []);

  const [meetings, setMeetings] = useState<any[]>([
    { meeting_key: "9522", location: "Miami", country_name: "United States", meeting_name: "Miami Grand Prix" },
    { meeting_key: "1234", location: "Monaco", country_name: "Monaco", meeting_name: "Monaco Grand Prix" },
    { meeting_key: "5678", location: "Monza", country_name: "Italy", meeting_name: "Monza Grand Prix" },
    { meeting_key: "9999", location: "Silverstone", country_name: "United Kingdom", meeting_name: "Silverstone GP" }
  ]);
  const [sessions, setSessions] = useState<any[]>([
    { session_key: "9522", session_name: "Race", session_type: "Race" },
    { session_key: "9521", session_name: "Qualifying", session_type: "Qualifying" },
    { session_key: "9520", session_name: "Practice 3", session_type: "Practice" }
  ]);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState<string>("9522");
  const [selectedSessionKey, setSelectedSessionKey] = useState<string>("9522");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data models state
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    year: "2024",
    series: "Formula 1",
    round: "Miami Grand Prix",
    sessionType: "Race",
  });

  // Action Handler: Year Change
  const handleYearChangeAction = async (targetYear: string) => {
    setIsLoadingDrivers(true);
    try {
      const meetingsList = await fetchMeetings(targetYear);
      if (Array.isArray(meetingsList) && meetingsList.length > 0) {
        setMeetings(meetingsList);
        const firstMeeting = meetingsList[0];
        const nextRound = firstMeeting.meeting_name || `${firstMeeting.location} Grand Prix`;
        
        const sessionsList = await fetchSessionsList(firstMeeting.meeting_key);
        if (Array.isArray(sessionsList) && sessionsList.length > 0) {
          setSessions(sessionsList);
          const firstSession = sessionsList[0];
          const nextSessionType = firstSession.session_name || "Race";
          
          const [exactDrivers, info] = await Promise.all([
            fetchSessionDrivers(firstSession.session_key, targetYear, nextRound, nextSessionType).catch(() => []),
            fetchWeather(firstSession.session_key).catch(() => null)
          ]);
          
          setSelectedMeetingKey(firstMeeting.meeting_key);
          setSelectedSessionKey(firstSession.session_key);
          setSessionContext({
            year: targetYear,
            series: "Formula 1",
            round: nextRound,
            sessionType: nextSessionType
          });
          
          if (exactDrivers && exactDrivers.length > 0) {
            setDrivers(exactDrivers);
            const mappedRaw = exactDrivers.map((d: any) => ({
              driver_number: d.number,
              name_acronym: d.code,
              full_name: d.fullName,
              team_name: d.team,
              team_colour: d.color ? d.color.replace("#", "") : "FFFFFF",
              broadcast_name: d.fullName.toUpperCase(),
              country_code: d.code.substring(0, 2),
              headshot_url: ""
            }));
            setRawDrivers(mappedRaw);
          } else {
            setDrivers([]);
            setRawDrivers([]);
          }

          if (info) {
            setWeatherData({
              trackTemp: info.track_temperature,
              airTemp: info.air_temperature,
              humidity: info.humidity,
              windSpeed: info.wind_speed,
              status: info.rainfall > 0 ? "WET TRACK" : "GREEN FLAG",
              drsEnabled: info.rainfall === 0,
              ...info as any
            });
          }
        } else {
          setSessions([]);
          setDrivers([]);
          setRawDrivers([]);
          setSelectedMeetingKey(firstMeeting.meeting_key);
          setSelectedSessionKey("");
          setSessionContext({
            year: targetYear,
            series: "Formula 1",
            round: nextRound,
            sessionType: ""
          });
        }
      } else {
        setMeetings([]);
        setSessions([]);
        setDrivers([]);
        setRawDrivers([]);
        setSelectedMeetingKey("");
        setSelectedSessionKey("");
        setSessionContext({
          year: targetYear,
          series: "Formula 1",
          round: "",
          sessionType: ""
        });
      }
    } catch (error) {
      console.error("Failed to change year data:", error);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  // Action Handler: Meeting Change
  const handleMeetingChangeAction = async (targetMeetingKey: string) => {
    if (!targetMeetingKey) return;
    setIsLoadingDrivers(true);
    try {
      const foundMeeting = meetings.find(m => m.meeting_key === targetMeetingKey);
      const nextRound = foundMeeting ? (foundMeeting.meeting_name || `${foundMeeting.location} Grand Prix`) : sessionContext.round;
      
      const sessionsList = await fetchSessionsList(targetMeetingKey);
      if (Array.isArray(sessionsList) && sessionsList.length > 0) {
        setSessions(sessionsList);
        const firstSession = sessionsList[0];
        const nextSessionType = firstSession.session_name || "Race";
        
        const [exactDrivers, info] = await Promise.all([
          fetchSessionDrivers(firstSession.session_key, sessionContext.year, nextRound, nextSessionType).catch(() => []),
          fetchWeather(firstSession.session_key).catch(() => null)
        ]);
        
        setSelectedMeetingKey(targetMeetingKey);
        setSelectedSessionKey(firstSession.session_key);
        setSessionContext(prev => ({
          ...prev,
          round: nextRound,
          sessionType: nextSessionType
        }));
        
        if (exactDrivers && exactDrivers.length > 0) {
          setDrivers(exactDrivers);
          const mappedRaw = exactDrivers.map((d: any) => ({
            driver_number: d.number,
            name_acronym: d.code,
            full_name: d.fullName,
            team_name: d.team,
            team_colour: d.color ? d.color.replace("#", "") : "FFFFFF",
            broadcast_name: d.fullName.toUpperCase(),
            country_code: d.code.substring(0, 2),
            headshot_url: ""
          }));
          setRawDrivers(mappedRaw);
        } else {
          setDrivers([]);
          setRawDrivers([]);
        }

        if (info) {
          setWeatherData({
            trackTemp: info.track_temperature,
            airTemp: info.air_temperature,
            humidity: info.humidity,
            windSpeed: info.wind_speed,
            status: info.rainfall > 0 ? "WET TRACK" : "GREEN FLAG",
            drsEnabled: info.rainfall === 0,
            ...info as any
          });
        }
      } else {
        setSessions([]);
        setDrivers([]);
        setRawDrivers([]);
        setSelectedMeetingKey(targetMeetingKey);
        setSelectedSessionKey("");
        setSessionContext(prev => ({
          ...prev,
          round: nextRound,
          sessionType: ""
        }));
      }
    } catch (error) {
      console.error("Failed to change meeting data:", error);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  // Action Handler: Session Change
  const handleSessionChangeAction = async (targetSessionKey: string) => {
    if (!targetSessionKey) return;
    setIsLoadingDrivers(true);
    try {
      const foundSession = sessions.find(s => s.session_key === targetSessionKey);
      const nextSessionType = foundSession ? (foundSession.session_name || "Race") : sessionContext.sessionType;
      
      const [exactDrivers, info] = await Promise.all([
        fetchSessionDrivers(targetSessionKey, sessionContext.year, sessionContext.round, nextSessionType).catch(() => []),
        fetchWeather(targetSessionKey).catch(() => null)
      ]);
      
      setSelectedSessionKey(targetSessionKey);
      setSessionContext(prev => ({
        ...prev,
        sessionType: nextSessionType
      }));
      
      if (exactDrivers && exactDrivers.length > 0) {
        setDrivers(exactDrivers);
        const mappedRaw = exactDrivers.map((d: any) => ({
          driver_number: d.number,
          name_acronym: d.code,
          full_name: d.fullName,
          team_name: d.team,
          team_colour: d.color ? d.color.replace("#", "") : "FFFFFF",
          broadcast_name: d.fullName.toUpperCase(),
          country_code: d.code.substring(0, 2),
          headshot_url: ""
        }));
        setRawDrivers(mappedRaw);
      } else {
        setDrivers([]);
        setRawDrivers([]);
      }

      if (info) {
        setWeatherData({
          trackTemp: info.track_temperature,
          airTemp: info.air_temperature,
          humidity: info.humidity,
          windSpeed: info.wind_speed,
          status: info.rainfall > 0 ? "WET TRACK" : "GREEN FLAG",
          drsEnabled: info.rainfall === 0,
          ...info as any
        });
      }
    } catch (error) {
      console.error("Failed to change session data:", error);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  const [drivers, setDrivers] = useState<DriverState[]>(INITIAL_DRIVERS);
  const [weatherData, setWeatherData] = useState(INITIAL_WEATHER);
  const [strategyText, setStrategyText] = useState("");



  const fetchStrategyPlan = async () => {
    setIsAiOptimizing(true);
    try {
      const data = await fetchStrategyPlanAPI({
        sessionData: sessionContext,
        drivers: drivers,
        weatherData: weatherData,
      });
      setStrategyText(data?.strategySummary || "### Critical Error\nFailed to sync with the Gemini engine.");
    } catch (e) {
      console.error("AI Strategy fetch error", e);
      setStrategyText("### Critical Error\nFailed to sync with the Gemini engine.");
    } finally {
      setIsAiOptimizing(false);
    }
  };

  // Trigger OpenF1 sync and status updates
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchDriversForSession(),
        fetchWeatherForSession(),
        fetchStrategyPlan(),
      ]);
    } catch (error) {
      console.warn("F1 Relays offline, falling back directly to simulation modes.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Unified fetchDriversForSession that can be used for force refreshing
  const fetchDriversForSession = useCallback(async () => {
    if (!selectedSessionKey) return;
    setIsLoadingDrivers(true);
    try {
      const exactDrivers = await fetchSessionDrivers(
        selectedSessionKey,
        sessionContext.year,
        sessionContext.round,
        sessionContext.sessionType
      );
      setOpenf1Connected(!requestManager.isFallbackActive);
      if (exactDrivers && exactDrivers.length > 0) {
        setDrivers(exactDrivers);
        const mappedRaw = exactDrivers.map((d: any) => ({
          driver_number: d.number,
          name_acronym: d.code,
          full_name: d.fullName,
          team_name: d.team,
          team_colour: d.color ? d.color.replace("#", "") : "FFFFFF",
          broadcast_name: d.fullName.toUpperCase(),
          country_code: d.code.substring(0, 2),
          headshot_url: ""
        }));
        setRawDrivers(mappedRaw);
      } else {
        setDrivers([]);
        setRawDrivers([]);
      }
    } catch (error) {
      console.error("Failed to refresh drivers", error);
    } finally {
      setIsLoadingDrivers(false);
    }
  }, [selectedSessionKey, sessionContext.year, sessionContext.round, sessionContext.sessionType]);

  // Dynamically update weather state on session change (Issue #9)
  const fetchWeatherForSession = useCallback(async () => {
    if (!selectedSessionKey) return;
    try {
      const info = await fetchWeather(selectedSessionKey);
      setWeatherData({
        trackTemp: info.track_temperature,
        airTemp: info.air_temperature,
        humidity: info.humidity,
        windSpeed: info.wind_speed,
        status: info.rainfall > 0 ? "WET TRACK" : "GREEN FLAG",
        drsEnabled: info.rainfall === 0,
        ...info as any // Pass raw F1 parameters for sub-components (Issue #9)
      });
    } catch (err) {
      console.error("Error fetching live weather:", err);
    }
  }, [selectedSessionKey]);

  // Initial OpenF1 Cascading Trigger on load
  useEffect(() => {
    handleYearChangeAction(sessionContext.year);
  }, []);

  // Auto trigger strategists on load
  useEffect(() => {
    fetchStrategyPlan();
  }, []);


  // Page level render route dispatcher
  const renderPage = () => {
    if (isLoadingDrivers && activePage !== "settings") {
      return (
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-xl flex flex-col items-center justify-center space-y-6 animate-pulse">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Syncing Live Telemetry</h2>
            <p className="text-slate-400 text-sm leading-relaxed font-mono">
              Connecting to OpenF1 feeds and calibrating AI strategy models...
            </p>
          </div>
        </div>
      );
    }

    const telemetryPages = ["dashboard", "live_timing", "telemetry", "lap_analysis", "comparison", "tyre_analysis", "replay", "ai_strategist", "weather"];
    if (selectedSessionKey && drivers.length === 0 && telemetryPages.includes(activePage)) {
      return (
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-xl flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
            <AlertTriangle className="h-10 w-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">No Live Data Available</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We couldn't retrieve live timing or telemetry for the selected session.
              The OpenF1 service may be offline or the session might not have active telemetry recorded.
            </p>
          </div>
          <div className="w-full h-[1px] bg-slate-800" />
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchDriversForSession().finally(() => setIsRefreshing(false));
              }}
              className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return (
          <DashboardView
            sessionContext={sessionContext}
            drivers={drivers}
            lapsData={[]}
            telemetryData={[]}
            weatherData={weatherData}
            strategyText={strategyText}
            isAiOptimizing={isAiOptimizing}
            onRefreshAi={fetchStrategyPlan}
            meetings={meetings}
            onMeetingChange={handleMeetingChangeAction}
          />
        );
      case "live_timing":
        return <LiveTimingView sessionKey={selectedSessionKey} drivers={drivers} />;
      case "telemetry":
        return <TelemetryView drivers={drivers} sessionKey={selectedSessionKey} />;
      case "ai_strategist": {
        const activeSessionObj = sessions.find((s) => String(s.session_key) === String(selectedSessionKey)) || null;
        return (
          <AiStrategistView
            session={activeSessionObj}
            drivers={drivers.length > 0 ? drivers : rawDrivers}
            userId={currentUser?.uid || null}
            sessionContext={sessionContext}
            years={years}
            meetings={meetings}
            sessions={sessions}
            selectedMeetingKey={selectedMeetingKey}
            selectedSessionKey={selectedSessionKey}
            onYearChange={handleYearChangeAction}
            onMeetingChange={handleMeetingChangeAction}
            onSessionChange={handleSessionChangeAction}
          />
        );
      }
      case "lap_analysis":
        return <LapAnalysisView sessionKey={selectedSessionKey} drivers={drivers} />;
      case "comparison":
        return <ComparisonView drivers={drivers} sessionKey={selectedSessionKey} />;
      case "weather":
        return <WeatherView sessionKey={selectedSessionKey} weatherData={weatherData} />;
      case "tyre_analysis":
        return <TyreAnalysisView sessionKey={selectedSessionKey} drivers={drivers} />;
      case "replay":
        return (
          <ReplayView
            drivers={drivers}
            activeCircuitKey={sessionContext.round}
            meetings={meetings}
            onMeetingChange={handleMeetingChangeAction}
          />
        );
      case "settings":
        return (
          <SettingsView
            user={currentUser}
            onLogin={handleLocalSignIn}
            onLogout={handleLogout}
            isFirebaseActive={isFirebaseActive}
            onFirebaseGoogleSignIn={handleFirebaseGoogleSignIn}
            onFirebaseEmailSignIn={handleFirebaseEmailSignIn}
            authError={authError}
          />
        );
      default:
        return (
          <div className="text-white font-mono text-center py-10">
            Page {activePage} is currently active.
          </div>
        );
    }
  };

  if (showIntro) {
    return <StartupIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="flex h-screen overflow-hidden grid-bg relative">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* SIDEBAR COMPONENT */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sessionContext={sessionContext}
        onYearChange={handleYearChangeAction}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        years={years}
        meetings={meetings}
        sessions={sessions}
        selectedMeetingKey={selectedMeetingKey}
        onMeetingChange={handleMeetingChangeAction}
        selectedSessionKey={selectedSessionKey}
        onSessionChange={handleSessionChangeAction}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* CORE WORKSPACE PANEL */}
      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        {/* HEADER */}
        <Header
          sessionContext={sessionContext}
          aiActive={isAiOptimizing || !!(strategyText && strategyText.includes("Live AI"))}
          openf1Connected={openf1Connected}
          isLive={true}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* WORKSPACE APP VIEWS SCROLL CONSOLE */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {renderPage()}
          </div>
        </main>

        {/* BOTTOM BRAND FOOTER BAR */}
        <footer className="bg-slate-950/90 border-t border-[#1E293B] px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-gray-500 shrink-0 select-none text-center sm:text-left">
          <span>APEX CTRL v4.0 | AI POWERED FORMULA 1 TELEMETRY & RACE STRATEGY PLATFORM</span>
          <span className="flex items-center gap-1">
            DATA SOURCE: <span className="text-[#00D2BE] font-bold">OPENF1.ORG</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
