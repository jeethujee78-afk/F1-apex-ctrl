# streamlit_app.py
import streamlit as st

# ==========================================
# 1. CORE PAGE CONFIGURATION (MUST BE FIRST)
# ==========================================
st.set_page_config(
    page_title="APEX CTRL // AI Race Intelligence System",
    page_icon="🏎️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==========================================
# 2. APPLICATION IMPORTS
# ==========================================
from ui.styles import apply_mission_desk_styling
from ui.control_panel import render_sidebar_control_panel

# Imports for modular page desks
from ui.dashboard import render_dashboard_page
from ui.live_timing_page import render_live_timing_page
from ui.telemetry_page import render_telemetry_page
from ui.ai_strategist_page import render_ai_strategist_page
from ui.lap_analysis_page import render_lap_analysis_page
from ui.driver_comparison_page import render_driver_comparison_page
from ui.weather_intelligence import render_weather_page
from ui.tyre_intelligence import render_tyre_analysis_page
from ui.settings_page import render_settings_page

# ==========================================
# 3. INTERACTIVE RENDERING FLOW
# ==========================================
# Inject CSS overrides stylesheet
apply_mission_desk_styling()

# Header title banner matching reference image layout
st.markdown("""
<div class="glowing-header-block">
    <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.55rem;">🏎️</span>
        <div>
            <h3 style="margin:0px;letter-spacing:0.04em;font-family:'Space Grotesk';font-weight:700;">APEX CTRL PRO</h3>
            <p style="margin:2px 0 0 0;font-size:0.75rem;color:#94a3b8;font-family:'Inter';letter-spacing:0.05em;">AI-POWERED FORMULA 1 RACE INTELLIGENCE PLATFORM</p>
        </div>
    </div>
    <div style="display:flex;gap:10px;align-items:center;">
        <span class="status-badge">🟢 OPENF1 API CONNECTED</span>
        <span class="status-badge" style="background-color:rgba(168,85,247,0.12);color:#c084fc;border-color:rgba(168,85,247,0.35);">⚡ AI CO-PILOT ACTIVE</span>
        <span class="status-badge-red">📡 STREAM LIVE</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Render control selectors panel inside the sidebar
ctx = render_sidebar_control_panel()

# Route the active navigation page to render specific sub-interfaces
active_page = ctx["page"]
session_key = ctx["session_key"]
meeting_name = ctx["meeting_name"]

if active_page == "dashboard":
    render_dashboard_page(session_key, meeting_name)
elif active_page == "live_timing":
    render_live_timing_page(session_key)
elif active_page == "telemetry":
    render_telemetry_page(session_key)
elif active_page == "ai_strategist":
    render_ai_strategist_page(session_key, meeting_name)
elif active_page == "lap_analysis":
    render_lap_analysis_page(session_key, meeting_name)
elif active_page == "comparison":
    render_driver_comparison_page(session_key)
elif active_page == "weather":
    render_weather_page(session_key)
elif active_page == "tyre_analysis":
    render_tyre_analysis_page(meeting_name)
elif active_page == "settings":
    render_settings_page()

# Footer system parameters
st.markdown("""
<p style="font-size:0.75rem;color:#64748b;text-align:center;margin-top:35px;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">
    APEX CTRL v4.0.0 Pro // AI POWERED FORMULA 1 TELEMETRY & RACE STRATEGY MISSION DECK // 2026 GENERAL ACCELERATOR
</p>
""", unsafe_allow_html=True)
