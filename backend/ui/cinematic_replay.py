# ui/cinematic_replay.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from config.settings import APEX_THEME
from utils.constants import CIRCUITS

def interpolate_track_coordinates(circuit_data, position, offset=0.0, safety_car=False, yellow_flag=False, rain_ambient=False):
    """
    Simulates high-speed tactical physics indexes over circuit coordinate bounds.
    """
    pts = circuit_data.get("points", [])
    if not pts:
        return {"x": 100, "y": 100, "speed": 180, "gear": 5, "throttle": 80, "brake": 0}
        
    final_ratio = (position + offset + 1.0) % 1.0
    raw_index = final_ratio * (len(pts) - 1)
    low_idx = int(np.floor(raw_index))
    high_idx = int(np.ceil(raw_index))
    fraction = raw_index - low_idx
    
    p1 = pts[low_idx]
    p2 = pts[high_idx]
    
    # Coordinates linear translation
    x = p1["x"] + (p2["x"] - p1["x"]) * fraction
    y = p1["y"] + (p2["y"] - p1["y"]) * fraction
    
    speed = p1["speedLimit"] + (p2["speedLimit"] - p1["speedLimit"]) * fraction
    
    # Environmental speed constraints
    if safety_car:
        speed = min(speed, 110)
    elif yellow_flag:
        speed = min(speed, 140)
    elif rain_ambient:
        speed = speed * 0.81 # wet traction coefficient
        
    speed = int(round(speed))
    
    throttle = 100 if speed > 220 else (75 if speed > 150 else 22)
    if speed < 130:
        throttle = 0
        
    brake = 95 if speed < 120 else (40 if speed < 170 else 0)
    gear = 8 if speed > 310 else (7 if speed > 255 else (6 if speed > 210 else (5 if speed > 160 else (4 if speed > 115 else (3 if speed > 85 else 2)))))
    
    return {
        "x": x, "y": y, "speed": speed, "gear": gear, "throttle": throttle, "brake": brake
    }

def render_cinematic_interactive_replay(selected_meeting_name):
    """
    Renders the Interactive 2D Replay widget on the panel card.
    """
    circuit_data = CIRCUITS.get(selected_meeting_name)
    if not circuit_data:
        # Fallback to general circuit generator or Miami
        circuit_data = CIRCUITS["Miami Grand Prix"]
        
    st.markdown("<p style='color:#00D2BE;font-weight:700;margin-bottom:2px;'>🎥 CINEMATIC RACING INTELLIGENCE REPLAY <span class='status-badge' style='background:rgba(225,6,0,0.15);color:#ff3344;border-color:rgba(225,6,0,0.4);animation:pulseGlowRed 2s infinite;'>🔴 LIVE</span></p>", unsafe_allow_html=True)
    
    # 1. Environmental Controls
    col_t1, col_t2, col_t3 = st.columns(3)
    with col_t1:
        sc_toggle = st.toggle("🚨 Safety Car (Cap 110)", value=False, key="sc_rep_toggle")
    with col_t2:
        yf_toggle = st.toggle("🟡 Yellow Flag Sector 2", value=False, key="yf_rep_toggle")
    with col_t3:
        rain_toggle = st.toggle("🌧️ Wet Track Surface", value=False, key="rain_rep_toggle")
        
    # Animation Progress Timeline Slider
    progress_slider = st.slider("Lap Position index Tracker", min_value=0.0, max_value=1.0, value=0.45, step=0.01, key="timeline_index_slider")
    
    # Competitor telemetry computations
    norm_A = interpolate_track_coordinates(circuit_data, progress_slider, offset=0.0, safety_car=sc_toggle, yellow_flag=yf_toggle, rain_ambient=rain_toggle)
    norm_B = interpolate_track_coordinates(circuit_data, progress_slider, offset=-0.045, safety_car=sc_toggle, yellow_flag=yf_toggle, rain_ambient=rain_toggle)
    
    # Side-by-Side Instrument Telemetry Panels
    col_inst1, col_inst2 = st.columns(2)
    with col_inst1:
        st.markdown(f"""
        <div style="background:rgba(255,128,0,0.08);border:1px solid rgba(255,128,0,0.3);border-radius:8px;padding:12px;font-family:'JetBrains Mono',monospace;">
            <div style="color:#FF8000;font-weight:700;font-size:0.9rem;">LANDO NORRIS #4</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;font-size:0.8rem;color:#f8fafc;">
                <div>SPEED: <strong>{norm_A['speed']} KM/H</strong></div>
                <div>GEAR: <strong style="color:#00ffdd;">G{norm_A['gear']}</strong></div>
                <div>THROTTLE: <span style="color:#22c55e;">{norm_A['throttle']}%</span></div>
                <div>BRAKE: <span style="color:#ef4444;">{norm_A['brake']}%</span></div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    with col_inst2:
        st.markdown(f"""
        <div style="background:rgba(54,113,198,0.08);border:1px solid rgba(54,113,198,0.3);border-radius:8px;padding:12px;font-family:'JetBrains Mono',monospace;">
            <div style="color:#3671C6;font-weight:700;font-size:0.9rem;">MAX VERSTAPPEN #1</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;font-size:0.8rem;color:#f8fafc;">
                <div>SPEED: <strong>{norm_B['speed']} KM/H</strong></div>
                <div>GEAR: <strong style="color:#00ffdd;">G{norm_B['gear']}</strong></div>
                <div>THROTTLE: <span style="color:#22c55e;">{norm_B['throttle']}%</span></div>
                <div>BRAKE: <span style="color:#ef4444;">{norm_B['brake']}%</span></div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    # Plotly track trace
    points_df = pd.DataFrame(circuit_data["points"])
    fig = go.Figure()
    
    # Outer track layout
    fig.add_trace(go.Scatter(
        x=points_df["x"], y=points_df["y"],
        mode="lines",
        line=dict(color="rgba(30,50,90,0.7)", width=12),
        hoverinfo="skip",
        showlegend=False
    ))
    fig.add_trace(go.Scatter(
        x=points_df["x"], y=points_df["y"],
        mode="lines",
        line=dict(color="#00D2BE", width=2),
        hoverinfo="skip",
        showlegend=False
    ))
    
    # Sector markers
    for m in circuit_data.get("apexMarkers", []):
        color = "#ec4899" if m["type"] == "apex" else ("#00ffdd" if m["type"] == "drs" else "#eab308")
        fig.add_trace(go.Scatter(
            x=[m["x"]], y=[m["y"]],
            mode="markers+text",
            text=[m["label"]],
            textposition="top center",
            marker=dict(color=color, size=8, line=dict(color="white", width=1)),
            textfont=dict(size=8, color="#94a3b8"),
            showlegend=False
        ))
        
    # Live driver nodes
    fig.add_trace(go.Scatter(
        x=[norm_A["x"]], y=[norm_A["y"]],
        mode="markers",
        name="NORRIS",
        marker=dict(color="#FF8000", size=15, symbol="circle", line=dict(color="white", width=1.5))
    ))
    fig.add_trace(go.Scatter(
        x=[norm_B["x"]], y=[norm_B["y"]],
        mode="markers",
        name="VERSTAPPEN",
        marker=dict(color="#3671C6", size=15, symbol="circle", line=dict(color="white", width=1.5))
    ))
    
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(visible=False, range=[0, 500]),
        yaxis=dict(visible=False, range=[0, 250]),
        height=320,
        legend=dict(orientation="h", yanchor="top", y=-0.02, xanchor="center", x=0.5)
    )
    
    st.plotly_chart(fig, use_container_width=True)
