import type { DailyEntry } from './dashboard';

export type AdvancedPattern = {
  id: string;
  eyebrow: string;
  title: string;
  message: string;
  evidence: string;
};

export type AdvancedPatternsSummary = {
  loggedDays: number;
  minimumDays: number;
  hasEnoughData: boolean;
  patterns: AdvancedPattern[];
};

type CountedValue = {
  label: string;
  count: number;
};

function countValues(values: string[]): CountedValue[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    counts.set(
      trimmedValue,
      (counts.get(trimmedValue) ?? 0) + 1,
    );
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
    }))
    .sort((firstValue, secondValue) => {
      if (secondValue.count !== firstValue.count) {
        return secondValue.count - firstValue.count;
      }

      return firstValue.label.localeCompare(
        secondValue.label,
      );
    });
}

export function getAdvancedPatterns(
  entries: DailyEntry[],
): AdvancedPatternsSummary {
  const minimumDays = 3;
  const patterns: AdvancedPattern[] = [];

  const symptomCounts = countValues(
    entries.flatMap((entry) => entry.symptoms),
  );

  const mostFrequentSymptom = symptomCounts[0];

  if (
    mostFrequentSymptom &&
    mostFrequentSymptom.count >= 2
  ) {
    patterns.push({
      id: 'repeated-symptom',
      eyebrow: 'REPEATING SIGNAL',
      title: `${mostFrequentSymptom.label} keeps making an appearance`,
      message:
        'This symptom has appeared more than once during the selected reporting period. Repetition is often more useful than any single difficult day.',
      evidence: `${mostFrequentSymptom.count} logged days`,
    });
  }

  const sleepEntries = entries.filter(
    (entry) => entry.sleep !== undefined,
  );

  const disruptedSleepEntries = sleepEntries.filter(
    (entry) =>
      entry.sleep?.wokeFrequently === true ||
      entry.sleep?.nightSweats === true,
  );

  const disruptedSleepSymptoms = countValues(
    disruptedSleepEntries.flatMap(
      (entry) => entry.symptoms,
    ),
  );

  const mostFrequentDisruptedSleepSymptom =
    disruptedSleepSymptoms[0];

  if (
    disruptedSleepEntries.length >= 2 &&
    mostFrequentDisruptedSleepSymptom &&
    mostFrequentDisruptedSleepSymptom.count >= 2
  ) {
    patterns.push({
      id: 'sleep-symptom-overlap',
      eyebrow: 'SLEEP CONNECTION',
      title: `${mostFrequentDisruptedSleepSymptom.label} appeared alongside disrupted sleep`,
      message:
        'This does not prove that one caused the other, but the overlap may be worth watching as more sleep and symptom entries are added.',
      evidence: `${mostFrequentDisruptedSleepSymptom.count} overlapping logs`,
    });
  } else if (sleepEntries.length >= 2) {
 
    const sleepQualityCounts = countValues(
  sleepEntries.flatMap((entry) => {
    const quality = entry.sleep?.quality;

    return quality ? [quality] : [];
  }),
);

    const mostFrequentSleepQuality =
      sleepQualityCounts[0];

    if (mostFrequentSleepQuality) {
      patterns.push({
        id: 'sleep-quality',
        eyebrow: 'SLEEP PATTERN',
        title: `${mostFrequentSleepQuality.label} was your most logged sleep quality`,
        message:
          'Sleep can influence energy, focus, appetite, temperature regulation, and emotional resilience. Continued logging will make this pattern more useful.',
        evidence: `${mostFrequentSleepQuality.count} sleep logs`,
      });
    }
  }

  const moodCounts = countValues(
    entries
      .map((entry) => entry.mood)
      .filter(
        (mood): mood is string => mood !== null,
      ),
  );

  const mostFrequentMood = moodCounts[0];

  if (
    mostFrequentMood &&
    mostFrequentMood.count >= 2
  ) {
    patterns.push({
      id: 'mood-pattern',
      eyebrow: 'EMOTIONAL WEATHER',
      title: `${mostFrequentMood.label} was your most common check-in`,
      message:
        'Your most repeated mood gives context to the rest of your logs. Sleep, symptoms, stress, and bleeding may help explain how that emotional weather developed.',
      evidence: `${mostFrequentMood.count} logged days`,
    });
  }

  const bleedingEntries = entries.filter(
    (entry) =>
      entry.flow !== undefined &&
      entry.flow !== 'None',
  );

  const bleedingDaySymptoms = countValues(
    bleedingEntries.flatMap(
      (entry) => entry.symptoms,
    ),
  );

  const mostFrequentBleedingDaySymptom =
    bleedingDaySymptoms[0];

  if (
    bleedingEntries.length >= 2 &&
    mostFrequentBleedingDaySymptom &&
    mostFrequentBleedingDaySymptom.count >= 2
  ) {
    patterns.push({
      id: 'bleeding-symptom-overlap',
      eyebrow: 'BLEEDING-DAY PATTERN',
      title: `${mostFrequentBleedingDaySymptom.label} appeared on multiple bleeding days`,
      message:
        'This overlap may be useful to mention during an appointment, especially if it continues across future periods.',
      evidence: `${mostFrequentBleedingDaySymptom.count} overlapping logs`,
    });
  }

  return {
    loggedDays: entries.length,
    minimumDays,
    hasEnoughData: entries.length >= minimumDays,
    patterns,
  };
}