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

  // Update mission progress in real-time
  useEffect(() => {
    if (!isMissionActive || !retrievalTask) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - retrievalTask.startTime;
      const newProgress = Math.min(100, (elapsed / retrievalTask.duration) * 100);

      setCurrentProgress(newProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [isMissionActive, retrievalTask]);

  const progress = currentProgress;

  return (
    typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[50] bg-black/60"
          onClick={onClose}
        />
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-2xl border-4 border-amber-800 p-6 z-[60] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-amber-900 text-3xl">{mission.title}</h3>
            <button
              onClick={onClose}
              className="text-amber-900 hover:text-amber-700 text-4xl font-bold leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Main Content: Left side info, Right side artwork */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Left Column: Mission Info */}
            <div className="space-y-6 flex flex-col justify-between" style={{ minHeight: '550px' }}>
              {/* Description */}
              <div>
                <h4 className="text-xl font-semibold text-amber-900 mb-3">Opis Misji</h4>
                <p className="text-base text-amber-800 leading-relaxed">{mission.description}</p>
              </div>

              {/* Artwork Info */}
              {artwork && (
                <div className="bg-amber-200/40 rounded-lg p-4 border-2 border-amber-700/30">
                  <p className="text-2xl font-bold text-amber-900 mb-3">{artwork.name}</p>
                  <div className="flex items-center gap-4 text-amber-800">
                    <span className="text-base font-semibold">{artwork.artist}</span>
                    <span className="text-amber-600">•</span>
                    <span className="text-base">{artwork.year}</span>
                    <span className="text-amber-600">•</span>
                    <span className="text-sm">{artwork.location}</span>
                  </div>
                </div>
              )}

              {/* Agent Info */}
              {agent && (
                <div className="bg-green-100/60 rounded-lg p-4 border-2 border-green-700/30">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Agent</h4>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-700 shadow-lg flex-shrink-0">
                      <Image
                        src={agent.photo}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-base text-green-800 font-semibold">{agent.name}</p>
                  </div>
                </div>
              )}

              {/* Mission Status */}
              {isMissionActive ? (
                <div className="bg-amber-100/60 rounded-lg p-4 border-2 border-amber-700/30">
                  <h4 className="text-lg font-semibold text-amber-900 mb-3">Postęp Misji</h4>
                  <div className="relative w-full bg-amber-800/50 rounded-full h-8 border border-amber-700/50 shadow-inner overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800 mt-2 text-center font-semibold">
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
                      className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-50 text-xl font-bold uppercase tracking-widest rounded-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-900"
                    >
                      Rozpocznij Misję
                    </button>
                  ) : (
                    <div className="text-red-900 text-center p-4 bg-red-100/60 rounded-lg border-2 border-red-700/30">
                      <p className="font-bold text-lg">Brak dostępnych agentów</p>
                      <p className="text-sm mt-1">Wszyscy agenci są obecnie w trakcie misji.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Artwork Image */}
            <div>
              <h4 className="text-xl font-semibold text-amber-900 mb-3">Dzieło Sztuki</h4>
              <div className="relative w-full bg-amber-900 rounded-lg border-4 border-amber-800 overflow-hidden shadow-2xl" style={{ height: '550px' }}>
                <Image
                  src={artwork?.image && artwork.image.trim() !== "" ? artwork.image : "/dama.jpg"}
                  alt={artwork?.name || "Dzieło sztuki"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
}

