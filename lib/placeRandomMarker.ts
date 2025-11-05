type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
};

// Constants for safe placement zones
// Top bar is approximately 80-100px (12-15% on typical screens)
// Bottom bar is approximately 100-120px (12-15% on typical screens)
// Marker size is 48-64px, positioned by top-left corner, so we need extra margin
// On a 1080p screen: 64px ≈ 6% of height, so we need at least 12% + 6% = 18% for top
// But to be safe across all screen sizes, we'll use larger margins
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

  // Generate random top between TOP_SAFE_ZONE and (100 - BOTTOM_SAFE_ZONE)
  // Generate random left between SIDE_MARGIN and (100 - SIDE_MARGIN)
  const randomTop = () => {
    const minTop = TOP_SAFE_ZONE;
    const maxTop = 100 - BOTTOM_SAFE_ZONE;
    return `${Math.floor(minTop + Math.random() * (maxTop - minTop))}%`;
  };
  
  const randomLeft = () => {
    const minLeft = SIDE_MARGIN;
    const maxLeft = 100 - SIDE_MARGIN;
    return `${Math.floor(minLeft + Math.random() * (maxLeft - minLeft))}%`;
  };

  const newMarkers = markers.map((m, i) => {
    if (i !== idx) return { ...m };
    return {
      ...m,
      top: randomTop(),
      left: randomLeft(),
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
  const minTop = TOP_SAFE_ZONE;
  const maxTop = 100 - BOTTOM_SAFE_ZONE;
  const minLeft = SIDE_MARGIN;
  const maxLeft = 100 - SIDE_MARGIN;
  
  return {
    top: `${Math.floor(minTop + Math.random() * (maxTop - minTop))}%`,
    left: `${Math.floor(minLeft + Math.random() * (maxLeft - minLeft))}%`,
  };
}

// Get a random position that is not too close to existing markers
export function getRandomPositionAwayFromMarkers(
  existingMarkers: Marker[],
  maxAttempts: number = 100
): { top: string; left: string } | null {
  const minTop = TOP_SAFE_ZONE;
  const maxTop = 100 - BOTTOM_SAFE_ZONE;
  const minLeft = SIDE_MARGIN;
  const maxLeft = 100 - SIDE_MARGIN;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const top = `${Math.floor(minTop + Math.random() * (maxTop - minTop))}%`;
    const left = `${Math.floor(minLeft + Math.random() * (maxLeft - minLeft))}%`;
    
    // Check if this position is safe and not too close to existing markers
    if (isValidMarkerPosition(top, left) && !isTooCloseToExistingMarkers(top, left, existingMarkers)) {
      return { top, left };
    }
  }
  
  // If we couldn't find a valid position after max attempts, return null
  // This shouldn't happen often, but prevents infinite loops
  return null;
}
