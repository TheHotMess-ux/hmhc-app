import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { symptomCategories } from '@/lib/symptoms';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

const CUSTOM_SYMPTOMS_KEY = 'hmhcCustomSymptoms';

const builtInSymptomLabels = symptomCategories.flatMap(
  (category) =>
    category.symptoms.map((symptom) => symptom.label),
);

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

  const [customSymptoms, setCustomSymptoms] =
    useState<string[]>([]);

  const [customSymptomDraft, setCustomSymptomDraft] =
    useState('');

  const [customSymptomError, setCustomSymptomError] =
    useState<string | null>(null);

  useEffect(() => {
    setDraftSymptoms(selectedSymptoms);
  }, [selectedSymptoms]);

  useEffect(() => {
    async function loadCustomSymptoms() {
      try {
        const savedCustomSymptoms =
          await AsyncStorage.getItem(
            CUSTOM_SYMPTOMS_KEY,
          );

        if (!savedCustomSymptoms) {
          return;
        }

        const parsedCustomSymptoms =
          JSON.parse(savedCustomSymptoms);

        if (!Array.isArray(parsedCustomSymptoms)) {
          return;
        }

        setCustomSymptoms(
          parsedCustomSymptoms.filter(
            (symptom): symptom is string =>
              typeof symptom === 'string',
          ),
        );
      } catch (error) {
        console.error(
          'Unable to load custom symptoms:',
          error,
        );
      }
    }

    void loadCustomSymptoms();
  }, []);

  function toggleSymptom(label: string) {
    setDraftSymptoms((currentSymptoms) =>
      currentSymptoms.includes(label)
        ? currentSymptoms.filter(
            (symptom) => symptom !== label,
          )
        : [...currentSymptoms, label],
    );
  }

  async function addCustomSymptom() {
    const cleanedLabel =
      customSymptomDraft
        .trim()
        .replace(/\s+/g, ' ');

    if (!cleanedLabel) {
      return;
    }

    const existingLabel = [
      ...builtInSymptomLabels,
      ...customSymptoms,
    ].find(
      (label) =>
        label.toLowerCase() ===
        cleanedLabel.toLowerCase(),
    );

    if (existingLabel) {
      setDraftSymptoms((currentSymptoms) =>
        currentSymptoms.includes(existingLabel)
          ? currentSymptoms
          : [...currentSymptoms, existingLabel],
      );

      setCustomSymptomDraft('');
      setCustomSymptomError(
        'Already on the list—we selected it for you.',
      );

      return;
    }

    const updatedCustomSymptoms = [
      ...customSymptoms,
      cleanedLabel,
    ];

    setCustomSymptoms(updatedCustomSymptoms);

    setDraftSymptoms((currentSymptoms) => [
      ...currentSymptoms,
      cleanedLabel,
    ]);

    setCustomSymptomDraft('');
    setCustomSymptomError(null);

    try {
      await AsyncStorage.setItem(
        CUSTOM_SYMPTOMS_KEY,
        JSON.stringify(updatedCustomSymptoms),
      );
    } catch (error) {
      console.error(
        'Unable to save custom symptom:',
        error,
      );

      setCustomSymptomError(
        'We could not save that symptom. Please try again.',
      );
    }
  }

  function renderSymptomOption(
    id: string,
    label: string,
    emoji: string,
  ) {
    const isSelected =
      draftSymptoms.includes(label);

    return (
      <Pressable
        key={id}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: isSelected,
        }}
        accessibilityLabel={label}
        onPress={() => toggleSymptom(label)}
        style={({ pressed }) => [
          styles.symptomOption,
          isSelected &&
            styles.symptomOptionSelected,
          pressed && styles.optionPressed,
        ]}>
        <Text style={styles.emoji}>
          {emoji}
        </Text>

        <Text
          style={[
            styles.symptomLabel,
            isSelected &&
              styles.symptomLabelSelected,
          ]}>
          {label}
        </Text>

        {isSelected && (
          <Text style={styles.check}>
            ✓
          </Text>
        )}
      </Pressable>
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.customSection}>
          <Text style={styles.categoryTitle}>
            ✍️ Add Your Own
          </Text>

          <Text style={styles.customDescription}>
            Tracking something that is not listed?
            Add it here and we’ll remember it.
          </Text>

          <View style={styles.customInputRow}>
            <TextInput
              accessibilityLabel="Custom symptom"
              autoCapitalize="sentences"
              maxLength={60}
              onChangeText={(value) => {
                setCustomSymptomDraft(value);
                setCustomSymptomError(null);
              }}
              onSubmitEditing={() => {
                void addCustomSymptom();
              }}
              placeholder="Type a symptom"
              placeholderTextColor={
                Colors.textSecondary
              }
              returnKeyType="done"
              style={styles.customInput}
              value={customSymptomDraft}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add custom symptom"
              disabled={
                customSymptomDraft.trim().length === 0
              }
              onPress={() => {
                void addCustomSymptom();
              }}
              style={({ pressed }) => [
                styles.addButton,
                customSymptomDraft.trim().length === 0 &&
                  styles.addButtonDisabled,
                pressed && styles.optionPressed,
              ]}>
              <Text style={styles.addButtonText}>
                Add
              </Text>
            </Pressable>
          </View>

          {customSymptomError && (
            <Text style={styles.customError}>
              {customSymptomError}
            </Text>
          )}
        </View>

        {customSymptoms.length > 0 && (
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>
              ⭐ Your Symptoms
            </Text>

            <View style={styles.symptomList}>
              {customSymptoms.map(
                (symptom, index) =>
                  renderSymptomOption(
                    `custom-${index}-${symptom}`,
                    symptom,
                    '✦',
                  ),
              )}
            </View>
          </View>
        )}

        {symptomCategories.map((category) => (
          <View
            key={category.id}
            style={styles.category}>
            <Text style={styles.categoryTitle}>
              {category.emoji} {category.title}
            </Text>

            <View style={styles.symptomList}>
              {category.symptoms.map((symptom) =>
                renderSymptomOption(
                  symptom.id,
                  symptom.label,
                  symptom.emoji,
                ),
              )}
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
    flexShrink: 1,
    minHeight: 0,
    gap: Spacing.md,
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
    color: Colors.text,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },

  customSection: {
    gap: Spacing.sm,
  },

  customDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  customInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  customInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: Colors.text,
    fontSize: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
  },

  addButtonDisabled: {
    opacity: 0.4,
  },

  addButtonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '800',
  },

  customError: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  saveButton: {
    alignItems: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
});