import { useState } from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    fitnessOptions,
    type FitnessLog,
    type FitnessType,
} from '@/lib/fitness';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  selectedFitness: FitnessLog | null;
  onSave: (
    fitness: FitnessLog,
  ) => void | Promise<void>;
};

export default function FitnessScreen({
  selectedFitness,
  onSave,
}: Props) {
  const [
    draftActivities,
    setDraftActivities,
  ] = useState<FitnessType[]>(
    selectedFitness?.activities ?? [],
  );

  const toggleActivity = (
    activity: FitnessType,
  ) => {
    setDraftActivities(
      (currentActivities) => {
        if (activity === 'Rest Day') {
          return currentActivities.includes(
            'Rest Day',
          )
            ? []
            : ['Rest Day'];
        }

        const withoutRestDay =
          currentActivities.filter(
            (item) =>
              item !== 'Rest Day',
          );

        if (
          withoutRestDay.includes(
            activity,
          )
        ) {
          return withoutRestDay.filter(
            (item) =>
              item !== activity,
          );
        }

        return [
          ...withoutRestDay,
          activity,
        ];
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        How did you move today?
      </Text>

      <Text style={styles.helperText}>
        Pick everything that applies.
        Rest counts too.
      </Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.options
        }
        showsVerticalScrollIndicator={
          false
        }>
        {fitnessOptions.map(
          (option) => {
            const isSelected =
              draftActivities.includes(
                option.type,
              );

            return (
              <Pressable
                key={option.type}
                accessibilityRole="button"
                accessibilityLabel={`Log ${option.label}`}
                onPress={() =>
                  toggleActivity(
                    option.type,
                  )
                }
                style={({ pressed }) => [
                  styles.option,
                  isSelected &&
                    styles.optionSelected,
                  pressed &&
                    styles.pressed,
                ]}>
                <Text
                  style={styles.emoji}>
                  {option.emoji}
                </Text>

                <View
                  style={
                    styles.optionTextGroup
                  }>
                  <Text
                    style={
                      styles.optionTitle
                    }>
                    {option.label}
                  </Text>

                  <Text
                    style={
                      styles.optionDescription
                    }>
                    {option.description}
                  </Text>
                </View>

                {isSelected && (
                  <Text
                    style={styles.check}>
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          },
        )}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save fitness"
        onPress={() => {
          void onSave({
            activities:
              draftActivities,
          });
        }}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.pressed,
        ]}>
        <Text
          style={styles.saveButtonText}>
          Done
          {draftActivities.length > 0
            ? ` · ${draftActivities.length} selected`
            : ''}
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

  subtitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },

  helperText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

 scroll: {
  flexShrink: 1,
},

  options: {
    gap: Spacing.sm,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  optionSelected: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },

  emoji: {
    fontSize: 24,
  },

  optionTextGroup: {
    flex: 1,
    gap: 3,
  },

  optionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  optionDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
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
    opacity: 0.7,
  },
});