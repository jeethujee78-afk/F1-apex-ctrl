# ui/dashboard.py
import streamlit as st
import pandas as pd
from ui.styles import render_top_bar_stats
from ui.cinematic_replay import render_cinematic_interactive_replay
from ui.ai_race_intelligence_center import render_ai_race_intelligence_center
from ui.telemetry_analysis import render_telemetry_analysis_view
from ui.lap_time_comparison import render_lap_time_comparison_view
from services.openf1_client import fetch_drivers_by_session, fetch_session_weather, fetch_session_laps
from services.data_service import build_driver_timing_records

def render_dashboard_page(session_key, meeting_name):
    """
    Renders the beautiful complete primary live dashboard desk.
    """
    drivers_df = fetch_drivers_by_session(session_key)
    weather_df = fetch_session_weather(session_key)
    laps_df = fetch_session_laps(session_key)
    
    # 1. Weather and ambient limits header row
    weather_metrics = {
        "air_temp": 28.1,
        "track_temp": 38.2,
        "humidity": 62,
        "wind_speed": 14,
        "rainfall_index": 0.0
    }
    if not weather_df.empty:
        weather_metrics["air_temp"] = round(weather_df["air_temperature"].mean(), 1)
        weather_metrics["track_temp"] = round(weather_df["track_temperature"].mean(), 1)
        weather_metrics["humidity"] = int(weather_df["humidity"].mean())
        weather_metrics["wind_speed"] = int(weather_df["wind_speed"].mean())
        weather_metrics["rainfall_index"] = round(weather_df["rainfall"].mean(), 2)
        
    render_top_bar_stats(weather_metrics, 56, 57)
    
    # 2. Driver comparative VS rows
    st.markdown("""
    <div style="background:rgba(9,13,29,0.7);border:1px solid rgba(40,55,80,0.45);border-radius:10px;padding:14px 20px;margin-bottom:14px;box-shadow:0 4px 15px rgba(0,0,0,0.3);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="text-align:left;">
                <span style="font-size:0.8rem;color:#94a3b8;font-weight:700;">DRIVER 1</span><br/>
                <strong style="font-size:1.4rem;color:#FF8000;font-family:'Space Grotesk';">#4 NORRIS</strong><br/>
                <span style="font-family:'JetBrains Mono',monospace;color:#f8fafc;font-size:0.85rem;">BEST LAP: 1:27.456</span>
            </div>
            <div style="text-align:center;">
                <span style="background:rgba(225,6,0,0.15);color:#E10600;font-size:0.75rem;padding:4px 10px;border-radius:6px;font-weight:700;letter-spacing:0.05em;">DELTA</span><br/>
                <strong style="font-size:1.45rem;color:#ff3344;font-family:'JetBrains Mono';">-0.248s</strong>
            </div>
            <div style="text-align:right;">
                <span style="font-size:0.8rem;color:#94a3b8;font-weight:700;">DRIVER 2</span><br/>
                <strong style="font-size:1.4rem;color:#3671C6;font-family:'Space Grotesk';">#1 VERSTAPPEN</strong><br/>
                <span style="font-family:'JetBrains Mono',monospace;color:#f8fafc;font-size:0.85rem;">BEST LAP: 1:27.208</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # 3. Main cinematic replay and AI center
    col_main1, col_main2 = st.columns([1.2, 0.8])
    with col_main1:
        st.markdown("<div class='glass-card' style='padding:18px;'>", unsafe_allow_html=True)
        render_cinematic_interactive_replay(meeting_name)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col_main2:
        st.markdown("<div class='glass-card' style='padding:18px;'>", unsafe_allow_html=True)
        render_ai_race_intelligence_center()
        st.markdown("</div>", unsafe_allow_html=True)
        
    # 4. Seven metrics bottom cards row
    col_k1, col_k2, col_k3, col_k4, col_k5, col_k6, col_k7 = st.columns(7)
    with col_k1:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">⏱️ FASTEST LAP</div><strong style="font-size:0.95rem;color:#00ffdd;font-family:'JetBrains Mono';">1:27.208</strong><div style="font-size:0.6rem;color:#64748b;">(VER)</div></div>""", unsafe_allow_html=True)
    with col_k2:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">🏎️ TOP SPEED</div><strong style="font-size:0.95rem;color:#f8fafc;font-family:'JetBrains Mono';">331 KM/H</strong><div style="font-size:0.6rem;color:#64748b;">(S1 TRAP)</div></div>""", unsafe_allow_html=True)
    with col_k3:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">📊 AVG SPEED</div><strong style="font-size:0.95rem;color:#f8fafc;font-family:'JetBrains Mono';">234 KM/H</strong><div style="font-size:0.6rem;color:#64748b;">(OVERALL)</div></div>""", unsafe_allow_html=True)
    with col_k4:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">🎗️ BEST SECTOR</div><strong style="font-size:0.95rem;color:#ff9800;font-family:'JetBrains Mono';">27.456</strong><div style="font-size:0.6rem;color:#64748b;">(NOR S1)</div></div>""", unsafe_allow_html=True)
    with col_k5:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">🧪 COMPOUND</div><strong style="font-size:0.95rem;color:#facc15;font-family:'JetBrains Mono';">MEDIUM</strong><div style="font-size:0.6rem;color:#64748b;">(63% LIFE)</div></div>""", unsafe_allow_html=True)
    with col_k6:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">⛽ FUEL LOAD</div><strong style="font-size:0.95rem;color:#22c55e;font-family:'JetBrains Mono';">32.4 KG</strong><div style="font-size:0.6rem;color:#64748b;">(HIGH LOAD)</div></div>""", unsafe_allow_html=True)
    with col_k7:
        st.markdown("""<div class="glass-card" style="padding:10px;"><div style="font-size:0.7rem;color:#94a3b8;">🚀 DRS STATUS</div><strong style="font-size:0.95rem;color:#00ffdd;font-family:'JetBrains Mono';">89% HIGH</strong><div style="font-size:0.6rem;color:#64748b;">(DEFENSE)</div></div>""", unsafe_allow_html=True)
        
    # 5. Telemetry overlays, lap deltas, and checker
    col_low1, col_low2, col_low3 = st.columns([1, 1, 0.9])
    with col_low1:
        st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
        render_telemetry_analysis_view(session_key, 4, 1, "NORRIS", "VERSTAPPEN", "#FF8000", "#3671C6")
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col_low2:
        st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
        render_lap_time_comparison_view(session_key, 4, 1, "NORRIS", "VERSTAPPEN", "#FF8000", "#3671C6")
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col_low3:
        st.markdown("<div class='glass-card' style='padding:15px; min-height:265px;'>", unsafe_allow_html=True)
        st.markdown("<p style='color:#00D2BE;font-weight:700;margin-bottom:6px;'>📋 AI STRATEGIST SUMMARY</p>", unsafe_allow_html=True)
        st.markdown("""
        <div style="font-size:0.78rem;line-height:1.65;font-family:'Inter',sans-serif;color:#f8fafc;">
            🟢 Tire Performance: <strong>STABLE</strong><br/>
            🟡 Degradation Trend: <strong>MEDIUM</strong><br/>
            🚀 Pit Window: <strong>LAP 37 - 40</strong><br/>
            ⚠️ Win Probability: <strong style="color:#ff9800;">74% NORRIS</strong><br/>
            🔥 Aggression Index: <strong>81 / 100</strong><br/>
            📈 Consistency Score: <strong style="color:#22c55e;">88 / 100</strong><br/>
            🏆 Race Prediction: <strong style="color:#00ffdd;">NORRIS WINS</strong>
        </div>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
