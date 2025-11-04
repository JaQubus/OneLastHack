"use client";

import Image from "next/image";
import { useState } from "react";
import type { Agent, Skill } from "../types";

interface SiatkaWywiadowczaButtonProps {
  intelligencePoints: number;
  discoveredAgents: Agent[];
  skillsData: Skill[];
}

export default function SiatkaWywiadowczaButton({
  intelligencePoints,
  discoveredAgents,
  skillsData,
}: SiatkaWywiadowczaButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative" style={{ width: '20%' }}>
      <button
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className="w-full h-full min-h-[60px] p-2 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-white font-semibold hover:shadow-xl flex items-center justify-center text-xs sm:text-sm"
      >
        Siatka Wywiadowcza
      </button>
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-[15]"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="absolute bottom-full left-0 mb-2 w-[500px] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 z-30 pointer-events-auto max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
                  {discoveredAgents.map((agent) => (
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
                  {skillsData.map((skill) => {
                    const indentLevel = skill.parentId ? (skillsData.find((s) => s.id === skill.parentId)?.parentId ? 8 : 4) : 0;
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
        </>
      )}
    </div>
  );
}

