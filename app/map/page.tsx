"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import stolenGoodsData from "../data/stolen-goods.json";
import initialMarkers from "../data/map-markers.json";
import agentsData from "../data/agents.json";
import skillsData from "../data/skills.json";
import museumsData from "../data/museums.json";
// start with no pre-existing markers; markers will be spawned by the game time
import EventModal from "../components/EventModal";
import MapMarker from "../components/MapMarker";
<<<<<<< HEAD
import { placeRandomMarker, clampMarkerPosition, getRandomPositionAwayFromMarkers } from "../../lib/placeRandomMarker";
=======
import MuseumMarker from "../components/MuseumMarker";
import MuseumModal from "../components/MuseumModal";
import { placeRandomMarker } from "../../lib/placeRandomMarker";
>>>>>>> e129016 (map rework,k a and added museums)
import { useGameTime } from "../components/GameTimeProvider";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import ToastContainer, { ToastType } from "../components/Toast";
import ArtGalleryModal from "../components/ArtGalleryModal";
import MissionDetailModal from "../components/MissionDetailModal";
import type { StolenGood, Agent, Skill, AcknowledgedMission, RetrievalTask } from "../types";

type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
  artworkId?: number;
};

type Museum = {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  capacity: number;
  top: string;
  left: string;
};

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [intelligencePoints, setIntelligencePoints] = useState(125);
  const [progress, setProgress] = useState(0);
  const [skills, setSkills] = useState<Skill[]>(skillsData as Skill[]);
<<<<<<< HEAD
  const [highlightedMarkerId, setHighlightedMarkerId] = useState<number | null>(null);
  const [acknowledgedMissions, setAcknowledgedMissions] = useState<AcknowledgedMission[]>([]);
  const [retrievalTasks, setRetrievalTasks] = useState<RetrievalTask[]>([]);
  const [stolenGoods, setStolenGoods] = useState<StolenGood[]>(stolenGoodsData as StolenGood[]);
  const [showArtGallery, setShowArtGallery] = useState(false);
  const [selectedMission, setSelectedMission] = useState<AcknowledgedMission | null>(null);
  const [hasInitialBubble, setHasInitialBubble] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  // Reset and start timer when map page loads
  useEffect(() => {
    // Reset game time to start date
    reset();
    // Start the timer automatically
    start();
  }, []); // Empty deps - only run on mount

  // State for active agents in slots (start with first 2 agents)
