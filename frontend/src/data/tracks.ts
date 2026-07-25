export interface TrackPoint {
  x: number;
  y: number;
  speedLimit: number;
  gear: number;
  throttle: number;
  brake: number;
}

export interface CircuitInfo {
  id: string;
  name: string;
  country: string;
  lengthKm: string;
  cornersCount: number;
  points: TrackPoint[];
  apexMarkers: { x: number; y: number; label: string; type: "apex" | "drs" | "sector" }[];
}

export const CIRCUITS: Record<string, CircuitInfo> = {
  "Miami Grand Prix": {
    id: "miami",
    name: "Miami International Autodrome",
    country: "USA",
    lengthKm: "5.41",
    cornersCount: 19,
    points: [
      { x: 100, y: 195, speedLimit: 335, gear: 8, throttle: 100, brake: 0 },
      { x: 160, y: 200, speedLimit: 339, gear: 8, throttle: 100, brake: 0 },
      { x: 220, y: 198, speedLimit: 341, gear: 8, throttle: 100, brake: 0 },
      { x: 290, y: 190, speedLimit: 220, gear: 5, throttle: 20, brake: 65 }, // Turn 1
      { x: 330, y: 155, speedLimit: 120, gear: 3, throttle: 0, brake: 90 },  // Turn 2
      { x: 360, y: 110, speedLimit: 95,  gear: 2, throttle: 15, brake: 40 },  // Turn 3
      { x: 395, y: 130, speedLimit: 190, gear: 4, throttle: 65, brake: 0 },  // Turn 4
      { x: 440, y: 165, speedLimit: 245, gear: 6, throttle: 90, brake: 0 },
      { x: 470, y: 150, speedLimit: 210, gear: 5, throttle: 50, brake: 15 },
      { x: 410, y: 95,  speedLimit: 160, gear: 4, throttle: 30, brake: 25 },  // Turn 5
      { x: 365, y: 65,  speedLimit: 140, gear: 3, throttle: 10, brake: 35 },
      { x: 310, y: 55,  speedLimit: 280, gear: 7, throttle: 100, brake: 0 },  // back-straight
      { x: 250, y: 70,  speedLimit: 295, gear: 7, throttle: 100, brake: 0 },
      { x: 210, y: 85,  speedLimit: 130, gear: 3, throttle: 5, brake: 80 },   // chicane
      { x: 175, y: 68,  speedLimit: 115, gear: 2, throttle: 0, brake: 85 },
      { x: 130, y: 78,  speedLimit: 270, gear: 6, throttle: 95, brake: 0 },
      { x: 80,  y: 88,  speedLimit: 315, gear: 7, throttle: 100, brake: 0 },  // DRS Zone S1
      { x: 45,  y: 115, speedLimit: 105, gear: 2, throttle: 0, brake: 95 },   // Turn 17 Hairpin
      { x: 65,  y: 155, speedLimit: 175, gear: 4, throttle: 70, brake: 0 },   // pit straight
    ],
    apexMarkers: [
      { x: 290, y: 190, label: "T1 Apex", type: "apex" },
      { x: 410, y: 95, label: "DRS S1", type: "drs" },
      { x: 175, y: 68, label: "S2 Trap", type: "sector" },
    ],
  },
  "Monaco Grand Prix": {
    id: "monaco",
    name: "Circuit de Monaco",
    country: "Monaco",
    lengthKm: "3.33",
    cornersCount: 19,
    points: [
      { x: 90,  y: 180, speedLimit: 280, gear: 6, throttle: 100, brake: 0 },   // Beau Rivage Climb
      { x: 130, y: 130, speedLimit: 180, gear: 4, throttle: 60, brake: 10 },
      { x: 180, y: 90,  speedLimit: 120, gear: 3, throttle: 20, brake: 50 },  // Massenet
      { x: 220, y: 80,  speedLimit: 140, gear: 3, throttle: 40, brake: 20 },  // Casino Square
      { x: 260, y: 100, speedLimit: 95,  gear: 2, throttle: 5,  brake: 65 },  // Mirabeau Haute
      { x: 280, y: 130, speedLimit: 45,  gear: 1, throttle: 0,  brake: 95 },  // Grand Hotel Hairpin (Slowest corner on grid)
      { x: 250, y: 150, speedLimit: 85,  gear: 2, throttle: 25, brake: 40 },  // Mirabeau Bas
      { x: 280, y: 175, speedLimit: 100, gear: 2, throttle: 35, brake: 30 },  // Portier
      { x: 330, y: 185, speedLimit: 290, gear: 7, throttle: 100, brake: 0 },  // Tunnel Straight
      { x: 380, y: 180, speedLimit: 305, gear: 8, throttle: 100, brake: 0 },
      { x: 430, y: 150, speedLimit: 110, gear: 2, throttle: 0,  brake: 85 },  // Nouvelle Chicane
      { x: 400, y: 110, speedLimit: 160, gear: 4, throttle: 50, brake: 15 },  // Tabac
      { x: 340, y: 95,  speedLimit: 215, gear: 5, throttle: 80, brake: 10 },  // Louis Chiron
      { x: 290, y: 90,  speedLimit: 110, gear: 2, throttle: 10, brake: 70 },  // Piscine entry
      { x: 230, y: 120, speedLimit: 90,  gear: 2, throttle: 15, brake: 60 },  // Rascasse
      { x: 160, y: 150, speedLimit: 75,  gear: 1, throttle: 5,  brake: 80 },  // Anthony Noghes
      { x: 110, y: 175, speedLimit: 240, gear: 5, throttle: 100, brake: 0 },  // Start / Finish Line
    ],
    apexMarkers: [
      { x: 280, y: 130, label: "Hairpin (45K)", type: "apex" },
      { x: 330, y: 185, label: "Tunnel Out", type: "sector" },
      { x: 230, y: 120, label: "Rascasse", type: "apex" },
    ],
  },
  "Monza Grand Prix": {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    country: "Italy",
    lengthKm: "5.79",
    cornersCount: 11,
    points: [
      { x: 60,  y: 190, speedLimit: 350, gear: 8, throttle: 100, brake: 0 },   // Start Straight
      { x: 120, y: 195, speedLimit: 355, gear: 8, throttle: 100, brake: 0 },
      { x: 190, y: 200, speedLimit: 360, gear: 8, throttle: 100, brake: 0 },   // Speed trap champion
      { x: 260, y: 190, speedLimit: 75,  gear: 1, throttle: 0,  brake: 98 },   // Prima Variante (Heavy braking)
      { x: 310, y: 145, speedLimit: 180, gear: 4, throttle: 70, brake: 0 },   // Biassono Curve
      { x: 360, y: 100, speedLimit: 315, gear: 7, throttle: 100, brake: 0 },   
      { x: 420, y: 70,  speedLimit: 115, gear: 2, throttle: 0,  brake: 85 },   // Variante della Roggia
      { x: 380, y: 45,  speedLimit: 230, gear: 5, throttle: 80, brake: 5 },    // Lesmo 1
      { x: 320, y: 40,  speedLimit: 200, gear: 4, throttle: 75, brake: 15 },   // Lesmo 2
      { x: 250, y: 60,  speedLimit: 330, gear: 8, throttle: 100, brake: 0 },   // Serraglio Straight
      { x: 170, y: 80,  speedLimit: 190, gear: 4, throttle: 60, brake: 40 },   // Variante Ascari
      { x: 100, y: 110, speedLimit: 290, gear: 7, throttle: 100, brake: 0 },
      { x: 40,  y: 130, speedLimit: 250, gear: 6, throttle: 90, brake: 25 },   // Curva Parabolica (Alboreto)
    ],
    apexMarkers: [
      { x: 260, y: 190, label: "T1 Chicane", type: "apex" },
      { x: 420, y: 70,  label: "Roggia GP", type: "apex" },
      { x: 170, y: 80,  label: "Ascari Out", type: "sector" },
    ],
  },
  "Silverstone GP": {
    id: "silverstone",
    name: "Silverstone Circuit",
    country: "UK",
    lengthKm: "5.89",
    cornersCount: 18,
    points: [
      { x: 80,  y: 190, speedLimit: 290, gear: 7, throttle: 100, brake: 0 },   // Hamilton straight
      { x: 150, y: 200, speedLimit: 310, gear: 7, throttle: 100, brake: 0 },   // Abbey
      { x: 210, y: 185, speedLimit: 180, gear: 4, throttle: 60, brake: 30 },   // Arena
      { x: 240, y: 140, speedLimit: 95,  gear: 2, throttle: 10, brake: 75 },   // Luffield
      { x: 200, y: 95,  speedLimit: 290, gear: 7, throttle: 100, brake: 0 },   // Woodcote Straight
      { x: 150, y: 70,  speedLimit: 260, gear: 6, throttle: 95, brake: 5 },    // Copse (Famous ultra-high-speed)
      { x: 210, y: 40,  speedLimit: 285, gear: 7, throttle: 100, brake: 0 },   // Maggots
      { x: 280, y: 45,  speedLimit: 265, gear: 6, throttle: 90, brake: 10 },   // Becketts
      { x: 330, y: 65,  speedLimit: 195, gear: 4, throttle: 55, brake: 45 },   // Chapel
      { x: 390, y: 90,  speedLimit: 322, gear: 8, throttle: 100, brake: 0 },   // Hangar Straight
      { x: 430, y: 125, speedLimit: 140, gear: 3, throttle: 5,  brake: 80 },   // Stowe Corner
      { x: 360, y: 145, speedLimit: 285, gear: 7, throttle: 100, brake: 0 },   // Vale
      { x: 290, y: 160, speedLimit: 85,  gear: 2, throttle: 0,  brake: 90 },   // Club Corner
      { x: 180, y: 175, speedLimit: 195, gear: 4, throttle: 70, brake: 10 },
    ],
    apexMarkers: [
      { x: 150, y: 70, label: "Copse Apex", type: "apex" },
      { x: 280, y: 45, label: "Becketts Complex", type: "apex" },
      { x: 390, y: 90, label: "Hangar DRS", type: "drs" },
    ],
  },
  "Bahrain Grand Prix": {
    id: "bahrain",
    name: "Bahrain International Circuit",
    country: "Bahrain",
    lengthKm: "5.41",
    cornersCount: 15,
    points: [
      { x: 90,  y: 190, speedLimit: 320, gear: 8, throttle: 100, brake: 0 },
      { x: 160, y: 195, speedLimit: 330, gear: 8, throttle: 100, brake: 0 },
      { x: 240, y: 190, speedLimit: 80,  gear: 1, throttle: 0,  brake: 95 },   // Turn 1 Apex
      { x: 280, y: 150, speedLimit: 130, gear: 3, throttle: 40, brake: 20 },   // Turn 2
      { x: 320, y: 110, speedLimit: 295, gear: 7, throttle: 100, brake: 0 },   // Left Sweeper
      { x: 370, y: 75,  speedLimit: 120, gear: 3, throttle: 10, brake: 75 },   // Turn 4
      { x: 310, y: 55,  speedLimit: 220, gear: 5, throttle: 80, brake: 10 },   // S-Section
      { x: 250, y: 65,  speedLimit: 190, gear: 4, throttle: 65, brake: 15 },
      { x: 190, y: 70,  speedLimit: 105, gear: 2, throttle: 5,  brake: 85 },   // Turn 10 Lockup Hazard
      { x: 140, y: 80,  speedLimit: 295, gear: 7, throttle: 100, brake: 0 },   // Back Straight
      { x: 80,  y: 105, speedLimit: 250, gear: 6, throttle: 90, brake: 20 },   // Turn 11 downhill
      { x: 50,  y: 145, speedLimit: 180, gear: 4, throttle: 70, brake: 30 },   // Turn 12
      { x: 110, y: 175, speedLimit: 310, gear: 7, throttle: 100, brake: 0 },
    ],
    apexMarkers: [
      { x: 240, y: 190, label: "T1 Hairpin", type: "apex" },
      { x: 190, y: 70,  label: "T10 Lockup", type: "apex" },
      { x: 140, y: 80,  label: "DRS Limit", type: "drs" },
    ],
  },
};

