type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
};

// SVG map dimensions from map.svg: viewBox="0 0 1646 1447"
const SVG_WIDTH = 1646;
const SVG_HEIGHT = 1447;

// Define the six spawn locations from map.svg rectangles
// Berlin: x="647.38879" y="794.15015" width="4.2229729" height="11.975099"
// Moskwa: x="1170.4689" y="544.43744" width="19.241098" height="15.148209"
// Fuhrermuseum: x="687.17358" y="955.79181" width="5.841177" height="5.9414663"
// Altaussee: x="600.20392" y="989.81628" width="8.0817862" height="3.9278119"
// Merkers: x="589.38519" y="847.62286" width="9.9166393" height="8.7934942"
// Neuschwanstein: x="610.38757" y="968.58258" width="13.836784" height="6.2316003"

interface SpawnLocation {
  name: string;
  centerX: number; // Center X in SVG coordinates
  centerY: number; // Center Y in SVG coordinates
  radiusX: number; // Half width for variance
  radiusY: number; // Half height for variance
}

const SPAWN_LOCATIONS: SpawnLocation[] = [
  {
    name: 'Berlin',
    centerX: 647.38879 + 4.2229729 / 2,
    centerY: 794.15015 + 11.975099 / 2,
    radiusX: 4.2229729 / 2,
    radiusY: 11.975099 / 2,
  },
  {
    name: 'Moskwa',
    centerX: 1170.4689 + 19.241098 / 2,
    centerY: 544.43744 + 15.148209 / 2,
    radiusX: 19.241098 / 2,
    radiusY: 15.148209 / 2,
  },
  {
    name: 'Fuhrermuseum',
    centerX: 687.17358 + 5.841177 / 2,
    centerY: 955.79181 + 5.9414663 / 2,
    radiusX: 5.841177 / 2,
    radiusY: 5.9414663 / 2,
  },
  {
    name: 'Altaussee',
    centerX: 600.20392 + 8.0817862 / 2,
    centerY: 989.81628 + 3.9278119 / 2,
    radiusX: 8.0817862 / 2,
    radiusY: 3.9278119 / 2,
  },
  {
    name: 'Merkers',
    centerX: 589.38519 + 9.9166393 / 2,
    centerY: 847.62286 + 8.7934942 / 2,
    radiusX: 9.9166393 / 2,
    radiusY: 8.7934942 / 2,
  },
  {
    name: 'Neuschwanstein',
    centerX: 610.38757 + 13.836784 / 2,
    centerY: 968.58258 + 6.2316003 / 2,
    radiusX: 13.836784 / 2,
    radiusY: 6.2316003 / 2,
  },
];

// Legacy constants (kept for backwards compatibility but not used for spawn locations)
const TOP_SAFE_ZONE = 25; // Percentage from top (covers top bar + marker height + margin)
const BOTTOM_SAFE_ZONE = 25; // Percentage from bottom (covers bottom bar + marker height + margin)
const SIDE_MARGIN = 5; // Percentage margin on left/right sides
const MIN_DISTANCE_BETWEEN_MARKERS = 10; // Minimum distance in percentage points between markers

// Helper function to validate if a position is safe
export function isValidMarkerPosition(top: string, left: string): boolean {
  const topNum = parseFloat(top);
  const leftNum = parseFloat(left);
  
  // Check if top is in safe zone (not too high, accounting for marker height)
  if (topNum < TOP_SAFE_ZONE || topNum > (100 - BOTTOM_SAFE_ZONE)) {
    return false;
  }
  
  // Check if left is in safe zone
  if (leftNum < SIDE_MARGIN || leftNum > (100 - SIDE_MARGIN)) {
    return false;
  }
  
  return true;
}

// Helper function to clamp a position to safe zone
export function clampMarkerPosition(top: string, left: string): { top: string; left: string } {
  let topNum = parseFloat(top);
  let leftNum = parseFloat(left);
  
  // Clamp top to safe zone
  if (topNum < TOP_SAFE_ZONE) {
    topNum = TOP_SAFE_ZONE;
  } else if (topNum > (100 - BOTTOM_SAFE_ZONE)) {
    topNum = 100 - BOTTOM_SAFE_ZONE;
  }
  
  // Clamp left to safe zone
  if (leftNum < SIDE_MARGIN) {
    leftNum = SIDE_MARGIN;
  } else if (leftNum > (100 - SIDE_MARGIN)) {
    leftNum = 100 - SIDE_MARGIN;
  }
  
  return {
    top: `${topNum}%`,
    left: `${leftNum}%`,
  };
}

