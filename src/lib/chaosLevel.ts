export type FeralForecast = {
  level: 1 | 2 | 3 | 4 | 5;
  meter: string;
  emoji: string;
  title: string;
  description: string;
  recommendation: string;
};

type FeralForecastInput = {
  mood: string | null;
  symptoms: string[];
  flow?: string | null;
  cyclePhase?: string;
};

const symptomWeights: Record<string, number> = {
  Rage: 2,
  Anxiety: 2,
  Fatigue: 2,
  'Low Mood': 2,
  'Feeling Overwhelmed': 2,
  'ADHD Overload': 2,
  Overstimulated: 2,

  'Brain Fog': 1,
  Forgetfulness: 1,
  'Forgetting Words': 1,
  'Difficulty Concentrating': 1,
  Headache: 1,
  Dizziness: 1,
  'Hot Flashes': 1,
  'Night Sweats': 1,
  Bloating: 1,
  Cramps: 1,
  Spotting: 1,
  'Joint Pain': 1,
  'Muscle Aches': 1,
  'Breast Tenderness': 1,
  'Heart Palpitations': 1,

  'Trouble Falling Asleep': 2,
  'Restless Sleep': 2,
  'Waking During the Night': 2,
  'Early Waking': 2,
  'Unrefreshing Sleep': 2,
};

function getMoodScore(mood: string | null): number {
  if (!mood) {
    return 0;
  }

  if (mood.includes('Feral')) {
    return 3;
  }

  if (
    mood.includes('Running on fumes') ||
    mood.includes('Emotionally weathered')
  ) {
    return 2;
  }

  if (mood.includes('Doing okay')) {
    return 1;
  }

  return 0;
}

function getFlowScore(flow?: string | null): number {
  switch (flow) {
    case 'Heavy':
      return 2;

    case 'Moderate':
      return 1;

    case 'Light':
    case 'Spotting':
      return 0.5;

    default:
      return 0;
  }
}

function getCyclePhaseScore(cyclePhase?: string): number {
  if (!cyclePhase) {
    return 0;
  }

  const normalizedPhase = cyclePhase.toLowerCase();

  if (normalizedPhase.includes('luteal')) {
    return 1;
  }

  if (normalizedPhase.includes('menstrual')) {
    return 1;
  }

  return 0;
}

function getForecastForLevel(
  level: FeralForecast['level'],
): FeralForecast {
  switch (level) {
    case 1:
      return {
        level,
        meter: '●○○○○',
        emoji: '🌿',
        title: 'Surprisingly Functional',
        description:
          'Things are looking fairly calm today.',
        recommendation:
          'Use the steadier energy, but leave some fuel in the tank.',
      };

    case 2:
      return {
        level,
        meter: '●●○○○',
        emoji: '☀️',
        title: 'Mildly Spicy',
        description:
          'A few hormonal plot twists may wander into the storyline.',
        recommendation:
          'Prioritize hydration, protein and realistic expectations.',
      };

    case 3:
      return {
        level,
        meter: '●●●○○',
        emoji: '🔥',
        title: 'Emotionally Weathered',
        description:
          'Your body has submitted several notes for review.',
        recommendation:
          'Protect your energy and avoid overcommitting today.',
      };

    case 4:
      return {
        level,
        meter: '●●●●○',
        emoji: '🌋',
        title: 'Moderately Feral',
        description:
          'Patience may be operating on limited battery power.',
        recommendation:
          'Eat before the hanger arrives and decline one unnecessary demand.',
      };

    default:
      return {
        level: 5,
        meter: '●●●●●',
        emoji: '☄️',
        title: 'Full Goblin Mode',
        description:
          'The internal committee has rejected business as usual.',
        recommendation:
          'Lower the bar, protect your peace and postpone what can safely wait.',
      };
  }
}

export function getFeralForecast({
  mood,
  symptoms,
  flow,
  cyclePhase,
}: FeralForecastInput): FeralForecast {
  let score = 0;

  score += getMoodScore(mood);
  score += getFlowScore(flow);
  score += getCyclePhaseScore(cyclePhase);

  for (const symptom of symptoms) {
    score += symptomWeights[symptom] ?? 0;
  }

  let level: FeralForecast['level'];

  if (score <= 1) {
    level = 1;
  } else if (score <= 3) {
    level = 2;
  } else if (score <= 6) {
    level = 3;
  } else if (score <= 9) {
    level = 4;
  } else {
    level = 5;
  }

  return getForecastForLevel(level);
}