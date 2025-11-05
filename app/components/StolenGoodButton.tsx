"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
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

      {/* Centered Popup - Rendered via Portal */}
      {showPopup && typeof window !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[50] bg-black/20"
            onClick={() => setShowPopup(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] max-w-[90vw] max-h-[90vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-6 z-[60] pointer-events-auto flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="font-bold text-amber-900 text-xl">Odzyskiwanie Dzieła Sztuki</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* Left Column - Artwork Image (Big Center Piece) */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[500px] bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden shadow-xl">
                    <Image
                      src={stolenGood.image}
                      alt={stolenGood.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-300 text-amber-900 text-8xl">
                      🎨
                    </div>
                  </div>
                </div>

                {/* Right Column - All Information */}
                <div className="flex flex-col justify-center space-y-6">
                  {/* Title and Artist */}
                  <div>
                    <h3 className="font-bold text-amber-900 text-3xl mb-3">{stolenGood.name}</h3>
                    <p className="text-xl text-amber-800 font-semibold mb-2">{stolenGood.artist}</p>
                    <p className="text-lg text-amber-700 mb-4">{stolenGood.year}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-amber-900 mb-2">Opis</h4>
                    <p className="text-base text-amber-800 leading-relaxed">{stolenGood.description}</p>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="text-lg font-semibold text-amber-900 mb-2">Lokalizacja</h4>
                    <p className="text-base text-amber-700">{stolenGood.location}</p>
                  </div>

                  {/* Detailed Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-semibold text-amber-900">Postęp odzyskania</span>
                      <span className="text-xl font-bold text-amber-800">{stolenGood.progress}%</span>
                    </div>
                    <div className="w-full bg-amber-800/50 rounded-full h-10 border border-amber-700/50 shadow-inner overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-base font-bold text-amber-50 transition-all duration-300 shadow-lg"
                        style={{ width: `${stolenGood.progress}%` }}
                      >
                        {stolenGood.progress}%
                      </div>
                    </div>
                    <div className="text-lg text-amber-700 mt-3 text-center">
                      <span className="font-semibold">Szacowany czas:</span> {stolenGood.estimatedTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

