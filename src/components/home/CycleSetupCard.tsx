import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export default function CycleSetupCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="calendar-outline"
          color={Colors.background}
          size={25}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          LEARNING YOUR RHYTHM
        </Text>

        <Text style={styles.title}>
          Cycle tracking hasn&apos;t started yet
        </Text>

        <Text style={styles.description}>
          Log the first day of a period when it
          happens—or add a recent period start in
          My Rhythm. Until then, HMHC won&apos;t
          guess your cycle day or hormone phase.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open My Rhythm"
          onPress={() =>
            router.push('/track')
          }
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.buttonText}>
            Open My Rhythm
          </Text>

          <Ionicons
            name="arrow-forward"
            color={Colors.background}
            size={18}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    gap: Spacing.sm,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  title: {
    color: Colors.text,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },

  buttonText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});