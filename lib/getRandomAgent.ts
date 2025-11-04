import agents from "../data/agents.json";

export type Agent = {
  id: number;
  name: string;
  photo?: string;
  location?: string;
  status?: string;
  specialization?: string;
};

/**
 * Return a random agent from the project's `data/agents.json`.
 * Throws an Error if the list is empty or not an array.
 */
export function getRandomAgent(): Agent {
  if (!Array.isArray(agents) || agents.length === 0) {
    throw new Error("No agents available");
  }

  const idx = Math.floor(Math.random() * agents.length);
  return agents[idx] as Agent;
}

export default getRandomAgent;
