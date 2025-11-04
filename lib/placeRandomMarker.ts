type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
};

// Returns a new array with one randomly chosen marker moved to a random position (top/left percentages).
export function placeRandomMarker(markers: Marker[]): Marker[] {
  if (!markers || markers.length === 0) return markers;

  const idx = Math.floor(Math.random() * markers.length);

  // Generate random top/left between 5% and 90% to avoid edges
  const randomPercent = () => `${Math.floor(5 + Math.random() * 85)}%`;

  const newMarkers = markers.map((m, i) => {
    if (i !== idx) return { ...m };
    return {
      ...m,
      top: randomPercent(),
      left: randomPercent(),
    };
  });

  return newMarkers;
}

export function getRandomPosition(): { top: string; left: string } {
  return {
    top: `${Math.floor(5 + Math.random() * 85)}%`,
    left: `${Math.floor(5 + Math.random() * 85)}%`,
  };
}
