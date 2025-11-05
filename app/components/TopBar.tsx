"use client";

import Link from "next/link";
import Image from "next/image";
import Timeline from "./Timeline";
import { useGameTime } from "./GameTimeProvider";

export default function TopBar() {
  const { isRunning, toggle } = useGameTime();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-b-2 border-amber-800/50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-amber-50 drop-shadow-lg hover:text-amber-100 transition-colors cursor-pointer">
          <Image
            src="/logo.png"
            alt="Strażnicy Dziedzictwa"
            width={96}
            height={96}
            className="object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          />
          <span className="sr-only">Strażnicy dziedzictwa</span>
        </Link>
        <div className="flex items-center gap-3">
          <button 
            className={`aspect-square w-14 h-14 flex items-center justify-center text-amber-50 text-sm font-semibold rounded border border-amber-600/50 shadow-md transition-all active:scale-95 ${
              isRunning 
                ? 'bg-amber-800/50 hover:bg-amber-800/70' 
                : 'bg-amber-700/80 hover:bg-amber-700'
            }`}
            onClick={toggle}
          >
            {isRunning ? '⏸' : '▶'}
          </button>
          <div className="h-14 text-sm font-mono text-amber-100 bg-amber-800/50 px-3 py-1 rounded-md border border-amber-700/50 flex items-center">
            <Timeline />
          </div>
        </div>
      </div>
    </header>
  );
}

