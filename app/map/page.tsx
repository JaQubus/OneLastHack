"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [showMisjaMenu, setShowMisjaMenu] = useState(false);
  const [showSiatkaMenu, setShowSiatkaMenu] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <Image
          src="/map.svg"
          alt="Mapa operacyjna Europy"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Top Bar Overlay - Vintage Yellow */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-b-2 border-amber-800/50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="btn btn-ghost btn-sm text-amber-50 hover:bg-amber-800/50 transition-all">
            ← Powrót
          </Link>
          <h1 className="text-2xl font-bold text-amber-50 drop-shadow-lg sm:text-3xl tracking-tight">ARTiFACTS</h1>
          <div className="text-sm font-mono text-amber-100 bg-amber-800/50 px-3 py-1 rounded-md border border-amber-700/50">
            <span className="font-semibold">1939</span> - <span className="font-semibold">1945</span>
          </div>
        </div>
      </header>

      {/* Bottom Bar Overlay - Vintage Yellow */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-t-2 border-amber-800/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side - Buttons */}
            <div className="flex items-center gap-3">
              {/* Misja Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowMisjaMenu(!showMisjaMenu);
                    setShowSiatkaMenu(false);
                  }}
                  className="btn btn-primary btn-sm sm:btn-md text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 bg-amber-700 hover:bg-amber-800 border-amber-800"
                >
                  Misja
                </button>
                {showMisjaMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 z-30 pointer-events-auto">
                    <h3 className="font-bold text-amber-900 mb-3 text-lg">Aktywne Misje</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-200/50 rounded-lg border border-amber-800/30 hover:bg-amber-200/70 transition-colors cursor-pointer">
                        <div className="font-semibold text-amber-900">Obraz #1 - "Portret Młodzieńca"</div>
                        <div className="text-xs text-amber-800 mt-1">Postęp: 45%</div>
                      </div>
                      <div className="p-3 bg-amber-200/50 rounded-lg border border-amber-800/30 hover:bg-amber-200/70 transition-colors cursor-pointer">
                        <div className="font-semibold text-amber-900">Obraz #2 - "Dama z gronostajem"</div>
                        <div className="text-xs text-amber-800 mt-1">Postęp: 28%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Siatka Wywiadowcza Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSiatkaMenu(!showSiatkaMenu);
                    setShowMisjaMenu(false);
                  }}
                  className="btn btn-secondary btn-sm sm:btn-md text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 bg-amber-800 hover:bg-amber-900 border-amber-900"
                >
                  Siatka Wywiadowcza
                </button>
                {showSiatkaMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 z-30 pointer-events-auto">
                    <h3 className="font-bold text-amber-900 mb-3 text-lg">Siatka Wywiadowcza</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-800">Aktywni Agenci:</span>
                        <span className="font-semibold text-amber-900">2/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-800">Punkty Wywiadu:</span>
                        <span className="font-semibold text-amber-700">125</span>
                      </div>
                      <div className="divider my-2 border-amber-800/30"></div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-amber-200/50 rounded border border-amber-800/30">
                          <div className="avatar placeholder">
                            <div className="bg-amber-700 text-amber-50 rounded-full w-8">
                              <span className="text-xs">🕵️</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-amber-900">Agent #1</div>
                            <div className="text-xs text-amber-800">Warszawa</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-amber-200/50 rounded border border-amber-800/30">
                          <div className="avatar placeholder">
                            <div className="bg-amber-700 text-amber-50 rounded-full w-8">
                              <span className="text-xs">🕵️</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-amber-900">Agent #2</div>
                            <div className="text-xs text-amber-800">Kraków</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Progress Bar */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-base font-semibold text-amber-50 drop-shadow-sm w-[280px] text-center whitespace-nowrap">Postęp rabunku</label>
              <div className="relative bg-amber-800/50 h-12 w-[260px] rounded-lg border border-amber-700/50 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-lg font-bold text-amber-50">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Click to close menus when clicking outside */}
      {(showMisjaMenu || showSiatkaMenu || selectedMarker) && (
        <div
          className="fixed inset-0 z-[15]"
          onClick={() => {
            setShowMisjaMenu(false);
            setShowSiatkaMenu(false);
            setSelectedMarker(null);
          }}
        />
      )}

      {/* Clickable markers overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Example marker positions */}
          <button
            className="absolute top-[30%] left-[25%] btn btn-circle btn-sm btn-error animate-pulse hover:animate-none shadow-2xl hover:scale-110 transition-transform"
            onClick={() => setSelectedMarker(1)}
            title="Zdarzenie #1"
          >
            📍
          </button>
        </div>
      </div>

      {/* Event Info Modal - Vintage */}
      {selectedMarker && (
        <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="card bg-amber-100/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl w-80 pointer-events-auto">
            <div className="card-body">
              <h2 className="card-title text-amber-900">Zdarzenie na mapie</h2>
              <p className="text-amber-800 text-sm">Kliknij na znaczniki, aby zobaczyć szczegóły</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

