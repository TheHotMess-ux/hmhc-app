import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/theme/colors';

import {
  useEffect,
  useState,
} from 'react';

SplashScreen.preventAutoHideAsync();

import OnboardingModal from '@/components/onboarding/OnboardingModal';

import {
  hasCompletedOnboarding,
} from '@/lib/onboarding';

function getTabIcon(
  routeName: string,
  focused: boolean,
): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case 'index':
      return focused
        ? 'home'
        : 'home-outline';

    case 'track':
      return focused
        ? 'calendar'
        : 'calendar-outline';

    case 'library':
      return focused
        ? 'book'
        : 'book-outline';

    case 'profile':
      return focused
        ? 'person'
        : 'person-outline';

    case 'insights':
      return focused
        ? 'analytics'
        : 'analytics-outline';

    default:
      return 'ellipse-outline';
  }
}

  export default function RootLayout() {
  const [
    onboardingIsVisible,
    setOnboardingIsVisible,
  ] = useState(false);

  const [
    onboardingHasLoaded,
    setOnboardingHasLoaded,
  ] = useState(false);

  const [
  appRefreshKey,
  setAppRefreshKey,
] = useState(0);

  useEffect(() => {
    let layoutIsActive = true;

    async function checkOnboarding() {
      const onboardingIsComplete =
        await hasCompletedOnboarding();

      if (layoutIsActive) {
        setOnboardingIsVisible(
          !onboardingIsComplete,
        );

        setOnboardingHasLoaded(true);
      }
    }

    void checkOnboarding();

    return () => {
      layoutIsActive = false;
    };
  }, []);

  return (

    <>
      <AnimatedSplashOverlay />

      <Tabs
  key={appRefreshKey}
  screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,

          tabBarActiveTintColor:
            Colors.gold,

          tabBarInactiveTintColor:
            Colors.textSecondary,

          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor:
              Colors.surface,
            borderTopColor:
              Colors.border,
            borderTopWidth: 1,
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },

          tabBarIconStyle: {
            marginTop: 2,
          },

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={getTabIcon(
                route.name,
                focused,
              )}
              color={color}
              size={size}
            />
          ),
        })}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />

        <Tabs.Screen
          name="track"
          options={{
            title: 'My Rhythm',
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />

        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
          }}
        />

       <Tabs.Screen
      name="paywall"
      options={{
      href: null,
  }}
/>
      </Tabs>

      <OnboardingModal
  visible={
    onboardingHasLoaded &&
    onboardingIsVisible
  }
 onComplete={() => {
  setOnboardingIsVisible(false);

  setAppRefreshKey(
    (currentKey) => currentKey + 1,
  );
}}
/>
    </>
  );
}