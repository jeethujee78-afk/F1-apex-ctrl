# analytics/prediction_engine.py
import numpy as np

def calculate_race_win_probability(driver_a_score, driver_b_score, gap_seconds=0.0):
    """
    Computes real-time comparative win probabilities between two competitors.
    """
    odds_ratio = np.exp((driver_a_score - driver_b_score) / 20.0)
    # Factor in the physical gap
    gap_multiplier = 1.0
    if gap_seconds != 0.0:
        # A positive gap means A is behind B
        gap_multiplier = np.exp(-gap_seconds / 5.0)
        
    odds_a = odds_ratio * gap_multiplier
    prob_a = odds_a / (1.0 + odds_a)
    
    prob_b = 1.0 - prob_a
    
    return {
        "probability_a": int(round(prob_a * 100)),
        "probability_b": int(round(prob_b * 100))
    }

def compute_driver_aggression_rating(driver_number, lap_count=56):
    """
    Simulates dynamic mechanical stress indicators (throttle rate index & battery usage).
    """
    seed = int(driver_number) + lap_count
    state = np.sin(seed * 0.23) * 15 + 80
    return max(60, min(98, int(state)))
