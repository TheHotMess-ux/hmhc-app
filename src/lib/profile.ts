import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  preferredName: string;
  fullName: string;
  dateOfBirth: string;
};

const PROFILE_STORAGE_KEY =
  'hmhcUserProfile';

export const emptyUserProfile: UserProfile = {
  preferredName: '',
  fullName: '',
  dateOfBirth: '',
};

export async function loadUserProfile(): Promise<UserProfile> {
  try {
    const savedProfile =
      await AsyncStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (!savedProfile) {
      return emptyUserProfile;
    }

    const parsedProfile =
      JSON.parse(
        savedProfile,
      ) as Partial<UserProfile>;

    return {
      ...emptyUserProfile,
      ...parsedProfile,
    };
  } catch (error) {
    console.error(
      'Unable to load user profile:',
      error,
    );

    return emptyUserProfile;
  }
}

export async function saveUserProfile(
  profile: UserProfile,
): Promise<void> {
  try {
    const cleanedProfile: UserProfile = {
      preferredName:
        profile.preferredName.trim(),

      fullName:
        profile.fullName.trim(),

      dateOfBirth:
        profile.dateOfBirth.trim(),
    };

    await AsyncStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(cleanedProfile),
    );
  } catch (error) {
    console.error(
      'Unable to save user profile:',
      error,
    );

    throw error;
  }
}