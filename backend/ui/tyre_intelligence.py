# ui/tyre_intelligence.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from analytics.strategy_engine import simulate_tyre_degradation, calculate_optimal_pit_stops

def render_tyre_analysis_page(meeting_name):
    """
    Renders dedicated compound lifecycle deteriorations.
    """
    st.markdown("<h2>🧪 TYRE LIFE DEGRADATION INTEL</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Physical friction modeling over compound lifespans, tyre thermal safety buffers, and pit window recommendations.</p>", unsafe_allow_html=True)
    
    # Simulate tyre lifespans
    decay_df = simulate_tyre_degradation()
    pit_data = calculate_optimal_pit_stops(meeting_name)
    
    st.markdown("<h4>📉 Strategic Traction Decay Model Curve (%)</h4>", unsafe_allow_html=True)
    
    # Render decay curves
    fig_deg = go.Figure()
    fig_deg.add_trace(go.Scatter(x=decay_df["Lap"], y=decay_df["Soft_Compound"], mode='lines', name='Soft Compound 🔴', line=dict(color='#ef4444', width=3.5)))
    fig_deg.add_trace(go.Scatter(x=decay_df["Lap"], y=decay_df["Medium_Compound"], mode='lines', name='Medium Compound 🟡', line=dict(color='#eab308', width=3.5)))
    fig_deg.add_trace(go.Scatter(x=decay_df["Lap"], y=decay_df["Hard_Compound"], mode='lines', name='Hard Compound ⚪', line=dict(color='#f8fafc', width=3.5)))
    
    fig_deg.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=35, r=35, t=10, b=35),
        xaxis_title="Completed Stint Lap Count",
        yaxis_title="Compound Traction Force (%)",
        height=320,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig_deg, use_container_width=True)
    
    # Pit lane windows columns
    st.markdown("<h4>🛠️ RECOMMENDED TACTICAL PIT WINDOWS</h4>", unsafe_allow_html=True)
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(f"""
        <div style="background-color:rgba(239,68,68,0.06);border:1px solid #ef4444;border-radius:10px;padding:16px;">
            <strong style="color:#ef4444;font-size:1rem;">🔴 SOFT PIT WINDOW</strong>
            <p style="margin:8px 0 0 0;font-size:0.86rem;color:#f8fafc;line-height:1.5;">
                Recommended Laps: <strong>Lap {pit_data['soft_window']['start']} - {pit_data['soft_window']['end']}</strong><br/>
                Theoretical Max Lifespan: {pit_data['soft_window']['max_life']} Laps<br/>
                <span style="color:#ef4444;font-size:0.75rem;">Status: High thermal graining warning</span>
            </p>
        </div>
        """, unsafe_allow_html=True)
        
    with col2:
        st.markdown(f"""
        <div style="background-color:rgba(234,179,8,0.06);border:1px solid #eab308;border-radius:10px;padding:16px;">
            <strong style="color:#eab308;font-size:1rem;">🟡 MEDIUM PIT WINDOW</strong>
            <p style="margin:8px 0 0 0;font-size:0.86rem;color:#f8fafc;line-height:1.5;">
                Recommended Laps: <strong>Lap {pit_data['medium_window']['start']} - {pit_data['medium_window']['end']}</strong><br/>
                Theoretical Max Lifespan: {pit_data['medium_window']['max_life']} Laps<br/>
                <span style="color:#eab308;font-size:0.75rem;">Status: Optimal balanced pace window</span>
            </p>
        </div>
        """, unsafe_allow_html=True)
        
    with col3:
        st.markdown(f"""
        <div style="background-color:rgba(248,250,252,0.06);border:1px solid #f8fafc;border-radius:10px;padding:16px;">
            <strong style="color:#f8fafc;font-size:1rem;">⚪ HARD PIT WINDOW</strong>
            <p style="margin:8px 0 0 0;font-size:0.86rem;color:#f8fafc;line-height:1.5;">
                Recommended Laps: <strong>Lap {pit_data['hard_window']['start']} - {pit_data['hard_window']['end']}</strong><br/>
                Theoretical Max Lifespan: {pit_data['hard_window']['max_life']} Laps<br/>
                <span style="color:#22c55e;font-size:0.75rem;">Status: Maximum structural endurance</span>
            </p>
        </div>
        """, unsafe_allow_html=True)
