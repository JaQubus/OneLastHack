"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { AcknowledgedMission, Agent, RetrievalTask, StolenGood } from "../types";

interface MissionManagementButtonProps {
  acknowledgedMissions: AcknowledgedMission[];
  activeAgents: Agent[];
  retrievalTasks: RetrievalTask[];
  stolenGoods: StolenGood[];
  onStartMission: (missionId: number) => void;
  onMissionClick: (mission: AcknowledgedMission) => void;
}

export default function MissionManagementButton({
  acknowledgedMissions,
  activeAgents,
  retrievalTasks,
  stolenGoods,
  onStartMission,
  onMissionClick,
}: MissionManagementButtonProps) {
  const [showList, setShowList] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ bottom: 0, left: 0, width: 0 });

  const getAvailableAgents = () => {
    const busyAgentIds = retrievalTasks
      .filter((t) => t.progress < 100)
      .map((t) => t.agentId);
    return activeAgents.filter((a) => !busyAgentIds.includes(a.id));
  };

  const availableAgents = getAvailableAgents();

  const getMissionTask = (missionId: number): RetrievalTask | null => {
    return retrievalTasks.find(t => t.missionId === missionId) || null;
  };

  const isMissionActive = (missionId: number): boolean => {
    const task = getMissionTask(missionId);
    return task !== null && task.progress < 100;
  };

  const isMissionCompleted = (mission: AcknowledgedMission): boolean => {
    // Check if artwork is recovered
    if (mission.artworkId) {
      const artwork = stolenGoods.find(g => g.id === mission.artworkId);
      if (artwork && artwork.progress === 100) {
        return true;
      }
    }
    // Check if task is completed successfully
    const task = getMissionTask(mission.id);
    if (task && task.progress >= 100 && !task.failed) {
      return true;
    }
    return false;
  };

  // Filter out completed missions
  const activeMissions = acknowledgedMissions.filter(mission => !isMissionCompleted(mission));
  const missionCount = activeMissions.length;

  // Update position when list opens
  useEffect(() => {
    if (showList && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        bottom: window.innerHeight - rect.top,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showList]);

  return (
    <div className="relative" style={{ width: '20%' }} ref={buttonRef}>
      <button
        onClick={() => {
          setShowList(!showList);
        }}
        className="w-full h-full min-h-[50px] p-3 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 shadow-lg transition-all active:scale-[0.98] flex flex-row items-center justify-start cursor-pointer"
      >
        <div className="flex flex-row gap-4 items-center">
          <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src="/dama.jpg"
              alt={"Misje"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-base font-bold text-amber-50">Zarządzanie Misjami</span>
            <span className="text-sm text-amber-200 font-semibold">({missionCount} misji)</span>
          </div>
        </div>
      </button>

      {/* List Popup - Opens Upwards */}
      {showList && typeof window !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[25]"
            onClick={() => setShowList(false)}
          />
          <div
            className="fixed max-h-96 bg-amber-900/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl rounded-lg overflow-hidden z-[30]"
            style={{
              bottom: `${position.bottom}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              marginBottom: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b-2 border-amber-800/50 flex items-center justify-between">
              <h3 className="font-bold text-amber-50 text-lg">Zarządzanie Misjami</h3>
              <button
                onClick={() => setShowList(false)}
                className="btn btn-sm btn-ghost text-amber-50 hover:bg-amber-800/50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-80">
              {activeMissions.length === 0 ? (
                <div className="text-amber-200 text-sm text-center py-8">
                  Brak zarejestrowanych misji
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {activeMissions.map((mission) => {
                    const missionActive = isMissionActive(mission.id);
                    const task = getMissionTask(mission.id);
                    const canStart = availableAgents.length > 0 && !missionActive;
                    const artwork = mission.artworkId
                      ? stolenGoods.find(g => g.id === mission.artworkId)
                      : null;
                    const imageSrc = artwork?.image && artwork.image.trim() !== "" ? artwork.image : "/dama.jpg";

                    return (
                      <button
                        key={mission.id}
                        onClick={() => {
                          onMissionClick(mission);
                          setShowList(false);
                        }}
                        className="w-full p-3 rounded-lg border-2 border-amber-700/50 bg-amber-800/50 hover:bg-amber-800/70 transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Artwork Image */}

                          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-amber-600/50">
                            <Image
                              src={imageSrc}
                              alt={artwork?.name || mission.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-amber-50 text-sm mb-1 truncate">
                              {mission.title}
                            </div>
                            <div className="text-xs text-amber-200 line-clamp-2 mb-2">
                              {mission.description}
                            </div>
                            {missionActive && task ? (
                              <div className="relative w-full bg-amber-900/50 rounded-full h-4 border border-amber-700/50 shadow-inner overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full transition-all duration-300 shadow-lg"
                                  style={{ width: `${task.progress}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    {Math.round(task.progress)}%
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-amber-300 mt-2">
                                {canStart ? "Kliknij aby zobaczyć szczegóły" : "Brak dostępnych agentów"}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

