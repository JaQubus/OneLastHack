"use client";

import React from "react";

type Marker = {
  id: number;
  top?: string;
  left?: string;
  title?: string;
  description?: string;
};

type Props = {
  marker: Marker | null;
  onClose: () => void;
};

export default function EventModal({ marker, onClose }: Props) {
  return (
    <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="card bg-amber-100/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl w-80 pointer-events-auto">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="card-title text-amber-900">{marker?.title ?? "Zdarzenie na mapie"}</h2>
              <p className="text-amber-800 text-sm">{marker?.description ?? "Kliknij na znaczniki, aby zobaczyć szczegóły"}</p>
            </div>
            <div>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm text-amber-700 hover:bg-amber-200"
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>
          </div>

          {marker != null && (
            <div className="text-xs text-amber-700 mt-2">Zaznaczony znacznik: #{marker.id}</div>
          )}
        </div>
      </div>
    </div>
  );
}
