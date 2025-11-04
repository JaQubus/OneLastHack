"use client";

import Image from "next/image";
import { useState } from "react";
import type { StolenGood } from "../types";

interface StolenGoodButtonProps {
  stolenGood: StolenGood;
}

export default function StolenGoodButton({ stolenGood }: StolenGoodButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative" style={{ width: '20%' }}>
      <button
        onClick={() => {
          setShowPopup(!showPopup);
        }}
        className="w-full h-full min-h-[60px] p-2 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm flex items-center"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎨</div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-amber-50 mb-1">{stolenGood.name}</div>
            <div className="w-full bg-amber-900/50 rounded-full h-4 border border-amber-700/50 shadow-inner overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                style={{ width: `${stolenGood.progress}%` }}
              >
                {stolenGood.progress > 10 && `${stolenGood.progress}%`}
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Stolen Good Popup */}
      {showPopup && (
        <>
          <div
            className="fixed inset-0 z-[15]"
            onClick={() => setShowPopup(false)}
          />
          <div
            className="absolute bottom-full left-0 mb-2 w-96 bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 z-30 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {/* Artwork Image and Info */}
              <div className="flex gap-4">
                <div className="relative w-32 h-32 bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden flex-shrink-0">
                  <Image
                    src={stolenGood.image}
                    alt={stolenGood.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-amber-300 text-amber-900 text-4xl">
                    🎨
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 text-lg mb-1">{stolenGood.name}</h3>
                  <p className="text-sm text-amber-800 font-semibold mb-1">{stolenGood.artist}</p>
                  <p className="text-xs text-amber-700">{stolenGood.year}</p>
                  <p className="text-xs text-amber-800 mt-2 leading-relaxed">{stolenGood.description}</p>
                  <div className="text-xs text-amber-700 mt-2">
                    <span className="font-semibold">Lokalizacja:</span> {stolenGood.location}
                  </div>
                </div>
              </div>

              {/* Detailed Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-amber-900">Postęp odzyskania</span>
                  <span className="text-sm font-bold text-amber-800">{stolenGood.progress}%</span>
                </div>
                <div className="w-full bg-amber-800/50 rounded-full h-6 border border-amber-700/50 shadow-inner overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                    style={{ width: `${stolenGood.progress}%` }}
                  >
                    {stolenGood.progress}%
                  </div>
                </div>
                <div className="text-xs text-amber-700 mt-2 text-center">
                  <span className="font-semibold">Szacowany czas:</span> {stolenGood.estimatedTime}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

