# ui/styles.py
import streamlit as st

def apply_mission_desk_styling():
    """
    Injects dark dashboard CSS overrides into Streamlit context to mirror a F1 Mission Control center.
    """
    st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    
    :root {
        --bg-dark: #070913;
        --card-bg: rgba(10, 15, 33, 0.85);
        --glow-teal: #00D2BE;
        --glow-red: #E10600;
        --text-white: #F8FAFC;
        --border-slate: rgba(30, 41, 59, 0.5);
    }
    
    /* Core Body Styling */
    .stApp {
        background-color: #030409 !important;
        background-image: 
            radial-gradient(ellipse at top, rgba(20, 30, 60, 0.65) 0%, rgba(3, 4, 9, 1) 75%),
            radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px) !important;
        background-size: 100% 100%, 20px 20px !important;
        color: #E2E8F0 !important;
        font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    /* Hide default decoration stream elements from low quality templates */
    #MainMenu, footer, header {visibility: hidden;}
    
    /* Standard Navigation Override Box styling */
    section[data-testid="stSidebar"] {
        background-color: #05070e !important;
        border-right: 1px solid rgba(30, 41, 59, 0.6) !important;
    }
    
    /* Typography Overrides */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Space Grotesk', sans-serif !important;
        color: var(--text-white) !important;
        font-weight: 600 !important;
    }
    
    /* Metrics panel styled cleanly */
    span.stMetricValue {
        font-family: 'JetBrains Mono', monospace !important;
        font-weight: 700;
        color: var(--glow-teal) !important;
    }
    
    /* Clean custom mission card definitions */
    .glass-card {
        background: rgba(13, 20, 45, 0.8) !important;
        border: 1px solid rgba(40, 55, 80, 0.45) !important;
        border-radius: 10px !important;
        padding: 16px 20px !important;
        margin-bottom: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45) !important;
    }
    
    .glass-card-accent {
        background: rgba(13, 20, 45, 0.9) !important;
        border: 1px solid rgba(0, 210, 190, 0.35) !important;
        border-radius: 10px !important;
        padding: 16px 20px !important;
        box-shadow: 0 0 15px rgba(0, 210, 190, 0.08) !important;
        margin-bottom: 12px !important;
    }
    
    .metric-title {
        font-size: 0.75rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 4px;
    }
    
    .metric-val {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.45rem;
        color: var(--text-white);
        font-weight: 700;
    }
    
    /* Status indicators */
    .status-badge {
        display: inline-flex;
        align-items: center;
        background-color: rgba(0, 210, 190, 0.1);
        color: #00D2BE;
        border: 1px solid rgba(0, 210, 190, 0.3);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        gap: 6px;
    }
    
    .status-badge-red {
        display: inline-flex;
        align-items: center;
        background-color: rgba(225, 6, 0, 0.1);
        color: #ff3344;
        border: 1px solid rgba(225, 6, 0, 0.3);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        gap: 6px;
    }
    
    /* Custom buttons and layouts centering components */
    .glowing-header-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(9, 13, 29, 0.85);
        border: 1px solid rgba(30, 41, 59, 0.6);
        border-radius: 10px;
        padding: 12px 18px;
        margin-bottom: 15px;
    }
</style>
""", unsafe_allow_html=True)

def render_top_bar_stats(weather_metrics, current_lap, total_laps):
    """
    Renders the beautiful glassmorphism stat row under the header page.
    """
    # Grid of weather/track status
    col1, col2, col3, col4, col5 = st.columns(5)
    with col1:
        st.markdown(f"""
        <div class="glass-card" style="border-left: 3px solid #E10600;">
            <div class="metric-title">🌡️ Track Temp</div>
            <div class="metric-val">{weather_metrics['track_temp']}°C</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
        <div class="glass-card" style="border-left: 3px solid #3b82f6;">
            <div class="metric-title">☁️ Air Temp</div>
            <div class="metric-val">{weather_metrics['air_temp']}°C</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="glass-card" style="border-left: 3px solid #a855f7;">
            <div class="metric-title">💧 Humidity</div>
            <div class="metric-val">{weather_metrics['humidity']}%</div>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown(f"""
        <div class="glass-card" style="border-left: 3px solid #eab308;">
            <div class="metric-title">💨 Wind Speed</div>
            <div class="metric-val">{weather_metrics['wind_speed']} km/h</div>
        </div>
        """, unsafe_allow_html=True)
    with col5:
        bg_col = "rgba(0, 210, 190, 0.15)" if weather_metrics['rainfall_index'] == 0 else "rgba(239, 68, 68, 0.15)"
        text_col = "#00D2BE" if weather_metrics['rainfall_index'] == 0 else "#EF4444"
        lap_string = f"{current_lap} / {total_laps}" if current_lap > 0 else "WARM-UP LAP"
        st.markdown(f"""
        <div class="glass-card" style="border-left: 3px solid {text_col}; background: {bg_col} !important;">
            <div class="metric-title">🏁 TRACK / LAP LIMIT</div>
            <div class="metric-val" style="color: {text_col};">{lap_string}</div>
        </div>
        """, unsafe_allow_html=True)
