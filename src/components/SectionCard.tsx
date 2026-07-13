import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    gap: Spacing.sm,
  },
});