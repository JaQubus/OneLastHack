"use client";

import MissionManagementButton from "./MissionManagementButton";
import SiatkaWywiadowczaButton from "./SiatkaWywiadowczaButton";
import ProgressBar from "./ProgressBar";
import type { Agent, Skill, AcknowledgedMission, RetrievalTask, StolenGood } from "../types";

interface BottomBarProps {
  acknowledgedMissions: AcknowledgedMission[];
  activeAgents: Agent[];
  retrievalTasks: RetrievalTask[];
  stolenGoods: StolenGood[];
  intelligencePoints: number;
  activeAgentIds: number[];
  availableAgents: Agent[];
  skills: Skill[];
  overallProgress: number;
  onAddAgent: () => void;
  onLevelUpSkill: (skillId: number) => void;
  onStartMission: (missionId: number) => void;
  onMissionClick: (mission: AcknowledgedMission) => void;
}

export default function BottomBar({
  acknowledgedMissions,
  activeAgents,
  retrievalTasks,
  stolenGoods,
  intelligencePoints,
  activeAgentIds,
  availableAgents,
  skills,
  overallProgress,
  onAddAgent,
  onLevelUpSkill,
  onStartMission,
  onMissionClick,
}: BottomBarProps) {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-t-2 border-amber-800/50 shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-stretch justify-between gap-4">
          <MissionManagementButton
            acknowledgedMissions={acknowledgedMissions}
            activeAgents={activeAgents}
            retrievalTasks={retrievalTasks}
            stolenGoods={stolenGoods}
            onStartMission={onStartMission}
            onMissionClick={onMissionClick}
          />
          
          <SiatkaWywiadowczaButton
            intelligencePoints={intelligencePoints}
            activeAgents={activeAgents}
            activeAgentIds={activeAgentIds}
            availableAgents={availableAgents}
            skills={skills}
            onAddAgent={onAddAgent}
            onLevelUpSkill={onLevelUpSkill}
          />

          {/* Center Spacer */}
          <div className="flex-1"></div>

          <ProgressBar label="Postęp rabunku" progress={overallProgress} />
        </div>
      </div>
    </footer>
  );
}
