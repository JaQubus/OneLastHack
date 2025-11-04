"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import stolenGoodsData from "../data/stolen-goods.json";
import agentsData from "../data/agents.json";
import skillsData from "../data/skills.json";

type StolenGood = {
  id: number;
  name: string;
  artist: string;
  year: string;
  description: string;
  image: string;
  progress: number;
  estimatedTime: string;
  location: string;
};

type Agent = {
  id: number;
  name: string;
  codename: string;
  photo: string;
  location: string;
  status: string;
  specialization: string;
};

type Skill = {
  id: number;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  unlocked: boolean;
  description: string;
  parentId: number | null;
};

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [showStolenGoodPopup, setShowStolenGoodPopup] = useState(false);
  const [showSiatkaMenu, setShowSiatkaMenu] = useState(false);
  const [intelligencePoints, setIntelligencePoints] = useState(125);
  const [progress, setProgress] = useState(35); // Overall progress for "Postęp rabunku"

  // Get active stolen good (first one with progress > 0)
  const activeStolenGood = stolenGoodsData.find((good: StolenGood) => good.progress > 0) || stolenGoodsData[0];
  
  // Get discovered agents
  const discoveredAgents = agentsData.filter((agent: Agent) => agent.status === "odkryty");

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <Image
          src="/map.svg"
          alt="Mapa operacyjna Europy"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Top Bar Overlay - Vintage Yellow */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-b-2 border-amber-800/50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="btn btn-ghost btn-sm text-amber-50 hover:bg-amber-800/50 transition-all">
            ← Powrót
          </Link>
          <h1 className="text-2xl font-bold text-amber-50 drop-shadow-lg sm:text-3xl tracking-tight">ARTiFACTS</h1>
          <div className="text-sm font-mono text-amber-100 bg-amber-800/50 px-3 py-1 rounded-md border border-amber-700/50">
            <span className="font-semibold">1939</span> - <span className="font-semibold">1945</span>
          </div>
        </div>
      </header>

      {/* Bottom Bar Overlay - Vintage Yellow */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-t-2 border-amber-800/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side - Stolen Good Progress Button */}
            <div className="relative flex-1 min-w-[300px]">
              <button
                onClick={() => {
                  setShowStolenGoodPopup(true);
                  setShowSiatkaMenu(false);
                }}
                className="w-full p-3 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎨</div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-amber-50 mb-1">{activeStolenGood.name}</div>
                    <div className="w-full bg-amber-900/50 rounded-full h-4 border border-amber-700/50 shadow-inner overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                        style={{ width: `${activeStolenGood.progress}%` }}
                      >
                        {activeStolenGood.progress > 10 && `${activeStolenGood.progress}%`}
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Stolen Good Popup */}
              {showStolenGoodPopup && (
                <div className="absolute bottom-full left-0 mb-2 w-96 bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 z-30 pointer-events-auto">
                  <div className="space-y-4">
                    {/* Artwork Image and Info */}
                    <div className="flex gap-4">
                      <div className="relative w-32 h-32 bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden flex-shrink-0">
                        <Image
                          src={activeStolenGood.image}
                          alt={activeStolenGood.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-amber-300 text-amber-900 text-4xl">
                          🎨
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-900 text-lg mb-1">{activeStolenGood.name}</h3>
                        <p className="text-sm text-amber-800 font-semibold mb-1">{activeStolenGood.artist}</p>
                        <p className="text-xs text-amber-700">{activeStolenGood.year}</p>
                        <p className="text-xs text-amber-800 mt-2 leading-relaxed">{activeStolenGood.description}</p>
                        <div className="text-xs text-amber-700 mt-2">
                          <span className="font-semibold">Lokalizacja:</span> {activeStolenGood.location}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-amber-900">Postęp odzyskania</span>
                        <span className="text-sm font-bold text-amber-800">{activeStolenGood.progress}%</span>
                      </div>
                      <div className="w-full bg-amber-800/50 rounded-full h-6 border border-amber-700/50 shadow-inner overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                          style={{ width: `${activeStolenGood.progress}%` }}
                        >
                          {activeStolenGood.progress}%
                        </div>
                      </div>
                      <div className="text-xs text-amber-700 mt-2 text-center">
                        <span className="font-semibold">Szacowany czas:</span> {activeStolenGood.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Siatka Wywiadowcza Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSiatkaMenu(!showSiatkaMenu);
                  setShowStolenGoodPopup(false);
                }}
                className="btn btn-secondary btn-sm sm:btn-md text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 bg-amber-800 hover:bg-amber-900 border-amber-900"
              >
                Siatka Wywiadowcza
              </button>
              {showSiatkaMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-[500px] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 z-30 pointer-events-auto max-h-[80vh] overflow-y-auto">
                  <h3 className="font-bold text-amber-900 mb-4 text-xl">Siatka Wywiadowcza</h3>
                  
                  <div className="space-y-4">
                    {/* Intelligence Points */}
                    <div className="p-3 bg-amber-200/50 rounded-lg border border-amber-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-800 font-semibold">Punkty Wywiadu:</span>
                        <span className="font-bold text-amber-900 text-xl">{intelligencePoints}</span>
                      </div>
                    </div>

                    {/* Discovered Agents */}
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">Odkryci Agenci</h4>
                      <div className="space-y-2">
                        {discoveredAgents.map((agent: Agent) => (
                          <div key={agent.id} className="flex items-center gap-3 p-2 bg-amber-200/50 rounded border border-amber-800/30">
                            <div className="relative w-12 h-12 bg-amber-700 rounded-full border-2 border-amber-800/50 overflow-hidden flex-shrink-0">
                              <Image
                                src={agent.photo}
                                alt={agent.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-amber-700 text-amber-50 text-xl">
                                🕵️
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-amber-900">{agent.name}</div>
                              <div className="text-xs text-amber-800">Kryptonim: {agent.codename}</div>
                              <div className="text-xs text-amber-700">{agent.location} • {agent.specialization}</div>
                            </div>
                          </div>
                        ))}
                        {discoveredAgents.length === 0 && (
                          <div className="text-sm text-amber-700 italic text-center py-2">
                            Brak odkrytych agentów
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills Tree */}
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">Drzewo Umiejętności Wywiadu</h4>
                      <div className="space-y-2">
                        {skillsData.map((skill: Skill) => {
                          const indentLevel = skill.parentId ? (skillsData.find((s: Skill) => s.id === skill.parentId)?.parentId ? 8 : 4) : 0;
                          const isUnlocked = skill.unlocked && skill.level > 0;
                          
                          return (
                            <div
                              key={skill.id}
                              className={`p-2 rounded border ${
                                isUnlocked
                                  ? "bg-amber-200/50 border-amber-800/30"
                                  : "bg-amber-200/30 border-amber-800/20"
                              }`}
                              style={{ marginLeft: `${indentLevel}px` }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className={`font-semibold text-sm ${isUnlocked ? "text-amber-900" : "text-amber-800"}`}>
                                    {skill.name}
                                  </div>
                                  <div className={`text-xs ${isUnlocked ? "text-amber-800" : "text-amber-700"}`}>
                                    {skill.description}
                                  </div>
                                  {!isUnlocked && (
                                    <div className="text-xs text-amber-700 mt-1">
                                      Wymaga: {skill.cost} punktów
                                    </div>
                                  )}
                                  {isUnlocked && skill.level < skill.maxLevel && (
                                    <div className="text-xs text-amber-700 mt-1">
                                      Poziom: {skill.level}/{skill.maxLevel}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {isUnlocked ? (
                                    <div className="badge badge-success">Aktywna</div>
                                  ) : (
                                    <div className="badge badge-warning">Zablokowana</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Progress Bar */}
            <div className="flex flex-col items-end gap-2 min-w-[200px]">
              <label className="text-sm font-semibold text-amber-50 drop-shadow-sm">Postęp rabunku</label>
              <div className="w-full bg-amber-800/50 rounded-full h-6 border border-amber-700/50 shadow-inner overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && `${progress}%`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Click to close menus when clicking outside */}
      {(showStolenGoodPopup || showSiatkaMenu || selectedMarker) && (
        <div
          className="fixed inset-0 z-[15]"
          onClick={() => {
            setShowStolenGoodPopup(false);
            setShowSiatkaMenu(false);
            setSelectedMarker(null);
          }}
        />
      )}

      {/* Clickable markers overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Example marker positions */}
          <button
            className="absolute top-[30%] left-[25%] btn btn-circle btn-sm btn-error animate-pulse hover:animate-none shadow-2xl hover:scale-110 transition-transform"
            onClick={() => setSelectedMarker(1)}
            title="Zdarzenie #1"
          >
            📍
          </button>
        </div>
      </div>

      {/* Event Info Modal - Vintage */}
      {selectedMarker && (
        <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="card bg-amber-100/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl w-80 pointer-events-auto">
            <div className="card-body">
              <h2 className="card-title text-amber-900">Zdarzenie na mapie</h2>
              <p className="text-amber-800 text-sm">Kliknij na znaczniki, aby zobaczyć szczegóły</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
