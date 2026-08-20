import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import SectionCard from '../SectionCard';

import {
  flowOptions,
} from '@/lib/flow';

import type {
  FlowLevel,
} from '@/lib/flow';

import {
  sleepQualityOptions,
} from '@/lib/sleep';

import type { SleepLog } from '@/lib/sleep';

type Props = {
  selectedMood: string | null;
  selectedSymptoms: string[];
  selectedSupplements: string[];
  selectedFlow: FlowLevel | null;
  selectedSleep: SleepLog | null;
  showFlow: boolean;
  onMoodPress: () => void;
  onSymptomsPress: () => void;
  onSupplementsPress: () => void;
  onFlowPress: () => void;
  onSleepPress: () => void;
};

export default function QuickLogCard({
  selectedMood,
  selectedSymptoms,
  selectedSupplements,
  selectedFlow,
  selectedSleep,
  showFlow,
  onMoodPress,
  onSymptomsPress,
  onSupplementsPress,
  onFlowPress,
  onSleepPress,
}: Props) {

const selectedFlowEmoji =
  flowOptions.find(
    (option) =>
      option.level === selectedFlow,
  )?.emoji ?? '🌸';

const selectedSleepEmoji =
  sleepQualityOptions.find(
    (option) =>
      option.quality ===
      selectedSleep?.quality,
  )?.emoji ?? '😴';

  return (
    <SectionCard title="Quick Log">
      <View style={styles.quickLogGrid}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log today's mood"
          onPress={onMoodPress}
          style={({ pressed }) => [
            styles.quickLogButton,
            selectedMood && styles.quickLogButtonSelected,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.quickLogEmoji}>
            {selectedMood ? selectedMood.split(' ')[0] : '🙂'}
          </Text>

          <Text style={styles.quickLogLabel}>Mood</Text>

          {selectedMood && (
            <Text style={styles.quickLogValue}>
              {selectedMood}
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log today's symptoms"
          onPress={onSymptomsPress}
          style={({ pressed }) => [
            styles.quickLogButton,
            selectedSymptoms.length > 0 &&
              styles.quickLogButtonSelected,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.quickLogEmoji}>
          🔥
          </Text>

          <Text style={styles.quickLogLabel}>Symptoms</Text>

          {selectedSymptoms.length > 0 ? (
            <Text style={styles.quickLogValue}>
              {selectedSymptoms.length}{' '}
              {selectedSymptoms.length === 1
                ? 'symptom'
                : 'symptoms'}
            </Text>
          ) : (
            <Text style={styles.comingSoon}>
              Tap to log
            </Text>
          )}
        </Pressable>

<Pressable
  accessibilityRole="button"
  accessibilityLabel="Log today's supplements"
  onPress={onSupplementsPress}
  style={({ pressed }) => [
    styles.quickLogButton,
    selectedSupplements.length > 0 &&
      styles.quickLogButtonSelected,
    pressed && styles.buttonPressed,
  ]}>
  <Text style={styles.quickLogEmoji}>
    💊
  </Text>

  <Text style={styles.quickLogLabel}>
    Supplements
  </Text>

  {selectedSupplements.length > 0 ? (
    <Text style={styles.quickLogValue}>
      {selectedSupplements.length}{' '}
      {selectedSupplements.length === 1
        ? 'supplement'
        : 'supplements'}
    </Text>
  ) : (
    <Text style={styles.comingSoon}>
      Tap to log
    </Text>
  )}
</Pressable>

{showFlow && (
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Log today's flow"
  onPress={onFlowPress}
  style={({ pressed }) => [
    styles.quickLogButton,
    selectedFlow && styles.quickLogButtonSelected,
    pressed && styles.buttonPressed,
  ]}>
  <Text style={styles.quickLogEmoji}>
{selectedFlowEmoji}
  </Text>

  <Text style={styles.quickLogLabel}>Flow</Text>

  {selectedFlow ? (
    <Text style={styles.quickLogValue}>
      {selectedFlow}
    </Text>
  ) : (
    <Text style={styles.comingSoon}>
      Tap to log
    </Text>
  )}
</Pressable>
)}

        <Pressable
  accessibilityRole="button"
  accessibilityLabel="Log last night's sleep"
  onPress={onSleepPress}
  style={({ pressed }) => [
    styles.quickLogButton,
    selectedSleep &&
      styles.quickLogButtonSelected,
    pressed && styles.buttonPressed,
  ]}>
  <Text style={styles.quickLogEmoji}>
{selectedSleepEmoji}
  </Text>

  <Text style={styles.quickLogLabel}>
    Sleep
  </Text>

  {selectedSleep ? (
    <Text style={styles.quickLogValue}>
      {selectedSleep.quality}
      {' · '}
      {selectedSleep.duration}
    </Text>
  ) : (
    <Text style={styles.comingSoon}>
      Tap to log
    </Text>
  )}
</Pressable>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  quickLogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  quickLogButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },

  quickLogButtonSelected: {
    borderColor: Colors.gold,
    borderWidth: 1,
  },

  quickLogEmoji: {
    fontSize: 28,
  },

  quickLogLabel: {
    color: Colors.text,
    fontWeight: '700',
  },

  quickLogValue: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  comingSoon: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});