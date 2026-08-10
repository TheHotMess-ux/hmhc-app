import type {
    CyclePrediction,
    PredictionReadiness,
} from './cyclePrediction';

export type PeriodReminderStatus =
  | 'not-ready'
  | 'too-early'
  | 'remind'
  | 'period-started';

type PeriodReminderInput = {
  today: Date;
  predictionReadiness: PredictionReadiness;
  prediction: CyclePrediction | null;
  hasStartedNewPeriodToday: boolean;
};

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

export function getPeriodReminderStatus({
  today,
  predictionReadiness,
  prediction,
  hasStartedNewPeriodToday,
}: PeriodReminderInput): PeriodReminderStatus {
  if (
    predictionReadiness !== 'ready' ||
    !prediction
  ) {
    return 'not-ready';
  }

  if (hasStartedNewPeriodToday) {
    return 'period-started';
  }

  const todayDate =
    startOfDay(today);

  const windowStart =
    startOfDay(
      prediction.windowStart,
    );

  if (todayDate < windowStart) {
    return 'too-early';
  }

  return 'remind';
}