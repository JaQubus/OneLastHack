"use client";

import Image from "next/image";
import { useState } from "react";
import stolenGoodsData from "../data/stolen-goods.json";
import agentsData from "../data/agents.json";
import skillsData from "../data/skills.json";
import initialMarkers from "../data/map-markers.json";
import Timeline from "../components/Timeline";
import EventModal from "../components/EventModal";
import MapMarker from "../components/MapMarker";
import { placeRandomMarker } from "../../lib/placeRandomMarker";
import { useEffect } from "react";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import type { StolenGood, Agent, Skill } from "../types";

type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
};

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [showStolenGoodPopup, setShowStolenGoodPopup] = useState(false);
  const [showSiatkaMenu, setShowSiatkaMenu] = useState(false);
  const [intelligencePoints, setIntelligencePoints] = useState(125);
  const [progress, setProgress] = useState(60); // Overall progress for "Postęp rabunku"
  const [skills, setSkills] = useState<Skill[]>(skillsData as Skill[]);
  
  // State for active agents in slots (start with first agent if available)
  const [activeAgentIds, setActiveAgentIds] = useState<number[]>(() => {
    const firstAgent = agentsData[0];
    return firstAgent ? [firstAgent.id] : [];
  });
  
  // Get active agents from activeAgentIds
  const activeAgents: Agent[] = activeAgentIds
    .map(id => {
      const agent = (agentsData as Agent[]).find(a => a.id === id);
      return agent || null;
    })
    .filter((agent): agent is Agent => agent !== null);
  
  // Get available agents (all agents from JSON that are not already active)
  const availableAgents: Agent[] = (agentsData as Agent[])
    .filter(agent => !activeAgentIds.includes(agent.id));
  
  // Function to add next available agent
  const addNextAgent = () => {
    if (activeAgentIds.length < 6 && availableAgents.length > 0) {
      const nextAgent = availableAgents[0];
      setActiveAgentIds([...activeAgentIds, nextAgent.id]);
    }
  };

  // Function to level up a skill
  const levelUpSkill = (skillId: number) => {
    setSkills(prevSkills => prevSkills.map(skill => {
      if (skill.id === skillId && skill.level < skill.maxLevel && intelligencePoints >= skill.cost) {
        setIntelligencePoints(prev => prev - skill.cost);
        return { ...skill, level: skill.level + 1 };
      }
      return skill;
    }));
  };
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers as Marker[]);

  // Get active stolen good (first one with progress > 0)
  const activeStolenGood = (stolenGoodsData as StolenGood[]).find((good: StolenGood) => good.progress > 0) || stolenGoodsData[0] as StolenGood;
  
  // Get discovered agents
  const discoveredAgents = (agentsData as Agent[]).filter((agent: Agent) => agent.status === "odkryty");

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <Image
          src="/map.svg"
          alt="Mapa operacyjna Europy"
          fill
          className="object-cover pointer-events-none"
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
          {/* Example marker positions loaded from JSON */}
          {markers.map((m) => (
            <MapMarker
              key={m.id}
              id={m.id}
              top={m.top}
              left={m.left}
              onClick={(id) => {
                const found = markers.find((x) => x.id === id) || null;
                setSelectedMarker(found);
              }}
              title={m.title}
            />
          ))}
        </div>
      </div>

      {/* Event Info Modal - moved to component */}
      {selectedMarker != null && (
        <EventModal marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
      )}
    </div>
  );
}
