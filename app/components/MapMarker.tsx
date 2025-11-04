"use client";

import { useState } from "react";

interface MapMarkerProps {
  top: string;
  left: string;
  title: string;
  onMarkerClick: () => void;
}

export default function MapMarker({ top, left, title, onMarkerClick }: MapMarkerProps) {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(true);
    onMarkerClick();
  };

  return (
    <>
      <button
        className="absolute btn btn-circle btn-sm btn-error animate-pulse hover:animate-none shadow-2xl hover:scale-110 transition-transform"
        style={{ top, left }}
        onClick={handleClick}
        title={title}
      >
        📍
      </button>

      {selected && (
        <>
          <div
            className="fixed inset-0 z-[15]"
            onClick={() => setSelected(false)}
          />
          <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="card bg-amber-100/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl w-80 pointer-events-auto">
              <div className="card-body">
                <h2 className="card-title text-amber-900">Zdarzenie na mapie</h2>
                <p className="text-amber-800 text-sm">Kliknij na znaczniki, aby zobaczyć szczegóły</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

