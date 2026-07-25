# ui/telemetry_analysis.py
import streamlit as st
import plotly.graph_objects as go
import pandas as pd
from services.openf1_client import fetch_driver_telemetry
from config.settings import APEX_THEME

def render_telemetry_analysis_view(session_key, num_a, num_b, name_a, name_b, col_a_hex, col_b_hex):
    """
    Renders comparative analytics plots for speed and input pedals.
    """
    st.markdown("<p style='color:#00D2BE;font-weight:700;margin-bottom:2px;'>📈 TELEMETRY OVERLAY ANALYSIS</p>", unsafe_allow_html=True)
    
    tele_a = fetch_driver_telemetry(session_key, num_a)
    tele_b = fetch_driver_telemetry(session_key, num_b)
    
    col1, col2 = st.columns(2)
    with col1:
        # Velocity overlapping lines
        fig_vel = go.Figure()
        fig_vel.add_trace(go.Scatter(y=tele_a["speed"], mode='lines', name=name_a, line=dict(color=col_a_hex, width=2.5)))
        fig_vel.add_trace(go.Scatter(y=tele_b["speed"], mode='lines', name=name_b, line=dict(color=col_b_hex, width=2.5)))
        fig_vel.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=20, r=20, t=10, b=20),
            xaxis_title="Lap Points Samples",
            yaxis_title="Speed (KM/H)",
            height=200,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig_vel, use_container_width=True)
        
    with col2:
        # Pedal indexes overlays
        fig_ped = go.Figure()
        fig_ped.add_trace(go.Scatter(y=tele_a["throttle"], mode='lines', name=f"{name_a} Thr", line=dict(color=col_a_hex, width=2)))
        fig_ped.add_trace(go.Scatter(y=tele_a["brake"], mode='lines', name=f"{name_a} Brk", line=dict(color=col_a_hex, width=1.5, dash="dash")))
        fig_ped.add_trace(go.Scatter(y=tele_b["throttle"], mode='lines', name=f"{name_b} Thr", line=dict(color=col_b_hex, width=2)))
        fig_ped.add_trace(go.Scatter(y=tele_b["brake"], mode='lines', name=f"{name_b} Brk", line=dict(color=col_b_hex, width=1.5, dash="dash")))
        fig_ped.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=20, r=20, t=10, b=20),
            xaxis_title="Lap Points Samples",
            yaxis_title="Pedal Input (%)",
            height=200,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig_ped, use_container_width=True)
