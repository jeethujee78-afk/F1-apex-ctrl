# analytics/tyre_analysis.py
import numpy as np

def calculate_tyre_wear_coefficient(driver_name, compound_type, track_temp, current_life):
    """
    Computes thermodynamic wear acceleration factor block.
    High track temperatures escalate compound decay rates directly.
    """
    base_degrad_coef = 0.05
    if compound_type == "SOFT":
        base_degrad_coef = 0.12
    elif compound_type == "MEDIUM":
        base_degrad_coef = 0.07
        
    temp_multiplier = 1.0
    if track_temp > 35.0:
        # High temperatures trigger thermal graining
        temp_multiplier = 1.0 + (track_temp - 35.0) * 0.035
        
    wear_per_lap = base_degrad_coef * temp_multiplier
    predicted_next_life = max(2, int(current_life - (wear_per_lap * 10)))
    
    return {
        "wear_per_lap_percent": float(round(wear_per_lap * 15, 2)),
        "predicted_remaining_life": predicted_next_life,
        "thermal_status": "CRITICAL" if track_temp > 40.0 else ("STABLE" if track_temp > 30 else "OPTIMAL")
    }
