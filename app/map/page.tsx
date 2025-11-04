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
          src="/map.png"
          alt="Mapa operacyjna Europy"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Top Bar Overlay - Modern */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-slate-900/70 via-slate-800/70 to-slate-900/70 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="btn btn-ghost btn-sm text-slate-100 hover:bg-slate-700/50 hover:text-white transition-all">
            ← Powrót
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl tracking-tight">ARTiFACTS</h1>
          <div className="text-sm font-mono text-slate-200 bg-slate-800/50 px-3 py-1 rounded-md border border-slate-700/50">
            <span className="font-semibold">1939</span> - <span className="font-semibold">1945</span>
          </div>
        </div>
      </header>

      {/* Bottom Bar Overlay - Modern */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-slate-900/70 via-slate-800/70 to-slate-900/70 backdrop-blur-md border-t border-slate-700/50 shadow-lg">
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
                  className="btn btn-primary btn-sm sm:btn-md text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Misja
                </button>
                {showMisjaMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-2xl border border-slate-700/50 p-4 z-30">
                    <h3 className="font-bold text-white mb-3 text-lg">Aktywne Misje</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors cursor-pointer">
                        <div className="font-semibold text-amber-300">Obraz #1 - "Portret Młodzieńca"</div>
                        <div className="text-xs text-slate-400 mt-1">Postęp: 45%</div>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors cursor-pointer">
                        <div className="font-semibold text-amber-300">Obraz #2 - "Dama z gronostajem"</div>
                        <div className="text-xs text-slate-400 mt-1">Postęp: 28%</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMisjaMenu(false)}
                      className="mt-3 btn btn-sm btn-ghost w-full text-slate-300 hover:text-white"
                    >
                      Zamknij
                    </button>
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
                  className="btn btn-secondary btn-sm sm:btn-md text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Siatka Wywiadowcza
                </button>
                {showSiatkaMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-2xl border border-slate-700/50 p-4 z-30">
                    <h3 className="font-bold text-white mb-3 text-lg">Siatka Wywiadowcza</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Aktywni Agenci:</span>
                        <span className="font-semibold text-amber-300">2/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Punkty Wywiadu:</span>
                        <span className="font-semibold text-emerald-400">125</span>
                      </div>
                      <div className="divider my-2"></div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                          <div className="avatar placeholder">
                            <div className="bg-amber-600 text-white rounded-full w-8">
                              <span className="text-xs">🕵️</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">Agent #1</div>
                            <div className="text-xs text-slate-400">Warszawa</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                          <div className="avatar placeholder">
                            <div className="bg-amber-600 text-white rounded-full w-8">
                              <span className="text-xs">🕵️</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">Agent #2</div>
                            <div className="text-xs text-slate-400">Kraków</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSiatkaMenu(false)}
                      className="mt-3 btn btn-sm btn-ghost w-full text-slate-300 hover:text-white"
                    >
                      Zamknij
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Progress Bar */}
            <div className="flex flex-col items-end gap-2 min-w-[200px]">
              <label className="text-sm font-semibold text-white drop-shadow-sm">Postęp rabunku</label>
              <div className="w-full bg-slate-700/50 rounded-full h-6 border border-slate-600/50 shadow-inner overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300 shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && `${progress}%`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Click to close menus when clicking outside */}
      {(showMisjaMenu || showSiatkaMenu) && (
        <div
          className="fixed inset-0 z-[15]"
          onClick={() => {
            setShowMisjaMenu(false);
            setShowSiatkaMenu(false);
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

      {/* Event Info Modal - Modern */}
      {selectedMarker && (
        <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <div className="card bg-slate-800/95 backdrop-blur-md border-2 border-slate-700/50 shadow-2xl w-80">
            <div className="card-body">
              <h2 className="card-title text-white">Zdarzenie na mapie</h2>
              <p className="text-slate-300 text-sm">Kliknij na znaczniki, aby zobaczyć szczegóły</p>
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-sm btn-ghost text-white hover:bg-slate-700"
                  onClick={() => setSelectedMarker(null)}
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

