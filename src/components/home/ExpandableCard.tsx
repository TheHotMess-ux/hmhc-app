import { ReactNode, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  emoji: string;
  title: string;
  summary?: string;
  children: ReactNode;
  initiallyExpanded?: boolean;
};

export default function ExpandableCard({
  emoji,
  title,
  summary,
  children,
  initiallyExpanded = false,
}: Props) {
  const [isExpanded, setIsExpanded] =
    useState(initiallyExpanded);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          expanded: isExpanded,
        }}
        accessibilityLabel={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
        onPress={() =>
          setIsExpanded((currentValue) => !currentValue)
        }
        style={({ pressed }) => [
          styles.header,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.emoji}>{emoji}</Text>

        <View style={styles.textGroup}>
          <Text style={styles.title}>{title}</Text>

          {summary && !isExpanded && (
            <Text
              style={styles.summary}
              numberOfLines={1}>
              {summary}
            </Text>
          )}
        </View>

       <Text style={styles.chevron}>
        {isExpanded ? '▲' : '▼'}
        </Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },

  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },

  pressed: {
    opacity: 0.7,
  },

  emoji: {
    fontSize: 23,
  },

  textGroup: {
    flex: 1,
    gap: 3,
  },

  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  summary: {
    color: Colors.textSecondary,
    fontSize: 13,
  },

 chevron: {
  color: Colors.gold,
  fontSize: 13,
  fontWeight: '700',
},

  content: {
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    padding: Spacing.md,
  },
});