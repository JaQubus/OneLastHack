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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[845px] max-h-[90vh] bg-amber-100/98 backdrop-blur-md rounded-xl shadow-2xl border-4 border-amber-800/70 p-8 z-[110] pointer-events-auto overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-4xl font-bold text-amber-900 mb-2">
            Strażnicy Dziedzictwa
          </h2>
          
          {/* Introduction */}
          <div className="text-left space-y-4">
            <p className="text-lg text-amber-900 font-semibold leading-relaxed">
              Wciel się w szefa wywiadu polskiego państwa podziemnego podczas II wojny światowej. 
              Twoim zadaniem jest odzyskanie skradzionych dzieł sztuki i skarbów kultury.
            </p>

            {/* Instructions */}
            <div className="bg-amber-200/50 rounded-lg p-4 border-2 border-amber-800/30">
              <h3 className="text-xl font-bold text-amber-900 mb-3">Jak grać:</h3>
              <ul className="text-base text-amber-800 space-y-2 list-disc list-inside">
                <li><strong>Zbieraj bąbelki na mapie</strong> - kliknij na bąbelki pojawiające się na mapie, aby odkryć lokalizacje dzieł sztuki</li>
                <li><strong>Zarządzaj misjami</strong> - w dolnym pasku wybierz misję i wyślij agenta, aby odzyskał dzieło</li>
                <li><strong>Rozwijaj siatkę wywiadowczą</strong> - zatrudniaj nowych agentów i ulepszaj umiejętności za punkty wywiadu</li>
                <li><strong>Śledź postęp</strong> - obserwuj pasek postępu, gdy wszystkie dzieła zostaną skradzione przegrasz</li>
                <li><strong>Zbieraj odzyskane dzieła</strong> - kliknij na magazyn w Warszawie, aby zobaczyć odzyskane skarby</li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-amber-200/50 rounded-lg p-4 border-2 border-amber-800/30">
              <h3 className="text-xl font-bold text-amber-900 mb-3">Funkcje gry:</h3>
              <ul className="text-base text-amber-800 space-y-2">
                <li><strong>🕵️ System agentów</strong> - zarządzaj do 4 agentami jednocześnie</li>
                <li><strong>📊 Punkty wywiadu</strong> - zdobywaj punkty za odkrywanie lokalizacji i ukończone misje</li>
                <li><strong>⚡ Ulepszenia</strong> - rozwijaj umiejętności, aby zwiększyć skuteczność misji</li>
                <li><strong>⏱️ Czas gry</strong> - gra toczy się w czasie rzeczywistym od 1939 do 1945 roku</li>
                <li><strong>🎨 Kolekcja dzieł</strong> - odzyskuj prawdziwe skradzione dzieła sztuki z okresu wojny</li>
                <li><strong>📍 Mapa interaktywna</strong> - śledź misje i agentów na mapie Europy</li>
              </ul>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-amber-50 text-2xl font-bold uppercase tracking-wider rounded-lg shadow-xl transition-all duration-300 active:scale-95 border-2 border-amber-600 cursor-pointer"
            >
              ▶ Rozpocznij Grę
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

