export interface CompanionMemory {
  lastWhisperId?: string;

  lastMood?: string;

  lastSymptoms?: string[];

  difficultDaysInRow: number;

  thrivingDaysInRow: number;

  recentVictories: string[];

  lastCheckIn?: string;
}

export const defaultMemory: CompanionMemory = {
  difficultDaysInRow: 0,

  thrivingDaysInRow: 0,

  recentVictories: [],
};

type DatedCheckIn = {
  date: string;
};

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

function subtractDays(
  date: Date,
  numberOfDays: number,
): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() - numberOfDays,
  );

  return result;
}

export function getCheckInStreak(
  entries: DatedCheckIn[],
  today = new Date(),
): number {
  const checkInDates = new Set(
    entries.map((entry) => entry.date),
  );

  const todayKey = formatLocalDate(today);
  const yesterday = subtractDays(today, 1);
  const yesterdayKey =
    formatLocalDate(yesterday);

  let cursor: Date;

  if (checkInDates.has(todayKey)) {
    cursor = today;
  } else if (checkInDates.has(yesterdayKey)) {
    cursor = yesterday;
  } else {
    return 0;
  }

  let streak = 0;

  while (
    checkInDates.has(
      formatLocalDate(cursor),
    )
  ) {
    streak += 1;
    cursor = subtractDays(cursor, 1);
  }

  return streak;
}