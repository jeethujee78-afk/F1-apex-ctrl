# ui/lap_analysis_page.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from services.openf1_client import fetch_drivers_by_session, fetch_session_laps
from utils.constants import CIRCUITS
from analytics.lap_analysis import analyze_driver_consistency

def render_lap_analysis_page(session_key, meeting_name):
    """
    Renders the lap timings and track vector shapes.
    """
    st.markdown("<h2>📊 LAP DURATION PERFORMANCE SPANS</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Statistical timing spreads across sectors, driver lap averages, and physical track guides.</p>", unsafe_allow_html=True)
    
    drivers_df = fetch_drivers_by_session(session_key)
    laps_df = fetch_session_laps(session_key)
    
    if drivers_df.empty or laps_df.empty:
        st.warning("Lap logs or active roster currently loading...")
        return
        
    col_split, col_track = st.columns([1.1, 0.9])
    
    with col_split:
        st.markdown("<h4 style='color:#00D2BE;'>⏱️ DRIVER CONSISTENCY INDEX STANDINGS</h4>", unsafe_allow_html=True)
        # Pull leading 5 drivers for graph overlays
        top_dris = drivers_df["driver_number"].head(5).tolist()
        top_acrs = drivers_df["name_acronym"].head(5).tolist()
        
        # Calculate consistency tables
        meta_records = []
        for d, acr in zip(top_dris, top_acrs):
            c_data = analyze_driver_consistency(laps_df, d)
            drv_row = drivers_df[drivers_df["driver_number"] == d].iloc[0]
            meta_records.append({
                "DRIVER": acr,
                "CONSTRUCTOR": drv_row.get("team_name", "Independent"),
                "AVERAGE LAP TIME": f"{c_data['avg_lap']:.2f}s",
                "VARIANCE (STD DEV)": f"{c_data['variance']:.3f}s",
                "CONSISTENCY SCORE": f"{c_data['consistency_score']} / 100"
            })
            
        st.dataframe(pd.DataFrame(meta_records), use_container_width=True, hide_index=True)
        
        # Chrono timeseries plots
        fig_laps = go.Figure()
        for d, acr in zip(top_dris[:4], top_acrs[:4]):
            drv_times = laps_df[laps_df["driver_number"] == d].sort_values("lap_number")
            # Limit to 15 laps for visibility
            drv_times = drv_times[drv_times["lap_number"] <= 15]
            if not drv_times.empty:
                color = f"#{drivers_df[drivers_df['driver_number'] == d].iloc[0].get('team_colour', 'f0f6fc')}"
                if len(color) != 7: color = "#f0f6fc"
                fig_laps.add_trace(go.Scatter(
                    x=drv_times["lap_number"], y=drv_times["lap_duration"],
                    mode='lines+markers', name=acr,
                    line=dict(color=color, width=2.5),
                    marker=dict(size=4)
                ))
                
        fig_laps.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=20, r=20, t=10, b=20),
            xaxis_title="Completed Lap Number",
            yaxis_title="Lap Duration (seconds)",
            height=280,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig_laps, use_container_width=True)
        
    with col_track:
        st.markdown("<h4 style='color:#00D2BE;'>📐 VIRTUAL TRACK CO-ORDINATE PROFILE</h4>", unsafe_allow_html=True)
        
        circuit_data = CIRCUITS.get(meeting_name, CIRCUITS["Miami Grand Prix"])
        track_df = pd.DataFrame(circuit_data["points"])
        
        fig_track = px.line(track_df, x='x', y='y', color_discrete_sequence=['#00D2BE'])
        fig_track.update_traces(line=dict(width=5.5, shape='spline'))
        
        # Apex dots overlay
        for m in circuit_data.get("apexMarkers", []):
            color = "#ec4899" if m["type"] == "apex" else ("#00ffdd" if m["type"] == "drs" else "#eab308")
            fig_track.add_trace(go.Scatter(
                x=[m["x"]], y=[m["y"]],
                mode="markers+text",
                text=[m["label"]],
                textposition="top right",
                marker=dict(color=color, size=9, line=dict(color="white", width=1.5)),
                textfont=dict(size=9, color="#94a3b8"),
                showlegend=False
            ))
            
        fig_track.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            xaxis=dict(visible=False, range=[0, 500]),
            yaxis=dict(visible=False, range=[0, 250]),
            margin=dict(l=10, r=10, t=10, b=10),
            height=370
        )
        st.plotly_chart(fig_track, use_container_width=True)
        
        # Circuit metadata list
        st.markdown(f"""
        <div class="glass-card">
            <strong>CIRCUIT PHYSICAL PARAMETERS ({circuit_data['name']}):</strong><br/>
            📍 Location: {circuit_data.get('country', 'International')}<br/>
            📐 Lap Length Index: {circuit_data.get('lengthKm', '5.41')} KM<br/>
            🚦 Apex Corner Loops: {circuit_data.get('cornersCount', 19)} corners
        </div>
        """, unsafe_allow_html=True)
print("Lap analysis completed.")
