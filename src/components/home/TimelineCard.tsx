import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DailyEntry } from '@/lib/dashboard';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import SectionCard from '../SectionCard';

type Props = {
  journalEntries: DailyEntry[];
  formatTimelineDate: (date: string) => string;
};

export default function TimelineCard({
  journalEntries,
  formatTimelineDate,
}: Props) {
  return (
    <SectionCard title="Your Timeline">
      {journalEntries.slice(0, 7).map((entry) => (
        <View
          key={entry.date}
          style={styles.timelineEntry}>
          <Text style={styles.timelineDate}>
            {formatTimelineDate(entry.date)}
          </Text>

          <Text style={styles.bodyText}>
            Mood: {entry.mood ?? 'Not logged'}
          </Text>

          <Text style={styles.bodyText}>
            Symptoms:{' '}
            {entry.symptoms.length > 0
              ? entry.symptoms.join(', ')
              : 'None logged'}
          </Text>

          <Text style={styles.bodyText}>
            Cycle Day: {entry.cycleDay}
          </Text>
        </View>
      ))}

      <Link href="/track" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View full hormone timeline"
          style={({ pressed }) => [
            styles.timelineButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.timelineButtonText}>
            View Full Timeline →
          </Text>
        </Pressable>
      </Link>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  timelineEntry: {
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  timelineDate: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  bodyText: {
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  timelineButton: {
    alignItems: 'center',
    borderColor: Colors.gold,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  timelineButtonText: {
    color: Colors.gold,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});