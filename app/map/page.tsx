"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import stolenGoodsData from "../data/stolen-goods.json";
import initialMarkers from "../data/map-markers.json";
import agentsData from "../data/agents.json";
import skillsData from "../data/skills.json";
// start with no pre-existing markers; markers will be spawned by the game time
import Timeline from "../components/Timeline";
import EventModal from "../components/EventModal";
import MapMarker from "../components/MapMarker";
import { placeRandomMarker } from "../../lib/placeRandomMarker";
import { useGameTime } from "../components/GameTimeProvider";
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
    // Find the skill first
    const skill = skills.find(s => s.id === skillId);
    if (!skill || skill.level >= skill.maxLevel || intelligencePoints < skill.cost) {
      return; // Can't upgrade
    }
    
    // Deduct points
    setIntelligencePoints(prev => prev - skill.cost);
    
    // Update skill level
    setSkills(prevSkills => 
      prevSkills.map(s => 
        s.id === skillId ? { ...s, level: s.level + 1 } : s
      )
    );
  };
  // start with empty markers; the scheduled job will spawn markers over time
  const [markers, setMarkers] = useState<Marker[]>([]);
  const markersRef = useRef<Marker[]>(markers);
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const { scheduleEvery, cancelScheduled } = useGameTime();

  // Schedule an event every 30 in-game days to spawn a new marker and open its modal
  useEffect(() => {
    const id = scheduleEvery(30, () => {
      // pick a random template from the JSON titles/descriptions
      const pool = initialMarkers as { id: number; top: string; left: string; title: string; description: string }[];
      const tpl = pool[Math.floor(Math.random() * pool.length)] || {};
      // use placeRandomMarker util to compute a random position for the template
      const moved = placeRandomMarker([ { id: tpl.id, top: tpl.top, left: tpl.left, title: tpl.title, description: tpl.description } ])[0];
      const newMarker: Marker = {
        id: Date.now(),
        top: moved.top,
        left: moved.left,
        title: tpl.title ?? `Wydarzenie`,
        description: tpl.description ?? "Nowe zdarzenie wykryte przez siatkę wywiadowczą.",
      };

      // add marker (do NOT open modal automatically)
      setMarkers((prev) => [...prev, newMarker]);
    });

    return () => cancelScheduled(id);
    // scheduleEvery/cancelScheduled are stable from provider; eslint disabled to avoid frequent reschedule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get active stolen good (first one with progress > 0)
  const activeStolenGood = (stolenGoodsData as StolenGood[]).find((good: StolenGood) => good.progress > 0) || stolenGoodsData[0] as StolenGood;

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
        activeAgents={activeAgents}
        activeAgentIds={activeAgentIds}
        availableAgents={availableAgents}
        skills={skills}
        overallProgress={progress}
        onAddAgent={addNextAgent}
        onLevelUpSkill={levelUpSkill}
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
        <EventModal
          marker={selectedMarker}
          onClose={() => {
            if (selectedMarker) {
              setMarkers((prev) => prev.filter((m) => m.id !== selectedMarker.id));
            }
            setSelectedMarker(null);
          }}
        />
      )}
    </div>
  );
}
