import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import type {
    ReactNode,
} from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    canAccessPremiumFeature,
} from '@/lib/access';

import type {
    PremiumFeature,
} from '@/lib/access';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  feature: PremiumFeature;
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function PremiumGate({
  feature,
  children,
  title =
    'This is an HMHC Premium feature',
  description =
    'Unlock deeper patterns, doctor-ready reports, and tools designed to reduce the mental load.',
}: Props) {
  const hasAccess =
    canAccessPremiumFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <View style={styles.lockedCard}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="lock-closed"
          color={Colors.background}
          size={27}
        />
      </View>

      <Text style={styles.eyebrow}>
        HMHC PREMIUM
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View HMHC Premium"
        onPress={() =>
          router.push('/paywall')
        }
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={styles.buttonText}>
          Explore HMHC Premium
        </Text>

        <Ionicons
          name="arrow-forward"
          color={Colors.background}
          size={19}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  lockedCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  title: {
    color: Colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    alignSelf: 'stretch',
  },

  buttonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});