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
};

type Skill = {
  id: number;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  unlocked: boolean;
  description: string;
  parentId?: number | null;
};

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [showStolenGoodPopup, setShowStolenGoodPopup] = useState(false);
  const [showSiatkaMenu, setShowSiatkaMenu] = useState(false);
  const [intelligencePoints, setIntelligencePoints] = useState(125);
  const [progress, setProgress] = useState(60); // Overall progress for "Postęp rabunku"
  const [skills, setSkills] = useState<Skill[]>(skillsData);
  
  // State for active agents in slots (start with first agent if available)
  const [activeAgentIds, setActiveAgentIds] = useState<number[]>(() => {
    const firstAgent = agentsData[0];
    return firstAgent ? [firstAgent.id] : [];
  });
  
  // Get active agents from activeAgentIds
  const activeAgents: Agent[] = activeAgentIds
    .map(id => {
      const agent = agentsData.find(a => a.id === id);
      return agent ? {
        id: agent.id,
        name: agent.name,
        codename: agent.codename
      } : null;
    })
    .filter((agent): agent is Agent => agent !== null);
  
  // Get available agents (all agents from JSON that are not already active)
  const availableAgents: Agent[] = agentsData
    .filter(agent => !activeAgentIds.includes(agent.id))
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      codename: agent.codename
    }));
  
  // Function to add next available agent
  const addNextAgent = () => {
    if (activeAgentIds.length < 6 && availableAgents.length > 0) {
      const nextAgent = availableAgents[0];
      setActiveAgentIds([...activeAgentIds, nextAgent.id]);
    }
  };

  // Function to level up a skill
  const levelUpSkill = (skillId: number) => {
    setSkills(prevSkills => prevSkills.map(skill => {
      if (skill.id === skillId && skill.level < skill.maxLevel && intelligencePoints >= skill.cost) {
        setIntelligencePoints(prev => prev - skill.cost);
        return { ...skill, level: skill.level + 1 };
      }
      return skill;
    }));
  };

  // Get active stolen good (first one with progress > 0)
  const activeStolenGood = stolenGoodsData.find((good: StolenGood) => good.progress > 0) || stolenGoodsData[0];

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
            <div className="relative min-w-[250px]">
              <button
                onClick={() => {
                  setShowSiatkaMenu(!showSiatkaMenu);
                  setShowStolenGoodPopup(false);
                }}
                className="w-full p-3 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🕵️</div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-amber-50">Siatka Wywiadowcza</div>
                    <div className="text-xs text-amber-200 mt-1">Punkty: {intelligencePoints}</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Side - Progress Bar */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-base font-semibold text-amber-50 drop-shadow-sm w-[280px] text-center whitespace-nowrap">Postęp rabunku</label>
              <div className="relative bg-amber-800/50 h-12 w-[260px] rounded-lg border border-amber-700/50 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-lg font-bold text-amber-50">{progress}%</span>
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

      {/* Siatka Wywiadowcza Popup - Centered */}
      {showSiatkaMenu && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-6 z-30 pointer-events-auto flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-bold text-amber-900 text-xl">Siatka Wywiadowcza</h3>
            <button
              onClick={() => setShowSiatkaMenu(false)}
              className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Left Column - Active Agents */}
            <div className="flex flex-col min-h-0">
              <h4 className="font-bold text-amber-900 mb-3 flex-shrink-0">Aktywni agenci: {activeAgentIds.length}/6</h4>
              <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
                {/* Agent Slots */}
                {Array.from({ length: 6 }).map((_, index) => {
                  const agent = activeAgents[index];
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        agent
                          ? "bg-amber-200/50 border-amber-800/50"
                          : "bg-amber-200/20 border-amber-800/20 border-dashed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-amber-700 rounded-full border-2 border-amber-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <span className="text-amber-50 text-xl">🕵️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {agent ? (
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-semibold text-amber-900">{agent.name}</div>
                              <div className="text-xs text-amber-800">Kryptonim: {agent.codename}</div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-semibold text-amber-600/50">Pusty slot</div>
                              <div className="text-xs text-amber-600/30">-</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={addNextAgent}
                disabled={activeAgentIds.length >= 6 || availableAgents.length === 0}
                className="mt-4 w-full p-3 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 text-amber-50 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                + Nowy agent
              </button>
            </div>

            {/* Right Column - Intelligence Points & Upgrades */}
            <div className="flex flex-col min-h-0">
              <div className="mb-4 flex-shrink-0">
                <h4 className="font-bold text-amber-900 mb-2">Punkty wywiadu: {intelligencePoints}</h4>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
                {skills.map((skill: Skill) => {
                  return (
                    <div
                      key={skill.id}
                      className="p-3 rounded-lg border-2 bg-amber-200/50 border-amber-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-amber-700 rounded-full border-2 border-amber-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <span className="text-amber-50 text-xl">⚡</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-amber-900">
                              {skill.name}
                            </div>
                            <div className="text-xs text-amber-800">
                              Poziom: {skill.level}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => levelUpSkill(skill.id)}
                          disabled={skill.level >= skill.maxLevel || intelligencePoints < skill.cost}
                          className="px-3 py-1.5 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border border-amber-700/50 text-amber-50 text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                          title={skill.level >= skill.maxLevel ? "Maksymalny poziom" : `${skill.cost} punkty wywiadu`}
                        >
                          +1 ({skill.cost})
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
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
