# ui/weather_intelligence.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from services.openf1_client import fetch_session_weather
from services.weather_service import analyze_track_weather, generate_weather_forecast_grid

def render_weather_page(session_key):
    """
    Renders the dedicated Weather Intelligence analysis screen.
    """
    st.markdown("<h2>🌦️ ENVIRONMENTAL WEATHER INTELLIGENCE</h2>", unsafe_allow_html=True)
    st.markdown("<p style='color:#94a3b8;'>Live thermodynamic sensor logs, wind velocity vectors, track heat trends, and rain delay probabilities.</p>", unsafe_allow_html=True)
    
    weather_df = fetch_session_weather(session_key)
    if weather_df.empty:
        st.warning("environmental weather logs currently offline.")
        return
        
    summary = analyze_track_weather(weather_df)
    
    # 1. State boxes
    col_w1, col_w2, col_w3, col_w4 = st.columns(4)
    with col_w1:
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #E10600;">
            <div class="metric-title">🔥 Track surface temp</div>
            <div class="metric-val">{summary['track_temp']}°C</div>
        </div>
        """, unsafe_allow_html=True)
    with col_w2:
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #3b82f6;">
            <div class="metric-title">💡 Air temperature</div>
            <div class="metric-val">{summary['air_temp']}°C</div>
        </div>
        """, unsafe_allow_html=True)
    with col_w3:
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #a855f7;">
            <div class="metric-title">💧 humidity ratio</div>
            <div class="metric-val">{summary['humidity']}%</div>
        </div>
        """, unsafe_allow_html=True)
    with col_w4:
        st.markdown(f"""
        <div class="glass-card" style="border-left-color: #eab308;">
            <div class="metric-title">🌀 wind velocity</div>
            <div class="metric-val">{summary['wind_speed']} m/s</div>
        </div>
        """, unsafe_allow_html=True)
        
    # Weather charts timeseries
    col_c1, col_c2 = st.columns([1.1, 0.9])
    with col_c1:
        st.markdown("<h4>📈 Thermodynamic heat variations over the session</h4>", unsafe_allow_html=True)
        
        # Plot track and air temp together
        fig_temp = go.Figure()
        fig_temp.add_trace(go.Scatter(y=weather_df["track_temperature"], mode='lines+markers', name='Track Temperature', line=dict(color='#E10600', width=2.5)))
        fig_temp.add_trace(go.Scatter(y=weather_df["air_temperature"], mode='lines+markers', name='Air Temperature', line=dict(color='#3b82f6', width=2)))
        fig_temp.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Timeline intervals",
            yaxis_title="Temperature (°C)",
            height=280
        )
        st.plotly_chart(fig_temp, use_container_width=True)
        
    with col_c2:
        st.markdown("<h4>⛈️ Future Rain Risk Probabilities (Next 50 min)</h4>", unsafe_allow_html=True)
        forecast_df = generate_weather_forecast_grid()
        
        fig_rain = go.Figure()
        fig_rain.add_trace(go.Bar(
            x=forecast_df["Stint_Time"], y=forecast_df["Rain_Risk_Percent"],
            marker_color='#3b82f6', width=0.5
        ))
        fig_rain.update_layout(
            template="plotly_dark",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            margin=dict(l=30, r=30, t=10, b=30),
            xaxis_title="Time Increment",
            yaxis_title="Rain Probability (%)",
            height=280,
            yaxis=dict(range=[0, 100])
        )
        st.plotly_chart(fig_rain, use_container_width=True)
