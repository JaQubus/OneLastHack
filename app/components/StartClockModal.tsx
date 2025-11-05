"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useGameTime } from "./GameTimeProvider";

interface StartClockModalProps {
  onClose: () => void;
}

export default function StartClockModal({ onClose }: StartClockModalProps) {
  const { start } = useGameTime();

  const handleStart = () => {
    start();
    onClose();
  };

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={handleStart}
        />
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-amber-100/98 backdrop-blur-md rounded-xl shadow-2xl border-4 border-amber-800/70 p-8 z-[110] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-4xl font-bold text-amber-900 mb-2">
              Rozpocznij Grę
            </h2>
            <p className="text-xl text-amber-800 leading-relaxed">
              Kliknij przycisk poniżej, aby rozpocząć zegar gry. 
              <br />
              Bąbelki z dziełami sztuki będą pojawiać się na mapie podczas gry.
            </p>
            <div className="pt-4">
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-amber-50 text-2xl font-bold uppercase tracking-wider rounded-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-600"
              >
                ▶ Rozpocznij Zegar
              </button>
            </div>
            <p className="text-sm text-amber-600 italic">
              Możesz również użyć przycisku ▶ w górnym pasku
            </p>
          </div>
        </div>
      </>,
      document.body
    )
  );
}

