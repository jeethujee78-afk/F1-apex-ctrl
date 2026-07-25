# ui/lap_time_comparison.py
import streamlit as st
import plotly.graph_objects as go
import pandas as pd
from services.openf1_client import fetch_session_laps

def render_lap_time_comparison_view(session_key, num_a, num_b, name_a, name_b, col_a_hex, col_b_hex):
    """
    Plots lap duration timeseries comparison charts.
    """
    st.markdown("<p style='color:#00D2BE;font-weight:700;margin-bottom:2px;'>⏱️ LAP TIME RADIAL COMPARISON</p>", unsafe_allow_html=True)
    
    # Pull lap listings
    laps_a = fetch_session_laps(session_key, num_a)
    laps_b = fetch_session_laps(session_key, num_b)
    
    # Limit to first 25 laps for cleaner visualization
    laps_a = laps_a[laps_a["lap_number"] <= 25] if not laps_a.empty else pd.DataFrame()
    laps_b = laps_b[laps_b["lap_number"] <= 25] if not laps_b.empty else pd.DataFrame()
    
    fig = go.Figure()
    if not laps_a.empty:
        fig.add_trace(go.Scatter(x=laps_a["lap_number"], y=laps_a["lap_duration"], mode='lines+markers', name=name_a, line=dict(color=col_a_hex, width=2.5), marker=dict(size=4)))
    if not laps_b.empty:
        fig.add_trace(go.Scatter(x=laps_b["lap_number"], y=laps_b["lap_duration"], mode='lines+markers', name=name_b, line=dict(color=col_b_hex, width=2.5), marker=dict(size=4)))
        
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=20, r=20, t=10, b=20),
        xaxis_title="Completed Lap Number",
        yaxis_title="Duration (Seconds)",
        height=200,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig, use_container_width=True)
