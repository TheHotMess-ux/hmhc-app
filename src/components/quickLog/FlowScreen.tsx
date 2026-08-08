import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { FlowLevel } from '@/lib/flow';
import { flowOptions } from '@/lib/flow';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  selectedFlow: FlowLevel | null;
  startsNewPeriod: boolean;
  endsPeriod: boolean;

  onSave: (
    flow: FlowLevel,
    startsNewPeriod: boolean,
    endsPeriod: boolean,
  ) => void | Promise<void>;
};

export default function FlowScreen({
  selectedFlow,
  startsNewPeriod,
  endsPeriod,
  onSave,
}: Props) {

  const [draftFlow, setDraftFlow] =
    useState<FlowLevel | null>(selectedFlow);

  const [draftStartsNewPeriod, setDraftStartsNewPeriod] =
    useState(startsNewPeriod);

    const [draftEndsPeriod, setDraftEndsPeriod] =
  useState(endsPeriod);

  useEffect(() => {
  setDraftFlow(selectedFlow);
  setDraftStartsNewPeriod(startsNewPeriod);
  setDraftEndsPeriod(endsPeriod);
}, [
  selectedFlow,
  startsNewPeriod,
  endsPeriod,
]);

  const canStartNewPeriod =
    draftFlow === 'Light' ||
    draftFlow === 'Moderate' ||
    draftFlow === 'Heavy';

    const canEndPeriod =
  draftFlow !== 'None';

  function selectFlow(flow: FlowLevel) {
  setDraftFlow(flow);

  if (
    flow === 'None' ||
    flow === 'Spotting'
  ) {
    setDraftStartsNewPeriod(false);
  }

  if (flow === 'None') {
    setDraftEndsPeriod(false);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        How would you describe today&apos;s bleeding?
      </Text>

      <View style={styles.optionList}>
        {flowOptions.map((option) => {
          const isSelected = draftFlow === option.level;

          return (
            <Pressable
              key={option.level}
              accessibilityRole="radio"
              accessibilityState={{
                selected: isSelected,
              }}
              accessibilityLabel={option.label}
              onPress={() => selectFlow(option.level)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}>
              <Text style={styles.emoji}>
                {option.emoji}
              </Text>

              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                ]}>
                {option.level === 'None'
                  ? 'No bleeding today'
                  : option.label}
              </Text>

              {isSelected && (
                <Text style={styles.check}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {canStartNewPeriod && (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: draftStartsNewPeriod,
          }}
          accessibilityLabel="This starts a new period"
          onPress={() => {
  setDraftStartsNewPeriod(
    (currentValue) => !currentValue,
  );

  if (!draftStartsNewPeriod) {
    setDraftEndsPeriod(false);
  }
}}
          style={({ pressed }) => [
            styles.periodStartCard,
            draftStartsNewPeriod &&
              styles.periodStartCardSelected,
            pressed && styles.optionPressed,
          ]}>
          <View
            style={[
              styles.checkbox,
              draftStartsNewPeriod &&
                styles.checkboxSelected,
            ]}>
            {draftStartsNewPeriod && (
              <Text style={styles.checkboxCheck}>
                ✓
              </Text>
            )}
          </View>

          <View style={styles.periodStartText}>
            <Text style={styles.periodStartTitle}>
              This starts a new period
            </Text>

            <Text style={styles.periodStartDescription}>
              This helps us understand your cycle and
              menopause journey over time.
            </Text>
          </View>
        </Pressable>
      )}

      {canEndPeriod && (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{
      checked: draftEndsPeriod,
    }}
    accessibilityLabel="This is the last day of my period"
    onPress={() => {
      setDraftEndsPeriod(
        (currentValue) => !currentValue,
      );

      if (!draftEndsPeriod) {
        setDraftStartsNewPeriod(false);
      }
    }}
    style={({ pressed }) => [
      styles.periodStartCard,
      draftEndsPeriod &&
        styles.periodStartCardSelected,
      pressed && styles.optionPressed,
    ]}>
    <View
      style={[
        styles.checkbox,
        draftEndsPeriod &&
          styles.checkboxSelected,
      ]}>
      {draftEndsPeriod && (
        <Text style={styles.checkboxCheck}>
          ✓
        </Text>
      )}
    </View>

    <View style={styles.periodStartText}>
      <Text style={styles.periodStartTitle}>
        This is the last day of my period
      </Text>

      <Text style={styles.periodStartDescription}>
        This helps us track how long your bleeding lasts over time.
      </Text>
    </View>
  </Pressable>
)}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save bleeding"
        disabled={!draftFlow}
        onPress={() => {
          if (!draftFlow) {
            return;
          }

          onSave(
  draftFlow,
  canStartNewPeriod
    ? draftStartsNewPeriod
    : false,
  canEndPeriod
    ? draftEndsPeriod
    : false,
);
        }}
        style={({ pressed }) => [
          styles.saveButton,
          !draftFlow && styles.saveButtonDisabled,
          pressed && styles.optionPressed,
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
    gap: Spacing.lg,
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
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
    fontSize: 24,
  },

  label: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  labelSelected: {
    color: Colors.gold,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },

  periodStartCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  periodStartCardSelected: {
    borderColor: Colors.gold,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderColor: Colors.border,
    borderRadius: 6,
    borderWidth: 1,
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

  periodStartText: {
    flex: 1,
    gap: 4,
  },

  periodStartTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  periodStartDescription: {
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