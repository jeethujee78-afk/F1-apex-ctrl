export interface DriverProfile {
  number: number;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  team: string;
  color: string;
  flagUrl: string;
  portraitUrl: string;
  teamLogoUrl: string;
  nationality: string;
  championshipPosition: number;
  points: number;
  advantages: string[];
  disadvantages: string[];
  winProbability: number;
  bestLap: string;
}

export const F1_DRIVERS: DriverProfile[] = [
  {
    number: 4,
    code: "NOR",
    firstName: "Lando",
    lastName: "Norris",
    fullName: "Lando Norris",
    team: "McLaren",
    color: "#FF8000",
    flagUrl: "https://flagcdn.com/w40/gb.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png",
    nationality: "British",
    championshipPosition: 2,
    points: 331,
    advantages: ["Better Corner Exit", "Tyre Preservation", "DRS Efficiency Strong"],
    disadvantages: ["Sector 3 Loss", "Rear Tyre Wear"],
    winProbability: 74,
    bestLap: "1:27.456"
  },
  {
    number: 1,
    code: "VER",
    firstName: "Max",
    lastName: "Verstappen",
    fullName: "Max Verstappen",
    team: "Red Bull Racing",
    color: "#3671C6",
    flagUrl: "https://flagcdn.com/w40/nl.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png",
    nationality: "Dutch",
    championshipPosition: 1,
    points: 393,
    advantages: ["Top Speed Advantage", "Braking Stability", "Strong Sector 1", "ERS Efficiency"],
    disadvantages: ["Tyre Degradation", "Corner Entry Instability"],
    winProbability: 26,
    bestLap: "1:27.208"
  },
  {
    number: 16,
    code: "LEC",
    firstName: "Charles",
    lastName: "Leclerc",
    fullName: "Charles Leclerc",
    team: "Ferrari",
    color: "#E10600",
    flagUrl: "https://flagcdn.com/w40/mc.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png",
    nationality: "Monegasque",
    championshipPosition: 3,
    points: 307,
    advantages: ["Apex Speed Advantage", "Low Drag Design", "Aggressive ERS Curve"],
    disadvantages: ["Thermal Degradation", "Braking Lockups"],
    winProbability: 45,
    bestLap: "1:27.610"
  },
  {
    number: 81,
    code: "PIA",
    firstName: "Oscar",
    lastName: "Piastri",
    fullName: "Oscar Piastri",
    team: "McLaren",
    color: "#FF8000",
    flagUrl: "https://flagcdn.com/w40/au.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png",
    nationality: "Australian",
    championshipPosition: 4,
    points: 262,
    advantages: ["High-speed Balance", "Smooth Steering Inputs", "Steady Sectors"],
    disadvantages: ["Slow Corner Rotation", "Launch Traction"],
    winProbability: 38,
    bestLap: "1:27.795"
  },
  {
    number: 44,
    code: "HAM",
    firstName: "Lewis",
    lastName: "Hamilton",
    fullName: "Lewis Hamilton",
    team: "Mercedes",
    color: "#27F4D2",
    flagUrl: "https://flagcdn.com/w40/gb.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png",
    nationality: "British",
    championshipPosition: 6,
    points: 190,
    advantages: ["Wet Weather Mastery", "Optimal Race Management", "Late Braking Power"],
    disadvantages: ["Warm-up Lap Speed", "Straightline Overtake"],
    winProbability: 52,
    bestLap: "1:27.910"
  },
  {
    number: 63,
    code: "RUS",
    firstName: "George",
    lastName: "Russell",
    fullName: "George Russell",
    team: "Mercedes",
    color: "#27F4D2",
    flagUrl: "https://flagcdn.com/w40/gb.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png",
    nationality: "British",
    championshipPosition: 7,
    points: 180,
    advantages: ["Qualifying Single Lap Speed", "Tire Recovery Window", "Sector 2 Speed"],
    disadvantages: ["High Fuel Heavy Load Stability", "Tire Overheating"],
    winProbability: 33,
    bestLap: "1:28.010"
  },
  {
    number: 55,
    code: "SAI",
    firstName: "Carlos",
    lastName: "Sainz",
    fullName: "Carlos Sainz",
    team: "Ferrari",
    color: "#E10600",
    flagUrl: "https://flagcdn.com/w40/es.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png",
    nationality: "Spanish",
    championshipPosition: 5,
    points: 244,
    advantages: ["Strategic Adaptation", "Low Friction Smoothness", "Corner Apex Rotation"],
    disadvantages: ["Aero Drag Penalty", "Rear Stability"],
    winProbability: 40,
    bestLap: "1:28.110"
  },
  {
    number: 11,
    code: "PER",
    firstName: "Sergio",
    lastName: "Perez",
    fullName: "Sergio Perez",
    team: "Red Bull Racing",
    color: "#3671C6",
    flagUrl: "https://flagcdn.com/w40/mx.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png",
    nationality: "Mexican",
    championshipPosition: 8,
    points: 151,
    advantages: ["Rear Traction Control", "Excellent Street Circuits Pace", "Compound Saving"],
    disadvantages: ["Chicane Instability", "Front Wing Understeering"],
    winProbability: 25,
    bestLap: "1:28.290"
  },
  {
    number: 14,
    code: "ALO",
    firstName: "Fernando",
    lastName: "Alonso",
    fullName: "Fernando Alonso",
    team: "Aston Martin",
    color: "#229971",
    flagUrl: "https://flagcdn.com/w40/es.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png",
    nationality: "Spanish",
    championshipPosition: 9,
    points: 62,
    advantages: ["Extreme Experience", "Relentless Overtaking", "Optimal Wet Trajectories"],
    disadvantages: ["Power Unit Margins"],
    winProbability: 18,
    bestLap: "1:28.410"
  },
  {
    number: 18,
    code: "STR",
    firstName: "Lance",
    lastName: "Stroll",
    fullName: "Lance Stroll",
    team: "Aston Martin",
    color: "#229971",
    flagUrl: "https://flagcdn.com/w40/ca.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png",
    nationality: "Canadian",
    championshipPosition: 10,
    points: 24,
    advantages: ["Wet Weather Starts", "High Speed Line Precision"],
    disadvantages: ["Qualifying Consistency"],
    winProbability: 8,
    bestLap: "1:28.890"
  },
  {
    number: 27,
    code: "HUL",
    firstName: "Nico",
    lastName: "Hulkenberg",
    fullName: "Nico Hulkenberg",
    team: "Haas",
    color: "#B6BABD",
    flagUrl: "https://flagcdn.com/w40/de.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png",
    nationality: "German",
    championshipPosition: 11,
    points: 31,
    advantages: ["Qualifying Single Lap Masterry", "Quick Heat Cycles"],
    disadvantages: ["Race Run Degradation"],
    winProbability: 12,
    bestLap: "1:28.520"
  },
  {
    number: 20,
    code: "MAG",
    firstName: "Kevin",
    lastName: "Magnussen",
    fullName: "Kevin Magnussen",
    team: "Haas",
    color: "#B0B0B0",
    flagUrl: "https://flagcdn.com/w40/dk.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png",
    nationality: "Danish",
    championshipPosition: 15,
    points: 15,
    advantages: ["Aggressive Wheeltowheel battling", "Launch Control Reactions"],
    disadvantages: ["Telemetry Warnings penalty count"],
    winProbability: 5,
    bestLap: "1:28.910"
  },
  {
    number: 22,
    code: "TSU",
    firstName: "Yuki",
    lastName: "Tsunoda",
    fullName: "Yuki Tsunoda",
    team: "RB",
    color: "#6692FF",
    flagUrl: "https://flagcdn.com/w40/jp.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/rb.png",
    nationality: "Japanese",
    championshipPosition: 12,
    points: 22,
    advantages: ["Late Braking Agility", "Low Fuel Hotlaps"],
    disadvantages: ["Radio Tempers", "Warmup cycle speed"],
    winProbability: 14,
    bestLap: "1:28.600"
  },
  {
    number: 30,
    code: "LAW",
    firstName: "Liam",
    lastName: "Lawson",
    fullName: "Liam Lawson",
    team: "RB",
    color: "#6692FF",
    flagUrl: "https://flagcdn.com/w40/nz.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/rb.png",
    nationality: "New Zealander",
    championshipPosition: 20,
    points: 4,
    advantages: ["Tire Whispering", "Excellent wet recovery lines"],
    disadvantages: ["Low Single-run setup familiarity"],
    winProbability: 6,
    bestLap: "1:28.950"
  },
  {
    number: 23,
    code: "ALB",
    firstName: "Alex",
    lastName: "Albon",
    fullName: "Alex Albon",
    team: "Williams",
    color: "#37BEDD",
    flagUrl: "https://flagcdn.com/w40/th.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png",
    nationality: "Thai",
    championshipPosition: 13,
    points: 12,
    advantages: ["Defensive Positioning", "Straightline Low Drag Speed"],
    disadvantages: ["Downforce limitations"],
    winProbability: 11,
    bestLap: "1:28.710"
  },
  {
    number: 43,
    code: "COL",
    firstName: "Franco",
    lastName: "Colapinto",
    fullName: "Franco Colapinto",
    team: "Williams",
    color: "#37BEDD",
    flagUrl: "https://flagcdn.com/w40/ar.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png",
    nationality: "Argentine",
    championshipPosition: 18,
    points: 5,
    advantages: ["Brave high speed commits", "Street circuit speed"],
    disadvantages: ["Brake wear rate"],
    winProbability: 7,
    bestLap: "1:28.840"
  },
  {
    number: 10,
    code: "GAS",
    firstName: "Pierre",
    lastName: "Gasly",
    fullName: "Pierre Gasly",
    team: "Alpine",
    color: "#FF87BC",
    flagUrl: "https://flagcdn.com/w40/fr.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png",
    nationality: "French",
    championshipPosition: 14,
    points: 26,
    advantages: ["Fast adaptation to weather changes", "High entry speed"],
    disadvantages: ["Chasis balance stability issues"],
    winProbability: 10,
    bestLap: "1:28.690"
  },
  {
    number: 31,
    code: "OCO",
    firstName: "Esteban",
    lastName: "Ocon",
    fullName: "Esteban Ocon",
    team: "Alpine",
    color: "#FF87BC",
    flagUrl: "https://flagcdn.com/w40/fr.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png",
    nationality: "French",
    championshipPosition: 16,
    points: 10,
    advantages: ["Sturdy defensive width", "Tyre recovery"],
    disadvantages: ["Inter-team collisions history"],
    winProbability: 5,
    bestLap: "1:28.910"
  },
  {
    number: 77,
    code: "BOT",
    firstName: "Valtteri",
    lastName: "Bottas",
    fullName: "Valtteri Bottas",
    team: "Kick Sauber",
    color: "#52E252",
    flagUrl: "https://flagcdn.com/w40/fi.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png",
    nationality: "Finnish",
    championshipPosition: 21,
    points: 0,
    advantages: ["Qualifying single runs", "Consistent corner flow"],
    disadvantages: ["Launch traction delays"],
    winProbability: 2,
    bestLap: "1:29.020"
  },
  {
    number: 24,
    code: "ZHO",
    firstName: "Guanyu",
    lastName: "Zhou",
    fullName: "Guanyu Zhou",
    team: "Sauber",
    color: "#52E252",
    flagUrl: "https://flagcdn.com/w40/cn.png",
    portraitUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/ZHOGUA01_Guanyu_Zhou/zhogua01.png",
    teamLogoUrl: "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png",
    nationality: "Chinese",
    championshipPosition: 22,
    points: 0,
    advantages: ["Smooth gear preservation", "Steady race management"],
    disadvantages: ["Peak qualifying downforce speed"],
    winProbability: 1,
    bestLap: "1:29.350"
  }
];

