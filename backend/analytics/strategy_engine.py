# analytics/strategy_engine.py
import numpy as np
import pandas as pd

def simulate_tyre_degradation(max_laps=50):
    """
    Simulates friction degradation percentages across Soft, Medium, and Hard compounds.
    """
    laps_range = np.arange(1, max_laps + 1)
    
    # Non-linear decay curves matching high-spec thermal physics
    deg_soft = np.clip(100 - (laps_range * 4.2) - (laps_range ** 1.35 * 0.15), 5, 100)
    deg_medium = np.clip(100 - (laps_range * 2.2) - (laps_range ** 1.15 * 0.08), 12, 100)
    deg_hard = np.clip(100 - (laps_range * 1.1) - (laps_range ** 1.05 * 0.04), 25, 100)
    
    return pd.DataFrame({
        "Lap": laps_range,
        "Soft_Compound": deg_soft,
        "Medium_Compound": deg_medium,
        "Hard_Compound": deg_hard
    })

def calculate_optimal_pit_stops(track_name):
    """
    Recommends specific lap windows based on track characteristics.
    """
    # Track-dependent adjustments
    penalty_base = 22.4 # Sec lost in pitlane lane
    if "Monaco" in track_name:
        penalty_base = 19.8
    elif "Silverstone" in track_name:
        penalty_base = 21.1
        
    return {
        "pit_loss_sec": penalty_base,
        "soft_window": {"start": 11, "end": 15, "max_life": 18},
        "medium_window": {"start": 22, "end": 27, "max_life": 32},
        "hard_window": {"start": 36, "end": 43, "max_life": 48}
    }
