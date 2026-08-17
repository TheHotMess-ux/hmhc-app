import type { DailyEntry } from './dashboard';


export type ReportCount = {
  label: string;
  count: number;
};

export type DoctorReportSummary = {
  rangeDays: number;
  loggedDays: number;
  firstLoggedDate: string | null;
  lastLoggedDate: string | null;

  topSymptoms: ReportCount[];
  moods: ReportCount[];
  supplements: ReportCount[];
  flowLevels: ReportCount[];

  periodStarts: number;
  bleedingDays: number;
  spottingDays: number;

  sleep: {
    loggedNights: number;
    qualities: ReportCount[];
    durations: ReportCount[];
    frequentWakingNights: number;
    nightSweatNights: number;
  };
};

function countValues(
  values: string[],
): ReportCount[] {
  const counts = values.reduce<Record<string, number>>(
    (currentCounts, value) => {
      currentCounts[value] =
        (currentCounts[value] ?? 0) + 1;

      return currentCounts;
    },
    {},
  );

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
    }))
    .sort((first, second) => {
      if (second.count !== first.count) {
        return second.count - first.count;
      }

      return first.label.localeCompare(
        second.label,
      );
    });
}

function isEntryWithinRange(
  entry: DailyEntry,
  rangeDays: number,
): boolean {
  const entryDate = new Date(
    `${entry.date}T00:00:00`,
  );

  if (Number.isNaN(entryDate.getTime())) {
    return false;
  }

  const cutoffDate = new Date();
  cutoffDate.setHours(0, 0, 0, 0);

  cutoffDate.setDate(
    cutoffDate.getDate() -
      (rangeDays - 1),
  );

  return entryDate >= cutoffDate;
}

export function getDoctorReportSummary(
  entries: DailyEntry[],
  rangeDays = 30,
): DoctorReportSummary {
  const entriesInRange = entries
    .filter((entry) =>
      isEntryWithinRange(
        entry,
        rangeDays,
      ),
    )
    .sort((first, second) =>
      first.date.localeCompare(
        second.date,
      ),
    );

  const symptomValues =
    entriesInRange.flatMap(
      (entry) => entry.symptoms,
    );

  const moodValues = entriesInRange
    .map((entry) => entry.mood)
    .filter(
      (mood): mood is string =>
        mood !== null &&
        mood.length > 0,
    );

  const supplementValues =
    entriesInRange.flatMap(
      (entry) =>
        entry.supplements ?? [],
    );

  const flowValues = entriesInRange
    .map((entry) => entry.flow)
    .filter(
      (flow): flow is NonNullable<
        DailyEntry['flow']
      > => flow !== undefined,
    );

  const sleepEntries =
    entriesInRange
      .map((entry) => entry.sleep)
      .filter(
        (
          sleep,
        ): sleep is NonNullable<
          DailyEntry['sleep']
        > => sleep !== undefined,
      );

  const periodStarts =
    entriesInRange.filter(
      (entry) =>
        entry.startsNewPeriod === true,
    ).length;

  const bleedingDays =
    entriesInRange.filter(
      (entry) =>
        entry.flow !== undefined &&
        entry.flow !== 'None',
    ).length;

  const spottingDays =
    entriesInRange.filter(
      (entry) =>
        entry.flow === 'Spotting',
    ).length;

  return {
    rangeDays,
    loggedDays: entriesInRange.length,

    firstLoggedDate:
      entriesInRange[0]?.date ?? null,

    lastLoggedDate:
      entriesInRange[
        entriesInRange.length - 1
      ]?.date ?? null,

    topSymptoms:
      countValues(symptomValues).slice(
        0,
        5,
      ),

    moods: countValues(moodValues),

    supplements:
      countValues(
        supplementValues,
      ).slice(0, 8),

    flowLevels:
      countValues(flowValues),

    periodStarts,
    bleedingDays,
    spottingDays,

    sleep: {
      loggedNights:
        sleepEntries.length,

      qualities: countValues(
        sleepEntries.map(
          (sleep) => sleep.quality,
        ),
      ),

      durations: countValues(
        sleepEntries.map(
          (sleep) => sleep.duration,
        ),
      ),

      frequentWakingNights:
        sleepEntries.filter(
          (sleep) =>
            sleep.wokeFrequently,
        ).length,

      nightSweatNights:
        sleepEntries.filter(
          (sleep) =>
            sleep.nightSweats,
        ).length,
    },
  };
}