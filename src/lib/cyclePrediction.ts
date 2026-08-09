export type CyclePrediction = {
  predictedDate: Date;
  windowStart: Date;
  windowEnd: Date;
  averageCycleLength: number;
  shortestCycle: number;
  longestCycle: number;
};

export type PredictionReadiness =
  | 'not-started'
  | 'learning'
  | 'ready';

function parseLocalDate(
  dateString: string,
): Date {
  const [year, month, day] =
    dateString.split('-').map(Number);

  return new Date(
    year,
    month - 1,
    day,
  );
}

function addDays(
  date: Date,
  days: number,
): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days,
  );

  return result;
}

export function getNextPeriodPrediction(
  lastPeriodStart: string | null,
  cycleLengthHistory: number[],
): CyclePrediction | null {
  if (
    !lastPeriodStart ||
    cycleLengthHistory.length < 2
  ) {
    return null;
  }

  const recentCycles =
    cycleLengthHistory.slice(-6);

  const averageCycleLength =
    Math.round(
      recentCycles.reduce(
        (total, length) =>
          total + length,
        0,
      ) / recentCycles.length,
    );

  const shortestCycle =
    Math.min(...recentCycles);

  const longestCycle =
    Math.max(...recentCycles);

  const periodStart =
    parseLocalDate(
      lastPeriodStart,
    );

  return {
    predictedDate: addDays(
      periodStart,
      averageCycleLength,
    ),
    windowStart: addDays(
      periodStart,
      shortestCycle,
    ),
    windowEnd: addDays(
      periodStart,
      longestCycle,
    ),
    averageCycleLength,
    shortestCycle,
    longestCycle,
  };
}

export function getPredictionReadiness(
  lastPeriodStart: string | null,
  cycleLengthHistory: number[],
): PredictionReadiness {
  if (!lastPeriodStart) {
    return 'not-started';
  }

  if (cycleLengthHistory.length < 2) {
    return 'learning';
  }

  return 'ready';
}