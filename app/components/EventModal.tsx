"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Marker = {
  id: number;
  top?: string;
  left?: string;
  title?: string;
  description?: string;
  image?: string;
};

type Props = {
  marker: Marker | null;
  onClose: () => void;
};

export default function EventModal({ marker, onClose }: Props) {
  if (!marker) return null;

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[50] bg-black/20"
          onClick={onClose}
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] max-w-[90vw] max-h-[90vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-6 z-[60] pointer-events-auto flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-bold text-amber-900 text-xl">{marker.title ?? "Zdarzenie na mapie"}</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left Column - Blurred Photo */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-full aspect-square max-w-[500px] bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden shadow-xl">
                  {marker.image ? (
                    <>
                      {/* Blurred background layer */}
                      <div className="absolute inset-0">
                        <Image
                          src={marker.image}
                          alt={marker.title || "Zdarzenie"}
                          fill
                          className="object-cover blur-lg scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-amber-900/40"></div>
                      </div>
                      {/* Clear foreground image (centered, smaller) */}
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-3/4 h-3/4 rounded-lg overflow-hidden border-2 border-amber-800/50 shadow-2xl">
                          <Image
                            src={marker.image}
                            alt={marker.title || "Zdarzenie"}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-300 text-amber-900 text-8xl">
                      📍
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - All Information */}
              <div className="flex flex-col justify-center space-y-6">
                {/* Title */}
                <div>
                  <h3 className="font-bold text-amber-900 text-3xl mb-3">{marker.title ?? `Zdarzenie #${marker.id}`}</h3>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-amber-900 mb-2">Opis</h4>
                  <p className="text-base text-amber-800 leading-relaxed">
                    {marker.description ?? "Brak szczegółowego opisu zdarzenia."}
                  </p>
                </div>

                {/* Additional Info */}
                <div>
                  <h4 className="text-lg font-semibold text-amber-900 mb-2">Szczegóły</h4>
                  <div className="text-base text-amber-700 space-y-2">
                    <div>
                      <span className="font-semibold">ID Zdarzenia:</span> #{marker.id}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span> Aktywne
                    </div>
                    <div>
                      <span className="font-semibold">Priorytet:</span> Wysoki
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
}
