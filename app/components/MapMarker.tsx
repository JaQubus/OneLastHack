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
  imageSrc?: string; // Optional image source for artwork
};

export default function MapMarker({ id, top, left, title, onClick, className, isAnimating = false, imageSrc }: Props) {
  const [isClicking, setIsClicking] = useState(false);
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
      const timer = setTimeout(() => {
        setIsClicking(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const [isPopping, setIsPopping] = useState(false);
  const [popRings, setPopRings] = useState<number[]>([]);

  const handleClick = () => {
    setIsClicking(true);
    setIsPopping(true);
    // Create multiple expanding rings
    setPopRings([Date.now(), Date.now() + 50, Date.now() + 100, Date.now() + 150]);
    // Call onClick immediately, don't delay it
    if (onClick) onClick(id);
    setTimeout(() => {
      setIsClicking(false);
    }, 200);
    setTimeout(() => {
      setIsPopping(false);
      setPopRings([]);
    }, 800);
  };

  return (
    <button
      className={`absolute cursor-pointer ${className ?? ""}`}
      style={{
        top: safePosition.top,
        left: safePosition.left,
        transform: isClicking ? 'scale(2.2)' : isPopping ? 'scale(0)' : 'scale(1)',
        filter: isClicking ? 'brightness(1.5) saturate(1.3)' : isPopping ? 'brightness(0.5)' : 'brightness(1)',
        opacity: isPopping ? 0 : 1,
        transition: isPopping
          ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out, filter 0.3s ease-out'
          : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease-out',
      }}
      onClick={handleClick}
      title={title}
      aria-label={title || `Marker ${id}`}
    >
      <div className="relative" style={{ width: '62.4px', height: '62.4px' }}>
        <Image
          src={imageSrc || "/dama.jpg"}
          alt={title || `Marker ${id}`}
          fill
          className="object-cover border-2 border-amber-800 shadow-2xl hover:shadow-amber-500/50 transition-all rounded-full"
          style={{
            boxShadow: isClicking
              ? '0 0 30px rgba(251, 191, 36, 1), 0 0 60px rgba(251, 191, 36, 0.8), 0 0 90px rgba(251, 191, 36, 0.5)'
              : '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          unoptimized
        />
        {/* Dramatic glow effect when clicked */}
        {isClicking && (
          <>
            <div className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" style={{ animationDuration: '0.6s' }} />
            <div className="absolute inset-0 rounded-full bg-amber-300/30 animate-ping" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
          </>
        )}
        {/* Expanding rings for bubble pop effect (Plague Inc style) */}
        {popRings.map((ringId, index) => (
          <div
            key={ringId}
            className="absolute inset-0 rounded-full border-4 border-amber-400 pointer-events-none"
            style={{
              animation: `popRing 0.8s ease-out forwards`,
              animationDelay: `${index * 0.05}s`,
              opacity: 0.8,
              transform: 'scale(0)',
              borderColor: `rgba(251, 191, ${36 + index * 20}, 0.8)`,
            }}
          />
        ))}
        {/* Particle burst effect */}
        {isPopping && (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-amber-400 rounded-full pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px)`,
                  animation: `particleBurst 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.03}s`,
                  opacity: 0,
                }}
              />
            ))}
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes popRing {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
        @keyframes particleBurst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-60px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
