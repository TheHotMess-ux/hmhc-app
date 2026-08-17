import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useFocusEffect,
} from 'expo-router';

import {
  emptyUserProfile,
  loadUserProfile,
} from '@/lib/profile';

import type {
  UserProfile,
} from '@/lib/profile';

import {
  subscribeToUserProfile
} from '@/lib/profile';

export function useUserProfile() {
  const [profile, setProfile] =
    useState<UserProfile>(
      emptyUserProfile,
    );

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

useEffect(() => {
  return subscribeToUserProfile(
    (updatedProfile) => {
      setProfile(updatedProfile);
      setIsLoadingProfile(false);
    },
  );
}, []);

  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function refreshProfile() {
        const savedProfile =
          await loadUserProfile();

        if (screenIsActive) {
          setProfile(savedProfile);
          setIsLoadingProfile(false);
        }
      }

      void refreshProfile();

      return () => {
        screenIsActive = false;
      };
    }, []),
  );

  return {
    profile,
    isLoadingProfile,
  };
}