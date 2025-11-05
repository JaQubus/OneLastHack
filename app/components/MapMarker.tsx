"use client";

import React from "react";

type Props = {
  id: number;
  top: string; // CSS value, e.g. '30%'
  left: string; // CSS value, e.g. '25%'
  title?: string;
  onClick?: (id: number) => void;
  className?: string;
};

export default function MapMarker({ id, top, left, title, onClick, className }: Props) {
  return (
    <button
      className={`absolute text-3xl cursor-pointer btn btn-circle btn-sm btn-error animate-pulse hover:animate-none shadow-2xl hover:scale-110 transition-transform ${className ?? ""}`}
      style={{ top, left }}
      onClick={() => onClick && onClick(id)}
      title={title}
      aria-label={title || `Marker ${id}`}
    >
      📍
    </button>
  );
}
