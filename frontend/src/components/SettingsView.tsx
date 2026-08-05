import { useState } from "react";
import { Settings, Shield, Link2, KeyRound } from "lucide-react";
import LoginView from "./LoginView";
import { UserSession } from "../types";

interface SettingsViewProps {
  user: UserSession | null;
  onLogin: (email: string, method: "google" | "email") => void;
  onLogout: () => void;
  isFirebaseActive: boolean;
  onFirebaseGoogleSignIn?: () => Promise<void>;
  onFirebaseEmailSignIn?: (email: string, pass: string, isSignUp: boolean) => Promise<void>;
  authError?: string;
}

export default function SettingsView({
  user,
  onLogin,
  onLogout,
  isFirebaseActive,
  onFirebaseGoogleSignIn,
  onFirebaseEmailSignIn,
  authError,
}: SettingsViewProps) {
  return (
    <div className="bg-slate-950 border border-[#1E293B] rounded-xl p-6 space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div>
          <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
            PLATFORM CONFIGURATION PORTAL
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            Manage data connectors, Gemini AI models, and secure stream relays
          </span>
        </div>
      </div>

      {/* Race Control Authentication (Firebase Auth Integration) */}
      <div className="p-1 border border-dashed border-slate-800 rounded-2xl">
        <LoginView
          user={user}
          onLogin={onLogin}
          onLogout={onLogout}
          isFirebaseActive={isFirebaseActive}
          onFirebaseGoogleSignIn={onFirebaseGoogleSignIn}
          onFirebaseEmailSignIn={onFirebaseEmailSignIn}
          authError={authError}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Credentials Box */}
        <div className="p-5 bg-slate-900/30 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
            <KeyRound className="w-4 h-4 text-[#00D2BE]" />
            <h3 className="font-display font-black text-xs text-white uppercase">AI Secret Injection</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The telemetry system integrates server-side Gemini models. Credentials are managed directly via AI Studio platform secrets securely. 
          </p>

          <div className="p-3.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs flex items-center justify-between">
            <span className="text-gray-400 font-semibold">GEMINI_API_KEY</span>
            <span className="text-emerald-400 font-bold">✓ INJECTED VIA PLATFORM SECRETS</span>
          </div>
        </div>

        {/* Data Stream Box */}
        <div className="p-5 bg-slate-900/30 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-black text-xs text-white uppercase">Data Relays (OpenF1 API)</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Direct high-frequency telemetry requests are channeled using our Express server relay, preventing CORS blocks and rate load balancing automatically.
          </p>

          <div className="p-3.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-semibold">Proxy Host</span>
              <span className="text-white font-bold">active_express_proxy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-semibold">Connection Speed</span>
              <span className="text-cyan-400 font-bold">120 ms (OpenF1 Relays)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
