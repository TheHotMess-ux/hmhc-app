import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_DATE_STORAGE_KEY =
  'hmhcActiveQuickLogDate';

const DAILY_QUICK_LOG_KEYS = [
  'todaysMood',
  'todaysSymptoms',
  'todaysSupplements',
  'todaysFlow',
  'startsNewPeriod',
  'endsPeriod',
  'todaysSleep',
];

let preparedDate: string | null = null;

let preparationPromise:
  Promise<string> | null = null;

export function getLocalDateKey(
  date = new Date(),
): string {
  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1,
    ).padStart(2, '0'),
    String(
      date.getDate(),
    ).padStart(2, '0'),
  ].join('-');
}

export async function prepareDailyQuickLogs(): Promise<string> {
  const todayKey =
    getLocalDateKey();

  if (preparedDate === todayKey) {
    return todayKey;
  }

  if (preparationPromise) {
    return preparationPromise;
  }

  preparationPromise = (
    async () => {
      const savedActiveDate =
        await AsyncStorage.getItem(
          ACTIVE_DATE_STORAGE_KEY,
        );

      if (savedActiveDate === null) {
        await AsyncStorage.setItem(
          ACTIVE_DATE_STORAGE_KEY,
          todayKey,
        );
      } else if (
        savedActiveDate !== todayKey
      ) {
        await AsyncStorage.multiRemove(
          DAILY_QUICK_LOG_KEYS,
        );

        await AsyncStorage.setItem(
          ACTIVE_DATE_STORAGE_KEY,
          todayKey,
        );
      }

      preparedDate = todayKey;

      return todayKey;
    }
  )();

  try {
    return await preparationPromise;
  } finally {
    preparationPromise = null;
  }
}