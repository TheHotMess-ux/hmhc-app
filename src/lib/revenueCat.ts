
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

let isConfigured = false;

export function initializeRevenueCat(): boolean {
  if (isConfigured) {
    return true;
  }

  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
      : Platform.OS === 'android'
        ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
        : undefined;

  if (!apiKey) {
    console.warn(
      '[RevenueCat] No SDK key configured for this platform.',
    );
    return false;
  }

  Purchases.setLogLevel(
    __DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR,
  );

  Purchases.configure({
    apiKey,
  });

  isConfigured = true;

  return true;
}
