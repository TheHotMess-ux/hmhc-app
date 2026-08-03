import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Win = {
  id: string;
  emoji: string;
  title: string;
  completed: boolean;
};

type Props = {
  wins: Win[];
};

export default function DailyWinsCard({
  wins,
}: Props) {
  const completedWins = wins.filter(
    (win) => win.completed,
  );

  return (
    <View style={styles.container}>
      {completedWins.length > 0 ? (
        <>
          <Text style={styles.encouragement}>
            You found{' '}
            {completedWins.length}{' '}
            {completedWins.length === 1
            ? 'little victory'
            : 'little victories'} today.
          </Text>

          <View style={styles.list}>
            {completedWins.map((win) => (
              <View
                key={win.id}
                style={styles.row}>
                <Text style={styles.emoji}>
                  {win.emoji}
                </Text>

                <Text style={styles.text}>
                  {win.title}
                </Text>

                <Text style={styles.check}>
                  ✓
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.footer}>
            Small things still count. Especially on hard days.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.encouragement}>
            Little victories do not have to be big.
          </Text>

          <Text style={styles.footer}>
            Getting through the day counts too.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  encouragement: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },

  list: {
    gap: Spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  emoji: {
    fontSize: 21,
  },

  text: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },

  check: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },

  footer: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});