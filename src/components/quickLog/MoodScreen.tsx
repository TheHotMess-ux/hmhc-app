import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

const moodOptions = [
  { emoji: '✨', label: 'Thriving' },
  { emoji: '🙂', label: 'Doing okay' },
  { emoji: '🔥', label: 'Feral' },
  { emoji: '🌪️', label: 'Emotionally weathered' },
  { emoji: '😩', label: 'Running on fumes' },
];

type Props = {
  selectedMood: string | null;
  onSelect: (mood: string) => void | Promise<void>;
};

export default function MoodScreen({
  selectedMood,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Choose the answer requiring the least emotional paperwork.
      </Text>

      <View style={styles.optionList}>
        {moodOptions.map((mood) => {
          const value = `${mood.emoji} ${mood.label}`;
          const isSelected = selectedMood === value;

          return (
            <Pressable
              key={mood.label}
              accessibilityRole="button"
              accessibilityLabel={`Log mood as ${mood.label}`}
              onPress={() => onSelect(value)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}>
              <Text style={styles.emoji}>{mood.emoji}</Text>

              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                ]}>
                {mood.label}
              </Text>

              {isSelected && (
                <Text style={styles.check}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </View>
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
    fontSize: 25,
  },

  label: {
    flex: 1,
    color: Colors.text,
    fontSize: 17,
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
});