# ui/telemetry_page.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from services.openf1_client import fetch_drivers_by_session, fetch_driver_telemetry
from config.settings import APEX_THEME

def render_telemetry_page(session_key):
    """
    Renders high-resolution interactive overlapping competitor telemetry charts.
    """
    st.markdown("<h2>📈 COMPARATIVE TELEMETRY CORE</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Live tachometer profiles, pedal stress maps, RPM transitions, and gear cluster groupings between competitors.</p>", unsafe_allow_html=True)
    
    drivers_df = fetch_drivers_by_session(session_key)
    if drivers_df.empty:
        st.warning("No live drivers found inside the active session.")
        return
        
    choices = list(zip(drivers_df["driver_number"], drivers_df["name_acronym"], drivers_df["full_name"]))
    labels = [f"#{n} {acr} - {name}" for n, acr, name in choices]
    
    col_sel1, col_sel2 = st.columns(2)
    with col_sel1:
        sel_a = st.selectbox("COMPETITOR A", labels, index=0, key="tel_page_sel_a")
    with col_sel2:
        sel_b = st.selectbox("COMPETITOR B", labels, index=min(1, len(labels)-1), key="tel_page_sel_b")
        
    num_a = choices[labels.index(sel_a)][0]
    num_b = choices[labels.index(sel_b)][0]
    acr_a = choices[labels.index(sel_a)][1]
    acr_b = choices[labels.index(sel_b)][1]
    
    col_a_hex = f"#{drivers_df[drivers_df['driver_number'] == num_a].iloc[0].get('team_colour', '00D2BE')}"
    col_b_hex = f"#{drivers_df[drivers_df['driver_number'] == num_b].iloc[0].get('team_colour', 'FF8000')}"
    if len(col_a_hex) != 7: col_a_hex = "#00D2BE"
    if len(col_b_hex) != 7: col_b_hex = "#FF8000"
    if col_a_hex == col_b_hex: col_b_hex = "#FFF200"
    
    # Retrieve telemetry datasets
    tele_a = fetch_driver_telemetry(session_key, num_a)
    tele_b = fetch_driver_telemetry(session_key, num_b)
    
    # Render Plots Grid
    col_chart1, col_chart2 = st.columns(2)
    with col_chart1:
        st.markdown("<h5>Overlapping Velocity (KM/H)</h5>", unsafe_allow_html=True)
        fig_vel = go.Figure()
        fig_vel.add_trace(go.Scatter(y=tele_a["speed"], mode='lines', name=acr_a, line=dict(color=col_a_hex, width=3)))
        fig_vel.add_trace(go.Scatter(y=tele_b["speed"], mode='lines', name=acr_b, line=dict(color=col_b_hex, width=3)))
        fig_vel.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Lap Coordinate Samples",
            yaxis_title="KM/H",
            height=280
        )
        st.plotly_chart(fig_vel, use_container_width=True)
        
        st.markdown("<h5>Pedals Index Registers (%)</h5>", unsafe_allow_html=True)
        fig_ped = go.Figure()
        fig_ped.add_trace(go.Scatter(y=tele_a["throttle"], mode='lines', name=f"{acr_a} Throttle", line=dict(color=col_a_hex, width=2.5)))
        fig_ped.add_trace(go.Scatter(y=tele_a["brake"], mode='lines', name=f"{acr_a} Brake", line=dict(color=col_a_hex, width=1.5, dash="dash")))
        fig_ped.add_trace(go.Scatter(y=tele_b["throttle"], mode='lines', name=f"{acr_b} Throttle", line=dict(color=col_b_hex, width=2.5)))
        fig_ped.add_trace(go.Scatter(y=tele_b["brake"], mode='lines', name=f"{acr_b} Brake", line=dict(color=col_b_hex, width=1.5, dash="dash")))
        fig_ped.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Lap Coordinate Samples",
            yaxis_title="Percent (%)",
            height=280
        )
        st.plotly_chart(fig_ped, use_container_width=True)
        
    with col_chart2:
        st.markdown("<h5>Power Engine RPM Overlay</h5>", unsafe_allow_html=True)
        fig_rpm = go.Figure()
        fig_rpm.add_trace(go.Scatter(y=tele_a["rpm"], mode='lines', name=acr_a, line=dict(color=col_a_hex, width=3)))
        fig_rpm.add_trace(go.Scatter(y=tele_b["rpm"], mode='lines', name=acr_b, line=dict(color=col_b_hex, width=3)))
        fig_rpm.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Lap Coordinate Samples",
            yaxis_title="RPM",
            height=280
        )
        st.plotly_chart(fig_rpm, use_container_width=True)
        
        st.markdown("<h5>Gears Value Counts Clusters</h5>", unsafe_allow_html=True)
        g_a = tele_a["n_gear"].value_counts().sort_index()
        g_b = tele_b["n_gear"].value_counts().sort_index()
        fig_g = go.Figure()
        fig_g.add_trace(go.Bar(x=g_a.index, y=g_a.values, name=acr_a, marker_color=col_a_hex))
        fig_g.add_trace(go.Bar(x=g_b.index, y=g_b.values, name=acr_b, marker_color=col_b_hex))
        fig_g.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Gear Value",
            yaxis_title="Sample Counts",
            height=280,
            barmode='group'
        )
        st.plotly_chart(fig_g, use_container_width=True)
