import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import SectionCard from '../SectionCard';

type Props = {
  selectedMood: string | null;
  selectedSymptoms: string[];
  onMoodPress: () => void;
  onSymptomsPress: () => void;
};

export default function QuickLogCard({
  selectedMood,
  selectedSymptoms,
  onMoodPress,
  onSymptomsPress,
}: Props) {
  return (
    <SectionCard title="Quick Log">
      <View style={styles.quickLogGrid}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log today's mood"
          onPress={onMoodPress}
          style={({ pressed }) => [
            styles.quickLogButton,
            selectedMood && styles.quickLogButtonSelected,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.quickLogEmoji}>
            {selectedMood ? selectedMood.split(' ')[0] : '🙂'}
          </Text>

          <Text style={styles.quickLogLabel}>Mood</Text>

          {selectedMood && (
            <Text style={styles.quickLogValue}>
              {selectedMood}
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log today's symptoms"
          onPress={onSymptomsPress}
          style={({ pressed }) => [
            styles.quickLogButton,
            selectedSymptoms.length > 0 &&
              styles.quickLogButtonSelected,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.quickLogEmoji}>
            {selectedSymptoms.length > 0 ? '✓' : '🔥'}
          </Text>

          <Text style={styles.quickLogLabel}>Symptoms</Text>

          {selectedSymptoms.length > 0 ? (
            <Text style={styles.quickLogValue}>
              {selectedSymptoms.length}{' '}
              {selectedSymptoms.length === 1
                ? 'symptom'
                : 'symptoms'}
            </Text>
          ) : (
            <Text style={styles.comingSoon}>
              Tap to log
            </Text>
          )}
        </Pressable>

        <View style={styles.quickLogButton}>
          <Text style={styles.quickLogEmoji}>💊</Text>
          <Text style={styles.quickLogLabel}>Supplements</Text>
          <Text style={styles.comingSoon}>
            Coming soon
          </Text>
        </View>

        <View style={styles.quickLogButton}>
          <Text style={styles.quickLogEmoji}>😴</Text>
          <Text style={styles.quickLogLabel}>Sleep</Text>
          <Text style={styles.comingSoon}>
            Coming soon
          </Text>
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  quickLogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  quickLogButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },

  quickLogButtonSelected: {
    borderColor: Colors.gold,
    borderWidth: 1,
  },

  quickLogEmoji: {
    fontSize: 28,
  },

  quickLogLabel: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },

  quickLogValue: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  comingSoon: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});