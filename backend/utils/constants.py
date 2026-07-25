# utils/constants.py

# Active F1 Drivers roster with comprehensive telemetry specs and biographical stats
F1_DRIVERS = [
    {
        "number": 4, "code": "NOR", "firstName": "Lando", "lastName": "Norris",
        "fullName": "Lando Norris", "team": "McLaren", "color": "#FF8000",
        "flagUrl": "https://flagcdn.com/w40/gb.png", "nationality": "British",
        "championshipPosition": 2, "points": 331,
        "advantages": ["Better Corner Exit", "Tyre Preservation", "DRS Efficiency Strong"],
        "disadvantages": ["Sector 3 Loss", "Rear Tyre Wear"], "winProbability": 74, "bestLap": "1:27.456",
        "compound": "MEDIUM", "tyreLife": 63, "fuelLoad": 32.4, "drsEfficiency": 89
    },
    {
        "number": 1, "code": "VER", "firstName": "Max", "lastName": "Verstappen",
        "fullName": "Max Verstappen", "team": "Red Bull Racing", "color": "#3671C6",
        "flagUrl": "https://flagcdn.com/w40/nl.png", "nationality": "Dutch",
        "championshipPosition": 1, "points": 393,
        "advantages": ["Top Speed Advantage", "Braking Stability", "Strong Sector 1", "ERS Efficiency"],
        "disadvantages": ["Tyre Degradation", "Corner Entry Instability"], "winProbability": 26, "bestLap": "1:27.208",
        "compound": "MEDIUM", "tyreLife": 61, "fuelLoad": 32.1, "drsEfficiency": 84
    },
    {
        "number": 16, "code": "LEC", "firstName": "Charles", "lastName": "Leclerc",
        "fullName": "Charles Leclerc", "team": "Ferrari", "color": "#E10600",
        "flagUrl": "https://flagcdn.com/w40/mc.png", "nationality": "Monegasque",
        "championshipPosition": 3, "points": 307,
        "advantages": ["Apex Speed Advantage", "Low Drag Design", "Aggressive ERS Curve"],
        "disadvantages": ["Thermal Degradation", "Braking Lockups"], "winProbability": 45, "bestLap": "1:27.610",
        "compound": "SOFT", "tyreLife": 42, "fuelLoad": 31.8, "drsEfficiency": 88
    },
    {
        "number": 81, "code": "PIA", "firstName": "Oscar", "lastName": "Piastri",
        "fullName": "Oscar Piastri", "team": "McLaren", "color": "#FF8000",
        "flagUrl": "https://flagcdn.com/w40/au.png", "nationality": "Australian",
        "championshipPosition": 4, "points": 262,
        "advantages": ["High-speed Balance", "Smooth Steering Inputs", "Steady Sectors"],
        "disadvantages": ["Slow Corner Rotation", "Launch Traction"], "winProbability": 38, "bestLap": "1:27.795",
        "compound": "MEDIUM", "tyreLife": 55, "fuelLoad": 32.8, "drsEfficiency": 87
    },
    {
        "number": 44, "code": "HAM", "firstName": "Lewis", "lastName": "Hamilton",
        "fullName": "Lewis Hamilton", "team": "Mercedes", "color": "#27F4D2",
        "flagUrl": "https://flagcdn.com/w40/gb.png", "nationality": "British",
        "championshipPosition": 6, "points": 190,
        "advantages": ["Wet Weather Mastery", "Optimal Race Management", "Late Braking Power"],
        "disadvantages": ["Warm-up Lap Speed", "Straightline Overtake"], "winProbability": 52, "bestLap": "1:27.910",
        "compound": "HARD", "tyreLife": 72, "fuelLoad": 33.1, "drsEfficiency": 85
    },
    {
        "number": 63, "code": "RUS", "firstName": "George", "lastName": "Russell",
        "fullName": "George Russell", "team": "Mercedes", "color": "#27F4D2",
        "flagUrl": "https://flagcdn.com/w40/gb.png", "nationality": "British",
        "championshipPosition": 7, "points": 180,
        "advantages": ["Qualifying Single Lap Speed", "Tire Recovery Window", "Sector 2 Speed"],
        "disadvantages": ["High Fuel Heavy Load Stability", "Tire Overheating"], "winProbability": 33, "bestLap": "1:28.010",
        "compound": "MEDIUM", "tyreLife": 52, "fuelLoad": 32.5, "drsEfficiency": 86
    },
    {
        "number": 55, "code": "SAI", "firstName": "Carlos", "lastName": "Sainz",
        "fullName": "Carlos Sainz", "team": "Ferrari", "color": "#E10600",
        "flagUrl": "https://flagcdn.com/w40/es.png", "nationality": "Spanish",
        "championshipPosition": 5, "points": 244,
        "advantages": ["Strategic Adaptation", "Low Friction Smoothness", "Corner Apex Rotation"],
        "disadvantages": ["Aero Drag Penalty", "Rear Stability"], "winProbability": 40, "bestLap": "1:28.110",
        "compound": "SOFT", "tyreLife": 39, "fuelLoad": 31.9, "drsEfficiency": 83
    },
    {
        "number": 11, "code": "PER", "firstName": "Sergio", "lastName": "Perez",
        "fullName": "Sergio Perez", "team": "Red Bull Racing", "color": "#3671C6",
        "flagUrl": "https://flagcdn.com/w40/mx.png", "nationality": "Mexican",
        "championshipPosition": 8, "points": 151,
        "advantages": ["Rear Traction Control", "Excellent Street Circuits Pace", "Compound Saving"],
        "disadvantages": ["Chicane Instability", "Front Wing Understeering"], "winProbability": 25, "bestLap": "1:28.290",
        "compound": "MEDIUM", "tyreLife": 48, "fuelLoad": 32.2, "drsEfficiency": 80
    },
    {
        "number": 14, "code": "ALO", "firstName": "Fernando", "lastName": "Alonso",
        "fullName": "Fernando Alonso", "team": "Aston Martin", "color": "#229971",
        "flagUrl": "https://flagcdn.com/w40/es.png", "nationality": "Spanish",
        "championshipPosition": 9, "points": 62,
        "advantages": ["Extreme Experience", "Relentless Overtaking", "Optimal Wet Trajectories"],
        "disadvantages": ["Power Unit Margins"], "winProbability": 18, "bestLap": "1:28.410",
        "compound": "HARD", "tyreLife": 81, "fuelLoad": 33.5, "drsEfficiency": 82
    },
    {
        "number": 18, "code": "STR", "firstName": "Lance", "lastName": "Stroll",
        "fullName": "Lance Stroll", "team": "Aston Martin", "color": "#229971",
        "flagUrl": "https://flagcdn.com/w40/ca.png", "nationality": "Canadian",
        "championshipPosition": 10, "points": 24,
        "advantages": ["Wet Weather Starts", "High Speed Line Precision"],
        "disadvantages": ["Qualifying Consistency"], "winProbability": 8, "bestLap": "1:28.890",
        "compound": "MEDIUM", "tyreLife": 41, "fuelLoad": 32.9, "drsEfficiency": 81
    }
]

# Standard Grand Prix Circuits specs with high-resolution physical coordinates
CIRCUITS = {
    "Miami Grand Prix": {
        "id": "miami",
        "name": "Miami International Autodrome",
        "country": "USA",
        "lengthKm": "5.412",
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
        "lengthKm": "3.337",
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
        "lengthKm": "5.793",
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
        "lengthKm": "5.891",
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
            {"x": 430, "y": 125, "speedLimit": 140, "gear": 3, "throttle": 5, "brake": 80},  # Stowe
            {"x": 360, "y": 145, "speedLimit": 285, "gear": 7, "throttle": 100, "brake": 0},
            {"x": 290, "y": 160, "speedLimit": 85,  "gear": 2, "throttle": 0, "brake": 90},  # Club
            {"x": 180, "y": 175, "speedLimit": 195, "gear": 4, "throttle": 70, "brake": 10}
        ],
        "apexMarkers": [
            {"x": 150, "y": 70, "label": "Copse Apex", "type": "apex"},
            {"x": 280, "y": 45, "label": "Becketts Complex", "type": "apex"},
            {"x": 390, "y": 90, "label": "Hangar DRS", "type": "drs"}
        ]
    }
}
