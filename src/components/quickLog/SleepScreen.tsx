import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  sleepDurationOptions,
  sleepQualityOptions,
} from '@/lib/sleep';

import type {
  SleepDuration,
  SleepLog,
  SleepQuality,
} from '@/lib/sleep';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  selectedSleep: SleepLog | null;

  onSave: (
    sleep: SleepLog,
  ) => void | Promise<void>;
};

export default function SleepScreen({
  selectedSleep,
  onSave,
}: Props) {
  const [draftQuality, setDraftQuality] =
    useState<SleepQuality | null>(
      selectedSleep?.quality ?? null,
    );

  const [draftDuration, setDraftDuration] =
    useState<SleepDuration | null>(
      selectedSleep?.duration ?? null,
    );

  const [draftWokeFrequently, setDraftWokeFrequently] =
    useState(
      selectedSleep?.wokeFrequently ?? false,
    );

  const [draftNightSweats, setDraftNightSweats] =
    useState(
      selectedSleep?.nightSweats ?? false,
    );

  useEffect(() => {
    setDraftQuality(
      selectedSleep?.quality ?? null,
    );

    setDraftDuration(
      selectedSleep?.duration ?? null,
    );

    setDraftWokeFrequently(
      selectedSleep?.wokeFrequently ?? false,
    );

    setDraftNightSweats(
      selectedSleep?.nightSweats ?? false,
    );
  }, [selectedSleep]);

  const canSave =
    draftQuality !== null &&
    draftDuration !== null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Give us the overnight damage report.
          Approximate answers are perfectly acceptable.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            How did you sleep?
          </Text>

          <View style={styles.optionList}>
            {sleepQualityOptions.map((option) => {
              const isSelected =
                draftQuality === option.quality;

              return (
                <Pressable
                  key={option.quality}
                  accessibilityRole="radio"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                  accessibilityLabel={
                    option.label
                  }
                  onPress={() =>
                    setDraftQuality(
                      option.quality,
                    )
                  }
                  style={({ pressed }) => [
                    styles.option,
                    isSelected &&
                      styles.optionSelected,
                    pressed &&
                      styles.optionPressed,
                  ]}>
                  <Text style={styles.emoji}>
                    {option.emoji}
                  </Text>

                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected &&
                          styles.optionLabelSelected,
                      ]}>
                      {option.label}
                    </Text>

                    <Text style={styles.optionValue}>
                      {option.quality}
                    </Text>
                  </View>

                  {isSelected && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Roughly how long?
          </Text>

          <View style={styles.optionList}>
            {sleepDurationOptions.map((option) => {
              const isSelected =
                draftDuration ===
                option.duration;

              return (
                <Pressable
                  key={option.duration}
                  accessibilityRole="radio"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                  accessibilityLabel={
                    option.duration
                  }
                  onPress={() =>
                    setDraftDuration(
                      option.duration,
                    )
                  }
                  style={({ pressed }) => [
                    styles.option,
                    isSelected &&
                      styles.optionSelected,
                    pressed &&
                      styles.optionPressed,
                  ]}>
                  <Text style={styles.emoji}>
                    {option.emoji}
                  </Text>

                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected &&
                        styles.optionLabelSelected,
                    ]}>
                    {option.duration}
                  </Text>

                  {isSelected && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Anything else causing chaos?
          </Text>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: draftWokeFrequently,
            }}
            accessibilityLabel="I woke up frequently"
            onPress={() =>
              setDraftWokeFrequently(
                (currentValue) =>
                  !currentValue,
              )
            }
            style={({ pressed }) => [
              styles.checkboxCard,
              draftWokeFrequently &&
                styles.optionSelected,
              pressed && styles.optionPressed,
            ]}>
            <View
              style={[
                styles.checkbox,
                draftWokeFrequently &&
                  styles.checkboxSelected,
              ]}>
              {draftWokeFrequently && (
                <Text
                  style={styles.checkboxCheck}>
                  ✓
                </Text>
              )}
            </View>

            <View style={styles.checkboxText}>
              <Text style={styles.checkboxTitle}>
                I woke up frequently
              </Text>

              <Text
                style={styles.checkboxDescription}>
                Because apparently uninterrupted
                sleep is a luxury item.
              </Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: draftNightSweats,
            }}
            accessibilityLabel="Night sweats made an appearance"
            onPress={() =>
              setDraftNightSweats(
                (currentValue) =>
                  !currentValue,
              )
            }
            style={({ pressed }) => [
              styles.checkboxCard,
              draftNightSweats &&
                styles.optionSelected,
              pressed && styles.optionPressed,
            ]}>
            <View
              style={[
                styles.checkbox,
                draftNightSweats &&
                  styles.checkboxSelected,
              ]}>
              {draftNightSweats && (
                <Text
                  style={styles.checkboxCheck}>
                  ✓
                </Text>
              )}
            </View>

            <View style={styles.checkboxText}>
              <Text style={styles.checkboxTitle}>
                Night sweats made an appearance
              </Text>

              <Text
                style={styles.checkboxDescription}>
                Woke up marinating in hormonal
                betrayal.
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save sleep"
        disabled={!canSave}
        onPress={() => {
          if (
            !draftQuality ||
            !draftDuration
          ) {
            return;
          }

          onSave({
            quality: draftQuality,
            duration: draftDuration,
            wokeFrequently:
              draftWokeFrequently,
            nightSweats:
              draftNightSweats,
          });
        }}
        style={({ pressed }) => [
          styles.saveButton,
          !canSave &&
            styles.saveButtonDisabled,
          pressed &&
            canSave &&
            styles.optionPressed,
        ]}>
        <Text style={styles.saveButtonText}>
          Done
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    minHeight: 0,
    gap: Spacing.md,
  },

  scrollArea: {
    flexShrink: 1,
  },

  content: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  section: {
    gap: Spacing.sm,
  },

  sectionTitle: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  optionList: {
    gap: Spacing.sm,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  optionSelected: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },

  optionPressed: {
    opacity: 0.7,
  },

  emoji: {
    fontSize: 23,
  },

  optionText: {
    flex: 1,
    gap: 2,
  },

  optionLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  optionLabelSelected: {
  color: Colors.text,
},

  optionValue: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },

  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },

  checkboxCheck: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '900',
  },

  checkboxText: {
    flex: 1,
    gap: 4,
  },

  checkboxTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  checkboxDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  saveButton: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
});