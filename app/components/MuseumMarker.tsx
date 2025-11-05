"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

type MuseumMarkerProps = {
  id: string;
  top: string;
  left: string;
  onClick: (id: string) => void;
};

export default function MuseumMarker({ id, top, left, onClick }: MuseumMarkerProps) {
  const [adjustedPosition, setAdjustedPosition] = useState({ top, left });
  const markerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Calculate the actual position accounting for object-contain letterboxing
    const calculatePosition = () => {
      // Parse percentage values
      const topPercent = parseFloat(top);
      const leftPercent = parseFloat(left);

      // SVG dimensions
      const svgWidth = 1646;
      const svgHeight = 1447;
      const svgAspect = svgWidth / svgHeight; // ~1.137

      // Get container dimensions (viewport)
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const containerAspect = containerWidth / containerHeight;

      let displayedMapWidth, displayedMapHeight;
      let offsetX = 0, offsetY = 0;

      if (containerAspect > svgAspect) {
        // Container is wider - map fits to height, letterboxing on sides
        displayedMapHeight = containerHeight;
        displayedMapWidth = containerHeight * svgAspect;
        offsetX = (containerWidth - displayedMapWidth) / 2;
        offsetY = 0;
      } else {
        // Container is taller - map fits to width, letterboxing top/bottom
        displayedMapWidth = containerWidth;
        displayedMapHeight = containerWidth / svgAspect;
        offsetX = 0;
        offsetY = (containerHeight - displayedMapHeight) / 2;
      }

      // Calculate adjusted position
      const adjustedLeft = (offsetX / containerWidth * 100) + (leftPercent * displayedMapWidth / containerWidth);
      const adjustedTop = (offsetY / containerHeight * 100) + (topPercent * displayedMapHeight / containerHeight);

      setAdjustedPosition({
        top: `${adjustedTop}%`,
        left: `${adjustedLeft}%`
      });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [top, left]);

  return (
    <button
      ref={markerRef}
      onClick={() => onClick(id)}
      className="absolute cursor-pointer hover:scale-125 transition-transform z-20"
      style={{
        top: adjustedPosition.top,
        left: adjustedPosition.left,
        transform: 'translate(-50%, -50%)',
      }}
      title="Kliknij aby otworzyć muzeum"
    >
      <div className="relative w-5 h-5 drop-shadow-lg">
        <Image
          src="/museum.png"
          alt="Museum"
          fill
          className="object-contain pointer-events-none"
        />
      </div>
    </button>
  );
}
