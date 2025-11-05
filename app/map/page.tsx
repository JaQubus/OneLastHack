"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import stolenGoodsData from "../data/stolen-goods.json";
import initialMarkers from "../data/map-markers.json";
import agentsData from "../data/agents.json";
import skillsData from "../data/skills.json";
import locationsData from "../data/locations.json";
// start with no pre-existing markers; markers will be spawned by the game time
import EventModal from "../components/EventModal";
import MapMarker from "../components/MapMarker";
import { placeRandomMarker, clampMarkerPosition, getRandomPositionAwayFromMarkers } from "../../lib/placeRandomMarker";
import { useGameTime } from "../components/GameTimeProvider";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import ToastContainer, { ToastType } from "../components/Toast";
import ArtGalleryModal from "../components/ArtGalleryModal";
import MissionDetailModal from "../components/MissionDetailModal";
import StartClockModal from "../components/StartClockModal";
import LocationModal from "../components/LocationModal";
import type { StolenGood, Agent, Skill, AcknowledgedMission, RetrievalTask } from "../types";

type Marker = {
  id: number;
  top: string;
  left: string;
  title?: string;
  description?: string;
  artworkId?: number;
};

interface Location {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
}

const RECOVERED_ARTWORKS_KEY = "recoveredArtworks";

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [intelligencePoints, setIntelligencePoints] = useState(50);
  const [progress, setProgress] = useState(0);
  const [skills, setSkills] = useState<Skill[]>(skillsData as Skill[]);
  const [highlightedMarkerId, setHighlightedMarkerId] = useState<number | null>(null);
  const [acknowledgedMissions, setAcknowledgedMissions] = useState<AcknowledgedMission[]>([]);
  const [retrievalTasks, setRetrievalTasks] = useState<RetrievalTask[]>([]);
  // Track artworks recovered in current session (not from localStorage)
  const [recoveredInSession, setRecoveredInSession] = useState<Set<number>>(new Set());
  const [stolenGoods, setStolenGoods] = useState<StolenGood[]>(() => {
    // Don't load from localStorage on mount - start fresh for each session
    return stolenGoodsData as StolenGood[];
  });
  const [showArtGallery, setShowArtGallery] = useState(false);
  const [selectedMission, setSelectedMission] = useState<AcknowledgedMission | null>(null);
  const [hasInitialBubble, setHasInitialBubble] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [showStartClockModal, setShowStartClockModal] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Memoized function to remove toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Reset timer when map page loads
  const toastIdCounterRef = useRef(0);

  // Reset timer when map page loads (but don't start it)
  useEffect(() => {
    // Reset game time to start date
    reset();
  }, []); // Empty deps - only run on mount

  // State for active agents in slots (start with random agent)
  const [activeAgentIds, setActiveAgentIds] = useState<number[]>(() => {
    // Pick a random agent to start with
    const randomIndex = Math.floor(Math.random() * agentsData.length);
    const randomAgent = agentsData[randomIndex];
    return [randomAgent.id];
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

  // Map dimensions from SVG
  const SVG_WIDTH = 1646;
  const SVG_HEIGHT = 1447;

  // State to store adjusted positions for object-cover
  const [mapScale, setMapScale] = useState({ scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 });

  // Calculate map scale and offset for object-cover
  useEffect(() => {
    const updateMapScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const svgRatio = SVG_WIDTH / SVG_HEIGHT;
      const viewportRatio = viewportWidth / viewportHeight;

      let scale, offsetX = 0, offsetY = 0;

      if (viewportRatio > svgRatio) {
        // Viewport is wider - scale by width, crop top/bottom
        scale = viewportWidth / SVG_WIDTH;
        const scaledHeight = SVG_HEIGHT * scale;
        offsetY = (scaledHeight - viewportHeight) / 2 / scaledHeight * 100;
      } else {
        // Viewport is taller - scale by height, crop left/right
        scale = viewportHeight / SVG_HEIGHT;
        const scaledWidth = SVG_WIDTH * scale;
        offsetX = (scaledWidth - viewportWidth) / 2 / scaledWidth * 100;
      }

      setMapScale({ scaleX: scale, scaleY: scale, offsetX, offsetY });
    };

    updateMapScale();
    window.addEventListener('resize', updateMapScale);
    return () => window.removeEventListener('resize', updateMapScale);
  }, []);

  // Function to convert SVG coordinates to viewport percentages with object-cover
  const svgToViewport = (svgX: number, svgY: number) => {
    if (typeof window === 'undefined') {
      // SSR fallback - return default percentages
      return { top: '50%', left: '50%' };
    }
    const viewportRatio = window.innerWidth / window.innerHeight;
    const svgRatio = SVG_WIDTH / SVG_HEIGHT;

    if (viewportRatio > svgRatio) {
      // Viewport is wider - scale by width, crop top/bottom
      const scale = window.innerWidth / SVG_WIDTH;
      const scaledHeight = SVG_HEIGHT * scale;
      const offsetY = (scaledHeight - window.innerHeight) / 2;

      const left = (svgX / SVG_WIDTH) * 100;
      const top = ((svgY * scale - offsetY) / window.innerHeight) * 100;

      return { top: `${top.toFixed(2)}%`, left: `${left.toFixed(2)}%` };
    } else {
      // Viewport is taller - scale by height, crop left/right
      const scale = window.innerHeight / SVG_HEIGHT;
      const scaledWidth = SVG_WIDTH * scale;
      const offsetX = (scaledWidth - window.innerWidth) / 2;

      const top = (svgY / SVG_HEIGHT) * 100;
      const left = ((svgX * scale - offsetX) / window.innerWidth) * 100;

      return { top: `${top.toFixed(2)}%`, left: `${left.toFixed(2)}%` };
    }
  };

  // Spawn locations with their SVG coordinates (raw from map.svg)
  const SPAWN_LOCATIONS_RAW = [
    { name: 'Berlin', x: 647.38879 + 4.2229729 / 2, y: 794.15015 + 11.975099 / 2 },
    { name: 'Moskwa', x: 1170.4689 + 19.241098 / 2, y: 544.43744 + 15.148209 / 2 },
    { name: 'Führermuseum', x: 687.17358 + 5.841177 / 2, y: 955.79181 + 5.9414663 / 2 },
    { name: 'Altaussee', x: 600.20392 + 8.0817862 / 2, y: 989.81628 + 3.9278119 / 2 },
    { name: 'Merkers', x: 589.38519 + 9.9166393 / 2, y: 847.62286 + 8.7934942 / 2 },
    // { name: 'Neuschwanstein', x: 610.38757 + 13.836784 / 2, y: 968.58258 + 6.2316003 / 2 },
  ];

  // Convert to viewport coordinates (use state to avoid SSR issues)
  const [spawnLocations, setSpawnLocations] = useState<Array<{ name: string; top: string; left: string }>>([]);

  useEffect(() => {
    // Convert to viewport coordinates on client side only
    const locations = SPAWN_LOCATIONS_RAW.map(loc => ({
      name: loc.name,
      ...svgToViewport(loc.x, loc.y)
    }));
    setSpawnLocations(locations);
  }, []);

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

  // Function to add next available agent (random, no duplicates)
  const addNextAgent = () => {
    const agentCost = 15;
    if (activeAgentIds.length < 4 && availableAgents.length > 0 && intelligencePoints >= agentCost) {
      // Pick a random agent from available agents
      const randomIndex = Math.floor(Math.random() * availableAgents.length);
      const nextAgent = availableAgents[randomIndex];
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

  // Track marker creation time for 20 second auto-removal (in game time seconds)
  const [markerCreationTimes, setMarkerCreationTimes] = useState<Map<number, number>>(new Map());
  const gameStartTimeRef = useRef<number | null>(null); // Game time in seconds when game started
  const gameTimeSecondsRef = useRef<number>(0); // Current game time in seconds
  const [usedArtworkIds, setUsedArtworkIds] = useState<Set<number>>(new Set());

  // Start with empty markers - will be populated on client side
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const markersRef = useRef<Marker[]>(markers);
  const acknowledgedMissionsRef = useRef<AcknowledgedMission[]>([]);
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);
  useEffect(() => {
    acknowledgedMissionsRef.current = acknowledgedMissions;
  }, [acknowledgedMissions]);

  // Initialize with one bubble at game start (client-side only to avoid hydration mismatch)
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      // Use stolenGoods from state (not stolenGoodsData) to respect current session state
      const availableArtworks = stolenGoods.filter((good) => good.progress < 100 && !usedArtworkIds.has(good.id));
      if (availableArtworks.length > 0) {
        // Pick a random artwork for initial bubble
        const randomIndex = Math.floor(Math.random() * availableArtworks.length);
        const artwork = availableArtworks[randomIndex];
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
            newMap.set(initialMarkerId, gameTimeSecondsRef.current);
            return newMap;
          });
          setUsedArtworkIds((prev) => new Set(prev).add(artwork.id));
          setHasInitialBubble(true);
        }
      }
      setIsInitialized(true);
    }
  }, [isInitialized, stolenGoods, usedArtworkIds]);

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

  // Track game time in seconds (only when game is running)
  useEffect(() => {
    if (!isRunning) {
      return; // Don't count time when game is paused
    }

    // Initialize game start time on first run
    if (gameStartTimeRef.current === null) {
      gameStartTimeRef.current = gameTimeSecondsRef.current;
    }

    const interval = setInterval(() => {
      gameTimeSecondsRef.current += 1; // Increment game time by 1 second
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-remove markers after 20 seconds (in game time)
  useEffect(() => {
    if (!isRunning) {
      return; // Don't check timers when game is paused
    }

    const interval = setInterval(() => {
      const currentGameTime = gameTimeSecondsRef.current;
      setMarkers((prev) => {
        const removedMarkers: Marker[] = [];
        const filtered = prev.filter((m) => {
          if (m.id === WARSAW_STORAGE.id) return true; // Keep storage
          const createdAt = markerCreationTimes.get(m.id);
          if (!createdAt) return true; // Keep if no timestamp
          const shouldKeep = currentGameTime - createdAt < 20; // Remove after 20 seconds of game time
          if (!shouldKeep) {
            // Check if marker was collected (has corresponding mission) - use ref for stable reference
            const wasCollected = acknowledgedMissionsRef.current.some(mission => mission.markerId === m.id);
            if (!wasCollected) {
              removedMarkers.push(m); // Track uncollected markers
            }
          }
          return shouldKeep;
        });

        // Increase progress by 0.5% for each uncollected marker that expired
        if (removedMarkers.length > 0) {
          setProgress((prev) => {
            const increase = removedMarkers.length * 0.5;
            return Math.min(100, prev + increase);
          });
        }

        return filtered;
      });
      // Clean up old timestamps
      setMarkerCreationTimes((prev) => {
        const newMap = new Map(prev);
        prev.forEach((createdAt, id) => {
          if (currentGameTime - createdAt >= 20) {
            newMap.delete(id);
          }
        });
        return newMap;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [markerCreationTimes, isRunning]);

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
      duration: Math.floor(45000 + Math.random() * 30000), // Random 45-75 seconds (1.5x faster, but randomized)
      progress: 0,
      targetTop: mission.top,
      targetLeft: mission.left,
      currentTop: `${WARSAW_START_TOP}%`,
      currentLeft: `${WARSAW_START_LEFT}%`,
      failed: willFail,
      failureChance: failureChance,
      isReturning: false,
      pausedAt: undefined,
      accumulatedPausedTime: 0,
    };

    setRetrievalTasks((prev) => [...prev, newTask]);
  };

  // Collect marker when clicked - gives intelligence points and adds to missions
  const collectMarker = (marker: Marker) => {
    // Check if already collected
    if (acknowledgedMissions.some(m => m.markerId === marker.id)) {
      return;
    }

    // Check if artwork is already recovered
    if (marker.artworkId) {
      const artwork = stolenGoods.find(g => g.id === marker.artworkId);
      if (artwork && artwork.progress === 100) {
        // Delay removal to allow animation to play
        setTimeout(() => {
          setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
          setMarkerCreationTimes((prev) => {
            const newMap = new Map(prev);
            newMap.delete(marker.id);
            return newMap;
          });
        }, 800); // Wait for animation to complete
        return;
      }
    }

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
    toastIdCounterRef.current += 1;
    const toastId = `toast-${Date.now()}-${toastIdCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        title: "Nowa Misja!",
        message: newMission.title,
        duration: 5000,
      },
    ]);

    // Delay removal to allow pop animation to complete (800ms)
    setTimeout(() => {
      setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
      setMarkerCreationTimes((prev) => {
        const newMap = new Map(prev);
        newMap.delete(marker.id);
        return newMap;
      });
    }, 800);
  };

  // Track pause/resume state for tasks
  useEffect(() => {
    setRetrievalTasks((prev) => {
      const now = Date.now();
      return prev.map((task) => {
        if (!isRunning) {
          // Game paused - mark pause time if not already paused
          if (!task.pausedAt) {
            return {
              ...task,
              pausedAt: now,
            };
          }
          // Already paused, return unchanged
          return task;
        } else {
          // Game running - resume if was paused
          if (task.pausedAt) {
            const pauseDuration = now - task.pausedAt;
            const newAccumulatedPausedTime = (task.accumulatedPausedTime || 0) + pauseDuration;
            return {
              ...task,
              pausedAt: undefined,
              accumulatedPausedTime: newAccumulatedPausedTime,
            };
          }
          // Already running, return unchanged
          return task;
        }
      });
    });
  }, [isRunning]);

  // Update retrieval tasks progress and agent position in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't update progress when game time is paused
      if (!isRunning) {
        return;
      }

      setRetrievalTasks((prev) => {
        const now = Date.now();
        return prev.map((task) => {
          // Calculate elapsed time accounting for paused time
          const accumulatedPaused = task.accumulatedPausedTime || 0;
          const elapsed = (now - task.startTime) - accumulatedPaused;
          const newProgress = Math.min(100, (elapsed / task.duration) * 100);

          let currentTop: number;
          let currentLeft: number;
          const startTop = WARSAW_START_TOP; // Warsaw storage
          const startLeft = WARSAW_START_LEFT;
          const targetTop = parseFloat(task.targetTop.replace('%', ''));
          const targetLeft = parseFloat(task.targetLeft.replace('%', ''));

          let isReturning = task.isReturning || false;

          // Simple linear movement: A to B (0-50%), then B to A (50-100%)
          // This applies to both successful and failed missions
          if (newProgress <= 50) {
            // Going from A (start/Warsaw) to B (target/mission location) - pure linear interpolation
            const t = newProgress / 50;
            currentTop = startTop + (targetTop - startTop) * t;
            currentLeft = startLeft + (targetLeft - startLeft) * t;
          } else {
            // Returning from B (target/mission location) to A (start/Warsaw) - pure linear interpolation
            isReturning = true;
            const t = (newProgress - 50) / 50;
            currentTop = targetTop + (startTop - targetTop) * t;
            currentLeft = targetLeft + (startLeft - targetLeft) * t;
          }

          // Check if mission just completed
          if (newProgress >= 100 && task.progress < 100) {
            if (!task.failed) {
              // Success - show green toast, remove mission, award points
              const artwork = stolenGoods.find(g => g.id === task.artworkId);
              const agent = activeAgents.find(a => a.id === task.agentId);
              toastIdCounterRef.current += 1;
              const toastId = `toast-success-${Date.now()}-${toastIdCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
              setToasts((prev) => {
                // Prevent duplicate toasts for the same mission
                if (prev.some(t => t.id.startsWith(`toast-success-`) && t.message.includes(artwork?.name || 'Dzieło'))) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    id: toastId,
                    title: "✅ Misja Zakończona Sukcesem!",
                    message: artwork && agent
                      ? `Agent ${agent.name} odzyskał "${artwork.name}"!`
                      : artwork
                        ? `Dzieło "${artwork.name}" zostało odzyskane!`
                        : "Dzieło sztuki zostało odzyskane!",
                    duration: 5000,
                    type: 'success' as const,
                  },
                ];
              });
              // Remove mission from acknowledged missions
              setAcknowledgedMissions((prev) => prev.filter(m => m.id !== task.missionId));
              // Award intelligence points
              setIntelligencePoints((prev) => prev + 25);
              // Mark artwork as recovered
              setStolenGoods((prev) =>
                prev.map((good) =>
                  good.id === task.artworkId ? { ...good, progress: 100 } : good
                )
              );
              // Track artwork as recovered in current session
              setRecoveredInSession((prev) => new Set(prev).add(task.artworkId));
              // Decrease overall progress by 3% when mission succeeds (or reset to 0 if < 3%)
              setProgress((prev) => {
                const newProgress = prev >= 3 ? prev - 3 : 0;
                return Math.max(0, newProgress);
              });
              // Save recovered artwork to localStorage
              if (typeof window !== "undefined") {
                try {
                  const stored = localStorage.getItem(RECOVERED_ARTWORKS_KEY);
                  let recoveredIds: number[] = [];
                  if (stored) {
                    try {
                      recoveredIds = JSON.parse(stored) as number[];
                      // Validate that it's actually an array
                      if (!Array.isArray(recoveredIds)) {
                        recoveredIds = [];
                      }
                    } catch (parseError) {
                      // If parse fails, clear corrupted data and start fresh
                      console.warn("Corrupted localStorage data, clearing:", parseError);
                      localStorage.removeItem(RECOVERED_ARTWORKS_KEY);
                      recoveredIds = [];
                    }
                  }
                  if (!recoveredIds.includes(task.artworkId)) {
                    recoveredIds.push(task.artworkId);
                    localStorage.setItem(RECOVERED_ARTWORKS_KEY, JSON.stringify(recoveredIds));
                  }
                } catch (e) {
                  console.error("Failed to save recovered artwork:", e);
                }
              }
            } else {
              // Failure - show red toast
              const artwork = stolenGoods.find(g => g.id === task.artworkId);
              const agent = activeAgents.find(a => a.id === task.agentId);
              toastIdCounterRef.current += 1;
              const toastId = `toast-error-${Date.now()}-${toastIdCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
              setToasts((prev) => {
                // Prevent duplicate toasts for the same mission
                if (prev.some(t => t.id.startsWith(`toast-error-`) && t.message.includes(artwork?.name || 'Dzieło'))) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    id: toastId,
                    title: "❌ Misja Nieudana",
                    message: artwork && agent
                      ? `Agent ${agent.name} nie zdołał odzyskać "${artwork.name}". Agent wraca do bazy.`
                      : agent
                        ? `Agent ${agent.name} nie zdołał ukończyć misji. Agent wraca do bazy.`
                        : "Misja nie powiodła się. Agent wraca do bazy.",
                    duration: 5000,
                    type: 'error' as const,
                  },
                ];
              });
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
          // Keep tasks that are in progress
          if (task.progress < 100) return true;
          // For completed tasks, keep them visible briefly
          const completedTime = Date.now() - (task.startTime + task.duration);
          // Keep successful missions longer so artwork can be seen following agent home
          if (!task.failed) {
            return completedTime < 3000; // Keep successful missions visible for 3 seconds
          }
          return completedTime < 2000; // Keep failed missions for 2 seconds
        });
      });
    }, 100);
    return () => clearInterval(interval);
  }, [stolenGoods, activeAgents, isRunning]);

  // Spawn initial bubble when clock starts for the first time (only if not already spawned on mount)
  useEffect(() => {
    if (isRunning && !hasInitialBubble && isInitialized) {
      // Check if we already have a marker (from initial spawn)
      if (markers.length > 0) {
        setHasInitialBubble(true);
        return;
      }

      const availableArtworks = stolenGoods.filter((good) => good.progress < 100 && !usedArtworkIds.has(good.id));

      if (availableArtworks.length > 0) {
        // Pick a random artwork for initial bubble
        const randomIndex = Math.floor(Math.random() * availableArtworks.length);
        const artwork = availableArtworks[randomIndex];
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
            newMap.set(markerId, gameTimeSecondsRef.current);
            return newMap;
          });
          setUsedArtworkIds((prev) => new Set(prev).add(artwork.id));
          setHasInitialBubble(true);
        }
      }
    }
  }, [isRunning, hasInitialBubble, stolenGoods, usedArtworkIds, isInitialized, markers.length]);

  // Schedule an event every 90 in-game days to spawn a new marker (3x slower)
  useEffect(() => {
    const id = scheduleEvery(90, () => {
      // Pick a random stolen good that hasn't been fully recovered and hasn't been used yet
      const availableArtworks = stolenGoods.filter((good) => good.progress < 100 && !usedArtworkIds.has(good.id));

      if (availableArtworks.length === 0) {
        // If all artworks are used or recovered, reset used artworks and continue
        setUsedArtworkIds(new Set());
        const resetAvailableArtworks = stolenGoods.filter((good) => good.progress < 100);
        if (resetAvailableArtworks.length === 0) {
          // No artworks available at all
          return;
        }
        const artwork = resetAvailableArtworks[Math.floor(Math.random() * resetAvailableArtworks.length)];
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
            newMap.set(markerId, gameTimeSecondsRef.current);
            return newMap;
          });
          setUsedArtworkIds((prev) => new Set(prev).add(artwork.id));
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
        // Track creation time for 20 second timer (in game time)
        setMarkerCreationTimes((prev) => {
          const newMap = new Map(prev);
          newMap.set(markerId, gameTimeSecondsRef.current);
          return newMap;
        });
        setUsedArtworkIds((prev) => new Set(prev).add(artwork.id));
      }
    });

    return () => cancelScheduled(id);
    // scheduleEvery/cancelScheduled are stable from provider; eslint disabled to avoid frequent reschedule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usedArtworkIds]);


  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map - Lowest z-index */}
      <div className="absolute inset-0 bg-blue-300 z-0">
        <Image
          src="/map-new.svg"
          alt="Mapa operacyjna Europy"
          fill
          className="object-cover pointer-events-none"
          priority
        />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />

      {/* Top Bar */}
      <TopBar />

      {/* Warsaw Storage Marker - smaller, no blinking */}
      <div
        className="absolute z-25 cursor-pointer transition-all duration-300"
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

      {/* Spawn Location Markers - Third priority (below agents and bubbles) */}
      {spawnLocations.map((location) => (
        <div
          key={location.name}
          className="absolute z-20 pointer-events-none"
          style={{
            top: location.top,
            left: location.left,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Location Pin */}
            <div className="w-3 h-3 bg-red-600 rounded-full border border-red-800 shadow-lg"></div>
            {/* Location Name */}
            <div className="mt-1 text-white text-base font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap">
              {location.name}
            </div>
          </div>
        </div>
      ))}

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

      {/* Clickable markers overlay - Highest priority (bubbles) */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Example marker positions loaded from JSON */}
          {markers.map((m) => {
            const artwork = m.artworkId ? stolenGoods.find(g => g.id === m.artworkId) : null;
            const imageSrc = artwork?.image && artwork.image.trim() !== "" ? artwork.image : "/dama.jpg";

            return (
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
                imageSrc={imageSrc}
              />
            );
          })}
        </div>
      </div>

      {/* Path Lines from Storage to Mission Points - Only show for active missions */}
      <svg className="absolute inset-0 z-10 pointer-events-none" style={{ width: '100%', height: '100%' }}>
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

      {/* Mission Point Markers on Map - Only show artwork when mission is active and agent hasn't retrieved it yet */}
      {acknowledgedMissions.map((mission) => {
        const task = retrievalTasks.find(t => t.missionId === mission.id);
        const isActive = task && task.progress < 100;

        // Only show marker when mission is active AND agent hasn't retrieved the artwork yet
        // Hide the mission point marker when agent is returning with artwork (after 50% for successful missions)
        const isReturningWithArtwork = task && !task.failed && task.progress >= 50 && task.isReturning;

        if (!isActive || isReturningWithArtwork) return null;

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
            className="absolute z-35 pointer-events-none"
            style={{
              top: mission.top,
              left: mission.left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              {/* Show artwork image when mission is active and agent is going to get it */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-600 shadow-2xl overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={artwork?.name || mission.title || "Dzieło sztuki"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Agent Icons on Map (during retrieval) - Second priority (below bubbles) */}
      {retrievalTasks.map((task) => {
        const agent = activeAgents.find((a) => a.id === task.agentId);
        const artwork = task.artworkId ? stolenGoods.find(g => g.id === task.artworkId) : null;
        // Show artwork following agent when returning home after successful retrieval (after 50% progress)
        const isReturningWithArtwork = !task.failed && task.progress >= 50 && task.isReturning;
        const imageSrc = artwork?.image && artwork.image.trim() !== "" ? artwork.image : "/dama.jpg";
        const agentImageSrc = agentsData.find(a => a.id === task.agentId)?.photo || "/officers/witold-pilecki.png";

        return (
          <div
            key={task.id}
            className="absolute z-30 transition-all duration-100"
            style={{
              top: task.currentTop,
              left: task.currentLeft,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <div className="relative w-12 h-12 rounded-full flex-shrink-0 border-2 border-amber-700/50 overflow-hidden">
                <Image
                  src={agentImageSrc}
                  alt={"🚶"}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Show artwork following agent after successful retrieval */}
              {isReturningWithArtwork && (
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 z-31"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-green-600 shadow-xl overflow-hidden bg-green-100">
                    <Image
                      src={imageSrc}
                      alt={artwork?.name || "Odzyskane dzieło"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-green-600"></div>
                  </div>
                </div>
              )}
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
            {isReturningWithArtwork && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-green-800/90 text-green-50 px-2 py-1 rounded whitespace-nowrap">
                ✓ Odzyskano
              </div>
            )}
          </div>
        );
      })}

      {/* Event Info Modal - removed, markers are collected immediately on click */}

      {/* Art Gallery Modal - Show only artworks recovered in current session */}
      {showArtGallery && (
        <ArtGalleryModal
          stolenGoods={stolenGoods.filter((good) => recoveredInSession.has(good.id))}
          onClose={() => setShowArtGallery(false)}
        />
      )}

      {/* Location Info Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {/* Start Clock Modal */}
      {showStartClockModal && !isRunning && (
        <StartClockModal onClose={() => setShowStartClockModal(false)} />
      )}

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
    </div>
  );
}
