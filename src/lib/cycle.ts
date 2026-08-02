export type CyclePhase =
  | 'Menstrual'
  | 'Follicular'
  | 'Ovulation'
  | 'Luteal';

export interface PhaseData {
  phase: CyclePhase;
  title: string;
  description: string;

  hormones: {
    estrogen: string;
    progesterone: string;
    testosterone: string;
  };

  symptoms: string[];

  recommendations: string[];

  encouragement: string;

  color: string;

  emoji: string;
}

const phaseData: Record<CyclePhase, PhaseData> = {
  Menstrual: {
    phase: 'Menstrual',

    title: 'Menstrual Phase',

    description:
      'Your hormones are at their lowest. Your body is shedding the uterine lining and recovery should take priority.',

    hormones: {
      estrogen: 'Very Low',
      progesterone: 'Very Low',
      testosterone: 'Low',
    },

    symptoms: [
      'Fatigue',
      'Cramping',
      'Headaches',
      'Lower motivation',
      'Need for extra rest',
    ],

    recommendations: [
      'Hydrate',
      'Prioritize sleep',
      'Gentle movement',
      'Iron-rich foods',
    ],

    encouragement:
      "Rest is productive. Your body isn't slowing you down. It's rebuilding.",

    color: '#8B2E4B33',

    emoji: '🩸',
  },

  Follicular: {
    phase: 'Follicular',

    title: 'Follicular Phase',

    description:
      'Energy begins returning as estrogen rises. Many women notice better focus and motivation.',

    hormones: {
      estrogen: 'Rising',
      progesterone: 'Low',
      testosterone: 'Increasing',
    },

    symptoms: [
      'Higher energy',
      'Clearer thinking',
      'Improved mood',
      'Better workouts',
    ],

    recommendations: [
      'Lift heavier',
      'Learn something new',
      'Meal prep',
      'Challenge yourself',
    ],

    encouragement:
      "Momentum is building. This is a wonderful time to lean into your goals.",

    color: '#7FA77B33',

    emoji: '🌱',
  },

  Ovulation: {
    phase: 'Ovulation',

    title: 'Ovulation',

    description:
      'Hormones peak. Strength, confidence and recovery are often at their highest.',

    hormones: {
      estrogen: 'Highest',
      progesterone: 'Beginning to Rise',
      testosterone: 'Highest',
    },

    symptoms: [
      'Confidence',
      'High energy',
      'Social',
      'Strong workouts',
    ],

    recommendations: [
      'Push your training',
      'Protein',
      'Stay hydrated',
    ],

    encouragement:
      "Ride the wave. Your body is incredibly capable today.",

    color: '#D4AF3733',

    emoji: '🌼',
  },

  Luteal: {
    phase: 'Luteal',

    title: 'Luteal Phase',

    description:
      'Hormones begin declining. Brain fog, cravings and mood shifts become more common.',

    hormones: {
      estrogen: 'Falling',
      progesterone: 'Falling',
      testosterone: 'Lower',
    },

    symptoms: [
      'Brain fog',
      'Food cravings',
      'Bloating',
      'Poor sleep',
      'Irritability',
    ],

    recommendations: [
      'Protein',
      'Recovery',
      'Walks',
      'Magnesium',
      'Protect sleep',
    ],

    encouragement:
      "You aren't failing. Your body is changing gears. Meet it with compassion.",

    color: '#8C72B1',

    emoji: '🌙',
  },
};
export function getCyclePhase(day: number): PhaseData {
  if (day <= 5) return phaseData.Menstrual;

  if (day <= 12) return phaseData.Follicular;

  if (day <= 15) return phaseData.Ovulation;

  return phaseData.Luteal;
}