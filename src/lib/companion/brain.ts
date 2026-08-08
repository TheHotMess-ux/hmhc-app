/**
 * The Companion Brain
 *
 * This file doesn't decide what the app says.
 *
 * It decides what she needs.
 *
 * Validate before educating.
 * Comfort before coaching.
 * Celebrate without comparison.
 * Reduce mental load whenever possible.
 */

/**
 * Muse never assumes.
 *
 * She notices.
 * She remembers.
 * She encourages.
 *
 * She speaks with curiosity,
 * never certainty.
 */

import type { CompanionContext } from './context';

export type CompanionBehavior =
  | 'validation'
  | 'humor'
  | 'feral'
  | 'celebration'
  | 'encouragement'
  | 'reflection';

export function decideBehavior(
  context: CompanionContext,
): CompanionBehavior {
  // High body load always deserves kindness first.
  if (context.bodyLoad >= 8) {
    return 'validation';
  }

  // Several difficult days in a row?
  if (context.difficultDaysInRow >= 3) {
    return 'validation';
}

  // Big emotions deserve a little humour and permission.
  if (
    context.mood === 'Feral' ||
    context.mood === 'Running on fumes'
  ) {
    return 'feral';
  }

  // Celebrate consistency.
  if (context.thrivingDaysInRow >= 3) {
    return 'celebration';
  }

// Evenings invite reflection when nothing more urgent
// is asking for validation or support.
if (context.timeOfDay === 'evening') {
  return 'reflection';
}

if (
  context.yesterdayMood === "😩 Running on fumes"
) {
  return "encouragement";
}

if (
  context.yesterdaySymptoms?.length &&
  context.yesterdaySymptoms.length >= 4
) {
  return "validation";
}
  // Default personality.
  return 'humor';

}