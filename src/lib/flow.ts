export type FlowLevel =
  | 'None'
  | 'Spotting'
  | 'Light'
  | 'Moderate'
  | 'Heavy';

export interface FlowEntry {
  date: string;
  flow: FlowLevel;
  startsNewPeriod: boolean;
  notes?: string;
}

export const flowOptions: {
  level: FlowLevel;
  emoji: string;
  label: string;
}[] = [
  {
    level: 'None',
    emoji: '⚪',
    label: 'None',
  },
  {
    level: 'Spotting',
    emoji: '🌸',
    label: 'Spotting',
  },
  {
    level: 'Light',
    emoji: '🩷',
    label: 'Light',
  },
  {
    level: 'Moderate',
    emoji: '❤️',
    label: 'Moderate',
  },
  {
    level: 'Heavy',
    emoji: '🩸',
    label: 'Heavy',
  },
];