export type FitnessType =
  | 'Strength'
  | 'Walking'
  | 'Cardio'
  | 'Mobility'
  | 'Rest Day';

export type FitnessLog = {
  activities: FitnessType[];
};

export const fitnessOptions: {
  type: FitnessType;
  emoji: string;
  label: string;
  description: string;
}[] = [
  {
    type: 'Strength',
    emoji: '🏋️',
    label: 'Strength',
    description: 'Weights, resistance, or generally picking up heavy things on purpose.',
  },
  {
    type: 'Walking',
    emoji: '🚶',
    label: 'Walking',
    description: 'A walk, treadmill time, or getting those steps in.',
  },
  {
    type: 'Cardio',
    emoji: '🏃',
    label: 'Cardio',
    description: 'Anything that got your heart working a little harder.',
  },
  {
    type: 'Mobility',
    emoji: '🧘',
    label: 'Mobility',
    description: 'Stretching, yoga, mobility work, or giving your joints some love.',
  },
  {
    type: 'Rest Day',
    emoji: '🛋️',
    label: 'Rest Day',
    description: 'Rest counts. Your body is allowed to recover without submitting paperwork.',
  },
];