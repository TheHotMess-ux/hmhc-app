import { Ionicons } from '@expo/vector-icons';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    TrackingPreference,
} from '@/lib/profile';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  value: TrackingPreference;
  onChange: (
    value: TrackingPreference,
  ) => void;
  showHeading?: boolean;
};

export default function TrackingPreferenceCard({
  value,
  onChange,
  showHeading = true,
}: Props) {
  return (
    <View style={styles.card}>
      {showHeading && (
        <View style={styles.heading}>
          <Text style={styles.title}>
            Tracking Experience
          </Text>

          <Text style={styles.description}>
            Choose which tools feel useful for your
            body. This can be changed anytime.
          </Text>
        </View>
      )}

      <View style={styles.options}>
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{
            selected: value === 'cycle',
          }}
          accessibilityLabel="Show cycle and bleeding tools"
          onPress={() => onChange('cycle')}
          style={({ pressed }) => [
            styles.option,
            value === 'cycle' &&
              styles.optionSelected,
            pressed && styles.buttonPressed,
          ]}>
          <View style={styles.icon}>
            <Ionicons
              name="calendar-outline"
              color={Colors.gold}
              size={24}
            />
          </View>

          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                value === 'cycle' &&
                  styles.optionTitleSelected,
              ]}>
              Show cycle & bleeding tools
            </Text>

            <Text style={styles.optionDescription}>
              Include Flow, cycle-day information,
              period prompts, and hormone-phase
              guidance.
            </Text>
          </View>

          {value === 'cycle' && (
            <Ionicons
              name="checkmark-circle"
              color={Colors.gold}
              size={22}
            />
          )}
        </Pressable>

        <Pressable
          accessibilityRole="radio"
          accessibilityState={{
            selected: value === 'wellness',
          }}
          accessibilityLabel="Focus on symptoms and wellness"
          onPress={() => onChange('wellness')}
          style={({ pressed }) => [
            styles.option,
            value === 'wellness' &&
              styles.optionSelected,
            pressed && styles.buttonPressed,
          ]}>
          <View style={styles.icon}>
            <Ionicons
              name="heart-outline"
              color={Colors.gold}
              size={24}
            />
          </View>

          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                value === 'wellness' &&
                  styles.optionTitleSelected,
              ]}>
              Focus on symptoms & wellness
            </Text>

            <Text style={styles.optionDescription}>
              Keep mood, symptoms, sleep,
              supplements, insights, and reports
              without period-focused prompts.
            </Text>
          </View>

          {value === 'wellness' && (
            <Ionicons
              name="checkmark-circle"
              color={Colors.gold}
              size={22}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  heading: {
    gap: Spacing.sm,
  },

  title: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: '900',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  options: {
    gap: Spacing.sm,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  optionSelected: {
    borderColor: Colors.gold,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionText: {
    flex: 1,
    gap: 4,
  },

  optionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  optionTitleSelected: {
    color: Colors.gold,
  },

  optionDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  buttonPressed: {
    opacity: 0.72,
  },
});