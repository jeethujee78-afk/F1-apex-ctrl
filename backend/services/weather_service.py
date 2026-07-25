# services/weather_service.py
import pandas as pd
import numpy as np

def analyze_track_weather(weather_df):
    """
    Computes summary indexes on track ambient conditions including track wetness levels.
    """
    summary = {
        "air_temp": 28.1,
        "track_temp": 38.2,
        "humidity": 62.0,
        "wind_speed": 14.0,
        "rainfall_index": 0.0,
        "status": "GREEN FLAG",
        "drs_enabled": True
    }
    
    if weather_df is not None and not weather_df.empty:
        summary["air_temp"] = float(round(weather_df["air_temperature"].mean(), 1))
        summary["track_temp"] = float(round(weather_df["track_temperature"].mean(), 1))
        summary["humidity"] = float(round(weather_df["humidity"].mean(), 1))
        summary["wind_speed"] = float(round(weather_df["wind_speed"].mean(), 1))
        summary["rainfall_index"] = float(round(weather_df["rainfall"].mean(), 2))
        
        # Override rules
        if summary["rainfall_index"] > 0.05:
            summary["status"] = "RAIN WARNING / SAFETY LIMITS"
            summary["drs_enabled"] = False
        else:
            summary["status"] = "GREEN FLAG"
            summary["drs_enabled"] = True
            
    return summary

def generate_weather_forecast_grid():
    """
    Generates simulated future timeseries of rain risk probability.
    """
    stints = np.arange(1, 11)
    probabilities = np.clip(10 + stints * 1.5 + np.sin(stints * 0.9) * 4, 0, 100)
    return pd.DataFrame({
        "Stint_Time": [f"+{i*5} min" for i in stints],
        "Rain_Risk_Percent": probabilities.astype(int)
    })
