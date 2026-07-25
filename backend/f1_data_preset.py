import numpy as np

# ==========================================
# DRIVERS MASTER DIRECTORY
# ==========================================
F1_DRIVERS = [
    {
        "number": 4, "code": "NOR", "firstName": "Lando", "lastName": "Norris",
        "fullName": "Lando Norris", "team": "McLaren", "color": "#FF8000",
        "flagUrl": "https://flagcdn.com/w40/gb.png", "nationality": "British",
        "championshipPosition": 2, "points": 331,
        "advantages": ["Better Corner Exit", "Tyre Preservation", "DRS Efficiency Strong"],
        "disadvantages": ["Sector 3 Loss", "Rear Tyre Wear"], "winProbability": 74, "bestLap": "1:27.456"
    },
    {
        "number": 1, "code": "VER", "firstName": "Max", "lastName": "Verstappen",
        "fullName": "Max Verstappen", "team": "Red Bull Racing", "color": "#3671C6",
        "flagUrl": "https://flagcdn.com/w40/nl.png", "nationality": "Dutch",
        "championshipPosition": 1, "points": 393,
        "advantages": ["Top Speed Advantage", "Braking Stability", "Strong Sector 1", "ERS Efficiency"],
        "disadvantages": ["Tyre Degradation", "Corner Entry Instability"], "winProbability": 26, "bestLap": "1:27.208"
    },
    {
        "number": 16, "code": "LEC", "firstName": "Charles", "lastName": "Leclerc",
        "fullName": "Charles Leclerc", "team": "Ferrari", "color": "#E10600",
        "flagUrl": "https://flagcdn.com/w40/mc.png", "nationality": "Monegasque",
        "championshipPosition": 3, "points": 307,
        "advantages": ["Apex Speed Advantage", "Low Drag Design", "Aggressive ERS Curve"],
        "disadvantages": ["Thermal Degradation", "Braking Lockups"], "winProbability": 45, "bestLap": "1:27.610"
    },
    {
        "number": 81, "code": "PIA", "firstName": "Oscar", "lastName": "Piastri",
        "fullName": "Oscar Piastri", "team": "McLaren", "color": "#FF8000",
        "flagUrl": "https://flagcdn.com/w40/au.png", "nationality": "Australian",
        "championshipPosition": 4, "points": 262,
        "advantages": ["High-speed Balance", "Smooth Steering Inputs", "Steady Sectors"],
        "disadvantages": ["Slow Corner Rotation", "Launch Traction"], "winProbability": 38, "bestLap": "1:27.795"
    },
    {
        "number": 44, "code": "HAM", "firstName": "Lewis", "lastName": "Hamilton",
        "fullName": "Lewis Hamilton", "team": "Mercedes", "color": "#27F4D2",
        "flagUrl": "https://flagcdn.com/w40/gb.png", "nationality": "British",
        "championshipPosition": 6, "points": 190,
        "advantages": ["Wet Weather Mastery", "Optimal Race Management", "Late Braking Power"],
        "disadvantages": ["Warm-up Lap Speed", "Straightline Overtake"], "winProbability": 52, "bestLap": "1:27.910"
    },
    {
        "number": 63, "code": "RUS", "firstName": "George", "lastName": "Russell",
        "fullName": "George Russell", "team": "Mercedes", "color": "#27F4D2",
        "flagUrl": "https://flagcdn.com/w40/gb.png", "nationality": "British",
        "championshipPosition": 7, "points": 180,
        "advantages": ["Qualifying Single Lap Speed", "Tire Recovery Window", "Sector 2 Speed"],
        "disadvantages": ["High Fuel Heavy Load Stability", "Tire Overheating"], "winProbability": 33, "bestLap": "1:28.010"
    },
    {
        "number": 55, "code": "SAI", "firstName": "Carlos", "lastName": "Sainz",
        "fullName": "Carlos Sainz", "team": "Ferrari", "color": "#E10600",
        "flagUrl": "https://flagcdn.com/w40/es.png", "nationality": "Spanish",
        "championshipPosition": 5, "points": 244,
        "advantages": ["Strategic Adaptation", "Low Friction Smoothness", "Corner Apex Rotation"],
        "disadvantages": ["Aero Drag Penalty", "Rear Stability"], "winProbability": 40, "bestLap": "1:28.110"
    },
    {
        "number": 11, "code": "PER", "firstName": "Sergio", "lastName": "Perez",
        "fullName": "Sergio Perez", "team": "Red Bull Racing", "color": "#3671C6",
        "flagUrl": "https://flagcdn.com/w40/mx.png", "nationality": "Mexican",
        "championshipPosition": 8, "points": 151,
        "advantages": ["Rear Traction Control", "Excellent Street Circuits Pace", "Compound Saving"],
        "disadvantages": ["Chicane Instability", "Front Wing Understeering"], "winProbability": 25, "bestLap": "1:28.290"
    },
    {
        "number": 14, "code": "ALO", "firstName": "Fernando", "lastName": "Alonso",
        "fullName": "Fernando Alonso", "team": "Aston Martin", "color": "#229971",
        "flagUrl": "https://flagcdn.com/w40/es.png", "nationality": "Spanish",
        "championshipPosition": 9, "points": 62,
        "advantages": ["Extreme Experience", "Relentless Overtaking", "Optimal Wet Trajectories"],
        "disadvantages": ["Power Unit Margins"], "winProbability": 18, "bestLap": "1:28.410"
    },
    {
        "number": 18, "code": "STR", "firstName": "Lance", "lastName": "Stroll",
        "fullName": "Lance Stroll", "team": "Aston Martin", "color": "#229971",
        "flagUrl": "https://flagcdn.com/w40/ca.png", "nationality": "Canadian",
        "championshipPosition": 10, "points": 24,
        "advantages": ["Wet Weather Starts", "High Speed Line Precision"],
        "disadvantages": ["Qualifying Consistency"], "winProbability": 8, "bestLap": "1:28.890"
    }
]

