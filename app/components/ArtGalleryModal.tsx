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
  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[50] bg-black/20"
          onClick={onClose}
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] max-w-[95vw] max-h-[95vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-6 z-[60] pointer-events-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-bold text-amber-900 text-2xl">Magazyn - Warszawa</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stolenGoods.map((good) => (
                <div
                  key={good.id}
                  className="bg-amber-200/80 rounded-lg border-2 border-amber-800/30 p-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden border-2 border-amber-800/30">
                    <Image
                      src={good.image || "/dama.jpg"}
                      alt={good.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-amber-900 text-lg mb-1">{good.name}</h4>
                  <p className="text-sm text-amber-800 mb-2">{good.artist}</p>
                  <p className="text-xs text-amber-700 mb-3">{good.year}</p>
                  <div className="w-full bg-amber-800/50 rounded-full h-3 border border-amber-700/50 shadow-inner overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                      style={{ width: `${good.progress}%` }}
                    >
                      {good.progress > 15 && `${good.progress}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
}

