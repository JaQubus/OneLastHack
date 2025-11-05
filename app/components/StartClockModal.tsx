"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGameTime } from "./GameTimeProvider";

interface StartClockModalProps {
  onClose: () => void;
}

export default function StartClockModal({ onClose }: StartClockModalProps) {
  const { start } = useGameTime();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    start();
    onClose();
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
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
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            ARTiFACTS - Operacja Odzyskania
          </h2>
          <div className="text-left space-y-4 mb-6">
            <p className="text-lg text-amber-800 leading-relaxed">
              <strong className="text-amber-900">Witaj w grze strategiczno-detektywistycznej!</strong>
            </p>
            <p className="text-base text-amber-700 leading-relaxed">
              Twoim zadaniem jest odzyskać skradzione podczas II wojny światowej dzieła sztuki. 
              Bąbelki z lokalizacjami dzieł będą pojawiać się na mapie - kliknij je, aby zebrać informacje wywiadowcze.
            </p>
            <p className="text-base text-amber-700 leading-relaxed">
              Wysyłaj swoich agentów na misje, aby odzyskać dzieła. Każda misja ma 30% szansy na niepowodzenie - 
              ulepszaj umiejętności agentów, aby zmniejszyć to ryzyko do minimum 5%.
            </p>
            <p className="text-base text-amber-700 leading-relaxed">
              <strong className="text-amber-900">Uwaga:</strong> Bąbelki znikają po 20 sekundach, jeśli ich nie zbierzesz!
            </p>
          </div>
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
  );
}

