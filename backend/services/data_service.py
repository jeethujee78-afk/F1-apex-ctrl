# services/data_service.py
import pandas as pd
from utils.constants import F1_DRIVERS

def build_driver_timing_records(drivers_df, laps_df):
    """
    Joins live active driver structures with timing metrics for scoreboard rendering.
    """
    records = []
    
    # Form mapping catalog
    acr_map = {d["number"]: d for d in F1_DRIVERS}
    
    for _, row in drivers_df.iterrows():
        num = int(row["driver_number"])
        acr = row.get("name_acronym", "DRV")
        name = row.get("full_name", f"Driver {num}")
        team = row.get("team_name", "Independent")
        color = row.get("team_colour", "8b9bb4")
        
        # Check defaults catalog overrides
        meta = acr_map.get(num, {})
        compound = meta.get("compound", "MEDIUM")
        life = meta.get("tyreLife", 63)
        fuel = meta.get("fuelLoad", 32.4)
        drs_eff = meta.get("drsEfficiency", 89)
        win_prob = meta.get("winProbability", 25)
        
        # Pull fastest lap times
        drv_laps = laps_df[laps_df["driver_number"] == num] if laps_df is not None and not laps_df.empty else pd.DataFrame()
        if not drv_laps.empty and "lap_duration" in drv_laps.columns:
            f_lap = drv_laps["lap_duration"].min()
            lap_formatted = f"1:{f_lap % 60:05.3f}"
            avg_lap = f"{drv_laps['lap_duration'].mean():.2f}s"
            tot_laps = len(drv_laps)
        else:
            sim_val = 87.208 + (num % 5) * 0.352
            lap_formatted = f"1:{sim_val % 60:05.3f}"
            avg_lap = f"{sim_val + 1.12:.2f}s"
            tot_laps = 56
            
        records.append({
            "Pos": 0,
            "Number": num,
            "Acronym": acr,
            "Competitor": name,
            "Constructor": team,
            "TeamColour": color,
            "Tyre compound": f"{compound} 🟡" if compound == "MEDIUM" else (f"{compound} 🔴" if compound == "SOFT" else f"{compound} ⚪"),
            "Sector 1 Split": f"{(27.456 + (num % 3) * 0.12):.3f}s",
            "Fastest Lap Clock": lap_formatted,
            "Avg Lap Delta": avg_lap,
            "Laps Completed": tot_laps,
            "TyreLife": life,
            "FuelLoad": fuel,
            "DrsEfficiency": drs_eff,
            "WinProbability": win_prob
        })
        
    ranking_df = pd.DataFrame(records).sort_values(by="Fastest Lap Clock").reset_index(drop=True)
    for idx in range(len(ranking_df)):
        ranking_df.at[idx, "Pos"] = idx + 1
        
    return ranking_df
