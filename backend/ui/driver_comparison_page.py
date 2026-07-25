# ui/driver_comparison_page.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from services.openf1_client import fetch_drivers_by_session, fetch_session_laps
from analytics.lap_analysis import calculate_driver_deltas, analyze_driver_consistency
from analytics.prediction_engine import calculate_race_win_probability

def render_driver_comparison_page(session_key):
    """
    Renders the direct Head-to-Head Competitor comparison panel.
    """
    st.markdown("<h2>⚔️ COMPETITOR HEAD-TO-HEAD COMPARISON</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Select any two active racers to overlay chronological performance gaps, sectors, and win probabilities.</p>", unsafe_allow_html=True)
    
    drivers_df = fetch_drivers_by_session(session_key)
    laps_df = fetch_session_laps(session_key)
    
    if drivers_df.empty or laps_df.empty:
        st.warning("Fetching telemetry records or driver listings...")
        return
        
    choices = list(zip(drivers_df["driver_number"], drivers_df["name_acronym"], drivers_df["full_name"]))
    labels = [f"#{n} {acr} - {name}" for n, acr, name in choices]
    
    col_sel1, col_sel2 = st.columns(2)
    with col_sel1:
        sel_a = st.selectbox("BASE COMPETITOR 1", labels, index=0, key="comp_page_sel_a")
    with col_sel2:
        sel_b = st.selectbox("BASE COMPETITOR 2", labels, index=min(1, len(labels)-1), key="comp_page_sel_b")
        
    num_a = choices[labels.index(sel_a)][0]
    num_b = choices[labels.index(sel_b)][0]
    acr_a = choices[labels.index(sel_a)][1]
    acr_b = choices[labels.index(sel_b)][1]
    
    col_a_hex = f"#{drivers_df[drivers_df['driver_number'] == num_a].iloc[0].get('team_colour', '00D2BE')}"
    col_b_hex = f"#{drivers_df[drivers_df['driver_number'] == num_b].iloc[0].get('team_colour', 'FF8000')}"
    if len(col_a_hex) != 7: col_a_hex = "#00D2BE"
    if len(col_b_hex) != 7: col_b_hex = "#FF8000"
    if col_a_hex == col_b_hex: col_b_hex = "#FFF200"
    
    # Calculate statistical summaries
    c_a = analyze_driver_consistency(laps_df, num_a)
    c_b = analyze_driver_consistency(laps_df, num_b)
    
    # Predict dynamic probabilities
    odds = calculate_race_win_probability(c_a['consistency_score'], c_b['consistency_score'])
    
    # Render key stats columns
    col_stat1, col_stat2, col_stat3 = st.columns(3)
    with col_stat1:
        diff_avg = c_a['avg_lap'] - c_b['avg_lap']
        sign = "-" if diff_avg < 0 else "+"
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #00D2BE;">
            <div class="metric-title">⏱️ Average Pace Gap</div>
            <div class="metric-val">{sign}{abs(diff_avg):.3f}s</div>
            <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">(Negative means Competitor 1 is faster)</div>
        </div>
        """, unsafe_allow_html=True)
    with col_stat2:
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #E10600;">
            <div class="metric-title">🧬 Competitor 1 Probability</div>
            <div class="metric-val" style="color:#00ffdd;">{odds['probability_a']}%</div>
            <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">(Calculated from statistical consistency)</div>
        </div>
        """, unsafe_allow_html=True)
    with col_stat3:
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #FF8000;">
            <div class="metric-title">📡 Competitor 2 Probability</div>
            <div class="metric-val" style="color:#ff3344;">{odds['probability_b']}%</div>
            <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">(Calculated from statistical consistency)</div>
        </div>
        """, unsafe_allow_html=True)
        
    # Chronological gap comparisons
    deltas_df = calculate_driver_deltas(laps_df, num_a, num_b)
    if not deltas_df.empty:
        st.markdown("<h4>📈 Cumulative Acceleration Gap over laps</h4>", unsafe_allow_html=True)
        
        # Display Plotly trace
        fig_delta = go.Figure()
        fig_delta.add_trace(go.Scatter(
            x=deltas_df["lap_number"], y=deltas_df["acc_delta"],
            mode='lines+markers',
            name="Gap Delta Line",
            line=dict(color="#FF007F", width=2.5),
            marker=dict(size=4)
        ))
        fig_delta.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Lap Number",
            yaxis_title="Accumulated seconds gap",
            height=280
        )
        st.plotly_chart(fig_delta, use_container_width=True)
        
        # Grid layout comparing consistencies side by side
        col_g1, col_g2 = st.columns(2)
        with col_g1:
            st.markdown(f"<h5>{acr_a} Track consistency metrics</h5>", unsafe_allow_html=True)
            st.markdown(f"""
            <div class="glass-card">
                ⏱️ Averaged Lap Time: <strong>{c_a['avg_lap']:.2f}s</strong><br/>
                📊 Standard Deviation: <strong>{c_a['variance']:.3f}s</strong><br/>
                🏁 Overall Consistency Score: <strong>{c_a['consistency_score']} / 100</strong>
            </div>
            """, unsafe_allow_html=True)
        with col_g2:
            st.markdown(f"<h5>{acr_b} Track consistency metrics</h5>", unsafe_allow_html=True)
            st.markdown(f"""
            <div class="glass-card">
                ⏱️ Averaged Lap Time: <strong>{c_b['avg_lap']:.2f}s</strong><br/>
                📊 Standard Deviation: <strong>{c_b['variance']:.3f}s</strong><br/>
                🏁 Overall Consistency Score: <strong>{c_b['consistency_score']} / 100</strong>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("Lap performance deltas are currently rendering...")
