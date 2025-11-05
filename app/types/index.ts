export type StolenGood = {
  id: number;
  name: string;
  artist: string;
  year: string;
  description: string;
  image: string;
  progress: number;
  estimatedTime: string;
  location: string;
};

export type Agent = {
  id: number;
  name: string;
  photo: string;

};

export type Skill = {
  id: number;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  unlocked: boolean;
  description: string;
};

export type AcknowledgedMission = {
  id: number;
  markerId: number;
  title: string;
  description: string;
  top: string;
  left: string;
  artworkId?: number;
  acknowledgedAt: number;
};

export type RetrievalTask = {
  id: number;
  missionId: number;
  agentId: number;
  artworkId: number;
  startTime: number;
  duration: number; // in milliseconds
  progress: number; // 0-100
  targetTop: string;
  targetLeft: string;
  currentTop: string;
  currentLeft: string;
  failed?: boolean;
  failureChance: number;
  isReturning?: boolean;
};

