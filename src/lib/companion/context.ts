import type { CompanionNeed } from './types';

export type CompanionMood =
  | 'Feral'
  | 'Thriving'
  | 'Doing okay'
  | 'Running on fumes'
  | 'Emotionally weathered';

export type CompanionTimeOfDay =
  | 'morning'
  | 'afternoon'
  | 'evening';

export interface CompanionContext {
  mood?: CompanionMood;
  symptoms: string[];
  cycleDay?: number;
  phase?: string;
  bodyLoad: number;
  victories: string[];
  difficultDaysInRow: number;
  thrivingDaysInRow: number;
  timeOfDay?: CompanionTimeOfDay;
  need?: CompanionNeed;
  yesterdayMood?: string | null;

yesterdaySymptoms?: string[];

yesterdayFlow?: string | null;

checkInStreak?: number;
}

export function buildCompanionContext(
  context: CompanionContext,
): CompanionContext {
  return context;
}