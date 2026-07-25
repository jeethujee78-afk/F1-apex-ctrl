# ui/settings_page.py
import streamlit as st
import os

def render_settings_page():
    """
    Renders credentials setup panels and engine configuration variables toggles.
    """
    st.markdown("<h2>⚙️ SYSTEM INTEGRATIONS & SETTINGS</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Manage credentials keys, reset cached tables, and tune numerical physics parameters.</p>", unsafe_allow_html=True)
    
    # 1. API Credentials Key Forms
    st.markdown("<h3>🗝️ API SECRETS & CREDENTIALS</h3>", unsafe_allow_html=True)
    stored_key = os.environ.get("GEMINI_API_KEY", "")
    
    user_key = st.text_input(
        "GEMINI_API_KEY",
        value=stored_key if stored_key else "",
        type="password",
        help="Paste your Gemini API key from Google AI Studio. It secures full dynamic LLM race strategist briefs."
    )
    
    if st.button("Save API Configuration", type="primary"):
        os.environ["GEMINI_API_KEY"] = user_key
        st.success("API credentials saved successfully onto local application environment!")
        
    st.markdown("---")
    
    # 2. Cache Tuning Toggles
    st.markdown("<h3>🗄️ LOCAL PERFORMANCE CACHING</h3>", unsafe_allow_html=True)
    st.write("Streamlit maintains cached memory limits to eliminate rendering latencies.")
    
    if st.button("Purge Active Caches"):
        st.cache_data.clear()
        st.success("Caches swept successfully!")
        
    st.markdown("---")
    
    # 3. Model parameters calibrations
    st.markdown("<h3>🧬 ANALYTICS ENGINE CALIBRATION</h3>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Adjust physical weight offsets in mathematical formulas.</p>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.slider("Traction Wear acceleration Multiplier", min_value=0.5, max_value=2.0, value=1.0, step=0.1)
    with col2:
        st.slider("Fuel Weight drag calculation index", min_value=1.0, max_value=4.0, value=2.2, step=0.2)
