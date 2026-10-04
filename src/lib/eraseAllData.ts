import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  cancelEveningReminder,
  cancelMorningReminder,
  cancelStoredPeriodReminder,
} from './notifications';

import {
  resetDailyQuickLogPreparation,
} from './dailyQuickLog';

export async function eraseAllData(): Promise<void> {
  await Promise.all([
    cancelStoredPeriodReminder(),
    cancelMorningReminder(),
    cancelEveningReminder(),
  ]);

  await AsyncStorage.clear();

  resetDailyQuickLogPreparation();
}
