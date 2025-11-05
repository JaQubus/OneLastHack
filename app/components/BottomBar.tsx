"use client";

import StolenGoodButton from "./StolenGoodButton";
import SiatkaWywiadowczaButton from "./SiatkaWywiadowczaButton";
import ProgressBar from "./ProgressBar";
import type { StolenGood, Agent, Skill } from "../types";

interface BottomBarProps {
  activeStolenGood: StolenGood;
  intelligencePoints: number;
  activeAgents: Agent[];
  activeAgentIds: number[];
  availableAgents: Agent[];
  skills: Skill[];
  overallProgress: number;
  onAddAgent: () => void;
  onLevelUpSkill: (skillId: number) => void;
}

export default function BottomBar({
  activeStolenGood,
  intelligencePoints,
  activeAgents,
  activeAgentIds,
  availableAgents,
  skills,
  overallProgress,
  onAddAgent,
  onLevelUpSkill,
}: BottomBarProps) {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-t-2 border-amber-800/50 shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-stretch justify-between gap-4">
          <StolenGoodButton stolenGood={activeStolenGood} />
          
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

