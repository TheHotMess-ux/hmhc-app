export type SleepQuality =
  | 'Great'
  | 'Okay'
  | 'Restless'
  | 'Terrible';

export type SleepDuration =
  | 'Under 4 hours'
  | '4–6 hours'
  | '6–8 hours'
  | 'Over 8 hours';

export type SleepLog = {
  quality: SleepQuality;
  duration: SleepDuration;
  wokeFrequently: boolean;
  nightSweats: boolean;
};

export const sleepQualityOptions: {
  quality: SleepQuality;
  emoji: string;
  label: string;
}[] = [
  {
    quality: 'Great',
    emoji: '✨',
    label: 'Actually restorative',
  },
  {
    quality: 'Okay',
    emoji: '🙂',
    label: 'Good enough',
  },
  {
    quality: 'Restless',
    emoji: '🌪️',
    label: 'Restless and broken',
  },
  {
    quality: 'Terrible',
    emoji: '🧟‍♀️',
    label: 'What sleep?',
  },
];

export const sleepDurationOptions: {
  duration: SleepDuration;
  emoji: string;
}[] = [
  {
    duration: 'Under 4 hours',
    emoji: '🫠',
  },
  {
    duration: '4–6 hours',
    emoji: '🥱',
  },
  {
    duration: '6–8 hours',
    emoji: '😴',
  },
  {
    duration: 'Over 8 hours',
    emoji: '🛌',
  },
];