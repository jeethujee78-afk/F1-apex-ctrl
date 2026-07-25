import React, { useState } from "react";
import { UserSession } from "../types";
import { ShieldCheck, Mail, Lock, LogIn, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface LoginViewProps {
  user: UserSession | null;
  onLogin: (email: string, method: "google" | "email") => void;
  onLogout: () => void;
  isFirebaseActive: boolean;
  onFirebaseGoogleSignIn?: () => Promise<void>;
  onFirebaseEmailSignIn?: (email: string, pass: string, isSignUp: boolean) => Promise<void>;
  authError?: string;
}

export default function LoginView({
  user,
  onLogin,
  onLogout,
  isFirebaseActive,
  onFirebaseGoogleSignIn,
  onFirebaseEmailSignIn,
  authError,
}: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [customError, setCustomError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setCustomError("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setCustomError("Password must be at least 6 characters.");
      return;
    }
    setCustomError("");
    setLoading(true);

    try {
      if (isFirebaseActive && onFirebaseEmailSignIn) {
        await onFirebaseEmailSignIn(email, password, isSignUp);
      } else {
        // Fallback simulated credential mapping
        onLogin(email, "email");
      }
    } catch (err: any) {
      setCustomError(err.message || "Credential validation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    setCustomError("");
    try {
      if (isFirebaseActive && onFirebaseGoogleSignIn) {
        await onFirebaseGoogleSignIn();
      } else {
        // Fallback simulated Google authentication
        onLogin("apexctrl0@gmail.com", "google");
      }
    } catch (err: any) {
      setCustomError(err.message || "Google single sign-on failed.");
    } finally {
      setLoading(false);
    }
  };

  const activeError = authError || customError;

  return (
    <div className="max-w-md mx-auto my-4">
      {user ? (
        /* Authenticated profile view */
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-16 w-16 rounded-full bg-cyan-950 border-2 border-cyan-500 font-mono text-cyan-300 flex items-center justify-center text-2xl font-black uppercase shadow-lg shadow-cyan-500/10">
              {user.email.slice(0, 2)}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-100">{user.email}</span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400">
                {user.isAnonymous ? "TEST USER CREDENTIALS" : "SECURE SESSION VERIFIED"}
              </span>
            </div>
          </div>

          <div className="border border-slate-800/80 bg-slate-950 p-4 rounded-xl flex flex-col gap-2.5 text-xs font-mono text-slate-400">
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span>LOCAL SECURITY NODE</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span>PILOT LEVEL</span>
              <span className="text-slate-222">ASTRONAUT</span>
            </div>
            <div className="flex justify-between">
              <span>FIREBASE PROTOCOL</span>
              <span className={isFirebaseActive ? "text-cyan-400 font-bold" : "text-amber-500"}>
                {isFirebaseActive ? "ACTIVE CLOUD" : "LOCAL EMULATION"}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors tracking-wide font-sans cursor-pointer uppercase"
          >
            DISCONNECT SESSION
          </button>
        </div>
      ) : (
        /* Sign-in credentials and google login portal */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-5 backdrop-blur-sm relative"
        >
          <div className="flex flex-col gap-1 text-center">
            <h3 className="text-white text-lg font-bold font-sans flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              Pilot Authorization Terminal
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Secure Race Control Credentials Log
            </p>
          </div>

          {activeError && (
            <div className="bg-rose-950/20 border border-rose-900/50 p-3.5 rounded-xl flex items-start gap-2 text-rose-400 text-xs font-mono">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">AUTH ERROR</p>
                <p className="mt-0.5 opacity-90 leading-tight">{activeError}</p>
              </div>
            </div>
          )}

          {/* Form wrapper */}
          <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="apexctrl0@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Account Security Key (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-slate-100 hover:bg-white disabled:bg-slate-800 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all tracking-wide cursor-pointer uppercase shrink-0"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              {loading ? "Authenticating..." : isSignUp ? "Create Account" : "Access Race Control"}
            </button>
          </form>

          {/* Tab toggler for register/login */}
          <div className="text-center font-mono text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
            <span>{isSignUp ? "Already have an authorization license?" : "Need a new flight license?"}</span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-cyan-400 font-extrabold hover:underline"
            >
              {isSignUp ? "Sign In" : "Register Profile"}
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-850"></div>
            <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-slate-850"></div>
          </div>

          {/* Google SSO Login */}
          <button
            onClick={handleGoogleClick}
            type="button"
            disabled={loading}
            className="w-full border border-slate-800 hover:bg-slate-900 text-slate-300 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2.5 cursor-pointer transition-colors uppercase shrink-0"
          >
            {/* Google G Symbol mock colors */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.91 15.42 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c7.058 0 11.758-4.957 11.758-11.956 0-.807-.087-1.425-.193-1.927h-11.564z"
              />
            </svg>
            Sign In with Google
          </button>

          {/* Cloud guidance note */}
          {!isFirebaseActive && (
            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900 mt-2 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-mono font-bold text-slate-400">DEV ENVIRONMENT MODE</span>
                <span className="text-[9px] text-slate-600 font-sans leading-tight">
                  Running sandbox simulation. Any entry will grant instant safe credentials. Provision Firebase via UI panels to connect live Google Cloud instances.
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
