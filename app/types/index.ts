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

