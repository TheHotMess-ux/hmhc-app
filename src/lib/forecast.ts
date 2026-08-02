import { getCyclePhase } from "./cycle";
import { missions } from "./missions";
import { survivalStrategies } from "./survivalStrategies";
import { whispers } from "./whispers";

type CyclePhaseName =
  | "Menstrual"
  | "Follicular"
  | "Ovulation"
  | "Luteal";

export type FeralForecast = {
  hormoneActivity: string;
  brainFogForecast: string;
  coffeeForecast: string;
  patienceForecast: string;
  cravingProbability: string;
  mission: string;
  survivalStrategy: string[];
  whisper: string;
};

function getDailyItem<T>(
  items: T[],
  seed: number,
): T {
  if (items.length === 0) {
    throw new Error("Cannot select from an empty array.");
  }

  return items[seed % items.length];
}

export function getFeralForecast(
  cycleDay: number,
): FeralForecast {
  const phase = getCyclePhase(cycleDay);
const phaseName = phase.phase;

const today = new Date();

const daySeed =
  today.getFullYear() * 1000 +
  today.getMonth() * 100 +
  today.getDate();

  const sharedContent = {
    mission: getDailyItem(missions[phaseName], daySeed),
    survivalStrategy: survivalStrategies[phaseName],
    whisper: getDailyItem(whispers[phaseName], daySeed + 7),
  };

  switch (phaseName) {
    case "Menstrual":
      return {
        hormoneActivity: "Rebuilding",
        brainFogForecast: "Moderate",
        coffeeForecast: "Elevated ☕",
        patienceForecast: "Protect your peace.",
        cravingProbability: "Medium",
        ...sharedContent,
      };

    case "Follicular":
      return {
        hormoneActivity: "Warming up ☀️",
        brainFogForecast: "Low",
        coffeeForecast: "Optional",
        patienceForecast: "Looking good.",
        cravingProbability: "Low",
        ...sharedContent,
      };

    case "Ovulation":
      return {
        hormoneActivity: "Main character energy ✨",
        brainFogForecast: "Minimal",
        coffeeForecast: "Dealer’s choice.",
        patienceForecast: "Remarkably stable.",
        cravingProbability: "Low",
        ...sharedContent,
      };

    case "Luteal":
    default:
      return {
        hormoneActivity: "Spicy 🌶️",
        brainFogForecast: "Moderate",
        coffeeForecast: "Critical ☕☕",
        patienceForecast: "Proceed with caution.",
        cravingProbability: "Suspiciously high 🍫",
        ...sharedContent,
      };
  }
}