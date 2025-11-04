"use client";

import Image from "next/image";
import { useState } from "react";
import stolenGoodsData from "../data/stolen-goods.json";
import agentsData from "../data/agents.json";
import skillsData from "../data/skills.json";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import MapMarker from "../components/MapMarker";
import type { StolenGood, Agent, Skill } from "../types";

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [intelligencePoints] = useState(125);
  const [progress] = useState(35); // Overall progress for "Postęp rabunku"

  // Get active stolen good (first one with progress > 0)
  const activeStolenGood = (stolenGoodsData as StolenGood[]).find((good: StolenGood) => good.progress > 0) || stolenGoodsData[0] as StolenGood;
  
  // Get discovered agents
  const discoveredAgents = (agentsData as Agent[]).filter((agent: Agent) => agent.status === "odkryty");

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <Image
          src="/map.png"
          alt="Mapa operacyjna Europy"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Top Bar */}
      <TopBar />

      {/* Bottom Bar */}
      <BottomBar
        activeStolenGood={activeStolenGood}
        intelligencePoints={intelligencePoints}
        discoveredAgents={discoveredAgents}
        skillsData={skillsData as Skill[]}
        overallProgress={progress}
      />

      {/* Clickable markers overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <MapMarker
            top="30%"
            left="25%"
            title="Zdarzenie #1"
            onMarkerClick={() => setSelectedMarker(1)}
          />
        </div>
      </div>
    </div>
  );
}
