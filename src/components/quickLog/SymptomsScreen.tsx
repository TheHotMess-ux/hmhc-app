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

import type {
  SymptomDetailsMap,
} from '@/lib/symptoms';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

const CUSTOM_SYMPTOMS_KEY = 'hmhcCustomSymptoms';

const builtInSymptomLabels = symptomCategories.flatMap(
  (category) =>
    category.symptoms.map((symptom) => symptom.label),
);

type Props = {
  selectedSymptoms: string[];
  selectedSymptomDetails?: SymptomDetailsMap;

  onSave: (
    symptoms: string[],
    symptomDetails: SymptomDetailsMap,
  ) => void | Promise<void>;
};

export default function SymptomsScreen({
  selectedSymptoms,
  selectedSymptomDetails = {},
  onSave,
}: Props) {

  const [draftSymptoms, setDraftSymptoms] =
    useState<string[]>(selectedSymptoms);

const [
  draftSymptomDetails,
  setDraftSymptomDetails,
] = useState<SymptomDetailsMap>(
  selectedSymptomDetails,
);

  const [customSymptoms, setCustomSymptoms] =
    useState<string[]>([]);

  const [customSymptomDraft, setCustomSymptomDraft] =
    useState('');

  const [customSymptomError, setCustomSymptomError] =
    useState<string | null>(null);

  useEffect(() => {
  setDraftSymptoms(selectedSymptoms);
  setDraftSymptomDetails(
    selectedSymptomDetails,
  );
}, [
  selectedSymptoms,
  selectedSymptomDetails,
]);

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
  setDraftSymptoms((currentSymptoms) => {
    const isRemoving =
      currentSymptoms.includes(label);

    if (isRemoving) {
      setDraftSymptomDetails(
        (currentDetails) => {
          const updatedDetails = {
            ...currentDetails,
          };

          delete updatedDetails[label];

          return updatedDetails;
        },
      );

      return currentSymptoms.filter(
        (symptom) => symptom !== label,
      );
    }

    return [...currentSymptoms, label];
  });
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
  <View
    key={id}
    style={styles.symptomWrapper}>
    <Pressable
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

{isSelected && (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{
      checked:
        draftSymptomDetails[label]
          ?.discussWithDoctor === true,
    }}
    accessibilityLabel={
      `Talk to my doctor about ${label}`
    }
    onPress={() => {
      setDraftSymptomDetails(
        (currentDetails) => {
          const isFlagged =
            currentDetails[label]
              ?.discussWithDoctor === true;

          return {
            ...currentDetails,
            [label]: {
              ...currentDetails[label],
              discussWithDoctor:
                !isFlagged,
            },
          };
        },
      );
    }}
    style={({ pressed }) => [
      styles.doctorFlag,
      draftSymptomDetails[label]
        ?.discussWithDoctor === true &&
        styles.doctorFlagSelected,
      pressed && styles.optionPressed,
    ]}>
    <Text style={styles.doctorFlagIcon}>
      🚩
    </Text>

    <Text
      style={[
        styles.doctorFlagText,
        draftSymptomDetails[label]
          ?.discussWithDoctor === true &&
          styles.doctorFlagTextSelected,
      ]}>
      {draftSymptomDetails[label]
        ?.discussWithDoctor === true
        ? 'Added to my doctor list'
        : 'Talk to my doctor about this'}
    </Text>

    {draftSymptomDetails[label]
      ?.discussWithDoctor === true && (
      <Text style={styles.check}>
        ✓
      </Text>
    )}
  </Pressable>
)}

    {label === 'Cramps' && isSelected && (
      <View style={styles.detailDrawer}>
        <Text style={styles.detailTitle}>
          How intense are the cramps?
        </Text>

        <Text style={styles.detailDescription}>
          Optional—but useful when “cramps”
          doesn’t fully capture the situation.
        </Text>

        <View style={styles.intensityGrid}>
          {Array.from(
            { length: 10 },
            (_, index) => index + 1,
          ).map((intensity) => {
            const isIntensitySelected =
              draftSymptomDetails.Cramps
                ?.intensity === intensity;

            return (
              <Pressable
                key={intensity}
                accessibilityRole="button"
                accessibilityLabel={
                  `Cramp intensity ${intensity} out of 10`
                }
                accessibilityState={{
                  selected:
                    isIntensitySelected,
                }}
                onPress={() => {
                  setDraftSymptomDetails(
                    (currentDetails) => ({
                      ...currentDetails,
                      Cramps: {
                        ...currentDetails.Cramps,
                        intensity,
                      },
                    }),
                  );
                }}
                style={({ pressed }) => [
                  styles.intensityButton,
                  isIntensitySelected &&
                    styles.intensityButtonSelected,
                  pressed &&
                    styles.optionPressed,
                ]}>
                <Text
                  style={[
                    styles.intensityButtonText,
                    isIntensitySelected &&
                      styles.intensityButtonTextSelected,
                  ]}>
                  {intensity}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.intensityMeaning}>
          {(() => {
            const intensity =
              draftSymptomDetails.Cramps
                ?.intensity;

            if (!intensity) {
              return 'Choose 1–10 if you want to track severity.';
            }

            if (intensity <= 3) {
              return 'Noticeable, but manageable';
            }

            if (intensity <= 6) {
              return 'Interfering with my day';
            }

            if (intensity <= 8) {
              return 'Difficult to function';
            }

            return 'Unbearable or incapacitating';
          })()}
        </Text>
      </View>
    )}
  </View>
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
        onPress={() =>
  onSave(
    draftSymptoms,
    draftSymptomDetails,
  )
}
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

  symptomWrapper: {
  gap: Spacing.sm,
},

detailDrawer: {
  gap: Spacing.sm,
  marginTop: -Spacing.xs,
  padding: Spacing.md,
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.gold,
  borderRadius: 12,
  borderWidth: 1,
},

detailTitle: {
  color: Colors.text,
  fontSize: 15,
  fontWeight: '800',
},

detailDescription: {
  color: Colors.textSecondary,
  fontSize: 13,
  lineHeight: 19,
},

intensityGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: Spacing.sm,
},

intensityButton: {
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  backgroundColor: Colors.background,
  borderColor: Colors.border,
  borderRadius: 21,
  borderWidth: 1,
},

intensityButtonSelected: {
  backgroundColor: Colors.gold,
  borderColor: Colors.gold,
},

intensityButtonText: {
  color: Colors.text,
  fontSize: 15,
  fontWeight: '700',
},

intensityButtonTextSelected: {
  color: Colors.background,
},

intensityMeaning: {
  color: Colors.gold,
  fontSize: 13,
  fontWeight: '700',
},

doctorFlag: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing.sm,
  marginTop: -Spacing.xs,
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.sm,
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderRadius: 10,
  borderWidth: 1,
},

doctorFlagSelected: {
  borderColor: Colors.accent,
},

doctorFlagIcon: {
  fontSize: 16,
},

doctorFlagText: {
  flex: 1,
  color: Colors.textSecondary,
  fontSize: 13,
  fontWeight: '600',
},

doctorFlagTextSelected: {
  color: Colors.text,
},
});