# ==========================================
# CIRCUITS CONFIGURATION
# ==========================================
CIRCUITS = {
    "Miami Grand Prix": {
        "id": "miami",
        "name": "Miami International Autodrome",
        "country": "USA",
        "lengthKm": "5.41",
        "cornersCount": 19,
        "points": [
            {"x": 100, "y": 195, "speedLimit": 335, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 160, "y": 200, "speedLimit": 339, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 220, "y": 198, "speedLimit": 341, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 290, "y": 190, "speedLimit": 220, "gear": 5, "throttle": 20, "brake": 65},  # T1
            {"x": 330, "y": 155, "speedLimit": 120, "gear": 3, "throttle": 0, "brake": 90},   # T2
            {"x": 360, "y": 110, "speedLimit": 95,  "gear": 2, "throttle": 15, "brake": 40},   # T3
            {"x": 395, "y": 130, "speedLimit": 190, "gear": 4, "throttle": 65, "brake": 0},    # T4
            {"x": 440, "y": 165, "speedLimit": 245, "gear": 6, "throttle": 90, "brake": 0},
            {"x": 470, "y": 150, "speedLimit": 210, "gear": 5, "throttle": 50, "brake": 15},
            {"x": 410, "y": 95,  "speedLimit": 160, "gear": 4, "throttle": 30, "brake": 25},   # T5
            {"x": 365, "y": 65,  "speedLimit": 140, "gear": 3, "throttle": 10, "brake": 35},
            {"x": 310, "y": 55,  "speedLimit": 280, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 250, "y": 70,  "speedLimit": 295, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 210, "y": 85,  "speedLimit": 130, "gear": 3, "throttle": 5, "brake": 80},    # chicane
            {"x": 175, "y": 68,  "speedLimit": 115, "gear": 2, "throttle": 0, "brake": 85},
            {"x": 130, "y": 78,  "speedLimit": 270, "gear": 6, "throttle": 95, "brake": 0},
            {"x": 80,  "y": 88,  "speedLimit": 315, "gear": 7, "throttle": 100, "brake": 0},   # DRS
            {"x": 45,  "y": 115, "speedLimit": 105, "gear": 2, "throttle": 0, "brake": 95},    # T17 Hairpin
            {"x": 65,  "y": 155, "speedLimit": 175, "gear": 4, "throttle": 70, "brake": 0}     # straight
        ],
        "apexMarkers": [
            {"x": 290, "y": 190, "label": "T1 Apex", "type": "apex"},
            {"x": 410, "y": 95, "label": "DRS S1", "type": "drs"},
            {"x": 175, "y": 68, "label": "S2 Trap", "type": "sector"}
        ]
    },
    "Monaco Grand Prix": {
        "id": "monaco",
        "name": "Circuit de Monaco",
        "country": "Monaco",
        "lengthKm": "3.33",
        "cornersCount": 19,
        "points": [
            {"x": 90,  "y": 180, "speedLimit": 280, "gear": 6, "throttle": 100, "brake": 0},
            {"x": 130, "y": 130, "speedLimit": 180, "gear": 4, "throttle": 60, "brake": 10},
            {"x": 180, "y": 90,  "speedLimit": 120, "gear": 3, "throttle": 20, "brake": 50},  # Massenet
            {"x": 220, "y": 80,  "speedLimit": 140, "gear": 3, "throttle": 40, "brake": 20},  # Casino
            {"x": 260, "y": 100, "speedLimit": 95,  "gear": 2, "throttle": 5,  "brake": 65},  # Mirabeau
            {"x": 280, "y": 130, "speedLimit": 45,  "gear": 1, "throttle": 0,  "brake": 95},  # Hairpin
            {"x": 250, "y": 150, "speedLimit": 85,  "gear": 2, "throttle": 25, "brake": 40},
            {"x": 280, "y": 175, "speedLimit": 100, "gear": 2, "throttle": 35, "brake": 30},
            {"x": 330, "y": 185, "speedLimit": 290, "gear": 7, "throttle": 100, "brake": 0},  # Tunnel
            {"x": 430, "y": 150, "speedLimit": 110, "gear": 2, "throttle": 0,  "brake": 85},  # Chicane
            {"x": 400, "y": 110, "speedLimit": 160, "gear": 4, "throttle": 50, "brake": 15},  # Tabac
            {"x": 340, "y": 95,  "speedLimit": 215, "gear": 5, "throttle": 80, "brake": 10},
            {"x": 290, "y": 90,  "speedLimit": 110, "gear": 2, "throttle": 10, "brake": 70},  # Piscine
            {"x": 230, "y": 120, "speedLimit": 90,  "gear": 2, "throttle": 15, "brake": 60},  # Rascasse
            {"x": 160, "y": 150, "speedLimit": 75,  "gear": 1, "throttle": 5,  "brake": 80},
            {"x": 110, "y": 175, "speedLimit": 240, "gear": 5, "throttle": 100, "brake": 0}
        ],
        "apexMarkers": [
            {"x": 280, "y": 130, "label": "Hairpin (45K)", "type": "apex"},
            {"x": 330, "y": 185, "label": "Tunnel Out", "type": "sector"},
            {"x": 230, "y": 120, "label": "Rascasse", "type": "apex"}
        ]
    },
    "Monza Grand Prix": {
        "id": "monza",
        "name": "Autodromo Nazionale Monza",
        "country": "Italy",
        "lengthKm": "5.79",
        "cornersCount": 11,
        "points": [
            {"x": 60,  "y": 190, "speedLimit": 350, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 120, "y": 195, "speedLimit": 355, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 190, "y": 200, "speedLimit": 360, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 260, "y": 190, "speedLimit": 75,  "gear": 1, "throttle": 0,  "brake": 98},  # Prima Variante
            {"x": 310, "y": 145, "speedLimit": 180, "gear": 4, "throttle": 70, "brake": 0},
            {"x": 360, "y": 100, "speedLimit": 315, "gear": 7, "throttle": 100, "brake": 0},   
            {"x": 420, "y": 70,  "speedLimit": 115, "gear": 2, "throttle": 0,  "brake": 85},  # Roggia
            {"x": 380, "y": 45,  "speedLimit": 230, "gear": 5, "throttle": 80, "brake": 5},   # Lesmo 1
            {"x": 320, "y": 40,  "speedLimit": 200, "gear": 4, "throttle": 75, "brake": 15},  # Lesmo 2
            {"x": 250, "y": 60,  "speedLimit": 330, "gear": 8, "throttle": 100, "brake": 0},
            {"x": 170, "y": 80,  "speedLimit": 190, "gear": 4, "throttle": 60, "brake": 40},  # Ascari
            {"x": 100, "y": 110, "speedLimit": 290, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 40,  "y": 130, "speedLimit": 250, "gear": 6, "throttle": 90, "brake": 25}   # Parabolica
        ],
        "apexMarkers": [
            {"x": 260, "y": 190, "label": "T1 Chicane", "type": "apex"},
            {"x": 420, "y": 70,  "label": "Roggia GP", "type": "apex"},
            {"x": 170, "y": 80,  "label": "Ascari Out", "type": "sector"}
        ]
    },
    "Silverstone GP": {
        "id": "silverstone",
        "name": "Silverstone Circuit",
        "country": "UK",
        "lengthKm": "5.89",
        "cornersCount": 18,
        "points": [
            {"x": 80,  "y": 190, "speedLimit": 290, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 150, "y": 200, "speedLimit": 310, "gear": 7, "throttle": 100, "brake": 0},  # Abbey
            {"x": 210, "y": 185, "speedLimit": 180, "gear": 4, "throttle": 60, "brake": 30},
            {"x": 240, "y": 140, "speedLimit": 95,  "gear": 2, "throttle": 10, "brake": 75},  # Luffield
            {"x": 200, "y": 95,  "speedLimit": 290, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 150, "y": 70,  "speedLimit": 260, "gear": 6, "throttle": 95, "brake": 5},   # Copse
            {"x": 210, "y": 40,  "speedLimit": 285, "gear": 7, "throttle": 100, "brake": 0},  # Maggots
            {"x": 280, "y": 45,  "speedLimit": 265, "gear": 6, "throttle": 90, "brake": 10},  # Becketts
            {"x": 330, "y": 65,  "speedLimit": 195, "gear": 4, "throttle": 55, "brake": 45},  # Chapel
            {"x": 390, "y": 90,  "speedLimit": 322, "gear": 8, "throttle": 100, "brake": 0},  # Hangar
            {"x": 430, "y": 125, "speedLimit": 140, "gear": 3, "throttle": 5,  "brake": 80},  # Stowe
            {"x": 360, "y": 145, "speedLimit": 285, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 290, "y": 160, "speedLimit": 85,  "gear": 2, "throttle": 0,  "brake": 90},  # Club
            {"x": 180, "y": 175, "speedLimit": 195, "gear": 4, "throttle": 70, "brake": 10}
        ],
        "apexMarkers": [
            {"x": 150, "y": 70, "label": "Copse Apex", "type": "apex"},
            {"x": 280, "y": 45, "label": "Becketts Complex", "type": "apex"},
            {"x": 390, "y": 90, "label": "Hangar DRS", "type": "drs"}
        ]
    }
}

