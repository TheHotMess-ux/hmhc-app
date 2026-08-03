export type FeralForecast = {
  level: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  title: string;
  description: string;
  recommendation: string;
};

export function getFeralForecast(
  mood: string | null,
  symptoms: string[],
): FeralForecast {
  let score = 1;

  // Mood weighting
  if (mood?.includes('Running on fumes')) score += 2;
  if (mood?.includes('Emotionally weathered')) score += 2;
  if (mood?.includes('Feral')) score += 3;

  // Symptom weighting
  const symptomWeights: Record<string, number> = {
    rage: 2,
    anxiety: 2,
    fatigue: 2,
    insomnia: 2,
    brainFog: 1,
    hotFlashes: 1,
    nightSweats: 1,
    headaches: 1,
    bloating: 1,
    spotting: 1,
    heavyFlow: 2,
  };

  for (const symptom of symptoms) {
    score += symptomWeights[symptom] ?? 0;
  }

  score = Math.min(Math.max(score, 1), 5);

  switch (score) {
    case 1:
      return {
        level: 1,
        emoji: '🌿',
        title: 'Surprisingly Functional',
        description:
          'Things are looking fairly calm today.',
        recommendation:
          'This might be a great day to tackle that thing you’ve been putting off.',
      };

    case 2:
      return {
        level: 2,
        emoji: '☀️',
        title: 'Mildly Spicy',
        description:
          'A few hormonal plot twists are expected.',
        recommendation:
          'Stay hydrated and keep snacks nearby.',
      };

    case 3:
      return {
        level: 3,
        emoji: '🔥',
        title: 'Emotionally Weathered',
        description:
          'Proceed with realistic expectations.',
        recommendation:
  "Protect your energy and don't overcommit.",
      };

    case 4:
      return {
        level: 4,
        emoji: '🌋',
        title: 'Moderately Feral',
        description:
          'Your hormones have filed several complaints today.',
        recommendation:
          'Coffee is encouraged. Difficult people are optional.',
      };

    default:
      return {
        level: 5,
        emoji: '☄️',
        title: 'Full Goblin Mode',
        description:
          'The internal gremlins have taken the wheel.',
        recommendation:
          'Protect your peace. Lower the bar. Tomorrow is another day.',
      };
  }
}