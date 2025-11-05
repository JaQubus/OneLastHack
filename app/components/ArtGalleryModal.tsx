"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { StolenGood } from "../types";

type Props = {
  stolenGoods: StolenGood[];
  onClose: () => void;
};

export default function ArtGalleryModal({ stolenGoods, onClose }: Props) {
  // Show only artworks recovered in current gameplay session (already filtered by parent)
  const recoveredArtworks = stolenGoods;

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[50] bg-black/20"
          onClick={onClose}
        />
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] max-w-[90vw] max-h-[90vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-6 z-[60] pointer-events-auto flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-bold text-amber-900 text-2xl">Magazyn - Warszawa</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50 cursor-pointer cursor-pointer"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {recoveredArtworks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-amber-700 py-10">
                  <p className="text-2xl font-bold mb-2">Magazyn jest pusty</p>
                  <p className="text-base">Rozpocznij misje, aby odzyskać dzieła sztuki!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recoveredArtworks.map((good) => (
                  <div
                    key={good.id}
                    className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-4 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden border-2 border-amber-800/30 shadow-lg">
                      <Image
                        src={good.image || "/dama.jpg"}
                        alt={good.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <h4 className="font-bold text-amber-900 text-lg mb-1">{good.name}</h4>
                    <p className="text-sm text-amber-800 mb-2 font-semibold">{good.artist}</p>
                    <p className="text-xs text-amber-700 mb-2">{good.year}</p>
                    <div className="mt-3 p-2 bg-amber-900/20 rounded border border-amber-800/30">
                      <p className="text-xs text-amber-800 font-semibold">✓ Odzyskane</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>,
      document.body
    )
  );
}