// Returns a new array with one randomly chosen marker moved to a random position (top/left percentages).
export function placeRandomMarker(markers: Marker[]): Marker[] {
  if (!markers || markers.length === 0) return markers;

  const idx = Math.floor(Math.random() * markers.length);

  // Generate random position at one of the spawn locations
  const getRandomSpawnPosition = () => {
    const location = SPAWN_LOCATIONS[Math.floor(Math.random() * SPAWN_LOCATIONS.length)];
    
    // Add some random variance within the rectangle area
    const varianceX = (Math.random() - 0.5) * 2 * location.radiusX;
    const varianceY = (Math.random() - 0.5) * 2 * location.radiusY;
    
    const finalX = location.centerX + varianceX;
    const finalY = location.centerY + varianceY;
    
    // Convert to percentages
    const leftPercent = (finalX / SVG_WIDTH) * 100;
    const topPercent = (finalY / SVG_HEIGHT) * 100;
    
    return {
      top: `${topPercent.toFixed(2)}%`,
      left: `${leftPercent.toFixed(2)}%`,
    };
  };

  const newMarkers = markers.map((m, i) => {
    if (i !== idx) return { ...m };
    const newPos = getRandomSpawnPosition();
    return {
      ...m,
      top: newPos.top,
      left: newPos.left,
    };
  });

  return newMarkers;
}

// Calculate Euclidean distance between two positions (in percentage space)
function calculateDistance(top1: string, left1: string, top2: string, left2: string): number {
  const t1 = parseFloat(top1);
  const l1 = parseFloat(left1);
  const t2 = parseFloat(top2);
  const l2 = parseFloat(left2);
  
  // Calculate distance using Pythagorean theorem
  const deltaTop = t2 - t1;
  const deltaLeft = l2 - l1;
  return Math.sqrt(deltaTop * deltaTop + deltaLeft * deltaLeft);
}

// Check if a position is too close to any existing markers
function isTooCloseToExistingMarkers(
  top: string,
  left: string,
  existingMarkers: Marker[],
  minDistance: number = MIN_DISTANCE_BETWEEN_MARKERS
): boolean {
  for (const marker of existingMarkers) {
    const distance = calculateDistance(top, left, marker.top, marker.left);
    if (distance < minDistance) {
      return true; // Too close!
    }
  }
  return false; // Safe distance from all markers
}

export function getRandomPosition(): { top: string; left: string } {
  // Randomly select one of the three spawn locations
  const location = SPAWN_LOCATIONS[Math.floor(Math.random() * SPAWN_LOCATIONS.length)];
  
  // Add some random variance within the rectangle area
  const varianceX = (Math.random() - 0.5) * 2 * location.radiusX;
  const varianceY = (Math.random() - 0.5) * 2 * location.radiusY;
  
  const finalX = location.centerX + varianceX;
  const finalY = location.centerY + varianceY;
  
  // Convert to percentages
  const leftPercent = (finalX / SVG_WIDTH) * 100;
  const topPercent = (finalY / SVG_HEIGHT) * 100;
  
  return {
    top: `${topPercent.toFixed(2)}%`,
    left: `${leftPercent.toFixed(2)}%`,
  };
}

// Get a random position that is not too close to existing markers
export function getRandomPositionAwayFromMarkers(
  existingMarkers: Marker[],
  maxAttempts: number = 100
): { top: string; left: string } | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Randomly select one of the three spawn locations
    const location = SPAWN_LOCATIONS[Math.floor(Math.random() * SPAWN_LOCATIONS.length)];
    
    // Add some random variance within the rectangle area
    const varianceX = (Math.random() - 0.5) * 2 * location.radiusX;
    const varianceY = (Math.random() - 0.5) * 2 * location.radiusY;
    
    const finalX = location.centerX + varianceX;
    const finalY = location.centerY + varianceY;
    
    // Convert to percentages
    const leftPercent = (finalX / SVG_WIDTH) * 100;
    const topPercent = (finalY / SVG_HEIGHT) * 100;
    
    const top = `${topPercent.toFixed(2)}%`;
    const left = `${leftPercent.toFixed(2)}%`;
    
    // Check if this position is not too close to existing markers
    if (!isTooCloseToExistingMarkers(top, left, existingMarkers)) {
      return { top, left };
    }
  }
  
  // If we couldn't find a valid position after max attempts, return null
  // This shouldn't happen often, but prevents infinite loops
  return null;
}
