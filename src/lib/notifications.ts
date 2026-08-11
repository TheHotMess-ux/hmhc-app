import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

import type {
  PeriodReminderMessage,
} from './cycleReminderMessages';

export async function schedulePeriodReminder(
  message: PeriodReminderMessage,
  reminderKey: string,
  reminderDate: Date,
): Promise<string | null> {

  if (Platform.OS === 'web') {
    return null;
  }

  const alreadyScheduled =
  await hasScheduledPeriodReminder(
    reminderKey,
  );

if (alreadyScheduled) {
  return null;
}

  await configureNotificationChannel();

  const hasPermission =
    await requestNotificationPermissions();

  if (!hasPermission) {
    return null;
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
      },

    trigger: {
  type:
    Notifications.SchedulableTriggerInputTypes.DATE,
  date: reminderDate,
  channelId:
    Platform.OS === 'android'
      ? 'cycle-reminders'
      : undefined,
},
    });

await rememberScheduledPeriodReminder(
  reminderKey,
  notificationId,
);

  return notificationId;
}

const PERIOD_REMINDER_STORAGE_KEY =
  'hmhcScheduledPeriodReminder';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const currentPermissions =
    await Notifications.getPermissionsAsync();

  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions =
    await Notifications.requestPermissionsAsync();

  return requestedPermissions.granted;
}

export async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  

  await Notifications.setNotificationChannelAsync(
    'cycle-reminders',
    {
      name: 'Cycle reminders',
      importance:
        Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    },
  );
}

export async function scheduleTestNotification(): Promise<void> {
  if (Platform.OS === 'web') {
    console.log(
      'Test notifications are not scheduled on web.',
    );
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 HMHC notification test',
      body:
        'If you can see this, the notification gremlins have been successfully domesticated.',
    },
    trigger: {
      type:
        Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId:
        Platform.OS === 'android'
          ? 'cycle-reminders'
          : undefined,
    },
  });
}

type StoredPeriodReminder = {
  reminderKey: string;
  notificationId: string;
};

export async function getStoredPeriodReminder(): Promise<
  StoredPeriodReminder | null
> {
  const savedReminder =
    await AsyncStorage.getItem(
      PERIOD_REMINDER_STORAGE_KEY,
    );

  if (!savedReminder) {
    return null;
  }

  try {
    return JSON.parse(
      savedReminder,
    ) as StoredPeriodReminder;
  } catch {
    return null;
  }
}

export async function cancelStoredPeriodReminder(): Promise<void> {
  const storedReminder =
    await getStoredPeriodReminder();

  if (!storedReminder) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(
    storedReminder.notificationId,
  );

  await AsyncStorage.removeItem(
    PERIOD_REMINDER_STORAGE_KEY,
  );
}

export async function hasScheduledPeriodReminder(
  reminderKey: string,
): Promise<boolean> {
  const savedReminder =
    await AsyncStorage.getItem(
      PERIOD_REMINDER_STORAGE_KEY,
    );

  if (!savedReminder) {
    return false;
  }

  try {
    const parsedReminder =
      JSON.parse(
        savedReminder,
      ) as StoredPeriodReminder;

    return (
      parsedReminder.reminderKey ===
      reminderKey
    );
  } catch {
    return false;
  }
}

export async function rememberScheduledPeriodReminder(
  reminderKey: string,
  notificationId: string,
): Promise<void> {
  const reminder: StoredPeriodReminder = {
    reminderKey,
    notificationId,
  };

  await AsyncStorage.setItem(
    PERIOD_REMINDER_STORAGE_KEY,
    JSON.stringify(reminder),
  );
}