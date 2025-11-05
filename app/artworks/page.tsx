"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import artworksData from "../data/artworks.json";
import stolenGoodsData from "../data/stolen-goods.json";
import ArtworkModal from "../components/ArtworkModal";

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

const DISCOVERED_KEY = "discoveredArtworks";
const RECOVERED_ARTWORKS_KEY = "recoveredArtworks";

export default function ArtworksPage() {
  const [discoveredTitles, setDiscoveredTitles] = useState<Set<string>>(new Set());
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    // Load discovered artworks from localStorage (both discovered and recovered)
    if (typeof window !== "undefined") {
      const discoveredSet = new Set<string>();
      
      // Load discovered artworks
      const discoveredStored = localStorage.getItem(DISCOVERED_KEY);
      if (discoveredStored) {
        try {
          const discovered = JSON.parse(discoveredStored) as string[];
          discovered.forEach(title => discoveredSet.add(title));
        } catch (e) {
          console.error("Failed to parse discovered artworks:", e);
        }
      }
      
      // Load recovered artworks (from map gameplay) - these should also be shown as discovered
      const recoveredStored = localStorage.getItem(RECOVERED_ARTWORKS_KEY);
      if (recoveredStored) {
        try {
          const recoveredIds = JSON.parse(recoveredStored) as number[];
          // Map recovered artwork IDs to titles (case-insensitive matching)
          const stolenGoods = stolenGoodsData as any[];
          const artworks = artworksData.stolen_artworks;
          recoveredIds.forEach(id => {
            const good = stolenGoods.find(g => g.id === id);
            if (good && good.name) {
              // Try to find matching artwork title (case-insensitive)
              const matchingArtwork = artworks.find(a => 
                a.title.toLowerCase() === good.name.toLowerCase()
              );
              if (matchingArtwork) {
                discoveredSet.add(matchingArtwork.title); // Use exact title from artworks.json
              } else {
                discoveredSet.add(good.name); // Fallback to name from stolen-goods
              }
            }
          });
        } catch (e) {
          console.error("Failed to parse recovered artworks:", e);
        }
      }
      
      setDiscoveredTitles(discoveredSet);
    }
  }, []);

  const artworks: Artwork[] = artworksData.stolen_artworks;

  const isDiscovered = (title: string) => {
    return discoveredTitles.has(title);
  };

  return (
    <div className="relative min-h-screen bg-[#f4e4bc]">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjZjBkODk1IiBmaWxsLW9wYWNpdHk9Ii4xNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 via-transparent to-amber-300/20 mix-blend-multiply"></div>

      {/* Simple Header */}
      <header className="sticky top-0 z-20 bg-amber-900/80 backdrop-blur-sm border-b-2 border-amber-800/50 shadow-lg">
        <div className="container mx-auto flex items-center px-4 py-3 sm:px-6">
          <Link href="/" className="btn btn-ghost btn-sm text-amber-50 hover:bg-amber-800/50 transition-all">
            ← Powrót
          </Link>
          <h1 className="flex-1 text-center text-xl sm:text-2xl font-bold text-amber-50 drop-shadow-lg tracking-tight">Kolekcja Dzieł Sztuki</h1>
          <div className="w-20 sm:w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <p className="text-lg text-amber-800 max-w-2xl mx-auto mb-4">
              Wszystkie zrabowane dzieła sztuki z okresu II wojny światowej
            </p>
            <div className="text-sm text-amber-700 font-semibold">
              Odkryte: {discoveredTitles.size} / {artworks.length}
            </div>
          </div>

          {/* Artworks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork, index) => {
              const discovered = isDiscovered(artwork.title);
              const imagePath = `/artworks/${artwork.img}`;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (discovered) {
                      setSelectedArtwork(artwork);
                    }
                  }}
                  className={`card bg-amber-100/90 border-2 ${
                    discovered
                      ? "border-amber-800/50 shadow-xl cursor-pointer hover:shadow-2xl"
                      : "border-amber-700/30 shadow-lg cursor-not-allowed opacity-75"
                  } rounded-xl overflow-hidden transition-all duration-300`}
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-amber-200">
                    <div
                      className={`relative w-full h-full ${
                        discovered ? "" : "grayscale blur-sm"
                      } transition-all duration-300`}
                    >
                      <Image
                        src={imagePath}
                        alt={artwork.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    {!discovered && (
                      <div className="absolute inset-0 flex items-center justify-center bg-amber-900/40">
                        <div className="text-amber-50 text-2xl font-bold drop-shadow-lg">
                          ???
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content - Only show title, details in modal */}
                  <div className="card-body p-4 sm:p-6">
                    <h2
                      className={`card-title text-xl sm:text-2xl mb-2 text-center ${
                        discovered ? "text-amber-900" : "text-amber-700"
                      }`}
                    >
                      {discovered ? artwork.title : "Nieznane dzieło"}
                    </h2>
                    {discovered && (
                      <div className="text-center text-sm text-amber-600 mt-2">
                        Kliknij, aby zobaczyć szczegóły
                      </div>
                    )}
                    {!discovered && (
                      <div className="text-center text-amber-700 italic text-sm mt-2">
                        Odkryj to dzieło podczas misji
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}

