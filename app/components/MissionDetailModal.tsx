"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { AcknowledgedMission, RetrievalTask, Agent, StolenGood } from "../types";

interface MissionDetailModalProps {
  mission: AcknowledgedMission | null;
  onClose: () => void;
  retrievalTask: RetrievalTask | null;
  agent: Agent | null;
  artwork: StolenGood | null;
  onStartMission: (missionId: number) => void;
  availableAgents: Agent[];
  canStart: boolean;
}

export default function MissionDetailModal({
  mission,
  onClose,
  retrievalTask,
  agent,
  artwork,
  onStartMission,
  availableAgents,
  canStart,
}: MissionDetailModalProps) {
  if (!mission) return null;

  const isMissionActive = retrievalTask !== null && retrievalTask.progress < 100;
  const [currentProgress, setCurrentProgress] = useState(retrievalTask?.progress || 0);
  const [agentPosition, setAgentPosition] = useState(retrievalTask ? {
    top: parseFloat(retrievalTask.currentTop.replace('%', '')),
    left: parseFloat(retrievalTask.currentLeft.replace('%', '')),
  } : null);

  // Update agent position in real-time
  useEffect(() => {
    if (!isMissionActive || !retrievalTask) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - retrievalTask.startTime;
      const newProgress = Math.min(100, (elapsed / retrievalTask.duration) * 100);

      // Calculate agent position
      const startTop = 59;
      const startLeft = 50;
      const targetTop = parseFloat(retrievalTask.targetTop.replace('%', ''));
      const targetLeft = parseFloat(retrievalTask.targetLeft.replace('%', ''));

      let currentTop: number;
      let currentLeft: number;

      if (retrievalTask.failed && newProgress >= 50) {
        const returnProgress = (newProgress - 50) / 50;
        currentTop = targetTop + (startTop - targetTop) * returnProgress;
        currentLeft = targetLeft + (startLeft - targetLeft) * returnProgress;
      } else if (retrievalTask.failed) {
        const progressRatio = newProgress / 50;
        currentTop = startTop + (targetTop - startTop) * progressRatio;
        currentLeft = startLeft + (targetLeft - startLeft) * progressRatio;
      } else {
        const progressRatio = newProgress / 100;
        currentTop = startTop + (targetTop - startTop) * progressRatio;
        currentLeft = startLeft + (targetLeft - startLeft) * progressRatio;
      }

      setCurrentProgress(newProgress);
      setAgentPosition({ top: currentTop, left: currentLeft });
    }, 100);

    return () => clearInterval(interval);
  }, [isMissionActive, retrievalTask]);

  const progress = currentProgress;

  // Calculate path from Warsaw (59%, 50%) to mission location
  const startTop = 59;
  const startLeft = 50;
  const targetTop = parseFloat(mission.top.replace('%', ''));
  const targetLeft = parseFloat(mission.left.replace('%', ''));

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[50] bg-black/20"
          onClick={onClose}
        />
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vh] max-w-[90vw] max-h-[90vh] bg-amber-100/95 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-800/50 p-4 sm:p-6 z-[60] pointer-events-auto flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-bold text-amber-900 text-2xl">{mission.title}</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost text-amber-900 hover:bg-amber-200/50"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Top Row: Map and Artwork Photo side by side */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left: Mission Location Map */}
              <div>
                <h4 className="text-lg font-semibold text-amber-900 mb-3">Trasa Misji</h4>
                <div className="relative w-full aspect-square bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden shadow-xl">
                  {/* Mini map showing path */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Path line from Warsaw to mission */}
                    <line
                      x1={startLeft}
                      y1={startTop}
                      x2={targetLeft}
                      y2={targetTop}
                      stroke="rgba(251, 191, 36, 0.6)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    {/* Warsaw marker */}
                    <circle
                      cx={startLeft}
                      cy={startTop}
                      r="3"
                      fill="rgba(180, 83, 9, 0.9)"
                      stroke="rgba(154, 52, 18, 1)"
                      strokeWidth="0.5"
                    />
                    <text x={startLeft} y={startTop - 4} fontSize="3" fill="rgba(154, 52, 18, 1)" textAnchor="middle" fontWeight="bold">🏛️</text>
                    {/* Mission location marker */}
                    <circle
                      cx={targetLeft}
                      cy={targetTop}
                      r="4"
                      fill="rgba(217, 119, 6, 0.9)"
                      stroke="rgba(180, 83, 9, 1)"
                      strokeWidth="0.5"
                    />
                    <text x={targetLeft} y={targetTop - 5} fontSize="4" fill="rgba(180, 83, 9, 1)" textAnchor="middle" fontWeight="bold">📍</text>
                    {/* Agent position if mission active */}
                    {isMissionActive && agentPosition && (
                      <>
                        <circle
                          cx={agentPosition.left}
                          cy={agentPosition.top}
                          r="2.5"
                          fill="rgba(34, 197, 94, 0.9)"
                          stroke="rgba(22, 163, 74, 1)"
                          strokeWidth="0.5"
                        />
                        <text
                          x={agentPosition.left}
                          y={agentPosition.top - 3.5}
                          fontSize="3"
                          fill="rgba(22, 163, 74, 1)"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          🚶
                        </text>
                      </>
                    )}
                  </svg>
                  {/* Legend */}
                  <div className="absolute bottom-2 left-2 bg-amber-800/90 text-amber-50 text-xs p-2 rounded space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏛️</span>
                      <span>Warszawa (Start)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span>Cel Misji</span>
                    </div>
                    {isMissionActive && (
                      <div className="flex items-center gap-2">
                        <span className="text-base">🚶</span>
                        <span>Agent</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Artwork Photo */}
              <div>
                <h4 className="text-lg font-semibold text-amber-900 mb-3">Dzieło Sztuki</h4>
                <div className="relative w-full aspect-square bg-amber-200 rounded-lg border-2 border-amber-800/30 overflow-hidden shadow-xl">
                  <Image
                    src={artwork?.image && artwork.image.trim() !== "" ? artwork.image : "/dama.jpg"}
                    alt={artwork?.name || "dama.jpg"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Details and Start Button */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-amber-900 mb-2">Opis Misji</h4>
                <p className="text-base text-amber-800 leading-relaxed">{mission.description}</p>
              </div>

              {/* Artwork Info */}
              {artwork && (
                <div>
                  <h4 className="text-lg font-semibold text-amber-900 mb-2">Szczegóły Dzieła</h4>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-amber-900">{artwork.name}</p>
                    <p className="text-lg text-amber-800">{artwork.artist}</p>
                    <p className="text-base text-amber-700">{artwork.year}</p>
                    <p className="text-sm text-amber-700">Lokalizacja: {artwork.location}</p>
                  </div>
                </div>
              )}

              {/* Agent Info */}
              {agent && (
                <div>
                  <h4 className="text-lg font-semibold text-amber-900 mb-2">Agent</h4>
                  <p className="text-base text-amber-800">{agent.name}</p>
                  {agent.codename && (
                    <p className="text-sm text-amber-700">Kryptonim: {agent.codename}</p>
                  )}
                </div>
              )}

              {/* Mission Status */}
              {isMissionActive ? (
                <div>
                  <h4 className="text-lg font-semibold text-amber-900 mb-3">Postęp Misji</h4>
                  <div className="w-full bg-amber-800/50 rounded-full h-8 border border-amber-700/50 shadow-inner overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-sm font-bold text-amber-50 transition-all duration-300 shadow-lg"
                      style={{ width: `${progress}%` }}
                    >
                      {progress > 10 && `${Math.round(progress)}%`}
                    </div>
                  </div>
                  <p className="text-sm text-amber-700 mt-2 text-center">
                    Agent w trakcie wykonywania misji...
                  </p>
                </div>
              ) : (
                <div>
                  {canStart ? (
                    <button
                      onClick={() => {
                        onStartMission(mission.id);
                        onClose();
                      }}
                      className="w-full btn btn-lg bg-amber-700 hover:bg-amber-800 text-amber-50 font-bold uppercase tracking-widest shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      ▶ Rozpocznij Misję
                    </button>
                  ) : (
                    <div className="text-amber-700 text-center p-4 bg-amber-200/50 rounded-lg">
                      <p className="font-semibold">Brak dostępnych agentów</p>
                      <p className="text-sm">Wszyscy agenci są obecnie w trakcie misji.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
}

