# ui/ai_strategist_page.py
import streamlit as st
import os
from services.openf1_client import fetch_drivers_by_session, fetch_session_weather
from analytics.strategy_engine import calculate_optimal_pit_stops

def fetch_llm_race_brief(session_name, weather_summary, leader_acronyms):
    """
    Sends contextual prompt descriptors directly to Gemini LLM if key is present.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return f"""### **🏎️ AI AUTOPILOT - PRINCIPAL STRATEGIST CORE**
*Live credentials pending. Loading locally cached high-fidelity Race Engineer briefs.*

**TACTICAL STRATEGY MEMORANDUM ({session_name}):**

1. **🔥 THERMAL GRAINING OFFSET CHANNELS:**
   * Expected track temperature of **{weather_summary['track_temp']}°C** will trigger accelerated sidewall breakdown inside Soft compound shoulder zones.
   * Medium ➡️ Hard is the optimal 1-stop pit sequence under standard track degradation.
   
2. **⏳ PIT WINDOW UNDER-CUT TRAJECTORIES:**
   * **Under-cut Trigger Line**: Lap 14-18. Out-lap delta is estimated around +1.28s due to fresher surface friction.
   * **Over-cut Trigger Line**: Maintain target pace on Mediums until Lap 26 if frontrunners hit thermal traffic streams.
   
3. **🔋 ERS ENERGY CELL BALANCING:**
   * Harvest thermal power inside Sector 2 chicanes. Deploy ERS cells fully at the exit of Sector 3 to defend straight line velocity.
   
*To unlock custom context-dependent LLM strategist updates, configure **GEMINI_API_KEY** in the Settings panel.*"""

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        You are the Head F1 Race Strategist for APEX INTELLIGENCE.
        Write a hyper-detailed, technical, professional, and scientific Race Strategy briefing for {session_name}.
        Environmental factors: Track Temp {weather_summary['track_temp']}°C, Air Temp {weather_summary['air_temp']}°C, Humidity {weather_summary['humidity']}%.
        Leading competitors acronyms list: {leader_acronyms}.
        
        Format your response cleanly in Markdown outlining:
        1. STRATEGIC COMPOSITIONS & PIT LATENCIES (windows for soft, medium, hard).
        2. UNDERCUT VS OVERCUT PROBABILITIES.
        3. DRS & REAR ERS ENERGY STORAGE TARGETS.
        Do not use flowery or introductory text. Use clean engineer language.
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI motorsports cluster warning: {str(e)}"

def render_ai_strategist_page(session_key, meeting_name):
    """
    Renders the dedicated AI Strategist and Pit Strategy workspace.
    """
    st.markdown("<h2>🤖 AI STRATEGIST CO-PILOT</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Formulate optimal pit stops, evaluate undelines, and compile strategy blueprints using Gemini AI.</p>", unsafe_allow_html=True)
    
    drivers_df = fetch_drivers_by_session(session_key)
    weather_df = fetch_session_weather(session_key)
    
    leaders_list = ["VER", "NOR", "LEC"]
    if not drivers_df.empty:
        leaders_list = drivers_df["name_acronym"].head(3).tolist()
        
    weather_summary = {"air_temp": 28.1, "track_temp": 38.2, "humidity": 62}
    if not weather_df.empty:
        weather_summary["air_temp"] = float(round(weather_df["air_temperature"].mean(), 1))
        weather_summary["track_temp"] = float(round(weather_df["track_temperature"].mean(), 1))
        weather_summary["humidity"] = int(weather_df["humidity"].mean())
        
    # Pit-stop constants calculation
    pit_data = calculate_optimal_pit_stops(meeting_name)
    
    col1, col2 = st.columns([1.1, 0.9])
    with col1:
        st.markdown("<h4 style='color:#00D2BE;'>🧠 LLM CO-PILOT ENGINEER CONSOLE</h4>", unsafe_allow_html=True)
        
        run_bot = st.button("RUN DYNAMIC AI STRATEGY MODEL", type="primary", use_container_width=True)
        
        if run_bot:
            with st.spinner("Compiling telemetry inputs and consulting Gemini..."):
                outcome_text = fetch_llm_race_brief(meeting_name, weather_summary, leaders_list)
                st.markdown(outcome_text)
        else:
            st.info("Trigger strategist analysis model to compile live recommendations.")
            # Default presentation brief
            st.markdown(fetch_llm_race_brief(meeting_name, weather_summary, leaders_list))
            
    with col2:
        st.markdown("<h4 style='color:#00D2BE;'>🧬 COMPOUND LIFESPAN INTERVALS</h4>", unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #ef4444;">
            <strong style="color:#ef4444;">🔴 SOFT COMPOUND MATRIX</strong>
            <p style="margin:5px 0 0 0;font-size:0.84rem;color:#f8fafc;">
                Pit Window: <strong>Lap {pit_data['soft_window']['start']} - {pit_data['soft_window']['end']}</strong><br/>
                Lifespan Boundary: {pit_data['soft_window']['max_life']} Laps.<br/>
                Characteristics: Maximum initial speed grip, high degradation in warm thermal lanes.
            </p>
        </div>
        
        <div class="glass-card" style="border-left-color: #eab308;">
            <strong style="color:#eab308;">🟡 MEDIUM COMPOUND MATRIX</strong>
            <p style="margin:5px 0 0 0;font-size:0.84rem;color:#f8fafc;">
                Pit Window: <strong>Lap {pit_data['medium_window']['start']} - {pit_data['medium_window']['end']}</strong><br/>
                Lifespan Boundary: {pit_data['medium_window']['max_life']} Laps.<br/>
                Characteristics: Optimum pace balance, sustainable over moderate periods.
            </p>
        </div>
        
        <div class="glass-card" style="border-left-color: #f8fafc;">
            <strong style="color:#f8fafc;">⚪ HARD COMPOUND MATRIX</strong>
            <p style="margin:5px 0 0 0;font-size:0.84rem;color:#f8fafc;">
                Pit Window: <strong>Lap {pit_data['hard_window']['start']} - {pit_data['hard_window']['end']}</strong><br/>
                Lifespan Boundary: {pit_data['hard_window']['max_life']} Laps.<br/>
                Characteristics: Minimal thermal graining, slow temperature warm-up loops.
            </p>
        </div>
        
        <div class="glass-card" style="background:rgba(0,210,190,0.1) !important;border-color:rgba(0,210,190,0.3) !important;">
            <span style="font-size:0.72rem;color:#00D2BE;font-weight:700;">⏱️ ESTIMATED PIT LANE LOSS PENALTY</span>
            <div style="font-family:'JetBrains Mono',monospace;font-size:2rem;font-weight:700;color:white;margin:4px 0;">
                {pit_data['pit_loss_sec']}s
            </div>
            <span style="font-size:0.68rem;color:#94a3b8;">Average time elapsed inside active pit boxes relative to back straight speed index.</span>
        </div>
        """, unsafe_allow_html=True)
print("AI Strategist ready.")
