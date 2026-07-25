# ui/control_panel.py
import streamlit as st
import pandas as pd
from services.openf1_client import fetch_sessions_by_year, fetch_drivers_by_session, check_openf1_status

def render_sidebar_control_panel():
    """
    Renders cascading dropdown controls for season selections and connection diagnostics in the sidebar.
    """
    st.sidebar.image("https://media.formula1.com/content/dam/fom-website/manual/misc/F1_logo_red.png", width=120)
    st.sidebar.markdown("<h3 style='margin-top:0px;'>CONTROL CENTER</h3>", unsafe_allow_html=True)
    
    # 1. Page Selection
    pages = {
        "dashboard": "🏁 DASHBOARD",
        "live_timing": "⏱️ LIVE TIMING",
        "telemetry": "📈 TELEMETRY",
        "ai_strategist": "🤖 AI STRATEGIST",
        "lap_analysis": "📊 LAP ANALYSIS",
        "comparison": "⚔️ COMPARISON",
        "weather": "🌦️ WEATHER",
        "tyre_analysis": "🧪 TYRE ANALYSIS",
        "settings": "⚙️ SETTINGS"
    }
    
    # Render neat custom radio dials or buttons
    selected_page_id = st.sidebar.radio(
        "NAVIGATION DESK",
        options=list(pages.keys()),
        format_func=lambda x: pages[x],
        index=0,
        key="selected_page_key"
    )
    
    # 2. Session Selector dropdowns
    st.sidebar.markdown("---")
    st.sidebar.markdown("<h4>SESSION SELECTOR</h4>", unsafe_allow_html=True)
    
    year_options = [2025, 2024]
    selected_year = st.sidebar.selectbox("CHAMPIONSHIP YEAR", year_options, index=0)
    
    sessions_df = fetch_sessions_by_year(selected_year)
    meeting_options = []
    selected_meeting_name = "Miami Grand Prix"
    selected_session_key = 9522
    
    if not sessions_df.empty:
        unique_gps = sessions_df[["meeting_name", "location", "session_key"]].drop_duplicates()
        meeting_options = unique_gps["meeting_name"].tolist()
        selected_meeting_name = st.sidebar.selectbox("ROUND / LOCATION", meeting_options, index=0)
        
        selected_session_row = sessions_df[sessions_df["meeting_name"] == selected_meeting_name].iloc[0]
        selected_session_key = selected_session_row["session_key"]
        selected_session_name = selected_session_row.get("session_name", "Race")
    else:
        st.sidebar.warning("No live rounds pulled. Using cached catalog.")
        selected_meeting_name = "Miami Grand Prix"
        selected_session_key = 9522
        selected_session_name = "Race"
        
    st.sidebar.markdown(f"**SESSION LIMITS:** `{selected_session_name}`")
    
    # 3. Connection Diagnostics Indicators
    st.sidebar.markdown("---")
    is_api_online = check_openf1_status()
    
    if is_api_online:
        st.sidebar.markdown("""
        <div class="status-badge">🟢 OPENF1: CONNECTED</div>
        """, unsafe_allow_html=True)
    else:
        st.sidebar.markdown("""
        <div class="status-badge" style="background-color: rgba(234, 180, 8, 0.1); color: #eab308; border-color: rgba(234, 180, 8, 0.3);">
            ⚠️ SIMULATOR ACTIVE
        </div>
        """, unsafe_allow_html=True)
        
    # Big dynamic refresh trigger
    refresh_click = st.sidebar.button("🚨 REFRESH DATA STREAM", type="primary", use_container_width=True)
    if refresh_click:
        with st.sidebar.spinner("Re-syncing streams..."):
            st.cache_data.clear()
            st.success("Synchronized successfully!")
            st.rerun()
            
    st.sidebar.markdown("<p style='font-size:0.75rem;color:#64748b;text-align:center;margin-top:14px;'>POWERED BY OPENF1 API</p>", unsafe_allow_html=True)
    
    return {
        "page": selected_page_id,
        "year": selected_year,
        "meeting_name": selected_meeting_name,
        "session_key": selected_session_key
    }
