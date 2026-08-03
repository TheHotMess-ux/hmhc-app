import { ReactNode } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ExpandableCard from './ExpandableCard';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type MoreForYouItem = {
  id: string;
  emoji: string;
  title: string;
  summary?: string;
  content: ReactNode;
};

type Props = {
  items: MoreForYouItem[];
};

export default function MoreForYouCard({
  items,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MORE FOR YOU
        </Text>

        <Text style={styles.title}>
          Little helpers, when you need them
        </Text>

        <Text style={styles.subtitle}>
          Open what feels useful today. The rest can wait.
        </Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <ExpandableCard
            key={item.id}
            emoji={item.emoji}
            title={item.title}
            summary={item.summary}>
            {item.content}
          </ExpandableCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  header: {
    gap: Spacing.xs,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  list: {
    gap: Spacing.sm,
  },
});