=======
  
  // Map panning state
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2.0);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // State for active agents in slots (start with first agent if available)
>>>>>>> e129016 (map rework,k a and added museums)
  const [activeAgentIds, setActiveAgentIds] = useState<number[]>(() => {
    const firstTwoAgents = agentsData.slice(0, 2);
    return firstTwoAgents.map(a => a.id);
  });

  // Warsaw storage location (center of map, 59% from top)
  const WARSAW_STORAGE: Marker = {
    id: -1,
    top: "59%",
    left: "50%",
    title: "Magazyn - Warszawa",
    description: "Centralny magazyn odzyskanych dzieł sztuki",
  };
  const WARSAW_START_TOP = 59; // Starting position for agents
  const WARSAW_START_LEFT = 50;

  // Get active agents from activeAgentIds
  const activeAgents: Agent[] = activeAgentIds
    .map(id => {
      const agent = agentsData.find(a => a.id === id);
      return agent ? agent as Agent : null;
    })
    .filter((agent): agent is Agent => agent !== null);

  // Get available agents (all agents from JSON that are not already active)
  const availableAgents: Agent[] = agentsData
    .filter(agent => !activeAgentIds.includes(agent.id))
    .map(agent => agent as Agent);

  // Function to add next available agent
  const addNextAgent = () => {
    const agentCost = 15;
    if (activeAgentIds.length < 4 && availableAgents.length > 0 && intelligencePoints >= agentCost) {
      const nextAgent = availableAgents[0];
      setIntelligencePoints(prev => prev - agentCost);
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
  const { scheduleEvery, cancelScheduled, isRunning, currentDate, reset, start } = useGameTime();

  // Track marker creation time for 20 second auto-removal
  const [markerCreationTimes, setMarkerCreationTimes] = useState<Map<number, number>>(new Map());

  // Start with empty markers - will be populated on client side
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const markersRef = useRef<Marker[]>(markers);
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

<<<<<<< HEAD
  // Initialize with one bubble at game start (client-side only to avoid hydration mismatch)
=======
  const { scheduleEvery, cancelScheduled } = useGameTime();

  // Function to constrain map position within bounds
  const constrainPosition = (x: number, y: number, currentZoom: number) => {
    if (!mapContainerRef.current) return { x, y };
    
    const container = mapContainerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // SVG map is roughly square (1646x1450), with object-contain it will fit to the smaller dimension
    // Calculate actual displayed map size based on container aspect ratio
    const containerAspect = containerWidth / containerHeight;
    const mapAspect = 1646 / 1450; // roughly 1.135
    
    let displayedMapWidth, displayedMapHeight;
    
    if (containerAspect > mapAspect) {
      // Container is wider - map height matches container height
      displayedMapHeight = containerHeight;
      displayedMapWidth = containerHeight * mapAspect;
    } else {
      // Container is taller - map width matches container width
      displayedMapWidth = containerWidth;
      displayedMapHeight = containerWidth / mapAspect;
    }
    
    // Apply zoom
    const scaledWidth = displayedMapWidth * currentZoom;
    const scaledHeight = displayedMapHeight * currentZoom;
    
    // Calculate how much the map extends beyond the viewport
    const excessWidth = scaledWidth - containerWidth;
    const excessHeight = scaledHeight - containerHeight;
    
    // Limit panning to map boundaries
    if (excessWidth > 0) {
      // Map is wider than viewport - allow horizontal panning
      const maxX = excessWidth / 2;
      x = Math.max(-maxX, Math.min(maxX, x));
    } else {
      // Map is narrower than viewport - center horizontally
      x = 0;
    }
    
    if (excessHeight > 0) {
      // Map is taller than viewport - allow vertical panning
      const maxY = excessHeight / 2;
      y = Math.max(-maxY, Math.min(maxY, y));
    } else {
      // Map is shorter than viewport - center vertically
      y = 0;
    }
    
    return { x, y };
  };

  // Map panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapPosition.x,
      y: e.clientY - mapPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const constrained = constrainPosition(newX, newY, zoom);
    setMapPosition(constrained);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - mapPosition.x,
      y: touch.clientY - mapPosition.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    const constrained = constrainPosition(newX, newY, zoom);
    setMapPosition(constrained);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(2.0, zoom + delta), 3);
    
    setZoom(newZoom);
    
    // Adjust position to keep it within bounds after zoom
    const constrained = constrainPosition(mapPosition.x, mapPosition.y, newZoom);
    setMapPosition(constrained);
  };

  // Schedule an event every 30 in-game days to spawn a new marker and open its modal
