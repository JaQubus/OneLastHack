"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Artwork = {
  title: string;
  img: string;
  artist: string;
  origin: string;
  period: string;
  theft: {
    date: string;
    perpetrator: string;
    circumstances: string;
  };
  return: {
    status: string;
    date: string | null;
    current_location: string;
    notes: string;
  };
};

type Props = {
  artwork: Artwork | null;
  onClose: () => void;
};

export default function ArtworkModal({ artwork, onClose }: Props) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (artwork) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Disable body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [artwork]);

  if (!artwork) return null;

  const imagePath = `/artworks/${artwork.img}`;

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl max-h-[90vh] bg-amber-100/98 backdrop-blur-md rounded-xl shadow-2xl border-2 border-amber-800/50 z-[60] pointer-events-auto flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-amber-800/30 bg-amber-900/20 flex-shrink-0">
            <h2 className="font-bold text-amber-900 text-2xl sm:text-3xl">{artwork.title}</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost text-amber-900 hover:bg-amber-200/50 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - Image (Sticky) */}
            <div className="hidden lg:flex flex-col flex-shrink-0 w-1/2 p-6">
              <div className="sticky top-6">
                <div className="relative w-full aspect-square bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden shadow-xl">
                  <Image
                    src={imagePath}
                    alt={artwork.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Information (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-800/20">
                    <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">Artysta</div>
                    <div className="text-xl font-bold text-amber-900">{artwork.artist}</div>
                  </div>

                  <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-800/20">
                    <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">Okres</div>
                    <div className="text-lg text-amber-900">{artwork.period}</div>
                  </div>

                  <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-800/20">
                    <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">Pochodzenie</div>
                    <div className="text-base text-amber-800 leading-relaxed">{artwork.origin}</div>
                  </div>
                </div>

                {/* Theft Section */}
                <div className="bg-red-50/60 rounded-lg p-5 border-2 border-red-300/50">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <span>⚔️</span> Kradzież
                  </h3>
                  <div className="space-y-3 text-amber-900">
                    <div>
                      <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Data</div>
                      <div className="text-base font-semibold">{artwork.theft.date}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Sprawca</div>
                      <div className="text-base">{artwork.theft.perpetrator}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Okoliczności</div>
                      <div className="text-base leading-relaxed">{artwork.theft.circumstances}</div>
                    </div>
                  </div>
                </div>

                {/* Return Section */}
                <div className={`rounded-lg p-5 border-2 ${
                  artwork.return.status === "Powrócił"
                    ? "bg-green-50/60 border-green-300/50"
                    : "bg-amber-50/60 border-amber-300/50"
                }`}>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                    artwork.return.status === "Powrócił" ? "text-green-900" : "text-amber-900"
                  }`}>
                    <span>{artwork.return.status === "Powrócił" ? "✅" : "❌"}</span> Powrót
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Status</div>
                      <div className={`text-lg font-bold ${
                        artwork.return.status === "Powrócił"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}>
                        {artwork.return.status}
                      </div>
                    </div>
                    {artwork.return.date && (
                      <div>
                        <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Data powrotu</div>
                        <div className="text-base font-semibold text-amber-900">{artwork.return.date}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Obecna lokalizacja</div>
                      <div className="text-base text-amber-800">{artwork.return.current_location}</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-amber-800/20">
                      <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">Notatki</div>
                      <div className="text-base text-amber-800 italic leading-relaxed">{artwork.return.notes}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Image - Below scrollable content */}
          <div className="lg:hidden p-6 pt-0">
            <div className="relative w-full aspect-square bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden shadow-xl">
              <Image
                src={imagePath}
                alt={artwork.title}
                fill
                sizes="100vw"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
}

