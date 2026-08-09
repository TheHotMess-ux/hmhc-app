function formatLocalDate(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseLocalDate(
  dateString: string,
): Date {
  const [
    year,
    month,
    day,
  ] = dateString
    .split('-')
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
  );
}

export function getCycleDayFromPeriodStart(
  periodStartDate: string,
  today = new Date(),
): number {
  const start =
    parseLocalDate(periodStartDate);

  const current =
    parseLocalDate(
      formatLocalDate(today),
    );

  const difference =
    current.getTime() -
    start.getTime();

  const daysSinceStart =
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24),
    );

  return daysSinceStart + 1;
}

type PeriodEntry = {
  date: string;
  startsNewPeriod?: boolean;
  endsPeriod?: boolean;
};

export function getLatestPeriodDuration(
  entries: PeriodEntry[],
): number | null {
  const sortedEntries = [...entries].sort(
    (a, b) => a.date.localeCompare(b.date),
  );

  let latestStart: string | null = null;
  let latestEnd: string | null = null;

  for (const entry of sortedEntries) {
    if (entry.startsNewPeriod) {
      latestStart = entry.date;
      latestEnd = null;
    }

    if (
      latestStart &&
      entry.endsPeriod &&
      entry.date >= latestStart
    ) {
      latestEnd = entry.date;
    }
  }

  if (!latestStart || !latestEnd) {
    return null;
  }

  const start = new Date(
    `${latestStart}T12:00:00`,
  );

  const end = new Date(
    `${latestEnd}T12:00:00`,
  );

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    Math.round(
      (end.getTime() - start.getTime()) /
        millisecondsPerDay,
    );

  return difference + 1;
}

export function getMostRecentPeriodStart(
  entries: PeriodEntry[],
): string | null {
  const periodStarts = entries
    .filter(
      (entry) =>
        entry.startsNewPeriod === true,
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date),
    );

  return periodStarts[0]?.date ?? null;
}

export function getLatestCycleLength(
  entries: PeriodEntry[],
): number | null {
  const periodStarts = entries
    .filter(
      (entry) =>
        entry.startsNewPeriod === true,
    )
    .map((entry) => entry.date)
    .sort((a, b) =>
      a.localeCompare(b),
    );

  if (periodStarts.length < 2) {
    return null;
  }

  const latestStart =
    periodStarts[
      periodStarts.length - 1
    ];

  const previousStart =
    periodStarts[
      periodStarts.length - 2
    ];

  const latestDate =
    parseLocalDate(latestStart);

  const previousDate =
    parseLocalDate(previousStart);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    Math.round(
      (
        latestDate.getTime() -
        previousDate.getTime()
      ) /
        millisecondsPerDay,
    );

  return difference;
}

export function getCycleLengthHistory(
  entries: PeriodEntry[],
): number[] {
  const periodStarts = entries
    .filter(
      (entry) =>
        entry.startsNewPeriod === true,
    )
    .map((entry) => entry.date)
    .sort((a, b) =>
      a.localeCompare(b),
    );

  if (periodStarts.length < 2) {
    return [];
  }

  const cycleLengths: number[] = [];

  for (
    let index = 1;
    index < periodStarts.length;
    index += 1
  ) {
    const previousStart =
      parseLocalDate(
        periodStarts[index - 1],
      );

    const currentStart =
      parseLocalDate(
        periodStarts[index],
      );

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const cycleLength =
      Math.round(
        (
          currentStart.getTime() -
          previousStart.getTime()
        ) /
          millisecondsPerDay,
      );

    cycleLengths.push(cycleLength);
  }

  return cycleLengths;
}

export function getCycleDayForDate(
  entries: PeriodEntry[],
  targetDate: Date,
): number | null {
  const targetDateString =
    formatLocalDate(targetDate);

  const periodStarts = entries
    .filter(
      (entry) =>
        entry.startsNewPeriod === true &&
        entry.date <= targetDateString,
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date),
    );

  const mostRecentStart =
    periodStarts[0]?.date;

  if (!mostRecentStart) {
    return null;
  }

  return getCycleDayFromPeriodStart(
    mostRecentStart,
    targetDate,
  );
}