import type { CompanionContext } from './context';

export type ObservationType =
  | 'consistent-check-ins'
  | 'heavy-yesterday'
  | 'brain-fog-pattern'
  | 'fatigue-pattern';

export interface CompanionObservation {
  type: ObservationType;
  title: string;
  body: string;
}

export function getCompanionObservation(
  context: CompanionContext,
): CompanionObservation | null {
  if (
    context.checkInStreak &&
    context.checkInStreak >= 3
  ) {
    return {
      type: 'consistent-check-ins',
      title: 'I noticed something',
      body:
        'You have been checking in consistently lately. That quiet commitment is helping us understand your patterns.',
    };
  }

  if (
    context.yesterdayMood ===
    '😩 Running on fumes'
  ) {
    return {
      type: 'heavy-yesterday',
      title: 'Yesterday looked heavy',
      body:
        'You came back today anyway. That matters more than doing any of this perfectly.',
    };
  }

  if (
    context.yesterdaySymptoms?.includes(
      'Brain fog',
    )
  ) {
    return {
      type: 'brain-fog-pattern',
      title: 'Brain fog has been visiting',
      body:
        'It showed up yesterday too. You are not imagining the extra mental weight.',
    };
  }

  if (
    context.yesterdaySymptoms?.includes(
      'Fatigue',
    )
  ) {
    return {
      type: 'fatigue-pattern',
      title: 'Your energy has been asking for attention',
      body:
        'Fatigue showed up yesterday too. Maybe we keep today’s expectations kind.',
    };
  }

  return null;
}