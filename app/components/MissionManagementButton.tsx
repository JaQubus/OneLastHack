"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const missionCount = acknowledgedMissions.length;

  const getMissionTask = (missionId: number): RetrievalTask | null => {
    return retrievalTasks.find(t => t.missionId === missionId) || null;
  };

  const isMissionActive = (missionId: number): boolean => {
    const task = getMissionTask(missionId);
    return task !== null && task.progress < 100;
  };

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
        className="w-full h-full min-h-[60px] p-2 bg-amber-800/70 hover:bg-amber-800/90 rounded-lg border-2 border-amber-700/50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-amber-50">Zarządzanie Misjami</span>
          <span className="text-xs text-amber-200">({missionCount} misji)</span>
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
                className="btn btn-sm btn-ghost text-amber-50 hover:bg-amber-800/50"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-80">
              {acknowledgedMissions.length === 0 ? (
                <div className="text-amber-200 text-sm text-center py-8">
                  Brak zarejestrowanych misji
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {acknowledgedMissions.map((mission) => {
                    const missionActive = isMissionActive(mission.id);
                    const task = getMissionTask(mission.id);
                    const canStart = availableAgents.length > 0 && !missionActive;
                    
                    return (
                      <div
                        key={mission.id}
                        className="w-full p-3 rounded-lg border-2 border-amber-700/50 bg-amber-800/50 hover:bg-amber-800/70 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-amber-50 text-sm mb-1 truncate">
                              {mission.title}
                            </div>
                            <div className="text-xs text-amber-200 line-clamp-2 mb-2">
                              {mission.description}
                            </div>
                            {missionActive && task ? (
                              <div className="w-full bg-amber-900/50 rounded-full h-4 border border-amber-700/50 shadow-inner overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
                                  style={{ width: `${task.progress}%` }}
                                >
                                  {task.progress > 15 && `${Math.round(task.progress)}%`}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMissionClick(mission);
                                  setShowList(false);
                                }}
                                className={`mt-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                  canStart
                                    ? "bg-amber-700 hover:bg-amber-600 text-amber-50 shadow-md hover:shadow-lg active:scale-95"
                                    : "bg-amber-900/50 text-amber-400 cursor-not-allowed"
                                }`}
                              >
                                {canStart ? "Zobacz szczegóły misji" : "Brak dostępnych agentów"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
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

