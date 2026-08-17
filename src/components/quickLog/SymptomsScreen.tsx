import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { symptomCategories } from '@/lib/symptoms';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  selectedSymptoms: string[];
  onSave: (
    symptoms: string[],
  ) => void | Promise<void>;
};

export default function SymptomsScreen({
  selectedSymptoms,
  onSave,
}: Props) {
  const [draftSymptoms, setDraftSymptoms] =
    useState<string[]>(selectedSymptoms);

  useEffect(() => {
    setDraftSymptoms(selectedSymptoms);
  }, [selectedSymptoms]);

  function toggleSymptom(label: string) {
    setDraftSymptoms((currentSymptoms) =>
      currentSymptoms.includes(label)
        ? currentSymptoms.filter(
            (symptom) => symptom !== label,
          )
        : [...currentSymptoms, label],
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        What is your body trying to tell you today?
        Choose everything making an appearance.
      </Text>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.categoryList}
        showsVerticalScrollIndicator={false}>
        {symptomCategories.map((category) => (
          <View
            key={category.id}
            style={styles.category}>
            <Text style={styles.categoryTitle}>
              {category.emoji} {category.title}
            </Text>

            <View style={styles.symptomList}>
              {category.symptoms.map((symptom) => {
                const isSelected =
                  draftSymptoms.includes(symptom.label);

                return (
                  <Pressable
                    key={symptom.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked: isSelected,
                    }}
                    accessibilityLabel={
                      symptom.label
                    }
                    onPress={() =>
                      toggleSymptom(symptom.label)
                    }
                    style={({ pressed }) => [
                      styles.symptomOption,
                      isSelected &&
                        styles.symptomOptionSelected,
                      pressed && styles.optionPressed,
                    ]}>
                    <Text style={styles.emoji}>
                      {symptom.emoji}
                    </Text>

                    <Text
                      style={[
                        styles.symptomLabel,
                        isSelected &&
                          styles.symptomLabelSelected,
                      ]}>
                      {symptom.label}
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
        ))}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save symptoms"
        onPress={() => onSave(draftSymptoms)}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.optionPressed,
        ]}>
        <Text style={styles.saveButtonText}>
          Done
          {draftSymptoms.length > 0
            ? ` · ${draftSymptoms.length} selected`
            : ''}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  gap: Spacing.md,
  flexShrink: 1,
  minHeight: 0,
},

  description: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

 scrollArea: {
  flexShrink: 1,
},

  categoryList: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  category: {
    gap: Spacing.sm,
  },

  categoryTitle: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  symptomList: {
    gap: Spacing.sm,
  },

  symptomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  symptomOptionSelected: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },

  optionPressed: {
    opacity: 0.7,
  },

  emoji: {
    fontSize: 23,
  },

  symptomLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  symptomLabelSelected: {
    color: Colors.gold,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },

  saveButton: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
});