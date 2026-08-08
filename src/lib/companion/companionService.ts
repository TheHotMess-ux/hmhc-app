import {
  getCompanionExperience,
  getCompanionMoment,
} from './engine';

import type {
  CompanionContext,
} from './context';

import type {
  CompanionExperience,
} from './engine';

import type {
  Whisper,
} from './types';

export function getTodaysCompanionMoment(
  context: CompanionContext,
): Whisper {
  return getCompanionMoment(context);
}

export function getTodaysCompanionExperience(
  context: CompanionContext,
): CompanionExperience {
  return getCompanionExperience(context);
}