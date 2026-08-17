import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY =
  'hmhcOnboardingCompleteV2';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const savedValue =
      await AsyncStorage.getItem(
        ONBOARDING_STORAGE_KEY,
      );

    return savedValue === 'true';
  } catch (error) {
    console.error(
      'Unable to load onboarding status:',
      error,
    );

    return false;
  }
}

export async function completeOnboarding(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      'true',
    );
  } catch (error) {
    console.error(
      'Unable to complete onboarding:',
      error,
    );

    throw error;
  }
}

export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      ONBOARDING_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      'Unable to reset onboarding:',
      error,
    );

    throw error;
  }
}