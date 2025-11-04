"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Agent, Skill } from "../types";

interface SiatkaWywiadowczaButtonProps {
  intelligencePoints: number;
  activeAgents: Agent[];
  activeAgentIds: number[];
  availableAgents: Agent[];
  skills: Skill[];
  onAddAgent: () => void;
  onLevelUpSkill: (skillId: number) => void;
}

export default function SiatkaWywiadowczaButton({
  intelligencePoints,
  activeAgents,
  activeAgentIds,
  availableAgents,
  skills,
  onAddAgent,
  onLevelUpSkill,
}: SiatkaWywiadowczaButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="relative" style={{ width: '20%' }}>
        <button
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          className="w-full h-full min-h-[60px] p-2 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm flex items-center"
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

      {/* Centered Popup - Rendered via Portal */}
      {showMenu && typeof window !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[50] bg-black/20"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] max-w-[90vw] max-h-[90vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-6 z-[60] pointer-events-auto flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="font-bold text-amber-900 text-xl">Siatka Wywiadowcza</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
              {/* Left Column - Active Agents */}
              <div className="flex flex-col min-h-0">
                <h4 className="font-bold text-amber-900 mb-3 flex-shrink-0">Aktywni agenci: {activeAgentIds.length}/5</h4>
                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {/* Agent Slots */}
                  {Array.from({ length: 5 }).map((_, index) => {
                    const agent = activeAgents[index];
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          agent
                            ? "bg-amber-200/50 border-amber-800/50"
                            : "bg-amber-200/20 border-amber-800/20 border-dashed"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 bg-amber-700 rounded-full border-2 border-amber-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
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
                          <div className="w-[72px] flex-shrink-0"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={onAddAgent}
                  disabled={activeAgentIds.length >= 5 || availableAgents.length === 0 || intelligencePoints < 15}
                  className="mt-4 w-full p-3 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 text-amber-50 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  + Nowy agent (15 punktów wywiadu)
                </button>
              </div>

              {/* Right Column - Intelligence Points & Upgrades */}
              <div className="flex flex-col min-h-0">
                <h4 className="font-bold text-amber-900 mb-3 flex-shrink-0">Punkty wywiadu: {intelligencePoints}</h4>
                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {skills.map((skill: Skill) => {
                    return (
                      <div
                        key={skill.id}
                        className="p-4 rounded-lg border-2 bg-amber-200/50 border-amber-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 bg-amber-700 rounded-full border-2 border-amber-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <span className="text-amber-50 text-xl">⚡</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-semibold text-amber-900">
                                {skill.name}
                              </div>
                              <div className="text-xs text-amber-800">
                                Poziom: {skill.level}
                                <span className="text-xs text-amber-900/80 italic text-right flex-shrink-0 max-w-[120px]"> {skill.description || ""} </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onLevelUpSkill(skill.id)}
                            disabled={skill.level >= skill.maxLevel || intelligencePoints < skill.cost}
                            className="w-[72px] px-3 py-1.5 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border border-amber-700/50 text-amber-50 text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
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
        </>,
        document.body
      )}
    </>
  );
}

