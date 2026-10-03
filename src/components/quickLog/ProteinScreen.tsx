import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { ProteinLog } from '@/lib/protein';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

const PROTEIN_GOAL_KEY =
  'hmhcProteinGoal';

const DEFAULT_PROTEIN_GOAL = 100;

type Props = {
  selectedProtein: ProteinLog | null;
  onSave: (
    protein: ProteinLog,
  ) => void | Promise<void>;
};

function sanitizeNumber(
  value: string,
): string {
  return value.replace(/[^0-9]/g, '');
}

export default function ProteinScreen({
  selectedProtein,
  onSave,
}: Props) {
  const [grams, setGrams] =
    useState(
      selectedProtein?.grams
        ? String(selectedProtein.grams)
        : '',
    );

  const [goal, setGoal] =
    useState(
      String(DEFAULT_PROTEIN_GOAL),
    );

  const [goalLoaded, setGoalLoaded] =
    useState(false);

  useEffect(() => {
    async function loadGoal() {
      try {
        const savedGoal =
          await AsyncStorage.getItem(
            PROTEIN_GOAL_KEY,
          );

        if (savedGoal) {
          setGoal(savedGoal);
        }
      } catch (error) {
        console.error(
          'Unable to load protein goal:',
          error,
        );
      } finally {
        setGoalLoaded(true);
      }
    }

    void loadGoal();
  }, []);

  const gramsNumber =
    Number.parseInt(grams, 10) || 0;

  const goalNumber =
    Number.parseInt(goal, 10) || 0;

  const progress =
    goalNumber > 0
      ? Math.round(
          (gramsNumber / goalNumber) *
            100,
        )
      : 0;

  const saveGoal = async () => {
    if (!goalLoaded) {
      return;
    }

    const normalizedGoal =
      String(goalNumber);

    if (goalNumber <= 0) {
      return;
    }

    setGoal(normalizedGoal);

    try {
      await AsyncStorage.setItem(
        PROTEIN_GOAL_KEY,
        normalizedGoal,
      );
    } catch (error) {
      console.error(
        'Unable to save protein goal:',
        error,
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>
          How much protein have you had
          today?
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            accessibilityLabel="Protein consumed today in grams"
            value={grams}
            onChangeText={(value) =>
              setGrams(
                sanitizeNumber(value),
              )
            }
            keyboardType="number-pad"
            maxLength={4}
            placeholder="0"
            placeholderTextColor={
              Colors.textSecondary
            }
            style={styles.numberInput}
          />

          <Text style={styles.unit}>
            g
          </Text>
        </View>
      </View>

      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalCopy}>
            <Text style={styles.goalTitle}>
              Your daily goal
            </Text>

            <Text
              style={
                styles.goalDescription
              }>
              Set this once and we’ll
              remember it.
            </Text>
          </View>

          <View
            style={
              styles.goalInputWrapper
            }>
            <TextInput
              accessibilityLabel="Daily protein goal in grams"
              value={goal}
              onChangeText={(value) =>
                setGoal(
                  sanitizeNumber(value),
                )
              }
              onBlur={() => {
                void saveGoal();
              }}
              keyboardType="number-pad"
              maxLength={4}
              selectTextOnFocus
              style={styles.goalInput}
            />

            <Text style={styles.goalUnit}>
              g
            </Text>
          </View>
        </View>

        {goalNumber > 0 && (
          <View
            style={
              styles.progressSection
            }>
            <Text
              style={styles.progressText}>
              {gramsNumber} /{' '}
              {goalNumber} g · {progress}%
            </Text>

            <View
              style={
                styles.progressTrack
              }>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      progress,
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>

            {gramsNumber >=
              goalNumber && (
              <Text
                style={
                  styles.goalReached
                }>
                ✓ Protein goal hit
              </Text>
            )}
          </View>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save protein"
        onPress={async () => {
          await saveGoal();

          await onSave({
            grams: gramsNumber,
          });
        }}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.pressed,
        ]}>
        <Text
          style={styles.saveButtonText}>
          Done
          {gramsNumber > 0
            ? ` · ${gramsNumber} g`
            : ''}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },

  section: {
    gap: Spacing.sm,
  },

  label: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
  },

  numberInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 32,
    fontWeight: '800',
    paddingVertical: Spacing.md,
    textAlign: 'center',
  },

  unit: {
    color: Colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
  },

  goalCard: {
    backgroundColor:
      Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  goalCopy: {
    flex: 1,
    gap: 3,
  },

  goalTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  goalDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  goalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
  },

  goalInput: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 48,
    paddingVertical: 8,
    textAlign: 'right',
  },

  goalUnit: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  progressSection: {
    gap: Spacing.sm,
  },

  progressText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  progressTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 999,
  },

  goalReached: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
  },

  saveButton: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.8,
  },
});
