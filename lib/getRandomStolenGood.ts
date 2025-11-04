import stolenGoods from "../data/stolen-goods.json";

export type StolenGood = {
  id: number;
  name: string;
  artist?: string;
  year?: string;
  description?: string;
  image?: string;
  progress?: number;
  estimatedTime?: string;
  location?: string;
};

/**
 * Return a random stolen good from the project's `data/stolen-goods.json`.
 * Throws an Error if the list is empty or not an array.
 */
export function getRandomStolenGood(): StolenGood {
  if (!Array.isArray(stolenGoods) || stolenGoods.length === 0) {
    throw new Error("No stolen goods available");
  }

  const idx = Math.floor(Math.random() * stolenGoods.length);
  // JSON import is typed as `any` so cast to StolenGood
  return stolenGoods[idx] as StolenGood;
}

export default getRandomStolenGood;
