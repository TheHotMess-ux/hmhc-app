export type CycleTrend =
  | 'shortening'
  | 'lengthening'
  | 'steady'
  | 'variable'
  | null;

export type CycleTrendMessage = {
  title: string;
  body: string;
};

export type CyclePatternInsight = {
  recentCycleLengths: number[];
  averageCycleLength: number | null;
  shortestCycle: number | null;
  longestCycle: number | null;
  cycleVariation: number | null;
  trend: CycleTrend;
};

export function getCyclePatternInsight(
  cycleLengthHistory: number[],
): CyclePatternInsight {
  const recentCycleLengths =
    cycleLengthHistory.slice(-6);

  if (recentCycleLengths.length < 2) {
    return {
      recentCycleLengths,
      averageCycleLength: null,
      shortestCycle: null,
      longestCycle: null,
      cycleVariation: null,
      trend: null,
    };
  }

  const averageCycleLength = Math.round(
    recentCycleLengths.reduce(
      (total, length) => total + length,
      0,
    ) / recentCycleLengths.length,
  );

  const shortestCycle = Math.min(
    ...recentCycleLengths,
  );

  const longestCycle = Math.max(
    ...recentCycleLengths,
  );

  const cycleVariation =
    longestCycle - shortestCycle;

  let trend: CycleTrend = null;

  if (recentCycleLengths.length >= 4) {
    const differences =
      recentCycleLengths
        .slice(1)
        .map(
          (length, index) =>
            length -
            recentCycleLengths[index],
        );

    const mostlyShortening =
      differences.filter(
        (difference) =>
          difference < 0,
      ).length >=
      differences.length - 1;

    const mostlyLengthening =
      differences.filter(
        (difference) =>
          difference > 0,
      ).length >=
      differences.length - 1;

    if (cycleVariation <= 2) {
      trend = 'steady';
    } else if (mostlyShortening) {
      trend = 'shortening';
    } else if (mostlyLengthening) {
      trend = 'lengthening';
    } else {
      trend = 'variable';
    }
  }

  return {
    recentCycleLengths,
    averageCycleLength,
    shortestCycle,
    longestCycle,
    cycleVariation,
    trend,
  };
}

export function getCycleTrendMessage(
  trend: CycleTrend,
): CycleTrendMessage | null {
  switch (trend) {
    case 'steady':
      return {
        title:
          'Your recent cycles have stayed fairly close in length.',
        body:
          'We’ll keep tracking your cycle lengths as you log more periods.',
      };

    case 'shortening':
      return {
        title:
          'Your recent cycles have been getting shorter.',
        body:
          'Cycle length can change over time, including during perimenopause. We’ll keep watching your pattern as you log more cycles.',
      };

    case 'lengthening':
      return {
        title:
          'Your recent cycles have been getting longer.',
        body:
          'Cycle length can change over time, including during perimenopause. We’ll keep watching your pattern as you log more cycles.',
      };

    case 'variable':
      return {
        title:
          'Your recent cycle lengths have been moving around.',
        body:
          'There isn’t a clear shorter or longer direction in your recent data. We’ll keep tracking the pattern with you.',
      };

    default:
      return null;
  }
}