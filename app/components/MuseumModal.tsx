"use client";

import Image from "next/image";
import { useState } from "react";

type Museum = {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  capacity: number;
};

type MuseumModalProps = {
  museum: Museum;
  paintings: any[]; // Array of paintings currently in this museum
  onClose: () => void;
  onAddPainting?: (museumId: string) => void;
};

export default function MuseumModal({ museum, paintings, onClose, onAddPainting }: MuseumModalProps) {
  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div 
        className="rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Background Image */}
        <div className="relative h-64 flex-shrink-0">
          {museum.imageUrl && (
            <>
              <Image
                src={museum.imageUrl}
                alt={museum.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
            </>
          )}
          
          {/* Header Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">{museum.name}</h2>
                <p className="text-gray-200 text-lg drop-shadow-md">{museum.location}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 text-4xl font-bold leading-none drop-shadow-lg"
              >
                ×
              </button>
            </div>
            
            {/* Description */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
              <p className="text-gray-100 leading-relaxed">{museum.description}</p>
            </div>
          </div>
        </div>

        {/* Paintings Section - White Background */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Obrazy w muzeum ({paintings.length}/{museum.capacity})
            </h3>
            {onAddPainting && paintings.length < museum.capacity && (
              <button
                onClick={() => onAddPainting(museum.id)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm shadow-lg"
              >
                + Dodaj obraz
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Existing paintings */}
            {paintings.map((painting, index) => (
              <div
                key={index}
                className="border-2 border-amber-600 rounded-lg p-2 bg-amber-50"
              >
                <div className="relative h-32 bg-gray-200 rounded mb-2">
                  {painting.imageUrl && (
                    <Image
                      src={painting.imageUrl}
                      alt={painting.title}
                      fill
                      className="object-cover rounded"
                    />
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {painting.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {painting.artist}
                </p>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: museum.capacity - paintings.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-full h-32 flex items-center justify-center mb-2">
                    <span className="text-4xl text-gray-300">🖼️</span>
                  </div>
                  <p className="text-xs text-gray-400">Puste miejsce</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
