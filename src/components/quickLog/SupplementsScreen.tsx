import { useState } from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  selectedSupplements: string[];
  onSave: (
    supplements: string[],
  ) => void | Promise<void>;
};

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
  'Other',
];

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

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        What did you take today?
      </Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.options
        }
        showsVerticalScrollIndicator={
          false
        }>
        {SUPPLEMENT_OPTIONS.map(
          (supplement) => {
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
                  pressed &&
                    styles.pressed,
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
                  <Text
                    style={
                      styles.check
                    }>
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
  <Text style={styles.saveButtonText}>
    Save Supplements
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
    color: Colors.gold,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.7,
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

});