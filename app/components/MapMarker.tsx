"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { clampMarkerPosition } from "../../lib/placeRandomMarker";

type Props = {
  id: number;
  top: string; // CSS value, e.g. '30%'
  left: string; // CSS value, e.g. '25%'
  title?: string;
  onClick?: (id: number) => void;
  className?: string;
  isAnimating?: boolean; // Trigger animation from parent
};

export default function MapMarker({ id, top, left, title, onClick, className, isAnimating = false }: Props) {
  const [isClicking, setIsClicking] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);
  const [safePosition, setSafePosition] = useState({ top, left });

  // Clamp position on client side only to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSafePosition(clampMarkerPosition(top, left));
    }
  }, [top, left]);

  // Handle external animation trigger (from PinsList click)
  useEffect(() => {
    if (isAnimating) {
      setIsClicking(true);
      setShouldPulse(false);
      const timer = setTimeout(() => {
        setIsClicking(false);
        setShouldPulse(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleClick = () => {
    setIsClicking(true);
    setShouldPulse(false);
    setTimeout(() => {
      setIsClicking(false);
      setShouldPulse(true);
      if (onClick) onClick(id);
    }, 300);
  };

  return (
    <button
      className={`absolute cursor-pointer transition-all duration-300 ${className ?? ""}`}
      style={{
        top: safePosition.top,
        left: safePosition.left,
        transform: isClicking ? 'scale(1.5)' : 'scale(1)',
        filter: isClicking ? 'brightness(1.3)' : 'brightness(1)',
      }}
      onClick={handleClick}
      title={title}
      aria-label={title || `Marker ${id}`}
    >
      <div className={`relative w-12 h-12 sm:w-16 sm:h-16 ${shouldPulse ? 'animate-pulse' : ''}`}>
        <Image
          src="/dama.jpg"
          alt={title || `Marker ${id}`}
          fill
          className="object-cover border-2 border-amber-800 shadow-2xl hover:shadow-amber-500/50 transition-all"
          style={{
            boxShadow: isClicking
              ? '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6)'
              : '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        />
        {/* Glow effect when clicked */}
        {isClicking && (
          <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
        )}
      </div>
    </button>
  );
}
