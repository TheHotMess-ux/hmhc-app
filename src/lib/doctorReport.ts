import type { DailyEntry } from './dashboard';

import { symptomCategories } from './symptoms';

const builtInSymptomLabels = new Set(
  symptomCategories.flatMap((category) =>
    category.symptoms.map(
      (symptom) => symptom.label.toLowerCase(),
    ),
  ),
);

export type ReportCount = {
  label: string;
  count: number;
};

export type ReportNote = {
  date: string;
  note: string;
};

export type DoctorReportSummary = {
  rangeDays: number;
  loggedDays: number;
  firstLoggedDate: string | null;
  lastLoggedDate: string | null;
  topSymptoms: ReportCount[];
  doctorDiscussionItems: ReportCount[];
  moods: ReportCount[];
  supplements: ReportCount[];
  flowLevels: ReportCount[];
  bleedingDetails: ReportCount[];
  notes: ReportNote[];
  caffeine: {
  loggedDays: number;
  daysWithCaffeine: number;
  amounts: ReportCount[];
  lastDrinkTimes: ReportCount[];
};

alcohol: {
  loggedDays: number;
  daysWithAlcohol: number;
  amounts: ReportCount[];
  lastDrinkTimes: ReportCount[];
};
  periodStarts: number;
  bleedingDays: number;
  spottingDays: number;
crampIntensity: {
  ratedDays: number;
  average: number | null;
  highest: number | null;
};
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

const countedSymptoms =
  countValues(symptomValues);

const topSymptoms =
  countedSymptoms.slice(0, 10);

const customSymptoms =
  countedSymptoms.filter(
    (symptom) =>
      !builtInSymptomLabels.has(
        symptom.label.toLowerCase(),
      ),
  );

const symptomsForReport = [
  ...topSymptoms,
  ...customSymptoms.filter(
    (customSymptom) =>
      !topSymptoms.some(
        (topSymptom) =>
          topSymptom.label.toLowerCase() ===
          customSymptom.label.toLowerCase(),
      ),
  ),
];

const doctorDiscussionValues =
  entriesInRange.flatMap((entry) =>
    Object.entries(
      entry.symptomDetails ?? {},
    )
      .filter(
        ([, details]) =>
          details.discussWithDoctor === true,
      )
      .map(([label]) => label),
  );

const doctorDiscussionItems =
  countValues(doctorDiscussionValues);

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

    const notes = entriesInRange
  .filter(
    (entry) =>
      typeof entry.notes === 'string' &&
      entry.notes.trim().length > 0,
  )
  .map((entry) => ({
    date: entry.date,
    note: entry.notes!.trim(),
  }));

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

const crampIntensityValues =
  entriesInRange
    .map(
      (entry) =>
        entry.symptomDetails?.Cramps
          ?.intensity,
    )
    .filter(
      (intensity): intensity is number =>
        typeof intensity === 'number' &&
        Number.isFinite(intensity) &&
        intensity >= 1 &&
        intensity <= 10,
    );

const averageCrampIntensity =
  crampIntensityValues.length > 0
    ? Math.round(
        (
          crampIntensityValues.reduce(
            (total, intensity) =>
              total + intensity,
            0,
          ) / crampIntensityValues.length
        ) * 10,
      ) / 10
    : null;

const highestCrampIntensity =
  crampIntensityValues.length > 0
    ? Math.max(...crampIntensityValues)
    : null;

const bleedingDetailValues =
  entriesInRange.flatMap((entry) => {
    const details = entry.flowDetails;

    if (!details) {
      return [];
    }

    const loggedDetails: string[] = [];

    if (details.flooding) {
      loggedDetails.push(
        'Flooding or sudden gushes',
      );
    }

    if (details.clots) {
      loggedDetails.push('Clots');
    }

    if (details.betweenPeriods) {
      loggedDetails.push(
        'Bleeding between periods',
      );
    }

    if (details.afterSex) {
      loggedDetails.push(
        'Bleeding after sex',
      );
    }

    if (details.sleepDisruption) {
      loggedDetails.push(
        'Bleeding disrupted sleep',
      );
    }

    if (details.unusuallyLong) {
      loggedDetails.push(
        'Bleeding longer than usual',
      );
    }

    return loggedDetails;
  });

const bleedingDetails =
  countValues(bleedingDetailValues);

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

const caffeineEntries = entriesInRange.filter(
  (entry) => entry.caffeine !== undefined,
);

const caffeineAmounts = caffeineEntries.map(
  (entry) => entry.caffeine!.amount,
);

const caffeineLastDrinkTimes =
  caffeineEntries
    .map(
      (entry) =>
        entry.caffeine!.lastDrinkTime,
    )
    .filter(
      (time): time is NonNullable<
        typeof time
      > => time !== undefined,
    );

const daysWithCaffeine =
  caffeineEntries.filter(
    (entry) =>
      entry.caffeine!.amount !== 'None',
  ).length;

  const alcoholEntries = entriesInRange.filter(
  (entry) => entry.alcohol !== undefined,
);

const alcoholAmounts = alcoholEntries.map(
  (entry) => entry.alcohol!.amount,
);

const alcoholLastDrinkTimes =
  alcoholEntries
    .map(
      (entry) =>
        entry.alcohol!.lastDrinkTime,
    )
    .filter(
      (time): time is NonNullable<
        typeof time
      > => time !== undefined,
    );

const daysWithAlcohol =
  alcoholEntries.filter(
    (entry) =>
      entry.alcohol!.amount !== 'None',
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

    topSymptoms: symptomsForReport,
    doctorDiscussionItems,
    notes,
    caffeine: {
  loggedDays: caffeineEntries.length,
  daysWithCaffeine,
  amounts: countValues(
    caffeineAmounts,
  ),
  lastDrinkTimes: countValues(
    caffeineLastDrinkTimes,
  ),
},

alcohol: {
  loggedDays: alcoholEntries.length,
  daysWithAlcohol,
  amounts: countValues(
    alcoholAmounts,
  ),
  lastDrinkTimes: countValues(
    alcoholLastDrinkTimes,
  ),
},

    moods: countValues(moodValues),

    supplements:
      countValues(
        supplementValues,
      ).slice(0, 8),

    flowLevels:
      countValues(flowValues),
      bleedingDetails,

    periodStarts,
    bleedingDays,
    spottingDays,

    crampIntensity: {
      ratedDays: crampIntensityValues.length,
      average: averageCrampIntensity,
      highest: highestCrampIntensity,
    },

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