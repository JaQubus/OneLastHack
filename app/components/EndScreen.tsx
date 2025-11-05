"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { StolenGood, Agent } from "../types";

interface EndScreenProps {
  stolenGoods: StolenGood[];
  recoveredArtworks: StolenGood[];
  totalMissions: number;
  successfulMissions: number;
  activeAgents: Agent[];
  onClose?: () => void;
}

export default function EndScreen({
  stolenGoods,
  recoveredArtworks,
  totalMissions,
  successfulMissions,
  activeAgents,
  onClose,
}: EndScreenProps) {
  const router = useRouter();
  const recoveryRate = stolenGoods.length > 0 
    ? Math.round((recoveredArtworks.length / stolenGoods.length) * 100) 
    : 0;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    router.push("/");
  };

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
        />
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl bg-amber-100/98 backdrop-blur-md rounded-xl shadow-2xl border-4 border-amber-800/70 p-8 z-[110] pointer-events-auto overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-5xl font-bold text-amber-900 mb-2">
              Operacja Zakończona!
            </h2>
            <p className="text-xl text-amber-800 mb-8">
              Gratulacje! Udało Ci się odzyskać wszystkie dzieła sztuki!
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-4 shadow-lg">
                <div className="text-4xl font-bold text-amber-900 mb-2">
                  {recoveredArtworks.length}
                </div>
                <div className="text-sm text-amber-800 font-semibold">
                  Odzyskanych Dzieł
                </div>
              </div>
              
              <div className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-4 shadow-lg">
                <div className="text-4xl font-bold text-amber-900 mb-2">
                  {recoveryRate}%
                </div>
                <div className="text-sm text-amber-800 font-semibold">
                  Wskaźnik Odzyskania
                </div>
              </div>
              
              <div className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-4 shadow-lg">
                <div className="text-4xl font-bold text-amber-900 mb-2">
                  {successfulMissions}
                </div>
                <div className="text-sm text-amber-800 font-semibold">
                  Ukończonych Misji
                </div>
              </div>
            </div>

            {/* Recovered Artworks Gallery */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                Odzyskane Dzieła Sztuki
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recoveredArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden border-2 border-amber-800/30">
                      <Image
                        src={artwork.image || "/dama.jpg"}
                        alt={artwork.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <h4 className="font-bold text-amber-900 text-sm mb-1 truncate">
                      {artwork.name}
                    </h4>
                    <p className="text-xs text-amber-800">{artwork.artist}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Agents */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                Twoi Agenti
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-3 shadow-lg text-center"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-amber-800/50">
                      <Image
                        src={agent.photo || "/officers/witold-pilecki.png"}
                        alt={agent.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="font-semibold text-amber-900 text-sm">
                      {agent.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-amber-50 text-xl font-bold uppercase tracking-wider rounded-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-600 cursor-pointer"
            >
              Powrót do Menu
            </button>
          </div>
        </div>
      </>,
      document.body
    )
  );
}

