"use client";

import Image from "next/image";
import { useEffect } from "react";

interface Location {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
}

interface LocationModalProps {
  location: Location;
  onClose: () => void;
}

export default function LocationModal({ location, onClose }: LocationModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-4 border-amber-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-amber-200/50 hover:bg-amber-200 text-amber-900 rounded-full transition-all duration-200 hover:scale-110 border-2 border-amber-700/50"
          aria-label="Zamknij"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header with Background Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-cover"
            priority
          />
          
          {/* Title Overlay with semi-transparent background */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {location.name}
            </h2>
            <div className="flex items-center gap-2 text-amber-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-lg font-semibold">{location.location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-amber-200/50 rounded-xl p-6 border-2 border-amber-700/50">
              <h3 className="text-xl font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Informacje historyczne
              </h3>
              <p className="text-amber-900 leading-relaxed text-lg">
                {location.description}
              </p>
            </div>

            {/* Info Badge */}
            <div className="flex items-center gap-3 text-sm text-amber-800 bg-amber-200/30 rounded-lg p-4 border-2 border-amber-700/30">
              <svg
                className="w-5 h-5 text-amber-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Ta lokacja była jednym z kluczowych miejsc przechowywania skradzionych dzieł sztuki podczas II wojny światowej.
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-amber-800 rounded-tl-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-amber-800 rounded-br-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}