export function getCircuitData(locationOrName: string): CircuitInfo {
  if (!locationOrName) {
    return CIRCUITS["Miami Grand Prix"];
  }

  const query = locationOrName.toLowerCase();
  
  // 1. Try to find a hardcoded match
  const matchedKey = Object.keys(CIRCUITS).find((k) =>
    k.toLowerCase().includes(query) || query.includes(k.toLowerCase().split(" ")[0])
  );
  if (matchedKey && CIRCUITS[matchedKey]) {
    return CIRCUITS[matchedKey];
  }

  // 2. Procedurally generate a unique F1 track if no hardcoded match found!
  // Simple deterministic string hashing helper
  let hash = 0;
  for (let i = 0; i < locationOrName.length; i++) {
    hash = (hash << 5) - hash + locationOrName.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const seedRandom = (subSeed: number) => {
    const x = Math.sin(hash + subSeed) * 10000;
    return x - Math.floor(x);
  };

  // Generate beautiful track points along a smooth polar loop
  const pointsCount = 18 + Math.abs(hash % 6); // 18 to 23 points for interesting shapes
  const points: { x: number; y: number; speedLimit: number; gear: number; throttle: number; brake: number }[] = [];

  // Seed shapes using deterministic random waves
  const amp1 = 25 + seedRandom(1) * 35;
  const amp2 = 15 + seedRandom(2) * 25;
  const amp3 = 10 + seedRandom(3) * 15;
  const phase2 = seedRandom(4) * Math.PI * 2;
  const phase3 = seedRandom(5) * Math.PI * 2;

  const center = { x: 250, y: 120 };

  // Calculate raw shapes
  const rawCoords: { x: number; y: number }[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const theta = (i / pointsCount) * 2 * Math.PI;
    
    // Smooth polar formula for circuit shapes
    const r = 90 + 
      amp1 * Math.sin(theta) + 
      amp2 * Math.cos(2 * theta + phase2) + 
      amp3 * Math.sin(3 * theta + phase3);

    // Add extra stretching on x-axis or y-axis to create a more elongated realistic F1 shape
    const elongationX = 1.35;
    const x = center.x + Math.cos(theta) * r * elongationX;
    const y = center.y + Math.sin(theta) * r;
    rawCoords.push({ x, y });
  }

  // Double check and calculate curvature to set realistic speeds/gears
  for (let i = 0; i < pointsCount; i++) {
    const pPrev = rawCoords[(i - 1 + pointsCount) % pointsCount];
    const pCurr = rawCoords[i];
    const pNext = rawCoords[(i + 1) % pointsCount];

    // Compute angle vectors
    const v1 = { x: pCurr.x - pPrev.x, y: pCurr.y - pPrev.y };
    const v2 = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };

    const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    let cosAngle = 1.0;
    if (len1 > 0 && len2 > 0) {
      cosAngle = (v1.x * v2.x + v1.y * v2.y) / (len1 * len2);
    }
    // Clip cosAngle just in case
    cosAngle = Math.max(-1.0, Math.min(1.0, cosAngle));
    const angleChangeRad = Math.abs(Math.acos(cosAngle));

    // A large angle change means sharp curve!
    const isSharpCurve = angleChangeRad > 0.45;
    const isMildCurve = angleChangeRad > 0.15 && angleChangeRad <= 0.45;

    let speedLimit = 320;
    let gear = 7;
    let throttle = 100;
    let brake = 0;

    if (isSharpCurve) {
      speedLimit = Math.round(85 + (1.0 - angleChangeRad / Math.PI) * 45); // 85 to 130 km/h
      gear = speedLimit > 115 ? 3 : 2;
      throttle = Math.round(5 + seedRandom(i + 10) * 15);
      brake = Math.round(65 + seedRandom(i + 20) * 30);
    } else if (isMildCurve) {
      speedLimit = Math.round(155 + (1.0 - angleChangeRad / Math.PI) * 60); // 155 to 215 km/h
      gear = speedLimit > 190 ? 5 : 4;
      throttle = Math.round(45 + seedRandom(i + 30) * 30);
      brake = Math.round(10 + seedRandom(i + 40) * 20);
    } else {
      // Straightaway
      speedLimit = Math.round(295 + seedRandom(i + 50) * 45); // 295 to 340 km/h
      gear = speedLimit > 325 ? 8 : 7;
      throttle = 100;
      brake = 0;
    }

    points.push({
      x: Math.round(pCurr.x),
      y: Math.round(pCurr.y),
      speedLimit,
      gear,
      throttle,
      brake
    });
  }

  // Dynamically place apex label tags at sharpest corners & DRS on straight sectors
  const apexMarkers: { x: number; y: number; label: string; type: "apex" | "drs" | "sector" }[] = [];
  let cornerCounter = 1;
  let hasPlacedDrsSec1 = false;
  let hasPlacedDrsSec2 = false;

  for (let i = 0; i < pointsCount; i++) {
    const p = points[i];
    const isSlowCorner = p.speedLimit < 140;
    if (isSlowCorner && cornerCounter <= 4) {
      apexMarkers.push({
        x: p.x,
        y: p.y,
        label: `T${cornerCounter * 3 - 1} Apex`,
        type: "apex"
      });
      cornerCounter++;
    } else if (p.speedLimit > 310) {
      if (!hasPlacedDrsSec1 && i < pointsCount / 2) {
        apexMarkers.push({
          x: p.x,
          y: p.y,
          label: "DRS S1",
          type: "drs"
        });
        hasPlacedDrsSec1 = true;
      } else if (!hasPlacedDrsSec2 && i >= pointsCount / 2) {
        apexMarkers.push({
          x: p.x,
          y: p.y,
          label: "DRS S2",
          type: "drs"
        });
        hasPlacedDrsSec2 = true;
      }
    }
  }

  // If no apex markers were found, push a default one to make sure track always looks high-fidelity
  if (apexMarkers.length === 0) {
    apexMarkers.push({
      x: points[0].x,
      y: points[0].y,
      label: "T1 High Apex",
      type: "apex"
    });
  }

  const normalizedLocation = locationOrName.split(" ")[0] || locationOrName;

  return {
    id: normalizedLocation.toLowerCase().replace(/[^a-z0-9]/g, ""),
    name: locationOrName,
    country: normalizedLocation,
    lengthKm: (4.0 + seedRandom(8) * 2.5).toFixed(2),
    cornersCount: 12 + Math.abs(hash % 9),
    points,
    apexMarkers
  };
}
