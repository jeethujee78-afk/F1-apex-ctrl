# ui/ai_race_intelligence_center.py
import streamlit as st

def render_ai_race_intelligence_center():
    """
    Renders high-contrast AI analysis roster cards for principal drivers.
    """
    st.markdown("<p style='color:#00D2BE;font-weight:700;margin-bottom:2px;'>✨ AI RACE INTELLIGENCE CENTER</p>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        <div style="background:rgba(255,128,0,0.06);border:1px solid rgba(255,128,0,0.3);border-radius:8px;padding:12px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;">
                <span style="color:#FF8000;font-weight:700;font-size:1.1rem;">LANDO NORRIS</span>
                <span style="background:rgba(255,128,0,0.2);color:#ff9800;font-size:0.75rem;padding:2px 6px;border-radius:4px;font-weight:700;">McLAREN</span>
            </div>
            <div style="margin-top:8px;">
                <p style="margin:2px 0;font-size:0.75rem;color:#4ade80;">✔️ Better Corner Exit</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#4ade80;">✔️ Tyre Preservation</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#4ade80;">✔️ DRS Efficiency Strong</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#f87171;">❌ Sector 3 Loss</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#f87171;">❌ Rear Tyre Wear</p>
            </div>
            <div style="margin-top:10px;border-top:1px solid rgba(255,128,0,0.15);padding-top:6px;display:flex;justify-content:space-between;font-size:0.78rem;">
                <span>STINT STRATEGY:</span>
                <strong style="color:#00D2BE;">LAP 37 - 40 (MEDIUM)</strong>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    with col2:
        st.markdown("""
        <div style="background:rgba(54,113,198,0.06);border:1px solid rgba(54,113,198,0.3);border-radius:8px;padding:12px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;">
                <span style="color:#3671C6;font-weight:700;font-size:1.1rem;">MAX VERSTAPPEN</span>
                <span style="background:rgba(54,113,198,0.2);color:#3671c6;font-size:0.75rem;padding:2px 6px;border-radius:4px;font-weight:700;">RED BULL</span>
            </div>
            <div style="margin-top:8px;">
                <p style="margin:2px 0;font-size:0.75rem;color:#4ade80;">✔️ Top Speed Advantage</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#4ade80;">✔️ Braking Stability</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#4ade80;">✔️ ERS Efficiency</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#f87171;">❌ Tyre Degradation</p>
                <p style="margin:2px 0;font-size:0.75rem;color:#f87171;">❌ Corner Entry Instability</p>
            </div>
            <div style="margin-top:10px;border-top:1px solid rgba(54,113,198,0.15);padding-top:6px;display:flex;justify-content:space-between;font-size:0.78rem;">
                <span>STINT STRATEGY:</span>
                <strong style="color:#00D2BE;">LAP 35 - 38 (MEDIUM)</strong>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("""
    <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:10px;font-size:0.8rem;color:#94a3b8;line-height:1.4;">
        💡 <strong>STRATEGIST MEMORANDUM:</strong> Dynamic undercut margins suggest the delta trigger lap for Lando is <strong>Lap 38</strong> to successfully defend the top lock in sector 1 traffic blocks.
    </div>
    """, unsafe_allow_html=True)
