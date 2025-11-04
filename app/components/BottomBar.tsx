"use client";

import StolenGoodButton from "./StolenGoodButton";
import SiatkaWywiadowczaButton from "./SiatkaWywiadowczaButton";
import ProgressBar from "./ProgressBar";
import type { StolenGood, Agent, Skill } from "../types";

interface BottomBarProps {
  activeStolenGood: StolenGood;
  intelligencePoints: number;
  discoveredAgents: Agent[];
  skillsData: Skill[];
  overallProgress: number;
}

export default function BottomBar({
  activeStolenGood,
  intelligencePoints,
  discoveredAgents,
  skillsData,
  overallProgress,
}: BottomBarProps) {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-t-2 border-amber-800/50 shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-stretch justify-between gap-4">
          <StolenGoodButton stolenGood={activeStolenGood} />
          
          <SiatkaWywiadowczaButton
            intelligencePoints={intelligencePoints}
            discoveredAgents={discoveredAgents}
            skillsData={skillsData}
          />

          {/* Center Spacer */}
          <div className="flex-1"></div>

          <ProgressBar progress={overallProgress} label="Postęp rabunku" />
        </div>
      </div>
    </footer>
  );
}

