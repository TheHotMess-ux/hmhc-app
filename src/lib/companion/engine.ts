import { decideBehavior } from './brain';
import type { CompanionContext } from './context';
import {
  getCompanionObservation,
  type CompanionObservation,
} from './noticing';
import type { Whisper } from './types';

import { celebrationWhispers } from './whispers/celebration';
import { encouragementWhispers } from './whispers/encouragement';
import { feralWhispers } from './whispers/feral';
import { humorWhispers } from './whispers/humor';
import { reflectionWhispers } from './whispers/reflection';
import { validationWhispers } from './whispers/validation';

const whisperLibraries = {
  validation: validationWhispers,
  humor: humorWhispers,
  feral: feralWhispers,
  celebration: celebrationWhispers,
  encouragement: encouragementWhispers,
  reflection: reflectionWhispers,
};

function getDayNumber(date: Date): number {
  const startOfYear = new Date(
    date.getFullYear(),
    0,
    0,
  );

  const difference =
    date.getTime() - startOfYear.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24),
  );
}

function getDailyMessage(
  library: Whisper[],
  date: Date,
): Whisper {
  const dayNumber = getDayNumber(date);
  const index = dayNumber % library.length;

  return library[index];
}

export function getDailyWhisper(
  date = new Date(),
): Whisper {
  return getDailyMessage(
    validationWhispers,
    date,
  );
}

export function getCompanionMoment(
  context: CompanionContext,
  date = new Date(),
): Whisper {
  const behavior = decideBehavior(context);
  const library = whisperLibraries[behavior];

  return getDailyMessage(library, date);
}

export type CompanionExperience = {
  whisper: Whisper;
  observation: CompanionObservation | null;
};

export function getCompanionExperience(
  context: CompanionContext,
  date = new Date(),
): CompanionExperience {
  return {
    observation:
      getCompanionObservation(context),

    whisper:
      getCompanionMoment(context, date),
  };
}