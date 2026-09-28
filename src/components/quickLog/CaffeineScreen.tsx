import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  caffeineAmountOptions,
} from '@/lib/caffeine';

import type {
  CaffeineAmount,
  CaffeineLog,
  CaffeineTimeOfDay,
} from '@/lib/caffeine';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  selectedCaffeine: CaffeineLog | null;

  onSave: (
    caffeine: CaffeineLog,
  ) => void | Promise<void>;
};

export default function CaffeineScreen({
  selectedCaffeine,
  onSave,
}: Props) {
  const [amount, setAmount] =
    useState<CaffeineAmount | null>(
      selectedCaffeine?.amount ?? null,
    );

  const [lastDrinkTime, setLastDrinkTime] =
    useState<CaffeineTimeOfDay | null>(
      selectedCaffeine?.lastDrinkTime ?? null,
    );

  useEffect(() => {
    setAmount(
      selectedCaffeine?.amount ?? null,
    );

    setLastDrinkTime(
      selectedCaffeine?.lastDrinkTime ?? null,
    );
  }, [selectedCaffeine]);

  function handleAmountSelect(
    nextAmount: CaffeineAmount,
  ) {
    setAmount(nextAmount);

    if (nextAmount === 'None') {
      setLastDrinkTime(null);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.helperText}>
        How much caffeine have you had today?
      </Text>

      <View style={styles.options}>
        {caffeineAmountOptions.map(
          (option) => {
            const isSelected =
              amount === option.amount;

            return (
              <Pressable
                key={option.amount}
                accessibilityRole="button"
                accessibilityLabel={
                  option.label
                }
                onPress={() =>
                  handleAmountSelect(
                    option.amount,
                  )
                }
                style={({ pressed }) => [
                  styles.option,
                  isSelected &&
                    styles.optionSelected,
                  pressed &&
                    styles.buttonPressed,
                ]}>
                <Text style={styles.emoji}>
                  {option.emoji}
                </Text>

                <Text
                  style={[
                    styles.optionText,
                    isSelected &&
                      styles.optionTextSelected,
                  ]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      {amount !== null &&
        amount !== 'None' && (
          <View style={styles.timeSection}>
            <View>
              <Text style={styles.timeLabel}>
                When was your last caffeinated
                drink?
              </Text>

              <Text style={styles.optionalText}>
                Optional
              </Text>
            </View>

            <View style={styles.timeOptions}>
              {(
                [
                  'Morning',
                  'Afternoon',
                  'Evening',
                ] as CaffeineTimeOfDay[]
              ).map((time) => {
                const isSelected =
                  lastDrinkTime === time;

                return (
                  <Pressable
                    key={time}
                    accessibilityRole="button"
                    accessibilityLabel={time}
                    onPress={() =>
                      setLastDrinkTime(
                        isSelected
                          ? null
                          : time,
                      )
                    }
                    style={({ pressed }) => [
                      styles.timeOption,
                      isSelected &&
                        styles.timeOptionSelected,
                      pressed &&
                        styles.buttonPressed,
                    ]}>
                    <Text
                      style={[
                        styles.timeOptionText,
                        isSelected &&
                          styles.timeOptionTextSelected,
                      ]}>
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save caffeine"
        disabled={amount === null}
        onPress={() => {
          if (amount === null) {
            return;
          }

          void onSave({
            amount,
            lastDrinkTime:
              amount === 'None'
                ? undefined
                : lastDrinkTime ??
                  undefined,
          });
        }}
        style={({ pressed }) => [
          styles.saveButton,
          amount === null &&
            styles.saveButtonDisabled,
          pressed &&
            amount !== null &&
            styles.buttonPressed,
        ]}>
        <Text style={styles.saveButtonText}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },

  helperText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  options: {
    gap: Spacing.sm,
  },

  option: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },

  optionSelected: {
    borderColor: Colors.gold,
    backgroundColor: Colors.surface,
  },

  emoji: {
    fontSize: 22,
  },

  optionText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },

  optionTextSelected: {
    color: Colors.gold,
    fontWeight: '800',
  },

  timeSection: {
    gap: Spacing.sm,
  },

  timeLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },

  optionalText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  timeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  timeOption: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
  },

  timeOptionSelected: {
    borderColor: Colors.gold,
    backgroundColor: Colors.surface,
  },

  timeOptionText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  timeOptionTextSelected: {
    color: Colors.gold,
    fontWeight: '800',
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
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});