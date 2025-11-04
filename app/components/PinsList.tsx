"use client";

import React, { useState } from "react";

type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
  image?: string;
};

interface PinsListProps {
  markers: Marker[];
  selectedMarkerId: number | null;
  onMarkerClick: (marker: Marker) => void;
}

export default function PinsList({ markers, selectedMarkerId, onMarkerClick }: PinsListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter markers based on search query
  const filteredMarkers = markers.filter((marker) => {
    const title = (marker.title || `Zdarzenie #${marker.id}`).toLowerCase();
    const description = (marker.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || description.includes(query);
  });

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[25]"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className="absolute top-36 right-4 z-30">
        {/* Collapsed/Header Container */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-64 bg-amber-900/90 backdrop-blur-sm border-2 border-amber-800/50 shadow-xl rounded-lg p-3 flex items-center justify-between hover:bg-amber-900 transition-all"
        >
          <span className="text-lg font-bold text-amber-50">Tasks</span>
          <span className={`text-amber-50 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Expanded Container */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-amber-900/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl rounded-lg overflow-hidden z-[30]">
          {/* Search Bar */}
          <div className="p-3 border-b-2 border-amber-800/50">
            <input
              type="text"
              placeholder="Szukaj zadania..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-amber-800/50 border border-amber-700/50 rounded-lg text-amber-50 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Tasks List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredMarkers.length === 0 ? (
              <div className="text-amber-200 text-sm text-center py-8">
                {searchQuery ? "Brak wyników wyszukiwania" : "Brak aktywnych zadań"}
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredMarkers.map((marker) => (
                  <button
                    key={marker.id}
                    onClick={() => {
                      onMarkerClick(marker);
                      setIsExpanded(false);
                    }}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedMarkerId === marker.id
                        ? "bg-amber-700/90 border-amber-600 shadow-lg"
                        : "bg-amber-800/50 border-amber-700/50 hover:bg-amber-800/70 hover:border-amber-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">📍</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-amber-50 text-sm mb-1 truncate">
                          {marker.title || `Zdarzenie #${marker.id}`}
                        </div>
                        <div className="text-xs text-amber-200 line-clamp-2">
                          {marker.description || "Brak opisu"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </>
  );
}

