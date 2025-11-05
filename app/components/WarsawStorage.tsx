"use client";

import React from "react";

type Props = {
  onClick: () => void;
};

export default function WarsawStorage({ onClick }: Props) {
  // Warsaw approximate position on European map (center-east of Poland)
  // Using fixed position that represents Warsaw
  const warsawTop = "45%";
  const warsawLeft = "52%";

  return (
    <button
      className="absolute cursor-pointer transition-all duration-300 z-[15]"
      style={{ 
        top: warsawTop, 
        left: warsawLeft,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      title="Magazyn w Warszawie - Kliknij aby otworzyć galerię sztuki"
      aria-label="Warsaw Storage"
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-amber-900/90 rounded-lg border-4 border-amber-700 shadow-2xl flex items-center justify-center hover:border-amber-500 transition-all">
        <span className="text-3xl sm:text-4xl">🏛️</span>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs sm:text-sm font-bold text-amber-900 bg-amber-100/95 px-2 py-1 rounded border border-amber-800/50 shadow-lg">
          Magazyn
        </div>
      </div>
    </button>
  );
}

