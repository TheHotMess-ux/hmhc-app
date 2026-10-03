import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

const CUSTOM_SUPPLEMENTS_KEY = 'hmhcCustomSupplements';

const SUPPLEMENT_OPTIONS = [
  'Magnesium',
  'Vitamin D',
  'Multivitamin',
  'Omega-3',
  'B12',
  'Iron',
  'Calcium',
  'Probiotic',
  'Creatine',
  'Collagen',
  'Ashwagandha',
];

type Props = {
  selectedSupplements: string[];
  onSave: (
    supplements: string[],
  ) => void | Promise<void>;
};

export default function SupplementsScreen({
  selectedSupplements,
  onSave,
}: Props) {
  const [
    draftSupplements,
    setDraftSupplements,
  ] = useState<string[]>(
    selectedSupplements,
  );

  const [
    customSupplements,
    setCustomSupplements,
  ] = useState<string[]>([]);

  const [
    customSupplementDraft,
    setCustomSupplementDraft,
  ] = useState('');

  const [
    customSupplementError,
    setCustomSupplementError,
  ] = useState<string | null>(null);

  useEffect(() => {
    setDraftSupplements(
      selectedSupplements,
    );
  }, [selectedSupplements]);

  useEffect(() => {
    async function loadCustomSupplements() {
      try {
        const savedCustomSupplements =
          await AsyncStorage.getItem(
            CUSTOM_SUPPLEMENTS_KEY,
          );

        if (!savedCustomSupplements) {
          return;
        }

        const parsedCustomSupplements =
          JSON.parse(
            savedCustomSupplements,
          );

        if (
          !Array.isArray(
            parsedCustomSupplements,
          )
        ) {
          return;
        }

        setCustomSupplements(
          parsedCustomSupplements.filter(
            (
              supplement,
            ): supplement is string =>
              typeof supplement ===
              'string',
          ),
        );
      } catch (error) {
        console.error(
          'Unable to load custom supplements:',
          error,
        );
      }
    }

    void loadCustomSupplements();
  }, []);

  const toggleSupplement = (
    supplement: string,
  ) => {
    setDraftSupplements(
      (currentSupplements) => {
        if (
          currentSupplements.includes(
            supplement,
          )
        ) {
          return currentSupplements.filter(
            (item) =>
              item !== supplement,
          );
        }

        return [
          ...currentSupplements,
          supplement,
        ];
      },
    );
  };

  async function addCustomSupplement() {
    const cleanedLabel =
      customSupplementDraft
        .trim()
        .replace(/\s+/g, ' ');

    if (!cleanedLabel) {
      return;
    }

    const existingLabel = [
      ...SUPPLEMENT_OPTIONS,
      ...customSupplements,
    ].find(
      (label) =>
        label.toLowerCase() ===
        cleanedLabel.toLowerCase(),
    );

    if (existingLabel) {
      setDraftSupplements(
        (currentSupplements) =>
          currentSupplements.includes(
            existingLabel,
          )
            ? currentSupplements
            : [
                ...currentSupplements,
                existingLabel,
              ],
      );

      setCustomSupplementDraft('');
      setCustomSupplementError(
        'Already on the list—we selected it for you.',
      );

      return;
    }

    const updatedCustomSupplements = [
      ...customSupplements,
      cleanedLabel,
    ];

    setCustomSupplements(
      updatedCustomSupplements,
    );

    setDraftSupplements(
      (currentSupplements) => [
        ...currentSupplements,
        cleanedLabel,
      ],
    );

    setCustomSupplementDraft('');
    setCustomSupplementError(null);

    try {
      await AsyncStorage.setItem(
        CUSTOM_SUPPLEMENTS_KEY,
        JSON.stringify(
          updatedCustomSupplements,
        ),
      );
    } catch (error) {
      console.error(
        'Unable to save custom supplement:',
        error,
      );

      setCustomSupplementError(
        'We could not save that supplement. Please try again.',
      );
    }
  }

  function renderSupplementOption(
    supplement: string,
  ) {
    const isSelected =
      draftSupplements.includes(
        supplement,
      );

    return (
      <Pressable
        key={supplement}
        onPress={() =>
          toggleSupplement(
            supplement,
          )
        }
        style={({ pressed }) => [
          styles.option,
          isSelected &&
            styles.optionSelected,
          pressed && styles.pressed,
        ]}>
        <Text
          style={[
            styles.optionText,
            isSelected &&
              styles.optionTextSelected,
          ]}>
          {supplement}
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
      <Text style={styles.subtitle}>
        What did you take today?
      </Text>

      <View style={styles.options}>
        <View style={styles.customSection}>
          <Text style={styles.sectionTitle}>
            ✍️ Add Your Own
          </Text>

          <Text
            style={
              styles.customDescription
            }>
            Taking something that is not
            listed? Add it here and we’ll
            remember it.
          </Text>

          <View
            style={styles.customInputRow}>
            <TextInput
              accessibilityLabel="Custom supplement"
              autoCapitalize="words"
              maxLength={60}
              onChangeText={(value) => {
                setCustomSupplementDraft(
                  value,
                );
                setCustomSupplementError(
                  null,
                );
              }}
              onSubmitEditing={() => {
                void addCustomSupplement();
              }}
              placeholder="Type a supplement"
              placeholderTextColor={
                Colors.textSecondary
              }
              returnKeyType="done"
              style={styles.customInput}
              value={
                customSupplementDraft
              }
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add custom supplement"
              disabled={
                customSupplementDraft.trim()
                  .length === 0
              }
              onPress={() => {
                void addCustomSupplement();
              }}
              style={({ pressed }) => [
                styles.addButton,
                customSupplementDraft.trim()
                  .length === 0 &&
                  styles.addButtonDisabled,
                pressed &&
                  styles.pressed,
              ]}>
              <Text
                style={
                  styles.addButtonText
                }>
                Add
              </Text>
            </Pressable>
          </View>

          {customSupplementError && (
            <Text
              style={styles.customError}>
              {customSupplementError}
            </Text>
          )}
        </View>

        {customSupplements.length >
          0 && (
          <View
            style={
              styles.customListSection
            }>
            <Text
              style={styles.sectionTitle}>
              ⭐ Your Supplements
            </Text>

            {customSupplements.map(
              (supplement) =>
                renderSupplementOption(
                  supplement,
                ),
            )}
          </View>
        )}

        <View style={styles.builtInList}>
          {SUPPLEMENT_OPTIONS.map(
            (supplement) =>
              renderSupplementOption(
                supplement,
              ),
          )}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save supplements"
        onPress={() => {
          void onSave(
            draftSupplements,
          );
        }}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.pressed,
        ]}>
        <Text
          style={styles.saveButtonText}>
          Done
          {draftSupplements.length > 0
            ? ` · ${draftSupplements.length} selected`
            : ''}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
  },

  scroll: {
    maxHeight: 360,
  },

  options: {
    gap: Spacing.sm,
  },

  customSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  customListSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  builtInList: {
    gap: Spacing.sm,
  },

  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
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
    backgroundColor:
      Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    color: Colors.text,
    fontSize: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },

  addButton: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
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
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    backgroundColor:
      Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
  },

  optionSelected: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },

  optionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  optionTextSelected: {
    color: Colors.text,
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