export interface FallbackMeeting {
  meeting_key: string;
  location: string;
  country_name: string;
  meeting_name: string;
  year: number;
}

export interface FallbackSession {
  session_key: string;
  session_name: string;
  session_type: string;
}

export const CENTRALIZED_FALLBACK = {
  years: [2026, 2025, 2024, 2023],
  meetings: [
    { meeting_key: "9522", location: "Miami", country_name: "United States", meeting_name: "Miami Grand Prix", year: 2024 },
    { meeting_key: "1234", location: "Monaco", country_name: "Monaco", meeting_name: "Monaco Grand Prix", year: 2024 },
    { meeting_key: "5678", location: "Monza", country_name: "Italy", meeting_name: "Monza Grand Prix", year: 2024 },
    { meeting_key: "9999", location: "Silverstone", country_name: "United Kingdom", meeting_name: "Silverstone GP", year: 2024 },
    { meeting_key: "9158", location: "Sakhir", country_name: "Bahrain", meeting_name: "Bahrain Grand Prix", year: 2024 }
  ] as FallbackMeeting[],
  sessions: [
    { session_key: "9522", session_name: "Race", session_type: "Race" },
    { session_key: "9521", session_name: "Qualifying", session_type: "Qualifying" }
  ] as FallbackSession[],
  drivers: F1_DRIVERS.map(d => ({
    driver_number: d.number,
    name_acronym: d.code,
    full_name: d.fullName,
    team_name: d.team,
    team_colour: d.color.replace("#", "")
  }))
};

