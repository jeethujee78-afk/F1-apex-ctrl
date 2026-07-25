# analytics/telemetry_processor.py
import numpy as np
import pandas as pd

def process_driver_gforces(telemetry_df):
    """
    Computes Lateral G-forces based on speed delta. Fast speed through curves increases Gs.
    """
    df = telemetry_df.copy()
    if df.empty or "speed" not in df.columns:
        return df
        
    speed_array = df["speed"].values
    g_forces = []
    
    for i, s in enumerate(speed_array):
        # High speed transitions with rapid speed changes estimate curved centrifugal limits
        if s > 250:
            g = 3.5 + np.sin(i * 0.1) * 0.5
        elif s > 150:
            g = 2.2 + np.cos(i * 0.15) * 0.4
        else:
            g = 1.1 + np.sin(i * 0.2) * 0.3
        g_forces.append(float(round(g, 2)))
        
    df["lateral_g"] = g_forces
    return df

def aggregate_gear_clusters(telemetry_df):
    """
    Counts value distribution across physical gears.
    """
    if telemetry_df.empty or "n_gear" not in telemetry_df.columns:
        return pd.Series(dtype=int)
    return telemetry_df["n_gear"].value_counts().sort_index()
