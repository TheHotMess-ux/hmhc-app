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

import type { FitnessLog } from '@/lib/fitness';

import type { CaffeineLog } from '@/lib/caffeine';

import type { AlcoholLog } from '@/lib/alcohol';

type Props = {
  selectedMood: string | null;
  selectedSymptoms: string[];
  selectedSupplements: string[];
  selectedCaffeine: CaffeineLog | null;
  selectedAlcohol: AlcoholLog | null;
  selectedFlow: FlowLevel | null;
  selectedSleep: SleepLog | null;
  selectedFitness: FitnessLog | null;
  selectedNotes: string;
  showFlow: boolean;
  showCaffeine: boolean;
  showAlcohol: boolean;
  onMoodPress: () => void;
  onSymptomsPress: () => void;
  onSupplementsPress: () => void;
  onFlowPress: () => void;
  onSleepPress: () => void;
  onFitnessPress: () => void;
  onCaffeinePress: () => void;
  onAlcoholPress: () => void;
  onNotesPress: () => void;
};

export default function QuickLogCard({
  selectedMood,
  selectedSymptoms,
  selectedSupplements,
  selectedFlow,
  selectedSleep,
  selectedFitness,
  selectedCaffeine,
  selectedAlcohol,
  selectedNotes,
  showFlow,
  showCaffeine,
  showAlcohol,
  onMoodPress,
  onSymptomsPress,
  onSupplementsPress,
  onFlowPress,
  onSleepPress,
  onFitnessPress,
  onCaffeinePress,
  onAlcoholPress,
  onNotesPress,
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
    <SectionCard
  title="Quick Log"
  compact
>
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

{selectedMood ? (
  <Text style={styles.quickLogValue}>
    {selectedMood}
  </Text>
) : (
  <Text style={styles.comingSoon}>
    Tap to log
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

<Pressable
  accessibilityRole="button"
  accessibilityLabel="Log today's fitness"
  onPress={onFitnessPress}
 style={({ pressed }) => [
  styles.quickLogButton,
  selectedFitness &&
    styles.quickLogButtonSelected,
  pressed && styles.buttonPressed,
]}>
  <Text style={styles.quickLogEmoji}>
    🏋️
  </Text>

  <Text style={styles.quickLogLabel}>
    Fitness
  </Text>

  {selectedFitness?.activities.length ? (
  <Text style={styles.quickLogValue}>
    {selectedFitness.activities.length}{' '}
    {selectedFitness.activities.length === 1
      ? 'activity'
      : 'activities'}
  </Text>
) : (
  <Text style={styles.comingSoon}>
    Tap to log
  </Text>
)}
</Pressable>

{showCaffeine && (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Log caffeine for today"
    onPress={onCaffeinePress}
    style={({ pressed }) => [
      styles.quickLogButton,
      selectedCaffeine !== null &&
        styles.quickLogButtonSelected,
      pressed && styles.buttonPressed,
    ]}>
    <Text style={styles.quickLogEmoji}>
      ☕
    </Text>

    <Text style={styles.quickLogLabel}>
      Caffeine
    </Text>

    {selectedCaffeine !== null ? (
      <Text style={styles.quickLogValue}>
        {selectedCaffeine.amount}
      </Text>
    ) : (
      <Text style={styles.comingSoon}>
        Tap to log
      </Text>
    )}
  </Pressable>
)}

{showAlcohol && (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Log alcohol for today"
    onPress={onAlcoholPress}
    style={({ pressed }) => [
      styles.quickLogButton,
      selectedAlcohol !== null &&
        styles.quickLogButtonSelected,
      pressed && styles.buttonPressed,
    ]}>
    <Text style={styles.quickLogEmoji}>
      🍷
    </Text>

    <Text style={styles.quickLogLabel}>
      Alcohol
    </Text>

    {selectedAlcohol !== null ? (
      <Text style={styles.quickLogValue}>
        {selectedAlcohol.amount}
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
  accessibilityLabel="Add notes for today"
  onPress={onNotesPress}
  style={({ pressed }) => [
    styles.quickLogButton,
    selectedNotes.length > 0 &&
      styles.quickLogButtonSelected,
    pressed && styles.buttonPressed,
  ]}>
  <Text style={styles.quickLogEmoji}>
    📝
  </Text>

  <Text style={styles.quickLogLabel}>
    Notes
  </Text>

  {selectedNotes.length > 0 ? (
    <Text style={styles.quickLogValue}>
      Note added
    </Text>
  ) : (
    <Text style={styles.comingSoon}>
      Tap to add
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
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: '47%',
  minHeight: 96,
  backgroundColor: Colors.surface,
  borderRadius: 14,
  paddingHorizontal: Spacing.sm,
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
},

  quickLogButtonSelected: {
    borderColor: Colors.gold,
    borderWidth: 1,
  },

  quickLogEmoji: {
    fontSize: 25,
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