# ==========================================
# DETERMINISTIC PROCEDURAL TRACK GENERATOR
# ==========================================
def get_circuit_data(location_or_name: str):
    if not location_or_name:
        return CIRCUITS["Miami Grand Prix"]
    
    query = location_or_name.lower()
    
    # Try direct hardcoded match
    for k, v in CIRCUITS.items():
        if k.lower() in query or query in k.lower().split()[0]:
            return v
            
    # Procedurally generate new F1 track deterministically using the location name as seed!
    h = 0
    for char in location_or_name:
        h = (h * 31 + ord(char)) & 0xFFFFFFFF
    
    def seed_rand(sub_seed):
        val = np.sin(h + sub_seed) * 10000
        return val - np.floor(val)
        
    points_count = 18 + (h % 6)
    points = []
    
    amp1 = 25 + seed_rand(1) * 35
    amp2 = 15 + seed_rand(2) * 25
    amp3 = 10 + seed_rand(3) * 15
    phase2 = seed_rand(4) * np.pi * 2
    phase3 = seed_rand(5) * np.pi * 2
    
    center = {"x": 250, "y": 120}
    
    raw_coords = []
    for i in range(points_count):
        theta = (i / points_count) * 2 * np.pi
        r = 90 + amp1 * np.sin(theta) + amp2 * np.cos(2 * theta + phase2) + amp3 * np.sin(3 * theta + phase3)
        elongation_x = 1.35
        x = center["x"] + np.cos(theta) * r * elongation_x
        y = center["y"] + np.sin(theta) * r
        raw_coords.append({"x": x, "y": y})
        
    for i in range(points_count):
        p_prev = raw_coords[(i - 1 + points_count) % points_count]
        p_curr = raw_coords[i]
        p_next = raw_coords[(i + 1) % points_count]
        
        # vectors
        v1 = {"x": p_curr["x"] - p_prev["x"], "y": p_curr["y"] - p_prev["y"]}
        v2 = {"x": p_next["x"] - p_curr["x"], "y": p_next["y"] - p_curr["y"]}
        
        len1 = np.sqrt(v1["x"]**2 + v1["y"]**2)
        len2 = np.sqrt(v2["x"]**2 + v2["y"]**2)
        
        cos_angle = 1.0
        if len1 > 0 and len2 > 0:
            cos_angle = (v1["x"]*v2["x"] + v1["y"]*v2["y"]) / (len1 * len2)
            
        cos_angle = np.clip(cos_angle, -1.0, 1.0)
        angle_change_rad = np.abs(np.arccos(cos_angle))
        
        is_sharp = angle_change_rad > 0.45
        is_mild = 0.15 < angle_change_rad <= 0.45
        
        if is_sharp:
            speed_limit = int(85 + (1.0 - angle_change_rad / np.pi) * 45)
            gear = 3 if speed_limit > 115 else 2
            throttle = int(5 + seed_rand(i + 10) * 15)
            brake = int(65 + seed_rand(i + 20) * 30)
        elif is_mild:
            speed_limit = int(155 + (1.0 - angle_change_rad / np.pi) * 60)
            gear = 5 if speed_limit > 190 else 4
            throttle = int(45 + seed_rand(i + 30) * 30)
            brake = int(10 + seed_rand(i + 40) * 20)
        else:
            speed_limit = int(295 + seed_rand(i + 50) * 45)
            gear = 8 if speed_limit > 325 else 7
            throttle = 100
            brake = 0
            
        points.append({
            "x": int(round(p_curr["x"])),
            "y": int(round(p_curr["y"])),
            "speedLimit": speed_limit,
            "gear": gear,
            "throttle": throttle,
            "brake": brake
        })
        
    apex_markers = []
    corner_counter = 1
    has_placed_drs1 = False
    has_placed_drs2 = False
    
    for i in range(points_count):
        p = points[i]
        if p["speedLimit"] < 140 and corner_counter <= 4:
            apex_markers.append({
                "x": p["x"], "y": p["y"], "label": f"T{corner_counter * 3 - 1} Apex", "type": "apex"
            })
            corner_counter += 1
        elif p["speedLimit"] > 310:
            if not has_placed_drs1 and i < points_count / 2:
                apex_markers.append({
                    "x": p["x"], "y": p["y"], "label": "DRS S1", "type": "drs"
                })
                has_placed_drs1 = True
            elif not has_placed_drs2 and i >= points_count / 2:
                apex_markers.append({
                    "x": p["x"], "y": p["y"], "label": "DRS S2", "type": "drs"
                })
                has_placed_drs2 = True
                
    if len(apex_markers) == 0:
        apex_markers.append({
            "x": points[0]["x"], "y": points[0]["y"], "label": "T1 High Apex", "type": "apex"
        })
        
    normalized_loc = location_or_name.split()[0] if location_or_name else "Miami"
    return {
        "id": "".join(c for c in normalized_loc.lower() if c.isalnum()),
        "name": location_or_name,
        "country": normalized_loc,
        "lengthKm": f"{4.0 + seed_rand(8) * 2.5:.2f}",
        "cornersCount": 12 + (h % 9),
        "points": points,
        "apexMarkers": apex_markers
    }