>>>>>>> e129016 (map rework,k a and added museums)
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      // Get first available artwork
      const availableArtworks = (stolenGoodsData as StolenGood[]).filter((good) => good.progress < 100);
      if (availableArtworks.length > 0) {
        const artwork = availableArtworks[0];
        const initialMarkerId = Date.now();
        const initialPosition = getRandomPositionAwayFromMarkers([]);
        if (initialPosition) {
          const initialMarker: Marker = {
            id: initialMarkerId,
            top: initialPosition.top,
            left: initialPosition.left,
            title: artwork.name,
            description: `Lokalizacja: ${artwork.location}. ${artwork.description}`,
            artworkId: artwork.id,
          };
          setMarkers([initialMarker]);
          setMarkerCreationTimes((prev) => {
            const newMap = new Map(prev);
            newMap.set(initialMarkerId, Date.now());
            return newMap;
          });
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // Calculate progress based on game time (from 1939-09-01 to 1945-05-08)
  // Use same date normalization as GameTimeProvider for perfect sync
  useEffect(() => {
    const startDate = new Date(1939, 8, 1); // Month is 0-indexed, so 8 = September
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(1945, 4, 8); // Month is 0-indexed, so 4 = May
    endDate.setHours(0, 0, 0, 0);
    
    // Use dayNumber-like calculation for consistency
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
    const currentDays = Math.floor((currentDate.getTime() - startDate.getTime()) / 86400000);
    const newProgress = Math.min(100, Math.max(0, (currentDays / totalDays) * 100));
    
    setProgress(newProgress);
  }, [currentDate]);

  // Auto-remove markers after 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMarkers((prev) => {
        return prev.filter((m) => {
          if (m.id === WARSAW_STORAGE.id) return true; // Keep storage
          const createdAt = markerCreationTimes.get(m.id);
          if (!createdAt) return true; // Keep if no timestamp
          return now - createdAt < 20000; // Remove after 20 seconds
        });
      });
      // Clean up old timestamps
      setMarkerCreationTimes((prev) => {
        const newMap = new Map(prev);
        prev.forEach((createdAt, id) => {
          if (now - createdAt >= 20000) {
            newMap.delete(id);
          }
        });
        return newMap;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [markerCreationTimes]);

  // Update retrieval tasks progress
  useEffect(() => {
    const interval = setInterval(() => {
      setRetrievalTasks((prev) => {
        const now = Date.now();
        return prev.map((task) => {
          const elapsed = now - task.startTime;
          const newProgress = Math.min(100, (elapsed / task.duration) * 100);

          let currentTop: number;
          let currentLeft: number;
          const startTop = WARSAW_START_TOP; // Start from Warsaw
          const startLeft = WARSAW_START_LEFT;
          const targetTop = parseFloat(task.targetTop.replace('%', ''));
          const targetLeft = parseFloat(task.targetLeft.replace('%', ''));

          let isReturning = task.isReturning || false;

          if (task.failed && newProgress >= 50) {
            if (!isReturning) isReturning = true;
            const returnProgress = (newProgress - 50) / 50;
            currentTop = targetTop + (startTop - targetTop) * returnProgress;
            currentLeft = targetLeft + (startLeft - targetLeft) * returnProgress;
          } else if (task.failed) {
            const progressRatio = newProgress / 50;
            currentTop = startTop + (targetTop - startTop) * progressRatio;
            currentLeft = startLeft + (targetLeft - startLeft) * progressRatio;
          } else {
            const progressRatio = newProgress / 100;
            currentTop = startTop + (targetTop - startTop) * progressRatio;
            currentLeft = startLeft + (targetLeft - startLeft) * progressRatio;
          }

          if (newProgress >= 100 && task.progress < 100) {
            if (!task.failed) {
              setIntelligencePoints((prev) => prev + 25);
              setStolenGoods((prev) =>
                prev.map((good) =>
                  good.id === task.artworkId ? { ...good, progress: 100 } : good
                )
              );
            }
          }

          return {
            ...task,
            progress: newProgress,
            currentTop: `${currentTop}%`,
            currentLeft: `${currentLeft}%`,
            isReturning: isReturning,
          };
        }).filter((task) => {
          if (task.progress < 100) return true;
          const completedTime = Date.now() - (task.startTime + task.duration);
          return completedTime < 2000;
        });
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate failure chance
  const calculateFailureChance = (): number => {
    const baseFailureChance = 30;
    let totalReduction = 0;
    skills.forEach((skill) => {
      if (skill.description.includes("skuteczności misji") || skill.description.includes("ryzyko")) {
        const reductionPerLevel = skill.description.includes("skuteczności misji")
          ? (skill.description.includes("+10%") ? 2 : skill.description.includes("+20%") ? 4 : skill.description.includes("+30%") ? 6 : 2)
          : (skill.description.includes("-20%") ? 4 : 2);
        totalReduction += skill.level * reductionPerLevel;
      }
    });
    return Math.max(5, baseFailureChance - totalReduction);
  };

  // Start mission from mission management
  const startMission = (missionId: number) => {
    const mission = acknowledgedMissions.find(m => m.id === missionId);
    if (!mission) {
      console.error("Mission not found:", missionId);
      return;
    }

    const busyAgentIds = retrievalTasks.filter(t => t.progress < 100).map(t => t.agentId);
    const availableAgent = activeAgents.find(a => !busyAgentIds.includes(a.id));

    if (!availableAgent) {
      alert("Brak dostępnych agentów!");
      return;
    }

    const failureChance = calculateFailureChance();
    const willFail = Math.random() * 100 < failureChance;

    const newTask: RetrievalTask = {
      id: Date.now(),
      missionId: mission.id,
      agentId: availableAgent.id,
      artworkId: mission.artworkId || 0,
      startTime: Date.now(),
      duration: 90000, // 90 seconds
      progress: 0,
      targetTop: mission.top,
      targetLeft: mission.left,
      currentTop: `${WARSAW_START_TOP}%`,
      currentLeft: `${WARSAW_START_LEFT}%`,
      failed: willFail,
      failureChance: failureChance,
      isReturning: false,
    };

    setRetrievalTasks((prev) => [...prev, newTask]);
  };

  // Collect marker when clicked - gives intelligence points and adds to missions
  const collectMarker = (marker: Marker) => {
    // Check if already collected
    if (acknowledgedMissions.some(m => m.markerId === marker.id)) return;

    // Give intelligence points for collecting
    setIntelligencePoints((prev) => prev + 10); // 10 points for collecting a bubble

    // Find artwork if marker has artworkId
    const artwork = marker.artworkId
      ? stolenGoods.find(g => g.id === marker.artworkId)
      : null;

    // Add to acknowledged missions (possible missions)
    const newMission: AcknowledgedMission = {
      id: Date.now(),
      markerId: marker.id,
      title: marker.title || `Misja #${marker.id}`,
      description: marker.description || "Nowa misja odkryta",
      top: marker.top,
      left: marker.left,
      artworkId: marker.artworkId,
      acknowledgedAt: Date.now(),
    };

    setAcknowledgedMissions((prev) => [...prev, newMission]);

    // Show toast notification for new mission
    const toastId = `toast-${Date.now()}`;
    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        title: "Nowa Misja!",
        message: newMission.title,
        duration: 5000,
      },
    ]);

    // Remove marker from map after collection
    setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
    setMarkerCreationTimes((prev) => {
      const newMap = new Map(prev);
      newMap.delete(marker.id);
      return newMap;
    });
  };

  // Update retrieval tasks progress and agent position in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setRetrievalTasks((prev) => {
        const now = Date.now();
        return prev.map((task) => {
          const elapsed = now - task.startTime;
          const newProgress = Math.min(100, (elapsed / task.duration) * 100);

          let currentTop: number;
          let currentLeft: number;
          const startTop = 60; // Warsaw storage at 60%
          const startLeft = 50;
          const targetTop = parseFloat(task.targetTop.replace('%', ''));
          const targetLeft = parseFloat(task.targetLeft.replace('%', ''));

          let isReturning = task.isReturning || false;

          if (task.failed && newProgress >= 50) {
            if (!isReturning) isReturning = true;
            const returnProgress = (newProgress - 50) / 50;
            currentTop = targetTop + (startTop - targetTop) * returnProgress;
            currentLeft = targetLeft + (startLeft - targetLeft) * returnProgress;
          } else if (task.failed) {
            const progressRatio = newProgress / 50;
            currentTop = startTop + (targetTop - startTop) * progressRatio;
            currentLeft = startLeft + (targetLeft - startLeft) * progressRatio;
          } else {
            const progressRatio = newProgress / 100;
            currentTop = startTop + (targetTop - startTop) * progressRatio;
            currentLeft = startLeft + (targetLeft - startLeft) * progressRatio;
          }

          if (newProgress >= 100 && task.progress < 100) {
            if (!task.failed) {
              setIntelligencePoints((prev) => prev + 25);
              setStolenGoods((prev) =>
                prev.map((good) =>
                  good.id === task.artworkId ? { ...good, progress: 100 } : good
                )
              );
            }
          }

          return {
            ...task,
            progress: newProgress,
            currentTop: `${currentTop}%`,
            currentLeft: `${currentLeft}%`,
            isReturning: isReturning,
          };
        }).filter((task) => {
          if (task.progress < 100) return true;
          const completedTime = Date.now() - (task.startTime + task.duration);
          return completedTime < 2000;
        });
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Spawn initial bubble when clock starts for the first time
  useEffect(() => {
    if (isRunning && !hasInitialBubble) {
      const availableArtworks = stolenGoods.filter((good) => good.progress < 100);

      if (availableArtworks.length > 0) {
        const artwork = availableArtworks[0];
        const currentMarkers = markersRef.current;
        const newPosition = getRandomPositionAwayFromMarkers(currentMarkers);

        if (newPosition) {
          const markerId = Date.now();
          const newMarker: Marker = {
            id: markerId,
            top: newPosition.top,
            left: newPosition.left,
            title: artwork.name,
            description: `Lokalizacja: ${artwork.location}. ${artwork.description}`,
            artworkId: artwork.id,
          };
          setMarkers((prev) => [...prev, newMarker]);
          setMarkerCreationTimes((prev) => {
            const newMap = new Map(prev);
            newMap.set(markerId, Date.now());
            return newMap;
          });
          setHasInitialBubble(true);
        }
      }
    }
  }, [isRunning, hasInitialBubble, stolenGoods]);

  // Schedule an event every 90 in-game days to spawn a new marker (3x slower)
  useEffect(() => {
    const id = scheduleEvery(90, () => {
      // Pick a random stolen good that hasn't been fully recovered
      const availableArtworks = stolenGoods.filter((good) => good.progress < 100);

      if (availableArtworks.length === 0) {
        const pool = initialMarkers as { id: number; top: string; left: string; title: string; description: string }[];
        const tpl = pool[Math.floor(Math.random() * pool.length)] || {};
        const currentMarkers = markersRef.current;
        const newPosition = getRandomPositionAwayFromMarkers(currentMarkers);

        if (newPosition) {
          const markerId = Date.now();
          const newMarker: Marker = {
            id: markerId,
            top: newPosition.top,
            left: newPosition.left,
            title: tpl.title ?? `Wydarzenie`,
            description: tpl.description ?? "Nowe zdarzenie wykryte przez siatkę wywiadowczą.",
          };
          setMarkers((prev) => [...prev, newMarker]);
          // Track creation time for 20 second timer
          setMarkerCreationTimes((prev) => {
            const newMap = new Map(prev);
            newMap.set(markerId, Date.now());
            return newMap;
          });
        }
        return;
      }

      const artwork = availableArtworks[Math.floor(Math.random() * availableArtworks.length)];
      const currentMarkers = markersRef.current;
      const newPosition = getRandomPositionAwayFromMarkers(currentMarkers);

      if (newPosition) {
        const markerId = Date.now();
        const newMarker: Marker = {
          id: markerId,
          top: newPosition.top,
          left: newPosition.left,
          title: artwork.name,
          description: `Lokalizacja: ${artwork.location}. ${artwork.description}`,
          artworkId: artwork.id,
        };
        setMarkers((prev) => [...prev, newMarker]);
        // Track creation time for 20 second timer
        setMarkerCreationTimes((prev) => {
          const newMap = new Map(prev);
          newMap.set(markerId, Date.now());
          return newMap;
        });
      }
    });

    return () => cancelScheduled(id);
    // scheduleEvery/cancelScheduled are stable from provider; eslint disabled to avoid frequent reschedule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map */}
<<<<<<< HEAD
      <div className="absolute inset-0 bg-blue-300">
=======
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 bg-blue-300"
        style={{
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
>>>>>>> e129016 (map rework,k a and added museums)
        <Image
          src="/map.svg"
          alt="Mapa operacyjna Europy"
          fill
          className="object-contain pointer-events-none"
          priority
        />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Top Bar */}
      <TopBar />

      {/* Warsaw Storage Marker - smaller, no blinking */}
      <div
        className="absolute z-20 cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          top: WARSAW_STORAGE.top, // 59%
          left: WARSAW_STORAGE.left,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={() => setShowArtGallery(true)}
        title={WARSAW_STORAGE.title}
      >
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <div className="absolute inset-0 bg-amber-800 rounded-full border-2 border-amber-600 shadow-2xl flex items-center justify-center">
            <span className="text-xl sm:text-2xl">🏛️</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar
        acknowledgedMissions={acknowledgedMissions}
        activeAgents={activeAgents}
        retrievalTasks={retrievalTasks}
        stolenGoods={stolenGoods}
        intelligencePoints={intelligencePoints}
        activeAgentIds={activeAgentIds}
        availableAgents={availableAgents}
        skills={skills}
        overallProgress={progress}
        onAddAgent={addNextAgent}
        onLevelUpSkill={levelUpSkill}
        onStartMission={startMission}
        onMissionClick={setSelectedMission}
      />

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            const newZoom = Math.min(3, zoom + 0.2);
            setZoom(newZoom);
            const constrained = constrainPosition(mapPosition.x, mapPosition.y, newZoom);
            setMapPosition(constrained);
          }}
          className="w-10 h-10 bg-white/90 hover:bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors"
          title="Przybliż"
        >
          +
        </button>
        <button
          onClick={() => {
            const newZoom = Math.max(2.0, zoom - 0.2);
            setZoom(newZoom);
            const constrained = constrainPosition(mapPosition.x, mapPosition.y, newZoom);
            setMapPosition(constrained);
          }}
          className="w-10 h-10 bg-white/90 hover:bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors"
          title="Oddal"
        >
          −
        </button>
        <div className="text-xs text-center bg-white/90 rounded px-2 py-1 shadow-lg">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Clickable markers overlay */}
<<<<<<< HEAD
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Example marker positions loaded from JSON */}
=======
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
          <div className="pointer-events-auto">
          {/* Event markers */}
>>>>>>> e129016 (map rework,k a and added museums)
          {markers.map((m) => (
            <MapMarker
              key={m.id}
              id={m.id}
              top={m.top}
              left={m.left}
              onClick={(id) => {
                const found = markers.find((x) => x.id === id) || null;
                if (found && found.id !== WARSAW_STORAGE.id) {
                  // Collect the bubble - gives points and adds to missions
                  collectMarker(found);
                  setSelectedMarker(null); // Close modal immediately
                }
              }}
              title={m.title}
              isAnimating={highlightedMarkerId === m.id}
            />
          ))}

          {/* Museum markers */}
          {(museumsData as Museum[]).map((museum) => (
            <MuseumMarker
              key={museum.id}
              id={museum.id}
              top={museum.top}
              left={museum.left}
              onClick={(id) => {
                const found = (museumsData as Museum[]).find((m) => m.id === id) || null;
                setSelectedMuseum(found);
              }}
            />
          ))}
        </div>
      </div>

      {/* Path Lines from Storage to Mission Points - Only show for active missions */}
      <svg className="absolute inset-0 z-5 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {acknowledgedMissions.map((mission) => {
          const task = retrievalTasks.find(t => t.missionId === mission.id);
          const isActive = task && task.progress < 100;
          // Only show path for active missions
          if (!isActive) return null;

          const startX = parseFloat(WARSAW_STORAGE.left.replace('%', ''));
          const startY = parseFloat(WARSAW_STORAGE.top.replace('%', ''));
          const endX = parseFloat(mission.left.replace('%', ''));
          const endY = parseFloat(mission.top.replace('%', ''));

          return (
            <line
              key={`path-${mission.id}`}
              x1={`${startX}%`}
              y1={`${startY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="rgba(251, 191, 36, 0.6)"
              strokeWidth="3"
              strokeDasharray="6,2"
            />
          );
        })}
      </svg>

      {/* Mission Point Markers on Map - Only show artwork when mission is active */}
      {acknowledgedMissions.map((mission) => {
        const task = retrievalTasks.find(t => t.missionId === mission.id);
        const isActive = task && task.progress < 100;

        // Only show marker when mission is active
        if (!isActive) return null;

        const artwork = mission.artworkId
          ? stolenGoods.find(g => g.id === mission.artworkId)
          : null;
        // Always default to dama.jpg if no artwork image
        let imageSrc = "/dama.jpg";
        if (artwork?.image && artwork.image.trim() !== "") {
          imageSrc = artwork.image;
        }

        return (
          <div
            key={`mission-${mission.id}`}
            className="absolute z-12 pointer-events-none"
            style={{
              top: mission.top,
              left: mission.left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative animate-pulse">
              {/* Show artwork image when mission is active */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-600 shadow-2xl overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={artwork?.name || mission.title || "Dzieło sztuki"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-green-600 animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-green-600"></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Agent Icons on Map (during retrieval) */}
      {retrievalTasks.map((task) => {
        const agent = activeAgents.find((a) => a.id === task.agentId);
        return (
          <div
            key={task.id}
            className="absolute z-15 transition-all duration-100"
            style={{
              top: task.currentTop,
              left: task.currentLeft,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`text-3xl ${task.failed ? 'animate-bounce' : 'animate-pulse'}`}>
              {task.failed ? '😞' : '🚶'}
            </div>
            {task.progress >= 50 && task.failed && !task.isReturning && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-red-800/90 text-red-50 px-2 py-1 rounded whitespace-nowrap">
                ❌ Misja Nieudana
              </div>
            )}
            {task.progress >= 100 && task.failed && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-amber-800/90 text-amber-50 px-2 py-1 rounded whitespace-nowrap">
                Powrót do Bazy
              </div>
            )}
            {task.progress >= 100 && !task.failed && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-green-800/90 text-green-50 px-2 py-1 rounded whitespace-nowrap">
                ✓ Odzyskano
              </div>
            )}
          </div>
        );
      })}

      {/* Event Info Modal - removed, markers are collected immediately on click */}

      {/* Art Gallery Modal */}
      {showArtGallery && (
        <ArtGalleryModal
          stolenGoods={stolenGoods}
          onClose={() => setShowArtGallery(false)}
        />
      )}

<<<<<<< HEAD
=======
<<<<<<< HEAD
      {/* Start Clock Modal */}
      {showStartClockModal && !isRunning && (
        <StartClockModal onClose={() => setShowStartClockModal(false)} />
      )}
>>>>>>> 352936a (map rework,k a and added museums)

      {/* Mission Detail Modal */}
      {selectedMission && (() => {
        const task = retrievalTasks.find(t => t.missionId === selectedMission.id) || null;
        const agent = task ? activeAgents.find(a => a.id === task.agentId) || null : null;
        const artwork = selectedMission.artworkId
          ? stolenGoods.find(g => g.id === selectedMission.artworkId) || null
          : null;
        const busyAgentIds = retrievalTasks.filter(t => t.progress < 100).map(t => t.agentId);
        const availableAgentsForMission = activeAgents.filter(a => !busyAgentIds.includes(a.id));
        const canStart = availableAgentsForMission.length > 0 && !task;

        return (
          <MissionDetailModal
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
            retrievalTask={task}
            agent={agent}
            artwork={artwork}
            onStartMission={startMission}
            availableAgents={availableAgentsForMission}
            canStart={canStart}
          />
        );
      })()}
=======
      {/* Museum Modal */}
      {selectedMuseum != null && (
        <MuseumModal
          museum={selectedMuseum}
          paintings={[]} // TODO: Add paintings state management
          onClose={() => setSelectedMuseum(null)}
        />
      )}
>>>>>>> e129016 (map rework,k a and added museums)
    </div>
  );
}
