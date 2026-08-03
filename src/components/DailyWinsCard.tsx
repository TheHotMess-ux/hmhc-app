import { StyleSheet, Text, View } from 'react-native';

import SectionCard from '@/components/SectionCard';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  wins: {
    emoji: string;
    title: string;
    completed: boolean;
  }[];
};

export default function DailyWinsCard({
  wins,
}: Props) {
  const completed = wins.filter(
    (win) => win.completed,
  ).length;

  return (
    <SectionCard title="Today's Wins 🏆">
      <Text style={styles.subtitle}>
        {completed} of {wins.length} completed today
      </Text>

      <View style={styles.list}>
        {wins.map((win) => (
          <View
            key={win.title}
            style={styles.row}>
            <Text style={styles.emoji}>
              {win.emoji}
            </Text>

            <Text
              style={[
                styles.text,
                win.completed &&
                  styles.completedText,
              ]}>
              {win.title}
            </Text>

            <Text style={styles.check}>
              {win.completed ? '✅' : '⬜'}
            </Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  list: {
    gap: Spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 22,
    marginRight: 12,
  },

  text: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },

  completedText: {
    color: Colors.gold,
    fontWeight: '700',
  },

  check: {
    fontSize: 20,
  },
});