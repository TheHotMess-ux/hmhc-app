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

type Props = {
  selectedNotes: string;
  onSave: (
    notes: string,
  ) => void | Promise<void>;
};

export default function NotesScreen({
  selectedNotes,
  onSave,
}: Props) {
  const [notes, setNotes] =
    useState(selectedNotes);

  useEffect(() => {
    setNotes(selectedNotes);
  }, [selectedNotes]);

  return (
    <View style={styles.container}>
      <Text style={styles.helperText}>
        Jot down anything you want to remember
        about today, especially something you
        may want to bring up at an appointment.
      </Text>

      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Anything you want to remember?"
        placeholderTextColor={
          Colors.textSecondary
        }
        multiline
        textAlignVertical="top"
        style={styles.input}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save notes"
        onPress={() => onSave(notes.trim())}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.buttonPressed,
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
    gap: Spacing.md,
  },

  helperText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  input: {
    minHeight: 160,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
  },

  saveButton: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  saveButtonText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 16,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});