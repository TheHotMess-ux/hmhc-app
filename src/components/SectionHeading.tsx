import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  emoji?: string;
  title: string;
};

export default function SectionHeading({
  emoji,
  title,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.headingRow}>
        {emoji && (
          <Text style={styles.emoji}>
            {emoji}
          </Text>
        )}

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  gap: Spacing.sm,
  marginTop: Spacing.lg,
  marginBottom: Spacing.sm,
},

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  emoji: {
    fontSize: 18,
  },

  title: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

});